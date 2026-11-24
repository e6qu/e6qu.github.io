---
title: A safer playground for your Linux and Chrome OS renderers
url: https://blog.chromium.org/2012/11/a-safer-playground-for-your-linux-and.html
authors: Julien Tinnes (Google)
date: 2012-11-19
accessed: 2026-11-22
kind: blog
---

## Summary
Announces that stable Chrome now adds a seccomp-bpf layer to renderer processes on 64-bit Chrome OS and
Linux — four months after the feature shipped in Linux 3.5. The kernel is named as the "juicy target":
denying renderers syscalls they never need (e.g. `vmsplice`, inotify) removes kernel bugs from reach.

## Key points
- Seccomp-BPF layer for renderers on 64-bit Chrome OS and Linux; a broker process keeps the allow-list small.
- Check via `chrome://sandbox` ("Seccomp-BPF sandbox Yes").
- Ubuntu enabled seccomp-bpf since 12.04 (backport).

## Excerpts
> "One juicy target for attackers is the operating system's kernel: a large and complex code base."

> "if we know that Chrome renderers don't need a system call such as vmsplice, or a facility such as "inotify", we can just deny them completely."

## Relevance to the talk
First mass-market deployment of seccomp-bpf, months after the kernel feature shipped. The "rocks thrown at the
walls" metaphor in the post is a nice slide.
