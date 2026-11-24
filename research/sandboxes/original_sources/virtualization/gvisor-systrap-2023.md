---
title: Releasing Systrap - A high-performance gVisor platform
url: https://gvisor.dev/blog/2023/04/28/systrap-release/
authors: Konstantin Bogomolov (gVisor team, Google)
date: 2023-04-28
accessed: 2026-11-22
kind: blog
---

## Summary
Announces Systrap, a gVisor platform that, like ptrace, works on ordinary Linux machines without virtualization, but is much faster. Workload threads run under a very restrictive seccomp filter; a syscall raises SIGSYS, a custom signal handler writes the request into memory shared with the Sentry. As a further optimisation it binary-patches the common x86-64 `mov sysno, %eax; syscall` pattern into a `jmp` to a trampoline, avoiding the signal entirely. Planned to replace ptrace as default by September 2023.

## Key points
- Motivation: KVM platform is fast on bare metal but suffers under nested virtualization (and is unavailable on some hardware/clouds); ptrace works everywhere but is slow. "running in a virtualized environment is the default state for most cloud users".
- Mechanism: ptrace used only to initialise executor threads; then seccomp filter + SIGSYS handler + shared memory with the Sentry.
- Optimisation: the 7-byte `mov`(5)+`syscall`(2) sequence is rewritten to `jmp *%gs:offset`, syscall number encoded in the offset (x86-64 only; not on ARM at time of writing).
- Benchmarks (GCE n2-standard-4, Debian 11): getpid microbenchmark plus ABSL build, ffmpeg, TensorFlow, Redis — results presented as charts (numbers not stated in text).
- Defence in depth: even if the sandbox is compromised, it is still bound by "a restricted set of seccomp filters".

## Excerpts
> "Like the existing ptrace platform, Systrap runs on most Linux machines out of the box without virtualization. Unlike the ptrace platform, it's fast 🚀."

> "Systrap will replace the ptrace platform by September 2023 and become the default."

## Relevance to the talk
A neat example of the field's ingenuity: seccomp, designed as a filter, becomes a trap mechanism, and syscall instructions get patched at runtime like 2000s binary translation. Explains why gVisor is practical inside cloud VMs (where many agent sandboxes run).
