---
title: "Internet access", "Restricting public access", "Secured access", "Injecting secrets into requests" and "Billing & limits" (E2B documentation)
url: https://docs.e2b.dev/network/internet-access
authors: E2B
date: living docs, read 2026-11-22 as Markdown (append `.md`); restrict-public-access page cites a 2026-10-30 default change; other pages carry no dates
accessed: 2026-11-22
kind: docs
---

## Summary
E2B's network pages describe how its Firecracker sandboxes filter egress, and they are unusually
precise about the gaps. Outbound is open by default. Domain allow rules match the HTTP `Host` header
on port 80 and TLS SNI on 443, and need `denyOut: 0.0.0.0/0` alongside. Any domain rule silently opens
**all traffic** to the DNS server (8.8.8.8 by default), and this survives putting 8.8.8.8 in
`denyOut`. Secrets are injected by a TLS-intercepting egress proxy, keyed on host. Inbound sandbox URLs
were public by default until 2026-10-30, when new projects switched to private (token required).
Plan limits cap continuous runtime (1 h Hobby, 24 h Pro), but pausing resets the clock, and paused
sandboxes are kept indefinitely.

## Key points
- **Default egress:** "Every sandbox has outbound access to the internet by default."
  `allowInternetAccess: false` equals `denyOut: ['0.0.0.0/0']`.
- **Rules:** `allowOut` takes IPs, CIDRs or domains (wildcards allowed); `denyOut` takes no domains.
  "**allow rules always take precedence** over deny rules." Domain filtering works only for HTTP on 80
  (Host) and TLS on 443 (SNI); other ports are CIDR-only; QUIC/HTTP3 is unsupported. Catch-all `'*'`
  matches any Host/SNI. The docs warn that allowing a hostname on a CDN or shared object store "can
  also permit access to other destinations on the same endpoint" (domain fronting).
- **DNS hole:** with any domain in `allowOut`, all traffic to 8.8.8.8 is allowed, "not only DNS".
  `dnsServers` (up to 10 IPv4) or `[]` changes this; with `[]` the proxy routes by Host/SNI, so names
  can be pinned in `/etc/hosts`. Changing `updateNetwork` without `dnsServers` **resets it to 8.8.8.8**.
- **Firewall quirk:** a denied TCP connect may appear to succeed because the firewall accepts it first
  ("no packets actually reach the destination"). Limit of 1,500 concurrent outbound TCP connections.
- **Fixed blocks:** private and link-local ranges (10/8, 100.64/10, 127/8, 169.254/16, 172.16/12,
  192.168/16) are blocked outside the guest. But `169.254.169.254` "still answers: it is the sandbox's
  own Firecracker metadata service" (MMDS), which "holds no account, project or other-sandbox data".
- **Credential injection (public beta):** `network.rules` per host with `transform.headers`; values
  from `Secret.fill(name)` or workload-identity placeholders `${e2b.identity.tokens.<name>}` resolved
  outside the sandbox on each request. HTTPS only, via an E2B CA added to the system bundle. Limits:
  10 rule domains per sandbox, 20 headers per rule. Injection is per destination host: "Every process in
  the sandbox that sends an HTTPS request to that host gets the secret". Unresolved secrets **fail open
  for traffic**: the request is forwarded with the header dropped.
- **Inbound URLs:** `https://<port>-<sandboxID>.<domain>`; private mode needs header
  `e2b-traffic-access-token`. "Since October 30, 2026, newly created projects default to private
  sandbox traffic"; older projects stay public unless changed. Older Python SDKs (<2.60.0) sent
  `allow_public_traffic=True` implicitly. The Code Interpreter port 49999 "runs any code sent to it", so
  a public URL to it is remote code execution for anyone holding the URL.
- **Controller auth:** `envd` API needs `X-Access-Token` (secure access). It is default since SDK
  v2.0.0 and forced since 2.51.0; before it, "anyone with a sandbox ID can access the controller APIs".
- **Plans (Billing & limits):** Hobby $0 + $100 one-time credit: 8 vCPU / 8 GiB / 10 GiB disk, **1 h**
  continuous runtime, **10** concurrent, 1 creation/s. Pro $150/mo: 24 h, 100 concurrent (+500 per
  $500/mo add-on, up to 1,100), 5 creations/s. Enterprise custom ($3,000/mo minimum per pricing page).
  "Max continuous runtime is the time a sandbox can run **without being paused**"; paused retention is
  unlimited. Per-second billing: $0.000014/vCPU-s, $0.0000045/GiB-s, disk free (https://e2b.dev/pricing).
  Docs disagree on defaults: billing FAQ says 2 vCPU / 512 MiB, pricing page says 2 vCPU / 4 GiB. The
  pricing page lists add-ons as 600 for $650 and 1,100 for $1,150, which conflicts with the docs.

## Excerpts
> "Domain-based filtering only works for HTTP traffic on port 80 (via Host header inspection) and TLS traffic on port 443 (via SNI inspection)." — Internet access

> "This covers **all traffic to `8.8.8.8`**, not only DNS. It isn't listed in `allowOut`, and adding `8.8.8.8` to `denyOut` doesn't remove it." — Internet access

> "On a sandbox with public access, anyone who has the port `49999` URL can run code in the sandbox and read its files." — Restricting public access

> "When a reference can't be resolved ... the proxy fails open for traffic" — Injecting secrets

## Relevance to the talk
A vendor documenting its own egress leaks: SNI/Host matching, a resolver that gets all traffic,
CDN co-tenancy, and a fail-open secret proxy. It also shows a late flip of a default: sandbox URLs
were bearer-by-URL until October 2026. That makes it useful for "name-based egress is a filter, not a
boundary" and for "check the default, then check when the default changed".
