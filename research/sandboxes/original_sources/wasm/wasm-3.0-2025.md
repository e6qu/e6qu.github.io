---
title: Wasm 3.0 Completed
url: https://webassembly.org/news/2025-09-17-wasm-3.0/
authors: Andreas Rossberg (WebAssembly CG)
date: 2025-09-17
accessed: 2026-11-22
kind: blog
---

## Summary
Announces completion of the WebAssembly 3.0 spec: memory64, multiple memories, GC, typed references, tail calls, exception handling, relaxed SIMD, a deterministic profile, and more. These make Wasm a better target for managed languages (Java, Kotlin, Dart, OCaml) — but each adds compiler and runtime complexity inside the trusted computing base of every Wasm sandbox.

## Key points
- memory64 "expands the available address space of Wasm applications from 4 gigabytes to (theoretically) 16 exabytes"; on the web a 64-bit memory is limited to 16 GB.
- Also: multiple memories (could separate private data), GC, typed references incl. `call_ref`, tail calls, native exceptions, relaxed SIMD, deterministic execution profile, JS string builtins.
- Security context (from wasmtime-security-advisories.md, not from this post): 32-bit memories let runtimes elide bounds checks with large guard regions; 64-bit memories need explicit checks, and Wasmtime's April 2026 critical aarch64 escape affected only 64-bit memories (with Spectre mitigations off). Several 2026 Wasmtime advisories involve GC, exceptions and `call_ref` (e.g. GC heap corruption, fuel accounting).

## Excerpts
> "expands the available address space of Wasm applications from 4 gigabytes to (theoretically) 16 exabytes"

## Relevance to the talk
The "Wasm is small and simple, therefore verifiable" intuition from 2017 (virtualization/webassembly-pldi2017.md) is weaker in 2026: the spec has grown, and the 4 GB guard-page trick that made bounds checks free does not carry over to memory64.
