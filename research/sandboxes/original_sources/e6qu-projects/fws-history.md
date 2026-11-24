---
title: "fun-with-sandboxes — History"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/docs/HISTORY.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit d27205f)
accessed: 2026-11-22
kind: repo
---

## Summary
A record of what was built, in order (first milestone → KinD in seven steps →
"light, steady, general" track → dev containers/GUI/DNS/IPv6 → end of
roadmap), and a set of debugging "investigations" whose findings still
matter. The whole project went from first commit (2026-11-01) to
"feature-complete" in about three weeks, with the history written so a later
change "can learn why". Figures are "measurements of their day".

## Key points
- **First milestone**: two independent Compose stacks (postgres + redis +
  app) run concurrently on a macOS CI runner, on different ports, unable to
  reach each other's ports or paths; `down` on one leaves the other working.
- **Kubernetes in Docker, steps 1–7** (PRs #48–#54): nested engines and
  `fws/dind`; Podman's API; a darwin control plane built with Nix; a kubelet
  patched for macOS ("a container manager without cgroups", static pod watcher
  on kqueue); cluster networking via `fws-kube-proxy` and the library's
  resolver (no CoreDNS); `fws/kind-node`; `TestKindCluster` two-node test.
- **"Light, steady, general" (from #65)**: aim = "containers lighter than a
  VM's, whose limits keep the machine standing … at no root, no VM and no more
  than microseconds per call." Added QoS clamp, fork ceiling, machine guards;
  event-driven process tracking ("an idle container costs nothing"); work moved
  out from under the engine lock.
  - *Lesson*: growable port blocks were **not** pursued because "a profile
    cannot change once applied" — Seatbelt profiles are immutable for a
    running process.
  - Set aside: mapping `apt-get` to Nix, Linux image converters.
- **Memory limits in the kernel** (#71): an unprivileged parent can set a
  child's jetsam fatal footprint limit with `posix_spawnattr_setjetsam_ext`;
  it survives no fork/exec and no process can read or change it afterwards.
- **What the library costs a start** (#72): any inserted library ≈ 3.5 ms,
  `fwsroot`'s interposing ≈ 4 ms more, spread evenly over 160 functions.
- **No second sandbox** (#78): verified on macOS 15 and 26 that any Seatbelt
  profile, even `(allow default)`, blocks entering another (`EPERM`).
- **Investigations worth retelling**:
  - *Processes outliving their container*: `pg_ctl` daemonises into a new
    session and Postgres rewrites argv/env, so neither process group nor env
    tag found its children. Fix: spawn the main process with responsibility
    disclaimed so macOS's **responsible process** attribution marks everything
    under it — macOS's closest analogue to a cgroup membership.
  - *Symlinks resolved on the host*: absolute links in images (`/data ->
    /Users/me`) made mounts/`COPY`/copy-up write to host paths; now resolved
    inside the root "as a chroot would" (a classic chroot-escape class).
  - *Container start cost*: 1.15 s turned out to be a race-detector build of
    the shim; of the remaining ~20 ms, 15 ms was profile compilation vs **35 µs**
    to apply bytecode → cache compiled profiles; Go spawn helper replaced by C.
    A start then took **≈5.6 ms vs 1.7 ms native**, the rest being dyld cost of
    an inserted library.
  - *Per-call overhead*: `stat` reading two xattrs cost ~9 µs each; marking
    files with `UF_NODUMP` brought `stat`/`open` within ~1 µs of native.
  - *MongoDB `ECONNREFUSED 127.0.0.1:65535`*: a router protocol used port
    `0xffff` as a marker — one run in 16384 failed. Requests now lead with a
    kind byte.
  - *ClickHouse exit 134*: binding `::` then `0.0.0.0` on one port; Darwin vs
    Linux `getpeername`/`setsockopt` differences on shut-down sockets; and
    `pthread_setname_np` using `getpid()` which the library made return 1, so
    the kernel refused to name a thread of launchd.
  - *pids-limit cost*: every `fork` listed all of the user's processes; now
    reads per-parent child lists from the kernel.
  - *Test loop*: ~3 hours per CI round (60–90 min image builds + 50 min e2e);
    sharded, cached archives, lazily loaded images.

## Excerpts
> "The aim from #65 on: containers lighter than a VM's, whose limits keep the
> machine standing, with more of what Docker users write working, at no root,
> no VM and no more than microseconds per call." (§ Light, steady, general)

> "Port blocks that grow with a stack were not pursued: a profile cannot change
> once applied, so a running container could not reach ports in a block added
> later." (§ Light, steady, general)

> "The kernel's lasting mark is the *responsible process*: the main process is
> spawned with responsibility disclaimed, so macOS holds it responsible for
> everything started under it." (§ Investigations)

> "A start then took about 5.6 ms against 1.7 ms native, the rest being the
> loader's cost for the inserted library" (§ Investigations)

## Relevance to the talk
Good war stories for a talk: the "responsible process" as macOS's hidden
cgroup; immutable Seatbelt profiles; the chroot-style symlink escape bug
class; and quantified start cost (~5.6 ms vs 1.7 ms native, vs seconds for a
VM). Also shows the development pace (feature-complete in ~3 weeks) — likely
heavily agent-assisted, which may itself be a talk anecdote (the repo has a
`CLAUDE.md`).
