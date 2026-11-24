---
title: "fun-with-sandboxes — plan"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/PLAN.md
authors: e6qu (Adrian Mârza)
date: 2026-11-22 (file last changed in commit 19c2f5b)
accessed: 2026-11-22
kind: repo
---

## Summary
Short planning document: purpose, hard constraints, non-goals and status.
The constraints are the design's spine — no VM, no root, kernel-enforced
isolation, "honour or refuse" every Docker option, OCI throughout, close to
native cost. It declares the project feature-complete for its purpose and the
roadmap closed (last gaps in PR #80); what remains is upkeep (catalog and
Kubernetes at newest upstream releases).

## Key points
- **Constraints**:
  - No VM, no root: no hypervisor, `sudo`, root daemon, kext, or SIP change.
  - "Isolation the kernel enforces": Seatbelt confines every container process,
    "and a test tries to break each property claimed."
  - "Honour or refuse": an option the engine cannot enforce fails with a
    Docker API error; nothing is accepted and silently dropped.
  - OCI images in a content-addressed store; digests survive pull/save/load/push.
  - "Close to native": a container costs what its processes cost; CI measures
    process start and each interposed call against native.
  - Go, plus C only inside a process start; `darwin/arm64` only.
- **Non-goals**: Linux binaries in any form (unchanged images, a VM, syscall
  translation, image converters, `apt-get`/`apk` Dockerfiles); **"A security
  boundary against hostile code"**; Swarm; Intel Macs; signed/notarized
  packaging or a launchd service.
  - Note for the talk: "system-call translation" is explicitly fws's non-goal —
    which is precisely what the sibling project fwe does.
- **Status**: Docker CLI, Compose, buildx/BuildKit, Testcontainers, Podman
  remote and `podman-compose`, Dev Containers CLI and VS Code extension,
  GUI apps, `crictl`, kubelet and kind, IPv4/IPv6/dual-stack all run in CI on
  macOS 15 and 26. 46 catalog images; Kubernetes 1.37.2.

## Excerpts
> "**No virtual machine, no root.** Everything runs as the invoking user: no
> hypervisor, `sudo`, root daemon, kernel extension or change to System
> Integrity Protection." (§ Constraints)

> "**Honour or refuse.** An option the engine cannot enforce fails with a
> Docker API error; none is accepted and dropped." (§ Constraints)

> "A security boundary against hostile code, Swarm, Intel Macs." (§ Non-goals)

> "Complete: its last gaps closed in #80. fws does what it sets out to do."
> (§ Roadmap)

## Relevance to the talk
Gives the design principles in one place — good for a "design constraints"
slide. "Honour or refuse" is a transferable lesson for agent sandboxes: a
sandbox that silently ignores a requested restriction is worse than one that
errors. The non-goals list draws the line between fws (process confinement)
and fwe (syscall-ABI emulation).
