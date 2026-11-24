---
title: "Secure microVM sandboxes for untrusted code" (Northflank Sandboxes product page), with "How to sandbox AI agents" (Northflank blog)
url: https://northflank.com/product/sandboxes
authors: Northflank (blog post by Deborah Emeni)
date: product page living document, read 2026-11-22 (cites Daytona prices "checked October 2026"); blog post 2026-02-02 (https://northflank.com/blog/how-to-sandbox-ai-agents)
accessed: 2026-11-22
kind: docs
---

## Summary
Northflank sells sandboxes as ordinary services on its Kubernetes-based PaaS, with a stronger runtime underneath. CPU sandboxes run in a microVM on Cloud Hypervisor (via Kata Containers, per the blog), and GPU sandboxes, or hosts without nested virtualisation, fall back to gVisor. It is unusual in offering the same runtimes on the customer's own cloud (BYOC) and an egress proxy that injects secrets so they never enter the sandbox.

## Key points
- Isolation: "Each sandbox runs in its own microVM on Cloud Hypervisor, with a guest kernel of its own." gVisor is "Used for GPU sandboxes." The blog says Northflank "runs Kata Containers with Cloud Hypervisor" where nested virtualisation exists and uses gVisor where it does not. (Some Northflank comparison pages name Firecracker instead; treat as inconsistent marketing.)
- Unit: one sandbox = one service instance on a compute plan; up to 288 vCPU and 2 TB RAM per sandbox; claims 50,000+ concurrent.
- Lifetime: three shapes (ephemeral seconds, long-running hours to weeks, fan-out). "Sandboxes run until you delete them, billed per second." "Ephemeral by default. Attach a volume to keep state." Pause/resume stops compute billing. No memory snapshot/fork feature is described.
- Network: private by default; ingress and egress policy "by FQDN, IP range, and more" (example allows listed FQDNs, denies the rest); mTLS service mesh; Tailscale join. The default egress posture is not stated explicitly.
- Credentials: env vars or mounted files, or **egress injection** that adds the secret to outbound requests so "the value never enters the sandbox"; workload identity issues short-lived (15-minute example) tokens.
- Deployment: Northflank Cloud, or BYOC on AWS, GCP, Azure, Oracle or bare metal; the control plane can be self-hosted, including air-gapped.
- Pricing: per second; Northflank Cloud $0.01667 per vCPU-hour and $0.00833 per GB-hour; BYOC $0.02083 per managed node vCPU-hour.

## Excerpts
> "Each sandbox runs in its own microVM on Cloud Hypervisor, with a guest kernel of its own." (product page)

> "Northflank runs Kata Containers with Cloud Hypervisor for hardware-level isolation" (blog, 2026-02-02)

## Relevance to the talk
An example of the "Kata on Kubernetes" route to microVMs (cf. ../virtualization/kata-containers-architecture.md), with gVisor as the fallback where nested virtualisation is unavailable: the runtime is chosen by what the host can do, not only by the threat model. Also another vendor converging on proxy-side secret injection.
