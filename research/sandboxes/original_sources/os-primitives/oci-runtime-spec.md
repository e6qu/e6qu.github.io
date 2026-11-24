---
title: Open Container Initiative Runtime Specification
url: https://github.com/opencontainers/runtime-spec/blob/main/spec.md
authors: Open Container Initiative (Linux Foundation); founded by Docker, CoreOS and others
date: OCI launched 2015-06-22; runtime-spec v1.0.0 published 2017-07-19
accessed: 2026-11-22
kind: spec
---

## Summary
The OCI runtime spec standardises what a "container" is at the runtime layer: a filesystem bundle plus a
`config.json` (namespaces, mounts, cgroups, capabilities, seccomp profile, etc.) and a lifecycle
(create/start/kill/delete). runc — Docker's libcontainer, donated at OCI's launch — is the reference
implementation; crun, youki, gVisor's runsc and Kata are alternative runtimes behind the same interface.

## Key points
- Spec docs: config.md (configuration), runtime.md (runtime and lifecycle), bundle.md (filesystem bundle).
- Platforms named: linux, windows, solaris, freebsd, vm, zos.
- OCI history (https://opencontainers.org/about/overview/): launched 22 June 2015 by Docker, CoreOS and
  others under the Linux Foundation; "Docker is donating its container format and runtime, runC, to the OCI."
- runtime-spec v1.0.0: GitHub release published 2017-07-19 (vote 8 for, 0 against). runc repo created 2015-06-05.

## Excerpts
> "aims to specify the configuration, execution environment, and lifecycle of a container" — spec.md

> "The OCI was launched on June 22nd 2015 by Docker, CoreOS and other leaders in the container industry." — OCI overview

## Relevance to the talk
The OCI interface is what lets you swap the isolation technology (namespaces → user-space kernel → microVM)
without changing images or orchestration — the hook for the virtualization section of the talk.
