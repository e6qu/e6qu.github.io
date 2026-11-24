---
title: Programming Semantics for Multiprogrammed Computations
url: https://dl.acm.org/doi/10.1145/365230.365252
authors: Jack B. Dennis, Earl C. Van Horn (MIT, Project MAC)
date: 1966-03 (Communications of the ACM 9(3), March 1966, pp. 143–155; presented at the ACM Programming Languages and Pragmatics Conference, San Dimas, Calif., August 1965; also MIT MAC-TR-23, Dec. 1965)
accessed: 2026-11-22
kind: paper
---

Full text read from the scan at
<https://cs.ucf.edu/courses/cop6614/fall2005/dennis-vanhorn.pdf>. The MIT
technical-report version is at <https://dspace.mit.edu/handle/1721.1/149345>.

## Summary
Defines a set of "meta-instructions" for a multiprogrammed system covering
parallel processes, protection, debugging and shared named objects. It is
where the word *capability* enters computer science: each computation runs
inside a *sphere of protection* defined by a *C-list* (capability list), and
every capability both points to an object and states which actions are
permitted on it. A computation can create *inferior spheres* and grant them a
subset of its own capabilities — explicitly to run a probably-faulty program
under test without endangering the user's objects.

## Key points
- A computation = set of processes sharing one C-list; one-to-one mapping
  between computations, spheres of protection and C-lists.
- Segment capabilities carry access indicators X, R, XR, RW, XRW, plus an
  ownership bit (owned objects can be deleted and access to them granted or
  denied).
- I/O devices are also capabilities ("execute i/o function i").
- `create sphere` makes an inferior sphere; `grant` can pass only capabilities
  "implied by a capability present in the higher sphere" (no amplification).
- A process started in an inferior sphere begins with a zero state word —
  no ambient data.
- Exceptional conditions (faults, violations) in the inferior sphere return
  control to the superior — the supervisor-of-a-sandbox pattern.
- Also introduces protected entry points for shared procedures.

## Excerpts
> "Thus, we think of a computation as proceeding within some sphere of
> protection specified by a list of capabilities or C-list for short. Each
> capability in a C-list locates by means of a pointer some computing object,
> and indicates the actions that the computation may perform with respect to
> that object." (p. 144)

> "Since the program under test is likely to be faulty, it is desirable to
> protect both the user's permanent objects, and any objects created by the
> PLS on his behalf from unintentional use or destruction by the procedure
> being debugged." (p. 148, "Inferior Spheres of Protection")

> "The grant meta-instruction cannot be used to pass a capability that is not
> implied by a capability present in the higher sphere." (p. 148)

## Relevance to the talk
The earliest clear statement of the sandbox pattern: a parent creates a
child protection domain, hands it an explicit, attenuated set of
capabilities, and catches its faults. Capsicum, Fuchsia handles, WASI
preopened directories and "give the agent only these directories" are all
direct descendants of the C-list.
