---
title: AppContainer isolation
url: https://learn.microsoft.com/en-us/windows/win32/secauthz/appcontainer-isolation
authors: Microsoft (Win32 docs)
date: page ms.date 2025-07-08 (AppContainer itself shipped with Windows 8, 2012)
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft's conceptual page for AppContainer, the per-app sandbox introduced
with Windows 8 for Store (later UWP/MSIX) apps and reused by browsers and,
since 2026, by Microsoft Execution Containers. It lists six isolation axes:
credentials, devices, files, network, process (kernel objects) and windows.
Access is denied by default and re-granted through capabilities.

## Key points
- Identity: the AppContainer SID combines user and app identity, so the app
  "cannot impersonate the user" (credential isolation).
- Devices (camera, microphone, GPS, cellular) are blocked by default and
  granted per capability, sometimes via brokers; keyboard and mouse are always
  available.
- Files and registry: read-write only to specifically granted locations;
  read-only access "is less restricted".
- Network: granular capabilities for Internet client, intranet
  (private network) and acting as a server.
- Process isolation is described as sandboxing the app's kernel objects
  (separate object namespace), and window isolation as preventing it from
  affecting other apps' UI.
- No resource-limit (CPU/memory) axis is part of AppContainer; that is the job
  object's role (see windows-job-objects.md).
- The companion page "AppContainer for legacy apps"
  (https://learn.microsoft.com/en-us/windows/win32/secauthz/appcontainer-for-legacy-applications-)
  notes the pre-Windows 8 name *LowBox* (`NtCreateLowBoxToken`) and that inside
  an app container the integrity level "is always *low*".

## Excerpts
> "Isolation is the primary goal of an AppContainer execution environment." (intro)

> "Even if vulnerability in an app is exploited, the app cannot access resources beyond what is granted to the AppContainer." (intro)

> "Granular access can be granted for Internet access, Intranet access, and acting as a server." (Network isolation)

> "AppContainer was originally named *LowBox* (prior to the release of Windows 8)." (AppContainer for legacy apps, Tip)

## Relevance to the talk
AppContainer is Windows' closest analogue to Seatbelt: a same-kernel,
per-process, capability-based sandbox with no VM. It covers filesystem,
network and object namespace but not CPU/memory quotas, and it is the
primitive under Chromium's renderer sandbox, Win32 app isolation and MXC's
ProcessContainer — i.e. the "lighter than a VM" path for many agents per
Windows machine.
