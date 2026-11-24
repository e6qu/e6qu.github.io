---
title: "Userland Linux scheduler in Rust - faster than time"
url: https://kapteko.com/userland-linux-scheduler-in-rust
authors: kapteko (author not named on the page)
date: 2026-11-03
accessed: 2026-11-22
kind: blog
---

## Summary
A companion post to the LFI density experiments. It builds a preemptive userland
scheduler driven by SIGALRM every 2 ms, which saves and restores all 32 registers
plus flags, so many guests can share one thread. On one core it runs about 0.6%
slower than the kernel scheduler running separate processes. The post also shows
that a runtime which intercepts syscalls controls what time guests see (the
“negative time” joke).

## Key points
- `ualarm(2000, 2000)` with a SIGALRM handler. Saving only the PC corrupted other
  tasks; the fix is to save x0–x30 and NZCV.
- 5 CPU-bound tasks on 1 core: processes took 5:03.05 elapsed with 302,920 involuntary
  switches; the userland scheduler took 5:04.84 with 2,333.
- Cites Piotr Kołaczkowski's “How Much Memory Do You Need to Run 1 Million Concurrent
  Tasks” (Tokio 214 MB … Go 2658 MB) and the Tardis paper (arXiv 2302.14417).
- No isolation or threat model; guests are cooperative test programs.
- Code: https://github.com/artemyarulin/AI10M/tree/main/poc/scheduler-raw-threads

## Excerpts
> “Our only core is busy executing a task, and nothing can execute the interruption logic, so the program will never exit.”

> “Going backwards will break many things.”

## Relevance to the talk
Shows the other half of dense in-process sandboxing: once guests share a process,
the sandbox runtime must also be the scheduler (and the clock, and the network
stack). It is the same “be your own small OS” pattern as gVisor's Sentry and
LFI's runtime.
