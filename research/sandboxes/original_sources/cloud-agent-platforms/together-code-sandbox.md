---
title: "Together Code Sandbox" (Together AI blog) and "Together code sandbox" (Together docs)
url: https://www.together.ai/blog/code-sandbox
authors: Together AI (technology from CodeSandbox, acquired by Together)
date: blog 2025-05-20 (dateModified 2026-10-21); docs living, read 2026-11-22 (https://docs.together.ai/docs/together-code-sandbox); legacy SDK fork docs https://codesandbox.io/docs/sdk/fork
accessed: 2026-11-22
kind: blog
---

## Summary
Together Code Sandbox is CodeSandbox's Firecracker-based VM platform, sold by Together AI for agents and RL rollouts. The launch post describes memory snapshotting to hibernate and resume sandboxes, starts from snapshot in 500 ms, and hot-resizable VMs up to 64 vCPU / 128 GB. The current docs describe a new `together-sandbox` SDK (org enablement required) that speaks only of Docker-image snapshots and TTLs, with the CodeSandbox-SDK-based product now "legacy".

## Key points
- Isolation: "CodeSandbox's proprietary implementation of Firecracker microVM technology" (blog). The new docs say only "isolated runtime environments built from Docker-image snapshots" and do not name the mechanism.
- Timings (blog): start from snapshot 500 ms; cold start 2.7 s (P95); resume from hibernation 511 ms (P95).
- State (legacy CodeSandbox SDK docs): hibernation keeps "a memory snapshot of the underlying Firecracker VM"; a network request wakes it; fork yields two sandboxes "with the same fs & memory state" (~0.5 s overhead when forking a running one). CodeSandbox's engineering post on cloning microVMs uses userfaultfd (not re-read here).
- State (new SDK docs): "Sandboxes are ephemeral by default"; snapshot on terminate to keep state; "A terminated sandbox cannot be restarted"; optional `ttl`.
- Limits: blog up to 64 vCPU / 128 GB; new SDK default 1 vCPU / 2 GiB, 0.1–16 cores, 1–8 GB per core.
- Pricing (blog): $0.0446 per vCPU-hour + $0.0149 per GiB-hour.
- Network egress, credentials, regions: not documented on the pages read.

## Excerpts
> "By leveraging CodeSandbox's proprietary implementation of Firecracker microVM technology, Together Code Sandbox starts VMs from a snapshot in 500 ms" (blog)

## Relevance to the talk
One of the oldest production uses of Firecracker memory snapshots for developer environments (CodeSandbox), now repackaged for agents. Fits the density/state section next to E2B's userfaultfd snapshot-restore; also shows how little egress documentation some "agent sandbox" products carry.
