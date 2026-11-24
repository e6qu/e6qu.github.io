---
title: "RFC 9110: HTTP Semantics — Section 9.3.6 CONNECT"
url: https://www.rfc-editor.org/rfc/rfc9110.html#name-connect
authors: R. Fielding, M. Nottingham, J. Reschke (eds.), IETF
date: 2022-06
accessed: 2026-11-22
kind: spec
---

## Summary
The CONNECT method is the protocol primitive under every "domain allowlist proxy" that agent
sandboxes use (Anthropic `srt`, Codex's `codex-network-proxy`, Docker Sandboxes, Claude Code
cloud sessions). The client asks the proxy for a tunnel to `host:port`; once the proxy says yes it
just relays bytes. So without TLS interception, the proxy's whole decision rests on the
`host:port` in the CONNECT line (and on the SNI, if it bothers to look). It never sees the method,
path, headers, body or credentials.

## Key points
- CONNECT asks the recipient to set up a tunnel to the destination origin server. If that works,
  the recipient does nothing but forward data blindly in both directions until the tunnel closes.
- The request target is authority-form (`host:port`) only, with no scheme or path, so path-level
  policy is impossible without terminating TLS.
- The RFC itself warns that tunnels to arbitrary ports are risky (its example is port 25, which
  turns the proxy into a spam relay), and says proxies SHOULD restrict CONNECT to known ports or a
  configurable list of safe targets.
- Consequence for agents: a CONNECT allowlist can name *hosts* but not *operations*. That is why
  Anthropic's Managed Agents docs warn that "network access is granted by host, not by operation"
  ([note](../agent-sandboxing/anthropic-managed-agents-environments.md)). Getting finer than host
  takes TLS termination (see [codex-network-proxy-readme.md](codex-network-proxy-readme.md),
  [cilium-dns-and-l7-policy.md](cilium-dns-and-l7-policy.md)).
- The SNI inside the tunnel and the CONNECT host need not match. A proxy that checks only the
  CONNECT line can be handed `allowed.example:443` and then speak TLS with any SNI and Host to
  whatever is served at that address (the shared-edge problem: see
  [domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md)).

## Excerpts
> "The CONNECT method requests that the recipient establish a tunnel to the destination origin server" — §9.3.6
> "Proxies that support CONNECT SHOULD restrict its use to a limited set of known ports" — §9.3.6

## Relevance to the talk
The one-slide explanation of why "allow github.com" also means "allow everything github.com
accepts": a CONNECT proxy sees a hostname and nothing else. Every finer-grained design in this
folder either terminates TLS or moves the credential to the proxy.
