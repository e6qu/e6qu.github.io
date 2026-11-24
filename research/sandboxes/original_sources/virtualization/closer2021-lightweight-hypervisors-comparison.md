---
title: Comparative Performance Study of Lightweight Hypervisors Used in Container Environment
url: https://www.scitepress.org/Papers/2021/104405/104405.pdf
authors: Guoqing Li, Keichi Takahashi, Kohei Ichikawa, Hajimu Iida (Nara Institute of Science and Technology); Pree Thiengburanathum, Passakorn Phannachitta (Chiang Mai University)
date: 2021 (CLOSER 2021, 11th International Conference on Cloud Computing and Services Science)
accessed: 2026-11-22
kind: paper
---

## Summary
A small, independent benchmark of Docker (runc), gVisor (ptrace and KVM platforms), Kata Containers (QEMU and Firecracker backends) and a full QEMU/KVM VM on one laptop-class machine (6-core i7-9750H, 32 GB). It measures startup time, per-container memory footprint, syscall latency, network, disk, CPU, Nginx and MySQL. It is one of the few sources that puts startup and per-instance memory for all of these side by side.

## Key points
- Startup (time to network stack initialised, Ubuntu "Eoan" image running bash, 100 runs; Fig. 3): gVisor-kvm and gVisor-ptrace on average 0.13 s *faster* than Docker; Kata-firecracker 0.50 s slower than gVisor; Kata-qemu 0.10 s slower than Kata-firecracker; full QEMU/KVM 8.76 s on average to boot kernel + same userspace.
- Memory footprint (private dirty pages, average of 100 containers; Fig. 4): Docker 1.4 MB, gVisor-ptrace 10.3 MB, gVisor-kvm 11.3 MB, Kata-firecracker 124.75 MB, Kata-qemu 137.6 MB, QEMU/KVM 455.75 MB. (dockerd shared daemon ~40 MB excluded.)
- Text summary: gVisor ~7× Docker; Kata ~88× Docker and ~10× gVisor; QEMU/KVM 325× Docker. Kata VMs configured with default 2048 MB; QEMU VM with 700 MB.
- Syscall latency (getpid ×10,000): gVisor-ptrace 36× host; gVisor-kvm ~1.5× slower than the rest; Kata and QEMU/KVM comparable to host; Docker slightly slower than host (seccomp).
- Network: gVisor worst on both platforms (user-space netstack).

## Excerpts
> "On average, It took 8.76 seconds for QEMU/KVM to finish booting the kernel and initializing the same user space." (§3.1.1)

> "Kata-qemu used slightly more memory than Kata-firecracker, but both consumed 88× more memory than Docker and 10× more than gVisor." (§3.1.2)

## Relevance to the talk
Provides the per-instance overhead column for the comparison table. Caveats for the slide: single machine, 2019–2020 versions, gVisor before Systrap, Kata's memory includes guest kernel + agent + virtiofsd; startup includes image handling, not just VMM boot.
