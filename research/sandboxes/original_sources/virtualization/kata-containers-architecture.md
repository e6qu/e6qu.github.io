---
title: Kata Containers Architecture (and Hypervisors) documentation
url: https://github.com/kata-containers/kata-containers/blob/main/docs/design/architecture/README.md
authors: Kata Containers community
date: living document (read at main on 2026-11-22)
accessed: 2026-11-22
kind: docs
---

## Summary
Kata runs each pod inside a lightweight VM: a containerd "shim v2" runtime launches a hypervisor, the VM boots a minimal guest kernel and a Kata agent, and the agent creates the container inside the guest. Container rootfs is shared into the guest via virtio-fs. Kata is pluggable across VMMs (QEMU, Cloud Hypervisor, Firecracker, Dragonball, StratoVirt) and positions hardware virtualization as "a second layer of defence". Hypervisor list: https://github.com/kata-containers/kata-containers/blob/main/docs/hypervisors.md

## Key points
- "lightweight virtual machines (VM's) that feel and perform like standard Linux containers, but provide stronger workload isolation using hardware virtualization technology as a second layer of defence."
- OCI runtime-spec compatible; works with Kubernetes CRI via CRI-O and containerd.
- shimv2: one runtime shim per pod rather than `2N+1` shims; several containers per VM.
- Flow: container manager → shimv2 API → runtime launches hypervisor → VM boots → agent started → `CreateSandbox`/create container inside the guest.
- Hypervisors: Cloud Hypervisor (Rust), Firecracker (Rust; "created for the AWS Lambda product"), QEMU (C; best for GPUs and confidential computing — Intel TDX, AMD SEV-SNP), Dragonball (Rust, Ant Group; runs in the same process as the shim), StratoVirt.
- Platforms: x86_64 (VT-x, AMD SVM), aarch64, ppc64le, s390x.
- Measured overhead elsewhere: CLOSER 2021 found Kata-qemu/Kata-firecracker ~125–138 MB per container vs Docker 1.4 MB; Edera 2025 measured Kata (Dragonball) startup ~1.9 s.

## Excerpts
> "Kata Containers is an open source community working to build a secure container runtime with lightweight virtual machines (VM's) that feel and perform like standard Linux containers…" (Overview)

## Relevance to the talk
The "drop-in VM isolation for Kubernetes" option; contrasts with gVisor's user-space kernel. Useful for the trade-off table (strong isolation, ~100+ MB and ~1–2 s per sandbox).
