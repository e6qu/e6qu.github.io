---
title: "Windows Subsystem for Linux: The lost potential"
url: https://news.ycombinator.com/item?id=25154300
story_url: https://jmmv.dev/2020/11/wsl-lost-potential.html
points: 362
comments: 241
authors: submitted by r0sk; essay by Julio Merino (jmmv); HN commenters incl. craigaloewen (Craig Loewen, WSL PM), brendangregg, saagarjha, ralph87
date: 2020-11-19
accessed: 2026-11-22
kind: discussion
---

## Summary
The best HN post-mortem of WSL1. Merino argues that WSL1's syscall-translation design (pico processes in the NT
kernel) was the more interesting path and that WSL2's VM gave it up. Commenters supply the reasons it lost: the
filesystem (no shared dentry cache over NTFS that Windows programs can also mutate; NT I/O stack cost), the
treadmill of new Linux kernel features, and the cost of maintaining semantic parity. A WSL PM acknowledges the
community's reservations. Related: WSL2 announcement thread "Shipping a Linux Kernel with Windows" (270 points,
https://news.ycombinator.com/item?id=19842817).

## Key points
- WSL1 was not a classic NT environment subsystem: it used pico processes and an in-kernel driver (lxcore.sys)
  implementing the Linux syscall ABI; WSL2 runs a real Linux kernel in a Hyper-V utility VM.
- Filesystem: Linux performance relies on the dentry cache, which WSL1 had to subvert because Windows programs
  can change NTFS underneath; WSL team comments on GitHub issue #873 are cited as the primary source.
- Feature treadmill: eBPF, io_uring, WireGuard etc. would return ENOSYS-like failures, making WSL1 "a weird fork
  of an old Linux kernel".
- The VM shrinks the Windows–Linux interface "to a single kernel implementation and a few drivers".
- saagarjha, who worked on a "Darwin subsystem for Linux", calls Linux's small, stable ABI the reason this
  approach makes sense at all.

## Excerpts
> "The bottom line is WSLv1 design SUCKED precisely because it tried to cross-breed 2 extremely complex semantically incompatible systems."
— ralph87, https://news.ycombinator.com/item?id=25154556

> "This one fundamentally unfixable problem alone is probably 80% the reason WSL1 IO perf sucked - because the design absolutely required it."
— ralph87, on the dentry cache, https://news.ycombinator.com/item?id=25154556

> "I imagine a lot of newer features would return ENOSUPP from the kernel, so WSL1 basically becomes a weird fork of an old Linux kernel."
— brendangregg, https://news.ycombinator.com/item?id=25156701

> "Linux is one of the few OSes where this kind of approach really makes sense, since it's open source and has a small, very well-defined, stable ABI that you can implement and everything should \"just work\"."
— saagarjha, https://news.ycombinator.com/item?id=25159862

> "And yes we totally hear the community's reservations about moving to a virtualization based approach and we take this into account as we plan the next overall steps for WSL :)"
— craigaloewen (Microsoft WSL PM), https://news.ycombinator.com/item?id=25156140

> "So they painstakingly built a Linux syscall ABI into the Windows NT kernel (including tricky stuff like fork()). Then they just abandon that approach and run the Linux kernel in a VM"
— tobias3, in the WSL2 announcement thread, https://news.ycombinator.com/item?id=19845204

## Relevance to the talk
The key precedent for fwe: the reasons WSL1 lost (filesystem semantics, feature treadmill) are the risks a
userspace Linux ABI on macOS must manage, and the reasons it was loved (no VM, shared files and processes,
light memory) are the reasons to try.
