---
title: "Spectre is here to stay: An analysis of side-channels and speculative execution"
url: https://arxiv.org/abs/1902.05178
authors: Ross Mcilroy, Jaroslav Sevcik, Tobias Tebbi, Ben L. Titzer, Toon Verwaest (Google)
date: 2019-02-14 (arXiv v1; paper dated February 15, 2019)
accessed: 2026-11-22
kind: paper
---

## Summary
The V8 team's analysis after a year of offensive and defensive Spectre work. They model side channels formally, evaluate software mitigations in V8, and conclude that on current hardware untrusted code can build a "universal read gadget" to read all memory in its address space; no comprehensive software mitigation exists. Consequently Chrome and V8 moved their security model from language-enforced confidentiality to process isolation.

## Key points
- Side channels "are not mere bugs, but in fact lie at the foundation of optimization".
- Three open problems: finding side channels, understanding speculative vulnerabilities, mitigating them.
- V8 mitigations explored and evaluated (e.g. masking, speculation barriers); costly and incomplete.
- Conclusion: language-enforced confidentiality is defeated; the boundary must be the OS process (or stronger).

## Excerpts
> "As a result of our work, we now believe that speculative vulnerabilities on today's hardware defeat all language-enforced confidentiality with no known comprehensive software mitigations, as we have discovered that untrusted code can construct a universal read gadget to read all memory in the same address space through side-channels." (Abstract)

> "In the face of this reality, we have shifted the security model of the Chrome web browser and V8 to process isolation." (Abstract)

## Relevance to the talk
The single most quotable statement on why in-process sandboxes (isolates, Wasm, JVM) need an outer process/VM boundary when tenants hold secrets. Cited (as "V8 itself cannot defend against Spectre") by Cloudflare's Workers post.
