"""Abbreviation expansion shared by build_guide.py and build_skills.py.

data/guide/abbr.md lists every abbreviation the guide and the skills outline use, with its English full
name and a Chinese explanation. Within one scope (a chapter section, a glossary entry, a skills sub-area)
the first time an abbreviation appears it gets "（full name，中文）" after it, so a reader who jumps straight
to that section never meets a bare SFT or CAF. Where the text already spells it out ("Cloud Adoption
Framework（CAF）") nothing is added; where a parenthesis already follows ("SLM（如 Phi 系列）") the full
name goes inside it.

unknown_caps() reports all-caps tokens that are neither listed nor ignored, so the builds can fail on them.
"""
import re
from pathlib import Path

ABBR_FILE = Path(__file__).resolve().parent.parent / 'data' / 'guide' / 'abbr.md'

ABBR = {}       # 'SFT' -> (en, zh)
IGNORE = set()
KEEP = []       # product names left as written: Cosmos DB, VS Code

# Identifiers rather than abbreviations: question and rule numbers (Q12, R5), skills ids (A1, C2), answer
# letter counts (B16), license tiers (P1), resource names in questions (AI1, CS1), GPU models (H100).
ID_RE = re.compile(r'^[A-Z]{1,3}\d+[A-Z]?\d*$')
UNIT_BEFORE = re.compile(r'\d\s?$')
ASCII_WORD = 'A-Za-z0-9_'


def load():
    if ABBR:
        return
    for line in ABBR_FILE.read_text(encoding='utf-8').splitlines():
        if line.startswith('ignore:'):
            IGNORE.update(s.strip() for s in line[7:].split('|') if s.strip())
            continue
        if line.startswith('keep:'):
            KEEP.extend(s.strip() for s in line[5:].split('|') if s.strip())
            continue
        m = re.match(r'^- ([A-Za-z0-9]+):\s*(.*)$', line)
        if not m:
            continue
        en, _, zh = m.group(2).partition('|')
        ABBR[m.group(1)] = (en.strip(), zh.strip())


def _token_re():
    keys = sorted(ABBR, key=len, reverse=True)
    # ASCII boundaries only: Chinese characters count as \w in Python, and "用SFT" must still match.
    # A plural s is allowed (LLMs, APIs) and a version suffix is kept with the name (GPT-5, GPT-4o);
    # any other hyphen means a compound word, which is left alone (AI-powered, DALL-E).
    return re.compile(r'(?<![%s.\-])(%s)(s?(?:-\d[A-Za-z0-9]*(?:\.\d+[A-Za-z0-9]*)*)?)(?![%s\-])'
                      % (ASCII_WORD, '|'.join(map(re.escape, keys)), ASCII_WORD))


_TOKEN = None


def _protected(line):
    """Spans that must not be touched: inline code, markdown links (text and URL), bare URLs, {#anchors},
    and the id half of [[term|text]] links. Returns (spans, term_links) where term_links are the
    [[...]] spans, inside whose text part an abbreviation counts but the expansion goes after the ]]."""
    spans = []
    for phrase in KEEP:
        for m in re.finditer(re.escape(phrase), line):
            spans.append((m.start(), m.end()))
    for m in re.finditer(r'`[^`]*`|\[[^\[\]]*\]\([^)\s]*\)|https?://[^\s)|]+|\{#[\w-]+\}|<[^>]+>', line):
        spans.append((m.start(), m.end()))
    links = []
    for m in re.finditer(r'\[\[([^\]|]+)(?:\|([^\]]*))?\]\]', line):
        links.append((m.start(), m.end()))
        spans.append((m.start(), m.start(2) if m.group(2) is not None else m.end()))
    return spans, links


def _explained(line, start, end, en, zh):
    """True when the text right around the abbreviation already says what it stands for."""
    names = [n.lower() for n in (en, zh.split('：')[0]) if n]
    before = line[max(0, start - 80):start].lower()
    if any(n in before for n in names) or (en and line[start:].lower().startswith(en.lower())):
        return True
    m = re.match(r'\**\s?[（(]([^（）()]*)[）)]', line[end:])
    return bool(m and any(n in m.group(1).lower() for n in names))


def gloss(key):
    en, zh = ABBR[key]
    return '，'.join(s for s in (en, zh) if s)


def expand_line(line, seen):
    global _TOKEN
    load()
    if _TOKEN is None:
        _TOKEN = _token_re()
    spans, links = _protected(line)
    inserts = []  # (position, text[, characters to drop after it])
    for m in _TOKEN.finditer(line):
        key = m.group(1)
        if key in seen or any(a <= m.start() < b for a, b in spans):
            continue
        if key in ('KB', 'MB', 'GB') and UNIT_BEFORE.search(line[:m.start()]):
            continue  # 28 KB is a size, not a knowledge base
        seen.add(key)
        en, zh = ABBR[key]
        end = m.end()
        for a, b in links:
            if a <= m.start() < b:
                end = b
        if _explained(line, m.start(), end, en, zh):
            continue
        paren = re.match(r'\**\s?[（(]', line[end:])
        if paren:
            inserts.append((end + paren.end(), gloss(key) + '；'))
        else:
            # "CAF 的" becomes "CAF（…）的": the space only separated Latin from Chinese
            gap = 1 if re.match(r' [\u4e00-\u9fff，。；、：]', line[end:end + 2]) else 0
            inserts.append((end, '（%s）' % gloss(key), gap))
    for pos, text, *gap in sorted(inserts, reverse=True):
        line = line[:pos] + text + line[pos + (gap[0] if gap else 0):]
    return line


def expand(md, seen=None):
    """Expand abbreviations in a block of Markdown; headings and fenced code are left alone."""
    seen = set() if seen is None else seen
    out = []
    fenced = False
    for line in md.split('\n'):
        if line.strip().startswith('```'):
            fenced = not fenced
            out.append(line)
            continue
        if fenced or re.match(r'^\s*#', line):
            out.append(line)
            continue
        out.append(expand_line(line, seen))
    return '\n'.join(out)


def unknown_caps(md):
    """All-caps tokens in md (outside code and URLs) that abbr.md neither explains nor ignores."""
    load()
    text = re.sub(r'`[^`]*`|\]\([^)\s]*\)|https?://\S+|\{#[\w-]+\}|\[\[[^\]|]+\|?', ' ', md)
    found = set()
    for phrase in KEEP:
        text = text.replace(phrase, ' ')
    for m in re.finditer(r'(?<![%s.\-])([A-Z][A-Z0-9]+?)(s?)(?![%s\-])' % (ASCII_WORD, ASCII_WORD), text):
        tok = m.group(1) + m.group(2)
        base = m.group(1)
        if tok in ABBR or base in ABBR or tok in IGNORE or base in IGNORE or ID_RE.match(tok):
            continue
        found.add(tok)
    return found
