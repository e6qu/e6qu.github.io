---
title: crosvm — The ChromeOS Virtual Machine Monitor (README and book)
url: https://chromium.googlesource.com/crosvm/crosvm/
authors: Google ChromeOS / crosvm team
date: living document (GitHub mirror github.com/google/crosvm created 2021-09-13; read 2026-11-22). Predates Firecracker, which "started with crosvm" (AWS, Nov 2018).
accessed: 2026-11-22
kind: repo
---

## Summary
crosvm is a Rust VMM originally built for ChromeOS to run Linux (Crostini) and Android (ARCVM) guests; it is now also used by Android's Terminal app, Cuttlefish and on Windows. Its distinctive security idea is process-per-device: each virtio device can be forked into its own process and jailed with Minijail (namespaces, seccomp, dropped capabilities), so a device-emulation bug does not give the guest the whole VMM. Docs: https://crosvm.dev/book/ ; mirror: https://github.com/google/crosvm

## Key points
- "secure, lightweight, and performant Virtual Machine Monitor (VMM) written in Rust".
- Hypervisor backends: KVM, Gunyah (Qualcomm), GenieZone (MediaTek), Halla (Exynos) on Linux/Android; WHPX and HAXM on Windows.
- Architectures: x86_64, aarch64, riscv64.
- "process-per-device" model: main process + device processes; each device process jailed with Minijail — VFS (pivot_root), PID, user and network namespaces; strict per-device seccomp BPF; capabilities dropped.
- Broad virtio set (net, block, gpu with virgl/gfxstream, snd, fs/9p, vsock, balloon, TPM…).
- Lineage: AWS's launch post says "We started with crosvm"; Firecracker NSDI says rust-vmm crates are shared by Firecracker and crosvm; Cloud Hypervisor README says much of its code derives from Firecracker or crosvm.

## Excerpts
> "Each virtual device can be run in its own sandboxed process with restricted system access." (README, Core Philosophy)

## Relevance to the talk
A client-side (laptop/phone) microVM, not a cloud one — relevant for local agent sandboxes. The per-device jail is a good example of defence in depth around the VMM, the same idea as Firecracker's jailer and gVisor's Sentry/Gofer split.
