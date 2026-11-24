---
title: Platform Guide (gVisor)
url: https://gvisor.dev/docs/architecture_guide/platforms/
authors: gVisor authors (Google)
date: living document (read 2026-11-22)
accessed: 2026-11-22
kind: docs
---

## Summary
gVisor abstracts syscall interception, context switching and address-space management behind a `Platform` interface. Three implementations exist: KVM (Sentry acts as guest OS and VMM using hardware virtualization), systrap (seccomp `SECCOMP_RET_TRAP` → SIGSYS), and the legacy ptrace (`PTRACE_SYSEMU`). Systrap replaced ptrace as the default in mid-2023.

## Key points
- Interface: `NewAddressSpace()`, `NewContext()`, `Context.Switch(...)`, `AddressSpace.MapFile/Unmap`.
- KVM: "allow the Sentry to act as both guest OS and VMM"; no virtualized hardware layer — the sandbox keeps a process model; best on bare metal; nested virtualization is feasible but usually slower than systrap.
- systrap: uses seccomp's `SECCOMP_RET_TRAP` so the kernel sends SIGSYS to the trapping thread, handing control to gVisor.
- ptrace: `PTRACE_SYSEMU`; runs anywhere ptrace works, but "high context switch overhead"; no longer supported and expected to be removed.
- "systrap replaced ptrace as the default gVisor platform in mid-2023."

## Excerpts
> "In general, when running on bare-metal (not inside a VM), the KVM platform will provide the best performance. The systrap platform is a better choice when running inside a VM, or on a machine without virtualization support."

## Relevance to the talk
Shows that the *same* user-space kernel can sit on very different interception mechanisms — seccomp repurposed from filter to trap, or VT-x. Relevant when agent sandboxes run inside cloud VMs without nested virtualization (systrap is the answer there).
