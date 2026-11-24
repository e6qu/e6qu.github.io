---
title: "Jails: Confining the omnipotent root."
url: https://papers.freebsd.org/2000/phk-jails/
authors: Poul-Henning Kamp, Robert N. M. Watson (The FreeBSD Project)
date: 2000-05 (2nd International System Administration and Networking Conference, SANE 2000, Maastricht, 22–25 May 2000); jail shipped in FreeBSD 4.0-RELEASE, announced 2000-03-14
accessed: 2026-11-22
kind: paper
---

Full text read from the HTML edition at
<https://docs.freebsd.org/44doc/papers/jail/jail.html> (sections 1–9); venue
line from the troff source
<https://cgit.freebsd.org/src/plain/share/doc/papers/jail/paper.ms>.
Release/feature history from the FreeBSD 4.0 announcement
(<https://www.freebsd.org/releases/4.0R/announce/>), jail(2)/jail(8) man
pages, FreeBSD 8.0 (2009-11-25) and 12.0 (2018-12-11) release pages, and Zec,
"Implementing a Clonable Network Stack in the FreeBSD Kernel", USENIX ATC
FREENIX track, June 2003
(<https://www.usenix.org/legacy/events/usenix03/tech/freenix03/full_papers/zec/zec.pdf>).

## Summary
Jail partitions a FreeBSD system into "virtual machine" environments while
keeping the simple Unix root model: root inside a jail is still root, but
only over that jail's files, processes and its single IP address. It builds
on a hardened chroot for the filesystem, adds process-visibility and
IPC restrictions, binds each jail to one IP, and denies a list of privileged
operations (loading kernel modules, most sysctls, mknod, raw sockets,
mounting). Motivated by ISPs selling "virtual private servers" to mutually
untrusting customers, it was written by Kamp for R&D Associates and
contributed to FreeBSD.

## Key points
- Problem: delegate *some* admin rights to untrusted parties without
  fine-grained ACL complexity. chroot alone does not cover processes or
  networking.
- Mechanism: `struct prison` attached to the process credential; chroot for
  filesystem; one IP per jail (INADDR_ANY binds redirected to the jail IP);
  processes only see/signal processes in the same jail; `suser(9)` API
  reworked so privileged checks are jail-aware.
- Hardened chroot: three escape classes fixed — recursive chroot, ".."
  escapes, fchdir escapes.
- Tiny implementation: suser API change ~350 lines over ~100 files (mostly
  scripted); jail itself ~200 lines over ~50 files plus ~200 lines in two new
  files.
- Later evolution (man pages / release notes): jail_attach() in 5.1;
  hierarchical jails and jail_set/get/remove in 8.0 (Nov 2009); config file
  in 9.1; **VNET** — per-jail virtual network stack (VIMAGE), from Marko
  Zec's 2003 "clonable network stack" work, available in 8.0 and enabled by
  default in GENERIC in FreeBSD 12.0 (Dec 2018).

## Excerpts
> "The FreeBSD ``Jail'' facility provides the ability to partition the
> operating system environment, while maintaining the simplicity of the UNIX
> ``root'' model. In Jail, users with privilege find that the scope of their
> requests is limited to the jail..." (Abstract)

> "In the case of the chroot(2) call, a process's visibility of the file system
> name-space is limited to a single subtree. However, the compartmentalisation
> does not extend to the process or networking spaces..." (Sec. 1)

> "The jail facility has already seen widespread deployment in particular as a
> vehicle for delivering "virtual private server" services." (Sec. 9)

## Relevance to the talk
The first mainstream OS-level virtualization ("containers") in an open-source
Unix, nine years before Linux namespaces matured. Key design idea that
survives into Docker and agent sandboxes: don't remove root, *scope* root.
VNET is the precursor of Linux network namespaces as a sandbox egress
control.
