---
title: "Linux 3.8 introduced unprivileged user namespaces [pdf]"
url: https://news.ycombinator.com/item?id=21812641
story_url: http://man7.org/conf/meetup/understanding-user-namespaces--Google-Munich-Kerrisk-2019-10-25.pdf
authors: HN discussion of Michael Kerrisk's user-namespaces talk slides; commenters include geofft, rwmj, pcwalton, sargun; related threads with cyphar, amluto, staticassertion, quotemstr
date: 2019-12-17
accessed: 2026-11-22
kind: discussion
points: 166
comments: 51
---

Read via the HN Algolia items API. Related user-namespace threads used:
[Ubuntu Linux 23.10 is adding an important new security feature](https://news.ycombinator.com/item?id=37850227) (2023-10-11, 14 points),
[OSS-SEC: Three bypasses of Ubuntu's unprivileged user namespace restrictions](https://news.ycombinator.com/item?id=43517734) (2025-03-29, 73 points),
[The Journey of Bypassing Ubuntu's Unprivileged Namespace Restriction](https://news.ycombinator.com/item?id=44400440) (2025-06-27, 28 points),
[Evolving Container Security with Linux User Namespaces](https://news.ycombinator.com/item?id=25519710) (Netflix, 2020-12-23, 79 points).
Our notes: [lwn-namespaces-in-operation-part5-user-namespaces](../../os-primitives/lwn-namespaces-in-operation-part5-user-namespaces.md),
[ubuntu-restricted-unprivileged-userns-2023](../../os-primitives/ubuntu-restricted-unprivileged-userns-2023.md).

## Summary
User namespaces are the most double-edged primitive in this topic, and
HN has argued both sides for a decade. They let unprivileged users build
sandboxes (bubblewrap, rootless Podman, Chrome) and are the thing that
makes container root not host root; they also expose kernel code that
used to need `CAP_SYS_ADMIN` to every local user. The 2019 Kerrisk thread
is the calm version: geofft explains rootless Docker and bubblewrap,
rwmj asks whether anyone fuzzes sequences of unshare/setuid calls. The
later Ubuntu threads show the trade-off turning into policy: Ubuntu
23.10/24.04 gated user namespaces behind AppArmor, researchers found
bypasses, and critics argued the ban makes well-behaved sandboxes
harder.

## Key points
- Date correction made in-thread: unprivileged user namespaces arrived in Linux 3.8 (2013), not 4.6 as first titled (geofft).
- Trade-off framing (geofft): "certainly better to give untrusted users access to unprivileged user namespaces than to give them access to /var/run/docker.sock"; bubblewrap can run via userns or setuid and drops privileges before running user code.
- Defensive value: "They've protected us at $WORK from multiple vulnerabilities" (sargun, Netflix); runc maintainer Sarai elsewhere calls not using them "basically negligence" ([hn-19135701](hn-19135701-runc-cve-2019-5736.md)).
- Offensive value: "user namespaces are basically the single most significant privesc path in the kernel, maybe io-uring is second" (staticassertion, 2026, on the Dirty Frag LPE).
- Kernel subtlety (Sarai, 2026): some checks use `ns_capable()` (reachable via unprivileged userns), others `capable()` (host only); Docker and Podman block userns creation inside containers by seccomp.
- Ubuntu's gate: unconfined programs can create user namespaces only with an AppArmor profile allowing it; the 2025 oss-security bypasses abused programs that ship with permissive AppArmor profiles ("AppArmor profiles for shipped executables allow escape", mjevans) — "not itself a vulnerability; you still need a kernel CAP_SYS_ADMIN vulnerability" (o11c).
- Critics: "Ubuntu's short-sighted and reactionary decision to ban them makes systems less, not more, secure overall" (quotemstr).

## Excerpts
> "It's certainly better to give untrusted users access to unprivileged user namespaces than to give them access to /var/run/docker.sock, which straightforwardly gives them full root." — geofft, <https://news.ycombinator.com/item?id=21826741>

> "Has anyone tried fuzzing random sequences of unshare(2), clone(2), setuid(2), capabilities, uid/gid map calls (etc) to see if there is a sequence that eventually gains real root or some other privilege escalation? I'm dubious that Linux is theoretically sound, what with the multiple layers of historical baggage." — rwmj, <https://news.ycombinator.com/item?id=21826818>

> "user namespaces are a super rad feature. They've protected us at $WORK from multiple vulnerabilities that have come out." — sargun, <https://news.ycombinator.com/item?id=21827695>

> "user namespaces are basically the single most significant privesc path in the kernel, maybe io-uring is second." — staticassertion (2026), <https://news.ycombinator.com/item?id=48061463>

> "Unprivileged user namespaces are not a security vulnerability. Ubuntu's short-sighted and reactionary decision to ban them makes systems less, not more, secure overall" — quotemstr (2025), <https://news.ycombinator.com/item?id=43520473>

> "Important caveat: this is not itself a vulnerability; you still need a kernel `CAP_SYS_ADMIN` vulnerability if you want to actually do something evil." — o11c (2025), <https://news.ycombinator.com/item?id=43519064>

## Relevance to the talk
The central tension for unprivileged sandboxing on Linux: the primitive
that lets a coding agent sandbox itself without root is the same one
attackers use to reach kernel bugs. Explains why agent sandboxes that
rely on bubblewrap break on Ubuntu 24.04 without an AppArmor profile.
