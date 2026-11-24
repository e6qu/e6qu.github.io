---
title: My VM is Lighter (and Safer) than your Container
url: https://doi.org/10.1145/3132747.3132763
authors: Filipe Manco, Costin Lupu, Florian Schmidt, Jose Mendes, Simon Kuenzer, Sumit Sati, Kenichi Yasukata, Costin Raiciu, Felipe Huici (NEC Laboratories Europe; Univ. Politehnica of Bucharest)
date: 2017-10-28 (SOSP '17, Shanghai)
accessed: 2026-11-22
kind: paper
---

## Summary
Challenges the assumption that isolation (VMs) and efficiency (containers) are a strict trade-off. Using unikernels and "Tinyx" (automatically trimmed Linux VMs), plus LightVM — a redesign of Xen's control plane (toolstack, XenStore replaced by "noxs", split toolstack, pre-created VM shells) — it boots VMs in milliseconds and packs thousands per host. Argues the bottleneck was the toolstack, not the hypervisor. PDF (course mirror): https://www.cs.utexas.edu/~witchel/S25-380L/papers/manco17sosp-lightvm.pdf

## Key points
- LightVM boots a VM in 2.3 ms, "comparable to fork/exec on Linux (1ms), and two orders of magnitude faster than Docker". (Abstract)
- Up to 8000 VMs on one host; migration 60 ms; suspend/resume 30 ms / 25 ms; per-VM footprint as small as 480 KB on disk and 3.6 MB running (daytime unikernel). (§1)
- Tinyx images: e.g. 1.6 MB kernel+distro memory use vs 8 MB for the Debian tested (half the size of typical kernels).
- Security argument: Linux exposes ~400 syscalls and growing (Fig. 1); the x86 VM ABI (memory isolation + rings) is "fundamentally" easier to secure than the syscall API.
- Use cases: personalised firewalls, just-in-time service instantiation, high-density TLS termination, lightweight compute (serverless-like).

## Excerpts
> "We find that VMs can be as nimble as containers, as long as they are small and the toolstack is fast enough." (Abstract)

> "LightVM can boot a VM in 2.3ms, comparable to fork/exec on Linux (1ms), and two orders of magnitude faster than Docker." (Abstract)

## Relevance to the talk
The research proof (2017) that preceded Firecracker's production proof (2018–2020): VM startup cost was mostly management-plane overhead and fat guests. The 2.3 ms figure is for unikernels on a modified Xen, not general Linux guests — important caveat on slides.
