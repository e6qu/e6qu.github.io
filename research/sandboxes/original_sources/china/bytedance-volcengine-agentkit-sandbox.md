---
title: 沙箱模板概述--AgentKit-火山引擎
url: https://docs.volcengine.com/docs/agentkit/tool-overview
authors: Volcano Engine (ByteDance)
date: 2026-10-26 (page last updated 2026.10.26 20:25:51)
accessed: 2026-11-22
kind: docs
---

## Summary
AgentKit is Volcano Engine's platform for building and hosting agents, covering runtime, gateway, MCP, identity and tools. Its "sandbox templates" (沙箱模板) are the built-in execution tools. The docs say they are "以 microVM 为基础" (based on microVMs). Instances are tied to a `session_id`, live 30 minutes by default and at most 24 hours. Template types are AIO Sandbox (browser, terminal and code), Skills Sandbox, ArkClaw Sandbox and custom images. The docs also cover E2B API keys and configuration, TOS mounts, snapshots, and a shared public-network toggle.

## Key points
- Isolation unit: a microVM ("沙箱模板以 microVM 为基础提供安全、隔离的运行环境"). The hypervisor and VMM are not named.
- Per-session?: yes. The first call with a new `session_id` creates a tool instance. The SDK quickstart (https://volcengine.github.io/agentkit-sdk-python/en/content/5.tools/1.sandbox_quickstart.html) says "Requests with different `session_id` values use independent sandbox environments with no interference between them", while the same `session_id` shares one instance.
- Network egress: not described on the overview page. The sidebar has "启用/停用共享公网访问" (enable/disable shared public access) and "配置网关私网出口" (configure gateway private egress). Public traffic is billed (see Pricing), which implies egress is on by default. **Default egress policy not verified.**
- Persistence:
  - In-session context lives in memory and "结束后不再保留" (is not kept after the session ends).
  - Hibernate and wake keeps filesystem state, typically in 1–10 s.
  - Templates can mount TOS object storage, which is charged separately.
  - The sidebar lists "使用快照备份与恢复实例" (snapshot backup and restore). I did not read that page.
- Limits: default lifetime 30 minutes ("以官方示例为准", i.e. per the official example); maximum "最长可运行 24 小时" (24 hours). The Eino ADK backend docs mention a TTL range of 60–86,400 s (https://www.cloudwego.io/docs/eino/core_modules/eino_adk/eino_adk_chatmodelagentmiddleware/filesystem_backend/backend_ark_agentkit_sandbox/), which is consistent.
- Pricing (https://docs.volcengine.com/docs/agentkit/billing-items, updated 2026.10.30), at list price:
  - Sandbox CPU: 0.0000405 CNY per vCPU-second.
  - Sandbox memory: 0.0000102 CNY per GB-second.
  - Public traffic: 0.8 CNY per GB.
  - These are identical to the veFaaS Cloud Sandbox prices. There is no free sandbox quota.
- Template types (https://docs.volcengine.com/docs/agentkit/tool-type, updated 2026.11.09):
  - AIO Sandbox: "包含 Browser、Terminal、Code 运行环境" (includes browser, terminal and code environments).
  - Skills Sandbox: preset skills, which involve model-call charges.
  - ArkClaw Sandbox: built-in ArkClaw for personal and light-office automation.
  - Custom: your own container image.
- E2B: the sidebar has "更新 E2B 配置" (update E2B configuration), "创建和管理 E2B API Key" (create and manage E2B API keys) and "E2B SDK 与 CLI 接入实践" (E2B SDK and CLI integration practice). I did not read those pages.
- Relation to veFaaS: the AgentKit overview does not mention veFaaS. The identical prices and shared features (AIO image, hibernate 1–10 s, E2B) suggest AgentKit sandboxes are built on veFaaS Cloud Sandbox. **That is an inference, not stated.**
- International (BytePlus) docs exist at https://docs.byteplus.com/en/docs/agentkit/Tool_overview but are client-rendered, so I could not read the body.

## Excerpts
> "沙箱模板以 microVM 为基础提供安全、隔离的运行环境，并由 AgentKit 提供工具与实例的生命周期管理能力。" — English: "Sandbox templates provide a secure, isolated runtime based on microVMs, with AgentKit managing tool and instance lifecycles." (沙箱模板概述)

> "实例有生命周期：支持设置生命周期时长自动回收或手动回收，最长可运行 24 小时。" — English: "Instances have a lifecycle: auto or manual reclamation, running for at most 24 hours." (沙箱模板概述)

> "Requests with different `session_id` values use independent sandbox environments with no interference between them." — AgentKit SDK sandbox quickstart

## Relevance to the talk
This is the one place where a ByteDance doc names the isolation technology outright, and it is microVM. The lower-level veFaaS docs say only "secure container". It is also a clean example of the session_id → sandbox-instance mapping with a TTL, the pattern most agent platforms (E2B, Daytona, Bedrock AgentCore) have converged on.
