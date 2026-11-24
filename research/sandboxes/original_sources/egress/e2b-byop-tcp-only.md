---
title: "Bring your own proxy (E2B documentation, Network)"
url: https://docs.e2b.dev/network/byop
authors: E2B
date: living documentation, read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
E2B lets customers route a sandbox's outbound TCP through their own SOCKS5 proxy, configured from
outside the VM so code inside "can't see or bypass the proxy". The page states clearly what this
transparent redirection does *not* cover: UDP, which includes DNS and QUIC/HTTP-3, is not
tunnelled. It leaves the sandbox directly, governed only by E2B's own allow/deny lists. It is a
small, concrete example of the general failure mode where non-HTTP or non-TCP traffic skips the
proxy.

## Key points
- `network.egressProxy` at creation or via `updateNetwork`; no client-side proxy flags.
  Hostnames are passed to the customer's proxy for resolution; IP literals are sent as IPs.
- "TCP only. UDP based traffic, including DNS and QUIC or HTTP/3, is not tunneled." That traffic
  is subject only to `allowOut`/`denyOut`.
- Filtering happens before tunnelling (denied traffic never reaches the BYOP proxy), and so does
  header injection / workload-identity token resolution.
- An HTTPS request to a bare IP is blocked before BYOP: "no TLS SNI and no IP allowance". E2B's
  domain rules depend on SNI (see [e2b-runtime.md](../agent-sandboxing/e2b-runtime.md)).
- Fails closed: if the proxy is unreachable or isn't SOCKS5, connections fail.
- Footgun: `updateNetwork` replaces the whole config, so omitting the proxy clears it.

## Excerpts
> "TCP only. UDP based traffic, including DNS and QUIC or HTTP/3, is not tunneled." — Bring your own proxy

## Relevance to the talk
The "IPv6 or non-HTTP protocols escaping a proxy" row, from a vendor's own docs. Compare designs
with *no route* except the proxy (srt on Linux: no network namespace; Codex/MXC: WFP or Seatbelt
allows only the loopback proxy; Docker Sandboxes: all TCP via the host proxy, UDP and ICMP blocked), where a proxy-unaware or
UDP client simply fails. Here, transparent redirection of one protocol leaves the others to a
separate rule set. The DNS half is the AgentCore story
([unit42-agentcore-sandbox-dns-escape.md](unit42-agentcore-sandbox-dns-escape.md)). Other vendor
docs found in search make similar statements: CubeSandbox redirects only ports 80/443, Telnyx
refuses IPv6 (not read in full).
