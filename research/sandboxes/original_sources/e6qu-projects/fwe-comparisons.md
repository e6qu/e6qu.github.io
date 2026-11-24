---
title: "fwe and other ways to run Linux programs"
url: https://github.com/e6qu/fun-with-emulators/blob/main/docs/comparisons.md
authors: e6qu (Adrian Mârza)
date: 2026-11-20 (file last changed in commit a9bffa1)
accessed: 2026-11-22
kind: repo
---

## Summary
Places fwe in the design space of "running a program built for one system on
another", along two axes: **how the program's code runs** (natively,
translated, emulated, rebuilt) and **who answers its system calls** (a real
Linux kernel in a VM; a Linux personality in the host kernel; a userspace
Linux kernel; the host kernel via a replacement library). fwe = native code +
userspace kernel. Compares, one section each, with Wine, Lima/Colima/Docker
Desktop/OrbStack, WSL1/WSL2, QEMU/KVM, Apple `container`, Noah, gVisor, QEMU
user mode, DynamoRIO, FEX/Box64, Rosetta 2, FreeBSD's Linuxulator, and
Homebrew/Nix — and ends with what fwe takes from each.

## Key points
- **Big comparison table** (columns: code runs / syscalls answered by / a
  Linux kernel? / one Linux process = one host process / host files). E.g.
  fwe native: in-process, fwe's userspace kernel, no kernel, yes, directly;
  WSL1: Linux personality in NT, no, yes (pico processes); WSL2 and
  Lima/Docker Desktop/OrbStack: one Linux VM, yes, no, shared into VM; Apple
  `container`: VM per container; gVisor: its Sentry, files through its Gofer;
  Linuxulator: personality in FreeBSD kernel.
- **Wine**: Windows' stable interface is DLL exports, so Wine reimplements DLLs;
  Linux's stable interface is the `svc` instruction itself (static binaries,
  Go, musl make syscalls directly) — so fwe intercepts at the instruction and
  implements the kernel. Shared state lives in mapped files, so no
  `wineserver`-like process.
- **Linux VMs (Lima, Colima, Docker Desktop, OrbStack, Podman machine)**: under
  fwe a Linux program is a macOS process — shows in Activity Monitor, uses the
  Mac's files in place, the Mac's network stack and ports, takes memory as
  needed rather than a VM's fixed allotment; "There is no VM to boot, so a
  program starts in milliseconds. The price is compatibility."
- **WSL1 vs WSL2**: WSL1 = fwe's design inside the NT kernel. Microsoft moved
  to WSL2 "chiefly because of file-system performance … and the long tail of
  kernel behaviour that is hard to match". For fwe this is "the risk this
  design carries: fidelity in the long tail", measured with LTP and real
  programs; fwe's file ops are host calls on APFS (no NTFS-style translation
  layer), though it still resolves every path.
- **QEMU/KVM**: fwe's VM backend uses Hypervisor.framework as a KVM user would
  but runs no kernel in the VM — guest at EL0, syscalls/faults exit to fwe.
- **Apple `container`**: one lightweight VM per container (own kernel + own
  IP). fwe instead runs Podman/crun/containerd/Docker themselves as Linux
  programs, containers as macOS processes in fwe's namespaces — "Isolation is
  weaker".
- **Noah** (2016–17): Linux x86-64 on Intel Macs, each process in a
  Hypervisor.framework VM with no kernel — direct predecessor of fwe's VM
  backend.
- **gVisor**: Go userspace kernel (Sentry) + Gofer for files; platforms
  `ptrace`, KVM (like fwe's VM backend) and `systrap` (seccomp catches the first
  call at a site, then patches `syscall` into a jump — like fwe's `svc`
  rewrite). "gVisor's purpose is isolation on a Linux host … fwe's purpose is
  compatibility on a macOS host: in the native backend the program shares
  fwe's address space, so fwe is no sandbox against a hostile program." The two
  compose: running `runsc` on fwe is a 1.0 goal.
- **QEMU user mode**: translates code, passes syscalls to a Linux host — "fwe
  does the opposite half of QEMU user mode's job."
- **DynamoRIO / Pin / Valgrind**: code-cache everything; fwe only does so for
  JIT-generated code.
- **Rosetta 2**: AOT + JIT translation of x86-64 macOS programs, OS interface
  unchanged; fwe borrows "prepared code kept between runs".
- **FreeBSD Linuxulator**: second syscall table chosen at `execve`,
  `/compat/linux`, `linprocfs`/`linsysfs`; NetBSD `compat_linux`, illumos lx
  branded zones; OpenBSD removed its version in 2014. "fwe is this design moved
  out of the kernel, because macOS does not let a program add a system-call
  table." A side-by-side table shows what fwe must build that a kernel
  personality gets for free (signal frames, fork, memory, containers —
  "Linux's namespaces largely absent" in the Linuxulator).
- **What fwe takes from each**: Wine/WSL1 (native in-process, one host process
  per guest); Linuxulator (personality over host services, separate userland);
  gVisor (kernel as a program, syscall patching); Noah/KVM (kernel-less VM);
  DynamoRIO (code cache); Rosetta 2 (kept translations); WSL2 ("the warning to
  measure fidelity, not assume it").

## Excerpts
> "fwe runs code natively and answers system calls with a userspace kernel."
> (§ The design space)

> "WSL1 runs Linux programs on Windows as 'pico processes' whose system calls
> the NT kernel passes to a Linux personality in the kernel: fwe's design,
> inside the host's kernel rather than beside it." (§ WSL1 and WSL2)

> "gVisor's purpose is isolation on a Linux host, so it keeps the program away
> from the host kernel and its memory. fwe's purpose is compatibility on a
> macOS host" (§ gVisor)

> "fwe is this design moved out of the kernel, because macOS does not let a
> program add a system-call table" (§ FreeBSD's Linuxulator)

## Relevance to the talk
Ready-made taxonomy slide: "who answers the syscalls?" maps cleanly onto the
sandboxing story (VM kernel / host-kernel personality / userspace kernel /
library). It locates fwe next to WSL1, gVisor, the Linuxulator and Noah, and
gives the WSL1→WSL2 lesson (fidelity and FS performance drove Microsoft back to
a VM) as a cautionary tale. Cross-reference `virtualization/` (gVisor,
Firecracker) and `macos-windows/` (WSL, Apple `container`).
