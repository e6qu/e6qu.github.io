---
title: "Isolates, microVMs, and WebAssembly"
url: https://news.ycombinator.com/item?id=32987813
story_url: https://notes.crmarsh.com/isolates-microvms-and-webassembly
authors: HN discussion (submitted by charliermarsh, the author) of Charlie Marsh's survey post
date: 2022-09-26
accessed: 2026-11-22
kind: discussion
points: 123
comments: 55
---

## Summary
A survey post comparing three serverless isolation models drew comments from tptacek, kentonv and Wasmer's founder. tptacek's provisional view: Wasm can be "asymptotically as secure as the host system wrapper you build around it". The bugs will be in the host bridge, as with isolates, but Wasm's design is more coherent than V8's. kentonv: security is risk management, not a boolean, and Chrome treats process isolation as a second layer on top of V8, not the "secure" layer. Syrus Akbary (Wasmer) argues Wasm brings Firecracker-like syscall mediation to uncontainerised code such as third-party libraries.

## Key points
- tptacek: with a shared OS kernel underneath, kernel bugs still matter. VMs share this problem "to a much more limited extent" because KVM is small and KVM bugs are rare.
- kentonv: V8 "tends to have more bugs than a typical hypervisor does", so relying on it alone is riskier unless you layer mitigations. Google still pays big V8 bounties.
- muricula: hypervisors are what "Fortune 500 companies bet their multi-billion dollar cloud businesses on". V8 has "boatloads of CVEs".
- syrusakbary: Wasm's host-call layer is no better than Firecracker for code that is already containerised. The gain is for library-level code that otherwise runs unsandboxed.
- pclmulqdq: Wasm may be too permissive and BPF too restrictive for in-process serverless. The ideal is something in between.
- simonw: Fly Machines can effectively scale to zero (stopped Machines are restarted by the proxy).

## Excerpts
> "It seems though that it can be asymptotically as secure as the host system wrapper you build around it: that is, the bugs won't be in the WebAssembly but in the bridge between WebAssembly and the host OS." — tptacek, https://news.ycombinator.com/item?id=32990417

> "KVM is (by definition) much smaller than the whole kernel, and KVM bugs are rare." — tptacek, https://news.ycombinator.com/item?id=32990417

> "Unfortunately security is not a boolean thing, where it's either secure or it's not secure. V8 is designed to be a secure sandbox on its own." — kentonv, https://news.ycombinator.com/item?id=32994521

> "But Chrome definitely doesn't think of that second layer as being the "secure" one -- security comes from having both together, so an attack has to bypass both at the same time." — kentonv, https://news.ycombinator.com/item?id=32994521

> "Running this libraries in Wasm can actually be more secure than running the native ones (since we are bringing Firecracker-like security to the systemcalls the library may use)." — syrusakbary (Wasmer), https://news.ycombinator.com/item?id=32990766

## Relevance to the talk
Answers "is Wasm a real boundary?". The insiders' consensus is that Wasm's memory sandbox is sound and the risk sits in the host interface (WASI, imports), which is where a sandbox designer has to look. Pairs with `../../virtualization/wasmtime-security-docs.md`.
