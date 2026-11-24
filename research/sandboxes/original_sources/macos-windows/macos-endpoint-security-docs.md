---
title: "Endpoint Security"
url: https://developer.apple.com/documentation/endpointsecurity
authors: Apple Inc.
date: framework available since macOS 10.15 (2019), per the docs' platform metadata
accessed: 2026-11-22
kind: docs
---

## Summary
Endpoint Security (ES) is a C API, delivered as a system extension, for monitoring and authorizing
system events: process exec, fork, file system mounts, signals and many file operations. It replaced
third-party kernel extensions for security products. Clients can authorize pending events ("AUTH"
events) or receive notifications ("NOTIFY").

## Key points
- Available since macOS 10.15. It ships as a system extension and needs an Apple-granted entitlement.
- Clients can authorize or deny events such as exec and file opens before they complete.
- Visibility is system-wide. It is a policy hook, not a confinement container.

## Excerpts
> "Endpoint Security is a C API for monitoring system events for potentially malicious activity." — overview

> "Your client registers with Endpoint Security to authorize pending events, or receive notifications of events that already occurred." — overview

## Relevance to the talk
The closest macOS has to a programmable, LSM-like reference monitor for third parties. An agent
supervisor could in principle use ES AUTH events to enforce per-process exec or file policy without a VM,
the macOS analogue of Landlock/seccomp-notify approaches. In practice it is gated by entitlements and
deployed by EDR vendors, not agent tools; we found no agent sandbox using it.
