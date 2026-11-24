---
title: "Server-side sandboxing: Containers and seccomp"
url: https://news.ycombinator.com/item?id=38000824
story_url: https://www.figma.com/blog/server-side-sandboxing-containers-and-seccomp/
authors: HN discussion of Figma's engineering post; commenters include tedunangst (Ted Unangst, OpenBSD), saagarjha, sargun; related seccomp comments by justincormack and l0kod
date: 2023-10-24
accessed: 2026-11-22
kind: discussion
points: 226
comments: 44
---

Read via the HN Algolia items API. It is the highest-scoring story with
"seccomp" in the title that our searches found; HN has few seccomp
stories (14 with ≥20 points). Related:
[Firejail: Linux namespaces and seccomp-bpf sandbox](https://news.ycombinator.com/item?id=30820387) (2022, 154 points),
[FreeBSD Capsicum vs. Linux Seccomp Process Sandboxing](https://news.ycombinator.com/item?id=47308394) (2026, 125 points),
[The Seccomp Notifier – New Frontiers in Unprivileged Container Development](https://news.ycombinator.com/item?id=23947196) (2020, 61 points).
Our notes: [lwn-seccomp-overview-2015](../../os-primitives/lwn-seccomp-overview-2015.md),
[kernel-doc-seccomp-filter](../../os-primitives/kernel-doc-seccomp-filter.md).

## Summary
Figma described sandboxing server-side image processing with nsjail
(namespaces) and seccomp allow-lists derived from tracing. HN's response
is the practitioner view of seccomp: effective but fiddly, because the
real syscall set depends on libc, configuration and environment, not
just the program. Ted Unangst points out that a trace misses calls that
only occur in other environments (`ls` needs sockets when NIS/yp is
on), which pledge handles by grouping syscalls by intent. Others point
to nsjail, systemd's `SystemCallFilter=@system-service`, and Landlock as
the next step.

## Key points
- Tracing is not enough (tedunangst): "Does ls need network sockets? Sure does, if you have yp enabled. But this won't appear in your trace unless you trace in such an environment."
- Dependencies decide (saagarjha): your libc "might be using something else like iovec or press/pwrite [sic] under the hood".
- Easy path: systemd `SystemCallFilter=` with the `@system-service` group (zxcvgm).
- "seccomp is heaps better than selinux, but still too overly complicated to be using in everyday production unless you're… dealing with high-stakes sandboxing" (declan_roberts).
- Next generation: "There was some recent issues due to IO_uring and extensible syscalls… I believe the next generation looks something like landlock" (sargun).
- Earlier record: justincormack (2015) — "Seccomp is almost unusable for most purposes with anything resembling tight filters as you do not really know what syscalls glibc especially will add"; l0kod (2025) — "Seccomp is not an access control system, but Landlock is."
- Philosophical aside: "Are operating systems failing at their jobs if one can't run independent workloads on them anymore?" — "It's actually not that hard to make OSes that run completely independent workloads. The problem is that this is not useful." (IcyWindows, saagarjha)

## Excerpts
> "Does ls need network sockets? Sure does, if you have yp enabled. But this won't appear in your trace unless you trace in such an environment. (Although pledge on openbsd transparently handles this case for you.)" — tedunangst, <https://news.ycombinator.com/item?id=38005044>

> "Despite the availability of linux pledge, and frequent comments mentioning its existence, I'm not aware of many people using it." — tedunangst, <https://news.ycombinator.com/item?id=38005066>

> "Seccomp BPF is great. There was some recent issues due to IO_uring and extensible syscalls, but I believe for now, those issues are avoidable." — sargun, <https://news.ycombinator.com/item?id=38005359>

> "It's actually not that hard to make OSes that run completely independent workloads. The problem is that this is not useful." — saagarjha, <https://news.ycombinator.com/item?id=38009595>

> "Seccomp is almost unusable for most purposes with anything resembling tight filters as you do not really know what syscalls glibc especially will add to your program." — justincormack (2015), <https://news.ycombinator.com/item?id=9441825>

## Relevance to the talk
Why syscall allow-lists are hard to write by hand, and why agent
sandboxes use coarse seccomp profiles (block dangerous calls) plus
Landlock or mount namespaces for the actual policy. Saagarjha's line is
a good closer for the "isolation vs. usefulness" trade-off.
