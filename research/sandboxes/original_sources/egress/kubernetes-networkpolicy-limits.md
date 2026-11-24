---
title: "Network Policies (Kubernetes documentation), incl. 'What you can't do with network policies (at least, not yet)'"
url: https://kubernetes.io/docs/concepts/services-networking/network-policies/
authors: Kubernetes project
date: living documentation (v1.37 docs current on access date)
accessed: 2026-11-22
kind: docs
---

## Summary
Plain Kubernetes NetworkPolicy is the baseline that many self-hosted agent sandboxes start from
(one pod per agent run). It handles L3/L4 only: pod/namespace selectors, `ipBlock` CIDRs and
ports. It is allow-only and additive. The project's own list of non-features rules out everything
an agent egress policy needs beyond "no internet": no domain names, nothing TLS-related, no logging
of blocked connections, no explicit deny.

## Key points
- A pod becomes egress-isolated only when some policy selects it with `Egress` in `policyTypes`;
  after that, only connections allowed by some policy's `egress` list are permitted. Policies are
  additive, and reply traffic is implicitly allowed.
- Egress peers: pod selectors, namespace selectors, `ipBlock` (CIDR with `except`); plus ports.
- Explicitly *not* supported, in the docs' own list:
  - "Anything TLS related (use a service mesh or ingress controller for this)."
  - "Forcing internal cluster traffic to go through a common gateway"
  - "The ability to log network security events (for example connections that are blocked or accepted)."
  - "The ability to explicitly deny policies"
  - "Default policies which are applied to all namespaces or pods"
  - "The ability to prevent loopback or incoming host traffic"
- No FQDN egress. Allowing "github.com" means hard-coding IP ranges, or using a CNI extension
  ([Cilium](cilium-dns-and-l7-policy.md), Calico, GKE FQDN policy) or an egress proxy.

## Excerpts
> "Anything TLS related (use a service mesh or ingress controller for this)." — What you can't do with network policies
> "The ability to log network security events (for example connections that are blocked or accepted)." — same section

## Relevance to the talk
Shows the floor that "just put the agent in a pod" starts from. It can stop *all* egress (DNS
included, if you don't allow kube-dns), but it cannot express "registry.npmjs.org yes, gist.github.com
no". So every hosted agent platform adds a proxy, an SNI filter or a DNS-aware CNI on top.
