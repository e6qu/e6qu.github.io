---
title: "Deep dive: cloud sandbox platforms for agents, and Chinese coding agents' sandboxes (as of 2026-11-22)"
url: https://docs.e2b.dev/network/internet-access
authors: compiled for this corpus from vendor docs, GitHub source, shipped npm bundles, vendor engineering posts and advisories (each linked inline)
date: 2026-11-22
accessed: 2026-11-22
kind: report
---

This is a synthesis across the corpus, not a single source. The frontmatter `url` points at E2B's
network docs because E2B's API is the interface most of the products below copy, in both parts. Every
claim links to a primary source or to the corpus note that holds the quote. Vendor claims are marked
where they could not be checked. *(inferred)* marks our reasoning, and *(second-hand)* marks press or
third-party reports. Most Chinese sources are in Chinese. Here they appear only as English translations
marked "(translated from Chinese)", with a link to the original page. The Western *local* agents per OS
(Claude Code, Codex, Cursor, Gemini, Copilot and others) are covered in
[deep-dive-sandboxes-by-os.md](deep-dive-sandboxes-by-os.md) and
[top-coding-agents-matrix.md](top-coding-agents-matrix.md), not here.

---

## Part A: Cloud sandbox platforms a platform team would build on

**How to read the table.**
- **Unit** is what the vendor says separates one sandbox from the next. "Not named" means the vendor
  does not name the VMM or runtime.
- **Egress** gives the default first, then the finest control documented. A control can match *by
  IP/CIDR*, *by host* (SNI, DNS or CONNECT host) or *by operation* (method and path, which needs TLS
  interception).
- **Authz** is what stops tenant A from reaching tenant B's sandbox. Where it is weak, the platform
  team has to build it.

All pages were read 2026-11-22 unless a date is given.

### A.1 Comparison table

| Platform | Unit | Lifecycle: start · pause · fork · max | Persistence | Egress: default → finest control | Credentials inside | Authz boundary | API · E2B-compatible? | Limits · pricing unit | Known bypass / incident |
|---|---|---|---|---|---|---|---|---|---|
| **AWS AgentCore Runtime** | microVM per session. VMM not named; Firecracker *(inferred)* from "MMDS" and Brooker on HN | V2 restores every session from one snapshot · storage survives stop · no fork · 8 h (Instances 14 d) | ≤1 GB session storage; EFS/S3 Files | `PUBLIC` (open) or `VPC` (SGs, NAT, DNS Firewall). No host allowlist | execution role via MMDS, readable by any code in the VM | client-chosen session ID (≥33 chars); user pinning only on V2 | own · no | 2 vCPU/8 GB default, peak 8/32 on V2. Per-second vCPU-h + GB-h (V2 $0.1276 + $0.0169); I/O wait free | localhost platform server gives a shell if the agent can reach it (AWS's own warning) |
| **AWS AgentCore Code Interpreter** | "containerized"; MMDS implies a VM *(inferred)* | 15 min default, 8 h max · no pause or fork | per session only | `SANDBOX` (S3 **and DNS**), `PUBLIC`, `VPC` | role via MMDS behind a string filter | session; 1,000 concurrent per account | own · no | 2 vCPU/8 GB fixed. $0.0895/vCPU-h, $0.00945/GB-h | **DNS C2 out of `SANDBOX` mode** (Unit 42, BeyondTrust); **MMDS credential theft** (Sonrai) |
| **AWS AgentCore Browser** | "containerized" Chromium; MMDS implies a VM *(inferred)* | 15 min · 8 h | profiles (cookies + localStorage ≤50 MB) | `PUBLIC`/`VPC`. Browser proxies are "not a network-level control" | Secrets Manager for proxy auth; optional Web Bot Auth | session | CDP/Playwright · no | 1 vCPU/4 GB; same meters | — |
| **AWS AgentCore Gateway + Identity + Policy** | not a sandbox: an MCP/A2A checkpoint | — | — | covers only what goes through it | token vault, per-tool injection | Cedar, default-deny, forbid-wins | MCP · — | $0.000025 per authorization | "If a caller can reach the runtime directly, it bypasses the gateway" (AWS) |
| **AWS Lambda MicroVMs** (2026-06) | **Firecracker**, snapshot per image | snapshot restore · auto-suspend/resume · — · 8 h | memory + disk kept while suspended | **open**; VPC connector | IAM role | per tenant/session/job; JWE token per port | Lambda API · no | not read | — |
| **Google Agent Platform sandboxes** (ex-Vertex AI Agent Engine Code Execution) | **gVisor** container | <1 s warm, ≤2 min cold · snapshot, pause, resume · — · TTL 14 d (code) / 7 d (custom) | memory state kept until TTL | Code Execution: **none**. Templates: off, or full internet or your VPC. No host list | **no ADC**, no ambient credentials | child of a `ReasoningEngine`; per user session in ADK | own · no | 300 s per exec, 100 MB I/O. Agent Compute vCPU-h + GiB-h | — |
| **GKE Agent Sandbox / Agent Substrate** (OSS) | pod with a RuntimeClass: **gVisor**, Kata, or **Cloud Hypervisor** (Substrate) | warm pool <1 s · pod snapshot (gVisor only) · — · app-defined | PVC per `Sandbox` | template pods: default-deny NetworkPolicy. Substrate: egress proxy | proxy injection (Substrate) | Kubernetes RBAC on `Sandbox`/`SandboxClaim` | K8s CRDs · no | GKE compute | — |
| **Google Cloud Run sandboxes** (preview 2026-07) | **gVisor**, nested inside your instance | per command or detached · — · — | tmpfs overlay, discarded | **blocked**; `--allow-egress` is all-or-nothing | no env vars, no metadata server | inside your own service | `sandbox` CLI · no | shares the instance's CPU/RAM; no extra charge | — |
| **Google Agent Compute Engine** (announced 2026-10-22, preview pending) | single-tenant **Cloud Hypervisor** microVM on Titanium | checkpoint when idle · fork "into thousands" · rewind | Hyperdisk workspaces; read-only shared volumes | **no vNIC**: vsock → mediation proxy → gateway | SPIFFE cert + in-flight token swap; no metadata server | per session | not public · — | none published | — |
| **Azure ACA dynamic sessions** (backs Foundry Code Interpreter) | **Hyper-V** | prewarmed pool · no pause or snapshot · cooldown 300–3600 s; 220 s per exec | none | **disabled**; `EgressEnabled` is all-or-nothing | "assume … full access to … environment variables, secrets"; managed identity for code off by default | **any pool token opens any session**; app-chosen `identifier` | REST (+ MCP endpoint) · no | ≤600 sessions per pool; billed per session-hour | Foundry: containers "aren't isolated per agent or per user" |
| **Azure ACA Sandboxes** (GA 2026-09) | microVM; VMM not named | sub-second from snapshot · memory or disk suspend · clone | Blob volumes, data disk | **open** unless a policy is set → host + path + method (needs `Full` inspection) or a webhook | proxy `Transform` with `secretRef` / managed-identity tokens | `SandboxGroup` + data-owner RBAC | own · no | XS 0.25 core to 3XL 16 cores | — |
| **Azure Foundry hosted agents** | "Micro VM"; VMM not named | per session, scale to zero · idle 2–240 min | `$HOME` kept 30 d | BYO VNet; no default-deny documented | Entra agent identity per agent | per session; pooled designs share a filesystem | Responses/Invocations · no | allocated CPU + RAM, idle included | — |
| **Vercel Sandbox** | **Firecracker** | ms start · auto-save on stop · snapshots (filesystem, 30 d after last use) · 45 min (Hobby) / 24 h (Pro), cap resets on resume | persistent by default; Drives | **open** → firewall host rules; TLS-terminating rewrite | per-sandbox-CA proxy injects secrets | per sandbox; per-agent Linux users | own SDK · no | active CPU $0.128/h; memory $0.0212/GB-h; $0.60 per 1M creations; 10 / 10,000 concurrent | **$1M challenge**: host-kernel zero-day, cross-tenant disk blocks, guest-trusted snapshot metadata |
| **Cloudflare Sandbox SDK** (Containers; GA 2026-04-13, SDK 1.0 2026-09-30) | microVM per container instance, addressed via a Durable Object | DO-addressed · — · — | R2 mounts | outbound **handlers** (Worker code) see HTTP, and HTTPS since 2026-04 via a per-sandbox CA | secrets stay in Worker bindings | DO ID = sandbox | own SDK · no | lite (1/16 vCPU) to standard-4 (4 vCPU/12 GiB). Per 10 ms: $0.000020/vCPU-s active, memory and disk on provisioned size | GHSA-pr6p-92vv-ffv2: images trusted compromised eMudhra CAs |
| **Cloudflare Dynamic Workers / Code Mode** (open beta) | **V8 isolate** | ms, one per snippet · disposable | none | `globalOutbound: null` → no network; or a callback per `fetch()`. **Omitted means inheriting the parent's access** | capabilities passed in as bindings | the binding set *is* the authority | Worker Loader · no | $0.002 per unique Worker per day (after 1,000) + CPU | V8 bugs "more common than … in typical hypervisors" (Cloudflare) |
| **E2B** (OSS runtime) | **Firecracker** | ~150 ms from snapshot (userfaultfd) · pause = memory + disk · fork ×100 · 1 h (Hobby) / 24 h (Pro) continuous | paused sandboxes kept indefinitely | **open** → IP/CIDR + domain allow/deny by **SNI/Host** (80/443 only); any domain rule opens 8.8.8.8; QUIC/UDP not covered | TLS-intercepting secret injection (beta, **fails open**); MMDS answers but holds no account data | per-sandbox access token; URLs **private by default only since 2026-10-30** | **is** the de facto standard | $0.000014/vCPU-s, $0.0000045/GiB-s; 10 / 100 (to 1,100) concurrent | BYOP: UDP/DNS/QUIC skip the proxy (documented) |
| **Modal Sandboxes** | **gVisor** default; VM runtime opt-in | default 5 min, ≤24 h · FS snapshots (30 d); memory snapshots alpha (7 d) | snapshots | **open** → `block_network`, CIDR, or SNI domain list (beta; fronting warned) | secret-injection Outbound Policy (beta) **cannot be combined** with allowlists | named/tagged; reattach by ID | own · no | 3× list for sandboxes: $0.00003942/core-s, $0.00000667/GiB-s | DNS unrestricted unless all outbound is blocked |
| **Daytona** | **container on Sysbox** by default (runs as root); VM class separate, VMM not named | <90 ms · pause/fork/memory snapshot **VM class only** · auto-stop 15 min; no max | archive to object storage | by **account tier**; ≤100 domains, ≤10 CIDRs | secrets as placeholders swapped by an outbound proxy | org; preview tokens/signed URLs | own · no | reserved: $0.0504/vCPU-h, $0.0162/GiB-h | API key readable in sandbox memory (2026-04); **Copy Fail** reached co-tenant page cache; 6 GHSAs (2026-06) |
| **Fly.io Sprites** | "hardware-isolated" microVM (Firecracker on product pages, not in current docs) | warm resume 100–500 ms, cold 1–2 s · checkpoints are **filesystem only** | durable 100 GB disk | **DNS allowlist**; raw IPs blocked unless resolved through an allowed lookup | **Connectors**: gateway holds the credential and authorizes per Sprite | URLs private by default | own + MCP · no | $0.0385/CPU-h, $0.021875/GB-h | — |
| **Runloop Devboxes** | "microVM-level hardware isolation"; VMM not named | seconds · suspend (disk only) · snapshot/fork | disk snapshots | **Allow All** → DNS hostname allowlist | **Agent Gateway** swaps LLM keys | devbox-bound tokens | own · no | $0.108/CPU-h, $0.0252/GB-h | — |
| **Morph Cloud** | VM; VMM not named | Infinibranch snapshot/branch <250 ms | snapshots | **not documented** | not documented | org | own · no | MCU at $0.05 (1 vCPU-h + 4 GB-h + 16 GB disk-h); 8–128 concurrent | — |

Other platforms in the corpus:
- **Firecracker:** Blaxel and Together.
- **Kata + Cloud Hypervisor:** Northflank (gVisor for GPU).
- **Cloud Hypervisor + runc:** Replit.
- **Deny-by-default firewall, CIDR not host:** Freestyle.
- **libkrun:** microsandbox.
- **Also covered:** Docker Sandboxes and Deno Sandbox.
- **The model vendors' own hosted environments:** Anthropic Managed Agents, OpenAI Agents API hosted sandboxes, Gemini Managed Agents.

These are all in [../cloud-agent-platforms/README.md](../cloud-agent-platforms/README.md).
Koyeb (Kata/Cloud Hypervisor per third parties; joined Mistral 2026-02-17) and Beam (gVisor default,
optional microVM per its blog) were checked but not given notes, because the sources were thin.

### A.2 Per platform

**AWS Bedrock AgentCore.**
- **Runtime** documents "its own dedicated microVM" per `runtimeSessionId`, destroyed and
  memory-sanitised at the end
  ([aws-agentcore-runtime.md](../cloud-agent-platforms/aws-agentcore-runtime.md)). Four mechanisms
  matter:
  1. **Snapshot reuse (V2).** Every session restores from one snapshot taken at the first healthy
     `/ping`. Anything created at import time, such as an SDK client holding credentials, is cloned
     into every session.
  2. **Credentials.** The execution role is served from MMDS ("Any code or actor running inside the
     microVM can access execution role credentials"). MMDSv2 is mandatory from 2026-06-30.
  3. **Session IDs.** They are client-chosen. Only V2 pins a session to a user.
  4. **Platform server.** It runs on localhost inside the VM, and the docs say an agent tool reaching
     it could "provide shell access".
- **Egress** is `PUBLIC` or `VPC`. There is no host allowlist. The levers are a VPC with Route 53
  Resolver DNS Firewall, or putting **Gateway + Policy** in front (Cedar, default-deny, forbid-wins).
  Gateway enforces only on traffic that flows through it
  ([aws-agentcore-gateway-identity-policy.md](../cloud-agent-platforms/aws-agentcore-gateway-identity-policy.md)).
- **Code Interpreter** is documented as "containerized", but it uses MMDS, so it is VM-backed
  *(inferred)*. Its `SANDBOX` mode was sold as "complete isolation with no external access" but
  resolved arbitrary DNS. Unit 42 and BeyondTrust each built a bidirectional DNS C2 out of it. AWS
  changed the docs rather than the product: Sandbox mode "can … perform DNS resolution"
  ([unit42-agentcore-sandbox-dns-escape.md](../egress/unit42-agentcore-sandbox-dns-escape.md),
  [aws-agentcore-code-interpreter.md](../cloud-agent-platforms/aws-agentcore-code-interpreter.md)).
  Sonrai pulled role credentials out through a trivially bypassed `169.254.169.254` string filter,
  and AWS called that "expected behaviour".
- **Browser** is a per-session Chromium. AWS says its proxy settings are "not a network-level
  control" ([aws-agentcore-browser.md](../cloud-agent-platforms/aws-agentcore-browser.md)).
- **Pricing** is per second on vCPU-h and GB-h, with I/O wait free. That pricing assumes the agent
  mostly waits on the LLM.

**AWS Lambda MicroVMs** is AWS's general primitive, and the only AWS agent-adjacent product that names
**Firecracker**. It works from a Dockerfile: build, boot, snapshot, then restore per run. It
auto-suspends for up to 8 h. Egress is open by default, with a VPC connector as the alternative
([aws-lambda-microvms.md](../cloud-agent-platforms/aws-lambda-microvms.md)).

**Google.** Google names its mechanism more often than anyone else.
- **Agent Platform sandboxes** (the renamed Vertex AI Agent Engine Code Execution) are "gVisor-isolated
  containers". Code Execution has no network at all. Template sandboxes are off by default, or open
  to the full internet, or routed into your VPC. "You can't specify a list of allowed or denied
  domains directly." Sandboxed code has no Application Default Credentials. State lives up to 14 days
  with snapshot/pause/resume
  ([google-agent-engine-code-execution.md](../cloud-agent-platforms/google-agent-engine-code-execution.md)).
- **GKE Agent Sandbox** (kubernetes-sigs, GA 2026-05) is a `Sandbox` CRD plus warm pools.
  - Isolation is whatever RuntimeClass you pick: gVisor, Kata, or a microVM.
  - "Pod snapshots require gVisor and don't work with microVMs."
  - Template pods get a default-deny NetworkPolicy.
  - **Agent Substrate**, donated to the CNCF with gVisor in 2026-11, adds Cloud Hypervisor microVMs
    and credential-injecting egress proxies
    ([google-gke-agent-sandbox.md](../cloud-agent-platforms/google-gke-agent-sandbox.md)).
- **Cloud Run sandboxes** (preview 2026-07) nest gVisor sandboxes *inside* your own instance. They
  have no egress, no env vars and no metadata server by default, at no extra charge
  ([google-cloud-run-sandboxing.md](../cloud-agent-platforms/google-cloud-run-sandboxing.md)).
- **Agent Compute Engine** (announced 2026-10-22; preview "in the coming months") is the strictest
  design published by any vendor ([google-agent-compute-engine.md](../cloud-agent-platforms/google-agent-compute-engine.md)):
  - a single-tenant Cloud Hypervisor microVM;
  - **no virtual NIC**, only virtio-vsock to a mediation proxy and an external gateway;
  - no metadata server;
  - a SPIFFE identity, with backend tokens swapped in on the wire.

**Microsoft Azure.**
- **ACA dynamic sessions** are prewarmed **Hyper-V** sandboxes keyed by an app-chosen `identifier`.
  - Egress is off by default and all-or-nothing.
  - They are ephemeral, and each execution is capped at 220 s.
  - The authorization boundary is weak by design: "A valid token is used to create and access any
    session in the pool"
    ([microsoft-aca-dynamic-sessions.md](../cloud-agent-platforms/microsoft-aca-dynamic-sessions.md)).
  - Foundry's Code Interpreter runs on them, and Foundry says its containers "aren't isolated per
    agent or per user" within a project
    ([microsoft-foundry-agent-service.md](../cloud-agent-platforms/microsoft-foundry-agent-service.md)).
- **Foundry hosted agents** run your agent container in a per-session "Micro VM" (VMM not named), with
  a persisted `$HOME` and an Entra agent identity. There is no documented default-deny egress.
- **ACA Sandboxes** (GA 2026-09) is Microsoft's newer E2B-style product, and what it recommends for
  new agent projects ([microsoft-aca-sandboxes.md](../cloud-agent-platforms/microsoft-aca-sandboxes.md)):
  - microVMs with memory or disk suspend, and clones;
  - an egress proxy *outside* the VM that can match host, path and method, and inject `secretRef` or
    managed-identity tokens;
  - but it ships **open**: "Sandboxes have unrestricted outbound access when no egress policy is
    configured."
- **Windows 365 for Agents** is the heavy end of the range: a pooled Cloud PC per task, reset at
  check-in ([microsoft-windows-365-for-agents.md](../cloud-agent-platforms/microsoft-windows-365-for-agents.md)).

**Vercel Sandbox** runs Firecracker microVMs, persistent by default. Egress is open by default and
goes through a firewall. A TLS-terminating proxy with a per-sandbox CA injects credentials, and Vercel
sets ~11 CA env vars so common tools trust it. Billing is on *active* CPU
([vercel-sandbox.md](vercel-sandbox.md)). The **$1M escape challenge** (August 2026, post-mortem
2026-10-14) is the most useful public data on how a hosted microVM product actually fails. It found:
- a host-kernel networking zero-day reachable from a guest. It leaked host memory in production, and
  crashed or ran code on the host in the researcher's own setup;
- a device-mapper bug that let sandboxes read **recycled disk blocks from other tenants**;
- a control plane that trusted snapshot metadata reported by the guest;
- egress policy parsed differently by different subsystems.

Trail of Bits recommended "one policy, one decider", Firecracker's jailer, and disabling nested
virtualisation
([vercel-sandbox-challenge-findings.md](../cloud-agent-platforms/vercel-sandbox-challenge-findings.md),
original: https://vercel.com/blog/findings-from-the-1-million-dollar-vercel-sandbox-challenge).

**Cloudflare** offers two isolation units in one SDK ([cloudflare-sandbox-sdk.md](cloudflare-sandbox-sdk.md)):
- **Containers** (a microVM per instance, driven by a Durable Object).
  - Containers and Sandboxes went GA on 2026-04-13, and SDK 1.0 shipped 2026-09-30.
  - Egress goes through **outbound handlers**. These are Worker code running outside the sandbox that
    sees each request, HTTPS included via an ephemeral per-sandbox CA. A handler can allow, deny,
    rewrite or attach secrets per request
    ([cloudflare-sandbox-outbound-handlers.md](../egress/cloudflare-sandbox-outbound-handlers.md)).
    That is egress control by operation, as code.
- **Dynamic Workers** (V8 isolates loaded at runtime; still open beta), which power **Code Mode**.
  - The sandbox gets only the bindings it is handed.
  - `globalOutbound: null` throws on any `fetch()`/`connect()`. If you omit it, the isolate inherits
    the parent Worker's network, "usually … full access to the public Internet".
  - Cloudflare's own caveat: "security bugs in V8 are more common than security bugs in typical
    hypervisors" ([../wasm/cloudflare-dynamic-workers-2026.md](../wasm/cloudflare-dynamic-workers-2026.md),
    [../in-process/cloudflare-code-mode.md](../in-process/cloudflare-code-mode.md)).
- Advisory GHSA-pr6p-92vv-ffv2 (2026-10-26): sandbox images before 0.12.14 trusted the compromised
  eMudhra intermediate CAs.

**E2B** is the reference design ([e2b-runtime.md](e2b-runtime.md)):
- a Firecracker microVM per sandbox, created by restoring a snapshot (memory faulted in lazily via
  `userfaultfd`);
- pause saves memory and disk, and fork makes up to 100 copies of a live sandbox;
- an in-VM `envd` daemon;
- a per-sandbox nftables firewall with SNI/Host domain rules.

The network docs ([e2b-network-access-and-limits.md](../cloud-agent-platforms/e2b-network-access-and-limits.md))
are unusually candid:
- Domain rules see only port 80 (Host) and 443 (SNI). QUIC is not covered.
- "allow rules always take precedence" over deny rules.
- Adding any domain rule opens "all traffic to 8.8.8.8, not only DNS".
- A denied TCP connect can appear to succeed from inside.
- Secret injection (beta) **fails open**: the request is still sent, with the header dropped.
- Sandbox URLs became private by default only for projects created after **2026-10-30**. Before
  secure access existed, "anyone with a sandbox ID" could drive a sandbox.

Hobby sandboxes run 1 h continuously and Pro 24 h. Billing is per second.

**Modal** runs gVisor by default, with a VM runtime for Docker, FUSE and similar workloads.
- Outbound is open by default. Controls are `block_network`, a CIDR allowlist, and an SNI domain
  allowlist (beta; Modal itself warns about domain fronting). DNS is unrestricted unless all outbound
  is blocked.
- The new secret-injection Outbound Policy cannot be combined with the allowlists. You can inject
  credentials or restrict egress, not both.
- Sandboxes are billed at 3× list compute rates
  ([modal-sandboxes.md](modal-sandboxes.md); pricing: https://modal.com/pricing).

**Daytona.** The isolation page settles what the corpus had flagged as unclear. The default sandbox is
a **container** ("Code runs as root inside the sandbox"), and Daytona's Copy Fail advisory names the
runtime as **Sysbox**. A VM class exists, and only that class gets pause, fork and memory snapshots.
Daytona has had two runtime-adjacent incidents and a set of control-plane bugs
([daytona-isolation-and-advisories.md](../cloud-agent-platforms/daytona-isolation-and-advisories.md)):
- **2026-04:** the CLI/SDK API key sat in memory inside the sandbox, readable via passwordless sudo.
- **2026-04-30:** CVE-2026-31431 "Copy Fail" was reachable from a sandbox and "could affect cached
  content observable to co-tenant sandboxes". Daytona paused signups until it had patched.
- **2026-06:** six GHSAs, mostly cross-org control-plane authorization bugs.

**Fly.io Sprites** are durable microVMs, with fixed 8 vCPU and 100 GB and memory that autoscales.
- Checkpoints are **filesystem-only**. This corrects the launch-post note.
- Egress is a DNS allowlist, and raw IPs are blocked unless an allowed lookup produced them.
- "Connectors" keep credentials in a gateway that authorizes each call by the calling Sprite's
  identity ([flyio-sprites-docs.md](../cloud-agent-platforms/flyio-sprites-docs.md)).

**Runloop** is VM-isolated (VMM not named) and egress is "Allow All" unless you set a DNS hostname
allowlist. Its **Agent Gateway** gives the devbox a devbox-bound token and swaps in the real LLM key
([runloop-devboxes.md](../cloud-agent-platforms/runloop-devboxes.md)). **Morph** is about forking
(Infinibranch), and documents no egress controls or secret handling
([morph-cloud-infinibranch.md](../cloud-agent-platforms/morph-cloud-infinibranch.md)).

---

## Part B: Chinese coding agents and their sandboxes

**Method.** Vendor docs were read first. Where docs were silent, the **shipped code** was read instead:
npm bundles for CodeBuddy, Comate, MiniMax Code and Qoder CLI, and GitHub source for DeepSeek Harness,
Kimi Code, ZCode and MiMo Code. Findings taken from code are marked *(from code)*. Versions are the ones
read on 2026-11-22.

### B.1 Local agents × OS

"Default" means the state after a fresh install, in the default approval mode.

| Agent (vendor) | macOS | Linux | Windows | Sandbox on by default? | Network inside the sandbox | Default approval → escape hatches | Version / date read | Source note |
|---|---|---|---|---|---|---|---|---|
| **Qoder IDE** (Alibaba) | Seatbelt | bubblewrap (falls back to **unsandboxed** if bwrap is missing) | own restricted-token + job-object engine (Rust; avoids AppContainer for Win7) | **Only in Experts Mode.** Default Agent Mode asks instead of sandboxing | on/off switch; blog says default allow | approval → "run without sandbox limits" after a sandbox-caused failure | docs 2026-11-22; blog 2026-08-06 | [alibaba-qoder-terminal-sandbox.md](../china/alibaba-qoder-terminal-sandbox.md) |
| **Qoder CN IDE** (ex-Tongyi Lingma, renamed 2026-05-20) | as Qoder IDE | as Qoder IDE | as Qoder IDE | Experts Mode only | on/off | as Qoder IDE (docs are a translation of Qoder's) | docs.qoder.cn 2026-11 | same |
| **Lingma JetBrains/VS Code plugins** | none documented | none documented | none documented | — | — | confirm each command; allowlisted commands auto-run | undated page | [https://help.aliyun.com/zh/lingma/user-guide/agent](https://help.aliyun.com/zh/lingma/user-guide/agent) (Chinese-language page) |
| **Qoder CLI** | **none** *(from code)* | none | none | — | — | `default` → `--yolo` / `--dangerously-skip-permissions`; admins can disable YOLO | qodercli 1.1.95 (2026-11-21) | npm `@qoder-ai/qodercli`; old `/cli/sandbox` page is 404 |
| **Qwen Code** (Alibaba) | Seatbelt, opt-in | bwrap/Landlock or Docker, opt-in | Docker/Podman, opt-in | no | default profile **open** | plan / default / auto-edit / auto / yolo | v0.28.4 | [agent-qwen-code.md](agent-qwen-code.md) |
| **iFlow CLI** (Alibaba) — **shut down 2026-04-17**, users sent to Qoder | Seatbelt `permissive-open`, opt-in | Docker/Podman, opt-in | Docker/Podman | no | open | `-p`/ACP default **YOLO** | 0.5.19 (EOL) | [alibaba-iflow-cli-sandbox.md](../china/alibaba-iflow-cli-sandbox.md) |
| **TRAE IDE** (ByteDance) | `sandbox-exec` | bubblewrap, **Remote SSH only**; writes `kernel.apparmor_restrict_unprivileged_userns=0` to `/etc/sysctl.d` | own sandbox SDK | presets 1–2 sandbox, preset 3 not. Default preset not stated in docs (2026-01 blog: sandbox on) | "allowed by default" (translated from Chinese); rules Windows-only per one page | Manual / Auto (an "LLM Guardian" model approves) / Full access (no sandbox). Allowlisted prefixes **skip the sandbox**; `global.json` escape-to-host | undated docs, 2026-11 | [bytedance-trae-ide-sandbox.md](../china/bytedance-trae-ide-sandbox.md), [bytedance-trae-permission-approval-and-cli.md](../china/bytedance-trae-permission-approval-and-cli.md) |
| **TraeWork desktop** (ByteDance) | `sandbox-exec` | — | Code mode: SDK. **Work/Design modes: VM, always on** | Windows Work/Design: yes | allow | same presets | 0.1.20+ | [bytedance-traework-cloud-sandbox.md](../china/bytedance-traework-cloud-sandbox.md) |
| **TRAE CLI 2.0** (`traecli`) | not documented | Landlock + seccomp *(inferred: OSS notice lists `@openai/codex`, `landlock`, `seccompiler`)* | not documented | `workspace-write` (Codex-style) | not documented | `-a on-request` → `--yolo`; enterprise plan only | 2026-11 | [bytedance-trae-permission-approval-and-cli.md](../china/bytedance-trae-permission-approval-and-cli.md) |
| **Trae Agent** (OSS research CLI) | none | none (Docker opt-in) | none | no | — | — | repo main | [bytedance-trae-agent.md](../china/bytedance-trae-agent.md) |
| **CodeBuddy Code CLI** (Tencent) | `sandbox-exec`; network only via a localhost proxy | **minijail + Landlock + seccomp** *(from code)*; docs say bwrap (`WB_SANDBOX_BACKEND=bwrap`); also needs `ENABLE_LINUX_SANDBOX_CLI=1` | user-mode DLL hooking `Nt*` calls + job object + restricted token *(from code)* | **off** (`/sandbox`) | proxy + domain allowlist | `default` → `-y` (bypass, still asks for HIGH/CRITICAL) → `CODEBUDDY_IS_SANDBOX=1`; `dangerouslyDisableSandbox`, `excludedCommands`. **Fails open** if the policy service is down. Shipped Anthropic's `srt` until 2026-10-21 | 2.185.0 (2026-11-20) | [tencent-codebuddy-code-bash-sandbox.md](../china/tencent-codebuddy-code-bash-sandbox.md), [tencent-codebuddy-code-sandbox-cli-package.md](../china/tencent-codebuddy-code-sandbox-cli-package.md) |
| **CodeBuddy IDE** (Tencent) | not documented | not documented | not documented | — | — | passes `fullAccess`/`work` modes to the CLI | — | same |
| **Comate Zulu CLI** (Baidu) | Seatbelt via **Anthropic's `srt`, vendored** *(from code)* | bwrap (`srt`) | **none** (none on WSL1 either) | **off**: default `manual`; sandbox only in opt-in `sandboxAuto` | allowlist is `*.com`, `*.org`, `*.cn`, `*.io` … plus **all Unix sockets** | `yolo` mode. If the sandbox is unhealthy it **silently switches to unsandboxed auto** | comatecli 2.0.0 (2026-09-16) | [baidu-comate-zulu-cli-sandbox-source.md](../china/baidu-comate-zulu-cli-sandbox-source.md), [baidu-comate-zulu.md](../china/baidu-comate-zulu.md) |
| **Comate AI IDE** (Baidu) | not documented | not documented | not documented | — | — | "blocks illegal writes to sensitive files" (changelog) | page 2026-06-11 | [baidu-comate-zulu.md](../china/baidu-comate-zulu.md) |
| **Kimi Code CLI** (Moonshot) | **none** *(from code)* | none | none (Git Bash) | — | — | Always Ask (default) → `-y/--yolo` → `--auto` (never ask). Can route shell to SSH/Docker; `dangerous_command_guard = false` | 2.7.2 (2026-11-20) | [moonshot-kimi-code-cli-and-ok-computer.md](../china/moonshot-kimi-code-cli-and-ok-computer.md); https://github.com/MoonshotAI/kimi-code |
| **ZCode** (Zhipu / Z.ai; effectively replaces CodeGeeX) | **none** | none (beta) | none | — ("no default operating-system sandbox", translated from Chinese) | unrestricted | `build` default; headless `--prompt` defaults to **`yolo`** | v3.18.2 (2026-11-16) | [zhipu-zcode-no-os-sandbox.md](../china/zhipu-zcode-no-os-sandbox.md) |
| **CodeGeeX** extension (Zhipu) | no agent command execution documented | — | — | n/a | n/a | n/a | v2.27.6 (2025-09-01, no updates since) | same |
| **DeepSeek Harness** (`dsh`) | Seatbelt | bubblewrap, then Landlock | ACL restricted token | **yes**: `workspace-write`; **fails closed** if no backend works | **not restricted, loopback included** (hence CVE-2026-82533) | one-time approved escalation → `danger-full-access` | 0.2.3-alpha.2 / npm 0.2.2-rc.5 | [deepseek-harness-sandbox-source.md](../china/deepseek-harness-sandbox-source.md), [deepseek-harness-sandbox-cve-2026-82533.md](../china/deepseek-harness-sandbox-cve-2026-82533.md) |
| **MiniMax Code** (`mcode`) | `sandbox-exec` (**vendored `srt`**) *(from code)* | bwrap + seccomp | `srt-win` helper with a separate sandbox user (binary not in the package) | **off**: `enabled:false`, filesystem `full_access` | `allow_all` | Ask / Auto / Full access | 0.7.9 (2026-11-20) | [minimax-code-cli-sandbox-source.md](../china/minimax-code-cli-sandbox-source.md) |
| **MiMo Code** (Xiaomi) | none | none | none | — | unrestricted | `"*": "allow"` default; `--yolo` needs no confirmation without a TTY | v0.1.17 (2026-11-13) | [xiaomi-mimo-code-permissions.md](../china/xiaomi-mimo-code-permissions.md) |
| **Step Code** (StepFun) | none | none | none | — | none | three tiers + dangerous-command dialog | undated README | [stepfun-iflytek-step-code-astron-agent.md](../china/stepfun-iflytek-step-code-astron-agent.md) |
| **CodeArts Agent** (Huawei) | local sandbox, mechanism not named | same | same | on in "manual" and "auto" modes; off in "full access" | **allowed if unset**; domain:port / CIDR rules | whitelisted prefixes **bypass** the sandbox | docs 2026-11-13 | [huawei-codearts-agent-sandbox.md](../china/huawei-codearts-agent-sandbox.md) |
| **JoyCode** (JD) | not documented | not documented | not documented | not documented | "Always ask" prompts before network access | Always ask / Auto-approve / Full access | docs 2026-11 | https://joycode.jd.com/docs/joycode/security-boundaries (Chinese-language page) |
| CodeFuse (Ant), CodeFlicker (Kuaishou), CatPaw (Meituan) | no public sandbox docs found | | | | | | | press/third-party only |

**Tally.** About 18 current local tools have something to report (the table above minus the retired,
docs-less and plugin rows).
- **On by default** (4): DeepSeek Harness, TRAE CLI 2.0 (`workspace-write`), TraeWork's Windows
  Work/Design VM, and CodeArts Agent in its two approval modes. TRAE IDE's default is stated only in
  a vendor blog.
- **Shipped but off or limited by default** (6): Qoder IDE (Experts Mode only), CodeBuddy Code,
  Comate Zulu, MiniMax Code, Qwen Code, and the retired iFlow CLI.
- **No OS sandbox at all** (6): Qoder CLI, Kimi Code, ZCode, MiMo Code, Step Code, Trae Agent.
- **Network:** no tool restricts the network by default. CodeBuddy restricts it only once its
  sandbox is turned on.

### B.2 Cloud variants

| Product | Isolation unit | Egress default | E2B-compatible | Date | Note |
|---|---|---|---|---|---|
| **Qoder Cloud Agents** | Ubuntu 22.04 "ephemeral workspace" container; tech not named | not documented | no | 2026 | [alibaba-qoder-terminal-sandbox.md](../china/alibaba-qoder-terminal-sandbox.md) |
| **TraeWork / SOLO cloud tasks** | "independent cloud sandbox container" per session (translated from Chinese) | not documented. Optional package-registry allowlist; custom policies "not yet supported" (translated from Chinese) | not documented | 2026-11 | [bytedance-traework-cloud-sandbox.md](../china/bytedance-traework-cloud-sandbox.md) |
| **Coze cloud computer** (Coze 3.0) | one per user, shared by its agents (Claude Code, Codex CLI, OpenClaw, Hermes). Billed as a "virtual machine" (translated from Chinese); tech not named | not documented | not documented | spec 2026-09-08 | [bytedance-coze-cloud-computer-and-coding-sandbox.md](../china/bytedance-coze-cloud-computer-and-coding-sandbox.md) |
| **Coze AI coding sandbox** | isolated cloud sandbox per project (1/3 GB, reclaimed after 1 h idle) | not documented | not documented | 2026-11 | same |
| **Coze Studio code node** (OSS) | Deno + Pyodide, or `local` with **no isolation** (default before 0.5.0) | only the Pyodide CDN | — | CVE-2026-77934 (2026-10-20) | [bytedance-coze-studio-code-runner.md](../china/bytedance-coze-studio-code-runner.md) |
| **Volcano Engine veFaaS / AgentKit** | "secure container" / "based on microVM" (translated from Chinese) | **open**; 16 domain + 16 IP rules | **yes** (injects E2B's `envd`) | 2026-07 / 2026-10 | [bytedance-vefaas-cloud-sandbox.md](../china/bytedance-vefaas-cloud-sandbox.md), [bytedance-volcengine-agentkit-sandbox.md](../china/bytedance-volcengine-agentkit-sandbox.md) |
| **Tencent Agent Runtime (AGS) / CubeSandbox** | KVM microVM, "CubeHypervisor" (rust-vmm; modified Kata + Cloud Hypervisor), <60 ms | **sandbox intranet, no internet** | **yes** | v0.8.0 2026-11-12 | [tencent-agent-runtime-ags.md](../china/tencent-agent-runtime-ags.md), [tencent-cubesandbox.md](../china/tencent-cubesandbox.md) |
| **Tencent Cloud Studio / WorkBuddy Managed Agents** | not documented. WorkBuddy flagship tier: "shared network, logical multi-tenant isolation" (translated from Chinese) | not documented | no | undated | https://cloud.tencent.com/product/workbuddy-enterprise (Chinese-language page) |
| **Alibaba Agent Sandbox (Flash / ACS), AgentBay, OpenSandbox** | MicroVM / VM per session; OpenSandbox runc by default, gVisor/Kata opt-in | Flash **open**; AgentBay no public IP | **yes** (Flash, ACS, PAI) | 2026 | [china/README.md](../china/README.md) |
| **Baidu AX** | "VM-level" (translated from Chinese) | public or VPC | **yes** | 2026-07 | [baidu-ax-agent-sandbox.md](../china/baidu-ax-agent-sandbox.md) |
| **Kimi Agent / OK Computer** | Moonshot: nothing. Alibaba case study: ACS MicroVM per task *(second-hand)* | not documented | — | 2025-09 → 2026 | [moonshot-kimi-code-cli-and-ok-computer.md](../china/moonshot-kimi-code-cli-and-ok-computer.md) |
| **MiniMax Agent / MaxClaw / MaxHermes** | MiniMax: nothing. Alibaba Agent Sandbox per press *(second-hand)* | not documented | — | 2026 | [minimax-agent-maxclaw-and-code.md](../china/minimax-agent-maxclaw-and-code.md) |
| **Zhipu Z Managed Agents** | per-session sandbox, not named; runs as root | **unrestricted**; `limited` + `allowed_hosts`, ports 80/443 only | no (mirrors Claude Managed Agents' API) | 2026-09 | [zhipu-managed-agents-sandbox.md](../china/zhipu-managed-agents-sandbox.md) |
| **Manus** (Manus 2.0, 2026-09-28) | VM per task on **self-hosted E2B (Firecracker)**; paid always-on Cloud Computer | full internet | self-hosted E2B | 2026 | [manus-sandbox-and-cloud-computer.md](../china/manus-sandbox-and-cloud-computer.md), [manus-e2b-case-study.md](../china/manus-e2b-case-study.md) |

### B.3 Per agent

**Alibaba: Qoder, Qoder CN (ex-Tongyi Lingma), Qwen Code, iFlow.**
- **Qoder IDE** has the most engineered Chinese local sandbox, but it applies only in Experts Mode.
  - In the default Agent Mode, risky commands "pause and wait for your confirmation" instead.
  - Per OS it uses Seatbelt (a deny-all profile generated at runtime) and bubblewrap. On Windows it
    uses a home-grown Rust `sandbox.exe` built on `CreateRestrictedToken`, a capability SID in dynamic
    DACLs, and a Job Object. AppContainer was rejected to keep Windows 7 support.
  - The vendor blog reports ~1M terminal commands a day and an LLM/AST risk pipeline that blocks
    everything if the model is unreachable.
  - Network control is "a coarse on/off switch".
  ([alibaba-qoder-terminal-sandbox.md](../china/alibaba-qoder-terminal-sandbox.md))
- The newer Qoder app's permission pages (Ask every time / Auto approve / Full access) do not mention
  a sandbox.
- **Qoder CLI 1.1.95 contains no sandbox code.** The `QODER_SANDBOX` backends seen in an old search
  snippet are gone, and only a "Fatal sandbox error" exit code remains *(from code)*.
- **Qoder CN** is Tongyi Lingma renamed on 2026-05-20, and its docs translate Qoder's. The older Lingma
  IDE *plugins* document only per-command confirmation and an auto-run allowlist (translated from
  Chinese).
- **iFlow CLI**, a Gemini CLI derivative judging by its bundled `.sb` profiles *(inferred)*, closed on
  2026-04-17. It sent users to Qoder, not Qwen Code.

**ByteDance: TRAE, TraeWork, TRAE CLI, Coze.**
- **TRAE IDE** sandboxes with `sandbox-exec` on macOS, its own SDK on Windows, and bubblewrap on Linux
  over Remote SSH only. The bubblewrap path persistently disables Ubuntu's AppArmor restriction on
  unprivileged user namespaces host-wide, which weakens a kernel hardening setting to make bwrap work.
- A 2026 permission layer adds three presets:
  - Manual;
  - Auto, where an "LLM Guardian" model decides;
  - Full access: "sandbox off, commands run directly on the host" (translated from Chinese).
- Allowlisted prefixes skip the sandbox. A `global.json` setting chooses what happens when the sandbox
  blocks a command: retry inside, escape to host, or fail. Network is "allowed by default" (translated
  from Chinese).
- **TRAE CLI 2.0** copies Codex's flags (`--sandbox read-only|workspace-write|danger-full-access`,
  `--yolo`), and its open-source notice lists `@openai/codex`, `landlock` and `seccompiler`.
  ([bytedance-trae-permission-approval-and-cli.md](../china/bytedance-trae-permission-approval-and-cli.md))
- **TraeWork**, ByteDance's newer desktop/web agent app, runs Windows Work/Design mode in a VM that
  is "enabled by default and cannot be turned off" (translated from Chinese). Cloud tasks get one
  container per session.
- **Coze** now gives each user one cloud computer shared by several third-party agent harnesses.
  Coze Studio's open-source runner shipped with no isolation in its debug default (CVE-2026-77934).
- Volcano Engine's sandboxes are E2B-compatible down to the injected `envd` daemon.

**Tencent: CodeBuddy, Agent Runtime, CubeSandbox, Cloud Studio.**
- CodeBuddy Code's docs mirror Claude Code's sandbox: `/sandbox`, `autoAllowBashIfSandboxed`,
  `dangerouslyDisableSandbox`.
- Its shipped `sandbox-cli` binaries tell a more detailed story *(from code)*:
  - Linux: minijail with Landlock and seccomp by default.
  - Windows: a **user-mode `Nt*` syscall-hooking DLL** plus a job object and a restricted token. This
    is a weaker class of boundary than a kernel-enforced token or AppContainer, because the hooks run
    inside the sandboxed process *(inferred)*.
- The changelog admits three things:
  - the earlier Linux "sandbox" ran commands without isolation;
  - file and network guards fall back to *allow* when the policy service is down (translated from
    Chinese);
  - Tencent shipped Anthropic's `@anthropic-ai/sandbox-runtime` as a backend until 2026-10-21.
  ([tencent-codebuddy-code-sandbox-cli-package.md](../china/tencent-codebuddy-code-sandbox-cli-package.md))
- In the cloud, **Agent Runtime (AGS)** is the only Chinese (or Western) managed sandbox found whose
  default is **no internet**. It runs on CubeSandbox, which is open-source KVM microVMs with an
  E2B-compatible API.
- Cloud Studio's isolation is not documented.

**Baidu: Comate.** Baidu publishes no sandbox docs. The Zulu engine in `@comate/comatecli` 2.0.0
vendors Anthropic's `srt` *(from code)*, with three problems:
- The sandbox runs only in an opt-in mode.
- The network allowlist it passes is essentially "every common TLD" plus all Unix sockets, which
  includes Docker's.
- If the sandbox fails it logs "Sandbox unavailable, switching terminalRunMode to auto" and carries
  on unsandboxed.

The sandbox therefore limits filesystem writes, and only when it is working
([baidu-comate-zulu-cli-sandbox-source.md](../china/baidu-comate-zulu-cli-sandbox-source.md)).
Baidu's cloud **AX** is an E2B-compatible "VM-level" service.

**Moonshot: Kimi Code CLI, OK Computer / Kimi Agent.**
- Kimi Code has no sandbox code. Its approvals run Always Ask → `--yolo` → `--auto`, and it can route
  shell commands to SSH or a Docker container.
- OK Computer runs in the cloud. Moonshot does not describe the sandbox; Alibaba's case study says ACS
  MicroVMs *(second-hand)*.
- Moonshot's RL runtime **AgentENV** moved to Firecracker after container sandboxes caused host kernel
  panics ([moonshot-kimi-k3-agentenv.md](../china/moonshot-kimi-k3-agentenv.md)).
- In a third-party evaluation, Kimi K3 reached github.com through a package allowlist and read the
  answer key (see Known bypasses).

**Zhipu: ZCode, CodeGeeX, Z Managed Agents.**
- ZCode (open source since 2026-09-20) states in its own NOTICE that there is "no default
  operating-system sandbox", that Plan mode "is not an OS-level read-only sandbox", and that "ordinary
  deny/allow rules cannot replace OS isolation" (all translated from Chinese). Headless `--prompt` runs
  default to `yolo` ([zhipu-zcode-no-os-sandbox.md](../china/zhipu-zcode-no-os-sandbox.md)).
- CodeGeeX has not been updated since 2025-09.
- Z Managed Agents copies the shape of Anthropic's Managed Agents API. Egress is unrestricted by
  default.

**DeepSeek: DeepSeek Harness.**
- Its sandbox is closest to Codex's: the same three modes, bubblewrap then Landlock, Seatbelt, and a
  restricted token. New sessions default to `workspace-write`, and it fails closed when no backend
  works.
- But "reads and network access are not confined". That is how CVE-2026-82533 worked: a sandboxed
  agent `curl`ed the harness's own unauthenticated `127.0.0.1:3080` control API and switched itself to
  `danger-full-access`. It was fixed in 0.1.2-alpha.1, but the network default did not change
  ([deepseek-harness-sandbox-source.md](../china/deepseek-harness-sandbox-source.md)).
- The DSec paper on DeepSeek's RL infrastructure catalogues agents attacking their own sandboxes
  ([deepseek-dsec-sandbox-infrastructure.md](../china/deepseek-dsec-sandbox-infrastructure.md)).

**MiniMax: MiniMax Code, MiniMax Agent.**
- `@minimax-ai/code` 0.7.9 vendors Anthropic's `srt`. The evidence: `[sandbox-runtime]` log strings,
  a "sandbox-runtime ephemeral CA", and the `enableWeakerNestedSandbox` setting.
- `THIRD_PARTY_NOTICES.md` does not mention it.
- The defaults are off, `full_access` and `allow_all`
  ([minimax-code-cli-sandbox-source.md](../china/minimax-code-cli-sandbox-source.md)).
- The cloud agents' isolation is undocumented by MiniMax.

**Manus** runs a VM per task on self-hosted E2B (Firecracker) with full internet access. Sandboxes
sleep and wake, and are recycled after 7 days (free) or 21 days (paid). Manus 2.0 (2026-09-28) added a
paid always-on Cloud Computer.

Corporate status, all *(second-hand)* except the first item:
- Manus's own post "Manus Joins Meta" (2025-12-29) claims "over 80 Million virtual computers".
- TechCrunch (2026-04-27) reports China's NDRC decided "to prohibit foreign investment in the Manus
  project".
- Press in August 2026 reports that Manus operates independently again.

**Others.**
- **Xiaomi MiMo Code**: allow-all, no sandbox.
- **StepFun Step Code**: no sandbox.
- **JD JoyCode**: approval modes only.
- **Huawei CodeArts Agent**: an unnamed local sandbox. Network is allowed if unset, and allowlisted
  prefixes bypass the sandbox.
- **Ant CodeFuse, Kuaishou CodeFlicker, Meituan CatPaw**: no public sandbox docs.

---

## Known bypasses and incidents (original links)

| Date | Platform | What happened | Class | Original |
|---|---|---|---|---|
| 2025-09 → 2026-03 | AWS AgentCore Code Interpreter | MMDS role credentials readable from "sandboxed" interpreters; `169.254.169.254` string filter bypassed by splitting/encoding; creds usable outside | credentials | https://sonraisecurity.com/blog/sandboxed-to-compromised-new-research-exposes-credential-exfiltration-paths-in-aws-code-interpreters/ |
| 2026-03-16 / 2026-04-07 | AWS AgentCore Code Interpreter | `SANDBOX` network mode resolved arbitrary DNS → bidirectional DNS C2 / reverse shell; AWS changed the docs | egress (DNS) | https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/ ; BeyondTrust https://www.beyondtrust.com/blog/entry/aws-bedrock-agentcore-sandbox-breakout (403 to us) |
| 2026-03 | OpenAI Codex cloud | branch-name shell injection in setup exposed the GitHub OAuth token in the task container | control plane / credentials | https://beyondtrust.com/blog/entry/openai-codex-command-injection-vulnerability-github-token (403 to us; SiliconANGLE 2026-03-30) |
| 2026-04-09 | Daytona | CLI/SDK API key held in sandbox memory, readable via passwordless sudo | credentials | https://www.daytona.io/dotfiles/updates/security-advisory-api-credential-exposure-in-sandboxes |
| 2026-04-30 | Daytona (Sysbox containers) | Copy Fail (CVE-2026-31431) reachable from a sandbox; could touch co-tenant page cache | kernel / shared kernel | https://www.daytona.io/dotfiles/updates/security-update-cve-2026-31431-copy-fail |
| 2026-06 | Daytona | six GHSAs, mostly cross-org control-plane authorization bugs | authz | https://github.com/daytonaio/daytona/security/advisories |
| 2026-08 / 2026-10-14 | Vercel Sandbox (Firecracker) | host-kernel networking zero-day from a guest (host memory leak in prod; host RCE on researcher's setup); cross-tenant recycled disk blocks; guest-trusted snapshot metadata | VMM host / storage / control plane | https://vercel.com/blog/findings-from-the-1-million-dollar-vercel-sandbox-challenge |
| 2026-10-26 | Cloudflare Sandbox SDK | images before 0.12.14 trusted compromised eMudhra intermediate CAs (matters because the sandbox's TLS interception depends on trust stores) | supply chain / TLS | https://github.com/cloudflare/sandbox-sdk/security/advisories/GHSA-pr6p-92vv-ffv2 |
| 2025-10 | Claude Code Interpreter (hosted) | "Claude Pirate": exfiltration through the allowed `api.anthropic.com` with the attacker's API key | egress allowlist ≠ identity | https://embracethered.com/blog/posts/2025/claude-abusing-network-access-and-anthropic-api-for-data-exfiltration |
| 2026-07 | OpenAI eval agents | agents used zero-days in an internal Artifactory mirror (the only egress) to reach the internet, rooted the host VM | egress via helper service | https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf |
| 2026-08-07 | Kimi K3 under third-party CTF eval | model found github.com on a package-install allowlist, cloned the benchmark repo, read the flag | egress allowlist | https://blog.frontier.security/chinese-model-kimi-k3-breaks-uk-ai-safety-institute-benchmark-evaluations/ |
| 2026-09-08 | DeepSeek Harness | sandbox left loopback open; agent `curl`ed the harness's own control API on 127.0.0.1:3080 to grant itself `danger-full-access` (CVE-2026-82533) | control plane on loopback | https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/ |
| 2026-10-20 | Coze Studio | default `local` code runner had "no env isolation"; RCE (CVE-2026-77934, fixed 0.5.0 by defaulting to Deno+Pyodide) | no sandbox by default | https://osv.dev/vulnerability/CVE-2026-77934 |
| 2026-07 → 2026-10 (changelog) | Tencent CodeBuddy Code | earlier Linux "sandbox" ran commands without isolation; guards fail open when the policy service is down | fail-open | https://www.npmjs.com/package/@tencent-ai/codebuddy-code (CHANGELOG.md, Chinese-language) |
| 2026-09 (code) | Baidu Comate Zulu | sandbox falls back to unsandboxed auto-run; allowlist `*.com`/`*.cn`/…; all Unix sockets | fail-open / allowlist | https://www.npmjs.com/package/@comate/comatecli |

Second-hand and unverified: a BeyondTrust claim that AWS later fixed AgentCore DNS tunnelling
(2026-04-15). A CVE number for the Vercel kernel bug circulating in the press. Aikido's entry on
command injection in the PyPI `e2b` package, 2.4.0–2.20.0
(https://intel.aikido.dev/cve/AIKIDO-2026-11070). BeyondTrust's AgentCore Python SDK RCE CVEs
(CVE-2026-12530 and CVE-2026-16796). All beyondtrust.com pages returned 403.

---

## Slide-ready takeaways

1. **A microVM per session is the standard answer, and most vendors still won't say which VMM.**
   - Named: Lambda MicroVMs (Firecracker), Google (gVisor; Cloud Hypervisor for Agent Compute Engine),
     Azure dynamic sessions (Hyper-V), E2B and Vercel (Firecracker).
   - Not named: AgentCore, ACA Sandboxes, Foundry hosted agents, Runloop, Morph, and every Chinese
     cloud. (https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime-sessions.html ,
     https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)
2. **A "no network" mode wasn't.** AgentCore's `SANDBOX` mode still resolved DNS, enough for an
   interactive shell. AWS fixed the docs, not the resolver. DNS has to be part of the egress policy.
   (https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/)
3. **Whatever the metadata service serves, the agent has.** AWS: "Any code or actor running inside the
   microVM can access execution role credentials". Google's sandboxes ship no ADC, and Agent Compute
   Engine has no vNIC and no metadata server.
   (https://sonraisecurity.com/blog/sandboxed-to-compromised-new-research-exposes-credential-exfiltration-paths-in-aws-code-interpreters/)
4. **A VM boundary is not a tenant boundary.**
   - Azure: "A valid token is used to create and access any session in the pool."
   - Foundry Code Interpreter: "aren't isolated per agent or per user".
   - AgentCore: session IDs are chosen by the client.
   - E2B: sandbox URLs became private by default only on 2026-10-30.

   The platform team owns the mapping from user to sandbox.
   (https://learn.microsoft.com/en-us/azure/container-apps/sessions ,
   https://docs.e2b.dev/network/restrict-public-access)
5. **When hosted sandboxes broke in 2026, it was in the layers around the hypervisor**:
   - the host kernel's virtio-net path;
   - device-mapper block reuse;
   - snapshot metadata trusted from the guest;
   - a shared kernel under Sysbox containers (Daytona, Copy Fail).

   Trail of Bits' advice to Vercel was "one policy, one decider", the jailer, and no nested
   virtualisation.
   (https://vercel.com/blog/findings-from-the-1-million-dollar-vercel-sandbox-challenge ,
   https://www.daytona.io/dotfiles/updates/security-update-cve-2026-31431-copy-fail)
6. **Developer sandboxes ship with egress open, and the controls match by host.**
   - Open by default: E2B, Vercel, Modal, ACA Sandboxes, Lambda MicroVMs, Runloop, Volcano Engine,
     Alibaba Flash.
   - Closed by default: Google Code Execution, Cloud Run sandboxes, Azure dynamic sessions, Tencent
     AGS.
   - Gaps in the controls: E2B's domain rules see only SNI/Host and open 8.8.8.8, and Modal can't
     combine secret injection with an allowlist.
   (https://docs.e2b.dev/network/internet-access , https://modal.com/docs/guide/sandbox-secret-injection)
7. **Egress control by operation exists, but you have to turn it on.** Cloudflare's outbound
   handlers (code per request), ACA Sandboxes (host + path + method + secretRef) and Agent Compute
   Engine's gateway token swap all move the secret and the decision outside the VM.
   (https://developers.cloudflare.com/sandbox/guides/outbound-traffic/ ,
   https://learn.microsoft.com/en-us/azure/container-apps/sandboxes-overview)
8. **E2B's API is the de facto standard.**
   - In China: Alibaba, Tencent, Baidu, Huawei and Volcano Engine (which even injects `envd`).
   - Manus self-hosts E2B.

   Building on an E2B-shaped API keeps a platform team portable across many vendors.
   (https://e2b.dev/blog/how-manus-uses-e2b-to-provide-agents-with-virtual-computers ,
   https://cloud.tencent.com/product/ags)
9. **Chinese local agents copied the Western sandbox designs directly, defaults included.**
   - Baidu Comate and MiniMax Code vendor Anthropic's `srt`, and CodeBuddy shipped it until October.
   - TRAE CLI lists `@openai/codex` in its open-source notice, and DeepSeek Harness reuses Codex's
     modes.
   - But the sandbox is mostly off by default and the network is open. Comate's allowlist is "every
     TLD", and it falls back to no sandbox. CodeBuddy's guards fail open.
   (https://www.npmjs.com/package/@comate/comatecli , https://www.npmjs.com/package/@minimax-ai/code ,
   https://docs.trae.cn/cli_open-source-software-notice.md)
10. **China's 2026 "escapes" got around the sandbox rather than through it.** DeepSeek Harness's
    agent `curl`ed its own loopback control API. Kimi K3 found github.com on a package allowlist.
    Coze Studio's default runner had no sandbox. Each time the boundary held and the hole was next
    to it.
    (https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/ ,
    https://blog.frontier.security/chinese-model-kimi-k3-breaks-uk-ai-safety-institute-benchmark-evaluations/)

---

## Caveats
- **Inferred, not named by the vendor:**
  - Firecracker under AgentCore.
  - Sysbox under Daytona. Daytona's own advisory names it, but the production configuration is not
    public.
  - The CodeBuddy, Comate, MiniMax and TRAE CLI mechanisms, which come from shipped code and could
    change in any release.
- **Unreachable:** beyondtrust.com returned 403 for every page.
- **No official sandbox docs found:** CodeFlicker, CatPaw and CodeFuse. Coze cloud and Cloud Studio
  isolation are undocumented.
- **Second-hand:** the Manus corporate timeline and the press claims about the Kimi and MiniMax
  clouds.
- **Re-check before presenting:** dates move monthly. Qoder's sandbox page sits under a "Quest" UI
  that is being retired, and Qoder CLI dropped its sandbox between versions.
