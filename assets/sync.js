/* Cert Prep sync — mirrors the localStorage progress blob ("certprep.v1") to the sync
   service on this origin (server/sync_server.py) so progress follows you across devices.

   The server is a dumb blob store with a revision counter; all merging happens here.
   Sync is keyed by a user-chosen sync code, kept in localStorage "certprep.sync" and
   sent as a header to this same origin only (X-Sync-Code, or base64 UTF-8 in
   X-Sync-Code-B64 when the code has characters fetch headers cannot carry). Anyone
   with the code can read and overwrite the server copy — the settings page says so.

   Load order: this file must run before assets/app.js. app.js calls SYNC.boot() before
   the first route, SYNC.poke() on every save, SYNC.bye() on pagehide. */
window.SYNC = (() => {
  'use strict';
  const LS = 'certprep.sync';
  const STORE_KEY = 'certprep.v1';
  const API = window.CERTPREP_SYNC_API || '/api/sync';
  const PUSH_DELAY = 2000;
  const PULL_INTERVAL = 120e3;

  let cfg = null; // { code, rev } — rev is the server revision this device has seen
  try { cfg = JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { /* off */ }
  if (!cfg || typeof cfg.code !== 'string' || !cfg.code) cfg = null;

  let timer = 0;
  let pushing = false;
  let again = false;
  let dirty = false;
  let lastSync = 0;
  let lastError = '';
  let deferred = false; // remote data was written to localStorage; reload once the user leaves the session
  const listeners = new Set();

  const enabled = () => !!cfg;
  const state = () => ({ enabled: enabled(), rev: cfg ? cfg.rev : 0, lastSync, lastError, deferred });
  const saveCfg = () => (cfg ? localStorage.setItem(LS, JSON.stringify(cfg)) : localStorage.removeItem(LS));
  const onChange = fn => listeners.add(fn);
  const emit = () => listeners.forEach(fn => { try { fn(state()); } catch (e) { /* UI only */ } });

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); }
    catch (e) { return null; }
  }

  // ================================================================== merge
  // Deterministic, so every device converges to the same blob. Nothing with a newer
  // timestamp is ever lost; counters keep the larger value; lists union by id.

  // One question's entry: SRS fields (a/c/l/b/d/t) and the remembered shuffle order
  // follow the entry with the newer last-attempt time t; a flag sticks; a note with
  // no timestamp to arbitrate prefers the local device.
  function mergeEntry(a, b, aIsLocal) {
    const newer = (b.t || 0) > (a.t || 0) ? b : a;
    const older = newer === a ? b : a;
    const out = { ...older, ...newer };
    if (a.f || b.f) out.f = true; else delete out.f;
    const first = aIsLocal ? a : b;
    const second = aIsLocal ? b : a;
    const n = first.n !== undefined ? first.n : second.n;
    if (n !== undefined) out.n = n; else delete out.n;
    return out;
  }

  const moreAnswers = s => Object.keys((s && s.res) || {}).length;

  function pickSession(a, b) {
    if (!a) return b;
    if (!b) return a;
    const d = moreAnswers(b) - moreAnswers(a);
    return d > 0 || (d === 0 && (b.created || 0) > (a.created || 0)) ? b : a;
  }

  function pickMock(a, b) {
    if (!a) return b || null;
    if (!b) return a;
    const d = Object.keys(b.items || {}).length - Object.keys(a.items || {}).length;
    return d > 0 || (d === 0 && (b.start || 0) > (a.start || 0)) ? b : a;
  }

  function merge(local, remote) {
    if (!remote || remote.version !== 1) return local;
    if (!local || local.version !== 1) return remote;
    const out = { ...remote, ...local, settings: { ...(local.settings || {}) } }; // settings stay device-local

    const lq = local.q || {}, rq = remote.q || {};
    out.q = {};
    for (const id of new Set([...Object.keys(lq), ...Object.keys(rq)])) {
      const a = lq[id];
      const b = rq[id];
      out.q[id] = a && b ? mergeEntry(a, b, true) : a || b;
    }

    const la = local.activity || {}, ra = remote.activity || {};
    out.activity = {};
    for (const day of new Set([...Object.keys(la), ...Object.keys(ra)])) {
      const a = la[day] || {};
      const b = ra[day] || {};
      out.activity[day] = { n: Math.max(a.n || 0, b.n || 0), c: Math.max(a.c || 0, b.c || 0) };
    }

    const mocks = new Map();
    for (const m of [...(remote.mocks || []), ...(local.mocks || [])]) if (m && m.id) mocks.set(m.id, m);
    out.mocks = [...mocks.values()].sort((a, b) => (a.end || 0) - (b.end || 0));

    out.mock = pickMock(local.mock, remote.mock);

    const lsess = local.sessions || {}, rsess = remote.sessions || {};
    out.sessions = {};
    for (const key of new Set([...Object.keys(lsess), ...Object.keys(rsess)])) {
      out.sessions[key] = pickSession(lsess[key], rsess[key]);
    }

    // study plan: keep the local plan per exam, filling gaps from the other device
    out.plan = { ...(remote.plan || {}) };
    for (const [code, p] of Object.entries(local.plan || {})) {
      const r = out.plan[code] || {};
      out.plan[code] = { date: p.date || r.date || '', goal: p.goal || r.goal || 0 };
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

  async function api(method, body) {
    const res = await fetch(API, {
      method,
      headers: { ...codeHeaders(cfg.code), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10e3),
    });
    if (res.status === 404 && method === 'GET') return { rev: 0 };
    const text = await res.text();
    let obj = null;
    try { obj = JSON.parse(text); } catch (e) { /* not JSON */ }
    if (!res.ok) throw new HttpError(res.status, (obj && obj.error) || text.slice(0, 120) || `HTTP ${res.status}`);
    return obj || {};
  }

  // Returns true when localStorage changed under us.
  async function pull() {
    const remote = await api('GET');
    lastSync = Date.now();
    if (!remote.rev) {
      if (cfg.rev) { cfg.rev = 0; saveCfg(); }
      return false;
    }
    if (remote.rev === cfg.rev) return false;
    const local = readStore();
    const merged = merge(local, remote.data);
    const changed = JSON.stringify(merged) !== JSON.stringify(local);
    cfg.rev = remote.rev;
    saveCfg();
    if (changed) localStorage.setItem(STORE_KEY, JSON.stringify(merged));
    return changed;
  }

  async function push() {
    for (let attempt = 0; ; attempt += 1) {
      const data = readStore();
      if (!data) { dirty = false; return; }
      try {
        const r = await api('PUT', { rev: cfg.rev, data });
        cfg.rev = r.rev;
        saveCfg();
        dirty = false;
        lastSync = Date.now();
        lastError = '';
        return;
      } catch (e) {
        // Another device pushed first: merge its blob into ours, then retry our push.
        if (e instanceof HttpError && e.status === 409 && attempt < 3) {
          if (await pull()) applyOrDefer();
          continue;
        }
        throw e;
      }
    }
  }

  const inActiveSession = () => /^#\/(s|mock)(\/|$)/.test(location.hash);

  function applyOrDefer() {
    if (deferred) return;
    if (inActiveSession()) {
      deferred = true;
      emit();
      if (window.CERTPREP_SYNCNOTE) window.CERTPREP_SYNCNOTE();
      return;
    }
    location.reload();
  }

  addEventListener('hashchange', () => {
    if (deferred && !inActiveSession()) location.reload();
  });

  async function runPush() {
    if (pushing) { again = true; return; }
    pushing = true;
    try {
      await push();
      emit();
    } catch (e) {
      lastError = e instanceof HttpError ? e.message : 'server unreachable — will retry on the next change';
      emit();
    } finally {
      pushing = false;
      if (again) { again = false; runPush(); }
    }
  }

  // ================================================================== interface used by app.js

  // Called on every local save: push shortly after, coalescing bursts of edits.
  function poke() {
    if (!enabled()) return;
    dirty = true;
    clearTimeout(timer);
    timer = setTimeout(runPush, PUSH_DELAY);
  }

  // Best-effort final push when the tab closes, before the 2s debounce fires.
  function bye() {
    if (!enabled() || !dirty) return;
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw || raw.length > 60e3) return; // fetch keepalive body cap; the debounce covers the rest
    clearTimeout(timer);
    try {
      fetch(API, {
        method: 'PUT',
        keepalive: true,
        headers: { ...codeHeaders(cfg.code), 'Content-Type': 'application/json' },
        body: JSON.stringify({ rev: cfg.rev, data: JSON.parse(raw) }),
      });
    } catch (e) { /* tab is going away */ }
  }

  // First pull before the app routes. When the merge changed storage we reload and
  // never resolve, so the app boots straight into the merged data.
  async function boot() {
    if (!enabled()) return;
    try {
      if (await pull()) {
        location.reload();
        return new Promise(() => {});
      }
      lastError = '';
    } catch (e) {
      lastError = 'offline — progress stays local until the server is reachable';
    }
    emit();
  }

  // Manual sync from the settings page.
  async function syncNow() {
    if (!enabled()) return;
    if (await pull()) applyOrDefer();
    await runPush();
  }

  // Join a sync code: adopt the server blob if there is one (merged with local),
  // then push the result. Returns true when the caller should reload to show merged data.
  async function enable(code) {
    code = (code || '').trim();
    if ([...code].length < 8) throw new Error('The sync code needs at least 8 characters.');
    cfg = { code, rev: 0 };
    let remote;
    try {
      remote = await api('GET');
    } catch (e) {
      cfg = null; // never half-enabled: nothing was saved
      throw e;
    }
    if (remote.rev) {
      const local = readStore();
      const merged = merge(local, remote.data);
      const changed = JSON.stringify(merged) !== JSON.stringify(local);
      cfg.rev = remote.rev;
      saveCfg();
      localStorage.setItem(STORE_KEY, JSON.stringify(merged));
      await push();
      return changed;
    }
    saveCfg();
    await push();
    return false;
  }

  // Detach this browser. The server copy stays unless wipe is asked for.
  async function disable(wipe) {
    const code = cfg && cfg.code;
    cfg = null;
    saveCfg();
    clearTimeout(timer);
    if (wipe && code) {
      try {
        await fetch(API, { method: 'DELETE', headers: codeHeaders(code), signal: AbortSignal.timeout(10e3) });
      } catch (e) { /* already detached */ }
    }
    emit();
  }

  document.addEventListener('visibilitychange', () => {
    if (!enabled() || document.visibilityState !== 'visible') return;
    pull().then(changed => { if (changed) applyOrDefer(); emit(); }).catch(() => {});
  });
  setInterval(() => {
    if (!enabled() || document.visibilityState !== 'visible') return;
    pull().then(changed => { if (changed) applyOrDefer(); emit(); }).catch(() => {});
  }, PULL_INTERVAL);

  return { enabled, state, onChange, boot, poke, bye, syncNow, enable, disable, merge };
})();
