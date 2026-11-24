---
title: "macOS Containers v0.0.1"
url: https://news.ycombinator.com/item?id=37655477
story_url: https://macoscontainers.org/
points: 518
comments: 344
authors: submitted by CiTyBear; project by slonopotamus (rund / darwin-containers); HN commenters incl. kdrag0n, xenadu02
date: 2023-09-26
accessed: 2026-11-22
kind: discussion
---

## Summary
The first widely seen attempt at native Darwin containers: `rund`, a containerd shim that runs macOS images in
a chroot. It requires disabling System Integrity Protection (SIP blocks `chroot` setup), which dominated the
discussion. The author explains it is "chroot with make-up" by design and plans to add `sandbox-exec`.
The author's own earlier submission got 8 points (https://news.ycombinator.com/item?id=37640688).

## Key points
- Requires SIP off; much of the thread is about why SIP blocks chroot and whether that is acceptable for CI.
- No process, network or device isolation: the author compares it to Kubernetes Windows HostProcess
  containers, which also lack them.
- Use cases: CI/CD for macOS builds, reproducible toolchains; not for running hostile code.
- XNU lacks namespaces "across all its interfaces"; xenadu02 (reputedly an Apple engineer; unverified) points out that changing
  the bootstrap port could give an isolated Mach namespace for XPC lookups.
- The dedicated-VM memory problem of Docker/Podman on non-Linux hosts is cited as the motivation.
- The project later became github.com/darwin-containers.

## Excerpts
> "1. It is not trivial to properly set up a chroot on macOS. If you try to find a working guide/tool that works with modern macOS, I doubt you'll find anything"
— slonopotamus (author), https://news.ycombinator.com/item?id=37656720

> "I also plan to try macOS sandbox-exec tool, which should offer additional isolation from the host."
— slonopotamus, https://news.ycombinator.com/item?id=37657719

> "If the parent process of the container here changes its bootstrap port to itself or disinherits it then it could also create an isolated mach namespace, restricting access to mach/XPC services."
— xenadu02, https://news.ycombinator.com/item?id=37664044

> "That's what it takes to implement container-ish technology on macOS. Hopefully one day Darwin will get real namespaces as Linux does."
— comandillos, https://news.ycombinator.com/item?id=37658381

> "you have a dedicated VM that needs memory to be set aside for it exclusively."
— highwaylights, on Docker/Podman on non-Linux hosts, https://news.ycombinator.com/item?id=37655950

## Relevance to the talk
The direct predecessor of fws: Darwin "containers" built from chroot + Seatbelt, with the same missing
namespaces. fws's design choice (no root, no SIP changes, APFS clones instead of chroot) is the answer to this
thread's main objection.
