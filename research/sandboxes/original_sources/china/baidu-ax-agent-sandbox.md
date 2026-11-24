---
title: 智能体沙箱 AX-百度智能云
url: https://cloud.baidu.com/product/ax.html
authors: Baidu AI Cloud (百度智能云)
date: product page undated; AX docs say "正式内测发布" 2026-07 (release notes updated 2026-07-16); SDK pages updated 2026-08-14
accessed: 2026-11-22
kind: docs
---

## Summary
智能体沙箱 AX ("Agent Sandbox AX") is Baidu AI Cloud's E2B-compatible sandbox service. It provides code, browser (CDP), desktop/computer-use and custom-image sandboxes, and also hosts AI apps. The product page claims VM-level isolation ("虚拟机级安全隔离"). The SDK guide says only that code is "locked in a container or VM". Before AX launched in beta in July 2026, the same E2B-compatible sandbox endpoints were documented under Function Compute CFC. I found no separate documented code-interpreter sandbox for Qianfan AppBuilder/AgentBuilder, so it is folded into this note.

## Key points
- Isolation unit: the product page says each sandbox runs in a VM ("虚拟机级安全隔离"; "所有操作均在虚拟机级隔离环境中运行"). The SDK page says "把代码关进容器或虚拟机" (https://cloud.baidu.com/doc/AX/s/amoi8d7oo). No hypervisor or runtime is named. A Kata Containers community page hosts a Baidu whitepaper saying Baidu uses Kata in function compute, container service and edge (https://katacontainers.io/baiducn). That does not confirm AX's runtime.
- Per-session?: yes, one sandbox instance per `Sandbox.create()`. The default timeout is 300 s, and an instance is auto-deleted after its timeout (https://cloud.baidu.com/doc/AX/s/Pmoi806kf). No maximum is stated.
- Network egress: the product page offers a unified configuration of "公网、VPC 和持久化存储". The SDK page says package installs need public-network permission ("安装需要有外网权限"). No egress allowlist or default policy is documented.
- Persistence: the API reference lists pause, resume, snapshot create/list and "派生" (fork) of instances. The overview mentions snapshot pre-warming and forking from any step for RL (https://cloud.baidu.com/doc/AX/s/bmrn65ig9). Persistent storage can be configured.
- Limits:
  - CPU/memory combinations run from 2C with 2/4/8 GB up to 16C with 16 GB (https://cloud.baidu.com/doc/AX/s/Tmrn7f7df).
  - Up to 100 reserved (warm) instances per Sandbox and 300 per region per account.
  - The code SDK currently supports only the official `code-interpreter-v1` template.
  - Languages: Python, JS/TS, R, Java, Bash.
- Pricing: "按操作量计费，闲置不收费" (billed by operations, no charge when idle). There is a free tier for individuals. No unit prices were found.
- Startup: "冷启动秒级、热启动毫秒级" (cold start in seconds, warm start in milliseconds). Baidu does not claim sub-100 ms cold starts.
- Endpoints (earlier CFC browser-sandbox quick start, updated 2026-02-25, https://cloud.baidu.com/doc/CFC/s/Gmi8sgsls): `sandbox-execute.{bj,gz,su}.baidubce.com`, configured through `E2B_DOMAIN` and `E2B_API_KEY`. It requires E2B SDK 2.0 or later.
- Related: CFC AgentRuntime (https://cloud.baidu.com/doc/CFC/s/Imi2ky6pe, updated 2026-09-24) hosts LangChain/LangGraph/CrewAI agents with "强会话隔离" (strong session isolation). Its limits are 24 h maximum, 15 min idle reclaim and 5 active sessions during beta. It mentions BCI image caching, which suggests it runs on Baidu Container Instance; that is my inference, not stated.
- Qianfan AppBuilder: the docs and the `baidubce/app-builder` SDK README list no code-interpreter component. AppBuilder workflows have a "code node" for user Python (third-party blog only). Where that code runs is not documented.

## Excerpts
> "原生兼容 E2B 协议" — English: "Natively compatible with the E2B protocol." (product page)

> "所有操作均在虚拟机级隔离环境中运行" — English: "All operations run in a VM-level isolated environment." (product page / 什么是智能体沙箱)

> "目前仅支持官方代码沙箱，即template名为 code-interpreter-v1。" — English: "Currently only the official code sandbox, i.e. the template named code-interpreter-v1, is supported." (运行代码 SDK page)

## Relevance to the talk
Baidu is the third big Chinese cloud to ship an E2B-protocol clone, after Tencent and Huawei, with Alibaba as a fourth. That makes the E2B API the de facto industry interface for agent sandboxes. Baidu documents less than its peers about the isolation mechanism and egress policy. Its cold-start claim, "seconds", is the most modest of the group.
