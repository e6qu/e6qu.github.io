---
title: "Sandboxes" and "Sandbox networking" (Modal documentation)
url: https://modal.com/docs/guide/sandboxes
authors: Modal Labs
date: living documents; read 2026-11-22; networking page https://modal.com/docs/guide/sandbox-networking
accessed: 2026-11-22
kind: docs
---

## Summary
Modal Sandboxes are containers for running untrusted code such as LLM-generated code, executed by default under gVisor (a user-space kernel that services system calls), with an optional VM runtime that gives each sandbox its own Linux kernel for workloads needing Docker, FUSE or nested cgroups. Networking is open outbound by default but can be blocked entirely or restricted by CIDR or (beta) by domain via TLS SNI — with an explicit warning that SNI matching allows domain fronting.

## Key points
- Default runtime: gVisor — "provides strong isolation and is suitable for most workloads"; VM runtime for a full Linux environment.
- Lifetime: default maximum 5 minutes, up to 24 hours with `timeout`; idle timeouts; Filesystem Snapshots recommended for state beyond 24 h. Sandboxes can be named, tagged and reattached by ID (pools of reusable environments).
- Network baseline: no inbound connections, no access to the user's other Modal resources; **outbound to public IPs allowed by default**.
- `block_network=True` drops all outbound; `outbound_cidr_allowlist` restricts by IP range (any protocol); `outbound_domain_allowlist` (beta) restricts port-443 TLS by SNI, no decryption, no ECH support, **domain fronting possible** — a sidecar proxy is suggested for stronger protection.
- Runtime policy updates (alpha) on a running sandbox; DNS is allowed unrestricted unless all outbound is blocked.
- Inbound via encrypted tunnels/connect tokens (`X-Verified-User-Data` header), `inbound_cidr_allowlist`.

## Excerpts
> "Sandboxes have a default maximum lifetime of 5 minutes." — Sandboxes

> "If you need a Sandbox to run for more than 24 hours, we recommend using Filesystem Snapshots to preserve its state." — Sandboxes

> "Currently, DNS traffic is allowed without restriction except when all outbound traffic is blocked." — Sandbox networking

## Relevance to the talk
gVisor (born for Google's multi-tenant App Engine/Cloud Run) as the default agent boundary. The networking page is unusually candid that name-based egress filtering is leaky (SNI, fronting, DNS) — the same caveat Anthropic's srt and Codex make, from the hosted side.
