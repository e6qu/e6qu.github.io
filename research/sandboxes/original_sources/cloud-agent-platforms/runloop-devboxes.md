---
title: "Devbox Overview" and "Lifecycle" (Runloop docs), with "Safer Agents with Network Policies" (Runloop blog) and "Agent Gateways" (Runloop docs)
url: https://docs.runloop.ai/docs/devboxes/overview
authors: Runloop (blog post by Tony Deng)
date: docs living, read 2026-11-22; network-policy post 2026-01-23 (https://runloop.ai/blog/network-policies-release); agent gateway docs https://docs.runloop.ai/docs/devboxes/agent-gateways
accessed: 2026-11-22
kind: docs
---

## Summary
Runloop sells "Devboxes", VM-isolated workspaces for coding agents and for agent benchmarking. Devboxes are built from "Blueprints" (Dockerfile plus setup, secrets and network policy), can be snapshotted (disk only) and suspended, and have open egress unless a hostname-allowlist network policy is attached. The distinctive piece is the **Agent Gateway**: the devbox gets a gateway URL and a devbox-bound token, and the gateway swaps in the real LLM API key.

## Key points
- Isolation: "We use virtual machine technology to provide isolation" (docs). Marketing pages say "micro-VM" with a separate kernel per devbox. **The VMM is not named** anywhere found.
- Unit: one devbox per agent workspace; machine sizes selectable (no limits published on the page read); startup "a few seconds".
- Lifetime: fixed `keep_alive_time_seconds` or an idle policy (e.g. suspend after 1,800 s idle). **Suspend/resume preserves only disk**, not memory; snapshots capture "the full disk state" and can launch, fork or roll back devboxes. Compute billed only while initializing/running/suspending/resuming; storage billed while suspended.
- Network: default is "Allow All" ("This is the default behavior when you don't specify a policy"). A policy with `allow_all=False` and `allowed_hostnames` is a "DNS-level allowlist"; wildcards only in the first label; policy edits propagate to running devboxes ("eventually consistent"). Enforcement mechanism (proxy vs DNS) not documented. Marketing claims policies can be broad at build time and locked at runtime (unverified in reference docs).
- Credentials: Agent Gateway sets `$<NAME>_URL` and a token env var; the gateway validates the token and substitutes the real key, so a leaked env dump yields only gateway tokens. Tokens are bound to one devbox; `allow_agent_gateway` must be set on restrictive policies. MCP Hub does the same for MCP servers.

## Excerpts
> "This is the default behavior when you don't specify a policy." (network-policy post, on Allow All)

> "Only disk state, not in-memory state is preserved during suspend/resume operations." (Lifecycle docs, as indexed by search; not re-read in full)

## Relevance to the talk
Shows the credential-proxy pattern applied to the most valuable secret an agent holds, its own model API key. Also a reminder that "suspend" means different things per vendor: disk-only here versus memory-preserving at Blaxel, Freestyle, Together and E2B.
