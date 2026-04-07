---
title: "tldr-bot"
description: "Serverless research pipeline with Telegram capture, a daily digest, and explicit operational design."
date: "Apr 7 2026"
repoURL: "https://github.com/hame-ji/tldr-bot"
---

_A useful daily digest. A pipeline designed to stay easy to operate._

I designed [tldr-bot](https://github.com/hame-ji/tldr-bot) from a simple frustration: I save a lot of technical links during the day. Too many of them end up forgotten instead of becoming actual reading.

The need was simple: reduce friction at capture time, then make those links useful later. The product fits in a short loop. Send a URL in Telegram, then receive a readable daily digest with enough context to decide what deserves a closer look.

![Telegram digest flow](../tldr-bot-telegram.png)

## Useful Constraints

The project stays intentionally narrow:

1. Telegram for capture
2. GitHub Actions for scheduled execution
3. The filesystem for persistence
4. Git for history and traceability

Execution is serverless and follows a batch model. Once a day, the pipeline polls Telegram updates, filters messages from the chat, extracts and normalizes URLs, fetches article or PDF content when possible, routes summarization to the right backend, assembles the digest, then sends it back to Telegram.

There is no always-on service, no separate database, and no state spread across multiple systems. The whole thing stays modest by design. In return, it is easier to inspect, audit, and operate.

The important point is not simplicity for its own sake. The point is to keep the whole design proportional to the problem: capture quickly, summarize on a schedule, keep artifacts readable, and understand an incident without reconstructing an entire platform in your head.

## Architecture Trade-offs

Polling over webhooks preserves the serverless constraint. It avoids adding an endpoint just to collect links. A daily batch model is enough here and avoids real-time complexity that would add little value.

State stays in the repository rather than in an external store. The Telegram cursor is committed alongside the other artifacts. That makes the pipeline easier to audit. It also makes recovery simpler when something goes wrong.

The summarization path also became more explicit as the project evolved. The standard article flow goes through OpenRouter when content extraction succeeds. YouTube links go directly through NotebookLM. Some article fetch failures are also redirected there when that path is more appropriate.

That split matters more than the providers themselves. The goal is not a monolithic pipeline with one "normal" path and opaque failures around it. The routing stays understandable: a nominal path when content is recoverable, an alternate path when a source is better handled elsewhere, and a dated failure artifact when neither path fits.

## Failure handling and visibility

The goal is good tolerance of partial failures. One bad URL should not cancel the whole run. If a fallback can recover the failing case, the pipeline uses it. Otherwise, the failure is recorded with context and the rest of the batch continues.

That trade-off matters more to me than perfect success rates. A partial but explicit digest is more useful than an all-or-nothing pipeline that collapses on one broken input.

The same logic shapes observability. Rather than adding dedicated monitoring infrastructure, the pipeline emits a small structured telemetry contract through logs such as `run_outcome` and `run_metrics`. GitHub Actions then turns those signals into execution summaries and recent history.

Digest generation stays separate from operational reporting. The content path does not depend on the reporting layer. If telemetry extraction or recent-history reporting fails, the main path can still produce and persist its result. That separation is mostly invisible in the interface, but important to the overall robustness.

![GitHub Actions observability summary](../tldr-bot-observability.png)

The project also adds a small control layer around NotebookLM-dependent work: auth preflight before execution, a circuit breaker on auth failure, and a replay mechanism for queued failures once credentials have been refreshed. That keeps provider-specific incidents contained without complicating the main digest path.

This part is closer to operational discipline than to demo logic. The pipeline checks its prerequisites, isolates provider failures, avoids amplifying an incident in a loop, and provides an explicit recovery path once the issue has been fixed.

Persistence is conservative as well. Empty-day runs and no-change runs simply skip commit and push. The goal is not to do more. It is to avoid noise and keep history aligned with real events.

## Conclusion

`tldr-bot` remains a small system. That is precisely the point. The scope is narrow, the trade-offs are explicit, and incidents stay readable.

It is the kind of tool I like to build: useful in day-to-day work, restrained in its design, and clear enough to keep providing value when an external dependency starts to degrade.
