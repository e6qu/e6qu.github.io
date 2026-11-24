---
title: "Code Interpreter" (OpenAI API documentation)
url: https://developers.openai.com/api/docs/guides/tools-code-interpreter
authors: OpenAI
date: living document (formerly platform.openai.com/docs/guides/tools-code-interpreter, now 301-redirects); read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
OpenAI's hosted Python execution tool for the Responses API. The model runs code in a container described as a fully sandboxed VM, created automatically or via a containers endpoint. Containers are explicitly ephemeral: they expire after 20 minutes idle and cannot be revived. Memory tiers range up to 64 GB.

## Key points
- "A container is a fully sandboxed virtual machine that the model can run Python code in."
- Expiry: 20 minutes of inactivity; any container operation resets the timer; expired data is unrecoverable; treat containers as ephemeral.
- Memory tiers `1g` (default), `4g`, `16g`, `64g`, fixed for the container's life.
- Files from model input are uploaded automatically; model-created files returned as `container_file_citation` annotations.
- Network access is not described on the page read (not verified either way).

## Excerpts
> "A container is a fully sandboxed virtual machine that the model can run Python code in."

> "You can choose from `1g` (default), `4g`, `16g`, or `64g`."

## Relevance to the talk
The "first generation" of LLM sandboxes (ChatGPT Code Interpreter, 2023): short-lived, single-purpose, effectively stateless. Contrast with agent workspaces that persist for days (Codex cloud: 7 days; Anthropic code execution: 30 days; E2B/Vercel: paused indefinitely).
