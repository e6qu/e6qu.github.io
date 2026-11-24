---
title: "Azure Container Apps Sandboxes overview" (Microsoft Learn) and "Control egress" (ACA Sandboxes docs)
url: https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-overview
authors: Microsoft (Craig Shoemaker; sandboxes.azure.com docs team)
date: overview ms.date 2026-11-06 (updated 2026-11-10); egress page https://sandboxes.azure.com/docs/sandboxes/sandbox/egress (living); Azure update AZ561262: preview June 2026, GA September 2026 (published 2026-06-02, updated 2026-09-23, via https://mc.merill.net/message/AZ561262)
accessed: 2026-11-22
kind: docs
---

## Summary
ACA Sandboxes is Azure's new (preview June 2026, GA September 2026) E2B/Vercel-style sandbox product: a resource type `Microsoft.App/SandboxGroups` holding thousands of **microVM** sandboxes. Each boots from an OCI image converted to a disk image, can be suspended with a memory+disk snapshot, cloned, and given persistent volumes. Network traffic goes through managed ingress and egress proxies *outside* the sandbox; the egress proxy enforces host rules and injects secrets or managed-identity tokens into outbound HTTPS requests. **Egress is open unless you configure a policy.** Microsoft recommends it over dynamic sessions for new agent projects.

## Key points
- **Isolation unit:** "Each sandbox is an isolated microVM that starts from a disk image or snapshot." sandboxes.azure.com: "Each sandbox runs in its own secure boundary with its own kernel." Azure update: "hardware-isolated microVM boundary." **VMM not named.** *(Unverified whether Hyper-V-based or another VMM.)*
- **Per-what:** one sandbox per caller-created instance (per agent/task/user as you choose); the group is the scope for images, snapshots, volumes, secrets and managed identities. Data-plane access requires the *Container Apps SandboxGroup Data Owner* role.
- **Lifetime / persistence:** states Running/Stopped; stop takes a snapshot per Suspend Mode — memory mode (disk + memory) or disk mode. Auto-suspend when idle (no ingress, exec, shell or file ops); auto-delete N days after stop. Snapshots clone or share baselines ("Resume from snapshots even faster"; sub-second restore). Volumes: Azure Blob (shared, multi-mount), Azure Blob BYO, Data Disk (single sandbox).
- **Limits:** tiers XS 0.25 core/0.5 GiB/5 GiB disk up to 3XL 16 cores/32 GiB/320 GiB; default M = 1 core/2 GiB/20 GiB. Stopped sandboxes incur no CPU/memory charge (pricing page not read).
- **Egress default and controls:** "Sandboxes have unrestricted outbound access when no egress policy is configured." "Egress policies are opt-in." Policy has `--default Deny|Allow`; ordered rules ("first matching rule wins") match host (exact or `*.` wildcard), optional path, methods, scheme; actions Allow / Deny / Rewrite / Transform, or delegate to a webhook (`hookRef`). Path/method/header rules need `Full` traffic inspection (implies TLS interception; mechanism not described). Allow rules default to HTTPS only because "Plain HTTP has no certificate that binds the sandbox-controlled `Host` header to the destination IP."
- **Credentials:** a `Transform` rule with `secretRef` sets e.g. `Authorization` on matching requests; "the egress proxy injects it into matching outbound requests after they leave the sandbox." `managedIdentityRef` injects Entra tokens the same way. Separately, group Secrets can be injected *into* the sandbox as env vars at boot — the docs don't reconcile the two paths.
- **Ingress:** per-port HTTPS URLs, anonymous or Entra-authenticated; private endpoints; VNet integration via delegated subnet for outbound to private resources.

## Excerpts
> "Each sandbox is an isolated microVM that starts from a disk image or snapshot and can mount persistent data volumes." — Overview, Architecture

> "An egress proxy outside the sandbox enforces policies that allow or block outbound traffic by host and injects secrets without exposing them to sandbox code. Without a policy, outbound access is unrestricted." — Overview, Egress network control

> "the egress proxy injects it into matching outbound requests after they leave the sandbox." — Control egress

## Relevance to the talk
Evidence that the hosted-sandbox recipe has become a hyperscaler commodity: microVM + snapshot/fork + egress proxy with credential injection, the same shape as E2B, Vercel and Docker Sandboxes, now from Azure. It also follows the industry's default split: Azure's older code-interpreter sessions are egress-*off* by default, its new agent sandboxes egress-*on* by default, because agents need the network. The note that host matching is trustworthy only over TLS is a concise statement of the domain-fronting/Host-header problem.
