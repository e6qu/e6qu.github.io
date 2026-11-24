---
title: 什么是AgentRun (Function Compute AgentRun), with 创建沙箱函数（模板） and 实例隔离概述
url: https://help.aliyun.com/zh/functioncompute/what-is-agentrun
authors: Alibaba Cloud (Function Compute)
date: undated on the pages ("更新时间" blank)
accessed: 2026-11-22
kind: docs
---

## Summary
Before the standalone Agent Sandbox product, Function Compute offered two FC-native ways to sandbox agents, and both are still documented. **AgentRun** is an "Agentic AI infrastructure platform" on FC. Its sandboxes (Code Interpreter, Browser Use, and later All-in-One) are described as "基于安全容器（MicroVM）多级隔离" with request, instance or session isolation. **Sandbox functions (沙箱函数)** are ordinary FC functions pinned to `SESSION_EXCLUSIVE` instance isolation, so each session owns one function instance for up to 24 h. Alibaba now recommends moving AgentRun Sandbox to the E2B-compatible FC cloud sandbox (Agent Sandbox Flash Edition).

## Key points
- Isolation unit: AgentRun says "基于安全容器（MicroVM）多级隔离（请求级、实例级、会话级）". This is the only FC page I found that equates 安全容器 with MicroVM. The instance-isolation overview (https://help.aliyun.com/zh/functioncompute/fc/user-guide/overview-of-instance-isolation) describes the scheduling modes but does not name the isolation technology.
- Per-session?: yes. FC instance isolation has three modes: 不隔离 (default, instances reused across requests), 请求隔离 (one request per instance) and 会话隔离 (one session per instance). Sandbox functions are fixed to `SESSION_EXCLUSIVE` with `sessionConcurrencyPerInstance = 1` (https://help.aliyun.com/zh/functioncompute/create-a-sandbox-function-template). Instance isolation requires specs of 2 cores or more.
- Network egress: the AgentRun page mentions VPC/IDC connectivity ("数据不出企业私域") and PrivateLink. The sandbox-function page covers only VPC (for NAS/PolarFS mounts) and RAM roles. No internet-egress allowlist is documented for either.
- Persistence: sandbox functions can mount NAS, OSS or PolarFS (up to 5 each) for "持久化或共享的数据存储". Local disk is "临时存储空间". AgentRun releases resources after a shallow-sleep idle timeout.
- Limits: sandbox functions have `sessionTTLInSeconds` default 86400 (range 60–86400) and `sessionIdleTimeoutInSeconds` default 1800, and are available only in some regions. AgentRun's Code Interpreter is said to have a 6-hour maximum session lifetime with one session per sandbox service. **Unverified**: seen only in a search snippet of https://help.aliyun.com/zh/functioncompute/sandbox-sandbox-code-interepreter.
- Pricing: not given on these pages. The AgentRun→FC cloud-sandbox upgrade guide claims the new service cuts cost by 50–70% (https://www.alibabacloud.com/help/en/agentrun/agenrun-sandbox-upgrade-fc-cloud-sandbox-scheme, 2026-08-24).
- The instance-isolation page says FC added the feature for AI sandboxes: "为了满足AI Sandbox对独立隔离运行环境的需求".

## Excerpts
> "基于安全容器（MicroVM）多级隔离（请求级、实例级、会话级）" — English: "Multi-level isolation (request, instance, session) based on secure containers (MicroVM)." (什么是AgentRun)

> "一个用户会话（Session) 独占并绑定一个函数实例。" — English: "One user session exclusively owns and is bound to one function instance." (实例隔离概述)

> "随着AI Agent的普及，为了满足AI Sandbox对独立隔离运行环境的需求，函数计算推出了实例隔离功能" — English: "As AI agents spread, Function Compute launched instance isolation to meet AI sandboxes' need for independent isolated environments." (实例隔离概述)

## Relevance to the talk
This shows how a FaaS platform became an agent sandbox. The AgentRun page says FC instances run in a secure container (microVM), so the missing piece was scheduling: stop reusing an instance across requests and bind one instance to one session. The isolation boundary did not change. The product then moved to an E2B-compatible API rather than keeping its own SDK.
