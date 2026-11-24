---
title: WASI Roadmap (wasi.dev) and WebAssembly/WASI releases
url: https://wasi.dev/roadmap
authors: WASI Subgroup, W3C WebAssembly Community Group
date: living document; WASI v0.3.0 tagged 2026-06-11, v0.3.1 2026-08-11, v0.3.2 2026-10-13 (GitHub releases)
accessed: 2026-11-22
kind: spec
---

## Summary
WASI 0.3 (Preview 3) shipped on 2026-06-11 after release candidates from January–March 2026. It adds native async to the Component Model — `async func`, `stream<T>`, `future<T>` — and removes the `wasi:io` package whose explicit streams/polling were 0.2's workaround. WASI 0.2 continued in parallel to 0.2.12 (2026-06-02). WASI 1.0 has no date.

## Key points
- Timeline (GitHub releases of WebAssembly/WASI, gh api): 0.2.0 Jan 2024 … 0.2.9 2025-12-02, 0.2.10 2026-02-03, 0.2.11 2026-04-07, 0.2.12 2026-06-02; 0.3.0-rc-2026-01-06, -02-09, -03-15; 0.3.0 2026-06-11; 0.3.1 2026-08-11; 0.3.2 2026-10-13.
- Roadmap: 0.3.0 was "an exception to the release train" (WASI Subgroup vote); planned 0.3.x patch releases roughly every two months through 0.3.9 (2027-12-14).
- "WASI 0.3 adds native async support to the Component Model"; `wasi:io` functionality moves into the Canonical ABI.
- WASI 1.0: no date; "may also be scheduled outside the train".
- WASI repo README now calls 0.3 "the current preview".
- Inclusion in 0.3 requires phase 3 + portability criteria + subgroup vote; phase-3 set is still clocks, random, filesystem, sockets, cli, http (docs/Proposals.md).
- Security side-effect: new async/stream machinery produced a cluster of host-side Wasmtime advisories in Aug–Nov 2026 (WASIp3 streams unbounded host allocation; stack buffer overflow from unvalidated async callback results; wasip3 UDP send to receive-only address) — see wasmtime-security-advisories.md.

## Excerpts
> "WASI 0.3 adds native async support to the Component Model." (wasi.dev/roadmap)

> "[WASI 0.3] (Preview 3) is the current preview. It builds on [WASI 0.2], replacing the earlier explicit streams and polling interfaces with the component model's native, composable `async` functionality via the `future` and `stream` types." (WebAssembly/WASI README)

## Relevance to the talk
State of the standard as of Nov 2026: async/concurrency is now first-class (good for I/O-heavy agent tools), but the capability surface is unchanged — still no processes or threads — and every new host interface is new attack surface, visible immediately in the advisory stream.
