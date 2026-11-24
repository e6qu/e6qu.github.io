---
title: "Hyperlight Wasm: Fast, secure, and OS-free"
url: https://opensource.microsoft.com/blog/2025/03/26/hyperlight-wasm-fast-secure-and-os-free/
authors: Yosh Wuyts, Lucy Menon (Microsoft)
date: 2025-03-26
accessed: 2026-11-22
kind: blog
---

## Summary
Hyperlight is a Microsoft VMM-as-a-library that creates tiny hypervisor partitions (KVM, mshv, Windows Hypervisor Platform) with no guest kernel or devices — just memory and a vCPU. Hyperlight Wasm compiles Wasmtime as a `no_std` guest inside such a micro-VM, so untrusted Wasm components are behind two boundaries: the Wasm sandbox and a hardware VM. VM creation is reported at 1–2 ms vs ~125 ms for traditional VMs.

## Key points
- Guest has no OS: "all it exposes to its VM guests is a linear slice of memory and a CPU"; "No virtual devices. No operating system."
- Layering: Wasmtime (software sandbox) inside a hypervisor-isolated micro-VM; an attacker must escape both. "One layer of sandboxing is good. But having two layers is even better."
- Numbers (vendor): VM creation "about 1-2 milliseconds today", goal "less than 1 millisecond"; traditional VMs "about 125 milliseconds" at the low end. Warm-pool memory "drastically smaller" (no figure).
- WASI: the VMM host provides no default WASI implementation; hosts must implement the interfaces they want to expose (example uses part of `wasi:sockets`).
- Repo (https://github.com/hyperlight-dev/hyperlight-wasm, read 2026-11-22): "experimental code … not considered production-grade"; latest v0.17.0 (2026-11-20). Hyperlight itself is a CNCF sandbox project; README: micro VMs "spin up in milliseconds, with guest function calls completing in microseconds"; snapshot/restore for reuse.
- Hyperlight also appears as a backend in Microsoft's Windows MXC agent sandbox (see macos-windows/windows-mxc-repo.md).

## Excerpts
> "This takes about 1-2 milliseconds today"

> "One layer of sandboxing is good. But having two layers is even better."

## Relevance to the talk
Answers "is Wasm enough on its own?" with Microsoft's own answer: no — wrap it in hardware virtualization when tenants are hostile. Blurs the VM/Wasm class boundary: Wasm supplies portability and a narrow ABI, the micro-VM supplies the hardware boundary (and blunts Cranelift-miscompile escapes like those in wasmtime-security-advisories.md). Startup in the low-ms range sits between isolates and Firecracker (~125 ms).
