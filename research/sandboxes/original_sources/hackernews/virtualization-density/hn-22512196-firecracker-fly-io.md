---
title: "Firecracker: Secure and fast microVMs for serverless computing"
url: https://news.ycombinator.com/item?id=22512196
story_url: https://firecracker-microvm.github.io/
authors: HN discussion (submitted by based2) of the Firecracker project site
date: 2020-03-07
accessed: 2026-11-22
kind: discussion
points: 425
comments: 103
---

## Summary
The highest-scoring Firecracker thread. Fly.io's co-founder Kurt Mackey (mrkurt) dominates it and gives early production numbers. Fly runs "fleets of fast booting vms" on Firecracker under Nomad, with its own Rust init and an image-to-rootfs builder. It looked at gVisor and chose "more traditional virtualization". Some apps boot in under 20 ms, which makes a VM per request or TCP connection feasible. Snapshot/suspend was not yet available.

## Key points
- Fly.io stack in 2020: Nomad, a custom Firecracker task driver, a custom init in Rust with an RPC channel into the VM, and a Docker-image → root-filesystem builder.
- Boot numbers: "We've booted some apps in Firecracker in <20ms". Deno running on the OSv unikernel took about 20 ms to boot and accept an HTTP request. The image pull, not the boot, is the bottleneck.
- Fly did not scale to zero then because "the cold start experience for most apps is brutal". It hoped for suspend/resume and migration later, which became Fly Machines (2022) and Sprites (2026).
- AMD support was in developer preview. An AWS employee said it was already in-tree.
- A commenter asked whether a microVM could be reset for every request. mrkurt said snapshot/suspend wasn't doable yet.

## Excerpts
> "Firecracker is great We use it to run fleets of fast booting vms at https://fly.io." — mrkurt, https://news.ycombinator.com/item?id=22512529

> "We've booted some apps in Firecracker in <20ms, so if you build the app properly you can absolutely do a new VM per request or TCP connection even." — mrkurt, https://news.ycombinator.com/item?id=22513922

> "We were playing with Deno + OSv just today and got an app to boot and accept an HTTP request in about 20ms." — mrkurt, https://news.ycombinator.com/item?id=22514275

> "We looked at gvisor pretty hard but preferred more traditional virtualization." — mrkurt, https://news.ycombinator.com/item?id=22514275

> "We don't scale to 0 because the cold start experience for most apps is brutal. In the future we may be able to suspend VMs and wake them up quickly, or even migrate them to regions with idle servers." — mrkurt, https://news.ycombinator.com/item?id=22519057

## Relevance to the talk
Firsthand evidence that microVM boot was fast enough for per-request VMs by 2020, and that the remaining cost was the application's own start-up. That is the gap that snapshot/restore later closed. Pairs with the Fly Machines and Sprites threads (hn-31496744, hn-46634450).
