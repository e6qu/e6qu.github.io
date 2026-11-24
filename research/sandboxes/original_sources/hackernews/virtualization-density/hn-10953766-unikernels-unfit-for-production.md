---
title: "Unikernels are unfit for production"
url: https://news.ycombinator.com/item?id=10953766
story_url: https://www.joyent.com/blog/unikernels-are-unfit-for-production
authors: HN discussion (submitted by anujbahuguna) of Bryan Cantrill's Joyent post
date: 2016-01-22
accessed: 2026-11-22
kind: discussion
points: 359
comments: 318
---

## Summary
The largest unikernel debate on HN. It came the day after Docker acquired Unikernel Systems. Cantrill argued that unikernels give up debuggability, process isolation and the ability to run arbitrary software. Most top comments called the post a strawman. Docker's Solomon Hykes made the case that the hypervisor is simply a smaller, younger OS. If the hypervisor is not secure enough, use physical machines. geofft and others look for a middle ground. Bryan Cantrill himself did not comment.

## Key points
- Main objection to the post: unikernels are not "applications in ring 0 for performance". They run on Xen/KVM, and the security boundary is the hypervisor (zmanian, bcg1, MCRed).
- Hykes's argument: the hypervisor is "much smaller, and as a result reduces security risk", is younger with less legacy, and exposes a lower-level interface that the build toolchain (unikernels) fills in.
- His layered fallback: use VMs; if hypervisors are not secure enough, use physical computers; if one hypervisor per box is too much overhead, build unikernels for bare metal.
- ori_b: under virtualization, "a unikernel is nothing more than a process that uses a very strange system call API". This is the same view that later makes gVisor and Hyperlight look alike.
- Production counter-examples: NetApp filers ran as unikernel-like appliances for 15 years (ChuckMcM). Erlang-on-Xen is debuggable with Erlang's own tooling (derefr).
- Single-language constraint (MirageOS = OCaml) was the most-cited practical problem (chubot).
- Joyent's own position, stated by jclulow: OS virtualisation (zones) for multi-tenancy, with DTrace and mdb for debugging.

## Excerpts
> "The key thing to realize, I think, is that if you're using virtualization, a unikernel is nothing more than a process that uses a very strange system call API." — ori_b, https://news.ycombinator.com/item?id=10954500

> "Op seems to misunderstand the following: 1. Your hypervisor is the security boundary." — zmanian, https://news.ycombinator.com/item?id=10954067

> "You could argue that hypervisor is a special type of OS." — shykes (Docker), https://news.ycombinator.com/item?id=10954273

> "For the remaining use cases where hypervisors are not secure enough, use physical computers instead." — shykes, https://news.ycombinator.com/item?id=10956899

> "Big upvotes for this article. I'm glad it was written, because I've seen nothing but hype for Unikernels on Hacker News (and in ACM, etc.) for the last 2 years." — chubot, https://news.ycombinator.com/item?id=10954342

> "Unless you're running your unikernel on bare metal, it's still running under an OS. It's just that the OS is called a hypervisor and is less bloated than most OSs." — Animats, https://news.ycombinator.com/item?id=10956041

## Relevance to the talk
This is the high point of the unikernel argument. Its "the hypervisor is the real OS" framing comes back in microVMs, Hyperlight, and the "guest kernel vs shared kernel" line that tptacek draws in the 2020s threads. Pairs with `../../virtualization/mirageos-unikernels-asplos2013.md`.
