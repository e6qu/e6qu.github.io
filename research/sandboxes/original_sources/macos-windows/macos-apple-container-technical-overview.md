---
title: "Technical Overview (apple/container docs)"
url: https://github.com/apple/container/blob/main/docs/technical-overview.md
authors: Apple Inc.
date: living doc on main; container repo created 2025-05-30, first release 0.1.0 on 2025-06-09, 1.0.0 on 2026-06-09, 1.7.1 on 2026-11-06
accessed: 2026-11-22
kind: docs
---

## Summary
Explains how the `container` CLI differs from the usual "one big Linux VM hosts all containers" model.
It runs one lightweight VM per container and claims VM-level isolation, better privacy (only the
needed host data is mounted into each VM), lower memory than full VMs, and boot times comparable to
containers in a shared VM. It also documents the architecture:
- `container-apiserver`, a launchd agent.
- XPC helpers for images, network (vmnet) and machines.
- One `container-runtime-linux` helper per container.

It is candid about memory release: freed guest pages are not given back to macOS.

## Key points
- Security: each container is isolated like a full VM. Privacy: per-VM mounts instead of mounting
  everything into a shared VM.
- Memory: the VM uses only what the app touches. Because ballooning in Virtualization.framework is
  only partial, pages freed inside the guest are not returned to the host. The docs suggest restarting
  memory-heavy containers occasionally.
- On macOS 15, vmnet allows only isolated networks, so containers can't talk to each other. Full
  networking needs macOS 26.
- Built on Virtualization.framework, vmnet, XPC, launchd, Keychain and unified logging.

## Excerpts
> "With macOS, the typical way to run Linux containers is to launch a Linux virtual machine (VM) that hosts all of your containers." — How does container run my container?

> "Containers created using `container` require less memory than full VMs, with boot times that are comparable to containers running in a shared VM." — same section

> "Currently, memory pages freed to the Linux operating system by processes running in the container's VM are not relinquished to the host." — Releasing container memory to macOS

## Relevance to the talk
The clearest statement of the trade-off between a VM per workload and a shared VM, written by the
platform vendor. For agent density the important caveat is memory. Each VM's footprint ratchets up
toward its peak and does not shrink, so N agents cost the sum of their peaks, not their current use.
