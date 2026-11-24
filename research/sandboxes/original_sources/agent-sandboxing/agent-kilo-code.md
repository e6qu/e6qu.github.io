---
title: "Sandboxing" (Kilo Code Docs)
url: https://kilo.ai/docs/getting-started/settings/sandboxing
authors: Kilo Code (Kilo-Org)
date: living document; read 2026-11-22 (source file packages/kilo-docs/pages/getting-started/settings/sandboxing.md, first added 2026-06-25, last changed 2026-09-17; repo main at 3d2eb1d, release v7.8.32)
accessed: 2026-11-22
kind: docs
---

## Summary
Kilo Code is current and active (v7.8.32, 2026-11-20) and now ships VS Code, JetBrains and a CLI on one engine: the README says "Kilo CLI is a fork of OpenCode", and all three share the `kilo.jsonc` permission model. Of the Cline-lineage extensions (Cline, Roo Code, Kilo) it is the only one with a real **OS-level sandbox** for local tools — Seatbelt (`sandbox-exec`) on macOS, bubblewrap on Linux, nothing on Windows — but the sandbox is **off by default**. When enabled it confines writes (not reads) to the workspace plus Kilo's own directories, makes `.git` read-only, and by default denies outbound network except through an authenticated SNI-checking proxy for allowlisted hosts. It fails closed if the policy cannot be enforced.

## Key points
- Runs: local process (CLI/server used by the VS Code and JetBrains clients); Cloud Agent sessions run in "Cloudflare sandbox containers with session-specific workspaces" (contributor doc `packages/kilo-docs/pages/contributing/architecture/cloud-security.md`); the local sandbox control is hidden for cloud sessions.
- Isolation: macOS `sandbox-exec` (Seatbelt) profile; Linux bubblewrap (system `/usr/bin/bwrap` or a bundled SHA-256-verified binary) plus seccomp to block direct host Unix-socket access when using allowlisted hosts; Windows unsupported (setting hidden; an enabled policy blocks restricted tool execution). Opt-in: `sandbox.enabled` defaults to `false`; toggle per session with the lock button (VS Code) or `/sandbox` (CLI).
- Filesystem: with the sandbox on, reads are unrestricted ("a write boundary, not a privacy boundary"); writes allowed only to the workspace/worktree, `~/.local/share/kilo`, `~/.cache/kilo`, `~/.local/state/kilo`, `$TMPDIR/kilo`, and `sandbox.writable_paths` (global config only). `.git`, Kilo's sandbox policy and global config root stay read-only; child processes inherit the restrictions. Without the sandbox, only tool-level permission rules apply. `.kilocodeignore` is legacy and auto-converted into `read`/`edit` deny rules (https://kilo.ai/docs/customize/context/kilocodeignore).
- Network: `sandbox.network` defaults to `"deny"` once the sandbox is on; `sandbox.allowed_hosts` (DNS host:port, no wildcards/IPs) routes HTTP/HTTPS through an authenticated proxy that checks host and TLS SNI and rejects private addresses; Linux keeps a network namespace, macOS Seatbelt allows only the loopback proxy port. Not blocked: model inference traffic, MCP server lifecycle, MCP prompt retrieval, plugin hooks. Notebook execution and background processes are unavailable while sandboxed.
- Config hardening: project config may only tighten the sandbox (cannot disable it, allow network, add hosts or writable paths); subagents inherit the stricter of parent/child policy.
- Escape hatch: mutating git commands trigger an escalation prompt that runs the whole command unsandboxed; bash allow rules and auto-approve never answer it.
- Approvals: per-tool `allow`/`ask`/`deny` with glob patterns, last match wins, configured in `kilo.jsonc` or Settings > Auto Approve (https://kilo.ai/docs/getting-started/settings/auto-approving-actions). Defaults: most tools `allow` (including `edit` outside JetBrains); `bash` is `"*": "ask"` with a built-in allowlist of read-only and simple commands (`cat`, `ls`, `grep`, `mkdir`, `cp`, `mv`, `tar`, ...); `external_directory`, `.env*` reads and `doom_loop` ask (source `packages/opencode/src/kilocode/agent/index.ts`, `packages/opencode/src/agent/agent.ts`). Full auto: CLI `--auto` ("auto-approve permissions that are not explicitly denied (dangerous!)"); a shield button toggles runtime auto-approve in VS Code.
- Enterprise: docs cover SSO, audit logs, model-access and MCP controls; no admin-enforced sandbox setting is documented.

## Excerpts
> "The sandbox adds an operating-system boundary around agent tools." (Sandboxing, intro)

> "The sandbox is **disabled by default**. It does not restrict filesystem reads." (Sandboxing, intro)

> "It does **not** make **Allow Everything** safe." (Sandboxing, "When to use sandboxing")

> "This is defense-in-depth, not a sandbox — the durable fix is OS-level sandboxing, not command-line string matching." (source comment on the read-only bash blocklist, `packages/opencode/src/kilocode/agent/index.ts`)

## Relevance to the talk
Shows the Claude Code/Codex pattern (Seatbelt + bubblewrap, proxy-based egress allowlist, fail-closed) spreading to the IDE-extension world via the OpenCode lineage, yet still opt-in. The docs are unusually candid about the gaps (reads unrestricted, inference traffic as an exfil path, MCP/plugins outside the boundary, the one-shot git escalation), which makes the page a ready-made "what a write sandbox does not protect" slide.
