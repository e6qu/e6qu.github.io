---
title: "Fermyon promises over 5000 WebAssembly applications on one Kubernetes node via new platform" (DevClass report on Fermyon Platform for Kubernetes / SpinKube)
url: https://devclass.com/2024/03/14/fermyon-promises-over-5000-webassembly-applications-on-one-kubernetes-node-via-new-platform/
authors: Tim Anderson (DevClass), reporting Fermyon claims
date: 2024-03-14
accessed: 2026-11-22
kind: blog
---

## Summary
Trade-press write-up of Fermyon's March 2024 launch of SpinKube (open source, later donated to CNCF) and Fermyon Platform for Kubernetes. Fermyon claimed "thousands of applications on a single node" — over 5,000 — because many Spin apps share one runtime process, separated only by Wasm sandboxing, with sub-millisecond cold starts. The article notes Wasm sandboxing is weaker than a VM boundary. Fermyon was acquired by Akamai on 2025-12-01.

## Key points
- Density (vendor): "over 5000 WebAssembly applications on one Kubernetes node"; "20 times the current pod limit in Kubernetes and often 50-100 times the number of pods running on a Kubernetes node"; 60% compute-cost savings claimed.
- Mechanism: "Sandboxing means that multiple workloads can be hosted in a single runtime instance" — i.e. multi-tenant in-process Wasm, not one process/pod per app.
- Startup (vendor): a Spin component "starts in less than a millisecond".
- Caveat in the article: "The sandboxing of WebAssembly applications is weaker than the isolation offered by a separate virtual machine" (though with a smaller attack surface); benefits apply "in principle"; "still early days".
- Spin itself: https://github.com/spinframework/spin (CNCF; Apache-2.0; ~6.6k stars; built on Wasmtime and the component model).
- Akamai acquisition (press release 2025-12-01: https://www.akamai.com/newsroom/press-release/akamai-announces-acquisition-of-function-as-a-service-company-fermyon); fermyon.com blog URLs now redirect to akamai.com.
- Other figures seen only in search snippets (unverified): a 2024 third-party AKS test (Thorsten Hans slides) of ~3,500 apps on a 4 vCPU/16 GB node; a Fermyon 2025 GKE Autopilot post with up to 1,000 Spin apps/node; Fermyon's "0.5 ms" cold start.

## Excerpts
> "Sandboxing means that multiple workloads can be hosted in a single runtime instance"

> "The sandboxing of WebAssembly applications is weaker than the isolation offered by a separate virtual machine"

## Relevance to the talk
The density number for the Wasm class (thousands per node vs ~30–110 pods), and an explicit statement of where it comes from: dropping the per-tenant process boundary. That is exactly the trade Cloudflare made with isolates and then had to backstop after Spectre (virtualization/cloudflare-workers-security-model-2020.md). Compare density/ notes (LFI, kapteko) for how far process-level density can be pushed without giving up the process.
