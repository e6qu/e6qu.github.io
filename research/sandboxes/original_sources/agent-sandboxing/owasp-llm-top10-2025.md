---
title: "2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps" (OWASP Top 10 for LLM Applications 2025), incl. "LLM06:2025 Excessive Agency"
url: https://genai.owasp.org/llm-top-10/
authors: OWASP GenAI Security Project
date: 2025 edition (released late 2024); read 2026-11-22; LLM06 page https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
accessed: 2026-11-22
kind: spec
---

## Summary
OWASP's ranked list of risks for LLM applications. For agent sandboxing the relevant entries are LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM05 Improper Output Handling (model output passed to shells/interpreters) and especially LLM06 Excessive Agency, whose three root causes — excessive functionality, permissions and autonomy — are exactly what an agent sandbox constrains.

## Key points
- The 2025 list: LLM01 Prompt Injection; LLM02 Sensitive Information Disclosure; LLM03 Supply Chain; LLM04 Data and Model Poisoning; LLM05 Improper Output Handling; LLM06 Excessive Agency; LLM07 System Prompt Leakage; LLM08 Vector and Embedding Weaknesses; LLM09 Misinformation; LLM10 Unbounded Consumption.
- LLM06 root causes: excessive functionality (unneeded tools), excessive permissions (tools with more downstream access than needed), excessive autonomy (high-impact actions without verification/approval).
- LLM06 mitigations: minimise tools and their functions; avoid open-ended tools "such as general shell access" in favour of narrow ones; run in the user's context with least privilege; human approval for high-impact actions; enforce authorisation downstream, not in the LLM; logging/rate limiting limit damage. (The LLM06 page read does not mention sandboxing explicitly.)

## Excerpts
> "Excessive Agency is the vulnerability that enables damaging actions to be performed" — LLM06

> "Implement authorization in downstream systems rather than relying on an LLM to decide if an action is allowed or not." — LLM06 mitigations

## Relevance to the talk
Coding agents are the extreme case of LLM06: their core tool *is* "general shell access", which OWASP advises against. Since the open-ended tool is the product, the mitigation shifts from "don't give a shell" to "give a shell inside a boundary" — the sandbox enforces authorisation outside the model, as LLM06 recommends.
