---
title: A Comparison of Software and Hardware Techniques for x86 Virtualization
url: https://dl.acm.org/doi/10.1145/1168857.1168860
authors: Keith Adams, Ole Agesen (VMware)
date: 2006-10 (ASPLOS XII, San Jose, CA, October 21–25, 2006)
accessed: 2026-11-22
kind: paper
---

## Summary
VMware engineers compare their mature software VMM (dynamic binary translation of guest kernel code, as in VMware Workstation) against a new VMM built on the first-generation Intel VT-x / AMD SVM hardware extensions. The surprise result: first-generation hardware assist rarely beat software, because VM exits were expensive and the hardware offered no MMU virtualization (no nested paging yet), so shadow page tables still caused many guest/VMM round trips. The paper is also a clear explanation of why x86 was not "classically virtualizable" under Popek–Goldberg. Full text read from a course mirror: https://pdos.csail.mit.edu/6.1810/2019/readings/adams06vmware.pdf

## Key points
- x86 protected mode is not classically (trap-and-emulate) virtualizable: privileged state is visible (CPL in the low bits of `%cs`) and some privileged instructions do not trap at user level (e.g. `popf` silently ignores changes to IF). (§3.1)
- Software answer: binary translation — on-demand, adaptive translation of guest kernel code so that most instructions run "IDENT" (unchanged) and only sensitive ones are rewritten. (§3)
- Hardware answer: a VMCB/VMCS in-memory structure, a new "guest mode", `vmrun` to enter and an "exit" back to the VMM. (§4.1)
- Example cost (Pentium 4): `rdtsc` costs 2030 cycles via trap-and-emulate, 1254 via callout-and-emulate, 216 via in-translation-cache emulation. (§3)
- Nanobenchmarks on a 3.8 GHz Pentium 4 672 (VMware Player 1.0.1): page-table-entry write — hardware VMM 12,733 cycles vs software VMM 391 cycles (~30× worse); divzero — hardware 1014 vs software 3223 vs native 889 cycles. (§6.3)
- Compute-intensive benchmarks ran "essentially at native speed" on both VMMs; overheads come from privileged operations (context switches, mapping, I/O, interrupts, syscalls). (§6)
- Two reasons hardware lost: no MMU virtualization support, and it "fails to co-exist" with existing software MMU techniques. Authors look ahead to nested paging. (Abstract, §7)

## Excerpts
> "Surprisingly, the hardware VMM often suffers lower performance than the pure software VMM." (Abstract)

> "In this sense, x86 is not classically virtualizable, but it is virtualizable by Popek and Goldberg's criteria, using the techniques described in Section 3." (§2)

## Relevance to the talk
The bridge between the Popek–Goldberg era and modern hypervisors: x86 virtualization was first made possible by clever software (BT, 1999–2006), and hardware assist (2005–06) only became a clear win once nested paging (EPT/NPT) arrived. Good slide for "the isolation boundary moved into silicon, but slowly".
