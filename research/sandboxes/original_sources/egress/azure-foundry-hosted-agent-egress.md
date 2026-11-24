---
title: "Control where your hosted agent connects with network egress in Foundry Agent Service"
url: https://devblogs.microsoft.com/foundry/egress-controls-hosted-agent
authors: Muzz Imam (Principal Product Manager, Microsoft Foundry)
date: 2026-09-24 (updated November 2026)
accessed: 2026-11-22
kind: blog
---

## Summary
Microsoft's GA announcement of per-agent HTTP(S) egress policy for Foundry *hosted agents*. Egress
policy is attached through the agent's RAI (responsible-AI) policy and enforced by a platform
proxy outside the agent's code. FQDN Allow/Deny rules apply first-match in order, with a default
action. Preview "Transform" rules rewrite headers (including secret references) and "Rewrite"
rules change the destination, so credential injection and redirection happen at the proxy. An Audit
mode records would-deny decisions before enforcement.

## Key points
- Rules: `ruleType: Fqdn`, action Allow/Deny, first match wins, plus a default action. Order matters
  ("an earlier Allow can prevent a later Transform from running").
- Enforced mode: an unapproved destination gets a proxy 403 and the request never reaches it.
  Audit mode logs would-deny decisions (network egress decision spans, Application Insights) but
  still runs Transform/Rewrite rules.
- Transform rules (preview) and `secretRef` (separate preview) let the proxy add credentials so the
  agent code never holds them.
- The post's own caveats: allowing a destination doesn't grant permission there (authN/authZ is
  separate); platform connectivity is allowed separately; a DNS or TLS failure is not evidence of a
  denial; keep TLS verification on; only the hosted-agent HTTP/HTTPS path is covered.
- Advice: separate policy versions for audit and enforce, because edits may not reach running
  sessions at once; test with allowed and blocked probe URLs and correlate with the destination's
  receipt logs.

## Excerpts
> "Keep destination rules outside your agent code." — post
> "Network egress controls for hosted agents are now generally available" — post

## Relevance to the talk
Another vendor arriving at the same shape in late 2026: FQDN allowlist, enforced by a proxy
outside the agent, with secrets attached at the proxy. Two touches stand out: an audit mode for
discovering what an agent really needs, and the plain statement that an allowed destination is not
an authorisation decision. Compare Claude Code's network secrets
([claude-code-cloud-environments-network.md](claude-code-cloud-environments-network.md)) and
Vercel's TLS-terminating firewall ([note](../agent-sandboxing/vercel-sandbox.md)).
