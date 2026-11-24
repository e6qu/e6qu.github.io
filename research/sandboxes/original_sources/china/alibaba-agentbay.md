---
title: AgentBay 安全白皮书 (AgentBay Security White Paper), 无影 Agent 开发套件 AgentBay
url: https://help.aliyun.com/zh/agentbay/agentbay-security-white-paper
authors: Alibaba Cloud (Wuying / 无影)
date: undated on the page ("更新时间" blank); product overview index updated 2025-08-15
accessed: 2026-11-22
kind: docs
---

## Summary
Wuying AgentBay (无影 AgentBay) is Alibaba Cloud's hosted "cloud execution environment for AI agents". It comes from the Wuying cloud-desktop team. It offers four environment types: a full Windows or Linux cloud computer, a code space, an Android cloud phone, and a Playwright/Puppeteer-compatible cloud browser. The security white paper says each sandbox is a virtual machine with its own guest kernel, gets no public IP, and is destroyed when the session ends. Persistence is opt-in through "Context" objects that are synced into a session path. Alibaba now publishes a guide for moving AgentBay Linux desktop workloads to the E2B-compatible Function Compute Agent Sandbox (see alibaba-agent-sandbox-flash-edition.md).

## Key points
- Isolation unit: a VM. "每个沙箱实例均运行在具备独立客户机操作系统内核的虚拟机中" (white paper). The FAQ says "为每个用户提供完全隔离的VM环境" (https://help.aliyun.com/zh/agentbay/support/faq). The white paper does not name a hypervisor. It says "企业级硬件虚拟化" and describes a Wuying "component disk" (组件盘) that keeps runtime components separate from user data on Windows/Linux sandboxes.
- Per-session?: yes. "每个会话在独立的沙箱中运行，资源与数据完全隔离" (https://help.aliyun.com/zh/agentbay/product-overview/what-is-eds-agentbay). The white paper describes three layers of isolation: tenant, resource and session. Images: `linux_latest` (default), `windows_latest`, `browser_latest`, `code_latest`, `mobile_latest` (https://help.aliyun.com/en/agentbay/developer-reference/core-concept).
- Network ingress: no public IP and no open ports. The security group allows only the ASP streaming protocol from the stream gateway, and this baseline cannot be changed. Sandboxes cannot reach each other by default; an admin can enable it within a workspace. VPC-internal invocation is supported.
- Network egress: domain allow/deny policy with up to 300 ordered rules and wildcards. With no rules, all domains are allowed. The white paper says this currently works only on Windows sandboxes, and some Alibaba Cloud domains are exempt. The product page also mentions VPC isolation and application allowlists for cloud computers.
- Persistence: sessions are ephemeral and are recycled on timeout or deletion, with memory and temporary storage wiped. Cross-session persistence requires a Context attached through `ContextSync` at session creation. Files under the synced path carry over, with white_list/black_list path policies (https://help.aliyun.com/zh/agentbay/sdk-context). The browser profile and cookies can be persisted the same way (https://help.aliyun.com/en/agentbay/developer-reference/browser-context). The white paper says backing up sandbox data is the customer's responsibility.
- Limits: concurrent sessions are 10 on Basic, 200 on Pro, and 200 on Ultra (Ultra can buy more at 10 元/concurrency/month) (billing page). No maximum session duration is published. Inactive sessions are released by a console policy ("Release Inactive Desktops"). Each API key has one policy.
- Pricing (https://help.aliyun.com/zh/agentbay/product-overview/agentbay-billing-instructions, undated): a free Basic package, Pro at 999 元/month, Ultra at 1499 元/month, plus pay-as-you-go. CPU is 0.12 元/core/hour and memory 0.05 元/GB/hour, both billed per second. Bandwidth is 0.8 元/GB inbound, and storage overage 0.0002 元/GiB/hour. A running session is billed even when idle. The page's own worked example uses 0.2 元/core/hour, which contradicts its table.
- Agent guardrails: process allow/deny lists and in-sandbox security-policy interception types (Type 2 command line, Type 4 file read/write, Type 7 file rename) (white paper).
- SDK: `wuying-agentbay-sdk` (Python/TS/Go), Apache-2.0, ~1.1k stars, repo created 2025-05-26. `github.com/aliyun/wuying-agentbay-sdk` now resolves to https://github.com/agentbay-ai/wuying-agentbay-sdk ("The Cloud Sandbox Built for AI Agents"). An MCP server is also offered.

## Excerpts
> "每个沙箱实例均运行在具备独立客户机操作系统内核的虚拟机中。" — English: "Every sandbox instance runs in a virtual machine with its own guest OS kernel." (white paper, isolation)

> "沙箱实例不分配公网 IP 地址，且无对外开放的网络端口。" — English: "Sandbox instances get no public IP address and have no externally open ports." (white paper, network)

> "会话调用后需超时自动销毁，避免用户内存磁盘数据泄露风险。" — English: "After use, sessions must be destroyed automatically on timeout, to avoid leaking memory or disk data." (white paper, data lifecycle)

> "环境会话结束后即重置，不留存任何数据。" — English: "The environment is reset when the session ends; no data is kept." (FAQ)

## Relevance to the talk
AgentBay is the "give the agent a whole cloud PC" end of the spectrum. Each session is a full VM, with Windows and Android as first-class targets, built on an existing virtual-desktop product rather than a microVM fleet. Its egress control (a domain list that works on Windows only and is open by default) is weaker than its ingress posture. Alibaba's own migration guide from AgentBay Linux desktops to the E2B-compatible FC sandbox suggests the company is consolidating around E2B semantics.
