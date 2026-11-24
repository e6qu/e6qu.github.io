---
title: "openEuler Conch沙箱引擎：AI Agent 需要什么样的“完整沙箱镜像”"
url: https://www.openeuler.org/zh/blog/20260627-openEuler%20Conch/20260627-openEuler%20Conch.html
authors: openEuler community (Huawei-led; OpenAtom Foundation)
date: 2026-06-27 (supporting sources 2023-11-01 to 2026-11-13)
accessed: 2026-11-22
kind: blog
---

## Summary
Huawei's secure-container stack has three parts. StratoVirt is a Rust VMM in openEuler with a microVM mode. iSulad is a container engine. Kuasar is a sandbox runtime that iSulad drives through a "Sandbox API" without shims. Huawei Cloud's Cloud Container Instance (CCI) uses Kata Containers, with one micro-VM per pod. In 2026 openEuler repositioned this work for agents. The new **Conch** sandbox engine (Go, Mulan PSL v2) runs "MicroVM-based strongly isolated agent sandboxes" from EROFS images and memory snapshots. openEuler's November 2026 "Agentic Infra OS" release advertises a "fused sandbox" (融合沙箱). Neither the Conch blog nor the repo names StratoVirt as Conch's VMM; only press coverage links them.

## Key points
- Isolation unit:
  - Conch: a microVM ("基于 MicroVM 的强隔离 Agent 沙箱"). The VMM is selected by a `sandbox.backend` option; the VMM is not named in the repo (https://atomgit.com/openeuler/Conch). Networking uses CNI.
  - CCI: Kata, "Each Kata container or rather pod runs on an independent micro-VM with an independent OS kernel" (https://support.huaweicloud.com/intl/en-us/cci_faq/cci_faq_0009.html, updated 2025-04-30).
- Per-session?: Conch has one microVM per sandbox. It has two artifacts: `sandbox-image` for cold start and `sandbox-snapshot` for hot start, which captures the running state as a distributable image.
- Network egress: not covered in the Conch blog or README beyond CNI.
- Persistence: snapshots of VM memory and rootfs (`conch snapshot export --sandbox-id`, which pauses first). Lazy snapshot loading is planned. Images use the EROFS format with super-node image sharing.
- Limits / numbers:
  - StratoVirt: microVM cold start under 50 ms and under 4 MB memory overhead (https://docs.openeuler.org/en/docs/25.09/virtualization/virtulization_platform/stratovirt/stratovirt_introduction.html).
  - Conch README: second-level start from snapshots.
  - openEuler Agentic Infra OS (press only, unverified): single-instance sandbox start under 50 ms, and 1,000 concurrent starts per node in under 10 s (Sina, 2026-11-13). It's FOSS reports "as low as 20 ms", "more than 2,000 sandboxes" per node, and 100,000 sandboxes in 10 s (https://itsfoss.com/news/openeuler-agentic-infra-os/, 2026-11-13).
- Repo facts: Conch on AtomGit has 11 stars, 30 forks, Mulan PSL v2, no formal release and one tag (2026-11-22).
- iSulad + Kuasar + StratoVirt: integrated in openEuler 23.09. The Sandbox API removes the shim process. The source article gives no numbers itself; it cites "99%" memory and "100%" startup gains from a referenced article that I did not verify (https://www.openeuler.org/zh/blog/20231103-isulad/20231103-isulad.html, 2023-11-01).
- E2B: openEuler ships an `openeuler/e2b` container image (E2B SDK on 24.03 LTS SP3), and Kunpeng has an E2B deployment guide. This is self-hosting E2B on openEuler, not a Huawei sandbox.
- Pricing: open source. CCI pricing is not researched here.
- Is it positioned for agent sandboxes? StratoVirt, iSulad and CCI are general secure-container tech, not marketed for agents. Conch and the 2026 Agentic Infra OS "融合沙箱" are explicitly for agents. Huawei Cloud's AgentSphere says "MicroVM" but names no VMM, so a StratoVirt or Conch link to AgentSphere is **unverified**.

## Excerpts
> "基于 MicroVM 的强隔离 Agent 沙箱" — English: "Strongly isolated agent sandboxes based on MicroVM." (Conch blog)

> "openEuler 23.09 完成对 iSulad+Kuasar+StratoVirt 的集成，为用户提供了一个极速轻量的安全容器解决方案。" — English: "openEuler 23.09 completed integration of iSulad+Kuasar+StratoVirt, providing users a very fast, lightweight secure-container solution." (iSulad Sandbox API blog)

## Relevance to the talk
Huawei is building a fully domestic stack for agent sandboxes: its own OS (openEuler), its own VMM (StratoVirt), its own container engine (iSulad and Kuasar), and now an agent sandbox engine (Conch). This differs from Tencent, whose CubeSandbox reuses Kata and Cloud Hypervisor code. Conch's "snapshot as a distributable image" idea matches E2B and Cube snapshotting, but it is very early (11 stars). The headline 20 ms and 50 ms figures are press-reported only.
