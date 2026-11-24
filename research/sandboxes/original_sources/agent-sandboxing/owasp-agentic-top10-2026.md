---
title: "OWASP Top 10 for Agentic Applications for 2026"
url: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
authors: OWASP GenAI Security Project (Agentic Security Initiative); announcement by John Sotiropoulos, Keren Katz, Ron F. Del Rosario
date: 2025-12-09
accessed: 2026-11-22
kind: spec
---

## Summary
OWASP's first risk list specific to autonomous/agentic systems, published December 2025 and built by 100+ contributors. Several entries map directly onto agent-sandbox concerns: ASI05 Unexpected Code Execution (natural-language-driven execution as a new route to RCE), ASI02 Tool Misuse, ASI03 Identity & Privilege Abuse (credentials), ASI04 Agentic Supply Chain, ASI06 Memory & Context Poisoning (persistent state), ASI09 Human-Agent Trust Exploitation (approval fatigue), ASI10 Rogue Agents. Only the announcement page was read; the full PDF was not.

## Key points
- ASI01 Agent Goal Hijack; ASI02 Tool Misuse; ASI03 Identity & Privilege Abuse; ASI04 Agentic Supply Chain Vulnerabilities; ASI05 Unexpected Code Execution; ASI06 Memory & Context Poisoning; ASI07 Insecure Inter-Agent Communication; ASI08 Cascading Failures; ASI09 Human-Agent Trust Exploitation; ASI10 Rogue Agents (names as on the announcement page).
- ASI05 described as agents' natural-language-driven execution creating new routes to RCE (AutoGPT RCE cited). Secondary summaries (not verified against the PDF) list sandboxed execution and deny-by-default egress among ASI05 mitigations.

## Excerpts
> "These are not theoretical risks." — announcement

> "Once AI began taking actions, the nature of security changed forever." — announcement

## Relevance to the talk
Industry-consensus taxonomy for the closing section; ASI05 names the problem the whole sandbox story addresses, and ASI09 names the HITL/approval-fatigue problem.
