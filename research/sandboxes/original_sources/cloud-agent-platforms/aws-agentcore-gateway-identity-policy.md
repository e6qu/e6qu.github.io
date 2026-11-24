---
title: "Amazon Bedrock AgentCore Gateway", "AgentCore Identity" (overview and features) and "Policy in Amazon Bedrock AgentCore" (core concepts) — AWS docs
url: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/policy.html
authors: Amazon Web Services
date: living documents; read 2026-11-22 (Policy preview 2025-12, GA 2026-03-03 per AWS What's New; Dogwood support added mid-2026)
accessed: 2026-11-22
kind: docs
---

## Summary
These are the three non-compute pieces of AgentCore that mediate what an agent can *do* rather than where its code runs. **Gateway** is a managed MCP/A2A/model gateway: it turns APIs, Lambda functions, OpenAPI and Smithy specs into MCP tools, and it handles both inbound authentication (who is the agent/user) and outbound authentication (credential injection per tool). **Identity** provides workload identities for agents plus a KMS-encrypted token vault for OAuth tokens and API keys. **Policy** is a Cedar (and now Dogwood) policy engine attached to a Gateway. It intercepts every tool call, with default-deny and forbid-wins semantics. The temporal Dogwood extension and its caller-controlled session-ID weakness are covered in `../in-process/dogwood-temporal-policies.md`, and Cedar itself in `../in-process/cedar-oopsla2024.md`. This note adds only the enforcement architecture.

## Key points
- **Gateway as the enforcement point:** "Policy in AgentCore intercepts all agent traffic through Amazon Bedrock AgentCore Gateways and evaluates each request against defined policies in the policy engine before allowing tool access." Enforcement happens "at the boundary outside of agent's code".
- **Gateway credential injection:** Gateway "Handles credential injection for each tool". Outbound OAuth and API keys are held by the gateway and Identity, so an agent that calls tools through the gateway never holds the downstream secret. Lambda interceptors can inspect or transform requests and responses.
- **Bypass warning (Runtime best practices):** "These controls only protect you if all traffic actually flows through the gateway. If a caller can reach the runtime directly, it bypasses the gateway's policies, guardrails, and interceptors entirely." The fix is a resource policy or `allowedWorkloadConfiguration` so that the runtime accepts calls only from the gateway. The same logic applies outbound: an agent in a `PUBLIC`-mode runtime can call the APIs directly with any credentials it holds.
- **Cedar request shape:** The principal is `AgentCore::OAuthUser` (from the JWT `sub`, with claims as tags) or `AgentCore::IamEntity`. The action is the tool, the resource is the gateway, and the context is the tool input. "The policy engine automatically generates a schema from the gateway's tool definitions." "The engine enforces default-deny and forbid-wins semantics automatically."
- **Natural-language authoring:** English is turned into candidate Cedar, validated against the tool schema, then put through automated-reasoning analysis that flags "overly permissive, overly restrictive, or contain[ing] conditions that can never be satisfied". It is priced at $0.13 per 1,000 input tokens. Authorization costs $0.000025 per request, and the first 100 temporal policies per engine carry no authorization charge.
- **Guardrails as information providers:** Bedrock Guardrails scores (content safety, prompt attack) can be conditions inside a Dogwood `when guardrails { … }` block.
- **Identity, workload identity:** Each agent has a workload-identity ARN in a directory. The agent presents a workload access token, obtained via `GetWorkloadAccessTokenForJWT` (preferred) or `…ForUserId` (an opaque string, "use it only for development"), to retrieve OAuth tokens or API keys for a specific user from the vault.
- **Token vault:** Stores OAuth 2.0 tokens, client credentials and API keys, "encrypted using either customer-managed or service-managed AWS KMS keys", with every access "validated independently, even from callers within the same trust domain … to protect end-user data from malicious or misbehaving agent code". It supports 2LO (client credentials) and 3LO (authorization code, user consent), with built-in providers for Google, GitHub, Slack, Salesforce and Atlassian.
- **Where the token lands:** The SDK decorators `@requires_access_token` / `@requires_api_key` "automatically handle credential retrieval and injection" *into agent code*. So for code running in Runtime the raw third-party token *is* in the microVM's memory for the call. This differs from the proxy-substitution pattern (Codex cloud, Vercel, Docker Sandboxes) where the sandbox only ever sees a placeholder. *(This reading follows from the decorator design; AWS does not state it in these words.)* Only Gateway-mediated tool calls keep the secret fully outside.
- **Identity pricing:** $0.010 per 1,000 token or API-key requests for non-AWS resources, and free when used via Runtime or Gateway.

## Excerpts
> "Every agent action through Amazon Bedrock AgentCore Gateway is intercepted and evaluated at the boundary outside of agent's code - ensuring consistent, deterministic enforcement that remains reliable regardless of how the agent is implemented." (Policy, Key benefits)

> "This extra security mechanism is necessary to protect end-user data from malicious or misbehaving agent code." (Identity, Secure credential storage)

> "If a caller can reach the runtime directly, it bypasses the gateway's policies, guardrails, and interceptors entirely." (Runtime security best practices)

## Relevance to the talk
This is AWS's answer to "the sandbox can't see intent": move authorization out of the VM to a reference monitor at the tool-call boundary (Gateway plus Cedar/Dogwood), and keep long-lived secrets in a vault. It is complete mediation only if the gateway is the sole path. AWS's own docs flag the bypass, and an agent in a `PUBLIC` runtime with an MMDS role or an injected token has other paths. A good slide pairing is the microVM (contain the code) with the Gateway policy (constrain the actions), and why you need both.
