---
title: Wasmer ("Lightweight sandboxes for your apps and AI agents") and WASIX
url: https://github.com/wasmerio/wasmer
authors: Wasmer, Inc.
date: repo since 2018-10; v7.5.0 released 2026-10-01; WASIX docs at https://wasix.org/docs (undated, © 2026)
accessed: 2026-11-22
kind: repo
---

## Summary
Wasmer is a Wasm runtime (Singlepass/Cranelift/LLVM backends) that in 2026 markets itself directly as "Lightweight sandboxes for your apps and AI agents", with SDKs (JS, Python, Rust, Swift) to create sandboxes and a registry of ready-to-run packages (Python, Bash, …). Its distinguishing bet is WASIX, a Wasmer-only extension of WASI preview 1 that adds the POSIX pieces agents need and standard WASI lacks: fork/vfork, exec/wait, pthreads, sockets, pipes, TTY, setjmp/longjmp.

## Key points
- README: "Secure by default. You control file, network, and environment access."; "Ready to run. Python, JavaScript, Bash, and more"; example `wasmer run python/python -- -c "print('Hello from Wasmer')"`.
- WASIX (wasix.org): "extends WASI with most of the missing POSIX features and is designed to run both in the server and the browser" — threads, "sockets (socket, bind, connect)", "process forking (fork and vfork), subprocess spawning and waiting (exec, wait)", pipes, TTY, setjmp/longjmp via asyncify.
- Standardisation: "The intent is not to fork the WASI standard", but "the only runtime that supports WASIX is Wasmer"; no mention of the component model or WASI 0.2/0.3.
- Wasmer advisories (gh api): CVE-2023-51661 (high) "Filesystem sandbox not enforced"; CVE-2024-38358 (low) "Symlink bypasses filesystem sandbox"; 2026-10/11 batch incl. GHSA-v2h8-j899-r676 (critical) "Singlepass implicit-else miscompilation allows native stack corruption and sandbox escape", GHSA-xmhf-978x-4pcx (high) table type mismatch unchecked, GHSA-274f-8cvf-h4p9 (high) LLVM `call_indirect` off, GHSA-6936-225w-643x (medium) "WASIX preopen rights bypass", plus several guest-controlled unbounded host allocations in WASI/WASIX calls.

## Excerpts
> "Lightweight sandboxes for your apps and AI agents" (README tagline)

> "process forking (fork and vfork), subprocess spawning and waiting (exec, wait)" (wasix.org/docs)

## Relevance to the talk
The direct attempt to close the "agents need fork/exec, threads, sockets" gap inside Wasm — at the cost of a non-standard ABI and a much larger host surface (every added POSIX call is host code; note the WASIX preopen-rights bypass). Same advisory shape as Wasmtime: compiler-backend escapes plus filesystem-sandbox bugs.
