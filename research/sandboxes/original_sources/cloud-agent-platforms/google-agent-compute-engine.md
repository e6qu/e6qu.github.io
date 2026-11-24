---
title: "Introducing Agent Compute Engine and expanding agent governance" and "Inside Agent Compute Engine: Building the compute foundation for the agentic era" (Google Cloud blog)
url: https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive
authors: Ramanathan Venkatapathy and Rohit Jnagal (deep dive); Nirav Mehta, Michael Bachman, Kevin Hutchins (launch post)
date: 2026-10-22 (announced at AGNTCon + MCPCon); preview "in the coming months"
accessed: 2026-11-22
kind: blog
---

## Summary
Agent Compute Engine (ACE) is Google's microVM service for agents, already the internal substrate for Gemini's cloud agent, Antigravity and Google's model-evaluation/RL pipelines, and promised as a Google Cloud preview. Each agentic session gets a single-tenant microVM behind a **Cloud Hypervisor** boundary on Titanium hosts. The design is close to every other mature agent sandbox — snapshot/fork, CoW-shared memory, suspend when idle — but its network and credential story is unusually strict: the guest has no virtual NIC, all traffic goes over virtio-vsock to a mediation proxy and an external gateway, and credentials are swapped in on the wire outside the VM.

## Key points
- **Isolation unit + VMM:** "a hardware-isolated Cloud Hypervisor boundary with its own guest kernel and root access" (launch post), on Titanium IPU offload. "Each agentic session runs inside a dedicated, single-tenant and memory-safe microVM." (Per *session*, though the intro says "every AI agent".)
- **Density / state:** idle sandboxes are checkpointed ("fast checkpoint-and-restore model") using application-aware idle detection; "cloning, snapshot/forking, rewind and rollback"; "snapshot an environment once and fork it into thousands of memory-deduplicated copies"; base images mapped via DAX + copy-on-write so microVMs share RAM pages for OS/libraries. No boot/restore numbers published.
- **Filesystem:** ephemeral overlays; read-only shared volumes (toolchains, package caches) and GCS FUSE "with credentials managed outside the sandbox on the host"; persistent workspaces on Hyperdisk; memory snapshots and volumes encrypted and need authorization tokens to attach/restore.
- **Egress:** "MicroVMs lack standard virtual network interfaces, default IP gateways, or direct VPC access"; traffic crosses "virtio-vsock" to a "local, unprivileged mediation proxy, which forwards packets to an external proxy" whose gateway "enforces strict, policy-driven outbound brokering" (domain allowlists mentioned; default-deny not stated explicitly). Integrated with Agent Gateway.
- **Credentials:** "Guest environments hold zero persistent secrets, OAuth refresh tokens, or cloud service account keys ... and have no access to the cloud instance's metadata server"; only "an ephemeral, session-scoped public SPIFFE certificate and short-lived identity token"; backend credentials inserted by "in-flight token swap ... as the request leaves the gateway".
- **Limits, regions, pricing:** none published; "you don't pay for idle VMs" for interactive sessions. Preview targeted "in the coming months".
- **Users named:** Gemini ("Every Gemini user would get a personal agent that runs in the cloud"), Antigravity (Clement Farabet: "instant snapshot-and-fork primitives"), internal eval/RL. Jules is not mentioned.
- Related open-source path: Agent Substrate on GKE (same Cloud Hypervisor-or-gVisor choice; see `google-gke-agent-sandbox.md`).

## Excerpts
> "Agent Compute Engine delivers strong isolation via a hardware-isolated Cloud Hypervisor boundary with its own guest kernel and root access." (launch post)

> "MicroVMs lack standard virtual network interfaces, default IP gateways, or direct VPC access." (deep dive)

> "Guest environments hold zero persistent secrets, OAuth refresh tokens, or cloud service account keys in memory or on disk, and have no access to the cloud instance's metadata server." (deep dive)

## Relevance to the talk
The third hyperscaler converging on "microVM per agent session" (AWS: Firecracker in AgentCore/Lambda MicroVMs; Google: Cloud Hypervisor in ACE). Its vsock-only networking is the cleanest statement of "the network is not a device the agent has, it's a service the host brokers" — the logical end of the egress-proxy pattern. Caveat for slides: it is a blog-post architecture for a not-yet-public service.
