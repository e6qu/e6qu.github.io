---
title: "Containerization (apple/containerization README)"
url: https://github.com/apple/containerization
authors: Apple Inc.
date: repository created 2025-05-29; open-sourced at WWDC25 (June 2025); README read at HEAD
accessed: 2026-11-22
kind: repo
---

## Summary
Apple's open-source Swift package for running Linux containers on macOS. Its defining design choice is
that each Linux container runs in its own lightweight VM on Virtualization.framework, with an
optimized kernel config and a minimal root filesystem. A small Swift init, `vminitd`, runs as PID 1
in the guest and is driven over gRPC on vsock. Sub-second start times are claimed. A second backend
now exists for Linux hosts (cloud-hypervisor + KVM) with the same `vminitd` contract.

## Key points
- One VM per container, each with its own IP address, so ports don't need forwarding.
- Sub-second start. The minimal rootfs has no core utilities, no dynamic libraries and no libc.
  `vminitd` is statically linked.
- APIs: OCI images and registries, building ext4 filesystems, netlink, an optimized kernel, VM spawning,
  process management, and Rosetta 2 for amd64 images.
- Backends:
  - macOS: `VZVirtualMachineManager`, the shipping path.
  - Linux: `CHVirtualMachineManager` (one cloud-hypervisor process per VM, virtio-fs via `virtiofsd`, TAP networking).
- Requires Apple silicon, macOS 26 and Xcode 26.

## Excerpts
> "Containerization executes each Linux container inside of its own lightweight virtual machine." — Design

> "Containers achieve sub-second start times using an optimized Linux kernel configuration and a minimal root filesystem with a lightweight init system." — Design

## Relevance to the talk
Apple's own answer to the density question is a microVM per container: Firecracker-style
"VM-strength isolation at container cost", not namespaces, because Darwin has none to offer Linux
workloads. It is the reference point for "how light can a per-agent VM be on a Mac".
