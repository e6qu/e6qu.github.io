---
title: "LangChain Sandbox" (langchain-ai/langchain-sandbox), README
url: https://github.com/langchain-ai/langchain-sandbox
authors: LangChain
date: repo created 2025-04-15; maintenance notice 2026-01-14 (PR #65); repo archived
accessed: 2026-11-22
kind: repo
---

## Summary
A Python package (`PyodideSandbox`) that runs untrusted Python through Pyodide inside a Deno subprocess, with Deno permission flags (e.g. `allow_net`) as the outer policy. It supported stateful sessions by pickling interpreter state. In January 2026 LangChain marked it unmaintained and told users to get code execution from "sandbox APIs or LLM provider APIs" instead; the repo is now archived.

## Key points
- Security relies on two layers: Pyodide's Wasm sandbox and Deno's permission model. README: if you grant broad Deno permissions (host filesystem, unrestricted network) "sandboxed or untrusted code may access your host resources".
- README tells users to restrict `allow_net` "to avoid SSRF attacks" — network policy is the host runtime's, not Wasm's.
- Limitations stated: "a few seconds of latency when starting the sandbox per run" (example output shows `execution_time=2.857…` s for a numpy snippet); no file access from outside; networking via `httpx.AsyncClient` only.
- Stateful mode returns `session_bytes` (pickled state) and warns it "should not be unpickled" outside the sandbox — a reminder that state crossing the boundary is itself an attack vector.
- Notice (2026-01-14): "no longer maintained"; "We do not recommend using `langchain-sandbox` for any production use cases."
- GitHub metadata (gh api): archived = true, ~242 stars.

## Excerpts
> "This package is no longer maintained. These days we recommend accessing code execution either through sandbox APIs or LLM provider APIs." (README warning)

> "If you grant broad permissions (such as host file system or unrestricted network access) via arguments passed to `PyodideSandbox`, sandboxed or untrusted code may access your host resources." (README, Security Considerations)

> "There is a few seconds of latency when starting the sandbox per run" (README, Limitations)

## Relevance to the talk
Second of the two 2025 "Pyodide + Deno" agent sandboxes from major agent frameworks; both were abandoned within ~9 months in favour of hosted sandboxes (VMs/gVisor) or a purpose-built interpreter. Startup was *seconds*, not the microseconds Wasm is famous for — because the payload is a whole CPython + packages, not a small module. Evidence that, for general agent code, server-side Wasm-Python lost to microVMs on both safety confidence and practicality.
