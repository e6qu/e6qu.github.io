---
title: "The True Cost of Containing: A gVisor Case Study"
url: https://www.usenix.org/conference/hotcloud19/presentation/young
authors: Ethan G. Young, Pengfei Zhu, Tyler Caraza-Harter, Andrea C. Arpaci-Dusseau, Remzi H. Arpaci-Dusseau (University of Wisconsin–Madison)
date: 2019-07 (HotCloud '19, Renton, WA)
accessed: 2026-11-22
kind: paper
---

## Summary
An independent performance analysis of gVisor (ptrace and KVM platforms, 2019) versus runc. It finds the security comes at a large price: simple syscalls ≥2.2× slower, file opens on external tmpfs 216× slower, small-file reads 11× slower, large downloads 2.8× slower, memory allocation 2.5× slower. It notes gVisor backs Google Cloud Functions and that Python module imports (a serverless cold-start bottleneck) suffer. PDF: https://www.usenix.org/system/files/hotcloud19-paper-young.pdf

## Key points
- Architecture figure: application → Sentry implements 211 syscalls (108 unsupported); Sentry allowed 55 host syscalls via seccomp; Gofer allowed 52; Sentry↔Gofer speak 9P. (Fig. 1)
- Container init/teardown throughput: all systems scale poorly — runc at most 2.6 containers/s, runsc 2.3 containers/s. (§3.1)
- Syscall latency: runc only 32% slower than native; fastest gVisor (Sentry-only, KVM) 2.8× slower; KVM-mode calls to host 9× slower than Sentry-internal, calls to the Gofer 72× slower; ptrace latencies 42–232× native. (§3.2)
- Memory: gVisor "designed to have a memory footprint of just 15 MB"; allocation rate ~40% of native. (§3.3)
- Network: in-Sentry netstack reaches ~34% of others' throughput for large downloads (ptrace slightly better, 54%). (§3.4)
- Python imports usually 2–4× slower than runc with external tmpfs; in-Sentry tmpfs 40–70% faster than external. (§3.6)
- Quotes Kata's slogan "the speed of containers, the security of VMs" and Dan Walsh's "containers do not contain".

## Excerpts
> "Unfortunately, our analysis shows that the true costs of effectively containing are high: system calls are 2.2× slower, memory allocations are 2.5× slower, large downloads are 2.8× slower, and file opens are 216× slower." (§5)

> "gVisor is arguably more secure than runc, as a compromised Sentry only gives an attacker access to a user-space process severely limited by seccomp filters…" (§5)

## Relevance to the talk
The honest-cost slide for user-space kernels. Note it predates Systrap (2023) and later gVisor I/O work, so absolute numbers are historical; the shape (syscall- and file-heavy workloads pay most) still matters for agents that run compilers, package managers and test suites.
