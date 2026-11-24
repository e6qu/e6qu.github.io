---
title: "Security overview of Windows 365 for Agents", "Identity and security in Windows 365 for Agents", "Set up billing for Windows 365 for Agents" (Microsoft Learn); "Windows 365 for Agents: A secured execution environment for AI agents" (Windows IT Pro Blog)
url: https://learn.microsoft.com/en-us/windows-365/agents/security-overview
authors: Microsoft (Aarthi Sukumar; billing page Swarnim Srivastava)
date: security overview ms.date 2026-06-02 (updated 2026-11-17); identity page ms.date 2026-05-01; billing page ms.date 2026-07-31; blog published 2026-07-08, updated 2026-10-20 (https://techcommunity.microsoft.com/t5/windows-it-pro-blog/windows-365-for-agents-a-secured-execution-environment-for-ai/ba-p/4529336)
accessed: 2026-11-22
kind: docs
---

## Summary
Windows 365 for Agents gives computer-use agents a full Windows **Cloud PC** (an Azure-hosted Windows VM) drawn from an Intune-managed **pool per task** and **reset to its provisioned baseline on check-in**. Isolation comes from the VM plus enterprise identity: each agent has its own Entra *agent user*, tokens are device-bound, Conditional Access applies, and "all credentials and tokens are destroyed" at release. Network control is Entra Global Secure Access (web filtering through admin profiles), not a per-agent domain allowlist. It is exposed to agents as an MCP tool in Agent 365 and usable from Copilot Studio. Already noted in `../macos-windows/windows-platform-security-ai-agents-build-2026.md` as the heaviest rung of Microsoft's containment ladder; this note adds the pool/reset model, identity, network and pricing.

## Key points
- **Isolation unit:** a Cloud PC VM ("Windows 365 for Agents virtual machines are agent-only and are strictly reserved for programmatic agent workloads"). Windows 365 runs on Azure (Hyper-V); the agent docs don't restate the hypervisor. Nothing is documented about MXC containers *inside* the Cloud PC; the MXC GA post's "Windows 365 support GA" (`../macos-windows/windows-mxc-ga-blog-2026-10.md`) is not explained further here. *Unverified.*
- **Per-what:** per task: "they check out a Cloud PC from the assigned Cloud PC pool per task, use it, and then check it back in to the pool after task completion, which triggers a reset." Many agents share a pool, not an identity.
- **Lifetime / persistence:** "Stateless: Reset after every agent session, with no state carried forward." Lifecycle Prepare → Acquire → Connect → Act → Release; at Release "All credentials and tokens are destroyed. The Cloud PC returns to its provisioned baseline." Optional "always available" Cloud PCs for interactive Agent 365 scenarios.
- **Identity / credentials:** "Each agent uses a dedicated Microsoft Entra agent user identity, separate from human users"; "Agents never reuse or impersonate user credentials"; "Token-based authentication is cryptographically bound to the device"; Conditional Access can require a compliant device or block agent identities. Defender for Endpoint and Purview DLP run on the Cloud PC; Agent 365 correlates the human prompt to agent actions for audit.
- **Network:** Global Secure Access "routing internet traffic through admin-defined profiles" with web filtering and threat blocking; on-premises access via a configured network connection with per-agent grants. No default-deny egress is documented.
- **Pricing / regions:** billing now in Copilot Credits via spending policies for new customers; checkout fails if no spending policy covers the agent user. Pricing-page search snippets (not opened): pay-as-you-go ~$0.40/hour (US) rounded up per hourly window, always-available $5 per Cloud PC per month, 50 free hours per tenant; public-preview provisioning US-only. *Status conflict:* Build 2026 post called it GA; pricing/Learn snippets still say public preview — unverified.

## Excerpts
> "Cloud PCs are stateless and reset after every agent session, which ensures that no credentials persist and no trust carries across workloads." — Security overview, Zero Trust principles

> "Agents never reuse or impersonate user credentials, which ensures a clear security boundary." — Identity and security

> "Identity is bound to the session, not the device." — Security overview, Identity pillar

## Relevance to the talk
The far end of the spectrum: when the agent needs a whole GUI desktop, Microsoft gives it a pooled, reset-on-return Windows VM and treats it as an enterprise *user*, with an identity, Conditional Access, EDR and DLP. That is a different idea from "sandbox". The boundary is the VM plus IAM, and the network control is a corporate secure web gateway. It is the managed-device model applied to agents, and it suits computer-use agents that coding-agent sandboxes don't serve.
