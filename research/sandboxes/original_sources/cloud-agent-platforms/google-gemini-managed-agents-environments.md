---
title: "Environments in managed agents" (Gemini API docs) and "Managed Agents API on Agent Platform sandbox environment" (Gemini Enterprise Agent Platform docs)
url: https://aistudio.google.com/docs/agent-environment
authors: Google (Gemini API / AI Studio; Google Cloud); launch post "Introducing Managed Agents in the Gemini API" by Ali Çevik and Philipp Schmid (blog.google, 2026-05-19)
date: Managed Agents preview 2026-05-19; hooks/budgets update 2026-07-28; docs read 2026-11-22 (formerly ai.google.dev/gemini-api/docs/agent-environment; examples use agent `antigravity-preview-09-2026`). Enterprise page: https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/managed-agents/sandbox-environment
accessed: 2026-11-22
kind: docs
---

## Summary
Google's answer to Claude Managed Agents: the Gemini API runs the Antigravity agent harness (or a custom agent defined with AGENTS.md/skills) in a Google-hosted Linux sandbox called an *environment*. Environments are decoupled from conversations, auto-snapshot when idle and persist for 7 days. The notable design is the egress proxy: allowlist rules per domain can carry a stored credential or header transform, and the sandbox only ever sees a placeholder. **The two doc sets disagree on the network default**: the Gemini API page says unrestricted outbound by default; the Enterprise Agent Platform page says no external network by default.

## Key points
- **Isolation unit:** "Linux sandboxes" (Ubuntu, Python 3.12, Node 22); technology not named on either page. *(Unverified inference: Google says ACE powers "Gemini platform" and Antigravity — see `google-agent-compute-engine.md` — but no doc ties Managed Agents environments to ACE.)* A self-hosted environment can be connected instead.
- **Per what:** per environment ID; reusable across interactions ("decoupled from interaction context"); a search-result summary says multiple agents passing the same `env_id` share one sandbox.
- **Lifetime:** idle → "Auto-snapshot and stopped after 15 minutes of inactivity"; retained 7 days after last activity, resumable by ID; installed packages persist on reuse.
- **Filesystem/sources:** git repo (≤500 MB), Cloud Storage (≤2 GB, downscoped tokens), inline files (1 MB each/2 MB total), Skill Registry mounts.
- **Egress (Gemini API):** "By default, environments have unrestricted outbound network access." `network: "disabled"` blocks all; allowlist rules `{domain, credential?, transform?}`; `*.example.com` does not match the apex; `{"domain": "*"}` catch-all.
- **Egress (Agent Platform, Pre-GA):** "the sandbox operates without external network access"; enable via domain allowlist. No VPC/PSC option mentioned.
- **Credentials:** stored credentials referenced by ID — "In neither case does the secret land inside the sandbox"; credential-backed env vars get a placeholder and "the egress proxy substitutes the real secret only on outbound requests" to trusted domains; `oauth2` credentials self-refresh; literals "are readable by anything running in the sandbox, including the agent itself". Enterprise: "no ambient credentials"; MCP auth headers go only to configured MCP endpoints.
- **Controls:** environment hooks (July 2026) can block, lint or audit tool calls inside the sandbox; budget controls.
- **Limits/pricing:** "fair usage" storage limits only; billed on tokens and tool usage, environment compute not billed during preview (search summary of the July post).

## Excerpts
> "By default, environments have unrestricted outbound network access." (Gemini API docs, Network configuration)

> "the variable receives a placeholder, and the egress proxy substitutes the real secret only on outbound requests" (Gemini API docs, Environment variables)

> "The sandbox contains no ambient credentials and cannot access other repositories or files in your project." (Agent Platform docs)

## Relevance to the talk
Shows the managed-agent product shape is now standard across Anthropic, OpenAI and Google: hosted harness + persistent Linux workspace + proxy-side secret substitution. And it shows the same split as Anthropic (API default `unrestricted`, Console default limited): the developer API ships open egress while the enterprise surface ships closed.
