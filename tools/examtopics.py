#!/usr/bin/env python3
"""Build the offline question bank for the study app from ExamTopics.

Reads the exam table and the logged-in Cookie header from EXAM_SOURCES.md, downloads every
question page and discussion thread (one request at a time, with delays), then writes
data/bank.js and stores every question/answer image under data/img/.

    python3 tools/examtopics.py                      # fetch + build, raw pages in a temp dir
    python3 tools/examtopics.py --cache .cache       # keep raw pages: re-runs resume / re-parse offline
    python3 tools/examtopics.py build --cache .cache # re-parse cached pages only

If the cookie expires mid-run, paste a fresh one into EXAM_SOURCES.md and re-run with the same --cache.
Cached pages are never re-downloaded, so delete the cache folder (or omit --cache) to pick up new questions and votes.
data/areas.js (the hand-transcribed drag & drop / hotspot answer areas) is never touched.
"""

import argparse
import difflib
import hashlib
import html
import json
import os
import pathlib
import random
import re
import sys
import tempfile
import time
from html.parser import HTMLParser

import requests

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = "https://www.examtopics.com"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
LOGIN_WALL = "Create a free account or log in to continue"
PAGE_DELAY, COMMENT_DELAY, IMAGE_DELAY = 3.0, 2.0, 0.3

DISCUSSION_BUTTON = re.compile(
    r"openDiscussionModal\('(\d+)', '([0-9a-f]+)'\); return false;\" class=\"btn btn-secondary question-discussion-button"
    r".*?<span class=\"badge badge-pill badge-light\">\s*(\d*)\s*</span>", re.S)


def log(*parts):
    print(*parts, flush=True)


def read_sources(md_path):
    md = md_path.read_text()
    m = re.search(r"```[^\n]*\n\s*(PHPSESSID=[^\n]+)\n", md)
    if not m:
        sys.exit(f"No Cookie header (starting with PHPSESSID=) found in a code block of {md_path}")
    exams = [{"code": code, "title": title, "expected": int(n), "url": url.rstrip("/") + "/"}
             for code, title, n, url in re.findall(
                 r"^\|\s*([A-Z]{2}-\d{3})\s*\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*(https://\S+?)\s*\|", md, re.M)]
    if not exams:
        sys.exit(f"No exam rows found in the table of {md_path}")
    return m.group(1).strip(), exams


class Fetcher:
    """Sequential, rate-limited GETs; text pages are cached on disk so runs can resume."""

    def __init__(self, cookie):
        self.http = requests.Session()
        self.http.headers.update({"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9", "Cookie": cookie})
        self.ready_at = 0.0

    def get(self, url, delay, referer=None):
        time.sleep(max(0.0, self.ready_at - time.time()))
        for attempt in range(5):
            r = self.http.get(url, timeout=60, allow_redirects=False, headers={"Referer": referer} if referer else {})
            if r.status_code not in (429, 500, 502, 503, 504):
                break
            log(f"  HTTP {r.status_code}, backing off")
            time.sleep(20 * (attempt + 1))
        self.ready_at = time.time() + delay * random.uniform(0.8, 1.5)
        return r

    def page(self, url, path, delay, referer=None):
        if path.exists():
            return path.read_text()
        r = self.get(url, delay, referer)
        if r.status_code != 200:
            sys.exit(f"HTTP {r.status_code} for {url}")
        if LOGIN_WALL in r.text:
            sys.exit("ExamTopics returned the login wall: the session cookie has expired.\n"
                     "Paste a fresh Cookie header into EXAM_SOURCES.md and re-run with the same --cache to resume.")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(r.text)
        return r.text


def exam_pages(cache, slug):
    return sorted((cache / slug).glob("page-*.html"))


def fetch(fetcher, exams, cache):
    for exam in exams:
        slug, base = exam["code"].lower(), exam["url"]
        first = fetcher.page(base, cache / slug / "page-01.html", PAGE_DELAY)
        total = int(re.search(r"Viewing page 1 out of (\d+) pages", first).group(1))
        for n in range(2, total + 1):
            fetcher.page(f"{base}{n}/", cache / slug / f"page-{n:02d}.html", PAGE_DELAY, referer=base)
            log(f"{exam['code']}: page {n}/{total}")
        threads = [(h, int(c)) for p in exam_pages(cache, slug)
                   for _, h, c in DISCUSSION_BUTTON.findall(p.read_text()) if c]
        for i, (h, _) in enumerate(threads, 1):
            fetcher.page(f"{SITE}/comments/{h}/", cache / "comments" / f"{h}.html", COMMENT_DELAY, referer=base)
            if i % 10 == 0 or i == len(threads):
                log(f"{exam['code']}: discussions {i}/{len(threads)}")


# ---------------------------------------------------------------- parsing

CARD = '<div class="card exam-question-card"'
LABELS = {"DRAG DROP": "dragdrop", "HOTSPOT": "hotspot", "SIMULATION": "simulation"}
CASE_SECTIONS = {
    "background", "overview", "general overview", "company overview", "current environment", "existing environment",
    "requirements", "business requirements", "technical requirements", "security requirements", "planned changes",
    "problem statement", "problem statements", "issues and constraints", "constraints", "goals", "physical locations",
    "solution requirements", "existing infrastructure", "monitoring and maintenance", "compliance and security",
    "planned initiatives",
}
BLOCK_TAG = re.compile(r"<(table|ul|ol|pre|p)\b")


class Sanitizer(HTMLParser):
    """Allowlist HTML cleaner: keeps simple formatting, tables, links, and images re-pointed to local copies."""

    KEEP = {"b", "strong", "i", "em", "u", "sub", "sup", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th",
            "code", "pre", "p"}
    DROP = {"script", "style", "noscript", "iframe", "button", "form", "textarea", "select", "svg"}

    def __init__(self, image):
        super().__init__(convert_charrefs=True)
        self.image, self.out, self.open, self.skip = image, [], [], 0

    def handle_starttag(self, tag, attrs):
        if tag in self.DROP:
            self.skip += 1
        if self.skip:
            return
        a = {k: v or "" for k, v in attrs}
        if tag == "br":
            self.out.append("<br>")
        elif tag == "img":
            src = self.image(a.get("src", ""))
            if src:
                alt = a.get("alt") or a.get("title") or "exhibit"
                self.out.append(f'<img src="{html.escape(src)}" alt="{html.escape(alt)}" loading="lazy">')
        elif tag == "a" and re.match(r"https?://", a.get("href", "")):
            self.out.append(f'<a href="{html.escape(a["href"])}" target="_blank" rel="noopener noreferrer">')
            self.open.append(tag)
        elif tag in self.KEEP:
            span = "".join(f' {k}="{a[k]}"' for k in ("colspan", "rowspan") if a.get(k, "").isdigit())
            self.out.append(f"<{tag}{span}>")
            self.open.append(tag)

    def handle_endtag(self, tag):
        if tag in self.DROP:
            self.skip = max(0, self.skip - 1)
            return
        if self.skip or tag not in self.open:
            return
        while self.open:
            t = self.open.pop()
            self.out.append(f"</{t}>")
            if t == tag:
                break

    def handle_data(self, data):
        if not self.skip:
            self.out.append(html.escape(data, quote=False))

    def result(self):
        self.close()
        self.out += [f"</{t}>" for t in reversed(self.open)]
        return re.sub(r"[ \t\r\n\f\v]+", " ", "".join(self.out)).strip()


# Transcription errors in the source text that reach the learner; applied to question text, choices and scenarios.
CORRECTIONS = [
    ("Blue Vender", "Blue Yonder"), ("Fabrikarn", "Fabrikam"), ("not at au.", "not at all."),
    ("You may need o dag the", "You may need to drag the"), ("retuned results", "returned results"),
    ("Azure Constant Understanding", "Azure Content Understanding"), ("in Foundry Too to", "in Foundry Tools to"),
    ("Validate the voice against", "Validate the invoice against"),
]


def correct(text):
    for wrong, right in CORRECTIONS:
        text = text.replace(wrong, right)
    return text


def clean(fragment, image):
    s = Sanitizer(image)
    s.feed(fragment)
    return correct(s.result())


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).replace("\xa0", " ").strip()


def lines_of(safe_html):
    return [line.strip() for line in safe_html.split("<br>")]


def trim(lines):
    while lines and not text_of(lines[0]) and "<img" not in lines[0]:
        lines.pop(0)
    while lines and not text_of(lines[-1]) and "<img" not in lines[-1]:
        lines.pop()
    return lines


ASKING = r"(?:Which|What|How|Where|When|Why|Does|Do|Is|Are|Should|Can|In which|In what|To what|To which)\b"
QUESTION_LINE = re.compile(rf"(?:{ASKING}|For each\b).*\?")
BULLET = re.compile(r"^\s*(?:[•·▪◦‣●■►➢*]|[-–—](?=\s))\s*")
KV = re.compile(r"^([A-Z0-9][^<>:]{0,58}[^\s<>:]):\s+(?=\S)")
COUNT = re.compile(r"\b(two|three|four|five|six|seven|eight|nine|ten)\b", re.I)
COUNTS = {w: i for i, w in enumerate("two three four five six seven eight nine ten".split(), 2)}
# Verbs and pronouns mark a sentence, not a label. Case-sensitive, so "IT/security" still reads as a label.
NOT_A_HEADING = re.compile(r"\b(is|are|was|were|be|will|must|should|can|could|may|might|has|have|had|does|do|did|"
                           r"who|which|that|you|we|they|it)\b|^(You|We|They|It|This|These|There)\b")


def ends_sentence(t):
    return bool(re.search(r"[.!?][)\"'”’]?$", t))


def sentences(t):
    return len(re.findall(r"[.!?][)\"'”’]?(?:\s+(?=[A-Z])|$)", t))


def kv_label(t):
    """The label of a "Label: value" line ("Data sources: SharePoint"), if it is one."""
    m = KV.match(t)
    label = m and m.group(1)
    if label and len(label.split()) <= 7 and not NOT_A_HEADING.search(label) and label.upper() not in ("NOTE", "SOLUTION"):
        return label
    return None


def headingish(t):
    """A short label such as "Data sources" or "Identity and access"."""
    words = t.split()
    return (0 < len(words) <= 6 and len(t) <= 60 and (t[0].isupper() or t[0].isdigit())
            and t[-1] not in ".:;,!?" and words[0] not in ("A", "An", "The") and ":" not in t
            and not NOT_A_HEADING.search(t) and not BULLET.match(t))


def line_kind(t):
    if BULLET.match(t):
        return "bullet"
    if t.endswith(":"):
        return "lead"
    if kv_label(t):
        return "kv"
    return "text"


def is_ask(t):
    return bool(QUESTION_LINE.match(t)) or t.startswith("For each of the following statements")


def blocks(lines, heading=lambda text: False, stem=False):
    """Turn ExamTopics' flat <br>-separated lines back into structure.

    The site flattens headings, lists and paragraphs into lines, so this restores them from the
    shape of the text: short label lines become sub-headings, a line ending in ":" opens a list of
    the lines that follow, "Label: value" runs become lists with bold labels, and every other line is
    its own paragraph. In question stems the actual question is marked up so it stands out.
    """
    lines = trim(list(lines))
    texts = [text_of(l) for l in lines]
    out, items, shape, limit, led = [], None, None, None, False

    def next_text(i):
        for j in range(i + 1, len(lines)):
            if texts[j] or "<img" in lines[j]:
                return texts[j]
        return None

    def introduces(i):
        nxt = next_text(i)
        return (bool(nxt) and (line_kind(nxt) in ("lead", "kv", "bullet") or sentences(nxt) >= 2)
                and not headingish(nxt) and not is_ask(nxt))

    def close():
        nonlocal items, shape, limit, led
        if items:
            cls = ' class="kv"' if shape == "kv" else ""
            out.append(f"<ul{cls}>" + "".join(f"<li>{x}</li>" for x in items) + "</ul>")
        items, shape, limit, led = None, None, None, False

    def item(line, kind):
        if kind == "bullet":
            line = BULLET.sub("", line, count=1)
        m = KV.match(line)
        return f"<b>{m.group(1)}:</b> {line[m.end():]}" if m and kv_label(text_of(line)) else line

    def fits(i, t, kind):
        """Does line i continue the open list?"""
        if limit and len(items) >= limit:
            return False
        if kind == "lead" or is_ask(t) or t.startswith(("You need to", "NOTE:", "Note:")):
            return False
        if headingish(t):  # question stems have no sub-headings, so a short line there is always an item
            return shape in (None, "frag") and (stem or not introduces(i))
        if shape is None or (shape == "kv" and kind == "text" and line_kind(next_text(i) or "") == "kv"):
            return True
        if shape == "bullet":
            return kind == "bullet"
        if shape == "kv":
            return kind == "kv" or (led and kind == "text")
        if shape == "frag":
            return not ends_sentence(t)
        return ends_sentence(t) and sentences(t) <= 2  # "sent": one- or two-sentence items

    for i, (line, t) in enumerate(zip(lines, texts)):
        if not t and "<img" not in line:
            close()
            continue
        if not t:  # an image on its own line is an exhibit, never a list item
            close()
            out.append(f"<p>{line}</p>")
            continue
        if BLOCK_TAG.search(line) or line.startswith('<div class="solution">'):
            close()
            out.append(line)
            continue
        if heading(t):
            close()
            out.append(f"<h4>{line}</h4>")
            continue
        kind = line_kind(t)
        if items is not None:
            if fits(i, t, kind):
                if shape is None:
                    shape = kind if kind in ("bullet", "kv") else "sent" if ends_sentence(t) else "frag"
                items.append(item(line, kind))
                continue
            close()
        if kind == "lead" and not is_ask(t):
            out.append(f"<p>{line}</p>")
            counts = COUNT.findall(t)
            items, shape, limit, led = [], None, COUNTS[counts[0].lower()] if len(counts) == 1 else None, True
        elif kind == "bullet":
            items, shape = [item(line, kind)], "bullet"
        elif not stem and headingish(t) and next_text(i) and "<img" not in line:
            out.append(f"<h5>{line}</h5>")
        elif kind == "kv" and any(line_kind(texts[j]) == "kv" for j in range(i + 1, min(i + 3, len(lines)))):
            items, shape = [item(line, kind)], "kv"
        elif stem and is_ask(t):
            m = re.match(r"(.*?\?)(\s.*)?$", line)
            out.append(f'<p class="ask"><strong>{m.group(1)}</strong>{m.group(2) or ""}</p>' if m
                       else f'<p class="ask">{line}</p>')
        elif stem and t.endswith("?") and (m := re.match(rf"(.*?[.!])\s+({ASKING}[^.!?]*\?)$", line)):
            out.append(f'<p>{m.group(1)}</p><p class="ask"><strong>{m.group(2)}</strong></p>')
        elif stem and t.upper().startswith("NOTE:"):
            out.append(f'<p class="note">{line}</p>')
        else:
            out.append(f"<p>{line}</p>")
    close()
    return "".join(out)


SERIES_NOTES = ("Note: This question is part of a series", "Note: This section contains one or more sets of questions")
SERIES_DROP = SERIES_NOTES + ("After you answer a question in this section",)


def stem_html(lines):
    """Question text → (html, part_of_series). Series boilerplate is dropped and the proposed solution set apart."""
    texts = [text_of(l) for l in lines]
    series = bool(texts) and texts[0].startswith(SERIES_NOTES)
    if series:
        lines = [f'<div class="solution"><span>Proposed solution</span>{l.split("Solution:", 1)[1].strip()}</div>'
                 if t.startswith("Solution:") else l
                 for l, t in zip(lines, texts) if not t.startswith(SERIES_DROP)]
    return blocks(lines, stem=True), series
COMPANY = re.compile(r"([A-Z][\w&.,' -]{2,60}?),?\s+(?:is|are|has|was|operates|provides|manufactures|sells|develops|runs)\b")


def stem_start(texts):
    """Index of the first line of the question itself, after a case-study scenario."""
    for pattern in (lambda t: t.startswith("You need to"), QUESTION_LINE.match):
        hits = [i for i, t in enumerate(texts) if pattern(t)]
        if hits:
            return hits[-1]
    blanks = [i for i, t in enumerate(texts[:-1]) if not t]
    return blanks[-1] + 1 if blanks else max(0, len(texts) - 2)


def case_name(lines):
    for t in [text_of(l) for l in lines][:12]:
        m = COMPANY.match(t)
        if m and not m.group(1).lower().startswith(("the ", "this ", "it ", "they ", "we ", "you ")):
            return m.group(1).strip(" ,")
    return "Case study"


def parse_card(card, image):
    q = {"n": int(re.search(r"<strong>Question #(\d+)</strong>", card).group(1)),
         "id": int(re.search(r'question-body" data-id="(\d+)"', card).group(1))}
    badge = re.search(r"question-title-topic[^>]*>\s*Topic\s+(\d+)", card)
    q["topic"] = int(badge.group(1)) if badge else 1
    header = re.search(r"\(Topic:\s*(.*?)\)\s*<span", card, re.S)  # "Topic 1: Name", "Topic 1, Name" or "Exam A"
    named = re.match(r"Topic\s+\d+\s*[:,]\s*(.+)", header.group(1).strip()) if header else None
    topic_name = named.group(1).strip() if named else ""

    body = re.search(r'<p class="card-text">(.*?)</p>\s*<div class="question-choices-container">', card, re.S).group(1)
    lines = trim(lines_of(clean(body, image)))
    label = None
    while lines and text_of(lines[0]).upper() in LABELS:
        label = label or LABELS[text_of(lines[0]).upper()]
        lines = trim(lines[1:])

    case = None
    texts = [text_of(l) for l in lines]
    if any(t.startswith("This is a case study") for t in texts[:3]):
        cut = stem_start(texts)
        start = next((i + 1 for i, t in enumerate(texts) if t.startswith("To display the first question")), 0)
        case_lines = trim(lines[start:cut])
        case = {"name": case_name(case_lines),
                "html": blocks(case_lines, heading=lambda t: t.lower().rstrip(":") in CASE_SECTIONS)}
        lines = trim(lines[cut:])

    q["stem"], series = stem_html(lines)
    if series:
        q["series"] = True

    q["choices"] = []
    correct = ""
    for attrs, letter, inner in re.findall(
            r'<li class="multi-choice-item"([^>]*)>\s*<span class="multi-choice-letter" data-choice-letter="([A-Z])">'
            r".*?</span>(.*?)</li>", card, re.S):
        inner = re.sub(r"<span[^>]*most-voted-answer-badge[^>]*>.*?</span>", "", inner, flags=re.S)
        q["choices"].append({"k": letter, "html": clean(inner, image)})
        correct += letter if "data-correct" in attrs else ""

    ans = re.search(r"<strong>Correct Answer:</strong>\s*<strong class=\"ml-1\">(.*?)</strong>", card, re.S)
    raw = ans.group(1) if ans else ""
    letters = text_of(raw).replace(" ", "")
    q["answer"] = letters if re.fullmatch(r"[A-Z]+", letters) else correct
    if "<img" in raw:
        q["answerHtml"] = blocks(lines_of(clean(raw, image)))
    explain = re.search(r'<span class="answer-description">(.*?)</span>\s*</span>', card, re.S)
    if explain and text_of(explain.group(1)):
        q["explanation"] = blocks(lines_of(clean(explain.group(1), image)))

    if q["choices"]:
        yes_no = [text_of(c["html"]).rstrip(".").lower() for c in q["choices"]] == ["yes", "no"]
        q["type"] = "yesno" if yes_no else ("multi" if len(q["answer"]) > 1 else "single")
    else:
        q["type"] = label or "image"

    chart = re.search(r'class="answer-chart" data-chart="([^"]*)"', card)
    q["votes"] = [{"a": v["answer"], "p": v["percent"], "n": v["votes"]}
                  for v in (json.loads(html.unescape(chart.group(1))) if chart else [])]
    d = DISCUSSION_BUTTON.search(card)
    q["thread"] = d.group(2) if d else None
    return q, topic_name, case


COMMENT = re.compile(
    r'<div id="comment-(\d+)" class="media comment-container"[^>]*?style="margin-left:(\d+)px;">(.*?)'
    r'<div class="comment-ellipsis">', re.S)


def comment_text(fragment):
    s = re.sub(r"[\r\n]+", " ", fragment)  # source newlines are just whitespace; <br> carries the breaks
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</(p|div|li|tr)>", "\n", s, flags=re.I)
    s = re.sub(r'<img[^>]*?src="([^"]+)"[^>]*>', r" [image: \1] ", s, flags=re.I)
    s = html.unescape(html.unescape(re.sub(r"<[^>]+>", "", s))).replace("\xa0", " ")  # the site escapes comments twice
    s = "\n".join(re.sub(r"[ \t]+", " ", line).strip() for line in s.strip().splitlines())
    return re.sub(r"\n{3,}", "\n\n", s)


def parse_comments(text):
    roots, stack = [], []
    for _, margin, block in COMMENT.findall(text):
        user = re.search(r'comment-username">(.*?)</h5>', block, re.S)
        when = re.search(r'comment-date[^"]*" title="([^"]+)"', block)
        body = re.search(r'<div class="comment-content">(.*?)</div>\s*<div class="comment-control">', block, re.S)
        picked = re.search(r"Selected Answer:\s*<span><strong>([^<]*)</strong>", block)
        votes = re.search(r'class="upvote-count"[^>]*>(\d+)', block)
        try:
            date = time.strftime("%Y-%m-%d", time.strptime(when.group(1), "%B %d, %Y %I:%M %p")) if when else ""
        except ValueError:
            date = ""
        c = {"user": text_of(user.group(1)) if user else "", "date": date,
             "up": int(votes.group(1)) if votes else 0, "text": comment_text(body.group(1)) if body else ""}
        if picked and picked.group(1).strip():
            c["pick"] = picked.group(1).strip()
        if "Highly Voted" in block:
            c["top"] = True
        depth = int(margin) // 30
        del stack[depth:]
        (stack[-1].setdefault("replies", []) if stack else roots).append(c)
        stack.append(c)
    return sorted(roots, key=lambda c: (c["up"], c["date"]), reverse=True)


def merge_case_variants(questions, cases):
    """ExamTopics repeats each scenario per question, sometimes with small transcription differences.
    Point near-identical copies (same company, >= 97% similar text) at one canonical copy."""
    canonical = {}
    for key in sorted(cases, key=lambda k: -len(cases[k]["html"])):
        text = text_of(cases[key]["html"])
        for kept in {v for v in canonical.values()}:
            if cases[kept]["name"] == cases[key]["name"] and \
                    difflib.SequenceMatcher(None, text_of(cases[kept]["html"]), text, autojunk=False).ratio() >= 0.97:
                canonical[key] = kept
                break
        else:
            canonical[key] = key
    for q in questions:
        if "case" in q:
            q["case"] = canonical[q["case"]]
    for key in [k for k, v in canonical.items() if k != v]:
        del cases[key]


def link_variants(questions):
    """ExamTopics often lists the same question several times with reshuffled (and partly different) choices,
    each copy with its own answer and votes. Record each question's near-identical siblings (same exam, same
    type, >= 90% similar text, not part of a solution series) so the app can pool their evidence."""
    pool = [q for q in questions if not q.get("series")]
    texts = {q["n"]: re.sub(r"\s+", " ", text_of(q["stem"])) for q in pool}
    group = {q["n"]: q["n"] for q in pool}

    def root(n):
        while group[n] != n:
            n = group[n]
        return n

    for i, a in enumerate(pool):
        for b in pool[i + 1:]:
            if a["type"] != b["type"] or abs(len(texts[a["n"]]) - len(texts[b["n"]])) > 80:
                continue
            m = difflib.SequenceMatcher(None, texts[a["n"]], texts[b["n"]], autojunk=False)
            if m.quick_ratio() >= 0.9 and m.ratio() >= 0.9:
                group[root(b["n"])] = root(a["n"])
    members = {}
    for q in pool:
        members.setdefault(root(q["n"]), []).append(q["n"])
    for q in pool:
        others = [n for n in members[root(q["n"])] if n != q["n"]]
        if others:
            q["variants"] = sorted(others)
        else:
            q.pop("variants", None)


# ---------------------------------------------------------------- build

def build(exams, cache, out):
    out.mkdir(parents=True, exist_ok=True)
    img_href = os.path.relpath(out / "img", ROOT).replace(os.sep, "/")
    downloads = {}

    def image(src):
        m = re.match(r"https://img\.examtopics\.com/([\w.-]+)/([\w.-]+\.(?:png|jpe?g|gif|webp))$", src, re.I)
        if not m:
            return None
        downloads[src] = out / "img" / m.group(1) / m.group(2)
        return f"{img_href}/{m.group(1)}/{m.group(2)}"

    bank = {"generated": time.strftime("%Y-%m-%d"), "exams": []}
    for exam in exams:
        slug = exam["code"].lower()
        questions, topics, cases = {}, {}, {}
        for page in exam_pages(cache, slug):
            page_no = int(re.search(r"page-(\d+)", page.name).group(1))
            for card in page.read_text().split(CARD)[1:]:
                q, topic_name, case = parse_card(card, image)
                q["page"] = page_no
                topics.setdefault(q["topic"], topic_name or f"Topic {q['topic']}")
                if case:
                    key = hashlib.sha1(case["html"].encode()).hexdigest()[:10]
                    cases[key] = case
                    q["case"] = key
                if q["n"] in questions:
                    log(f"  {exam['code']}: duplicate question #{q['n']} (keeping first)")
                    continue
                questions[q["n"]] = q
        merge_case_variants(questions.values(), cases)
        link_variants(questions.values())
        for q in questions.values():
            thread = q.pop("thread")
            path = cache / "comments" / f"{thread}.html" if thread else None
            q["thread"] = f"{SITE}/comments/{thread}/" if thread else None
            q["comments"] = parse_comments(path.read_text()) if path and path.exists() else []

        nums = sorted(questions)
        missing = sorted(set(range(1, (nums[-1] if nums else 0) + 1)) - set(nums))
        if missing or len(nums) != exam["expected"]:
            log(f"  {exam['code']}: WARNING {len(nums)} questions (expected {exam['expected']}), missing {missing[:20]}")
        types = {}
        for q in questions.values():
            types[q["type"]] = types.get(q["type"], 0) + 1
        disputed = sum(1 for q in questions.values() if q["votes"] and q["answer"] and any(
            sorted(v["a"]) != sorted(q["answer"]) for v in q["votes"] if v["n"] == max(x["n"] for x in q["votes"])))
        log(f"{exam['code']}: {len(nums)} questions {types}, {len(cases)} case texts, {disputed} disputed, "
            f"{sum(len(q['comments']) for q in questions.values())} top-level comments")
        bank["exams"].append({"code": exam["code"], "title": exam["title"], "url": exam["url"],
                              "topics": [{"n": n, "name": topics[n]} for n in sorted(topics)],
                              "cases": cases, "questions": [questions[n] for n in nums]})

    if not any(e["questions"] for e in bank["exams"]):
        sys.exit(f"No questions found in {cache}; leaving {out / 'bank.js'} untouched.")
    pending = {src: dst for src, dst in downloads.items() if not dst.exists()}
    log(f"images: {len(downloads)} referenced, {len(pending)} to download")
    for i, (src, dst) in enumerate(pending.items(), 1):
        r = requests.get(src, timeout=60, headers={"User-Agent": UA, "Referer": SITE + "/"})
        if r.status_code == 200 and r.headers.get("content-type", "").startswith("image/"):
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(r.content)
        else:
            log(f"  image failed ({r.status_code}): {src}")
        time.sleep(IMAGE_DELAY)
        if i % 50 == 0:
            log(f"  images {i}/{len(pending)}")

    js = json.dumps(bank, ensure_ascii=False, separators=(",", ":"))
    js = js.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    (out / "bank.js").write_text(f"window.BANK = {js};\n")
    log(f"wrote {out / 'bank.js'} ({len(js) // 1024} KB)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("step", nargs="?", choices=["all", "fetch", "build"], default="all")
    ap.add_argument("--sources", type=pathlib.Path, default=ROOT / "EXAM_SOURCES.md")
    ap.add_argument("--cache", type=pathlib.Path, help="directory for raw HTML (default: temporary)")
    ap.add_argument("--out", type=pathlib.Path, default=ROOT / "data")
    args = ap.parse_args()

    if args.step == "build" and not args.cache:
        ap.error("the build step re-parses cached pages, so it needs --cache")
    cookie, exams = read_sources(args.sources)
    with tempfile.TemporaryDirectory() as tmp:
        cache = args.cache or pathlib.Path(tmp)
        if args.step in ("all", "fetch"):
            fetch(Fetcher(cookie), exams, cache)
        if args.step in ("all", "build"):
            build(exams, cache, args.out)


if __name__ == "__main__":
    main()
