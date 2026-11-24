---
title: Windows platform security for AI agents
url: https://blogs.windows.com/windowsdeveloper/2026/06/02/windows-platform-security-for-ai-agents/
authors: Dana Huang (CVP, Windows Security) and Logan Iyer (CVP, Windows Platform + Developer), Microsoft
date: 2026-06-02 (Microsoft Build 2026)
accessed: 2026-11-22
kind: blog
---

## Summary
Build 2026 announcement of the Microsoft Execution Containers (MXC) SDK
preview: a cross-platform, policy-driven execution layer where developers
declare an agent's constraints and Windows enforces them. It lays out a
ladder of containment: process isolation (lightweight, for model-generated
code), session isolation (separate user account/session), micro-VMs
(roadmap), Linux containers via WSL (roadmap), and Windows 365 for Agents
(cloud PC, GA).

## Key points
- Process isolation: lightweight boundary restricting file and network
  access; adopted by GitHub Copilot CLI.
- Session isolation: agents under separate user accounts, apart from the
  human's desktop, clipboard and input; initial release non-interactive only.
- Agent identity: local or Entra-backed identity per session for audit.
- Micro-VMs (roadmap): hypervisor isolation for higher-risk workloads; the
  post says denser than full VMs but gives no numbers.
- Policies manageable via Agent 365 / Entra / Intune; Defender adds
  prompt-injection protection.
- No startup-time or density figures in the post.

## Excerpts
> "Containment bounds what agents can access and do, so non-deterministic behavior doesn't translate into uncontrollable risk."

> "Sessions in Windows run with distinct user accounts, which enables isolation."

> "It is ideal for use cases like coding agents where the developer inner loop must stay responsive."

## Relevance to the talk
Microsoft's explicit answer to the talk's central question: for coding agents
on Windows the default is a *process* sandbox (no VM), with sessions and
micro-VMs as heavier tiers. Mirrors the Linux/macOS agent tools'
bubblewrap/Seatbelt choice.
