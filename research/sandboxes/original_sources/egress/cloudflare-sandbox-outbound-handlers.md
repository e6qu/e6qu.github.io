---
title: "Outbound traffic (Cloudflare Sandbox SDK guide) and changelog 'Secure credential injection and dynamic egress policies for Sandboxes'"
url: https://developers.cloudflare.com/sandbox/guides/outbound-traffic/
authors: Cloudflare
date: changelog 2026-04-13 (https://developers.cloudflare.com/changelog/post/2026-04-13-sandbox-outbound-workers-tls-auth/); guide last modified 2026-09-30 (covers SDK 0.x)
accessed: 2026-11-22
kind: docs
---

## Summary
Cloudflare's sandboxes (microVM containers driven by Workers and Durable Objects) route egress
through *outbound handlers*: trusted Worker code that runs on the same machine, outside the
sandbox, and sees every HTTP request (and HTTPS, since April 2026, via a per-sandbox ephemeral CA).
Handlers are general programs, not a static list. They can allow or deny by host, attach secrets
taken from Workers bindings, look up per-instance permissions using `ctx.containerId`, and be
swapped at runtime. This is the most programmable form of the TLS-intercepting credential proxy.

## Key points
- `deniedHosts` is checked first; `allowedHosts` enables deny-by-default. Then instance rules,
  per-host handlers (`outboundByHost`), and catch-all `outbound` handlers. Unmatched traffic follows
  the internet setting.
- HTTPS interception needs `interceptHttps: true` (default false). The sandbox gets an ephemeral
  CA that the runtime tries to trust automatically in common runtimes.
- Credential injection: the handler adds the auth header; "No token is ever passed into the
  sandbox" (changelog). Secrets can differ per instance and rotate immediately.
- Per-sandbox identity: `ctx.containerId` lets a handler pick per-tenant keys or permissions,
  binding the outbound credential to *which sandbox* is asking.
- Defaults: internet **on**. With `enableInternet = false`, only explicitly allowed hosts on ports
  80/443 plus DNS to Cloudflare's resolvers get out (so DNS remains a path).
- Runtime policy: `setOutboundByHost()` and similar swap handlers while the sandbox runs.

## Excerpts
> "Outbound handlers are programmable egress proxies that run on the same machine as the sandbox." — guide
> "No token is ever passed into the sandbox." — changelog, 2026-04-13

## Relevance to the talk
Shows where the design is heading. The egress policy stops being a domain list and becomes *code
outside the sandbox* that can apply method/path/identity rules and mint or inject credentials per
request. That is the "authenticated gateway" from [stripe-smokescreen.md](stripe-smokescreen.md)
with TLS termination added. The base sandbox note is
[cloudflare-sandbox-sdk.md](../agent-sandboxing/cloudflare-sandbox-sdk.md).
