---
title: "fun-with-emulators — Roadmap"
url: https://github.com/e6qu/fun-with-emulators/blob/main/ROADMAP.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit 599ab63)
accessed: 2026-11-22
kind: repo
---

## Summary
Milestones M0–M8 with "Done when" criteria, the benchmark budgets that gate
CI, the remaining PRs to 1.0 (native speed, graphics, gVisor), post-1.0
virtual networking, and a "Not planned for 1.0" list with the measurements
that decided each. Note: ROADMAP's status table says M7 "Not started", but
commits #93/#94 (2026-11-21, after the file's last change) began M7 (an X11
display probe against Xvfb), and PR #95 "M7: graphical programs at work" was
open on 2026-11-22.

## Key points
- **Status table**: M0 Foundation, M1 Core userland, M3 Containers, M4
  Compatibility — done. M2 Everyday software — done but for the VM backend on
  real hardware. M5 Release — done but for the first signed release. M6 Native
  speed — under way. M7 Graphical programs and sandboxes — next. M8 Virtual
  networking — after 1.0.
- **M3 Containers** delivered "namespaces, cgroups v2, overlay mounts, seccomp
  and capabilities. *crun, Podman and containerd run standard images.*"
- **M4**: ptrace for `strace`/`gdb`, Docker with BuildKit and Compose,
  rootless Podman; "Every LTP system-call test that applies passes", the rest
  listed in `tools/ltp/exceptions.txt`.
- **Benchmark budgets in CI** (ratios to native macOS on the same runner):
  - one syscall (`getpid`, `fstat`, `open`+`close`, `mmap`+`munmap`…): **1.5×**
  - thread create/join, `fork`+exit+wait, `fork`+`exec`+wait, **start-up: 3×**
  - SQLite on disk, git, a JDK at work: **1.5×**
  - building Lua, Lua/Python scripts, xz: fwe's share of CPU samples **1.2×**
- **JIT numbers**: a function made and run takes **1.4 µs** on CI; translated
  micro benchmarks within 1.3× of native, except "4096 functions in turn"
  at 1.6× (19.1 ns vs 12.0 ns); Node.js and LuaJIT within 1.5×; OpenJDK within
  1.5× of Homebrew's build.
- **Remaining M6 PRs**: run clean generated-code pages natively; file lookups
  without the host (target `stat` in an image layer 0.5× macOS); cheaper `fork`
  (3× → 2×); 4 KiB pages natively on 16 KiB hosts; Wine natively (TEB in `x18`).
- **M7 PR 5 — gVisor on fwe**: `runsc` on its `systrap` platform
  (`SECCOMP_RET_TRAP`, `SIGSYS`, shared memory between sentry and stub) or
  `ptrace` platform, started by Podman/Docker, running a JDK workload,
  benchmarked against `runsc` on Linux.
- **M8 Virtual networking (after 1.0)**: per-netns addresses mapped to host
  loopback endpoints through a shared table "so no packet passes through fwe";
  container networks via netavark/Docker bridge driver; NAT "by construction".
  Packet-level features (iptables/nftables, packet sockets, TUN) "would need a
  TCP/IP stack inside fwe, as gVisor has" — out unless cheap enough.
- **Not planned for 1.0** (refused with `ENOSYS`/`EINVAL`/`EPERM` so programs
  fall back): io_uring; networking beyond loopback (veth, bridges,
  firewalling, packet sockets, TUN); `fanotify`; `CLONE_FILES` without
  `CLONE_VM`; pipes > 64 KiB; setting the clock and time namespaces; disk
  filesystems and block devices; swap and huge pages; **cgroup resource limits
  except `pids.max` ("accepted, not enforced")**; perf events; userfaultfd;
  CPU affinity; x86 binaries. Also rejected with numbers: inline caches,
  traces, "lookups without a load" (prototypes didn't beat the table).

## Excerpts
> "Packet-level features (iptables and nftables rules, packet sockets, TUN)
> would need a TCP/IP stack inside fwe, as gVisor has, which every packet would
> pass through" (§ M8)

> "**cgroup resource limits but `pids.max`** (memory, CPU, I/O): accepted, not
> enforced; the host shares its resources alike." (§ Not planned for 1.0)

## Relevance to the talk
Status and performance numbers in one place: concrete budgets (1.5× per
syscall, 3× start-up/fork, 1.5× for real workloads) to contrast with VM
boot times; the gVisor-on-fwe goal; and the honest note that cgroup memory/
CPU limits are recorded but not enforced — so fwe gives *structure*
(namespaces) more than *resource isolation*. Status-table caveat above should
be checked again closer to the talk.
