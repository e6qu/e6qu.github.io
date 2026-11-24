---
title: "LangChain Sandbox" (langchain-ai/langchain-sandbox README) + Deep Agents docs "Sandboxes", "Backends", "Interpreters" + blog "Running Untrusted Agent Code Without a Sandbox"
url: https://github.com/langchain-ai/langchain-sandbox
authors: LangChain (blog post by Hunter Lovell)
date: langchain-sandbox repo created 2025-04-15, archived (last push 2026-01-14); blog 2026-06-30; Deep Agents docs undated (read live)
accessed: 2026-11-22
kind: repo
---
Also: https://docs.langchain.com/oss/python/deepagents/sandboxes ,
https://docs.langchain.com/oss/python/deepagents/backends ,
https://docs.langchain.com/oss/python/deepagents/interpreters ,
https://www.langchain.com/blog/running-untrusted-agent-code-without-a-sandbox
(docs and blog read via fetch-and-extract tool; quotes as returned).

## Summary
LangChain's first answer, `langchain-sandbox` (2025), ran Python in Pyodide under Deno, like
Pydantic's mcp-run-python; it is now archived with a "no longer maintained, not for production"
banner. Deep Agents (2026) splits the problem in two: **sandbox backends** that give the agent an
`execute` shell tool inside remote containers/VMs (LangSmith, Daytona, E2B, Modal, Runloop, Vercel,
AgentCore, ...), and **interpreters**: an in-process QuickJS-in-Wasm REPL (`langchain-quickjs`)
with no filesystem, network, shell, package manager or clock, into which selected tools are exposed
("programmatic tool calling"). Plus virtual-FS backends (agent state / store) and an explicitly
unsandboxed `LocalShellBackend`.

## Key points
- langchain-sandbox (archived): "We do not recommend using `langchain-sandbox` for any production use
  cases." Security depends on Deno flags passed to `PyodideSandbox`; README warns broad permissions let
  untrusted code reach host resources and to use `allow_net` to avoid SSRF; examples use
  `allow_net=True` so Pyodide can install packages. Limits: "a few seconds of latency" to start per
  run; no file access; `requests` unsupported (use `httpx`). Stateful mode pickles session state
  (`session_bytes`). **In-process (Wasm in Deno).**
- Deep Agents backends: `StateBackend` (default; files in LangGraph agent state: virtual,
  in-process), `StoreBackend` (LangGraph store), `ContextHubBackend` (LangSmith Hub repo),
  `CompositeBackend` (path router), `FilesystemBackend` (real disk; "the default
  (`virtual_mode=False`) provides no security even with `root_dir` set"), `LocalShellBackend`
  (`subprocess.run(shell=True)` "with no sandboxing", "unrestricted shell execution on your host").
- Sandbox backends (**remote containers/VMs, not in-process**): LangSmith, Daytona, E2B, Modal,
  Runloop, Vercel, AgentCore code interpreter, Databricks, NVIDIA OpenShell. They add "an `execute`
  tool for running arbitrary shell commands in the sandbox". Docs: "**Never put secrets inside a
  sandbox.**" and sandboxes alone do not protect against context injection or network exfiltration.
- Interpreters (**in-process**): "Interpreter code runs in QuickJS compiled to WebAssembly" (Python:
  `quickjs-rs` on wasmtime; JS: QuickJS-Emscripten). Default: no host filesystem, network, shell,
  package manager, or clock. PTC exposes allow-listed tools under a global `tools` namespace. Limits:
  64 MB QuickJS heap per thread, 5 s per `eval` by default. Per-thread runtime; state can persist per
  turn or be fresh per call. Docs: "a wasmtime vulnerability is the remaining path out of the
  sandbox"; "`fs` calls the backend directly, not the filesystem tools", so permissions/approvals don't
  apply to it. Packages described as experimental/beta.
- Blog (2026-06-30): the interpreter is for orchestration (e.g. dynamic subagents); Wasm linear memory
  is the boundary; interpreter memory is serialised to LangGraph state for durable pauses; for a
  filesystem/shell/deps, use LangSmith Sandboxes (remote container).
- No Monty or Pyodide interpreter option found in current Deep Agents docs (searched; absence not
  proven).

## Excerpts
> "This package is no longer maintained. These days we recommend accessing code execution either through sandbox APIs or LLM provider APIs." — langchain-sandbox README, warning banner

> "Treat that as a scoped interpreter runtime, not a full production sandbox backend." — Deep Agents docs, "Interpreters" (per extraction)

> "Out of the box it can't read a file, make a network request, or install a dependency." — blog, "Running Untrusted Agent Code Without a Sandbox" (per extraction)

## Relevance to the talk
Shows the industry's 2026 split cleanly: **in-process interpreter for composing tools** (QuickJS/Wasm:
code-against-bindings, no OS) versus **remote container/VM for acting on an environment** (shell,
packages, tests). LangChain went through the same arc as Pydantic: Pyodide+Deno (archived) → a
purpose-built small interpreter for glue code, while delegating real coding work to remote sandboxes.
Costs of the in-process tier: JavaScript only, no git/npm/pip/binaries, 64 MB / 5 s defaults. Failure
modes it names: wasmtime bugs; every PTC-exposed tool is authority; `fs` bridge bypasses approval
layers. Also a useful "virtual filesystem in agent state" example (`StateBackend`) as a simulated
environment without code execution.
