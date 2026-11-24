---
title: A Hardware Architecture for Implementing Protection Rings
url: https://www.multicians.org/protection.html
authors: Michael D. Schroeder, Jerome H. Saltzer (MIT Project MAC)
date: 1972-03 (Communications of the ACM 15(3), March 1972, pp. 157–170)
accessed: 2026-11-22
kind: paper
---

Full text read from the multicians.org HTML edition (ACM DOI
10.1145/361268.361275). Supplementary facts from the Multics glossary at
<https://www.multicians.org/mgr.html> (entries "ring", "ring 0",
"ring brackets").

## Summary
Describes the processor mechanisms designed for the second-generation Multics
hardware (Honeywell 6180, replacing the GE/Honeywell 645) that implement
*protection rings* almost entirely in hardware. Each process has a fixed set
of nested domains, ring 0 (most privileged) to ring r−1; every segment
descriptor carries read/write/execute *brackets* and a list of *gates*.
Calls downward into a more privileged ring must enter through a gate, and the
hardware validates every cross-ring reference so that a call into the
supervisor looks just like an ordinary procedure call.

## Key points
- Rings generalize the two-state supervisor/user mode; the authors admit the
  "restricted implementation of domains" view came with hindsight.
- Nested-subset property: ring m's capabilities ⊆ ring n's whenever m > n.
  This total ordering is what makes a cheap hardware implementation possible.
- Multics chose eight rings. On the 645, rings were done in software by
  trapping (64 software rings per the glossary); the 6180 put 8 rings in
  hardware.
- Downward calls go only through gate locations at the start of a segment
  (SDW.GATE); upward ring switches are unrestricted.
- Classic confused-deputy defences in hardware: the callee validates argument
  references "as though execution were occurring" in the caller's ring; the
  processor records the caller's ring so the return cannot be forged.
- Glossary: "this concept was invented on Multics" and is now "a standard
  part of the Intel architecture"; the supervisor ran in ring 0, users
  typically ring 4, restricted subsystems in rings 5–7.

## Excerpts
> "In a system which uses segmentation as a memory addressing scheme,
> protection can be achieved in part by associating concentric rings of
> decreasing access privilege with a computation." (Abstract)

> "When developed, rings were viewed as a natural generalization of the
> supervisor/user modes that provided protection in many computers."
> (Protection Rings)

> "Thus, the called procedure, even though it is executing in a ring with more
> access capabilities than the ring of the calling procedure, can prevent
> itself from reading or writing any argument that the calling procedure could
> not also read or write." (Downward calls)

## Relevance to the talk
Origin of "ring 0" and of the hardware user/kernel boundary every sandbox
ultimately rests on. Gates are the ancestor of the syscall interface that
seccomp, gVisor and syscall-interposition tools try to narrow. The argument
validation problem is the confused-deputy/TOCTTOU theme that recurs in
Janus/systrace.
