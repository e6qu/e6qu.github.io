---
title: Comparing WSL Versions
url: https://learn.microsoft.com/en-us/windows/wsl/compare-versions
authors: Microsoft (WSL docs)
date: page ms.date 2024-11-19 (updated 2026-06-02)
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft's comparison of WSL1 (translation layer) and WSL2 (Linux kernel in a
managed lightweight utility VM). Key architectural fact for density: WSL2 runs
all Linux distributions as isolated containers inside one managed VM, so
there is a single VM regardless of how many distros are running. Trade-offs:
slower cross-OS file access, NAT networking, memory that is returned only
partially to Windows.

## Key points
- WSL2: managed VM, full Linux kernel, full syscall compatibility, systemd;
  WSL1 wins only on cross-OS file performance.
- "WSL2 runs Linux distributions as isolated containers inside the managed VM."
- WSL2 requires Windows 11 or Windows 10 1903 (build 18362)+.
- Memory: grows and shrinks; freed memory returns to Windows but page cache is
  not released until the instance shuts down.
- Networking: WSL2 is a Hyper-V VM behind NAT (not bridged like WSL1).
- Same perf numbers as the 2019 announcement (20x tarball, 2–5x git/npm/cmake).

## Excerpts
> "WSL2 runs Linux distributions as isolated containers inside the managed VM."

> "While WSL 2 does use a VM, it is managed and run behind the scenes, leaving you with the same user experience as WSL 1."

> "as of right now WSL 2 does not yet release cached pages in memory back to Windows until the WSL instance is shut down."

## Relevance to the talk
On Windows, the dense way to run many Linux agents is the OrbStack/Docker
Desktop pattern: one shared WSL2 VM, many Linux containers (namespaces,
cgroups) inside it. Isolation between agents is then Linux container
isolation; the VM boundary only protects the Windows host as a whole.
