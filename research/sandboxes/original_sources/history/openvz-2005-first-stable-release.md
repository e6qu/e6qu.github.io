---
title: first stable release of OpenVZ kernel virtualization solution
url: https://lwn.net/Articles/162685/
authors: Kirill Korotaev for the OpenVZ team (SWsoft)
date: 2005-12-05
accessed: 2026-11-22
kind: blog
---

Announcement read via LWN (as forwarded to the mailing list). History
cross-checked with the OpenVZ wiki timeline <https://wiki.openvz.org/History>
(community-maintained; month-level dates there vary across revisions).

## Summary
SWsoft open-sourced the kernel core of its commercial Virtuozzo product as
OpenVZ. It divides one Linux kernel into isolated *VPSs* (virtual private
servers), each with its own filesystem, process tree, network stack, devices
and IPC objects, and — crucially — strong per-VPS resource accounting and
limits (User Beancounters, fair CPU scheduler, two-level disk quotas) to stop
one tenant DoS-ing the others. Later added live migration (Nov 2006) and fed
PID, IPC and network namespace code into mainline Linux.

## Key points
- Wiki timeline: idea Nov 1999 (Tormasov); first Virtuozzo mock-up Feb 2000;
  User Beancounters work from Sep 2000; Virtuozzo for Linux released Jan 2002;
  OpenVZ project 2005; live migration Nov 2006; SWsoft renamed Parallels 2007.
- Wiki claims "the term "container" was coined by Sun only five years later,
  in 2004" (Kolyshkin quote) — i.e. Solaris Containers.
- By Aug 2009 Parallels was a top-10 kernel contributor via PID, IPC and
  network namespace patches; CRIU (checkpoint/restore in userspace) began
  July 2011.

## Excerpts
> "OpenVZ is a kernel virtualization solution which can be considered as a
> natural step in the OS kernel evolution"

> "From the point of view of the VPS owner (root), it looks like a
> stand-alone server."

> "User Beancounters is a set of per-VPS resource counters, limits, and
> guarantees."

## Relevance to the talk
OpenVZ is the commercial hosting lineage that most directly became
mainline Linux containers: its engineers upstreamed namespaces, and
Beancounters foreshadowed cgroups. Resource isolation (not just
visibility) enters the sandboxing story here.
