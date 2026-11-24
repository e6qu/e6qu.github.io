---
title: "Hypervisor"
url: https://developer.apple.com/documentation/hypervisor
authors: Apple Inc.
date: framework available since macOS 10.10 Yosemite (2014), per the docs' platform metadata
accessed: 2026-11-22
kind: docs
---

## Summary
Hypervisor.framework is Apple's low-level C API for hardware-assisted virtualization from user space,
with no kernel extension. A VM is a process and each vCPU is a POSIX thread. The caller maps guest
physical memory from its own address space and handles every exit, which means emulating devices
itself. It is the base layer for QEMU-HVF, xhyve/HyperKit, Docker's new VMM and others.

## Key points
- Available since macOS 10.10 (platform metadata in the docs JSON).
- One VM per process. vCPUs are threads created with `hv_vcpu_create` and run with `hv_vcpu_run`.
- Guest memory is host-process virtual memory mapped with `hv_vm_map`, so guest RAM is ordinary
  pageable host memory.
- Requires the `com.apple.security.hypervisor` entitlement. Apps can be sandboxed and distributed on the
  App Store. Check availability with `sysctl kern.hv_support`.
- No device model is included. The VMM supplies virtio and other devices; Virtualization.framework is
  the higher-level option.

## Excerpts
> "Hypervisor abstracts virtual machines as processes, and virtual processors as threads." — overview

> "Each virtual machine corresponds to a process on the host. There can only be one virtual machine at a time per process" — overview

## Relevance to the talk
This is why "a VM per agent" on a Mac can be fairly cheap. A minimal VMM built straight on HVF
(Docker Sandboxes' VMM, libkrun, Firecracker-style designs) pays only for guest RAM actually touched
plus a small process. Since 2014 it has made microVMs possible on macOS without kexts.
