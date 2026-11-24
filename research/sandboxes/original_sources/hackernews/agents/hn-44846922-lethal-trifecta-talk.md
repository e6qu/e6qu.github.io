---
title: "My Lethal Trifecta talk at the Bay Area AI Security Meetup"
url: https://news.ycombinator.com/item?id=44846922
story_url: https://simonwillison.net/2025/Aug/9/bay-area-ai/
points: 430
comments: 115
authors: HN thread (submitted by vismit2000); linked talk write-up by Simon Willison
date: 2025-08-09
accessed: 2026-11-22
kind: discussion
---

## Summary
Willison's talk write-up on the lethal trifecta (private data + untrusted content + external communication), plus MCP and design patterns for resisting prompt injection. The HN discussion is the highest-scoring trifecta thread; the original June 2025 post got only single-digit points on HN. Key replies: Willison says the attack works against bug-free code inside a locked-down VM, so sandboxing alone does not address it. He does not blame MCP, only the act of mixing tools. He admits he has started running Claude Code, Copilot Agent and Codex CLI in YOLO mode while knowing the risk. Johann Rehberger announces his "Month of AI Bugs" in the thread, and a commenter names the general problem: confused deputy, solved by capabilities.

## Key points
- A VM does not stop trifecta attacks, because the exfiltration uses allowed channels.
- Willison's YOLO admission and his plan: run it somewhere with no secrets and limited egress (expanded in [45668118](hn-45668118-living-dangerously-with-claude.md)).
- Rehberger's Month of AI Bugs (August 2025): many trifecta findings, plus RCEs in AI IDEs.
- Confused deputy and capabilities: the classic security framing that the trifecta restates.

## Excerpts
> "You can write completely secure code and run it in a locked down VM and it won't protect you from lethal trifecta attacks - these attacks work against systems with no bugs, that's the nature of the attack." — simonw ([44848601](https://news.ycombinator.com/item?id=44848601))

> "I've started running Claude Code and GitHub Copilot Agent and Codex-CLI in YOLO mode (no approvals needed) a bit recently because wow it's so much more productive, but I'm very aware that doing so opens me up to very real prompt injection risks." — simonw ([44850534](https://news.ycombinator.com/item?id=44850534))

> "I actually don't think MCP is to blame here. At its root MCP is a standard abstraction layer over the tool calling mechanism of modern LLMs…" — simonw ([44848806](https://news.ycombinator.com/item?id=44848806))

> "I'm currently doing a Month of AI bugs series and there are already many lethal trifecta findings… but also some full remote code execution ones in AI-powered IDEs." — wunderwuzzi23 (Johann Rehberger) ([44849286](https://news.ycombinator.com/item?id=44849286))

> "This is the 'confused deputy problem'. And capabilities is the long-known, and sadly rarely implemented, solution." — jonahx ([44850973](https://news.ycombinator.com/item?id=44850973))

## Relevance to the talk
The bridge from historical capability systems (confused deputy, 1988) to agents. It also puts a limit on the sandbox section: process isolation contains damage to the host, while the trifecta has to be broken in the network and credential design.
