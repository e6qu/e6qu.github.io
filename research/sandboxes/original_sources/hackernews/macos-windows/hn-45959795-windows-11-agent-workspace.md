---
title: "Windows 11 adds AI agent that runs in background with access to personal folders"
url: https://news.ycombinator.com/item?id=45959795
story_url: https://www.windowslatest.com/2025/11/18/windows-11-to-add-an-ai-agent-that-runs-in-background-with-access-to-personal-folders-warns-of-security-risk/
points: 703
comments: 638
authors: submitted by jinxmeta; Windows Latest article on Microsoft's "agent workspace"; HN commenters
date: 2025-11-17
accessed: 2026-11-22
kind: discussion
---

## Summary
Coverage of Windows 11's "agent workspace" preview: each agent gets its own Windows account and session, a
separate desktop, and access scoped to known folders. The HN thread is mostly hostile to AI in Windows, but the
technical comments note this is session/account isolation (not a VM) and ask why the same sandboxing isn't
offered for every app. Related: "Microsoft executive closes replies after Windows 11 'Agentic OS' backlash"
(https://news.ycombinator.com/item?id=45931725) and "Windows 11 is collecting data on which coding agents and
developer tools you use" (737 points, https://news.ycombinator.com/item?id=50524736).

## Key points
- Agent workspace: separate contained Windows session, own account/desktop/permissions; access to specific
  folders (Documents, Desktop); actions "isolated and auditable" (quoted from the article in the thread).
- It is user-account-level separation on the shared kernel, cheaper than Windows Sandbox's VM.
- Commenters prefer a VM they control, or ask for the same mechanism for arbitrary apps.

## Excerpts
> "Agent workspace is a separate, contained Windows session made just for AI agents, where they get their own account, desktop, and permissions so they can click, type, open apps, and work on your files in the background while you keep using your normal desktop."
— FridayoLeary, quoting the article, https://news.ycombinator.com/item?id=45960069

> "If they realize the value of \"sandboxing\" something so insecure they should also be making it really easy for you to do the same with any app, or set of apps..."
— MaxL93, https://news.ycombinator.com/item?id=45960295

> "I have a Windows VM with net access (through a consumer VPN) that I install software in, make sure it's all up to date and whatnot. To do any real work I then take a snapshot and run it on its own VLAN"
— mindslight, https://news.ycombinator.com/item?id=45961590

## Relevance to the talk
Microsoft's first answer for desktop agents was not a VM but an OS account + session (Unix-style user
separation), later complemented by MXC's AppContainer policy. A useful contrast with Anthropic's Cowork VM.
