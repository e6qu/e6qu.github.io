---
title: "goose Permission Modes"
url: https://goose-docs.ai/docs/guides/managing-tools/goose-permissions
authors: goose project (Agentic AI Foundation at the Linux Foundation; originally Block)
date: living document; read 2026-11-22 (repo aaif-goose/goose @ 36b29113af, release v1.60.2)
accessed: 2026-11-22
kind: docs
---

## Summary
goose is current and active (release v1.60.2, 2026-11-20). The repository moved from block/goose to **aaif-goose/goose**, and the README says goose is "part of the Agentic AI Foundation (AAIF) at the Linux Foundation". Docs are now at goose-docs.ai. It runs locally as a desktop app or CLI, and its tools execute in the goose server process with the user's full permissions. **There is no OS-level sandbox.** An experimental opt-in macOS Seatbelt sandbox (`GOOSE_SANDBOX=true`, v1.25.0, Feb 2026) has since been removed, and the docs now say so explicitly. The default permission mode is **Autonomous** (no approvals), so out of the box goose runs tools unprompted on the host.

## Key points
- Runs: local process (goose Desktop or `goose` CLI) on macOS, Linux and Windows. It can also be run remotely as a goose server.
- Isolation: none on any OS. The v1.25.0 release post now carries an "Outdated" banner saying the Seatbelt sandbox "was experimental and has been removed" and that the server process "is **not** sandboxed at the OS level" (https://goose-docs.ai/blog/2026/02/23/goose-v1-25-0). A grep of the repo @ 36b29113af finds no seatbelt/bwrap/landlock code outside that post. For isolation the docs point users to the Dagger Container Use MCP or to running goose itself in Docker (https://goose-docs.ai/docs/tutorials/isolated-development-environments, https://goose-docs.ai/docs/tutorials/goose-in-docker).
- Filesystem: no enforced boundary. The developer tools respect `.gitignore` for tree and summarise operations. `.gooseignore` is not mentioned in current docs and is not referenced in current source (only in the repo's own `.gitignore`), so treat it as unsupported or not documented. Any restriction there was would be tool-level, not OS-enforced.
- Network: no policy; not documented. The removed Seatbelt sandbox had offered URL tracking and limits.
- Approvals: `GOOSE_MODE` = `auto` (default), `approve` (legacy alias `chat`; "Ask before every tool call") or `smart_approve` (risk-based; the docs say read/write classification is "interpreted by your LLM provider"). Switch with `/mode auto|approve|smart_approve` or `goose configure`. Per-tool overrides are Always Allow, Ask Before and Never Allow (https://goose-docs.ai/docs/guides/managing-tools/tool-permissions). Source: crates/oi-kit-provider-types/src/goose_mode.rs, `#[default] Auto`.
- Extra guards (opt-in): prompt-injection detection by pattern matching, with optional ML classifier (`SECURITY_PROMPT_ENABLED`, https://goose-docs.ai/docs/guides/security/prompt-injection-detection). "Adversary mode" is an LLM reviewer that returns ALLOW/BLOCK on `shell` calls and is enabled by creating `~/.config/goose/adversary.md` (https://goose-docs.ai/docs/guides/security/adversary-mode).
- Enterprise: an extension allowlist fetched from the URL in `GOOSE_ALLOWLIST` blocks installation of MCP servers that are not listed (https://goose-docs.ai/docs/guides/allowlist).

## Excerpts
> "`Autonomous Mode` is applied by default." (goose Permission Modes)

> "The `goose` server process (which executes tools) runs with the same permissions as your user account and is **not** sandboxed at the OS level." (v1.25.0 release post, Outdated note)

> "Read/write approval makes best effort attempt at classifying read or write tools. This is interpreted by your LLM provider." (goose Permission Modes)

## Relevance to the talk
goose is a clean example of a sandbox that shipped and was then withdrawn. A major open-source agent tried Seatbelt, removed it, and now documents plainly that it relies on approval modes and LLM-based reviewers while defaulting to fully autonomous. It shows that the "LLM judges risk" layers (smart_approve, adversary mode, injection classifier) are being used instead of an OS boundary, not in addition to one.
