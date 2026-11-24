---
title: "fun-with-emulators — Code made at run time"
url: https://github.com/e6qu/fun-with-emulators/blob/main/docs/jit.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit 599ab63)
accessed: 2026-11-22
kind: repo
---

## Summary
(Skimmed.) How fwe's native backend runs code a program generates at run
time — JIT compilers (HotSpot, V8, LuaJIT, Racket, Guile), self-modifying
code, code on the stack, Wine loading Windows code. Because a JIT reads,
patches and copies its own code pages, fwe cannot rewrite instructions there
in place; instead memory the program makes executable is mapped on the host
readable but **never executable**, and when the program jumps into it, the
block is translated into fwe's own code cache and run from there, as Rosetta 2
and DynamoRIO do. In the VM backend generated code runs as-is.

## Key points
- Trigger: memory made `PROT_EXEC` after mapping, mapped W+X, or a shared
  writable file mapping (a memfd a JIT maps twice) is mapped non-executable on
  the host; only code that actually runs is decoded, following control flow,
  "so nothing has to tell code from data".
- Costs table: a block's first run = fault + translation; direct branch first
  run = one exit-gate call, then linked; returns ≈ 7 instructions via a returns
  table; indirect branches ≈ 10 instructions via a "near table"; `ic ivau`
  (instruction-cache flush) = one gate call per cache line.
- Instrumentation: `FWE_TIMING`, `FWE_JIT_SEEN`, `FWE_JIT_COUNT`,
  `FWE_JIT_MAP`; benchmarks run each JIT runtime three times and fail if the
  third makes a block the earlier two already made (translations are kept on
  disk).
- Tested runtimes: Node.js 18 and 24, OpenJDK 25, LuaJIT, Racket, Guile,
  Python `eval`; quines and IOCCC winners; contract tests for self-modifying
  code, signals inside translated code, threads patching code concurrently.
- Numbers (from ROADMAP): a function made and run ≈ 1.4 µs; translated code
  within 1.3× of native in micro benchmarks (1.6× for 4096 functions in turn).

## Excerpts
> "So fwe changes nothing in that memory and never lets the host run it." (§ Why
> translation)

> "Rosetta 2 and DynamoRIO run code generated at run time the same way."
> (§ Why translation)

## Relevance to the talk
Peripheral for a sandboxing talk; useful only as a Q&A detail ("does it run
Node/Java?" — yes, by binary translation of JIT output) and as a link to the
binary-translation lineage (DynamoRIO, Rosetta 2) and to W^X policy on macOS.
