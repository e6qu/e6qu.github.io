---
title: "CHDIR(2) — chdir, chroot - change default directory (UNIX Programmer's Manual, Seventh Edition)"
url: http://man.cat-v.org/unix_7th/2/chdir
authors: Bell Telephone Laboratories (UNIX Seventh Edition manual)
date: 1979-01 (Version 7 Unix release); BSD addition by Bill Joy 1982-03-18 per McKusick's SCCS logs
accessed: 2026-11-22
kind: man-page
---

Read the V7 manual page at man.cat-v.org. History cross-checked against
FreeBSD chroot(2) (<https://man.freebsd.org/cgi/man.cgi?query=chroot&sektion=2>),
the Linux man-pages chroot(2) (<https://man7.org/linux/man-pages/man2/chroot.2.html>),
and footnote [CHROOT] of Kamp & Watson's jail paper
(<https://docs.freebsd.org/44doc/papers/jail/jail-9.html>). The month of the
V7 release (January 1979) is from general Unix histories, not from these pages.

## Summary
In Seventh Edition Unix, `chroot` is a two-sentence afterthought on the
`chdir(2)` page: it changes the starting point for absolute path names and is
restricted to the super-user. It was never designed as a security boundary.
According to Kirk McKusick (quoted in the jail paper) Bill Joy added it to BSD
on 18 March 1982, probably to build 4.2BSD inside a clean directory tree.
Modern man pages explicitly disclaim any sandboxing role and document how
root escapes.

## Key points
- V7: `chroot(dirname)`, syscall number 61; "restricted to the super-user".
- FreeBSD HISTORY: "The chroot() system call appeared in Version 7 AT&T
  UNIX." Marked LEGACY in SUSv2 and removed from later standards.
- McKusick: added to BSD on 1982-03-18, ~1.5 years before 4.2BSD; ftp
  (the later classic use case) didn't appear in the tree until January 1983.
- Linux chroot(2): it "changes an ingredient in the pathname resolution
  process and does nothing else"; does not change cwd; does not close
  open file descriptors; root escapes with `mkdir foo; chroot foo; cd ..`.
- Linux man page recommends FreeBSD's "stronger jail() system call".

## Excerpts
> "Chroot sets the root directory, the starting point for path names
> beginning with `/'. The call is restricted to the super-user." (V7 CHDIR(2))

> "According to the SCCS logs, the chroot call was added by Bill Joy on March
> 18, 1982 approximately 1.5 years before 4.2BSD was released." (McKusick,
> private communication, quoted in Kamp & Watson 2000, ref. [CHROOT])

> "In particular, it is not intended to be used for any kind of security
> purpose, neither to fully sandbox a process nor to restrict filesystem
> system calls." (Linux chroot(2), DESCRIPTION)

## Relevance to the talk
The Unix "sandbox" began as a build-tool convenience. It restricts only
*naming*, not authority — a theme that returns with every
filesystem-only sandbox. Root-in-chroot escapes motivated jails, and later
Linux mount namespaces + `pivot_root`.
