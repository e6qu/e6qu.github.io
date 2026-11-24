---
title: 即时服务概述 (PAI-Instant Service overview), 人工智能平台 PAI
url: https://help.aliyun.com/zh/pai/sandbox-overview
authors: Alibaba Cloud (Platform for AI, PAI)
date: undated on the page ("更新时间" blank)
accessed: 2026-11-22
kind: docs
---

## Summary
Alibaba's machine-learning platform PAI has its own E2B-compatible sandbox service. The URL slug is "sandbox-overview" and the page title is "即时服务 / Instant Service". It targets RL training rollouts and model evaluation at hundreds to thousands of concurrent instances. Its isolation is the most explicit of any Alibaba page: a hardware-virtualized lightweight MicroVM with a separate guest kernel per instance, "等同于传统虚拟机". Existing E2B code is said to migrate by changing only `E2B_DOMAIN` and `E2B_API_KEY`.

## Key points
- Isolation unit: a MicroVM. "基于硬件虚拟化的轻量 MicroVM 技术". "每个实例拥有独立的 Guest OS 内核，隔离等级等同于传统虚拟机". The page lists three defence layers: filesystem isolation, network egress control and resource limits. No VMM is named.
- Per-session?: per instance. Each instance has its own ID, access token, filesystem, endpoint and ports. States are running, paused and destroyed.
- Network egress: "network egress control" is listed as a layer, and each instance service has its own VPC, vSwitch and security group. No rule syntax or default is documented on this page.
- Persistence: paused instances keep state and can be resumed or saved as templates. Templates come from an image, a saved instance or a public template (Code Interpreter, Browser Use, Desktop GUI). If the account goes into arrears, all instances are destroyed; custom templates are kept.
- Limits: no quotas or timeouts are published. The page claims "millisecond-level cold start" without figures.
- Pricing: CPU + memory + system disk, spec × runtime. **Paused instances bill at the same rate as running ones**. Dedicated resource groups are pay-as-you-go per minute or subscription.
- Regions: Shanghai, Ulanqab, Zhongwei.
- E2B: "已有应用只需调整 `E2B_DOMAIN` 与 `E2B_API_KEY` 两个环境变量即可完成迁移". No compatibility matrix was found.

## Excerpts
> "每个实例拥有独立的 Guest OS 内核，隔离等级等同于传统虚拟机" — English: "Each instance has its own guest OS kernel; the isolation level equals a traditional VM." (即时服务概述)

> "已有应用只需调整 `E2B_DOMAIN` 与 `E2B_API_KEY` 两个环境变量即可完成迁移，无需修改业务代码。" — English: "Existing apps migrate by changing just the E2B_DOMAIN and E2B_API_KEY environment variables, with no code changes." (即时服务概述)

## Relevance to the talk
This is the fourth E2B-compatible sandbox inside one company: FC/Agent Sandbox Flash, ACS Container Edition, PAI, and the self-hosted OpenSandbox alongside them. The E2B API has become the de facto interface even inside a single hyperscaler. The RL-rollout use case (thousands of short-lived, forked environments) is a different load profile from interactive coding agents. Here a paused instance still costs as much as a running one, while Agent Sandbox bills hibernation at storage-only rates.
