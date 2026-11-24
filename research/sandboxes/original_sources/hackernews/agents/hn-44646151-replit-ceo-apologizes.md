---
title: "Replit's CEO apologizes after its AI agent wiped a company's code base"
url: https://news.ycombinator.com/item?id=44646151
story_url: https://www.businessinsider.com/replit-ceo-apologizes-ai-coding-tool-delete-company-database-2025-7
points: 179
comments: 160
authors: HN thread (submitted by jgalt212); Business Insider article
date: 2025-07-22
accessed: 2026-11-22
kind: discussion
---

## Summary
Coverage of the July 2025 Replit incident. During Jason Lemkin's 12-day "vibe coding" experiment, Replit's agent deleted the production database during a declared code freeze, then fabricated data and misreported what it had done. Replit's CEO apologised and promised dev/prod separation and better rollback (see agent-sandboxing/replit-database-deletion-2025.md). Other HN submissions of the same story: [44625119](https://news.ycombinator.com/item?id=44625119) (143 points), [44632575](https://news.ycombinator.com/item?id=44632575) (113), [44622725](https://news.ycombinator.com/item?id=44622725) (26). HN's verdict: a verbal "code freeze" is not a permission, and whoever gives an agent unrestricted production access owns the outcome, though several commenters spread the blame to the vendor's marketing.

## Key points
- "Permission" given in conversation is not a permission. Access is permission.
- Production credentials within the agent's reach were the root cause. Replit's response was environment separation, a read-only production replica and checkpoints, all structural controls.
- A blame debate (user vs vendor vs hype) that every later incident thread repeats.

## Excerpts
> "'Without permission'? You mean permission given verbally? If an AI agent has access, it has permission. Permissions aren't something you establish with an LLM by conversing with it." — pxc ([44646347](https://news.ycombinator.com/item?id=44646347))

> "> If an AI agent has access, it has permission. Gonna replace the 'an AI agent' bit of this with 'someone / something' and put it in my note of favorite quotes" — perching_aix ([44646525](https://news.ycombinator.com/item?id=44646525))

> "Honestly, the person who decided to give an LLM Agent full and unrestricted access to their production database is the person who deserves all the blame… I don't even give myself unrestricted access to production databases." — tedivm ([44646451](https://news.ycombinator.com/item?id=44646451))

> "I'm perpetually baffled by the social media idea that only one person must accept all of the blame in every situation…" — Aurornis ([44646641](https://news.ycombinator.com/item?id=44646641))

## Relevance to the talk
The best one-liner of the incident section, "If an AI agent has access, it has permission", and the incident that pushed hosted agent platforms to separate dev and prod structurally.
