---
title: "Fly Machines: An API for Fast-Booting VMs"
url: https://news.ycombinator.com/item?id=31496744
story_url: https://fly.io/blog/fly-machines/
authors: HN discussion (submitted by samwillis) of Fly.io's announcement (by Kurt Mackey and Chris Nicoll)
date: 2022-05-24
accessed: 2026-11-22
kind: discussion
points: 245
comments: 115
---

## Summary
Fly.io announced Machines, a low-level API that "turns Docker images into running VMs" (Firecracker) fast enough to start on demand, intended for people building their own platforms. One commenter compares its ~300 ms start with Lambda's warm start. The top question: "I thought we turned to Docker/containers because VMs were too heavy? Now we've got VMs that run Docker?" tptacek answered with the multi-tenant isolation rule: use containers for single-tenant workloads and micro-VMs for multi-tenant ones. mrkurt explained why Fargate and Lambda take longer: they shuffle capacity to fit you, while Fly returns a fast error instead.

## Key points
- tptacek's rule: "Use containers for single-tenant workloads; use micro-VMs, whichever flavor you like best, for multi-tenant."
- Why VMs: virtualization "drastically scopes down the amount of kernel code exposed to untrusted code". KVM is much smaller than "the entire system call interface, along with every exposed device and its suite of ioctls".
- GPUs are "a Big Project", and "We might not even use Firecracker" for them, because the Firecracker model prizes a minimal, mostly memory-safe, easy-to-reason-about attack surface.
- Scheduling: Fargate/Lambda move other tenants out of the way to place you, which can take minutes on Fargate. Fly Machines fail fast when there is no capacity (mrkurt).
- No live migration yet. Fly did not even migrate persistent disks or IPs between hosts at the time.
- An ex-GCE engineer (boulos): EC2 historically didn't prioritise instance boot time, while GCE drove it down.

## Excerpts
> "I thought we turned to Docker/containers because VMs were too heavy? Now we've got VMs that run Docker?" — ryanianian, https://news.ycombinator.com/item?id=31497709

> "It's a moot point, because this is a solved problem. Use containers for single-tenant workloads; use micro-VMs, whichever flavor you like best, for multi-tenant." — tptacek (Fly.io), https://news.ycombinator.com/item?id=31498321

> "Because the broad kernel attack surface is huge, and the shield has to reliably protect all of it, or all you've done is create a jungle gym for vulnerability researchers." — tptacek, https://news.ycombinator.com/item?id=31498338

> "KVM is a much smaller chunk of the kernel than the entire system call interface, along with every exposed device and its suite of ioctls." — tptacek, https://news.ycombinator.com/item?id=31499756

> "When you ask for a Fargate container (or a new Lambda "instance"), AWS actually moves other containers/lambdas out of the way to get you running." — mrkurt (Fly.io), https://news.ycombinator.com/item?id=31498836

## Relevance to the talk
Gives a one-line rule (single-tenant → container, multi-tenant → microVM) and the attack-surface reason behind it ("jungle gym for vulnerability researchers"). Fly Machines are the direct precursor to Sprites (hn-46634450). Fly's longer essay is "Sandboxing and workload isolation" (https://news.ycombinator.com/item?id=24001246, 158 points).
