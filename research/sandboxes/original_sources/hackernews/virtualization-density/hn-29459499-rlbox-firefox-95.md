---
title: "WebAssembly and Back Again: Fine-Grained Sandboxing in Firefox 95"
url: https://news.ycombinator.com/item?id=29459499
story_url: https://hacks.mozilla.org/2021/12/webassembly-and-back-again-fine-grained-sandboxing-in-firefox-95/
authors: HN discussion (submitted by feross) of Mozilla Hacks post on RLBox
date: 2021-12-06
accessed: 2026-11-22
kind: discussion
points: 392
comments: 144
---

## Summary
Mozilla described shipping RLBox in Firefox 95. Libraries are compiled to Wasm and then back to native C (wasm2c), which gives in-process memory isolation without a separate process. The top comment called this a "trusted compiler" and imagined dropping processes and the user/kernel split. Ben Titzer corrected both points. The compiler is untrusted, because its output is verified. And Spectre breaks in-process confidentiality "regardless of sandboxing technology". Others noted that Wasm lacks native hardening such as read-only data, so exploits inside the sandbox can be easier.

## Key points
- Technique as understood in the thread: compile third-party C/C++ (e.g. font and media libraries) to Wasm, translate back to C, and compile natively. Control flow and memory are confined to the library's region. This is SFI.
- Optimist view (throw10920): "Security based on process isolation is extremely inefficient and coarse-grained". A verifying compiler could remove TLB flushes and context switches.
- titzer: such a compiler is *untrusted*, because "whatever it outputs is going to be both statically and dynamically verified". But since 2017 Spectre "break[s] confidentiality for in-process memory, regardless of sandboxing technology".
- Clocks cannot be withheld: "Even without a clock, one can construct one easily using shared memory and threads" (titzer).
- Weaker inside the box: Wasm lacks native mitigations such as read-only data pages, so a libpng bug that is unexploitable natively can be exploitable inside Wasm. The sandbox still holds (vlovich123, titzer).
- Distribution friction: Fedora and Fennec F-Droid disabled the feature because of the custom wasi-sysroot toolchain.

## Excerpts
> "Security based on process isolation is extremely inefficient and coarse-grained - having a trusted compiler could (eventually) massively increase performance by removing processes entirely" — throw10920, https://news.ycombinator.com/item?id=29461076

> "I would argue that this makes the compiler untrusted--we don't care what it does, whatever it outputs is going to be both statically and dynamically verified to not break the sandbox properties." — titzer, https://news.ycombinator.com/item?id=29466606

> "Our conclusion is that Spectre, in all its flavors, break confidentiality for in-process memory, regardless of sandboxing technology. On current hardware, there is no 100% bulletproof way to enforce isolation." — titzer, https://news.ycombinator.com/item?id=29466606

> "A key side-channel is execution time, and no, in general, you can't prevent a program from getting a clock." — titzer, https://news.ycombinator.com/item?id=29466632

> "You couldn’t escape the WASM sandbox but the a application itself could be compromised." — vlovich123, https://news.ycombinator.com/item?id=29460310

## Relevance to the talk
RLBox is the production example of SFI via Wasm. Titzer's replies are the right caveat: SFI gives integrity, not confidentiality against Spectre. LFI's density claims (`../../density/lfi-asplos24.md`) have the same limit. Pairs with `../../virtualization/rlbox-usenix-security2020.md`.
