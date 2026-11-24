---
title: arch/x86/entry/syscalls/syscall_64.tbl (Linux kernel source)
url: https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_64.tbl
authors: Linux kernel developers
date: master at Linux 7.4-rc3 (fetched 2026-11-22); historical tags v2.6.12 (2005), v3.5 (2012)
accessed: 2026-11-22
kind: repo
---

## Summary
The x86-64 system call table is the literal list of entry points any process (including one inside a
container) can invoke on the shared kernel. Counting it at different kernel versions gives concrete
numbers for "the kernel attack surface keeps growing". Counts below are our own, from the raw tables.

## Key points
- Linux 7.4-rc3 (master, Nov 2026): 386 native x86-64 entries (`common`/`64` ABI), numbered 0–336 and
  424–472 (424+ are numbers shared across all architectures); 370 have an implementation (the rest are
  retired/unimplemented slots such as `uselib`, `create_module`, `afs_syscall`). Highest is 472 (`fchroot`).
  Plus 36 x32-only compat entries (512–547).
- Linux 3.5 (2012, when seccomp-bpf landed): 313 native entries (0–312, last `kcmp`), 298 with implementations.
- Linux 2.6.12 (2005, when seccomp mode 1 landed): `include/asm-x86_64/unistd.h` defines syscalls 0–250
  (last `keyctl`).
- The oft-quoted "~450 syscalls" corresponds to the highest syscall *number* (~450–470 in recent kernels),
  not the number of distinct implemented calls (~370 on x86-64 today).
- Sources: https://github.com/torvalds/linux/blob/v3.5/arch/x86/syscalls/syscall_64.tbl,
  https://github.com/torvalds/linux/blob/v2.6.12/include/asm-x86_64/unistd.h

## Excerpts
> (Table rows, e.g.) "472	common	fchroot			sys_fchroot"

## Relevance to the talk
Quantifies "shared kernel": every container on a host shares ~370 syscalls' worth of kernel code (plus
ioctls, netlink, filesystems behind them). Roughly 250 → 300 → 370 implemented calls in two decades,
with whole subsystems (io_uring, BPF, user namespaces) multiplying reachable code behind single syscalls.
