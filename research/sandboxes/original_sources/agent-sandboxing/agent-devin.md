---
title: "Security Profiles" (Devin docs)
url: https://docs.devin.ai/product-guides/security-profiles
authors: Cognition
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Devin (Cloud) runs each session on its own cloud machine, a Linux VM booted fresh from a per-organisation snapshot. Windows and macOS VMs are optional. The docs don't name the hypervisor or microVM technology. Inside the VM the agent acts autonomously with no per-command approvals, and the VM is the boundary. Network egress is **unrestricted by default**. Admins can attach "Security Profiles" whose hostname/CIDR allowlist is enforced at the machine level on Devin-managed VMs. The same profiles can make git read-only, strip the GitHub CLI token, and limit MCP servers. Secrets are injected into the VM as environment variables. (Devin's local agents, Devin CLI and Devin Local in Devin Desktop, are covered in agent-windsurf.md.)

## Key points
- Status: current, Cognition's flagship. As of 2026 it is part of a family with Devin CLI, Devin Desktop (ex-Windsurf) and Devin Outposts (self-hosted workers) (https://docs.devin.ai/llms.txt).
- Runs: cloud VM per session. "Devin's environment is ... a Linux-based virtual machine". "Every session boots from a snapshot ... Session changes don't persist back to the snapshot" (https://docs.devin.ai/onboard-devin/environment). In Enterprise Cloud (multi-tenant), "Each Devin session runs on its own isolated machine". Customer Dedicated Deployment puts the "Devbox" in a single-tenant VPC reached via AWS PrivateLink or IPSec (https://docs.devin.ai/enterprise/deployment/overview). Outposts run sessions on customer machines (https://docs.devin.ai/cloud/outposts/overview).
- Isolation: VM per session (Linux; Windows/macOS VMs optional). The virtualisation technology (Firecracker, KVM, etc.) is not documented. Users can SSH into a session's VM (`devin ssh`, https://docs.devin.ai/cli/ssh). There is no inner sandbox: the agent has the whole VM.
- Filesystem: the whole VM is the agent's workspace. Repos are cloned there, and tools and secrets are set up by "blueprints" that a build turns into the snapshot. Nothing on the user's laptop is reachable, except through "Local Hands" (see Approvals).
- Network: default open. No profile applies unless an admin binds one, and "No profile" sessions "run unrestricted". A Security Profile network policy is "an allowlist of destinations the session's machine is permitted to reach. All other outbound connections are blocked", with hostname wildcards and CIDRs. It applies to shell, browsing, package installs and scripts. When blocked, Devin asks for access, and an approved destination is added for that session. Destinations Devin needs, such as its git proxy, are allowed automatically. Enforcement is "at the machine level on Devin-managed VMs". On Outposts, Devin only publishes `spec.network_policy`, and the operator must enforce it. Snapshot builds can use a separate, looser build profile.
- Credentials: Secrets (org, personal, repo, session; key-value, cookies, TOTP) are "injected as environment variables during builds and sessions". Org-wide secrets are usable in every session in the org, and by default any Member can manage them (https://docs.devin.ai/product-guides/secrets). Git access goes through a git proxy. A `gh` token sits on the machine unless a profile removes it.
- Approvals: the docs describe no per-command approval setting for cloud sessions; the agent works autonomously in its VM. The human gates are chat steering, network-access requests under a profile, and PR review. "Local Hands" lets a cloud session run tools on the user's machine through Devin CLI. Those calls follow the local allow/ask/deny rules, and "credential files and destructive commands always ask" (https://docs.devin.ai/cli/reference/permissions). The config `local_tools_bypass_permissions` turns per-call prompts off.
- Enterprise controls: Security Profiles bind at enterprise / org / automations / automation / session level. **Mandatory** profiles are a floor: lower levels can only intersect (narrow allowlists, read-only git wins, token removed if either removes it), and mid-session grants are clamped. Child sessions inherit the chain. The "Manage security profiles" permission can go to custom roles. Also available: IP access lists, SSO/SCIM, and customer-managed keys.

## Excerpts
> "All other outbound connections are blocked." (Security Profiles, Network policy)

> "Devin enforces a session's network allowlist at the machine level on Devin-managed VMs, but an outpost worker runs on infrastructure you operate, so Devin does not install firewall rules on your machines." (Security Profiles, Outposts and profiles)

> "Each Devin session runs on its own isolated machine, keeping customer data segregated by default." (Enterprise Deployment)

> "Sessions spawned by other sessions (child sessions) are governed by the same chain as their parent, so restrictions can't be escaped by delegating work." (Security Profiles, What you can bind a profile to)

## Relevance to the talk
This is the archetype of "the VM is the sandbox; govern egress and credentials". Devin has no per-command approval at all, so all of the security lives in the machine boundary, the egress allowlist (off by default) and credential scoping: read-only git, stripping the `gh` token, MCP allowlists. Two details make good slides. The mandatory-profile intersection rule also covers sub-agents ("can't be escaped by delegating work"). And the self-hosted case is honest that the allowlist is only advisory unless the operator enforces it.
