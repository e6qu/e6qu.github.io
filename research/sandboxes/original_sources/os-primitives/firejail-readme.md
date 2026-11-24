---
title: Firejail
url: https://github.com/netblue30/firejail
authors: netblue30 and contributors
date: README is living (project start date not verified)
accessed: 2026-11-22
kind: repo
---

## Summary
Firejail is a setuid-root sandbox for desktop applications that combines namespaces, seccomp-bpf and
capability dropping with a large library of per-application profiles. It optimises for coverage and
convenience, the opposite trade-off from bubblewrap's minimalism.

## Key points
- SUID program; uses kernel namespaces, seccomp-bpf, Linux capabilities.
- "over 900" default application profiles in the current version.
- Setuid attack surface is its main criticism; e.g. CVE-2021-26910 (left unpatched for months in Ubuntu 20.04's package, per README).

## Excerpts
> "Firejail is a lightweight security tool intended to protect a Linux system"

> "There are over 900 default applications in the current Firejail version."

## Relevance to the talk
Illustrates the policy-library approach and the risk of a privileged sandbox helper — a sandbox that is
itself setuid root becomes a local-root target.
