---
title: "Announce: many virtual servers on a single box"
url: https://lkml.iu.edu/hypermail/linux/kernel/0110.1/0909.html
authors: Jacques Gélinas (Solucorp), linux-kernel mailing list
date: 2001-10-11
accessed: 2026-11-22
kind: blog
---

Original LKML post read from the Indiana University hypermail archive. The
project page it links (solucorp.qc.ca/miscprj/s_context.hc) was not checked;
the later project site is linux-vserver.org.

## Summary
The birth announcement of what became Linux-VServer: a patch to Linux
2.4.10/2.4.11 adding two system calls, `new_s_context` (assign a process to a
*security context*) and `set_ipv4root` (bind a context to one IPv4 address),
so several "virtual servers" can share one kernel. Each vserver has an
isolated process list and its own services on the same ports, and its root
can be handed to a customer because a new per-process *capability ceiling*
stops even setuid programs from regaining dangerous capabilities.

## Key points
- Shared kernel, per-context process visibility ("You can't see or send
  signal to process in other vservers").
- Filesystem isolation via chroot; network via one IP per vserver.
- Per-process capability ceiling, inherited by children — an early form of
  Linux's capability bounding set.
- Released under GPL; follow-up thread notes /proc/sys writability and
  missing resource limits/scheduler fairness as open issues (per search
  summaries of replies; replies not read in full).
- Later work: Soltesz et al., "Container-based Operating System
  Virtualization: A Scalable, High-performance Alternative to Hypervisors",
  EuroSys 2007, used VServer (as deployed on PlanetLab) vs Xen — not fetched
  here.

## Excerpts
> "I have enhanced the kernel to allow several independant virtual servers
> running on the same box (sharing the same kernel as well). I introduced 2
> new system calls (new_s_context and set_ipv4root) allowing much
> independance between the virtual servers."

> "Virtual servers are independant enough and "real" enough that you can
> supply root password to the virtual server administrators."

> "I have introduced a per-process capability ceiling, inherited by
> sub-process. Even setuid program can't grab more capabilities.."

## Relevance to the talk
Linux's jail-equivalent arrived as an out-of-tree patch 18 months after
FreeBSD 4.0. It shows the same recipe (chroot + process scoping + one IP +
weakened root) and the "give the customer root" motivation that defines
hosting-era containers. Never merged; mainline Linux instead grew
namespaces piecemeal from 2002 (mount) to 2013 (user).
