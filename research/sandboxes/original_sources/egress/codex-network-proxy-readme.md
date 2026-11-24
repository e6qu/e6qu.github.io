---
title: "codex-network-proxy (README)"
url: https://github.com/openai/codex/blob/main/codex-rs/network-proxy/README.md
authors: OpenAI (Codex team)
date: README first committed 2026-01-24; last changed 2026-11-16 (read at that commit)
accessed: 2026-11-22
kind: repo
---

## Summary
This is the local egress proxy that Codex runs on all three operating systems; the OS sandbox lets
the agent reach only this proxy. It goes further than a CONNECT allowlist. A "limited" mode allows
only read methods. Optional HTTPS MITM hooks match on host, method and path prefix and can strip
headers. Credential substitution swaps placeholder values (including AWS SigV4 re-signing) only
after a hook has approved the exact host, method and path. The README is also unusually frank
about what it cannot guarantee, DNS rebinding in particular.

## Key points
- HTTP proxy (default `127.0.0.1:3128`) plus SOCKS5 (default `127.0.0.1:8081`, UDP-capable).
  Listeners are clamped to loopback unless `dangerously_allow_non_loopback_proxy` is set.
- Allowlist first: with no `allow` entries, everything is blocked. Deny wins. The global `*` is
  rejected unless explicitly enabled. `*.example.com` matches subdomains only, `**.example.com`
  matches the apex too. Matching is on ASCII bytes with no IDNA conversion, so Punycode names must
  be written as Punycode.
- **Limited mode:** "only `GET`, `HEAD`, and `OPTIONS` are allowed". HTTPS CONNECT and SOCKS5 to
  :443 *require MITM* to enforce the method policy and are otherwise blocked. SOCKS5 UDP and
  non-HTTPS SOCKS5 TCP stay blocked. MITM turns on automatically in limited mode; the CA private
  key stays in proxy memory, and child processes get CA bundle env vars.
- **MITM hooks:** for example `host = "api.github.com"`, `methods = ["POST","PUT"]`,
  `path_prefixes = ["/repos/openai/"]` with action `strip_auth`. This is operation-level policy
  for a single org's repos.
- **Credential substitution:** `aws_sigv4` pairs a placeholder access key ID with real
  credentials. The workload signs with a dummy secret, and "after the exact host, method and path
  hook authorizes the request" the proxy re-signs. Header injection can require an exact whole-
  header placeholder, and fails closed on a mismatch. Body substitution uses opaque 16–256-byte
  markers with size limits. Masked presigned URLs, SigV4a and signed streams are denied.
- **Local/private protection:** with `allow_local_binding = false`, loopback/private/link-local
  addresses are blocked, and hostnames that resolve to them are blocked "even if allowlisted
  (best-effort DNS lookup)". Clients that always bypass proxies for loopback (Go's `net/http`) are
  stopped by the OS sandbox instead.
- Decisions carry machine-readable reasons (`blocked-by-denylist`, `blocked-by-method-policy`) and
  OTEL events with method, host and decision.
- **Stated limitation:** DNS rebinding cannot be fully prevented without pinning resolved IPs down
  to the transport. With hostile DNS in the threat model, enforce egress at a lower layer as well.

## Excerpts
> "In "limited" mode, only `GET`, `HEAD`, and `OPTIONS` are allowed." — Policy
> "DNS rebinding is hard to fully prevent without pinning the resolved IP(s) all the way down to the transport layer." — Limitations

## Relevance to the talk
The most complete open-source example of moving from "granted by host" to "granted by operation":
method allowlists, path-prefix hooks scoped to one GitHub org, and secrets that only appear after
the operation check. Read-only GET still leaks through query strings (see
[llm-wikileaks-2610.34542.md](llm-wikileaks-2610.34542.md)). The architecture around it is in
[openai-inside-the-codex-sandbox.md](../agent-sandboxing/openai-inside-the-codex-sandbox.md)
(DNS resolved only after approval).
