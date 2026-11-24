---
title: "Windows Sandbox"
url: https://news.ycombinator.com/item?id=18713436
story_url: https://techcommunity.microsoft.com/t5/Windows-Kernel-Internals/Windows-Sandbox/ba-p/301849
points: 597
comments: 319
authors: submitted by lxm; Microsoft Windows Kernel Internals blog; HN commenters
date: 2018-12-19
accessed: 2026-11-22
kind: discussion
---

## Summary
Announcement of Windows Sandbox: a disposable, Hyper-V-based lightweight VM that reuses the host's Windows
files (dynamic base image) and shares memory pages with the host. HN discussion is about its Pro-only
availability (Hyper-V), and about MSIX / Store packaging as the app-level sandbox alternative. Later threads:
"Windows Sandbox" (259 points, 2023, https://news.ycombinator.com/item?id=35413594), "RunInSandbox"
(https://news.ycombinator.com/item?id=36462508).

## Key points
- Requires Hyper-V, hence Pro/Enterprise only; users want it on Home.
- MSIX/Store packaging pitched (pjmlp) as the per-app sandbox for "regular" Win32 software.
- Comparison with macOS: SIP + Gatekeeper protect the base system but are not a disposable environment.
- Windows Sandbox is single-instance, so it is a "try this binary" tool, not a density story (see topic README).

## Excerpts
> "Ah, it's Pro because it's using Hyper-V."
— voltagex_, https://news.ycombinator.com/item?id=18713626

> "Then make Hyper-v home. Seriously this is a killer feature needed by everybody."
— n-gatedotcom, https://news.ycombinator.com/item?id=18713633

> "MSIX is a developer feature, replaces appx and msi installers, while adding support for sandboxing in the process."
— pjmlp, https://news.ycombinator.com/item?id=18714710

## Relevance to the talk
Windows' consumer-facing sandbox is a VM, like macOS's; the process-level alternatives (AppContainer via MSIX,
Win32 App Isolation) exist but saw little adoption. That is the "VMs dominate the desktop" pattern on Windows.
