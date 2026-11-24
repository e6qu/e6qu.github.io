---
title: "GKE Code Executor" (ADK docs) and `google/adk-python` `src/google/adk/code_executors/` (source)
url: https://adk.dev/integrations/gke-code-executor/
authors: Google (Agent Development Kit)
date: GKE executor "Supported in ADK Python v1.14.0"; source read at `main` on 2026-11-22 (docs moved from google.github.io/adk-docs to adk.dev; the old code-executors page 404s)
accessed: 2026-11-22
kind: repo
---

## Summary
Google's Agent Development Kit lets an agent run model-written code through pluggable "code executors". They span the whole isolation spectrum, from none (a local subprocess) through a hardened Docker container to gVisor pods on GKE and managed Agent Platform sandboxes. The class names and docstrings are honest about which is which ("Unsafe"). The executors map one-to-one onto the Google products in this folder.

## Key points
Executors in `code_executors/` (source files read 2026-11-22):
- **`UnsafeLocalCodeExecutor`** — "unsafely execute[s] code in the current local context": a child `python` via `subprocess.Popen`, code sent on stdin and `exec()`ed; no isolation; `timeout_seconds` default 300 then SIGTERM/SIGKILL of the process group; cannot be stateful.
- **`ContainerCodeExecutor`** — Docker: "By default the container is started with networking disabled and all Linux capabilities dropped" (`network_disabled=not self.network_enabled`, `cap_drop=['ALL']`, `security_opt=['no-new-privileges']`); default image `adk-code-executor:latest`; "this executor cannot be stateful".
- **`BuiltInCodeExecutor`** — uses the Gemini model's built-in code execution tool (see `google-gemini-code-execution.md`).
- **`VertexAiCodeExecutor`** — Vertex AI Extensions code interpreter; deprecated with Extensions' retirement, migration target is the Agent Engine sandbox (per wikidocs summary of the docstring; not re-read).
- **`AgentEngineSandboxCodeExecutor`** — Agent Platform Code Execution (gVisor container; see `google-agent-engine-code-execution.md`). Creates an Agent Engine lazily if none given; stores one sandbox name per **user session** in session state and reuses it while running; creates sandboxes with a 1-year TTL to match `VertexAiSessionService`, noting "if it hasn't been used for 14 days, the state will be lost"; warns that a static `sandbox_resource_name` "can leak state across user sessions".
- **`GkeCodeExecutor`** — Job mode: "Uses the GKE Sandbox environment with gVisor for workload isolation"; "Each code execution runs in its own ephemeral Pod, to prevent state transfer between executions"; Job and ConfigMap deleted afterwards; CPU/memory requests/limits configurable; `timeout_seconds` 300. Sandbox mode (recommended): creates a `SandboxClaim` from a template, runs, deletes the claim, using Agent Sandbox warm pools (see `google-gke-agent-sandbox.md`). Network policy, non-root and read-only rootfs are not described on the page.
- Announced but not verified as shipped: `CloudRunSandboxCodeExecutor` (Cloud Run sandboxes blog, July 2026).

## Excerpts
> "By default the container is started with networking disabled and all Linux capabilities dropped" (`container_code_executor.py` docstring)

> "Each code execution runs in its own ephemeral Pod, to prevent state transfer between executions." (GKE Code Executor docs)

## Relevance to the talk
A compact illustration of the isolation ladder inside one framework: subprocess → container (no net, no caps) → gVisor pod → managed gVisor sandbox with multi-day state. Also a concrete instance of the per-session-sandbox design choice and its failure mode (one shared sandbox leaks state between users).
