---
title: "Linuxulator on FreeBSD Feels Like Magic"
url: https://news.ycombinator.com/item?id=47113527
story_url: https://hayzam.com/blog/02-linuxulator-is-awesome/
points: 134
comments: 67
authors: submitted by vermaden; post by arch1e (author, in thread); HN commenters
date: 2026-02-22
accessed: 2026-11-22
kind: discussion
---

## Summary
A user report on running Linux binaries on FreeBSD via the Linuxulator (in-kernel Linux ABI). The thread is
small but useful for the cultural argument (compat layers vs "linuxisms"), the Proton/Wine analogy, and the
practical tip to run Linux compat inside a jail.

## Key points
- Linuxulator implements the Linux syscall ABI in the FreeBSD kernel, the model WSL1 followed on NT.
- Best practice: combine with jails ("Linux jails") for isolation + compatibility.
- Objection: compat layers reduce pressure to port natively (same argument made against Proton).
- In the Container Machines thread (hn-48469658) the Linuxulator is cited as justified by binary-only software,
  whereas Mac users mostly need a full Linux userland.

## Excerpts
> "I'm running FreeBSD because I prefer it over Linux. I don't want to make it like Linux."
— wolvoleo, https://news.ycombinator.com/item?id=47113656

> "The best way to run linux compat on FreeBSD is in an Linux jail."
— drewg123, https://news.ycombinator.com/item?id=47115458

> "Which is the same reason I don't like Proton, as it in the end doesn't change Windows status quo as the platform for game developers"
— pjmlp, https://news.ycombinator.com/item?id=47119392

## Relevance to the talk
The surviving example of kernel-level Linux ABI emulation on a non-Linux Unix, paired with jails: the
"compat layer + native isolation" combination that fwe reproduces in userspace on macOS.
