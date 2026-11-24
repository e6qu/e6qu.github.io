---
title: "Firecracker: Lightweight Virtualization for Serverless Applications"
url: https://news.ycombinator.com/item?id=22358252
story_url: https://www.amazon.science/publications/firecracker-lightweight-virtualization-for-serverless-applications
authors: HN discussion (submitted by andrioni) of Agache et al., NSDI 2020
date: 2020-02-18
accessed: 2026-11-22
kind: discussion
points: 141
comments: 16
---

## Summary
A small thread on the NSDI 2020 paper that is worth reading for who took part. Paolo Bonzini, the KVM/QEMU maintainer, disputes the paper's QEMU comparison figures (lines of code, syscall count). Marc Brooker (mjb), a co-author, answers and links the methodology data. Steve Klabnik adds the crosvm → Firecracker → rust-vmm lineage.

## Key points
- Bonzini says the paper's "1.4 million lines" is the total for every architecture QEMU supports. He gives about 600–700k lines for a default single-target build and under 300k for a trimmed configuration.
- He says the "270 syscalls" figure probably describes QEMU's user-mode emulation, not QEMU running as a VMM.
- QEMU 4.2's `microvm` machine type was "admittedly inspired by Firecracker" and "boots even faster than Firecracker, or at least in the noise". It has about 500 lines of machine-specific code.
- Intel's NEMU fork was abandoned because its goals could be reached inside QEMU itself.
- mjb: "Comparing software qualitatively is hard". The methodology data is at github.com/firecracker-microvm/nsdi2020-data.
- Firecracker began as a fork of crosvm. The shared code was later moved into rust-vmm crates.

## Excerpts
> "The comparison with QEMU is a bit disingenuous. The number of lines of code in a given binary is much less than 1.4 million, which is the total for all the architectures that QEMU supports" — bonzini, https://news.ycombinator.com/item?id=22361001

> "Version 4.2 of QEMU (the version they used) has a trimmed virtual machine type that was admittedly inspired by Firecracker and actually boots even faster than Firecracker, or at least in the noise." — bonzini, https://news.ycombinator.com/item?id=22361001

> "Our goal was a fair comparison, but any comparison by one set of criteria is going to paint an incomplete picture, especially of something like QEMU that does a lot and has a lot of buttons and knobs." — mjb (paper co-author), https://news.ycombinator.com/item?id=22361743

> "Firecracker started as a fork of crosvm, removed a bunch of code they didn't need, and of course adding their own." — steveklabnik, https://news.ycombinator.com/item?id=22360232

## Relevance to the talk
A caution against reading the NSDI "96% fewer lines than QEMU" figure as a measure of attack surface without context. The KVM maintainer's rebuttal is a useful footnote to `../../virtualization/firecracker-nsdi2020.md` and `../../virtualization/qemu-microvm.md`.
