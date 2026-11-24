---
title: "Inside Replit's New Sandbox Engine, Part 1" (microVMs)
url: https://frontier.replit.com/sandbox-engine-microvms-part-1/
authors: Luis Héctor Chávez, Jason Dellaluce, Adnan Abdulhussein (Replit)
date: 2026-11-04
accessed: 2026-11-22
kind: blog
---

## Summary
Replit's engineering post on the sandbox engine that runs Replit Agent and user Repls. It names the VMM, which [../agent-sandboxing/agent-replit.md](../agent-sandboxing/agent-replit.md) recorded as "not named". Each sandbox is a **Cloud Hypervisor microVM on KVM**, with minimal runc containers inside the guest. The VMM runs unprivileged, and egress policy and credential brokering are enforced on the host, outside the guest. The post is unusually concrete about the security payoff: it counts the Linux CVEs that the design avoided over five months. This note adds only what that agent note lacks.

## Key points
- **Isolation unit:** one microVM per sandbox, with its own guest kernel, separated from the host and other tenants by KVM. The VMM is Cloud Hypervisor, which shares rust-vmm crates with Firecracker. Replit patched it so that snapshots are portable between hosts.
- **Defence in depth inside the guest:** workloads run in minimal runc containers with role-specific namespaces, seccomp, capabilities and device access. Docker gets extra privileges only inside the guest.
- **VMM hardening:** the VMM process runs as an unprivileged identity with no Linux capabilities. No jailer is mentioned.
- **Network:** each sandbox gets its own network namespace and routing table. Linux VRF keeps overlapping private IPs apart. Baseline firewall rules block cloud metadata and infrastructure ranges. Virtual-NIC rate limiters run outside the guest.
- **Egress policy, where configured:** a host-side proxy checks the hostname in the TLS handshake (SNI) without decrypting the payload, filters DNS, and drops traffic off the permitted path. The guest cannot change these rules. Default-open egress for Agent, as documented in the agent note, is not contradicted by this post.
- **Credentials:** brokers attach upstream credentials after authorization, so the workload never receives the account API key. Private endpoint tunnels keep credentials on the host. A registry firewall blocks known-malicious npm and pip packages.
- **State:** memory snapshots feed warm pools, disks can be hot-plugged onto running VMs, and copy-on-write storage makes disk forks cheap. Root filesystems live on remote block storage, fetched on demand through a custom vhost-user virtio-blk backend. Acquiring a sandbox with volumes mounted takes about 500 ms.
- **CVE accounting:** of 6,211 Linux-CNA CVEs published 2026-06-01 to 2026-11-04, Replit says it avoided 5,969 (96.1%) by shipping upstream fixes promptly or by excluding the affected code from its kernels.

## Excerpts
> "With microVMs, compromising a sandbox's guest kernel does not by itself compromise the host kernel."

> "The VMM itself runs under an unprivileged identity with no Linux capabilities."

> "For sandboxes with an egress policy, enforcement runs outside the guest."

> "We avoided 5,969 of them (96.1%) by promptly incorporating upstream fixes or by excluding the affected code."

## Relevance to the talk
This is the second-generation hosted-agent stack in one post: a minimal Rust VMM, containers inside the guest, egress and credentials enforced on the host, and snapshots for warm pools and forks. The CVE count is a rare quantitative argument for "the guest kernel is not the boundary": the boundary is a small VMM plus a host kernel you keep minimal and patched. It pairs well with Trail of Bits' VM escapes ([../agent-sandboxing/trailofbits-vms-wont-contain-agents.md](../agent-sandboxing/trailofbits-vms-wont-contain-agents.md)), which went through QEMU and libslirp rather than the hardware boundary.
