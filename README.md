# Cert Prep

An offline study app for the ExamTopics question sets listed in `EXAM_SOURCES.example.md`:
AB-620 (97 questions), AB-100 (120) and AI-103 (161), with ExamTopics answers, community
vote counts, discussion threads, and all 289 exhibit images stored locally.

## Open it

Double-click `index.html`. No server, no install, and it works offline.

Progress (answers, review schedule, flags, notes, mock exam results) is saved in the browser.
If you'd rather serve it (for example to use it from your phone on the same network), run
`python3 -m http.server 8000` and open http://localhost:8000. The browser treats
`file://` and `http://` as different sites, so stick to one, or move progress with
**Settings → Export / Import progress**.

## How it is meant to be used

| Where | What it does |
|---|---|
| **Dashboard** | Today's count, streak, reviews due, 7-day accuracy, a mastery bar per exam, and an activity heatmap. |
| **Exam page** | Coverage and accuracy by topic and question type, case-study groups, and mock exam score history. |
| **Practice** | Answer, then **Check**. Afterwards you see the answer key, the community vote split, the most-upvoted discussion comments, and "Look it up" links into Microsoft Learn for the terms the question turns on. Choices and tiles are shuffled each attempt (letters stay as printed), so you learn the idea, not the position. |
| **Drag & drop / hotspot** | Real interactive questions rebuilt from the ExamTopics screenshots: drag tiles into boxes (or click a tile, then a box), drag steps into order, pick from drop-down menus, answer Yes/No grids, fill blanks inside code. Each box is marked right or wrong, with the right answer shown in place. The original images are one click away under **Original ExamTopics images**. |
| **Review due** | Spaced repetition. A wrong answer comes back after ten minutes; right answers come back after 1, 3, 7, then 21 days, most overdue first. A question counts as *mastered* after three spaced correct answers. |
| **Mistakes / Flagged** | Questions you last got wrong, or flagged with **M**. |
| **Mock exam** | Random questions with a timer and no feedback until you finish. "Mark for review" and a question grid work like the real exam, case-study questions sit together, and series questions lock once you move on (optional). Everything is scored automatically; as on the real exam, drag & drop and hotspot questions earn partial credit per correct box. |
| **Study plan** | On each exam page: set the exam date and a daily goal to get the pace needed for a first pass, today's progress, and a readiness verdict from your last three mock exams. |
| **Read-through / Browse** | Answers shown up front; full-text search (optionally including discussions), plus filters by status, type and disputed answers. |
| **Guide (指南)** | A concept guide, in Chinese with the English terms kept, to the Microsoft products and vocabulary the questions assume: six chapters (the four product maps, identity and security, ALM, Copilot Studio, Azure AI and Foundry, AI business solutions) and a 249-term glossary with search, exam filter and A–Z index. Every section and glossary entry links the Microsoft Learn page it was checked against (October 2026). Glossary terms are marked in question text (first mention per card, never in mock exams); click one for its Chinese explanation, chapter and Learn link. Each chapter ends with practice sets by knowledge point. |

**Case studies.** The long scenario is stored once and opens beside the question
(press **S**), with its headings, lists and "Label: value" facts restored. ExamTopics flattens
all of that into plain lines; `tools/examtopics.py` rebuilds the structure.

**Copies of a question.** ExamTopics lists many questions more than once with reshuffled,
partly different choices and sometimes a different answer (for example AB-100 #40, #41, #42,
#43, #98, #110 and #120 are one question). The build links such copies; the app shows an
"Also #…" chip that opens them side by side, and pools their votes, counting each copy's
ExamTopics answer as one vote.

**Reviewed answers.** Every question was re-judged against Microsoft product behaviour and
documentation and given an explanation, a confidence level and a knowledge-point tag
(`data/reviewed.js`). The review confirms ExamTopics on 332 questions and corrects it on 46;
8 answers are marked low confidence. Answers that hinge on product details were checked against
the current Microsoft Learn pages, and 42 entries link the page they rely on. By default the app
grades against the reviewed answer and
shows all three keys (reviewed, ExamTopics, community vote) on every question. The review was
done by an AI model reading the questions, not by Microsoft, so treat a low-confidence answer as
an opinion and read the explanation and the discussion.

**Knowledge points.** The review also tags each question with a knowledge point (for example
"Agent flows", "ROI & business value", "Information extraction solutions"). The exam page
breaks accuracy down by knowledge point, the practice builder and Browse can filter by it, and
mock results report it.

**Guide.** The guide is written in Markdown in `data/guide/` (one file per chapter plus
`glossary-*.md`) and compiled to `data/guide.js` by `python3 tools/build_guide.py`. The build
refuses to run on an unknown `[[term]]` link, a glossary entry without a Microsoft Learn `ref`,
or a practice knowledge point that does not exist in `data/reviewed.js`, so the guide cannot
drift from the question bank. Term marking in questions can be turned off in Settings.

**Disputed answers.** ExamTopics' suggested answer is sometimes wrong. Settings can switch
grading to the (pooled) community vote, used when at least 3 votes are in and there is no tie,
or to the ExamTopics answer. Drag & drop and hotspot questions have no votes, so
where the most-upvoted comments clearly agree on a different answer for a box (at least 5
upvotes, and at least twice the support of the ExamTopics answer), that box uses the
comments' answer and also shows the ExamTopics one. Both are always shown, and Settings can
switch to ExamTopics-only. If you are sure the key is wrong, **Count as correct** fixes that attempt.

**Keyboard.** `A–F` / `1–6` select · `Enter` check / next · `←` `→` move · drag & drop:
`Tab` to a tile, `Enter`, then `Tab` to a box and `Enter` (`Delete` removes a placed tile) ·
`M` flag · `S` scenario · `/` search · `?` shortcuts.

## Refresh the question bank

When ExamTopics adds questions, or votes and comments change:

1. Copy `EXAM_SOURCES.example.md` to `EXAM_SOURCES.md` (git-ignored, because it will hold a live login session),
   log in to ExamTopics in your browser and paste the `Cookie` request header into its code block.
2. Run `python3 tools/examtopics.py` (needs `requests`). It fetches one page at a time with delays, stops cleanly if the cookie has expired, and rewrites `data/bank.js` and `data/img/`.

Add `--cache .cache` to keep the raw pages, so an interrupted run resumes and
`python3 tools/examtopics.py build --cache .cache` can re-parse without downloading again.
Delete that folder later to pull fresh pages. Progress is keyed by ExamTopics question ID,
so it carries over to the refreshed bank. `CORRECTIONS` in the tool fixes typos in the source
text ("Blue Vender", "Fabrikarn", …); add to it when you spot more. `data/areas.js`,
`data/tags.js` and `data/reviewed.js` are never touched by the tool; a question that is new
after a refresh simply has no reviewed answer until one is added.

**Browser.** Needs a 2023 or newer browser (container queries and `:has`): Chrome 105,
Safari 16 or Firefox 121. Older browsers still work, but the tile layout degrades.

## Answer areas (`data/areas.js`)

The interactive drag & drop and hotspot questions come from `data/areas.js`, transcribed from
the question and answer images (each was checked twice against the images). The scraper never
touches this file, so it survives a refresh. Entries are keyed by question ID:

```js
"1007788": {
  "kind": "match",                      // match | order | select | yesno | exhibit
  "area": "data/img/ab-620/image19.png", // the screenshot this replaces
  "poolTitle": "Solutions", "pool": ["Create a manual response in the topic.", ...],
  "head": ["Requirement", "Solution"],
  "blocks": [{ "type": "row", "label": "Retrieve the current balance ...", "answer": "Connect to a Power Platform connector." }, ...],
  "dispute": "optional note about upvoted comments that disagree"
}
```

Rows can carry `"options"` (drop-downs) and `"alt"` (the comments' answer). Code and sentences
with blanks use `{"type": "code", "text": "x = {{0}}()", "slots": [{"options": [...], "answer": "..."}]}`.
Ordering questions use `"answer": [...]` (and `"altAnswer"`). `exhibits` maps other stem images
to text, code or table blocks. A question without an entry, or with an answer that is not one
of its choices, falls back to the image with self-grading.

## Files

- `index.html`, `assets/app.css`, `assets/app.js`: the app (plain HTML/CSS/JS, no build step)
- `data/bank.js`: the parsed questions; `data/img/`: exhibit and answer images
- `data/areas.js`: interactive versions of the drag & drop and hotspot screenshots (hand-transcribed)
- `data/tags.js`: skill areas for exams whose ExamTopics listing has no topics (AI-103), keyed by question ID
- `data/reviewed.js`: the reviewed answer, explanation, confidence and knowledge point for every question
- `data/guide/`: the concept guide sources (Markdown); `data/guide.js`: the compiled guide loaded by the app
- `EXAM_SOURCES.example.md`: the exam URLs and a placeholder for the ExamTopics cookie; copy it to `EXAM_SOURCES.md` (git-ignored) before a refresh
- `tools/examtopics.py`: scraper and parser that produces `data/`
- `tools/build_guide.py`: compiles `data/guide/*.md` into `data/guide.js`
