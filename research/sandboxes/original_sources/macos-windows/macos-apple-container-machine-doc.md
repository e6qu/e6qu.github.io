---
title: "Container machine (apple/container docs)"
url: https://github.com/apple/container/blob/main/docs/container-machine.md
authors: Apple Inc.
date: living doc on main (feature shipped with container 1.0.0, 2026-06-09)
accessed: 2026-11-22
kind: docs
---

## Summary
User documentation for container machines. It carries a prominent warning that a container machine gives
up most of a regular container's isolation:
- It mounts `$HOME` read-write at the same path.
- It forwards the host's SSH agent.
- It runs with all Linux capabilities and no masked `/proc` or `/sys`.
- It sets up passwordless sudo mapped to the host UID.

## Key points
- Equivalent to `container create -v "${HOME}:${HOME}" --ssh --cap-add ALL --masked-path NONE --read-only-path NONE`.
- Root in the machine can write anywhere in the mounted home with the user's macOS permissions.
- Intended for dev workflows (edit on Mac, build inside), not for untrusted code.

## Excerpts
> "A container machine trades away much of the isolation that makes a regular Apple container safer for running untrusted code." — warning

> "Forwards your host `SSH_AUTH_SOCK` into the guest, so anything running in the machine can use your ssh-agent to act as you" — warning

## Relevance to the talk
A vivid vendor-written example of the point that the VM boundary is only as strong as what you share
across it. For agents, the per-agent VM matters less than the mounts, credentials and network you hand
it. Good slide material.
