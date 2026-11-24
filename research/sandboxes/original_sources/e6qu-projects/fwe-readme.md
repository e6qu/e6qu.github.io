---
title: "fun-with-emulators — README"
url: https://github.com/e6qu/fun-with-emulators/blob/main/README.md
authors: e6qu (Adrian Mârza), the talk's author
date: 2026-11-20 (file last changed in commit a9bffa1; repo first commit 2026-11-01)
accessed: 2026-11-22
kind: repo
---

## Summary
fun-with-emulators (`fwe`) implements the **Linux kernel's user-space ABI on
macOS (Apple Silicon)** — "Wine's approach, for Linux" — in Rust. Because an
Apple-silicon Mac and an arm64 Linux machine share an instruction set, Linux
code runs directly on the CPU; fwe plays the kernel: each guest process is
one `fwe` process that carries out the program's syscalls with macOS's own
and supplies what macOS lacks (namespaces, cgroups, epoll, inotify, SysV IPC,
keyrings…). Two backends: **native** (in-process, a few instructions
rewritten; JIT code run by translation) and **Hypervisor** (a tiny
Hypervisor.framework VM with no kernel, for executables fixed below 4 GiB).
Goal: unmodified Linux programs, Docker/Podman containers, graphical apps,
Windows apps via Linux's Wine, and gVisor.

## Key points
- **Native backend**: every position-independent program (most of what
  distros ship) and static programs whose link kept relocations (moved above
  4 GiB). Rewrites "the few instructions macOS does not let a Linux program
  run unchanged" (`svc`, thread-pointer access, `x18`).
- **Hypervisor backend**: for programs linked at a fixed address below 4 GiB,
  which macOS reserves (`__PAGEZERO`); needs the hypervisor entitlement (no
  root).
- **Status** (CI-checked output):
  - Natively: Debian coreutils, bash, git, SQLite, lighttpd, rustc+Cargo, apt,
    Node.js; Alpine Node.js, OpenJDK, LuaJIT, Racket, Guile (JIT code
    translated).
  - In the VM: Debian Python, GCC, clang, Go; Alpine SBCL — **verified on a
    software stand-in for Hypervisor.framework, not yet on real hardware**.
  - Containers, natively: crun, Podman and containerd run `alpine`; Podman
    builds/pushes/pulls/runs images, rootless too; Docker Engine runs and
    builds (BuildKit) and brings up Compose projects.
  - Windows: Wine runs ARM64 Windows console programs in the VM (stand-in).
  - **Conformance: "every LTP system-call test that applies passes."**
- Left to 1.0: native speed, graphical programs, gVisor.
- Usage: `brew install --HEAD fwe`; `fwe --pull debian:trixie ~/debian`;
  `fwe --root ~/debian ~/debian/bin/bash`; `fwe --strace ./hello`.
- Crates: `abi`, `elf`, `kernel` (Linux syscalls on the host), `native`
  (native + hypervisor backends + stand-in), `fwe`.

## Excerpts
> "It implements the Linux kernel's user-space ABI rather than running a Linux
> kernel: Wine's approach, for Linux." (opening)

> "`fwe` plays the Linux kernel: each guest process is one `fwe` process, which
> carries out the program's system calls with macOS's own and provides what
> macOS lacks (namespaces, cgroups, epoll, inotify, System V IPC, keyrings and
> more)." (§ How it works)

## Relevance to the talk
The second pole of "lighter than a VM on macOS": instead of confining macOS
processes (fws), run *Linux* processes on macOS without a Linux kernel. It
sits in the same family as WSL1, gVisor's Sentry, FreeBSD's Linuxulator and
Wine. It makes Linux containers (Docker/Podman) run as ordinary Mac
processes — relevant to agents whose tooling assumes a Linux container. Its
own docs are explicit that this is compatibility, not a security boundary
(see fwe-linux-on-macos.md).
