---
title: Intel Virtualization Technology
url: https://doi.org/10.1109/MC.2005.163
authors: Rich Uhlig, Gil Neiger, Dion Rodgers, Amy L. Santoni, Fernando C. M. Martins, Andrew V. Anderson, Steven M. Bennett, Alain Kägi, Felix H. Leung, Larry Smith (Intel Corporation)
date: 2005-05 (IEEE Computer, vol. 38, no. 5, pp. 48–56)
accessed: 2026-11-22
kind: paper
---

## Summary
Intel's cover-feature description of VT-x (IA-32) and VT-i (Itanium). It catalogues why IA-32 resisted virtualization (ring aliasing, ring compression, non-faulting access to privileged state, hidden state, interrupt virtualization) and introduces the VT-x fix: two new CPU modes, VMX root and VMX non-root, with "VM entry"/"VM exit" transitions controlled by a Virtual-Machine Control Structure (VMCS). AMD shipped the analogous SVM ("AMD-V", originally "Pacifica"), which Adams & Agesen (2006) and KVM (2007) treat as "incompatible but essentially similar". Full text read from a course mirror: https://course.ece.cmu.edu/~ece845/docs/uhlig-vt-overview.pdf

## Key points
- Lists virtualization usage models: workload isolation, consolidation, migration; security via confining intrusions to a VM. (Figure 1)
- Named obstacles for software VMMs on IA-32: ring aliasing, ring compression (in 64-bit mode segment limits don't apply, so a deprivileged guest kernel at ring 3 is not protected from its apps), address-space compression, non-faulting access to privileged state, hidden state. 
- VT-x: "VMX root operation" for the VMM, "VMX non-root operation" for guests; transitions "VM entry" and "VM exit"; VMCS holds guest/host state and exit controls.
- Goal: let VMMs run unmodified guest OSes without binary translation or paravirtualization, simplifying VMM software.

## Excerpts
> "Intel Virtualization Technology provides hardware support for processor virtualization, enabling simplifications of virtual machine monitor software." (Abstract)

> "VT-x augments IA-32 with two new forms of CPU operation: VMX root operation and VMX non-root operation." (VT-x architecture overview)

## Relevance to the talk
The moment the isolation boundary became a CPU feature. Every microVM in this folder (Firecracker, Cloud Hypervisor, crosvm, Kata, libkrun) and gVisor's KVM platform depend on VT-x/AMD-V via KVM. Pair with Adams & Agesen for the irony that v1 was slower than software.
