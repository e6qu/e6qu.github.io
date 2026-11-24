---
title: "seL4: Formal Verification of an OS Kernel"
url: https://dl.acm.org/doi/10.1145/1629575.1629596
authors: Gerwin Klein, Kevin Elphinstone, Gernot Heiser, June Andronick, David Cock, Philip Derrin, Dhammika Elkaduwe, Kai Engelhardt, Rafal Kolanski, Michael Norrish, Thomas Sewell, Harvey Tuch, Simon Winwood (NICTA, UNSW, Open Kernel Labs, ANU)
date: 2009-10 (22nd ACM SOSP, Big Sky, Montana, 11–14 Oct. 2009)
accessed: 2026-11-22
kind: paper
---

Full text read from the SIGOPS copy
<https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf>.

## Summary
seL4 is an L4-family capability microkernel whose C implementation was
proved, in Isabelle/HOL, to refine an abstract specification — the first
machine-checked proof of functional correctness for a complete
general-purpose OS kernel. All kernel objects, including physical memory
("untyped" capabilities), are accessed and managed via capabilities stored in
capability address spaces.

## Key points
- 8,700 lines of C and 600 lines of assembler; IPC performance comparable to
  other high-performance L4 kernels.
- Proof assumes the compiler, assembly, boot code, cache management and
  hardware are correct; "we prove everything else".
- Over 150 invariants proved; the whole proof is ~200,000 lines of Isabelle
  script. Kernel design + implementation cost ~2.2 person-years.
- Capability derivation tree supports revocation.

## Excerpts
> "To our knowledge, this is the first formal proof of functional correctness
> of a complete, general-purpose operating-system kernel." (Abstract)

> "seL4, a third-generation microkernel of L4 provenance, comprises 8,700
> lines of C code and 600 lines of assembler." (Abstract)

## Qualifications from Hacker News
A memory-corruption bug was found in the verified *specification*, so the proof guarantees conformance to the spec and "bug-free" claims should be qualified (HN, 2025: [note](../hackernews/history-os-primitives/hn-43452185-sel4-introduction.md), <https://news.ycombinator.com/item?id=43454498>, <https://news.ycombinator.com/item?id=43456750>).

## Relevance to the talk
The end point of the capability lineage (Dennis & Van Horn 1966 → Hydra →
KeyKOS → EROS → seL4): a sandbox substrate small enough to prove. A useful
contrast with Linux containers, whose kernel attack surface is tens of
millions of lines.
