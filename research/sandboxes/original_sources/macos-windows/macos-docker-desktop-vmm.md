---
title: "Virtual Machine Manager for Docker Desktop on Mac"
url: https://docs.docker.com/desktop/features/vmm/
authors: Docker Inc.
date: living docs (mentions Docker VMM replacing libkrun from Docker Desktop 4.86 on Mac)
accessed: 2026-11-22
kind: docs
---

## Summary
Docker Desktop runs all containers inside one Linux VM. On Mac the VMM behind that VM is selectable:
- Docker VMM: Docker's own "container-optimized" VMM, Apple silicon only.
- Apple Virtualization framework.
- HyperKit: legacy, Intel only, deprecated.

Docker VMM claims to return idle memory to the host, speed up file I/O and cut start-up time.

## Key points
- One Linux VM for all containers. Docker VMM needs at least 4 GB for that VM.
- Docker VMM replaced `libkrun` from Docker Desktop 4.86 on Mac.
- Docker VMM doesn't support Rosetta, so amd64 emulation is slow.
- Claims (no numbers on the page): idle memory returned to the host, better file I/O, faster engine and container start.

## Excerpts
> "Docker Desktop supports multiple Virtual Machine Managers (VMMs) to power the Linux VM that runs containers." — overview

> "Docker VMM does not currently support Rosetta, so emulation of amd64 architectures is slow." — limitations

## Relevance to the talk
The mainstream baseline: Mac containers mean "one shared VM". Containers within it are isolated from each
other only by Linux namespaces and cgroups. Docker's per-agent product (Docker Sandboxes) deliberately
leaves this model for a microVM per agent.
