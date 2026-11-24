---
title: "Containers are tents"
url: https://news.ycombinator.com/item?id=27480496
story_url: https://increment.com/containers/containers-vs-vms/
authors: HN discussion of an Increment magazine essay (houses vs. tents); main voice tptacek (Thomas Ptacek, Fly.io), plus his comments in related threads 2021–2026
date: 2021-06-12
accessed: 2026-11-22
kind: discussion
points: 192
comments: 103
---

Read via the HN Algolia items API. Because this thread is the clearest
home of the "shared kernel" argument, the excerpts also include Ptacek's
statements of the same position in other threads (each linked), found
with the Algolia comment search (`tags=comment,author_tptacek`).

## Summary
The essay compares VMs to brick houses and containers to tents. HN
splits three ways. Ptacek, who runs a microVM platform, accepts
containers as a packaging format but says shared-kernel isolation cannot
hold multi-tenant untrusted workloads, because the kernel's attack
surface cannot be masked off with syscall filters; virtualization wins
because the hypervisor is a much smaller TCB. Others push back that
namespaces, seccomp and cgroups make containers much stronger than a
tent or a chroot. A third group says containers won on packaging, not
isolation, so the analogy misses the point.

## Key points
- Ptacek's position, repeated almost unchanged from 2021 to 2026: "containers" as packaging are great; shared-kernel isolation of native Unix programs is not a boundary between untrusted tenants; run container images as VMs (Firecracker) or under gVisor.
- His mechanism: kernel vulnerabilities "are present, somewhat routinely, in functionality that can't be masked off with system call filters"; his favourite example elsewhere is the `waitid` LPE, which no container lockdown blocked.
- On FreeBSD jails (2021): "approximately as safe as modern Docker is"; jails, containers and zones "share a fundamental security weakness, which is a kernel shared between tenants".
- On io_uring (2024): syscalls and their arguments are "an obvious security boundary… io_uring blows that boundary apart".
- Counter-camp: "Am I the only one getting tired of people stating confidently that containers don't improve safety _at all_" (0xcmoney); "Modern containers do provide lots of security features" (nijave); Solaris zones isolate resources as well as VMs (jsiepkes).
- Packaging camp: containers won "because of ease packaging and distribution of the artifacts" (rossmohax); "containers are fat RPMs that construct a chroot jail" (lamontcg).

## Excerpts
> "you still can't run multitenant workloads from arbitrary untrusted tenants on shared-kernel isolation. It turns out to be pretty damned useful to be able to ship application components as containers, but have them run as VMs." — tptacek, <https://news.ycombinator.com/item?id=27480880>

> "The win of virtualization is that the machinery required to hypervise a kernel is much, much smaller than the kernel itself; to use the 70s terminology, it's a minimized trusted computing base." — tptacek, <https://news.ycombinator.com/item?id=27485272>

> "Containers are great, but shared-kernel security isolation of standard Unix programs doesn't work." — tptacek (Leaky Vessels thread, 2024), <https://news.ycombinator.com/item?id=39253220>

> "Both jails and containers (and Solaris Zones) share a fundamental security weakness, which is a kernel shared between tenants." — tptacek (FreeBSD jails thread, 2021), <https://news.ycombinator.com/item?id=29655116>

> "It is not OK to run competing untrusted tenant workloads under a single shared kernel. Kernel LPEs are not rare." — tptacek (2026), <https://news.ycombinator.com/item?id=47967051>

> "Am I the only one getting tired of people stating confidently that containers don't improve safety _at all_ because they run on the same kernel? It's just not true." — 0xcmoney, <https://news.ycombinator.com/item?id=27485140>

> "containers are fat RPMs that construct a chroot jail." — lamontcg, <https://news.ycombinator.com/item?id=27481130>

## Relevance to the talk
The mature form of the debate begun in 2013
([hn-6252182](hn-6252182-containers-docker-how-secure-2013.md)): by 2021
the practitioner consensus is "container image, VM boundary", which is
the architecture of Firecracker, Kata and most agent sandboxes. Ptacek's
"minimized TCB" line ties it back to the 1970s literature in our history
topic.
