---
title: A seccomp overview
url: https://lwn.net/Articles/656307/
authors: Jake Edge (LWN.net)
date: 2015-09-02
accessed: 2026-11-22
kind: blog
---

## Summary
LWN overview summarising the full history of
seccomp: the original 2005 "strict" mode, the 2012 BPF filter mode, and the 2014 `seccomp()` syscall,
with the users that had adopted it by 2015.

## Key points
- Mode 1 / strict: merged Linux 2.6.12 in 2005; process may only call four syscalls (read, write, exit,
  sigreturn — names per seccomp(2)); anything else kills it.
- Mode 2 / filter: Linux 3.5 in 2012; classic BPF program evaluates each syscall number + arguments.
- `seccomp()` system call: Linux 3.17 in 2014 (instead of extending `prctl()`).
- Users in 2015: Chrome/Chromium, OpenSSH, vsftpd, Firefox OS; Docker "not quite" yet.
- Origin of mode 1 (from LKML, Jan 2005): Andrea Arcangeli wrote it for "Cpushare", a scheme to sell idle
  CPU cycles by running other people's code safely
  (https://lkml.indiana.edu/hypermail/linux/kernel/0501.2/1612.html; LWN 2005 coverage https://lwn.net/Articles/120647).

## Excerpts
> "The Linux kernel has a few hundred system calls, but most of them are not needed by any given process."

> "The idea behind seccomp is to restrict the system calls that can be made from a process."

## Relevance to the talk
Seccomp's origin is literally "run untrusted code to earn money from spare CPU" — 2005's version of a
hosted code sandbox. It then sat almost unused for seven years until BPF filters made it practical.
