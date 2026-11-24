---
title: WASI 0.2 Launched
url: https://bytecodealliance.org/articles/WASI-0.2
authors: Dan Gohman (Bytecode Alliance)
date: 2024-01-25
accessed: 2026-11-22
kind: blog
---

## Summary
Announces WASI 0.2 (Preview 2): WASI rebuilt on the Component Model and WIT IDL, organised as "worlds" — `wasi-cli` (roughly POSIX command line) and `wasi-http` (an HTTP proxy world). The capability story moves from "preopened directories" to typed imports: a component's world lists every interface it imports, and the host decides what (if anything) to satisfy each import with, including another component that virtualises it.

## Key points
- Two worlds at launch: `wasi-cli` ("roughly corresponds to POSIX") and `wasi-http` ("organized around requests and responses").
- Component Model makes WASI "cross-language and virtualizable": an import can be satisfied by the host or by another component (e.g. a virtual filesystem).
- "All I/O in Wasm goes through its imports and exports" — the sandbox property in one line.
- Phase-3 interface packages that make up 0.2/0.3 (WASI repo docs/Proposals.md, read 2026-11-22): clocks, random, filesystem, sockets, cli, http. Everything else (threads, TLS, crypto, key-value, wasi-nn, messaging…) is phase 1–2.
- What a component *cannot* do under standard WASI 0.2/0.3: there is no interface for process creation (fork/exec/spawn), signals, ptrace, mounting, raw syscalls, or shared-memory threads (`wasi-threads` is phase 1). (Inference from the phase list; no phase-3 proposal covers these.)
- Capability wording in the interface repos: wasi-filesystem is "capability-oriented" — functions take a directory handle and paths are "sandboxed" relative to it (ideas from CloudABI and Capsicum); wasi-sockets: "Wasm modules can not open sockets by themselves without a network capability handle" and implementations "should deny all network access by default".

## Excerpts
> "wasi-cli, the "command-line interface" world, which roughly corresponds to POSIX"

> "All I/O in Wasm goes through its imports and exports"

> "Unlike BSD sockets, WASI sockets require capability handles to create sockets and perform domain name lookups." (wasi-sockets README)

## Relevance to the talk
This is the capability model Wasm's sandbox case rests on: authority = the imports you were linked with (cf. history notes on capability systems and os-primitives/ Capsicum). For agent tools it is attractive (Wassette, wasmCloud, Spin); for coding agents it is the problem — a coding agent's job is mostly fork/exec of compilers, package managers and test runners, which standard WASI does not model at all.
