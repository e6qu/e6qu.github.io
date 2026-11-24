---
title: "A Secure Environment for Untrusted Helper Applications (Confining the Wily Hacker)"
url: https://www.usenix.org/legacy/publications/library/proceedings/sec96/goldberg.html
authors: Ian Goldberg, David Wagner, Randi Thomas, Eric A. Brewer (UC Berkeley)
date: 1996-07 (6th USENIX UNIX Security Symposium, San Jose, Calif., 22–25 July 1996)
accessed: 2026-11-22
kind: paper
---

Full text read from the USENIX PDF
<https://www.usenix.org/legacy/publications/library/proceedings/sec96/full_papers/goldberg/goldberg.pdf>.
(The exact day range of the symposium is from USENIX listings, not the PDF,
which says "July 1996".)

## Summary
Janus confines untrusted *helper applications* — the programs a browser
like Netscape launches to render downloaded PostScript, MPEG and so on — by
intercepting their system calls with the Solaris 2.4 `/proc` process-tracing
facility and filtering them through configurable policy modules. It is a
user-mode, deny-by-default monitor that needs no changes to the applications
or the kernel, and it introduced syscall interposition as a practical
sandboxing technique.

## Key points
- Threat model: network data crafted by an adversary drives complex,
  buggy helpers (e.g. ghostview); damage should be limited to the helper's
  own display/window.
- Explicitly invokes the Principle of Least Privilege; the default is deny —
  a syscall runs only if some module explicitly allows it.
- Policy is a config file of modules, from general to specific; later
  modules override earlier; "super-allow/super-deny" are final. Example:
  `path allow read,write /tmp/*`.
- Rejected `ptrace(2)` as too coarse ("all-or-nothing tracing") and unable to
  abort a call without killing the tracee; chose Solaris `/proc`.
- Credits the word "sandboxing" to Wahbe et al. (SFI, SOSP 1993), "in a
  slightly different setting".
- Performance: negligible overhead on ghostscript benchmarks.

## Excerpts
> "We use the term sandboxing to describe the concept of confining a helper
> application to a restricted environment, within which it has free reign."
> (Sec. 3)

> "Our aim is to confine the untrusted software and data by monitoring and
> restricting the system calls it performs." (Sec. 1)

> "...we let the operating system execute a system call only if some module
> explicitly allows it; the default is for system calls to be denied."
> (Sec. 3)

## Relevance to the talk
The direct ancestor of seccomp-style syscall filtering and of "run the
untrusted tool under a policy file" designs, including today's agent
sandboxes that wrap a CLI tool with a declarative allowlist. Its threat model
(complex parser fed attacker-controlled input) is precisely an agent reading
a malicious repo or web page.
