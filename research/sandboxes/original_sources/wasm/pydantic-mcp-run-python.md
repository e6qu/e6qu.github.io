---
title: "MCP Run Python" (pydantic/mcp-run-python), README incl. archive notice
url: https://github.com/pydantic/mcp-run-python
authors: Pydantic (Samuel Colvin et al.)
date: repo created 2025-09-01 (code previously in pydantic-ai); archive notice committed 2026-01-30 (commit 4f93a92); repo archived
accessed: 2026-11-22
kind: repo
---

## Summary
An MCP server that ran LLM-written Python inside Pyodide (CPython compiled to Wasm) hosted by Deno, marketed as "Secure Execution … in a sandboxed WebAssembly environment". In January 2026 Pydantic archived it with an unusually blunt notice: Python in Pyodide can call arbitrary JavaScript, so the sandbox is only as tight as the JS runtime around it, and Deno cannot cap memory. Pydantic replaced it with Monty, a Python interpreter written in Rust (an in-process, not Wasm, sandbox).

## Key points
- Architecture: `uvx mcp-run-python {stdio,streamable-http,…}`; Python code runs in Pyodide inside a Deno process; dependencies auto-installed (micropip). Originally part of Pydantic AI, split out 2025-09.
- Archive notice (2026-01-30) lists three concrete failure modes of Pyodide-in-Deno as a sandbox: (1) guest Python can run arbitrary JS and so "taint" the runtime for later invocations (state persists across runs); (2) it can read/write any files the JS runtime can; (3) it can OOM the machine because Deno "has no good way limit memory usage".
- The notice explicitly says these are not bugs in Pyodide or Deno: "those tools were not designed as sandboxes to run untrusted code."
- Successor: [pydantic/monty](https://github.com/pydantic/monty) — "A secure Python sandbox, written in Rust, for code written by AI"; README claims a new sandbox in "under 1ms" from a running pool vs "around 1500ms" for a sandbox service; no filesystem, env or network inside — host reached only via functions/mounts passed in (capability style, but in-process interpreter, not Wasm).
- GitHub metadata (gh api, 2026-11-22): archived = true, ~193 stars.

## Excerpts
> "We've decided to retire and archive this project - there's just no safe way to run Python within pyodide safely with reasonable latency." (README, NOTICE)

> "**Python code running in pyodide can run arbitrary javascript** meaning it can do whatever the javascript runtime running pydodie can do" (README, NOTICE; typo in original)

> "These issues are not problems with Pyodide or Deno - they're behaving as advertised, it's just that those tools were not designed as sandboxes to run untrusted code." (README, NOTICE)

## Relevance to the talk
The cleanest primary-source example of "Wasm is a memory sandbox; the host interface is the attack surface". Pyodide's host is a full JS runtime with an FFI (`import js`), so the Wasm boundary contributes almost nothing unless the embedding JS runtime is itself locked down (Deno permissions) and resource-limited. Also shows the per-run statefulness problem: a long-lived interpreter process lets one run poison the next. Pair with langchain-sandbox.md (same architecture, also abandoned) and nvidia-sandboxing-agentic-workflows-wasm-2024.md (same idea, but the host is a browser tab, which *is* designed as a sandbox).
