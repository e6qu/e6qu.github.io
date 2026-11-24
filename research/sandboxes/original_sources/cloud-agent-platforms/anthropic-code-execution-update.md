---
title: "Pricing", code execution tool section (Claude API documentation)
url: https://platform.claude.com/docs/en/about-claude/pricing
authors: Anthropic
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
An addendum to `../agent-sandboxing/anthropic-code-execution-tool.md`. That note covers the air-gapped container (5 GiB RAM, 1 CPU, checkpointed after ~5 minutes idle, 30-day expiry). This one records the billing unit, which shows how cheap a hosted sandbox-hour has become. The isolation technology is not named on the tool page. Anthropic's engineering post says claude.ai's code execution runs in gVisor (`anthropic-how-we-contain-claude.md`), but it doesn't say whether the API tool shares that stack (*unverified*).

## Key points
- Billed by execution time, separately from tokens, with a 5-minute minimum.
- 1,550 free hours per organization per month, then **$0.05 per container-hour**.
- Free (no execution charge) when the request also includes `web_search_20260209`/`web_fetch_20260209` or later.
- Files attached to the request are preloaded into the container, so execution time is billed even if the tool is not called.
- Managed Agents replaces this container-hour billing with $0.08 per *running* session-hour (see `anthropic-managed-agents.md`).

## Excerpts
> "Additional usage beyond 1,550 hours is billed at **$0.05 USD per hour, per container**."

> "Session runtime replaces the code execution container-hour billing model when using Claude Managed Agents."

## Relevance to the talk
Price points for the density argument: a sandboxed 1-CPU/5 GiB container-hour sells for 5 cents, and an agent session-hour for 8 cents billed only while active. Both prices assume heavy idle-time savings (checkpoint, pause) underneath.
