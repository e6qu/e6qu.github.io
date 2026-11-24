---
title: The Protection of Information in Computer Systems
url: https://web.mit.edu/Saltzer/www/publications/protection/
authors: Jerome H. Saltzer, Michael D. Schroeder (MIT Project MAC)
date: 1975-09 (Proceedings of the IEEE 63(9), pp. 1278–1308; manuscript received 1974-10-11, revised 1975-04-17)
accessed: 2026-11-22
kind: paper
---

Read from the authors' HTML edition at web.mit.edu (front page, "Basic
Principles" section, and "About Paper" metadata page). The journal citation
(Proc. IEEE 63(9), Sept. 1975) is the standard one; the MIT pages give the
manuscript dates but not the issue number.

## Summary
An invited tutorial on the mechanics of protecting computer-stored
information, written by two Multics designers. Section I sets out functional
levels of protection, the famous eight design principles, and worked
examples (an isolated virtual machine built from a descriptor register plus a
privileged-state bit; authentication; sharing). Section II compares
capability ("ticket-oriented") and access-control-list ("list-oriented")
systems and protected subsystems. The glossary fixes vocabulary still used
today: principal, capability, confinement, domain, complete isolation.

## Key points
- Eight design principles: economy of mechanism, fail-safe defaults, complete
  mediation, open design, separation of privilege, least privilege, least
  common mechanism, psychological acceptability.
- Framed explicitly as mitigations because "no one knows how to build a
  system without flaws".
- Fail-safe defaults is credited to E. Glaser (1965); separation of privilege
  to R. Needham (1973).
- Levels of protection: unprotected → all-or-nothing (isolation) → controlled
  sharing → user-programmed sharing controls → putting strings on information.
- The "isolated virtual machine" example: one processor simulates several,
  each unaware of the others; isolation rests on a descriptor (base/bound)
  register that only privileged-state code (the supervisor) can load.
- Glossary defines *capability* as "an unforgeable ticket" and *confinement*
  as letting a borrowed program use data without being able to release it.

## Excerpts
> "Least privilege: Every program and every user of the system should operate
> using the least set of privileges necessary to complete the job. Primarily,
> this principle limits the damage that can result from an accident or error."
> (Sec. I-A-3)

> "Complete mediation: Every access to every object must be checked for
> authority." (Sec. I-A-3)

> "Fail-safe defaults: Base access decisions on permission rather than
> exclusion." (Sec. I-A-3)

> "It is relatively easy to use a single computer to simulate several, each of
> which is completely unaware of the existence of the others, except that each
> runs more slowly than usual." (Sec. I-B-3, "An Isolated Virtual Machine")

> "Confinement: Allowing a borrowed program to have access to data, while
> ensuring that the program cannot release the information." (Glossary)

## Relevance to the talk
The vocabulary slide. Every modern sandbox is judged against these
principles: deny-by-default allowlists (fail-safe defaults), mediating every
syscall/file/network access (complete mediation — and its failure modes in
interposition tools, see Garfinkel 2003), least privilege for agents, and
"psychological acceptability" as the reason permission prompts fail. The
isolated-VM example shows that in 1975 the VM was already the textbook
model of isolation.
