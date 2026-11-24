---
title: "DirectX is coming to the Windows Subsystem for Linux"
url: https://news.ycombinator.com/item?id=23241040
story_url: https://devblogs.microsoft.com/directx/directx-heart-linux/
points: 706
comments: 531
authors: submitted by modeless; HN commenters incl. bitcrazed (self-identified Microsoft PM for WSL/Terminal; named as Rich Turner by another commenter)
date: 2020-05-19
accessed: 2026-11-22
kind: discussion
---

## Summary
Ostensibly about DirectX/GPU in WSL2, but the useful part is a Microsoft WSL PM describing how WSL2's VM differs
from a full Hyper-V VM: sparse allocation, release of memory back to the host, sub-2-second cold boot, and
distros as containers on one shared Linux kernel. Commenters push back with memory-leak reports.

## Key points
- WSL2 runs all distros as containers atop one shared Linux kernel inside one lightweight utility VM.
- The VM is "sparse & light": allocates host resources on demand and releases them when freed; boots a distro
  cold in under 2 s; designed to run days to weeks, not years.
- Counter-evidence in the thread: users ran cron jobs to drop Linux caches because memory was not returned
  (microsoft/WSL#4166).

## Excerpts
> "WSL2 literally runs user-mode distros (and their binaries) in containers atop a shared Linux kernel image … inside a lightweight VM that can boot an image from cold in < 2s and which aggressively releases resources back to the host when freed."
— bitcrazed (Microsoft PM), https://news.ycombinator.com/item?id=23243333

> "Full Hyper-V VMs aim to (generally) grab all the resources they can and keep hold of those resources as long as possible in case they're needed."
— bitcrazed (Microsoft PM), https://news.ycombinator.com/item?id=23243364

> "But then you have this thread with people running Cron jobs to free cached memory"
— mauflows, https://news.ycombinator.com/item?id=23243501

## Relevance to the talk
WSL2 is the template that Apple `container` machines, OrbStack and Docker Desktop follow: one tuned VM, many
containers, with memory reclaim as the make-or-break density feature.
