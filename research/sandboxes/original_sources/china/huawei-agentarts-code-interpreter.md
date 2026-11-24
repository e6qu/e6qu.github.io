---
title: 创建代码解释器_代码解释器_托管与运行智能体_智果（AgentArts）智能体平台-华为云
url: https://support.huaweicloud.com/highcode-agentarts/agentarts_10_011.html
authors: Huawei Cloud (华为云)
date: updated 2026-11-10
accessed: 2026-11-22
kind: docs
---

## Summary
Huawei's agent-building platform, 智果 AgentArts (a separate "Versatile" 智能体平台 doc set also exists; their relationship is not documented), has a "sandbox tools" component. Today that component offers only a code interpreter. Agents call it through `agentarts-sdk` (`code_session(...)`, `execute_code`) to upload, download and run Python or TypeScript in an isolated code sandbox. Outbound networking is either public or VPC. The docs do not name the isolation technology, and none of the AgentArts pages I read mention AgentSphere.

## Key points
- Isolation unit: an "isolated environment" / "代码沙箱". The technology (VM, container) is not stated. Its relation to AgentSphere's MicroVM sandboxes is not documented.
- Per-session?: code runs in sessions (`code_session`). The example uses `clear_context=False`, whose semantics are not explained. Session timeouts are not documented.
- Network egress: `network_config.network_mode` is `PUBLIC` or `VPC` (VPC takes vpc_id, subnet_id and optional security_group_ids). An empty `network_config` means public access, per the API page (https://support.huaweicloud.com/api-agentarts/CreateCoreCodeInterpreter.html, updated 2026-11-04). There is no "no network" mode in the API.
- Inbound: through the default gateway "defaultgw" or a VPC private gateway, with IAM or API key auth. API keys are stored in DEW. Inbound config cannot be changed after creation.
- Persistence: not documented.
- Limits:
  - Names are 2–40 characters (`^[a-z][a-z0-9-]{0,38}[a-z0-9]$`), descriptions up to 4096 characters, up to 20 tags.
  - No CPU, memory or runtime limits are documented.
- Languages: Python and TypeScript. The TypeScript image has axios, lodash, uuid, zod and cheerio preinstalled (https://support.huaweicloud.com/highcode-agentarts/agentarts_10_009.html, updated 2026-11-02).
- Cloud permissions: `execution_agency_name` binds an IAM agency so the interpreter can call other cloud services.
- Pricing: not found on these pages. DEW is billed separately.

## Excerpts
> "代码解释器工具支持在代码沙箱中进行上传、下载和执行代码等操作" — English: "The code interpreter tool supports uploading, downloading and executing code in a code sandbox." (创建代码解释器)

> "工具可以访问的网络类型，PUBLIC和VPC二选一。" — English: "The network type the tool can reach: choose one of PUBLIC or VPC." (CreateCoreCodeInterpreter API)

## Relevance to the talk
This is a platform-level code interpreter shaped like AWS Bedrock AgentCore's Code Interpreter: managed tool, IAM-style execution role, public or VPC network. Unlike AgentCore or Tencent AGS, it documents no isolated, no-internet network mode. The default is public internet.
