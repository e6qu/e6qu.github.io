---
title: "Running 10 million Codex CLIs on one server - LFI processes"
url: https://kapteko.com/running-10-million-codex-clis-on-one-server-lfi-processes
authors: kapteko (author not named on the page; X handle @kaptekoguid)
date: 2026-10-21
accessed: 2026-11-22
kind: blog
---

## Summary
Sets out, half jokingly, to run 10 million coding-agent CLIs (Codex) on one
16-CPU, 100 GB server without changing Codex. The author measures the smallest
possible Linux process at ~70 KB, mostly kernel bookkeeping. They argue that
containers, microVMs and gVisor all keep a per-process cost, and propose LFI
software fault isolation: many guests share one host process, and every syscall
becomes a call into the host runtime. A real LFI runtime does no better than
processes at 100 instances (15 MB vs 7 MB). A three-syscall toy runtime fits
1.26 billion sandboxes in 10 GB, which the author says “proves absolutely nothing”.
The post ends with a list of unsolved work.

## Key points
- Hardware: 16 CPUs, 100 GB RAM, 1 TB SSD; per-agent CPU budget 0.0000016 of a core.
- Smallest process (no_std aarch64, `ppoll` and block): ~70 KB RAM. Kernel page tables
  28 KB, kernel stack 16 KB, kernel process info 16 KB, shadow stack 4 KB, user 4 KB.
  The author estimates tuning could reach ~45 KB. A thread costs ~48 KB.
- Containers share the kernel and its per-process costs. gVisor captures all syscalls
  but means “one gVisor per process”.
- LFI: 4 GiB slots per guest, guest base in a reserved register, rewritten loads,
  stores and branches, syscalls replaced by calls to a gate in the same process.
  About 7% overhead on compute. Guests must be recompiled; existing binaries do not run.
- 100 instances: 100 processes = 7 MB, while 100 LFI guests = 15 MB. Runtime tables
  dominate: futex tables 4.4 MB, callback tables 3.2 MB, host libraries 1.7 MB.
- Toy runtime with three syscalls (getpid, print, ppoll), guests run sequentially:
  8 bytes per sandbox, 1.2625 billion sandboxes, created at 387M/s, executed at
  4.4M guests/s, 10.12 GB on a 10 GB VM.
- Still to do (author's list): concurrency, interrupts, scheduler, threads, memory
  reuse and compression, snapshot to disk, a virtual filesystem, virtual networking,
  hundreds of syscalls, and patches to Codex.
- Code: https://github.com/artemyarulin/AI10M
- Cites, among others, Nanvix (arXiv 2604.11669), Arca (OSDI '26), the Cloudflare
  Workers security model, seL4, Unikraft and MirageOS.

## Excerpts
> “What does it prove? Absolutely nothing.”

> “It replaces all syscalls with calls to our provided address in the same process”

> “8 bytes per sandbox - it only contained a reference to the runtime syscall gate”

## Relevance to the talk
This post asks the talk's question directly: how many coding agents fit on one
machine, and what per-agent cost does each isolation layer add? The 70 KB minimal
process is a useful floor to set against containers (MBs), microVMs (~5 MB+ of VMM
overhead plus guest memory) and full VMs (hundreds of MB). It also shows the catch:
real agents need a filesystem, network and hundreds of syscalls, and that is where
the density goes.
