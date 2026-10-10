# Exam Sources

Copy this file to `EXAM_SOURCES.md` and paste your ExamTopics cookie into the code block
below before running `python3 tools/examtopics.py`. `EXAM_SOURCES.md` is git-ignored: the
cookie is a live login session, and anyone holding it can act as the account.

## Exam links

| Exam | Title | Questions | URL |
|------|-------|-----------|-----|
| AB-620 | Designing and Building Integrated AI Agent Solutions in Copilot Studio | 97 | https://www.examtopics.com/exams/microsoft/ab-620/view/ |
| AB-100 | Agentic AI Business Solutions Architect | 120 | https://www.examtopics.com/exams/microsoft/ab-100/view/ |
| AI-103 | Developing AI Apps and Agents on Azure | 161 | https://www.examtopics.com/exams/microsoft/ai-103/view/ |

Question counts as of 2026-10-09. Anonymous access to ExamTopics stops after questions 1–10
(page 1) of each exam; later pages redirect to a login wall, so the scraper needs a
logged-in session.

## Session cookie

Log in to ExamTopics in your browser, open DevTools → Network, pick any examtopics.com
request and copy the whole `Cookie` request header. Replace the line inside the code block
with it; the scraper takes the first code block whose first line starts with `PHPSESSID=`.

```
(paste the Cookie request header here; it starts with PHPSESSID=)
```

- The session-critical values are `PHPSESSID` (site login) and `cf_clearance` (Cloudflare);
  the rest are analytics cookies and can be dropped.
- Logging out of ExamTopics invalidates the cookie. Never paste it anywhere else.
