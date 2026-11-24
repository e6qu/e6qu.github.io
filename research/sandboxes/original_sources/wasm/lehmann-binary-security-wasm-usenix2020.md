---
title: "Everything Old is New Again: Binary Security of WebAssembly"
url: https://www.usenix.org/conference/usenixsecurity20/presentation/lehmann
authors: Daniel Lehmann, Johannes Kinder, Michael Pradel
date: 2020-08 (29th USENIX Security Symposium, pp. 217–234)
accessed: 2026-11-22
kind: paper
---

## Summary
Wasm protects the *host* from a module, but not the module from itself. Memory-corruption bugs in C/C++ compiled to Wasm stay exploitable inside linear memory, and several mitigations native code relies on are missing. The authors build attack primitives (arbitrary write, overwriting sensitive or even "constant" data, diverting control flow, manipulating the host environment through imports) and demonstrate end-to-end exploits on three Wasm platforms.

## Key points
- Classic exploit techniques that native mitigations block "are completely exposed in WebAssembly" (abstract).
- Wasm-specific attacks: e.g. "overwriting supposedly constant data" (no read-only memory in linear memory).
- Primitives: write arbitrary memory, overwrite sensitive data, then "trigger unexpected behavior by diverting control flow or manipulating the host environment".
- End-to-end exploits on three platforms (browser, Node.js, a standalone runtime; platform names from our reading of the paper, not re-checked against the PDF in this pass).
- Risk assessment on real-world binaries and SPEC CPU programs suggests the attacks are practical.
- Conclusion: "a perhaps surprising lack of binary security in WebAssembly".

## Excerpts
> "Overall, our findings show a perhaps surprising lack of binary security in WebAssembly." (abstract)

## Relevance to the talk
Second half of "Wasm is a memory sandbox; the host interface is the attack surface": a compromised component still holds all the capabilities it was granted. For agent tools (Wassette, Spin), an attacker who feeds crafted input to a vulnerable tool gets that tool's file/network grants — so the size of each grant, not the Wasm boundary, determines the blast radius. Complements arxiv/2407.12297-wasm-security-review.md.
