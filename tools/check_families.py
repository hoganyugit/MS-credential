#!/usr/bin/env python3
"""Check data/families.js against data/bank.js and data/reviewed.js.

A family is one question that ExamTopics lists several times with different choice sets (see the header of
data/families.js). For every family this checks that
  - its listings exist in the bank under the stated exam, numbers and ids, all of one type, with near-identical
    question text (the same question, at most reworded slightly);
  - every option a listing offers is ranked in a rung or listed under never (ladder families), and every short
    label belongs to an option;
  - each listing's reviewed answer is what the ladder predicts: its highest-ranked offered option, or its two
    highest for a "Which two" question, with no tie between interchangeable options of one rung;
  - a "same" family has the same answer in every listing, and a "ladder" family has at least two different ones;
  - a ladder rung has a one-line why and a learn.microsoft.com ref.
It also lists the listings whose ExamTopics answer differs from the ladder, for information.

Run: python3 tools/check_families.py        (exit status 1 on any error)
"""
import difflib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def load(name, marker):
    text = (ROOT / "data" / name).read_text(encoding="utf-8")
    start = text.index(marker) + len(marker)
    return json.loads(text[start:text.rindex(";")] if marker.endswith("= ") else text[start:])


def plain(html):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html or "")).replace("&amp;", "&").strip()


def key(text):
    """The comparison form of an option: the app's choiceText() plus straightened quotes."""
    s = plain(text).lower().replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[\s.]+$", "", s)


def main():
    bank = load("bank.js", "window.BANK = ")
    reviewed = load("reviewed.js", "window.REVIEWED = ")
    families = load("families.js", "window.FAMILIES = ")
    by_id = {q["id"]: (e["code"], q) for e in bank["exams"] for q in e["questions"]}
    errors, notes, seen = [], [], {}

    for f in families:
        name = f"{f['exam']} #{'/#'.join(map(str, f['n']))}"
        err = lambda msg: errors.append(f"{name}: {msg}")
        members = []
        for n, qid in zip(f["n"], f["ids"]):
            code, q = by_id.get(qid, (None, None))
            if q is None or code != f["exam"] or q["n"] != n:
                err(f"id {qid} is not {f['exam']} #{n} in the bank")
                continue
            if qid in seen:
                err(f"#{n} is also in {seen[qid]}")
            seen[qid] = name
            members.append(q)
        if len(f["n"]) != len(f["ids"]) or len(members) < 2:
            err("needs two or more listings, with one id per number")
            continue
        if len({q["type"] for q in members}) > 1:
            err("listings of different types")
        stems = [plain(q["stem"]) for q in members]
        for q, s in zip(members[1:], stems[1:]):
            ratio = difflib.SequenceMatcher(None, stems[0], s, autojunk=False).ratio()
            if ratio < 0.9:
                err(f"#{q['n']}'s question text is only {ratio:.0%} like #{members[0]['n']}'s")
            elif ratio < 1 and "note" not in f and ratio < 0.99:
                notes.append(f"{name}: #{q['n']} words the question differently ({ratio:.1%} alike); consider a note")
        if f["kind"] not in ("ladder", "same"):
            err(f"unknown kind {f['kind']!r}")

        reviews = [reviewed.get(str(q["id"])) for q in members]
        if any(r is None for r in reviews):
            err("a listing has no reviewed answer")
            continue
        if not members[0]["choices"]:  # drag & drop / hotspot: only identical answers can be stated
            if f["kind"] != "same" or f.get("rungs"):
                err("a question without choices can only be a 'same' family without rungs")
            elif any(r.get("boxes") != reviews[0].get("boxes") for r in reviews):
                err("the listings' reviewed answers differ")
            continue

        rungs = [[key(o) for o in r["options"]] for r in f.get("rungs", [])]
        ranked = [k for r in rungs for k in r]
        never = [key(o) for o in f.get("never", [])]
        if len(set(ranked + never)) != len(ranked + never):
            err("an option is listed twice")
        for label in f.get("short", {}):
            if key(label) not in ranked + never:
                err(f"short label for an unknown option: {label!r}")
        if f["kind"] == "same" and len(rungs) != 1:
            err("a 'same' family needs exactly one rung")
        if f["kind"] == "ladder":
            for i, r in enumerate(f["rungs"], 1):
                if not r.get("why") or r["why"] == "DRAFT" or not str(r.get("ref", "")).startswith("https://learn.microsoft.com/"):
                    err(f"rung {i} needs a why and a learn.microsoft.com ref")

        answers = set()
        for q, r in zip(members, reviews):
            offered = {key(c["html"]): c["k"] for c in q["choices"]}
            if f["kind"] == "ladder":
                for k in offered:
                    if k not in ranked and k not in never:
                        err(f"#{q['n']} offers an option that is neither ranked nor under never: {k!r}")
            want = len(r.get("answer", ""))
            picked = []
            for rung in rungs:
                here = [k for k in rung if k in offered]
                if not here:
                    continue
                if len(here) > 1 and len(picked) + len(here) > want:
                    err(f"#{q['n']} offers {len(here)} interchangeable options of one rung")
                picked += here
                if len(picked) >= want:
                    break
            letters = "".join(sorted(offered[k] for k in picked[:want]))
            if letters != "".join(sorted(r["answer"])):
                err(f"#{q['n']}: the ladder gives {letters or 'nothing'}, the reviewed answer is {r['answer']}")
            answers.add(tuple(sorted(k for k in picked[:want] if k)))
            if q["answer"] and "".join(sorted(q["answer"])) != letters:
                notes.append(f"{name}: #{q['n']}'s ExamTopics answer is {q['answer']}, the ladder's is {letters}")
        if f["kind"] == "ladder" and len(answers) < 2:
            err("a 'ladder' family whose listings all have the same answer should be kind 'same'")

    for line in notes:
        print("note:", line)
    for line in errors:
        print("ERROR:", line)
    print(f"{len(families)} families, {len(seen)} listings: {'OK' if not errors else f'{len(errors)} error(s)'}")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
