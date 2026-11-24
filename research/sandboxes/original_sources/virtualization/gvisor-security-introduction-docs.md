---
title: Introduction to gVisor security (gVisor Architecture Guide)
url: https://gvisor.dev/docs/architecture_guide/intro/
authors: gVisor authors (Google)
date: living document (read 2026-11-22)
accessed: 2026-11-22
kind: docs
---

## Summary
The official explanation of gVisor's architecture for security researchers. gVisor is "an application kernel, not a virtual machine hypervisor or a system call filter". The Sentry intercepts all syscalls and page faults and services them from a from-scratch Go re-implementation of Linux (syscalls, memory management, filesystems, network stack, signals, namespaces); it never passes a syscall through to the host. The Sentry itself runs in a heavily restricted host sandbox, with a slightly more privileged Gofer process for filesystem access.

## Key points
- Contrast with seccomp/namespaces/Landlock: these shrink surface but the workload is "only one system call away from host compromise", and filters must be tailored per workload; broad syscalls like `ioctl`/`io_uring` make safe filters hard.
- Contrast with VMs: "the gold standard of workload isolation", but costly due to pre-allocated resources and booting a full Linux kernel.
- Sentry: "re-implement Linux in Go"; e.g. `getpid` answered from gVisor's own PID table — no host syscall. Host syscalls made by the Sentry (e.g. `futex`) "do not map 1-to-1" to the app's.
- Sentry's own host seccomp filter prohibits e.g. `exec`, `connect`; isolated mount namespace and user namespace with minimal capabilities.
- Gofer: "a sidecar process … slightly-more-trusted companion … in a slightly-more-privileged context" for requests the Sentry cannot serve.
- Escape requires exploiting both the Sentry and the host Linux kernel, "which do not share any code".
- Platforms: Systrap (default; seccomp `SECCOMP_RET_TRAP`-based interception, no virtualization needed, good inside VMs) and KVM (workload runs in guest ring 3; best on bare metal; slower when nested).

## Excerpts
> "This means the workload is only one system call away from host compromise."

> "In order to break out of a gVisor sandbox, an attacker would need to simultaneously exploit the gVisor Sentry kernel and the host Linux kernel, which do not share any code."

## Relevance to the talk
Clear, quotable framing of the three families (filter, VM, application kernel). The "one syscall away" line is a strong slide for why plain containers are a weak agent sandbox.
