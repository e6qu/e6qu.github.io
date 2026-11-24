---
title: "Lightweight Fault Isolation: Practical, Efficient, and Secure Software Sandboxing"
url: https://doi.org/10.1145/3620665.3640408
authors: Zachary Yedidia (Stanford University)
date: 2024-04 (ASPLOS '24, La Jolla, April 27 – May 1, 2024)
accessed: 2026-11-22
kind: paper
---
PDF: https://www.scs.stanford.edu/~zyedidia/docs/papers/lfi.pdf · Project: https://github.com/lfi-project

## Summary
LFI revisits classic software-based fault isolation (SFI, Wahbe et al. 1993) for
ARM64. It supports tens of thousands of 4 GiB sandboxes in one address space, with
full isolation of loads, stores and jumps at ~7% overhead on the compatible subset
of SPEC 2017. Programs are compiled with a rewriting toolchain. A small static
verifier, about 300 lines of Rust at its core, checks the machine code, so the
compiler is not trusted. A runtime then loads the programs into 4 GiB slots and
implements a small Unix-like OS (open, read, write, fork, wait, pipe, mmap …)
inside one Linux process.

## Key points
- Reserved registers on ARM64: x21 holds the sandbox base and is never modified;
  x18 always holds a valid sandbox address. Unsafe addresses are formed with
  `add x18, x21, wN, uxtw`, which forces the address into the 4 GiB slot.
- Up to 64Ki sandboxes in the 48-bit user address space.
- Verifier rules: memory and indirect-branch targets only via reserved registers or
  safe addressing modes; reserved registers modified only in safe ways; only
  instructions from an allow-list of ARMv8.0, so no `svc`. Verifies at ~34 MB/s,
  versus 3 MB/s for the WABT Wasm validator.
- Runtime calls such as open are argument-checked (the runtime can deny access to
  directories). fork, wait and yield are handled internally without a mode switch.
  fork works in a single address space because pointers are 32-bit offsets.
  Preemption uses setitimer signals.
- Cross-sandbox yield (microkernel-style IPC) takes ~50 cycles.
- Table 5 (Apple M1): syscall LFI 22 ns vs Linux 129 ns vs gVisor 12,019 ns;
  pipe 46 ns vs 1,504 ns vs 22,899 ns; yield 17 ns.
- Table 4, geomean overhead vs native LTO (GCP T2A / Apple M1): Wasmtime 47.0% / 67.1%;
  Wasm2c 40.7% / 37.5%; WAMR 22.3% / 18.2%; LFI 7.3% / 6.4%.
- Spectre: LFI mitigates in-sandbox breakout by construction, because it does not
  rely on fine-grained CFI and any in-sandbox jump is legal. It discusses
  cross-sandbox and host poisoning, and mitigation with Arm CSV2_2.
- Later: an x86-64 port (~3K sandboxes per address space per the repo) and an LFI
  target upstream in LLVM (https://llvm.org/docs/LFI.html, AArch64 and x86-64).

## Excerpts
> “Our technique, called Lightweight Fault Isolation (LFI), supports tens of thousands of 4GiB sandboxes in a single address space and does full software isolation of loads, stores, and jumps with a runtime overhead of 7% on the compatible subset of the SPEC 2017 benchmark suite.” (Abstract)

> “a context switch between two Linux processes on modern high-performance processors can cost thousands of cycles” (§1)

> “This effectively implements a small Unix-like operating system within a single Linux process.” (§5.3)

> “Unlike most language-based sandboxing systems, the compiler that produced the program does not need to be trusted.” (§5.2)

## Relevance to the talk
The modern, native-code successor to NaCl and to Wahbe-style SFI. It is the strongest
candidate for “many agents per machine without a VM or even a process each”, and
works on Apple silicon: the 16 KiB alignment was chosen for its page size. The catch
is that agent tools must be recompiled for the LFI target, and the runtime must
reimplement the OS surface that agents use.
