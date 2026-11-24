---
title: "Stateful domain list rule groups in AWS Network Firewall"
url: https://docs.aws.amazon.com/network-firewall/latest/developerguide/stateful-rule-groups-domain-names.html
authors: Amazon Web Services
date: living documentation, read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
AWS Network Firewall is the usual cloud-level egress control for agent runtimes placed in a
customer VPC, for example Bedrock AgentCore in VPC mode (see
[unit42-agentcore-sandbox-dns-escape.md](unit42-agentcore-sandbox-dns-escape.md)). Its domain
lists match the name the client *claims*: TLS SNI for HTTPS and the `Host` header for HTTP. They do
not look at the destination IP. AWS says plainly that SNI/Host can be manipulated, and now offers
`AWS_ROUTE_53_RESOLVED_DOMAIN`: an allow then requires that the destination IP was actually
resolved (via Route 53 Resolver) for the allowed name.

## Key points
- Domain list entries: exact names, or a leading `.` meaning the domain and all subdomains.
- Target types: `TLS_SNI` (HTTPS only), `HTTP_HOST` (HTTP only), `AWS_ROUTE_53_RESOLVED_DOMAIN`
  (IP layer, all protocols).
- No out-of-band DNS: the firewall "uses the SNI or host header, not the IP addresses".
- With an allowlist combining `TLS_SNI`/`HTTP_HOST` and `AWS_ROUTE_53_RESOLVED_DOMAIN`, both must
  match. A spoofed Host/SNI pointing at an IP "never resolved for that domain" fails.
- Pitfalls: a resolved-domain-only allowlist is additive (no default drop). `Reject` with
  resolved-domain matches TCP only, so non-TCP to that IP is neither rejected nor dropped. Domain
  lists can't be scoped to a single protocol or port (use Suricata rules for that). `HOME_NET`
  must be widened for traffic from other VPCs through a central firewall.
- Related AWS controls used alongside, for agent runtimes: Route 53 Resolver DNS Firewall (DNS
  exfiltration) and VPC endpoint policies (which S3 buckets/accounts are reachable). Benchling's
  AgentCore case study (AWS ML blog, https://aws.amazon.com/blogs/machine-learning/how-benchling-secured-multi-tenant-ai-agents-with-amazon-bedrock-agentcore/; seen only via search summary, not read in full) and AWS's response to Unit 42 recommend both.

## Excerpts
> "It uses the SNI or host header, not the IP addresses, when evaluating domain list rule groups." — Match settings
> "If you want to inspect IP addresses, to mitigate situations where the SNI or host headers have been manipulated, write separate rules for that" — Match settings

## Relevance to the talk
A hyperscaler documenting, in its product docs, that SNI filtering trusts the client, and shipping
a "the IP must belong to the name" check as the fix. The same check is missing from most agent
sandboxes' SNI filters (E2B, Modal: see [modal-sandboxes.md](../agent-sandboxing/modal-sandboxes.md)).
It still doesn't help when the allowed name and the attacker share an edge IP
([domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md)).
