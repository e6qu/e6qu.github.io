---
title: The V8 Sandbox
url: https://v8.dev/blog/sandbox
authors: Samuel Groß (V8 / Google)
date: 2024-04-04
accessed: 2026-11-22
kind: blog
---

## Summary
Describes the V8 (heap) Sandbox, a software-only in-process sandbox that confines memory corruption in V8's heap so it cannot spread to the rest of the renderer process. Raw pointers and 64-bit sizes in heap objects are replaced by 40-bit offsets from the sandbox base, bounded sizes, and table-indirected handles for external objects. As of Chrome 123 it is included in Chrome's Vulnerability Reward Program ("a sort of 'beta' release"); it had been enabled by default on 64-bit Chrome for about two years.

## Key points
- Motivation: all Chrome in-the-wild exploits 2021–2023 began with renderer memory corruption; 60% were in V8. V8 bugs are mostly subtle logic/JIT bugs, so memory-safe languages or memory tagging don't help ("memory safety cannot be guaranteed by the compiler if a compiler is directly part of the attack surface").
- Disabling JITs costs 1.5–10× or more on compute-heavy workloads; roughly half of exploited V8 bugs were in compilers.
- Design: only the V8 heap lives inside a 1 TB virtual reservation; `sandbox_ptr_t` is a 40-bit offset; `sandbox_size_t` limited to 32 GB; external objects via `external_ptr_t` pointer table (like a Unix fd table).
- No suitable hardware feature exists, so it is purely software — "not unlike the sandboxing model used by WebAssembly".
- Overhead "around 1% or less" on Speedometer and JetStream.
- Testability: attacker model = arbitrary read/write inside the sandbox; a memory-corruption API and `--sandbox-testing`/`--sandbox-fuzzing` mode detect violations — enabling VRP and fuzzing.
- Requires 64-bit; build-time flag `v8_enable_sandbox`; on by default for x64/arm64 Chrome on Android, ChromeOS, Linux, macOS, Windows.

## Excerpts
> "Fundamentally, the issue is that memory safety cannot be guaranteed by the compiler if a compiler is directly part of the attack surface."

> "The current overhead of the sandbox is therefore only around 1% or less on typical workloads (measured using the Speedometer and JetStream benchmark suites)."

## Relevance to the talk
Shows isolates are not a hard boundary by themselves: even Google is adding a sandbox *inside* the JS engine, layered under the OS-process sandbox and Site Isolation. Useful for "defence in depth is the norm, every layer leaks".
