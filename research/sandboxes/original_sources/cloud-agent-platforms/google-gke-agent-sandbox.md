---
title: "About Agent Sandbox on GKE" (GKE docs), kubernetes-sigs/agent-sandbox (repo), "Bringing you Agent Sandbox on GKE and Agent Substrate" and "Agent Substrate brings high-density, scalable, trusted infrastructure to GKE" (Google Cloud blog)
url: https://docs.cloud.google.com/kubernetes-engine/docs/concepts/machine-learning/agent-sandbox
authors: Google Cloud (GKE docs); Kubernetes SIG Apps (repo); Brandon Royal and Tim Hockin (blog, 2026-05-21); Alex Zakonov and Tim Hockin listed on the Substrate post (2026-09-16); Drew Bradstock (CNCF post, 2026-11-05)
date: Agent Sandbox previewed KubeCon NA Nov 2025; GA 2026-05-21; Agent Substrate announced 2026-09-16, 1.0 / "GA as Agent Substrate on GKE" per 2026-11-05 post. Docs read 2026-11-22 (links to agent-sandbox v1.0.6)
accessed: 2026-11-22
kind: docs
---

## Summary
Agent Sandbox is an open-source Kubernetes controller (kubernetes-sigs/agent-sandbox) that adds a `Sandbox` CRD for "isolated, stateful, singleton workloads": one pod with a stable identity and optional persistent volume, plus `SandboxTemplate`, `SandboxClaim` and `SandboxWarmPool` for fast allocation. Isolation is delegated to a RuntimeClass: gVisor (GKE Sandbox) natively, microVMs on GKE, or self-managed Kata. On GKE it adds Pod snapshots (gVisor only) for suspend/resume and a default-deny NetworkPolicy for template-created sandboxes. **Agent Substrate** is Google's follow-on: a minimal control plane on Kubernetes that suspends idle agents to disk/GCS and resumes them in <500 ms, choosing Cloud Hypervisor microVMs or gVisor, with egress proxies that inject credentials. In Nov 2026 Google donated Agent Substrate and gVisor to the CNCF Sandbox.

## Key points
- **CRDs:** `Sandbox` ("a single, stateful pod with a stable identity and persistent storage"), `SandboxTemplate`, `SandboxClaim` (allocate from a warm pool), `SandboxWarmPool`.
- **Isolation unit:** pod with a sandbox RuntimeClass. GKE docs: "Agent Sandbox on GKE supports gVisor and microVMs as isolation runtimes"; each agent is a "dedicated, kernel-isolated Pod". Blog: "natively supports gVisor"; Kata via "pluggable interfaces". (Which VMM backs GKE's "microVMs" option is not stated on the page.)
- **Per what:** one Sandbox per agent/user session as the application chooses; SandboxClaim per request.
- **Startup:** warm pools give "less than one second"; blog: "300 sandboxes per second, per cluster ... 90% of allocations completing in 200 milliseconds".
- **Persistence:** `spec.operatingMode: Suspended` deletes the pod but keeps the Sandbox and its PVs; memory and container FS are lost unless a **Pod snapshot** is taken first. "Pod snapshots require gVisor and don't work with microVMs" (GKE ≥ 1.35.3-gke.1234000, no E2, no TPU). Restore ~3–5 s per a how-to page (search snippet). Idle detection is the application's job.
- **Egress:** "a default deny network policy" for pods created from a SandboxTemplate, aimed at internal networks and the control plane; no NetworkPolicy for directly created Sandboxes. A production guide (search snippet, unverified on page) says the default still allows public internet but blocks RFC 1918, cluster DNS and the metadata server, so Workload Identity needs a custom policy.
- **Credentials:** not covered on the concept page (Workload Identity requires opening metadata server access per the snippet above).
- **Agent Substrate:** "open-source, secure-by-default agent execution runtime ... 10x higher density than standard container runtimes"; "over 1,000 dormant agents per host"; "sub-500ms resume operations at over 500 suspend/resume activations per second"; snapshots of "the guest hypervisor's state to the local disk and Cloud Storage"; "Hardware-isolated Cloud Hypervisor microVMs or gVisor sandboxes, paired with egress proxies that enforce granular network policies and inject credentials outside the reach of the agents themselves". Status: Sept 2026 "non-production ... GA support for production is available via allowlist"; Nov 2026 CNCF post says "1.0 ... generally available".
- **Pricing:** GKE compute; blog claims "up to 30% better price-performance" on Axion. No separate fee documented.

## Excerpts
> "Agent Sandbox on GKE supports gVisor and microVMs as isolation runtimes." (GKE concept page)

> "Pod snapshots require gVisor and don't work with microVMs." (GKE concept page)

> "Teams can choose between hardware-isolated Cloud Hypervisor microVMs, which provides full Linux kernel compatibility, or gVisor sandboxing, with even lower-overhead kernel isolation." (Agent Substrate post)

> "Standard containers share the host Linux kernel with every other workload on the node, which is a risky bet for untrusted code." (CNCF post, 2026-11-05)

## Relevance to the talk
Kubernetes gets a first-class "sandbox" object: the platform-neutral version of what E2B/Daytona sell. The trade-off is explicit in Google's own docs: gVisor gives snapshots and density, microVMs give kernel compatibility but (on GKE) no Pod snapshots. Agent Substrate's numbers (1,000 dormant agents per host, sub-500 ms resume) belong on the density slide next to Firecracker snapshot-restore; its "egress proxy injects credentials" design matches every other vendor's.
