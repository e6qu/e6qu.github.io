---
title: "fun-with-sandboxes — Limitations"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/LIMITATIONS.md
authors: e6qu (Adrian Mârza)
date: 2026-11-22 (file last changed in commit 19c2f5b)
accessed: 2026-11-22
kind: repo
---

## Summary
An exhaustive list of where fws differs from Docker on Linux, nearly all
following from "no root and no virtual machine" plus what macOS offers an
unprivileged process. Organised into Images, Isolation, Networking,
Kubernetes, Resources and API surface. The Isolation and Networking sections
are the honest ledger of what a Seatbelt-based container does *not* give.

## Key points
- **Images**: macOS-native only ("Nothing on macOS runs Linux ELF binaries
  without a VM"); `--platform` other than `darwin/<arch>` refused; disk
  figures are estimates because roots are clones sharing blocks.
- **Isolation**:
  - "**Not a security boundary against hostile code.** Containers run as the
    engine's user; Seatbelt keeps stacks apart and the host's data out of
    reach, against mistakes rather than attackers."
  - "A container's view is presented by a library, not the kernel." Programs
    Apple signs, static binaries, and programs making raw syscalls without
    libSystem load no library and see host paths, pids, ports and network
    (Seatbelt still restricts what they can *do*). `/proc` is an empty dir.
  - Identity "presented, not enforced: every process runs as the engine's
    user"; setuid/setgid bits never take effect.
  - **PIDs**: "There is no unprivileged PID namespace." Through the library a
    container sees only its own processes and its main process as pid 1;
    Apple's `ps` sees all the user's processes; Seatbelt denies signalling or
    inspecting others.
  - **IPC**: POSIX names prefixed per container (Seatbelt-enforced). SysV keys
    are only hashed with the prefix, "which Seatbelt cannot enforce: a program
    without the library, or one guessing a hashed key, reaches another
    container's objects."
  - Namespace modes (`--pid`, `--uts`, `--network container:`) are presented;
    `--userns` refused. Capabilities grant nothing to drop; seccomp/AppArmor/
    SELinux options refused except `unconfined`.
  - macOS system tree readable and host shells executable (binaries need them).
- **Networking**:
  - No host network mode; bridge driver only.
  - "Container addresses are presented, not routed" (`127.88.0.0/16`); servers
    see clients from `127.0.0.1`.
  - "A stack's block is one reachability domain. Within a stack, network
    membership is presented, not enforced": a program without the library
    reaches any member's host port; a host process that later binds a port in
    a stack's block is reachable from that stack.
  - "**Internet access goes through a proxy.** Seatbelt cannot express 'any
    host but this machine'" — HTTP(S) via `HTTP_PROXY`, any TCP via SOCKS5;
    **UDP does not leave the machine**.
  - DNS answered in-library and by a per-container router; ICMP to the virtual
    network answered by the library; raw sockets need root.
  - Unix socket paths capped at 104 bytes.
- **Resources** (enforced by `fws-shim` every 100 ms, the spawn helper and
  kernel per-process limits, "not by a cgroup"):
  - `--memory`: jetsam fatal footprint limit per process + supervisor sum;
    "An allocation never fails first" — the process is killed (`OOMKilled`).
    Can be lowered, not raised, on a running container.
  - `--cpus`/`--cpu-quota`: `SIGSTOP` over quota (a parent sees children
    stop/continue). `--cpu-shares` → nice (only root lowers). Cpusets and RT
    refused.
  - `--pids-limit` counts processes, not threads.
  - `--ulimit` only nofile, fsize, cpu, core, stack (macOS doesn't enforce
    data/as/rss).
  - Machine guard pauses the heaviest container under critical memory
    pressure or <2 GiB disk; containers share the user's process limit, held
    an eighth below `kern.maxprocperuid`, and run under a QoS clamp.
  - `--privileged` = a nested engine only; Linux `docker:dind`, `kindest/node`
    and Podman need a VM.
  - tmpfs = directories on disk, not memory-backed.
  - Refused (no macOS counterpart): most `--sysctl`, `--userns`, other
    runtimes, devices, `--gpus`, device cgroup rules, `--cgroup-parent`,
    `--oom-score-adj`, `--storage-opt`, other volume/mount drivers.
- **API surface**: no swarm, services, secrets, configs, plugins, image search.

## Excerpts
> "Almost every limit follows from the two constraints, no root and no virtual
> machine, and from what macOS offers an unprivileged process under them."
> (intro)

> "Processes have host pids, but pid 1. There is no unprivileged PID
> namespace." (§ Isolation)

> "Seatbelt cannot express 'any host but this machine', so containers reach
> the internet through their stack's egress proxy … UDP does not leave the
> machine." (§ Networking)

## Relevance to the talk
The "what you give up without a VM" slide. Concrete, enumerated gaps:
shared UID, shared PID space, shared loopback, SysV IPC by convention,
presented (not routed) addresses, kill-not-refuse memory limits. Useful
contrast with Linux namespaces/cgroups (`os-primitives/`) and with
per-container VMs like Apple `container` (`macos-windows/`). Also a model of
how to document a sandbox's limits honestly.
