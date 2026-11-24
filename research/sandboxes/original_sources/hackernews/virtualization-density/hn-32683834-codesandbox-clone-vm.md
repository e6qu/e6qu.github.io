---
title: "We clone a running VM in 2 seconds"
url: https://news.ycombinator.com/item?id=32683834
story_url: https://codesandbox.io/post/how-we-clone-a-running-vm-in-2-seconds
authors: HN discussion (submitted by mrkurt) of Ives van Hoorne's CodeSandbox post
date: 2022-09-01
accessed: 2026-11-22
kind: discussion
points: 414
comments: 109
---

## Summary
CodeSandbox explained how it forks running Firecracker microVMs, memory included, to give every branch or PR a live dev environment. Its founder Ives van Hoorne (CompuIves) answered most questions. Memory files are mmapped shared, so dirty pages sync back, with a copy-on-write layer per clone on XFS. Every clone gets the same IP, each in its own network namespace. With memory overcommit, 200 VMs ran on a 128 GB host. Marc Brooker (AWS) raised the clone-uniqueness (RNG) problem. Colin Percival argued that fast cold boot (FreeBSD/Firecracker reaching userland in 33 ms) may make snapshots unnecessary.

## Key points
- Mechanism: Firecracker patched to use a *shared* mmap of the memory file instead of a private one, so dirtied pages write back automatically. Firecracker can also track dirty pages for incremental snapshots. On fork, VM A's memory is frozen and both A and B write to new copy-on-write layers. XFS reflinks provide copy-on-write and cause fragmentation.
- Networking: every VM has the same IP inside its own netns, with iptables rewriting at the boundary. During a fork pause, TCP sees packet loss rather than a reset.
- Density datapoint: 200 VMs × 2 GB (each a Vite dev server with a file changing every second) on a 128 GB node. Memory pressure swapped back to the memory file, and "The bottleneck here was CPU."
- Largest VM so far: 12 GB RAM, 8 vCPU. Hosted on bare-metal Hetzner.
- Clone uniqueness: clones must not return the same random numbers (mjb, linking AWS's paper arXiv 2102.12892). CodeSandbox avoids cloning across organisations when secrets are set.
- Post-clone memory cost: londons_explore saw memset over a few GB slow down "a factor of 1000x" after a clone. CompuIves sees the slowdown only on first-touch page faults.
- Boot instead of snapshot: "FreeBSD/Firecracker can reach userland in 33 ms, and the OSv unikernel boots in under 10 ms" (cperciva). The reply: user dev servers take minutes to start, so the VM boot is not the bottleneck.

## Excerpts
> "One challenge to clone-and-restore that they don't talk about here is making sure that clones don't behave too similarly (like returning the same cryptographic random numbers)." — mjb (AWS), https://news.ycombinator.com/item?id=32684658

> "We were able to run 200 VMs (all running Vite dev server where a file was changed every second) with 2GB RAM per VM, on a node with 128GB RAM." — CompuIves (CodeSandbox), https://news.ycombinator.com/item?id=32685054

> "FreeBSD/Firecracker can reach userland in 33 ms, and the OSv unikernel boots in under 10 ms." — cperciva, https://news.ycombinator.com/item?id=32685778

> "For example, a simple memset() call across a few gigabytes of RAM inside the VM might slow down a factor of 1000x after a VM clone like this." — londons_explore, https://news.ycombinator.com/item?id=32685901

> "So even if we can start the VM fast, the most important speedup for us is on the user code that we cannot control." — CompuIves, https://news.ycombinator.com/item?id=32688028

## Relevance to the talk
VM fork is to agent sandboxes what fork() was to Unix. CodeSandbox is the earliest well-documented production use, and the thread lists the real problems: RNG and identity uniqueness, network identity, CoW storage fragmentation and first-touch page faults. Related: Arca's continuation capture (`../../density/arca-osdi26.md`) and Netlify's snapshot-based Edge Functions (hn-49912444).
