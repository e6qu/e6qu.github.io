---
title: "Dynamic sessions in Azure Container Apps", "Use dynamic sessions in Azure Container Apps", "Use session pools in Azure Container Apps", "Serverless Code Interpreter Sessions in Azure Container Apps" (Microsoft Learn)
url: https://learn.microsoft.com/en-us/azure/container-apps/sessions
authors: Microsoft (Craig Shoemaker et al.)
date: sessions overview ms.date 2026-03-31 (updated 2026-04-14); sessions-usage updated 2026-05-10; session-pool updated 2026-05-10; code-interpreter ms.date 2026-01-30; billing ms.date 2025-12-09; related blog 2026-03-05 (https://techcommunity.microsoft.com/t5/apps-on-azure-blog/even-simpler-to-safely-execute-ai-generated-code-with-azure/ba-p/4499795)
accessed: 2026-11-22
kind: docs
---

## Summary
Azure Container Apps (ACA) dynamic sessions are pooled, prewarmed sandboxes for running LLM-generated or user code, each isolated by Hyper-V. A *session pool* hands out a session keyed by a caller-chosen `identifier` string; there are built-in code-interpreter pools (Python, Node.js, Shell) and custom-container pools. **Outbound network is disabled by default.** The isolation key is just a string your app chooses, and anyone holding a pool token can open any session, so the docs put the multi-tenant authorization burden on the application. Foundry's Code Interpreter tool runs on this service. For new projects Microsoft now points to ACA Sandboxes (see `microsoft-aca-sandboxes.md`).

## Key points
- **Isolation unit:** "Each code interpreter session is fully isolated by a Hyper-V boundary and is designed to run untrusted code." Overview: "Hyper-V isolation and optional network controls protect your environment." Custom-container sessions use the same Hyper-V session boundary per the overview (container-in-VM; exact VM shape not documented).
- **Per-what:** per `identifier`, which the app defines ("you can use the user's ID … If you're building a chatbot, you can use the conversation ID"). 4–128 characters. A request with an unknown identifier auto-allocates a new session from the pool.
- **Lifetime:** `Timed` lifecycle (default): deleted after `cooldownPeriodInSeconds` with no requests, range 300–3600 s; each request extends TTL. Custom containers can use `OnContainerExit` with `maxAlivePeriodInSeconds`. Sessions are ephemeral: no persistent storage, no snapshots. Each code execution is capped at 220 s; uploads ≤ 128 MB to `/mnt/data`.
- **Limits:** code interpreter pool `--max-sessions` up to 600; custom container CPU/memory set per pool (e.g. 0.25 vCPU / 0.5 GiB) and run on dedicated E16 nodes.
- **Egress:** "By default, sessions are prevented from making outbound network requests." Pool setting `--network-status` = `EgressDisabled` (default) or `EgressEnabled`. It is all-or-nothing; no host allowlist is documented for dynamic sessions. "If you enable egress, code running in the session can access the internet."
- **Caller auth:** management API requires an Entra token with audience `https://dynamicsessions.io` and the *Azure ContainerApps Session Executor* role. "A valid token is used to create and access any session in the pool" — so the app must guard identifiers: "The session identifier is sensitive information … your app must always have complete control over the creation and use of session identifiers." Recommended: cryptographically random identifiers, one per user or per conversation.
- **Credentials inside:** "Assume the code is malicious and has full access to the container, including its environment variables, secrets, and files." Managed identity for a custom-container pool is used for image pulls only by default (`lifecycle: None`); setting `Main` lets code in the session mint Entra tokens for the pool identity — "Due to its security implications, this capability is disabled by default."
- **Pricing:** code interpreter sessions billed per allocated session "in increments of one hour"; custom container pools billed on Dedicated plan compute (E16 instances).
- **Regions:** ~40 regions across Americas, Europe, APAC, Middle East & Africa.
- **2026 additions:** a built-in MCP endpoint on the pool (`isMCPServerEnabled: true`) for shell and Python session types; Agent Framework samples (blog, 2026-03-05, updated 2026-05-26).

## Excerpts
> "Each code interpreter session is fully isolated by a Hyper-V boundary and is designed to run untrusted code." — Code interpreter sessions

> "By default, sessions are prevented from making outbound network requests." — Use dynamic sessions, Network access

> "A valid token is used to create and access any session in the pool." — Use dynamic sessions, Authentication

> "If you enable access to managed identity in a session, any code or programs running in the session can create Microsoft Entra tokens for the pool's managed identity." — Use managed identity

## Relevance to the talk
The Windows-hypervisor take on the "hosted interpreter" generation: Hyper-V instead of Firecracker or gVisor, egress off by default, ephemeral. It also makes a point that holds for every pool-style sandbox: the VM boundary separates sessions from each other, but *which tenant gets which session* is decided by an application-chosen string. Get that mapping wrong and the hypervisor boundary protects nothing. The managed-identity toggle is a clean example of the "credentials must stay outside" rule written into a product default.
