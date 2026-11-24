---
title: Claude Managed Agents: "Choosing an agent environment", "Cloud sandbox reference", "Authenticate with vaults", "Self-hosted sandboxes", "Security model", "Secure your Managed Agents deployment", and Pricing
url: https://platform.claude.com/docs/en/managed-agents/choosing-an-environment
authors: Anthropic (AWS for the Lambda MicroVMs guide)
date: living documents, beta header `managed-agents-2026-04-01`; read 2026-11-22. Other pages: https://platform.claude.com/docs/en/managed-agents/cloud-sandboxes-reference, /vaults, /self-hosted-sandboxes, /self-hosted-sandboxes-security, /secure-deployment, /session-operations, https://platform.claude.com/docs/en/about-claude/pricing, https://docs.aws.amazon.com/lambda/latest/dg/microvms-integrations-claude-managed-agents.html
accessed: 2026-11-22
kind: docs
---

## Summary
Claude Managed Agents (CMA) splits the agent into an Anthropic-run loop and a *sandbox* that executes bash and file tools. The sandbox is either an Anthropic "cloud environment", described as "a fresh Linux container" per session, or a customer "self-hosted sandbox" served by a worker that polls a work queue. This note adds what `../agent-sandboxing/anthropic-managed-agents-environments.md` (networking modes, `allowed_hosts`) lacks: limits, lifetime, the vault credential model with egress-side substitution, the shared-responsibility split, pricing, and the list of third-party sandbox providers.

## Key points
- **Isolation unit:** "isolated Linux containers on Anthropic-managed infrastructure"; one fresh container per session. The mechanism (gVisor, microVM) is **not stated** for CMA. Anthropic's engineering post names gVisor only for claude.ai code execution (see `anthropic-how-we-contain-claude.md`).
- **Limits:** Ubuntu 24.04, x86_64, memory "up to 8 GB", disk "up to 10 GB". Preinstalled Python 3.10–3.13, Node 20–22, Go, Rust, Java 21, Ruby, PHP, GCC/Clang, PostgreSQL 16, Redis 7, Playwright + Chromium, LibreOffice, TeX Live; `docker` has "limited availability".
- **Network default:** API-created environments default to `unrestricted`; environments made in Claude Studio default to `limited`. The secure-deployment guide recommends `limited` with only the needed hosts.
- **Lifetime:** session statuses `idle`, `running`, `rescheduling`, `terminated`. A finished session goes `idle`, not `terminated`. The sandbox is deleted with the session ("deletes the session's record, events, and associated sandbox"). No idle timeout, checkpoint or maximum duration is documented for the cloud sandbox (*not found*). Transcripts persist until deleted; not ZDR- or HIPAA-eligible (except self-hosted CMA).
- **Pricing unit:** tokens plus **$0.08 per session-hour**, metered to the millisecond only while `running`; idle time is free. This replaces code-execution container-hour billing.
- **Credentials (vaults):** workspace-scoped vaults of up to 20 credentials, referenced per session with `vault_ids`. Two kinds:
  - MCP credentials (`mcp_oauth` with Anthropic-managed refresh, `static_bearer`), injected when the agent connects to that MCP server URL.
  - `environment_variable` credentials, "stored in the sandbox as an opaque placeholder"; "the opaque placeholder is substituted with the real secret at egress". Each credential has its own `allowed_hosts` and an `injection_location` (`header` and/or `body`). Header-only is recommended because "request payloads are often assembled from content the agent is working with".
  - The docs list the limits of placeholder substitution: SigV4-style signing breaks, format-validating clients reject the placeholder, and tokens obtained by exchange (OAuth client credentials) come back into the sandbox in clear. Services that echo headers leak the secret.
- **Permission policies:** the agent toolset default is `always_allow`. The guide recommends `auto` (server-side evaluation, "not a human checkpoint") on bash/write/edit and `always_ask` for irreversible or money-moving tools. MCP toolsets default to `always_ask`.
- **Self-hosted sandboxes:** the `self_hosted` environment is a work queue, and a worker authenticated by an environment key claims sessions and runs tools locally. Anthropic still runs `web_search`/`web_fetch` and connects to MCP servers. The customer owns image hardening, egress (VPC/firewall), key storage and rotation, and isolation *between* sessions. Anthropic advises one environment per trust boundary because the key reaches every session in it. Each work item carries a per-session `secret`. Read-only memory stores are protected from upload, not from local `bash` edits.
- **Pluggable sandbox market:** the docs list provider guides for AWS Lambda MicroVMs, Blaxel, Cloudflare, Daytona, E2B, Fly.io Sprites, GKE Agent Sandbox, Modal, Namespace, Superserve and Vercel, plus a Kubernetes Helm chart for one sandbox per session.
- **AWS Lambda MicroVMs guide:** a webhook (`session.status_run_started`) triggers a launcher Lambda that calls `RunMicroVM`, one microVM per session. "Each MicroVM is a Firecracker-isolated virtual machine with snapshot-based sub-second startup, runs for up to 8 hours". The environment key is fetched from Secrets Manager at runtime. MicroVMs have **public internet by default**; restrict with a VPC egress connector.
- **Regions:** model inference geography can be pinned per agent or session (`inference_geo: "us"`, a 1.1× token multiplier). CMA is also offered via Claude Platform on AWS and Claude Models on Google Cloud (Anthropic managed). Where the cloud sandboxes physically run is not documented.

## Excerpts
> "Each session gets its own fresh Linux container on Anthropic-managed infrastructure" (Choosing an agent environment)

> "The substitution occurs at egress, not inside the sandbox." (Authenticate with vaults)

> "Anthropic's security boundary stops at the sandbox. How you isolate individual tool executions from each other inside that boundary is entirely your responsibility." (Security model)

> "Runtime is measured to the millisecond and accrues only while the session's status is `running`." (Pricing)

## Relevance to the talk
CMA shows the hosted-agent stack separating into layers: Anthropic sells the loop, a credential vault and an egress substitution proxy, and the sandbox becomes a slot that eleven vendors (Firecracker, gVisor, containers) compete to fill. The vault page is the most detailed vendor description of placeholder-secret injection, including its documented failure modes (signing, echo, token exchange). The defaults are permissive (`unrestricted` networking, `always_allow` tools), so the security posture is opt-in.
