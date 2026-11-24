---
title: KeyKOS Architecture
url: https://dl.acm.org/doi/10.1145/858336.858337
authors: Norman Hardy (Key Logic); companion paper by Bomberger, Frantz, Frantz, Hardy, Hardy, Landau, Shapiro
date: 1985-10 (ACM SIGOPS Operating Systems Review 19(4), pp. 8–25; the Key Logic reprint says "September, 1985"); companion "The KeyKOS Nanokernel Architecture", USENIX Workshop on Micro-Kernels and Other Kernel Architectures, April 1992
accessed: 2026-11-22
kind: paper
---

Read from the Key Logic eighth-edition reprint (Dec. 1990)
<https://pdos.csail.mit.edu/6.828/2009/readings/keykos-osr.pdf> and the
nanokernel paper <https://pdos.csail.mit.edu/6.828/2009/readings/keykos.pdf>.
ACM DL original not fetchable (403). Also skimmed Rajunas et al., "Security in
KeyKOS" (IEEE Symp. on Security and Privacy, 1986)
<https://css.csail.mit.edu/6.566/2015/readings/keykos-sec.pdf>.

## Summary
KeyKOS (originally GNOSIS, built at Tymshare) is a pure capability ("key")
operating system for IBM System/370 designed so that mutually suspicious
commercial time-sharing customers could share one machine. All authority is
held in keys; programs run in *domains*; *factories* build new compartments
and can certify that the compartment holds no keys leading outside it —
a practical, commercial solution to Lampson's confinement problem. It also
hosted other OSes (VM/370, MVS subset, UNIX) as guests.

## Key points
- Development began in 1975 at Tymshare; production on an IBM 4341 from
  January 1983; Key Logic spun out in 1985 (nanokernel paper).
- Nanokernel: ~20,000 lines of C, runs in <100 KB, all privileged code
  included; MTBF "in excess of one year"; transparent system-wide checkpoints.
- Explicit goal: "security sufficient to support mutually antagonistic users".
- *Sense keys* give transitively read-only views; *factories* produce
  compartments with "measured discreetness".
- KeyKOS/KeySAFE was examined by NCSC evaluators in 1986 and encouraged to
  submit for B2 (per Shapiro et al. 1999).

## Excerpts
> "A factory is an object that initiates a compartment in which a computation
> may take place. A compartment is a collection of objects that collectively
> hold no unaudited, non-sensory keys that designate objects outside the
> compartment." (Hardy, KeyKOS Architecture, p. 7)

> "If one trusts the (fixed) logic of a factory, one need not trust the logic
> of the programs obeyed by domains within the compartment not to disclose
> one's data." (ibid.)

> "Development on the KeyKOS system began in 1975, and was motivated by three
> key requirements: accounting accuracy that exceeded any then available;
> 24-hour uninterrupted service; and the ability to support simultaneous,
> mutually suspicious time sharing customers with an unprecedented level of
> security." (Nanokernel paper, Sec. 1)

## Relevance to the talk
The commercial proof that capability confinement works: a factory is a
sandbox you can *verify* is sealed before handing it your data — exactly the
property one wants for running an untrusted agent on private code. Lineage
runs KeyKOS → EROS → CapROS/Coyotos and influenced seL4-style designs.
