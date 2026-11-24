---
title: "Codex CLI command reference" (OpenAI Codex documentation)
url: https://learn.chatgpt.com/docs/developer-commands?surface=cli
also: https://learn.chatgpt.com/docs/sandboxing
authors: OpenAI
date: living document; formerly developers.openai.com/codex/cli/reference (now redirects); read 2026-11-23
accessed: 2026-11-23
kind: docs
---

## Summary
Codex CLI is the counter-example on defaults: local commands run inside a sandbox (`workspace-write`) unless you opt out. The opt-out is one flag with a long name and a short alias, `--dangerously-bypass-approvals-and-sandbox` / `--yolo`, which drops approvals and the sandbox together. A milder `--approve-for-me` (alias `--not-so-yolo`) hands approvals to a reviewer agent but keeps the sandbox.

## Key points
- `--dangerously-bypass-approvals-and-sandbox, --yolo`: interactive help "Run every command without approvals or sandboxing"; `codex exec` help "Bypass approval prompts and sandboxing".
- `--approve-for-me, --not-so-yolo`: automatic approval review + `on-request` + `workspace-write` sandbox.
- Sandbox page: commands "run inside a constrained environment instead of running with full access by default"; "The sandbox reduces approval fatigue."
- Docs advise against `--yolo` "unless you are inside a dedicated sandbox VM".

## Excerpts
> "--dangerously-bypass-approvals-and-sandbox, --yolo | boolean | Run every command without approvals or sandboxing. Only use inside an externally hardened environment." (CLI options)

> "--dangerously-bypass-approvals-and-sandbox, --yolo | boolean | Bypass approval prompts and sandboxing. Dangerous—only use inside an isolated runner." (`codex exec` options)

> "avoid --dangerously-bypass-approvals-and-sandbox unless you are inside a dedicated sandbox VM." (Flag combinations and safety tips)

> "those commands run inside a constrained environment instead of running with full access by default." (sandboxing)

> "The sandbox reduces approval fatigue." (sandboxing)

## Relevance to the talk
The vendor ships `--yolo` as an official alias: the "dangerous" name is for documentation, the short one is for typing. The sandbox and the approvals are switched off by the same flag.
