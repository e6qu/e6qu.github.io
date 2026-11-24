---
title: "Colima - container runtimes on macOS (and Linux) with minimal setup"
url: https://github.com/abiosoft/colima
authors: Abiola Ibrahim (abiosoft) and contributors
date: repo created 2021-09-04; README read at HEAD
accessed: 2026-11-22
kind: repo
---

## Summary
Colima is a thin CLI on top of Lima that provisions a Linux VM running Docker, containerd or Incus.
Incus can run system containers and VMs inside it. Optional Kubernetes and multiple instances are
supported. Like Docker Desktop, it is the classic "one Linux VM hosts all containers" model.

## Key points
- Supports Docker, containerd and Incus runtimes, plus optional Kubernetes.
- Multiple instances are supported, each its own VM via Lima.
- Port forwarding and volume mounts are automatic.

## Excerpts
> "Container runtimes on macOS (and Linux) with minimal setup" — repo description

## Relevance to the talk
A popular free alternative to Docker Desktop with the same density model: N containers share one VM's
kernel. With Incus it can host many LXC system containers per VM, the same trick OrbStack uses for
"machines".
