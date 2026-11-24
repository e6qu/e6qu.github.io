---
title: "Living dangerously with Claude"
url: https://simonwillison.net/2025/Oct/22/living-dangerously-with-claude/
authors: Simon Willison
date: 2025-10-22
accessed: 2026-11-22
kind: blog
---

## Summary
A talk write-up on "YOLO mode" (`--dangerously-skip-permissions`): unattended agents are dramatically more productive than supervised ones, but expose users to prompt injection and the lethal trifecta. Willison argues AI-based injection detection is not a defence and that "the only solution that's credible is to run coding agents in a sandbox" — ideally on someone else's computer. Written two days after Anthropic released `sandbox-runtime`.

## Key points
- YOLO mode "feels like a different product": three side projects done in ~48 hours (DeepSeek-OCR on an NVIDIA Spark, Pyodide in Node.js, SLOCCount in WebAssembly).
- Risk example: an agent (OpenHands) tricked by a crafted file into leaking GitHub tokens from environment variables; whoever can put text in the context controls the agent's next tool calls.
- Filesystem control is the easy part; network control is much harder but cuts the exfiltration leg.
- Recommends hosted sandboxes: Claude Code for the web, OpenAI Codex Cloud, Google Jules.
- Notes `sandbox-exec` has been marked deprecated since at least 2017 yet both Claude Code's srt and Codex CLI depend on it; hopes Apple reconsiders.
- The default mode's constant approvals are the cost that pushes people to YOLO.

## Excerpts
> "In YOLO mode you can leave Claude alone to solve all manner of hairy problems while you go and do something else entirely."

> "The only solution that's credible is to run coding agents in a sandbox."

> "The best sandboxes are the ones that run on someone else's computer!"

## Relevance to the talk
Frames the HITL problem honestly: permission prompts make agents tedious, so users disable them; sandboxing is what makes disabling them safe. Also the macOS irony — the most-used agent sandboxes depend on an officially deprecated Apple tool.
