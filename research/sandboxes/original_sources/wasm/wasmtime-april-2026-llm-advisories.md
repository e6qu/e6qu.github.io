---
title: Wasmtime's April 9, 2026 Security Advisories
url: https://bytecodealliance.org/articles/wasmtime-security-advisories
authors: The Wasmtime Project Maintainers (Bytecode Alliance)
date: 2026-04-09
accessed: 2026-11-22
kind: blog
---

## Summary
The Wasmtime maintainers explain a coordinated release of 12 advisories (two critical sandbox escapes, both outside x86_64 Cranelift) that came from a roughly three-week effort in which Bytecode Alliance members Mozilla, UCSD, Akamai and F5 pointed LLM tools at Wasmtime. Returns diminished after the first week. The maintainers conclude LLM tools are now a permanent part of their security toolbox and admit there was no continuous fuzzing of Cranelift or Winch on aarch64.

## Key points
- Participants: Mozilla, UCSD, Akamai, F5 (Bytecode Alliance members); ~3 weeks; 11 distinct issues, 12 advisories; fixes across Wasmtime 43.0.1, 42.0.2, 36.0.7, 24.0.7.
- Two critical: "Miscompiled guest heap access enables sandbox escape on aarch64 Cranelift" (CVE-2026-34971) and the Winch escape (CVE-2026-34987). x86_64 Cranelift users "were not affected by either".
- "diminishing returns after the end of the first week".
- LLM tools "will be a permanent addition to our security toolbox".
- Gap: "There is no continuous fuzzing of either Cranelift or Winch on aarch64 at this time."
- Afterwards the advisory rate stayed high: 71 advisories in 2026 by 2026-11-22, including two more critical Cranelift escapes on 2026-10-19 (one reporter's advisory says it was submitted with AI assistance, per secondary coverage — e.g. https://thehackernews.com/2026/10/two-critical-wasmtime-flaws-could-let.html; not checked against the GHSA text).

## Excerpts
> "There is no continuous fuzzing of either Cranelift or Winch on aarch64 at this time."

> "will be a permanent addition to our security toolbox"

## Relevance to the talk
Wasmtime is among the most carefully engineered sandboxes (written in Rust and heavily fuzzed), yet cheap LLM-driven audit found long-lived escapes in weeks. Same pattern as the 2026 agent-sandbox escape advisories (incidents/2026-06-agent-sandbox-escape-advisories.md): defenders and attackers both now have automated bug-finding, so single-layer sandboxes age fast. Argues for layering Wasm inside a VM for hostile multi-tenancy.
