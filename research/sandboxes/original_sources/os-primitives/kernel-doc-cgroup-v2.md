---
title: Control Group v2
url: https://docs.kernel.org/admin-guide/cgroup-v2.html
authors: Tejun Heo
date: October 2015 (document date); declared stable in Linux 4.5, released 2016-03-13
accessed: 2026-11-22
kind: docs
---

## Summary
The authoritative description of cgroup v2, the redesign led by Tejun Heo: a single unified hierarchy,
processes only at the leaves ("no internal process" rule), and a defined model for delegating a subtree
to an unprivileged user or a cgroup namespace. A closing section explains why v1's multiple hierarchies
and per-thread membership were a mistake.

## Key points
- Single hierarchy: "Unlike v1, cgroup v2 has only single hierarchy."
- No-internal-process constraint: non-root cgroups distribute resources to children only if they hold no processes themselves.
- Delegation: give a less-privileged user write access to a directory and its `cgroup.procs`,
  `cgroup.threads`, `cgroup.subtree_control`; with `nsdelegate`, delegation to cgroup namespaces. This is
  what rootless containers and systemd user slices rely on.
- Controllers include cpu, cpuset, io, memory, pids (plus threaded ones such as perf_event).
- Stability: KernelNewbies Linux 4.5 (2016-03-13): "the unified hierarchy is considered stable, and it's no
  longer hidden behind that developer flag." (https://kernelnewbies.org/Linux_4.5)
- "Issues with v1": arbitrary number of hierarchies; threads of one process in different cgroups; internal
  nodes competing with child cgroups; inconsistent interfaces; memory-controller problems.

## Excerpts
> "cgroup is a mechanism to organize processes hierarchically and distribute system resources along the hierarchy in a controlled and configurable manner." — Introduction

> "cgroup v1 allowed an arbitrary number of hierarchies and each hierarchy could host any number of controllers." — Issues with v1

## Relevance to the talk
Resource limits are part of any agent sandbox (fork bombs, memory blowups, runaway CPU). v2's delegation
model is what lets an unprivileged user give each sandbox its own limits.
