---
title: "Is chroot a security feature?"
url: https://news.ycombinator.com/item?id=20969459
story_url: https://access.redhat.com/blogs/766093/posts/1975883
authors: HN discussion of a Red Hat security blog post (2013); commenters include cyphar (Aleksa Sarai, runc maintainer), phkamp (Poul-Henning Kamp), tptacek, ori_b, pcwalton, xorcist
date: 2019-09-14
accessed: 2026-11-22
kind: discussion
points: 88
comments: 83
---

Read via the HN Algolia items API, all comments.

## Summary
A 2013 Red Hat post arguing "using chroot is no safer than not using a
chroot" draws a sharp thread. Aleksa Sarai (runc maintainer) explains in
detail that the textbook `chdir("..")` escape is outdated but an
fd-based escape still works on modern Linux, and that container runtimes
use `pivot_root(2)` precisely because chroot leaves the old mounts
reachable. Poul-Henning Kamp answers with one line pointing at FreeBSD
jails. Ptacek argues chroot is a security feature in combination with
seccomp; ori_b argues the OpenBSD privsep view that file descriptors are
capabilities and sandboxes should drop the ability to acquire new ones.

## Key points
- Sarai's working escape (as of 2019): open a handle to `.`, `chroot()` into a subdirectory, `fchdir()` back to the handle, `chdir("..")` repeatedly, `chroot(".")`. Needs `CAP_SYS_CHROOT`, "and this is why user namespaces don't work in a chroot -- because breakouts would be trivial".
- Why it works: ".." is only a no-op when the current directory equals the process root; a directory above the root is never equal to it. Fixing this with a `path_is_under()` check on every ".." "would make all path lookups be O(n^2)".
- `pivot_root(2)` plus unmounting the old root removes the host mounts from the namespace; runc's `--no-pivot-root` mode "is incredibly insecure (because it uses chroot)".
- Sarai: the chroot(2) man page "probably hasn't been updated in ~20 years"; Kerrisk had said on LKML he planned to rewrite it.
- Ptacek: "on modern Linux, you're a seccomp call away from blocking those vectors"; chroot is "part of an ensemble of related features".
- ori_b's model: acquire fds first, then drop the ability to request new capabilities — "exactly how privsep works on all of the OpenBSD daemons, augmented by pledge".
- Counter-view: chroot as defence in depth for daemons that drop privileges (BIND, OpenSSH, Postfix) (xorcist, johnklos).

## Excerpts
> "How can this even be a question 20 years after FreeBSD Jails ?" — phkamp, <https://news.ycombinator.com/item?id=20969584>

> "The "chdir .." trick used to work a long time ago. The man page probably hasn't been updated in ~20 years." — cyphar, <https://news.ycombinator.com/item?id=20969619>

> "Yes, this requires CAP_SYS_CHROOT (and this is why user namespaces don't work in a chroot -- because breakouts would be trivial)." — cyphar, <https://news.ycombinator.com/item?id=20970285>

> "this is what container runtimes do when switching to the container rootfs -- and is the main reason why --no-pivot-root is incredibly insecure (because it uses chroot)." — cyphar, <https://news.ycombinator.com/item?id=20969655>

> "The inadequacy of chroot was a more coherent story to tell 10 years ago, but now, it seems silly to suggest that chroot isn't a security feature; it is, it's just part of an ensemble of related features that need to be deployed in concert." — tptacek, <https://news.ycombinator.com/item?id=20971951>

> "You can think of FDs as capabilities. Dropping the namespace prevents the program from requesting new capabilities." — ori_b, <https://news.ycombinator.com/item?id=20972326>

> "That's why FreeBSD created jails, the idea was to actually make a secure chroot." — takeda, <https://news.ycombinator.com/item?id=20972459>

## Relevance to the talk
Updates our [simes-2002-breaking-chroot](../../history/simes-2002-breaking-chroot.md)
note: the 2002 escape still works in its fd form, from a runc maintainer
in 2019. Gives the chroot → jail → pivot_root line in the words of the
people who built each step, and an early statement of the "fds as
capabilities" idea that Capsicum and Landlock formalise.
