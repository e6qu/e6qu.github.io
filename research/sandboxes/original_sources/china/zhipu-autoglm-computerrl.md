---
title: "ComputerRL: Scaling End-to-End Online Reinforcement Learning for Computer Use Agents" (plus AutoGLM product notes and Open-AutoGLM repo)
url: https://arxiv.org/abs/2508.14040
authors: Hanyu Lai, Xiao Liu, ..., Yuxiao Dong, Jie Tang (Zhipu AI / Tsinghua; the arXiv page lists no affiliations)
date: 2025-08-19 (v1), revised 2025-10-21 (v2)
accessed: 2026-11-22
kind: paper
---

## Summary
AutoGLM is Zhipu's GUI agent for phones and browsers. In the 2025 product, each user gets a cloud phone (Android) and a cloud computer (Ubuntu) that the agent drives remotely. The ComputerRL paper, which the MIT AI Agent Index cites for AutoGLM's action space, describes the training environment: "containerized Ubuntu VMs" run with qemu-in-docker and orchestrated over gRPC, with thousands running in parallel. The open-source Open-AutoGLM instead drives the user's own physical phone over ADB, with no sandbox, relying on sensitive-action confirmation and human takeover. Zhipu has published no security description of the product's cloud devices.

## Key points
- Isolation unit (training): QEMU VMs inside Docker containers ("qemu-in-docker to deploy containerized Ubuntu VMs with streamlined images that reduce network issues", ComputerRL §2.2).
- Scale (training): "several thousands of concurrent environments on a multi-node CPU cluster"; Fig. 3 says "1,000+ real-world instances". The paper notes "VMs are CPU-intensive and unstable under high concurrency" and reports "IP address loss" under load.
- Isolation unit (AutoGLM product): cloud phone and cloud computer per user. The App Store listing says the devices have a full OS and can be remotely controlled "like real devices". Reviews (huxiu, woshipm, 2025-08) describe an Android 14 phone with about 30 preinstalled apps, and an Ubuntu desktop with only a browser and LibreOffice, with the software store removed so users cannot install software. The virtualization technology is not documented: unverified (press/reviews only).
- Network egress (product): MIT AI Agent Index records the action space as "Sandboxed cloud computers GUI with Internet access" (https://aiagentindex.mit.edu/2025/autoglm). No egress controls are documented.
- Human-in-the-loop: users can take over the cloud GUI to type passwords. The index marks sandboxing/containment, guardrails and third-party audits as "None found".
- Persistence: reviews say AutoGLM does not remember logins, so users must log in again (press only).
- Open-AutoGLM (https://github.com/zai-org/Open-AutoGLM): about 26.6k stars, Apache-2.0. Controls Android via ADB and HarmonyOS via HDC on a USB-connected real phone. Built-in "敏感操作确认机制" (sensitive-operation confirmation) and a `Take_over` action for login and captcha. No sandbox, VM or emulator setup.
- GLM-4-AllTools code interpreter (older API): Zhipu's docs page (maas.aminer.cn/dev/howuse/glm4-toolkit, JS-rendered, could not fetch) reportedly says the Code Interpreter uses a "Sandbox" by default (`sandbox = auto`). Only seen via search snippets; unverified. The current docs.bigmodel.cn index has no code-interpreter page; the current hosted sandbox is in the zhipu-managed-agents note.
- Z.ai chat "Agent"/"full-stack" mode (chat.z.ai): no official description of its execution sandbox found on docs.z.ai.
- Limits / pricing: not published.

## Excerpts
> "develop a distributed RL infrastructure capable of orchestrating thousands of parallel virtual desktop environments" (ComputerRL abstract)

> "qemu-in-docker to deploy containerized Ubuntu VMs with streamlined images that reduce network issues" (ComputerRL §2.2)

> "系统还内置敏感操作确认机制" — English: "The system also has a built-in sensitive-operation confirmation mechanism." (Open-AutoGLM README)

## Relevance to the talk
GUI agents need a whole device, not a process sandbox, so Zhipu reaches for full VMs (QEMU), wrapped in Docker for orchestration. The open-source release shows the other end of the range: the agent drives your real phone over ADB with only a confirmation prompt between it and your banking app.
