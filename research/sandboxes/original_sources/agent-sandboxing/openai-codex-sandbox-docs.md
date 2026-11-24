---
title: "Sandbox" (Codex documentation)
url: https://learn.chatgpt.com/docs/sandboxing
authors: OpenAI
date: living document; formerly at developers.openai.com/codex/concepts/sandboxing (now 308-redirects); read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
User documentation for Codex's local sandbox modes and approval policies. It separates the *sandbox* (technical boundary) from the *approval policy* (when the agent must stop and ask), and frames the sandbox explicitly as a cure for approval fatigue. Per-OS backends: Seatbelt (macOS, works out of the box), bubblewrap (Linux/WSL2; first `bwrap` on PATH, otherwise a bundled helper needing unprivileged user namespaces), native Windows sandbox for PowerShell.

## Key points
- Sandbox modes: `read-only`; `workspace-write` (default for local work: edit inside the workspace, run routine commands); `danger-full-access` (no filesystem or network boundary).
- Approval policies: `on-request` (ask when going beyond the sandbox) and `never`; `untrusted` no longer selectable. `approvals_reviewer` can be `user` or `auto_review` (a reviewer agent) — automatic review "doesn't change the sandbox boundary".
- Common combos: full access = `danger-full-access` + `never`; lower-risk = `workspace-write` + `on-request`.
- Writable roots extendable; command-prefix rules allow/prompt/forbid commands outside the sandbox.
- Cloud ("Work cloud"): public internet off by default; only hostnames from a managed allowlist.
- Ubuntu 24.04 AppArmor restriction on unprivileged user namespaces may need a profile or relaxing.

## Excerpts
> "The sandbox is the boundary that lets the agent act autonomously without giving it unrestricted access to your machine."

> "The sandbox defines technical boundaries."

> "The sandbox reduces approval fatigue."

## Relevance to the talk
Vocabulary slide: the two orthogonal knobs (boundary vs approval policy) are now standard across agents, and "approval fatigue" appears verbatim in both OpenAI and Anthropic docs. The `auto_review` reviewer-agent option shows HITL being partly replaced by a second model.
