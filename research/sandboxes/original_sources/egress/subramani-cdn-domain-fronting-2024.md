---
title: "Measuring CDNs susceptible to Domain Fronting"
url: https://arxiv.org/abs/2310.17851
authors: Karthika Subramani, Roberto Perdisci, Pierros Skafidas (University of Georgia)
date: arXiv v1 2023-10-27, v3 2023-11-13; published in WWW '24 (ACM Web Conference 2024)
accessed: 2026-11-22
kind: paper
---

## Summary
Domain fronting sends a TLS ClientHello whose SNI names an innocent, allowed domain on a CDN,
then puts the real target in the encrypted HTTP `Host` header. The CDN routes by Host. The
technique was named and measured by Fifield et al. in 2015 ("Blocking-resistant communication
through domain fronting", PoPETs 2015, https://doi.org/10.1515/popets-2015-0009). After the big
providers announced blocks around 2018, the folk belief was that fronting was dead. Subramani et
al. built an automated tester and found fronting still worked on **22 of the 30 CDNs** they tested,
including Fastly and Akamai.

## Key points
- Method: passive and active DNS analysis to find CDN-hosted domains, then automated SNI/Host
  mismatch tests per CDN.
- Result: fronting is feasible on 22/30 CDNs; Akamai and Fastly are named as major providers still
  vulnerable. (The abstract does not list the other 20.)
- Fifield 2015 definition: fronting "hides the remote endpoint of a communication" by using one
  domain at the outer layers and another inside HTTPS. Co-authors came from Psiphon and Lantern (Brave New Software). Our recollection is that the paper
  covers deployments in Tor meek, Psiphon and Lantern over App Engine, CloudFront and Azure (the
  paper page returned 403, so this is not re-read).
- Microsoft's own stance, for context (separate source: Azure Networking Blog, "Prohibiting Domain
  Fronting with Azure Front Door and Azure CDN Standard from Microsoft (classic)", 2023-12-13,
  https://techcommunity.microsoft.com/t5/azure-networking-blog/prohibiting-domain-fronting-with-azure-front-door-and-azure-cdn/ba-p/4006619).
  Front Door and CDN-classic return **421 Misdirected Request** (`SSLMismatchedSNI`) when SNI and
  Host belong to domains in *different subscriptions*. Enforcement slipped from 2023-11-08 to
  2024-01-22. Mismatches *within the same subscription* are still allowed.
- Status in 2026 is mixed and poorly measured. Secondary sources say CloudFront, Google Cloud CDN,
  Azure and Cloudflare block classic fronting; we found no independent 2025–26 measurement.
  **Unverified.**

## Excerpts
> "22 out of 30 CDNs that we tested" — abstract (as rendered on arXiv)
> "hides the remote endpoint of a communication" — Fifield et al. 2015, abstract

## Relevance to the talk
Every SNI-based agent egress filter carries a fronting caveat: Anthropic `srt` ("in some cases it
may be possible to bypass the network filtering through domain fronting"), Modal ("domain fronting
possible"), E2B. This paper is the evidence that the caveat is real for widely used CDNs. A
TLS-terminating proxy closes it, because it compares Host with SNI/CONNECT. An SNI-only filter
does not. The related shared-edge problem, which even consistent SNI+Host doesn't fix, is in
[domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md).
