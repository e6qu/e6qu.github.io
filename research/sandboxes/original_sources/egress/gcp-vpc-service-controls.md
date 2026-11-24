---
title: "Overview of VPC Service Controls"
url: https://docs.cloud.google.com/vpc-service-controls/docs/overview
authors: Google Cloud
date: living documentation, read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
VPC Service Controls (VPC-SC) is Google Cloud's control for a problem that domain allowlists
cannot see: data leaving through an *allowed* API to a resource in *someone else's* project.
`storage.googleapis.com` is the same hostname whether the bucket belongs to you or to the
attacker. A service perimeter checks the *resource and project* of each API call. Copying from a
bucket inside the perimeter to one outside fails, and stolen credentials used from outside the
perimeter are refused. It is the cloud-API counterpart of "bind egress to my org, not just the
domain".

## Key points
- "A service perimeter creates a security boundary around Google Cloud resources." Resources
  inside can talk freely; crossing the boundary is blocked by default and opened with explicit
  ingress/egress rules.
- Threats addressed: exfiltration from Google-managed services, clients using stolen OAuth or
  service-account credentials from unauthorised networks, and cross-project data access in
  supported services.
- Access levels admit internet callers by attributes such as IP range or identity. Perimeters can
  extend on-prem via VPN/Interconnect. Dry-run mode logs without enforcing.
- Limits stated by Google: the perimeter "doesn't block access to any third-party APIs or services
  on the internet"; it is not designed for comprehensive metadata controls; unsupported services
  are not protected; it complements IAM rather than replacing it.
- The overview page does not mention Vertex AI or agents. Applying it to an agent runtime is our
  inference: put the agent's project inside a perimeter so a Google-API call to an attacker's
  bucket fails even though the hostname is allowed.

## Excerpts
> "A service perimeter creates a security boundary around Google Cloud resources." — Overview
> "The perimeter doesn't block access to any third-party APIs or services on the internet." — Overview

## Relevance to the talk
The mature cloud example of *identity/resource-bound* egress. It answers exactly the hole that
Claude Code's default allowlist leaves open by listing `*.googleapis.com` and `*.amazonaws.com`
([claude-code-cloud-environments-network.md](claude-code-cloud-environments-network.md)), and
Claude Pirate in general (the right host, the wrong account:
[incident](../incidents/2025-10-claude-pirate-files-api-exfil.md)). The AWS analogue is VPC
endpoint policies that restrict S3 to your own buckets.
