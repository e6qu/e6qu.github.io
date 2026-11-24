---
title: wasmCloud (wasmCloud/wasmCloud monorepo README)
url: https://github.com/wasmCloud/wasmCloud
authors: wasmCloud maintainers (CNCF Incubating project)
date: repo since 2020-10; v2.12.3 released 2026-11-21
accessed: 2026-11-22
kind: repo
---

## Summary
wasmCloud is a CNCF Incubating platform that schedules WebAssembly components across Kubernetes, clouds and edge, with a Wasmtime-based host (`wash-runtime`) and a "plugin-based capability model". Its README pitches components as deny-by-default sandboxes for "microservices, functions, and agents", in contrast to allow-by-default containers.

## Key points
- Positioning (2026 README): run "microservices, functions, and agents as ultra-dense, deny-by-default bytecode sandboxes"; components "measured in kilobytes to low megabytes, starting in milliseconds".
- Security argument: containers default to allow (network, syscalls, env) and must be locked down from outside; components "can do nothing (no file I/O, network access, or system calls) unless a capability is explicitly granted", with capabilities declared as interfaces in the component itself.
- Architecture 2.x: `wash` CLI; `wash-runtime` wraps Wasmtime; Kubernetes runtime operator with CRDs (`Host`, `Workload`, …) scheduling onto host pods via NATS.
- No density figure is given in the README (no instances-per-host number).

## Excerpts
> "Containers default to **allow-by-default** … WebAssembly components default to **deny-by-default**: a component can do nothing (no file I/O, network access, or system calls) unless a capability is explicitly granted." (README, Why wasmCloud?)

## Relevance to the talk
Representative of the "Wasm components as cloud workloads" sub-type and of the marketing contrast (deny-by-default vs allow-by-default). True of the guest ABI, but the comparison is to an *unhardened* container; a container with seccomp/Landlock/gVisor also starts from a narrow surface (os-primitives/). The real difference is that the policy is visible in the component's type (its imports).
