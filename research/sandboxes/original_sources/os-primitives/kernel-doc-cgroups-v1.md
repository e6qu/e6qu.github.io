---
title: Control Groups (cgroup v1)
url: https://docs.kernel.org/admin-guide/cgroup-v1/cgroups.html
authors: Paul Menage (Google), based on the CPUSETS document by Paul Jackson (SGI) and others
date: originally 2007–2008 (merged with Linux 2.6.24, January 2008); living document
accessed: 2026-11-22
kind: docs
---

## Summary
The original in-kernel documentation of cgroups (v1). It defines a cgroup as a set of tasks bound to
parameters for one or more subsystems, arranged in hierarchies managed via a pseudo-filesystem. The header
shows its lineage: written by Paul Menage at Google, derived from the cpusets documentation (Bull SA, SGI).

## Key points
- Header: "Written by Paul Menage <menage@google.com> based on CPUSETS"; portions copyright 2004 BULL SA,
  2004–2006 Silicon Graphics; modified by Paul Jackson (SGI) and Christoph Lameter.
- v1 allowed any number of hierarchies, each with any set of controllers (subsystems) — the design that v2 later rejected.
- cpusets is the worked example (binding tasks to CPUs and memory nodes).
- Merge: LWN, 2007-10-24, "The Control Groups (formerly process containers) patch set has been merged" for
  2.6.24 (https://lwn.net/Articles/255327); 2.6.24 released January 2008.

## Excerpts
> "A *cgroup* associates a set of tasks with a set of parameters for one or more subsystems." — §1.1

> "Written by Paul Menage <menage@google.com> based on CPUSETS" — header

## Relevance to the talk
cgroups are the resource-limiting half of containers (CPU, memory, pids, I/O). They do nothing for
confidentiality or kernel attack surface — a useful contrast when explaining "container ≠ sandbox".
