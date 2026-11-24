---
title: Sandboxing Agentic AI Workflows with WebAssembly
url: https://developer.nvidia.com/blog/sandboxing-agentic-ai-workflows-with-webassembly/
authors: Joseph Lucas (NVIDIA)
date: 2024-12-16
accessed: 2026-11-22
kind: blog
---

## Summary
NVIDIA's AI red team proposes moving execution of LLM-generated Python (e.g. plotting code) off the server and into the *user's browser*: the server returns HTML embedding Pyodide plus the generated code, and the browser tab runs it. The argument is that regex filtering and restricted Python runtimes are bypassable, microVMs are heavy, and the browser sandbox already exists. A January 2026 NVIDIA follow-up on agent sandboxing does not mention Wasm at all and recommends full virtualization instead.

## Key points
- Threat model: prompt injection or model error makes the LLM emit malicious code; if the server `eval`s it, the app, host OS and other users are exposed.
- Rejected alternatives: regex sanitization and restricted runtimes (bypassable, e.g. reaching `subprocess` through dependency internals); Firecracker-style microVMs ("resource and engineering intensive").
- Design: HTML response includes Pyodide; packages (e.g. Plotly) installed client-side via micropip; malicious code that needs unavailable modules simply fails "in the narrowly scoped Pyodide runtime".
- Blast radius moves to the querying user's own browser tab; the post frames it as improving controls "for the querying user", not eliminating risk.
- Follow-up, Rich Harang, "Practical Security Guidance for Sandboxing Agentic Workflows and Managing Execution Risk" (2026-01-30, https://developer.nvidia.com/blog/practical-security-guidance-for-sandboxing-agentic-workflows-and-managing-execution-risk): no mention of WebAssembly; recommends running agentic tools "within a fully virtualized environment isolated from the host kernel at all times" (VMs, unikernels, Kata), with gVisor as an intermediate option and shared-kernel sandboxes as weaker.

## Excerpts
> "Sanitizing Python with regular expressions and restricted runtimes is insufficient" (2024 post)

> "The browser sandbox is what prevents webpages from accessing local filesystems or viewing webcams without authorization" (2024 post)

> "Imagine a scenario where the LLM returns malicious code, either as a result of prompt injection or error." (2024 post)

## Relevance to the talk
The canonical "browser as sandbox" argument for agent-generated code: here the Pyodide host is a browser renderer (designed for hostile code, with site isolation), unlike the Deno host in mcp-run-python. Works for *analysis/visualisation* snippets, not for coding agents that need a shell, git and package managers. NVIDIA's own 2026 guidance for coding agents moved to VMs — a neat before/after for the Wasm class.
