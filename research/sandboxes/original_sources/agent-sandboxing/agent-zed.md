---
title: "Sandboxing" (Zed docs)
url: https://zed.dev/docs/ai/sandboxing
authors: Zed Industries
date: living document; read 2026-11-22 (source docs/src/ai/sandboxing.md, first added 2026-06-23, last security revision 2026-07-10; repo read at main d31d107 and stable tag v1.29.3)
accessed: 2026-11-22
kind: docs
---

## Summary
Zed's built-in agent (the "Zed Agent" in the agent panel) runs locally inside the editor, and since mid-2026 wraps its `terminal` and `fetch` tool calls in an OS sandbox: Seatbelt (`sandbox-exec`) on macOS, unprivileged non-setuid bubblewrap on Linux, and bubblewrap inside WSL on Windows. The sandbox is on by default in stable (feature flag `sandboxing` enabled for all; `agent.sandbox_permissions.allow_unsandboxed` defaults to `false`). By default commands can read most of the filesystem, write only to open project directories (never `.git` metadata) plus a temp dir, and have no network until the user approves a host-specific or unrestricted grant. On top sits a regex-based tool-permission layer whose default is "confirm". External agents connected over ACP (Claude Agent, Codex, Gemini CLI, etc.) are explicitly *not* covered by the sandbox.

## Key points
- Runs: local process inside the Zed editor; external agents run as separate local processes speaking ACP (https://zed.dev/docs/ai/external-agents).
- Isolation: macOS Seatbelt via `sandbox-exec`, with a Mach-service allowlist (no LaunchServices/launchd, pasteboard, audio); Linux bubblewrap, refusing setuid-root `bwrap` (needs an AppArmor profile on Ubuntu 23.10+); Windows only inside WSL (bubblewrap), with a documented weaker guarantee for grants on NTFS-backed paths (`/mnt/c/...`) because inode pinning does not pin the Windows object. Native Windows commands, or Linux without a usable `bwrap`, fall back to running unsandboxed with a warning. ON by default (`SandboxingFeatureFlag::enabled_for_all() == true` in crates/feature_flags/src/flags.rs at v1.29.3; the feature was temporarily removed 2026-07-22, PR #61484, and re-enabled 2026-07-29, PR #61711).
- Filesystem: OS-enforced. Read: most of the filesystem. Write: open project directories plus a per-thread `$TMPDIR` (macOS) or a fresh tmpfs `/tmp` (Linux). `.git` dirs, worktree metadata, hooks and local config are never writable while sandboxed, even under `allow_fs_write_all`. Unix-domain sockets are blocked (no Docker socket or session bus). Grants are canonicalised and inode-pinned at sandbox creation.
- Network: closed by default. Approved host-specific access goes through an HTTP/HTTPS proxy with a host allowlist on macOS and Linux, so non-proxy-aware tools (SSH, raw sockets) still fail. On WSL network access is all-or-nothing. `fetch` gets the same per-host grants.
- Approvals (sandbox): escalation prompts for specific hosts, any host, specific write paths, unrestricted writes, or running unsandboxed. The agent must give a `reason`. Each grant is once, for the thread, or always; "always" grants persist in `agent.sandbox_permissions` (`network_hosts`, `allow_all_hosts`, `write_paths`, `allow_fs_write_all`, `allow_unsandboxed`). Warnings for confusable-Unicode hosts and paths are on by default.
- Approvals (tool permissions, https://zed.dev/docs/ai/tool-permissions): `agent.tool_permissions.default` takes `confirm` (default), `allow` or `deny`. Per-tool `tools.<name>.default` plus `always_allow`, `always_deny` and `always_confirm` take Rust-regex patterns. Precedence: built-in rules > deny > confirm > allow > tool default > global default. The old boolean `agent.always_allow_tool_actions` (pre-v0.224.0) was the YOLO switch; now it is `"default": "allow"`. The only built-in rule blocks `rm -rf` on `/`, `~`, `$HOME`, `.` and `..`. Chained shell commands are parsed so that each sub-command is checked. These are tool-level checks, not OS enforcement.
- Scope caveats the docs spell out: no sandbox for language servers, tasks, normal terminals, the git client, External Agents, or Terminal Threads. They also name escape routes through those channels: a Rust proc macro run by rust-analyzer, a poisoned Makefile, or submodule Git metadata (`core.fsmonitor`) executed later outside the sandbox.
- External agents (ACP): the docs say "native tool permissions depend on the agent". Zed only forwards ACP permission requests, so whatever sandbox those agents have is their own.

## Excerpts
> "Sandboxing instead uses OS features to forcibly restrict which resources a tool call has access to." (Sandboxing, intro)

> "Sandboxing applies only to Zed Agent. It does not sandbox Zed itself, language servers, extensions, tasks, your normal terminal tabs, External Agents, or Terminal Threads." (Sandboxing, intro)

> "An agent may add a malicious Rust procedural macro to your codebase, which will be automatically executed by `rust-analyzer` **outside the sandbox**." (How much can I trust the sandbox?)

> "Zed's sandbox has been designed with the aim of being totally unbreakable, even in the presence of a motivated attacker with full control over the files in your project running as a standard user." (Windows, How big a risk is this in practice?)

## Relevance to the talk
This is an IDE that went from approval prompts only to an on-by-default Seatbelt/bubblewrap sandbox in 2026, using the same primitives as Claude Code, Codex and Cursor. Its docs are unusually frank about the IDE-specific escape routes: the sandbox covers the agent's own terminal, while language servers, build files and git hooks run the agent's output later and unconfined. They are also frank about WSL/NTFS weakening the guarantee on Windows. A good slide for "the sandbox boundary is narrower than the trust boundary".
