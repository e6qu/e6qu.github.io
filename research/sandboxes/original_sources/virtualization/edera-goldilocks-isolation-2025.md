---
title: "Goldilocks Isolation: High Performance VMs with Edera"
url: https://arxiv.org/abs/2501.04580
authors: Marina Moore, Alex Zenla (Edera)
date: 2025-01 (arXiv v1); v2 dated 2026-04-16 (version read)
accessed: 2026-11-22
kind: paper
---

## Summary
A vendor paper presenting Edera, a Xen-based, Rust-written "VMM built for containers" that runs each container workload in a "zone" (PV or PVH guest) to eliminate the shared kernel. Its evaluation includes a single-host startup-time table across Docker, gVisor, Kata, Firecracker and Edera — useful as a recent, apples-to-apples-ish end-to-end startup comparison, though authored by an interested party.

## Key points
- Startup time (Table 1, bare-metal OVH host, 16 GB, 8-core Xeon 3.2 GHz; gVisor on default systrap; Kata with Dragonball VMM; Firecracker via firecracker-containerd): Docker 381 ms (pv boot config) / 378.8 ms (pvh) / 571.6 ms (kvm); gVisor 444 ms (pvh) / 452.2 ms (pv) / 684.4 ms (kvm); Edera-PV 1120.8 ms; Kata Containers 1913 ms; Firecracker 2421.8 ms; Edera-PVH 2516.8 ms.
- Abstract: Edera adds "a 740 millisecond increase in startup time from Docker's 381 milliseconds".
- Claims runtime within 5% of Docker on CPU/memory benchmarks; gVisor and Firecracker differ from others on memory performance; Firecracker ran sysbench CPU at roughly half speed in their setup (attributed to vCPU configuration).
- Motivation: container escapes via kernel exploits; argues existing VM approaches (Kata, Firecracker) need virtualization extensions/nested virt and carry startup costs.

## Excerpts
> "We find that Edera has runtime comparable to Docker with … a 740 millisecond increase in startup time from Docker's 381 milliseconds." (Abstract, abridged)

## Relevance to the talk
Shows that end-to-end, Kubernetes/containerd-style startup of VM-isolated containers is ~1–2.5 s even when the raw VMM boots in ~125 ms, while gVisor stays within ~60–110 ms of Docker. Treat as vendor data; single machine; numbers depend heavily on image caching and shim overheads.
