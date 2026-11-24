---
title: "Findings from the $1M Vercel Sandbox challenge" (Vercel blog), with "Vercel Sandbox pricing and quotas" (Vercel docs)
url: https://vercel.com/blog/findings-from-the-1-million-dollar-vercel-sandbox-challenge
authors: Andy Riancho (Vercel); kernel finding by Paulos Yibelo (pwn.ai); architecture review by Trail of Bits
date: 2026-10-14 (blog); pricing page last_updated 2026-09-10 (https://vercel.com/docs/sandbox/pricing)
accessed: 2026-11-22
kind: blog
---

## Summary
Vercel's post-mortem of its public escape bounty for Vercel Sandbox (Firecracker microVMs). Over two
weeks in August 2026 it received 1,285 reports and paid $242,000. The worst finding was a host-kernel
networking defect reachable from inside a guest: crafted packets leaked host memory (shown against
production), and crashed the host or ran code on it as root (shown on the researcher's own KVM +
Firecracker machines with Vercel's configuration). The other serious bugs were not in the
hypervisor. A device-mapper layer leaked recycled disk blocks across tenants, and the control plane
trusted snapshot metadata reported by the guest. Trail of Bits found that egress enforcement was
split across subsystems that parsed the same policy differently.

## Key points
- **Scale:** 1,285 reports (877 duplicates, 319 N/A, 57 valid, 32 informative); validated 1 Critical,
  5 High, 9 Medium, 42 Low. Payout $242,000 of the $1M pool.
- **Kernel zero-day (Yibelo, day three, from a standard sandbox):** "Leak host memory over the
  network", "Crash the host machine", "Execute code on the host". The memory leak "was demonstrated
  against Vercel production sandboxes"; crash/RCE on "the researcher's own KVM and Firecracker
  machines". CVEs "pending" at publication. The HN thread on PwnAI's write-up places the bug in the
  host virtio-net checksum-offload path
  ([../hackernews/virtualization-density/hn-50397219-firecracker-pwnescape.md](../hackernews/virtualization-density/hn-50397219-firecracker-pwnescape.md)).
  Press calls it "PwnEscape"; a CVE number circulating in press (CVE-2026-99999) was **not verified**.
- **Cross-tenant storage leak (Vercel intern):** "let any sandbox read recycled disk blocks from
  previously deleted sandboxes" (device-mapper layer).
- **Cross-tenant snapshot restore:** the guest reported `{storage_url, size, checksum}` and the host
  believed it. Combined with "a known, documented container-escape primitive" inside the guest, a
  researcher swapped snapshots between two of his own accounts. Targeting a stranger needed a random
  96-bit key never exposed by the API. Fixed within a week; snapshotting moved to a host-side service.
- **Trail of Bits (4 engineer-weeks, 20 findings):** virtualization boundary "sound"; three
  recommendations, all adopted: eliminate trust in guest-supplied values; "one policy, one decider"
  for egress; "assume the next zero day" (patch kernels, cut kernel attack surface, **disable nested
  virtualization**, **use Firecracker's jailer**). That jailer use was a *recommendation* suggests it
  was not used throughout before (inference).
- **Limits and pricing (docs, iad1):** Active CPU $0.128/h; provisioned memory $0.0212/GB-h (1-minute
  minimum); creations $0.60 per million; outbound + exposed-port traffic billed, downloads free;
  snapshot storage $0.08/GB-month. Hobby: 10 concurrent, 45-minute session, 4 vCPU/8 GB. Pro and
  Enterprise: 10,000 concurrent, 24-hour session; Pro 8 vCPU/16 GB, Enterprise 32 vCPU/64 GB; 64 GB
  NVMe per sandbox. Session cap resets on stop/resume, so a persistent sandbox's life is "effectively
  unbounded". Default timeout 5 minutes. Snapshots are filesystem-only and expire 30 days after last
  use by default (https://vercel.com/docs/sandbox/concepts/snapshots, last_updated 2026-08-26).

## Excerpts
> "No reports showed anyone accessing customer data in Vercel Sandbox. The most severe finding was the defect in the upstream Linux kernel."

> "Almost every major cloud provider isolates customer workloads on this same layer of the Linux kernel, so any defect is shared-infrastructure risk."

> "Egress enforcement was split across subsystems that each parsed the same network policy independently, and they did not always agree."

> "We still treated it as a priority fix, because a boundary that depends on a secret staying secret is not a boundary."

## Relevance to the talk
The best primary evidence for the claim that a microVM moves the attack surface rather than removing it.
No report broke Firecracker's own device model. The one escape-class bug went through the host
kernel's network path, which every Firecracker operator shares. The practical bugs came from components around the VM: storage
recycling, a control plane that trusted the guest, and egress policy parsed twice. That matches the
Anthropic "the boundaries held; the new layers failed" synthesis.
