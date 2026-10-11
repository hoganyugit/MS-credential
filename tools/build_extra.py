#!/usr/bin/env python3
"""Build data/extra.js (window.EXTRA) from the supplementary questions in data/extra/<exam slug>.md.

These are questions written for this app in the official exam style, for objectives of the skills-measured
outline that the ExamTopics bank covers thinly. They join their exam in the app flagged "Supplement".

Source format (one file per exam, front matter "exam: AB-620"):

  ### S1 type=single kp="Knowledge sources & grounding" sk=B1.2,A3.5 [series=g1]
  stem paragraphs and "- " lists (Markdown), optionally a ```python fenced code block
  - A. choice            correct choices are marked with a star: "- *B. choice"
  - *B. choice
  > why: one line of explanation
  > ref: https://learn.microsoft.com/...   (1-3 lines)

  type=match|select|order|yesnogrid questions have no choice lines but one ```area fenced block with the
  JSON answer area in the data/areas.js format ("kind": match | select | order | yesno).

  A case study is a "## Case: <name> {#<id>}" block before its questions: its Markdown body (#### headings,
  paragraphs, "- " lists, "**Label:** value" lines) becomes the scenario shown beside each question that
  carries case=<id> in its header. Questions of one case should sit together, as on the real exam.

Output: window.EXTRA = { exams: [{ code, questions: [...] }], areas: { id: area }, reviewed: { id: entry } }
in the shapes of data/bank.js, data/areas.js and data/reviewed.js, so the app treats them like any question.
IDs: 9<exam digits>000 + n (AB-620 -> 9620001…, AB-100 -> 9100001…, AI-103 -> 9103001…); display numbers
start at 1001 so they never collide with ExamTopics numbering.

The build fails on malformed headers, unknown knowledge points (data/reviewed.js) or objectives
(data/skills/<slug>.md), a wrong number of correct choices, answer-area answers that are not among the
options, and missing why/ref lines.

Run: python3 tools/build_extra.py
"""
import datetime
import html as htmlmod
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'data' / 'extra'
OUT = ROOT / 'data' / 'extra.js'

errors = []


def err(msg):
    errors.append(msg)


# ---------------------------------------------------------------- reference data

def load_kps():
    kps = {}
    txt = (ROOT / 'data' / 'reviewed.js').read_text(encoding='utf-8')
    for m in re.finditer(r'^"[^"]+": (\{.*\}),?$', txt, re.M):
        r = json.loads(m.group(1))
        kps.setdefault(r['exam'], set()).add(r['kp'])
    return kps


def load_bullets(slug):
    p = ROOT / 'data' / 'skills' / f'{slug}.md'
    if not p.exists():
        return None
    return set(re.findall(r'^- ([A-Z]\d+\.\d+) ', p.read_text(encoding='utf-8'), re.M))


# ---------------------------------------------------------------- markdown (stem)

def inline(s):
    out = htmlmod.escape(s, quote=False)
    out = re.sub(r'`([^`]+)`', r'<code>\1</code>', out)
    out = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', out)
    return out


def render_stem(lines):
    """Paragraphs, '- ' lists and fenced code blocks -> HTML. The last paragraph is the ask, styled like the bank."""
    blocks = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.strip().startswith('```'):
            j = i + 1
            buf = []
            while j < len(lines) and not lines[j].strip().startswith('```'):
                buf.append(lines[j])
                j += 1
            blocks.append(('code', '\n'.join(buf)))
            i = j + 1
            continue
        if re.match(r'^\s*[-*]\s+', line) and not re.match(r'^\s*[-*]\s*\*?[A-H]\.\s', line):
            items = []
            while i < len(lines) and re.match(r'^\s*[-*]\s+', lines[i]):
                items.append(re.sub(r'^\s*[-*]\s+', '', lines[i]))
                i += 1
            blocks.append(('list', items))
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not lines[i].strip().startswith('```') and not re.match(r'^\s*[-*]\s+', lines[i]):
            para.append(lines[i].strip())
            i += 1
        blocks.append(('p', ' '.join(para)))
    html = []
    last_p = max((k for k, b in enumerate(blocks) if b[0] == 'p'), default=-1)
    for k, (kind, body) in enumerate(blocks):
        if kind == 'code':
            html.append('<pre><code>%s</code></pre>' % htmlmod.escape(body, quote=False))
        elif kind == 'list':
            html.append('<ul>' + ''.join('<li>%s</li>' % inline(x) for x in body) + '</ul>')
        else:
            cls = ' class="ask"' if k == last_p and '?' in body else ''
            html.append('<p%s>%s</p>' % (cls, inline(body)))
    return ''.join(html)


# ---------------------------------------------------------------- parsing

HEAD = re.compile(r'^### S(\d+)\s+type=(\w+)\s+kp="([^"]+)"\s+sk=([\w.,]+)(?:\s+series=(\w+))?(?:\s+case=([\w-]+))?\s*$')
CASE_HEAD = re.compile(r'^## Case: (.+?)\s*\{#([\w-]+)\}\s*$')


def render_case(lines):
    """Case-study body: #### headings -> h4, ##### -> h5, paragraphs, '- ' lists (with **Label:** value items)."""
    html = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if not line.strip():
            i += 1
            continue
        m = re.match(r'^(#{3,5})\s+(.*)$', line)
        if m:
            lvl = min(len(m.group(1)) + 1, 6)
            html.append('<h%d>%s</h%d>' % (lvl, inline(m.group(2)), lvl))
            i += 1
            continue
        if re.match(r'^\s*[-*]\s+', line):
            items = []
            while i < len(lines) and re.match(r'^\s*[-*]\s+', lines[i]):
                items.append(re.sub(r'^\s*[-*]\s+', '', lines[i].rstrip()))
                i += 1
            kv = all(re.match(r'^\*\*[^*]+:\*\*', x) for x in items)
            html.append('<ul%s>' % (' class="kv"' if kv else '') + ''.join('<li>%s</li>' % inline(x) for x in items) + '</ul>')
            continue
        para = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#{3,5})\s+|^\s*[-*]\s+', lines[i]):
            para.append(lines[i].strip())
            i += 1
        html.append('<p>%s</p>' % inline(' '.join(para)))
    return ''.join(html)
CHOICE = re.compile(r'^- (\*?)([A-H])\. (.+?)\s*$')

EXAM_BASE = {'AB-620': 9620000, 'AB-100': 9100000, 'AI-103': 9103000}
TYPE_FOR_AREA = {'match': 'dragdrop', 'order': 'dragdrop', 'select': 'hotspot', 'yesno': 'hotspot'}


def parse_file(path, kps):
    text = path.read_text(encoding='utf-8')
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not m:
        err(f'{path.name}: missing front matter')
        return None
    meta = dict(l.partition(':')[::2] for l in m.group(1).splitlines() if ':' in l)
    code = meta.get('exam', '').strip()
    if code not in EXAM_BASE:
        err(f'{path.name}: unknown exam {code!r}')
        return None
    bullets = load_bullets(path.stem.split('-cases')[0] if '-cases' in path.stem else path.stem)
    body = text[m.end():]
    chunks = re.split(r'^(?=### S\d+|## Case: )', body, flags=re.M)
    questions, areas, reviewed, cases = [], {}, {}, {}
    seen_n = set()
    for chunk in chunks:
        if chunk.strip().startswith('## Case: '):
            head, _, rest = chunk.partition('\n')
            cm = CASE_HEAD.match(head.strip())
            if not cm:
                err(f'{path.name}: bad case header {head.strip()[:80]!r}')
                continue
            cid = f'x-{cm.group(2)}'
            if cid in cases:
                err(f'{path.name}: duplicate case id {cm.group(2)}')
            cases[cid] = {'name': cm.group(1).strip(), 'html': render_case(rest.split('\n'))}
            continue
        if not chunk.strip().startswith('### S'):
            if chunk.strip():
                err(f'{path.name}: text outside a question: {chunk.strip()[:60]!r}')
            continue
        head, _, rest = chunk.partition('\n')
        hm = HEAD.match(head.strip())
        if not hm:
            err(f'{path.name}: bad header {head.strip()[:80]!r}')
            continue
        n, qtype, kp, sk, series, case = int(hm.group(1)), hm.group(2), hm.group(3), hm.group(4).split(','), hm.group(5), hm.group(6)
        where = f'{path.name} S{n}'
        if case and f'x-{case}' not in cases:
            err(f'{where}: unknown case {case!r} (define "## Case: … {{#{case}}}" above the question)')
        if n in seen_n:
            err(f'{where}: duplicate number')
        seen_n.add(n)
        if kp not in kps.get(code, set()):
            err(f'{where}: unknown knowledge point {kp!r} for {code}')
        if bullets is not None:
            for b in sk:
                if b not in bullets:
                    err(f'{where}: unknown objective {b}')
        stem_lines, choices, why, refs, area = [], [], '', [], None
        lines = rest.split('\n')
        i = 0
        while i < len(lines):
            line = lines[i]
            if line.strip().startswith('```area'):
                j = i + 1
                buf = []
                while j < len(lines) and not lines[j].strip().startswith('```'):
                    buf.append(lines[j])
                    j += 1
                try:
                    area = json.loads('\n'.join(buf))
                except json.JSONDecodeError as e:
                    err(f'{where}: bad area JSON: {e}')
                i = j + 1
                continue
            cm = CHOICE.match(line)
            if cm:
                choices.append({'k': cm.group(2), 'html': inline(cm.group(3)), 'ok': cm.group(1) == '*'})
                i += 1
                continue
            if line.startswith('> why:'):
                why = line[6:].strip()
                i += 1
                continue
            if line.startswith('> ref:'):
                refs.append(line[6:].strip())
                i += 1
                continue
            if line.startswith('>'):
                err(f'{where}: unknown "> " line {line[:40]!r}')
                i += 1
                continue
            stem_lines.append(line)
            i += 1
        if not why:
            err(f'{where}: missing "> why:" line')
        if not refs or not all(r.startswith('https://learn.microsoft.com/') for r in refs):
            err(f'{where}: needs 1-3 "> ref:" Learn URLs')
        qid = EXAM_BASE[code] + n
        q = {
            'n': 1000 + n, 'id': qid, 'topic': 0, 'stem': render_stem(stem_lines), 'choices': [], 'answer': '',
            'answerHtml': '', 'type': qtype, 'votes': [], 'comments': [], 'page': 0, 'thread': '', 'extra': True,
        }
        if ord(sk[0][0]) - ord('A') >= 0:
            q['topic'] = ord(sk[0][0]) - ord('A') + 1  # group letter -> topic number (A=1, B=2, …)
        if series:
            q['series'] = True
        if case:
            q['case'] = f'x-{case}'
        entry = {'exam': code, 'n': q['n'], 'verdict': 'authored', 'confidence': 'high', 'kp': kp, 'why': why, 'ref': refs[0], 'sk': sk, 'refs': refs}
        if qtype in ('single', 'multi', 'yesno'):
            if area:
                err(f'{where}: {qtype} questions take choices, not an area block')
            right = [c['k'] for c in choices if c['ok']]
            if qtype == 'single' and len(right) != 1:
                err(f'{where}: single choice needs exactly one * choice, found {len(right)}')
            if qtype == 'multi' and len(right) < 2:
                err(f'{where}: multiple choice needs two or more * choices')
            if qtype == 'yesno' and (len(choices) != 2 or [c['html'] for c in choices] != ['Yes', 'No'] or len(right) != 1):
                err(f'{where}: yes/no needs exactly the choices Yes and No with one *')
            if len(choices) < 2:
                err(f'{where}: needs choices')
            q['choices'] = [{'k': c['k'], 'html': c['html']} for c in choices]
            q['answer'] = ''.join(right)
            entry['answer'] = q['answer']
        elif qtype in TYPE_FOR_AREA:
            if choices or not area:
                err(f'{where}: {qtype} questions take one ```area block and no choices')
                continue
            if area.get('kind') != qtype:
                err(f'{where}: area kind {area.get("kind")!r} does not match type={qtype}')
            q['type'] = TYPE_FOR_AREA[qtype]
            slots = []
            if qtype == 'order':
                pool, ans = area.get('pool', []), area.get('answer', [])
                if not ans or any(a not in pool for a in ans):
                    err(f'{where}: order answers must come from the pool')
                slots = list(ans)
            else:
                for b in area.get('blocks', []):
                    if b.get('type') != 'row':
                        err(f'{where}: only "row" blocks are supported')
                        continue
                    opts = area.get('pool', []) if qtype == 'match' else ['Yes', 'No'] if qtype == 'yesno' else b.get('options', [])
                    if b.get('answer') not in opts:
                        err(f'{where}: row {b.get("label", "")[:40]!r} answer {b.get("answer")!r} is not one of its options')
                    slots.append(b.get('answer'))
            if len(slots) < 2:
                err(f'{where}: an answer area needs at least two boxes')
            area['exam'] = code
            area['n'] = q['n']
            areas[str(qid)] = area
            entry['boxes'] = slots
        else:
            err(f'{where}: unknown type {qtype}')
            continue
        questions.append(q)
        reviewed[str(qid)] = entry
    return {'code': code, 'questions': questions, 'cases': cases}, areas, reviewed


def main():
    kps = load_kps()
    by_code, areas, reviewed = {}, {}, {}
    for path in sorted(SRC.glob('*.md')) if SRC.is_dir() else []:
        res = parse_file(path, kps)
        if res:
            ex, a, r = res
            cur = by_code.setdefault(ex['code'], {'code': ex['code'], 'questions': [], 'cases': {}})
            dup = {q['n'] for q in cur['questions']} & {q['n'] for q in ex['questions']}
            if dup:
                err(f'{path.name}: question numbers already used in another {ex["code"]} file: {sorted(n - 1000 for n in dup)}')
            cur['questions'] += ex['questions']
            cur['cases'].update(ex['cases'])
            areas.update(a)
            reviewed.update(r)
    exams = [by_code[c] for c in sorted(by_code)]
    if errors:
        for e in errors:
            print('error:', e, file=sys.stderr)
        sys.exit(f'{len(errors)} error(s); data/extra.js not written')
    data = {'generated': datetime.date.today().isoformat(), 'exams': exams, 'areas': areas, 'reviewed': reviewed}
    body = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    OUT.write_text('// Supplementary questions: built by tools/build_extra.py from data/extra/*.md. Do not edit by hand.\n'
                   f'window.EXTRA = {body};\n', encoding='utf-8')
    print(f'wrote {OUT.relative_to(ROOT)}: ' + ', '.join(f'{e["code"]} {len(e["questions"])} questions, {len(e["cases"])} cases' for e in exams) + f'; {len(areas)} answer areas')


if __name__ == '__main__':
    main()
