---
title: A Note on the Confinement Problem
url: https://dl.acm.org/doi/10.1145/362375.362389
authors: Butler W. Lampson (Xerox Palo Alto Research Center)
date: 1973-10 (Communications of the ACM 16(10), Oct. 1973, pp. 613–615; received July 1972, revised January 1973)
accessed: 2026-11-22
kind: paper
---

Full text read from the author-distributed reprint hosted at
<https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf>
(ACM DL page returns 403 to automated fetches).

## Summary
Lampson defines the *confinement problem*: running an untrusted "service"
program on a "customer's" data so that it cannot transmit (leak) that data to
anyone except its caller. He enumerates six concrete leak paths, ranging from
writing a file to modulating system load, sorts them into storage, legitimate
and covert channels, and proposes four rules (total isolation, transitivity,
masking, enforcement) that would be sufficient to confine a program. This is
the first published use of the term "covert channel".

## Key points
- Framing: a *customer* runs a possibly untrustworthy *service*; preventing
  unauthorized access is "known how to solve", but leakage is not.
- Leak examples: memory across calls; permanent file in the owner's
  directory; temporary file shared with the owner; IPC; information encoded
  in the bill/resource usage; file-lock interlocks as a shared Boolean; and
  varying paging/CPU ratio to signal through system performance.
- Examples 5 and 6 (lock-based and performance-based channels) are credited
  to A.G. Fraser of Bell Labs.
- A confined program must be *memoryless*.
- Rules: **Total isolation** (no calls at all — impractical);
  **Transitivity** (anything an untrusted callee runs must also be confined);
  **Masking** (the caller determines all inputs to legitimate and covert
  channels); **Enforcement** (the supervisor ensures covert-channel inputs
  conform to the caller's specification).
- Cheaper alternative to enforcement: bound covert-channel capacity.

## Excerpts
> "This note explores the problem of confining a program during its execution
> so that it cannot transmit information to any other program except its
> caller." (abstract)

> "Covert channels, i.e. those not intended for information transfer at all,
> such as the service program's effect on the system load." (Confinement Rules)

> "Transitivity: If a confined program calls another program which is not
> trusted, the called program must also be confined." (Confinement Rules)

> "There is not likely to be any rigorous way of identifying every channel in
> any system of even moderate complexity." (Confinement Rules)

## Relevance to the talk
The problem statement every sandbox still faces: an agent or untrusted tool
must be given the customer's data yet be unable to exfiltrate it. Transitivity
maps directly onto "child processes inherit the sandbox"; covert/legitimate
channels map onto network egress, DNS, timing side-channels and "information
encoded in the output". Lampson's admission that channels cannot be
exhaustively enumerated is a good honest caveat for any sandboxing talk.
