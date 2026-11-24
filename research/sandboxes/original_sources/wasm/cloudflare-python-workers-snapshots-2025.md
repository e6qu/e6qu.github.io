---
title: "Python Workers redux: fast cold starts, packages, and a uv-first workflow"
url: https://blog.cloudflare.com/python-workers-advancements
authors: Dominik Picheta, Mike Nomitch (Cloudflare)
date: 2025-12-08
accessed: 2026-11-22
kind: blog
---

## Summary
Cloudflare runs Python Workers as Pyodide (CPython→Wasm) inside its isolate-based Workers runtime and makes cold starts tolerable by snapshotting Wasm linear memory at deploy time and restoring it on start. Their benchmark (importing fastapi, httpx, pydantic) drops from ~10 s without snapshots to ~1 s with them. It is the production-scale answer to the "few seconds" Pyodide startup seen in langchain-sandbox.

## Key points
- Benchmark (vendor): mean cold start 1.027 s (Cloudflare Python Workers) vs 2.502 s (AWS Lambda without SnapStart) vs 3.069 s (Google Cloud Run); "2.4x faster cold starts than AWS Lambda without SnapStart".
- Without snapshots the same imports take "around 10 seconds"; with snapshots "it takes 1 second".
- Mechanism: run the Worker's top-level code at deploy time, then save "only … the WebAssembly linear memory" (plus two tables outside it that must be restored to the same state). Wasm's single flat linear memory is what makes this cheap.
- Snapshot caveats: risk of locking in a randomness seed — hash seeds fixed per Worker; PRNGs reseeded after restore and blocked during initialization; JS objects not reachable from `globalThis` make deployment fail.
- Related changelog: https://developers.cloudflare.com/changelog/post/2025-12-08-python-cold-start-improvements/

## Excerpts
> "Cloudflare Python Workers have 2.4x faster cold starts than AWS Lambda without SnapStart."

> "The memory snapshot we are saving consists only of the WebAssembly linear memory"

## Relevance to the talk
Shows the real cost of Wasm for *agent-style* workloads: an interpreter plus packages is tens of MB and seconds to initialise, so the "µs instantiation" numbers apply only after snapshotting (cf. wizer.md, and the microVM snapshot work in arxiv/2101.09355-reap-serverless-snapshots.md and arxiv/2610.13841-full-sandbox-snapshots.md). Also the snapshot-uniqueness problem (shared RNG state) is the same one microVM snapshots have (arxiv/2102.12892-restoring-uniqueness-microvm-snapshots.md).
