---
title: "The Windows Subsystem for Linux is now open source"
url: https://news.ycombinator.com/item?id=44031385
story_url: https://blogs.windows.com/windowsdeveloper/2025/05/19/the-windows-subsystem-for-linux-is-now-open-source/
points: 1613
comments: 1194
authors: submitted by pentagrama; Microsoft; HN commenters incl. craigaloewen (WSL PM)
date: 2025-05-19
accessed: 2026-11-22
kind: discussion
---

## Summary
WSL (the WSL2 user-space and tooling) open-sourced at Build 2025. The largest WSL thread on HN; a long
sub-discussion compares WSL1 and WSL2 in daily use. WSL1's `lxcore.sys` was not included. Users still on WSL1
give concrete reasons: Windows-filesystem speed, corporate networking, memory. Also useful: "Isn't WSL2 just a
VM?" (175 points, https://news.ycombinator.com/item?id=46039140).

## Key points
- Open-sourced: WSL2 service/tools; not lxcore.sys (the WSL1 kernel driver).
- WSL2 is fast on its own ext4 disk image but slow across the 9P bridge to Windows files; WSL1 is the
  reverse ("nearly-native" Windows-file access, slow emulated Linux drive).
- Reported: `find`/`git status` on a large tree >100x slower in WSL2 than WSL1 on a Dev Drive (one user's
  numbers).
- Memory: WSL2 is a VM with a footprint; ballooning helps but does not fully share the file cache.
- WSL1 now looks unmaintained: newer distros need systemd; some new ELF binaries (recent Node.js) fail.

## Excerpts
> "'find' and 'git status' on WSL2 in a big project is still >100 times slower on windows dev drive which avoids those filters than it is with WSL 1 on dev drive."
— cma, https://news.ycombinator.com/item?id=44032832

> "They're complaining about accessing files that aren't on the disk image, where everything is relayed over a 9P network filesystem and not a block device. That's the part that gets really slow in WSL2, much slower than WSL1's nearly-native access."
— Dylan16807, https://news.ycombinator.com/item?id=44034067

> "My biggest grip with WSL is the fact that it is a VM and thus takes a large memory footprint."
— cogman10, https://news.ycombinator.com/item?id=44033631

> "Note that this doesn't include lxcore.sys, the kernel side driver that powers WSL 1."
— mrpippy, https://news.ycombinator.com/item?id=44032085

> "Does anyone know why there's no lightweight solution on macOS - something like LXC plus a filesystem gadget - that would let me run stuff like \"apt-get install chromium\"?"
— rao-v, https://news.ycombinator.com/item?id=44032831

> "As WSL1 runs on the same kernel I have stuff like named pipes available. I can fully mix processes from both worlds in one workflow."
— finaard, in "Isn't WSL2 just a VM?", https://news.ycombinator.com/item?id=46111971

## Relevance to the talk
WSL1 vs WSL2 is the cleanest natural experiment in "emulate the ABI vs run a VM" on a desktop OS; users'
trade-offs (shared files/processes and low memory vs compatibility) map directly onto fwe vs Apple `container`.
