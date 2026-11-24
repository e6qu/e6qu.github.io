---
title: "Blending Containers and Virtual Machines: A Study of Firecracker and gVisor"
url: https://doi.org/10.1145/3381052.3381315
authors: Anjali, Tyler Caraza-Harter, Michael M. Swift (University of Wisconsin–Madison)
date: 2020-03-17 (VEE '20, Lausanne, Switzerland)
accessed: 2026-11-22
kind: paper
---

## Summary
Compares LXC, gVisor and Firecracker by measuring how much *host* Linux kernel code each exercises (via code coverage) and by microbenchmarks of CPU, network, memory and I/O. Counter-intuitively, both gVisor and Firecracker execute more host kernel code than native Linux, and gVisor's host-kernel footprint largely overlaps with LXC's. It argues "how much kernel code is reachable" is a better security lens than "where does functionality live". Authors' PDF: https://pages.cs.wisc.edu/~swift/papers/vee20-isolation.pdf

## Key points
- Platforms placed on a spectrum by how much functionality is in the host kernel: Native → LXC → gVisor → Firecracker → KVM/QEMU. (Fig. 1)
- Syscalls allowed to host (Table 1, of 350): LXC all except 44; Firecracker 36; gVisor 53 without host networking, 68 with.
- As of Nov 2019 the Sentry supported 237 of 350 syscalls (Linux 5.3.11).
- Union line coverage of host kernel across workloads (Table 2, of 806,318 lines): host 63,163 (7.83%), Firecracker 77,392 (9.59%), LXC 90,595 (11.23%), gVisor 91,161 (11.31%).
- Versions tested: gVisor release-20200127.0, Firecracker v0.19.1, Linux 5.4.13, Ubuntu 18.04.
- Performance: neither wins everywhere — Firecracker has higher network latency; gVisor is slower on memory management and network streaming (abstract / §5–6).
- Context noted in intro: AWS originally ran functions in containers inside per-tenant VMs, while Azure multiplexed tenants on a shared kernel in separate containers.

## Excerpts
> "Our results show that despite moving much functionality out of the kernel, both Firecracker and gVisor execute substantially more kernel code than native Linux." (Abstract)

> "gVisor and Linux containers execute substantially the same code, although with different frequency." (Abstract)

## Relevance to the talk
A sobering, quantitative check on sandbox marketing: the host kernel is still in the TCB for both designs. Good for the "measure attack surface, don't assume it" slide. No per-instance startup/memory numbers here — see the CLOSER 2021 and Edera comparisons for those.
