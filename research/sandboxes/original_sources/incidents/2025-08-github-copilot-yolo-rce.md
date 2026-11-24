---
title: "GitHub Copilot: Remote Code Execution via Prompt Injection (CVE-2025-53773)"
url: https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/
authors: wunderwuzzi (Embrace The Red, the pseudonym of Johann Rehberger); vendor record: Microsoft, "GitHub Copilot and Visual Studio Remote Code Execution Vulnerability", CVE-2025-53773 (https://msrc.microsoft.com/update-guide/vulnerability/CVE-2025-53773; read via the MITRE CVE API)
date: 2025-08-12
accessed: 2026-11-22
kind: blog
agent: GitHub Copilot agent mode (VS Code; Visual Studio 2022 17.14)
incident_date: reported to MSRC 2025-06-29; fixed in the August 2025 Patch Tuesday (2025-08-12). Part of Rehberger's "Month of AI Bugs" (August 2025)
category: prompt-injection-rce
cve: CVE-2025-53773 (CVSS 3.1 7.8 HIGH; Visual Studio 2022 17.14.0 to before 17.14.12)
sandbox_at_time: none. Agent file edits were written straight to disk with no approval. Terminal commands needed approval, *unless* `chat.tools.autoApprove` was set, and that setting lived in a workspace file the agent could write
exploited_in_wild: no; researcher demonstration (Windows, macOS, Linux)
---

## Summary
Copilot's agent could create and modify workspace files without asking. A prompt injection in any content the agent reads (a source file, web page, GitHub issue or tool result) therefore told it to add `"chat.tools.autoApprove": true` to `.vscode/settings.json`. That turns on what Rehberger calls "YOLO mode", in which Copilot runs terminal commands without confirmation. The injection then ran an OS-appropriate command, giving code execution on the developer's machine. Rehberger notes the same trick works through other agent-writable config (`.vscode/tasks.json`, MCP server definitions) and sketches a self-propagating "AI virus" that spreads the injection to other projects.

## Key points
- Root cause: the agent could write the file that governs its own permissions. Approval applied to *commands*, but not to *edits to the approval policy*.
- The write-up describes the target as the project's `.vscode/settings.json`. One step in the chain mentions `~/.vscode/settings.json`, so the exact path is inconsistent in the post.
- The MITRE/MSRC record describes it as "command injection", CVSS 3.1 AV:L/AC:L/PR:N/UI:R, and its affected-products list names Visual Studio 2022 17.14.0 to before 17.14.12. The VS Code side was fixed in the same August release per Rehberger; the record read here gave no VS Code extension version.
- Same month, same class: Cursor CVE-2025-54130/54135 (see [2025-08-cursor-curxecute-mcpoison.md](2025-08-cursor-curxecute-mcpoison.md)). Rehberger reported similar config-write issues in other agents during the Month of AI Bugs.
- Today: VS Code's OS sandbox for agent sessions exists but is **off by default** (`chat.agent.sandbox.enabled: "off"`), and enterprise policy `ChatToolsAutoApprove` can block global auto-approve ([agent-vscode-copilot-agent-mode.md](../agent-sandboxing/agent-vscode-copilot-agent-mode.md)).

## Excerpts
> "it can create and write to files in the workspace without user approval."

> "This will put GitHub Copilot in YOLO mode."

> "This is another example of how an AI agent might not stay in its box!"

## Would a mature sandbox have stopped it?
**Yes, through fs write scope that covers protected config files. It did not exist then.** The decisive control is that the agent cannot write `.vscode/settings.json`, `tasks.json`, MCP configs or any other file that changes its own permissions or launches processes. That has to be enforced outside the agent's process, so a prompt-injected agent cannot opt out. A command sandbox with a default-deny egress allowlist would further limit what the post-escalation command could do. VS Code's later agent sandbox handles this (writes limited to the workspace, with protected paths), but it is opt-in. Approval on its own failed here because the agent could switch approval off.

## Relevance to the talk
The single best slide for "an agent that can edit its own policy has no policy". It also gives a clean before/after: in 2025 approvals were the only control and the agent could disable them. In 2026 there is an OS sandbox with protected paths, but it is still off by default.
