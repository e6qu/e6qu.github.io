---
title: "Landrun: Sandbox any Linux process using Landlock, no root or containers"
url: https://news.ycombinator.com/item?id=43445662
story_url: https://github.com/Zouuup/landrun
authors: HN discussion of Zoup's landrun CLI; main insider l0kod (Mickaël Salaün, Landlock author and maintainer)
date: 2025-03-22
accessed: 2026-11-22
kind: discussion
points: 518
comments: 169
---

Read via the HN Algolia items API. Related Landlock threads:
[Landlock merged in mainline for Linux 5.13](https://news.ycombinator.com/item?id=27215563)
(2021-05-19, 138 points) and
[Xz: Can you spot the single character that disabled Linux landlock?](https://news.ycombinator.com/item?id=39874404)
(2024-03-30, 538 points). Our notes:
[landlock-7-man-page](../../os-primitives/landlock-7-man-page.md),
[lwn-landlock-finally-sets-sail](../../os-primitives/lwn-landlock-finally-sets-sail.md).

## Summary
Landrun wraps Landlock in a CLI (`landrun --ro /usr --rw /tmp cmd`),
and its author opens by saying nobody uses Landlock "because the API is
... hard". It was the most upvoted Landlock story on HN. Mickaël Salaün
answers many questions himself: how Landlock relates to seccomp,
namespaces and pledge/unveil, and what is coming (network filtering
beyond TCP ports, a JSON/TOML policy format, OCI runtime-spec support).
The 2024 xz-backdoor thread is the other big Landlock moment: the
attacker had quietly disabled xz's Landlock sandbox with a one-character
syntax error in a CMake feature check.

## Key points
- Salaün's layering: "Seccomp limits the kernel attack surface and Landlock enforces an access control. They are complementary."
- Namespaces are "a door to a large attack surface"; Landlock is designed so "any process… including potentially untrusted ones" can use it. Landlock and namespaces are orthogonal.
- Versus OpenBSD: pledge's "dns" promise is a hard-coded path in the kernel; unveil takes path names while Landlock takes file descriptors; "Landlock is the closest thing to Pledge/Unveil we can get with the Linux constraints".
- Roadmap stated in March 2025: socket-creation control by protocol, UDP filtering, a config format (landlockconfig), and adding Landlock to the OCI runtime spec.
- Criticism in thread: `--best-effort` (silently degrade on older kernels) was on by default — "degrading security should probably be opt-in" (machinestops, dmitrygr); "Linux seems to have too many non-orthogonal ways to restrict processes" (riobard).
- 2021 merge thread: "Pledge is like 100% easier to understand" (zie); wahern guesses Landlock tags dentries the way unveil does; comex notes browsers already sandbox with seccomp because of their broker design.
- xz (2024): the malicious commit replaced a header check with `check_c_source_compiles` containing a stray `.`, so the test always failed and Landlock was always off; commenters conclude security features should never be enabled by auto-detection (leni536, snnn).

## Excerpts
> "Linux Landlock is a kernel-native security module that lets unprivileged processes sandbox themselves - but nobody uses it because the API is ... hard!" — Zoup, <https://news.ycombinator.com/item?id=43445663>

> "Seccomp is not an access control system, but Landlock is. Seccomp limits the kernel attack surface and Landlock enforces an access control." — l0kod, <https://news.ycombinator.com/item?id=43473546>

> "Namespaces (used by containers) are very powerful but they are also a door to a large attack surface" — l0kod, <https://news.ycombinator.com/item?id=43448747>

> "For instance, with Pledge, the "dns" promise is implemented with hardcoded path in the kernel." — l0kod, <https://news.ycombinator.com/item?id=43449715>

> "This is a sandbox and a security boundary, and degrading security should probably be opt-in rather than opt-out." — machinestops, <https://news.ycombinator.com/item?id=43456651>

> "Feature detection for a security feature should be suspicious, even if it works as intended." — leni536 (xz thread), <https://news.ycombinator.com/item?id=39882364>

## Relevance to the talk
Landlock is the unprivileged, self-applied file and network policy that
agent sandboxes (Codex, landrun-style wrappers) now use on Linux. The
thread gives the author's own layering (seccomp for attack surface,
Landlock for access control, namespaces optional) and the usability
complaint that kept adoption low. The xz episode shows that an
attacker thought Landlock was worth disabling.
