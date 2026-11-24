---
title: The Origin of the VM/370 Time-sharing System
url: https://doi.org/10.1147/rd.255.0483
authors: R. J. Creasy (IBM)
date: 1981-09 (IBM Journal of Research and Development 25(5), Sept. 1981, pp. 483–490)
accessed: 2026-11-22
kind: paper
---

Full text read from a scan hosted at
<https://pages.cs.wisc.edu/~stjones/proj/vm_reading/ibmrd2505M.pdf>
(publisher page via the DOI above).

## Summary
A first-hand history by the leader of the IBM Cambridge Scientific Center
group that built CP-40 and CP/CMS. CP (the Control Program) "uses a computing
machine to simulate multiple copies of the machine itself"; each copy runs its
own operating system, typically the single-user CMS. Creasy traces the design
to MIT's CTSS, explains the split of resource management (CP) from user
support (CMS), and argues that a virtual machine gives each user a private,
secure environment that other users cannot compromise.

## Key points
- CP/CMS conceived in 1964 as a second-generation time-sharing system for
  the newly announced System/360; originally called a "pseudo-machine
  time-sharing system".
- 1966: CP-40 and CMS operational on a System/360 Model 40 modified with an
  associative memory for dynamic address translation (one-of-a-kind hardware
  at Cambridge).
- CP-67 built for the System/360 Model 67's address translation; CP and CMS in
  continuous production use since 1967.
- VM/370 became available in 1972 for System/370, all of whose members
  included virtual-memory hardware; "over 2500 systems" in operation by 1981.
- Lineage: CTSS (operational 1961) ran unmodified background batch programs
  and would "steal and restore the machine without their knowledge" — a
  technique "extended to its fullest in CP/CMS".
- Design principle: keep CP minimal; "unessential function can be moved into
  a virtual machine". Efficiency was "specifically excluded as a software
  design goal".

## Excerpts
> "CP is an operating system that uses a computing machine to simulate
> multiple copies of the machine itself. These copies, or virtual machines,
> are each controlled like the real machine by their own operating systems."
> (Introduction)

> "A virtual machine cannot be compromised by the operation of any other
> virtual machine. It provides a private, secure, and reliable computing
> environment for its users, distinct and isolated like today's personal
> computer." (The control program)

> "In 1966, CP-40 and CMS both became operational using an IBM System/360
> Model 40 modified by the addition of an associative memory device for
> dynamic address translation." (Design influences and goals)

## Relevance to the talk
Opening chapter: the very first "sandbox" was a whole simulated machine, and
its designers already pitched isolation ("experiments by one user present no
problems to a payroll job on another virtual machine") as a core benefit.
The minimal-control-program idea is the ancestor of today's microVM
monitors (Firecracker's "minimal device model").
