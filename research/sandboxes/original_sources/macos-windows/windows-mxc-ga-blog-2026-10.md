---
title: "Microsoft Execution Containers: Policy-driven containment for AI agents"
url: https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/
authors: Logan Iyer (CVP, Windows Platform + Developer, Microsoft)
date: 2026-10-07 (same day as MXC v1.0.0 release on GitHub)
accessed: 2026-11-22
kind: blog
---

## Summary
Announces MXC as generally available. Describes the "process container" as a
lightweight containment option using each OS's native sandbox — AppContainer
on Windows, Seatbelt on macOS, Bubblewrap on Linux — with policies over
process, filesystem, network (incl. loopback) and UI held outside the
workload's control. Lists adopters and upcoming Intune/Entra management.

## Key points
- Native primitives per OS: AppContainer (Windows), Seatbelt (macOS),
  Bubblewrap (Linux).
- Modes: enforcement, learning (block + record to JSON report; Windows only),
  permissive (allow + record).
- Session containers are Windows-only.
- Adopters named as already supporting MXC: GitHub Copilot, OpenAI Codex,
  OpenClaw, Replit, LM Studio, Unsloth AI; NVIDIA integrated OpenShell.
  Anthropic Claude Code, Box, Egnyte, Perplexity listed as future adopters.
- Intune policy for MXC process containers and Entra/Agent 365 identity
  "coming soon"; Windows 365 support GA.
- No startup or overhead numbers.

## Excerpts
> "An agent cannot be its own security authority."

> "Microsoft Execution Containers (MXC), now generally available, provides the containment layer."

> "Only Windows supports a session container."

## Relevance to the talk
Marks the point (autumn 2026) where per-process, OS-native sandboxes became
Microsoft's recommended default for local agents — and where Windows, macOS
and Linux converge on the same "no VM per agent" pattern behind one policy
format. Adopter list is a vendor claim; verify per product.
