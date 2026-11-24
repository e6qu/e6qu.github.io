---
title: The Use of Name Spaces in Plan 9
url: https://9p.io/sys/doc/names.html
authors: Rob Pike, Dave Presotto, Ken Thompson, Howard Trickey, Phil Winterbottom (AT&T Bell Laboratories)
date: 1992 (Proceedings of the 5th ACM SIGOPS European Workshop, Mont Saint-Michel, 1992, paper no. 34; reprinted in Operating Systems Review 27(2), April 1993)
accessed: 2026-11-22
kind: paper
---

Full text read from the Plan 9 documentation at 9p.io (the page itself gives
the 1992 workshop citation). The OSR reprint citation is from general
bibliographies, not verified here. Linux lineage note from mount_namespaces(7)
(<https://man7.org/linux/man-pages/man7/mount_namespaces.7.html>, HISTORY:
"Linux 2.4.19").

## Summary
Plan 9 is built on two ideas: every resource (local or remote) is a file
system served over one protocol (9P), and each process assembles its own
*private view* of the system — its *name space* — by mounting and binding
those file systems. `rfork` decides, bit by bit, whether a child shares or
copies its parent's name space. Because devices like the console, mouse and
network appear as files, simply changing what is bound where changes what a
process can reach — the window system 8½ even serves each window its own
`/dev/cons`.

## Key points
- "Per-process name space" is a core kernel attribute; there is no global
  name space, only shared conventions.
- `mount(fd, old, flags)` attaches a 9P service; `bind(new, old, flags)`
  re-exposes part of the existing tree elsewhere; union directories
  (before/after/replace) replace `$PATH`.
- `rfork` takes a bit vector of attributes to share vs copy, including the
  name space — the direct ancestor of Linux `clone(CLONE_NEWNS)` and
  `unshare(2)`.
- Kernel for multiprocessor SGI: 25,000 lines of C; minimal functional
  kernel from ~6,000 lines.
- Not a security mechanism per se, but a process can only name, and hence
  reach, what is in its name space.

## Excerpts
> "The foundations of the system are built on two ideas: a per-process name
> space and a simple message-oriented file system protocol." (Abstract)

> "...a user or process assembles a private view of the system by constructing
> a file name space that connects these resources." (Introduction)

> "One of the attributes is the name space: when shared, changes made by either
> process are visible in the other; when copied, changes are independent."
> (Name spaces)

## Relevance to the talk
The conceptual ancestor of Linux namespaces (mount namespaces landed in Linux
2.4.19 in 2002, followed by UTS, IPC, PID, net and user) and therefore of
containers, bubblewrap and most Linux agent sandboxes: isolation by
*constructing the view* rather than by checking each access. Contrast with
capability systems: names-as-authority by omission.
