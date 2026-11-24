---
title: stepfun-ai/Step-Code (GitHub README) and iflytek/astron-agent (GitHub README)
url: https://github.com/stepfun-ai/Step-Code
authors: StepFun (阶跃星辰); iFlytek (科大讯飞)
date: undated READMEs (Step Code reported 2026-09; Astron Agent open-sourced 2025)
accessed: 2026-11-22
kind: repo
---

## Summary
Neither StepFun nor iFlytek publishes anything substantive about sandboxing agents. StepFun's open-source terminal coding agent, Step Code, documents three permission tiers and a dangerous-command dialog, but no OS sandbox, network control or container. iFlytek's open-source agent workflow platform, Astron Agent (讯飞星辰 Agent), deploys with Docker Compose, but its README says nothing about isolating code or tool execution. Searches in English and Chinese (沙箱, 代码执行, 隔离) found no code-sandbox docs from either vendor.

## Key points
- Isolation unit: none documented for either product.
- Step Code permissions: "Three permission tiers (Ask / Approve for Me / Full Access), cycled with `Shift+Tab`". Dangerous commands get an extra confirmation in the first two tiers and run without one only in Full Access after a risk acknowledgement. Subagents have "isolated context" (context, not OS isolation).
- Step Code repo: about 1.0k stars, MIT, no releases listed. A community security review on Linux.do reported no telemetry or cloud-control code (press via 80aj.com; unverified).
- Astron Agent repo (https://github.com/iflytek/astron-agent): about 8.9k stars, Apache-2.0, no releases listed; "Enterprise-grade, commercial-friendly agentic workflow platform". Deployed with `docker compose`; no sandbox or code-executor isolation described.
- Network egress / persistence / limits / pricing: not documented.

## Excerpts
> "Three permission tiers (Ask / Approve for Me / Full Access), cycled with `Shift+Tab`" (Step Code README, Security)

> "Enterprise-grade, commercial-friendly agentic workflow platform for building next-generation SuperAgents." (Astron Agent README)

## Relevance to the talk
A reminder that many labs ship coding agents with approvals only. The "three permission tiers" pattern (ask / auto / full) shows up at StepFun, MiniMax, Moonshot and DeepSeek, while OS-level sandboxing is uneven. Useful as a "what's missing" data point rather than a slide on its own.
