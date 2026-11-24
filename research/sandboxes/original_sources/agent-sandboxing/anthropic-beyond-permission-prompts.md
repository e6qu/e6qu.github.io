---
title: "Beyond permission prompts: making Claude Code more secure and autonomous"
url: https://www.anthropic.com/engineering/claude-code-sandboxing
authors: David Dworken, Oliver Weller-Davies (Anthropic), with contributions from Meaghan Choi, Catherine Wu, Molly Vorwerck, Alex Isken, Kier Bradwell, Kevin Garcia
date: 2025-10-20
accessed: 2026-11-22
kind: blog
---

## Summary
Anthropic's engineering post announcing sandboxing for Claude Code's bash tool and the open-sourcing of `sandbox-runtime` (same day the repo was created). The framing is explicitly about usability as security: per-action permission prompts cause "approval fatigue", so instead of asking about each command, a sandbox defines a boundary inside which Claude can act freely. It also describes the architecture of Claude Code on the web, where credentials are kept entirely outside the cloud sandbox and injected by a git proxy.

## Key points
- Claude Code is read-only by default and asks before edits/commands; frequent prompts lead users to stop scrutinising what they approve.
- Internal result: sandboxing reduced permission prompts by **84%**.
- Two boundaries, both required: **filesystem** (read/write CWD, no modification outside) and **network** (only via a Unix domain socket to a proxy outside the sandbox that restricts domains and asks the user to confirm new ones; customisable by organisations).
- Mechanisms: bubblewrap on Linux, Seatbelt on macOS; restrictions cover child processes and scripts, not just Claude's direct actions. Enabled with `/sandbox`.
- Attempts to leave the boundary produce a notification and the user decides.
- **Claude Code on the web:** each session in an isolated cloud sandbox; git credentials and signing keys never enter it. A custom git proxy receives requests authenticated with a scoped credential, validates both credential and request content (e.g. push only to the configured branch), then attaches the real GitHub token.

## Excerpts
> "In our internal usage, we've found that sandboxing safely reduces permission prompts by 84%."

> "It is worth noting that effective sandboxing requires both filesystem and network isolation."

> "sensitive credentials (such as git credentials or signing keys) are never inside the sandbox with Claude Code."

> "This way, a compromised Claude Code can't steal your SSH keys, or phone home to an attacker's server."

## Relevance to the talk
The clearest statement of a new design goal: the sandbox exists to *remove human prompts*, not only to contain malware. The 84% number and "approval fatigue" are the hook for the HITL-challenge slide; the git proxy with scoped credentials is the canonical "keep secrets outside, inject at the boundary" pattern.
