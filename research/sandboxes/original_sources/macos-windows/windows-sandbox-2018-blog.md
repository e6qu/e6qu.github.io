---
title: Windows Sandbox
url: https://techcommunity.microsoft.com/blog/windowsosplatform/windows-sandbox/301849
authors: Hari Pulapaka for the Windows Sandbox team (with Margarit Chenchev, Erick Smith, Paul Bozzay), Microsoft
date: 2018-12-18 (last updated 2022-12-12); shipped in Windows 10 1903 (May 2019)
accessed: 2026-11-22
kind: blog
---

## Summary
The announcement of Windows Sandbox: a disposable, hypervisor-isolated Windows
desktop built into Windows 10 Pro/Enterprise (Insider build 18305+, then
1903). It explains the tricks that make a full Windows guest cheap: a dynamic
base image that links to the host's immutable files, memory sharing of host
binaries ("direct map"), an integrated scheduler, snapshot/clone for fast
boot, and WDDM GPU virtualization. It builds on Windows Containers technology.

## Key points
- Dynamic base image: clean copies of mutable files plus links to immutable
  host files; ~100 MB installed, 25 MB compressed when not installed — no
  separate VHD download.
- Memory: host can reclaim guest memory; "direct map" shares the host's
  physical pages for OS binaries (e.g. ntdll executable pages) with the guest.
- Integrated scheduler: guest virtual processors are scheduled like host
  threads, so host work can preempt sandbox work.
- Snapshot and clone: boot once, save memory/CPU/device state, restore on
  later launches.
- Requirements stated: 4 GB RAM minimum (8 GB recommended), 1 GB free disk,
  2 CPU cores (4 with HT recommended).
- Properties claimed: pristine on each launch, disposable, kernel isolation via
  hypervisor.

## Excerpts
> "Windows Sandbox is a new lightweight desktop environment tailored for safely running applications in isolation."

> "The majority of the files are links (immutable files) and that's why the small size (~100MB) for a full operating system."

> "In other words, the same executable pages of ntdll, are mapped into the sandbox as that on the host."

> "Windows Sandbox builds on the technologies used within Windows Containers."

## Relevance to the talk
The best documented example of making a VM "light" by sharing with the host
(files by link, code pages by direct map, scheduling as threads). Compare to
Apple's `container` (one lightweight VM per container) and to Kata/Firecracker.
It is still a VM per sandbox and — per current docs — only one instance at a
time (see windows-sandbox-docs.md), so it does not solve multi-agent density.
