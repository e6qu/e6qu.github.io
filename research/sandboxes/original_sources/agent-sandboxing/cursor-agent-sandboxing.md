---
title: "Implementing a secure sandbox for local agents"
url: https://cursor.com/blog/agent-sandboxing
authors: Ani Betts, Yash Gaitonde, Alex Haugland (Cursor)
date: 2026-02-18
accessed: 2026-11-22
kind: blog
---

## Summary
Cursor's account of sandboxing its agent's terminal commands on macOS, Linux and Windows so agents can run freely inside a boundary and ask only to leave it (most often for internet access). It is the most explicit write-up of *why* the obvious macOS alternatives were rejected, and the only one of the major local agents that uses Landlock directly on Linux (plus an overlay filesystem), where Codex moved away from Landlock to bubblewrap. Windows support is via WSL2 while Cursor works with Microsoft on native primitives.

## Key points
- Motivation: approval fatigue, worse when engineers run several agents in parallel. Result: "Sandboxed agents stop 40% less often than unsandboxed ones"; a third of requests on supported platforms run sandboxed.
- macOS options evaluated: **App Sandbox** (would require signing every binary the agent might run and let agent-built binaries inherit Cursor's trust), **containers** (Linux binaries only), **VMs** (startup latency and memory overhead), **Seatbelt** (chosen). Policy generated at runtime from workspace/admin settings and `.cursorignore`; writes blocked to `.vscode`, `.cursor`, `.git/config`, `.git/hooks`.
- Linux: Landlock for filesystem + seccomp for unsafe syscalls, composed in-house because existing projects lacked `.cursorignore` semantics; workspace mapped into an overlay filesystem where ignored files are replaced by Landlocked copies; remounting is the slowest part. (Cursor's terminal docs additionally mention a bubblewrap fallback reported via `CURSOR_SANDBOX_LANDLOCK_STATUS` — not in the blog.)
- Windows: Linux sandbox inside WSL2; native is "significantly harder" because existing primitives target browsers.
- Harness changes matter: tool descriptions explain the sandbox; failures name the blocking constraint and suggest escalation, fixing agents that retried the same blocked command repeatedly.

## Excerpts
> "Sandboxed agents stop 40% less often than unsandboxed ones"

> "Seccomp blocks unsafe syscalls, while Landlock enforces filesystem restrictions"

> "Building an equivalent native Windows sandbox is significantly harder"

## Relevance to the talk
Second data point (after Anthropic's 84%) that the measurable win of agent sandboxes is fewer human interruptions. The macOS evaluation is a neat slide comparing App Sandbox/containers/VMs/Seatbelt for agents, and the "tell the model why it was blocked" lesson shows the sandbox's error channel is now part of the model interface.
