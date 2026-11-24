---
title: 什么是AgentSphere_产品介绍_AgentSphere-华为云
url: https://support.huaweicloud.com/productdesc-agentsphere/agentsphere_01_0001.html
authors: Huawei Cloud (华为云)
date: updated 2026-09-24 (product launched at HUAWEI CLOUD INSPIRE, press release dated 2026-06-08)
accessed: 2026-11-22
kind: docs
---

## Summary
AgentSphere is Huawei Cloud's infrastructure suite for agents. It has four parts: Agent Sandbox, Agent Gateway (an inbound/outbound security proxy), Agent Identity and Agent Storage. Agent Sandbox runs each sandbox in a MicroVM, and its API and SDK are E2B-compatible; the SDK guide uses `from e2b import Sandbox`. Huawei claims startup in hundreds of milliseconds and batch creation of 100,000-scale sandboxes, aimed at agentic RL rollouts. Egress is controlled by public-or-VPC outbound mode plus security groups, with the Agent Gateway and a firewall layered on top.

## Key points
- Isolation unit: MicroVM ("轻量化虚拟机（MicroVM）隔离架构"), with complete kernel and storage isolation between tenants (https://support.huaweicloud.com/productdesc-agentsphere/agentsphere_01_0002.html). No hypervisor is named; StratoVirt and QingTian are not mentioned.
- Per-session?: yes, per sandbox instance. The product page (https://www.huaweicloud.com/product/agentsphere.html) mentions session-granularity authentication ("Session 粒度鉴权").
- Network egress:
  - Template-level outbound mode is either **VPC** (choose VPC, subnet and security groups, whose rules are combined) or **public network** (https://support.huaweicloud.com/usermanual-agentsphere/agentsphere_03_0006.html, updated 2026-10-29).
  - The product pages claim "出入站双向访问控制，叠加安全防火墙防护" (bidirectional access control plus firewall).
  - Agent Gateway offers allow/deny lists and URL control per the overview page.
  - Agent Identity offers "出站授权" (outbound authorisation) and credential management.
  - No default-deny mode is documented on the template page.
- Persistence:
  - Hibernate and wake keep full running state through memory snapshots. Compute is not billed while hibernated.
  - Each sandbox can mount its own persistent storage: up to 5 SFS Turbo paths and 5 OBS paths, VPC mode only, plus managed session storage.
- Limits:
  - Maximum sandbox lifetime is 24 hours ("沙箱最大运行时长不能超过24小时", https://support.huaweicloud.com/sdkreference-agentsphere/agentsphere_05_0002.html, updated 2026-10-27).
  - Images come from SWR private images only, up to 20 GiB, and must have `/bin/bash`. Only x86 is supported.
  - Up to 50 environment variables.
  - The health check defaults to port 49983, the same port the E2B envd agent uses.
- Pricing: compute is free during hibernation. No unit prices were found in the docs I read.
- Vendor numbers: "百毫秒级启动" (about 100 ms startup), using memory snapshots and a three-level cache. Batch creation of 100,000-scale instances. Million-scale image storage. 100,000-scale requests per gateway node. The press release says "100毫秒级极速启动与每分钟十万级批创能力" (https://www.huawei.com/cn/news/2026/6/inspire-agenticera-agenticinfra).
- Endpoints: `agentsphere.<region>.myhuaweicloud.com` / `agentsandbox.<region>.myhuaweicloud.com`, set through `E2B_API_URL`, `E2B_SANDBOX_URL` and `E2B_API_KEY`.

## Excerpts
> "基于MicroVM技术实现多租沙箱之间内核、存储的彻底隔离，防止沙箱逃逸。" — English: "MicroVM technology fully isolates kernel and storage between multi-tenant sandboxes, preventing sandbox escape." (产品优势)

> "API、SDK兼容E2B接口，已有E2B应用可无缝迁移。" — English: "API and SDK are compatible with the E2B interface; existing E2B apps migrate seamlessly." (产品优势)

## Relevance to the talk
Huawei's offering is the most clearly "E2B-shaped" of the Chinese clouds. It uses a microVM, the E2B SDK, and even the E2B envd port, 49983. It explicitly targets RL rollouts at 100k scale. It also packages the egress proxy (Agent Gateway) and agent identity as separate products, which is a useful contrast with sandbox-only designs.
