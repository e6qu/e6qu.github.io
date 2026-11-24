---
title: "Wizer: The WebAssembly Pre-Initializer" (bytecodealliance/wizer README)
url: https://github.com/bytecodealliance/wizer
authors: Bytecode Alliance (Nick Fitzgerald et al.)
date: repo since 2020-11; README notes development moved into Wasmtime (`crates/wizer`, `wasmtime wizer` subcommand); last push 2026-03-10
accessed: 2026-11-22
kind: repo
---

## Summary
Wizer instantiates a Wasm module, runs its initialisation function, and writes the resulting state (memory, globals) back out as a new module, so start-up work happens once at build time. It is the Wasm analogue of microVM snapshot/restore and the trick behind fast-starting JS-in-Wasm (e.g. SpiderMonkey-based runtimes). It has now been folded into Wasmtime.

## Key points
- "instantiates your WebAssembly module, executes its initialization function, and then snapshots the initialized state out into a new WebAssembly module".
- README benchmarks: regex 248.85 µs → 183.99 µs (1.35×); UAP parser 98.297 ms → 16.385 ms (6.00×).
- Upstreamed: "Development of Wizer has moved upstream into the Wasmtime repository"; "The `wasmtime wizer` subcommand replaces the `wizer` CLI".
- Same idea at platform scale: Cloudflare snapshots Pyodide linear memory at deploy time (cloudflare-python-workers-snapshots-2025.md).

## Excerpts
> "Wizer instantiates your WebAssembly module, executes its initialization function, and then snapshots the initialized state out into a new WebAssembly module."

## Relevance to the talk
Snapshotting is how every class gets fast starts (Firecracker snapshots, Hyperlight snapshot/restore, Wizer). For Wasm it is unusually cheap because the whole guest state is one linear memory plus tables — the flip side of Wasm having no OS inside. Same caveat as VM snapshots: shared secrets/RNG state baked into the image.
