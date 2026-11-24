---
title: "Introducing Infinibranch" (Morph blog) and Morph Cloud developer docs (Devboxes, branching)
url: https://cloud.morph.so/docs/developers
authors: Morph Labs ("Morph Team")
date: blog post 2024-11-19 (https://cloud.morph.so/docs/blog/authors/morph-team); docs living, read 2026-11-22 (https://cloud.morph.so/docs/documentation/instances/branch, https://cloud.morph.so/docs/concepts/mental-model)
accessed: 2026-11-22
kind: docs
---

## Summary
Morph Cloud is built around "Infinibranch": snapshot, branch and restore whole VMs ("MorphVMs") in under 250 ms, so an agent run can be forked into many parallel copies instead of restarted. The docs describe the product only at the API level. They name no hypervisor, say nothing explicit about whether memory is captured, and document no egress controls or secret handling. It is included for the forking idea, not for isolation specifics.

## Key points
- Unit: VM instance ("the underlying VM objects"); "Devboxes" are persistent workspaces on top, created from templates or snapshots. **VMM not named.**
- Snapshots: "immutable, bootable copies of an image (or of a running instance)". A tutorial shows a running process surviving snapshot and restore, which implies memory capture (inference, not stated).
- Branching: "Branching creates a snapshot of an instance and then launches a specified number of new instances from that snapshot"; clones can be branched again; disk capacity is per clone after branching.
- Lifetime: TTL per instance (examples use `ttl_seconds=3600`); devboxes auto-sleep unless disabled ("behave like a persistent VPS").
- Network: HTTP ports can be exposed as preview URLs; devboxes shared live within an org. **No egress policy documented.**
- Credentials, limits, pricing unit: not documented on the pages read.

## Excerpts
> "snapshot, branch, and restore entire computational environments in under 250ms" (developer page)

## Relevance to the talk
The "fork a live machine" end of the state spectrum (cf. E2B fork, Freestyle live fork, Together fork). Agents exploring several solutions at once want cheap whole-VM branching. The docs show how far marketing of speed has run ahead of documented isolation and egress, which is itself a point worth making.
