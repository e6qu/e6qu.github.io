---
title: "Domain Decoupling Attack: Exploiting the Validation Gap Between Protective DNS and Shared Edge Routing"
url: https://arxiv.org/abs/2608.00643
authors: Weizhe Wang, Minhong Dong, Jinhao Li, Lyuchuan Wei, Yao Zhang, Qiang Hu, Qi Guo, Guangquan Xu, Bin Wu
date: arXiv v1 2026-08-01, v2 2026-10-26 (preprint)
accessed: 2026-11-22
kind: paper
---

## Summary
A large measurement of a gap that every DNS-derived egress allowlist shares. Protective DNS (or a
DNS-aware firewall) approves an *IP* because an allowed name resolved to it. Shared edges (CDNs,
but also many non-CDN hosts) route by the *tenant name* in SNI/Host. An attacker resolves an
allowed "anchor" name, gets the edge IP approved, then connects to it with a hidden tenant's name
as *both* SNI and Host. SNI and Host agree, so this is not fronting, and mismatch checks don't
fire. The paper finds the path open for most domains it probed.

## Key points
- Scale: 1,069,048 domains and 18,025,068 successful probes. 95.8% of domains accepted an external
  SNI; 84.6% returned the named tenant's content.
- Exposure: 99.26% of 506,763 CDN domains and 92.75% of 562,285 non-CDN domains.
- 666,413 exposed domains sit in cross-tenant components; for 54,069 cross-tenant non-CDN
  addresses, 97.7% have a confirmed path to another tenant.
- "None of the tested defenses bind tenant identity to the DNS-approved name."
- Cleartext inline IPS can block on SNI, but ECH hides the SNI and defeats that. Windows Zero
  Trust DNS (ZTDNS) permits stayed reusable in both the cleartext and ECH cases, which the authors
  say enables C2, exfiltration and censorship circumvention.

## Excerpts
> "None of the tested defenses bind tenant identity to the DNS-approved name." — abstract

## Relevance to the talk
The formal version of the shared-IP weakness in [Cilium `toFQDNs`](cilium-dns-and-l7-policy.md),
Fly.io Sprites' DNS-based rules, Modal's CIDR lists and AWS's resolved-domain check. Any scheme
that turns "allowed name" into "allowed IP" lets an agent reach every other tenant on that IP.
The fix has to happen at the layer that sees the name actually used: an SNI/Host check against the
allowed name (which ECH then removes), or a terminating proxy. Preprint; numbers not
independently reproduced.
