---
title: NsJail
url: https://github.com/google/nsjail
authors: Google engineers; "not an official Google product"
date: README is living
accessed: 2026-11-22
kind: repo
---

## Summary
NsJail is a process-isolation tool combining Linux namespaces, cgroups, rlimits and seccomp-bpf, with
seccomp policies written in Google's Kafel language. Built for hosting hostile code — CTF challenges,
per-connection network services, fuzzing targets.

## Key points
- Namespaces (PID, mount, net, user, IPC, UTS, cgroup), cgroup limits on memory/pids/CPU, rlimits.
- Seccomp-bpf policies via Kafel (a higher-level policy language compiled to BPF).
- Modes include running a binary as a per-connection TCP service (inetd-like) and re-running it repeatedly.
- Used by Google's kCTF infrastructure (cross-reference; not verified on this page).

## Excerpts
> "A lightweight process isolation tool that utilizes Linux namespaces, cgroups, rlimits and seccomp-bpf syscall filters"

## Relevance to the talk
Shows the "all primitives at once" recipe that a serious Linux sandbox needs — no single primitive suffices.
