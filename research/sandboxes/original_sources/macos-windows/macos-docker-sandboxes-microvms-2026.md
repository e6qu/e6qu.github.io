---
title: "Why MicroVMs: The Architecture Behind Docker Sandboxes"
url: https://www.docker.com/blog/why-microvms-the-architecture-behind-docker-sandboxes/
authors: Srini Sekaran, Craig Gumbley (Docker Inc.)
date: 2026-04-16
accessed: 2026-11-22
kind: blog
---

## Summary
Docker explains why it built a new VMM for Docker Sandboxes instead of using Firecracker, which is
Linux/KVM only. The VMM runs on each OS's native hypervisor: Hypervisor.framework on macOS, Windows
Hypervisor Platform on Windows, and KVM on Linux. Each agent session gets a dedicated microVM with its
own kernel and a private Docker daemon, with no path back to the host. File, network and secret
boundaries are set before the agent runs.

## Key points
- New cross-platform VMM, with "a single codebase for three platforms".
- On macOS it uses the low-level Hypervisor.framework, not Virtualization.framework.
- Private Docker daemon per sandbox, so no socket mounting and no host privileges.
- Architecture docs (https://docs.docker.com/ai/sandboxes/architecture/):
  - All outbound TCP goes through a host-side proxy that enforces network policy.
  - Workspaces are passed through over virtiofs, with no copying.
  - The docs admit "higher resource overhead (a VM plus its own daemon)".
- No boot-time, memory or density numbers are published. Cold starts are described only as "near-instant".

## Excerpts
> "It runs natively on all three platforms using each OS's native hypervisor: Apple's Hypervisor.framework, Windows Hypervisor Platform, and Linux KVM." — post

> "Full VMs offer strong isolation, but general-purpose VMs weren't designed for ephemeral, session-heavy agent workflows." — post

## Relevance to the talk
The clearest industry example of the "lighter VM" answer on macOS and Windows: a custom microVM
directly on the hypervisor APIs, with network policy enforced by a host proxy. It contrasts with
Apple's choice of Virtualization.framework for `container`. Density claims are absent, which is itself
worth noting.
