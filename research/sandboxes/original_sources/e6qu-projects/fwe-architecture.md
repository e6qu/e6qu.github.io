---
title: "fun-with-emulators — Architecture"
url: https://github.com/e6qu/fun-with-emulators/blob/main/docs/architecture.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit 7041f84)
accessed: 2026-11-22
kind: repo
---

## Summary
How each part of fwe is built (~114 KB): "fwe is a Linux kernel written as an
ordinary macOS program." It covers the five crates, a syscall's path, the
native backend (loading, rewriting, the syscall gate, faults, kept
preparation), memory bookkeeping, processes, threads/futexes, signals and
ptrace, files and `/proc`, event descriptors, IPC, sockets, **containers**,
and an extensive "Known limitations" list. Skimmed; the sections most
relevant to sandboxing are Summary, Components and Containers.

## Key points
- **Components**: `crates/kernel` (Linux syscalls on the host, behind a
  `Platform` trait — independent of how guest code runs), `crates/native`
  (native backend + `hv` hypervisor backend + Unicorn-based stand-in),
  `crates/elf`, `crates/abi` (partly generated from Linux UAPI headers),
  `crates/fwe` (CLI and e2e tests).
- A backend traps a syscall and calls `Kernel::enter_syscall` with the guest
  registers; the kernel crate translates Linux values (errno, flags, clock ids,
  signals, rlimits, ioctls) to host values in `host.rs`.
- **`fwe --pull IMAGE DIR`** fetches an image's linux/arm64 variant, verifies
  layer digests, unpacks with whiteouts; ownership and set-ID bits that an
  unprivileged unpack loses are kept in xattrs (`org.fwe.owner`,
  `org.fwe.mode`).
- **Containers** section — container runtimes need namespaces, mounts,
  cgroups, credentials, seccomp and devices, "none of which macOS offers an
  unprivileged process":
  - shared records (`shared.rs`) for kernel-wide state; namespaces made before
    the host `fork` so the child inherits them;
  - namespace descriptors / nsfs binds (as Docker and `ip netns` use);
  - per-thread filesystem views when a thread unshares;
  - Linux mount propagation (peer groups, slaves) across namespaces; new mount
    API (`fsopen`/`fsmount`/`move_mount`);
  - overlay mounts resolved like Linux's overlayfs, copy-up as APFS clone;
  - tmpfs with enforced `size=`/`nr_inodes=`; `proc` `hidepid=`;
  - cgroup device programs on an eBPF interpreter, socket filters with a small
    verifier;
  - loop devices; Landlock rulesets with domains/layers carried across
    `fork`/`execve`.
- Design note: polling intervals for cross-process waits (e.g. 5 ms orphan
  checks, 20 ms signal checks for waiters, CPU-time timer every 10 ms) show
  the costs of emulating kernel-wide state in user space.

## Excerpts
> "fwe is a Linux kernel written as an ordinary macOS program." (§ Summary)

> "Container runtimes need namespaces, mounts, cgroups, credentials, seccomp
> and devices, none of which macOS offers an unprivileged process" (§ Containers)

## Relevance to the talk
Supporting detail for the "userspace kernel" slide: what it takes to make
crun/Podman/Docker believe they're on Linux — essentially reimplementing the
kernel's container surface (namespaces, mount propagation, overlayfs, cgroup
v2 delegation, seccomp, eBPF device filters, Landlock) as ordinary user code.
Useful mainly for depth/Q&A; the talk-level claims are in
fwe-linux-on-macos.md.
