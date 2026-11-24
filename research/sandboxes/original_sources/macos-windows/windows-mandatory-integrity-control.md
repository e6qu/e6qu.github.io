---
title: Mandatory Integrity Control
url: https://learn.microsoft.com/en-us/windows/win32/secauthz/mandatory-integrity-control
authors: Microsoft (Win32 docs)
date: page ms.date 2025-07-08 (MIC introduced in Windows Vista, 2007)
accessed: 2026-11-22
kind: docs
---

## Summary
Mandatory Integrity Control (MIC) adds a mandatory label check before the
normal DACL check. Principals and objects carry integrity levels (low,
medium, high, system); by default a lower-integrity process cannot write to a
higher-integrity object regardless of the DACL. MIC was Vista's basis for
Internet Explorer Protected Mode and, together with UIPI, the first
in-box "low rights" sandbox on Windows.

## Key points
- Four defined levels: low, medium (standard users), high (elevated),
  system. (Chromium's design doc additionally uses *Untrusted*, S-1-16-0x0.)
- Default object policy is `SYSTEM_MANDATORY_LABEL_NO_WRITE_UP`; NO_READ_UP and
  NO_EXECUTE_UP also exist. Unlabelled objects are treated as medium.
- A new process gets the minimum of the user's and the executable file's
  integrity level.
- Windows prevents low-integrity processes from accessing app-container
  processes.
- UIPI (User Interface Privilege Isolation) applies the same integrity rules to
  window messages between processes on one desktop (described in the Chromium
  sandbox design doc; see windows-chromium-sandbox-design.md).
- MIC is defence-in-depth, not a full boundary: reads up are allowed by
  default, so a low-IL process can still read most user files.

## Excerpts
> "a principal with a low integrity level cannot write to an object with a medium integrity level, even if that object's DACL allows write access to the principal." (intro)

> "Windows defines four integrity levels: low, medium, high, and system." (intro)

> "By default, the system creates every object with an access mask of **SYSTEM_MANDATORY_LABEL_NO_WRITE_UP**." (Mandatory Policy)

## Relevance to the talk
Historical step on Windows (Vista, 2007 — the same year as macOS Leopard's
Seatbelt): a cheap, kernel-enforced label that limits writes but not reads.
Useful to explain why "run the agent at low integrity" is not enough:
confidentiality of the user's files and network access are not covered.
