---
title: "macOS Container Machines"
url: https://news.ycombinator.com/item?id=48469658
story_url: https://github.com/apple/container/blob/main/docs/container-machine.md
points: 1269
comments: 437
authors: submitted by timsneath (reputedly Tim Sneath of Apple developer tools; not stated in thread); HN commenters incl. egernst (writes as part of the container team: "we use that"), kdrag0n (OrbStack dev), avsm, jdub
date: 2026-06-10
accessed: 2026-11-22
kind: discussion
---

## Summary
WWDC 2026 follow-up: Apple `container` adds "container machines", persistent Linux environments with
filesystem mounts (WSL-like, but one VM each). The thread is the largest HN discussion of whether VMs are the
right answer on the Mac, with OrbStack's developer explaining dynamic memory, a container-team engineer replying, and
repeated calls for Darwin namespaces / jails and a WSL1-style approach.

## Key points
- timsneath: container machines add persistence and mounts, "a great lightweight Linux environment".
- kdrag0n (OrbStack): OrbStack uses its own Rust VMM, not Virtualization.framework; its biggest gain is
  dynamic memory (returning freed guest memory to macOS), which "nothing else supports, including
  Containerization".
- egernst (container team) acknowledges the dynamic-memory point; recommends a systemd base image.
- avsm (Anil Madhavapeddy, who worked on Docker for Mac; links "A decade of Docker containers"): no dynamic ballooning, "NO SUPPORT FOR MACOS" guests.
- "Why not WSL1 style?" answered with: FreeBSD's Linuxulator exists because of binary-only software; Mac users
  need a real Linux with systemd/cgroups, which a VM gives more cheaply.
- Darwin jails: commenters attribute their absence to Apple protecting Mac mini sales (two-VM licence limit).
- Intel Macs lose new Virtualization features in macOS 27; Rosetta for Linux VMs remains.

## Excerpts
> "Our biggest perf/resource gain is dynamic memory, which reduces memory usage a lot by releasing unused memory back to macOS. Nothing else supports this, including Containerization."
— kdrag0n (OrbStack dev), https://news.ycombinator.com/item?id=48470145

> "Thanks for the info kdrag0n! Big fan of OrbStack; good call out on dynamic memory."
— egernst (container team), https://news.ycombinator.com/item?id=48470264

> "Is there any reason why macOS doesn't try a WSL1 style approach? I get why that didn't fully work out for windows, but it seems like macOS being another *nix would make a lot of what was hard for windows, easy for mac."
— cogman10, https://news.ycombinator.com/item?id=48470649

> "Conversely, macOS has basically all software ported natively to it, so when you _need_ a Linux environment 95% of the time it isn't because you need $XYZ that only run Linux, but because you need a proper Linux environment with systemd, cgroups etc."
— qalmakka, https://news.ycombinator.com/item?id=48471986

> "Still scared that people will filling whole rooms of Mac Minis if you allow them to have multiple macOS containers and not only up to two fat VMs per machine?"
— qalmakka, https://news.ycombinator.com/item?id=48472006

> "Darwin namespaces would be much more interesting and we are in dire need of them in the current security landscape."
— cedws, https://news.ycombinator.com/item?id=48475135

## Relevance to the talk
Central to "VMs dominate on desktop": Apple, Docker, OrbStack, Podman, Lima all converge on hypervisor-backed
Linux, and the only density lever discussed is memory reclaim. The WSL1 question and the "Darwin jails"
complaint are exactly the gap fws/fwe target.
