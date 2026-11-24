---
title: "VMs" and "Firewall" (Freestyle docs), with the Freestyle VMs product page
url: https://www.freestyle.sh/docs/vms
authors: Freestyle
date: living documents, read 2026-11-22 (firewall: https://www.freestyle.sh/docs/vms/network/firewall; product: https://www.freestyle.sh/products/vms); docs.freestyle.sh 308-redirects here
accessed: 2026-11-22
kind: docs
---

## Summary
Freestyle offers full Linux VMs for coding agents with nested KVM, memory-preserving pause, sub-100 ms wake, and live forking of a running VM. Its networking is the most explicitly deny-by-default of the small vendors: a firewall is mandatory at VM creation and "a VM reaches nothing it has not been allowed to". Rules are allow-only and match VM, VPC, tunnel, CIDR or "public internet" plus port/protocol, not hostnames.

## Key points
- Isolation: "Full Linux virtual machines"; "Full KVM support" for nested VMs and Docker. **VMM not named.**
- Lifetime: VMs "persist their files, can preserve memory while paused, and wake when work needs to run"; persistent VMs idle into suspend with "memory frozen, billing stops" and wake in "under 100ms" (product page). Files remain readable while paused.
- Forking: "Clone a running VM without pausing it — get full copies in milliseconds" (product page); snapshots of "the entire machine state" boot identical VMs.
- Limits: up to 32 vCPU / 64 GB RAM (product page); resources grow-only; `exec` timeout max five minutes.
- Network: `firewall` required on `vms.create`; "Only allow rules exist today"; matchers `vmId`, `vpcId`, `tunnelId`, `cidr`, `public: true`, `port`, `protocol`. Always allowed: Freestyle-delivered traffic (published domains, SSH via `beta-ssh.freestyle.sh`) and ARP/ND/DHCP. Always blocked: outbound SMTP ports 25/465/587. No domain matcher on the firewall page; an "Outbound TLS" page exists but was not read.
- Credentials: SSH and clients use "scoped identity tokens". No native secret-injection proxy found; a Freestyle guide shows running the third-party iron-proxy on a router VM to inject API keys per host.
- Regions and pricing unit: not on the pages read.

## Excerpts
> "a VM reaches nothing it has not been allowed to" (VMs docs)

> "deleting every rule you have cannot take a published domain or your SSH access offline." (Firewall docs)

## Relevance to the talk
A clean example of IP/port-level deny-by-default without a hostname proxy, which shows the trade-off: CIDR rules cannot express "github.com but not gist.github.com", so domain policy and credential injection get pushed into a separate proxy VM. Also the clearest small-vendor statement that platform-owned paths (SSH, published domains) bypass the tenant's firewall.
