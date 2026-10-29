#!/usr/bin/env python3
"""Refresh only the discussion comments in data/bank.js from ExamTopics.

A light companion to examtopics.py: it leaves question text, choices, reviewed answers, votes,
cases and images exactly as they are, and only re-downloads each question's discussion thread
and replaces its "comments" list with the current one from the site. Use it to pull the latest
community comments without re-parsing (and risking changes to) the whole bank.

    python3 tools/sync_comments.py                 # fetch every thread, rewrite data/bank.js
    python3 tools/sync_comments.py --cache .cache  # keep raw thread HTML: re-runs resume
    python3 tools/sync_comments.py --limit 5       # only the first 5 threads (a quick test)

Parsing is done by examtopics.py's parse_comments(), so comments come out identical to a full
build (sorted most-upvoted first, with replies nested, "Selected Answer" picks and vote counts).
The login Cookie and exam list are read from EXAM_SOURCES.md, same as the full scraper. If the
cookie has expired the run stops cleanly; paste a fresh one and re-run with the same --cache.
"""

import argparse
import json
import pathlib
import re
import sys
import tempfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import examtopics as et  # reuse Fetcher, parse_comments, read_sources and the delays/URLs


def load_bank(path):
    text = path.read_text()
    return text[text.index("{"):text.rindex("}") + 1]


def thread_hash(url):
    m = re.search(r"/comments/([0-9a-f]+)/?", url or "")
    return m.group(1) if m else None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sources", type=pathlib.Path, default=et.ROOT / "EXAM_SOURCES.md")
    ap.add_argument("--bank", type=pathlib.Path, default=et.ROOT / "data" / "bank.js")
    ap.add_argument("--cache", type=pathlib.Path, help="directory for raw thread HTML (default: temporary)")
    ap.add_argument("--limit", type=int, help="only sync the first N threads (for a quick test)")
    args = ap.parse_args()

    cookie, _ = et.read_sources(args.sources)
    bank = json.loads(load_bank(args.bank))

    # Every (question -> thread hash) across all exams, the copies folded into a question included; dedupe
    # threads so a shared one is fetched once.
    items = [(x, thread_hash(x.get("thread"))) for e in bank["exams"] for q in e["questions"] for x in [q, *q.get("copies", [])]]
    with_thread = [(q, h) for q, h in items if h]
    hashes = list(dict.fromkeys(h for _, h in with_thread))
    if args.limit:
        hashes = hashes[:args.limit]
        keep = set(hashes)
        with_thread = [(q, h) for q, h in with_thread if h in keep]
    et.log(f"{len(items)} questions, {len(with_thread)} with a thread, {len(hashes)} unique threads to fetch")

    with tempfile.TemporaryDirectory() as tmp:
        cache = args.cache or pathlib.Path(tmp)
        fetcher = et.Fetcher(cookie)
        parsed, before, after = {}, 0, 0
        for i, h in enumerate(hashes, 1):
            try:
                text = fetcher.page(f"{et.SITE}/comments/{h}/", cache / "comments" / f"{h}.html",
                                    et.COMMENT_DELAY, referer=et.SITE + "/")
            except SystemExit as err:
                # A question nobody has discussed has no thread page; keep its comments as they are.
                if not str(err).startswith("HTTP 404"):
                    raise
                et.log(f"  {err}: no discussion yet, skipped")
                continue
            parsed[h] = et.parse_comments(text)
            if i % 10 == 0 or i == len(hashes):
                et.log(f"  threads {i}/{len(hashes)}")

        changed, newest = 0, ""
        for q, h in with_thread:
            if h not in parsed:
                continue
            before += len(q.get("comments") or [])
            new = parsed[h]
            if new != (q.get("comments") or []):
                changed += 1
            q["comments"] = new
            after += len(new)
            for c in new:
                newest = max(newest, c.get("date", ""))

    et.write_bank(args.bank, bank)
    et.log(f"updated {len(hashes)} threads, {changed} questions' comments changed; "
           f"top-level comments {before} -> {after}; newest comment date now {newest or 'n/a'}")


if __name__ == "__main__":
    main()
