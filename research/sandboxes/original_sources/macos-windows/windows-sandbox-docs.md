---
title: Windows Sandbox
url: https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/
authors: Microsoft (Windows security docs)
date: page ms.date 2026-03-29 (updated 2026-10-08)
accessed: 2026-11-22
kind: docs
---

## Summary
Current Microsoft documentation for Windows Sandbox (WSB): a disposable VM
with its own kernel under the Microsoft hypervisor, quick launch, lower memory
footprint than full VMs, available on Pro/Enterprise/Education (not Home).
Networking is on by default; a `.wsb` config file can disable it and map host
folders read-only. Crucially for density, only one instance can run at a time.

## Key points
- "Uses hardware-based virtualization for kernel isolation" with a separate
  kernel.
- Each launch is a fresh instance; since Windows 11 22H2, state survives
  restarts initiated inside the sandbox.
- Network enabled by default; documentation warns this can expose untrusted
  apps to the internal network.
- Recommended pattern for untrusted files: networking disabled, folder mapped
  read-only.
- "Windows Sandbox currently doesn't allow multiple instances to run
  simultaneously."
- Not on Windows Home.
- WSB is also an (experimental) backend of Microsoft Execution Containers
  (see windows-mxc-repo.md).

## Excerpts
> "As a disposable virtual machine (VM), Windows Sandbox ensures reboot persistence, quick launch times, and a lower memory footprint compared to full VMs."

> "It relies on the Microsoft hypervisor to run a separate kernel that isolates Windows Sandbox from the host."

> "Windows Sandbox currently doesn't allow multiple instances to run simultaneously."

## Relevance to the talk
Windows' built-in "light VM" is strong (separate kernel) but single-instance,
so it cannot host N parallel agents. Good slide contrast with process-level
options (AppContainer/MXC ProcessContainer) and with WSL2's one shared VM.
