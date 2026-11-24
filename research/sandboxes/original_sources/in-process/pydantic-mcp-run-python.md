---
title: "MCP Run Python" (pydantic/mcp-run-python README, archive notice) + GHSA-6fgp-m6q4-j3q5 / GHSA-pfv4-wmph-5gc6
url: https://github.com/pydantic/mcp-run-python
authors: Pydantic; advisories reported via JFrog Security Research
date: repo created 2025-09-01 (code earlier lived in pydantic-ai); archive-notice commit 2026-01-30; CVEs published 2026-02-09
accessed: 2026-11-22
kind: repo
---
Advisories: https://github.com/advisories/GHSA-6fgp-m6q4-j3q5 (CVE-2026-25904),
https://github.com/advisories/GHSA-pfv4-wmph-5gc6 (CVE-2026-25905). JFrog write-ups linked from them:
https://research.jfrog.com/vulnerabilities/mcp-run-python-deno-ssrf-jfsa-2026-001653029 and
https://research.jfrog.com/vulnerabilities/mcp-run-python-lack-of-isolation-mcp-takeover-jfsa-2026-001653030 (not read directly).

## Summary
mcp-run-python was an MCP server that ran LLM-written Python in Pyodide (CPython compiled to Wasm)
inside a Deno process, relying on Deno's permission flags as the outer fence. Pydantic archived it
(GitHub `archived: true`; notice committed 2026-01-30), saying there is no safe way to run Python in
Pyodide with reasonable latency, and pointed users to Monty. Two CVEs followed in February 2026: an
SSRF because the default Deno config granted unrestricted network (including localhost), and a
sandbox escape/server takeover because Pyodide's `js` bridge lets Python rewrite the host JS runtime,
including shadowing other MCP tools. Neither will be patched.

## Key points
- Architecture: Python (Pyodide) → JS runtime (Deno) → OS, with Deno flags as the only OS-facing
  policy. Two-phase dependency install: first `deno` run with write access to `node_modules` to
  install wheels, then the untrusted-code run with `--allow-read=./node_modules` only.
- Network default: in `mcp_run_python/main.py`, `allow_networking: bool = True` and `_deno_run_args`
  adds a bare `--allow-net` when it is true (verified in source), i.e. all hosts including loopback.
- Archive notice lists the failure modes explicitly: Pyodide code can run arbitrary JS; can taint the
  runtime for later invocations; can read/write any file the runtime can; can OOM the machine because
  "deno has no good way limit memory usage".
- CVE-2026-25904 (GHSA-6fgp-m6q4-j3q5, medium): Deno sandbox misconfiguration → SSRF to host
  loopback services / cloud metadata. Affects `mcp-run-python <= 0.0.22`; no patch.
- CVE-2026-25905 (GHSA-pfv4-wmph-5gc6, medium in GHSA rating, described as "Critical Sandbox Escape &
  Server Takeover" in text): `runPython`/`runPythonAsync` do not restrict the Pyodide `js` module, so
  Python can modify the global JS environment and "shadow" registered MCP tools. Affects `<= 0.0.22`;
  no patch; advisory says stop using the package.
- Monty's docs benchmark Pyodide-in-Deno at ~2700 ms to a new sandbox (cold start), the main latency
  complaint.

## Excerpts
> "We've decided to retire and archive this project - there's just no safe way to run Python within pyodide safely with reasonable latency." — README, NOTICE

> "In particular **Python code running in pyodide can run arbitrary javascript** meaning it can do whatever the javascript runtime running pydodie can do" — README, NOTICE (typo "pydodie" is in the original)

> "These issues are not problems with Pyodide or Deno - they're behaving as advertised, it's just that those tools were not designed as sandboxes to run untrusted code." — README, NOTICE

## Relevance to the talk
A cautionary **restricted-interpreter-by-composition** example: "Wasm interpreter inside a
permissioned JS runtime" sounds like two layers, but Pyodide deliberately exposes the JS host (the
`js` FFI), so the inner layer is not a boundary at all and the outer one (Deno flags) was configured
wide open by default. Failure shapes worth naming on a slide: SSRF via over-broad egress, cross-tool
contamination (tool shadowing) because guest and MCP server share one runtime, no memory cap, and
state taint across invocations. Compatibility was good (real CPython, numpy via Pyodide wheels) but
startup was seconds. The vendor's own conclusion (archive + move to a purpose-built interpreter) is
the punchline.
