---
title: "Unikernels: Library Operating Systems for the Cloud"
url: https://doi.org/10.1145/2451116.2451167
authors: Anil Madhavapeddy, Richard Mortier, Charalampos Rotsos, David Scott, Balraj Singh, Thomas Gazagnaire, Steven Smith, Steven Hand, Jon Crowcroft (University of Cambridge, University of Nottingham, Citrix Systems, OCamlPro)
date: 2013-03 (ASPLOS '13, Houston, TX, March 16–20, 2013)
accessed: 2026-11-22
kind: paper
---

## Summary
Introduces "unikernels": single-purpose, sealed VM images in which the application, its language runtime and only the OS library components it needs are compiled together into a standalone kernel that runs directly on a hypervisor (Xen). The Mirage prototype is written in OCaml, giving type safety plus a single address space that can be made immutable via a hypervisor extension. The hypervisor becomes the sole isolation boundary; the attack surface and image size shrink by an order of magnitude. Authors' PDF: https://anil.recoil.org/papers/2013-asplos-mirage.pdf

## Key points
- Compile-time specialisation; "sealed against modification when deployed"; configuration becomes code.
- Mirage DNS appliance image "just 200 kB" vs "over 400 MB" for the BIND appliance; Mirage DNS outperforms BIND 9 by 45%. (§1)
- Boot: with a parallel Xen toolstack, "Mirage boots in under 50 milliseconds". (§4.1.1)
- Security story: type-safe protocol libraries, single address space, sealing (W^X enforced via hypervisor), privilege dropping; "unikernels use the hypervisor as the sole unit of isolation".
- Positions against prior libOSes (Exokernel, Nemesis, Drawbridge) — the hypervisor solves their hardware-compatibility problem.

## Excerpts
> "Unikernels are single-purpose appliances that are compile-time specialised into standalone kernels, and sealed against modification when deployed to a cloud platform." (Abstract)

> "Our Mirage prototype compiles OCaml code into unikernels that run on commodity clouds and offer an order of magnitude reduction in code size without significant performance penalty." (Abstract)

## Relevance to the talk
The extreme of "shrink the guest": if the VM contains only the app, VM isolation becomes cheap. Influenced LightVM and Firecracker's thinking (NSDI paper discusses unikernels as an option for fast startup) but unikernels never became mainstream because they require rebuilding software — a poor fit for coding agents that need a general Linux userland.
