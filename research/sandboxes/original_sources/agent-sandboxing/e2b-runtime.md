---
title: "E2B Runtime" (README of e2b-dev/runtime, formerly e2b-dev/infra) and E2B Documentation
url: https://github.com/e2b-dev/runtime
authors: E2B
date: repo created 2023-08-10; README read at main on 2026-11-22; docs at https://docs.e2b.dev/
accessed: 2026-11-22
kind: repo
---

## Summary
E2B is a hosted "AI agent cloud" whose open-source (Apache-2.0, Go) runtime gives every agent session its own Firecracker microVM. Its central design idea is that a sandbox is a *resumed snapshot*, not a boot: templates are pre-booted VM images (memory + disk + machine state) and memory is faulted in lazily via `userfaultfd`, so create, resume and fork are the same fast path. It is a clear example of hosted sandboxes optimising for agent-specific needs: pause/resume of long-lived state, forking live sandboxes, and a per-sandbox egress firewall.

## Key points
- One Firecracker microVM per sandbox, in its own cgroup and network namespace, with a per-sandbox **nftables egress firewall** and **SNI/Host-inspecting domain allow and deny lists**.
- Snapshot-based creation: root FS is a copy-on-write overlay over a read-only image; only touched pages/blocks are fetched; a final template "optimize pass" records which pages boot actually touches.
- **Pause/resume:** pause diffs memory and disk against the template and ships the diff to object storage; idle sandboxes auto-pause and incoming traffic wakes them. Docs: pausing saves filesystem *and memory*; paused sandboxes are kept until killed.
- **Fork:** checkpoints a live sandbox in place and starts up to a hundred new sandboxes from that snapshot per request while the original keeps running.
- `envd` agent inside each VM exposes processes, PTYs, FS ops, watchers and port forwarding (Connect RPC/REST); public URLs `https://<port>-<sandbox>.<domain>` with per-sandbox access tokens.
- Secrets are "metadata-only on the control plane"; workload identity gives sandboxes short-lived tokens.
- Control plane and data plane separated; self-hostable single-node "Embed" (needs KVM), Terraform for GCP/AWS/Azure.

## Excerpts
> "Firecracker microVMs that resume from a snapshot, run untrusted agent code, and pause when the agent stops." — README tagline

> "A sandbox is a resumed snapshot. Templates are pre-booted VMs (memory, disk, and machine state) stored in object storage." — Why it's fast

> "Fork checkpoints a live sandbox in place and starts new sandboxes from that snapshot, up to a hundred per request, while the original keeps running untouched." — What you get

## Relevance to the talk
The best illustration of the "fast snapshot/fork" and "long-lived stateful workspace" requirements: Firecracker (built for Lambda's short stateless functions) repurposed with userfaultfd lazy restore to give agents pausable, forkable machines. Fork-a-live-VM ×100 maps directly onto parallel agents exploring alternatives.
