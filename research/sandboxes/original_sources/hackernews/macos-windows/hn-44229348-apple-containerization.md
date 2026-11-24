---
title: "Containerization is a Swift package for running Linux containers on macOS"
url: https://news.ycombinator.com/item?id=44229348
story_url: https://github.com/apple/containerization
points: 769
comments: 409
authors: submitted by gok; Apple (Containerization / container, WWDC 2025); HN commenters
date: 2025-06-09
accessed: 2026-11-22
kind: discussion
---

## Summary
Launch thread for Apple's Containerization Swift package (WWDC 2025), the library behind the `container` CLI:
one lightweight Linux VM per container on Virtualization.framework, with a minimal kernel config and the
`vminitd` init. Companion threads the same day: "Container: Apple's Linux-Container Runtime" (305 points,
https://news.ycombinator.com/item?id=44229239) and the WWDC roundup (860 points,
https://news.ycombinator.com/item?id=44226978).

## Key points
- "Sub-second start times" via an optimized kernel config, minimal rootfs and `vminitd`; the demo said "within a
  few hundred milliseconds".
- Memory: commenters read the docs as no reclaim; guest memory grows to the peak and is not returned (no
  ballooning at launch), the key density question for a VM-per-container design.
- Immediate comparison with OrbStack (shared VM, closed source) and Docker Desktop; one user reports image export
  4x slower than Docker for Mac.
- Wish noted: still no Darwin namespacing, so no macOS containers for `xcodebuild`.
- Parallel drawn with WSL's path (no systemd first, then systemd).

## Excerpts
> "Containers achieve sub-second start times using an optimized Linux kernel config, minroot filesystem, and a lightweight init system, vminitd"
— watersb, quoting the README, https://news.ycombinator.com/item?id=44230034

> "I wonder what the memory overhead is, especially if running multiple containers - as that would spin up multiple VM's."
— filleokus, https://news.ycombinator.com/item?id=44230087

> "From that document I read that it in fact does, but it doesn't release memory if app started consuming less."
— nasretdinov, on memory management, https://news.ycombinator.com/item?id=44239122

> "disappointing theres still no namespacing in darwin for macos containers. would be great to run xcodebuild in a container"
— jamie0, https://news.ycombinator.com/item?id=44229997

> "Wouldn't be surprised if this goes through the same process Windows users did with WSL."
— trallnag, https://news.ycombinator.com/item?id=44230625

## Relevance to the talk
Apple's own answer to "containers on a Mac" is a microVM per container, which confirms that on macOS the OS
vendor itself treats a VM as the unit of Linux isolation. The density question (memory not returned) is the
crux for running many agents.
