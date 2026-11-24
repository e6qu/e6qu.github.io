---
title: "Agent Sandbox: Product overview" (智能体沙箱 Agent Sandbox), with the Flash Edition (极速版, formerly FC 云沙箱 / FC Agent Sandbox) pages
url: https://www.alibabacloud.com/help/en/agent-sandbox/agent-sandbox-overview
authors: Alibaba Cloud (Function Compute / Agent Sandbox team)
date: overview last updated 2026-09-16; other pages undated ("更新时间" blank)
accessed: 2026-11-22
kind: docs
---

## Summary
Agent Sandbox (智能体沙箱) is Alibaba Cloud's standalone product for agent sandboxes, with two editions. **Flash Edition (极速版)** is a managed API compatible with the E2B SDK and CLI, and grew out of Function Compute's "云沙箱 (FC Agent Sandbox)". **Container Edition (容器版)** is Kubernetes/ACS-based (see alibaba-acs-agent-sandbox-container-edition.md). Flash Edition has two runtimes. The first generation is Linux-only, OCI-compatible, and its isolation mechanism is not documented. The second generation (Beta) is a "lightweight VM" (MicroVM) runtime with Windows via a "multi-VMM" architecture, Docker-in-sandbox, snapshots and 1:N fork. Egress is controlled with E2B-style `allowOut`/`denyOut` lists and is open by default. Alibaba publishes migration guides from its own older AgentRun Sandbox and from AgentBay Linux desktops to this E2B-compatible service.

## Key points
- Isolation unit: the overview says "Each sandbox runs in an independent VM environment". Runtime comparison (https://help.aliyun.com/zh/agent-sandbox/runtime-gen1-vs-gen2): gen-2 is "基于轻量虚拟机隔离" and adds Windows "通过多 VMM 架构". The gen-1 isolation technology is **not stated** anywhere I found. No page names RunD, Kata, Firecracker or 神龙 for this product.
- Per-session?: one sandbox per E2B `Sandbox.create()`; the lifecycle follows E2B semantics (create/connect/list/kill/set timeout). The docs tell production code to call `sandbox.kill()` explicitly.
- Runtime differences (gen-1 vs gen-2): OS Linux vs Linux+Windows. Docker in sandbox no vs yes. Snapshot/1:N fork/"time travel" no vs yes. Cold start after pre-warm "tens of ms" for both. Deep-hibernation wake 100 ms–3 s vs 100 ms–2 s. Light-hibernation wake 1 ms for both. Images: gen-1 is "100% OCI compatible", while gen-2 needs Ubuntu/Debian-based images ("Alpine and BusyBox are not supported"). Gen-2 has a minimum of 1 vCPU.
- Network egress (https://help.aliyun.com/zh/functioncompute/network-access-control): `allowInternetAccess` defaults to true, so egress is **open by default**. `allowOut`/`denyOut` take IP, CIDR or domain (wildcards allowed). **allowOut wins** over denyOut on conflict, and a domain allowlist only takes effect when paired with `denyOut: ["0.0.0.0/0"]`. Domain filtering covers only HTTP:80 and TLS:443; other ports are IP/CIDR only, and UDP/QUIC gets no domain filtering. Choosing domains auto-allows DNS 8.8.8.8. A denied TCP connection "may look connected" from inside. Rules can be replaced at runtime with `updateNetwork` (whole replacement; `{}` clears all rules). `egressProxy` is not supported. `network.rules` can rewrite outbound requests per domain, for example to inject headers.
- Network ingress: each port gets a public URL. `allowPublicTraffic: false` requires an `e2b-traffic-access-token` header (otherwise 403).
- Persistence: pause/resume, light and deep hibernation, and on gen-2 snapshots (allowlist, kept 7 days by default) (https://help.aliyun.com/zh/functioncompute/e2b-compatibility-explanation). Dynamic mounts: gen-1 OSS, NAS, AgenticFS, PolarLakebase, JuiceFS; gen-2 OSS and AgenticFS. VPC access to RDS/Redis/NAS is a non-E2B "Extension".
- E2B compatibility matrix (FC zh page, current): Commands, Code Interpreter, Template and Network Config Update are compatible. Sandbox, Filesystem and CLI are partial. Snapshots are compatible on gen-2 with an allowlist. Volume and Access Token are not compatible. Metrics are available only through the console; the Metrics API is not supported. SDK 2.51.0 cannot create or connect, so the page recommends e2b==2.31.0 or code-interpreter 2.8.1. Endpoints: `E2B_API_URL=https://api.<region>.e2b.fc.aliyuncs.com`, `E2B_DOMAIN=<region>.e2b.fc.aliyuncs.com` (https://help.aliyun.com/en/functioncompute/e2b-sdk-compatible-api-list).
- Contradiction: the older English API list says Network Config Update "may return success without applying any actual network changes. Do not use for dynamic network governance." It also says Code Interpreter supports Python/JS/TS/Bash but not Java or R, and that Snapshots are not supported. The newer zh/en compatibility pages mark Network Config Update "Compatible" and Snapshots compatible on gen-2.
- Scale (overview, marketing): "millisecond-level startup", "million-scale concurrency", and "batch-cloning tens of thousands of independent sandboxes from a single checkpoint". Search snippets of the now-404 FC page (https://help.aliyun.com/zh/functioncompute/what-is-a-fc-sandbox) claimed "99% 兼容 E2B", 100k sandboxes/minute and Beijing-only. **Unverified**: the page returns 404 now.
- Regions (https://help.aliyun.com/zh/agent-sandbox/product-overview/open-service-area): Flash Edition is in 10 regions (Beijing, Ulanqab, Shanghai, Hangzhou, Shenzhen, Hong Kong, Singapore, Johor, Virginia, Silicon Valley).
- Pricing (https://help.aliyun.com/document_detail/3053865.html, applies to both editions): pay-as-you-go per second, invoiced hourly. Mainland China rates per vCPU-hour / GiB-hour of memory: Economy 0.060 / 0.030 元, Default 0.078 / 0.039 元, Performance (Flash only) 0.120 / 0.060 元. Economy disk is 0.0021 元/GiB-hour. Active and shallow-hibernation states get 15 GiB of disk free. Deep hibernation and snapshots bill only storage (memory + disk size). Shallow hibernation (Flash only) bills memory but not vCPU. Custom-template prewarm cache has been billed since 2026-11-15.
- Consolidation: "Upgrade AgentRun Sandbox to FC Cloud Sandbox" (2026-08-24, https://www.alibabacloud.com/help/en/agentrun/agenrun-sandbox-upgrade-fc-cloud-sandbox-scheme) claims "Nearly 100% compatible with the native E2B SDK" and 50–70% lower cost. "AgentBay Linux 桌面迁移 FC Agent Sandbox Desktop 指南" (https://help.aliyun.com/zh/functioncompute/migrate-agentbay-linux-desktop-to-fc-sandbox) maps AgentBay `session.computer.*` to `e2b-desktop` with noVNC. Neither guide announces a deprecation date.
- The Chinese "cloud sandbox overview" URL given in the brief (https://help.aliyun.com/zh/functioncompute/cloud-sandbox-overview) returns 404. The content appears to have moved under /zh/agent-sandbox/.

## Excerpts
> "二代基于轻量虚拟机隔离，为复杂 Agent 工作负载提供新的运行时架构。" — English: "Gen-2 is based on lightweight-VM isolation and provides a new runtime architecture for complex agent workloads." (运行时一代与二代差异)

> "已有 E2B 应用优先保持 SDK 调用方式不变，只替换 API Key、API URL 和域名。" — English: "Existing E2B apps should keep their SDK calls unchanged and only replace the API key, API URL and domain." (E2B 兼容说明)

> "若同一目标同时命中允许和拒绝清单，则放行。" — English: "If a destination matches both the allow and deny lists, it is allowed." (出网访问控制)

> "被拒绝的 TCP 连接从沙箱内部看可能“连接成功”" — English: "A denied TCP connection may appear 'connected' from inside the sandbox." (出网访问控制)

## Relevance to the talk
This is the clearest case of a hyperscaler cloning the E2B API wholesale: the same SDK and the same envd versions (0.5.2/0.6.1), with only the endpoint changed. It also shows a vendor moving from a container-style runtime to microVMs in order to offer snapshots, fork and Windows. The egress semantics are a good slide on footguns: open by default, allow beats deny, a domain allowlist does nothing without an explicit deny-all, and there is no domain filtering on non-HTTP(S) ports or UDP.
