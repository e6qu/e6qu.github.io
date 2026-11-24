---
title: "HYDRA: The Kernel of a Multiprocessor Operating System"
url: https://dl.acm.org/doi/10.1145/355616.364017
authors: W. Wulf, E. Cohen, W. Corwin, A. Jones, R. Levin, C. Pierson, F. Pollack (Carnegie-Mellon University)
date: 1974-06 (Communications of the ACM 17(6), June 1974, pp. 337–345)
accessed: 2026-11-22
kind: paper
---

Full text read from <https://homes.cs.washington.edu/~arvind/cs422/doc/hydra.pdf>
(ACM DL is paywalled/403 to automated fetches).

## Summary
HYDRA was the capability-based kernel for C.mmp, CMU's 16-processor PDP-11
multiprocessor. Everything is an *object* (unique name, type, data part and
capability part) and the only way to touch an object is through a kernel-
managed, unforgeable *capability*. Each procedure invocation runs in a fresh
*local name space* (LNS) holding exactly the capabilities it was given, and
the kernel checks the caller's rights against the callee's templates on every
call. It is the first well-documented OS to make "separation of mechanism and
policy" and non-hierarchical protection its explicit design goals.

## Key points
- C.mmp: up to 16 PDP-11 processors, 32 MB shared memory via crossbar.
- Design goals listed: multiprocessor environment; separation of mechanism
  and policy; rejection of strict hierarchical layering; protection as a
  uniform design tool; reliability.
- Capabilities "in the sense of Dennis" apply to all entities, with arbitrary
  type-specific rights, not just read/write/execute.
- Knowing an object's unique name grants nothing — only capabilities do, and
  they are manipulable only by the kernel ("impossible to forge").
- CALL: kernel validates actual-parameter capabilities against templates,
  builds a new LNS, deletes it on return. A process is a stack of LNSs.
- Rejects the hierarchy of ever-more-privileged layers ending in one "most
  privileged" component as "not viable security structures" — a
  mutual-suspicion model.

## Excerpts
> "Separation of mechanism and policy. Among the major causes of our inability
> to experiment with, and adapt, existing operating systems is their failure
> to properly separate mechanisms from policies." (Design Philosophy)

> "Knowledge of the unique name of an object does not grant access to the
> object since objects may only be referenced through capabilities (which are
> not manipulable except by the kernel)." (The Protection Mechanism)

> "Technologists like hierarchical structures—they are elegant; but experience
> from the real world shows they are not viable security structures." (The
> Protection Mechanism)

## Relevance to the talk
Hydra turns Dennis & Van Horn's C-list into a working kernel and shows the
"per-call minimal authority" idea (fresh LNS per invocation). Its
mechanism/policy split is the same split modern sandboxes make between
kernel primitives (namespaces, seccomp, Landlock) and policy layers
(container runtimes, agent permission configs).
