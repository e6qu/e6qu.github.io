---
title: "Virtualization"
url: https://developer.apple.com/documentation/virtualization
authors: Apple Inc.
date: framework available since macOS 11.0 Big Sur (2020), per the docs' platform metadata
accessed: 2026-11-22
kind: docs
---

## Summary
Virtualization.framework (VZ) is Apple's high-level VM API on top of the hypervisor. The
overview lists virtio network, socket, serial-port, storage, entropy and memory-balloon devices. It can
boot Linux guests, and macOS guests on Apple silicon. Directory sharing over VirtioFS is what OrbStack
and others use; this page doesn't detail it. Lima, Colima, Tart, UTM, Docker
Desktop's "Apple Virtualization framework" option, OrbStack and Apple's own `container` all build on it.

## Key points
- Available since macOS 11.0.
- Configure a `VZVirtualMachineConfiguration` and add devices. Virtio 1.1 device set.
- Memory balloon (`VZVirtioTraditionalMemoryBalloonDevice`): the host can ask the guest to give pages
  back by lowering `targetVirtualMachineMemorySize`. Returning them depends on the guest cooperating.
- `maximumAllowedMemorySize` caps the configurable memory per VM.
- Licensing limits macOS guests to two extra instances per Mac (see macos-sla-virtualization-two-instances.md).
  Linux guests are not limited this way.

## Excerpts
> "The Virtualization framework provides high-level APIs for creating and managing virtual machines (VM) on Apple silicon and Intel-based Mac computers." — overview

> "The virtual machine has no insight into the amount of memory its guest operating system uses." — VZVirtioTraditionalMemoryBalloonDevice

## Relevance to the talk
VZ is the common substrate of nearly every way to run Linux on a Mac. Its memory model is the density
bottleneck. Guest RAM is reclaimed only through a cooperative balloon, and Apple's `container` docs
admit freed guest pages are not handed back. Many per-agent VMs therefore drift toward their
configured memory size.
