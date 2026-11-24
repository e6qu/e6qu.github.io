---
title: Job Objects
url: https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects
authors: Microsoft (Win32 docs)
date: page ms.date 2025-07-14 (page documents behaviour back to Windows XP SP3 / Server 2003; nesting added in Windows 8 / Server 2012)
accessed: 2026-11-22
kind: docs
---

## Summary
A job object groups processes so they can be limited, accounted and
terminated as a unit. It is Windows' rough equivalent of a cgroup: limits on
working set, priority, CPU rate, process count, UI restrictions, and
kill-on-close. Server silos (Windows containers) are a special kind of job
object (see windows-forshaw-who-contains-the-containers.md).

## Key points
- Child processes inherit the job by default; breakaway can be allowed via
  `JOB_OBJECT_LIMIT_BREAKAWAY_OK` / `SILENT_BREAKAWAY_OK`.
- Limit classes: `JOBOBJECT_BASIC_LIMIT_INFORMATION`,
  `JOBOBJECT_BASIC_UI_RESTRICTIONS`, `JOBOBJECT_CPU_RATE_CONTROL_INFORMATION`,
  `JOBOBJECT_EXTENDED_LIMIT_INFORMATION` (memory), notification limits.
- Accounting: per-job CPU and I/O accounting via `QueryInformationJobObject`.
- Nested jobs only since Windows 8 / Server 2012; before that a process could
  be in only one job.
- `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE` terminates the whole tree when the last
  handle closes — what agent sandboxes (e.g. MXC, Codex) use to reap
  descendants.
- Security limits are not set via the job since Vista; they must be set per
  process (token).

## Excerpts
> "A *job object* allows groups of processes to be managed as a unit." (intro)

> "Examples include enforcing limits such as working set size and process priority or terminating all processes associated with a job." (intro)

> "The ability to nest jobs was added in Windows 8 and Windows Server 2012." (Creating Jobs)

## Relevance to the talk
The resource-limit half of a lightweight Windows sandbox. Combined with an
AppContainer or restricted token it gives a cgroup+LSM-like pair without a
VM; this is the building block for packing many agents on one Windows host.
