---
title: Linux Sandboxing (Chromium design doc)
url: https://chromium.googlesource.com/chromium/src/+/b4730a0c2773d8f6728946013eb812c6d3975bec/docs/linux_sandboxing.md
authors: Chromium project
date: c. 2015–2019 snapshot (pinned commit); current version at https://chromium.googlesource.com/chromium/src/+/refs/heads/main/sandbox/linux/README.md
accessed: 2026-11-22
kind: docs
---

## Summary
Chromium's Linux sandbox is explicitly two-layered. Layer-1 ("semantics") cuts access to resources via
the setuid sandbox or, on kernels ≥3.8, an unprivileged user-namespace sandbox (new PID/net namespaces,
chroot to an empty dir). Layer-2 ("attack surface reduction") is seccomp-bpf, shielding the kernel. Layer-1
is needed partly because syscall filtering has subtle semantics (e.g. one process attacking another via
`ptrace` or `/proc`), and because network restriction is hard at the syscall layer.

## Key points
- Sandbox types table: setuid sandbox (Layer-1, old kernels); user namespaces sandbox (Layer-1, kernel ≥3.8;
  used instead of setuid from M-43 if supported, own PID namespace from M-44); seccomp-bpf (Layer-2;
  kernel ≥3.5, Ubuntu 12.04 backport, always on ChromeOS); seccomp-legacy (mode-1 sandbox, deprecated and
  removed); SELinux (deprecated); AppArmor (not used).
- seccomp-bpf can raise SIGSYS so userland can log, emulate, or "broker out" a syscall over IPC.
- Current README: setuid sandbox everywhere, namespaces where supported, seccomp-bpf on modern kernels;
  no SELinux/AppArmor; Landlock "not currently used".
- seccomp-legacy (mode-1 based) dates from 2009: the doc links http://www.imperialviolet.org/2009/08/26/seccomp.html and https://lwn.net/Articles/346902/.

## Excerpts
> "Layer-1 (also called the "semantics" layer) prevents access to most resources from a process where it's engaged."

> "Layer-2 (also called "attack surface reduction" layer) restricts access from a process to the attack surface of the kernel."

> "Our main layer-2 sandbox, designed to shelter the kernel from malicious code executing in userland." — on seccomp-bpf

## Relevance to the talk
The best articulation of defence-in-depth on Linux: namespaces decide *what* you can reach, seccomp
decides *how much kernel* you can touch. Agent sandboxes (bwrap + seccomp) copy this exact structure.
