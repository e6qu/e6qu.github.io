---
title: "Docker 0-Day Stopped Cold by SELinux"
url: https://news.ycombinator.com/item?id=13398249
story_url: http://rhelblog.redhat.com/2017/01/13/docker-0-day-stopped-cold-by-selinux
authors: HN discussion of a Red Hat blog post on CVE-2016-9962 (runc); commenters include bigmac (signs as "Security at Docker"), shykes, justincormack and cyphar (runc), nailer (ex-Red Hat), mjg59, peterwwillis
date: 2017-01-14
accessed: 2026-11-22
kind: discussion
points: 275
comments: 158
---

Read via the HN Algolia items API. Related LSM thread:
[SELinux is unmanageable; just turn it off if it gets in your way](https://news.ycombinator.com/item?id=31176138)
(2022-04-27, 491 points). Our note:
[lsm-usenix-2002-paper](../../os-primitives/lsm-usenix-2002-paper.md).

## Summary
Red Hat claimed SELinux stopped a runc vulnerability (CVE-2016-9962, in
how `runc exec` joined a running container). Docker's
security team replied in the thread that the post was wrong and SELinux
only partly mitigated it; Docker's founder then wrote a long comment
about competitors "bullying" with security marketing. Underneath the
vendor fight is the standing LSM argument: SELinux is one of the few
things that can make shared container hosts defensible, and also the
thing most admins turn off. The 2022 "just turn it off" thread shows the
second half is still true.

## Key points
- The technical correction: "SELinux does not fully mitigate this issue. We recommend users update to 1.12.6" (bigmac, Docker security); "it somewhat mitigates this CVE, which is what defence in depth is indeed supposed to do" (justincormack, who tested the fixes).
- Origin: the bug "affects the majority of container runtimes (it was derived from an lxc CVE originally)" (justincormack).
- Value of MAC for containers: "SELinux is one of the only things that can make shared Docker hosting… possible" (nailer, who was at Red Hat when SELinux became default).
- Usability: every Red Hat customer hit "avc denied" when SELinux was enabled by default (nailer); "SELinux used to be one of those things you'd disable immediately" (CrLf).
- Vendor politics: Hykes says Docker never markets against competitors and is "vulnerable to bullying and unfair criticism by competitors"; mjg59 notes the study Docker cited misdescribed rkt's SELinux support, which used the same libcontainer code.
- 2022 thread: the top reply recommends containers over learning SELinux; others cite `dontaudit` rules that deny silently, and prefer AppArmor (badrabbit, staticassertion, josephcsible).

## Excerpts
> "This post is incorrect. SELinux does not fully mitigate this issue. We recommend users update to 1.12.6." — bigmac, <https://news.ycombinator.com/item?id=13399271>

> "There is a big difference between "Docker 0-day stopped cold by SELinux" and "Runc CVE mitigated by SELinux" which is what a factual headline would be" — justincormack, <https://news.ycombinator.com/item?id=13403694>

> "SELinux is one of the only things that can make shared Docker hosting (ie, where the containers are actually isolated from the host and each other) possible." — nailer, <https://news.ycombinator.com/item?id=13398764>

> "Every single customer was hit with 'avc denied'." — nailer, <https://news.ycombinator.com/item?id=13398764>

> "SELinux has a horrible misfeature called dontaudit, that lets policies using it deny actions without any evidence being logged anywhere." — josephcsible (2022), <https://news.ycombinator.com/item?id=31176627>

## Relevance to the talk
MAC (SELinux `container_t`, AppArmor `docker-default`) is the layer that
repeatedly turns container escapes into non-events (see also
[hn-30556188](hn-30556188-cgroups-cve-2022-0492.md)), yet operators
disable it for usability. That is the same trade-off agent sandboxes
face when users click "allow all".
