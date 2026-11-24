---
title: landlock(7) — unprivileged access-control
url: https://man7.org/linux/man-pages/man7/landlock.7.html
authors: Linux man-pages project; Landlock by Mickaël Salaün
date: Landlock first in Linux 5.13 (released 2021-06-27); page is living
accessed: 2026-11-22
kind: man-page
---

## Summary
Landlock is a stackable LSM that lets *any* process — no root, no setuid helper — restrict its own and its
children's access to the filesystem (and later network and IPC). The man page's VERSIONS table is the best
source for its ABI evolution; the kernel docs (https://docs.kernel.org/userspace-api/landlock.html,
"Landlock: unprivileged access control", Mickaël Salaün, dated October 2026) list later ABIs.

## Key points
- ABI history (man page VERSIONS table):
  - ABI 1 — Linux 5.13 (2021): filesystem rights (execute, read/write file, read dir, remove/make dir, file, sock, fifo, block, char, symlink).
  - ABI 2 — 5.19 (2022): `LANDLOCK_ACCESS_FS_REFER` (cross-directory link/rename).
  - ABI 3 — 6.2 (2023): `LANDLOCK_ACCESS_FS_TRUNCATE`.
  - ABI 4 — 6.7 (2024, released early January): TCP `NET_BIND_TCP`, `NET_CONNECT_TCP` — first network rules.
  - ABI 5 — 6.10 (2024): `FS_IOCTL_DEV` (ioctl on device files).
  - ABI 6 — 6.12 (2024): scoping of abstract UNIX sockets and signals.
  - ABI 7 — 6.15 (2025): audit logging control flags for `landlock_restrict_self()`.
  - ABI 8 — 7.0: `LANDLOCK_RESTRICT_SELF_TSYNC` (apply to all threads).
  - ABI 9 — 7.1: `FS_RESOLVE_UNIX` (connect to pathname UNIX sockets).
- Kernel docs (Oct 2026) additionally list ABI 10 (UDP bind/connect/send + quiet flag), ABI 11
  (`RESTRICT_SELF_NO_NEW_PRIVS`), ABI 12 (capability-use and namespace-use permissions). Kernel versions for
  10–12 were not stated in what we read.
- Unprivileged use requires `no_new_privs`; programs should probe the ABI version, not the kernel version
  (distros backport).
- Calendar years above for kernel releases are ours (from release dates), not from the man page.

## Excerpts
> "Landlock is an access-control system that enables any processes to securely restrict themselves and their future children." — DESCRIPTION

> "The goal of Landlock is to enable restriction of ambient rights" — kernel docs, intro

## Relevance to the talk
The Linux answer to OpenBSD `unveil`/`pledge` and the most natural primitive for coding-agent sandboxes:
an unprivileged CLI can lock itself to the project directory and specific ports. Note how incrementally it
grew — TCP only arrived in 2024, UDP and namespace controls even later.
