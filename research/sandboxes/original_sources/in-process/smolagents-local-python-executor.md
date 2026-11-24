---
title: "Secure code execution" (smolagents docs) + GitHub advisories for LocalPythonExecutor escapes
url: https://huggingface.co/docs/smolagents/tutorials/secure_code_execution
authors: Hugging Face (smolagents team)
date: docs page undated (read live, latest release v1.26.0 2026-05-29); advisories 2025-07-27 to 2026-09-26
accessed: 2026-11-22
kind: docs
---
Source also read: `src/smolagents/local_python_executor.py` on main (constants, deny-lists).
Advisories: https://github.com/advisories/GHSA-6v92-r5mx-h5fx (CVE-2025-5120),
https://github.com/advisories/GHSA-p8v6-48p4-f4r4 (CVE-2025-9959),
https://github.com/advisories/GHSA-54fq-v6x8-244g (CVE-2026-4963),
https://github.com/advisories/GHSA-q9r5-6hrr-9ph7 (CVE-2025-14931, remote executor, not local).

## Summary
smolagents' `CodeAgent` executes model-written Python by default in `LocalPythonExecutor`, a
custom evaluator that parses the code to an AST and walks it node by node in the host CPython
process, enforcing an import allow-list, blocking dangerous modules/functions and dunder access, and
capping operation and loop counts. The docs say outright that no local Python sandbox can be
completely secure and that robust isolation needs remote executors (E2B, Docker, Modal, Blaxel).
History bears this out: at least three CVEs describe escapes from the local executor, one of them an
incomplete fix of another.

## Key points
- Mechanism (docs): imports disallowed unless explicitly authorised; submodules need explicit
  authorisation (or `numpy.*`); total elementary operations capped; any AST node type not implemented
  raises an error. Docs warn that innocuous modules expose dangerous ones, e.g. `random._os`.
- Numbers (source, main): `MAX_OPERATIONS = 10000000`, `MAX_WHILE_ITERATIONS = 1000000`,
  `MAX_EXECUTION_TIME_SECONDS = 30`. The timeout uses a thread; the source notes the thread "cannot be
  forcefully killed in Python, so it will continue running in the background".
- Deny-lists (source, self-described "Non-exhaustive"): `DANGEROUS_MODULES` = builtins, io,
  multiprocessing, os, pathlib, pty, shutil, socket, subprocess, sys; `DANGEROUS_FUNCTIONS` =
  compile, eval, exec, globals, locals, `__import__`, `os.popen`, `os.system`, `posix.system`.
- Docs' own example of residual risk: if `Pillow` is authorised, code can fill the disk with images;
  escapes may exploit "deeper vulnerabilities in authorized packages".
- Remote executor options: `executor_type="blaxel" | "e2b" | "modal" | "docker"`; two patterns,
  sandbox just the snippets (tools/model stay local) vs the whole agent (needs credentials inside).
- A Pyodide+Deno `WasmExecutor` was added in v1.20.0 (2025-07-10, PR #1261), hardened in v1.25.0
  (loopback-only bind, per-instance Deno cache), and removed in v1.26.0 (2026-05-29, PR #2321,
  "Remove remote WasmExecutor") per release notes; the reason is not stated in the notes (Unverified).
- **CVE-2025-5120 / GHSA-6v92-r5mx-h5fx (critical, 2025-07-27)**: sandbox escape in
  `local_python_executor.py` in v1.14.0; "Attackers can exploit whitelisted modules and functions to
  execute arbitrary code"; fixed in 1.17.0 (huntr report).
- **CVE-2025-9959 / GHSA-p8v6-48p4-f4r4 (high, published 2026-09-26)**: "Incomplete validation of
  dunder attributes allows an attacker to escape from the Local Python execution environment sandbox";
  requires prompt injection to get the agent to write the code; refs PR #1551 and a JFrog write-up.
- **CVE-2026-4963 / GHSA-54fq-v6x8-244g (rated low, 2026-03-27)**: code injection via
  `evaluate_augassign`/`evaluate_call`/`evaluate_with`, described as "Incomplete Fix CVE-2025-9959"
  in smolagents 1.25.0.dev0; public exploit; vendor reportedly did not respond; no patched version listed.
- Not a local-executor issue but relevant: CVE-2025-14931 (critical) is pickle deserialisation RCE in
  the *Remote* Python Executor (`<= 1.23.0`), i.e. the bridge back from the sandbox was the hole.

## Excerpts
> "It's important to understand that no local python sandbox can ever be completely secure." — docs, "Our local Python executor" (warning box)

> "The only way to run LLM-generated code with truly robust security isolation is to use remote execution options like E2B or Docker" — docs, same warning box

> "Incomplete validation of dunder attributes allows an attacker to escape from the Local Python execution environment sandbox, enforced by smolagents." — GHSA-p8v6-48p4-f4r4

## Relevance to the talk
The textbook **restricted interpreter done by deny-listing inside the host language** (lineage:
RestrictedPython, `pysandbox`, "pyjail" CTFs). It keeps full CPython and real third-party libraries
(numpy, pandas if allow-listed), so compatibility is far better than Monty, but every authorised
module drags in the whole host object graph, and Python introspection (`__class__`, `__subclasses__`,
`__globals__`, module attributes) gives countless paths back to `os`. The CVE chain (escape → fix →
"incomplete fix" escape) is the empirical argument that you cannot enumerate badness in a dynamic
language sharing the host heap. Costs: no shell, no pip install at runtime, no files unless allowed,
op-count caps that break heavy compute, and a timeout that cannot actually kill the thread. Contrast
directly with Monty (allow-by-construction interpreter) and with remote containers (the docs' own
recommendation).
