---
title: "Namespaces in operation, part 5: User namespaces"
url: https://lwn.net/Articles/532593/
authors: Michael Kerrisk (LWN.net)
date: 2013-02-27
accessed: 2026-11-22
kind: blog
---

## Summary
Explains user namespaces as merged in Linux 3.8: an unprivileged process can create one, become "root"
inside it with a full capability set scoped to that namespace, and map inside UIDs/GIDs to outside ones.
This is the feature that made unprivileged/rootless containers and setuid-free sandboxes possible — and,
later, a major source of kernel attack surface.

## Key points
- Since Linux 3.8, no privilege is needed to create a user namespace (`CLONE_NEWUSER` via `clone()`/`unshare()`).
- The first process in a new user namespace has a full set of capabilities *within* it, none in the parent.
- UID/GID mappings written once per namespace via `/proc/PID/uid_map` and `gid_map`.
- User namespaces nest (each has a parent; it owns the other namespace types created inside it).

## Excerpts
> "no privilege is required to create a user namespace" — on Linux 3.8

## Relevance to the talk
The pivot point of the Linux story. User namespaces let bubblewrap, Chromium (M-43+) and rootless Podman
drop setuid helpers — but they also let any unprivileged user reach kernel code paths that previously
required `CAP_SYS_ADMIN` (netfilter, mount, etc.). See ubuntu-restricted-unprivileged-userns-2023.md and
google-kctf-42-kernel-exploits-2023.md for the consequences.
