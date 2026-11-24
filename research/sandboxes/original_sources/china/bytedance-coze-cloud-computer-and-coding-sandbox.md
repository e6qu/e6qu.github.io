---
title: Cloud computer / Third-party curated agents / AI coding environment / Quotas and limits / Local device — Coze docs (Chinese-language page)
url: https://docs.coze.cn/cozespace_device.md
authors: ByteDance (Coze)
date: undated pages (current as of 2026-11; cloud-computer spec change effective 2026-09-08; cloud-device billing from 2026-06-01; Coze 3.0 per press 2026-06)
accessed: 2026-11-22
kind: docs
---

## Summary
Coze's current docs at docs.coze.cn cover both the former Coze Space pages (`cozespace_*`) and Coze's AI coding product. Press reports date Coze 3.0 to June 2026. The docs describe three places agents run:
- **Cloud computer.** A persistent, always-on cloud machine per user, 1 by default, sized 2/4/8 vCPU. It hosts "third-party curated agents" built on Claude Code, Codex CLI, OpenClaw, Hermes or Coze's own agent, all running on Coze-provided models.
- **Per-project cloud sandbox.** One for each AI-coding project, capped at 1 GB or 3 GB of disk and reclaimed after 1 hour idle.
- **The user's own PC.** Through the desktop app, with approval prompts for high-risk commands and per-folder grants.

The docs never name the isolation technology and say nothing about cloud egress controls.

## Key points
- Isolation unit:
  - Cloud computer: one per user. Several agents share one machine: 2 vCPU/4 GiB runs 1 agent, 4/8 runs 5, 8/16 runs 10. Since 2026-09-08 those are the only three sizes; existing 16/32 and 32/64 machines continue. The docs say third-party agents are fully isolated from the user's local device (translated from Chinese). They do not say whether the machine is a VM or a container.
  - Billing calls the compute a "virtual machine" used for file processing, browser automation and code execution (translated from Chinese; task fee page, https://docs.coze.cn/coze_pro_task_fee.md).
  - AI-coding projects: an isolated cloud sandbox is created for each project, with OS, dependencies and preview (translated from Chinese; AI coding environment page). Runtime not named.
  - Cloud phone: a 24/7 cloud Android device (https://docs.coze.cn/yun-shou-ji.md).
- Agents sharing a cloud computer: several agents, including different frameworks, can be deployed on one cloud computer. The docs describe no isolation between agents on the same machine. If the machine changes owner, the Claude Code, Codex CLI and OpenClaw agents on it stop working and cannot be recovered.
- Network egress: not documented. The docs promise users need not deal with network or account issues (translated from Chinese), meaning it reaches overseas-framework tooling out of the box. Enterprise VPC private link and a fixed-IP option for plugins exist (enterprise flagship only).
- Persistence:
  - Cloud computer: persistent and always on. Agents keep running when the user's PC is off or offline (translated from Chinese).
  - Coding sandbox: idle reclaim after 1 hour without activity. The disk cap is 1 GB for workflows, agents, skills and personal assistants, and 3 GB for mobile, web, mini-program and imported projects. When the disk is full the project stops running (https://docs.coze.cn/guides_vibe_coding_limit.md).
- Safety guidance on the cloud computer page is advisory only: use a dedicated account, download only from official sources, and store no sensitive personal data.
- Local device (https://docs.coze.cn/cozespace_local_device.md):
  - The desktop app lets the agent read and write authorized folders and run some local shell commands.
  - "Least privilege by default" (translated from Chinese): local capability is off until enabled, and folders are granted per agent and per directory.
  - High-risk, interactive (ssh, vim) and password-requiring commands are restricted or need confirmation.
  - No OS sandbox is mentioned.
- OpenClaw projects in Coze's AI coding product: creation stopped on 2026-06-30. Users move to cloud agents on Coze 3.0 (https://docs.coze.cn/guides_openclaw_service_adjustment.md).
- E2B compatibility: not documented.
- Pricing: cloud devices are billed by size and online time from 2026-06-01, settled daily in credits (https://docs.coze.cn/coze_pro_cloud_device_fee.md).

## Excerpts
> "Third-party curated agents run in the cloud computer provided by Coze, fully isolated from your local device." (translated from Chinese; https://docs.coze.cn/cozespace_cloud_agent.md)

> "Supports the Coze native agent, OpenClaw, Claude Code, Codex CLI and Hermes frameworks." (translated from Chinese; https://docs.coze.cn/cozespace_cloud_agent.md)

> "Cloud sandbox: an isolated cloud sandbox is created for each project, containing the operating system, dependencies and resources needed to run code, with live preview of web pages and apps." (translated from Chinese; https://docs.coze.cn/guides_vibe_coding_environment.md)

> "If a project has no activity for 1 hour … the system automatically disconnects the sandbox." (translated from Chinese; https://docs.coze.cn/guides_vibe_coding_limit.md)

## Relevance to the talk
A Chinese platform now rents a persistent cloud box per user and runs Western agent harnesses (Claude Code, Codex CLI) inside it on its own models. The isolation boundary is the user's machine, not the agent or the task. Several agents share a VM-or-container whose technology and egress policy are never stated. The contrast with Manus is useful: Manus gives each task its own VM.
