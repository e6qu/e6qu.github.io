---
title: "Show HN: Porting OpenBSD Pledge() to Linux"
url: https://news.ycombinator.com/item?id=32096801
story_url: https://justine.lol/pledge/
authors: HN discussion of Justine Tunney's Cosmopolitan pledge() port; commenters include jart (Justine Tunney), gnoack (Günther Noack, Landlock contributor), wahern, notaplumber1 and brynet (OpenBSD users/devs), l0kod (Mickaël Salaün, Landlock author)
date: 2022-07-14
accessed: 2026-11-22
kind: discussion
points: 571
comments: 128
---

Read via the HN Algolia items API. Related: [Tame() – bad kitty, no socket
for you](https://news.ycombinator.com/item?id=10306611) (2015-09-30, 151
points), the thread on Theo de Raadt's slides introducing tame(2), which
was renamed pledge(2) in October 2015
(<https://news.ycombinator.com/item?id=10358878>). Our notes:
[openbsd-pledge-2-man-page](../../os-primitives/openbsd-pledge-2-man-page.md),
[openbsd-pledge-hackfest-2015-slides](../../os-primitives/openbsd-pledge-hackfest-2015-slides.md).

## Summary
Tunney implemented OpenBSD's promise strings ("stdio rpath inet …") on
Linux by compiling them to seccomp-bpf filters, with a `pledge.com`
wrapper that sandboxes any command. The thread is the best HN record of
why pledge has been hard to bring to Linux. Günther Noack, who abandoned
his own attempt and now works on Landlock, lists the reasons: syscall
lists drift across kernels and architectures, glibc does lazy
initialisation, and some promises cannot be expressed. OpenBSD people
explain that pledge's semantics came from sandboxing nearly the whole
base system at once, which a Linux distribution cannot do.

## Key points
- Implementation: promises → seccomp-bpf; seccomp cannot dereference pointer arguments, so `sendmsg`/`recvmsg` checks are coarse (jart). Unlike OpenBSD, promises in the Linux port are inherited across `execve()` (notaplumber1, the8472).
- Noack's list of blockers: per-kernel, per-arch syscall allowlists ("a moving target"); glibc and libnss loading code on first use; "dns" can only allow all outgoing UDP; "exec" cannot re-elevate; pledge's own API has changed between OpenBSD 6.0 and 7.1; path-awareness is impossible with seccomp-bpf. His recommendation: Landlock.
- wahern: pledge/unveil semantics were "fine-tuned from OpenBSD developers systematically sandboxing almost the entire base system"; most pledged programs drop `exec`, so inheritance rarely matters; the program itself, not its invoker (systemd), knows which permissions it needs and when.
- saagarjha: syscall-origin verification is "not really even a security feature at all without strong CFI"; "seccomp is kind of not useful unless you own the libc."
- Later adoption figures from OpenBSD people: "85% to 90% of the base operating system" pledged (notaplumber, 2018, <https://news.ycombinator.com/item?id=18428054>); "over ~90%" (brynet, 2026, <https://news.ycombinator.com/item?id=48835004>).
- A year later Ted Unangst (OpenBSD): "Despite the availability of linux pledge, and frequent comments mentioning its existence, I'm not aware of many people using it." (<https://news.ycombinator.com/item?id=38005066>)

## Excerpts
> "Maintaining lists of allowed syscalls across kernel versions and architectures is unreasonable to do, and it's a moving target." — gnoack, <https://news.ycombinator.com/item?id=32097714>

> "IMHO the better approach on Linux is going to be Landlock ( https://landlock.io ) in the future." — gnoack, <https://news.ycombinator.com/item?id=32097714>

> "The semantics of pledge and unveil were fine-tuned from OpenBSD developers systematically sandboxing almost the entire base system--most command-line utilities in OpenBSD are pledged, as are all daemons." — wahern, <https://news.ycombinator.com/item?id=32100678>

> "Note that seccomp has limited visibility into recvmsg / sendmsg args because bpf can't dereference syscall arg pointers." — jart, <https://news.ycombinator.com/item?id=32097919>

> "IMO seccomp is kind of not useful unless you own the libc." — saagarjha, <https://news.ycombinator.com/item?id=32110137>

> "tame() is one of those things that is so simple and obvious in retrospect that it's flabbergasting that it took so long to be invented/(re)discovered." — phpnode (2015 tame thread), <https://news.ycombinator.com/item?id=10307360>

## Relevance to the talk
Explains why the simplest sandbox API (pledge) works on OpenBSD and
struggles on Linux: it depends on owning the kernel, libc and every
program together. Bridges to Landlock as Linux's path-aware answer and
to the agent-sandbox tools that wrap Landlock and seccomp today.
