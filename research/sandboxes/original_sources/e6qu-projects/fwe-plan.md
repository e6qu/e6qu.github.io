---
title: "fun-with-emulators — Plan"
url: https://github.com/e6qu/fun-with-emulators/blob/main/PLAN.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit 7041f84)
accessed: 2026-11-22
kind: repo
---

## Summary
Goal, approach, scope, the 1.0 finish line, principles and how progress is
measured. The goal is "a practical, performant and compatible Linux
environment on macOS (Apple Silicon), without a Linux kernel and faster than
a Linux VM on the same Mac". The approach is explicitly modelled on Wine and
WSL1; a VM running a Linux kernel is a non-goal.

## Key points
- **Approach**: Linux code runs directly on the CPU inside an `fwe` process;
  syscalls go to fwe's kernel layer, which provides processes, threads,
  memory, files, signals, networking, namespaces and cgroups, with its own
  `/proc`, `/sys`, `/dev`.
- **Two backends share that kernel layer**: native (PIE binaries; relocatable
  static ones moved above 4 GiB) and hypervisor (other low-linked executables
  and programs that need 4 KiB pages) — the VM "provides CPU and memory only;
  no Linux kernel runs in it."
- **Scope**: Linux arm64 user ABI (syscalls, ELF, signals, `/proc`, `/sys`,
  `/dev`, ioctls, namespaces, cgroups); Debian/Alpine userlands; container
  engines and standard images; **gVisor's `runsc` on fwe**; Wine for ARM64
  Windows; graphical Linux programs (X server on the Mac, OpenGL/Vulkan on
  the Mac GPU). Out of scope: kernel modules, private kernel interfaces,
  hardware drivers, x86 binaries.
- **1.0 finish line**: target programs run unmodified (VM ones on real
  hardware); Docker/Podman/containerd build and run images, rootless Podman
  included; every applicable LTP syscall test passes; `strace`/`gdb` work;
  native speed within benchmark budgets; GUI programs and Wine draw on the GPU;
  **"a JDK workload runs inside gVisor (`runsc`) on fwe"**; signed release.
- **Principles**: compatibility first, no per-program special cases; program
  code runs as-is in-process (only syscalls, thread-pointer accesses and `x18`
  uses rewritten); **"The VM is the last resort"** — never used to make a
  program faster; native speed with CI budgets; skip work before speeding it
  up (cache prepared images/translations "as Rosetta 2 keeps its
  translations"); "counted, not assumed"; "no blockers".
- **Measuring progress**: real distribution binaries as e2e tests; LTP syscall
  tests gate CI against a baseline; benchmarks vs native macOS on the same
  runner, native Linux arm64 beside, a Linux VM and fwe's VM backend via
  `tools/bench/vm.sh`; a figure over budget fails CI.

## Excerpts
> "A practical, performant and compatible Linux environment on macOS (Apple
> Silicon), without a Linux kernel and faster than a Linux VM on the same
> Mac." (§ Goal)

> "fwe implements the Linux user-space ABI on macOS, as Wine implements
> Windows' and WSL1 implemented Linux's on Windows." (§ Approach)

> "**The VM is the last resort:** it runs only a program that cannot run
> in-process … never one that could, and is never the way to make a program
> faster." (§ Principles)

## Relevance to the talk
States the positioning in fwe's own words — Wine/WSL1 lineage, VM as last
resort — and the ambition to host gVisor (a security sandbox) on top of a
compatibility layer, which is a nice "sandboxes compose" talking point:
compatibility layer underneath (fwe), security layer on top (gVisor's
Sentry).
