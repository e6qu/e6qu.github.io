---
title: Efficient Software-Based Fault Isolation
url: https://dl.acm.org/doi/10.1145/168619.168635
authors: Robert Wahbe, Steven Lucco, Thomas E. Anderson, Susan L. Graham (UC Berkeley)
date: 1993-12 (14th ACM Symposium on Operating Systems Principles, SOSP '93, Asheville NC, Dec. 1993; Operating Systems Review 27(5), pp. 203–216)
accessed: 2026-11-22
kind: paper
---

Full text read from the scan at
<https://crypto.stanford.edu/cs155old/cs155-spring09/papers/sfi.pdf> (two-column
OCR is partly scrambled; quotes below were checked against the readable
column). Venue/location from the paper's ACM footer ("SIGOPS '93/12") and
standard citations.

## Summary
Instead of putting an untrusted extension in a separate address space (and
paying for a context switch on every call), SFI loads it into a *fault
domain* — a separate segment of the *same* address space — and rewrites its
object code so it cannot store to or jump to addresses outside that segment.
The core rewrite, which the authors call **sandboxing**, forces the upper
bits of every unsafe address to the segment identifier using dedicated
registers; a simple verifier checks the rewritten binary. Cross-domain calls
become an order of magnitude cheaper than RPC, at the cost of a few percent
extra execution time inside the module.

## Key points
- Motivation: extensible systems (POSTGRES user-defined types, BSD packet
  filter, micro-kernel servers, OLE) where faults in extension code can
  corrupt the host.
- Two techniques: *segment matching* (check and trap — better for debugging)
  and *address sandboxing* (mask the address — cheaper, no check).
- Address sandboxing uses five dedicated registers; jumping into the middle
  of a sandbox sequence is harmless because the dedicated register always
  holds a safe address.
- Safe cross-fault-domain RPC ≈1.1 µs on a DECstation 5000/240 and ≈0.8 µs on
  a DEC Alpha 400 — "more than an order of magnitude faster than any existing
  RPC system".
- SPEC92 C benchmarks: average 4% execution-time overhead.
- Janus (1996) credits this paper with introducing the term "sandboxing".

## Excerpts
> "In this paper, we present a software approach to implementing fault
> isolation within a single address space." (Abstract)

> "...we modify the object code of a distrusted module to prevent it from
> writing or jumping to an address outside its fault domain." (Abstract)

> "On a test suite including the C SPEC92 benchmarks, sandboxing incurs an
> average of 4% execution time overhead on both the DECstation and the Alpha."
> (Sec. 1)

## Relevance to the talk
Origin of the word "sandbox" in systems security and of in-process isolation
by code rewriting/verification. Direct line to Native Client (2009),
WebAssembly's linear-memory bounds, and Wasm-based plugin and agent-tool
sandboxes; same trade-off (cheap boundary crossings vs small steady-state
overhead) drives today's choice between Wasm/V8 isolates and microVMs.
