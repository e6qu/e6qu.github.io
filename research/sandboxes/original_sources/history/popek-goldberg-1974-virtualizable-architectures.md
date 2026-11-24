---
title: Formal Requirements for Virtualizable Third Generation Architectures
url: https://dl.acm.org/doi/10.1145/361011.361073
authors: Gerald J. Popek (UCLA), Robert P. Goldberg (Honeywell Information Systems and Harvard University)
date: 1974-07 (Communications of the ACM 17(7), July 1974, pp. 412–421; revised from a paper at the 4th ACM SOSP, Yorktown Heights, 15–17 Oct. 1973)
accessed: 2026-11-22
kind: paper
---

Full text read from the copy at
<https://course.ece.cmu.edu/~ece845/docs/p412-popek.pdf> (the ACM DL page
returns 403 to automated fetches).

## Summary
Popek and Goldberg give the first formal definition of a virtual machine
monitor and a simple, testable condition for whether a CPU architecture can
host one. A VMM must provide *equivalence* (an essentially identical
environment), *efficiency* (most instructions run directly on hardware) and
*resource control* (the guest cannot touch resources not allocated to it).
Theorem 1: a VMM can be built if every *sensitive* instruction is also
*privileged* (traps in user mode). They note that CP-67 on the IBM 360/67
satisfies this while the DEC PDP-10 does not.

## Key points
- "A virtual machine is taken to be an efficient, isolated duplicate of the
  real machine."
- Three VMM properties: equivalence, efficiency, resource control.
- Efficiency explicitly excludes emulators and complete software
  interpreters from the definition of a VM.
- Sensitive instructions = control-sensitive (change resource configuration
  or mode) or behaviour-sensitive (results depend on location or mode).
  Non-sensitive instructions are "innocuous".
- Theorem 1 (sufficient condition): sensitive ⊆ privileged. The paper also
  covers recursive virtualizability and hybrid VMs.
- Isolation is defined into the model: the identical-effect requirement must
  hold "regardless of any other activity on the real computer".
- x86 famously failed this test until Intel VT-x / AMD-V (2005–2006), per
  secondary sources (e.g. Wikipedia's "Popek and Goldberg virtualization
  requirements"); not stated in this 1974 paper.

## Excerpts
> "A virtual machine is taken to be an efficient, isolated duplicate of the
> real machine." (Sec. 1)

> "The VMM is said to have complete control of these resources if (1) it is
> not possible for a program running under it in the created environment to
> access any resource not explicitly allocated to it, and (2) it is possible
> under certain circumstances for the VMM to regain control of resources
> already allocated." (Sec. 1)

> "THEOREM 1. For any conventional third generation computer, a virtual
> machine monitor may be constructed if the set of sensitive instructions for
> that computer is a subset of the set of privileged instructions." (Sec. 5)

## Relevance to the talk
The formal bedrock of VM-based isolation: "resource control" is exactly the
sandbox property. Theorem 1 explains why x86 virtualization needed binary
translation (VMware 1999) and paravirtualization (Xen 2003) before hardware
assists, and why microVMs today can be both fast and strongly isolated.
