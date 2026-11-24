---
title: "Firecracker: Lightweight Virtualization for Serverless Applications"
url: https://www.usenix.org/conference/nsdi20/presentation/agache
authors: Alexandru Agache, Marc Brooker, Andreea Florescu, Alexandra Iordache, Anthony Liguori, Rolf Neugebauer, Phil Piwonka, Diana-Maria Popa (Amazon Web Services)
date: 2020-02 (17th USENIX NSDI, Santa Clara, CA)
accessed: 2026-11-22
kind: paper
---

## Summary
AWS explains why Lambda moved from "containers per function, EC2 VM per customer" to one KVM microVM per function slot, and how Firecracker — a minimal Rust VMM that keeps KVM but replaces QEMU — makes that affordable. The paper frames the trade-off as containers (cheap, weak) vs. VMs (strong, heavy) and argues specialised VMMs remove the dilemma. It gives the canonical microVM numbers (boot, memory overhead, creation rate) and describes the jailer. PDF: https://www.usenix.org/system/files/nsdi20-paper-agache.pdf

## Key points
- Headline numbers (§1): memory overhead "less than 5MB per container", "boots to application code in less than 125ms", "up to 150 MicroVMs per second per host".
- Measured memory overhead (§5.2, Fig. 7; m5d.metal, 2×Xeon Platinum 8175M, 384 GB): Firecracker ~3 MB per VM, Cloud Hypervisor ~13 MB, QEMU ~131 MB, roughly constant regardless of VM size.
- Boot (§5.1): pre-configured Firecracker and Cloud Hypervisor boot "twice as fast as QEMU"; with 50 concurrent launches, 99th percentile 146 ms vs 158 ms (FC vs CH, pre-configured).
- Density target (§2): servers with up to 1 TB RAM and functions as small as 128 MB means "up to 8000 functions on a server"; overhead budget initially 10% (102 MB for a 1024 MB function).
- Codebase (§2.1.3): Firecracker ~50k lines of Rust, "96% fewer lines than QEMU"; QEMU is >1.4 million lines and "can require up to 270 unique syscalls"; KVM adds ~120,000 lines in Linux. Firecracker began from crosvm; rust-vmm crates shared with crosvm and Cloud Hypervisor.
- Container attack surface (§2.1.1): a trivial Linux app needs 15 syscalls; a typical Ubuntu 15.04 install needs 224 syscalls and 52 ioctls (citing Tsai et al.); seccomp-bpf "provides the most important security isolation boundary" for containers.
- Jailer (§3.4.1): chroot, pid + network namespaces, dropped privileges, seccomp-bpf allowing 24 syscalls (with argument filters) and 30 ioctls (22 required by KVM).
- Device model: virtio net/block, serial, a partial i8042 (keyboard controller, <50 lines of Rust, used for reset); no BIOS, no PCI, no USB; the paper notes Firecracker "could not boot Microsoft Windows without significant" changes.
- Production (§1, §4): in Lambda since 2018; "millions of workloads and trillions of requests per month"; migration of "hundreds of thousands" of customers; each Lambda slot lives at most 12 hours. Because 125 ms is still too slow for scale-up, Lambda keeps a pool of pre-booted microVMs (Little's law: one pooled VM per 8 creations/s).
- Side channels (§3.4): recommends disabling SMT, enabling IBPB/IBRS, KPTI, etc.; AWS applies these in Lambda/Fargate.

## Excerpts
> "The traditional view is that there is a choice between virtualization with strong security and high overhead, and container technologies with weaker security and minimal overhead." (Abstract)

> "With Firecracker, we chose to keep KVM, but entirely replace QEMU to build a new Virtual Machine Monitor (VMM), device model, and API for managing and configuring MicroVMs." (§1)

> "The seccomp-bpf profile whitelists 24 syscalls, each with additional argument filtering, and 30 ioctls (of which 22 are required by KVM ioctl-based API)." (§3.4.1)

## Relevance to the talk
The central exhibit for "VMs became as cheap as containers". Directly relevant to agent sandboxes: most hosted agent sandboxes (E2B and others) build on Firecracker-class microVMs. The 125 ms / 5 MB / 150 per second figures are the ones audiences remember; note they are for a minimal guest kernel with a pre-configured VMM.
