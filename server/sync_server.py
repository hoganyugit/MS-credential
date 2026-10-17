#!/usr/bin/env python3
"""Progress-sync service for the Cert Prep app.

A deliberately dumb, authenticated blob store: the app keeps its whole
progress object in browser localStorage and mirrors it here under a
user-chosen sync code. All merging happens client-side (assets/sync.js);
this service only keeps a revision counter so a stale device cannot
silently overwrite a newer blob (it gets 409, merges, and retries).

Storage: one JSON file per sync code in the data directory, named by the
SHA-256 of the code, so the code itself never touches disk or logs.

Endpoints (all under /sync):
  GET     /sync/health          -> {"ok": true}
  GET     /sync                 -> 404 {"rev": 0} | {"rev", "updated", "data"}
  PUT     /sync  {"rev", "data"} -> {"rev": rev+1} | 409 {"rev", "data"}
  DELETE  /sync                 -> {"ok": true}

Auth: the sync code in the X-Sync-Code header. Codes with characters an HTTP header
value cannot carry (Chinese, emoji, …) arrive as base64 UTF-8 in X-Sync-Code-B64.
Anyone with the code can read and overwrite the blob, which the app's settings page
tells the user.
"""

import argparse
import base64
import hashlib
import json
import os
import re
import tempfile
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

MAX_BODY = 5 * 1024 * 1024  # a progress blob is tens of KB; 5 MB is generous
CODE_RE = re.compile(r"^\S(?:\S| ){6,62}\S$")  # 8-64 chars, no leading/trailing space

_locks = {}
_locks_guard = threading.Lock()


def _lock_for(path):
    with _locks_guard:
        return _locks.setdefault(path, threading.Lock())


def _code_path(data_dir, code):
    digest = hashlib.sha256(code.encode("utf-8")).hexdigest()
    return os.path.join(data_dir, digest + ".json")


def _read_store(path):
    try:
        with open(path, "r", encoding="utf-8") as fh:
            obj = json.load(fh)
        if isinstance(obj, dict) and isinstance(obj.get("rev"), int):
            return obj
    except (OSError, ValueError):
        pass
    return None


def _write_store(path, obj):
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(obj, fh)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


class Handler(BaseHTTPRequestHandler):
    server_version = "mscred-sync/1.0"
    data_dir = "."

    # never log query strings or headers
    def log_request(self, code="-", size="-"):
        self.log_message('"%s %s" %s', self.command, self.path.split("?")[0], code)

    def _send(self, status, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(body)

    def _code(self):
        b64 = self.headers.get("X-Sync-Code-B64", "")
        if b64:
            try:
                code = base64.b64decode(b64.encode("ascii"), validate=True).decode("utf-8")
            except (ValueError, UnicodeDecodeError):
                return None
        else:
            code = self.headers.get("X-Sync-Code", "")
        return code if CODE_RE.match(code) else None

    def _path(self, code):
        # the hash is hex, so this cannot escape data_dir
        return _code_path(self.data_dir, code)

    def do_GET(self):
        if self.path == "/sync/health":
            return self._send(200, {"ok": True})
        if self.path != "/sync":
            return self._send(404, {"error": "not found"})
        code = self._code()
        if not code:
            return self._send(400, {"error": "missing or invalid X-Sync-Code header (8-64 characters)"})
        store = _read_store(self._path(code))
        if store is None:
            return self._send(404, {"rev": 0})
        self._send(200, store)

    def do_PUT(self):
        if self.path != "/sync":
            return self._send(404, {"error": "not found"})
        code = self._code()
        if not code:
            return self._send(400, {"error": "missing or invalid X-Sync-Code header (8-64 characters)"})
        try:
            length = int(self.headers.get("Content-Length") or 0)
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY:
            return self._send(413, {"error": f"body must be 1..{MAX_BODY} bytes"})
        try:
            body = json.loads(self.rfile.read(length))
        except ValueError:
            return self._send(400, {"error": "body is not valid JSON"})
        data = isinstance(body, dict) and body.get("data")
        rev = isinstance(body, dict) and body.get("rev")
        if not isinstance(rev, int) or rev < 0:
            return self._send(400, {"error": '"rev" must be a non-negative integer'})
        if not isinstance(data, dict) or data.get("version") != 1:
            return self._send(400, {"error": '"data" must be a Cert Prep progress object (version 1)'})
        path = self._path(code)
        with _lock_for(path):
            cur = _read_store(path)
            cur_rev = cur["rev"] if cur else 0
            if rev != cur_rev:
                return self._send(409, {"rev": cur_rev, "data": cur["data"] if cur else None})
            store = {"rev": rev + 1, "updated": time.time(), "data": data}
            try:
                _write_store(path, store)
            except OSError:
                return self._send(500, {"error": "could not write the store"})
        self._send(200, {"rev": store["rev"]})

    def do_DELETE(self):
        if self.path != "/sync":
            return self._send(404, {"error": "not found"})
        code = self._code()
        if not code:
            return self._send(400, {"error": "missing or invalid X-Sync-Code header (8-64 characters)"})
        path = self._path(code)
        with _lock_for(path):
            try:
                os.unlink(path)
            except FileNotFoundError:
                pass
            except OSError:
                return self._send(500, {"error": "could not delete the store"})
        self._send(200, {"ok": True})

    do_POST = do_PUT  # tolerate proxies/clients that only POST


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--addr", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8793)
    ap.add_argument("--data", default="/var/lib/mscred-sync")
    args = ap.parse_args()
    os.makedirs(args.data, exist_ok=True)
    Handler.data_dir = args.data
    httpd = ThreadingHTTPServer((args.addr, args.port), Handler)
    print(f"mscred-sync listening on {args.addr}:{args.port}, data in {args.data}")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
