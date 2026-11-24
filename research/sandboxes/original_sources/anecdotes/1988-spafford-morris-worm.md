---
title: "The Internet Worm Program: An Analysis (Purdue Technical Report CSD-TR-823)"
url: https://www.cerias.purdue.edu/techreports-ssl/public/823.pdf
authors: Eugene H. Spafford (Purdue University)
date: 1988-11-29, revised 1988-12-08
accessed: 2026-11-22
kind: report
---

## Summary
On the evening of 2 November 1988 a worm spread across BSD-derived Unix hosts on the Internet. It broke in three ways: a **536-byte overflow of `fingerd`'s `gets()` buffer**; **sendmail's `DEBUG` command**, which vendors had left compiled in and which let a recipient be a program; and **transitive trust** through `rsh` with `/etc/hosts.equiv` and `.rhosts`, fed by passwords cracked from the world-readable `/etc/passwd`. It copied itself, hid, forked regularly to change its PID and avoid scheduler penalties, and checked whether another worm was already running. The fatal design flaw was that **"one out of every seven worms would become immortal"** instead of deferring to a resident worm. With other bugs, this meant machines filled with copies until they were unusable. Spafford concludes that the author(s) were "sloppy or careless (or both)" and the release perhaps premature, but that there "can be no question that this was in any way an accident". The report names the alleged author, Robert T. Morris, who had not then confessed publicly.

## Key points
- Every exploit crossed a trust boundary that was then implicit: a network daemon running with privilege, a debug backdoor in a mail server, and host-to-host trust files.
- The DoS came from a **replication-control bug**, not from a payload. Compare the AI Scientist relaunching itself and the $72K Cloud Run recursion: an unbounded self-spawning process is a classic failure.
- It also sent a malformed UDP packet to `ernie.berkeley.edu` about once in 15 infections. The code was wrong and nothing was ever sent, perhaps a feint.
- Spafford's report withheld source code to protect the Internet's "immune system", an early responsible-disclosure stance.

## Excerpts
> "On the evening of 2 November 1988, someone infected the Internet with a worm program." (Abstract)

> "One out of every seven worms would become immortal rather than check for other local worms." (§4)

> "a specially constructed string of 536 bytes was passed to the daemon, overflowing its input buffer and overwriting parts of the stack" (§4, step 8b)

## Relevance to the talk
This is the history-section moment when "what if a program misbehaves on the network?" became everyone's problem. It is the origin of least-privilege daemons, privilege separation and, eventually, sandboxed network services. Hook: *"The worm was meant to be polite and check if it was already there — but one copy in seven ignored the answer."* It pairs well with sandbox resource limits (pids, CPU) and with agent self-replication stories.
