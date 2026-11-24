---
title: Yet another new approach to seccomp
url: https://lwn.net/Articles/475043/
authors: Jonathan Corbet (LWN.net)
date: 2012-01-11
accessed: 2026-11-22
kind: blog
---

## Summary
Covers Will Drewry's (Google, Chrome OS) proposal that finally landed as seccomp mode 2 in Linux 3.5
(2012): reuse the network packet filter (classic BPF) to run a small program against the syscall
number and register arguments on every system call. Earlier attempts to extend seccomp — including via
the ftrace/perf tracing infrastructure — had all stalled.

## Key points
- Earlier designs "have gone down in flames"; reviewers had pushed for building on tracing infrastructure.
- Drewry argued tracing is fine for feeding policy but unsuited to *hosting* attack-surface-reduction logic.
- BPF program sees the syscall number and arguments (registers), returns allow/deny — no pointer dereferencing
  (so no filtering on path strings — a lasting limitation).
- Seccomp got its own BPF interpreter at first, without the networking JIT.
- Merged in Linux 3.5 (2012) per LWN "A seccomp overview" (https://lwn.net/Articles/656307/) and Chromium's
  sandbox docs ("seccomp-bpf is supported since Linux 3.5").

## Excerpts
> "all of these attempts have gone down in flames"

## Relevance to the talk
Shows the recurring pattern of sandboxing in Linux: it took three rejected designs and ~7 years to get
a usable syscall filter, and the eventual design (BPF on registers) explains why seccomp can't express
"only files under /workspace" — which is why Landlock was later needed.
