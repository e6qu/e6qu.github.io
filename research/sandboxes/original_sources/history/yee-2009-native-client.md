---
title: "Native Client: A Sandbox for Portable, Untrusted x86 Native Code"
url: https://research.google/pubs/native-client-a-sandbox-for-portable-untrusted-x86-native-code/
authors: Bennet Yee, David Sehr, Gregory Dardyk, J. Bradley Chen, Robert Muth, Tavis Ormandy, Shiki Okasaka, Neha Narula, Nicholas Fullagar (Google)
date: 2009-05 (IEEE Symposium on Security and Privacy 2009, Oakland/Berkeley CA); retired: Chromium "Goodbye PNaCl, Hello WebAssembly!", 2017-05-30
accessed: 2026-11-22
kind: paper
---

Full text read from Google's PDF
<https://research.google.com/pubs/archive/34913.pdf> (header: "Will appear in
the 2009 IEEE Symposium on Security and Privacy"). Deprecation date and
details from search summaries of the Chromium blog post
<https://blog.chromium.org/2017/05/goodbye-pnacl-hello-webassembly.html>
(post itself only partially visible).

## Summary
Native Client (NaCl) let a browser run untrusted x86 machine code at near
native speed. Its *inner sandbox* is software fault isolation adapted to CISC
x86: a modified toolchain emits code obeying alignment and instruction rules
(no self-modifying code, instructions don't straddle 32-byte boundaries,
indirect jumps masked to aligned targets), x86 segments confine data and
code, and a small static *validator* rejects any binary that breaks the
rules before it runs. A separate *outer sandbox* — explicitly modelled on
systrace and Janus — mediates system calls at the process boundary for
defence in depth.

## Key points
- Validator: <600 C statements, ~6 KB of code (≈1.7 KB decoder, 3.4 KB
  validator logic) — small enough to review thoroughly; compiler is outside
  the TCB.
- Four validator sub-problems: data integrity, reliable disassembly, no
  unsafe instructions, control-flow integrity.
- Uses 80386 segmented memory + McCamant–Morrisett-style CISC SFI.
- Performance: SPEC2000 overhead averaging under 5%; worst cases are
  alignment-sensitive (e.g. gcc, crafty).
- Validator tested by random instruction generation, exhaustive enumeration
  of valid x86 instructions and fuzzing of executables; early tests "exposed
  critical implementation defects". Testing also found a CPU erratum that
  hung machines when prefix bytes were unconstrained. (Google's public NaCl
  security contest of 2009 is widely reported but not described in this
  paper.)
- Successor PNaCl (2013) made it portable; on 2017-05-30 Google announced
  PNaCl deprecation in favour of WebAssembly (support removal planned for
  Q1 2018 outside Chrome Apps/Extensions).

## Excerpts
> "Native Client uses software fault isolation and a secure runtime to direct
> system interaction and side effects through interfaces managed by Native
> Client." (Abstract)

> "We believe that the inner sandbox is robust; regardless, to provide defense
> in depth we have also developed a second "outer sandbox" that mediates
> system calls at the process boundary. The outer sandbox is substantially
> similar to prior structures (systrace and Janus)..." (Sec. 2.1)

## Relevance to the talk
The moment SFI went mainstream and the explicit marriage of two lineages —
code-verification sandboxing (Wahbe 1993) and syscall interposition (Janus
1996, systrace 2003) — layered for defence in depth. WebAssembly, which
replaced it, carries the same idea into every browser and into server-side
plugin/agent sandboxes.
