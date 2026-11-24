---
title: "Nanvix: A Multikernel OS Design for High-Density Serverless Deployments"
url: https://arxiv.org/abs/2604.11669
arxiv: 2604.11669
authors: Carlos Segarra, Pedro Henrique Penna, Enrique Saurez, Íñigo Goiri, Peter Pietzuch, Shan Lu, Rodrigo Fonseca
date: 2026-04-13
accessed: 2026-11-22
kind: paper
---

## Summary
Nanvix targets serverless deployment density without weakening cross-tenant
isolation. It splits per-invocation ephemeral state from long-lived per-tenant
state. Each invocation runs in a lightweight user VM whose micro-kernel provides
only threads and memory and forwards all I/O to a shared per-tenant system VM that
runs a full macro-kernel with drivers. Tenants stay separated by the hypervisor,
while invocations of the same tenant share the expensive parts.

## Key points
- Order-of-magnitude lower start-up times, with moderate I/O overheads.
- Replaying a production trace, it needs 20–100× fewer host servers than
  state-of-the-art systems.
- It argues that cross-tenant sharing is unsafe because of side channels, while
  same-tenant sharing is acceptable if contention is managed.

## Excerpts
> “achieving high deployment density without compromising application performance or isolation remains an open challenge.” (Abstract)

> “Nanvix' split design achieves strong hypervisor isolation across tenants without sacrificing application performance” (Abstract)

## Relevance to the talk
The VM-side answer to density: keep the hardware boundary between tenants but make
each per-agent VM tiny and share the heavy OS per tenant. For agents, one user's
many parallel agents form one tenant, a natural fit.
