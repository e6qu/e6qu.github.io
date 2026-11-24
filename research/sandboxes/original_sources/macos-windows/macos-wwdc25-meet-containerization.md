---
title: "Meet Containerization (WWDC25 session 346)"
url: https://developer.apple.com/videos/play/wwdc2025/346/
authors: Apple Inc. (presented by Michael Crosby, per session listings; the transcript gives only "Michael")
date: 2025-06 (WWDC25)
accessed: 2026-11-22
kind: talk
---

## Summary
The WWDC session introducing the Containerization framework and the `container` CLI. It explains that
the usual approach is one large VM hosting all containers, and Apple instead runs each container in its
own lightweight VM with sub-second start. The guest is deliberately minimal: a static Swift `vminitd` as
PID 1, no core utilities, no libc. Each container gets a dedicated IP address. Resources are allocated
only while containers run.

## Key points
- Goal: give each container the isolation level of a full VM.
- Privacy: processes in one container cannot see the host's or other containers' processes.
- The demo drops into an interactive shell in "a few hundred milliseconds".
- `vminitd` is a static executable because the guest has no libraries to link against.
- Running at 12 min 32 s, the session is the primary statement of the design rationale.

## Excerpts
> "Containerization does this by running each container inside of its own lightweight virtual machine while still providing sub-second start times." — transcript

> "The historical solution is to spawn a large virtual machine to host all of the running containers." — transcript

> "Within a few hundred milliseconds, we're dropped into an interactive shell." — demo

## Relevance to the talk
The vendor endorsing microVM-per-container on the desktop. It gives the startup number for the talk,
a few hundred milliseconds to a shell. It also frames the core choice: one VM shared by many
(OrbStack, Docker Desktop, WSL2) versus one VM per workload (Apple `container`, Docker Sandboxes).
