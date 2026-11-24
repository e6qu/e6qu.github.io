---
title: "Design and Implementation of Sprites"
url: https://news.ycombinator.com/item?id=46634450
story_url: https://fly.io/blog/design-and-implementation/
authors: HN discussion (submitted by sethev) of Fly.io's Sprites engineering post
date: 2026-01-15
accessed: 2026-11-22
kind: discussion
points: 169
comments: 106
---

## Summary
Fly.io's write-up of Sprites: persistent, checkpointable Firecracker VMs aimed at developers and coding agents. tptacek and mrkurt answered in the thread. Sprites are created and booted "in a second or two" (per the article, as relayed by a commenter). They bill CPU only while servicing HTTP or an attached console, and are meant to be disposable but stateful. Storage is local NVMe written back to object storage. Global state is per-organisation SQLite replicated with Litestream. mrkurt says the hardest part of a stateful sandbox with checkpoints is restoring shell environments.

## Key points
- Lifecycle: active only while serving an HTTP request or attached to a console, "hair-trigger inactive otherwise". CPU is billed on utilisation (tptacek, mrkurt).
- The product site calls a Sprite "a hardware-isolated execution environment" running "in Firecracker VMs" (quoted by ignoramous, who asks about confidential computing: CCA/TDX/SEV-SNP).
- Storage: tiered local NVMe with write-back to object storage. "near native NVMe speeds" are the goal (mrkurt).
- Control plane: Fly Machines keeps per-VM truth on the host, with global state in Postgres. Sprites keeps each org's state in its own SQLite database, synced to object storage via Litestream.
- Checkpoint/restore pain point: "Shell environments are by far the most difficult part of building a stateful sandbox with checkpoints and restores."
- Positioning: between an ephemeral dev box and production. Fine for side projects and agent workloads, but they don't horizontally scale (tptacek, mrkurt).
- Reception: early users found docs sparse and "running" status unreliable. Fly's stance: "if we have to document it extensively, we're doing something wrong".

## Excerpts
> "Shell environments are by far the most difficult part of building a stateful sandbox with checkpoints and restores. It's bananas." — mrkurt (Fly.io), https://news.ycombinator.com/item?id=46639037

> "They're hair-trigger inactive otherwise. They don't bill CPU unless they're active." — tptacek (Fly.io), https://news.ycombinator.com/item?id=46637158

> "Faster create times. Sprites create (including booting up) in a second or two, per TFA. One usecase for Sprites I see are disposable dev boxes (like for rapid prototyping with Coding Agents)." — ignoramous, https://news.ycombinator.com/item?id=46642179

> "They're an interesting middle ground between pure ephemeral dev environment and production environment." — tptacek, https://news.ycombinator.com/item?id=46641835

> "I think people really still sleep on the "multiple SQLite database" backing store design." — tptacek, https://news.ycombinator.com/item?id=46635969

## Relevance to the talk
Sprites are the 2026 answer to "what shape should an agent sandbox be": a persistent microVM with checkpoints and idle-to-zero billing, rather than a short-lived sandbox. Compare AWS Lambda MicroVMs (hn-48642510) and exe.dev's argument against "sandbox-shaped" products in that thread.
