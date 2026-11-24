---
title: "Wasm workloads" (Docker Desktop docs) and "Introducing the Docker+Wasm Technical Preview"
url: https://docs.docker.com/desktop/features/wasm/
authors: Docker, Inc.; preview post by Michael Irwin
date: preview post 2022-10-24 (https://www.docker.com/blog/docker-wasm-technical-preview/); docs page undated, read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Docker Desktop added Wasm workloads in October 2022 as a technical preview: containerd shims (first with WasmEdge) pull a Wasm module from an OCI image and run it instead of a Linux container. By 2026 the docs say the feature is deprecated, no longer maintained, and will be removed. Docker's own agent-sandbox product (agent-sandboxing/docker-sandboxes.md) uses microVMs, not Wasm.

## Key points
- 2022: "We collaborated with WasmEdge to create a containerd shim. This shim extracts the Wasm module from the OCI artifact and runs it using the WasmEdge runtime."
- Runtimes installed by Desktop: `io.containerd.slight.v1`, `spin.v2`, `wasmedge.v1`, `wasmtime.v1`, `lunatic.v1`, `wws.v1`, `wasmer.v1`.
- Usage: `docker run --runtime=io.containerd.wasmedge.v1 --platform=wasi/wasm …`; needs the containerd image store.
- 2026 docs: "Wasm workloads are deprecated and will be removed in a future Docker Desktop release." "This feature is no longer actively maintained."

## Excerpts
> "Wasm workloads are deprecated and will be removed in a future Docker Desktop release."

## Relevance to the talk
A dated marker of the hype cycle around Solomon Hykes's widely quoted 2019 remark that Docker would not have been needed if WASM+WASI had existed in 2008 (quote not re-verified here; see hackernews/virtualization-density/hn-43020684-wasm-will-replace-containers.md). Four years later, the container vendor deprecated Wasm workloads and sandboxes agents with microVMs.
