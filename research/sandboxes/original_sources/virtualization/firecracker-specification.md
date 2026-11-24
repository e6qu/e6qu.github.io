---
title: Firecracker SPECIFICATION.md
url: https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md
authors: Firecracker maintainers (AWS)
date: living document (read at main on 2026-11-22; repo created 2017-10-19)
accessed: 2026-11-22
kind: repo
---

## Summary
Firecracker's repository publishes quantitative promises that are enforced by integration tests on each PR, on m5d.metal (HT disabled) and m6g.metal hosts. This is the current, testable form of the NSDI 2020 numbers and is the most precise source for "what boot time and memory overhead actually mean".

## Key points
- VMM start (to API socket availability): within 8 CPU ms; wall-clock 6–60 ms, typically ~12 ms.
- Memory overhead: for a 1 vCPU / 128 MiB microVM with the Firecracker-tuned guest kernel, VMM threads use ≤ 5 MiB (more with e.g. many vsock connections; excludes MMDS data store). Checked in CI by a "memory cop".
- Boot: ≤ 125 ms from the `InstanceStart` API call to the guest's `/sbin/init`, with serial console disabled and minimal kernel + rootfs.
- Compute-only guest CPU performance > 95% of bare metal (integration test pending).
- I/O: up to 14.5 Gbps network using ≤ 80% of a dedicated host core; virtualization layer adds ~0.06 ms latency (tests pending).
- README: default memory 128 MiB; "Advanced, thread-specific seccomp filters"; jailer for production.

## Excerpts
> "It takes `<= 125 ms` to go from receiving the Firecracker InstanceStart API call to the start of the Linux guest user-space `/sbin/init` process."

> "Firecracker's virtual machine manager threads have a memory overhead `<= 5 MiB`."

## Relevance to the talk
Use when quoting Firecracker numbers: the 125 ms is VMM-API-to-init with a minimal guest, not "container image to app ready". Contrast with end-to-end container-runtime measurements (CLOSER 2021, Edera 2025) where Firecracker-backed runtimes take ~0.6–2.4 s.
