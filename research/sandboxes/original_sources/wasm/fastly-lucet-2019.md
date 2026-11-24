---
title: "Announcing Lucet: Fastly's native WebAssembly compiler and runtime"
url: https://www.fastly.com/blog/announcing-lucet-fastly-native-webassembly-compiler-runtime
authors: Pat Hickey (Fastly)
date: 2019-03-28
accessed: 2026-11-22
kind: blog
---

## Summary
Fastly open-sourced Lucet, an ahead-of-time Wasm compiler and runtime (built on Cranelift) designed to give every edge request its own fresh sandbox. The headline: instantiation in under 50 µs with a few KB of overhead, so tens of thousands of programs can run at once in one process — against ~5 ms and tens of MB for V8. Lucet is now archived: its README says it "has reached end-of-life" and users "should transition to Wasmtime" (the team switched to Wasmtime in mid-2020).

## Key points
- "Lucet can instantiate WebAssembly modules in under 50 microseconds, with just a few kilobytes of memory overhead."
- Fastly's edge "can execute tens of thousands of WebAssembly programs simultaneously, in the same process".
- Comparison: V8 "takes about 5 milliseconds" to instantiate, with "tens of megabytes of memory overhead".
- Follow-up benchmark (Adam Foltzer, "Lucet performance and lifecycle", https://www.fastly.com/blog/lucet-performance-and-lifecycle) reported ~30 µs instantiation, ~5 µs context switch, ~23 µs teardown for hello-world — figures from search snippets, page not opened.
- A "35.4 microseconds" startup figure circulates in trade press (ITPro Today) for Fastly's serverless product; not found in a Fastly primary source.

## Excerpts
> "Lucet can instantiate WebAssembly modules in under 50 microseconds, with just a few kilobytes of memory overhead."

## Relevance to the talk
Origin of the per-request-sandbox density story (one sandbox per HTTP request, many tenants per process) — the same economics Cloudflare claims for isolates, at ~100× lower startup. Note the threat model: Fastly controls the compiler and the (small) host API; agent workloads need a much larger host API.
