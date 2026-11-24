---
title: Pico Process Overview
url: https://learn.microsoft.com/en-us/archive/blogs/wsl/pico-process-overview
authors: Nick Judge (posted on the Microsoft WSL blog)
date: 2016-05-23
accessed: 2026-11-22
kind: blog
---

## Summary
Explains the pico process, the kernel foundation of WSL1. Originating in
Microsoft Research's Drawbridge library-OS project, a *minimal process* is an
empty user address space the NT kernel does not manage; a *pico process* is a
minimal process paired with a kernel-mode *pico provider* driver that receives
all its system calls and exceptions. WSL1's provider implements the Linux
syscall ABI on top of the NT kernel — no Linux kernel, no VM.

## Key points
- Drawbridge goal: run an application and its OS dependencies in a single
  host process instead of a VM, for "greater density of application
  workloads" with similar isolation/compatibility.
- Minimal processes: no ntdll mapping, no PEB, no initial thread/TEBs, no
  shared user data section. First support in Windows 8.1 / Server 2012 R2
  (Drawbridge only); MSR brought it to the kernel team early 2013.
- Pico provider registers at boot; the kernel dispatches all user-mode
  syscalls and exceptions to it; scheduling, memory and I/O remain NT's.
- Kernel changes for WSL: improved fork, 4 KB-granularity address-space
  management (normally 64 KB), per-thread case-sensitive file names.
- In comments, the WSL team said there were no public APIs for third-party
  pico providers (June 2016).

## Excerpts
> "Normally, this would be done by running the application and OS in a virtual machine, but this comes with significant resource overhead." (Drawbridge)

> "With its reduced overhead, when compared to a VM, this approach allows for greater density of application workloads on a single host" (Drawbridge)

> "The Windows kernel passes all system calls and exceptions that originate from the user-mode portion of a pico process to the pico provider to handle as it sees fit." (Pico Processes and Providers)

## Relevance to the talk
The road not taken for Linux-on-Windows density: syscall translation in the
host kernel (like gVisor's Sentry but in-kernel). It was lighter than a VM but
had compatibility gaps, and Microsoft moved to WSL2's VM in 2019. WSL1 was
also not designed as a security sandbox — Linux processes shared the host
user's identity and network stack.
