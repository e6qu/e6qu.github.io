---
title: "FreeBSD Jails for Fun and Profit (2020)"
url: https://news.ycombinator.com/item?id=29649066
story_url: https://topikettunen.com/blog/freebsd-jails-for-fun-and-profit/
authors: HN discussion of Topi Kettunen's blog post; commenters include tptacek, ori_b, rsync; related comments by phkamp (Poul-Henning Kamp, jails author) and cperciva (Colin Percival, FreeBSD)
date: 2021-12-22
accessed: 2026-11-22
kind: discussion
points: 280
comments: 154
---

Read via the HN Algolia items API. Related jail threads used:
[Are Containers the Right Answer to the Wrong Question?](https://news.ycombinator.com/item?id=7960540) (2014-06-29, 63 points; Kamp comments),
[Ask YC: Linux-VServer vs. Xen](https://news.ycombinator.com/item?id=97902) (2008-01-13; Percival comments),
[Escaping containment: A security analysis of FreeBSD jails](https://news.ycombinator.com/item?id=46436828) (39C3 talk, 2025-12-30, 141 points),
[Cells for NetBSD: kernel-enforced, jail-like isolation](https://news.ycombinator.com/item?id=47680532) (2026-04-07, 54 points; Kamp comments),
[Implement unprivileged chroot](https://news.ycombinator.com/item?id=27917230) (FreeBSD, 2021-07-22, 231 points).
Our note: [kamp-watson-2000-freebsd-jails](../../history/kamp-watson-2000-freebsd-jails.md).

## Summary
A how-to post on jails becomes a thread about whether jails are safer
than Linux containers and why the tooling never became Docker-like.
Users praise jails' simplicity (one command, one IP, a single binary
jailed with no userland), and wish for "cattle"-style tooling. Ptacek
gives the security verdict that recurs across HN: jails are about as
safe as modern Docker, simpler to get right, and share the same
fundamental weakness, a kernel shared between tenants. Kamp, the
author of jails, appears in other threads to claim priority and, in
2026, to welcome NetBSD's jail-like "Cells".

## Key points
- Security position (tptacek): "approximately as safe as modern Docker"; Docker has more knobs (eBPF, kernel MAC), jails fewer footguns; both, and Zones, share a kernel.
- 2008 (Percival): single-image systems "are more efficient than fully virtualized systems… however, they're not as secure (the userland-kernel interface is far wider than a kernel-virtualizer interface…)". The shared-kernel argument predates Docker.
- Kamp (2014): "Before Linux adopted "Containers", jails were invented in FreeBSD (by yours truly) and they ran Linux Apps just fine"; justincormack replies Linux emulation has fallen behind as the Linux ABI grew.
- Kamp (2026) on Cells: smaller-scale confinement makes sense, especially for embedded systems; he contrasts it with the ACL rule-writing that "amount[ed] to parallel meta-anti-software development".
- Usability: users isolate single daemons with `jail /path name ip /binary` and no userland (rsync); per-app desktop jails with nullfs and PF QoS (drclau); upgrades across many jails are painful.
- 39C3 (Dec 2025): "a large-scale audit of FreeBSD kernel code paths accessible from within a jail" (quoted by quesera); a commenter says it "made FreeBSD Jails a lot more secure" (vermaden). We did not watch the talk. It is the first systematic jail-escape research we found discussed on HN.
- ori_b: Linux namespaces need `CAP_SYS_ADMIN` (outside user namespaces) — "one of the complaints the plan 9 people have always" had.

## Excerpts
> "They're approximately as safe as modern Docker is… Both jails and containers (and Solaris Zones) share a fundamental security weakness, which is a kernel shared between tenants." — tptacek, <https://news.ycombinator.com/item?id=29655116>

> "Before Linux adopted "Containers", jails were invented in FreeBSD (by yours truly) and they ran Linux Apps just fine, thankyou." — phkamp (2014), <https://news.ycombinator.com/item?id=7960841>

> "The idea that your kernel can only give you one syscall-API is so 1990-ish." — phkamp (2014), <https://news.ycombinator.com/item?id=7960841>

> "the userland-kernel interface is far wider than a kernel-virtualizer interface, so there's far more potential for escape-from-jail bugs" — cperciva (2008), <https://news.ycombinator.com/item?id=97915>

> "there are many situations, in particular in embedded systems, where you can and should confine at a much smaller scale than jails are really convenient for." — phkamp (2026), <https://news.ycombinator.com/item?id=47681621>

> "FreeBSD Jails were so much better than everything else out there, for a long time." — drclau, <https://news.ycombinator.com/item?id=29650433>

## Relevance to the talk
Kamp and Percival on the record, from 2008 to 2026, plus the standard
practitioner verdict. Useful for the history slide (jails as the first
"container") and for the point that the shared-kernel objection is as
old as jails themselves, not a Docker-era discovery.
