---
title: Cloud Hypervisor (README)
url: https://github.com/cloud-hypervisor/cloud-hypervisor
authors: Cloud Hypervisor project (originated at Intel; now a multi-vendor community project)
date: repo created 2019-04-30; README read at main on 2026-11-22
accessed: 2026-11-22
kind: repo
---

## Summary
Cloud Hypervisor is a Rust VMM for "modern cloud workloads" running on KVM or the Microsoft Hypervisor (MSHV). Like Firecracker it is built from rust-vmm crates and minimal emulation, but it targets general-purpose cloud VMs (hotplug, migration, Windows guests, PCI) rather than only serverless functions. It is one of the hypervisors Kata Containers can use.

## Key points
- Runs on KVM or MSHV; x86-64 and AArch64 (riscv64 experimental); 64-bit only.
- Objectives listed: minimal emulation, low latency, low memory footprint, low complexity, small attack surface, CPU/memory/PCI hotplug, machine-to-machine migration.
- Guests: 64-bit Linux and Windows (e.g. Windows Server 2025, Windows 11).
- Host kernel minimum 6.8 (current README).
- "A large part of the Cloud Hypervisor code is based on either the Firecracker or the crosvm project's implementations."
- Firecracker NSDI 2020 measured Cloud Hypervisor at ~13 MB memory overhead per VM vs ~3 MB for Firecracker and ~131 MB for QEMU (see firecracker-nsdi2020.md).

## Excerpts
> "The goal of the Cloud Hypervisor project differs from the aforementioned projects in that it aims to be a general purpose VMM for _Cloud Workloads_ and not limited to container/serverless or client workloads."

## Relevance to the talk
Shows the rust-vmm family tree (crosvm → Firecracker → Cloud Hypervisor) and that "microVM" ideas spread from serverless to general VMs. Relevant when choosing a VMM for agent sandboxes that need more devices (GPU passthrough, hotplug) than Firecracker offers.
