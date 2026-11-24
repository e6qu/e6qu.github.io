---
title: "Sandbox Agents" (Agents SDK guide), "Shell" tool guide (hosted shell containers), "From model to agent: equipping the Responses API with a computer environment", and "The next evolution of the Agents SDK"
url: https://developers.openai.com/api/docs/guides/agents/sandboxes
authors: OpenAI (engineering post by Bo Xu, Danny Zhang, Rohit Arunachalam)
date: Agents SDK post 2026-04-15; Responses API computer-environment post 2026-03-11; guides are living documents read 2026-11-22. Other URLs: https://developers.openai.com/api/docs/guides/tools-shell, https://openai.com/index/equip-responses-api-computer-environment, https://openai.com/index/the-next-evolution-of-the-agents-sdk/, pricing https://developers.openai.com/api/docs/pricing
accessed: 2026-11-22
kind: docs
---

## Summary
OpenAI offers two developer-side ways to give an agent a computer. The first is the **Responses API's hosted containers**, used by Code Interpreter and the newer hosted `shell` tool. These are OpenAI-managed Debian 12 containers with **no outbound network by default**. Egress is opened through a two-level domain allowlist: the org admin sets the outer list and each request can only narrow it. Credentials go in through `domain_secrets`, which a sidecar egress proxy injects, so the model sees only placeholders. The second is the open-source **Agents SDK "sandbox agents"** (April 2026). The SDK splits the *harness* (agent loop, approvals, credentials, run state), which runs in your trusted application, from the *compute*, which is a sandbox from a pluggable provider (Docker, E2B, Modal, Daytona, Vercel, Cloudflare, Blaxel, Runloop, Databricks, Unix-local). Snapshots let a run resume in a fresh container. This updates `../agent-sandboxing/openai-code-interpreter.md`, which found no network statement.

## Key points
- **Hosted container isolation:** Code Interpreter still says "A container is a fully sandboxed virtual machine". The shell guide says only "Hosted shell containers managed by OpenAI" running "Debian 12". The March 2026 post says "hosted container workspace". **No VMM or runtime is named.** No TTY and no `sudo`.
- **Per what:** a container per request (`container_auto`) or a long-lived container you create through the Containers API and pass by `container_reference`. Several commands can run concurrently in separate container sessions.
- **Lifetime:** expiry is set by `expires_after` (e.g. 20 minutes after `last_active_at`). Code Interpreter containers expire after 20 minutes idle and cannot be revived. "Container data is deleted when the container expires." Files live in `/mnt/data`. Skills (versioned `SKILL.md` bundles) are copied into the container at creation.
- **Egress:** "Hosted containers don't have outbound network access by default." To enable it, an admin configures an **org allowlist** in the dashboard, and the request sets `network_policy: {type: "allowlist", allowed_domains: [...]}`. The request can only narrow the org list ("Requests fail if `allowed_domains` includes domains outside your org allow list"). The March post says: "All outbound network requests flow through a centralized policy layer that enforces allowlists". It calls this a sidecar egress proxy. Third-party docs (OpenRouter) say the policy is fixed at container start (409 on change). *Not confirmed in OpenAI docs.* Forum reports describe allowlisted `github.com` clones failing and curl errors connecting to a proxy on port 8080. *Anecdotal.*
- **Credentials:** `domain_secrets` (domain, name, value). "The auth-translation sidecar applies raw secret values only for approved destinations". Raw values are not persisted on API servers and do not appear in model-visible context.
- **Limits:** `memory_limit` of `1g` (default), `4g`, `16g` or `64g`. No CPU, disk or timeout figures are published. Shell output is capped per command, keeping head and tail.
- **Pricing (containers, shared by hosted shell and Code Interpreter):** "1 GB $0.03, 4 GB $0.12, 16 GB $0.48, 64 GB $1.92 per 20-minute session per container". "Eligible container sessions will be billed by the minute, with a 5-minute minimum per session."
- **Regions:** not stated. The pages point to the ZDR/data-residency guide and warn that data sent over the network to third parties follows their retention rules.
- **Agents SDK sandbox agents:** a `SandboxAgent` plus a `Manifest` (workspace-relative files, repos, mounts, env, users/groups; paths "can't be absolute paths or escape the workspace with `..`"). Providers are chosen in `SandboxRunConfig`. There are three state surfaces: harness `RunState`, serialized session state, and a workspace **snapshot** "used to seed a fresh sandbox session". The SDK docs leave isolation and networking to each provider. The only network example is Docker `network_mode="none"`. Credential guidance: "Treat sandbox credentials as runtime configuration, not prompt content", "Prefer provider-native secret systems", and keep secrets out of snapshots.
- The April post's rationale: "Separating harness and compute helps keep credentials out of environments where model-generated code executes", and "Agent systems should be designed assuming prompt-injection and exfiltration attempts."

## Excerpts
> "Hosted containers don't have outbound network access by default." (Shell guide, Network)

> "Only allowlist domains you trust and that attackers cannot use to receive stolen data." (Shell guide)

> "The model and container only see placeholders, while raw secret values stay outside model-visible context." (Responses API computer-environment post, 2026-03-11)

> "Separating harness and compute helps keep credentials out of environments where model-generated code executes." (Agents SDK post, 2026-04-15)

## Relevance to the talk
OpenAI's API-level answer has the same two parts as everyone else's. Egress is deny-by-default with domain allowlists and has an admin ceiling the developer can only tighten, which is a nice detail. Credentials are injected at an egress sidecar. The SDK makes the harness/compute split explicit and treats sandboxes as interchangeable commodity backends: one agent definition, nine providers. That fits the talk's point that the isolation boundary is becoming a pluggable component. The SDK docs stay silent on isolation and defer it to the provider.
