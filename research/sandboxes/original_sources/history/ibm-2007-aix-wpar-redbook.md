---
title: Introduction to Workload Partition Management in IBM AIX Version 6.1 (SG24-7431-00)
url: https://www.redbooks.ibm.com/abstracts/sg247431.html
authors: Bruno Blanchard, Pedro Coelho, Mary Hazuka, Jerry Petru, Theeraphong Thitayanun, Chris Almond (IBM International Technical Support Organization)
date: 2007-11 (First Edition, November 2007)
accessed: 2026-11-22
kind: book
---

Front matter and chapter 1 read from the PDF
<https://redbooks.ibm.com/redbooks/pdfs/sg247431.pdf>. The exact AIX 6.1 GA
date (commonly given as 9 Nov 2007) was not verified from an IBM
announcement letter. The Redbook warns it was based on a pre-GA product.

## Summary
IBM's OS-level virtualization for AIX 6.1: a *workload partition* (WPAR) is
"a software-created, virtualized OS environment within a single AIX V6
image", hosted by a *global environment* that, like the Solaris global zone,
sees and controls everything. Two flavours: **system WPARs** (nearly a full
AIX with their own init, inetd, cron and writable filesystems, sharing /usr
and /opt read-only) and **application WPARs** (a lightweight wrapper around
one command, created with `wparexec`, sharing the global filesystem and
vanishing when the command exits). WPARs could be live-migrated between
machines ("Live Application Mobility").

## Key points
- Complements, rather than replaces, POWER hypervisor LPARs and Workload
  Manager (WLM); WPARs run inside an LPAR.
- Isolation: processes, IPC restricted to the same WPAR; filesystem
  isolation only for system WPARs.
- Application WPAR: start with one command, terminated when it exits; no
  inetd/srcmstr; cannot be logged into remotely.
- WPAR mobility (AIX 6 + WPAR Manager, POWER4–6) distinguished from Live
  Partition Mobility (POWER6 hypervisor).
- Successor Redbook SG24-7656 covers AIX 6.1 TL2.

## Excerpts
> "A WPAR is a software-created, virtualized OS environment within a single AIX
> V6 image. Each workload partition is a secure and isolated environment for
> the application it hosts." (Sec. 1.3)

> "If an application or group of applications can be started with one command
> of the AIX command-line interface, it is a candidate to be hosted by an
> application WPAR. ... As soon as the passed command exits, the workload
> partition is terminated." (Sec. 1.3.4)

## Relevance to the talk
By 2007 every major commercial Unix had containers (FreeBSD 2000, Solaris
2005, AIX 2007, HP-UX SRP). The *application WPAR* is a striking precursor of
`docker run --rm` and of per-command agent sandboxes: an isolated environment
whose lifetime is one command.
