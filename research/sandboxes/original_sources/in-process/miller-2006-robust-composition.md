---
title: "Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control"
url: http://www.erights.org/talks/thesis/
authors: Mark Samuel Miller (PhD dissertation; advisor Jonathan S. Shapiro; readers Scott Smith, Yair Amir)
date: 2006-05 (Johns Hopkins University, Baltimore, Maryland, USA)
accessed: 2026-11-22
kind: paper
---
PDF (current version, single-spaced): http://www.erights.org/talks/thesis/markm-thesis.pdf ·
official double-spaced copy: https://www.cypherpunks.to/erights/talks/thesis/submitted/markm-thesis.pdf ·
E language home: http://www.erights.org/elang/index.html .
Note: erights.org serves a GitHub Pages TLS certificate that does not match its hostname,
so the site only loads cleanly over plain HTTP.

## Summary
Miller's dissertation is the reference text for the **object-capability (ocap) model** as a
*programming-language* security discipline. It argues that the composition hazards of
modern software come from excess authority. If a language is memory-safe, keeps object
state encapsulated, and gives code no ambient authority, then object references can be
the only carriers of authority: "only connectivity begets connectivity". Least authority
can then be enforced at every scale, from an organisation down to a single object. The thesis presents **E**, a
distributed, persistent, secure language, and **CapDesk**, a "virus-safe" desktop built in
E, as embodiments, and unifies access control with event-loop concurrency control
(vats, promises, promise pipelining).

## Key points
- **POLA.** The Principle of Least Authority grants each program only the authority it
  needs. It is related to Saltzer & Schroeder's least *privilege*, but Miller separates
  *permission* (direct references held) from *authority* (every effect a subject can cause,
  directly or through other objects) (§3.1, §8.1).
- **Critique of static sandboxes.** Policy-file sandboxes (he cites Java's, e.g.
  [GMPS97, Gon99]) fail because "the least authority needed by the program changes as
  execution progresses". POLA needs authority handed over *dynamically and just in
  time*, which is what passing a reference does (§3.1).
- **The model (§9.1).** A reference "indivisibly combin[es] designation of the object, the
  permission to access it, and the means to access it". A *capability* is a reference to
  non-data. Data is immutable, so it carries knowledge, not authority. Miller notes the
  model is essentially the untyped call-by-value lambda calculus with local side effects
  and a restricted `eval`, and that all its access-control abilities were already in
  Dennis & Van Horn's supervisor (DVH).
- **Four connectivity rules (§9.2).** A reference can be obtained only by initial
  conditions, parenthood (creating the object), endowment (handing references to a new
  object at creation), or introduction (`bob.foo(carol)`, where the introducer already
  holds both). Hence "only connectivity begets connectivity", and bounds on authority
  follow from reachability in the object graph.
- **From objects to ocaps.** You prohibit "forged pointers, direct access to another's
  private state, and mutable static state". C++ (integer-to-pointer casts) falls outside
  the model, and so do Smalltalk and Java, because mutable statics let objects interact
  outside the reference graph (§9 intro).
- **Loader isolation (§10.3).** A code loader must give new code only the references in
  its explicit state. Systems break this by honouring **"magic names"**, global names
  mapped to authority the loader cannot withhold. Java is not an ocap language because
  a ClassLoader's import mapping "cannot override some magic system class names, and some
  of these system classes provide authority". The same applies to Scheme, Oz, ML and
  Smalltalk. Even E's own loader honours a few harmless magic names, which Miller calls
  a violation that "should be fixed".
- **Revocation and attenuation by composition.** Redell's 1974 *caretaker* is a forwarder
  plus a gate that can disable it. Its generalisation, the *membrane*, wraps every
  reference passed across it (Fig. 9.3, with a membrane example credited to Stiegler).
  Revocation is not a kernel primitive; it is ordinary code (§9.3).
- **Blind spot of permission-only analysis (§9.4).** Security officers who list who holds
  *permission* miss authority reached through forwarders. Miller: such analysis is made
  useless by "subjects following security best practices", not only by attackers.
- **Fractal POLA (Ch. 21).** Level 2 is the CapDesk desktop launching "caplets" with
  user-granted authority, plus **Polaris**, which runs legacy Windows apps under separate
  low-authority accounts. Level 3 is a caplet's startup module splitting its authority
  among modules. Level 4 is the individual object. Legacy modules are handled by
  **"taming"**, which gives "some confidence, under some circumstances".
- **Known limits, stated in the thesis.**
  - The model assumes a mutually relied-upon platform, a "central point of failure". Across
    machines, only weaker cryptographic enforcement remains (§11.5).
  - The DarpaBrowser is only a reviewed proof of concept. Wagner & Tribble's review
    [WT02] "reports on the many vulnerabilities they found in our work" (§21.6).
  - Joe-E (2010) later cites that review as finding that E's taming database had
    inadvertently allowed methods that violate capability discipline.
- **E itself.** erights.org describes E as "the secure distributed persistent language for
  capability-based smart contracting". It had two implementations, E-on-Java and Kevin
  Reid's E-on-CL. The thesis credits Electric Communities for open-sourcing E.

## Excerpts
> "The Principle of Least Authority (POLA) recommends that you grant each program only the authority it needs to do its job." (§3.1, p. 16)

> "By these rules, only connectivity begets connectivity—all access must derive from previous access." (§9.2.5, p. 68)

> "We can now say why Java is not an object-capability language. The import mapping that Alice provides cannot override some magic system class names, and some of these system classes provide authority." (§10.3, p. 78)

## Relevance to the talk
This is the theoretical root of the in-process line. Read it after Dennis & Van Horn
(1966) and Hardy's confused deputy, both noted elsewhere. In-process agent sandboxing
claims that if every effect goes through objects the host hands in, the agent's reachable
object graph *is* its policy. Miller supplies the vocabulary: ambient authority, magic
names, loader isolation, attenuation, caretakers and membranes. He also states the
preconditions plainly: memory safety, encapsulation, no mutable globals, and no magic
names. He contrasts these with static policy-file sandboxes such as the Java
SecurityManager (covered elsewhere). Every later system in this folder (Joe-E, Caja/SES,
Safe Haskell, and Scala-style capability tracking for agents) is an attempt to meet
those preconditions in a mainstream language. Their failures (taming errors, new
language features, unsafe escape hatches) are failures to keep them.
