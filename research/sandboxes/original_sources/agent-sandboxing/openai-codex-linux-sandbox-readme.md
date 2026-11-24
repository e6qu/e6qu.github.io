---
title: "codex-linux-sandbox (codex-rs/linux-sandbox/README.md)"
url: https://github.com/openai/codex/tree/main/codex-rs/linux-sandbox
authors: OpenAI (openai/codex contributors)
date: living document; bubblewrap vendored 2026-02-03 (PR #10413); read at main on 2026-11-22
accessed: 2026-11-22
kind: repo
---

## Summary
The README of the Rust helper that Codex uses to sandbox commands on Linux. Codex (repo created 2025-04-13) originally used Landlock + seccomp on Linux (e.g. commit 2025-05-23, PR #1086, "overhaul how we spawn commands under seccomp/landlock"); bubblewrap was vendored on 2026-02-03 (PR #10413), and the README now describes **bubblewrap as the default filesystem sandbox**, with Landlock retained only as a "legacy" option that is rejected for filesystem-restricted policies "because it cannot isolate app-server Unix sockets". It documents the mount layering, seccomp policy, proxy routing and an experimental transparent-TCP mode in unusual detail. The macOS policies live alongside in `codex-rs/sandboxing/src/*.sbpl` (base policy starts `(deny default)` and credits Chrome's sandbox policy).

## Key points
- bwrap discovery: first `bwrap` on `PATH` *outside the current working directory* (so a repo can't plant one), else a bundled `codex-resources/bwrap`; warns if user namespaces can't be created. WSL2 works; WSL1 is rejected.
- Filesystem: `--ro-bind / /` (read-only by default), writable roots layered with `--bind`, protected subpaths (`.git`, resolved `gitdir:`, `.codex`) re-applied read-only; narrower rules win in path-specificity order; deny globs expanded with `rg --files` before launch and masked; symlinks/non-existent protected paths blocked by mounting `/dev/null` on them.
- Namespaces: `--unshare-user`, `--unshare-pid` by default, `--unshare-net` when network is restricted; fresh `/proc`.
- seccomp after the FS view is set up, with `PR_SET_NO_NEW_PRIVS`: restricted network → network syscalls blocked; FS-only restriction still blocks `AF_VSOCK`; **all modes block `io_uring`** "to prevent bypassing socket-family restrictions"; in managed-proxy mode IP sockets allowed inside the empty netns but new standalone `AF_UNIX` sockets blocked.
- Managed proxy mode: `--unshare-net` plus an internal TCP→UDS→TCP bridge so tool traffic reaches only configured proxies.
- Transparent TCP (experimental): an in-helper TCP stack on `/dev/net/tun` and a private DNS stub mapping up to 8,192 names to synthetic addresses in `198.18.0.0/15`, so non-proxy-aware clients (e.g. `psql`) are attributed by name; UDP/QUIC/ICMP not supported.
- PID-namespace inheritance can be enabled only by trusted provisioning, never by repository config or env vars.

## Excerpts
> "The helper uses bubblewrap for filesystem and namespace isolation, and seccomp for syscall filtering."

> "The legacy Landlock option is rejected for these policies because it cannot isolate app-server Unix sockets."

> "All filter modes block `io_uring` to prevent bypassing socket-family restrictions."

## Relevance to the talk
Shows the Linux toolbox in practice and an instructive migration: Landlock (unprivileged, elegant) gave way to bubblewrap namespaces because agents need network-namespace removal + proxy plumbing and Unix-socket isolation. The `io_uring` line is a crisp example of seccomp filters having to track new kernel attack surface.
