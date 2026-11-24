---
title: Securing AI agents on Windows
url: https://blogs.windows.com/windowsexperience/2025/10/16/securing-ai-agents-on-windows/
authors: Dana Huang (CVP, Windows Security, Microsoft)
date: 2025-10-16
accessed: 2026-11-22
kind: blog
---

## Summary
Microsoft's first public description of the Windows 11 *agent workspace*
used by Copilot Actions: agents run under a separate standard agent account,
in a contained workspace with their own desktop, with access scoped to a
limited set of known folders and visible, interruptible progress. The post
frames this as built on recognized Windows security boundaries
(accounts/sessions, ACLs) rather than on virtualization.

## Key points
- Agent accounts: apps and actions run under a separate standard account, not
  the signed-in user's; accounts provisioned only when the user enables the
  agent workspace.
- Agent workspace: separate environment with its own desktop and limited view
  of the user's desktop; agents work "in parallel with a human user".
- File access: limited set of known folders, enforced by ACLs; more access
  needs user authorization.
- Oversight: users can monitor, take over, and approve sensitive steps.
- The post itself gives no comparison to VMs and no resource numbers (the
  "more efficient than a full virtual machine" claim is on the support page;
  see windows-experimental-agentic-features.md).

## Excerpts
> "a contained environment where agents can work in parallel with a human user"

> "The agent accounts are only provisioned when users enable the agent workspace."

## Relevance to the talk
Microsoft's OS-level answer for desktop (GUI) agents: isolation by *user
account + Windows session*, the oldest multi-user boundary in NT, rather than
by VM. It is light (no guest OS), but its guarantees are those of a separate
local user — files readable by all authenticated users remain readable, and
there is no per-agent network filter in this design.
