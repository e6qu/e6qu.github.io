---
title: seccomp_unotify(2) — seccomp user-space notification mechanism
url: https://man7.org/linux/man-pages/man2/seccomp_unotify.2.html
authors: Linux man-pages project (Michael Kerrisk); mechanism by Tycho Andersen
date: mechanism merged Linux 5.0 (released 2019-03-03); page is living
accessed: 2026-11-22
kind: man-page
---

## Summary
Documents `SECCOMP_RET_USER_NOTIF`: instead of allowing/denying, a filter can park the calling thread and
forward the syscall to a supervisor process, which decides the result (or performs the operation itself).
Designed for container managers that need to emulate privileged calls (mount, mknod, module loading).
The page warns that it must not be used as a security policy mechanism because of TOCTOU races.

## Key points
- Merge: KernelNewbies Linux 5.0 (2019-03-03): "Add seccomp trap to userspace…" (https://kernelnewbies.org/Linux_5.0).
  (The draft man page said "since Linux 4.21" — 4.21 was renamed 5.0.)
- Later additions: `SECCOMP_USER_NOTIF_FLAG_CONTINUE` (5.5), `SECCOMP_IOCTL_NOTIF_ADDFD` (5.9),
  `SECCOMP_ADDFD_FLAG_SEND` (5.14). Linux 5.6 added `pidfd_getfd(2)`, which KernelNewbies pairs with
  user notification for sandbox supervisors.
- Design history: LWN "Deferring seccomp decisions to user space", Jonathan Corbet, 2018-06-02
  (https://lwn.net/Articles/756233/) — motivating examples: let a container create `/dev/null` but not a
  block device; mount filesystems under tight control.
- Supervisor must do the work itself when it "allows" a call it emulates; `FLAG_CONTINUE` lets the kernel run
  the original syscall but re-reads user memory, hence the TOCTOU warning.

## Excerpts
> "This page describes the user-space notification mechanism provided by the Secure Computing (seccomp) facility." — DESCRIPTION

> "punt a decision back to user space" — LWN 756233

## Relevance to the talk
The bridge from "kernel says yes/no" to "a policy daemon decides" — the same shape as agent sandboxes
that prompt a user or policy engine for permission. Also the cautionary note: interception ≠ enforcement.
