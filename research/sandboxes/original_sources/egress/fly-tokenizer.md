---
title: "tokenizer (superfly/tokenizer)"
url: https://github.com/superfly/tokenizer
authors: Fly.io
date: repository created 2023-04-14; README read at HEAD (pushed 2026-11-18)
accessed: 2026-11-22
kind: repo
---

## Summary
Fly.io's credential-injecting HTTP proxy, which predates the 2025–26 wave of "placeholder secrets
swapped at the proxy" in agent sandboxes. A client never holds a plaintext third-party secret. It
holds a *sealed* blob, encrypted to the proxy's public key, that contains the credential, how to
apply it (processor), which hosts it may go to, and a digest of the client token allowed to use
it. The proxy decrypts, checks, injects and forwards over HTTPS. A stolen sealed blob is useless
without the proxy and the client token, and can only reach its allowed hosts.

## Key points
- Clients send plain HTTP to the proxy with the sealed secret in a `Proxy-Tokenizer` header and
  their client token in `Proxy-Authorization`; the proxy upgrades to HTTPS upstream, so no MITM CA
  is needed in the client.
- Host binding: `allowed_hosts` or `allowed_host_pattern` on the sealed secret. This guards against
  a compromised client sending the secret to an echo service and reading it back.
- Processors: bearer/verbatim injection, HMAC signing, AWS SigV4 re-signing, JWT-bearer exchange
  (Google service accounts), OAuth2 client credentials, GitHub App installation tokens. For OAuth
  flows the *access token* returned is also sealed, so plaintext never reaches the caller.
- Request-time parameters (destination header, format) only within allowlists set inside the
  sealed secret.
- Operational notes: assumes a secure client-to-proxy channel (e.g. VPN). Don't expose it
  publicly, because it would forward to private IPs; the README suggests a filter such as
  smokescreen. `OPEN_PROXY` is off by default. Secrets can be bound to a Fly machine (`fly-src`).

## Excerpts
> "Clients encrypt third party secrets using the proxy's public key." — README

## Relevance to the talk
The cleanest statement of the credential-at-the-proxy pattern, as infrastructure rather than as an
agent feature. It adds two things the agent sandboxes mostly lack: secrets bound to a *client
identity* as well as a host, and OAuth/App-token minting at the proxy, so even short-lived tokens
never enter the workload. Agent-era descendants: `srt` mask mode, Docker Sandboxes, Vercel,
microsandbox, Codex SigV4 substitution ([codex-network-proxy-readme.md](codex-network-proxy-readme.md)),
Claude Code network secrets, [Deno Sandbox](deno-sandbox-secrets.md),
[Cloudflare outbound handlers](cloudflare-sandbox-outbound-handlers.md).
