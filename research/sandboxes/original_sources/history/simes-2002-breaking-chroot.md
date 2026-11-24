---
title: How to break out of a chroot() jail
url: http://www.bpfh.net/simes/computing/chroot-break.html
authors: Simes (Simon's computing stuff, bpfh.net)
date: 2002-05-12 (page "last changed" date)
accessed: 2026-11-22
kind: blog
---

Original site is offline; read via the Wayback Machine snapshot
<https://web.archive.org/web/20160127150916/http://www.bpfh.net/simes/computing/chroot-break.html>.

## Summary
A widely cited explanation of why chroot is not a security boundary against
root. Written with web servers running untrusted CGI scripts in mind, it
gives the classic escape: a root process creates a subdirectory, chroots into
it while keeping a handle on (or being in) a directory outside the new root,
then walks `..` up to the real root and chroots there. It cites earlier
discussion (SunWorld 1999, a wu-ftpd exploit posted to BugTraq on
1999-03-25) and notes that FreeBSD 4.x hardened chroot.

## Key points
- Precondition: UID 0 inside the chroot, plus a compiler/Perl or a setuid
  hole. The author notes maintaining a chroot is "non-trivial" because
  patches don't update the copied binaries inside it.
- Steps: mkdir temp; (open cwd); chroot(temp); (fchdir back out); chdir("..")
  repeatedly; chroot(".").
- Works because most chroot implementations do not change the working
  directory and do not close open directory descriptors.
- Says the possibility was "alluded to" in Cheswick's Berferd paper.
- FreeBSD 4.x chroot can be made to fail if the process has any directory
  file descriptors open; jail(2) restricts further.
- Footprint: a reasonable Perl install inside a chroot needed 2,610 files
  and 192 directories.

## Excerpts
> "So long as a program is run with root (ie UID 0) privilages it can be used
> to break out of a chroot()ed area." (Breaking chroot())

> "FreeBSD 4.x and above have a better chroot() system call. It can be made to
> fail if the process has any file descriptors open on a directory."

## Qualifications from Hacker News
The escape still works in its file-descriptor form, per runc's maintainer in a 2019 HN thread ([note](../hackernews/history-os-primitives/hn-20969459-is-chroot-a-security-feature.md), <https://news.ycombinator.com/item?id=20969619>).

## Relevance to the talk
The canonical "why chroot isn't a sandbox" demo; the escape relies on
*ambient* root authority surviving inside the restricted view — exactly what
jails, zones and user namespaces set out to remove.
