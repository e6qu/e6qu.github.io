---
title: "Sandboxes" (Blaxel product page), with "Anatomy of an agent runtime" (Blaxel engineering blog)
url: https://blaxel.ai/products/sandboxes
authors: Blaxel (blog by "Blaxel Engineering")
date: product page living, read 2026-11-22; blog datePublished 2026-01-27, dateModified 2026-10-27 (https://blaxel.ai/blog/anatomy-of-a-runtime)
accessed: 2026-11-22
kind: docs
---

## Summary
Blaxel runs each sandbox in its own Firecracker microVM ("Mark 3.0" runtime). Sandboxes drop to standby a few seconds after network inactivity and resume in about 25 ms with memory, files and running processes intact, so idle cost is only snapshot and volume storage. The blog is a useful history: Blaxel went from Kubernetes/Knative to Google Cloud Run containers to Unikraft unikernels to Firecracker, rejecting Cloud Run for cold starts and "weak isolation for untrusted code".

## Key points
- Isolation: "Every sandbox runs in its own microVM with no shared kernel" (product); "Mark 3.0 is the default, with Firecracker microVMs that resume from standby in under 25ms" (blog). Carbon (Mark 3.1, private preview) adds IPv6/VPP networking with a real IPv6 address per sandbox.
- Lifetime: standby after network inactivity (product: "a few seconds"; blog: 15 seconds); standby indefinite unless an expiry policy is set; "A sandbox wakes with memory, files, and running processes intact"; archiving drops memory. Root filesystem is in memory and wiped on destroy; durable data goes to block-storage Volumes; named snapshots outlive their sandbox.
- Network: "Restrict egress by domain, HTTP method, and path"; managed egress proxy; dedicated egress gateways with static IPs (private preview). **Default egress not stated.**
- Credentials: "Inject secrets with a managed egress proxy, so credentials never live in the sandbox" (blog: proxy secrets injection is public preview).
- Scale/regions: 100,000+ concurrent claimed; EU and US regions selectable for data residency.
- Pricing unit: not stated beyond "never pay for compute you don't use" and a free tier.
- Blaxel is listed as a sandbox provider in the OpenAI Agents SDK (per blog; not checked against OpenAI docs here).

## Excerpts
> "A sandbox wakes with memory, files, and running processes intact." (blog)

> "Inject secrets with a managed egress proxy, so credentials never live in the sandbox." (product page)

## Relevance to the talk
The density argument made concrete: agents idle most of the time, so the product is memory-snapshot standby with millisecond resume. The Kubernetes → Cloud Run → unikernel → Firecracker path is a compact story of why container isolation was judged insufficient for untrusted agent code.
