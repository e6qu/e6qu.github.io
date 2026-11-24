---
title: "WASM will replace containers"
url: https://news.ycombinator.com/item?id=43020684
story_url: https://creston.blog/wasm-will-replace-containers/
authors: HN discussion (submitted by hpincket) of Creston's blog post
date: 2025-02-12
accessed: 2026-11-22
kind: discussion
points: 325
comments: 356
---

## Summary
A provocative post produced the busiest Wasm thread (356 comments). The top reply: once you add file access and networking you inherit their security holes, as Java did. Ben Titzer, a V8/Wasm co-designer now at CMU, explains "thin kernel interfaces" (WALI): Wasm keeps the memory sandbox, while system sandboxing moves to policies layered on a near-raw syscall interface. kentonv describes Workers' service bindings as capabilities. Wasmer's founder plugs WASIX (filesystem, sockets, processes, threads).

## Key points
- titzer: "Sandboxing means two things: memory sandboxing and system sandboxing." WALI keeps the first. The second can be done with seccomp-like policies, "or even ... more efficiently in-process by the engine".
- WALI in WAMR is about 2,000 lines of C, "most of which is just pass-through system calls". WASI can then be built as a reusable Wasm library above it.
- danpalmer: Wasm fits FaaS and plugins ("efficiently run pieces of untrusted logic"). Containers fit IaaS-style "binary with a bunch of accoutrements". Containers "aren't a particularly good security boundary".
- not2b: adding system interfaces reintroduces the security problems "That's what killed the Java write-once, run-anywhere promise".
- kentonv: Workers run "thousands in the same process". Calls between workers go through service bindings, a capability configured at deploy time.
- syrusakbary: WASIX provides sandboxed filesystem, sockets, processes and threads.

## Excerpts
> "But then you've got to figure out and prevent all the security holes that can be introduced by adding file access, networking, etc. That's what killed the Java write-once, run-anywhere promise." — not2b, https://news.ycombinator.com/item?id=43020945

> "Sandboxing means two things: memory sandboxing and system sandboxing. It retains the former." — titzer, https://news.ycombinator.com/item?id=43038038

> "A thin kernel interface isn't a reimplementation of a kernel. The WALI implementation in WAMR is ~2000 lines of C, most of which is just pass-through system calls." — titzer, https://news.ycombinator.com/item?id=43034971

> "Containers don't solve that problem. They aren't a particularly good security boundary, and they are much heavier weight, in terms of bytes and startup costs, than WASM binaries" — danpalmer, https://news.ycombinator.com/item?id=43021372

> "Cloudflare Workers run in V8 isolates, which are much lighter-weight than containers, with the ability to run thousands in the same process, and start up new ones quickly on-demand." — kentonv, https://news.ycombinator.com/item?id=43026231

## Relevance to the talk
Titzer's split between memory sandboxing and system sandboxing is a useful way to frame every in-process sandbox (Wasm, LFI, NaCl). The memory part is solved cheaply, and the system-interface part is where all the policy work goes.
