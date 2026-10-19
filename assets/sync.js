/* Cert Prep sync — mirrors the progress blob ("certprep.v1") to the sync service on this
   origin (server/sync_server.py) so progress follows you across devices.

   The server is a dumb blob store with a revision counter; all merging happens here.
   Sync is keyed by a user-chosen sync code, kept in localStorage "certprep.sync" and
   sent as a header to this same origin only (X-Sync-Code, or base64 UTF-8 in
   X-Sync-Code-B64 when the code has characters fetch headers cannot carry). Anyone
   with the code can read and overwrite the server copy — the settings page says so.

   app.js owns the progress. SYNC.attach() gives this file a way to read the live object
   and to hand it merged data, which app.js takes over in place; nothing here writes
   "certprep.v1", so a stale copy in memory can never overwrite a merge. Every pull
   reconciles both ways: the server copy is merged in, and when the result holds anything
   the server lacks it is pushed back — two devices on one revision hold the same progress.

   Load order: this file must run before assets/app.js. app.js calls SYNC.attach() and
   SYNC.boot() before the first route and SYNC.poke() on every save. */
window.SYNC = (() => {
  'use strict';
  const LS = 'certprep.sync';
  const API = window.CERTPREP_SYNC_API || '/api/sync';
  const PUSH_DELAY = 2000;
  const PULL_INTERVAL = 120e3;
  const KEEPALIVE_MAX = 60e3; // fetch keepalive bodies are capped at 64 KB

  let cfg = null; // { code, rev } — rev is the server revision this device has merged
  try { cfg = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { /* off */ }
  if (!cfg || typeof cfg.code !== 'string' || !cfg.code) cfg = null;

  let host = null; // { read, apply, examOf } from app.js
  let timer = 0;
  let dirty = false; // local edits the server has not acknowledged
  let edits = 0; // counts pokes, so an edit made while a push is in flight keeps dirty set
  let lastSync = 0;
  let lastError = '';
  const listeners = new Set();

  const enabled = () => !!cfg && !!host;
  const state = () => ({ enabled: enabled(), rev: cfg ? cfg.rev : 0, lastSync, lastError, pending: dirty });
  const saveCfg = () => (cfg ? localStorage.setItem(LS, JSON.stringify(cfg)) : localStorage.removeItem(LS));
  const onChange = fn => listeners.add(fn);
  const emit = () => listeners.forEach(fn => { try { fn(state()); } catch (e) { /* UI only */ } });
  const keys = (a, b) => new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);

  // ================================================================== merge
  // A join — commutative, associative, idempotent — so devices that have seen the same edits
  // hold the same data whatever order they synced in. Each piece of progress is a register
  // with its own clock and the newer write wins; equal clocks with different contents are
  // settled by a canonical comparison, so every device picks the same side. Day counters keep
  // the larger value, maps union by key, and deletions travel as timestamps in "gone".
  // Settings stay device-local.

  // Deep equality of JSON-like values; members set to undefined count as absent.
  function same(a, b) {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) return a.length === b.length && a.every((v, i) => same(v, b[i]));
    const ka = Object.keys(a).filter(k => a[k] !== undefined);
    return ka.length === Object.keys(b).filter(k => b[k] !== undefined).length && ka.every(k => same(a[k], b[k]));
  }
  const sameData = (a, b) => same({ ...a, settings: undefined }, { ...b, settings: undefined });

  // Serialization with sorted keys, used only to break ties the same way on every device.
  function canon(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
    if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
    return `{${Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`;
  }

  // The side with the newer clock. On a tie, the side holding more (so a register never written
  // loses, as in data saved before the clocks existed), then the larger canonical form.
  function newer(a, b, ca, cb) {
    if (ca !== cb) return ca > cb ? a : b;
    if (same(a, b)) return a;
    const na = size(a), nb = size(b);
    if (na !== nb) return na > nb ? a : b;
    return canon(a) >= canon(b) ? a : b;
  }
  const size = v => (v && typeof v === 'object' ? Object.keys(v).filter(k => v[k] !== undefined).length : 0);
  const either = (a, b) => (a === undefined ? b : b === undefined ? a : newer(a, b, 0, 0));

  // A question's progress is three registers: the attempt record (a c l b d, clock t), the
  // flag (f, clock ft) and the note (n, clock nt). An exam reset empties those older than it.
  const REGISTERS = [['t', ['a', 'c', 'l', 'b', 'd', 't']], ['ft', ['f', 'ft']], ['nt', ['n', 'nt']]];
  function register(e, fields) {
    const out = {};
    for (const f of fields) if (e && e[f] !== undefined && e[f] !== false && e[f] !== '') out[f] = e[f];
    return out;
  }
  function mergeQuestion(a, b, reset) {
    const out = {};
    for (const [clock, fields] of REGISTERS) {
      const ra = register(a, fields);
      const rb = register(b, fields);
      const r = newer(ra, rb, ra[clock] || 0, rb[clock] || 0);
      if (!reset || (r[clock] || 0) > reset) Object.assign(out, r);
    }
    return Object.keys(out).length ? out : null;
  }

  // A practice session (one per key) or the unfinished mock exam. Different runs: the one
  // started last wins, as starting one replaces the one before. Two copies of the same run
  // merge entry by entry, each answer following its own clock u, while the position and the
  // rest follow the run's clock, its last use.
  function mergeRun(a, b, sameRun, started, clock, list) {
    if (!a || !b) return a || b || null;
    if (!sameRun(a, b)) return newer(a, b, started(a), started(b));
    const ta = clock(a), tb = clock(b);
    // copies with equal clocks (saved before runs had them): the one further along
    const sa = { ...a, [list]: undefined };
    const top = ta !== tb ? (ta > tb ? a : b) : newer(sa, { ...b, [list]: undefined }, a.i || 0, b.i || 0) === sa ? a : b;
    const ea = a[list] || {};
    const eb = b[list] || {};
    const entries = {};
    for (const id of keys(ea, eb)) entries[id] = ea[id] && eb[id] ? newer(ea[id], eb[id], ea[id].u || 0, eb[id].u || 0) : ea[id] || eb[id];
    const out = { ...top, [list]: entries };
    return same(out, a) ? a : same(out, b) ? b : out;
  }
  const sessionClock = s => s.u || s.created || 0;
  const mockClock = m => m.u || m.start || 0;
  const resultClock = m => m.u || m.end || 0;

  const KNOWN = new Set(['version', 'settings', 'epoch', 'gone', 'q', 'activity', 'sessions', 'mocks', 'mock', 'plan']);

  // examOf(questionId) → exam code, for exam resets. join: turning sync on — merge whatever
  // is there and take the server's epoch instead of letting either side replace the other.
  function merge(local, remote, { join = false, examOf = null } = {}) {
    if (!remote || remote.version !== 1) return local;
    if (!local || local.version !== 1) return remote;
    // Resetting everything or importing a file starts a new epoch, which replaces older ones outright.
    const le = local.epoch || 0;
    const re = remote.epoch || 0;
    if (le !== re && !join) {
      const winner = le > re ? local : remote;
      return merge({ ...winner, settings: local.settings }, winner, { examOf });
    }

    const out = { version: 1, settings: local.settings };
    for (const k of keys(local, remote)) if (!KNOWN.has(k)) out[k] = either(local[k], remote[k]); // from a newer version
    if (join ? re : le) out.epoch = join ? re : le;

    // When a deletion removes a session or the mock exam, every run started before it under the
    // same key goes too ("session:KEY" / "mock" → start time), so an older one cannot resurface
    // from a device that missed the change.
    const lg = local.gone || {}, rg = remote.gone || {};
    const gone = (out.gone = {});
    for (const k of keys(lg, rg)) gone[k] = Math.max(lg[k] || 0, rg[k] || 0);
    const resetOf = code => gone['exam:' + code] || 0;
    const wiped = (code, t) => resetOf(code) > 0 && t <= resetOf(code); // from before an exam reset
    const retire = (mark, t) => { gone[mark] = Math.max(gone[mark] || 0, t); };

    const lq = local.q || {}, rq = remote.q || {};
    out.q = {};
    for (const id of keys(lq, rq)) {
      const code = examOf && examOf(id);
      const e = mergeQuestion(lq[id], rq[id], code ? resetOf(code) : 0);
      if (e) out.q[id] = e;
    }

    const la = local.activity || {}, ra = remote.activity || {};
    out.activity = {};
    for (const day of keys(la, ra)) {
      const a = la[day] || {};
      const b = ra[day] || {};
      out.activity[day] = { n: Math.max(a.n || 0, b.n || 0), c: Math.max(a.c || 0, b.c || 0) };
    }

    const ls = local.sessions || {}, rs = remote.sessions || {};
    out.sessions = {};
    for (const key of keys(ls, rs)) {
      const s = mergeRun(ls[key], rs[key], (a, b) => a.created === b.created, r => r.created || 0, sessionClock, 'res');
      const mark = 'session:' + key;
      if (gone[mark] >= (s.created || 0) || wiped(s.code, s.created || 0)) retire(mark, s.created || 0);
      else out.sessions[key] = s;
    }

    const results = new Map();
    for (const m of [...(local.mocks || []), ...(remote.mocks || [])]) {
      if (!m || !m.id) continue;
      const o = results.get(m.id);
      results.set(m.id, o ? newer(o, m, resultClock(o), resultClock(m)) : m);
    }
    out.mocks = [...results.values()]
      .filter(m => !gone['mock:' + m.id] && !wiped(m.code, m.end || 0))
      .sort((a, b) => (a.end || 0) - (b.end || 0) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

    const m = mergeRun(local.mock, remote.mock, (a, b) => a.id === b.id, r => r.start || 0, mockClock, 'items');
    if (m && (gone.mock >= (m.start || 0) || results.has(m.id) || gone['mock:' + m.id] || wiped(m.code, m.start || 0))) {
      retire('mock', m.start || 0); // finished, deleted or reset
      out.mock = null;
    } else {
      out.mock = m;
    }

    const lp = local.plan || {}, rp = remote.plan || {};
    out.plan = {};
    for (const code of keys(lp, rp)) {
      const a = lp[code];
      const b = rp[code];
      const p = a && b ? newer(a, b, a.u || 0, b.u || 0) : a || b;
      if (!wiped(code, p.u || 0)) out.plan[code] = p;
    }
    return out;
  }

  // ================================================================== wire

  class HttpError extends Error {
    constructor(status, message) { super(message || `HTTP ${status}`); this.status = status; }
  }

  // fetch header values are byte strings: a code with characters above U+00FF (Chinese,
  // emoji, …) makes fetch throw before anything is sent. Such codes travel as
  // base64 UTF-8 in X-Sync-Code-B64 instead; plain codes keep the legacy header.
  const codeHeaders = code => /[^\x00-\xff]/.test(code)
    ? { 'X-Sync-Code-B64': btoa(String.fromCharCode(...new TextEncoder().encode(code))) }
    : { 'X-Sync-Code': code };

  // keepalive lets a push sent as the page goes to the background outlive it.
  async function api(method, body, keepalive) {
    const json = body ? JSON.stringify(body) : undefined;
    const res = await fetch(API, {
      method,
      headers: { ...codeHeaders(cfg.code), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: json,
      keepalive: !!keepalive && json.length < KEEPALIVE_MAX,
      signal: AbortSignal.timeout(10e3),
    });
    const text = await res.text();
    let obj = null;
    try { obj = JSON.parse(text); } catch (e) { /* not JSON */ }
    // The service answers "no copy yet" with 404 {"rev": 0}; any other 404 is a wrong address.
    if (res.status === 404 && method === 'GET' && obj && obj.rev === 0) return { rev: 0 };
    if (!res.ok) throw new HttpError(res.status, (obj && obj.error) || text.slice(0, 120) || `HTTP ${res.status}`);
    return obj || {};
  }

  // Merges the server copy into this device's progress. Returns true when the result holds
  // something the server lacks, i.e. a push is needed to bring the server level.
  async function pull() {
    const remote = await api('GET');
    if (!cfg) return false;
    lastSync = Date.now();
    if (!remote.rev) {
      // The copy was deleted (Settings → Delete server copy): it is re-created by the next edit.
      if (cfg.rev) { cfg.rev = 0; saveCfg(); }
      return false;
    }
    const local = host.read();
    const merged = merge(local, remote.data, { examOf: host.examOf });
    const behind = !sameData(merged, remote.data);
    cfg.rev = remote.rev;
    saveCfg();
    if (!sameData(merged, local)) host.apply(merged);
    return behind;
  }

  async function push(keepalive) {
    for (let attempt = 0; ; attempt += 1) {
      const sent = edits;
      try {
        const r = await api('PUT', { rev: cfg.rev, data: host.read() }, keepalive);
        if (!cfg) return;
        cfg.rev = r.rev;
        saveCfg();
        if (edits === sent) dirty = false;
        lastSync = Date.now();
        return;
      } catch (e) {
        // Another device pushed first: merge its copy into ours, then push the result.
        if (e instanceof HttpError && e.status === 409 && attempt < 3) {
          await pull();
          if (!cfg) return;
          continue;
        }
        throw e;
      }
    }
  }

  // One conversation with the server at a time, in order.
  let queue = Promise.resolve();
  function serial(fn) {
    const p = queue.then(fn);
    queue = p.catch(() => {});
    return p;
  }

  // A sync pass: pull when asked, then push when this device has edits the server lacks.
  // Requests made while a pass is still waiting to start join it.
  let waiting = null;
  function schedule({ pull: wantPull = false, keepalive = false } = {}) {
    if (waiting) {
      waiting.pull = waiting.pull || wantPull;
      waiting.keepalive = waiting.keepalive || keepalive;
      return waiting.done;
    }
    const job = { pull: wantPull, keepalive };
    waiting = job;
    job.done = serial(async () => {
      waiting = null;
      if (!enabled()) return;
      try {
        const behind = job.pull ? await pull() : false;
        if (cfg && (dirty || behind)) await push(job.keepalive);
        lastError = '';
      } catch (e) {
        lastError = e instanceof HttpError ? e.message : 'server unreachable — progress is kept here and syncs when it is back';
      }
      emit();
    });
    return job.done;
  }

  // ================================================================== interface used by app.js

  // read() → the live progress object; apply(merged) → take merged progress over;
  // examOf(questionId) → its exam code.
  function attach(h) { host = h; }

  // Called on every local save: push shortly after, coalescing bursts of edits.
  function poke() {
    if (!enabled()) return;
    edits += 1;
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(() => schedule(), PUSH_DELAY);
  }

  // The page is going to the background or away: push now, not after a debounce that a
  // suspended or discarded tab would never reach.
  function hidden() {
    if (!enabled() || !dirty) return;
    clearTimeout(timer);
    schedule({ keepalive: true });
  }

  // First pull before the app routes; resolves once it is merged in or has failed.
  const boot = () => (enabled() ? schedule({ pull: true }) : Promise.resolve());

  // Manual sync from the settings page.
  async function syncNow() {
    if (!enabled()) return;
    await schedule({ pull: true });
    if (lastError) throw new Error(lastError);
  }

  // Join a sync code: merge with the server copy if there is one, then push the result.
  // Resolves to true when progress from the server was merged in.
  function enable(code) {
    code = (code || '').trim();
    if ([...code].length < 8) return Promise.reject(new Error('The sync code needs at least 8 characters.'));
    return serial(async () => {
      cfg = { code, rev: 0 };
      let remote;
      try {
        remote = await api('GET');
      } catch (e) {
        cfg = null; // never half-enabled: nothing was saved
        throw e;
      }
      let merged = false;
      if (remote.rev) {
        const local = host.read();
        const next = merge(local, remote.data, { join: true, examOf: host.examOf });
        cfg.rev = remote.rev;
        merged = !sameData(next, local);
        if (merged) host.apply(next);
      }
      saveCfg();
      dirty = true;
      await push();
      lastError = '';
      emit();
      return merged;
    });
  }

  // Detach this browser. The server copy stays unless wipe is asked for.
  function disable(wipe) {
    const code = cfg && cfg.code;
    cfg = null;
    saveCfg();
    clearTimeout(timer);
    dirty = false;
    emit();
    if (!wipe || !code) return Promise.resolve();
    // queued behind any pass still running, so a late push cannot re-create the copy
    return serial(() => fetch(API, { method: 'DELETE', headers: codeHeaders(code), signal: AbortSignal.timeout(10e3) }).catch(() => {}));
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') hidden();
    else if (enabled()) schedule({ pull: true });
  });
  addEventListener('pagehide', hidden);
  addEventListener('online', () => { if (enabled()) schedule({ pull: true }); });
  setInterval(() => {
    if (enabled() && document.visibilityState === 'visible') schedule({ pull: true });
  }, PULL_INTERVAL);

  return { attach, enabled, state, onChange, boot, poke, syncNow, enable, disable, merge };
})();
