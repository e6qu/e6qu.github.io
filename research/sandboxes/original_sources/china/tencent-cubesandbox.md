---
title: "TencentCloud/CubeSandbox: Instant, Concurrent, Secure & Lightweight Sandbox for AI Agents."
url: https://github.com/TencentCloud/CubeSandbox
authors: Tencent Cloud (腾讯云)
date: repo created 2026-04-10; v0.1.0 initial open-source release 2026-04-20; latest v0.8.0 2026-11-12; last push 2026-11-21
accessed: 2026-11-22
kind: repo
---

## Summary
CubeSandbox is Tencent Cloud's open-source sandbox service for AI agents. Each sandbox is a KVM microVM with its own guest kernel, run by "CubeHypervisor", a RustVMM-based VMM. The project claims creation in under 60 ms and less than 5 MB memory overhead per sandbox. It exposes an E2B-compatible REST API, so E2B clients switch by changing one environment variable. The LICENSE file shows it ships Tencent-modified copies of kata-containers and cloud-hypervisor, plus cilium/bpf. Tencent Cloud's managed Agent Runtime (AGS) says it is "based on Cube".

## Key points
- Isolation unit: a microVM on KVM. The README says "Every sandbox runs a dedicated OS kernel in its own MicroVM".
  - CubeHypervisor (RustVMM + KVM) manages the VMs.
  - CubeShim implements the containerd Shim v2 API.
  - Requirements: x86_64 Linux with KVM. A PVM path allows deployment on ordinary cloud VMs without bare metal or nested virtualisation. ARM64 support arrived in v0.5.
- Per-session?: yes, one microVM per sandbox. Inter-sandbox isolation is enforced in the kernel with eBPF through CubeVS, an eBPF virtual switch.
- Network egress: CubeVS does kernel-level egress filtering. CubeEgress, an OpenResty-based gateway, adds:
  - L7 policies by domain, path and method
  - credential injection
  - auditing
  
  The README says traffic "cannot bypass inspection" because the two layers work together. v0.4 (2026-06-14) was titled "Safer egress". The default egress posture is not stated in the parts of the README I read.
- Persistence:
  - v0.3: CubeCoW snapshot, clone and rollback at hundred-millisecond granularity.
  - v0.5: AutoPause/AutoResume.
  - v0.6: E2B-compatible volume framework.
  - v0.7: cross-node pause/resume with an S3 backend (preview).
  - v0.8: JuiceFS copy-on-write storage backend (preview).
- Limits / numbers (vendor benchmarks in README):
  - Creation takes about 60 ms at single concurrency. At 50 concurrent creations, the average is 67 ms, P95 90 ms and P99 137 ms.
  - Memory overhead is under 5 MB.
  - Density is "thousands per node", achieved through kernel sharing and copy-on-write.
  - The README table also says "Sub-millisecond (<60ms)", which is internally inconsistent wording.
- Pricing: free open source. The managed equivalent is AGS (see `tencent-agent-runtime-ags.md`).
- Repo facts (GitHub API, 2026-11-22):
  - 13,396 stars and 1,241 forks. GitHub reports the primary language as Go; some components, such as CubeAPI, are Rust.
  - License: the README and LICENSE say Apache-2.0 with third-party exceptions. GitHub's detector shows "NOASSERTION", probably because extra licence texts are appended (kata-containers and cloud-hypervisor under Apache-2.0, cilium/bpf under BSD-2-Clause).
  - Deployment: one-click Terraform on Tencent Cloud (v0.5) and Kubernetes deploy (v0.6).
- E2B compatibility: CubeAPI is an E2B-compatible REST gateway. The roadmap still lists "closing remaining gaps with the E2B spec".
- Unverified (press only):
  - It runs in Tencent production at "hundreds of billions of calls" and backs Tencent Yuanbao.
  - It scheduled hundreds of thousands of sandboxes per minute for MiniMax agentic-RL training.
  - It runs 2,000+ instances per server.
  
  Sources: CSDN/ifeng reposts of Tencent launch articles, e.g. https://damodev.csdn.net/6a432ddb10ee7a33f2843d7f.html. The Show HN post dated 2026-04-22 in our brief was not found by search. The README's own date for v0.1.0 is 2026-04-20.

## Excerpts
> "Cube Sandbox is a high-performance, out-of-the-box secure sandbox service built on RustVMM and KVM." (README, intro)

> "It is compatible with the E2B SDK and can create a hardware-isolated, fully serviceable sandbox in under 60ms" (README, intro)

> "Cube Sandbox is licensed under the Apache-2.0 except for the third-party components listed below." (LICENSE)

## Relevance to the talk
This is the clearest Chinese example of the microVM-plus-E2B-API pattern being open-sourced by a hyperscaler. It is effectively a self-hostable E2B with eBPF network isolation and an L7 egress proxy that can inject credentials. Being derived from Kata and Cloud Hypervisor places it in the same lineage as Western microVM sandboxes. The startup and density numbers are the vendor's own and have not been independently reproduced.
