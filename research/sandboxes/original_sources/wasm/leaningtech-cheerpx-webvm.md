---
title: CheerpX documentation (overview) and WebVM (leaningtech/webvm)
url: https://cheerpx.io/docs/overview
authors: Leaning Technologies
date: CheerpX docs v1.2.8 (© 2026), read 2026-11-22; WebVM repo since 2022-01 (https://github.com/leaningtech/webvm, ~17.5k stars)
accessed: 2026-11-22
kind: docs
---

## Summary
CheerpX is an x86 virtualisation engine written in C++ and compiled to JS/Wasm: an interpreter plus a JIT that translates hot x86 code into WebAssembly, running unmodified 32-bit x86 Linux binaries on top of an emulated Linux syscall interface (not emulated hardware). WebVM uses it to boot an unmodified Debian (and an Alpine/Xorg desktop) entirely client-side, with networking via Tailscale. It is the "run real Linux binaries inside the browser sandbox" sub-type.

## Key points
- "CheerpX is an x86 virtualization technology for running executables and operating systems entirely client-side."
- Two tiers: "There is both an interpreter and a sophisticated JIT compiler" (JIT emits Wasm).
- "CheerpX currently focuses on user mode code, on top of a Linux-compatible system call interface" — unlike v86/JSLinux, which emulate hardware. Syscall layer "not 100% complete".
- "CheerpX enables you to run existing 32-bit x86 native binaries and Linux distributions"; 64-bit not stated.
- Security claim: "It can also be used to provide a secure sandbox for untrusted code"; data stays in the browser.
- No performance figures (slowdown vs native) published on the overview page.
- WebVM README: "Linux ABI-compatible and runs an unmodified Debian distribution including many native development toolchains"; networking via Tailscale (exit node for internet); ICMP unavailable; README has a "Claude AI Integration" section (not read in detail).
- Licence: free for personal, most non-commercial use and evaluation; commercial licence otherwise.

## Excerpts
> "CheerpX currently focuses on user mode code, on top of a Linux-compatible system call interface"

> "WebVM is a server-less virtual environment running fully client-side in HTML5/WebAssembly." (WebVM README)

## Relevance to the talk
Linux-in-Wasm via binary translation: gives agents the thing Wasm lacks (real binaries, a shell, package managers) by putting a syscall emulator — effectively a small gVisor-like kernel — inside the Wasm/browser sandbox. Two boundaries (emulator + browser), but 32-bit x86 only and unquantified JIT overhead.
