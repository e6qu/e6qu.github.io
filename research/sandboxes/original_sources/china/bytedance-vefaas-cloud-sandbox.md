---
title: 云沙箱概述--函数服务-火山引擎
url: https://docs.volcengine.com/docs/6662/1802770?lang=zh
authors: Volcano Engine (ByteDance)
date: 2026-07-08 (page last updated 2026.07.08 19:09:45)
accessed: 2026-11-22
kind: docs
---

## Summary
Cloud Sandbox (云沙箱) is a feature of Volcano Engine's serverless Function Service (veFaaS), built for RL training and AI agents. A sandbox *application* is an image plus config. A sandbox *instance* is described as a "secure and isolated container runtime". Instances can live up to 24 hours, can be paused with their filesystem kept as a snapshot, and can be driven through the E2B SDK/CLI because an `envd` sidecar is injected into any image. The docs advertise sub-100 ms cold starts and up to 120,000 instance creations per minute. Egress is open by default. An optional egress policy with domain/IP rules is available once the app is bound to a VPC.

## Key points
- Isolation unit: The docs only say "安全且隔离的容器运行环境" (a secure, isolated container runtime) for each instance. No technology (Kata, microVM, gVisor, Firecracker) is named in the veFaaS docs. The sister product AgentKit says its sandbox templates are "以 microVM 为基础" (microVM-based) and uses identical unit prices (see bytedance-volcengine-agentkit-sandbox.md). That suggests, but does not prove, that veFaaS sandboxes run on microVMs.
- Per-session?: yes, one instance per user or session. Instance labels exist "用于记录用户标识、会话标识" (to record user ID and session ID). Wildcard domains (invite-only) give each instance its own entry point.
- Network egress: from https://docs.volcengine.com/docs/vefaas/sandbox-instances?lang=zh (updated 2026.11.12).
  - The 出网策略 (egress policy) controls egress through domain rules, IP rules, an HTTP proxy and connection-rate limits, and is "默认关闭" (off by default).
  - To use it, the app must be bound to a VPC with shared public access turned off.
  - Requests that match no rule are allowed by default, and this can be switched to deny.
  - Domain rules are exact or leftmost-wildcard. Allow and deny domain rules total at most 16, and allow wins on a conflict.
  - IP rules are IPv4 or CIDR, TCP or UDP, with a port. They total at most 16, and deny wins on a conflict.
  - The HTTP proxy forwards ports 80/443 by default, or all TCP ports.
  - The CPS limit defaults to 0, meaning unlimited.
- Persistence:
  - Hibernate/resume "保留文件系统状态" (keeps filesystem state) and takes about 1–10 s.
  - Pause keeps the filesystem as a snapshot at no extra storage charge. This is invite-only, per https://docs.volcengine.com/docs/vefaas/pay-as-you-go-cloud-sandbox?lang=zh.
  - Each instance has 10 GiB of local disk.
  - The sidebar lists "沙箱实例挂载 EFS 持久化存储" (EFS persistent storage mounts) and "沙箱实例自动恢复" (automatic instance recovery).
- Limits (sandbox-instances page):
  - Lifetime is at most "1440 分钟（24 小时）" (24 hours) and cannot be renewed past that.
  - Specs range from 0.25 vCPU / 0.5 GiB to 16 vCPU / 128 GiB, with 1:2, 1:4 or 1:8 vCPU-to-memory ratios.
  - There is a per-request execution timeout, with no default given.
- Performance claims (overview page):
  - Cold start 100 ms.
  - Warm-pool hit 40 ms.
  - Creation throughput "最高 12 万沙箱实例/分钟" (up to 120,000 instances per minute).
  - Hibernate/resume about 1–10 s.
- Pricing (page updated 2026.09.23):
  - vCPU: 0.0000405 CNY per vCPU-second.
  - Memory: 0.0000102 CNY per GiB-second.
  - Public egress: 0.8 CNY per GiB.
  - These are mainland prices. Johor prices are 0.0000709 CNY, 0.0000164 CNY and 0.75 CNY respectively.
  - Billing is per millisecond, "不执行不收费" (no charge when not executing).
  - Paused instances incur no vCPU or memory charges.
- E2B compatibility: https://docs.volcengine.com/docs/vefaas/e2b-compatibility-instructions?lang=zh (updated 2026.11.09) covers the Sandbox, Commands, Filesystem, Code Interpreter, Template and Volume modules. It "支持向任意沙箱镜像动态注入 Envd 运行时" (can dynamically inject the Envd runtime into any sandbox image). Per a search-result snippet of the release notes, it started as invite-only.
- Templates: Code, Browser and Computer runtime templates, plus one-click "All-in-One Sandbox" (the agent-infra/sandbox image) behind API Gateway. That is Beijing region only, per https://docs.volcengine.com/docs/vefaas/deployingall-in-onesandboxapplicationswithafewclicks?lang=zh (updated 2026.02.03).
- BytePlus, the international site, has the same feature as "Cloud sandbox" under Function Service at https://docs.byteplus.com/en/docs/faas/Overview_of_cloud_sandbox. Its body could not be fetched because the page is client-rendered.

## Excerpts
> "云沙箱服务是函数服务（veFaaS） 提供的一款面向强化学习（RL）训练、AI Agent 等应用场景的新一代基础设施，提供安全、隔离、高效的云端沙箱环境。" — English: "Cloud Sandbox is next-generation infrastructure from veFaaS for RL training and AI agents, providing secure, isolated, efficient cloud sandbox environments." (云沙箱概述, intro)

> "大规模创建吞吐量 | 最高 12 万沙箱实例/分钟" — English: "Large-scale creation throughput: up to 120,000 sandbox instances per minute." (云沙箱概述, metrics table)

> "沙箱实例是云沙箱中实际执行沙箱镜像的安全且隔离的容器运行环境。" — English: "A sandbox instance is the secure, isolated container runtime that actually executes the sandbox image." (沙箱实例管理)

> "实例生命周期时长上限为 1440 分钟（24 小时），达到上限后无法继续续期。" — English: "Instance lifetime is capped at 1,440 minutes (24 h) and cannot be renewed beyond that." (沙箱实例管理)

## Relevance to the talk
This is ByteDance's answer to E2B. It is E2B-protocol compatible and targets RL rollouts at very large scale (120k per minute). Its egress model is a useful reference point: open by default, with an opt-in VPC-bound policy using domain and IP allow/deny rules. Notably, the public docs avoid naming the isolation technology and call it only a "secure container".
