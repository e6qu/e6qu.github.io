---
title: "OrbStack: The fast, light, and easy way to run Docker containers and Linux"
url: https://news.ycombinator.com/item?id=41421846
story_url: https://orbstack.dev/
points: 307
comments: 156
authors: submitted by rpgbr; OrbStack by Danny Lin (kdrag0n); HN commenters
date: 2024-09-02
accessed: 2026-11-22
kind: discussion
---

## Summary
OrbStack is the most-praised Docker Desktop replacement on Mac: one shared, heavily tuned Linux VM running
containers and "machines". This 2024 thread, plus kdrag0n's comments in earlier threads (Show HN 2023-03-23,
https://news.ycombinator.com/item?id=35276784; launch 2023-04-28, https://news.ycombinator.com/item?id=35737442),
is the best HN source on why Mac container stacks use so much memory and on OrbStack's security model.

## Key points
- Security model (developer's words): a shared VM and kernel; container-to-container boundary is that of normal
  Linux containers; the VM "is not used as a strong security boundary right now".
- Memory: on Virtualization.framework, guest memory is "allocated on demand, but never freed"; Linux free-page
  reporting exists (WSL2 uses it) but a macOS bug plus a hypervisor restriction blocked it (2023). By 2026
  OrbStack ships dynamic memory via its own VMM (see hn-48469658).
- kdrag0n (2023): Virtualization.framework is not inherently faster than QEMU; it crashes with some
  kernel/macOS/arch combinations; Rosetta is "really buggy".
- Users report the main performance gap vs Docker Desktop is I/O (filesystem bridging and networking).
- OrbStack also offers x86 via Rosetta or QEMU user-mode.

## Excerpts
> "It's a shared VM and kernel, so the security boundary between containers is only as strong as typical Linux containers, and we don't really use the VM as a strong security boundary right now."
— kdrag0n, https://news.ycombinator.com/item?id=41423187

> "The root of the problem is that VM memory is allocated on demand, but never freed after it's used for the first time. In other words, once used, it can never be released."
— kdrag0n, in "Podman vs. Docker" (2023-02-09), https://news.ycombinator.com/item?id=34720219

> "Memory is allocated on demand, but unfortunately not freed afterwards. … Unfortunately a macOS bug combined with a hypervisor restriction prevents us from shipping this."
— kdrag0n, OrbStack launch thread (2023-04-28), https://news.ycombinator.com/item?id=35742336

> "The popular belief is that Virtualization.framework is inherently faster/lighter than other VMMs like QEMU, but I haven't found evidence to back it up."
— kdrag0n, in "Apple Virtualization Framework" (2023-06-04), https://news.ycombinator.com/item?id=36189550

> "Docker Desktop and OrbStack both have custom solutions for bidirectional filesystem bridging and network integration, but for me OrbStack is much faster."
— jchw, https://news.ycombinator.com/item?id=41429380

## Relevance to the talk
The density slide: on a Mac, the per-agent cost of a VM is dominated by guest memory that the host cannot get
back. A shared VM amortises the kernel but gives only container-strength isolation between agents.
