---
title: "Arbitrary code execution from Cursor Agent through a prompt injection via MCP Special Files" (GHSA-4cxx-hrm3-49rm, CVE-2025-54135 "CurXecute") and "Modification of MCP Server Definitions Bypasses Manual Re-approval" (GHSA-24mc-g4xr-4395, CVE-2025-54136 "MCPoison")
url: https://github.com/cursor/cursor/security/advisories/GHSA-4cxx-hrm3-49rm
authors: Cursor (advisories). Researchers: Aim Labs / Aim Security (CurXecute; advisory credits GitHub users hxofir-a and MaccariTA); Andrey Charikov, Roman Zaikin, Oded Vanunu, Check Point Research (MCPoison, https://research.checkpoint.com/2025/cursor-vulnerability-mcpoison/, 2025-08-05)
date: advisories published 2025-08-01 / 2025-08-02
accessed: 2026-11-22
kind: docs
agent: Cursor IDE agent
incident_date: CurXecute reported 2025-07-07 (per press); MCPoison reported 2025-07-16; both fixed in Cursor 1.3 (2025-07-29)
category: prompt-injection-rce
cve: CVE-2025-54135 (CVSS 8.5 per advisory; press cites 8.6, Tenable 10), CVE-2025-54136 (CVSS 7.2)
sandbox_at_time: none for the agent at the time; Cursor's terminal sandbox came later (blog 2026-02-18). Cursor auto-wrote in-workspace files without approval and asked approval only for edits to *existing* dotfiles. MCP servers were started from `mcp.json` without re-approval when their contents changed
exploited_in_wild: no; researcher demonstrations
---

## Summary
Two Cursor bugs disclosed the same week, both about the agent's own MCP configuration being treated as code that nobody re-checks. **CurXecute**: Cursor let the agent *create* files in the workspace without approval. Editing an existing dotfile needed approval, but creating a missing one did not. An indirect prompt injection (Aim's PoC came through a message read via the Slack MCP server) could therefore make the agent write a new `.cursor/mcp.json` naming an attacker command as an MCP server, and Cursor ran it at once. Per press accounts the command had already run even if the user rejected the edit. **MCPoison**: Cursor bound a user's one-time MCP approval to the server's *name*, not its command. An attacker with commit access to a shared repo adds a harmless MCP entry, waits for a collaborator to approve it, then swaps in a malicious command, which then runs silently on every sync or reopen.

## Key points
- CurXecute advisory: affected <= 1.2.1, patched 1.3.9 (the advisory's number). Remediation: "The agent has been blocked from writing MCP-sensitive files without approval."
- MCPoison advisory: affected < 1.2.4, patched 1.3. Remediation: approval is now required "every time an mcpServer entry is modified".
- Same advisory batch: CVE-2025-54130 (RCE via injection writing "Editor Special Files"), CVE-2025-54131 (allowlist bypass), CVE-2025-54132 (image fetch via Mermaid, an exfil channel), CVE-2025-54133 (MCP deeplink hid arguments). A second batch (2025-10-02 to 11-03) added more "Sensitive File Overwrite Bypass" CVEs (CVE-2025-59944, -61593, Windows path quirks -64107/-64108) and RCE via `.code-workspace` files (CVE-2025-61590). That is the same protected-file class, bypassed again.
- The Aim Security blog (https://www.aim.security/post/when-public-prompts-turn-into-local-shells-rce-in-cursor-via-mcp-auto-start) returned HTTP 403 and was not read. CurXecute details are from the Cursor advisory, with the report date and CVSS 8.6 from press (The Hacker News, SecurityWeek).

## Excerpts
> "If the file is a dotfile, editing it requires approval but creating one if it doesn't exists doesn't." (GHSA-4cxx-hrm3-49rm)

> "Once a collaborator accepts a harmless MCP, the attacker can silently swap it for a malicious command (e.g., calc.exe) without triggering any warning or re-prompt." (GHSA-24mc-g4xr-4395)

> "a single approval action could be abused to enable long-term exploitation" (Check Point)

## Would a mature sandbox have stopped it?
**Yes for CurXecute; partly for MCPoison. Neither control existed at the time.** CurXecute is an fs-write-scope failure. A mature sandbox makes the agent's own control files (`.cursor/`, `mcp.json`, `.vscode/`, `.git/hooks`) read-only to the agent, *including creation*, and enforces that in the kernel, not in the editor's diff UI. Cursor's 2026 Seatbelt/Landlock sandbox now blocks writes to `.vscode`, `.cursor`, `.git/config` and `.git/hooks` ([cursor-agent-sandboxing.md](../agent-sandboxing/cursor-agent-sandboxing.md)). Even then, 2026 advisories show these protections being bypassed again ([2026-06-agent-sandbox-escape-advisories.md](2026-06-agent-sandbox-escape-advisories.md)). MCPoison is mainly a trust-binding bug (approve the content hash, not the name), but **MCP server isolation** would cap its impact: MCP servers launched inside a sandbox with no host filesystem or network beyond declared needs. In 2025 Cursor launched MCP servers as ordinary user processes.

## Relevance to the talk
Core evidence for "agent config is code". The agent could edit the file that decides which programs the agent launches. It also opens the long run of "sensitive file protection bypass" CVEs that followed: a blocklist of protected paths kept in the application is fragile.
