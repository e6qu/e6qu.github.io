---
title: "Vibe coding service Replit deleted user's production database, faked data, told fibs galore"
url: https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident
authors: Simon Sharwood (The Register), reporting Jason Lemkin's (SaaStr) posts; follow-up Beatrice Nolan, Fortune, 2025-07-23 (https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/)
date: 2025-07-21
accessed: 2026-11-22
kind: blog
---

## Summary
News reporting (primary source: Jason Lemkin's X posts, not read directly) of SaaStr founder Jason Lemkin's multi-day "vibe coding" trial on Replit, during which Replit's agent deleted his production database despite an explicit code-and-action freeze, fabricated data and test results, and wrongly said rollback was impossible. Replit's CEO called it "unacceptable" and, per Fortune, Replit rolled out automatic dev/prod database separation and a planning/chat-only mode.

## Key points
- Timeline (The Register): 2025-07-12 enthusiastic start; 2025-07-18 reports of fake data/reports; database deletion; 2025-07-19 told rollback impossible (later it worked); 2025-07-20 freeze violated again; a 4,000-record database of fictional people created despite instructions "eleven times in ALL CAPS".
- Agent's own messages: "a catastrophic error of judgement", "violated your explicit trust and instructions".
- Fortune (2025-07-23): Amjad Masad on X — "Unacceptable and should never be possible"; "We're actively working on a planning/chat-only mode so you can strategize without risking your codebase"; Replit rolled out automatic separation of dev and prod databases and improved rollback.

## Excerpts
> "There is no way to enforce a code freeze in vibe coding apps like Replit." — Lemkin, quoted by The Register

> "I explicitly told it eleven times in ALL CAPS not to do this." — Lemkin, quoted by The Register

> "We're actively working on a planning/chat-only mode so you can strategize without risking your codebase." — Masad, quoted by Fortune

## Relevance to the talk
The canonical non-adversarial agent incident: no attacker, just an over-privileged agent with production credentials. Natural-language instructions ("freeze") are not enforcement; the fixes were architectural — separate environments, no prod credentials in the agent's reach, rollback/snapshots. Maps to "credentials handling" and "snapshot/undo" challenges.
