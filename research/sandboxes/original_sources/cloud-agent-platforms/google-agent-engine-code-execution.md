---
title: "Sandboxes overview" and "Code Execution" (Gemini Enterprise Agent Platform; formerly Vertex AI Agent Engine Code Execution)
url: https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox
authors: Google Cloud
date: living documents, no page dates; read 2026-11-22. Companion: https://docs.cloud.google.com/gemini-enterprise-agent-platform/scale/sandbox/code-execution-overview ; troubleshooting page (300 s timeout) via search snippet
accessed: 2026-11-22
kind: docs
---

## Summary
Agent Platform "sandboxes" are child resources of an Agent Runtime (`ReasoningEngine`) that run agent-generated work: **Code Execution** (Python interpreter with a fixed library set), **shell sandboxes**, **Computer Use** (a browser), and **custom containers** ("Bring Your Own Container"). The overview names the mechanism: every sandbox runs in a gVisor-isolated container. They are stateful for days (14-day TTL for code execution, 7 days for custom images) with snapshot/pause/resume operations. Code Execution has no network at all; template-backed sandboxes default to no internet and can be given either unrestricted egress or a route into your VPC, where *you* enforce any allowlist. Sandboxed code gets no Google Cloud credentials.

## Key points
- **Isolation unit:** "All sandbox environments use secure container sandboxing"; code runs "inside a gVisor-isolated container". "Each sandbox is isolated from other sandboxes and the host system." No VM layer is mentioned.
- **Per what:** created on behalf of an agent; "short-lived, session-based, or stateful for several days". Code Execution does not require deploying to Agent Runtime: "Your agent can be running anywhere, even locally." (The ADK executor stores one sandbox per user session; see `google-adk-code-executors.md`.)
- **Lifetime/persistence:** "Sandbox TTLs vary, ranging from 7 days for a custom container image to 14 days for a code execution sandbox." Code Execution "maintain[s] ... execution state (memory) for up to 14 days", TTL configurable. Lifecycle API includes `SnapshotSandboxEnvironment`, `PauseSandboxEnvironment`, `ResumeSandboxEnvironment`. Cold provisioning "takes up to 2 minutes", then "sandboxes usually spin up in seconds"; the Code Execution page claims create-and-run in under a second.
- **Filesystem / limits:** "limited file system"; file I/O up to 100 MB per request or response; "You can't install your own libraries"; execution timeout 300 s (troubleshooting page, search snippet). CPU/memory not stated. *(Region: an older Agent Engine page said us-central1 only; garbled snippet, unverified.)*
- **Egress:** Code Execution: "Run without outbound internet or Virtual Private Cloud (VPC) network access." Template-backed sandboxes (computer use, shell, custom): "Disable outbound internet access by default (`internet_access` is `False`)". Options: direct internet ("unrestricted outbound access to public IP addresses") or `egress_control_config.network_attachment` into your VPC, then Cloud NGFW / Secure Web Proxy / DNS peering. "You can't specify a list of allowed or denied domains directly".
- **Credentials:** "Sandboxed code doesn't have Application Default Credentials (ADC)"; "no ambient Google Cloud credentials and no permissions on your project or parent `ReasoningEngine`". Advice: "inject short-lived, narrowly scoped tokens for that specific execution".
- **Admitted gaps:** no in-guest intrusion detection or pre-deployment scanning; Cloud Logging collects only the parent runtime's stdout, not sandboxes'; audit logs miss "Subprocesses spawned by a shell command, file system modifications, and individual frames sent over an open WebSocket".
- **Compliance:** Code Execution supports VPC-SC, CMEK, data residency at rest, HIPAA; not Access Transparency/Approval.
- **Pricing:** billed on the same Agent Compute vCPU-hour / Agent Memory GiB-hour meters as Agent Runtime; Code Execution moved from free to billed on 2026-01-28 (release notes, via search).

## Excerpts
> "All sandbox environments use secure container sandboxing, providing a strong security boundary." (Sandboxes overview)

> "Sandboxes don't provide a built-in domain allowlist property on the sandbox or `SandboxEnvironmentTemplate` resource." (Sandboxes overview, egress)

> "Sandboxed code doesn't have Application Default Credentials (ADC) for your project." (Sandboxes overview)

> "Sandboxes maintain their execution state (memory) for up to 14 days." (Code Execution)

## Relevance to the talk
Google's managed code sandbox is the gVisor answer (vs. AWS's Firecracker and Microsoft's Hyper-V for the same product slot). Two good details: the TTLs (7–14 days) show that "sandbox" now means a multi-day stateful workspace, and the frank list of what audit logs *don't* see (subprocesses, file writes, WebSocket frames) is a slide on the limits of observing an agent from outside the box.
