---
title: "Mitigating Spectre and Other Security Threats: The Cloudflare Workers Security Model"
url: https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/
authors: Kenton Varda (Cloudflare)
date: 2020-07-29
accessed: 2026-11-22
kind: blog
---

## Summary
Cloudflare Workers runs many tenants' JavaScript/Wasm in V8 isolates within a single process, because per-tenant processes would be too expensive at edge density. The post lays out the layered design (isolates, trust-based "cordons", a namespaces+seccomp "layer 2" sandbox with no filesystem or network, capability-based APIs via Cap'n Proto to a supervisor, sub-24-hour V8 patch gap) and a Spectre strategy based on removing timers, cascading slow-downs, dynamic process isolation of suspicious or CPU-heavy Workers, and periodic memory reshuffling.

## Key points
- Isolates: many per process; needed to host "many thousands of guest apps on every machine" and switch "thousands of times per second".
- Density/cost: each guest can use at most "a couple megabytes of memory"; with strict process isolation "the CPU cost can easily be 10x what it is with a shared process". 200 locations worldwide (2020).
- Cordons: workers separated by trust level; free-plan customers never share a process with enterprise customers.
- Layer 2 sandbox: namespaces + seccomp applied *after* the runtime loads — empty mount namespace, all filesystem syscalls blocked, no network (only Unix sockets to local proxies).
- API design: no filesystem API at all; HTTP only via an outbound proxy that blocks internal destinations; inbound proxy terminates TLS (runtime never sees TLS keys).
- Patch gap: Chrome's reduced from 33 to 15 days; Workers' "now under 24 hours".
- Spectre: V8 team says V8 "cannot defend against Spectre"; Workers forbids native code, freezes `Date.now()` during execution (implemented mid-2017, before Spectre was public), no multithreading/shared memory; dynamic process isolation developed with TU Graz; daily runtime restarts to reshuffle memory.
- Candid: "no one has 'fixed' Spectre. Not even when using heavyweight virtual machines."

## Excerpts
> "V8 executes code inside 'isolates', which prevent that code from accessing memory outside the isolate -- even within the same process."

> "When using strict process isolation in Workers, we find the CPU cost can easily be 10x what it is with a shared process."

> "Our key insight is this: as an attack becomes slower, new techniques become practical to make it even slower still."

## Relevance to the talk
The strongest production case for language-runtime isolation, with an explicit price tag for process isolation (10× CPU) and an honest Spectre story. Good contrast to Firecracker: Workers trades generality (only JS/Wasm, no native code, no syscalls) for density.
