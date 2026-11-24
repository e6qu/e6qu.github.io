---
title: "Docker on MacOS is slow and how to fix it"
url: https://news.ycombinator.com/item?id=34098367
story_url: https://www.paolomainardi.com/posts/docker-performance-macos/
points: 193
comments: 203
authors: submitted by riccardomc; article by Paolo Mainardi; HN commenters
date: 2022-12-22
accessed: 2026-11-22
kind: discussion
---

## Summary
Why bind-mounted workloads are slow in Docker on Mac (the VM boundary: osxfs/gRPC-FUSE, then VirtioFS) and the
usual fixes. Commenters give concrete numbers and workarounds (VirtioFS, Colima with vz, remote Docker host,
keep sources inside the VM). Related: "Speed boost achievement unlocked on Docker Desktop 4.6 for Mac" (206
points, https://news.ycombinator.com/item?id=30701963), "Improve Docker performance on macOS by 20x" (54
points, https://news.ycombinator.com/item?id=28398018).

## Key points
- The cost sits in sharing files across the VM boundary; native Linux bind mounts are free.
- VirtioFS on arm64 images turned minutes-long lint runs into seconds for one team; another reports Pylint
  3 h on Linux vs 9+ h on Mac Docker (about 4 h with VirtioFS).
- x86 images on Apple Silicon add emulation inside the VM: "very very slow".
- Workarounds: `DOCKER_HOST=ssh://` to a Linux box, Colima with Virtualization.framework + virtiofs.
- WSL1 is cited as the non-VM design that "reached its limits".

## Excerpts
> "It finally got a lot better when VirtioFS came out, which, when enabled on an arm64 image, sped up filesystem access dramatically; suddenly my lints were taking seconds again."
— zeta0134, https://news.ycombinator.com/item?id=34100074

> "Running Pylint on a Linux machine in docker: 3 hours from no cache Running Pylint on a Mac in docker: 9+ hours from no cache unless VirtioFS is used, which makes it closer to 4 hours."
— Arbortheus, https://news.ycombinator.com/item?id=34104383

> "Unsurprisingly, running an x86 VM inside an ARM VM on a laptop is very very slow"
— nijave, https://news.ycombinator.com/item?id=34100893

> "WSL1 is not a VM design, but that design reached its limits."
— SideburnsOfDoom, https://news.ycombinator.com/item?id=34103325

## Relevance to the talk
The other half of the desktop-VM cost: not just memory but I/O across the VM boundary. A native process sandbox
(Seatbelt) or a syscall-translation layer (fwe) avoids this by sharing the host filesystem directly.
