---
title: "Introducing Deno Sandbox (blog) and Deno Sandbox security docs"
url: https://deno.com/blog/introducing-deno-sandbox
authors: Ryan Dahl (Deno); docs at https://docs.deno.com/sandbox/security/
date: 2026-02-03
accessed: 2026-11-22
kind: blog
---

## Summary
Deno's hosted sandboxes for agent-generated code (lightweight Linux microVMs on Deno Deploy) were
launched with the placeholder-secret pattern as a headline feature. Each secret is declared with
the hosts it may be sent to. Inside the VM the environment variable holds only a placeholder, and
the real value is substituted by an outbound proxy ("similar to coder/httpjail") only on requests to
an approved host. A separate `allowNet` allowlist blocks other hosts at the VM boundary, but by
default outbound access is unrestricted.

## Key points
- "In Deno Sandbox, secrets never enter the environment." The real key "materializes only when the
  sandbox makes an outbound request to an approved host."
- `allowNet`: exact hosts (optionally with port), `*.example.com` wildcards, IPv4/IPv6 literals.
  Unlisted hosts are blocked. **Default: unrestricted outbound** if `allowNet` is omitted.
- The docs don't say how substitution handles HTTPS (TLS interception or not), whether secrets are
  scrubbed if echoed back in responses, or whether rules apply to non-HTTP protocols.
- Willison's write-up (2026-02-03) shows placeholders of the form
  `DENO_SECRET_PLACEHOLDER_…` (secondary).

## Excerpts
> "If prompt-injected code tries to exfiltrate that placeholder to `evil.com`? Useless." — blog
> "Any request to an unlisted host gets blocked at the VM boundary." — blog

## Relevance to the talk
A compact illustration of what host-bound secrets do and don't stop. The placeholder is useless at
`evil.com`. But with `allowNet` left at its default, the *data* (as opposed to the key) can still
go anywhere. And code can call an approved host with the *attacker's* own key written literally into
the request. With no placeholder to swap, the request passes and the data lands in the attacker's
account (the Claude Pirate shape:
[incident](../incidents/2025-10-claude-pirate-files-api-exfil.md)). Secret binding protects the
credential, not the data.
