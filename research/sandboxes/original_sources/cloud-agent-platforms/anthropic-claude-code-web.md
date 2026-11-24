---
title: "Use Claude Code in the cloud" and "Configure cloud environments" (Claude Code docs), plus "Self-hosted environments"
url: https://code.claude.com/docs/en/claude-code-on-the-web
authors: Anthropic
date: living documents; read 2026-11-22 (companion pages https://code.claude.com/docs/en/cloud-environments, https://code.claude.com/docs/en/self-hosted-environments, https://code.claude.com/docs/en/security)
accessed: 2026-11-22
kind: docs
---

## Summary
Claude Code "cloud sessions" (claude.ai/code, the mobile and desktop apps, `claude --cloud`, cloud scheduled tasks, Claude Tag in Slack) run each session in "an isolated, Anthropic-managed VM", or in a customer's self-hosted environment. A reusable *cloud environment* sets the network level (None / Limited / Full), environment variables, network secrets and a setup script. The design is the same proxy-centred recipe as Codex cloud: credentials never enter the VM; a GitHub proxy swaps a scoped credential for the real token; an "agent proxy" injects per-host API keys after requests leave the VM. The docs are unusually explicit about which traffic bypasses the allowlist. The git credential proxy itself is already described in `../agent-sandboxing/anthropic-beyond-permission-prompts.md`; this note adds the current specifics.

## Key points
- **Isolation unit:** one VM per session ("Claude Code could not allocate a VM for the session"). The docs never name the VMM or kernel. A third-party probe (cw00h.github.io, 2025-10-21) found gVisor (`runsc` in `dmesg`) inside a Google Compute Engine VM, with a `/process_api` PID 1. **Unverified by Anthropic for this product**; Anthropic's own containment post (see `anthropic-how-we-contain-claude.md`) names gVisor only for claude.ai code execution.
- **Resources:** "approximate resource ceilings that may change": 4 vCPUs, 16 GB RAM, 30 GB disk. Ubuntu 24.04; setup script runs as root. Preinstalled: Python, Node 20/21/22, Ruby, PHP, Java 21, Go, Rust, GCC/Clang, **Docker (dockerd)**, PostgreSQL 16, Redis 7, Chrome for Testing.
- **Lifetime/persistence:** idle VM "pauses with its files saved" after a few minutes; next message restores the same VM. A paused VM can be "reclaimed"; reopening provisions a fresh VM and restores only the conversation, not running shells, subagents or `/loop` tasks. No separate charge for the VM; it counts against plan usage limits.
- **Environment caching (snapshots):** if the setup script finishes within ~5 minutes, "Anthropic snapshots the filesystem and reuses that snapshot" for later sessions. Snapshot keeps disk, not processes. Rebuilt when the script or allowed hosts change, or after ~7 days.
- **Network levels:** **None**, **Limited** (default; ~200-domain default allowlist across 17 categories: Anthropic, GitHub, container registries, cloud SDKs, every major package ecosystem, Linux distros, MCP), **Full**. Custom domains with `*.` wildcards. Changes reach running sessions within about a minute. No org-wide allowlist push; admins share an org environment instead. Legacy "Trusted"/"Custom" levels map to Limited.
- **Bypass paths (documented):** whatever the level, sessions still reach (1) GitHub via its separate proxy, (2) MCP connectors (traffic goes via Anthropic's servers), (3) hosts that have network secrets, (4) the Anthropic API "even at None", which "may allow data to exit the VM".
- **Security proxy:** all outbound HTTP(S) from the VM goes through an Anthropic proxy "for security and abuse prevention" (rate limiting, malicious-request protection).
- **GitHub proxy (new detail):** git in the VM holds a short-lived session-scoped credential; the proxy swaps in the real token. It rejects branch deletions and non-branch pushes (tags) but "doesn't limit which branches a push can update" (use branch protection). API calls are scoped to repositories attached to the session (403 otherwise, even for public repo archives). GraphQL is blocked outright, so `gh pr`/`gh issue` fail and Projects v2 is unreachable.
- **Network secrets:** API keys stored on the environment; "Anthropic's agent proxy adds the key to requests for the hosts you list, after each request leaves the session's VM". Never sent to GitHub, api.anthropic.com or public registries; not available during the setup script (the agent proxy starts after it). Plain environment variables, by contrast, are readable by anyone using the environment.
- **Local bundle upload:** `claude --cloud` without a GitHub remote uploads a git bundle (<100 MB); on macOS/Linux it leaves out uncommitted `.env`, `*.tfvars`, `id_rsa`, `*.pem`; native Windows uploads them as-is.
- **Self-hosted environments (public beta, Team/Enterprise):** customer-run "runners" (like self-hosted CI runners) poll Anthropic's queue, clone the repo and spawn a child Claude Code process per session. A runner locks to one *owner* (user or Claude Tag agent) so checked-out code never mixes between owners; recommended deployment restarts the runner with a fresh disk after each owner. All connections are outbound; "isolation is your deployment's responsibility". Session content still goes to `api.anthropic.com`.
- **Excluded:** ZDR, HIPAA and CMEK organisations cannot use cloud sessions.

## Excerpts
> "In Anthropic-hosted environments, your GitHub credentials stay encrypted on Anthropic's servers and never enter a session's VM." (Use Claude Code in the cloud)

> "When running with network access disabled, Claude Code can still communicate with the Anthropic API, which may allow data to exit the VM." (Security and isolation)

> "The cache is a filesystem snapshot, so it keeps what the setup script writes to disk and loses anything that was only running." (Environment caching)

> "It doesn't limit which branches a push can update." (GitHub proxy)

## Relevance to the talk
A complete example of the 2026 hosted-agent template: VM per session, pause/restore when idle, setup-phase snapshot, deny-by-default-ish egress with a big default allowlist, and credentials only at the proxy. Its best slide is the honest list of four channels that bypass the allowlist (GitHub, connectors, secret hosts, the model API itself): the egress policy is only as tight as its least-filtered side channel. The runner "owner lock" is a neat isolation idea for self-hosted fleets.
