---
title: "Triton: Docker and the “best of all worlds”"
url: https://news.ycombinator.com/item?id=9257130
story_url: https://www.joyent.com/blog/triton-docker-and-the-best-of-all-worlds
authors: HN discussion of Bryan Cantrill's Joyent post; commenters include bcantrill, dap (Joyent), justincormack (NetBSD rump/compat), geofft
date: 2015-03-24
accessed: 2026-11-22
kind: discussion
points: 202
comments: 100
---

Read via the HN Algolia items API. Also used: Cantrill's comments in
[Interview with Eric Brewer](https://news.ycombinator.com/item?id=9566064)
(2015-05-18) and [Containers and Docker: how secure are they?](https://news.ycombinator.com/item?id=6252182)
(2013), and Joshua Clulow's in [Abusing Privileged and Unprivileged Linux Containers](https://news.ycombinator.com/item?id=11816852) (2016).
Our source note: [cantrill-2015-triton-lx-zones](../../history/cantrill-2015-triton-lx-zones.md).

## Summary
Joyent's Triton ran Docker images on bare-metal SmartOS by executing
Linux binaries in revived LX-branded zones, with the whole datacentre
exposed as one Docker host. The thread is mostly about how that works:
emulating the Linux syscall ABI in the illumos kernel without any Linux
code. The wider Cantrill record on HN gives the security argument
behind it: zones and jails have a long multi-tenant record, while Linux
namespaces are, in his words, much less mature.

## Key points
- Triton container = "a SmartOS container running an LX-branded zone" (Cantrill); "There is no actual Linux code in the implementation" (justincormack).
- Emulating Linux interfaces in illumos: epoll mapped onto the older `/dev/poll`; Joyent's epoll(5) man page refuses to copy Linux's delivery of events for closed fds, "too peculiar or ill-conceived to merit accommodation".
- justincormack (NetBSD): Linux emulation is "just tedious"; illumos is "AFAIK the first system to emulate epoll".
- Cantrill (Brewer thread, 2015): containers in SmartOS "in production for over a decade"; CVEs against zones "few and far between"; for Linux namespaces "a 'lot less solid' is probably phrasing it generously".
- Cantrill on OpenVZ: had Linux taken back the OpenVZ changes, "the security gap… might have been closed much more quickly"; instead OpenVZ was discarded "in favor of the much more immature namespaces".
- Cantrill (2021, illumos SPARC thread): Joyent ran public multi-tenant workloads on zones "(and before that, jails) for many years. We seriously trusted it".

## Excerpts
> "No, it's not -- a Triton container is a SmartOS container running an LX-branded zone." — bcantrill, <https://news.ycombinator.com/item?id=9739618> (from the 2015 Triton-vs-VMs thread)

> "So while we do aspire to be bug-compatible, we're not about to compromise our principles over it." — bcantrill, <https://news.ycombinator.com/item?id=9260344>

> "Isn't it an example of taking Solaris to new and intriguing heights? There is no actual Linux code in the implementation." — justincormack, <https://news.ycombinator.com/item?id=9257930>

> "if by containers you mean Linux namespaces, then yes, a "lot less solid" is probably phrasing it generously." — bcantrill, <https://news.ycombinator.com/item?id=9568692>

> "with the OpenVZ work essentially discarded in favor of the much more immature namespaces), Linux isn't on a trajectory to offer multi-tenant security via containers in the foreseeable future" — bcantrill, <https://news.ycombinator.com/item?id=9568842>

> "At Joyent, we deployed public-facing multitenant workloads based on zones (and before that, jails) for many years. We seriously trusted it" — bcantrill, <https://news.ycombinator.com/item?id=27078349>

## Relevance to the talk
The strongest insider voice for "OS virtualization can be a real
multi-tenant boundary, if it is designed as one". Also a precedent for
gVisor and WSL1: implementing the Linux ABI on a different kernel as an
isolation layer.
