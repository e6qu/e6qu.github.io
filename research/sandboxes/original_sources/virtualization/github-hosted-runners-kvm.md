---
title: "GitHub-hosted runners: hardware-accelerated virtualization on Linux, no nested virtualization on arm64 macOS"
url: https://docs.github.com/en/actions/reference/runners/github-hosted-runners
authors: GitHub (docs; changelog https://github.blog/changelog/2024-04-02-github-actions-hardware-accelerated-android-virtualization-now-available/)
date: living docs, read 2026-11-22; changelog 2024-04-02 (earlier: larger runners, 2023-02-23)
accessed: 2026-11-22
kind: docs
---

## Summary
Can a CI job start a VM? On GitHub Actions the answer depends on the runner. Hosted
Linux runners expose KVM: GitHub sells it as "hardware acceleration for Android SDK tools".
It arrived on larger runners in February 2023 and on the standard 2-vCPU Linux runners on
2024-04-02, after a one-line udev rule. Hosted arm64 macOS runners cannot nest:
"Nested-virtualization is not supported due to the limitation of Apple's Virtualization Framework."

## Key points
- Changelog 2024-04-02: the feature now applies to "2-vCPU GitHub-hosted Linux runners"; before, it
  was limited to "runners with 4 or more vCPUs". The setup step adds the runner user to the KVM group
  with `KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"`.
- Docs (runner reference): "GitHub-hosted Linux runners support hardware acceleration for Android SDK
  tools". The page does not use the word KVM or promise general nested virtualization.
- arm64 macOS runners: "Nested-virtualization is not supported due to the limitation of Apple's
  Virtualization Framework." This matches fwe's finding that `hv_vm_create` returns
  `HV_UNSUPPORTED` on hosted macOS runners (`../e6qu-projects/fwe-hypervisor.md`).
- GitLab.com hosted runners: no official statement on nested virtualization was found. An old
  issue (https://gitlab.com/gitlab-org/gitlab-ci-yml/issues/73) reports KVM unavailable. Unresolved.

## Excerpts
> "GitHub-hosted Linux runners support hardware acceleration for Android SDK tools" (docs)

> "Nested-virtualization is not supported due to the limitation of Apple's Virtualization Framework." (docs, arm64 macOS runners)

## Relevance to the talk
This corrects a claim in a November 2026 explainer
(`../agent-sandboxing/a1crew-2026-containers-vs-sandboxes-video.md`) that default GitHub Actions
runners "explicitly disable nested KVM". On Linux, a microVM per CI job is possible on the
standard hosted runner. On macOS hosted runners it is not, which is the reason fws and fwe
exist (World 6★, "Every container is a VM away").
