---
title: "Agent Runtime" overview, "Use Agent Identity with Agent Runtime" and "Using Private Service Connect interface with Agent Runtime" (Gemini Enterprise Agent Platform docs; formerly Vertex AI Agent Engine)
url: https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/runtime
authors: Google Cloud
date: living documents, no dates on pages; read 2026-11-22. Companion pages https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/agent-identity, https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/runtime/private-service-connect-interface, pricing https://cloud.google.com/products/gemini-enterprise-agent-platform/pricing (via search snippet only; page too large to fetch)
accessed: 2026-11-22
kind: docs
---

## Summary
Vertex AI Agent Engine has been renamed twice and is now **Agent Runtime** inside the "Gemini Enterprise Agent Platform" (the API resource is still called `ReasoningEngine` "for backwards compatibility"). It is a managed host for the agent *loop*: you deploy an ADK/LangGraph/custom agent (or a container image / Dockerfile) and Google runs and scales it. The docs say nothing about the isolation mechanism of the runtime itself. What they do document in detail is the network boundary (a Google-managed tenant network, optionally bridged into your VPC with a Private Service Connect interface, and closed by VPC Service Controls) and the credential model (per-agent SPIFFE identity with certificate-bound tokens). Agent-generated code is meant to run in separate child *sandboxes* (see `google-agent-engine-code-execution.md`), not in the runtime.

## Key points
- **Isolation unit:** not documented on the Runtime pages; no mention of gVisor, microVM or container sandboxing for the runtime itself. *(Unverified: earlier Reasoning Engine deployments were widely reported to run on Cloud Run, which would mean gVisor or microVM per instance; no current primary source found.)* The sandbox pages say sandboxed code has "no permissions on your project or parent `ReasoningEngine`", i.e. the runtime and the code sandbox are separate trust domains.
- **Packaging:** source deploy, build-time install scripts, a prebuilt Artifact Registry image, or a Dockerfile built by the service.
- **Network, default:** "Your agent is deployed in a secure, Google-managed network without access to your Virtual Private Cloud (VPC) network." Whether a deployed agent has public internet egress without PSC-I is **not stated** on the Runtime page; Google's Vertex network-security overview (search snippet) says Agent Runtime "doesn't provide internet egress" and you deploy a proxy VM with an RFC 1918 address, while an older Agent Engine page said an agent "retains its default internet access" without VPC-SC. Treat as conflicting.
- **PSC interface:** Agent Runtime provisions an interface in a Google-owned tenant project attached to a network attachment in your project (min /28 subnet). It can reach only RFC 1918 ranges routable from your network; DNS peering for private zones. "By default, your VPC doesn't provide an outbound path to the public internet for this traffic." A PSC interface cannot be changed without recreating the agent.
- **VPC Service Controls:** "the agent's default internet access is blocked by the perimeter to prevent data exfiltration"; recommended egress is a proxy server inside the perimeter plus Cloud NAT. No built-in domain allowlist: allowlisting is your proxy/NGFW's job.
- **Credentials:** Agent Identity gives each deployed agent a SPIFFE ID and an auto-rotated X.509 certificate (24 h validity per IAM docs, via search). A Google-managed Context-Aware Access policy "enforces mTLS binding" so certificate-bound tokens "can only be used from their intended, trusted runtime environment", which the page says "makes stolen credentials un-replayable". Opting out (falling back to a service account/service agent) is "strongly discouraged". A replacement agent gets a new principal even with the same name.
- **Pricing unit:** Agent Compute $0.085 per vCPU-hour and Agent Memory $0.009 per GiB-hour, per-second; "idle time ... between turns is not billed" (pricing page via search snippet; a Dec 2025 blog gave $0.0864/vCPU-h). Sessions storage billed per GiB-month.
- **Regions/limits:** the docs point to separate Locations and Quotas pages (not read).

## Excerpts
> "Agent Runtime is a fully-managed, opinionated runtime that you can use to deploy, operate, and scale agentic applications." (Runtime overview)

> "When you configure a PSC interface, Agent Runtime provisions an interface in a Google-owned tenant project where your agent runs." (PSC interface)

> "the agent's default internet access is blocked by the perimeter to prevent data exfiltration." (PSC interface, VPC Service Controls)

> Credentials are protected by a policy that "enforces mTLS binding", ensuring "certificate-bound tokens" "can only be used from their intended, trusted runtime environment." (Agent Identity)

## Relevance to the talk
Google's hosted agent loop is sold on *network perimeter and identity*, not on a named isolation primitive: the trust boundary that matters is "tenant project + PSC + VPC-SC" and "token bound to the runtime's certificate". It is the hyperscaler version of "credentials must stay outside" — instead of a proxy swapping secrets, the credential is bound by mTLS so that exfiltrating it is useless. Contrast with AWS AgentCore, which documents a microVM per session for the same product slot.
