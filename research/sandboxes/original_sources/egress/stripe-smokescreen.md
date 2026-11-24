---
title: "smokescreen: A simple HTTP proxy that fogs over naughty URLs"
url: https://github.com/stripe/smokescreen
authors: Stripe
date: repository created 2016-07-01; README read at HEAD (pushed 2026-11-18); v2 ACL format current
accessed: 2026-11-22
kind: repo
---

## Summary
Smokescreen is Stripe's production egress proxy for its own outbound traffic (for example
webhooks). It came years before AI agents, but it already holds the two ideas that agent egress
proxies keep rediscovering. First, the policy is keyed on *who is asking*: each client presents an
mTLS certificate that maps to a role, and each role has its own hostname ACL. Second, a hostname
is resolved and the *resulting IP* is checked, so an allowed name cannot be aimed at internal
addresses. It is the reference design for an authenticated egress gateway.

## Key points
- HTTP CONNECT proxy; it handles most of Stripe's traffic to the outside world.
- Clients connect over mTLS. Smokescreen checks the certificate against configured CAs/CRLs and
  derives a role, by default from the certificate's common name; `RoleFromRequest` can be replaced
  (the README's example uses the cert's OrganizationalUnit).
- The ACL is YAML (`version: v2`): one entry per service with an action (`open`, `report`,
  `enforce`), allow/deny lists, a `default` for unlisted roles and `global` rules. Wildcards may not
  cross public suffixes by default, and only one wildcard is allowed per glob.
- Each requested hostname is resolved and must be a publicly routable address. Operators can add
  IP/CIDR allow/deny rules; `--unsafe-allow-private-ranges` is off by default. A self-connection
  guard blocks the proxy's own interfaces.
- Documented caveat: hostname deny rules act on names, not destinations. A role in `open` mode can
  reach a denied site by its IP address, so the README recommends allowlists over denylists.
- An explicit allow can override the default IP safety blocks, so allow rules need care.
- v2 has no release tag yet; v1 is the stable Go API.

## Excerpts
> "It also resolves each domain name that is requested, and ensures that it is a publicly routable IP address and not an internal IP address." — README
> "In typical usage, clients contact Smokescreen over mTLS." — README

## Relevance to the talk
Shows that "egress via an authenticated gateway with per-identity policy" is a mature pattern
(about ten years in production at Stripe), not something new for AI. Agent sandboxes mostly kept
the hostname ACL and dropped the identity: the proxy usually knows which *sandbox* is calling, but
not which *task* or *principal* the request is for. Compare
[codex-network-proxy-readme.md](codex-network-proxy-readme.md) and Anthropic's `srt`
([note](../agent-sandboxing/anthropic-sandbox-runtime.md)), which also resolve and drop
private/metadata addresses.
