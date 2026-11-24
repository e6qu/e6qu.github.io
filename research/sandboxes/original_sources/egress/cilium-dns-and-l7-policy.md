---
title: "Cilium documentation: Layer 3 'DNS based' policies, Layer 7 HTTP policies, DNS Proxy, and 'Inspecting TLS Encrypted Connections with Cilium'"
url: https://docs.cilium.io/en/stable/security/policy/language/
authors: Cilium project (Isovalent / CNCF)
date: living documentation; read from cilium/cilium main (Documentation/security/policy/layer3.rst, layer7.rst, security/tls-visibility.rst) on 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Cilium is the most common way to get *name-based* egress policy on Kubernetes, which plain
NetworkPolicy cannot express. A `toFQDNs` rule does not really filter on names. A per-node DNS
proxy watches the DNS answers a pod receives and opens the returned *IP addresses* (as generated
CIDR rules) for that pod. Optional Layer 7 rules send traffic through Envoy and match method, path,
Host and headers. For HTTPS this needs "friendly interception" with an internal CA whose
certificates the workload must trust.

## Key points
- `toFQDNs` with `matchName` (exact) or `matchPattern` (`*` matches one label, so `*.cilium.io`
  does not match `cilium.io` or `sub.sub.cilium.io`; `**.` matches cascaded subdomains; a bare `*`
  inserts every cached DNS IP).
- How names become IPs: "Cilium intercepts DNS responses per-Endpoint using a DNS Proxy". An L3
  CIDR rule is generated for every `toFQDNs` rule. It needs `--enable-l7-proxy` and a separate
  L7 DNS rule that allows the lookups.
- "For a given domain name, IPs from responses to all pods managed by a Cilium instance are allowed
  by policy (respecting TTLs)." Up to 50 IPs per FQDN per endpoint are kept by default; live
  connections are not expired.
- Threat-model warning: the security model "assumes that the intercepted DNS responses come from
  trusted cluster DNS servers".
- Consequence (our inference, consistent with
  [domain-decoupling-attack-2608.00643.md](domain-decoupling-attack-2608.00643.md)): once
  `allowed.example` resolves to a shared CDN edge IP, L3 policy allows *any* tenant on that IP. Only
  an L7/SNI check on top narrows it.
- DNS-name policy matches query names only ("other DNS fields, such as query type, are not
  considered"). Our inference: a matched name with arbitrary encoded subdomains under an allowed `**.` pattern is
  still a DNS channel.
- L7 HTTP rules: `path` and `method` (POSIX regexes), `host`, `headers`, and `headerMatches` with a
  mismatch action. The example allows only `GET /path1` and `PUT /path2` with a header set.
- TLS inspection: the network team runs an internal CA and stores per-destination certificates as
  Kubernetes secrets; the workload must trust the CA. Cilium 1.17+ delivers secrets to Envoy via SDS.
- Availability: the DNS proxy and embedded Envoy live in the agent pod, so DNS-policy traffic
  depends on the agent being up (a standalone DNS proxy is alpha).

## Excerpts
> "In order to associate domain names with IP addresses, Cilium intercepts DNS responses per-Endpoint using a `DNS Proxy`." — layer3.rst, DNS based
> "the security model assumes that the intercepted DNS responses come from trusted cluster DNS servers" — layer7.rst, DNS Proxy
> "Method is an extended POSIX regex matched against the method of a request" — layer7.rst, HTTP

## Relevance to the talk
The Kubernetes answer to "allow only these domains" for hosted agent fleets (arXiv 2610.02861 makes
FQDN-aware egress one layer of its EKS/AKS/GKE reference architecture for agents). It shows the general trade-off: DNS-derived IP
allowlists are cheap and protocol-agnostic but coarse on shared infrastructure; method/path
policy is precise but needs TLS interception and a trusted CA in every sandbox.
