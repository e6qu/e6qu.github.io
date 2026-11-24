---
title: Agent Sandbox 概述 (Container Compute Service ACS), with "Use the E2B SDK to connect to Agent Sandbox" and "ACS Agent Sandbox security best practices"
url: https://help.aliyun.com/zh/cs/user-guide/agent-sandbox/
authors: Alibaba Cloud (Container Service / ACS team)
date: undated on the pages ("更新时间" blank); public beta (公测) per the page
accessed: 2026-11-22
kind: docs
---

## Summary
The Kubernetes-native edition of Alibaba's Agent Sandbox (sold as "Container Edition / 容器版") runs sandboxes as ACS pods with `compute-class: agent-sandbox`. Alibaba describes them as "MicroVM 级别的隔离". Management is declarative through a `Sandbox` custom resource and `SandboxSet` warm pools from **OpenKruise Agents** (`agents.kruise.io/v1alpha1`). An `ack-sandbox-manager` add-on speaks the E2B protocol, so the stock E2B SDK can drive it. The docs claim up to 15K sandboxes per minute, memory-preserving sleep/wake and checkpoint/clone. Network controls use Kubernetes NetworkPolicy plus Alibaba's L4 TrafficPolicy and L7 SecurityProfile CRDs.

## Key points
- Isolation unit: "Agent Sandbox 提供 MicroVM 级别的隔离运行环境" (overview). The pages do not name the runtime: no Kata, gVisor, RunD or 安全沙箱. The E2B guide only shows pod labels `alibabacloud.com/acs: "true"` and `compute-class: agent-sandbox`. **Unverified**: whether this is RunD/Kata underneath.
- Per-session?: one Sandbox CR = one ACS pod. Each sandbox is claimed from a `SandboxSet` warm pool, which refills automatically. Access is through `SandboxClaim` or the E2B SDK (https://help.aliyun.com/en/api-gateway/cloud-native-api-gateway/use-cases/use-cloud-native-api-gateway-to-use-acs-agent-sandbox).
- Architecture (https://help.aliyun.com/en/cs/user-guide/connect-to-agent-sandbox-using-the-e2b-sdk): the `ack-agent-sandbox-controller` add-on, the `ack-sandbox-manager` add-on (API server and proxy), Ingress (ALB example) and wildcard DNS/TLS. "Agent Sandbox implements E2B protocol compatibility based on OpenKruise Agents." It has two URL schemes: native E2B `<PORT>-<SANDBOX_ID>.DOMAIN`, and a private `DOMAIN/kruise/<SANDBOX_ID>/<PORT>` that needs only one certificate. kubernetes-sigs/agent-sandbox is not mentioned on Alibaba's pages. The OpenKruise Agents Go package says it keeps compatibility with SIG agent-sandbox (pkg.go.dev/github.com/openkruise/agents, seen via search only).
- E2B gaps (Container Edition): no presigned upload/download URLs, logs, metrics, network, lifecycle events or volumes. SDKs newer than v2.25 expect API keys of the form `e2b_[0-9a-f]+`.
- Network egress (https://help.aliyun.com/en/cs/user-guide/acs-agent-sandbox-security-best-practices): three modes. `network-policy` (K8s NetworkPolicy), `traffic-policy` (L4 TrafficPolicy, needs Poseidon), and `enhanced-traffic-policy` (L4 + L7 SecurityProfile with wildcard domains; ack-sandbox-manager ≥0.6.1), which is recommended. TrafficPolicy FQDN matching is exact only. Recommended baseline: deny internal CIDRs, block the ECS metadata endpoint `100.100.100.200/32` with a priority-1 GlobalTrafficPolicy, use a dedicated vSwitch and security group, and use egress credential injection (the sandbox holds placeholders and the gateway swaps in real credentials, `failStrategy: Block`). Also: `automountServiceAccountToken: false`, `enableServiceLinks: false`, non-root, drop all capabilities.
- Persistence: memory-state sleep/wake (typical wake 1–10 s), and Checkpoint/Restore of memory state for cloning or branching. Running sandboxes get 30 GiB of free temporary storage; sleeping ones get none.
- Limits / scale: "大规模创建可达 15K Sandbox/分钟", with hundreds-of-ms creation through image cache, predictive scheduling and Warm Pool. No GPU. In the E2B example, sandbox-manager runs 3 replicas by default.
- Pricing (overview): per second by vCPU and memory, invoiced hourly. Mainland China ≈0.078 元/vCPU-hour and 0.039 元/GiB-hour; HK/overseas ≈0.1232 / 0.0616. Sleeping sandboxes pay no CPU or memory, only temporary storage. This matches the "Default" QoS row of the Agent Sandbox billing page (https://help.aliyun.com/document_detail/3053865.html).
- Regions: the region list (https://help.aliyun.com/zh/agent-sandbox/product-overview/open-service-area) gives the Container Edition 21 public-cloud regions plus finance and government clouds. A search snippet of the English ACS overview listed only Guangzhou, Heyuan, Qingdao, Zhangjiakou, Hohhot and Chengdu. That is probably an older version (contradiction).
- The shipped `code-interpreter` image is "for test environments only".

## Excerpts
> "Agent Sandbox 提供 MicroVM 级别的隔离运行环境" — English: "Agent Sandbox provides a MicroVM-level isolated runtime environment." (Agent Sandbox 概述)

> "支持运行中 Sandbox 按需休眠，内存状态保持，快速唤醒" — English: "Running sandboxes can sleep on demand with memory state kept, and wake quickly." (Agent Sandbox 概述)

> "Agent Sandbox implements E2B protocol compatibility based on OpenKruise Agents" (Use the E2B SDK to connect to Agent Sandbox)

> "Blocking this endpoint is one of the most important security configurations." (security best practices, on 100.100.100.200)

## Relevance to the talk
This is a concrete Kubernetes-native agent-sandbox stack: CRDs (Sandbox, SandboxSet, SandboxClaim) from an open-source project (OpenKruise Agents), with the E2B protocol on top, running on serverless microVM pods. Its security guide covers the issues every self-hosted sandbox fleet meets: the cloud metadata endpoint, service-account tokens, internal CIDRs, and keeping real credentials out of the sandbox.
