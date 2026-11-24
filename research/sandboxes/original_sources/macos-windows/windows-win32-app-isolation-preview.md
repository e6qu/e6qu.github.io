---
title: "Public Preview: Improve Win32 app security via app isolation"
url: https://blogs.windows.com/windowsdeveloper/2023/06/14/public-preview-improve-win32-app-security-via-app-isolation/
authors: David Weston, Sumit Lahiri (Microsoft)
date: 2023-06-14
accessed: 2026-11-22
kind: blog
---

## Summary
Announcement (June 2023, a few weeks after Build 2023) of the public preview of Win32 app isolation:
run classic Win32 desktop apps inside an AppContainer with declared
capabilities, packaged as MSIX. File access beyond the container is
brokered through a Brokering File System when the user picks a file, and an
Application Capability Profiler (ACP) learns the capabilities an app needs.

## Key points
- Built on AppContainer plus MSIX-declared capabilities (which the post
  describes as implementing a DACL-like grant list).
- Brokering File System (BFS) grants access to files the user explicitly
  chose (file dialog, context menu).
- Application Capability Profiler runs the app in a learning mode, logging
  (via ETW / Windows Performance Analyzer) the capabilities it would need.
- Goals: limit blast radius of zero-days, reduce consent prompts, keep app
  compatibility.
- The same "learning mode" idea reappears in 2026 in MXC's Learning Mode for
  ProcessContainer (see windows-mxc-repo.md).

## Excerpts
> "Win32 app isolation is a new security feature designed to be the default isolation standard on Windows clients."

> "These capabilities serve as a means to implement a Discretionary Access Control List on Windows."

> "Attackers must target a specific capability or vulnerability, compared to having broad access."

## Relevance to the talk
Shows Microsoft's direction before agents: making AppContainer usable for
arbitrary Win32 programs (the same problem agent sandboxes face with
compilers, shells and package managers). A direct ancestor of MXC's
ProcessContainer and its policy-learning workflow.
