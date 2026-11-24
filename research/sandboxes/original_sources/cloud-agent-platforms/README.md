# Cloud agent platforms — how the clouds isolate agents (2026-11-22)

How Anthropic, OpenAI, AWS, Google, Microsoft/GitHub and the sandbox start-ups
isolate agents and the code they run. Platforms already covered in
[../agent-sandboxing/](../agent-sandboxing/README.md) (E2B, Modal, Vercel, Cloudflare,
Daytona, Fly Sprites, Devin, Jules) are cited, not repeated. Chinese clouds are in
[../china/](../china/README.md); egress mechanisms in [../egress/](../egress/README.md).

## Index

- [anthropic-claude-code-web.md](anthropic-claude-code-web.md) — Use Claude Code in the cloud and Configure cloud environments (Claude Code docs), plus Self-hosted environment
- [anthropic-code-execution-update.md](anthropic-code-execution-update.md) — Pricing, code execution tool section (Claude API documentation)
- [anthropic-cowork.md](anthropic-cowork.md) — Network access for shell commands (Cowork docs), What to expect with Claude Cowork in the cloud (support), Set
- [anthropic-how-we-contain-claude.md](anthropic-how-we-contain-claude.md) — How we contain Claude across products
- [anthropic-managed-agents.md](anthropic-managed-agents.md) — Claude Managed Agents: Choosing an agent environment, Cloud sandbox reference, Authenticate with vaults, Self-
- [aws-agentcore-browser.md](aws-agentcore-browser.md) — Interact with web applications using Amazon Bedrock AgentCore Browser, plus Using browser proxies, Using brows
- [aws-agentcore-code-interpreter.md](aws-agentcore-code-interpreter.md) — Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter, Resource management, Understand
- [aws-agentcore-gateway-identity-policy.md](aws-agentcore-gateway-identity-policy.md) — Amazon Bedrock AgentCore Gateway, AgentCore Identity (overview and features) and Policy in Amazon Bedrock Agen
- [aws-agentcore-runtime.md](aws-agentcore-runtime.md) — Use isolated sessions for agents, How it works, Security best practices for AgentCore Runtime, Security model 
- [aws-kiro-web.md](aws-kiro-web.md) — Sandbox and Internet access (Kiro web / autonomous agent docs) and Cloud sessions (Kiro docs)
- [aws-lambda-microvms.md](aws-lambda-microvms.md) — AWS Lambda MicroVMs (Lambda Developer Guide: overview, core concepts, networking, security) and product page
- [blaxel-sandboxes.md](blaxel-sandboxes.md) — Sandboxes (Blaxel product page), with Anatomy of an agent runtime (Blaxel engineering blog)
- [daytona-isolation-and-advisories.md](daytona-isolation-and-advisories.md) — Daytona Isolation, Billing and Limits docs plus advisories: default sandbox is a Sysbox container (VM class separate), API key in sandbox memory (2026-04), Copy Fail co-tenant exposure, six June 2026 GHSAs
- [e2b-network-access-and-limits.md](e2b-network-access-and-limits.md) — E2B docs: internet access (SNI/Host domain rules, 8.8.8.8 opened, allow beats deny), private URLs by default from 2026-10-30, fail-open secret injection, plan limits and per-second pricing
- [flyio-sprites-docs.md](flyio-sprites-docs.md) — Fly.io Sprites docs: DNS-allowlist egress, filesystem-only checkpoints, warm/cold lifecycle, Connectors that hold credentials, pricing
- [freestyle-vms.md](freestyle-vms.md) — VMs and Firewall (Freestyle docs), with the Freestyle VMs product page
- [github-copilot-cloud-agent-environment.md](github-copilot-cloud-agent-environment.md) — About cloud sandboxes for GitHub Copilot, Risks and mitigations for GitHub Copilot cloud agent, About customiz
- [google-adk-code-executors.md](google-adk-code-executors.md) — GKE Code Executor (ADK docs) and `google/adk-python` `src/google/adk/code_executors/` (source)
- [google-agent-compute-engine.md](google-agent-compute-engine.md) — Introducing Agent Compute Engine and expanding agent governance and Inside Agent Compute Engine: Building the 
- [google-agent-engine-code-execution.md](google-agent-engine-code-execution.md) — Sandboxes overview and Code Execution (Gemini Enterprise Agent Platform; formerly Vertex AI Agent Engine Code 
- [google-cloud-run-sandboxing.md](google-cloud-run-sandboxing.md) — Security design overview (Cloud Run), Code execution in Cloud Run (docs) and Google Cloud Run sandboxes are in
- [google-gemini-code-execution.md](google-gemini-code-execution.md) — Code execution (Gemini API documentation)
- [google-gemini-managed-agents-environments.md](google-gemini-managed-agents-environments.md) — Environments in managed agents (Gemini API docs) and Managed Agents API on Agent Platform sandbox environment 
- [google-gke-agent-sandbox.md](google-gke-agent-sandbox.md) — About Agent Sandbox on GKE (GKE docs), kubernetes-sigs/agent-sandbox (repo), Bringing you Agent Sandbox on GKE
- [google-vertex-agent-engine.md](google-vertex-agent-engine.md) — Agent Runtime overview, Use Agent Identity with Agent Runtime and Using Private Service Connect interface with
- [microsoft-aca-dynamic-sessions.md](microsoft-aca-dynamic-sessions.md) — Dynamic sessions in Azure Container Apps, Use dynamic sessions in Azure Container Apps, Use session pools in A
- [microsoft-aca-sandboxes.md](microsoft-aca-sandboxes.md) — Azure Container Apps Sandboxes overview (Microsoft Learn) and Control egress (ACA Sandboxes docs)
- [microsoft-foundry-agent-service.md](microsoft-foundry-agent-service.md) — Hosted agents in Foundry Agent Service, Use Code Interpreter with Microsoft Foundry agents, Deep dive into Fou
- [microsoft-windows-365-for-agents.md](microsoft-windows-365-for-agents.md) — Security overview of Windows 365 for Agents, Identity and security in Windows 365 for Agents, Set up billing f
- [morph-cloud-infinibranch.md](morph-cloud-infinibranch.md) — Introducing Infinibranch (Morph blog) and Morph Cloud developer docs (Devboxes, branching)
- [northflank-sandboxes.md](northflank-sandboxes.md) — Secure microVM sandboxes for untrusted code (Northflank Sandboxes product page), with How to sandbox AI agents
- [openai-agents-api-hosted-sandboxes.md](openai-agents-api-hosted-sandboxes.md) — Introducing the Agents API and Agents API guides: OpenAI-hosted sandboxes, Sandbox security, Vaults, Computer 
- [openai-agents-sdk-sandboxes.md](openai-agents-sdk-sandboxes.md) — Sandbox Agents (Agents SDK guide), Shell tool guide (hosted shell containers), From model to agent: equipping 
- [openai-chatgpt-agent.md](openai-chatgpt-agent.md) — ChatGPT Agent System Card (2025-07-17), ChatGPT agent help article, and ChatGPT Work cloud security (successor
- [openai-codex-cloud-environments.md](openai-codex-cloud-environments.md) — Cloud environments (Codex, current) and Cloud environment (Codex Cloud (Legacy)); plus Codex cloud branch-name
- [openai-operator-cua.md](openai-operator-cua.md) — Introducing Operator, Operator System Card, and Computer use / Computer use integration recipes (OpenAI API do
- [replit-sandbox-engine.md](replit-sandbox-engine.md) — Inside Replit's New Sandbox Engine, Part 1 (microVMs)
- [runloop-devboxes.md](runloop-devboxes.md) — Devbox Overview and Lifecycle (Runloop docs), with Safer Agents with Network Policies (Runloop blog) and Agent
- [together-code-sandbox.md](together-code-sandbox.md) — Together Code Sandbox (Together AI blog) and Together code sandbox (Together docs)
- [vercel-sandbox-challenge-findings.md](vercel-sandbox-challenge-findings.md) — Findings from the $1M Vercel Sandbox challenge (2026-10-14): host-kernel zero-day from a guest, cross-tenant disk-block leak, guest-trusted snapshot metadata, Trail of Bits review; plus pricing and quotas

## Comparison

"Not named" means the vendor does not name its VMM; inferences are marked.

| Platform | Product | Isolation unit (VMM) | Per | Egress default | Credentials | Note |
|---|---|---|---|---|---|---|
| Anthropic | Claude Code on the web | VM (not named; gVisor on GCE per a 2025 third-party probe) | session | **limited** (~200-domain allowlist); None/Limited/Full | GitHub proxy with a scoped token | [→](anthropic-claude-code-web.md) |
| Anthropic | Managed Agents | container (not stated) or one of 11 third-party sandboxes | session | API **unrestricted**, Console limited; `allowed_hosts` | vault placeholders swapped per host at egress | [→](anthropic-managed-agents.md) |
| Anthropic | Cowork (desktop) | full VM (Virtualization.framework / HCS) | task | org setting | keychain stays on host | [→](anthropic-cowork.md) |
| Anthropic | code execution (claude.ai / API) | **gVisor** + seccomp | container | **none** | — | [→](anthropic-how-we-contain-claude.md) |
| OpenAI | Codex cloud | VM (not named) | task | setup online, agent phase **off** | placeholders swapped at proxy | [→](openai-codex-cloud-environments.md) |
| OpenAI | Responses hosted shell / Code Interpreter | sandboxed VM (not named) | container | **off**; org allowlist | `domain_secrets` via sidecar proxy | [→](openai-agents-sdk-sandboxes.md) |
| OpenAI | Agents API hosted sandbox (beta) | not named | session | **on**; or 1–100 hostnames | vault placeholders in headers | [→](openai-agents-api-hosted-sandboxes.md) |
| OpenAI | ChatGPT agent / Work | VM-backed | user | GET-only at launch; admin settings | user takeover for logins | [→](openai-chatgpt-agent.md) |
| AWS | AgentCore Runtime | microVM (Firecracker inferred) | session (client picks ID) | `PUBLIC` (open) or `VPC`; no allowlist | execution role readable via metadata service | [→](aws-agentcore-runtime.md) |
| AWS | AgentCore Code Interpreter | "containerized" | session | `SANDBOX` still resolved DNS (C2 channel) | role credentials readable | [→](aws-agentcore-code-interpreter.md) |
| AWS | AgentCore Gateway / Identity / Policy | a checkpoint, not a sandbox | — | only if every call goes through it | token vault, per-tool injection | [→](aws-agentcore-gateway-identity-policy.md) |
| AWS | Lambda MicroVMs | **Firecracker** | tenant/session/job | **open**; VPC | IAM roles | [→](aws-lambda-microvms.md) |
| Google | Agent Platform sandboxes / Code Execution | **gVisor** | task/session | none, or full internet/VPC | no ambient credentials | [→](google-agent-engine-code-execution.md) |
| Google | GKE Agent Sandbox / Substrate | gVisor, Kata or **Cloud Hypervisor** | sandbox | default-deny NetworkPolicy; egress proxy | proxy injection | [→](google-gke-agent-sandbox.md) |
| Google | Cloud Run sandboxes (preview) | gVisor nested in the instance | command | **blocked**; all-or-nothing | none | [→](google-cloud-run-sandboxing.md) |
| Google | Agent Compute Engine (announced 2026-10-22) | single-tenant **Cloud Hypervisor** microVM | session | **no vNIC**: vsock to a mediation proxy | SPIFFE identity; token swapped at gateway | [→](google-agent-compute-engine.md) |
| Google | Gemini Managed Agents envs | Linux sandbox (not named) | environment | API **open**, enterprise **closed** | placeholders swapped per domain | [→](google-gemini-managed-agents-environments.md) |
| Microsoft | Foundry hosted agents | micro VM (not named) | session | BYO VNet; no default-deny documented | Entra Agent ID | [→](microsoft-foundry-agent-service.md) |
| Microsoft | ACA dynamic sessions (Foundry Code Interpreter) | **Hyper-V** | app-chosen ID / conversation | **disabled** by default | any executor token opens any session | [→](microsoft-aca-dynamic-sessions.md) |
| Microsoft | ACA Sandboxes (GA 2026-09) | microVM (not named) | sandbox | **open** unless a policy is set; host/path/method rules | proxy-injected secrets | [→](microsoft-aca-sandboxes.md) |
| Microsoft | Windows 365 for Agents | Windows Cloud PC VM | task (pooled) | Global Secure Access filtering | device-bound tokens destroyed at release | [→](microsoft-windows-365-for-agents.md) |
| GitHub | Copilot cloud agent | Actions runner VM / cloud sandbox | session | firewall + allowlist | push to own branch only | [→](github-copilot-cloud-agent-environment.md) |
| Replit | Sandbox engine | **Cloud Hypervisor** microVM, runc inside | sandbox | host-side SNI + DNS filter | credential brokers | [→](replit-sandbox-engine.md) |
| Northflank | Sandboxes | Kata + **Cloud Hypervisor**; gVisor for GPU | sandbox | FQDN/IP policies | proxy injection | [→](northflank-sandboxes.md) |
| Blaxel / Together | Sandboxes | **Firecracker** | sandbox | domain/method/path rules (Blaxel) | proxy injection (Blaxel, preview) | [→](blaxel-sandboxes.md) |
| Runloop / Morph / Freestyle | Devboxes / Infinibranch / VMs | VM (not named) | instance | Runloop open + DNS allowlist; Freestyle deny | gateway swaps keys (Runloop) | [→](runloop-devboxes.md) |

## Synthesis

1. **One microVM per agent session is the hyperscaler consensus, each on its own
   VMM.** AWS uses Firecracker, Google uses Cloud Hypervisor or gVisor, Microsoft
   uses Hyper-V, and Replit and Northflank use Cloud Hypervisor. Google states the
   trade-off openly: pod snapshots "require gVisor and don't work with microVMs".
   Most vendors still do not name their VMM.
2. **The boundaries held; the new layers around them failed.** Anthropic: "The
   hypervisor, seccomp, and gVisor across our products have been dependable. Our
   custom allowlist proxy was the piece that failed" (Claude Pirate). Other cases:
   AgentCore's `SANDBOX` mode leaked over DNS, and Codex cloud's GitHub token
   leaked via a branch-name injection during setup.
3. **Egress defaults point opposite ways, even within one vendor**, and the
   developer API tends to ship open:
   - OpenAI Responses containers are off, Agents API sandboxes on;
   - Gemini Managed Agents' API is open, its enterprise surface closed;
   - Anthropic's Managed Agents API is unrestricted, its Console limited;
   - Azure dynamic sessions are off, ACA Sandboxes open.
4. **Credentials have converged on "placeholder inside, real secret swapped at
   the proxy".** Anthropic, OpenAI, Google, Azure, Northflank, Blaxel, Runloop,
   Replit, Vercel and Cloudflare all do it. Google's Agent Compute Engine goes
   furthest: the guest has no network interface, only vsock to a broker. OpenAI
   admits the limit: "Agent-generated code can read the environment key."
5. **A VM boundary is not an authorization boundary.**
   - ACA: "A valid token is used to create and access any session in the pool."
   - Foundry: Code Interpreter containers "aren't isolated per agent or per user".
   - AgentCore: the caller chooses session IDs, and its V2 restores every session
     from one shared snapshot.

## Caveats
Vendors rarely name the VMM. Firecracker for AgentCore is inferred from "MMDS" and
an AWS engineer's HN comment. Claude Code on the web on gVisor comes from a
third-party probe. Google Agent Compute Engine is an announced architecture, with
preview "in the coming months". Doc conflicts are flagged in each note.
