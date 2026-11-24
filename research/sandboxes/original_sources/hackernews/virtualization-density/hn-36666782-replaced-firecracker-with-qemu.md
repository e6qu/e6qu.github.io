---
title: "We replaced Firecracker with QEMU"
url: https://news.ycombinator.com/item?id=36666782
story_url: https://hocus.dev/blog/qemu-vs-firecracker/
authors: HN discussion (submitted by hugodutka, Hocus co-founder) of the Hocus blog post
date: 2023-07-10
accessed: 2026-11-22
kind: discussion
points: 409
comments: 149
---

## Summary
Hocus, a self-hosted dev-environment product, explained why it moved from Firecracker back to QEMU for long-lived workloads. Its reasons: Firecracker never returns memory to the host once the guest allocates it, it lacked discard for disks, and its I/O was slower. The thread split three ways. Some pointed out that Firecracker has a balloon device. Some noted it was built for short-lived serverless functions, not dev boxes. A Xen maintainer objected to calling Firecracker a "hypervisor" at all. CodeSandbox's founder described running Firecracker for long-lived dev environments anyway, adding a balloon, discard and io_uring.

## Key points
- The limitation the post complained about: "once a workload inside allocates RAM, Firecracker will never return it to the host". Commenters replied that a virtio balloon can be inflated and deflated to return memory.
- Terminology: KVM and Xen are hypervisors, and Firecracker and QEMU are user-space VMMs that drive KVM (gwd, a Xen developer).
- CodeSandbox reclaims memory with the balloon, discards and compresses disks, and uses io_uring for scratch disks. It takes on that extra work in exchange for a VMM it can extend with memory snapshots and live cloning.
- Hocus looked at Cloud Hypervisor but found it lacked discard support at the time.
- Fly.io (tptacek): "We like Firecracker", but it had not managed to get ballooning working in production.
- The density thread, again: one commenter wants deduplicated, zero-copy page sharing between guests, not after-the-fact KSM.

## Excerpts
> "Listen people, Firecracker is NOT A HYPERVISOR. A hypervisor runs right on the hardware." — gwd, https://news.ycombinator.com/item?id=36666987

> "the fork was very very bad for eating soup - this is a story about how we migrated to a spoon" — lessaligned, https://news.ycombinator.com/item?id=36667717

> "For us that made sense, because in return we get a lightweight VMM that we can more easily extend with functionality like memory snapshotting and live VM cloning" — CompuIves (CodeSandbox), https://news.ycombinator.com/item?id=36669740

> "We're not using virtio memory ballooning right now (we've never had the time to get it working)." — tptacek (Fly.io), https://news.ycombinator.com/item?id=36675778

> "Firecracker has a balloon device you can inflate (ie: acquire as much memory inside the VM as possible) and then deflate... returning the memory to the host." — rgbrenner, https://news.ycombinator.com/item?id=36667792

## Relevance to the talk
MicroVMs are built for short-lived workloads. Coding-agent sandboxes run for minutes to hours, so memory reclamation, disk discard and snapshot size become the real costs, not boot time. This is the background to why later agent sandboxes (Sprites, Lambda MicroVMs) emphasise checkpoint and suspend.
