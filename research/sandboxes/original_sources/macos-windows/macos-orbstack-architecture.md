---
title: "Architecture · OrbStack Docs"
url: https://docs.orbstack.dev/architecture
authors: Orbital Labs, LLC
date: undated docs page (footer © 2024)
accessed: 2026-11-22
kind: docs
---

## Summary
OrbStack gets its density from sharing. One lightweight Linux VM with a single shared kernel hosts
both Docker containers and full Linux "machines". The machines are not separate VMs; they are
system containers in the shared VM that behave almost like VMs. The page also mentions a custom
network stack and VirtioFS-based file sharing.

## Key points
- One lightweight Linux VM with a shared kernel to minimise overhead.
- Machines are containers sharing the kernel and are "virtually indistinguishable" from VMs for most purposes.
- File sharing builds on VirtioFS. Networking uses a custom virtual network stack.
- Machines are created and destroyed in under a minute; the docs speak of running "dozens of machines".

## Excerpts
> "OrbStack uses a lightweight Linux virtual machine with a shared kernel to minimize overhead and save resources" — Architecture

> "OrbStack machines are not independent VMs, but they're virtually indistinguishable for most intents and purposes." — Architecture

## Relevance to the talk
The canonical shared-VM density design on macOS. You pay one VM and one kernel, and then each
workload costs a Linux container. This is how you get dozens of environments on a laptop. The
isolation between them is Linux namespaces and cgroups inside the VM, not a hypervisor boundary.
