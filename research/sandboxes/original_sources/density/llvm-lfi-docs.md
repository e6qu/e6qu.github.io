---
title: "Lightweight Fault Isolation (LFI) in LLVM"
url: https://llvm.org/docs/LFI.html
authors: LLVM project
date: accessed during the LLVM 24 development cycle (docs show "LLVM 24.0.0git")
accessed: 2026-11-22
kind: docs
---

## Summary
LLVM's official documentation for its LFI target, which shows that LFI is now an
upstream compiler target and not only a research fork. It describes LFI as
compiler-based sandboxing for native code that, like WebAssembly and NaCl, isolates
code in-process. Existing C/C++/assembly is recompiled; the programs are confined
to a 4 GiB region and run inside an LFI runtime (“emulator”) that services
system calls.

## Key points
- Goals: compatibility (recompile nearly all C/C++/asm unmodified, keep system call
  interfaces and tooling such as debuggers and sanitizers), performance, verifiable
  security, and easy retrofitting.
- Supported on AArch64 (Armv8.1) and x86-64.
- Programs are limited to an instruction subset so that they can be soundly confined.

## Excerpts
> “Like WebAssembly and Native Client, LFI isolates sandboxed code in-process (i.e., in the same address space as a host application).”

> “LFI programs must run inside of an “emulator” (usually called the LFI runtime), responsible for initializing the sandbox region, loading the program, and servicing system call requests”

## Relevance to the talk
A milestone on the timeline: SFI went from a 1993 paper to NaCl in 2009 to an
upstream LLVM target. It makes LFI a practical candidate for agent tool sandboxes.
