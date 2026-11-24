---
title: pledge(2) — restrict system operations
url: https://man.openbsd.org/pledge.2
authors: OpenBSD project
date: first appeared in OpenBSD 5.9 (released March 2016); page is living
accessed: 2026-11-22
kind: man-page
---

## Summary
pledge() groups the POSIX feature set into about three dozen "promises" (stdio, rpath, wpath, cpath, inet,
unix, dns, proc, exec, …). A process declares the promises it needs; promises can only be reduced later.
Violations normally kill the process with an uncatchable SIGABRT (core dump), or return ENOSYS with the
`error` promise. `execpromises` sets what an exec'd child gets.

## Key points
- Promises include: stdio, rpath, wpath, cpath, dpath, inet, mcast, unix, dns, getpw, fattr, chown, flock,
  sendfd, recvfd, tape, tty, proc, exec, prot_exec, settime, ps, vminfo, id, pf, route, wroute, audio,
  video, bpf, unveil, error.
- `execpromises` requires `exec`; setuid/setgid targets fail with EACCES.
- OpenBSD 5.9 release date (March 2016) is ours, not the page's.

## Excerpts
> "The pledge() system call separates the POSIX feature set into a group of approximately 3 dozen subsystems." — DESCRIPTION

> "The pledge() system call first appeared in OpenBSD 5.9." — HISTORY

## Relevance to the talk
Contrast with seccomp: pledge is semantic ("I do DNS") rather than syscall-numeric, written in the program
itself, and stays in sync with the code because it lives in the code.
