---
title: "Code execution" (Gemini API documentation)
url: https://aistudio.google.com/docs/code-execution
authors: Google (Gemini API / AI Studio)
date: living document (formerly ai.google.dev/gemini-api/docs/code-execution, now 301-redirects); examples use `Api-Revision: 2026-05-20`; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
The Gemini API's built-in code execution tool lets the model write and run Python during a generation. It is the "first-generation" interpreter shape: Python only, a fixed library set, a 30-second runtime cap and up to 5 self-correction retries. The page says almost nothing about the sandbox itself: no isolation mechanism, no statement on network access, no statement on whether state persists between turns. There is no separate charge; code and results are billed as tokens.

## Key points
- Language: "Gemini is only able to execute code in Python."
- Runtime: "The maximum runtime of the code environment is 30 seconds." On error the model may regenerate code up to 5 times.
- Libraries: fixed list (numpy, pandas, matplotlib, scikit-learn, sympy, tensorflow, …); "You can't install your own libraries."
- Files: input via inline data or Files API, bounded by the context window; outputs returned inline; only matplotlib for graphs.
- Multi-turn via `previous_interaction_id`; persistence of interpreter state across turns is not stated.
- Isolation technology and network policy: **not documented** on the page.
- Pricing: no extra fee; generated code and results are billed as model input/output tokens.
- In ADK this tool is `BuiltInCodeExecutor` (see `google-adk-code-executors.md`). For a stateful, gVisor-documented sandbox Google points developers to Agent Platform Code Execution (`google-agent-engine-code-execution.md`).

## Excerpts
> "The maximum runtime of the code environment is 30 seconds."

> "You can't install your own libraries."

## Relevance to the talk
Baseline comparison with Anthropic's code execution tool (container, no network, 5 GiB, checkpointed, 30-day expiry) and OpenAI's Code Interpreter (VM container, 20-min idle expiry): Google's consumer-API interpreter documents the least about its boundary. A useful illustration that "sandboxed" is often asserted rather than specified at the model-API layer.
