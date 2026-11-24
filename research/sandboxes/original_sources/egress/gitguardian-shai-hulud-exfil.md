---
title: "Shai-Hulud: A Persistent Secret Leaking Campaign"
url: https://blog.gitguardian.com/shai-hulud-a-persistent-secret-leaking-campaign/
authors: Gaetan Ferry (GitGuardian)
date: 2025-09-16 (updated 2025-09-23)
accessed: 2026-11-22
kind: blog
---

## Summary
Analysis of the first Shai-Hulud npm worm (Sept 2025, starting from `@ctrl/tinycolor` and about 150
packages). Its exfiltration used the hosts a developer machine or CI runner *must* be able to
reach. It created a **public GitHub repository named `Shai-Hulud`** under the victim's account and
committed `data.json` (double-base64 secrets and system info) using the victim's own GitHub token.
It pushed **workflow files** on `shai-hulud` branches that sent repository secrets to a
**webhook.site** URL. It spread by republishing the victim's npm packages. For an egress
allowlist, all three channels are "allowed": github.com, a webhook service, and the npm registry.

## Key points
- Channel 1: `git push` / GitHub API to github.com with the victim's token, into a new public repo.
  The destination host is the one every coding agent allowlists.
- Channel 2: malicious GitHub Actions workflow using repo secrets, `curl` to webhook.site. It runs
  on GitHub's runners, outside any local sandbox.
- Channel 3 (propagation): "a worm" that spreads to other packages the victim can reach. Akamai's
  later analysis describes stealing npm publish tokens and republishing (not detailed in this post).
- GitGuardian counted 226 malicious workflow files, 44 `data.json` files, and 278 secrets leaked
  publicly (37 still valid at writing).
- Later waves: "Shai-Hulud 2.0" (Nov 2025) used random repo names (Kroll/GitGuardian/Check Point;
  Check Point counts about 25,000 compromised repos). "Mini Shai-Hulud" (2026) persisted via
  `.claude/settings.json` hooks ([incident](../incidents/2026-05-mini-shai-hulud-claude-code-persistence.md)).

## Excerpts
> "The main attack payload of this campaign is a worm." — post
> "Most leaked secrets have already been revoked, demonstrating the quick response to this attack." — post

## Relevance to the talk
Real-world evidence for the Managed Agents warning that an allowed `github.com` or npm host
permits "uploads such as `git push` and package publishing"
([note](../agent-sandboxing/anthropic-managed-agents-environments.md)). If an agent sandbox holds a
GitHub token with repo-create scope and allows github.com, a public repo is a ready-made dead drop.
Defences: a git proxy that limits operations and target repos
([claude-code-cloud-environments-network.md](claude-code-cloud-environments-network.md)), a
fine-grained token without create or publish scopes, and no registry publish tokens in the sandbox.
