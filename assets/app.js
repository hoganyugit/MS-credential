/* Cert Prep — offline study app for the ExamTopics question bank in data/bank.js.
   Progress lives in this browser's localStorage ("certprep.v1"); Settings can export/import it. */
(() => {
  'use strict';

  // ================================================================== helpers

  const $ = (sel, root = document) => root.querySelector(sel);
  const DAY = 864e5;

  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v; // only ever bank HTML, sanitized by tools/examtopics.py
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid instanceof Node ? kid : String(kid));
    }
    return el;
  }

  function svgEl(tag, attrs, text) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs || {})) if (v != null) el.setAttribute(k, v);
    if (text != null) el.textContent = text;
    return el;
  }

  const ICONS = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18"/>',
    up: '<path d="M12 5l7 8h-4v6H9v-6H5z"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    repeat: '<path d="M4 12a8 8 0 0 1 13.7-5.7L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.7L4 16M4 20v-4h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    book: '<path d="M4 19V5a2 2 0 0 1 2-2h14v14H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14M8 7h8"/>',
    alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 10l5-5 5 5M5 20h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    grip: '<path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" stroke-width="3.2"/>',
    chevUp: '<path d="M6 15l6-6 6 6"/>',
    chevDown: '<path d="M6 9l6 6 6-6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
    pointer: '<path d="M6 3l12 9-5 1 3 6-2.5 1-3-6L6 18z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    guide: '<path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2z"/><path d="M12 6.5v13"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  };

  function icon(name) {
    const s = svgEl('svg', {
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'icon', 'aria-hidden': 'true',
    });
    s.innerHTML = ICONS[name] || '';
    return s;
  }

  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const parseDay = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const fmtDay = d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const fmtClock = ms => {
    const s = Math.ceil(ms / 1000);
    const hh = Math.floor(s / 3600);
    return `${hh ? hh + ':' : ''}${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  };
  const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
  const sortLetters = s => [...(s || '')].sort().join('');
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // replaceChildren() would print null/false as text
  const put = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter(k => k != null && k !== false));

  // ================================================================== bank

  const BANK = window.BANK;
  const EXAMS = (BANK && BANK.exams) || [];
  // data/extra.js: supplementary questions written in the official style for objectives the ExamTopics bank
  // does not cover. They join their exam here, flagged q.extra, with their answer areas and reviewed entries.
  const EXTRA = window.EXTRA || {};
  for (const ex of EXTRA.exams || []) {
    const exam = EXAMS.find(e => e.code === ex.code);
    if (!exam) continue;
    for (const q of ex.questions) {
      q.extra = true;
      exam.questions.push(q);
    }
    exam.cases = Object.assign(exam.cases || {}, ex.cases || {});
  }
  window.AREAS = Object.assign(window.AREAS || {}, EXTRA.areas || {});
  window.REVIEWED = Object.assign(window.REVIEWED || {}, EXTRA.reviewed || {});
  const QUESTIONS = new Map();
  for (const exam of EXAMS) {
    exam.slug = exam.code.toLowerCase();
    exam.topicName = Object.fromEntries(exam.topics.map(t => [t.n, t.name]));
    for (const q of exam.questions) {
      q.exam = exam;
      q.votes = q.votes || [];
      q.comments = q.comments || [];
      QUESTIONS.set(q.id, q);
    }
  }
  const examBySlug = slug => EXAMS.find(e => e.slug === slug);
  const topicLabel = (exam, n) => (exam.topicName[n] && exam.topicName[n] !== `Topic ${n}` ? `${n}. ${exam.topicName[n]}` : `Topic ${n}`);
  const multiTopic = exam => exam.topics.length > 1;
  const examByCode = code => EXAMS.find(e => e.code === code);

  // data/tags.js adds skill areas to an exam whose source has no topics; data/bank.js links each question to
  // its variants (the same question listed again with reshuffled, partly different choices).
  const TAGS = window.TAGS || {};
  for (const exam of EXAMS) {
    const t = TAGS[exam.code];
    if (t && t.areas && t.tags && !multiTopic(exam)) {
      exam.topics = t.areas.map(a => ({ n: a.n, name: a.name }));
      exam.topicName = Object.fromEntries(exam.topics.map(x => [x.n, x.name]));
      exam.tagged = true;
      for (const q of exam.questions) q.topic = t.tags[q.id] || (q.extra ? q.topic : 0) || 0;
    }
    const byN = new Map(exam.questions.map(q => [q.n, q]));
    for (const q of exam.questions) q.siblings = (q.variants || []).map(n => byN.get(n)).filter(Boolean);
  }

  // data/reviewed.js: every question re-judged against Microsoft product behaviour, with an explanation and a
  // knowledge-point tag. Attached as q.review; the knowledge points become per-exam groups.
  const REVIEWED = window.REVIEWED || {};
  for (const exam of EXAMS) {
    const kps = new Map();
    for (const q of exam.questions) {
      const r = REVIEWED[q.id];
      if (!r) continue;
      const ok = q.choices.length
        ? typeof r.answer === 'string' && /^[A-Z]+$/.test(r.answer) && [...r.answer].every(l => q.choices.some(c => c.k === l))
        : Array.isArray(r.boxes);
      if (!ok) continue;
      q.review = r;
      q.kp = r.kp || '';
      if (q.kp) kps.set(q.kp, (kps.get(q.kp) || 0) + 1);
    }
    exam.kps = [...kps.keys()].sort((a, b) => kps.get(b) - kps.get(a));
  }

  // data/skills.js: the official "skills measured" outline of each exam (functional groups with their weight,
  // sub-areas, objective bullets) and the map from question ID to the objectives it tests. Attached as
  // exam.skills / q.sk; exam.objective resolves an id ("B", "B1", "B1.2") to its outline entry.
  const SKILLS = window.SKILLS || { exams: {}, map: {} };
  for (const exam of EXAMS) {
    exam.skills = SKILLS.exams[exam.code] || null;
    exam.objective = new Map();
    for (const g of (exam.skills || { groups: [] }).groups) {
      exam.objective.set(g.id, { group: g });
      for (const a of g.areas) {
        exam.objective.set(a.id, { group: g, area: a });
        for (const b of a.bullets) exam.objective.set(b.id, { group: g, area: a, bullet: b });
      }
    }
    for (const q of exam.questions) {
      const ids = SKILLS.map[q.id] || (q.review && q.review.sk) || [];
      q.sk = ids.filter(id => exam.objective.has(id));
    }
  }
  // "A" matches every objective of group A, "A1" every bullet of sub-area A1, "A1.3" only itself.
  const inScope = (id, scope) => id === scope || (scope.length === 1 ? id[0] === scope : id.startsWith(scope + '.'));
  const skillQuestions = (exam, scope) => exam.questions.filter(q => q.sk.some(id => inScope(id, scope)));
  function skillTitle(exam, scope) {
    const o = exam.objective.get(scope);
    if (!o) return scope;
    const node = o.bullet || o.area || o.group;
    return `${node.id} ${o.bullet ? node.text : node.title}`;
  }

  const TYPE_LABEL = {
    single: 'Single choice', multi: 'Multiple choice', yesno: 'Yes / No', dragdrop: 'Drag & drop',
    hotspot: 'Hotspot', image: 'Exhibit', simulation: 'Simulation',
  };
  // Drag & drop / hotspot questions without a transcribed answer area are answered from the image and self-graded.
  const selfGraded = q => !q.choices.length && !interactive(q);
  const TYPE_GROUP = { choice: 'Multiple choice', interactive: 'Drag & drop and hotspot', self: 'Graded by you' };
  const countComments = list => list.reduce((n, c) => n + 1 + countComments(c.replies || []), 0);

  const tpl = document.createElement('template');
  function plain(html) {
    tpl.innerHTML = html.replace(/<br>|<\/(?:p|h\d|div|li|td|th)>/g, ' $&');
    return tpl.content.textContent.replace(/\s+/g, ' ').trim();
  }
  const stemText = q => (q._stem = q._stem || plain(q.stem));
  function searchText(q, deep) {
    if (!q._text) {
      q._text = [stemText(q), ...q.choices.map(c => plain(c.html)), q.area ? areaText(q.area) : '', q.case ? q.exam.cases[q.case].name : '']
        .join(' ').toLowerCase();
    }
    if (!deep) return q._text;
    if (q._deep == null) {
      const walk = list => list.flatMap(c => [c.text, ...walk(c.replies || [])]);
      q._deep = walk(q.comments).join(' ').toLowerCase();
    }
    return q._text + ' ' + q._deep;
  }

  // ================================================================== interactive answer areas: data
  //
  // On ExamTopics, drag & drop and hotspot questions are screenshots. data/areas.js re-creates them as real
  // questions (tiles to drag into boxes, steps to put in order, drop-down menus, Yes/No grids), transcribed
  // from the question and answer images and keyed by question ID. Stem images it covers are replaced in place.

  const AREA_KINDS = ['match', 'order', 'select', 'yesno'];

  function prepareArea(q, raw) {
    const a = JSON.parse(JSON.stringify(raw));
    a.slots = [];
    if (a.kind === 'order' && Array.isArray(a.answer)) {
      const alt = Array.isArray(a.altAnswer) && a.altAnswer.length === a.answer.length ? a.altAnswer : null;
      a.answer.forEach((v, i) => a.slots.push({ answer: v, alt: alt ? alt[i] : null }));
    } else if (AREA_KINDS.includes(a.kind)) {
      for (const b of a.blocks || []) {
        if (b.type === 'row') {
          b.slot = a.slots.length;
          a.slots.push({ answer: b.answer, alt: b.alt ?? null, options: b.options });
        } else if (Array.isArray(b.slots) && b.slots.length) {
          b.base = a.slots.length;
          for (const s of b.slots) a.slots.push({ answer: s.answer, alt: s.alt ?? null, options: s.options });
        }
      }
    }
    const choices = s => (a.kind === 'select' ? s.options : a.kind === 'yesno' ? ['Yes', 'No'] : a.pool) || [];
    if (!a.slots.every(s => choices(s).includes(s.answer) && (s.alt == null || choices(s).includes(s.alt)))) {
      console.warn(`data/areas.js: question ${q.id} has an answer that is not one of its choices; using the original image.`);
      a.slots = [];
    }
    if (!a.slots.length && !a.exhibits) return null;
    a.reuse = a.kind === 'match' && /more than once/i.test(stemText(q));
    return a;
  }

  function interactive(q) {
    return !!(q.area && q.area.slots.length);
  }

  function areaText(a) {
    const out = [a.title, a.poolTitle, ...(a.pool || []), ...(a.head || [])];
    const block = b => [b.label, b.text, ...(b.options || []), ...(b.slots || []).flatMap(s => s.options || []), ...(b.head || []), ...(b.rows || []).flat()];
    for (const b of a.blocks || []) out.push(...block(b));
    for (const list of Object.values(a.exhibits || {})) for (const b of list) out.push(...block(b));
    return out.filter(Boolean).join(' ');
  }

  for (const [id, raw] of Object.entries(window.AREAS || {})) {
    const q = QUESTIONS.get(Number(id));
    if (q) q.area = prepareArea(q, raw);
  }

  // ================================================================== store

  const STORE_KEY = 'certprep.v1';
  const DEFAULTS = { key: 'reviewed', theme: 'auto', mockSize: 50, mockMinutes: 100, mockImages: true, mockLock: true, mockWeighted: true, shuffle: true, terms: true };

  // The object in memory is the only copy the app writes; localStorage mirrors it, and progress
  // merged in from another device (assets/sync.js) is taken over in place rather than written
  // around it, so neither can overwrite the other.
  const store = (() => {
    let data = { version: 1 };
    let persistent = true;
    let timer = 0;
    try {
      data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || data;
    } catch (err) {
      persistent = false;
    }
    if (data.version !== 1) data = { version: 1 };
    data.settings = { ...DEFAULTS, ...data.settings };
    if (!data.settings.keyVersion) { // reviewed answers arrived after the first release: adopt them once
      data.settings.key = 'reviewed';
      data.settings.keyVersion = 2;
    }
    fill(data);

    function fill(d) {
      d.q = d.q || {};
      d.activity = d.activity || {};
      d.sessions = d.sessions || {};
      d.mocks = d.mocks || [];
      d.mock = d.mock || null;
      d.plan = d.plan || {};
      d.gone = d.gone || {}; // deletions, for sync: "exam:CODE" (reset), "mock:ID", "session:KEY" → when
    }
    function swap(next, settings) {
      for (const k of Object.keys(data)) delete data[k];
      Object.assign(data, next, { settings });
      fill(data);
      flush();
    }
    function flush() {
      clearTimeout(timer);
      timer = 0;
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        persistent = true;
      } catch (err) {
        persistent = false;
      }
    }
    addEventListener('pagehide', () => { if (timer) flush(); });
    return {
      data,
      flush,
      save() { clearTimeout(timer); timer = setTimeout(flush, 150); if (window.SYNC) SYNC.poke(); },
      commit() { flush(); if (window.SYNC) SYNC.poke(); }, // save now, before navigating away
      // merged progress from assets/sync.js; this device keeps its own settings
      adopt(next) { swap(next, data.settings); },
      // an imported file or a full reset, which starts a new sync epoch and so replaces other devices' copies
      replace(next) { swap({ ...next, epoch: Date.now() }, { ...DEFAULTS, ...next.settings }); if (window.SYNC) SYNC.poke(); },
      get persistent() { return persistent; },
    };
  })();
  const S = store.data;

  const prog = id => S.q[id] || {};
  // A cleared flag or emptied note is dropped rather than stored as false or '', so copies compare equal.
  function patch(id, values) {
    const e = { ...S.q[id], ...values };
    for (const k of Object.keys(values)) if (values[k] === false || values[k] === '') delete e[k];
    S.q[id] = e;
    store.save();
  }

  // Practice and mock exams show the choices (and drag & drop tiles) in a random order that is remembered per
  // attempt, so a repeated question tests the idea rather than the position of its answer. Letters stay as printed.
  const shuffled = mode => !!S.settings.shuffle && (mode === 'practice' || mode === 'mock');
  function displayOrder(q, e, mode) {
    const natural = q.choices.map(c => c.k);
    if (mode === 'read' || q.type === 'yesno' || natural.length < 3) return q.choices;
    if (shuffled(mode) && !e.order) {
      e.order = shuffle(natural);
      store.save();
    }
    const ok = Array.isArray(e.order) && e.order.length === natural.length && natural.every(k => e.order.includes(k));
    return (ok ? e.order : natural).map(k => q.choices.find(c => c.k === k));
  }
  function tileOrder(a, e, mode) {
    if (!a.pool) return [];
    if (mode === 'read') return a.pool;
    if (shuffled(mode) && !e.tiles) {
      e.tiles = shuffle(a.pool);
      store.save();
    }
    const ok = Array.isArray(e.tiles) && e.tiles.length === a.pool.length && a.pool.every(v => e.tiles.includes(v));
    return ok ? e.tiles : a.pool;
  }

  // ================================================================== answer keys

  // ExamTopics' suggested answer is often wrong; the community vote is used once enough people agree.
  const MIN_VOTES = 3;
  const choiceText = c => plain(c.html).toLowerCase().replace(/[\s.]+$/, '').replace(/\s+/g, ' ');

  // The votes on this question, plus the votes and the ExamTopics answer of each variant, translated into
  // this question's letters by matching the choice text. The variants' ExamTopics answers count one vote each.
  function votesFor(q) {
    if (q._votes) return q._votes;
    if (!q.siblings.length || !q.choices.length) return (q._votes = q.votes);
    const mine = new Map(q.choices.map(c => [choiceText(c), c.k]));
    const tally = new Map();
    const add = (letters, n) => { const key = sortLetters(letters); tally.set(key, (tally.get(key) || 0) + n); };
    for (const v of q.votes) if (/^[A-Z]+$/.test(v.a)) add(v.a, v.n);
    q.pooledFrom = [];
    for (const sib of q.siblings) {
      const theirs = Object.fromEntries(sib.choices.map(c => [c.k, choiceText(c)]));
      const translate = letters => { const out = [...letters].map(l => mine.get(theirs[l])); return out.every(Boolean) ? sortLetters(out.join('')) : null; };
      let used = 0;
      for (const v of sib.votes) {
        const t = /^[A-Z]+$/.test(v.a) && translate(v.a);
        if (t) { add(t, v.n); used += v.n; }
      }
      const official = sib.answer && translate(sib.answer);
      if (official) { add(official, 1); used += 1; }
      q.pooledFrom.push({ q: sib, official, used });
    }
    const total = [...tally.values()].reduce((a, b) => a + b, 0);
    q._votes = [...tally].map(([a, n]) => ({ a, n, p: pct(n, total) })).sort((x, y) => y.n - x.n);
    return q._votes;
  }
  const totalVotes = q => votesFor(q).reduce((n, v) => n + v.n, 0);

  // The most-voted answer(s); more than one means the vote is tied.
  function leaders(q) {
    const valid = votesFor(q).filter(v => /^[A-Z]+$/.test(v.a));
    const most = Math.max(0, ...valid.map(v => v.n));
    return valid.filter(v => v.n === most && most > 0);
  }

  function answerKey(q) {
    if (interactive(q)) return areaKey(q);
    if (selfGraded(q)) return null;
    const official = sortLetters(q.answer);
    const best = leaders(q);
    const top = best.length === 1 ? best[0] : null;
    const community = top ? sortLetters(top.a) : '';
    const trusted = !!community && totalVotes(q) >= MIN_VOTES;
    const reviewed = q.review ? q.review.answer : '';
    let source = community && (!official || (S.settings.key === 'community' && trusted)) ? 'community' : 'official';
    if (reviewed && S.settings.key === 'reviewed') source = 'reviewed';
    const active = source === 'reviewed' ? reviewed : source === 'community' ? community : official;
    return {
      official, community, reviewed, top, trusted, source, review: q.review || null,
      split: best.length > 1 ? best.map(v => sortLetters(v.a)) : null,
      active,
      disputed: !!official && (best.some(v => sortLetters(v.a) !== official) || (!!reviewed && reviewed !== official)),
    };
  }

  // Answer areas have no vote counts. Where the most-upvoted comments clearly back a different answer for a
  // box, the transcription records it as that box's "alt", and it is used like a clear community vote.
  function areaKey(q) {
    const a = q.area;
    const official = a.slots.map(s => s.answer);
    const community = a.slots.some(s => s.alt != null && s.alt !== s.answer) ? a.slots.map(s => s.alt ?? s.answer) : null;
    const r = q.review && Array.isArray(q.review.boxes) && q.review.boxes.length === a.slots.length ? q.review : null;
    const reviewed = r ? r.boxes : null;
    let source = community && S.settings.key === 'community' ? 'community' : 'official';
    if (reviewed && S.settings.key === 'reviewed') source = 'reviewed';
    return {
      area: true, official, community, reviewed, source, review: r,
      active: source === 'reviewed' ? reviewed : source === 'community' ? community : official,
      disputed: !!(community || a.dispute || (reviewed && reviewed.some((v, i) => v !== official[i]))),
    };
  }

  // One boolean per box. Boxes in an "unordered" block (several tiles for one target) match in any order.
  function gradeArea(a, fill, key) {
    const res = key.map((v, i) => fill[i] === v);
    for (const b of a.blocks || []) {
      if (!b.unordered || b.base == null) continue;
      const idx = b.slots.map((_, j) => b.base + j);
      const want = idx.map(i => key[i]);
      for (const i of idx) {
        const at = want.indexOf(fill[i]);
        res[i] = at >= 0;
        if (at >= 0) want.splice(at, 1);
      }
    }
    return res;
  }

  // ================================================================== spaced repetition (Leitner boxes)

  // Wrong → box 1, due again in ten minutes. Each correct answer moves up a box: due after 1, 3, 7, 21 days.
  const INTERVAL_DAYS = [0, 0, 1, 3, 7, 21];
  const WRONG_GAP = 10 * 60e3;
  const SRS_FIELDS = ['a', 'c', 'l', 'b', 'd', 't'];

  function record(q, ok) {
    const prev = prog(q.id);
    const now = Date.now();
    const box = ok ? Math.min((prev.b || 1) + 1, 5) : 1;
    const before = {
      q: Object.fromEntries(SRS_FIELDS.filter(f => f in prev).map(f => [f, prev[f]])),
      day: dayKey(now), at: now, ok,
    };
    patch(q.id, {
      a: (prev.a || 0) + 1, c: (prev.c || 0) + (ok ? 1 : 0), l: ok ? 1 : 0,
      b: box, d: ok ? now + INTERVAL_DAYS[box] * DAY : now + WRONG_GAP, t: now,
    });
    const day = (S.activity[before.day] = S.activity[before.day] || { n: 0, c: 0 });
    day.n += 1;
    if (ok) day.c += 1;
    return before;
  }

  // Reverts a record() — only while it is still the latest attempt on that question.
  function undo(q, before) {
    const cur = S.q[q.id];
    if (!before || !cur || cur.t !== before.at) return false;
    for (const f of SRS_FIELDS) {
      if (f in before.q) cur[f] = before.q[f];
      else delete cur[f];
    }
    const day = S.activity[before.day];
    if (day) {
      day.n = Math.max(0, day.n - 1);
      if (before.ok) day.c = Math.max(0, day.c - 1);
    }
    store.save();
    return true;
  }

  function status(q) {
    const p = S.q[q.id];
    if (!p || !p.a) return 'new';
    return p.b >= 4 ? 'mastered' : p.b === 3 ? 'reviewing' : 'learning';
  }
  const isDue = (q, now = Date.now()) => { const p = S.q[q.id]; return !!(p && p.a && p.d <= now); };
  const isMistake = q => { const p = S.q[q.id]; return !!(p && p.a && !p.l); };
  const isFlagged = q => !!(S.q[q.id] && S.q[q.id].f);

  function stats(questions) {
    const now = Date.now();
    const s = { total: questions.length, new: 0, learning: 0, reviewing: 0, mastered: 0, seen: 0, attempts: 0, correct: 0, due: 0, mistakes: 0, flagged: 0 };
    for (const q of questions) {
      const p = S.q[q.id];
      s[status(q)] += 1;
      if (p && p.a) {
        s.seen += 1;
        s.attempts += p.a;
        s.correct += p.c || 0;
        if (p.d <= now) s.due += 1;
        if (!p.l) s.mistakes += 1;
      }
      if (p && p.f) s.flagged += 1;
    }
    return s;
  }

  function streak() {
    let d = startOfDay(Date.now());
    if (!(S.activity[dayKey(d)] || {}).n) d = addDays(d, -1);
    let n = 0;
    while ((S.activity[dayKey(d)] || {}).n) {
      n += 1;
      d = addDays(d, -1);
    }
    return n;
  }

  function lastDays(days) {
    let n = 0;
    let c = 0;
    for (let i = 0; i < days; i++) {
      const a = S.activity[dayKey(addDays(Date.now(), -i))];
      if (a) { n += a.n; c += a.c; }
    }
    return { n, c };
  }

  const finishedMocks = code => S.mocks.filter(m => m.code === code && m.score != null).sort((a, b) => a.end - b.end);

  // The study plan: an exam date and a daily goal per exam, with the pace they imply.
  function planFor(exam) {
    const p = S.plan[exam.code] || {};
    const st = stats(exam.questions);
    const today = dayKey(Date.now());
    const doneToday = exam.questions.filter(q => S.q[q.id] && S.q[q.id].t && dayKey(S.q[q.id].t) === today).length;
    const daysLeft = p.date ? Math.ceil((parseDay(p.date) - startOfDay(Date.now())) / DAY) : null;
    const unseen = st.total - st.seen;
    const last = finishedMocks(exam.code).slice(-3);
    const mockAvg = last.length ? Math.round(last.reduce((n, m) => n + m.score, 0) / last.length) : null;
    return {
      date: p.date || '', goal: p.goal || 0, st, doneToday, daysLeft, unseen,
      perDay: daysLeft != null && daysLeft > 0 ? Math.ceil(unseen / daysLeft) : null,
      mockAvg, mockCount: last.length,
    };
  }

  // Like the real exam, a drag & drop or hotspot answer earns partial credit: one share per correct box.
  function scoreMock(r) {
    const graded = r.items.filter(i => i.ok != null);
    r.graded = graded.length;
    r.correct = graded.filter(i => i.ok).length;
    r.points = graded.reduce((n, i) => n + (i.ok ? 1 : i.pts || 0), 0);
    r.score = graded.length ? pct(r.points, graded.length) : null;
  }

  // ================================================================== shell: mounting, tabs, theme, overlays

  const app = $('#app');
  let view = {};
  let currentSlug = null;

  function mount(node, hooks = {}) {
    view = hooks;
    app.replaceChildren(node);
  }

  function navigate(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  function setTabs(slug) {
    currentSlug = EXAMS.some(e => e.slug === slug) ? slug : null;
    $('#examTabs').replaceChildren(...EXAMS.map(e => h('a', {
      href: `#/exam/${e.slug}`, class: e.slug === slug ? 'active' : null, title: e.title,
      'aria-current': e.slug === slug ? 'page' : null,
    }, e.code)), GUIDE ? h('a', {
      href: '#/guide', class: 'guide-tab' + (slug === 'guide' ? ' active' : ''), title: 'Microsoft 概念指南',
      'aria-current': slug === 'guide' ? 'page' : null,
    }, icon('guide'), '指南') : null);
  }

  const setTitle = (...parts) => { document.title = [...parts, 'Cert Prep'].filter(Boolean).join(' · '); };

  const THEMES = ['auto', 'light', 'dark'];
  function applyTheme() {
    const t = S.settings.theme;
    if (t === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    const btn = $('#themeBtn');
    btn.replaceChildren(icon(t === 'dark' ? 'moon' : t === 'light' ? 'sun' : 'auto'));
    btn.title = `Theme: ${t} (click to change)`;
  }

  const tip = $('#tooltip');
  function showTipAt(x, y, strong, sub) {
    put(tip, h('strong', { text: strong }), sub ? h('div', { class: 'tip-sub', text: sub }) : null);
    tip.hidden = false;
    const t = tip.getBoundingClientRect();
    let top = y - t.height - 10;
    if (top < 8) top = y + 14;
    tip.style.left = clamp(x - t.width / 2, 8, innerWidth - t.width - 8) + 'px';
    tip.style.top = top + 'px';
  }
  function showTip(el) {
    const r = el.getBoundingClientRect();
    showTipAt(r.left + r.width / 2, r.top, el.dataset.tip, el.dataset.tipSub);
  }
  const hideTip = () => { tip.hidden = true; };

  let toastTimer = 0;
  function toast(message) {
    let t = $('.toast');
    if (!t) {
      t = h('div', { class: 'toast', role: 'status' });
      document.body.append(t);
    }
    t.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2400);
  }

  function ask(title, text, okLabel = 'OK') {
    const dlg = $('#askDialog');
    $('#askTitle').textContent = title;
    $('#askText').textContent = text;
    $('#askOk').textContent = okLabel;
    dlg.showModal();
    return new Promise(resolve => {
      const done = value => {
        $('#askOk').onclick = $('#askCancel').onclick = dlg.oncancel = null;
        if (dlg.open) dlg.close();
        resolve(value);
      };
      $('#askOk').onclick = () => done(true);
      $('#askCancel').onclick = () => done(false);
      dlg.oncancel = () => done(false);
    });
  }

  // ================================================================== small components

  function tile(label, value, hint, unit) {
    return h('div', { class: 'tile' },
      h('div', { class: 'label', text: label }),
      h('div', { class: 'value' }, String(value), unit ? h('small', { text: unit }) : null),
      hint ? h('div', { class: 'hint', text: hint }) : null);
  }

  const MASTERY = [
    ['mastered', 'Mastered', 'var(--m-mastered)'],
    ['reviewing', 'Reviewing', 'var(--m-reviewing)'],
    ['learning', 'Learning', 'var(--m-learning)'],
    ['new', 'Not seen', 'var(--m-new)'],
  ];

  function masteryBar(st) {
    const bar = h('div', {
      class: 'stackbar', role: 'img',
      'aria-label': 'Progress: ' + MASTERY.map(([k, label]) => `${st[k]} ${label.toLowerCase()}`).join(', '),
    });
    for (const [k, label, color] of MASTERY) {
      if (!st[k]) continue;
      bar.append(h('span', {
        style: `flex:${st[k]};background:${color}`, tabindex: 0,
        'data-tip': `${st[k]} ${label.toLowerCase()}`, 'data-tip-sub': `${pct(st[k], st.total)}% of ${plural(st.total, 'question')}`,
      }));
    }
    const legend = h('div', { class: 'legend' }, MASTERY.map(([k, label, color]) =>
      h('span', null, h('i', { style: `background:${color}` }), label, ' ', h('b', { text: st[k] }))));
    return h('div', { class: 'stack', style: 'gap:8px' }, bar, legend);
  }

  const meter = (value, max, label) => h('div', {
    class: 'meter', role: 'meter', 'aria-valuemin': 0, 'aria-valuemax': max, 'aria-valuenow': value, 'aria-label': label,
  }, h('span', { style: `width:${pct(value, max)}%` }));

  const STATUS = { new: ['Not seen', ''], learning: ['Learning', ''], reviewing: ['Reviewing', 'accent'], mastered: ['Mastered', 'good'] };
  function statusChip(q) {
    const [label, cls] = STATUS[status(q)];
    return h('span', { class: `chip ${cls}`, title: 'Your progress on this question', text: label });
  }

  const passChip = score => (score >= 70
    ? h('span', { class: 'chip good' }, icon('check'), 'Pass')
    : h('span', { class: 'chip bad' }, icon('x'), 'Below pass mark'));

  function linkify(text) {
    const out = [];
    let last = 0;
    for (const m of text.matchAll(/https?:\/\/[^\s<>"]+[^\s<>"().,;:!?']/g)) {
      out.push(text.slice(last, m.index), h('a', { href: m[0], target: '_blank', rel: 'noopener noreferrer', text: m[0] }));
      last = m.index + m[0].length;
    }
    out.push(text.slice(last));
    return out;
  }

  function commentNode(c) {
    return h('div', { class: 'comment' },
      h('div', { class: 'comment-head' },
        h('span', { class: 'user', text: c.user || 'Anonymous' }),
        c.date ? h('span', { text: fmtDay(parseDay(c.date)) }) : null,
        c.top ? h('span', { class: 'chip accent', text: 'Highly voted' }) : null,
        c.pick ? h('span', { class: 'chip code', text: `Selected ${c.pick}` }) : null,
        h('span', { class: 'up', title: `${plural(c.up, 'upvote')}` }, icon('up'), String(c.up))),
      h('div', { class: 'comment-body' }, linkify(c.text)),
      c.replies && c.replies.length ? h('div', { class: 'replies' }, c.replies.map(commentNode)) : null);
  }

  function discussion(q) {
    const LIMIT = 3;
    const sec = h('section', { class: 'section', id: 'discussion' },
      h('div', { class: 'section-head' },
        h('h3', { text: `Discussion (${countComments(q.comments)})` }),
        h('span', { class: 'spacer' }),
        q.thread ? h('a', { class: 'small', href: q.thread, target: '_blank', rel: 'noopener noreferrer' }, 'Open on ExamTopics ', icon('external')) : null));
    if (!q.comments.length) {
      sec.append(h('p', { class: 'muted small', text: 'No one has commented on this question yet.' }));
      return sec;
    }
    const list = h('div', { class: 'comments' }, q.comments.slice(0, LIMIT).map(commentNode));
    sec.append(list);
    if (q.comments.length > LIMIT) {
      const more = h('button', {
        class: 'btn sm', type: 'button',
        onclick: () => { list.replaceChildren(...q.comments.map(commentNode)); more.remove(); },
      }, `Show all ${q.comments.length} threads`);
      sec.append(h('div', null, more));
    }
    return sec;
  }

  function notesSection(q) {
    const ta = h('textarea', { class: 'notes', placeholder: 'Your own notes on this question — saved automatically', 'aria-label': 'My notes' });
    ta.value = prog(q.id).n || '';
    ta.addEventListener('input', () => patch(q.id, { n: ta.value, nt: Date.now() }));
    return h('section', { class: 'section' }, h('h3', { text: 'My notes' }), ta);
  }

  function voteRows(q, k) {
    return [...votesFor(q)].sort((a, b) => b.n - a.n).map(v => h('div', { class: 'vote-row' + (k.top && v.a === k.top.a ? ' top' : '') },
      h('span', { class: 'ans', text: v.a }),
      h('div', { class: 'track' }, h('div', { class: 'fill', style: `width:${v.p}%` })),
      h('span', { class: 'val' }, h('b', { text: `${v.p}%` }), ` · ${plural(v.n, 'vote')}`)));
  }

  // ================================================================== interactive answer areas: UI

  // The question text with transcribed images swapped out: exhibits become text, code or tables, and the
  // answer-area screenshot is dropped because areaWidget() draws the real thing below the stem.
  function stemNode(q) {
    const el = h('div', { class: 'rich stem', html: q.stem });
    const a = q.area;
    if (!a) return el;
    for (const img of el.querySelectorAll('img')) {
      const src = img.getAttribute('src');
      const p = img.parentElement;
      const holder = p !== el && p.tagName === 'P' && !p.textContent.trim() && p.querySelectorAll('img').length === 1 ? p : img;
      if (interactive(q) && src === a.area) holder.remove();
      else if (a.exhibits && a.exhibits[src]) holder.replaceWith(h('div', { class: 'exhibit' }, a.exhibits[src].map(staticBlock)));
    }
    return el;
  }

  function staticBlock(b) {
    switch (b.type) {
      case 'heading': return h('h5', { text: b.text });
      case 'code': return h('pre', { class: 'code-block' }, h('code', { text: b.text }));
      case 'image': return h('p', null, h('img', { src: b.src, alt: b.alt || 'Exhibit' }));
      case 'table': return h('div', { class: 'table-wrap' }, h('table', null,
        b.head ? h('thead', null, h('tr', null, b.head.map(c => h('th', { text: c })))) : null,
        h('tbody', null, (b.rows || []).map(r => h('tr', null, r.map(c => h('td', { text: c })))))));
      default: return h('p', { text: b.text });
    }
  }

  const AREA_HELP = {
    match: 'Drag each tile into a box, or click a tile and then a box.',
    order: 'Drag the steps into the answer area in the right order, or click a step to add it to the end.',
    select: 'Choose an option from each drop-down menu.',
    yesno: 'Answer Yes or No for each statement.',
  };

  /* The answer area of a drag & drop or hotspot question.
     ctx: { mode, revealed, entry, key, onChange }. The answer is entry.fill: one value (or null) per box. */
  function areaWidget(q, { mode, revealed, locked, entry: e, key: k, onChange }) {
    const a = q.area;
    const n = a.slots.length;
    const tileView = tileOrder(a, e, mode);
    if (!Array.isArray(e.fill) || e.fill.length !== n) e.fill = Array(n).fill(null);
    const fill = e.fill;
    const read = mode === 'read';
    const marks = revealed && !read ? gradeArea(a, fill, k.active) : null;
    const tiles = a.kind === 'match' || a.kind === 'order';
    const root = h('div', { class: `area area-${a.kind}` + (revealed ? ' locked' : '') });

    let armed = null; // a tile picked up by click or keyboard: { value, from: 'pool' | box index }
    let armedBox = null; // an empty box clicked before any tile
    let focusKey = null;
    let suppressClick = false;
    const filled = () => fill.filter(v => v != null).length;
    const boxName = i => (a.kind === 'order' ? `Step ${i + 1}` : `Box ${i + 1}`);

    function changed() {
      armed = armedBox = null;
      render();
      if (onChange) onChange();
    }
    function place(value, from, to) {
      if (from === to) {
        armed = null;
        return render();
      }
      if (typeof from === 'number') {
        const prev = fill[to];
        fill[to] = value;
        fill[from] = prev;
      } else {
        fill[to] = value;
      }
      focusKey = `box-${to}`;
      changed();
    }
    function clear(i) {
      fill[i] = null;
      focusKey = `box-${i}`;
      changed();
    }
    function swap(i, j) {
      if (j < 0 || j >= n) return;
      [fill[i], fill[j]] = [fill[j], fill[i]];
      focusKey = `box-${j}`;
      changed();
    }

    function clickTile(value) {
      if (armedBox != null) return place(value, 'pool', armedBox);
      if (a.kind === 'order') {
        const at = fill.indexOf(null);
        if (at < 0) return toast('Every step is filled. Remove one first, or drag a step onto another to swap them.');
        return place(value, 'pool', at);
      }
      armed = armed && armed.from === 'pool' && armed.value === value ? null : { value, from: 'pool' };
      focusKey = `pool-${tileView.indexOf(value)}`;
      render();
    }
    function clickBox(i) {
      if (armed) return place(armed.value, armed.from, i);
      if (fill[i] != null) armed = { value: fill[i], from: i };
      else armedBox = armedBox === i ? null : i;
      focusKey = `box-${i}`;
      render();
    }

    // ---- pieces
    function help() {
      if (revealed) return null;
      let text = AREA_HELP[a.kind];
      if (armed) text = typeof armed.from === 'number' ? `Click another ${a.kind === 'order' ? 'step' : 'box'} to move “${armed.value}”, or the tile list to take it out.` : `Now click the box where “${armed.value}” goes.`;
      else if (armedBox != null) text = `Now click the tile that goes in ${boxName(armedBox).toLowerCase()}.`;
      return h('div', { class: 'area-help', role: 'status' },
        icon(tiles ? 'pointer' : 'list'), h('span', { text }),
        h('span', { class: 'spacer' }),
        h('span', { class: 'count', text: `${filled()} of ${n} answered` }));
    }

    function pool() {
      const used = new Set(a.reuse ? [] : fill.filter(v => v != null));
      return h('div', {
        class: 'area-pane pool', 'data-pool': '',
        onclick: ev => { if (armed && typeof armed.from === 'number' && !ev.target.closest('.token')) clear(armed.from); },
      },
      h('div', { class: 'pane-title', text: a.poolTitle || (a.kind === 'order' ? 'Actions' : 'Tiles') }),
      a.reuse && !revealed ? h('div', { class: 'pane-sub', text: 'Each tile can be used more than once.' }) : null,
      h('div', { class: 'token-list' }, tileView.map((v, i) => (used.has(v) || revealed
        ? h('div', { class: 'token' + (used.has(v) ? ' used' : ' static'), 'aria-hidden': used.has(v) ? 'true' : null },
          h('span', { class: 'token-text', text: v }))
        : h('button', {
          type: 'button', class: 'token' + (armed && armed.from === 'pool' && armed.value === v ? ' armed' : ''),
          'data-drag': '', 'data-value': v, 'data-from': 'pool', 'data-focus': `pool-${i}`,
          'aria-pressed': String(!!(armed && armed.from === 'pool' && armed.value === v)),
          onclick: () => clickTile(v),
        }, h('span', { class: 'grip' }, icon('grip')), h('span', { class: 'token-text', text: v }))))));
    }

    // Another answer for this box from the other key (community vs ExamTopics), shown once revealed.
    function otherKey(i) {
      const others = [['reviewed', 'Reviewed', k.reviewed], ['official', 'ExamTopics', k.official], ['community', 'Most-upvoted comments', k.community]]
        .filter(([src, , arr]) => arr && src !== k.source && arr[i] !== k.active[i])
        .map(([, label, arr]) => `${label}: ${arr[i]}`);
      return others.length ? h('span', { class: 'other-key', text: others.join(' · ') }) : null;
    }

    function shownBox(i, inline) {
      const cls = 'slot shown' + (inline ? ' inline' : '');
      if (read) {
        const shown = [k.active[i], k.official[i], k.community ? k.community[i] : null];
        const others = a.kind === 'select' ? a.slots[i].options.filter(o => !shown.includes(o)) : [];
        return h('span', { class: cls + ' answer', title: inline && others.length ? `Other choices: ${others.join(' · ')}` : null },
          h('span', { class: 'val', text: k.active[i] }), otherKey(i),
          !inline && others.length ? h('span', { class: 'others', text: `Other choices: ${others.join(' · ')}` }) : null);
      }
      const ok = marks[i];
      return h('span', { class: cls + (ok ? ' is-correct' : ' is-wrong') },
        h('span', { class: 'val-line' }, icon(ok ? 'check' : 'x'),
          h('span', { class: 'val' + (fill[i] == null ? ' none' : ''), text: fill[i] ?? 'No answer' })),
        ok ? null : h('span', { class: 'fix' }, h('span', { class: 'fix-label', text: 'Answer: ' }), k.active[i]),
        otherKey(i));
    }

    function box(i, inline) {
      if (revealed) return shownBox(i, inline);
      if (a.kind === 'select') {
        const sel = h('select', { class: fill[i] != null ? 'filled' : null, 'data-focus': `box-${i}`, 'aria-label': boxName(i) },
          h('option', { value: '' }, 'Select…'),
          a.slots[i].options.map(o => h('option', { value: o, selected: fill[i] === o }, o)));
        sel.addEventListener('change', () => {
          fill[i] = sel.value || null;
          sel.classList.toggle('filled', fill[i] != null);
          const c = $('.count', root);
          if (c) c.textContent = `${filled()} of ${n} answered`;
          if (onChange) onChange();
        });
        return h('span', { class: 'select-wrap' + (inline ? ' inline' : '') }, sel);
      }
      const v = fill[i];
      const cls = 'slot' + (inline ? ' inline' : '') + (v != null ? ' filled' : '') + (armedBox === i ? ' armed' : '');
      if (v == null) {
        return h('span', { class: cls, 'data-slot': i },
          h('button', { type: 'button', class: 'drop', 'data-focus': `box-${i}`, 'aria-label': `${boxName(i)}: empty`, onclick: () => clickBox(i) },
            armed ? 'Place here' : inline ? '' : a.kind === 'order' ? 'Drop a step here' : 'Drop a tile here'));
      }
      const isArmed = armed && armed.from === i;
      return h('span', { class: cls + (isArmed ? ' armed' : ''), 'data-slot': i },
        h('button', {
          type: 'button', class: 'placed', 'data-drag': '', 'data-value': v, 'data-from': i, 'data-focus': `box-${i}`,
          'aria-label': `${boxName(i)}: ${v}. Press Delete to remove.`, 'aria-pressed': String(!!isArmed), onclick: () => clickBox(i),
        }, h('span', { class: 'grip' }, icon('grip')), h('span', { class: 'token-text', text: v })),
        a.kind === 'order' ? h('button', { type: 'button', class: 'ctl', 'aria-label': 'Move up', title: 'Move up', disabled: i === 0, onclick: () => swap(i, i - 1) }, icon('chevUp')) : null,
        a.kind === 'order' ? h('button', { type: 'button', class: 'ctl', 'aria-label': 'Move down', title: 'Move down', disabled: i === n - 1, onclick: () => swap(i, i + 1) }, icon('chevDown')) : null,
        h('button', { type: 'button', class: 'ctl', 'aria-label': `Remove from ${boxName(i).toLowerCase()}`, title: 'Remove', onclick: () => clear(i) }, icon('x')));
    }

    function template(b) {
      const el = h(b.type === 'code' ? 'pre' : 'p', { class: b.type === 'code' ? 'code-area' : 'text-area' });
      b.text.split(/\{\{(\d+)\}\}/).forEach((part, j) => {
        if (j % 2) el.append(box(b.base + Number(part), true));
        else if (part) el.append(part);
      });
      return el;
    }

    function rowsGrid(rows) {
      const grid = h('div', { class: 'rows' + (a.head && a.head.some(Boolean) ? ' has-head' : '') });
      if (a.head && a.head.some(Boolean)) grid.append(h('div', { class: 'th', text: a.head[0] || '' }), h('div', { class: 'th', text: a.head[1] || '' }));
      for (const b of rows) grid.append(h('div', { class: 'row-label', text: b.label }), h('div', { class: 'row-box' }, box(b.slot)));
      return grid;
    }

    function yesNo(rows) {
      const head = (a.head && a.head[0]) || 'Statements';
      return h('div', { class: 'yn-wrap' }, h('table', { class: 'yn' },
        h('thead', null, h('tr', null, h('th', { text: head }), h('th', { class: 'c', text: 'Yes' }), h('th', { class: 'c', text: 'No' }))),
        h('tbody', null, rows.map(b => {
          const i = b.slot;
          const right = k.active[i];
          const state = marks ? (marks[i] ? 'is-correct' : 'is-wrong') : read ? 'answer' : '';
          return h('tr', { class: state },
            h('td', { class: 'stmt' }, h('div', { class: 'stmt-in' }, h('span', { text: b.label }),
              marks && !marks[i] ? h('span', { class: 'fix' }, fill[i] == null ? `Not answered · the answer is ${right}` : `Answer: ${right}`) : null,
              revealed ? otherKey(i) : null)),
            ['Yes', 'No'].map(v => {
              if (revealed) {
                const mine = fill[i] === v;
                const isKey = right === v;
                return h('td', { class: 'c' }, h('span', {
                  class: 'yn-dot' + (isKey ? ' is-key' : '') + (mine && !isKey ? ' is-wrong' : ''),
                  'aria-label': `${v}${isKey ? ' (answer)' : ''}${mine ? ' (your choice)' : ''}`,
                }, isKey ? icon('check') : mine ? icon('x') : null));
              }
              const input = h('input', { type: 'radio', name: `yn-${q.id}-${i}`, value: v, checked: fill[i] === v, 'aria-label': `${v}: ${b.label}`, 'data-focus': `box-${i}-${v}` });
              input.addEventListener('change', () => {
                fill[i] = v;
                const c = $('.count', root);
                if (c) c.textContent = `${filled()} of ${n} answered`;
                if (onChange) onChange();
              });
              return h('td', { class: 'c' }, h('label', { class: 'yn-cell' }, input, h('span', { class: 'yn-dot' })));
            }));
        }))));
    }

    function answerPane() {
      const pane = h('div', { class: 'area-pane targets' },
        h('div', { class: 'pane-title', text: 'Answer area' }),
        a.title ? h('div', { class: 'area-title', text: a.title }) : null);
      if (a.kind === 'order') {
        pane.append(h('ol', { class: 'seq' }, fill.map((_, i) => h('li', null, h('span', { class: 'num', text: i + 1 }), box(i)))));
        return pane;
      }
      let rows = [];
      const flush = () => {
        if (rows.length) pane.append(a.kind === 'yesno' ? yesNo(rows) : rowsGrid(rows));
        rows = [];
      };
      for (const b of a.blocks) {
        if (b.type === 'row') { rows.push(b); continue; }
        flush();
        pane.append(b.base != null ? template(b) : staticBlock(b));
      }
      flush();
      return pane;
    }

    function render() {
      const active = document.activeElement;
      const keepFocus = focusKey || (active && root.contains(active) && active.dataset.focus);
      const y = scrollY;
      put(root, help(), tiles ? h('div', { class: 'area-split' }, pool(), answerPane()) : answerPane());
      // WebKit (Safari, and every browser on iPhone) lays out a container-query container whose content was replaced
      // in two passes; in between the area is briefly short, the page scroll is clamped, and the page jumps up. Lay it
      // out now and put the scroll position back before anything is painted.
      if (root.isConnected) {
        void root.offsetHeight;
        if (scrollY !== y) scrollTo({ top: y });
      }
      if (locked) {
        root.classList.add('locked');
        for (const el of root.querySelectorAll('button, select, input')) el.disabled = true;
      }
      if (keepFocus) {
        const el = root.querySelector(`[data-focus="${CSS.escape(keepFocus)}"]`) || root.querySelector('[data-focus^="box-"]');
        if (el && root.isConnected) el.focus({ preventScroll: true });
      }
      focusKey = null;
    }

    // ---- dragging (mouse, pen, and touch from the grip handle so the page still scrolls on phones)
    if (tiles && !revealed && !locked) {
      root.addEventListener('pointerdown', ev => {
        suppressClick = false;
        if (ev.button !== 0) return;
        const src = ev.target.closest('[data-drag]');
        if (!src || !root.contains(src)) return;
        if (ev.pointerType === 'touch' && !ev.target.closest('.grip')) return;
        const from = src.dataset.from === 'pool' ? 'pool' : Number(src.dataset.from);
        const value = src.dataset.value;
        const r = src.getBoundingClientRect();
        const dx = ev.clientX - r.left;
        const dy = ev.clientY - r.top;
        const x0 = ev.clientX;
        const y0 = ev.clientY;
        let ghost = null;
        let over = null;
        const targetAt = (x, y) => {
          const el = document.elementFromPoint(x, y);
          const t = el && el.closest('[data-slot], [data-pool]');
          return t && root.contains(t) ? t : null;
        };
        const move = mv => {
          if (!ghost) {
            if (Math.hypot(mv.clientX - x0, mv.clientY - y0) < 6) return;
            ghost = h('div', { class: 'token drag-ghost', style: `width:${Math.min(r.width, 420)}px` },
              h('span', { class: 'grip' }, icon('grip')), h('span', { class: 'token-text', text: value }));
            document.body.append(ghost);
            src.classList.add('dragging');
            root.classList.add('is-dragging');
            armed = armedBox = null;
          }
          mv.preventDefault();
          ghost.style.transform = `translate(${mv.clientX - dx}px, ${mv.clientY - dy}px)`;
          const t = targetAt(mv.clientX, mv.clientY);
          if (t !== over) {
            if (over) over.classList.remove('drop-over');
            over = t;
            if (over) over.classList.add('drop-over');
          }
          if (mv.clientY < 80) scrollBy(0, -12);
          else if (mv.clientY > innerHeight - 80) scrollBy(0, 12);
        };
        const end = drop => {
          removeEventListener('pointermove', move);
          removeEventListener('pointerup', up);
          removeEventListener('pointercancel', cancel);
          if (!ghost) return;
          ghost.remove();
          src.classList.remove('dragging');
          root.classList.remove('is-dragging');
          if (over) over.classList.remove('drop-over');
          suppressClick = true;
          if (drop && over && over.dataset.slot != null) place(value, from, Number(over.dataset.slot));
          else if (drop && over && from !== 'pool') clear(from);
          else render();
        };
        const up = () => end(true);
        const cancel = () => end(false);
        addEventListener('pointermove', move, { passive: false });
        addEventListener('pointerup', up);
        addEventListener('pointercancel', cancel);
      });
      // a drag ends with a click on whatever is under the pointer; swallow it
      root.addEventListener('click', ev => {
        if (!suppressClick) return;
        suppressClick = false;
        ev.stopPropagation();
        ev.preventDefault();
      }, true);
      root.addEventListener('keydown', ev => {
        const t = ev.target;
        if ((ev.key === 'Delete' || ev.key === 'Backspace') && t.classList.contains('placed')) {
          clear(Number(t.dataset.from));
          ev.preventDefault();
        } else if (ev.key === 'Escape' && (armed || armedBox != null)) {
          armed = armedBox = null;
          render();
          ev.preventDefault();
          ev.stopPropagation();
        }
      });
    }

    render();
    return { el: root, filled };
  }

  // Terms to look up on Microsoft Learn: the product and feature names in the question and its answer.
  const PRODUCT = new RegExp('^(?:' + ('Azure Microsoft Copilot Power Dynamics Foundry OpenAI Entra Purview SharePoint Dataverse Teams Fabric Defender Bicep DevOps ' +
    'GitHub SDK MCP RAG DLP OCR Python GPT Vision Language Speech Search Document Content Safety Studio Agent Agents Automate Apps Pages Platform ' +
    'Blob Storage Kubernetes Docker Cognitive Translator Immersive Reader Bot Framework Semantic Kernel AutoGen Responses Assistants Prompt Flow Sales ' +
    'Finance Commerce Synapse Databricks Cosmos Functions Monitor Insights Sentinel Vault OpenTelemetry Container Registry OneLake Lakehouse Pipelines ' +
    'Pipeline Connector Connectors Knowledge Generative Orchestration Evaluation Evaluations Evaluator Evaluators Groundedness Relevance Coherence ' +
    'Fluency Shield Shields Adaptive Dataflow Dataflows Gen2 Deployment Deployments Provisioned Throughput Serverless Fine-tuning LoRA Embedding ' +
    'Embeddings Vector Hybrid Index Indexes Indexer Skillset Skillsets Analyzer Analyzers Layout Invoice Receipt CLU NER PII SSML WebRTC Realtime RBAC ' +
    'VNet Endpoint Endpoints Policy Policies Audit Responsible Transparency Fairness Accountability Inclusiveness Well-Architected ALM Accelerator ' +
    'Success Design Checklist Telemetry Transcript Transcripts Analytics Estimator Calculator Licensing Credits Billing Markdown HTML JSON REST API ' +
    'HTTP HTTPS URL SQL CSAT ROI ROAI SSOT TCO SLA KPI KPIs').split(' ').map(w => w.replace(/[.+-]/g, '\\$&')).join('|') + ')$');
  const GENERIC = /^(?:API|REST|HTTP|HTTPS|URL|SQL|JSON|HTML|SDK|ID|IT|PDF|CSV|UI|UX|AI)$/;
  const PLACEHOLDER = /^(?:[A-Za-z]+\d+|Contoso|Fabrikam|Litware|Tailwind|Adatum|Northwind|Woodgrove|Proseware|Lucerne|Relecloud|Wingtip|Humongous|Coho|Tailspin|Bellows|Southridge|Trey|Yonder|Airlines|Inc|Ltd)$/;
  const FILLER = /^(?:for|of|in|to|and|the|with|on|a|an|by|from|or|as|via|&)$/;
  const LEADING = new Set(('You Your The A An This These That Those Which What How When Where Why Does Do Is Are Should Can Will Must Could May Might To For ' +
    'Each Every Some Any All None Both Either Neither More Most Less Least First Second Third Next Last New Current Existing Additionally Finally ' +
    'However Therefore Because Although Since Unless Until Otherwise Then While After Before During Also Only It Its They Their We Our He She Users User ' +
    'Customers Customer Company Team Staff NOTE Note Solution Solutions Answer Area Yes No Define Conduct Minimize Support Ensure Configure Create Enable ' +
    'Add Use Deploy Implement Set Run Store Integrate Disable Publish Select Retrieve Provide Upload Connect Validate Compare Return Identify Monitor ' +
    'Analyze Generate Recommend Design Build Test Manage Plan Review Train Export Import Delete Change Move Drag Choose Include Capture Record Log Track ' +
    'Transfer Redact Escalate Handle Update Verify Measure Reduce Increase Improve Optimize Scale Secure Protect Allow Block Prevent Require Enforce Apply ' +
    'Assign Grant Limit Restrict Make Keep Avoid Collect Send Receive Call Convert Process Submit Start Stop Complete Perform Determine Evaluate Extract ' +
    'Classify Summarize Translate Transcribe Detect Recognize Index Ground Orchestrate Delegate Route Trigger Enter Open Close Save Load Install Remove ' +
    'Replace Rename Merge Split Sort Filter Group Count Show Hide Display Print Read Write Edit Copy Paste Share Follow Lead Meet Help Need Want Plans ' +
    'Prevents Provides Supports Requires Uses Allows Returns Contains Includes Stores Sends Reports Displays Classifies Creates Answers Deploys').split(' '));
  const TITLECASE = /^(?:[A-Z][A-Za-z0-9.+-]*|\d+(?:\.\d+)?[A-Za-z]*)$/;
  function learnTerms(q, k) {
    const texts = [stemText(q)];
    if (k && k.area) texts.push(...k.active.map(String));
    else if (k) texts.push(...q.choices.filter(c => k.active.includes(c.k)).map(c => plain(c.html)));
    const score = new Map();
    const bump = (term, w) => score.set(term, (score.get(term) || 0) + w);
    for (const text of texts) {
      for (const sentence of text.split(/(?<=[.!?;:,])\s+|\s[–—-]\s|[()"“”‘’[\]{}]|\s+(?=(?:You|Which|What|How|When|Where|Why|Does|Do|Is|Are|Should|Can|To answer|NOTE)\b)/)) {
        const tokens = sentence.split(/\s+/).map(t => t.replace(/^[^A-Za-z0-9]+|[.,;:!?]+$/g, '')).filter(Boolean);
        let run = [];
        const flush = () => {
          while (run.length && (FILLER.test(run[0]) || LEADING.has(run[0]))) run.shift();
          while (run.length && FILLER.test(run[run.length - 1])) run.pop();
          if (run.length && !run.some(t => PLACEHOLDER.test(t))) {
            const words = run.filter(t => !FILLER.test(t));
            const product = words.some(t => PRODUCT.test(t));
            const acronym = words.some(t => /^[A-Z][A-Z0-9-]{1,6}$/.test(t) && !GENERIC.test(t));
            if (words.length >= 2 && (product || acronym || words.every(t => TITLECASE.test(t) && t.length > 2))) bump(run.join(' '), product ? 3 : 2);
            else if (words.length === 1 && (product || acronym) && words[0].length > 2) bump(words[0], GENERIC.test(words[0]) ? 0.5 : 1.5);
          }
          run = [];
        };
        for (const t of tokens) {
          if (TITLECASE.test(t) || (run.length && FILLER.test(t))) run.push(t);
          else flush();
        }
        flush();
      }
    }
    const ranked = [...score].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length).map(([t]) => t);
    const picked = [];
    for (const t of ranked) {
      if (picked.length === 4) break;
      const lower = t.toLowerCase();
      if (picked.some(p => p.toLowerCase().includes(lower) || lower.includes(p.toLowerCase()))) continue;
      picked.push(t);
    }
    return picked;
  }

  const CONF = { high: ['High confidence', 'good'], medium: ['Medium confidence', 'accent'], low: ['Low confidence', 'warn'] };
  const confidenceChip = c => h('span', { class: `chip ${(CONF[c] || CONF.medium)[1]}`, title: 'How sure the review is', text: (CONF[c] || CONF.medium)[0] });

  // ================================================================== question card

  const SELF_HELP = {
    dragdrop: 'Drag & drop: work out which items go where — and in which order — from the exhibit.',
    hotspot: 'Hotspot: decide what you would select in each box of the exhibit.',
    image: 'Work out your answer from the exhibit.',
  };

  /* ctx: { mode: practice | read | mock | review, pos, entry, key, caseOpen, toggleCase,
            nav: { hasPrev, hasNext, prev, next, lastLabel }, onCheck, onReveal, onGrade, onOverride, onChange, onFlag } */
  function questionCard(q, ctx) {
    const { mode, entry: e, key: k } = ctx;
    const area = interactive(q) ? q.area : null;
    const graded = !selfGraded(q);
    const revealed = mode === 'read' || mode === 'review' || (mode === 'practice' && !!e.done);
    const multi = graded && !area && k.active.length > 1;
    const locked = mode === 'mock' && !!e.locked; // a series question the real exam would not let you revisit
    const order = graded && !area ? displayOrder(q, e, mode) : [];
    const flagged = mode === 'mock' ? !!e.flag : isFlagged(q);
    const flagWord = on => (mode === 'mock' ? (on ? 'Marked for review' : 'Mark for review') : (on ? 'Flagged' : 'Flag'));

    const card = h('article', { class: 'qcard', 'aria-label': `Question ${q.n}` });
    const body = h('div', { class: 'qcard-body' });
    card.append(body);

    const flagBtn = h('button', {
      class: 'btn sm ghost flag-btn', type: 'button', 'aria-pressed': String(flagged), title: `${flagWord(false)} (M)`, onclick: toggleFlag,
    }, icon('flag'), h('span', { text: flagWord(flagged) }));

    body.append(h('div', { class: 'qmeta' },
      h('span', { class: 'qnum', text: `Question ${q.n}` }),
      ctx.pos ? h('span', { class: 'pos', text: ctx.pos }) : null,
      multiTopic(q.exam) && q.topic ? h('span', { class: 'chip', title: topicLabel(q.exam, q.topic), text: q.exam.tagged ? q.exam.topicName[q.topic] : `Topic ${q.topic}` }) : null,
      h('span', { class: 'chip', text: TYPE_LABEL[q.type] || q.type }),
      q.kp && mode !== 'mock' ? h('span', { class: 'chip kp', title: 'Knowledge point', text: q.kp }) : null,
      mode !== 'mock' ? q.sk.slice(0, 2).map(id => {
        const o = q.exam.objective.get(id);
        if (!o || !o.bullet) return null;
        const n = skillQuestions(q.exam, id).length;
        return h('button', {
          class: 'chip obj', type: 'button', text: `${o.bullet.id} ${o.bullet.text}`,
          title: `Official objective · ${o.group.id}. ${o.group.title} › ${o.area.id}. ${o.area.title}${o.bullet.zh ? '\n' + o.bullet.zh : ''}\nClick to practice the ${plural(n, 'question')} on it`,
          onclick: () => startSession(q.exam, { mode: 'practice', title: `${o.bullet.id} ${o.bullet.text}`, ids: skillQuestions(q.exam, id).map(x => x.id) }),
        });
      }) : null,
      q.extra && mode !== 'mock' ? h('span', { class: 'chip accent', title: 'Written for this app in the official style, for an objective ExamTopics does not cover; not an ExamTopics question', text: 'Supplement' }) : null,
      q.siblings.length && mode !== 'mock' ? h('a', {
        class: 'chip variants', href: `#/q/${q.exam.slug}/${q.n}`,
        title: 'ExamTopics lists this question again with reshuffled choices. Votes are pooled across the copies; click to read them side by side.',
      }, `Also #${q.siblings.map(x => x.n).join(', #')}`) : null,
      q.series ? h('span', { class: 'chip', text: 'Series', title: 'Part of a series: the same scenario with different proposed solutions. Judge each solution on its own.' }) : null,
      revealed && k && k.disputed ? h('span', { class: 'chip warn', title: area ? 'Upvoted comments disagree with the ExamTopics answer' : 'The community vote disagrees with the ExamTopics answer' }, icon('alert'), 'Disputed') : null,
      mode !== 'mock' ? statusChip(q) : null,
      flagBtn));

    if (q.case) {
      const c = q.exam.cases[q.case];
      body.append(h('div', { class: 'case-banner' }, icon('case'),
        h('div', null, h('div', { class: 'label', text: 'Case study' }), h('div', { class: 'name', text: c.name })),
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn sm', type: 'button', 'aria-expanded': String(!!ctx.caseOpen), onclick: ctx.toggleCase },
          ctx.caseOpen ? 'Hide scenario' : 'Show scenario', h('kbd', { text: 'S' }))));
    }

    const stem = stemNode(q);
    body.append(stem);
    const termsOn = !!GUIDE && mode !== 'mock' && S.settings.terms !== false; // glossary terms become clickable
    const seenTerms = new Set();
    if (termsOn) highlightTerms(stem, seenTerms, q.exam.code);

    // ---- answer area
    let list = null;
    let hint = null;
    let widget = null;
    if (area) {
      if (locked) body.append(lockNote());
      widget = areaWidget(q, { mode, revealed, locked, entry: e, key: k, onChange: () => { drawActions(); if (ctx.onChange) ctx.onChange(); } });
      body.append(widget.el);
    } else if (graded) {
      if (locked) body.append(lockNote());
      else if (!revealed) {
        hint = h('div', { class: 'pick-hint' });
        body.append(hint);
      }
      list = h('div', { class: 'choices', role: multi ? 'group' : 'radiogroup', 'aria-label': 'Answer choices' });
      const picked = e.pick || '';
      for (const c of order) {
        const isKey = k.active.includes(c.k);
        const isPick = picked.includes(c.k);
        let state = isPick ? 'selected' : '';
        let mark = null;
        if (revealed) {
          if (mode === 'read' || !picked) {
            state = isKey ? (mode === 'read' ? 'is-correct' : 'is-missed') : 'is-dim';
            mark = isKey ? [icon('check'), 'Answer'] : null;
          } else if (isPick && isKey) {
            state = 'is-correct';
            mark = [icon('check'), 'Your answer'];
          } else if (isPick) {
            state = 'is-wrong';
            mark = [icon('x'), 'Your answer'];
          } else if (isKey) {
            state = 'is-missed';
            mark = [icon('check'), 'Correct answer'];
          } else {
            state = 'is-dim';
          }
        }
        const input = h('input', { type: multi ? 'checkbox' : 'radio', name: `q${q.id}`, value: c.k, checked: isPick, disabled: revealed || locked });
        input.addEventListener('change', () => pick(c.k));
        list.append(h('label', { class: ['choice', multi && 'multi', (revealed || locked) && 'locked', state].filter(Boolean).join(' ') },
          input,
          h('span', { class: 'letter', 'aria-hidden': 'true', text: c.k }),
          h('span', { class: 'text', html: c.html }),
          h('span', { class: 'mark' }, mark)));
      }
      body.append(list);
      if (termsOn) for (const t of list.querySelectorAll('.choice .text')) highlightTerms(t, seenTerms, q.exam.code);
      updateHint();
    } else if (mode === 'mock' || (mode === 'practice' && !revealed)) {
      const ta = h('textarea', {
        class: 'notes', rows: 2, 'aria-label': 'Your answer',
        placeholder: q.type === 'hotspot' ? 'e.g. Box 1: Yes · Box 2: No · Box 3: Yes' : 'e.g. 1. Define DLP policies → 2. Configure filters → 3. Add prompt modifications',
      });
      ta.value = e.note || '';
      ta.addEventListener('input', () => { e.note = ta.value; if (ctx.onChange) ctx.onChange(); });
      body.append(h('div', { class: 'selfgrade-box' },
        h('p', null, (SELF_HELP[q.type] || SELF_HELP.image) + ' ',
          mode === 'mock' ? 'You grade this one yourself on the results page.' : 'Then reveal the answer and grade yourself.'),
        h('label', { class: 'field' }, mode === 'mock' ? 'Your answer' : 'Your answer (optional)', ta)));
    }

    function lockNote() {
      return h('div', { class: 'lock-note' }, icon('lock'),
        h('span', { text: 'Locked. You moved on from this series question, and the real exam does not let you come back to one.' }));
    }

    function pick(letter) {
      if (revealed || locked) return;
      let cur = e.pick || '';
      cur = multi ? (cur.includes(letter) ? cur.replace(letter, '') : sortLetters(cur + letter)) : letter;
      e.pick = cur;
      for (const label of list.children) {
        const input = label.querySelector('input');
        input.checked = cur.includes(input.value);
        label.classList.toggle('selected', input.checked);
      }
      updateHint();
      drawActions();
      if (ctx.onChange) ctx.onChange();
    }

    function updateHint() {
      if (!hint) return;
      const n = (e.pick || '').length;
      hint.textContent = multi ? `Choose ${k.active.length} · ${n} selected` : 'Choose one';
    }

    function toggleFlag() {
      const on = flagBtn.getAttribute('aria-pressed') !== 'true';
      if (mode === 'mock') {
        e.flag = on;
        if (ctx.onChange) ctx.onChange();
      } else {
        patch(q.id, { f: on, ft: Date.now() });
      }
      flagBtn.setAttribute('aria-pressed', String(on));
      flagBtn.lastChild.textContent = flagWord(on);
      if (ctx.onFlag) ctx.onFlag();
    }

    // ---- action bar
    const actions = h('div', { class: 'actions' });
    card.append(actions);
    const nextButton = primary => h('button', {
      class: 'btn' + (primary ? ' primary' : ''), type: 'button', onclick: ctx.nav.next, title: 'Next (→)',
    }, h('span', { text: ctx.nav.hasNext ? 'Next' : ctx.nav.lastLabel || 'Finish' }), icon('right'));

    function drawActions() {
      const kids = [
        h('button', { class: 'btn', type: 'button', disabled: !ctx.nav.hasPrev, onclick: ctx.nav.prev, title: 'Previous (←)', 'aria-label': 'Previous question' },
          icon('left'), h('span', { class: 'label-long', text: 'Previous' })),
        h('span', { class: 'spacer' }),
      ];
      if (mode === 'practice' && !revealed) {
        kids.push(h('span', { class: 'hint' }, 'Press ', h('kbd', { text: '?' }), ' for shortcuts'));
        kids.push(h('button', { class: 'btn ghost', type: 'button', onclick: ctx.nav.next }, 'Skip'));
        kids.push(graded
          ? h('button', { class: 'btn primary', type: 'button', disabled: !(widget ? widget.filled() : e.pick), onclick: ctx.onCheck }, 'Check answer', h('kbd', { text: '↵' }))
          : h('button', { class: 'btn primary', type: 'button', onclick: ctx.onReveal }, icon('eye'), 'Reveal answer', h('kbd', { text: '↵' })));
      } else {
        kids.push(nextButton(true));
      }
      actions.replaceChildren(...kids);
    }
    drawActions();

    // ---- feedback, answer key, discussion
    if (revealed) card.append(feedback());

    function feedback() {
      const f = h('div', { class: 'feedback' });
      if (mode !== 'read') {
        if (!graded && e.ok == null) {
          f.append(h('div', { class: 'result neutral selfgrade' },
            h('span', { text: 'Compare with the answer below. Did you get it right?' }),
            h('div', { class: 'row' },
              h('button', { class: 'btn good', type: 'button', onclick: () => ctx.onGrade(true) }, icon('check'), 'I got it', h('kbd', { text: 'Y' })),
              h('button', { class: 'btn bad', type: 'button', onclick: () => ctx.onGrade(false) }, icon('x'), 'I missed it', h('kbd', { text: 'N' })))));
        } else if (e.ok != null) {
          f.append(resultBanner());
        }
      }
      if (!graded && e.note) {
        f.append(h('section', { class: 'section' }, h('h3', { text: 'Your answer' }), h('div', { class: 'comment-body', text: e.note })));
      }
      if (q.answerHtml && !area) {
        f.append(h('section', { class: 'section' }, h('h3', { text: 'Answer' }),
          graded ? null : h('p', { class: 'small muted', text: 'This is the answer ExamTopics suggests. Drag & drop and hotspot questions have no vote count, so check the most-upvoted comments below: the community sometimes disagrees.' }),
          h('div', { class: 'rich answer-media', html: q.answerHtml })));
      }
      if (area) f.append(areaKeySection());
      else if (graded) f.append(keySection());
      if (k && k.review) {
        const why = h('p', { text: k.review.why });
        if (termsOn) highlightTerms(why, seenTerms, q.exam.code);
        f.append(h('section', { class: 'section' }, h('h3', { text: 'Why' }),
          h('div', { class: 'explain' }, why,
            h('div', { class: 'row small muted' }, confidenceChip(k.review.confidence),
              h('span', { text: q.extra ? 'Written for this app from the Microsoft Learn pages linked here; not an ExamTopics question.' : k.review.verdict === 'corrected' ? 'This reviewed answer differs from the one ExamTopics shows.' : 'The reviewed answer agrees with ExamTopics.' }),
              k.review.ref ? h('a', { href: k.review.ref, target: '_blank', rel: 'noopener noreferrer' }, 'Reference ', icon('external')) : null))));
      }
      if (q.explanation) {
        const ex = h('div', { class: 'rich', html: q.explanation });
        if (termsOn) highlightTerms(ex, seenTerms, q.exam.code);
        f.append(h('section', { class: 'section' }, h('h3', { text: 'Explanation' }), ex));
      }
      const terms = learnTerms(q, k);
      if (terms.length) {
        const search = t => `https://learn.microsoft.com/en-us/search/?terms=${encodeURIComponent(t)}`;
        f.append(h('section', { class: 'section' }, h('h3', { text: 'Look it up' }),
          h('p', { class: 'small muted', text: `${q.explanation || q.extra ? 'Check the documentation for the terms this question turns on.' : 'ExamTopics gives no explanation, so read the discussion and check the documentation for the terms this question turns on.'}` }),
          h('div', { class: 'row terms' },
            terms.map(t => h('a', { class: 'chip', href: search(t), target: '_blank', rel: 'noopener noreferrer' }, t, icon('external'))),
            h('a', { class: 'btn sm', href: search(terms.join(' ')), target: '_blank', rel: 'noopener noreferrer' }, 'Search Microsoft Learn', icon('external')))));
      }
      f.append(discussion(q), notesSection(q), h('div', { class: 'row' }, h('span', { class: 'spacer' }), nextButton(false)));
      return f;
    }

    function resultBanner() {
      const ok = e.ok;
      const unanswered = area ? !(e.fill || []).some(v => v != null) : graded && !e.pick;
      const partly = !ok && area && e.score && e.score[0] > 0;
      const node = h('div', { class: `result ${ok ? 'good' : partly ? 'partial' : 'bad'}`, role: 'status' },
        icon(ok ? 'check' : partly ? 'alert' : 'x'),
        h('span', { text: ok ? 'Correct' : unanswered ? 'Not answered' : partly ? 'Partly correct' : 'Incorrect' }));
      if (area && !ok && e.score) node.append(h('span', { class: 'detail', text: `${e.score[0]} of ${plural(e.score[1], 'box', 'boxes')} right · the answers are shown in the boxes above` }));
      else if (graded && !ok) node.append(h('span', { class: 'detail', text: `Answer: ${k.active}${e.pick ? ` · you chose ${e.pick}` : ''}` }));
      if (e.overridden) node.append(h('span', { class: 'detail', text: 'Counted as correct by you' }));
      if (!ok && ctx.onOverride) {
        node.append(h('span', { class: 'spacer' }), h('button', {
          class: 'btn sm ghost', type: 'button', onclick: ctx.onOverride,
          title: graded ? 'Use this when you are sure the answer key is wrong' : 'Change your self-grade',
        }, 'Count as correct'));
      }
      return node;
    }

    function areaKeySection() {
      const sec = h('section', { class: 'section' }, h('h3', { text: 'Answer key' }));
      if (k.review) {
        const diff = k.official.filter((v, i) => v !== k.reviewed[i]).length;
        sec.append(h('div', { class: 'keys' },
          h('div', { class: 'key reviewed' + (k.source === 'reviewed' ? ' active' : '') },
            h('div', { class: 'label' }, 'Reviewed answer', k.source === 'reviewed' ? h('span', { class: 'chip accent', text: 'Used for grading' }) : null, confidenceChip(k.review.confidence)),
            h('div', { class: 'small', text: q.extra ? 'Authored for this app, with its Learn references under Why.' : diff ? `Differs from ExamTopics on ${plural(diff, 'box', 'boxes')}; each box above shows both.` : 'Agrees with the ExamTopics answer for every box.' }))));
      }
      if (k.community) {
        const boxes = k.official.filter((v, i) => v !== k.community[i]).length;
        const which = plural(boxes, 'box', 'boxes');
        sec.append(h('div', { class: 'dispute-note' }, icon('alert'), h('div', { class: 'stack', style: 'gap:6px' },
          h('span', {
            text: k.source === 'community'
              ? `Graded against the most-upvoted comments, which disagree with the ExamTopics answer on ${which}. Each of those boxes also shows the ExamTopics answer.`
              : k.source === 'reviewed'
                ? `Graded against the reviewed answer. The most-upvoted comments disagree with the ExamTopics answer on ${which}; every box that differs shows the other answers too.`
                : `Graded against the ExamTopics answer (see Settings). The most-upvoted comments disagree on ${which}; each of those boxes shows their answer too.`,
          }),
          area.dispute ? h('span', { class: 'small', text: area.dispute }) : null)));
      } else if (area.dispute) {
        sec.append(h('div', { class: 'dispute-note' }, icon('alert'),
          h('span', { text: `${k.source === 'reviewed' ? 'Graded against the reviewed answer. Some upvoted comments disagree with ExamTopics' : 'Graded against the ExamTopics answer, but some upvoted comments disagree'}: ${area.dispute} Read the explanation and the discussion and decide for yourself.` })));
      } else if (!k.review) {
        sec.append(h('p', { class: 'small muted', text: 'Graded against the answer ExamTopics shows. No upvoted comment disputes it.' }));
      }
      const originals = [area.area, ...Object.keys(area.exhibits || {})].filter(Boolean);
      if (originals.length) sec.append(h('details', { class: 'originals' },
        h('summary', null, icon('image'), 'Original ExamTopics images'),
        h('div', { class: 'rich' },
          h('p', { class: 'small muted', text: 'The interactive question was transcribed from these images. If something looks off, trust the images.' }),
          originals.map(src => h('p', null, h('img', { src, alt: 'Original exhibit', loading: 'lazy' }))),
          q.answerHtml ? h('div', { html: q.answerHtml }) : null)));
      return sec;
    }

    function keySection() {
      const total = totalVotes(q);
      const usedCommunity = k.source === 'community';
      const usedOfficial = k.source === 'official';
      const usedTag = h('span', { class: 'chip accent', text: 'Used for grading' });
      const sec = h('section', { class: 'section' }, h('h3', { text: 'Answer key' }),
        h('div', { class: 'keys' },
          k.review ? h('div', { class: 'key reviewed' + (k.source === 'reviewed' ? ' active' : '') },
            h('div', { class: 'label' }, 'Reviewed answer', k.source === 'reviewed' ? usedTag.cloneNode(true) : null),
            h('div', { class: 'val', text: k.reviewed }),
            h('div', { class: 'small muted' }, confidenceChip(k.review.confidence), q.extra ? ' authored for this app' : k.review.verdict === 'corrected' ? ' differs from ExamTopics' : ' agrees with ExamTopics')) : null,
          q.extra ? null : h('div', { class: 'key' + (usedOfficial ? ' active' : '') },
            h('div', { class: 'label' }, 'ExamTopics answer', usedOfficial ? usedTag.cloneNode(true) : null),
            h('div', { class: 'val', text: k.official || '—' })),
          q.extra ? null : h('div', { class: 'key' + (usedCommunity ? ' active' : '') },
            h('div', { class: 'label' }, 'Community vote', usedCommunity ? usedTag.cloneNode(true) : null),
            h('div', { class: 'val', text: k.community || (k.split ? k.split.join(' / ') : '—') }),
            h('div', { class: 'small muted', text: !total ? 'No votes yet' : k.split ? `Tied · ${plural(total, 'vote')}` : `${k.top ? `${k.top.p}% of ` : ''}${plural(total, 'vote')}` }))));
      if (k.disputed) {
        const why = k.source === 'reviewed' ? 'the reviewed answer' : usedCommunity ? 'the community answer'
          : k.split ? 'the ExamTopics answer, because the vote is tied'
            : k.trusted ? 'the ExamTopics answer (see Settings)' : `the ExamTopics answer, because fewer than ${MIN_VOTES} people voted`;
        const parts = [];
        if (k.reviewed && k.reviewed !== k.official) parts.push(`The reviewed answer (${k.reviewed}) disagrees with the ExamTopics answer (${k.official})`);
        if (k.split) parts.push(`The community vote is split between ${k.split.join(' and ')}`);
        else if (k.community && k.community !== k.official) parts.push(`The community vote (${k.community}) disagrees with the ExamTopics answer (${k.official})`);
        if (k.reviewed && k.community && k.community !== k.reviewed && !k.split) parts.push(`The community vote (${k.community}) also differs from the reviewed answer`);
        sec.append(h('div', { class: 'dispute-note' }, icon('alert'),
          h('span', { text: `${parts.join('. ')}. Grading uses ${why}. Read the explanation and the discussion and decide for yourself.` })));
      }
      if (q.pooledFrom && q.pooledFrom.length) {
        const byKey = new Map();
        for (const p of q.pooledFrom) if (p.official) byKey.set(p.official, [...(byKey.get(p.official) || []), `#${p.q.n}`]);
        const keys = [...byKey].map(([a, ns]) => `${a} for ${ns.join(', ')}`).join('; ');
        const other = q.pooledFrom.filter(p => !p.official).length;
        sec.append(h('p', { class: 'small muted' },
          `ExamTopics lists this question again as ${q.pooledFrom.map(p => `#${p.q.n}`).join(', ')}, with the choices reshuffled. The votes here pool all copies, and each copy's ExamTopics answer counts as one vote` +
          `${keys ? ` (${keys} in this question's letters` : ''}${other ? `${keys ? '; ' : ' ('}${other === 1 ? 'one copy answers' : `${other} copies answer`} with a choice this copy does not offer` : ''}${keys || other ? ')' : ''}. `,
          h('a', { href: `#/q/${q.exam.slug}/${q.n}`, text: 'Read the copies side by side.' })));
      }
      if (votesFor(q).length) sec.append(h('div', { class: 'votes', 'aria-label': 'Community vote distribution' }, voteRows(q, k)));
      return sec;
    }

    // ---- keyboard
    card.handleKey = ev => {
      const key = ev.key;
      if (graded && !revealed && !locked && /^[a-f1-6]$/i.test(key)) {
        const letter = /\d/.test(key) ? (order[Number(key) - 1] || {}).k : key.toUpperCase();
        if (!q.choices.some(c => c.k === letter)) return false;
        pick(letter);
        return true;
      }
      switch (key) {
        case 'Enter':
          if (mode === 'practice' && !revealed) {
            if (!graded) ctx.onReveal();
            else if (widget ? widget.filled() : e.pick) ctx.onCheck();
          } else {
            ctx.nav.next();
          }
          return true;
        case 'ArrowRight':
          ctx.nav.next();
          return true;
        case 'ArrowLeft':
          if (ctx.nav.hasPrev) ctx.nav.prev();
          return true;
        case 'm': case 'M':
          toggleFlag();
          return true;
        case 's': case 'S':
          if (!q.case) return false;
          ctx.toggleCase();
          return true;
        case 'y': case 'Y': case 'n': case 'N':
          if (!revealed || graded || e.ok != null || !ctx.onGrade) return false;
          ctx.onGrade(key.toLowerCase() === 'y');
          return true;
        default:
          return false;
      }
    };
    return card;
  }


  // ================================================================== guide: Microsoft concept guide
  //
  // data/guide.js (built by tools/build_guide.py from data/guide/*.md) holds chapters and a glossary in
  // Chinese, every entry linking the Microsoft Learn page it was checked against. Glossary terms are
  // highlighted in question text (first occurrence per term per card) and open a popover.

  const GUIDE = window.GUIDE || null;
  const CHAPTERS = GUIDE ? GUIDE.chapters : [];
  const GLOSSARY = GUIDE ? GUIDE.glossary : [];
  const TERM = new Map(GLOSSARY.map(t => [t.id, t]));
  const chapterById = id => CHAPTERS.find(c => c.id === id);
  for (const t of GLOSSARY) t.search = [t.term, ...t.aliases, t.zh, t.text].join(' ').toLowerCase();
  const termLetter = t => { const c = t.term[0].toUpperCase(); return /[A-Z]/.test(c) ? c : '#'; };
  const examChip = code => h('span', { class: 'chip code', text: code });

  let termRe = null;
  const termIndex = new Map();
  function termMatcher() {
    if (termRe) return termRe;
    const alts = [];
    for (const [alias, id] of GUIDE.hl) { // longest alias first, so "Azure AI Search" wins over "AI Search"
      termIndex.set(alias.toLowerCase(), id);
      alts.push(escapeRe(alias));
      // Proper nouns ("Teams", "Face") match as written; common nouns also match capitalized at a sentence start.
      if (alias === alias.toLowerCase()) alts.push(escapeRe(alias[0].toUpperCase() + alias.slice(1)));
    }
    termRe = new RegExp('(?<![\\w.-])(?:' + alts.join('|') + ')(?![\\w-])', 'g');
    return termRe;
  }

  const NO_HL = 'a, code, pre, kbd, button, input, select, textarea, .term-hl, .letter, .mark';
  function highlightTerms(root, seen, examCode) {
    if (!GUIDE || !root) return;
    const re = termMatcher();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (n.nodeValue.trim() && !(n.parentElement && n.parentElement.closest(NO_HL))) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const nodes = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) nodes.push(n);
    for (const node of nodes) {
      const text = node.nodeValue;
      const parts = [];
      let last = 0;
      re.lastIndex = 0;
      for (let m = re.exec(text); m; m = re.exec(text)) {
        const id = termIndex.get(m[0].toLowerCase());
        if (!id || seen.has(id) || (examCode && !TERM.get(id).exams.includes(examCode))) continue; // only this exam's vocabulary
        seen.add(id);
        parts.push(text.slice(last, m.index), termLink(id, m[0]));
        last = m.index + m[0].length;
      }
      if (!parts.length) continue;
      parts.push(text.slice(last));
      node.replaceWith(...parts);
    }
  }
  function termLink(id, label) {
    const t = TERM.get(id);
    return h('a', { class: 'term-hl', href: `#/guide/glossary/${id}`, 'data-term': id, 'data-tip': t.zh, 'data-tipSub': '点击看解释', text: label });
  }

  const termPop = h('div', { class: 'term-pop', role: 'dialog', 'aria-label': '术语解释', hidden: true });
  function openTerm(anchor, id) {
    const t = TERM.get(id);
    if (!t) return;
    const ch = t.chapter && chapterById(t.chapter);
    put(termPop,
      h('div', { class: 'tp-head' }, h('b', { text: t.term }),
        h('button', { class: 'icon-btn', type: 'button', 'aria-label': '关闭', onclick: closeTerm }, icon('x'))),
      h('div', { class: 'tp-zh', text: t.zh }),
      h('div', { class: 'tp-body guide-prose', html: t.html }),
      h('div', { class: 'tp-links' },
        ch ? h('a', { href: `#/guide/${ch.id}${t.section ? '/' + t.section : ''}` }, icon('guide'), `第 ${ch.n} 章 · ${ch.short}`) : null,
        h('a', { href: `#/guide/glossary/${id}` }, icon('list'), '术语表'),
        t.ref ? h('a', { href: t.ref, target: '_blank', rel: 'noopener noreferrer' }, 'Microsoft Learn ', icon('external')) : null));
    termPop.hidden = false;
    hideTip();
    const r = anchor.getBoundingClientRect();
    const p = termPop.getBoundingClientRect();
    let top = r.bottom + 8;
    if (top + p.height > innerHeight - 8) top = Math.max(8, r.top - p.height - 8);
    termPop.style.left = clamp(r.left, 8, innerWidth - p.width - 8) + 'px';
    termPop.style.top = top + 'px';
    termPop.scrollTop = 0;
  }
  const closeTerm = () => { termPop.hidden = true; };

  function guideCard() {
    if (!GUIDE) return null;
    return h('section', { class: 'section' }, h('h2', { text: 'Guide' }),
      h('div', { class: 'card guide-card' },
        h('div', null,
          h('h3', { text: 'Microsoft 概念指南' }),
          h('p', { class: 'muted', text: `${plural(CHAPTERS.length, 'chapter')} and ${plural(GLOSSARY.length, 'glossary term')} explaining, in Chinese, the Microsoft products and vocabulary the questions assume. Every entry was checked against the current Microsoft Learn page and links to it.` })),
        h('div', { class: 'row guide-chips' },
          CHAPTERS.map(c => h('a', { class: 'chip', href: `#/guide/${c.id}` }, `${c.n}. ${c.short}`)),
          h('a', { class: 'chip accent', href: '#/guide/glossary' }, '术语表 A–Z')),
        h('div', { class: 'card-actions' }, h('a', { class: 'btn primary', href: '#/guide' }, icon('guide'), '打开指南'))));
  }

  function viewGuide() {
    if (!GUIDE) return navigate('#/');
    setTabs('guide');
    setTitle('指南');
    const input = h('input', { type: 'search', placeholder: '查一个术语：Entra ID、solution、ALM、PTU…', 'aria-label': '搜索术语', autocomplete: 'off' });
    const form = h('form', { class: 'guide-search', role: 'search' }, icon('search'), input, h('button', { class: 'btn primary', type: 'submit' }, '查术语'));
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const q = input.value.trim();
      navigate(`#/guide/glossary${q ? '?q=' + encodeURIComponent(q) : ''}`);
    });
    const practiceCount = c => Object.values(c.practice).reduce((n, l) => n + l.length, 0);
    mount(h('div', { class: 'page guide' },
      h('div', { class: 'page-head' }, h('div', null,
        h('h1', { text: 'Microsoft 概念指南' }),
        h('p', { class: 'sub', text: `面向 AB-620、AB-100、AI-103 的基础概念手册：用中文解释微软的产品和术语，英文名保留，方便对照题目。内容按 Microsoft Learn 当前页面核对（${fmtDay(parseDay(GUIDE.generated))}），每节附来源链接。` }))),
      form,
      h('div', { class: 'guide-chapters' }, CHAPTERS.map(c => h('a', { class: 'card guide-chapter', href: `#/guide/${c.id}` },
        h('div', { class: 'row' }, h('span', { class: 'chip accent', text: `第 ${c.n} 章` }), c.exams.map(examChip)),
        h('h2', { text: c.title }),
        h('p', { class: 'muted', text: c.intro }),
        h('div', { class: 'small muted', text: `${c.sections.length} 节${practiceCount(c) ? ` · ${practiceCount(c)} 组练习题` : ''}${c.skills && examBySlug(c.skills) && examBySlug(c.skills).skills ? ` · 官方考纲 ${examBySlug(c.skills).skills.groups.reduce((n, g) => n + g.areas.reduce((m, a) => m + a.bullets.length, 0), 0)} 条逐条讲解，每节可直接练题` : ''}` })))),
      h('div', { class: 'grid-2' },
        h('div', { class: 'card stack' }, h('h2', { text: '怎么用' }),
          h('ul', { class: 'guide-howto' },
            h('li', null, '先通读第 1 章，知道 Azure、Microsoft 365、Power Platform、Dynamics 365 各管什么，再看和你要考的科目相关的章节。'),
            h('li', null, '做题时，题干、选项和解释里的术语会', h('span', { class: 'term-hl demo', text: '这样标出' }), '，点一下就能看中文解释和 Microsoft Learn 链接（模拟考试里不标；可在 Settings 关闭）。'),
            h('li', null, '每章末尾有「练这一章的题」，按知识点直接开一组练习。'),
            h('li', null, '术语表按 A–Z 排列，英文、缩写、中文都能搜；顶部搜索框搜题时也会顺带列出匹配的术语。'))),
        h('div', { class: 'card stack' }, h('h2', { text: '术语表' }),
          h('p', { class: 'muted', text: `${GLOSSARY.length} 条术语，每条有中文释义、所属章节和 Microsoft Learn 来源。` }),
          h('div', { class: 'row gloss-letters' }, [...new Set(GLOSSARY.map(termLetter))].sort().map(l => h('a', { href: `#/guide/glossary?letter=${l}` }, l))),
          h('div', null, h('a', { class: 'btn', href: '#/guide/glossary' }, icon('list'), '打开术语表'))))));
  }

  function practiceSection(ch) {
    const groups = Object.entries(ch.practice).map(([slug, kps]) => [examBySlug(slug), kps]).filter(([e]) => e);
    if (!groups.length) return null;
    return h('section', { class: 'guide-section' }, h('h2', { text: '练这一章的题' }),
      h('p', { class: 'small muted', text: '按知识点开一组练习题；「浏览」则带答案通读。' }),
      groups.map(([exam, kps]) => h('div', { class: 'stack' },
        h('div', { class: 'row' }, h('span', { class: 'chip code accent', text: exam.code }), h('span', { class: 'small muted', text: exam.title })),
        h('div', { class: 'quick-actions' }, kps.map(kp => {
          const n = exam.questions.filter(q => q.kp === kp).length;
          return h('div', { class: 'qa practice-qa' }, h('span', { class: 'qa-icon' }, icon('target')),
            h('button', { class: 'linkish qa-title', type: 'button', onclick: () => startSession(exam, { mode: 'practice', title: kp, ids: buildPool(exam, { kp }) }) }, kp),
            h('span', { class: 'qa-sub' }, `${n} 题 · `, h('a', { href: `#/browse/${exam.slug}?kp=${encodeURIComponent(kp)}` }, '浏览')));
        })))));
  }

  // A chapter that follows an exam's skills-measured outline (front matter "skills: ab-620") has one section per
  // sub-area, with ids a1, b2, …: each gets the bank's questions on that sub-area to practice.
  function skillPracticeRow(ch, s) {
    const exam = ch.skills && examBySlug(ch.skills);
    if (!exam || !exam.skills || !/^[a-z]\d+$/.test(s.id)) return null;
    const scope = s.id.toUpperCase();
    const qs = skillQuestions(exam, scope);
    const st = stats(qs);
    return h('div', { class: 'row skill-practice' },
      h('span', { class: 'small muted', text: qs.length ? `题库里 ${qs.length} 题考这个子领域${st.seen ? `，已做 ${st.seen}${st.attempts ? `，正确率 ${pct(st.correct, st.attempts)}%` : ''}` : ''}` : '题库里还没有这个子领域的题' }),
      h('span', { class: 'spacer' }),
      qs.length ? h('button', { class: 'btn sm', type: 'button', onclick: () => startSession(exam, { mode: 'practice', title: `${scope} ${skillTitle(exam, scope).replace(/^\S+\s/, '')}`, ids: qs.map(q => q.id) }) }, icon('play'), '练这一节') : null,
      h('a', { class: 'btn sm ghost', href: `#/exam/${exam.slug}` }, `${exam.code} 考纲总览`));
  }

  function viewGuideChapter(id, sectionId) {
    const ch = chapterById(id);
    if (!ch) return navigate('#/guide');
    setTabs('guide');
    setTitle(ch.title, '指南');
    const i = CHAPTERS.indexOf(ch);
    const prev = CHAPTERS[i - 1];
    const next = CHAPTERS[i + 1];
    const toc = h('nav', { class: 'guide-toc', 'aria-label': '目录' },
      h('div', { class: 'toc-group' }, h('div', { class: 'toc-title', text: '本章' }),
        ch.sections.map(s => h('a', { href: `#/guide/${ch.id}/${s.id}`, class: s.id === sectionId ? 'active' : null, text: s.title }))),
      h('div', { class: 'toc-group' }, h('div', { class: 'toc-title', text: '全部章节' }),
        CHAPTERS.map(c => h('a', { href: `#/guide/${c.id}`, class: c.id === ch.id ? 'current' : null, text: `${c.n}. ${c.short}` })),
        h('a', { href: '#/guide/glossary', text: '术语表 A–Z' })));
    const terms = GLOSSARY.filter(t => t.chapter === ch.id);
    const body = h('article', { class: 'guide-body' },
      h('div', { class: 'page-head' }, h('div', null,
        h('div', { class: 'row', style: 'margin-bottom:8px' }, h('span', { class: 'chip accent', text: `第 ${ch.n} 章` }), ch.exams.map(examChip)),
        h('h1', { text: ch.title }),
        ch.intro ? h('p', { class: 'sub', text: ch.intro }) : null)),
      ch.lead ? h('div', { class: 'guide-prose', html: ch.lead }) : null,
      ch.sections.map(s => h('section', { class: 'guide-section', id: `sec-${s.id}` },
        h('h2', null, h('a', { href: `#/guide/${ch.id}/${s.id}`, text: s.title })),
        skillPracticeRow(ch, s),
        h('div', { class: 'guide-prose', html: s.html }))),
      terms.length ? h('section', { class: 'guide-section' }, h('h2', { text: '本章术语' }),
        h('div', { class: 'row terms' }, terms.map(t => h('a', { class: 'chip term', 'data-term': t.id, href: `#/guide/glossary/${t.id}`, 'data-tip': t.zh }, t.term)))) : null,
      practiceSection(ch),
      h('div', { class: 'guide-nav' },
        prev ? h('a', { class: 'btn', href: `#/guide/${prev.id}` }, icon('left'), `上一章：${prev.short}`) : h('a', { class: 'btn', href: '#/guide' }, icon('left'), '指南首页'),
        h('span', { class: 'spacer' }),
        next ? h('a', { class: 'btn primary', href: `#/guide/${next.id}` }, `下一章：${next.short}`, icon('right')) : h('a', { class: 'btn primary', href: '#/guide/glossary' }, '术语表 A–Z', icon('right'))));
    mount(h('div', { class: 'page guide' }, h('div', { class: 'guide-layout' }, toc, body)));
    if (sectionId) {
      const el = document.getElementById(`sec-${sectionId}`);
      if (el) el.scrollIntoView();
    }
  }

  function viewGlossary(focusId, params) {
    if (!GUIDE) return navigate('#/');
    setTabs('guide');
    setTitle('术语表', '指南');
    const state = { q: params.get('q') || '', exam: params.get('exam') || '' };
    const input = h('input', { type: 'search', value: state.q, placeholder: '英文、缩写或中文', 'aria-label': '搜索术语', autocomplete: 'off' });
    input.addEventListener('input', () => { state.q = input.value; update(); });
    const examBtns = h('div', { class: 'segmented', role: 'group', 'aria-label': '按考试筛选' });
    const count = h('div', { class: 'small muted' });
    const letters = h('div', { class: 'gloss-letters', role: 'navigation', 'aria-label': 'A–Z' });
    const list = h('div', { class: 'gloss-list' });

    function drawExamBtns() {
      put(examBtns, [['', '全部'], ...EXAMS.map(e => [e.code, e.code])].map(([v, label]) => h('button', {
        type: 'button', 'aria-pressed': String(state.exam === v), onclick: () => { state.exam = v; drawExamBtns(); update(); },
      }, label)));
    }
    function entryNode(t) {
      const ch = t.chapter && chapterById(t.chapter);
      return h('div', { class: 'gloss-entry' + (t.id === focusId ? ' focus' : ''), id: `term-${t.id}` },
        h('div', { class: 'gloss-head' }, h('h3', { text: t.term }), h('span', { class: 'gloss-zh', text: t.zh }), h('span', { class: 'spacer' }), t.exams.map(examChip)),
        t.aliases.length ? h('div', { class: 'small muted', text: `也写作：${t.aliases.join('、')}` }) : null,
        h('div', { class: 'guide-prose', html: t.html }),
        h('div', { class: 'row small gloss-links' },
          ch ? h('a', { href: `#/guide/${ch.id}${t.section ? '/' + t.section : ''}` }, icon('guide'), `第 ${ch.n} 章 · ${ch.short}`) : null,
          t.see.map(s => TERM.get(s)).filter(Boolean).map(s => h('a', { class: 'chip', href: `#/guide/glossary/${s.id}`, title: s.zh }, s.term)),
          t.ref ? h('a', { href: t.ref, target: '_blank', rel: 'noopener noreferrer' }, 'Microsoft Learn ', icon('external')) : null));
    }
    function update() {
      const s = state.q.trim().toLowerCase();
      const words = s.split(/\s+/).filter(Boolean);
      const hit = t => (t.term.toLowerCase() === s ? 4 : 0) + (t.aliases.some(a => a.toLowerCase() === s) ? 3 : 0) + (t.term.toLowerCase().startsWith(s) ? 2 : 0) + (t.zh.includes(s) ? 1 : 0);
      const items = GLOSSARY.filter(t => (!state.exam || t.exams.includes(state.exam)) && words.every(w => t.search.includes(w)))
        .sort((a, b) => (words.length ? hit(b) - hit(a) : 0) || a.term.localeCompare(b.term));
      count.textContent = words.length ? `${items.length} 条术语匹配` : `${items.length} 条术语`;
      const groups = new Map();
      if (words.length) groups.set('', items);
      else for (const t of items) groups.set(termLetter(t), [...(groups.get(termLetter(t)) || []), t]);
      put(letters, words.length ? null : [...groups.keys()].map(l => h('a', {
        href: `#/guide/glossary?letter=${l}`,
        onclick: ev => { ev.preventDefault(); const el = document.getElementById(`letter-${l}`); if (el) el.scrollIntoView(); },
      }, l)));
      put(list, items.length
        ? [...groups].map(([l, ts]) => h('div', { class: 'gloss-group', id: l ? `letter-${l}` : null }, l ? h('div', { class: 'gloss-letter', text: l }) : null, ts.map(entryNode)))
        : h('div', { class: 'empty', text: '没有匹配的术语。换个写法试试：英文全称、缩写或中文。' }));
      const qs = new URLSearchParams(Object.entries({ q: state.q, exam: state.exam }).filter(([, v]) => v));
      history.replaceState(null, '', `#/guide/glossary${focusId && !state.q ? '/' + focusId : ''}${qs.toString() ? '?' + qs : ''}`);
    }
    drawExamBtns();
    mount(h('div', { class: 'page guide' },
      h('div', { class: 'page-head' }, h('div', null, h('h1', { text: '术语表' }),
        h('p', { class: 'sub', text: '英文术语配中文释义，按 A–Z 排列；每条都附 Microsoft Learn 来源和所属章节。' }))),
      h('div', { class: 'row', style: 'gap:10px' }, h('label', { class: 'field', style: 'flex:1 1 280px' }, '搜索', input), examBtns),
      letters, count, list));
    update();
    const letter = params.get('letter');
    const target = focusId ? document.getElementById(`term-${focusId}`) : letter ? document.getElementById(`letter-${letter}`) : null;
    if (target) target.scrollIntoView();
    else if (!state.q) input.focus();
  }

  // ================================================================== shared session layout (practice, read, review, mock)

  // Whether the case-study panel is open: a preference of this device (open by default on wide screens), kept in
  // its settings so it never travels with a synced session or mock exam.
  const caseOpen = () => (S.settings.caseOpen ??= innerWidth >= 1280);

  function sessionLayout({ getCase, setCase }) {
    const nav = h('aside', { class: 'navigator', 'aria-label': 'Questions in this session' });
    const stage = h('section', { class: 'stage' });
    const casePanel = h('aside', { class: 'case-panel', 'aria-label': 'Case study', hidden: true });
    const scrim = h('div', { class: 'scrim', onclick: () => setCase(false) });
    const root = h('div', { class: 'session' }, nav, stage, casePanel, scrim);

    function drawCase(q) {
      const c = q.case && q.exam.cases[q.case];
      const show = !!(c && getCase());
      root.classList.toggle('case-open', show);
      casePanel.hidden = !show;
      if (!show || casePanel.dataset.case === q.case) return;
      casePanel.dataset.case = q.case;
      casePanel.replaceChildren(
        h('header', null, icon('case'),
          h('div', null, h('div', { class: 'small muted', text: 'Case study' }), h('div', { class: 'name', text: c.name })),
          h('span', { class: 'spacer' }),
          h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Close case study', onclick: () => setCase(false) }, icon('x'))),
        h('div', { class: 'case-scroll' }, h('div', { class: 'rich', html: c.html })));
    }

    function navGrid(ids, current, cls, jump) {
      return h('div', { class: 'nav-grid' }, ids.map((id, i) => {
        const q = QUESTIONS.get(id);
        return h('button', {
          type: 'button', class: [cls(id, q), i === current ? 'current' : ''].join(' '),
          'aria-label': `Question ${q.n}`, 'aria-current': i === current ? 'step' : null,
          'data-tip': `Question ${q.n}`, 'data-tip-sub': TYPE_LABEL[q.type],
          onclick: () => { nav.classList.remove('open'); jump(i); },
        }, String(q.n));
      }));
    }

    const mobileBar = (label, title) => h('div', { class: 'row nav-toggle' },
      h('button', { class: 'btn sm', type: 'button', 'aria-label': 'Show question list', onclick: () => nav.classList.toggle('open') }, icon('menu'), label),
      h('span', { class: 'small muted', text: title }));

    return { root, nav, stage, drawCase, navGrid, mobileBar };
  }

  const legendItem = (label, style) => h('span', null, h('i', { style }), label);

  // ================================================================== views: practice / read / review sessions

  const MODE_LABEL = { practice: 'Practice', read: 'Read-through', review: 'Mock exam review' };

  function startSession(exam, { key = exam.code, mode, title, ids, i = 0, mockId }) {
    if (!ids.length) {
      toast('No questions match that selection.');
      return;
    }
    S.sessions[key] = { code: exam.code, mode, title, ids, i, res: {}, mockId, created: Date.now() };
    store.save();
    navigate(`#/s/${key === exam.code ? exam.slug : key}`);
  }

  function viewSession(param) {
    const key = param === 'read' || param === 'review' ? param : (examBySlug(param) || {}).code;
    const s = key && S.sessions[key];
    const exam = s && examByCode(s.code);
    if (!exam) return navigate('#/');
    const mock = s.mode === 'review' ? S.mocks.find(m => m.id === s.mockId) : null;
    if (s.mode === 'review' && !mock) return navigate(`#/exam/${exam.slug}`);
    s.ids = s.ids.filter(id => QUESTIONS.has(id));
    if (!s.ids.length) {
      delete S.sessions[key];
      S.gone['session:' + key] = Date.now();
      store.save();
      return navigate(`#/exam/${exam.slug}`);
    }
    setTabs(exam.slug);
    setTitle(s.title, exam.code);

    const L = sessionLayout({ getCase: caseOpen, setCase });
    let card = null;
    mount(L.root, {
      key: ev => (card ? card.handleKey(ev) : false),
      escape: () => setCase(false),
      live: () => S.sessions[key] === s && (!mock || S.mocks.includes(mock)), // untouched by a sync merge
    });

    const peek = id => (mock ? mock.items.find(it => it.id === id) : s.res[id]);
    const entry = id => (mock ? peek(id) : (s.res[id] = s.res[id] || {}));

    // Progress is stamped, so a sync merge with another device's copy of this session keeps the
    // position of whichever was used last and the newer version of each answer.
    function touch(e) {
      const now = Date.now();
      s.u = now;
      if (e) {
        e.u = now;
        if (mock) mock.u = now; // review mode: the entries belong to the mock result
      }
      store.save();
    }

    function jump(i) {
      s.i = clamp(i, 0, s.ids.length);
      touch();
      draw(true);
    }

    function setCase(open) {
      if (caseOpen() === open) return;
      S.settings.caseOpen = open;
      store.save();
      draw(false);
    }

    function draw(scroll) {
      if (s.i >= s.ids.length) return summary();
      L.root.classList.remove('done');
      L.nav.hidden = false;
      const q = QUESTIONS.get(s.ids[s.i]);
      const e = entry(q.id);
      const k = answerKey(q);
      if (mock && k && e.key) k.active = e.key; // review against the key the exam was scored with
      const redraw = () => { touch(e); draw(false); };
      card = questionCard(q, {
        mode: s.mode,
        pos: `${s.i + 1} of ${s.ids.length}`,
        entry: e,
        key: k,
        caseOpen: !!(q.case && caseOpen()),
        toggleCase: () => setCase(!caseOpen()),
        nav: {
          hasPrev: s.i > 0, hasNext: s.i < s.ids.length - 1,
          prev: () => jump(s.i - 1), next: () => jump(s.i + 1),
          lastLabel: mock ? 'Back to results' : 'Finish',
        },
        onCheck() {
          e.done = true;
          if (interactive(q)) {
            const res = gradeArea(q.area, e.fill, k.active);
            e.score = [res.filter(Boolean).length, res.length];
            e.ok = res.every(Boolean);
          } else {
            e.ok = e.pick === k.active;
          }
          e.key = k.active;
          e.before = record(q, e.ok);
          redraw();
        },
        onReveal() {
          e.done = true;
          e.ok = null;
          redraw();
        },
        onGrade(ok) {
          e.ok = ok;
          e.before = record(q, ok);
          if (mock) scoreMock(mock);
          redraw();
        },
        onOverride() {
          if (undo(q, e.before)) e.before = record(q, true);
          e.ok = true;
          if (e.pts != null) e.pts = 1;
          e.overridden = true;
          if (mock) scoreMock(mock);
          redraw();
        },
        onChange: () => touch(e),
        onFlag: drawNav,
      });
      L.stage.replaceChildren(L.mobileBar(`${s.i + 1} / ${s.ids.length}`, s.title), card);
      hideTip();
      drawNav();
      L.drawCase(q);
      if (scroll) scrollTo({ top: 0 });
    }

    function drawNav() {
      const graded = s.ids.filter(id => { const e = peek(id); return e && e.ok != null; });
      const right = graded.filter(id => peek(id).ok).length;
      const cls = (id, q) => {
        const e = peek(id);
        return [
          e && e.ok === true ? 'ok' : e && e.ok === false ? 'ko' : e && (e.done || mock) && selfGraded(q) ? 'pending' : '',
          isFlagged(q) ? 'flagged' : '',
        ].join(' ');
      };
      put(L.nav,
        h('div', null, h('div', { class: 'nav-title', text: s.title }), h('div', { class: 'nav-sub', text: `${exam.code} · ${MODE_LABEL[s.mode]}` })),
        s.mode === 'read' ? null : h('div', { class: 'stack', style: 'gap:6px' },
          h('div', { class: 'row small muted' },
            h('span', { text: `${graded.length} of ${s.ids.length} graded` }),
            h('span', { class: 'spacer' }),
            graded.length ? h('b', { style: 'color:var(--ink)', text: `${pct(right, graded.length)}% correct` }) : null),
          meter(graded.length, s.ids.length, 'Session progress')),
        L.navGrid(s.ids, s.i, cls, jump),
        s.mode === 'read' ? null : h('div', { class: 'nav-legend' },
          legendItem('Correct', 'background:var(--good-wash);border-color:var(--good)'),
          legendItem('Wrong', 'background:var(--bad-wash);border-color:var(--bad)'),
          s.ids.some(id => selfGraded(QUESTIONS.get(id))) ? legendItem('Needs your grade', 'border-color:var(--warn)') : null,
          legendItem('Flagged', 'background:var(--warn);border-color:var(--warn);border-radius:50%')),
        mock
          ? h('a', { class: 'btn sm', href: `#/result/${mock.id}` }, icon('left'), 'Back to results')
          : h('button', { class: 'btn sm', type: 'button', onclick: () => jump(s.ids.length) }, 'End session'));
    }

    function summary() {
      if (mock) return navigate(`#/result/${mock.id}`);
      card = null;
      L.root.classList.remove('case-open');
      L.root.classList.add('done');
      L.nav.hidden = true;
      const graded = s.ids.map(id => s.res[id]).filter(e => e && e.ok != null);
      const right = graded.filter(e => e.ok).length;
      const wrong = s.ids.filter(id => s.res[id] && s.res[id].ok === false);
      L.stage.replaceChildren(h('div', { class: 'summary' }, h('div', { class: 'card stack' },
        h('h1', { text: s.mode === 'read' ? 'End of the list' : 'Session complete' }),
        s.mode === 'read'
          ? h('p', { class: 'muted', text: `You read through ${plural(s.ids.length, 'question')}.` })
          : h('div', { class: 'score-hero' },
            h('div', { class: 'big' }, graded.length ? String(pct(right, graded.length)) : '—', graded.length ? h('small', { text: '%' }) : null),
            h('div', { class: 'stack', style: 'gap:4px' },
              h('div', { text: `${right} correct · ${graded.length - right} wrong · ${s.ids.length - graded.length} skipped or ungraded` }),
              h('div', { class: 'muted small', text: `${s.title} · ${exam.code}` }))),
        h('div', { class: 'row' },
          wrong.length ? h('button', {
            class: 'btn primary', type: 'button',
            onclick: () => startSession(exam, { mode: 'practice', title: 'Retry mistakes', ids: wrong }),
          }, icon('repeat'), `Retry the ${wrong.length} you missed`) : null,
          h('button', { class: 'btn', type: 'button', onclick: () => jump(0) }, 'Back to the first question'),
          h('a', { class: 'btn ghost', href: `#/exam/${exam.slug}` }, `${exam.code} overview`)))));
      scrollTo({ top: 0 });
    }

    draw(true);
  }

  // ================================================================== view: home

  function viewHome() {
    setTabs(null);
    setTitle();
    const all = EXAMS.flatMap(e => e.questions);
    const st = stats(all);
    const today = S.activity[dayKey(Date.now())] || { n: 0, c: 0 };
    const week = lastDays(7);
    const days = streak();
    const hour = new Date().getHours();

    mount(h('div', { class: 'page' },
      store.persistent ? null : h('div', { class: 'banner', text: 'This browser is blocking local storage, so your progress will not be kept after you close the tab.' }),
      h('div', { class: 'page-head' }, h('div', null,
        h('h1', { text: hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' }),
        h('p', { class: 'sub', text: `${plural(EXAMS.length, 'exam')} · ${plural(all.length, 'question')} · question bank from ${fmtDay(parseDay(BANK.generated))}` }))),
      h('div', { class: 'tiles' },
        tile('Answered today', today.n, today.n ? `${pct(today.c, today.n)}% correct` : 'Nothing yet today'),
        tile('Day streak', days, days ? 'Keep it going' : 'Answer a question to start one'),
        tile('Due for review', st.due, st.due ? 'Spaced-repetition queue' : 'All caught up'),
        tile('Accuracy, last 7 days', week.n ? pct(week.c, week.n) : '—', week.n ? plural(week.n, 'answer') : 'No answers yet', week.n ? '%' : null),
        tile('Mastered', st.mastered, `of ${plural(all.length, 'question')}`)),
      h('section', { class: 'section' }, h('h2', { text: 'Exams' }), h('div', { class: 'exam-cards' }, EXAMS.map(examCard))),
      guideCard(),
      activityCard(),
      recentMocksCard()));
  }

  function examCard(exam) {
    const st = stats(exam.questions);
    const pl = planFor(exam);
    const s = S.sessions[exam.code];
    const live = s && s.i < s.ids.length;
    const figure = (value, label) => h('div', null, h('b', { text: value }), h('span', { text: label }));
    return h('div', { class: 'card exam-card' },
      h('div', { class: 'exam-card-head' },
        h('div', { class: 'row' }, h('span', { class: 'chip code accent', text: exam.code }), h('span', { class: 'small muted', text: plural(st.total, 'question') })),
        h('a', { class: 'title', href: `#/exam/${exam.slug}`, text: exam.title })),
      masteryBar(st),
      h('div', { class: 'exam-card-stats' },
        figure(`${pct(st.seen, st.total)}%`, 'seen'),
        figure(st.attempts ? `${pct(st.correct, st.attempts)}%` : '—', 'accuracy'),
        figure(String(st.due), 'due for review')),
      pl.date || pl.goal ? h('div', { class: 'plan-line small muted' }, icon('calendar'), h('span', {
        text: [pl.daysLeft != null ? (pl.daysLeft > 0 ? `exam in ${plural(pl.daysLeft, 'day')}` : pl.daysLeft === 0 ? 'exam day' : 'exam date passed') : '',
          pl.goal ? `today ${pl.doneToday} of ${pl.goal}` : ''].filter(Boolean).join(' · '),
      })) : null,
      h('div', { class: 'card-actions' },
        live
          ? h('a', { class: 'btn primary', href: `#/s/${exam.slug}` }, icon('play'), 'Resume')
          : h('button', { class: 'btn primary', type: 'button', onclick: () => continueInOrder(exam) }, icon('play'), st.seen ? 'Continue' : 'Start'),
        st.due ? h('button', { class: 'btn', type: 'button', onclick: () => startPool(exam, 'due') }, icon('repeat'), 'Review', h('span', { class: 'count', text: st.due })) : null,
        h('a', { class: 'btn', href: S.mock && S.mock.code === exam.code ? '#/mock' : `#/mock/${exam.slug}` }, icon('clock'), 'Mock exam'),
        h('a', { class: 'btn ghost', href: `#/exam/${exam.slug}` }, 'Details')));
  }

  function activityCard() {
    const WEEKS = 18;
    const today = startOfDay(Date.now());
    const first = addDays(today, -today.getDay() - (WEEKS - 1) * 7);
    const grid = h('div', { class: 'heatmap' });
    const weeks = [];
    for (let w = 0; w < WEEKS; w++) {
      const ws = addDays(first, w * 7);
      const label = (w === 0 && ws.getDate() <= 21) || (w > 0 && ws.getDate() <= 7);
      grid.append(h('span', { class: 'month', text: label ? ws.toLocaleDateString(undefined, { month: 'short' }) : '' }));
      const week = { start: ws, n: 0, c: 0 };
      for (let d = 0; d < 7; d++) {
        const day = addDays(ws, d);
        if (day > today) {
          grid.append(h('span', { class: 'cell future' }));
          continue;
        }
        const a = S.activity[dayKey(day)] || { n: 0, c: 0 };
        week.n += a.n;
        week.c += a.c;
        const level = !a.n ? 0 : a.n < 10 ? 1 : a.n < 25 ? 2 : a.n < 50 ? 3 : 4;
        grid.append(h('span', {
          class: 'cell', 'data-l': level, tabindex: a.n ? 0 : null,
          'data-tip': a.n ? plural(a.n, 'answer') : 'No answers',
          'data-tip-sub': fmtDay(day) + (a.n ? ` · ${pct(a.c, a.n)}% correct` : ''),
        }));
      }
      weeks.push(week);
    }
    const chart = h('div', { class: 'heatmap-wrap', role: 'img', 'aria-label': `Answers per day over the last ${WEEKS} weeks` },
      h('div', { class: 'heatmap-days', 'aria-hidden': 'true' }, ['', 'Mon', '', 'Wed', '', 'Fri', ''].map(d => h('span', { text: d }))),
      grid);
    const recent = weeks.filter(w => w.n).reverse().slice(0, 8);
    const table = h('table', { class: 'data-table', hidden: true },
      h('thead', null, h('tr', null, h('th', { text: 'Week of' }), h('th', { class: 'n', text: 'Answers' }), h('th', { class: 'n', text: 'Correct' }))),
      h('tbody', null, recent.length
        ? recent.map(w => h('tr', null, h('td', { text: fmtDay(w.start) }), h('td', { class: 'n', text: w.n }), h('td', { class: 'n', text: `${pct(w.c, w.n)}%` })))
        : h('tr', null, h('td', { colspan: 3, class: 'muted', text: 'No activity yet' }))));
    const toggle = h('button', {
      class: 'btn sm ghost', type: 'button',
      onclick: () => {
        table.hidden = !table.hidden;
        chart.hidden = !table.hidden;
        scale.hidden = !table.hidden;
        toggle.textContent = table.hidden ? 'Show as table' : 'Show as chart';
      },
    }, 'Show as table');
    const scale = h('span', { class: 'scale', 'aria-hidden': 'true' }, 'Fewer ',
      [0, 1, 2, 3, 4].map(l => h('i', { style: `background:var(--heat-${l})` })), ' More');
    const total = weeks.reduce((n, w) => n + w.n, 0);
    return h('div', { class: 'card stack' },
      h('div', { class: 'section-head' },
        h('h2', { text: 'Activity' }),
        h('span', { class: 'small muted', text: `${plural(total, 'answer')} in the last ${WEEKS} weeks` }),
        h('span', { class: 'spacer' }), scale, toggle),
      chart, table);
  }

  function recentMocksCard() {
    const list = S.mocks.filter(m => m.score != null).sort((a, b) => b.end - a.end).slice(0, 5);
    if (!list.length) return null;
    return h('div', { class: 'card stack' }, h('h2', { text: 'Recent mock exams' }), mockList(list, true));
  }

  function mockList(list, showExam) {
    return h('div', { class: 'list' }, list.map(m => {
      const pending = m.items.filter(i => i.ok == null).length;
      return h('a', { class: 'list-row', href: `#/result/${m.id}` },
        h('span', { class: 'qn', text: `${m.score}%` }),
        h('div', { style: 'min-width:0' },
          h('div', { text: `${showExam ? m.code + ' · ' : ''}${fmtDay(m.end)}` }),
          h('div', { class: 'sub' }, h('span', { text: `${m.correct} of ${m.graded} correct · ${plural(m.items.length, 'question')}` }),
            pending ? h('span', { class: 'chip warn', text: `${pending} to self-grade` }) : null)),
        h('span', { class: 'tags' }, passChip(m.score)));
    }));
  }

  // ================================================================== view: exam overview

  const POOL_TITLE = { all: 'All questions', new: 'Unseen questions', mistakes: 'Mistakes', due: 'Review due', flagged: 'Flagged' };

  function buildPool(exam, f) {
    const now = Date.now();
    let list = exam.questions.filter(q =>
      (!f.topic || q.topic === Number(f.topic)) &&
      (!f.kp || q.kp === f.kp) &&
      (!f.sk || q.sk.some(id => inScope(id, f.sk))) &&
      (!f.type || (f.type === 'choice' ? q.choices.length > 0 : f.type === 'interactive' ? interactive(q) : f.type === 'self' ? selfGraded(q) : q.type === f.type)) &&
      (f.pool === 'new' ? status(q) === 'new'
        : f.pool === 'mistakes' ? isMistake(q)
          : f.pool === 'due' ? isDue(q, now)
            : f.pool === 'flagged' ? isFlagged(q) : true));
    if (f.order === 'shuffle') list = shuffle(list);
    else if (f.pool === 'due') list.sort((a, b) => prog(a.id).d - prog(b.id).d); // most overdue first
    if (f.limit) list = list.slice(0, Number(f.limit));
    return list.map(q => q.id);
  }

  const startPool = (exam, pool) => startSession(exam, { mode: 'practice', title: POOL_TITLE[pool], ids: buildPool(exam, { pool }) });

  function continueInOrder(exam) {
    const i = exam.questions.findIndex(q => status(q) === 'new');
    startSession(exam, { mode: 'practice', title: 'All questions, in order', ids: exam.questions.map(q => q.id), i: Math.max(0, i) });
  }

  function quickAction({ iconName, title, sub, onclick, href, primary, disabled }) {
    const kids = [h('span', { class: 'qa-icon' }, icon(iconName)), h('span', { class: 'qa-title', text: title }), h('span', { class: 'qa-sub', text: sub })];
    const cls = 'qa' + (primary ? ' primary' : '');
    return href ? h('a', { class: cls, href }, kids) : h('button', { class: cls, type: 'button', onclick, disabled }, kids);
  }

  function viewExam(exam) {
    if (!exam) return navigate('#/');
    setTabs(exam.slug);
    setTitle(exam.code);
    const st = stats(exam.questions);
    const s = S.sessions[exam.code];
    const live = s && s.i < s.ids.length;
    const mocks = finishedMocks(exam.code);
    const best = mocks.length ? Math.max(...mocks.map(m => m.score)) : null;
    const firstNew = exam.questions.find(q => status(q) === 'new');
    const mockLive = S.mock && S.mock.code === exam.code;

    mount(h('div', { class: 'page' },
      h('div', { class: 'page-head' },
        h('div', null,
          h('div', { class: 'row', style: 'margin-bottom:8px' },
            h('span', { class: 'chip code accent', text: exam.code }),
            h('span', { class: 'small muted', text: multiTopic(exam) ? `${plural(st.total, 'question')} · ${plural(exam.topics.length, 'topic')}` : plural(st.total, 'question') })),
          h('h1', { text: exam.title })),
        h('span', { class: 'spacer' }),
        h('a', { class: 'btn sm ghost', href: exam.url, target: '_blank', rel: 'noopener noreferrer' }, 'ExamTopics', icon('external'))),
      h('div', { class: 'tiles' },
        tile('Seen', pct(st.seen, st.total), `${st.seen} of ${st.total} questions`, '%'),
        tile('Accuracy', st.attempts ? pct(st.correct, st.attempts) : '—', st.attempts ? `${st.correct} of ${plural(st.attempts, 'attempt')} correct` : 'No attempts yet', st.attempts ? '%' : null),
        tile('Mastered', st.mastered, 'Right 3 times in a row, spaced out'),
        tile('Due for review', st.due, st.due ? 'Ready now' : 'Nothing due'),
        tile('Best mock exam', best == null ? '—' : best, best == null ? 'No mock exams yet' : plural(mocks.length, 'attempt'), best == null ? null : '%')),
      h('div', { class: 'grid-2' }, h('div', { class: 'card stack' }, h('h2', { text: 'Progress' }), masteryBar(st)), planCard(exam)),
      skillsCard(exam),
      h('section', { class: 'section' }, h('h2', { text: 'Study' }), h('div', { class: 'quick-actions' },
        live ? quickAction({ iconName: 'play', title: 'Resume session', sub: `${s.title} · ${s.i + 1} of ${s.ids.length}`, href: `#/s/${exam.slug}`, primary: true }) : null,
        quickAction({
          iconName: live ? 'list' : 'play', primary: !live, onclick: () => continueInOrder(exam),
          title: firstNew ? (st.seen ? 'Continue in order' : 'Start in order') : 'Practice everything',
          sub: firstNew ? `Next unseen: question ${firstNew.n}` : 'Every question seen at least once',
        }),
        quickAction({ iconName: 'repeat', title: 'Review due', sub: st.due ? `${plural(st.due, 'question')} ready` : 'Nothing due right now', onclick: () => startPool(exam, 'due'), disabled: !st.due }),
        quickAction({ iconName: 'target', title: 'Mistakes', sub: st.mistakes ? `${st.mistakes} last answered wrong` : 'No mistakes to fix', onclick: () => startPool(exam, 'mistakes'), disabled: !st.mistakes }),
        quickAction({ iconName: 'flag', title: 'Flagged', sub: st.flagged ? plural(st.flagged, 'question') : 'Flag questions to collect them here', onclick: () => startPool(exam, 'flagged'), disabled: !st.flagged }),
        quickAction({
          iconName: 'clock', title: mockLive ? 'Resume mock exam' : 'Mock exam', href: mockLive ? '#/mock' : `#/mock/${exam.slug}`,
          sub: `${Math.min(S.settings.mockSize, st.total)} questions · ${S.settings.mockMinutes ? S.settings.mockMinutes + ' min' : 'untimed'}`,
        }),
        quickAction({
          iconName: 'book', title: 'Read through', sub: 'Answers and discussion shown',
          onclick: () => startSession(exam, { key: 'read', mode: 'read', title: `Read through ${exam.code}`, ids: exam.questions.map(q => q.id) }),
        }),
        quickAction({ iconName: 'list', title: 'Browse & search', sub: 'Filter the full question list', href: `#/browse/${exam.slug}` }),
        GUIDE ? quickAction({ iconName: 'guide', title: '概念指南', sub: 'Microsoft 术语的中文解释', href: '#/guide' }) : null)),
      builderCard(exam),
      h('div', { class: 'grid-2' }, multiTopic(exam) ? breakdownCard(exam, 'By topic', 'Topic', exam.topics.map(t => [topicLabel(exam, t.n), q => q.topic === t.n])) : null,
        breakdownCard(exam, 'By question type', 'Type', [...new Set(exam.questions.map(q => q.type))].map(t => [TYPE_LABEL[t] || t, q => q.type === t]))),
      exam.kps.length ? breakdownCard(exam, 'By knowledge point', 'Knowledge point', exam.kps.map(kp => [kp, q => q.kp === kp])) : null,
      casesCard(exam),
      mockHistoryCard(exam)));
  }

  function planCard(exam) {
    const pl = planFor(exam);
    const date = h('input', { type: 'date', value: pl.date, 'aria-label': 'Exam date' });
    const goal = h('input', { type: 'number', min: 0, max: 500, value: pl.goal || '', placeholder: 'e.g. 20', 'aria-label': 'Questions per day' });
    const save = () => {
      S.plan[exam.code] = { date: date.value || '', goal: clamp(Number(goal.value) || 0, 0, 500), u: Date.now() };
      store.save();
      route();
    };
    date.addEventListener('change', save);
    goal.addEventListener('change', save);
    const mastered = pct(pl.st.mastered, pl.st.total);
    const facts = [];
    if (pl.daysLeft != null) facts.push(pl.daysLeft > 0 ? `${plural(pl.daysLeft, 'day')} to the exam` : pl.daysLeft === 0 ? 'exam day' : 'the exam date has passed');
    if (pl.perDay != null) facts.push(pl.unseen ? `see ${pl.perDay} new ${pl.perDay === 1 ? 'question' : 'questions'} a day to finish a first pass in time` : 'every question seen at least once');
    facts.push(`${mastered}% mastered`);
    if (pl.mockAvg != null) facts.push(`last ${plural(pl.mockCount, 'mock exam')}: ${pl.mockAvg}% average`);
    const verdict = pl.mockAvg == null ? ['Take a mock exam to estimate readiness', 'muted']
      : pl.mockAvg >= 70 && mastered >= 50 ? ['On track', 'good']
        : pl.mockAvg >= 70 ? ['Passing mock exams; keep reviewing', 'accent'] : ['Not yet: mock average below the pass line', 'warn'];
    return h('div', { class: 'card stack plan' },
      h('div', { class: 'section-head' }, h('h2', { text: 'Study plan' }), h('span', { class: 'spacer' }), h('span', { class: `chip ${verdict[1]}`, text: verdict[0] })),
      h('div', { class: 'builder' }, h('label', { class: 'field' }, 'Exam date', date), h('label', { class: 'field' }, 'Questions per day', goal)),
      pl.goal ? h('div', { class: 'stack', style: 'gap:4px' },
        h('div', { class: 'row small muted' }, h('span', { text: `Today: ${pl.doneToday} of ${pl.goal}` }), h('span', { class: 'spacer' }),
          pl.doneToday >= pl.goal ? h('span', { class: 'chip good' }, icon('check'), 'Goal reached') : null),
        meter(Math.min(pl.doneToday, pl.goal), pl.goal, 'Today')) : null,
      h('p', { class: 'small muted', text: pl.date || pl.goal ? facts.join(' · ') : 'Set an exam date and a daily goal to get a pace to keep.' }));
  }

  function builderCard(exam) {
    const select = (label, name, options) => h('label', { class: 'field' }, label,
      h('select', { name }, options.map(([v, t]) => h('option', { value: v }, t))));
    const types = [...new Set(exam.questions.map(q => q.type))].map(t => [t, TYPE_LABEL[t] || t]);
    const count = h('span', { class: 'small muted' });
    const form = h('form', { class: 'builder' },
      select('Questions', 'pool', [['all', 'All'], ['new', 'Not seen yet'], ['mistakes', 'Mistakes'], ['due', 'Due for review'], ['flagged', 'Flagged']]),
      multiTopic(exam) ? select('Topic', 'topic', [['', 'All topics'], ...exam.topics.map(t => [String(t.n), topicLabel(exam, t.n)])]) : null,
      exam.kps.length ? select('Knowledge point', 'kp', [['', 'All knowledge points'], ...exam.kps.map(kp => [kp, kp])]) : null,
      exam.skills ? select('Official skill area', 'sk', [['', 'All skill areas'], ...exam.skills.groups.flatMap(g => [
        [g.id, `${g.id}. ${g.title} (${g.pct[0]}–${g.pct[1]}%)`], ...g.areas.map(a => [a.id, ` ${a.id}. ${a.title}`])])]) : null,
      select('Type', 'type', [['', 'All types'], ['choice', 'Multiple choice (any)'], ['interactive', 'Drag & drop and hotspot'],
        ...(exam.questions.some(selfGraded) ? [['self', 'Graded by you (image only)']] : []), ...types]),
      select('Order', 'order', [['seq', 'In order'], ['shuffle', 'Shuffled']]),
      select('How many', 'limit', [['', 'All matching'], ['10', '10'], ['20', '20'], ['40', '40']]),
      select('Mode', 'mode', [['practice', 'Practice'], ['read', 'Read-through']]),
      h('button', { class: 'btn primary', type: 'submit' }, icon('play'), 'Start'));
    const read = () => Object.fromEntries(new FormData(form));
    const update = () => { count.textContent = `${plural(buildPool(exam, { ...read(), order: 'seq' }).length, 'question')} match`; };
    form.addEventListener('change', update);
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const f = read();
      const parts = [f.pool !== 'all' ? POOL_TITLE[f.pool] : 'Custom set', f.topic ? `Topic ${f.topic}` : '', f.kp || '', f.sk ? skillTitle(exam, f.sk) : '', f.type ? (TYPE_LABEL[f.type] || TYPE_GROUP[f.type]) : ''];
      startSession(exam, { key: f.mode === 'read' ? 'read' : exam.code, mode: f.mode, title: parts.filter(Boolean).join(' · '), ids: buildPool(exam, f) });
    });
    update();
    return h('div', { class: 'card stack' }, h('div', { class: 'section-head' }, h('h2', { text: 'Custom practice' }), h('span', { class: 'spacer' }), count), form);
  }

  function breakdownCard(exam, title, column, groups) {
    return h('div', { class: 'card stack' }, h('h2', { text: title }), h('div', { class: 'topic-rows' },
      h('div', { class: 'topic-row small muted' }, h('span', { text: column }), h('span', { text: 'Seen' }), h('span', { class: 'acc', style: 'font-weight:400', text: 'Accuracy' })),
      groups.map(([name, match]) => {
        const qs = exam.questions.filter(match);
        const st = stats(qs);
        return h('div', { class: 'topic-row' },
          h('button', {
            class: 'linkish name', type: 'button', title: 'Practice these questions',
            onclick: () => startSession(exam, { mode: 'practice', title: name, ids: qs.map(q => q.id) }),
          }, name),
          meter(st.seen, st.total, `${name}: ${st.seen} of ${st.total} seen`),
          h('span', { class: 'acc', text: st.attempts ? `${pct(st.correct, st.attempts)}%` : '—' }),
          h('div', { class: 'meta', text: `${plural(st.total, 'question')} · ${st.seen} seen · ${st.mastered} mastered` }));
      })));
  }

  // The official blueprint: Microsoft's "skills measured" for the exam, each objective with the questions that
  // test it and your results on them. An objective with no questions is where the ExamTopics bank is blind,
  // so the Guide and the official Learn material matter most there.
  function skillsCard(exam) {
    const sk = exam.skills;
    if (!sk) return null;
    const mapped = exam.questions.filter(q => q.sk.length);
    const bullets = sk.groups.flatMap(g => g.areas.flatMap(a => a.bullets));
    const gaps = bullets.filter(b => !skillQuestions(exam, b.id).length).length;
    const practice = (scope, title) => startSession(exam, { mode: 'practice', title, ids: skillQuestions(exam, scope).map(q => q.id) });
    const accText = st => (st.attempts ? `${pct(st.correct, st.attempts)}%` : '—');
    const bulletRow = b => {
      const qs = skillQuestions(exam, b.id);
      const st = stats(qs);
      return h('div', { class: 'obj-row' + (qs.length ? '' : ' gap') },
        h('span', { class: 'obj-id', text: b.id }),
        h('div', { class: 'obj-main' },
          h('div', { class: 'obj-text', text: b.text }),
          b.zh ? h('div', { class: 'obj-zh', text: b.zh }) : null,
          b.guide.length || b.learn.length ? h('div', { class: 'obj-links' },
            b.guide.map(ref => h('a', { href: `#/guide/${ref}` }, icon('guide'), '指南')),
            b.learn.map((u, i) => h('a', { href: u, target: '_blank', rel: 'noopener noreferrer' }, `Learn${b.learn.length > 1 ? ' ' + (i + 1) : ''}`, icon('external')))) : null),
        qs.length ? h('button', {
          class: 'btn sm', type: 'button', title: `Practice the ${plural(qs.length, 'question')} on this objective`,
          onclick: () => practice(b.id, `${b.id} ${b.text}`),
        }, h('span', { class: 'count', text: String(qs.length) }), accText(st)) : h('span', { class: 'chip warn', title: 'No ExamTopics question tests this objective yet', text: 'No questions' }));
    };
    const areaBlock = a => {
      const qs = skillQuestions(exam, a.id);
      const st = stats(qs);
      return h('div', { class: 'skill-area' },
        h('div', { class: 'skill-area-head' },
          h('span', { text: `${a.id}. ${a.title}` }),
          h('span', { class: 'small muted', text: `${plural(qs.length, 'question')}${st.attempts ? ` · ${accText(st)} accuracy` : ''}` }),
          h('span', { class: 'spacer' }),
          qs.length ? h('button', { class: 'btn sm ghost', type: 'button', onclick: () => practice(a.id, `${a.id} ${a.title}`) }, icon('play'), 'Practice') : null),
        a.bullets.map(bulletRow));
    };
    const groupBlock = g => {
      const qs = skillQuestions(exam, g.id);
      const st = stats(qs);
      const share = mapped.length ? pct(qs.length, mapped.length) : 0;
      return h('details', { class: 'skill-group' },
        h('summary', null,
          h('span', { class: 'name' }, icon('chevDown'), h('span', { class: 'name-text', text: `${g.id}. ${g.title}` }), h('span', { class: 'chip accent', title: 'Official weight of this group on the exam', text: `${g.pct[0]}–${g.pct[1]}%` })),
          meter(st.seen, st.total, `${g.title}: ${st.seen} of ${st.total} seen`),
          h('span', { class: 'acc', text: accText(st) }),
          h('div', { class: 'meta', text: `${plural(qs.length, 'question')} in the bank (${share}% of mapped questions vs ${g.pct[0]}–${g.pct[1]}% on the exam) · ${st.seen} seen · ${st.mastered} mastered` })),
        g.areas.map(areaBlock));
    };
    return h('div', { class: 'card stack' },
      h('div', null,
        h('div', { class: 'section-head' },
          h('h2', { text: 'Official skills measured' }),
          h('span', { class: 'spacer' }),
          h('a', { href: sk.source, target: '_blank', rel: 'noopener noreferrer', class: 'small' }, 'Study guide', icon('external'))),
        h('p', { class: 'small muted', style: 'margin-top:4px' },
          `Microsoft's blueprint for ${exam.code}, as of ${fmtDay(parseDay(sk.asof))}. ${plural(mapped.length, 'question')} of ${exam.questions.length} are mapped to its ${plural(bullets.length, 'objective')}; ` +
          `${gaps ? `${gaps} objectives have no question in the bank yet, so study those from the Guide and Learn.` : 'every objective has at least one question.'} ` +
          'Open a group to see each objective, practice it, or jump to where it is explained.')),
      h('div', { class: 'stack', style: 'gap:10px' }, sk.groups.map(groupBlock)));
  }

  function casesCard(exam) {
    const groups = new Map();
    for (const q of exam.questions) {
      if (!q.case) continue;
      const name = exam.cases[q.case].name;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(q);
    }
    if (!groups.size) return null;
    return h('div', { class: 'card stack' },
      h('div', null, h('h2', { text: 'Case studies' }), h('p', { class: 'small muted', style: 'margin-top:4px', text: 'Groups of questions that share one long scenario. The scenario opens next to the question.' })),
      h('div', { class: 'case-list' }, [...groups].map(([name, qs]) => h('div', { class: 'case-item' }, icon('case'),
        h('div', null, h('div', { class: 'name', text: name }), h('div', { class: 'small muted', text: `${plural(qs.length, 'question')} · ${stats(qs).seen} seen` })),
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn sm', type: 'button', onclick: () => startSession(exam, { mode: 'practice', title: `Case: ${name}`, ids: qs.map(q => q.id) }) }, 'Practice')))));
  }

  function mockHistoryCard(exam) {
    const done = finishedMocks(exam.code);
    const card = h('div', { class: 'card stack' }, h('div', { class: 'section-head' },
      h('h2', { text: 'Mock exam scores' }), h('span', { class: 'spacer' }),
      h('a', { class: 'btn sm', href: `#/mock/${exam.slug}` }, icon('clock'), 'New mock exam')));
    if (!done.length) {
      card.append(h('div', { class: 'empty', text: 'No mock exams yet. A mock exam draws a random set of questions under a time limit and scores you at the end.' }));
      return card;
    }
    card.append(h('div', { class: 'chart' }, scoreChart(done)), mockList(done.slice().reverse(), false));
    return card;
  }

  // Single series (score per attempt) with a labelled pass reference line; the list below is its table view.
  function scoreChart(results) {
    const W = 640;
    const H = 190;
    const L = 40;
    const R = 16;
    const T = 14;
    const B = 28;
    const n = results.length;
    const x = i => (n === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (n - 1));
    const y = v => T + ((100 - v) * (H - T - B)) / 100;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': `Mock exam scores, oldest to newest: ${results.map(r => r.score + '%').join(', ')}` });
    for (const v of [0, 50, 100]) {
      svg.append(svgEl('line', { class: 'gridline', x1: L, x2: W - R, y1: y(v), y2: y(v) }));
      svg.append(svgEl('text', { class: 'axis-label', x: L - 8, y: y(v) + 4, 'text-anchor': 'end' }, `${v}%`));
    }
    svg.append(svgEl('line', { class: 'ref', x1: L, x2: W - R, y1: y(70), y2: y(70) }));
    svg.append(svgEl('text', { class: 'ref-label', x: W - R, y: y(70) - 6, 'text-anchor': 'end' }, 'Pass ≈ 70%'));
    const first = results[0];
    const last = results[n - 1];
    svg.append(svgEl('text', { class: 'axis-label', x: x(0), y: H - 8, 'text-anchor': n === 1 ? 'middle' : 'start' }, fmtDay(first.end)));
    if (n > 1) svg.append(svgEl('text', { class: 'axis-label', x: x(n - 1), y: H - 8, 'text-anchor': 'end' }, fmtDay(last.end)));
    const cross = svgEl('line', { class: 'crosshair', y1: T, y2: H - B, visibility: 'hidden' });
    svg.append(cross);
    if (n > 1) svg.append(svgEl('polyline', { class: 'series', points: results.map((r, i) => `${x(i)},${y(r.score)}`).join(' ') }));
    const dots = results.map((r, i) => svgEl('circle', { class: 'dot', cx: x(i), cy: y(r.score), r: 4.5 }));
    svg.append(...dots);
    svg.addEventListener('pointermove', ev => {
      const box = svg.getBoundingClientRect();
      const sx = ((ev.clientX - box.left) * W) / box.width;
      let i = 0;
      for (let j = 1; j < n; j++) if (Math.abs(x(j) - sx) < Math.abs(x(i) - sx)) i = j;
      const r = results[i];
      cross.setAttribute('x1', x(i));
      cross.setAttribute('x2', x(i));
      cross.setAttribute('visibility', 'visible');
      dots.forEach((d, j) => d.setAttribute('r', j === i ? 6 : 4.5));
      showTipAt(box.left + (x(i) * box.width) / W, box.top + (y(r.score) * box.height) / H, `${r.score}%`, `${fmtDay(r.end)} · ${r.correct} of ${r.graded} correct`);
    });
    svg.addEventListener('pointerleave', () => {
      cross.setAttribute('visibility', 'hidden');
      dots.forEach(d => d.setAttribute('r', 4.5));
      hideTip();
    });
    return svg;
  }

  // ================================================================== views: mock exam

  // A mock exam can follow the official blueprint: each skill group gets its share of the questions by the
  // midpoint of its weight range, drawn at random from the questions mapped to it (by their primary objective).
  // Unmapped questions and any shortfall in a group are filled from whatever is left.
  function pickWeighted(exam, pool, size) {
    const groups = exam.skills.groups;
    const byGroup = new Map(groups.map(g => [g.id, []]));
    const rest = [];
    for (const q of shuffle(pool)) {
      const g = q.sk[0] ? q.sk[0][0] : null;
      if (byGroup.has(g)) byGroup.get(g).push(q);
      else rest.push(q);
    }
    const mids = groups.map(g => (g.pct[0] + g.pct[1]) / 2);
    const total = mids.reduce((a, b) => a + b, 0);
    const picked = [];
    const leftover = [];
    groups.forEach((g, i) => {
      const want = Math.round((size * mids[i]) / total);
      const list = byGroup.get(g.id);
      picked.push(...list.slice(0, want));
      leftover.push(...list.slice(want));
    });
    for (const q of shuffle([...rest, ...leftover])) {
      if (picked.length >= size) break;
      picked.push(q);
    }
    return shuffle(picked.slice(0, size));
  }

  function viewMockSetup(exam) {
    if (!exam) return navigate('#/');
    setTabs(exam.slug);
    setTitle('Mock exam', exam.code);
    const total = exam.questions.length;
    const exhibits = exam.questions.filter(q => !q.choices.length).length;
    const manual = exam.questions.filter(selfGraded).length;
    const series = exam.questions.filter(q => q.series).length;
    const other = S.mock ? examByCode(S.mock.code) : null;
    const form = h('form', { class: 'stack' },
      h('div', { class: 'builder' },
        h('label', { class: 'field' }, 'Number of questions', h('input', { type: 'number', name: 'size', min: 1, max: total, value: Math.min(S.settings.mockSize, total), required: true })),
        h('label', { class: 'field' }, 'Time limit in minutes (0 = untimed)', h('input', { type: 'number', name: 'minutes', min: 0, max: 600, value: S.settings.mockMinutes })),
        multiTopic(exam) ? h('label', { class: 'field' }, 'Topic', h('select', { name: 'topic' },
          h('option', { value: '' }, 'All topics'), exam.topics.map(t => h('option', { value: t.n }, topicLabel(exam, t.n))))) : null),
      h('label', { class: 'check' }, h('input', { type: 'checkbox', name: 'images', checked: S.settings.mockImages }),
        `Include drag & drop and hotspot questions (${exhibits} of ${total})${manual ? ` — ${manual} of them you grade yourself after the exam` : ''}`),
      series ? h('label', { class: 'check' }, h('input', { type: 'checkbox', name: 'lock', checked: S.settings.mockLock }),
        `Lock series questions once you move on, as in the real exam (${series} in this exam)`) : null,
      exam.skills ? h('label', { class: 'check' }, h('input', { type: 'checkbox', name: 'weighted', checked: S.settings.mockWeighted !== false }),
        `Follow the official blueprint: ${exam.skills.groups.map(g => `${g.title} ${g.pct[0]}–${g.pct[1]}%`).join(', ')}`) : null,
      h('div', { class: 'row' }, h('button', { class: 'btn primary lg', type: 'submit' }, icon('play'), 'Start mock exam')));

    form.addEventListener('submit', async ev => {
      ev.preventDefault();
      const f = new FormData(form);
      const size = clamp(Number(f.get('size')) || 1, 1, total);
      const minutes = clamp(Number(f.get('minutes')) || 0, 0, 600);
      const images = f.get('images') === 'on';
      const topic = f.get('topic');
      const lock = series ? f.get('lock') === 'on' : S.settings.mockLock;
      const weighted = !!exam.skills && f.get('weighted') === 'on';
      Object.assign(S.settings, { mockSize: size, mockMinutes: minutes, mockImages: images, mockLock: lock, mockWeighted: exam.skills ? weighted : S.settings.mockWeighted });
      const pool = exam.questions.filter(q => (images || q.choices.length) && (!topic || q.topic === Number(topic)));
      if (!pool.length) return toast('No questions match those options.');
      if (S.mock && !(await ask('Replace the unfinished mock exam?', 'Its answers will be discarded.', 'Start new exam'))) return;
      // as in the real exam, a case study's questions sit together, ahead of the rest
      const picked = weighted ? pickWeighted(exam, pool, size) : shuffle(pool).slice(0, size);
      const byCase = new Map();
      const rest = [];
      for (const q of picked) {
        if (!q.case) rest.push(q);
        else if (byCase.has(q.case)) byCase.get(q.case).push(q);
        else byCase.set(q.case, [q]);
      }
      const ids = [...[...byCase.values()].flat(), ...rest].map(q => q.id);
      S.mock = { id: uid(), code: exam.code, ids, i: 0, items: {}, start: Date.now(), minutes, lock };
      store.commit();
      navigate('#/mock');
    });

    mount(h('div', { class: 'page', style: 'max-width:820px' },
      h('div', { class: 'page-head' }, h('div', null,
        h('div', { class: 'row', style: 'margin-bottom:8px' }, h('span', { class: 'chip code accent', text: exam.code })),
        h('h1', { text: 'Mock exam' }),
        h('p', { class: 'sub', text: exam.title }))),
      other ? h('div', { class: 'banner row' },
        h('span', { text: `You have an unfinished ${other.code} mock exam (${Object.keys(S.mock.items).length} of ${S.mock.ids.length} touched).` }),
        h('span', { class: 'spacer' }),
        h('a', { class: 'btn sm primary', href: '#/mock' }, 'Resume')) : null,
      h('div', { class: 'card stack' },
        h('p', { text: `Questions are drawn at random. There is no feedback until you finish; use “Mark for review” to come back to a question. ${manual ? 'Questions are scored automatically, except the few shown only as images, which you grade yourself afterwards.' : 'Everything is scored automatically.'} As in the real exam, drag & drop and hotspot questions earn partial credit for each correct box.` }),
        h('p', { class: 'muted small', text: 'Microsoft exams report a scaled score where 700 out of 1000 passes. Here the score is the plain percentage of correct answers, so treat 70% as a rough pass line.' }),
        form)));
  }

  function viewMock() {
    const m = S.mock;
    const exam = m && examByCode(m.code);
    if (!exam) {
      if (m) {
        S.gone['mock:' + m.id] = Date.now(); // its exam is no longer in the bank
        S.mock = null;
        store.save();
      }
      return navigate('#/');
    }
    m.ids = m.ids.filter(id => QUESTIONS.has(id));
    setTabs(exam.slug);
    setTitle('Mock exam', exam.code);

    const L = sessionLayout({ getCase: caseOpen, setCase });
    const clockText = h('span');
    const timer = h('span', { class: 'timer', role: 'timer' }, icon('clock'), clockText);
    const answeredText = h('span', { class: 'small muted' });
    const root = h('div', { class: 'with-mockbar' },
      h('div', { class: 'mockbar' },
        h('span', { class: 'chip code accent', text: exam.code }),
        h('b', { text: 'Mock exam' }),
        answeredText,
        h('span', { class: 'spacer' }),
        m.minutes ? timer : h('span', { class: 'small muted', text: 'Untimed' }),
        h('button', { class: 'btn primary sm', type: 'button', onclick: () => finish(false) }, 'Finish exam')),
      L.root);
    let card = null;
    let interval = 0;
    mount(root, {
      key: ev => (card ? card.handleKey(ev) : false),
      escape: () => setCase(false),
      leave: () => clearInterval(interval),
      live: () => S.mock === m, // untouched by a sync merge
    });

    const item = id => (m.items[id] = m.items[id] || {});
    const answered = id => {
      const it = m.items[id];
      const q = QUESTIONS.get(id);
      return !!(it && (interactive(q) ? (it.fill || []).some(v => v != null) : selfGraded(q) ? (it.note || '').trim() : it.pick));
    };

    function tick() {
      const left = m.start + m.minutes * 60e3 - Date.now();
      clockText.textContent = fmtClock(Math.max(0, left));
      timer.classList.toggle('low', left < 10 * 60e3 && left >= 5 * 60e3);
      timer.classList.toggle('critical', left < 5 * 60e3);
      if (left <= 0) {
        clearInterval(interval);
        finish(true);
      }
    }

    function setCase(open) {
      if (caseOpen() === open) return;
      S.settings.caseOpen = open;
      store.save();
      draw(false);
    }

    // stamped like a practice session's progress (see viewSession)
    function touch(it) {
      const now = Date.now();
      m.u = now;
      if (it) it.u = now;
      store.save();
    }

    // Returns the series question's entry when moving on locks it.
    function leave() {
      const q = QUESTIONS.get(m.ids[m.i]);
      if (!(m.lock && q && q.series && answered(q.id))) return null;
      const it = item(q.id);
      it.locked = true;
      return it;
    }

    function jump(i) {
      const locked = leave();
      m.i = clamp(i, 0, m.ids.length - 1);
      touch(locked);
      draw(true);
    }

    function draw(scroll) {
      const q = QUESTIONS.get(m.ids[m.i]);
      card = questionCard(q, {
        mode: 'mock',
        pos: `${m.i + 1} of ${m.ids.length}`,
        entry: item(q.id),
        key: answerKey(q),
        caseOpen: !!(q.case && caseOpen()),
        toggleCase: () => setCase(!caseOpen()),
        nav: {
          hasPrev: m.i > 0, hasNext: m.i < m.ids.length - 1,
          prev: () => jump(m.i - 1),
          next: () => (m.i < m.ids.length - 1 ? jump(m.i + 1) : finish(false)),
          lastLabel: 'Finish exam',
        },
        onChange: () => { touch(item(q.id)); drawNav(); },
        onFlag: drawNav,
      });
      L.stage.replaceChildren(L.mobileBar(`${m.i + 1} / ${m.ids.length}`, 'Mock exam'), card);
      hideTip();
      drawNav();
      L.drawCase(q);
      if (scroll) scrollTo({ top: 0 });
    }

    function drawNav() {
      const done = m.ids.filter(answered).length;
      const marked = m.ids.filter(id => m.items[id] && m.items[id].flag).length;
      answeredText.textContent = `${done} of ${m.ids.length} answered`;
      L.nav.replaceChildren(
        h('div', null, h('div', { class: 'nav-title', text: 'Mock exam' }), h('div', { class: 'nav-sub', text: `${exam.code} · ${plural(m.ids.length, 'question')}` })),
        h('div', { class: 'stack', style: 'gap:6px' },
          h('div', { class: 'row small muted' }, h('span', { text: `${done} answered` }), h('span', { class: 'spacer' }), marked ? h('span', { text: `${marked} marked` }) : null),
          meter(done, m.ids.length, 'Answered')),
        L.navGrid(m.ids, m.i, id => [answered(id) ? 'answered' : '', m.items[id] && m.items[id].flag ? 'flagged' : '', m.items[id] && m.items[id].locked ? 'locked' : ''].join(' '), jump),
        h('div', { class: 'nav-legend' },
          legendItem('Answered', 'background:var(--accent-wash-2);border-color:var(--accent)'),
          legendItem('Not answered', ''),
          legendItem('Marked for review', 'background:var(--warn);border-color:var(--warn);border-radius:50%'),
          m.lock && m.ids.some(id => QUESTIONS.get(id).series) ? legendItem('Locked series question', 'border-style:dashed;opacity:.6') : null));
    }

    async function finish(auto) {
      if (!auto) {
        const left = m.ids.filter(id => !answered(id)).length;
        const marked = m.ids.filter(id => m.items[id] && m.items[id].flag).length;
        const text = [left ? `${plural(left, 'question')} not answered.` : 'Every question has an answer.',
          marked ? `${plural(marked, 'question')} still marked for review.` : ''].join(' ');
        if (!(await ask('Finish the mock exam?', text, 'Finish and score'))) return;
      }
      if (S.mock !== m) return;
      leave();
      clearInterval(interval);
      const items = m.ids.map(id => {
        const q = QUESTIONS.get(id);
        const it = m.items[id] || {};
        if (selfGraded(q)) return { id, note: it.note || '', ok: null };
        const k = answerKey(q);
        if (interactive(q)) {
          const fill = Array.isArray(it.fill) && it.fill.length === k.active.length ? it.fill : k.active.map(() => null);
          const res = gradeArea(q.area, fill, k.active);
          const right = res.filter(Boolean).length;
          const r = { id, fill, tiles: it.tiles, key: k.active, ok: right === res.length, pts: right / res.length, score: [right, res.length] };
          if (fill.some(v => v != null)) r.before = record(q, r.ok);
          return r;
        }
        const r = { id, pick: it.pick || '', order: it.order, key: k.active, ok: (it.pick || '') === k.active };
        if (it.pick) r.before = record(q, r.ok);
        return r;
      });
      const result = { id: m.id, code: m.code, start: m.start, end: Date.now(), minutes: m.minutes, items };
      scoreMock(result);
      S.mocks.push(result);
      S.mock = null;
      store.commit();
      if (auto) toast('Time is up — the exam was submitted.');
      navigate(`#/result/${result.id}`);
    }

    draw(true);
    if (m.minutes) {
      interval = setInterval(tick, 1000);
      tick();
    }
  }

  function viewResult(id) {
    const r = S.mocks.find(m => m.id === id);
    const exam = r && examByCode(r.code);
    if (!exam) return navigate('#/');
    setTabs(exam.slug);
    setTitle('Mock exam result', exam.code);
    const items = r.items.filter(it => QUESTIONS.has(it.id));
    const pending = items.filter(it => it.ok == null);
    const wrong = items.filter(it => it.ok === false);
    const used = Math.max(1, Math.round((r.end - r.start) / 60e3));
    const review = (list, i, title) => startSession(exam, { key: 'review', mode: 'review', mockId: r.id, title, ids: list.map(it => it.id), i });

    const breakdown = (title, groups) => h('div', { class: 'card stack' }, h('h2', { text: title }), h('div', { class: 'topic-rows' },
      groups.map(([name, match]) => {
        const its = items.filter(it => it.ok != null && match(QUESTIONS.get(it.id)));
        if (!its.length) return null;
        const c = Math.round(its.reduce((n, it) => n + (it.ok ? 1 : it.pts || 0), 0) * 10) / 10;
        return h('div', { class: 'topic-row' },
          h('span', { class: 'name', text: name }),
          meter(c, its.length, `${name}: ${c} of ${its.length} correct`),
          h('span', { class: 'acc', text: `${pct(c, its.length)}%` }),
          h('div', { class: 'meta', text: Number.isInteger(c) ? `${c} of ${its.length} correct` : `${c} of ${its.length} points, with partial credit` }));
      })));

    mount(h('div', { class: 'page' },
      h('div', { class: 'page-head' }, h('div', null,
        h('div', { class: 'row', style: 'margin-bottom:8px' }, h('span', { class: 'chip code accent', text: exam.code }), h('span', { class: 'small muted', text: fmtDay(r.end) })),
        h('h1', { text: 'Mock exam result' }))),
      h('div', { class: 'card' }, h('div', { class: 'score-hero' },
        h('div', { class: 'big' }, r.score == null ? '—' : String(r.score), r.score == null ? null : h('small', { text: '%' })),
        h('div', { class: 'stack', style: 'gap:6px' },
          r.score == null ? h('span', { class: 'chip warn', text: 'Waiting for your self-grades' }) : passChip(r.score),
          h('div', { text: `${r.correct} of ${r.graded} graded questions fully correct${r.points > r.correct + 0.001 ? ` · partial credit for ${plural(items.filter(it => !it.ok && it.pts > 0).length, 'more')}` : ''}` }),
          h('div', { class: 'small muted', text: `${used} min used${r.minutes ? ` of ${r.minutes}` : ''} · pass line ≈ 70% (700 / 1000 scaled)` })))),
      pending.length ? h('div', { class: 'banner row' },
        h('span', { text: `${plural(pending.length, 'drag & drop or hotspot question')} still ${pending.length === 1 ? 'needs' : 'need'} your grade — the score updates as you grade.` }),
        h('span', { class: 'spacer' }),
        h('button', { class: 'btn sm primary', type: 'button', onclick: () => review(pending, 0, 'Self-grade') }, 'Grade them now')) : null,
      h('div', { class: 'grid-2' },
        exam.skills ? breakdown('By official skill group', exam.skills.groups.map(g => [`${g.id}. ${g.title} (${g.pct[0]}–${g.pct[1]}%)`, q => q.sk.some(id => id[0] === g.id)])) : null,
        multiTopic(exam) && !exam.skills ? breakdown('By topic', exam.topics.map(t => [topicLabel(exam, t.n), q => q.topic === t.n])) : null,
        exam.kps.length ? breakdown('By knowledge point', exam.kps.map(kp => [kp, q => q.kp === kp])) : null,
        breakdown('By question type', [...new Set(items.map(it => QUESTIONS.get(it.id).type))].map(t => [TYPE_LABEL[t] || t, q => q.type === t]))),
      h('div', { class: 'card stack' },
        h('div', { class: 'section-head' },
          h('h2', { text: 'Questions' }), h('span', { class: 'spacer' }),
          wrong.length ? h('button', { class: 'btn sm', type: 'button', onclick: () => review(wrong, 0, 'Mock exam mistakes') }, `Review ${wrong.length} wrong`) : null,
          h('button', { class: 'btn sm', type: 'button', onclick: () => review(items, 0, 'Mock exam review') }, 'Review all')),
        h('div', { class: 'list' }, items.map((it, i) => {
          const q = QUESTIONS.get(it.id);
          return h('button', { class: 'list-row', type: 'button', onclick: () => review(items, i, 'Mock exam review') },
            h('span', { class: 'qn', text: `#${q.n}` }),
            h('div', { style: 'min-width:0' },
              h('div', { class: 'snippet', text: stemText(q) }),
              h('div', { class: 'sub' }, h('span', { text: TYPE_LABEL[q.type] }),
                h('span', {
                  text: it.score ? `${it.score[0]} of ${plural(it.score[1], 'box', 'boxes')} right`
                    : selfGraded(q) ? (it.note ? 'You noted an answer' : 'No answer noted') : `You: ${it.pick || '—'} · Key: ${it.key}`,
                }))),
            h('span', { class: 'tags' }, it.ok == null
              ? h('span', { class: 'chip warn', text: 'Grade me' })
              : it.ok ? h('span', { class: 'chip good' }, icon('check'), 'Correct')
                : it.pts > 0 ? h('span', { class: 'chip warn' }, 'Partly') : h('span', { class: 'chip bad' }, icon('x'), 'Wrong')));
        }))),
      h('div', { class: 'row' },
        h('a', { class: 'btn primary', href: `#/mock/${exam.slug}` }, icon('repeat'), 'New mock exam'),
        h('a', { class: 'btn', href: `#/exam/${exam.slug}` }, `${exam.code} overview`),
        h('span', { class: 'spacer' }),
        h('button', {
          class: 'btn ghost', type: 'button',
          onclick: async () => {
            if (!(await ask('Delete this result?', 'The score is removed from your history. Practice progress is kept.', 'Delete'))) return;
            S.mocks.splice(S.mocks.indexOf(r), 1);
            S.gone['mock:' + r.id] = Date.now();
            store.commit();
            navigate(`#/exam/${exam.slug}`);
          },
        }, icon('trash'), 'Delete result'))));
  }

  // ================================================================== view: browse & search

  const STATUS_FILTER = [['', 'Any status'], ['new', 'Not seen'], ['learning', 'Learning'], ['reviewing', 'Reviewing'], ['mastered', 'Mastered'], ['mistakes', 'Mistakes'], ['due', 'Due for review'], ['flagged', 'Flagged'], ['disputed', 'Disputed answer'], ['corrected', 'Review corrects ExamTopics'], ['lowconf', 'Low-confidence review']];

  function statusMatch(q, f) {
    if (!f) return true;
    if (f === 'mistakes') return isMistake(q);
    if (f === 'due') return isDue(q);
    if (f === 'flagged') return isFlagged(q);
    if (f === 'disputed') { const k = answerKey(q); return !!(k && k.disputed); }
    if (f === 'corrected') return !!(q.review && q.review.verdict === 'corrected');
    if (f === 'lowconf') return !!(q.review && q.review.confidence === 'low');
    return status(q) === f;
  }

  function snippet(text, terms, len = 200) {
    const lower = text.toLowerCase();
    const hits = terms.map(t => lower.indexOf(t)).filter(i => i >= 0);
    const at = hits.length ? Math.min(...hits) : 0;
    const start = Math.max(0, at - 60);
    const piece = (start ? '…' : '') + text.slice(start, start + len);
    if (!terms.length) return [piece];
    const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
    return piece.split(re).map((part, i) => (i % 2 ? h('mark', { text: part }) : part));
  }

  function viewBrowse(scope, params) {
    const exam = examBySlug(scope);
    setTabs(exam ? exam.slug : null);
    setTitle(exam ? `Browse ${exam.code}` : 'Search');
    const state = {
      q: params.get('q') || '', exam: exam ? exam.code : '', status: params.get('status') || '',
      type: params.get('type') || '', kp: params.get('kp') || '', deep: params.get('deep') === '1',
    };
    const input = h('input', { type: 'search', value: state.q, placeholder: 'Words from the question, choices or case, or #12', 'aria-label': 'Search questions' });
    const select = (name, options) => {
      const el = h('select', { 'aria-label': name }, options.map(([v, t]) => h('option', { value: v, selected: v === state[name] }, t)));
      el.addEventListener('change', () => { state[name] = el.value; update(); });
      return el;
    };
    const deep = h('input', { type: 'checkbox', checked: state.deep });
    deep.addEventListener('change', () => { state.deep = deep.checked; update(); });
    input.addEventListener('input', () => { state.q = input.value; update(); });
    const count = h('div', { class: 'small muted' });
    const glossHits = h('div', { class: 'row terms gloss-hits', hidden: true });
    const results = h('div', { class: 'card list', style: 'padding:4px 6px' });

    function update() {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (GUIDE) {
        const hits = terms.length ? GLOSSARY.filter(t => terms.every(w => t.search.includes(w))).slice(0, 6) : [];
        put(glossHits, hits.length ? [h('span', { class: 'small muted', text: '术语表：' }),
          hits.map(t => h('a', { class: 'chip term', 'data-term': t.id, href: `#/guide/glossary/${t.id}`, 'data-tip': t.zh }, t.term))] : null);
        glossHits.hidden = !hits.length;
      }
      const num = state.q.trim().match(/^#?(\d+)$/);
      const list = EXAMS.filter(e => !state.exam || e.code === state.exam).flatMap(e => e.questions).filter(q =>
        (!state.type || q.type === state.type) && (!state.kp || q.kp === state.kp) && statusMatch(q, state.status) &&
        (num ? q.n === Number(num[1]) : terms.every(t => searchText(q, state.deep).includes(t))));
      count.textContent = `${plural(list.length, 'question')}${terms.length ? ' match' : ''}`;
      const multiExam = !state.exam;
      results.replaceChildren(...(list.length ? list.slice(0, 400).map(q => h('button', {
        class: 'list-row', type: 'button',
        onclick: () => {
          const ids = list.filter(x => x.exam === q.exam).map(x => x.id);
          startSession(q.exam, { key: 'read', mode: 'read', title: state.q ? `Search: “${state.q}”` : `Browse ${q.exam.code}`, ids, i: ids.indexOf(q.id) });
        },
      },
      h('span', { class: 'qn', text: `#${q.n}` }),
      h('div', { style: 'min-width:0' },
        h('div', { class: 'snippet' }, snippet(stemText(q), terms)),
        h('div', { class: 'sub' },
          multiExam ? h('span', { class: 'chip code', text: q.exam.code }) : null,
          multiTopic(q.exam) ? h('span', { text: `Topic ${q.topic}` }) : null,
          h('span', { text: TYPE_LABEL[q.type] }),
          q.kp ? h('span', { text: q.kp }) : null,
          q.case ? h('span', { text: `Case: ${q.exam.cases[q.case].name}` }) : null)),
      h('span', { class: 'tags' }, isFlagged(q) ? h('span', { class: 'chip warn', title: 'Flagged' }, icon('flag')) : null, statusChip(q))))
        : [h('div', { class: 'empty', style: 'border:0', text: 'No questions match. Try fewer words, or include discussions.' })]));
      const qs = new URLSearchParams(Object.entries({ q: state.q, status: state.status, type: state.type, kp: state.kp, deep: state.deep ? '1' : '' }).filter(([, v]) => v));
      history.replaceState(null, '', `#/browse/${state.exam ? state.exam.toLowerCase() : 'all'}${qs.toString() ? '?' + qs : ''}`);
      currentSlug = state.exam ? state.exam.toLowerCase() : null;
    }

    const types = [...new Set(EXAMS.flatMap(e => e.questions.map(q => q.type)))];
    mount(h('div', { class: 'page' },
      h('div', { class: 'page-head' }, h('div', null, h('h1', { text: 'Browse & search' }),
        h('p', { class: 'sub', text: 'Open any question to read it with its answer and discussion.' }))),
      h('div', { class: 'row', style: 'gap:10px' },
        h('label', { class: 'field', style: 'flex:1 1 280px' }, 'Search', input),
        h('label', { class: 'field' }, 'Exam', select('exam', [['', 'All exams'], ...EXAMS.map(e => [e.code, e.code])])),
        h('label', { class: 'field' }, 'Status', select('status', STATUS_FILTER)),
        h('label', { class: 'field' }, 'Type', select('type', [['', 'All types'], ...types.map(t => [t, TYPE_LABEL[t] || t])])),
        h('label', { class: 'check', style: 'align-self:end;height:38px' }, deep, 'Include discussions')),
      count,
      glossHits,
      results));
    update();
    if (!state.q) input.focus();
  }

  // ================================================================== view: settings

  function viewSettings() {
    setTabs(null);
    setTitle('Settings');
    const option = (name, value, title, desc, onpick) => {
      const input = h('input', { type: 'radio', name, value, checked: S.settings[name] === value });
      input.addEventListener('change', () => { S.settings[name] = value; store.save(); onpick && onpick(); route(); });
      return h('label', { class: 'option-card' + (S.settings[name] === value ? ' active' : '') }, input,
        h('div', null, h('div', { class: 'title', text: title }), h('div', { class: 'small muted', text: desc })));
    };
    const number = (label, name, min, max) => {
      const input = h('input', { type: 'number', min, max, value: S.settings[name] });
      input.addEventListener('change', () => { S.settings[name] = clamp(Number(input.value) || 0, min, max); store.save(); });
      return h('label', { class: 'field' }, label, input);
    };
    const images = h('input', { type: 'checkbox', checked: S.settings.mockImages });
    images.addEventListener('change', () => { S.settings.mockImages = images.checked; store.save(); });
    const lock = h('input', { type: 'checkbox', checked: S.settings.mockLock });
    lock.addEventListener('change', () => { S.settings.mockLock = lock.checked; store.save(); });
    const shuffleBox = h('input', { type: 'checkbox', checked: S.settings.shuffle });
    shuffleBox.addEventListener('change', () => { S.settings.shuffle = shuffleBox.checked; store.save(); });
    const termsBox = h('input', { type: 'checkbox', checked: S.settings.terms !== false });
    termsBox.addEventListener('change', () => { S.settings.terms = termsBox.checked; store.save(); });

    const file = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
    file.addEventListener('change', async () => {
      const f = file.files[0];
      file.value = '';
      if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data || data.version !== 1 || typeof data.q !== 'object') throw new Error('this is not a Cert Prep progress file');
        const linked = window.SYNC && SYNC.enabled();
        if (!(await ask('Replace your progress?', `Everything stored in this browser${linked ? ' and on your other synced devices' : ''} is replaced with “${f.name}”.`, 'Replace'))) return;
        store.replace(data);
        (linked ? SYNC.syncNow().catch(() => {}) : Promise.resolve()).finally(() => location.reload());
      } catch (err) {
        toast(`Import failed: ${err.message}`);
      }
    });

    const resetScope = h('select', { 'aria-label': 'Exam to reset' }, h('option', { value: '' }, 'All exams'), EXAMS.map(e => h('option', { value: e.code }, e.code)));
    async function reset() {
      const code = resetScope.value;
      const what = code || 'every exam';
      const linked = window.SYNC && SYNC.enabled();
      if (!(await ask(`Reset progress for ${what}?`, `Answers, review schedule, flags, notes, sessions and mock results are deleted${linked ? ' here and on your other synced devices' : ''}. This cannot be undone — export first if unsure.`, 'Reset'))) return;
      if (!code) {
        store.replace({ version: 1, settings: S.settings });
        (linked ? SYNC.syncNow().catch(() => {}) : Promise.resolve()).finally(() => location.reload());
        return;
      }
      S.gone['exam:' + code] = Date.now(); // so sync drops what other devices still hold from before
      for (const q of examByCode(code).questions) delete S.q[q.id];
      delete S.plan[code];
      for (const [k, s] of Object.entries(S.sessions)) if (s.code === code) delete S.sessions[k];
      S.mocks = S.mocks.filter(m => m.code !== code);
      if (S.mock && S.mock.code === code) S.mock = null;
      store.commit();
      toast(`${code} progress reset`);
      route();
    }

    const tracked = Object.values(S.q).filter(p => p.a).length;
    let syncCard = null;
    if (window.SYNC) {
      const status = h('p', { class: 'small muted' });
      const renderStatus = s => {
        status.textContent = !s.enabled
          ? 'Off — progress lives only in this browser.'
          : s.lastError
            ? `On — paused: ${s.lastError}`
            : `On — server revision ${s.rev}, last synced ${s.lastSync ? (Date.now() - s.lastSync < 60e3 ? 'just now' : `at ${new Date(s.lastSync).toLocaleTimeString()}`) : 'not yet'}${s.pending ? ' · changes waiting to upload' : ''}.`;
      };
      SYNC.onChange(renderStatus);
      renderStatus(SYNC.state());
      const busy = async (btn, job, done) => {
        btn.disabled = true;
        try { await job(); if (done) toast(done); }
        catch (err) { toast(`${err.message || 'Sync failed'}`); }
        btn.disabled = false;
      };
      const code = h('input', { type: 'text', placeholder: 'Pick a sync code (8+ characters)', autocomplete: 'off', 'aria-label': 'Sync code' });
      const turnOn = h('button', {
        class: 'btn primary', type: 'button',
        onclick: () => busy(turnOn, async () => {
          const merged = await SYNC.enable(code.value);
          toast(merged ? 'Sync on — merged with the progress already on the server.' : 'Sync on — your progress is now on the server.');
          route();
        }),
      }, 'Turn on sync');
      code.addEventListener('keydown', ev => { if (ev.key === 'Enter') turnOn.click(); });
      syncCard = h('div', { class: 'card stack' },
        h('h2', { text: 'Sync across devices' }),
        h('p', { class: 'small muted', text: 'Mirror progress to this server so your phone and computers stay in step: pick any sync code and enter the same one on each device. The code is the only protection for the server copy — anyone who knows it can read or overwrite it, so keep it private.' }),
        status,
        SYNC.enabled()
          ? h('div', { class: 'row' },
            h('button', { class: 'btn', type: 'button', onclick: ev => busy(ev.currentTarget, () => SYNC.syncNow(), 'Synced.') }, icon('repeat'), 'Sync now'),
            h('button', {
              class: 'btn', type: 'button',
              onclick: async ev => {
                if (!(await ask('Turn off sync?', 'This browser stops syncing. The server copy stays, so you can pick it up again with the same code.', 'Turn off'))) return;
                busy(ev.currentTarget, () => SYNC.disable(false)).then(() => route());
              },
            }, 'Turn off'),
            h('button', {
              class: 'btn bad', type: 'button',
              onclick: async ev => {
                if (!(await ask('Delete the server copy?', 'The synced progress on the server is deleted and this browser stops syncing. Other devices keep their local progress; one still syncing with this code uploads its copy again the next time it saves. This cannot be undone.', 'Delete'))) return;
                busy(ev.currentTarget, () => SYNC.disable(true)).then(() => route());
              },
            }, icon('trash'), 'Delete server copy'))
          : h('div', { class: 'row', style: 'align-items:end' },
            h('label', { class: 'field', style: 'flex:1 1 240px' }, 'Sync code', code), turnOn));
    }
    mount(h('div', { class: 'page', style: 'max-width:820px' },
      h('h1', { text: 'Settings' }),
      h('div', { class: 'card stack' },
        h('h2', { text: 'Answer key used for grading' }),
        h('p', { class: 'small muted', text: 'ExamTopics publishes a suggested answer, its users vote on the answer they believe is right, and every question has also been re-judged against Microsoft product behaviour (the reviewed answer, with an explanation). All three are shown on every question.' }),
        option('key', 'reviewed', 'Reviewed answer (recommended)', `Grade against the reviewed answer. It corrects ExamTopics on ${Object.values(REVIEWED).filter(r => r.verdict === 'corrected').length} questions and marks its own confidence; where it says low confidence, read the explanation and the discussion.`),
        option('key', 'community', 'Community vote when it is clear', `Use the most-voted answer once at least ${MIN_VOTES} votes are in and there is no tie; otherwise the ExamTopics answer. Votes are pooled across copies of the same question, and each copy's ExamTopics answer counts as one vote. Drag & drop and hotspot questions have no votes, so a box uses the answer the most-upvoted comments clearly agree on.`),
        option('key', 'official', 'ExamTopics answer', 'Always grade against the answer ExamTopics shows as correct.')),
      h('div', { class: 'card stack' },
        h('h2', { text: 'Practice' }),
        h('label', { class: 'check' }, shuffleBox, 'Shuffle the answer choices and drag & drop tiles in practice and mock exams, so you learn the idea rather than the position of the answer'),
        h('p', { class: 'small muted', text: 'Letters stay as printed on ExamTopics, so the discussion still makes sense. Read-through mode always shows the original order.' }),
        GUIDE ? h('label', { class: 'check' }, termsBox, 'Mark Microsoft terms from the Guide in question text; clicking one opens its Chinese explanation and Microsoft Learn link (never in mock exams)') : null),
      h('div', { class: 'card stack' },
        h('h2', { text: 'Appearance' }),
        h('div', { class: 'segmented', role: 'group', 'aria-label': 'Theme' }, THEMES.map(t => h('button', {
          type: 'button', 'aria-pressed': String(S.settings.theme === t),
          onclick: () => { S.settings.theme = t; store.save(); applyTheme(); route(); },
        }, t[0].toUpperCase() + t.slice(1))))),
      h('div', { class: 'card stack' },
        h('h2', { text: 'Mock exam defaults' }),
        h('div', { class: 'builder' }, number('Questions', 'mockSize', 1, 500), number('Minutes (0 = untimed)', 'mockMinutes', 0, 600)),
        h('label', { class: 'check' }, images, 'Include drag & drop and hotspot questions'),
        h('label', { class: 'check' }, lock, 'Lock series questions once you move on, as in the real exam')),
      syncCard,
      h('div', { class: 'card stack' },
        h('h2', { text: 'Your data' }),
        h('p', { class: 'small muted', text: `Progress is stored in this browser: ${plural(tracked, 'question')} with answers, ${plural(S.mocks.length, 'mock exam')}. Sync (above) mirrors it to this server across your devices; export a backup to move it anywhere else.` }),
        h('div', { class: 'row' },
          h('button', {
            class: 'btn', type: 'button',
            onclick: () => {
              store.flush();
              const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })), download: `cert-prep-progress-${dayKey(Date.now())}.json` });
              document.body.append(a);
              a.click();
              a.remove();
              setTimeout(() => URL.revokeObjectURL(a.href), 2000);
            },
          }, icon('download'), 'Export progress'),
          h('button', { class: 'btn', type: 'button', onclick: () => file.click() }, icon('upload'), 'Import progress'),
          file),
        h('div', { class: 'row' }, resetScope, h('button', { class: 'btn bad', type: 'button', onclick: reset }, icon('trash'), 'Reset progress'))),
      h('div', { class: 'card stack' },
        h('h2', { text: 'Question bank' }),
        h('p', { class: 'small muted', text: `Built ${fmtDay(parseDay(BANK.generated))} from ExamTopics: ${EXAMS.map(e => `${e.code} (${e.questions.length})`).join(', ')}.` }),
        h('p', { class: 'small muted' }, 'To refresh it, update the cookie in EXAM_SOURCES.md and run ', h('code', { text: 'python3 tools/examtopics.py --cache .cache' }), '. Progress is keyed by question ID, so it carries over.'))));
  }

  function viewMissingBank() {
    setTabs(null);
    mount(h('div', { class: 'page', style: 'max-width:720px' }, h('div', { class: 'card stack' },
      h('h1', { text: 'No question bank yet' }),
      h('p', null, 'data/bank.js is missing. Build it with ', h('code', { text: 'python3 tools/examtopics.py' }), ' — the tool reads the ExamTopics session cookie from EXAM_SOURCES.md.'))));
  }

  // ================================================================== router, keyboard, boot

  const ROUTES = [
    [/^#\/guide$/, () => viewGuide()],
    [/^#\/guide\/glossary(?:\/([\w-]+))?(?:\?(.*))?$/, m => viewGlossary(m[1], new URLSearchParams(m[2] || ''))],
    [/^#\/guide\/([\w-]+)(?:\/([\w-]+))?$/, m => viewGuideChapter(m[1], m[2])],
    [/^#\/exam\/([\w-]+)$/, m => viewExam(examBySlug(m[1]))],
    [/^#\/s\/([\w-]+)$/, m => viewSession(m[1])],
    [/^#\/mock\/([\w-]+)$/, m => viewMockSetup(examBySlug(m[1]))],
    [/^#\/mock$/, () => viewMock()],
    [/^#\/result\/([\w-]+)$/, m => viewResult(m[1])],
    [/^#\/browse\/([\w-]+)(?:\?(.*))?$/, m => viewBrowse(m[1], new URLSearchParams(m[2] || ''))],
    [/^#\/settings$/, () => viewSettings()],
    [/^#\/q\/([\w-]+)\/(\d+)$/, m => viewVariants(examBySlug(m[1]), Number(m[2]))],
  ];

  function viewVariants(exam, n) {
    const q = exam && exam.questions.find(x => x.n === n);
    if (!q) return navigate('#/');
    const group = [q, ...q.siblings].sort((a, b) => a.n - b.n);
    startSession(exam, { key: 'read', mode: 'read', title: q.siblings.length ? `Question ${n} and its ${plural(q.siblings.length, 'copy', 'copies')}` : `Question ${n}`, ids: group.map(x => x.id), i: group.indexOf(q) });
  }

  function route() {
    const leaving = view;
    view = {};
    if (leaving.leave) leaving.leave();
    hideTip();
    closeTerm();
    if (!EXAMS.length) return viewMissingBank();
    scrollTo({ top: 0 });
    for (const [re, fn] of ROUTES) {
      const m = location.hash.match(re);
      if (m) return fn(m);
    }
    viewHome();
  }

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape' && !termPop.hidden) {
      closeTerm();
      return;
    }
    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.altKey || document.querySelector('dialog[open]')) return;
    const t = ev.target;
    const typing = t.matches && t.matches('input:not([type]), input[type="text"], input[type="search"], input[type="number"], textarea, select, [contenteditable="true"]');
    if (ev.key === 'Escape') {
      if (typing) t.blur();
      else if (view.escape) view.escape();
      return;
    }
    if (typing) return;
    if ((ev.key === 'Enter' || ev.key === ' ') && t.closest && t.closest('button, a')) return;
    if (ev.key === '?') {
      $('#helpDialog').showModal();
      ev.preventDefault();
    } else if (ev.key === '/') {
      $('#searchInput').focus();
      ev.preventDefault();
    } else if (view.key && view.key(ev)) {
      ev.preventDefault();
    }
  });

  document.addEventListener('pointerover', ev => {
    const el = ev.target.closest && ev.target.closest('[data-tip]');
    if (el) showTip(el);
    else if (!ev.target.closest || !ev.target.closest('.chart')) hideTip();
  });
  document.addEventListener('focusin', ev => {
    const el = ev.target.closest && ev.target.closest('[data-tip]');
    if (el) showTip(el);
  });
  document.addEventListener('focusout', hideTip);
  addEventListener('scroll', () => { hideTip(); closeTerm(); }, { passive: true });

  document.body.append(termPop);
  document.addEventListener('click', ev => {
    const t = ev.target.closest && ev.target.closest('.term-hl, a.term');
    if (t && t.dataset.term) {
      ev.preventDefault();
      if (termPop.dataset.for === t.dataset.term && !termPop.hidden) closeTerm();
      else { termPop.dataset.for = t.dataset.term; openTerm(t, t.dataset.term); }
    } else if (!termPop.hidden && !(ev.target.closest && ev.target.closest('.term-pop'))) {
      closeTerm();
    }
  });

  const lightbox = $('#lightbox');
  const lightboxImg = $('img', lightbox);
  document.addEventListener('click', ev => {
    const img = ev.target.closest && ev.target.closest('.rich img, .choice .text img, .area img');
    if (!img) return;
    ev.preventDefault();
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.remove('actual');
    lightbox.showModal();
  });
  lightboxImg.addEventListener('click', () => lightbox.classList.toggle('actual'));
  $('.lb-close', lightbox).addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', ev => { if (ev.target === lightbox) lightbox.close(); });

  $('#helpBtn').addEventListener('click', () => $('#helpDialog').showModal());
  $('#helpDialog [data-close]').addEventListener('click', () => $('#helpDialog').close());
  $('#themeBtn').addEventListener('click', () => {
    S.settings.theme = THEMES[(THEMES.indexOf(S.settings.theme) + 1) % THEMES.length];
    store.save();
    applyTheme();
    toast(`Theme: ${S.settings.theme}`);
  });
  $('#searchForm').addEventListener('submit', ev => {
    ev.preventDefault();
    const input = $('#searchInput');
    const q = input.value.trim();
    input.value = '';
    input.blur();
    navigate(`#/browse/${currentSlug || 'all'}${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  });

  // ================================================================== sync (assets/sync.js)

  let booted = false;
  let stale = false;
  // Progress merged in from another device: redraw the screen, except a guide page, the session or mock exam
  // being worked on when the merge left it alone, and a field being typed in (redrawn once it is left).
  function synced() {
    if (!booted || /^#\/guide/.test(location.hash) || (view.live && view.live())) return;
    const t = document.activeElement;
    stale = !!(t && app.contains(t) && t.matches('input, textarea, select'));
    if (stale) return;
    const y = scrollY;
    route();
    if (!view.live) scrollTo(0, y); // a session or mock exam opens at the top of its question
  }
  document.addEventListener('focusout', () => { if (stale) setTimeout(synced); });

  applyTheme();
  addEventListener('hashchange', route);
  if (window.SYNC) {
    SYNC.attach({
      read: () => S,
      apply(next) { store.adopt(next); queueMicrotask(synced); },
      examOf: id => { const q = QUESTIONS.get(Number(id)); return q ? q.exam.code : null; },
    });
  }
  // The first screen waits briefly for the first pull; on a slow network it shows this device's progress and
  // the pull redraws it when it lands.
  const first = window.SYNC ? Promise.race([SYNC.boot(), new Promise(r => setTimeout(r, 2500))]) : Promise.resolve();
  first.then(() => { booted = true; route(); });
})();
