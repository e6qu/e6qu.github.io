---
title: "Monty: A secure Python sandbox, written in Rust, for code written by AI" (repo README + docs: Security Model, Limitations, Snapshots, Resource limits)
url: https://github.com/pydantic/monty
authors: Pydantic (Samuel Colvin et al.)
date: first release v0.0.1 2026-01-27; v1.0.0 2026-09-25; latest v1.7.0-beta.1 2026-11-20 (docs read from main branch)
accessed: 2026-11-22
kind: repo
---
Docs site: https://pydantic.dev/docs/monty/ (source is `docs/` in the repo; read via `gh api`):
`docs/security.md`, `docs/limitations/index.md`, `docs/snapshots.md`, `docs/resource-limits.md`,
`docs/index.md`, `docs/alternatives.md`.

## Summary
Monty is a from-scratch bytecode interpreter for a subset of Python 3.14, written in Rust, built
to run model-written code. Isolation is "language-level": the VM simply has no opcode or builtin
that touches files, env vars, sockets or processes; everything outside goes through host functions
(`external_lookup`), allow-listed host object wrappers, virtual mounts and an `os=` callback that
the embedding application supplies. Since 1.x the Python/JS bindings run each session in a pooled
worker subprocess (crash isolation), so it is an interpreter sandbox plus a thin process boundary,
not a pure in-process one. It is the engine behind Pydantic AI's "Code Mode" and the successor to
mcp-run-python.

## Key points
- Claims: a new sandbox in under 1 ms from a running pool (OSS) vs ~1500 ms for a sandboxing
  service. The docs' latency table (new sandbox / 10-command agent run): OSS Monty 0.80 ms / 0.40 ms;
  WASI/wasmtime 16 ms / 180 ms; local Docker 195 ms / 700 ms; sandboxing service 1500 ms / 400 ms;
  Pyodide in Deno 2700 ms / 35 ms (vendor's own benchmark).
- No ambient authority: with no mounts/host functions the sandbox cannot read a file, env var, open
  a socket or spawn a process. Exceptions by default: wall clock and OS entropy (both configurable).
  No FFI, no C dependencies; filesystem code lives in a separate crate (`monty-fs`).
- Three opt-in host-access mechanisms: host functions (execution suspends, host code runs "with your
  process's full authority", resumes with result); `ClassInstance`/`ClassType` wrappers with
  name allow-lists defaulting to nothing; mounts (`MountDir` host dir at a virtual path,
  read-only or read-write) plus an `os=` callback / `OSAccess` in-memory FS. `__import__` is undefined;
  imports resolve only against a host-supplied module mapping.
- Python subset: functions, closures, async/await, simple classes and `@dataclass`, comprehensions,
  `match`, f-strings, `eval`/`exec` (source only). Rejected: metaclasses, method decorators
  (`@property`, `@classmethod`), generators (`yield`), `del`, exception groups, `async with/for`.
  No user-defined exception classes. Stdlib is a partial set (~25 modules: json, re, datetime,
  math, collections, itertools, pathlib, os, asyncio [run/gather/sleep only], ...). Absent: `enum`,
  `contextlib`, `io`, `logging`, `urllib`, etc.; `socket`, `subprocess`, `multiprocessing`,
  `threading`, `ctypes` absent by design. **No third-party packages: no `sys.path`, no site-packages.**
- Resource limits: `max_memory` (counts allocator requests, not RSS), `max_feed_duration_secs`
  (execution time, paused while host functions run), `max_turn_duration_secs`, `max_recursion_depth`
  (default 1000), `max_suspensions` (default 1000 host round trips), `request_timeout` (none by
  default for local pools; 10 s for remote). CPU-time clocks only on Linux. After a limit trips, heap
  state is undefined: discard the session.
- Snapshots: whole interpreter state can be dumped to bytes at a suspension or between feeds and
  resumed in another process/machine, possible "because the sandbox holds no operating system
  resources". Snapshots are not authenticated; loading a tampered one may panic or hang.
- Crash isolation: Python/JS native bindings run each session in a `monty` worker subprocess spawned
  with an empty environment; frames from workers are treated as untrusted; workers are reused for 1000
  checkouts by default (set to 1 for mutually distrustful callers). The Rust `monty` crate runs
  in-process (language sandbox holds, crash isolation does not). The WASM build runs in a Web Worker /
  `worker_threads`; JS-engine crashes or process-wide OOM can still hit the host.
- Commercial "Commercial Support" server runs the same sandbox behind gRPC with OS-level isolation;
  a remote peer "need not be a Monty sandbox at all".
- Known escapes: none published. GitHub repo security-advisories endpoint and the GitHub Advisory DB
  returned no advisories for `pydantic/monty` / `pydantic-monty` (checked 2026-11-22). A continuous
  bug bounty exists. Security-critical code named by the docs: `crates/monty/src/heap/` (arena, free
  list, refcounting) and the mount table/path policy.

## Excerpts
> "Monty is a **language-level sandbox**, not an OS-level one. There is no container, no seccomp filter and no virtual machine." — docs/security.md, "What 'secure' means here"

> "Monty guarantees that the sandbox reaches nothing you did not hand it. It cannot guarantee that what you handed it is safe." — docs/security.md, "Host functions"

> "Monty is a sandbox, not a Python implementation aiming for completeness. It implements enough Python for a model to express what it wants to do, and deliberately stops there." — docs/limitations/index.md

## Relevance to the talk
Canonical **restricted interpreter** (and, via `external_lookup`, **code-against-bindings**). The
guarantee comes from absence: the VM has no syscall-shaped operations, so the trusted base is one
Rust interpreter (heap/refcount code and the mount boundary), not the kernel. Costs are large in
compatibility: no pip, no numpy/pandas, no git, no shell, no binaries, a CPython subset with whole
language features missing, so it suits "glue code calling tools", not a coding agent that builds and
tests a repo. Failure modes it documents itself: host functions you write are full-authority holes;
memory accounting is approximate; time budgets reset per feed; untrusted snapshots; the interpreter
itself is a memory-safety-critical TCB. Interesting design arc: Pydantic added a worker-subprocess
boundary for crash isolation, and sells an OS-isolated server for defence in depth, i.e. even the
in-process camp layers a process/VM boundary underneath.
