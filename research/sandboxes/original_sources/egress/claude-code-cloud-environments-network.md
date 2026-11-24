---
title: "Configure cloud environments (Claude Code) — Network access, GitHub proxy, network secrets"
url: https://code.claude.com/docs/en/cloud-environments
authors: Anthropic
date: living documentation, read 2026-11-22 (also https://code.claude.com/docs/en/claude-code-on-the-web, Security and isolation)
accessed: 2026-11-22
kind: docs
---

## Summary
Anthropic's docs for the VMs that run Claude Code cloud sessions. They show three egress
mechanisms working together, and they are frank about the paths that skip the allowlist. A
"security proxy" applies a per-environment domain allowlist (None / Limited / Full). A separate
**GitHub proxy** keeps the real GitHub credential outside the VM and limits *operations*. **Network
secrets** are attached by an "agent proxy" after a request leaves the VM. The default Limited
allowlist includes broad wildcard domains, including several where anyone can host content.

## Key points
- Access levels: **None**, **Limited** (default allowlist of registries, GitHub, cloud SDKs while
  "Allow package managers" is checked, plus your domains), **Full**.
- Paths that skip the allowlist at every level: GitHub (via its proxy), MCP connectors (via
  Anthropic's servers), hosts listed on network secrets, and "The Anthropic API, for Claude Code's
  own requests, even at **None**". The security page adds that with network disabled, the API
  connection "may allow data to exit the VM" (the Claude Pirate channel:
  [incident](../incidents/2025-10-claude-pirate-files-api-exfil.md)).
- The default allowlist (about 200 entries) includes `*.amazonaws.com`, `*.googleapis.com` /
  `storage.googleapis.com`, `*.r2.cloudflarestorage.com`, `gist.github.com`,
  `raw.githubusercontent.com` and `camo.githubusercontent.com`. Anyone can create content at these
  (an S3/GCS/R2 bucket, a gist), so each can be an upload target.
- **GitHub proxy:** the git client in the VM uses a scoped credential that the proxy checks and
  swaps for the real token. `GH_TOKEN`/`GITHUB_TOKEN` read as the placeholder `proxy-injected`.
  The proxy rejects branch deletions and pushes of anything other than a branch (for example
  tags), serves API requests only for repositories attached to the session (other repos get 403),
  and rejects GraphQL outright. It "doesn't limit which branches a push can update"; for that, use
  GitHub branch protection.
- **Network secrets:** bearer/token/user-password secrets bound to hosts. "Anthropic's agent proxy
  adds the key to requests for the hosts you list, after each request leaves the session's VM."
  Never attached to GitHub, `api.anthropic.com`, public registries (npm, PyPI, crates, Go proxy,
  JSR), setup-script requests, or telemetry. Hosts listed on a secret become reachable even if the
  access level wouldn't otherwise allow them.
- The security proxy is described only as "protection against malicious requests" and rate
  limiting. Some package managers (Bun) don't work through it.
- There is no organisation-level allowlist. Each environment has its own list; shared
  environments are the workaround.

## Excerpts
> "When running with network access disabled, Claude Code can still communicate with the Anthropic API, which may allow data to exit the VM." — claude-code-on-the-web, Security and isolation
> "It doesn't limit which branches a push can update." — GitHub proxy
> "Anthropic's agent proxy adds the key to requests for the hosts you list, after each request leaves the session's VM, so the key itself stays outside the VM." — Add network secrets

## Relevance to the talk
A real product spec that shows both halves of the argument. The GitHub proxy is operation binding
done right: scoped credential, attached repos only, no tag pushes, no GraphQL. Meanwhile the
default domain list allows `*.amazonaws.com` and gists, and the model API stays open even at
"None". Pair it with [anthropic-managed-agents-environments.md](../agent-sandboxing/anthropic-managed-agents-environments.md)
("granted by host, not by operation") and the git-proxy origin story in
[anthropic-beyond-permission-prompts.md](../agent-sandboxing/anthropic-beyond-permission-prompts.md).
