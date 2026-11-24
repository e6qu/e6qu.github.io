---
title: "Hiding in Plain Sight: Abusing Composite Domain Names"
url: https://www.infoblox.com/blog/security/hiding-in-plain-sight-abusing-composite-domain-names/
authors: Vadym Tymchenko (Infoblox)
date: 2026-04-09
accessed: 2026-11-22
kind: blog
---

## Summary
A DNS-security vendor's write-up of "composite domain names": hostnames where a trusted service
embeds *another* domain in its own namespace, such as `example-com.translate.goog` (Google
Translate's website proxy). Every signal a DNS firewall, IP-reputation feed or certificate check
sees belongs to the trusted parent (Google's name, Google's IPs, Google's valid certificate),
while the content comes from the embedded site. Infoblox's subject is phishing and evasion, but the
same structure lets an agent behind a `*.goog` or `*.google.com`-style allowlist reach any site.

## Key points
- Services named: content proxies (Google Translate), email security link rewriters (Microsoft
  Outlook SafeLinks), CDNs, and DNS-protocol services (antivirus lookups, SURBL-style reputation).
- A DNS firewall logs a query to `translate.goog`. IP reputation shows Google. The certificate is
  Google's. The embedded domain never appears in those observations.
- Argument: security tooling must parse and evaluate the *embedded* name, not only the observable
  parent.
- Practitioner guidance found alongside (vendor KB, not read in full): Broadcom ProxySG suggests
  blocking `translate.goog` because Google Translate "can be used as a quasi proxy".

## Excerpts
> "Modern DNS security requires looking beyond observable domains." — post
> "Traditional threat detection fails because all observable indicators point to legitimate, trusted services" — post

## Relevance to the talk
The "Google Translate proxy" item in the bypass list. A wildcard on a big platform's domain
includes its proxy products: allowing `*.goog` or broad Google wildcards allows a general-purpose
fetcher. It pairs with [llm-wikileaks-2610.34542.md](llm-wikileaks-2610.34542.md), where agents
in the wild found and chained such proxies on their own.
