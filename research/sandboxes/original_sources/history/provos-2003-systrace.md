---
title: Improving Host Security with System Call Policies
url: https://www.usenix.org/conference/12th-usenix-security-symposium/improving-host-security-system-call-policies
authors: Niels Provos (Center for Information Technology Integration, University of Michigan)
date: 2003-08 (12th USENIX Security Symposium, Washington D.C., 4–8 Aug. 2003, pp. 257–272)
accessed: 2026-11-22
kind: paper
---

Full text read from the USENIX PDF
<https://www.usenix.org/legacy/events/sec03/tech/full_papers/provos/provos.pdf>.
Fate of systrace cross-checked against the OpenBSD 6.0 release page
<https://www.openbsd.org/60.html> ("Remove systrace.", released 2016-09-01) and
Watson, "Exploiting Concurrency Vulnerabilities in System Call Wrappers",
USENIX WOOT 2007 (<https://www.cl.cam.ac.uk/teaching/0809/Security/concurrency.pdf>,
summary only — full PDF not read).

## Summary
Systrace is a hybrid kernel/user-space syscall policy system for OpenBSD
(also ported to NetBSD, Linux and Mac OS X). A small kernel hook suspends a
process at each non-trivial syscall and asks a user-space policy daemon,
which evaluates per-syscall rules (permit / deny / ask). Policies can be
learned automatically during a training run or built interactively. It also
offers *privilege elevation*: granting a single syscall extra privilege so
setuid binaries become unnecessary. Provos explicitly addresses Janus-style
TOCTOU races by having the kernel execute the *resolved, checked* copy of the
arguments from a read-only look-aside buffer.

## Key points
- Policy actions: `permit`, `deny`, `ask`; per-user/group predicates; `log`
  modifier; first matching rule wins; unmatched calls go to the user or are
  auto-denied. Example rule: `native-bind: sockaddr match "inet-*:53" then permit`.
- Automatic (training) and interactive (GUI prompt) policy generation.
- Race fix: replace syscall arguments with the normalized ones Systrace
  evaluated, held in kernel memory and exposed read-only to the process.
- Evaluated on a 1.14 GHz Pentium III running OpenBSD; overhead reported as
  not significant for real workloads.
- Afterlife (secondary): Watson (WOOT 2007) showed practical concurrency
  attacks on syscall wrappers, including Systrace's Sysjail policy and sudo's
  monitor mode; NetBSD dropped systrace in late 2007 (per Wikipedia);
  OpenBSD 6.0 (2016-09-01) lists "Remove systrace." — replaced in spirit by
  pledge(2) and unveil(2).

## Excerpts
> "With Systrace, it is possible to generate policies automatically in a
> training session or generate them interactively during program execution."
> (Abstract)

> "System call interception does not provide atomicity between the time a
> policy decision is made and the time a system call is executed, i.e. the
> time of check is not the time of use (TOCTOU)." (Sec. 4)

> "This ensures that the kernel executes only system calls that passed the
> policy check." (Sec. 4)

## Relevance to the talk
Systrace's interactive "ask" mode is the 2003 ancestor of today's agent
permission prompts — and its history (policy fatigue, wrapper races,
eventual removal in favour of pledge) is a cautionary tale for prompt-driven
agent sandboxes. "Learn a policy from a training run" is also what tools
that auto-generate seccomp or network allowlists do today.
