---
title: Bringing the Web up to Speed with WebAssembly
url: https://doi.org/10.1145/3062341.3062363
authors: Andreas Haas, Andreas Rossberg, Derek L. Schuff, Ben L. Titzer (Google); Michael Holman (Microsoft); Dan Gohman, Luke Wagner, Alon Zakai (Mozilla); JF Bastien (Apple)
date: 2017-06 (PLDI '17, Barcelona, June 19–24, 2017)
accessed: 2026-11-22
kind: paper
---

## Summary
The design paper for WebAssembly, co-authored by all four major browser vendors. Wasm is a portable, compact, validated low-level bytecode with a formal semantics, designed so untrusted code can run safely and fast *in the same address space* as other code. Its sandbox comes from structure, not from the OS: linear memory is disjoint from code, stack and engine data; control flow targets are typed and checked; all I/O comes through imports. Author-hosted PDF: https://people.mpi-sws.org/~rossberg/papers/Haas,%20Rossberg,%20Schuff,%20Titzer,%20Gohman,%20Wagner,%20Zakai,%20Bastien,%20Holman%20-%20Bringing%20the%20Web%20up%20to%20Speed%20with%20WebAssembly.pdf

## Key points
- Goals: safe, fast, portable, deterministic semantics; compact, easy-to-validate, streamable representation. Successor to ActiveX, NaCl/PNaCl and asm.js attempts. (§1)
- Security: "Linear memory is disjoint from code space, the execution stack, and the engine's data structures"; at worst a buggy module "can make a mess of the data in its own memory". (§2.2)
- In-process isolation was "a necessary design constraint" for high-performance interaction with JavaScript and Web APIs. (§2.2)
- Bounds checks: on 64-bit, engines reserve 8 GiB of virtual address space with guard pages so 32-bit index + offset can never escape — hardware faults replace explicit checks. (§7.1)
- Performance (PolyBenchC on V8 and SpiderMonkey): 7 benchmarks within 10% of native, nearly all within 2× of native; fixed VM startup 18 ms (V8) / 30 ms (SpiderMonkey). (§7)
- Validation speed 75 MiB/s+ single-threaded on a workstation. (§7)
- Code size: ~85.3% of native x86-64 on average (median 78%). (§7)
- Formal semantics and soundness (type safety → memory safety, inaccessibility of engine state). (§4–5)

## Excerpts
> "This means that even untrusted modules can be safely executed in the same address space as other code." (§2.2)

> "Overall, the results show that WebAssembly is very competitive with native code, with 7 benchmarks within 10 % of native and nearly all of them within 2× of native." (§7)

## Relevance to the talk
The modern software-fault-isolation sandbox: no syscalls at all unless imported, sub-millisecond instantiation, megabyte footprints. Basis for Wasmtime/WASI, Cloudflare Workers' Wasm support, and Firefox's RLBox. Caveat (post-2018): language/SFI sandboxes protect integrity but not confidentiality against Spectre within one process.
