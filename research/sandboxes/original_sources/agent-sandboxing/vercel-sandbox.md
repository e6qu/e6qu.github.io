---
title: "Vercel Sandbox" and "Sandbox security model"
url: https://vercel.com/docs/sandbox
authors: Vercel
date: overview last updated 2026-09-22 (page metadata); security page https://vercel.com/docs/sandbox/concepts/security read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Vercel Sandbox runs untrusted or agent-generated code in Firecracker microVMs, each with its own kernel, filesystem and network, positioned explicitly as "an AI agent sandbox". Its feature list reads like a checklist of agent requirements: millisecond start, persistent sandboxes that auto-save on stop, snapshots, Drives, per-agent Linux users for multi-agent setups, an egress firewall, and credential injection performed by a TLS-terminating proxy so secrets need not live in the VM. Billing is by *active* CPU, because agents spend most time waiting on LLM calls.

## Key points
- Isolation: "Each sandbox runs in its own Firecracker microVM with a dedicated kernel"; `sudo` allowed inside, so Docker, VPN clients and FUSE work.
- Hardware side channels acknowledged: cross-tenant covert timing channels between cooperating workloads cannot be eliminated; boundary tested publicly via a $1 million security research challenge.
- Network: **outbound HTTP allowed by default** (to install packages); user-defined network policies via the sandbox firewall; exposed ports get public URLs.
- Credential injection: for domains with transformation rules the firewall decrypts HTTPS, applies the rule (e.g. inject credentials), and re-encrypts with a per-sandbox CA; it sets ~11 env vars (`SSL_CERT_FILE`, `NODE_EXTRA_CA_CERTS`, `PIP_CERT`, `GIT_SSL_CAINFO`, …) so tools trust it; nested containers must be given the CA explicitly.
- Persistence is the default ("Sandboxes that auto-save state on stop and resume where you left off"); snapshots encrypted at rest.
- Multi-agent isolation: "Give each AI agent its own Linux user with a private home directory, and share files between agents with groups."
- Active CPU pricing: example 1 vCPU/2 GB idle all day ≈ $1.05 vs busy ≈ $4.09 (iad1).
- Related Vercel post title: "A sandbox without a network boundary is only half a sandbox".

## Excerpts
> "Vercel Sandbox is an AI sandbox that runs untrusted or agent-generated code in isolated Linux microVMs." — overview

> "In agentic workflows, active CPU time is often dwarfed by time spent waiting on LLM calls and external APIs." — Active CPU pricing

> "Hardware side channels remain a known property of shared physical infrastructure ... and no multi-tenant compute platform eliminates them entirely." — Security model

## Relevance to the talk
Shows hosted sandboxes converging on the same egress-proxy-with-credential-injection pattern as local tools, and that agent economics (mostly idle, long-lived, many per tenant) drive both pricing and persistence design. Good quote for "density": agents are idle most of the time.
