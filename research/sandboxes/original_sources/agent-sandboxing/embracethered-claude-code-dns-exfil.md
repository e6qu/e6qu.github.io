---
title: "Claude Code: Data Exfiltration with DNS (CVE-2025-55284)"
url: https://embracethered.com/blog/posts/2025/claude-code-exfiltration-via-dns-requests/
authors: wunderwuzzi (Embrace The Red; the pseudonym of Johann Rehberger — name not printed on the page)
date: 2025-08-11 (disclosed to Anthropic 2025-05-26; fixed 2025-06-06 in Claude Code v1.0.4)
accessed: 2026-11-22
kind: blog
---

## Summary
An indirect prompt injection in a file Claude Code was asked to analyse made it read a `.env` file and leak the secret by embedding it in a hostname passed to `ping`, so the data left via a DNS lookup to an attacker-controlled nameserver. It worked without any approval prompt because `ping`, `nslookup`, `host` and `dig` were on Claude Code's auto-approved command allowlist — "read-only" commands that are nonetheless network channels.

## Key points
- Exfil channel: DNS resolution of `<secret>.attacker-domain` via an auto-allowed command.
- Claude initially refused direct requests for `.env`, but obfuscation with `strings`/`grep` bypassed that; it refused known security-testing domains but accepted an ordinary one.
- CVE-2025-55284, CVSS 7.1; disclosed 2025-05-26, fixed 2025-06-06 (v1.0.4+). Recommendation: remove `ping`, `nslookup`, `dig`, `host` from the allowlist.

## Excerpts
> "All without the developer's consent or approval."

> "Classic Data Exfiltration!"

## Relevance to the talk
Shows why command allowlists (a HITL shortcut) are not a sandbox: a "harmless" command is a network primitive. It also motivates the DNS details in later designs — Codex resolving DNS only *after* a request is approved, srt refusing names that resolve to local addresses, and the general point that egress control must cover DNS, not just TCP.
