---
title: "Permissions" (OpenCode Docs)
url: https://opencode.ai/docs/permissions
authors: Anomaly (OpenCode; formerly under sst)
date: living document; read 2026-11-22 (repo anomalyco/opencode @ ee5fe34e13, release v2.3.2)
accessed: 2026-11-22
kind: docs
---

## Summary
OpenCode is current and very large (~228k stars). The repo moved from sst/opencode to **anomalyco/opencode** and is now on major version 2 (v2.3.2, 2026-11-18; the 1.x line still gets patch releases). It runs as a local process with a background service. The project states plainly that it **does not sandbox the agent** and that its permission system is a UX feature, not a security boundary. Users who want isolation are told to run it in Docker or a VM. The default permission policy is allow-all, except asking before reading `.env` files, and reads and edits outside the project are allowed without a prompt by default.

## Key points
- Runs: local CLI/TUI plus a local background service (HTTP over loopback), on macOS, Linux and Windows. Server mode is opt-in.
- Isolation: none on any OS. SECURITY.md has a section titled "No Sandbox" and lists sandbox escapes as out of scope (https://github.com/anomalyco/opencode/blob/dev/SECURITY.md). A grep of the repo @ ee5fe34e13 finds no seatbelt/bwrap/landlock/seccomp code.
- Filesystem: governed by tool-level permission rules only. `external_directory` covers paths outside the active location or worktree, but the default policy allows it. Shell "directory inference from command text is best effort". The docs warn that `shell` "runs with the host user's filesystem, process, and network authority."
- Network: no restriction. `webfetch` and `websearch` are permission actions keyed on URL or query, but shell has full host network access. Proxy env vars (`HTTP_PROXY` etc.) are supported for connectivity only (https://opencode.ai/docs/network).
- Approvals (V2): an ordered `permissions` array of `{action, resource, effect}` with effect `allow`, `ask` or `deny`. The last match wins, and `*`/`?` wildcards are allowed. If no rule matches, the effect is `ask`, but the built-in base policy starts with `{ "action": "*", "resource": "*", "effect": "allow" }`. Shell commands are parsed by a built-in scanner (Bash/Zsh/sh/PowerShell). Commands it cannot analyse (e.g. `eval`) fail if any shell deny rule applies, and otherwise need whole-command approval. Replies are `once`, `always` (saves a project-scoped allow pattern) or `reject`. In V1 the key was `permission` with `bash`/`task`; V2 uses `permissions` with `shell`/`subagent`. Headless: `opencode run --auto` auto-approves anything not explicitly denied (https://opencode.ai/docs/cli/commands). The shipped `plan` agent denies edits.
- Enterprise: `policies` are binary deny statements that never prompt, e.g. `tool.use` / `shell:sudo *`, `provider.use`. They can come from system-managed config, macOS MDM (`ai.opencode.managed`) or an OpenCode Console workspace, and they outrank user and project config (https://opencode.ai/docs/policies, https://opencode.ai/docs/enterprise).
- Threat model: malicious config files, MCP server behaviour and server access when opted in are all declared out of scope (SECURITY.md).

## Excerpts
> "OpenCode does **not** sandbox the agent. The permission system exists as a UX feature ... it is not designed to provide security isolation." (SECURITY.md, No Sandbox)

> "If you need true isolation, run OpenCode inside a Docker container or VM." (SECURITY.md)

> "`shell` runs with the host user's filesystem, process, and network authority." (Permissions, Directories)

## Relevance to the talk
This is the clearest vendor statement on the slide "permission prompts are not a sandbox". The most-starred open-source coding agent declares sandbox escapes out of scope because there is no sandbox. Its default policy is allow-all, with a carve-out only for `.env` reads. The org-level `policies` layer shows enterprise control done entirely in the tool's own rule engine rather than by the OS.
