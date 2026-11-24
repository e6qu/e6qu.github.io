---
title: systemd.exec — Execution environment configuration (Sandboxing section)
url: https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html
authors: systemd project (Lennart Poettering et al.)
date: living man page; options added between systemd 187 (2012) and 250 (2021)
accessed: 2026-11-22
kind: man-page
---

## Summary
systemd turned the kernel primitives into declarative per-service switches: one line in a unit file
gives a daemon a read-only `/usr`, a private `/tmp`, no device nodes, a seccomp allow-list, no new
namespaces, and so on. It made sandboxing a configuration default for system services rather than code
each daemon must write.

## Key points
- "Added in version" notes: `NoNewPrivileges=` 187, `SystemCallFilter=` 187, `PrivateDevices=` 209,
  `SystemCallArchitectures=` 209, `RestrictAddressFamilies=` 211, `ProtectSystem=` 214, `ProtectHome=` 214,
  `MemoryDenyWriteExecute=` 231, `RestrictRealtime=` 231, `PrivateUsers=` 232, `ProtectKernelTunables=` 232,
  `ProtectKernelModules=` 232, `ProtectControlGroups=` 232, `DynamicUser=` 232, `RestrictNamespaces=` 233,
  `LockPersonality=` 235, `RestrictFileSystems=` 250 (BPF LSM).
- `SystemCallFilter=` supports named groups (e.g. `@system-service`, `@sandbox` which includes Landlock syscalls).
- `systemd-analyze security` scores units on these settings (from systemd-analyze(1); not read here).
- Version→year mapping not from the page (systemd 187 ≈ mid-2012; 232 ≈ late 2016; 250 ≈ Dec 2021).

## Excerpts
> "The following sandboxing options are an effective way to limit the exposure of the system towards the unit's processes." — Sandboxing

## Relevance to the talk
A good "sandboxing as config" exhibit — and a model for agent sandbox configuration surfaces
(allow-lists of paths, address families, syscall groups).
