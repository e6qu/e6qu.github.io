---
title: "Spectre Attacks: Exploiting Speculative Execution"
url: https://spectreattack.com/spectre.pdf
authors: Paul Kocher, Jann Horn, Anders Fogh, Daniel Genkin, Daniel Gruss, Werner Haas, Mike Hamburg, Moritz Lipp, Stefan Mangard, Thomas Prescher, Michael Schwarz, Yuval Yarom
date: disclosed 2018-01-03 (arXiv 1801.01203, Jan 2018); published at IEEE S&P 2019 (40th Symposium, May 2019)
accessed: 2026-11-22
kind: paper
---

## Summary
Spectre shows that branch prediction and speculative execution can be steered so that a victim speculatively accesses secrets and leaks them through cache side channels, even though the speculative work is architecturally discarded. Crucially for sandboxing, it works from portable JavaScript within a browser process and via eBPF in the kernel, breaking assumptions behind process separation, containers, JIT sandboxes and language-based isolation. Disclosure context: Google Project Zero post by Jann Horn, 2018-01-03 (https://googleprojectzero.blogspot.com/2018/01/reading-privileged-memory-with-side.html), which states the issue was reported to Intel, AMD and ARM on 2017-06-01 (CVE-2017-5753, CVE-2017-5715, CVE-2017-5754).

## Key points
- Variants: bounds-check bypass (v1, CVE-2017-5753) and branch-target injection (v2, CVE-2017-5715); Meltdown is "variant 3" (rogue data cache load, CVE-2017-5754) per Project Zero.
- Demonstrated reading memory of the hosting browser process from JavaScript (V8 JIT) using cache eviction instead of `clflush` and a constructed timer.
- Also demonstrated via eBPF programs reading kernel memory.
- Affects Intel, AMD and ARM processors "used in billions of devices".
- Sound fixes need hardware/ISA changes; software mitigations are "makeshift" and processor-specific.

## Excerpts
> "More broadly, the paper shows that speculative execution implementations violate the security assumptions underpinning numerous software security mechanisms, including operating system process separation, containerization, just-in-time (JIT) compilation, and countermeasures to cache timing and side-channel attacks." (Abstract)

> "In addition to violating process isolation boundaries using native code, Spectre attacks can also be used to violate sandboxing, e.g., by mounting them via portable JavaScript code." (§1)

## Relevance to the talk
The 2018 inflection point: after Spectre, same-address-space isolation (isolates, Wasm SFI, language VMs) can no longer be trusted for confidentiality, pushing browsers to Site Isolation and clouds to SMT-off/core pinning and VM-per-tenant designs (Firecracker §3.4).
