---
title: "container2wasm: Container to WASM converter" (container2wasm/container2wasm README)
url: https://github.com/container2wasm/container2wasm
authors: Kohei Tokunaga (ktock) and contributors
date: repo since 2023-02 (moved from ktock/container2wasm to the container2wasm org); read 2026-11-22 (~2.8k stars)
accessed: 2026-11-22
kind: repo
---

## Summary
`c2w` converts an ordinary container image into a single Wasm binary that bundles a CPU emulator (Bochs for x86_64, TinyEMU for riscv64, QEMU for others), a Linux kernel and the image's filesystem. The result runs on any WASI runtime (wasmtime, wamr, wasmer, wasmedge, wazero) or in a browser. It is explicitly experimental.

## Key points
- "Converts a container to WASM with emulation by Bochs (for x86_64 containers), TinyEMU (for riscv64 containers) and QEMU."
- Runs on WASI runtimes and in the browser (via browser_wasi_shim and xterm-pty); example `c2w ubuntu:22.04 out.wasm` then `wasmtime out.wasm uname -a` reports a Linux 6.1 x86_64 kernel.
- Host directories via `wasmtime --mapdir`; networking needs extra setup (examples/networking).
- "x86_64 or riscv64 container is recommended. Other platform's containers should work but slow because of additional emulation."
- "This is an experimental software."

## Excerpts
> "container2wasm is a container-to-wasm image converter that enables to run the container on WASM."

## Relevance to the talk
The bridge in the other direction: instead of porting agent tools to WASI, wrap a whole Linux VM inside one Wasm module so any WASI runtime or browser can host it. Isolation becomes Wasm sandbox + emulator, but the guest gets a real kernel with fork/exec, threads and a package manager — at full-system-emulation speed.
