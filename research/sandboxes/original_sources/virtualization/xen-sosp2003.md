---
title: Xen and the Art of Virtualization
url: https://www.cl.cam.ac.uk/research/srg/netos/papers/2003-xensosp.pdf
authors: Paul Barham, Boris Dragovic, Keir Fraser, Steven Hand, Tim Harris, Alex Ho, Rolf Neugebauer, Ian Pratt, Andrew Warfield (University of Cambridge Computer Laboratory; also Microsoft Research and Intel Research Cambridge)
date: 2003-10 (SOSP '03, Bolton Landing, NY, October 19–22, 2003)
accessed: 2026-11-22
kind: paper
---

## Summary
Xen is an x86 VMM that sidesteps x86's virtualization holes with *paravirtualization*: the guest OS is modified to run in ring 1 and to call the hypervisor (hypercalls) instead of executing privileged instructions. This trades binary compatibility for performance and strong resource isolation between mutually untrusting tenants. Target scale was ~100 VMs per server with overhead of "at most a few percent". Xen became the base of early AWS EC2 and many later research systems (MirageOS, LightVM).

## Key points
- Design target: "hosting up to 100 virtual machine instances simultaneously on a modern server". (Abstract)
- Overhead claim: "a negligible performance overhead — at most a few percent compared with the unvirtualized case". (Abstract)
- Mechanism: x86 has four rings; rings 1 and 2 were unused by mainstream OSes "since OS/2", so the guest kernel is moved to ring 1, applications stay in ring 3, Xen runs in ring 0. Privileged instructions fault and must be replaced by hypercalls. (§2.1)
- Porting cost (Table 2): 2,995 lines changed/added for Linux (1.36% of x86 code base); 4,620 for Windows XP (0.04%).
- Memory virtualization called "undoubtedly the most difficult part" of paravirtualizing; guests manage their own page tables, validated by Xen.
- Isolation goal stated explicitly for "mutually untrusting users"; contrasts with OS-level resource containers suffering "QoS crosstalk".

## Excerpts
> "We avoid the drawbacks of full virtualization by presenting a virtual machine abstraction that is similar but not identical to the underlying hardware — an approach which has been dubbed paravirtualization." (§2)

> "Firstly, virtual machines must be isolated from one another: it is not acceptable for the execution of one to adversely affect the performance of another." (§1)

## Relevance to the talk
The open-source hypervisor that made multi-tenant cloud viable before VT-x matured. Also the reference point for Meltdown (2018), which explicitly broke Xen *PV* guests — paravirtualized isolation shared more with the host than hardware-virtualized guests.
