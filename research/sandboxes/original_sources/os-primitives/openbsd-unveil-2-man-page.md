---
title: unveil(2) — unveil parts of a restricted filesystem view
url: https://man.openbsd.org/unveil.2
authors: OpenBSD project
date: first appeared in OpenBSD 6.4 (released October 2018); page is living
accessed: 2026-11-22
kind: man-page
---

## Summary
unveil() is pledge's filesystem companion: the first call hides the entire filesystem except paths
explicitly unveiled with permissions `r`, `w`, `x`, `c` (create/remove). It is locked by
`unveil(NULL, NULL)` or by pledging without the `unveil` promise.

## Key points
- Permissions: r read, w write (also connect to AF_UNIX sockets), x execute, c create/remove.
- Lock with `unveil(NULL, NULL)`; strongly recommended after configuration.
- Grew out of pledge's original "whitepaths" second argument (see Hackfest 2015 slides).
- OpenBSD 6.4 release date (October 2018) is ours, not the page's.

## Excerpts
> "The first call to unveil() removes visibility of the entire filesystem from all other filesystem-related system calls" — DESCRIPTION

> "The unveil() system call first appeared in OpenBSD 6.4." — HISTORY

## Relevance to the talk
The exact shape of a coding-agent filesystem policy ("see the repo read-write, /usr read-only, nothing else");
Linux's equivalent is Landlock (2021), arriving three years later.
