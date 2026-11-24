---
title: "Compatibility is Not Transparency: VMM Detection Myths and Realities"
url: https://www.usenix.org/legacy/event/hotos07/tech/full_papers/garfinkel/garfinkel.pdf
authors: Tal Garfinkel (Stanford), Keith Adams (VMware), Andrew Warfield (UBC/XenSource), Jason Franklin (CMU)
date: 2007-05 (HotOS XI)
accessed: 2026-11-22
kind: paper
---

## Summary
This is the academic rebuttal to "undetectable" VM-based rootkits (Blue Pill, SubVirt) and to honeypots that hope to look like bare metal. The authors (from VMware and XenSource, among others) list the ways virtual hardware differs from real hardware: logical discrepancies, resource discrepancies (for example, the VMM taking TLB and cache entries) and timing. They argue that hardware virtualisation (SVM/VT) does not fix this. They built a **TLB-sizing detector** that changes page table entries without a TLB flush and counts how many stale mappings survive; under a VMM the TLB looks smaller. Their conclusion is that **a transparent VMM is fundamentally infeasible**, and that this hardly matters to defenders because, as virtualisation becomes everywhere, "you are in a VM" stops being suspicious.

## Key points
- "Compatibility" (the guest runs correctly) is not "transparency" (the guest cannot tell). Performance needs make sure they diverge.
- This is the other side of the Blue Pill story and the reason "100% undetectable" is considered disproved in principle.
- The insight lives on: sandboxes for malware analysis, and today for AI evaluation, are detectable. A capable guest can know it is being tested (cf. models' evaluation awareness, Avida's "play dead").

## Excerpts
> "We conclude that building a transparent VMM is fundamentally infeasible, as well as impractical from a performance and engineering standpoint." (Abstract)

> "The belief that VMM transparency is possible is based on a mistaken intuition that compatibility and performance imply transparency" (§1)

> "Optimistic hopes that emerging hardware support will mitigate these issues is misplaced." (§1)

## Relevance to the talk
Use it as the punchline after Blue Pill in the VMs section, and as the general rule for agent evaluation: **you cannot build a sandbox the guest cannot detect**, so design evaluations and sandboxes that stay safe even when the guest knows. Hook: *"VMware and Xen engineers: no, you can't hide a hypervisor."*
