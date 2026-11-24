---
title: Experimental Agentic Features
url: https://support.microsoft.com/en-us/windows/ai/ai-features/experimental-agentic-features
authors: Microsoft Support
date: 2025-10-16 (updated 2025-11-17 and 2025-12-05 per editor's notes)
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft's support article for the Windows 11 "experimental agentic
features" setting (off by default, admin-only toggle) that enables the agent
workspace and agent accounts. It states that the workspace runs in its own
Windows session, is more efficient than a full VM such as Windows Sandbox for
common operations, and scales memory/CPU with activity. Agents may request
access to six known folders, with per-agent consent options.

## Key points
- Off by default; only an administrator can enable it (under Settings > System >
  AI Components > Experimental agentic features).
- Agent workspace = separate Windows session with its own desktop; agents work
  in parallel with the user.
- Each agent has its own dedicated account; one agent's access does not
  extend to others.
- Folder access: agents may request read/write to Documents, Downloads,
  Desktop, Music, Pictures, Videos; from preview build 26100.7344 per-agent
  "Allow Always / Ask every time / Never allow"; default asks for consent.
- Agent accounts can also reach any folder that all authenticated users can
  access — a notable gap.
- Explicit VM comparison: lighter than Windows Sandbox for common operations
  (no numbers given).

## Excerpts
> "For common operations, this setup is more efficient than a full virtual machine such as Windows Sandbox"

> "These workspaces are designed to be lightweight and secure, with memory and CPU usage scaling based on activity."

> "The experimental agentic feature setting is off by default."

## Relevance to the talk
The only Microsoft source that directly positions an agent isolation
mechanism as "lighter than a VM" for running agents in parallel. Its boundary
is a per-agent local account + session: good for GUI agents, but filesystem
isolation is ACL-based (authenticated-users-readable data leaks) and no
resource caps or network policy are described.
