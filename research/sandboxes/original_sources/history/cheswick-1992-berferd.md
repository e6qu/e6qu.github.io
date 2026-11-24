---
title: "An Evening with Berferd: In Which a Cracker is Lured, Endured, and Studied"
url: https://pages.cs.wisc.edu/~remzi/Classes/736/Spring2000/Papers/berferd.pdf
authors: Bill Cheswick (AT&T Bell Laboratories)
date: 1992-01 (Proceedings of the Winter 1992 USENIX Conference, San Francisco, p. 163); events 7 Jan – 3 May 1991
accessed: 2026-11-22
kind: paper
---

Full text read from the Wisconsin course copy (no publisher-hosted
canonical PDF found; the full Winter '92 proceedings are on bitsavers).

## Summary
Cheswick recounts luring an intruder ("Berferd") who tried the sendmail
DEBUG hole on AT&T's gateway on 7 January 1991, and watching him for months
inside a hand-built chroot environment he called the "Jail" (or "roach
motel"). This is the earliest well-known use of "jail" for a chroot
environment. His conclusion: a chroot jail is too hard to get right and
"never quite secure".

## Key points
- Local gurus' verdict on chroot: "not perfectly secure, but if compilers and
  certain programs are missing, it is very difficult to escape".
- Building a believable jail meant faking /dev access times and utmp and
  removing ps, who, w, netstat and raw disk files.
- Every session was logged (input and output separately) through the
  firewall.
- The Jail was shut down on 3 May 1991 at management's request.
- Recommends a throwaway machine plus a passive monitor (transmit wire cut)
  over a chroot jail.

## Excerpts
> "This paper is a chronicle of the cracker's "successes" and disappointments,
> the bait and traps used to lure and detect him, and the chroot "Jail" we
> built to watch his activities." (Abstract)

> "Though the Jail was an interesting and educational exercise, it was not
> worth the effort. It is too hard to get it right, and never quite secure."
> (Conclusions)

## Relevance to the talk
Names the metaphor ("jail") that FreeBSD would adopt in 2000, and is an early
first-hand admission that a filesystem-view-only sandbox is not a security
boundary — the same lesson container users relearned two decades later.
