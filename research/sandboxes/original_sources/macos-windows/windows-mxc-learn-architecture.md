---
title: MXC architecture and containment models
url: https://learn.microsoft.com/en-us/windows/apps/develop/mxc/architecture
authors: Microsoft (Windows apps docs)
date: page ms.date 2026-10-27
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft Learn's architecture page for Microsoft Execution Containers. It
separates workload intent (policy) from mechanism (backend) and offers three
containment types: process isolation (low startup cost, near the host
environment), session isolation (separate Windows user/session, but no
file/network/UI filtering), and virtualized environments (VM or micro-VM).
It recommends one-shot, per-action sandboxes for coding-agent tools.

## Key points
- Four layers: host app/agent runtime, SDK + policy contract, execution
  layer, containment backend.
- One-shot vs state-aware lifecycles (provision/start/execute/stop/
  deprovision); in MXC 1.0 lifecycle APIs support IsolationSession and WSLc.
- Process isolation is "a common type" on Windows because of low startup cost.
- IsolationSession rejects filesystem and UI policies and requires network
  egress/ingress/loopback all `allow` — i.e. no confinement beyond the
  separate account.
- Teardown does not undo writes to granted host directories or effects via
  permitted network services.
- The agent must not pick or expand its own policy; the host owns policy.
- Companion overview page (https://learn.microsoft.com/en-us/windows/apps/develop/mxc/,
  ms.date 2026-10-15) states a container "doesn't necessarily mean a virtual
  machine or a container image".

## Excerpts
> "On Windows, process isolation is a common type because it matches many workloads that need selected host resources with low startup cost." (Choose a containment type)

> "Session isolation separates users and sessions, but it doesn't restrict what the workload can access." (Choose a containment type)

> "A new narrow sandbox for each action limits retained state and reduces the pressure to create one broad policy." (One-shot and state-aware lifecycles)

## Relevance to the talk
Vendor documentation of the trade-off ladder the talk is about: process
sandbox (cheap, shared kernel) → session (separate identity) → VM (separate
kernel). Gives the design rationale for per-command sandboxes, which only
make sense when the sandbox is cheap enough to create per action.
