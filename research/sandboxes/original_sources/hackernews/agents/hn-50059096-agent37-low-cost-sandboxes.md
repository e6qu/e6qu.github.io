---
title: "Launch HN: Agent37 (YC F26) – Low-cost agent sandboxes for running agents"
url: https://news.ycombinator.com/item?id=50059096
story_url: (text post; https://agent37.com)
points: 163
comments: 136
authors: HN thread (posted by vishnukool, Agent37 founder)
date: 2026-10-12
accessed: 2026-11-22
kind: discussion
---

## Summary
A rare candid account of the economics of agent-sandbox density. The founder says customers average $0.37/month per sandbox, and that free sandboxes cost them about $0.05–0.10 per user per month. The levers, by his account: agent harnesses are bursty in CPU and mostly idle, so oversubscribe; skip hyperscalers (claimed 80–90% VM margins) for Hetzner/OVH; use gVisor so sandboxes share host memory instead of reserving a VM's worth each; and buy RAM-heavy hosts because RAM, not CPU, is the binding constraint. Full VMs (Cloud Hypervisor) are offered at a higher price for workloads that need Docker. Commenters questioned whether gVisor is as strong as a VM and what happens when many browser-heavy sandboxes spike at once.

## Key points
- Numbers (founder's claims, unverified): $0.37/month average customer spend per sandbox, $0.05–0.10/month infrastructure cost per free user, over 90% of signups on the free plan.
- Stack: gVisor by default, Cloud Hypervisor for full VMs. Bare-metal from Hetzner and OVH.
- The founder admits trade-offs: networking and some capabilities are limited in gVisor sandboxes, which he says covers about 80% of use cases.
- Workload shape: bursts at init and during tasks, idle otherwise. Browser and computer-use tasks are RAM-heavy.

## Excerpts
> "We build sandboxes for running AI agents at under 10% of the cost of most sandbox providers. Our customers spend an average of $0.37/month per sandbox." — vishnukool ([50059096](https://news.ycombinator.com/item?id=50059096))

> "We use gVisor for better utilization and fast boot times. It lets us use available host memory across sandboxes without reserving a full VM's memory for each one." — vishnukool ([50059096](https://news.ycombinator.com/item?id=50059096))

> "RAM is typically the bottleneck when it comes to cost and not the CPU. This is specifically true for agent harness workloads…" — vishnukool ([50059096](https://news.ycombinator.com/item?id=50059096))

> "gVisor is... less secure than VMs; but the front page price-compares against VMs, so not apples-to-apples" — lasiotus ([50065483](https://news.ycombinator.com/item?id=50065483))

> "capabilities wise we have to limit certain things on what gvisor based sandboxes can do in terms of things like networking… However over 80% of the use cases I'm seeing simply doesn't need much beyond that." — vishnukool ([50065732](https://news.ycombinator.com/item?id=50065732))

> "CPU sits idle and memory is what forces the next box." — zeninfinity ([50067580](https://news.ycombinator.com/item?id=50067580))

## Relevance to the talk
The density section's commercial data point: once agents are mostly idle, cost depends on memory sharing, and that pushes providers from VMs back towards gVisor-style shared-kernel sandboxes. Isolation strength gets traded for price. Pair it with the per-VM RAM arithmetic in the Docker Sandboxes thread.
