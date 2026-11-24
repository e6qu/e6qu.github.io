---
title: WasmEdge (WasmEdge/WasmEdge README)
url: https://github.com/WasmEdge/WasmEdge
authors: WasmEdge maintainers (CNCF sandbox project; originally Second State)
date: repo since 2019-11; read 2026-11-22
accessed: 2026-11-22
kind: repo
---

## Summary
WasmEdge is a C++ Wasm runtime (CNCF sandbox) aimed at cloud-native, edge and embedded use, now marketed chiefly as a way to run LLMs locally through LlamaEdge (wasi-nn). It adds non-standard extensions (network sockets, database drivers, AI inference) and was the runtime behind Docker's first Wasm preview. Its README defines the sandbox as protection of OS resources and memory space for plug-in code.

## Key points
- "provides a well-defined execution sandbox for its contained WebAssembly bytecode program. The runtime offers isolation and protection for operating system resources (e.g., file system, sockets, environment variables, processes) and memory space."
- Main stated use case: "safely execute user-defined or community-contributed code as plug-ins in a software product".
- Extensions beyond WASI: WasmEdge network sockets, Postgres/MySQL drivers, AI extension (wasi-nn; LlamaEdge for LLM/whisper/SD).
- Embedding caveat: "Currently, WasmEdge is not yet thread-safe."
- Security advisories on GitHub (gh api): one — CVE-2025-69261 (medium, 2025-12-30) "integer wrap in MemoryInstance::getSpan()'s memory size check" (a bounds-check bug in the memory sandbox itself).
- Used by the Docker+Wasm technical preview (docker-wasm-workloads.md).

## Excerpts
> "The most important use case for WasmEdge is to safely execute user-defined or community-contributed code as plug-ins in a software product"

## Relevance to the talk
Shows the server-side runtime market's pivot from "Wasm replaces containers" to "Wasm runs AI" (local inference rather than agent sandboxing). Its custom socket/DB extensions illustrate how runtimes widen the host interface beyond WASI to be useful — exactly where the attack surface grows.
