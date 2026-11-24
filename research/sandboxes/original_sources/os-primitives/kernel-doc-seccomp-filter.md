---
title: Seccomp BPF (SECure COMPuting with filters)
url: https://docs.kernel.org/userspace-api/seccomp_filter.html
authors: Linux kernel documentation (originally Will Drewry; maintained by Kees Cook et al.)
date: living document; feature since Linux 3.5 (2012)
accessed: 2026-11-22
kind: docs
---

## Summary
The kernel's own description of seccomp filter mode. Its framing is attack-surface reduction: every process
can reach a large number of syscalls it never uses, and a BPF filter can cut that down. It is explicit
that syscall filtering *is not a sandbox* by itself, lists the return actions in precedence order, and
documents user-space notification and the `no_new_privs` prerequisite.

## Key points
- Return actions, highest precedence first: KILL_PROCESS, KILL_THREAD, TRAP (SIGSYS), ERRNO, USER_NOTIF,
  TRACE (ptrace), LOG, ALLOW.
- Installing a filter requires `prctl(PR_SET_NO_NEW_PRIVS, 1)` or `CAP_SYS_ADMIN` in the namespace — so a
  filtered process can't exec a setuid binary that would run with more privilege under the filter.
- USER_NOTIF hands the syscall to a supervisor over a listener fd (`SECCOMP_FILTER_FLAG_NEW_LISTENER`,
  `SECCOMP_IOCTL_NOTIF_RECV/SEND`), intended for container managers emulating e.g. `mount()`.
- Warns that notification flags don't remove TOCTOU races on pointer arguments.

## Excerpts
> "A large number of system calls are exposed to every userland process" — Introduction

> "The resulting set reduces the total kernel surface exposed to the application." — Introduction

> "System call filtering isn't a sandbox." — What it isn't

## Relevance to the talk
Good one-liner for the talk: the kernel docs themselves say seccomp isn't a sandbox, it's attack-surface
reduction. It is the "layer-2" in Chromium's design and the inner wall of most agent sandboxes on Linux.
