---
title: "Meltdown: Reading Kernel Memory from User Space"
url: https://www.usenix.org/conference/usenixsecurity18/presentation/lipp
authors: Moritz Lipp, Michael Schwarz, Daniel Gruss, Thomas Prescher, Werner Haas, Anders Fogh, Jann Horn, Stefan Mangard, Paul Kocher, Daniel Genkin, Yuval Yarom, Mike Hamburg
date: disclosed 2018-01-03; published 2018-08 (27th USENIX Security Symposium, Baltimore, pp. 973–990)
accessed: 2026-11-22
kind: paper
---

## Summary
Meltdown exploits out-of-order execution to read arbitrary kernel memory — and on Linux/OS X all of physical memory — from an unprivileged user process, by racing the permission check and leaking via cache timing. It explicitly breaks kernel-sharing sandboxes (Docker, LXC) and Xen paravirtualized guests, but not hardware-virtualized guests on patched hypervisors. The KAISER/KPTI page-table isolation defence was deployed in all major OSes. PDF: https://meltdownattack.com/meltdown.pdf ; FAQ site: https://meltdownattack.com/

## Key points
- Reads kernel memory at 3.2 KB/s to 503 KB/s depending on machine.
- Affected scope (paper §1): "in the case of kernel-sharing sandbox solutions (e.g., Docker, LXC) or Xen in paravirtualization mode, the memory of the kernel (or hypervisor), and other co-located instances".
- meltdownattack.com FAQ: cloud providers affected are those using Intel CPUs with Xen PV without patches, and "cloud providers without real hardware virtualization, relying on containers that share one kernel, such as Docker, LXC, or OpenVZ".
- Countermeasure: KAISER (KPTI on Linux) unmaps the kernel from user page tables; "must be deployed immediately".
- Independent of OS; no software bug required.

## Excerpts
> "Meltdown breaks all security guarantees provided by address space isolation as well as paravirtualized environments and, thus, every security mechanism building upon this foundation." (Abstract)

## Relevance to the talk
Concrete evidence that container isolation inherits all host-kernel and CPU weaknesses, whereas hardware VMs had one fewer shared layer. Pairs with Xen (2003): paravirtualization's shared address space became a liability.
