---
title: LXC — Introduction
url: https://linuxcontainers.org/lxc/introduction/
authors: LXC project (linuxcontainers.org); originally Daniel Lezcano et al. (IBM)
date: project started 2008; page is living
accessed: 2026-11-22
kind: docs
---

## Summary
LXC is the first widely used userspace toolset that combined the new kernel namespaces and cgroups into
"containers" on mainline Linux, no patched kernel required (unlike Linux-VServer/OpenVZ). It positions
containers between a chroot and a full VM. Docker 0.1 (2013) was built on top of LXC.

## Key points
- Kernel features used: IPC, UTS, mount, PID, network and user namespaces; AppArmor/SELinux profiles;
  seccomp; chroot via `pivot_root`; capabilities; cgroups.
- 2008 history: Daniel Lezcano announced "lxc userspace tools 0.3.0" (Oct 2008) and 0.4.0 on 2008-10-28
  on the containers/LKML lists (https://lkml.iu.edu/hypermail/linux/kernel/0810.3/1887.html). Wikipedia
  gives the initial release as 2008-08-06 (secondary; not verified against a primary source).
- Docker replaced LXC with libcontainer as default in Docker 0.9 (2014-03-10).

## Excerpts
> "LXC is a userspace interface for the Linux kernel containment features." — Introduction

> "LXC containers are often considered as something in the middle between a chroot and a full fledged virtual machine." — Introduction

## Qualifications from Hacker News
Jérôme Petazzoni (dotCloud/Docker) said on HN in 2013 that LXC was largely the OpenVZ team's work. This is **unverified** and sits alongside the attribution to IBM's Daniel Lezcano above ([note](../hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md), <https://news.ycombinator.com/item?id=5409235>).

## Relevance to the talk
The bridge from the kernel primitives (2002–2008) to Docker (2013): the moment "container" became a
product shape on stock Linux.
