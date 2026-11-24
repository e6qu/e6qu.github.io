---
title: capabilities(7) — overview of Linux capabilities
url: https://man7.org/linux/man-pages/man7/capabilities.7.html
authors: Linux man-pages project (Michael Kerrisk et al.)
date: capabilities since Linux 2.2 (1999); file capabilities since 2.6.24 (2008); page is living
accessed: 2026-11-22
kind: man-page
---

## Summary
Linux splits root's all-or-nothing privilege into ~41 independently grantable capabilities (POSIX.1e
draft-style, not object capabilities like Capsicum). The page documents each capability, the thread/file
capability sets, and their interaction with user namespaces — where a process can hold "all capabilities"
scoped to a namespace it owns.

## Key points
- Starting with Linux 2.2, root's privileges are divided into distinct capabilities.
- 41 `CAP_*` entries listed in the current page.
- File capabilities (capability sets on executables) since Linux 2.6.24.
- `CAP_SYS_ADMIN` is badly overloaded; the page's notes to kernel developers say it can "plausibly be called
  'the new root'".
- User namespaces: since 3.8 creating one needs no capability; since 4.14 namespaced file capabilities
  (v3 xattrs); since 5.12 `CAP_SETFCAP` needed to map UID 0 in a new user namespace.

## Excerpts
> "For the purpose of performing permission checks, traditional UNIX implementations distinguish two categories of processes" — DESCRIPTION

> "can plausibly be called "the new root"" — on CAP_SYS_ADMIN

## Relevance to the talk
Terminology trap worth a slide: Linux "capabilities" are coarse privilege bits, while Capsicum/capability
systems mean unforgeable object references. Dropping capabilities is a baseline step in every Linux
container/sandbox (Docker, systemd, minijail, firejail).
