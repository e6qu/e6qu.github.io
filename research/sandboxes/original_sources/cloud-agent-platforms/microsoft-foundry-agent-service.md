---
title: "Hosted agents in Foundry Agent Service", "Use Code Interpreter with Microsoft Foundry agents", "Deep dive into Foundry Agent Service networking", "Automate browser tasks with Foundry agents" (Microsoft Learn), plus the hosted-agents launch post
url: https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents
authors: Microsoft (Learn docs: aahill, mattwojo et al.; launch post by Takuto Higuchi, Jeff Hollan, Lakshmi Ramakrishnan)
date: hosted-agents page ms.date 2026-11-16 (updated 2026-11-22); code-interpreter page ms.date 2026-08-05 (updated 2026-11-17); networking deep dive ms.date 2026-11-09; browser automation ms.date 2026-10-29; launch post 2026-04-22 (https://devblogs.microsoft.com/foundry/introducing-the-new-hosted-agents-in-foundry-agent-service-secure-scalable-compute-built-for-agents)
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft Foundry Agent Service (formerly Azure AI Foundry Agent Service) has two execution surfaces relevant to sandboxing. **Hosted agents** run the customer's own agent container in a **per-session, VM-isolated sandbox** (the networking page calls it a "Micro VM") with a persistent `$HOME`, scale-to-zero after an idle timeout and a dedicated Entra agent identity per agent. The **Code Interpreter tool** runs model-written Python in Azure Container Apps dynamic sessions (see `microsoft-aca-dynamic-sessions.md`): one Hyper-V-isolated session per conversation, 1 h active / 30 min idle, no outbound network. With bring-your-own VNet, hosted-agent microVMs get NICs in a delegated customer subnet and tool calls go through a single-tenant "data proxy".

## Key points
- **Hosted agents — isolation unit:** "Hosted agents run in per-session VM-isolated sandboxes." The networking deep dive names the layer: "the Micro VM host layer that runs Hosted agents" and defines "Micro VM: The lightweight virtual machine that runs a Hosted agent." The VMM/hypervisor is **not named** (launch post: "Production-proven hypervisor isolation"). *Unverified which VMM (Hyper-V-based? Cloud Hypervisor?).*
- **Per-what:** one sandbox per session; "Hosted agents scale per session, not per replica. … There's no replica count to configure and no warm pool to size." The Responses protocol maps a conversation to a session; with Invocations the client manages session IDs. Agent Framework post (2026-09-22): pooled designs can share one sandbox filesystem across users ("the sandbox filesystem remains shared").
- **Lifetime / persistence:** idle timeout configurable 2–240 min, default 15 min; on idle the platform "deprovisions the compute and persists the session state" (`$HOME`, `/files`); session deleted after 30 days of inactivity. Optional memory-snapshot sessions restore a version's startup baseline instead. Agent versions are immutable snapshots of image + resources + env vars.
- **Limits:** sandbox sizes 0.25 vCPU/0.5 GiB up to 16 vCPU/32 GiB; persistent `$HOME` up to 6.4–100 GiB depending on tier and image size (image ≤ 40 GiB after conversion).
- **Network:** BYO VNet ("network injection") must be set at Foundry-account creation; delegated subnet (`Microsoft.App/environments`, /27 min, /24 recommended, RFC 1918 only). Hosted agent's own outbound traffic goes "Direct, through the delegated subnet"; tool-server calls go "Through the single-tenant data proxy". Planned capacity: /24 ≈ 60,000 concurrent sessions. The docs do not state a default-deny egress for hosted agents; restriction is left to the customer's NSGs/firewall. Session-compute preview APIs expose "read-only egress summaries". A Microsoft architecture blog (2026-09-04) stresses that a private endpoint secures only inbound: without injection an agent "can still be reaching out to a tool endpoint from a Microsoft owned public IP address".
- **Credentials:** each hosted agent gets "its own dedicated Microsoft Entra ID (agent identity)" created at deploy; user-invoked flows can use OAuth On-Behalf-Of. Docs: "Don't put secrets in container images or environment variables" — use managed identities, Key Vault connections, and a Toolbox MCP endpoint that centralises tool auth. Also warns not to load code/config from upload-writable `$HOME` paths.
- **Pricing:** billed on *allocated* CPU and memory per active session sandbox, including idle time until suspension; regions: ~31 listed.
- **Code Interpreter tool:** "uses dynamic sessions (code interpreter sessions) in Azure Container Apps. Each session is isolated by a Hyper-V boundary." One session per concurrent conversation; active up to 1 h, 30 min idle timeout; same region as the project; "The sandbox doesn't inherit your agent subnet configuration, and dynamic sessions can't make outbound network requests." Billed per session beyond tokens. **Not isolated per user:** "Within a project, Code Interpreter containers aren't isolated per agent or per user. A caller who … references an active container can access its files and state." Via a toolbox in a hosted agent, "user isolation isn't supported. All users in the same project share the same container context."
- **Browser automation tool (GA):** remote browser sessions on Azure Playwright Workspaces, Live View / take-control, optional private-VNet injection (preview). Credential caveat: "When Azure Key Vault credentials are provided to a prompt agent for browser authentication, the model currently has access to the secret value."
- Prompt agents run on Microsoft-managed Azure Container Apps compute, no per-session microVM.

## Excerpts
> "Hosted agents run in per-session VM-isolated sandboxes." — Hosted agents, Isolation model

> "Within a project, Code Interpreter containers aren't isolated per agent or per user." — Code Interpreter, Sandboxed execution environment

> "When Azure Key Vault credentials are provided to a prompt agent for browser authentication, the model currently has access to the secret value." — Browser automation, Limitations

> "Every single agent session its own VM-isolated sandbox with persistent session state." — launch post, 2026-04-22

## Relevance to the talk
Azure's hyperscaler answer matches AWS AgentCore: a microVM per agent session with scale-to-zero and persisted state, plus a per-agent cloud identity instead of injected secrets. Two honest caveats make good slides: the code-interpreter container is a per-conversation compute boundary but *not* an authorization boundary (anyone in the project holding the container ID can use it), and the browser tool currently hands a Key Vault secret to the model. Egress for hosted agents is network-engineering (VNet/NSG/firewall), not a built-in domain allowlist.
