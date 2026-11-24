---
title: Open-sourcing gVisor, a sandboxed container runtime
url: https://cloud.google.com/blog/products/gcp/open-sourcing-gvisor-a-sandboxed-container-runtime
authors: Nicolas Lacasse (Google Cloud)
date: 2018-05-02
accessed: 2026-11-22
kind: blog
---

## Summary
Google's announcement of gVisor at KubeCon EU 2018 (Copenhagen). It argues that "traditional Linux containers are not sandboxes" because they call the host kernel directly, and that seccomp allow-lists are hard to get right. gVisor instead puts a user-space kernel written in Go between the app and the host — "an extremely paravirtualized operating system" — exposed as an OCI runtime, `runsc`, interchangeable with `runc`.

## Key points
- Problem: containers expose a broad host-kernel surface; cgroups/namespaces don't cover everything; seccomp needs a pre-known syscall list and does nothing if an allowed syscall is buggy.
- gVisor core: "a kernel that runs as a normal, unprivileged process that supports most Linux system calls", written in Go "for its memory- and type-safety".
- Flexible resources (unlike a fixed-size VM), at the cost of "higher per-system call overhead and application compatibility".
- Coverage at launch: "200 system calls and counting"; parts of /proc and /sys missing; runs Node.js, Java 8, MySQL, Jenkins, Apache, Redis, MongoDB.
- Usage: `docker run --runtime=runsc …`; Kubernetes via cri-o or cri-containerd; pod is the natural sandbox boundary.
- Mentions Kata Containers as the VM-based alternative; Kata TSC members from Intel and Hyper quoted supportively.

## Excerpts
> "gVisor is more lightweight than a VM while maintaining a similar level of isolation."

> "gVisor can be thought of as an extremely paravirtualized operating system with a flexible resource footprint and lower fixed cost than a full VM."

## Relevance to the talk
The third path between containers and VMs: re-implement the kernel in a memory-safe language and run it as a sandboxed process. gVisor backs Google Cloud Functions/Run (per Young et al.) and is used by several AI code-execution sandboxes.
