---
title: "EROS: a fast capability system"
url: https://dl.acm.org/doi/10.1145/319151.319163
authors: Jonathan S. Shapiro, Jonathan M. Smith, David J. Farber (University of Pennsylvania)
date: 1999-12 (17th ACM SOSP, Kiawah Island SC; Operating Systems Review 34(5), pp. 170–185)
accessed: 2026-11-22
kind: paper
---

Full text read from <https://www.cs.yale.edu/flint/cs428/doc/eros.pdf>.

## Summary
EROS is a clean-room C++ reimplementation of the GNOSIS/KeyKOS capability
architecture for x86, with a transparently persistent single-level store.
The paper's point is performance: capability IPC and persistence were
believed to be slow, but EROS's basic operations were comparable to the
equivalent Linux operations on microbenchmarks. Its *constructor* enforces a
confinement policy similar to Lampson's, letting reference monitors live at
user level.

## Key points
- History given in the paper: GNOSIS first deployed in 1982 at Tymshare
  (later KeyKOS/370, in 370 assembler + PL/1, running VISA transaction
  processing); late-1980s C port to the Motorola 88000; development ceased in
  1991 when Key Logic closed; EROS began shortly after.
  (Note: the KeyKOS nanokernel paper gives January 1983 for production use.)
- Primitive objects: pages, nodes, processes; everything accessed by
  invoking capabilities.
- Constructor (successor of the KeyKOS factory) implements confinement.
- NCSC evaluators examined KeyKOS/KeySAFE in 1986 and encouraged a B2
  submission.

## Excerpts
> "EROS is a capability-based operating system for commodity processors which
> uses a single level storage model." (Abstract)

> "The resulting performance suggests that composing protected subsystems may
> be less costly than commonly believed." (Abstract)

> "The EROS constructor (Section 5.3) enforces a discretionary policy similar to
> Lampson's confinement policy." (Sec. 2)

## Relevance to the talk
Bridges the mainframe capability lineage to commodity x86 and shows the
"capabilities are too slow" objection was answerable — the same objection
later raised against per-call sandbox mediation.
