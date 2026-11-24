---
title: "Wasmtime 1.0: A Look at Performance"
url: https://bytecodealliance.org/articles/wasmtime-10-performance
authors: Chris Fallin (Bytecode Alliance)
date: 2022-09-06
accessed: 2026-11-22
kind: blog
---

## Summary
Explains how Wasmtime cut instantiation of a large module (SpiderMonkey compiled to Wasm) from ~2 ms to ~5 µs — 400× — by mapping the module's initial heap image copy-on-write (via an instance allocator that resets mappings with `madvise`) and initialising tables and function objects lazily. Per-instantiation memory writes fell from tens of MB to a few KB. Also: epoch-based interruption runs about 2× faster than fuel-based interruption.

## Key points
- SpiderMonkey.wasm (multi-MB) instantiation: "about 2 milliseconds" → "5 microseconds", "400 times faster".
- Copy-on-write: instances share one read-only mapping of the initial heap; private pages created only on write. Memory written per instantiation: "tens of megabytes" → hundreds of KB → "just a few kilobytes" after lazy table/func-ref init.
- Epoch interruption makes SpiderMonkey.wasm "roughly twice as fast as when using fuel interruption" — the cost of preemption/CPU limits.
- Hardware for instantiation numbers not specified (a 12-core machine is mentioned for compile-time measurements).

## Excerpts
> "instantiation time of `SpiderMonkey.wasm` went from about 2 milliseconds … to 5 microseconds"

## Relevance to the talk
Primary source for the "µs startup, KB per instance" density claim for server-side Wasm. Caveats for agents: it assumes a precompiled, pre-initialised module (see wizer.md) and pooled, recycled slots; it says nothing about the guest's working set once it runs, nor about the cost of a full interpreter (Python ~1 s cold even with snapshots: cloudflare-python-workers-snapshots-2025.md). Pooling also created the cross-instance data-leak advisories (CVE-2022-39393).
