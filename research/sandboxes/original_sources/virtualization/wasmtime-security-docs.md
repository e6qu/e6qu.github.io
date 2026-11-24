---
title: Security — Wasmtime documentation
url: https://docs.wasmtime.dev/security.html
authors: Bytecode Alliance / Wasmtime maintainers
date: living document (read 2026-11-22)
accessed: 2026-11-22
kind: docs
---

## Summary
Wasmtime's statement of what its sandbox relies on: the core Wasm properties (inaccessible call stack, pointers as bounds-checked offsets into linear memory, typed control flow, imports as the only I/O, no undefined behaviour), plus defence-in-depth measures around them (guard regions, zeroing memory, Rust implementation, planned CFI), WASI capability-based filesystem access, terminal escape filtering, and partial Spectre mitigations.

## Key points
- Core sandbox: return addresses and spilled registers are stored where the module cannot access them ("traditional stack-smashing attacks … impossible"); pointers compile to offsets into linear memory, all accesses bounds-checked; control transfers only to known, type-checked destinations; "There is no raw access to system calls or other forms of I/O".
- Defence in depth: linear memories preceded by a 2 GB guard region (against sign-extension bugs in Cranelift); guard pages on native stacks; memory zeroed after an instance finishes; Rust API guaranteed not to segfault; CFI work in progress.
- Filesystem: WASI APIs follow "a capability-based security model" — only granted files/dirs are reachable.
- Terminal output: Wasmtime filters ANSI escape sequences written to a terminal to prevent escape-sequence attacks.
- Spectre: mitigations for `call_indirect` table bounds and `br_table`; default static memories rely on page faults instead of explicit bounds checks; with "dynamic" memories Cranelift adds Spectre-safe bounds checks; aarch64 `csdb` off by default for performance. "Mitigating Spectre continues to be a subject of ongoing research".

## Excerpts
> "WebAssembly is inherently sandboxed by design (must import all functionality, etc)."

> "There is no raw access to system calls or other forms of I/O; the only thing a WebAssembly instance can do is what is available through interfaces it has been explicitly linked with."

## Relevance to the talk
A crisp checklist of what an in-process sandbox must guarantee, and an honest note that Spectre is only partially addressed. The terminal-escape filtering is directly relevant to coding agents that print untrusted tool output to a user's terminal.
