#!/usr/bin/env python3
"""Build data/guide.js (window.GUIDE) from the Markdown sources in data/guide/.

Sources
  data/guide/NN-<id>.md   one chapter each, in file order. Front matter between --- lines:
                            id, title, short, intro, exams: A | B, practice: (nested) <exam slug>: kp | kp
                          Body: Markdown. "## 标题 {#slug}" starts a section; text before the first
                          section is the chapter lead. Supported: paragraphs, lists (- and 1.), tables,
                          > callouts (first line **注意**/**考点**/**易混**/**提示**/**来源**), fenced code,
                          ```diagram blocks (JSON, see diagram()), **bold**, *em*, `code`, [text](url),
                          [[term-id]] or [[term-id|text]] for glossary links.
  data/guide/abbr.md      abbreviations (see tools/abbr.py): each one is spelled out the first time it
                          appears in a section or glossary entry; unlisted all-caps tokens fail the build.
  data/guide/glossary*.md entries "### Term {#id}" followed by "- key: value" lines
                            (zh, aliases, exams, ref, see, chapter, nohl) and a Markdown definition.

The build fails on unknown [[term]] links, unknown see:/chapter: references, missing refs, and
practice knowledge points that do not exist in data/reviewed.js, so the guide never drifts
from the question bank.

Run: python3 tools/build_guide.py
"""
import datetime
import html as htmlmod
import json
import re
import sys
from pathlib import Path

import abbr

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'guide'
OUT = ROOT / 'data' / 'guide.js'

errors = []
warnings = []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


# ---------------------------------------------------------------- front matter

LIST_KEYS = {'exams', 'aliases', 'see'}


def parse_list(v):
    v = v.strip()
    if v.startswith('[') and v.endswith(']'):
        v = v[1:-1]
    return [s.strip() for s in v.split('|') if s.strip()]


def parse_front(text, where):
    m = re.match(r'^---\n(.*?)\n---\n?', text, re.S)
    if not m:
        err(f'{where}: missing front matter')
        return {}, text
    meta = {}
    cur = None
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        if line.startswith('  ') and cur is not None:
            k, _, v = line.strip().partition(':')
            meta[cur][k.strip()] = parse_list(v)
            continue
        k, _, v = line.partition(':')
        k, v = k.strip(), v.strip()
        if v == '':
            meta[k] = {}
            cur = k
        else:
            meta[k] = parse_list(v) if k in LIST_KEYS else v.strip('"')
            cur = None
    return meta, text[m.end():]


# ---------------------------------------------------------------- inline markdown

GLOSSARY = {}      # id -> entry (filled before chapters are rendered)
TERMS_USED = {}    # term id -> set of chapter ids that link to it


def inline(s, ctx):
    out = htmlmod.escape(s, quote=False)
    codes = []

    def code_sub(m):
        codes.append('<code>%s</code>' % m.group(1))
        return '\x00%d\x00' % (len(codes) - 1)
    out = re.sub(r'`([^`]+)`', code_sub, out)

    def term_sub(m):
        tid = m.group(1).strip()
        text = m.group(2).strip()
        entry = GLOSSARY.get(tid)
        if not entry:
            err(f'{ctx}: unknown term [[{tid}]]')
            return text or tid
        TERMS_USED.setdefault(tid, set()).add(ctx.split(':')[0])
        return f'<a class="term" data-term="{tid}" href="#/guide/glossary/{tid}">{text or entry["term"]}</a>'
    out = re.sub(r'\[\[([^\]|]+)\|?([^\]]*)\]\]', term_sub, out)

    def link_sub(m):
        text, url = m.group(1), m.group(2)
        if url.startswith('#'):
            return f'<a href="{url}">{text}</a>'
        return f'<a href="{url}" target="_blank" rel="noopener noreferrer">{text}</a>'
    out = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link_sub, out)
    out = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', out)
    out = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', out)
    out = re.sub(r'\x00(\d+)\x00', lambda m: codes[int(m.group(1))], out)
    return out


# ---------------------------------------------------------------- block markdown

CALLOUT = {'注意': 'note', '提示': 'tip', '考点': 'exam', '易混': 'confuse', '来源': 'refs', '例子': 'example', '口诀': 'tip'}


def diagram(src, ctx):
    try:
        d = json.loads(src)
    except json.JSONDecodeError as e:
        err(f'{ctx}: bad diagram JSON: {e}')
        return ''
    kind = d.get('type', 'layers')
    parts = ['<figure class="diagram %s">' % kind]
    if d.get('title'):
        parts.append('<figcaption>%s</figcaption>' % inline(d['title'], ctx))
    if kind == 'layers':
        layers = d.get('layers', [])
        arrows = d.get('arrows', [])
        for i, layer in enumerate(layers):
            parts.append('<div class="dg-layer">')
            if layer.get('label'):
                parts.append('<div class="dg-label">%s</div>' % inline(layer['label'], ctx))
            parts.append('<div class="dg-boxes">')
            for box in layer.get('boxes', []):
                if isinstance(box, str):
                    box = {'t': box}
                cls = 'dg-box' + (' ' + box['class'] if box.get('class') else '')
                parts.append('<div class="%s"><b>%s</b>%s</div>' % (
                    cls, inline(box['t'], ctx), ('<span>%s</span>' % inline(box['s'], ctx)) if box.get('s') else ''))
            parts.append('</div></div>')
            if i < len(layers) - 1:
                label = arrows[i] if i < len(arrows) else ''
                parts.append('<div class="dg-arrow"><span>%s</span></div>' % inline(label, ctx))
    elif kind == 'columns':
        parts.append('<div class="dg-cols">')
        for col in d.get('columns', []):
            parts.append('<div class="dg-col"><div class="dg-col-head"><b>%s</b>%s</div><ul>' % (
                inline(col['title'], ctx), ('<span>%s</span>' % inline(col['sub'], ctx)) if col.get('sub') else ''))
            for item in col.get('items', []):
                parts.append('<li>%s</li>' % inline(item, ctx))
            parts.append('</ul></div>')
        parts.append('</div>')
    elif kind == 'flow':
        parts.append('<div class="dg-flow">')
        steps = d.get('steps', [])
        for i, step in enumerate(steps):
            if isinstance(step, str):
                step = {'t': step}
            parts.append('<div class="dg-step"><b>%s</b>%s</div>' % (
                inline(step['t'], ctx), ('<span>%s</span>' % inline(step['s'], ctx)) if step.get('s') else ''))
            if i < len(steps) - 1:
                parts.append('<div class="dg-next" aria-hidden="true"></div>')
        parts.append('</div>')
    else:
        err(f'{ctx}: unknown diagram type {kind}')
    parts.append('</figure>')
    return ''.join(parts)


def render_list(lines, i, ctx):
    """lines[i] starts a list. Returns (html, next index). Nesting by indentation of 2+ spaces."""
    def item_re(line):
        return re.match(r'^(\s*)(?:[-*]|\d+[.)])\s+(.*)$', line)
    base = len(item_re(lines[i]).group(1))
    ordered = bool(re.match(r'^\s*\d+[.)]\s', lines[i]))
    out = ['<ol>' if ordered else '<ul>']
    while i < len(lines):
        m = item_re(lines[i])
        if not m or len(m.group(1)) < base:
            break
        if len(m.group(1)) > base:
            sub, i = render_list(lines, i, ctx)
            out[-1] = out[-1][:-5] + sub + '</li>'  # attach to previous item
            continue
        text = m.group(2)
        i += 1
        # continuation lines (indented, not a new item)
        while i < len(lines) and lines[i].strip() and not item_re(lines[i]) and lines[i].startswith(' ' * (base + 2)):
            text += ' ' + lines[i].strip()
            i += 1
        out.append('<li>%s</li>' % inline(text, ctx))
    out.append('</ol>' if ordered else '</ul>')
    return ''.join(out), i


def render_table(lines, i, ctx):
    rows = []
    while i < len(lines) and lines[i].lstrip().startswith('|'):
        # split on | except inside [[term|text]] links
        rows.append([c.strip() for c in re.split(r'\|(?![^\[]*\]\])', lines[i].strip().strip('|'))])
        i += 1
    head, body = rows[0], rows[2:] if len(rows) > 1 and all(re.match(r'^:?-+:?$', c) for c in rows[1]) else rows[1:]
    out = ['<div class="table-wrap"><table><thead><tr>']
    out += ['<th>%s</th>' % inline(c, ctx) for c in head]
    out.append('</tr></thead><tbody>')
    for r in body:
        out.append('<tr>' + ''.join('<td>%s</td>' % inline(c, ctx) for c in r) + '</tr>')
    out.append('</tbody></table></div>')
    return ''.join(out), i


def render_blocks(text, ctx):
    lines = text.split('\n')
    out = []
    i = 0
    para = []

    def flush_para():
        if para:
            joined = ' '.join(s.strip() for s in para)
            cls = ' class="refs"' if joined.startswith('来源') else ''
            out.append('<p%s>%s</p>' % (cls, inline(joined, ctx)))
            para.clear()

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            flush_para()
            i += 1
            continue
        if stripped.startswith('```'):
            flush_para()
            lang = stripped[3:].strip()
            j = i + 1
            buf = []
            while j < len(lines) and not lines[j].strip().startswith('```'):
                buf.append(lines[j])
                j += 1
            body = '\n'.join(buf)
            if lang == 'diagram':
                out.append(diagram(body, ctx))
            else:
                out.append('<pre class="code-block"><code>%s</code></pre>' % htmlmod.escape(body, quote=False))
            i = j + 1
            continue
        m = re.match(r'^(#{3,5})\s+(.*?)(?:\s*\{#([\w-]+)\})?\s*$', stripped)
        if m:
            flush_para()
            level = len(m.group(1)) + 1  # ### -> h4 inside a section
            attr = f' id="h-{m.group(3)}"' if m.group(3) else ''
            out.append('<h%d%s>%s</h%d>' % (level, attr, inline(m.group(2), ctx), level))
            i += 1
            continue
        if stripped == '---':
            flush_para()
            out.append('<hr>')
            i += 1
            continue
        if stripped.startswith('>'):
            flush_para()
            buf = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                buf.append(re.sub(r'^\s*>\s?', '', lines[i]))
                i += 1
            kind = 'note'
            first = buf[0].strip() if buf else ''
            mm = re.match(r'^\*\*(.+?)\*\*[：:]?\s*(.*)$', first)
            label = ''
            if mm and mm.group(1) in CALLOUT:
                kind = CALLOUT[mm.group(1)]
                label = mm.group(1)
                buf[0] = mm.group(2)
            inner = render_blocks('\n'.join(buf), ctx)
            out.append('<div class="callout %s">%s%s</div>' % (kind, f'<div class="callout-label">{label}</div>' if label else '', inner))
            continue
        if stripped.startswith('|'):
            flush_para()
            html, i = render_table(lines, i, ctx)
            out.append(html)
            continue
        if re.match(r'^\s*(?:[-*]|\d+[.)])\s+', line):
            flush_para()
            html, i = render_list(lines, i, ctx)
            out.append(html)
            continue
        para.append(line)
        i += 1
    flush_para()
    return ''.join(out)


# ---------------------------------------------------------------- glossary

def parse_glossary(text):
    entries = []
    chunks = re.split(r'^(?=### )', text, flags=re.M)
    for chunk in chunks:
        m = re.match(r'^### (.+?)\s*\{#([\w-]+)\}\s*\n', chunk)
        if not m:
            continue
        term, tid = m.group(1).strip(), m.group(2)
        body = chunk[m.end():]
        meta = {}
        rest = []
        in_meta = True
        for line in body.split('\n'):
            mm = re.match(r'^- (zh|aliases|exams|ref|see|chapter|nohl):\s*(.*)$', line) if in_meta else None
            if mm:
                key, val = mm.group(1), mm.group(2).strip()
                meta[key] = parse_list(val) if key in ('aliases', 'exams', 'see') else val
            else:
                if line.strip():
                    in_meta = False
                rest.append(line)
        if tid in GLOSSARY:
            err(f'glossary: duplicate id {tid}')
        entry = {
            'id': tid, 'term': term, 'zh': meta.get('zh', ''), 'aliases': meta.get('aliases', []),
            'exams': meta.get('exams', []), 'ref': meta.get('ref', ''), 'see': meta.get('see', []),
            'chapter': '', 'section': '', 'nohl': meta.get('nohl', '') == 'true', 'md': '\n'.join(rest).strip(),
        }
        if meta.get('chapter'):
            ch, _, sec = meta['chapter'].partition('/')
            entry['chapter'], entry['section'] = ch, sec
        if not entry['zh']:
            err(f'glossary {tid}: missing zh')
        if not entry['ref']:
            warn(f'glossary {tid}: no ref')
        GLOSSARY[tid] = entry
        entries.append(entry)
    return entries


# ---------------------------------------------------------------- chapters

def slugify_check(s, where):
    if not re.match(r'^[\w-]+$', s):
        err(f'{where}: bad id {s!r}')


def parse_chapter(path, n):
    text = path.read_text(encoding='utf-8')
    meta, body = parse_front(text, path.name)
    cid = meta.get('id') or path.stem
    slugify_check(cid, path.name)
    sections = []
    lead_md = ''
    parts = re.split(r'^(?=## )', body, flags=re.M)
    for k, part in enumerate(parts):
        m = re.match(r'^## (.+?)\s*(?:\{#([\w-]+)\})?\s*\n', part)
        if not m:
            lead_md = part
            continue
        title = m.group(1).strip()
        sid = m.group(2) or f's{len(sections) + 1}'
        if any(s['id'] == sid for s in sections):
            err(f'{path.name}: duplicate section id {sid}')
        sections.append({'id': sid, 'title': title, 'md': part[m.end():]})
    practice = meta.get('practice', {}) or {}
    if not isinstance(practice, dict):
        err(f'{path.name}: practice must be a nested map')
        practice = {}
    return {
        'id': cid, 'n': n, 'title': meta.get('title', cid), 'short': meta.get('short', meta.get('title', cid)),
        'intro': meta.get('intro', ''), 'exams': meta.get('exams', []), 'practice': practice,
        'skills': meta.get('skills', ''),  # exam slug whose skills-measured sub-areas the sections follow (ids a1, b2, …)
        'lead_md': lead_md, 'sections': sections, 'file': path.name,
    }


def load_skill_areas(slug):
    """Sub-area ids (lower case) of data/skills/<slug>.md, or None when there is no such outline."""
    p = ROOT / 'data' / 'skills' / f'{slug}.md'
    if not p.exists():
        return None
    return {m.lower() for m in re.findall(r'^## ([A-Z]\d+)\. ', p.read_text(encoding='utf-8'), re.M)}


def load_kps():
    kps = {}
    txt = (ROOT / 'data' / 'reviewed.js').read_text(encoding='utf-8')
    for m in re.finditer(r'^"[^"]+": (\{.*\}),?$', txt, re.M):
        r = json.loads(m.group(1))
        kps.setdefault(r['exam'].lower(), set()).add(r['kp'])
    return kps


def main():
    if not SRC.is_dir():
        sys.exit(f'no {SRC}')
    glossary_text = '\n'.join(p.read_text(encoding='utf-8') for p in sorted(SRC.glob('glossary*.md')))
    entries = parse_glossary(glossary_text)

    chapter_paths = sorted(p for p in SRC.glob('*.md') if re.match(r'^\d\d-', p.name))
    chapters = [parse_chapter(p, i + 1) for i, p in enumerate(chapter_paths)]
    by_id = {c['id']: c for c in chapters}
    if len(by_id) != len(chapters):
        err('duplicate chapter ids')

    def check_abbr(md, where):
        for tok in sorted(abbr.unknown_caps(md)):
            err(f'{where}: abbreviation {tok} is not in data/guide/abbr.md (add it, or to ignore: if it is not one)')

    # render glossary bodies (may link to other terms)
    for e in entries:
        check_abbr(e['md'], f'glossary {e["id"]}')
        e['html'] = render_blocks(abbr.expand(e['md']), f'glossary:{e["id"]}')
        e['text'] = re.sub(r'<[^>]+>', '', e['html'])
        for s in e['see']:
            if s not in GLOSSARY:
                err(f'glossary {e["id"]}: unknown see: {s}')
        if e['chapter']:
            ch = by_id.get(e['chapter'])
            if not ch:
                err(f'glossary {e["id"]}: unknown chapter {e["chapter"]}')
            elif e['section'] and not any(s['id'] == e['section'] for s in ch['sections']):
                err(f'glossary {e["id"]}: unknown section {e["chapter"]}/{e["section"]}')
        del e['md']

    # render chapters
    kps = load_kps()
    for c in chapters:
        check_abbr(c['lead_md'], c['file'])
        c['lead'] = render_blocks(abbr.expand(c['lead_md']), f'{c["id"]}:lead')
        for s in c['sections']:
            check_abbr(s['md'], f'{c["file"]} §{s["id"]}')
            s['html'] = render_blocks(abbr.expand(s['md']), f'{c["id"]}:{s["id"]}')
            del s['md']
        del c['lead_md']
        for slug, names in c['practice'].items():
            if slug not in kps:
                err(f'{c["file"]}: practice exam {slug!r} not in reviewed.js')
                continue
            for name in names:
                if name not in kps[slug]:
                    err(f'{c["file"]}: practice kp {name!r} not a {slug} knowledge point')
        if c['skills']:
            areas = load_skill_areas(c['skills'])
            if areas is None:
                err(f'{c["file"]}: skills {c["skills"]!r} has no data/skills/{c["skills"]}.md')
            else:
                ids = {s['id'] for s in c['sections']}
                for a in sorted(areas - ids):
                    err(f'{c["file"]}: skills chapter lacks a section {{#{a}}} for sub-area {a.upper()}')
                for s in sorted(ids - areas):
                    if re.match(r'^[a-z]\d+$', s):
                        err(f'{c["file"]}: section {{#{s}}} is not a {c["skills"]} sub-area')
        del c['file']

    # which chapters mention which terms (for the glossary "appears in" links)
    for e in entries:
        e['used'] = sorted(TERMS_USED.get(e['id'], set()) - {'glossary'})

    # highlight list: every alias and term, longest first; skip nohl entries
    hl = []
    seen = set()
    for e in entries:
        if e['nohl']:
            continue
        for alias in [e['term'], *e['aliases']]:
            key = alias.lower()
            if key in seen:
                continue
            seen.add(key)
            hl.append([alias, e['id']])
    hl.sort(key=lambda a: (-len(a[0]), a[0]))

    for w in warnings:
        print('warning:', w, file=sys.stderr)
    if errors:
        for e in errors:
            print('error:', e, file=sys.stderr)
        sys.exit(f'{len(errors)} error(s); data/guide.js not written')

    data = {
        'generated': datetime.date.today().isoformat(),
        'chapters': chapters,
        'glossary': entries,
        'hl': hl,
    }
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    OUT.write_text(
        '// Microsoft concept guide: built by tools/build_guide.py from data/guide/*.md. Do not edit by hand.\n'
        f'window.GUIDE = {body};\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)}: {len(chapters)} chapters, {sum(len(c["sections"]) for c in chapters)} sections, '
          f'{len(entries)} glossary entries, {len(hl)} highlight aliases')


if __name__ == '__main__':
    main()
