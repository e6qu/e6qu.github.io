---
title: "Isolated machines · OrbStack Docs"
url: https://docs.orbstack.dev/machines/isolated
authors: Orbital Labs, LLC
date: undated docs page (footer © 2024)
accessed: 2026-11-22
kind: docs
---

## Summary
OrbStack's "isolated machines" turn off its macOS integration for a more sandboxed Linux machine. They
drop the `/mnt/mac` mount, network access to the host and `mac` commands, SSH-agent forwarding, and USB,
serial and sound passthrough. The docs say outright that machines still share one kernel inside one VM
and are not a full security boundary.

## Key points
- Regular machines get `/mnt/mac` (host files), `/mnt/machines` (other machines' files), passwordless
  sudo and SSH-agent forwarding (machines docs page).
- Isolated machines remove host file access, host network reachability and agent forwarding.
- All machines and containers still run in OrbStack's single Linux VM on one kernel.
- For malware analysis the docs recommend a full VM with its own kernel.

## Excerpts
> "Isolated machines run without OrbStack's macOS integration, for a more sandboxed Linux environment." — Isolated machines

> "All machines and containers run in OrbStack's single Linux VM and share one kernel." — Isolated machines

> "they aren't a full security boundary" — Isolated machines

## Relevance to the talk
A vendor stating plainly the trade-off between density and isolation. The shared-VM model protects the
Mac from the workloads, because the VM boundary sits between macOS and all of Linux. It does not protect
one agent from another as strongly, since they share a Linux kernel. For agents, that is often
acceptable: the main thing to protect is the host.
