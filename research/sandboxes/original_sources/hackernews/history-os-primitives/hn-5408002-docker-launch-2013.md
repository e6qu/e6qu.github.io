---
title: "Docker - the Linux container runtime"
url: https://news.ycombinator.com/item?id=5408002
story_url: http://docker.io/
authors: HN discussion (submitter unknown; Solomon Hykes "shykes" and Jérôme Petazzoni "jpetazzo" of dotCloud answering; Bryan Cantrill "bcantrill" of Joyent)
date: 2013-03-20
accessed: 2026-11-22
kind: discussion
points: 273
comments: 204
---

Read via the HN Algolia items API (`/api/v1/items/5408002`), all comments.
Companion thread six days later, when the code was published:
[Docker, the Linux container runtime: now open-source](https://news.ycombinator.com/item?id=5445387)
(2013-03-26, 403 points, 76 comments).

## Summary
The thread that introduced Docker to HN, five days after Hykes' PyCon
lightning talk and before the code was public. Hykes (dotCloud) was
surprised it surfaced "before actual release" and spent the thread
explaining the pitch: a standard unit of software built on LXC, AUFS and
cgroups. The first security question appears early, and Hykes' answer
already concedes the point the community argued over for the next
decade: do not run untrusted root code in a container next to anything
valuable. Cantrill uses the thread to make the Joyent case for OS-based
virtualization (SmartOS zones) over hardware VMs.

## Key points
- Hykes says Docker is "currently based on lxc, but that is an implementation detail"; it "could be ported to any process-level isolation tech… OpenVZ, Solaris Zones… BSD jails".
- Insider history: dotCloud's "first OpenVZ-based prototypes in 2009"; Docker is "the direct result of dotCloud's experience running hundreds of thousands of containers in production over the last 2 years".
- The PyCon talk was meant for "maybe 15 fellow kernel geeks" in a backroom but was given "in the main room to at least 500 people" (Hykes, 5409678).
- Security position at launch: Petazzoni says cgroups "have no effect on permissions", and dotCloud supplements LXC with grsecurity (production) and AppArmor (Docker).
- Skeptics: "LXC DOES NOT PROVIDE SECURITY… Breaking out of a filesystem container is as easy as creating a root block device" (zobzu); "why use this when systemd offers the same?"; a Nix user calls it closure copying.
- Petazzoni claims LXC "is actually the work of the OpenVZ team… a reimplementation of OpenVZ concepts by almost the same team". This is an insider claim, not verified; our [lxc-introduction](../../os-primitives/lxc-introduction.md) note credits Daniel Lezcano (IBM) for the userspace tools. OpenVZ developers did write much of the kernel namespace code.
- Requirements at launch: a modern kernel with the AUFS module; testing on Ubuntu 12.04/12.10; no 32-bit builds.

## Excerpts
> "Yes, you probably don't want to run untrusted code with root privileges inside a container if anything valuable is running on the same host." — shykes, <https://news.ycombinator.com/item?id=5408930>

> "Correct, Docker is currently based on lxc, but that is an implementation detail." — shykes, <https://news.ycombinator.com/item?id=5408787>

> "Using a generic container layer early on (first OpenVZ-based prototypes in 2009) is what allowed us to launch multi-language support a year before any other paas." — shykes, <https://news.ycombinator.com/item?id=5409032>

> "Note that LXC DOES NOT PROVIDE SECURITY. It provides resource separation (to a point) and so on." — zobzu, <https://news.ycombinator.com/item?id=5409082>

> "we DO use LXC and SUPPLEMENT it by something providing security such as GRSEC (in the current version in production at dotCloud) and AppArmor (with docker)" — jpetazzo, <https://news.ycombinator.com/item?id=5409221>

> "LXC is actually the work of the OpenVZ team. When they were tired about seeing their patches rejected from the mainstream kernel, they decided to try a different approach, and that approach is LXC." — jpetazzo, <https://news.ycombinator.com/item?id=5409235>

> "with OS-based virtualization, all unused DRAM is available to the system at large" — bcantrill, <https://news.ycombinator.com/item?id=5408871>

## Relevance to the talk
The founding moment of the container era, with its security caveat
stated by the founder on day one. Useful for the "containers were sold
as packaging, not as a sandbox" argument, and for the
vserver → OpenVZ → LXC → Docker lineage told by the people who ran it.
