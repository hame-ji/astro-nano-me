---
title: "tldr-bot"
description: "Personal Telegram digest bot that turns saved URLs into a daily summary."
date: "Mar 15 2026"
repoURL: "https://github.com/hame-ji/tldr-bot"
---

_Turn saved links into a daily digest that I actually read._

I built [tldr-bot](https://github.com/hame-ji/tldr-bot) from a simple frustration: I save many technical links, and most of them never become real reading. Tabs pile up, bookmarks get noisy, and useful content gets lost.

I wanted a workflow that stays lightweight during the day and useful in the evening. So the interaction is intentionally minimal: send a URL in Telegram, then receive one daily digest with concise summaries.

That constraint shaped the rest of the project.

## Choosing the right level of complexity

I kept the runtime serverless with GitHub Actions, scheduled once a day (with manual dispatch when needed). The pipeline polls Telegram updates, filters messages to my chat, extracts URLs, fetches article content, summarizes it, writes artifacts, and sends the digest back to Telegram.

I also kept persistence simple and transparent. Instead of adding a database, outputs are stored as files in the repository:

- `data/sources/YYYY-MM-DD/` for successful summaries
- `data/failed/YYYY-MM-DD/` for failed items
- `data/digests/YYYY-MM-DD.md` for the final digest
- `state.json` for Telegram polling offset

This makes runs easy to inspect and easy to reason about over time. Every day leaves a trace you can read.

## Deliberate trade-offs

Some choices are deliberately unglamorous, but they fit the problem better than bigger alternatives. Polling over webhooks means no always-on endpoint and less operational overhead. A daily batch model is enough for this use case and avoids real-time complexity that brings little value.

Failure handling is isolated: if one URL fails extraction or summarization, the run continues and still delivers a digest from valid inputs.

That behavior matters more than perfect success rates on individual items. The system stays useful even when input quality varies.

## First usage of GSD

This was also my first concrete project using [GSD](https://github.com/gsd-build/get-shit-done/). What mattered most is that the tool did not make architectural decisions for me. It strengthened decisions that were already clear (scope, constraints, trade-offs) and exposed weak spots when they were not.

In practice, it helped keep execution structured: small work units, explicit intent, and cleaner iteration. Faster delivery, with fewer accidental detours.

`tldr-bot` is a small system, but it reflects how I like to build in general: clear scope, deliberate choices, observable outputs, and predictable execution. Keep complexity proportional to value, and delivery stays reliable.
