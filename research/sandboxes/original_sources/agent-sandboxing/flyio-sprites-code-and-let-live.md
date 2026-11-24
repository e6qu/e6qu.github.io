---
title: "Code And Let Live"
url: https://fly.io/blog/code-and-let-live/
authors: Fly.io (page schema author id "kurt" — presumably Kurt Mackey; illustration by Annie Ruygt)
date: 2026-01-09 (datetime in page HTML)
accessed: 2026-11-22
kind: blog
---

## Summary
Fly.io's launch post for Sprites, persistent Linux micro-machines for agents. Its thesis is deliberately provocative: ephemeral, throw-away sandboxes are the wrong shape for coding agents, which do better on a durable computer that keeps installed tools and state between tasks, can be checkpointed and rolled back in about a second, and stops billing when idle. Fly's product pages (not the post itself) say Sprites are Firecracker microVMs with their own kernel and a storage stack different from Fly's Docker-image-based Machines; Simon Willison's same-day write-up reports ~300 ms checkpoints and DNS-based egress allow/deny rules.

## Key points
- A Sprite starts in about a second, keeps storage across sleeps and days, checkpoint/restore in about a second, stops metering when idle, gets an Anycast HTTPS URL.
- Argument: agents waste effort rebuilding environments and round-tripping state when sandboxes are killed after each use.
- Fly.io site (sprites pages, via search results): Firecracker microVM per Sprite; checkpoints are point-in-time snapshots of the whole environment that restore in place and do not expire; a hosted Sprites MCP server lets an agent create sprites, run commands, checkpoint/restore and set network policy; Claude Code, Gemini CLI and Codex preinstalled.
- Simon Willison, "Fly's new Sprites.dev addresses both developer sandboxes and API sandboxes at the same time" (2026-01-09, https://simonwillison.net/2026/Jan/9/sprites-dev/): checkpoint ≈300 ms capturing full disk; last five checkpoints mounted for file access; DNS-based allow/deny egress rules (e.g. `github.com`, `*.npmjs.org`); "The safe way to run YOLO mode is in a robust sandbox".

## Excerpts
> "Stop killing your sandboxes every time you use them."

> "The age of sandboxes is over."

> "Sprites are durable."

> "The safe way to run YOLO mode is in a robust sandbox" — Simon Willison, 2026-01-09

## Relevance to the talk
The sharpest statement of the "long-lived stateful workspace" requirement and of checkpoint-as-undo as a safety mechanism (roll back what the agent broke rather than prevent it). Contrasts with classic sandbox thinking (ephemeral, disposable, reset-on-exit).
