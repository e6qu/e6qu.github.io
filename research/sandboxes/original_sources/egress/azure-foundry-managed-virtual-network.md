---
title: "Configure managed virtual network for Microsoft Foundry"
url: https://learn.microsoft.com/en-us/azure/foundry/how-to/managed-virtual-network
authors: Microsoft (Microsoft Learn)
date: 2026-08-18 (ms.date)
accessed: 2026-11-22
kind: docs
---

## Summary
Microsoft Foundry (formerly Azure AI Foundry) puts the compute behind its Agent service into a
Microsoft-managed virtual network. In "Allow only approved outbound" mode, egress is limited to
private endpoints (Private Link to Storage, Cosmos DB, Key Vault and others), Azure service tags,
and optional FQDN rules on ports 80/443. A *managed Azure Firewall* that the customer cannot see or
configure enforces the FQDN rules. This is the cloud-network-layer version of an agent egress
allowlist.

## Key points
- Three outbound modes: Allow internet outbound / Allow only approved outbound / Disabled.
  One-way switches: once set to approved-only, you can't go back to internet outbound, and the
  managed VNet can't be disabled.
- Approved-only uses service tags, private endpoints, and "optional FQDN rules (ports 80, 443)
  enforced via Azure Firewall". The firewall is created on the first FQDN rule, costs extra, can't
  be bring-your-own, can't be shared between Foundry accounts, and "isn't in your tenant or in
  your control" (only the SKU is selectable).
- Required rules created automatically: private endpoints to your Cosmos DB, Storage and AI Search,
  and the AzureActiveDirectory service tag. Agents also need `*.identity.azure.net`,
  `login.microsoftonline.com`, `mcr.microsoft.com`, etc.
- Limitations: "No logging of outbound traffic support yet" (managed vs custom VNet comparison);
  no portal UI for creation.
- Microsoft's wording frames the goal as exfiltration prevention: the managed network "restricts
  what your Agents can access, helping prevent data exfiltration". (An older AI Studio hub page
  reportedly warns that added FQDN rules carry no exfiltration guarantee for those destinations;
  seen in search results only.)

## Excerpts
> "This managed network restricts what your Agents can access, helping prevent data exfiltration while still allowing connectivity to approved Azure resources." — introduction
> "Because this is a managed firewall, the firewall isn't in your tenant or in your control." — Select Azure Firewall version

## Relevance to the talk
The cloud-level counterpart of the local proxy. It is stronger on *where* (Private Link pins
traffic to your own Storage/Key Vault instances, a resource-level binding like
[GCP VPC-SC](gcp-vpc-service-controls.md)), but FQDN rules remain host-granular. With no egress
logging, you can't audit what an agent actually reached. The newer per-agent HTTP policy is in
[azure-foundry-hosted-agent-egress.md](azure-foundry-hosted-agent-egress.md).
