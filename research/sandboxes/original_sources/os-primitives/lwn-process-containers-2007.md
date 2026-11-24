---
title: Process containers
url: https://lwn.net/Articles/236038/
authors: Jonathan Corbet (LWN.net)
date: 2007-05-29
accessed: 2026-11-22
kind: blog
---

## Summary
LWN's review of the "process containers" patch set (V10) that became cgroups. The work began with Rohit
Seth (reviewed by LWN in September 2006) and by 2007 was carried by Paul Menage, both at Google. It
generalised the existing cpusets mechanism into a framework of "subsystems" attached to hierarchies of
process groups, administered through a virtual filesystem rather than new syscalls.

## Key points
- Two concepts: *subsystems* (kernel parts that care about groups of processes, mostly resource control)
  and *containers* (groups of processes sharing subsystem parameters); hierarchical; multiple independent hierarchies.
- Managed through a virtual filesystem, not new system calls; subsystems must be built in, not modules.
- cpusets (binding processes to CPUs/memory nodes) is converted into the first subsystem.
- Anticipated controllers for CPU time, I/O bandwidth, memory.
- Follow-up: LWN "Merged for 2.6.24, part 2" (2007-10-24, https://lwn.net/Articles/255327) reports
  "The Control Groups (formerly process containers) patch set has been merged." — renamed to avoid
  clashing with the broader word "container". Linux 2.6.24 shipped January 2008, alongside PID namespaces.

## Excerpts
> "A "container" is a group of processes which shares a set of parameters used by one or more subsystems."

> "Containers are hierarchical, in that one container can hold others."

## Relevance to the talk
Origin story of cgroups: resource-control work by Google engineers (Seth, Menage) generalising SGI/Bull cpusets. Fun
fact for the talk: the kernel feature was literally called "containers" before it was renamed cgroups.
