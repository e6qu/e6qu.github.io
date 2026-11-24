---
title: "Standardizing WASI: A system interface to run WebAssembly outside the web"
url: https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/
authors: Lin Clark (Mozilla)
date: 2019-03-27
accessed: 2026-11-22
kind: blog
---

## Summary
Announces the start of standardisation of WASI, the WebAssembly System Interface, so Wasm can run outside browsers portably *and* securely. Since Wasm code "can't talk directly to the OS", the host decides which functions to provide. WASI adopts capability-based security (drawing on CloudABI and Capsicum): file access goes through descriptors that carry permissions, and a module starts with none unless the host grants them (the "preopen" idea; the post illustrates it via libpreopen). Current WASI spec work: https://github.com/WebAssembly/WASI

## Key points
- "Today, we announce the start of a new standardization effort — WASI, the WebAssembly system interface."
- Sandboxing: Wasm code has no direct OS access; all system functions are supplied by the host.
- Capability model: "you have to pass in a file descriptor, which has permissions attached to it"; modules get no descriptors by default.
- Inspirations named: CloudABI and Capsicum (capability-based OS work).
- Portability goal: one binary runs across OSes, unlike POSIX-ish emulation.

## Excerpts
> "It brings in more concepts from capability-based security."

## Relevance to the talk
Links the Wasm sandbox to the capability lineage covered in `history/` and `os-primitives/` (Capsicum). WASI preopened directories are the Wasm analogue of a bind-mounted workspace for an agent.
