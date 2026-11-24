---
title: "rund — OCI Container Runtime for Darwin (Darwin Containers)"
url: https://github.com/darwin-containers/rund
authors: Darwin Containers initiative (darwin-containers GitHub org)
date: rund repo created 2023-06-26; org site https://darwin-containers.github.io announces the 0.0.1 release
accessed: 2026-11-22
kind: repo
---

## Summary
An experimental containerd shim that runs macOS (Darwin) containers natively on macOS, with
patched containerd/moby/buildkit forks. It shows how little the Darwin kernel offers for containers:
- The only filesystem isolation is `chroot(2)`, plus bindfs/macFUSE for bind mounts.
- Process cleanup goes by process group.
- Host networking is the only network mode.
- Development requires turning off System Integrity Protection, because SIP blocks `chroot`.

## Key points
- The README itself says it does not offer the usual level of container isolation because the Darwin
  kernel API is limited.
- Provides `chroot` filesystem isolation, process-group cleanup, bind mounts and OCI runtime-spec
  compatibility "to the extent it is possible".
- No PID, network, IPC or user namespaces, and no cgroups. Darwin has none of these.
- Development prerequisites: SIP disabled, macFUSE or fuse-t, bindfs.

## Excerpts
> "rund doesn't offer the usual level of container isolation that is achievable on other OSes due to limited Darwin kernel API." — README

> "Host-network mode only" — README, What rund provides

## Relevance to the talk
Primary evidence for "macOS has no namespaces or cgroups". A "native container" on macOS amounts to
chroot plus a process group. Real isolation on macOS comes from either Seatbelt (MAC policy per process)
or a hypervisor, with nothing in between.
