---
title: Restricted unprivileged user namespaces are coming to Ubuntu 23.10
url: https://ubuntu.com/blog/ubuntu-23-10-restricted-unprivileged-user-namespaces
authors: Ijlal Loutfi (Canonical)
date: 2023-10-09
accessed: 2026-11-22
kind: blog
---

## Summary
Canonical explains why Ubuntu 23.10 started gating unprivileged user namespaces behind AppArmor policy:
they expose kernel interfaces previously reserved for root and appear in many privilege-escalation chains.
Ubuntu 24.04 LTS turned the restriction on by default, with profiles allowing it for apps like Chrome.

## Key points
- Cites a Google report that 44% of exploits it saw required unprivileged user namespaces.
- Mechanism: sysctl `kernel.apparmor_restrict_unprivileged_userns`; per-app AppArmor profiles grant `userns`.
- Enabled by default in 24.04 (per Launchpad bug 2046477 and Ubuntu discourse — secondary).
- Qualys (2025) published three bypasses (including via aa-exec and busybox) —
  https://www.qualys.com/2025/three-bypasses-of-Ubuntu-unprivileged-user-namespace-restrictions.txt (not read in full).

## Excerpts
> "Exposing more kernel interfaces than necessary to a process introduces additional security risks."

> "unfortunately unprivileged user namespaces are now broadly used as a step in several privilege escalation exploit chains."

## Qualifications from Hacker News
Bypasses of the 2023 restriction were published in 2025 (Qualys); discussed on HN ([note](../hackernews/history-os-primitives/hn-21812641-unprivileged-user-namespaces.md)).

## Relevance to the talk
The irony slide: the feature that made setuid-free sandboxes (bubblewrap, Chromium) possible is also a
kernel-attack-surface multiplier, so distros now restrict it — and sandboxing tools break or need allow-listing.
