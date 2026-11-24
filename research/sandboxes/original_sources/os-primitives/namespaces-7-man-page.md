---
title: namespaces(7) — overview of Linux namespaces
url: https://man7.org/linux/man-pages/man7/namespaces.7.html
authors: Linux man-pages project (Michael Kerrisk et al.)
date: man-pages 6.19, page dated 2026-02-08
accessed: 2026-11-22
kind: man-page
---

## Summary
The canonical reference for Linux namespaces. It defines a namespace as a wrapper that makes a global
resource look private to the processes inside it, lists the eight namespace types and their `clone`
flags, and documents the `/proc/[pid]/ns/` handles plus the `clone(2)`/`unshare(2)`/`setns(2)` API.
Namespaces are the "what can you see" half of a Linux container (cgroups are the "how much can you use" half).

## Key points
- Eight namespace types (flag → isolates):
  Cgroup `CLONE_NEWCGROUP` → cgroup root directory; IPC `CLONE_NEWIPC` → System V IPC, POSIX message queues;
  Network `CLONE_NEWNET` → network devices, stacks, ports; Mount `CLONE_NEWNS` → mount points;
  PID `CLONE_NEWPID` → process IDs; Time `CLONE_NEWTIME` → boot and monotonic clocks;
  User `CLONE_NEWUSER` → user and group IDs; UTS `CLONE_NEWUTS` → hostname and NIS domain name.
- Note the mount flag is the generic `CLONE_NEWNS` ("new namespace") — a fossil of mount being the first and,
  at the time, only namespace type.
- `/proc/[pid]/ns/*` handle versions: ipc, net, uts since Linux 3.0; mnt, pid, user since 3.8; cgroup since 4.6;
  pid_for_children since 4.12; time and time_for_children since 5.6. From 3.8 these became symlinks.
- Since Linux 3.8, creating a user namespace requires no privilege.
- `/proc/sys/user/max_*_namespaces` limits since 4.9 (max_time_namespaces since 5.7).
- Companion page time_namespaces(7) (https://man7.org/linux/man-pages/man7/time_namespaces.7.html): time
  namespaces virtualize CLOCK_MONOTONIC and CLOCK_BOOTTIME (not CLOCK_REALTIME); offsets set via
  `/proc/<pid>/timens_offsets` before the first process enters. KernelNewbies dates them to Linux 5.6,
  released 29 March 2020 (https://kernelnewbies.org/Linux_5.6).

## Excerpts
> "A namespace wraps a global system resource in an abstraction that makes it appear to the processes within the namespace that [they have their own isolated instance of the global resource]" — DESCRIPTION (bracketed completion paraphrased)

> "Time namespaces virtualize the values of two system clocks" — time_namespaces(7), DESCRIPTION

## Relevance to the talk
The primitive under every Linux container, bubblewrap, nsjail and Chromium's namespace sandbox. Key talk
point: namespaces change *what a process can name*, not *what the kernel will do for it* — every namespaced
process still talks to the same kernel.
