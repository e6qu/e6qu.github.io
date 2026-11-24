---
title: "HP-UX System Administrator's Guide: Security Management, HP-UX 11i Version 3 — Chapter 7, Compartments (Overview)"
url: https://docstore.w10.site/manuals/hp-ux/en/5992-3387/ch07s01.html
authors: Hewlett-Packard
date: HP-UX 11i v3 documentation (manual part 5992-3387; exact edition date not shown on the page). SRP introduced in the HP-UX 11i v2 era — exact date not verified
accessed: 2026-11-22
kind: docs
---

The official hp.com/docs.hpe.com copy could not be located; this was read
from a third-party mirror of the HP manual (docstore.w10.site), so treat as
best-available. Product naming from HP release notes as summarised in search
results: "HP-UX Containers (previously known as HP-UX Secure Resource
Partitions)", bundled with all HP-UX 11i v3 Operating Environments. A
2005 Prentice Hall book, *The HP Virtual Server Environment* (Herington &
Jacquot), has SRP chapters, suggesting SRP existed by 2005 — not read (O'Reilly
returned 403).

## Summary
HP-UX Secure Resource Partitions (SRP), later renamed HP-UX Containers,
combined two existing HP-UX facilities inside a single OS image: Process
Resource Manager (PRM) for CPU, memory and disk-I/O shares, and *security
compartments* for isolation. Compartments are a mandatory-access-control
style mechanism: every process belongs to a compartment, transient objects
are labelled with their creator's compartment, persistent objects carry
access rules, and cross-compartment access requires an explicit rule.

## Key points
- Compartments isolate subjects (processes) from each other and from objects
  (files, network interfaces, IPC).
- Child processes inherit their parent's compartment.
- Network interfaces can be placed in compartments, so a compromised service
  is confined to its compartment's network access.
- Same-compartment access needs no rule; cross-compartment access only via
  configured rules (`cmpt_tune(1M)`, `compartments(4)`, `compartments(5)`).
- SRP = PRM resource controls + compartments (+ fine-grained privileges);
  rebranded "HP-UX Containers" in later 11i v3 releases.

## Excerpts
> "Compartments are a method of isolating components of a system from one
> another." (Ch. 7 Overview)

> "...processes can access resources or communicate with processes belonging to
> a different compartment only if a rule exists between those compartments."
> (Ch. 7 Overview)

> "You can configure the system so that, if a service running in a compartment
> is compromised, it does not affect services running in other compartments."
> (Ch. 7 Overview)

## Relevance to the talk
Completes the "every Unix vendor shipped containers in the 2000s" slide. SRP
is notable for building containment out of a MAC/labels model (from HP's
trusted-OS heritage) rather than from chroot-plus-namespaces.
