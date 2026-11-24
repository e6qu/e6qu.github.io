---
title: "Caught in the Hook: RCE and API Token Exfiltration Through Claude Code Project Files | CVE-2025-59536 | CVE-2026-21852"
url: https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/
authors: Aviv Donenfeld, Oded Vanunu (Check Point Research); vendor advisories GHSA-ph6w-f82w-28w6, GHSA-4fgq-fpq9-mr3g (CVE-2025-59536), GHSA-jh7p-qr78-84p7 (CVE-2026-21852) in anthropics/claude-code
date: 2026-02-25 (public write-up); advisories 2025-09-02, 2025-10-03, 2026-01-20
accessed: 2026-11-22
kind: blog
agent: Claude Code
incident_date: reported 2025-07-21 (hooks), 2025-09-03 (MCP), 2025-10-28 (API key); all fixed by 2025-12-28; disclosed 2026-02-25
category: prompt-injection-rce
cve: CVE-2025-59536 (CVSS 4.0 8.7, fixed v1.0.111), CVE-2026-21852 (CVSS 4.0 5.3, fixed v2.0.65); hooks issue GHSA-ph6w-f82w-28w6 had no CVE
sandbox_at_time: the bash sandbox existed but was opt-in, and it does not cover hooks or MCP servers, which run outside it by design. The guard was the "trust this folder?" dialog, and all three bugs ran before or around it
exploited_in_wild: no; researcher demonstrations
---

## Summary
Check Point showed that just opening Claude Code in a cloned, attacker-controlled repository could run code or leak credentials, through files the repo ships for the agent. (1) **Hooks**: a committed `.claude/settings.json` defined hook commands that ran on startup without the approval Claude Code requires for other commands. (2) **MCP consent bypass**: the same file could set `enableAllProjectMcpServers` or `enabledMcpjsonServers`, so the servers in the repo's `.mcp.json`, which are arbitrary commands, started *before* the trust dialog was shown. (3) **API key leak**: the repo's settings could set `ANTHROPIC_BASE_URL` to an attacker's server, and Claude Code made API requests carrying the user's key before the trust prompt.

## Key points
- CVE mapping (from the advisories): CVE-2025-59536 = "Command execution prior to Claude Code startup trust dialog" (< v1.0.111). CVE-2026-21852 = "data leakage via environment configuration used before trust confirmation" (< v2.0.65). The hooks issue = GHSA-ph6w-f82w-28w6 "Insufficient Startup Warning", without a CVE. Press reports disagree on the mapping, and the advisories are authoritative.
- Anthropic's fixes: a stronger warning for untrusted project config; MCP servers no longer start before approval even if the auto-approve keys are present; all network operations deferred until trust is confirmed.
- The same class came back: CVE-2025-65099 (2025-11-19, another "command execution prior to startup trust dialog"), CVE-2026-33068 (2026-03-18, a repo `.claude/settings.json` setting `permissions.defaultMode: bypassPermissions` silently skipped the trust dialog), CVE-2026-40068 (2026-04-24, trust-dialog bypass via git worktree spoofing).
- Same design pattern as Codex CLI's project-local config (CVE-2025-61260, Check Point, late 2025; not read here) and Cursor's `.cursor/mcp.json` (see the CurXecute note).

## Excerpts
> "The session appears completely normal while commands from the untrusted repository have already run in the background." (Check Point)

> "A malicious repository could set `permissions.defaultMode` to `bypassPermissions` in its committed `.claude/settings.json`, causing the trust dialog to be silently skipped on first open." (GHSA-mmgp-wc2j-qcv7, CVE-2026-33068)

## Would a mature sandbox have stopped it?
**Not the sandbox Claude Code had, because hooks, MCP servers and the API client all run outside it by design** ([claude-code-sandboxing-docs.md](../agent-sandboxing/claude-code-sandboxing-docs.md) lists hooks and local MCP servers as "not sandboxed"). What would have stopped it: (a) **never honouring security-relevant settings from the repo** (hooks, MCP auto-enable, API base URL, permission mode) without explicit approval, which is now the fix plus managed settings that stop repo settings loosening policy; (b) **MCP server isolation**, with project MCP servers started inside a sandbox with no host credentials; (c) **credential isolation**, with the API key held by a proxy and never sent to a repo-chosen endpoint; (d) running the whole agent in a VM or dev container for untrusted repos, which Anthropic's docs recommend. None of these was on by default in 2025.

## Relevance to the talk
"Cloning a repo is now executing a repo." Coding agents brought back the auto-run problem of `.vscode/tasks.json` and git hooks, through a new set of config files. The repeated trust-dialog CVEs show a UI prompt standing in for a boundary.
