---
title: "Linux Security Modules: General Security Support for the Linux Kernel"
url: https://www.usenix.org/conference/11th-usenix-security-symposium/linux-security-modules-general-security-support-linux
authors: Chris Wright, Crispin Cowan (WireX); Stephen Smalley (NAI Labs); James Morris (Intercode); Greg Kroah-Hartman (IBM)
date: 2002-08 (11th USENIX Security Symposium, San Francisco)
accessed: 2026-11-22
kind: paper
---

## Summary
The paper describing LSM, the hook framework that lets mandatory access control systems (SELinux, later
AppArmor, Smack, TOMOYO, Yama, Landlock…) plug into the kernel without each being a fork. It argues that
mainstream OS access control was inadequate and that enhanced mechanisms had failed to get in partly for
lack of consensus — hence a generic framework. SELinux is one of the adapted modules.

## Key points
- PDF: http://www.usenix.org/events/sec02/full_papers/wright/wright.pdf
- SELinux origin: NSA prototype announced on LKML by Pete Loscocco, 2000-12-22, "Security-enhanced Linux
  available at NSA site", built on Linux 2.2.12, GPL
  (https://lkml.iu.edu/hypermail/linux/kernel/0012.2/0834.html).
- SELinux entered mainline during 2.6.0-test (Aug 2003, per NSA timeline seen only in search snippets — not verified directly).
- AppArmor: originally Immunix (1998), path-based rather than label-based; merged Linux 2.6.36, released
  2010-10-20 (https://kernelnewbies.org/Linux_2_6_36).
- Today's kernel LSM docs (https://docs.kernel.org/admin-guide/LSM/index.html) list AppArmor, LoadPin,
  SELinux, Smack, TOMOYO, Yama, SafeSetID, IPE, Landlock; "module" is a misnomer — they're built-in and
  selected via `CONFIG_LSM` / `lsm=`.

## Excerpts
> "The access control mechanisms of existing mainstream operating systems are inadequate to provide strong system security." — Abstract

> "a strong, flexible mandatory access control architecture incorporated into the major subsystems of the kernel" — NSA LKML announcement, 2000

> "AppArmor is MAC style security extension for the Linux kernel." — kernel AppArmor docs

## Relevance to the talk
MAC is the administrator-written, system-wide policy approach (contrast: Landlock/pledge are
self-imposed by the program). Android and Fedora/RHEL lean on SELinux; Ubuntu on AppArmor (including,
since 23.10, to gate unprivileged user namespaces). Chromium deprecated its SELinux/AppArmor layers.
