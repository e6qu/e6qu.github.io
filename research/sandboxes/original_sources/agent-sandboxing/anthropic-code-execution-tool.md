---
title: "Code execution tool" (Claude API documentation)
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool
authors: Anthropic
date: living document; read 2026-11-22 (tool versions `code_execution_20250825`, `code_execution_20260120`, `code_execution_20260521` listed)
accessed: 2026-11-22
kind: docs
---

## Summary
Anthropic's server-side tool that lets Claude run Bash and Python in a sandboxed Linux container during an API conversation. It is the "classic" hosted interpreter design: no network at all, only pre-installed libraries, fixed small resources, and a container that can be reused across requests and is checkpointed when idle.

## Key points
- Environment: Linux-based container; 5 GiB RAM; 5 GiB workspace disk; 1 CPU.
- Networking: "Internet access: Completely disabled for security"; no outbound requests; therefore no runtime package installs.
- "Sandbox isolation: Full isolation from host system and other containers" (mechanism not named).
- Lifetime: containers expire 30 days after creation; after ~5 minutes of inactivity a container is checkpointed and restored on the next request with its ID; container data retained up to 30 days (not ZDR-eligible).
- Newer versions add REPL state persistence and "programmatic tool calling" (code in the container calls the developer's tools).
- When used alongside client-side code tools (e.g. a Bash tool), Claude is in a "multicomputer environment" and must distinguish the two.

## Excerpts
> "The container has no internet access, so Claude can't download packages at runtime: only the pre-installed libraries are available."

> "After about 5 minutes of inactivity a container is checkpointed, and sending a request with its ID inside the 30-day window restores it."

## Relevance to the talk
The baseline that coding agents break: an air-gapped interpreter is easy to secure, but agents need package registries, git hosts and APIs. Also shows checkpoint/restore of idle containers as the standard way to make long-lived state cheap.
