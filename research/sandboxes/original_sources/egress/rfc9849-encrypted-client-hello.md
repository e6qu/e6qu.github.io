---
title: "RFC 9849: TLS Encrypted Client Hello"
url: https://www.rfc-editor.org/rfc/rfc9849.html
authors: E. Rescorla, K. Oku (Fastly), N. Sullivan, C. A. Wood (Apple); IETF TLS WG
date: 2026-03 (RFC published 2026-03-03; WG approval mid-2025)
accessed: 2026-11-22
kind: spec
---

## Summary
ECH encrypts the "inner" ClientHello, including the real SNI and ALPN, under a public key the
server publishes (usually in DNS HTTPS records). On the wire only an "outer" ClientHello is
visible, whose SNI is the provider's shared `public_name`. For agent sandboxes that filter egress
by plaintext SNI (E2B, Modal's domain allowlist, AWS Network Firewall `TLS_SNI`), ECH turns the
filtered name into the CDN's public name, which says nothing about the real target. The RFC names
SNI-filtering middleboxes as the passive observers it is designed to defeat.

## Key points
- Client-facing vs backend server. The client-facing server decrypts the ECH extension and
  forwards the inner hello; if it can't, it completes the handshake on the outer hello
  ("shared" vs "split" mode).
- The outer `server_name` SHOULD carry the ECHConfig `public_name` (§6.1), so many sites behind one
  provider share one visible name.
- §10.1: "A middlebox that filters based on plaintext packet contents is one example of a passive
  attacker." GREASE ECH gives cover so real ECH doesn't "stick out" (RFC 8744's requirement).
- §8.1.2: TLS-terminating proxies that don't support ECH "act as if connecting to the
  ClientHelloOuter server_name". A MITM proxy that terminates TLS still sees the real target in
  the HTTP layer. Only *passive* SNI filters lose visibility.
- §8.2: SNI-dependent functions such as load balancing "may no longer function properly without
  updates".
- Deployment (secondary, checked via search only): Firefox enables ECH by default since v119
  (with DoH). Cloudflare announced ECH in 2023; its docs say it is on by default for Free zones.
  Chrome support since ~v117. **Not verified in primary sources here.**

## Excerpts
> "A middlebox that filters based on plaintext packet contents is one example of a passive attacker." — §10.1
> "the proxy will act as if connecting to the ClientHelloOuter server_name, which SHOULD match the public name." — §8.1.2

## Relevance to the talk
Explains why Modal's docs say its SNI allowlist has "no ECH support"
([note](../agent-sandboxing/modal-sandboxes.md)) and why SNI filtering is a temporary measure: the
web is standardising on hiding exactly the field these filters read. Code that controls its own
TLS stack can opt into ECH (our note: curl has experimental ECH support in some builds; not
checked here). Defences (our suggestion): terminate TLS at the proxy, or drop handshakes carrying
the ECH extension and filter HTTPS-record lookups. The 2026 Domain Decoupling paper
shows ECH also defeats inline-IPS SNI blocking
([domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md)).
