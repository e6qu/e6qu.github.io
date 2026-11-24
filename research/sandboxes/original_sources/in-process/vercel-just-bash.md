---
title: "just-bash" (package README, packages/just-bash/README.md) + bash-tool README + GHSA-g5pf-mh4h-h655
url: https://github.com/vercel-labs/just-bash
authors: Vercel Labs
date: repo created 2025-12-23 (npm package first published 2025-12-27); README read at v3.6.1 (main, 2026-11-20)
accessed: 2026-11-22
kind: repo
---
Related: https://github.com/vercel-labs/bash-tool (AI SDK wrapper, created 2026-01-06);
advisory https://github.com/vercel-labs/just-bash/security/advisories/GHSA-g5pf-mh4h-h655.

## Summary
just-bash is a bash interpreter re-implemented in TypeScript with a virtual filesystem, meant to be
handed to an agent as its "shell". Every command (`ls`, `grep`, `sed`, `awk`, `jq`, `rg`, `tar`,
`curl`...) is a TypeScript (or Wasm) reimplementation running in the host Node/browser process; there
are no real binaries and no `fork/exec`. Filesystem is pluggable (in-memory, copy-on-write overlay over
a real dir, real read-write dir, or a mount table of these); network is off unless an URL-prefix
allow-list is configured. The README states plainly there is no VM isolation and recommends Vercel
Sandbox (a microVM) when arbitrary binaries are needed.

## Key points
- Each `exec()` gets fresh shell state (env, functions, cwd), but the filesystem persists across calls.
- Commands: file ops, text processing (incl. `awk`, `sed`, `grep`, `rg`, `diff`), data (`jq`,
  `sqlite3` via sql.js/Wasm, `xan`, `yq`), `gzip`/`tar`, shell builtins; `curl` and
  `html-to-markdown` exist only when network is configured. Optional runtimes: `js-exec` (QuickJS in
  Wasm, 64 MB memory limit, 30 s / 10 s timeouts by profile) and `python3` (CPython compiled to Wasm),
  both off by default "due to additional security surface". Custom commands via `defineCommand`
  (trusted host code by default; `trusted: false` selects a restricted boundary).
- Filesystems: `InMemoryFs` (default, no disk); `OverlayFs` (reads from disk, writes stay in memory,
  1 GiB default cap); `ReadWriteFs` (real writes under a root); `MountableFs` (compose them).
- Network: disabled by default; allow-list by origin + path prefix, GET/HEAD by default; header
  transforms inject credentials at the fetch boundary so "secrets never enter the sandbox".
- Execution limits: call depth, command count, source bytes etc., with `normal` and `hardened`
  profiles; cooperative cancellation via `AbortSignal` "stops at next statement boundary".
- Stated limits (Security Model section): no VM isolation; host-realm hardening of JS intrinsics is
  best-effort and partly irreversible; Node worker `resourceLimits` "do not reliably cap the
  WebAssembly linear memory used by CPython or sql.js"; "JavaScript cannot forcibly stop arbitrary
  host code", so extensions needing hard guarantees must run in a terminable worker or process.
- `Sandbox` class is a drop-in for the `@vercel/sandbox` API that "runs entirely in-process", so apps
  can swap to a real VM later.
- Known escape: **GHSA-g5pf-mh4h-h655 (high, published 2026-09-15)**: `ReadWriteFs` confined paths by
  canonicalising and comparing to the root, which catches symlinks but not hard links; a pre-existing
  in-root hard link to an outside inode let writes escape. Fixed in just-bash 3.3.0 (PR #368). (Found
  via the repo's security-advisories API; the global GitHub Advisory DB query for `just-bash`
  returned nothing.)
- bash-tool: wraps just-bash as an AI SDK tool; its README says for full VM support install
  `@vercel/sandbox` "or another sandbox product instead of `just-bash`".

## Excerpts
> "All execution happens without VM isolation. This does introduce additional risk. The code base was designed to be robust against prototype-pollution attacks and other break outs to the host JS engine and filesystem." — README, "Security Model"

> "Use [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox) if you need a full VM with arbitrary binary execution." — README, "Security Model"

> "A hard link is a second directory entry for the same inode with no target to resolve, so an in-root name sharing an inode with a file outside the root passes that check and the write reaches the shared inode." — GHSA-g5pf-mh4h-h655, "Impact"

## Relevance to the talk
The purest **simulated environment**: the agent believes it has bash, but every "binary" is a host
function, so the policy surface is the TS interpreter plus whatever FS/network adapters you plug in.
Guarantee: no process creation, no syscalls the host did not implement, default no disk and no
network. Cost: no real toolchain: no `git`, `npm`, `pip`, compilers, test runners, or any binary not
reimplemented, and the reimplemented tools diverge in flags/behaviour (e.g. `rg` defaults to
smart-case). How it fails: (1) the bridges, e.g. the hard-link escape in `ReadWriteFs` is a classic
path-confinement bug resurfacing in a userland FS shim; (2) same-process JS means prototype pollution
and intrinsics tampering are the threat model; (3) no hard memory/CPU preemption for Wasm runtimes.
Good contrast slide with Vercel's own microVM product, which the README points to as the upgrade path.
