---
title: Minijail
url: https://google.github.io/minijail/
authors: Google (ChromiumOS / Android teams)
date: living docs; repo https://github.com/google/minijail
accessed: 2026-11-22
kind: docs
---

## Summary
Minijail is ChromeOS's (and Android's) sandboxing launcher and library: `minijail0` wraps a program, and
`libminijail` lets code sandbox itself. It handles UID/GID switching, capability dropping, namespaces,
seccomp policy files and (per the source tree) Landlock. It is for confining *known* system binaries, not
for running malicious code.

## Key points
- Description: used in ChromeOS and Android.
- Example usage: drop root but keep a capability set (`-c`), switch user/group (`-u`, `-g`).
- Repo contains seccomp policy compiler (`syscall_filter.c`, `bpf.c`, policies/) and `landlock.h`.
- History: `minijail0` is a rewrite of an older, "considerably less mini" minijail that depended on libchrome.
- ChromeOS service-sandboxing guide moved to https://www.chromium.org/chromium-os/developer-library/guides/development/sandboxing (not read).

## Excerpts
> "a sandboxing and containment tool used in ChromeOS and Android"

> "is not designed for safely running malicious code" — README

## Relevance to the talk
Example of OS-vendor-scale least privilege: every system daemon launched in its own jail with a seccomp
policy — sandboxing as default configuration rather than opt-in.
