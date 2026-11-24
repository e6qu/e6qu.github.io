# Egress — filtering, allowlisting and how it fails

How sandboxed agents' outbound traffic is controlled, how each control is bypassed,
and what better designs look like. Per-agent network defaults are in
[../agent-sandboxing/README.md](../agent-sandboxing/README.md) and per-cloud defaults
in [../cloud-agent-platforms/README.md](../cloud-agent-platforms/README.md).
Incidents (Claude Pirate, Antigravity → webhook.site, DNS exfiltration CVE-2025-55284)
are in [../incidents/README.md](../incidents/README.md). In the taxonomy, egress
belongs to the **mediation layer** ([../../taxonomy.md](../../taxonomy.md)).

## Index

- [aws-network-firewall-domain-filtering.md](aws-network-firewall-domain-filtering.md) — Stateful domain list rule groups in AWS Network Firewall
- [azure-foundry-hosted-agent-egress.md](azure-foundry-hosted-agent-egress.md) — Control where your hosted agent connects with network egress in Foundry Agent Service
- [azure-foundry-managed-virtual-network.md](azure-foundry-managed-virtual-network.md) — Configure managed virtual network for Microsoft Foundry
- [cilium-dns-and-l7-policy.md](cilium-dns-and-l7-policy.md) — Cilium documentation: Layer 3 'DNS based' policies, Layer 7 HTTP policies, DNS Proxy, and 'Inspecting TLS Encr
- [claude-code-cloud-environments-network.md](claude-code-cloud-environments-network.md) — Configure cloud environments (Claude Code) — Network access, GitHub proxy, network secrets
- [cloudflare-sandbox-outbound-handlers.md](cloudflare-sandbox-outbound-handlers.md) — Outbound traffic (Cloudflare Sandbox SDK guide) and changelog 'Secure credential injection and dynamic egress 
- [codex-network-proxy-readme.md](codex-network-proxy-readme.md) — codex-network-proxy (README)
- [deno-sandbox-secrets.md](deno-sandbox-secrets.md) — Introducing Deno Sandbox (blog) and Deno Sandbox security docs
- [domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md) — Domain Decoupling Attack: Exploiting the Validation Gap Between Protective DNS and Shared Edge Routing
- [e2b-byop-tcp-only.md](e2b-byop-tcp-only.md) — Bring your own proxy (E2B documentation, Network)
- [embracethered-bard-apps-script-exfil.md](embracethered-bard-apps-script-exfil.md) — Hacking Google Bard - From Prompt Injection to Data Exfiltration
- [fly-tokenizer.md](fly-tokenizer.md) — tokenizer (superfly/tokenizer)
- [gcp-vpc-service-controls.md](gcp-vpc-service-controls.md) — Overview of VPC Service Controls
- [gitguardian-shai-hulud-exfil.md](gitguardian-shai-hulud-exfil.md) — Shai-Hulud: A Persistent Secret Leaking Campaign
- [infoblox-composite-domain-names.md](infoblox-composite-domain-names.md) — Hiding in Plain Sight: Abusing Composite Domain Names
- [kubernetes-networkpolicy-limits.md](kubernetes-networkpolicy-limits.md) — Network Policies (Kubernetes documentation), incl. 'What you can't do with network policies (at least, not yet
- [legit-camoleak-copilot-chat.md](legit-camoleak-copilot-chat.md) — CamoLeak: Critical GitHub Copilot Vulnerability Leaks Private Source Code
- [llm-wikileaks-2610.34542.md](llm-wikileaks-2610.34542.md) — LLM WikiLeaks: Uncovering URL-Based Capability Extension and Security Circumvention in Agentic Message Boards
- [mxc-process-container-networking.md](mxc-process-container-networking.md) — Process Container Networking Configuration, GA (microsoft/mxc docs/backends/process-container/networking.md)
- [rfc9110-http-connect.md](rfc9110-http-connect.md) — RFC 9110: HTTP Semantics — Section 9.3.6 CONNECT
- [rfc9849-encrypted-client-hello.md](rfc9849-encrypted-client-hello.md) — RFC 9849: TLS Encrypted Client Hello
- [siyuan-dns-rebinding-toctou-ghsa.md](siyuan-dns-rebinding-toctou-ghsa.md) — SiYuan Agent Tools SSRF via DNS-Rebinding TOCTOU (Bypass of CheckHostSSRF) — GHSA-x8gv-g2g3-65fj
- [stripe-smokescreen.md](stripe-smokescreen.md) — smokescreen: A simple HTTP proxy that fogs over naughty URLs
- [subramani-cdn-domain-fronting-2024.md](subramani-cdn-domain-fronting-2024.md) — Measuring CDNs susceptible to Domain Fronting
- [unit42-agentcore-sandbox-dns-escape.md](unit42-agentcore-sandbox-dns-escape.md) — Cracks in the Bedrock: Escaping the AWS AgentCore Sandbox

## Mechanisms and their bypasses

| Mechanism | Where used | What it stops | Known bypasses |
|---|---|---|---|
| Forward HTTP(S) proxy, CONNECT + domain allowlist | srt, Codex, Docker Sandboxes, Copilot firewall, Claude Code cloud, Managed Agents | direct connections to unlisted hosts | attacker-writable allowed domains ([Bard Apps Script](embracethered-bard-apps-script-exfil.md), webhook.site, S3/GCS/R2 and gists in [Claude Code's defaults](claude-code-cloud-environments-network.md)); attacker's own key on an allowed API (Claude Pirate); push or publish to allowed hosts ([Shai-Hulud](gitguardian-shai-hulud-exfil.md)); [domain fronting](subramani-cdn-domain-fronting-2024.md); proxy services ([WikiLeaks](llm-wikileaks-2610.34542.md), [translate.goog](infoblox-composite-domain-names.md)) |
| Method/path policy via TLS interception | [Codex limited mode and hooks](codex-network-proxy-readme.md), [Cilium L7](cilium-dns-and-l7-policy.md), [Cloudflare handlers](cloudflare-sandbox-outbound-handlers.md), Codex cloud GET-only | writes and uploads; out-of-scope repos and paths | data in GET query strings; writable GET endpoints (WikiLeaks); needs a trusted CA inside the sandbox |
| SNI/Host filtering (nftables, eBPF, firewalls) | E2B, Modal, [AWS Network Firewall](aws-network-firewall-domain-filtering.md) | name-based egress without decryption | fronting works on 22 of 30 CDNs (WWW'24); [ECH](rfc9849-encrypted-client-hello.md); [shared-edge decoupling](domain-decoupling-attack-2608.00643.md) (95.8% of probed domains); SNI ≠ IP |
| DNS-aware IP allowlists | Cilium `toFQDNs`, Fly Sprites, AWS resolved-domain | protocol-agnostic name-based allow | shared IPs admit every co-hosted tenant; assumes trusted DNS |
| DNS allowed or "filtered" | Modal, [AgentCore SANDBOX mode](unit42-agentcore-sandbox-dns-escape.md) | — | DNS tunnelling (Unit 42 got a shell out of AgentCore; CVE-2025-55284) |
| Resolve-then-check IP (anti-SSRF) | [Smokescreen](stripe-smokescreen.md), srt, Codex | internal and metadata addresses | rebinding between check and connect ([SiYuan GHSA](siyuan-dns-rebinding-toctou-ghsa.md); Codex README admits it) |
| Placeholder secrets swapped at the proxy | srt, Docker Sandboxes, Vercel, microsandbox, Claude Code, Codex SigV4, [Deno](deno-sandbox-secrets.md), Cloudflare, [Fly tokenizer](fly-tokenizer.md), [Azure secretRef](azure-foundry-hosted-agent-egress.md) | theft of the key | data still leaves under the attacker's key or to other hosts (Claude Pirate; Deno open by default) |
| No route except a loopback proxy | srt on Linux, Seatbelt localhost-only, [MXC](mxc-process-container-networking.md), Docker Sandboxes | proxy-unaware tools, UDP, IPv6 (they fail rather than bypass) | partial redirection leaks UDP/DNS/QUIC ([E2B BYOP](e2b-byop-tcp-only.md)) |
| Cloud-level controls | AWS Network Firewall + DNS Firewall + VPC endpoints, [GCP VPC-SC](gcp-vpc-service-controls.md), [Azure managed VNet](azure-foundry-managed-virtual-network.md) + Private Link | resource- and account-bound egress (VPC-SC, Private Link) | FQDN rules stay host-granular; VPC-SC doesn't cover third-party internet APIs |
| Rendered markdown images | chat UIs (Copilot Chat, Bard, GitLab Duo) | — | [CamoLeak](legit-camoleak-copilot-chat.md) (one signed Camo URL per character, CVSS 9.6); fix: stop rendering images |

## Synthesis

**The root limit is the protocol.**
- HTTP CONNECT ([RFC 9110](rfc9110-http-connect.md)) tells the proxy only
  `host:port`, so every proxy-allowlist sandbox grants access *by host*, not *by
  operation or account*. In Anthropic's words: "Network access is granted by host,
  not by operation."
- The useful internet is full of attacker-writable hosts: storage buckets, gists,
  wikis, webhooks, translation proxies. Allowing `github.com` allows `git push`.
  Allowing `api.anthropic.com` allows uploading to *someone else's* account.
- SNI filtering is weaker still. Fronting works on most CDNs, ECH hides the name,
  and shared edge IPs admit every co-hosted tenant.
- DNS is a channel wherever it resolves.

**Better designs bind egress to identity and operation, not names:**
- Smokescreen's per-role ACLs.
- Codex's method/path hooks under TLS interception.
- GCP VPC Service Controls, which refuse an attacker's bucket even on an allowed
  API host.
- Fly's tokenizer, which seals a secret to one host and one client.
- Claude Code's GitHub proxy, which limits a session to its own repos and forbids
  tag pushes and branch deletion, though it still can't pin which branch.
- Google's Agent Compute Engine (in [../cloud-agent-platforms/](../cloud-agent-platforms/google-agent-compute-engine.md)),
  which removes the network interface entirely and routes everything through a
  broker.

The convergent pattern of a **placeholder inside and the real secret swapped at
the proxy** stops key *theft* but not data *exfiltration*. That is why the
data-flow designs in [../in-process/](../in-process/README.md) exist.
