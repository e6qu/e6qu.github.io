---
title: "Ask HN: Pros and cons of V8 isolates?"
url: https://news.ycombinator.com/item?id=31740885
story_url: (self post, linking https://blog.cloudflare.com/cloud-computing-without-containers/)
authors: HN discussion (asked by pranay01)
date: 2022-06-14
accessed: 2026-11-22
kind: discussion
points: 171
comments: 153
---

## Summary
The clearest head-to-head on HN between isolates and microVMs. Kenton Varda (Cloudflare Workers), Kurt Mackey (Fly.io) and Thomas Ptacek (Fly.io) argue it out directly. mrkurt: never run multiple tenants' isolates in one OS process. Chrome doesn't, and once you fork you are "not far off" Firecracker. kentonv: V8 was designed to isolate sites within one process for most of Chrome's history, and strict process isolation would cost Workers "an order of magnitude more overhead" in CPU and memory. tptacek: containers are a packaging abstraction, and "multitenant shared-kernel is unsafe".

## Key points
- The skeptic's top answer (dsl): "v8 is a runtime and not a security boundary", and escapes are "common". Wrap it in gVisor.
- mrkurt: Fly started with V8 and "decided it was wrong". Run isolates in separate processes with cgroups and namespaces, as he believes Deno Deploy does. He predicts convergence: isolates in hardware-virtualised processes, and microVMs that optimise away cold starts.
- kentonv: Chrome's strict site isolation is recent. Before Spectre, V8 alone separated sites in the same process. Chrome moved to process isolation so that "Spectre was the kernel's problem instead".
- Measured cost: at Cloudflare's granularity, strict process isolation means "an order of magnitude more overhead, in terms of CPU and memory usage", even with zygotes and other tricks.
- kentonv on layering: VM clouds rely on "just one layer" (mostly in silicon), while Workers needs an attacker to break V8 and the surrounding defences together.
- Thread vs process switching: "Threads are just stacks. Processes are whole address spaces."
- tptacek: "over time, containers are all going to end up VM-scheduled, as VMs get cheaper and cheaper", and the Linux kernel "simply wasn't designed" to give the isolation naive containers want.
- Cold-start datapoint: a homegrown isolate FaaS reports about 10 ms cold (mostly compile) and 1 ms warm (QuiiBz).

## Excerpts
> "Under no circumstances should CloudFlare or anyone else be running multiple isolates in the same OS process. They need to be sandboxed in isolated processes." — mrkurt (Fly.io), https://news.ycombinator.com/item?id=31759170

> "We started with v8 and decided it was wrong. So obviously I would be saying this." — mrkurt, https://news.ycombinator.com/item?id=31759170

> "When Spectre hit, Chrome concluded that defending the web platform from Spectre in userspace was too hard, so they decided to go all-in on process isolation so that Spectre was the kernel's problem instead." — kentonv (Cloudflare Workers), https://news.ycombinator.com/item?id=31759342

> "At the point Cloudflare is operating at, we've measured that imposing strict process isolation would mean an order of magnitude more overhead, in terms of CPU and memory usage." — kentonv, https://news.ycombinator.com/item?id=31759801

> "All it takes is one bad Xen commit, or one bad design choice at Intel, for VM-based clouds to be broken. Every isolation mechanism has bugs, this is not unique to V8." — kentonv, https://news.ycombinator.com/item?id=31760934

> "Meanwhile, the multitenant-containers/jails/zones people conclusively had the wrong side of the argument, despite how granular they were; multitenant shared-kernel is unsafe." — tptacek (Fly.io), https://news.ycombinator.com/item?id=31760151

> "The Linux kernel simply wasn't designed to provide the kind of isolation "naive" containers want them to." — tptacek, https://news.ycombinator.com/item?id=31761231

> "v8 is a runtime and not a security boundary. Escaping it isn't trivial, but it is common [1]." — dsl, https://news.ycombinator.com/item?id=31758675

## Relevance to the talk
The central debate thread for the "how many tenants per box vs how many layers per tenant" slide. The three insiders state the positions clearly: isolates plus defence in depth (Cloudflare), microVMs (Fly), and no shared kernel (tptacek).
