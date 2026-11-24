---
title: Announcing WSL 2
url: https://devblogs.microsoft.com/commandline/announcing-wsl-2/
authors: Craig Loewen (Microsoft)
date: 2019-05-06
accessed: 2026-11-22
kind: blog
---

## Summary
Announces WSL 2 at Build 2019: replacing WSL1's syscall-translation layer
with a real Linux kernel (built by Microsoft from kernel.org stable, initially
4.19) running in a lightweight utility VM that Windows manages invisibly.
Motivation: full syscall compatibility (Docker, FUSE) and much faster
file-system performance.

## Key points
- Real Linux kernel in a managed "lightweight utility VM"; no user VM
  management.
- Initial internal numbers: unpacking a zipped tarball up to 20x faster than
  WSL1; `git clone`, `npm install`, `cmake` about 2–5x faster.
- Demo: bash shell available in under two seconds after start.
- WSL1 and WSL2 distros can run side by side.

## Excerpts
> "WSL 2 will NOT be a traditional VM experience."

## Relevance to the talk
The pivot from "no VM" (WSL1) to "one hidden VM" (WSL2) — the same move Docker
Desktop, Colima and OrbStack make on macOS. Density comes from sharing one VM
across all distros/containers rather than one VM per workload (see
windows-wsl-compare-versions.md).
