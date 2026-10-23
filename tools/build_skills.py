#!/usr/bin/env python3
"""Build data/skills.js (window.SKILLS) from the official "skills measured" outlines and the question map.

Sources
  data/skills/<exam slug>.md   one per exam. Front matter (--- lines): exam, title, asof, source, note.
                               Body:
                                 # A. Group title (25–30%)            a functional group with its weight
                                 ## A1. Sub-area title                 a sub-area ("skill")
                                 - A1.3 Bullet text | 中文释义          an objective bullet (the id must be <area id>.<n>);
                                                                       abbreviations in the 中文释义 are spelled out once
                                                                       per sub-area from data/guide/abbr.md (tools/abbr.py)
                                   - guide: <chapter id>[/<section id>] where the Guide explains it (optional, repeatable)
                                   - learn: <url>                       official Learn page or module (optional, repeatable)
  data/skillmap/<exam slug>.json  {"<question id>": ["A1.3", "B2.1"], ...} — the official objectives each
                               ExamTopics question tests, first one primary. Hand-maintained (the AI mapping
                               pass wrote the first version; fix by hand).

The build fails on duplicate or malformed ids, map entries for unknown questions or bullets, and guide
references that do not exist in data/guide.js (when it exists), so the outline, the map and the guide
cannot drift apart.

Run: python3 tools/build_skills.py
"""
import datetime
import json
import re
import sys
from pathlib import Path

import abbr

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'skills'
MAPS = ROOT / 'data' / 'skillmap'
OUT = ROOT / 'data' / 'skills.js'

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def parse_front(text, where):
    m = re.match(r'^---\n(.*?)\n---\n?', text, re.S)
    if not m:
        err(f'{where}: missing front matter')
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        k, _, v = line.partition(':')
        meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def parse_outline(path):
    text = path.read_text(encoding='utf-8')
    meta, body = parse_front(text, path.name)
    exam = {'code': meta.get('exam', ''), 'title': meta.get('title', ''), 'asof': meta.get('asof', ''),
            'source': meta.get('source', ''), 'note': meta.get('note', ''), 'groups': []}
    if not exam['code']:
        err(f'{path.name}: front matter needs exam:')
    group = area = bullet = None
    area_seen = set()  # abbreviations already spelled out in this sub-area
    ids = set()
    for ln, raw in enumerate(body.splitlines(), 1):
        line = raw.rstrip()
        if not line.strip():
            continue
        where = f'{path.name}:{ln}'
        m = re.match(r'^# ([A-Z])\. (.+?) \((\d+)[–-](\d+)%\)\s*$', line)
        if m:
            gid = m.group(1)
            if gid in ids:
                err(f'{where}: duplicate group id {gid}')
            ids.add(gid)
            group = {'id': gid, 'title': m.group(2).strip(), 'pct': [int(m.group(3)), int(m.group(4))], 'areas': []}
            exam['groups'].append(group)
            area = bullet = None
            continue
        m = re.match(r'^## ([A-Z]\d+)\. (.+?)\s*$', line)
        if m:
            aid = m.group(1)
            if not group or aid[0] != group['id']:
                err(f'{where}: sub-area {aid} is not inside group {group["id"] if group else "?"}')
            if aid in ids:
                err(f'{where}: duplicate sub-area id {aid}')
            ids.add(aid)
            area = {'id': aid, 'title': m.group(2).strip(), 'bullets': []}
            area_seen = set()
            if group:
                group['areas'].append(area)
            bullet = None
            continue
        m = re.match(r'^- ([A-Z]\d+\.\d+) (.+?)\s*$', line)
        if m:
            bid = m.group(1)
            if not area or not bid.startswith(area['id'] + '.'):
                err(f'{where}: bullet {bid} is not inside sub-area {area["id"] if area else "?"}')
            if bid in ids:
                err(f'{where}: duplicate bullet id {bid}')
            ids.add(bid)
            text_, _, zh = m.group(2).partition('|')
            bullet = {'id': bid, 'text': text_.strip(), 'zh': zh.strip(), 'guide': [], 'learn': []}
            if not bullet['zh']:
                warn(f'{where}: bullet {bid} has no 中文释义')
            for tok in sorted(abbr.unknown_caps(bullet['zh'])):
                err(f'{where}: abbreviation {tok} is not in data/guide/abbr.md')
            bullet['zh'] = abbr.expand(bullet['zh'], area_seen)
            if area:
                area['bullets'].append(bullet)
            continue
        m = re.match(r'^\s+- (guide|learn): (.+?)\s*$', line)
        if m and bullet:
            bullet[m.group(1)].append(m.group(2).strip())
            continue
        err(f'{where}: cannot parse line: {line[:80]}')
    return exam


def load_bank_ids():
    """Question ids per exam code from data/bank.js (and data/extra.js when present)."""
    ids = {}
    for name in ('bank.js', 'extra.js'):
        p = ROOT / 'data' / name
        if not p.exists():
            continue
        txt = p.read_text(encoding='utf-8')
        start = txt.index('{')
        data, _ = json.JSONDecoder().raw_decode(txt[start:])
        for e in data.get('exams', []):
            ids.setdefault(e['code'], set()).update(str(q['id']) for q in e.get('questions', []))
    return ids


def load_guide_refs():
    """(valid chapter/section refs, {exam slug: syllabus chapter id}) from data/guide.js, or (None, {}) without it."""
    p = ROOT / 'data' / 'guide.js'
    if not p.exists():
        return None, {}
    txt = p.read_text(encoding='utf-8')
    data, _ = json.JSONDecoder().raw_decode(txt[txt.index('{'):])
    refs = set()
    syllabus = {}
    for c in data['chapters']:
        refs.add(c['id'])
        for s in c['sections']:
            refs.add(f"{c['id']}/{s['id']}")
        if c.get('skills'):
            syllabus[c['skills']] = c['id']
    return refs, syllabus


def main():
    if not SRC.is_dir():
        sys.exit(f'no {SRC}')
    exams = {}
    for path in sorted(SRC.glob('*.md')):
        ex = parse_outline(path)
        if ex['code'] in exams:
            err(f'{path.name}: exam {ex["code"]} defined twice')
        exams[ex['code']] = ex
        ex['slug'] = path.stem

    bank_ids = load_bank_ids()
    guide_refs, syllabus = load_guide_refs()
    qmap = {}
    for code, ex in exams.items():
        bullets = {b['id'] for g in ex['groups'] for a in g['areas'] for b in a['bullets']}
        chapter = syllabus.get(ex['slug'])  # the Guide chapter that walks this outline: its sections are the sub-areas
        for g in ex['groups']:
            for a in g['areas']:
                for b in a['bullets']:
                    auto = f'{chapter}/{a["id"].lower()}' if chapter else None
                    if auto and auto in guide_refs and auto not in b['guide']:
                        b['guide'].insert(0, auto)
                    for ref in b['guide']:
                        if guide_refs is not None and ref not in guide_refs:
                            err(f'{ex["slug"]}.md: bullet {b["id"]} guide ref {ref!r} not in data/guide.js')
        mp = MAPS / f'{ex["slug"]}.json'
        if not mp.exists():
            warn(f'no map {mp.relative_to(ROOT)}; {code} questions are unmapped')
            continue
        try:
            m = json.loads(mp.read_text(encoding='utf-8'))
        except json.JSONDecodeError as e:
            err(f'{mp.name}: {e}')
            continue
        known = bank_ids.get(code, set())
        for qid, lst in m.items():
            if qid not in known:
                err(f'{mp.name}: question {qid} is not a {code} question')
            if not isinstance(lst, list) or not lst:
                err(f'{mp.name}: question {qid} must map to a non-empty list')
                continue
            for bid in lst:
                if bid not in bullets:
                    err(f'{mp.name}: question {qid} maps to unknown bullet {bid}')
            qmap[qid] = lst
        missing = sorted((q for q in known - set(m) if int(q) < 9000000), key=int)  # supplements carry their objectives in data/extra.js
        if missing:
            warn(f'{mp.name}: {len(missing)} {code} questions unmapped: {", ".join(missing[:8])}{"…" if len(missing) > 8 else ""}')

    for w in warnings:
        print('warning:', w, file=sys.stderr)
    if errors:
        for e in errors:
            print('error:', e, file=sys.stderr)
        sys.exit(f'{len(errors)} error(s); data/skills.js not written')

    data = {'generated': datetime.date.today().isoformat(), 'exams': exams, 'map': qmap}
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    OUT.write_text('// Official skills measured and the question map: built by tools/build_skills.py from data/skills/ '
                   'and data/skillmap/. Do not edit by hand.\n' f'window.SKILLS = {body};\n', encoding='utf-8')
    n_b = sum(len(a['bullets']) for ex in exams.values() for g in ex['groups'] for a in g['areas'])
    print(f'wrote {OUT.relative_to(ROOT)}: {len(exams)} exams, {n_b} objectives, {len(qmap)} questions mapped')


if __name__ == '__main__':
    main()
