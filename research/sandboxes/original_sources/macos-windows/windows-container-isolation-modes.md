---
title: Isolation modes
url: https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container
authors: Microsoft (Windows containers docs)
date: page ms.date 2025-01-23 (updated 2025-09-17); applies to Windows Server 2016–2025
accessed: 2026-11-22
kind: docs
---

## Summary
Windows containers run in one of two modes with identical images and
tooling: *process isolation* (shared host kernel; namespaces, resource
controls — "approximately the same as how Linux containers run") or
*Hyper-V isolation* (each container in its own highly optimized utility VM
with its own kernel). Windows Server defaults to process isolation; Windows
10/11 client defaults to Hyper-V isolation.

## Key points
- Process isolation virtualizes: file system, registry, network ports,
  process/thread ID space, Object Manager namespace.
- Deliberate piercing supported: host volumes, named pipes, ports, shared
  network namespace (Kubernetes pods), device visibility. Not supported:
  shared memory, shared sync objects, shared process namespaces.
- Process-isolated container processes are visible on the host with the same
  PID; Hyper-V-isolated ones are not — only the `vmwp` worker process is.
- `docker run --isolation=process|hyperv`. Process isolation on Windows 10
  Pro/Enterprise since the October 2018 update (build 17763+, Docker Engine
  18.09+), "meant for development/testing"; host and image versions must
  match.
- Hyper-V isolation gives "hardware-level isolation" and decouples
  host/container OS version.
- No density/startup numbers on this page.

## Excerpts
> "When running in this mode, containers share the same kernel with the host as well as each other. This is approximately the same as how Linux containers run." (Process Isolation)

> "each container runs inside of a highly optimized virtual machine and effectively gets its own kernel." (Hyper-V isolation)

> "Running with process isolation on Windows 10 Pro and Enterprise is meant for development/testing." (Warning)

## Relevance to the talk
Windows has real OS-level containers (server silos) — the only "namespaces"
equivalent on a mainstream non-Linux desktop OS — but they run *Windows*
images, not Linux, and Microsoft does not treat process isolation as a
security boundary (see windows-forshaw-who-contains-the-containers.md). For
Linux agent workloads the practical path remains WSL2 or Hyper-V.
