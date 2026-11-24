---
title: "Containers vs. Zones vs. Jails vs. VMs"
url: https://news.ycombinator.com/item?id=13982620
story_url: https://blog.jessfraz.com/post/containers-zones-jails-vms/
authors: HN discussion of Jessie Frazelle's blog post; commenters include cperciva (Colin Percival, FreeBSD), cyphar (runc), geofft, justincormack, benmmurphy, floatboth, bonzini
date: 2017-03-29
accessed: 2026-11-22
kind: discussion
points: 714
comments: 235
---

Read via the HN Algolia items API. Reposted as "Containers vs. Zones vs.
Jails vs. VMs (2017)" on 2020-04-06 (351 points, 128 comments,
<https://news.ycombinator.com/item?id=22797688>).

## Summary
Frazelle's post argued that zones, jails and VMs are "first-class"
designed isolation primitives, while a Linux "container" is not a real
kernel object but an assembly of namespaces, cgroups, capabilities,
seccomp and LSMs — powerful, but complex enough to get wrong. This is
the most upvoted HN discussion of the topic. Commenters with Solaris and
FreeBSD background explain how zones and jails are implemented (a zone
or jail ID in the process table) versus Linux's per-resource namespaces;
others point out that the "container" users care about is really the
image format, not the isolation.

## Key points
- Implementation contrast (benmmurphy): zones isolate PIDs by checking `zone_id`; there is no UID mapping, no mount namespace (a chroot-like vnode), and devices are mediated by RBAC. Linux spreads the same job across namespaces and cgroups, so "something has to put it together".
- floatboth: jails start from a secure baseline (processes, users, POSIX IPC, mounts always isolated) and relax; namespaces start from nothing and add. A jail is "just one more column in the process table. PID, UID, and now JID".
- The flip side: benmmurphy found a bug in Joyent's Docker-on-zones where the global zone could be tricked into creating device nodes inside a zone; a default LXC container's device cgroup would have blocked it.
- cyphar (2017) on unprivileged user namespaces: "relatively" secure with SELinux/AppArmor/seccomp, most bugs having involved POSIX ACLs; `CONFIG_USERNS=n` is safer only because less code runs.
- justincormack: a container needs "10-100 syscalls, depending how much isolation you want. A single unshare() and exec gets you some benefit."
- The "containers are packaging" camp: ianburrell, wmf ("Most Docker images also contain a full OS"), cookiecaper ("What people really want is super cheap VMs").
- bonzini (QEMU/KVM): libvirt confines each QEMU process with SELinux, closing most QEMU bugs.

## Excerpts
> "linux containers are more like gaffer tape around namespaces and cgroups than something like lego." — nisa, <https://news.ycombinator.com/item?id=13983265>

> "in zones pid separation is implemented by just checking the zone_id and if the zone_id is different then processes can't access each other." — benmmurphy, <https://news.ycombinator.com/item?id=13984563>

> "jails are at their core just one more column in the process table. PID, UID, and now JID (Jail ID)." — floatboth, <https://news.ycombinator.com/item?id=13985396>

> "If you have a choice between writing 10 lines of code or reusing 100,000 lines of someone else's code, unless you're a truly awful coder you'll end up with fewer bugs if you take the "10 lines of code" option." — cperciva, <https://news.ycombinator.com/item?id=13982857>

> "Is a kernel that has CONFIG_USERNS=n more secure than one that doesn't? Yes (because it has less code running) but that doesn't mean that CONFIG_USERNS=y is insecure" — cyphar, <https://news.ycombinator.com/item?id=13988006>

> "What people really want is super cheap VMs, but they're fooling themselves into believing they want containers" — cookiecaper, <https://news.ycombinator.com/item?id=14089861>

## Relevance to the talk
The canonical "designed primitive vs. assembled primitive" framing,
backing the os-primitives synthesis. Useful slide contrast: jail/zone =
one ID in the process table; Linux container = eight namespaces + cgroups
+ capabilities + seccomp + LSM, assembled by a runtime.
