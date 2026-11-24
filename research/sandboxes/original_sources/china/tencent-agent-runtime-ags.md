---
title: Agent Runtime_Agent沙箱_Agent网关- 腾讯云
url: https://cloud.tencent.com/product/ags
authors: Tencent Cloud (腾讯云)
date: product page undated (performance footnote says figures measured August 2025); docs used below updated 2026-03-24 to 2026-10-27
accessed: 2026-11-22
kind: docs
---

## Summary
Tencent Cloud Agent Runtime (product code AGS; docs under product ID 1814) is a managed agent sandbox service. It offers code-interpreter, browser, mobile/Android, SWE-bench, OSWorld, "All-In-One" and custom-image sandboxes. Clients reach it with the stock E2B SDK by setting `E2B_DOMAIN` (for example `ap-guangzhou.tencentags.com`) and `E2B_API_KEY`. The product-advantages page says isolation is "based on Cube and other secure sandbox technology", with a dedicated kernel per sandbox. That is the same family as the open-source CubeSandbox (see `tencent-cubesandbox.md`). Egress defaults to "sandbox intranet": no public internet and no VPC.

## Key points
- Isolation unit: the product page says "VM 级隔离" (VM-level isolation). The advantages page says the service is built on "Cube 等安全沙箱技术" and gives each sandbox its own kernel. The Guest OS image is about 128 MB and uses about 20 MB of memory (https://cloud.tencent.com/document/product/1814/123813, updated 2026-03-24). The pages do not name a hypervisor.
- Per-session?: yes. Each sandbox instance is created from a "sandbox tool" (template) and has its own lifecycle. The default lifetime is 5 minutes (300 s) and the maximum is 24 hours. The instance is destroyed when it expires (https://cloud.tencent.com/document/product/1814/123820; https://cloud.tencent.com/document/product/1814/123816, updated 2026-10-09).
- Network egress: there are three policies per sandbox tool (123820):
  - **沙箱内网 (sandbox intranet)**, the default: no public internet and no VPC access.
  - **公网 (public)**: full internet access.
  - **VPC**: access to your own VPC and Tencent Cloud public services, through a chosen subnet and security group.
  - No domain allowlist is documented. The advantages page only mentions "沙箱出入权限管理".
- Persistence: pause/resume (hibernation) is supported, with or without memory state. COS can be mounted either per tool (shared by all instances) or per instance. Separate "Agent CBS" data disks exist. The product page mentions session snapshots and persistent storage.
- Limits (per main account per region, https://cloud.tencent.com/document/product/1814/123815, updated 2026-10-20):
  - Quotas: 10 sandbox tools, 50 instances, 50 cores and 100 GiB memory running, 20 paused instances.
  - Default sandbox sizes: Code Interpreter is 2C/1000 MiB with a 1 GiB disk. All-In-One is 4C/8 GiB with an 8 GiB disk. Mobile is 4C/8 GiB with a 20 GiB disk.
  - Custom sandboxes: 0.5 to 32 cores.
  - API rates: Start/Stop/AcquireToken at 100 req/s.
- Pricing (https://cloud.tencent.com/document/product/1814/133249, updated 2026-10-27):
  - CPU is ¥0.000081 per core-second and memory is ¥0.000025 per GiB-second.
  - System disk and hibernated storage are ¥0.0021 per GiB-hour.
  - Running instances get 15 GiB of system disk free. Paused instances get none.
  - CPU and memory are not billed while paused.
- Startup: about 100 ms ("100毫秒级"), measured by Tencent's lab in August 2025, per a footnote on the product and advantages pages. The overview page claims "tens of thousands of concurrent instances". The product page claims "数十万实例/分钟" (hundreds of thousands of instances per minute).
- E2B compatibility: the product page says "兼容 E2B 协议". The quick start uses `e2b-code-interpreter` unchanged. A sandbox tool's name must match the E2B `template` name, for example `code-interpreter-v1`. The overview and advantages pages phrase this more vaguely as "兼容社区开源沙箱协议".
- Code run languages: python, javascript, typescript, java, r and bash, run through a Jupyter server inside the sandbox (https://cloud.tencent.com/document/product/1814/123851, seen in search snippet only).
- Tencent Yuanqi (元器) / Hunyuan code interpreter: I found no public documentation of where its code-interpreter plugin runs, so it is folded into this note as "not documented".

## Excerpts
> "基于 Cube 等安全沙箱技术，提供内核级强隔离的运行环境" — English: "Based on Cube and other secure-sandbox technologies, provides a runtime with strong kernel-level isolation." (产品优势)

> "沙箱禁止访问公网服务或者 VPC 网络，适用于需高度安全隔离的场景。" — English: "The sandbox is forbidden from reaching public services or VPC networks; suited to scenarios that need strong isolation." (创建沙箱工具, 网络配置 → 沙箱内网, default)

> "兼容 E2B 协议与多类主流接入方式" — English: "Compatible with the E2B protocol and several mainstream access methods." (product page)

## Relevance to the talk
This is the managed counterpart to CubeSandbox. A per-sandbox kernel, E2B wire compatibility, default-deny egress and per-second pricing make it look much like E2B itself. The default-deny network ("沙箱内网") is stricter than many Western defaults. Domain-level egress filtering is not documented, unlike the open-source CubeEgress.
