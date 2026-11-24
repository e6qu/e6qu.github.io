---
title: "fun-with-sandboxes — Design"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/docs/DESIGN.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit b642daf)
accessed: 2026-11-22
kind: repo
---

## Summary
The full mechanism (~60 KB). The core problem: Docker's isolation on Linux
comes from namespaces, and macOS offers none to an unprivileged process — no
private `/`, no private network stack, no PID namespace, no cgroups, no
capability sets. fws's answer is **"isolation by assignment, enforced by
Seatbelt"**: the engine hands out non-overlapping resources (an APFS clone as
the root *directory*, a block of real loopback ports, a per-stack state
tree), and a generated Seatbelt profile stops a container using anything it
was not handed. An interposed library (`fwsroot`, injected with
`DYLD_INSERT_LIBRARIES`) *presents* the container view (paths, pid 1, users,
hostname, ports, DNS) — "fakechroot and fakeroot in one, presented and not
enforced". A per-container supervisor (`fws-shim`) replaces cgroups with
polling, kqueue process events, `SIGSTOP`, jetsam limits and rlimits.

## Key points
- **What it is not** (§1): "Not a multi-tenant or untrusted-code sandbox …
  against mistakes rather than attackers"; not a Linux runtime; not
  root-requiring (no `sudo`, kext, SIP off, `lo0` aliases or `pf` rules).
- **Accepted exceptions** (§1): a program not loading the library (Apple's
  `ps`) lists every process of the user by host pid, though Seatbelt still
  denies signalling/inspecting them; `sysctl`, the clock and the Mach host port
  are global and readable; the macOS system tree is readable.
- **Isolation model table** (§3), per dimension:
  - FS write: `(deny file-write*)` then allow own clone + volumes.
  - FS read: `(allow file-read* (subpath "/"))`, then deny `DeniedReadRoots`
    (`/Users`, `/Volumes`, `/Library`, `/opt`, `/usr/local`, `/nix`, temp …)
    and engine state, then re-allow own root/volumes. Gap: rest of system tree
    readable.
  - Ports: disjoint block per stack, `(deny network-bind)` except grants. Gap:
    "Host sees all listening sockets globally".
  - Signals: `(deny signal)` / `(deny process-info*)` except same-sandbox. Gap:
    "pids are the host's (no PID namespace)".
  - Default deny: no IOKit, Mach registration, preferences, AppleEvents, kernel
    control sockets.
  - IPC: `ipc-posix-name-prefix` filters; SysV keys hashed with prefix — "a
    guessed hashed key reaches another container's object" (not kernel-enforced).
  - Identity: "Presented, not enforced: every process runs as the invoking user".
- **§3a Isolation and limits without cgroups** — the namespace/cgroup
  substitutes, each "enforced by a real mechanism or refused":
  - *Spawn helper* (C, `internal/pathmap/src/spawn.c`): `posix_spawn` with
    responsibility disclaimed (so it inherits no TCC grant), applies
    `--ulimit`, nice, I/O tier, fork ceiling, the compiled profile
    (`sandbox_apply`), then `POSIX_SPAWN_SETEXEC` with QoS clamp.
  - *Compiled profiles*: compile ≈ **15 ms** (`sandbox_compile_string`), apply
    bytecode ≈ **35 µs**; cached by SHA-256 of text + `kern.osversion`.
  - *Fork ceiling*: soft `RLIMIT_NPROC` = `kern.maxprocperuid` minus an eighth,
    so a fork bomb fails in-kernel while the user can still start programs.
  - *QoS clamp* (`posix_spawnattr_set_qos_clamp_np`), *machine guards* (memory
    pressure level / free disk → pause heaviest container).
  - *Exec anchor*: because Seatbelt lets a process signal only processes that
    inherited **its** sandbox (a process entering the same profile separately
    is a different sandbox), `docker exec` and health checks are started by an
    anchor process inside the container's sandbox.
  - *Shared PID namespaces* (`--pid container:`) emulated through the shims
    over Unix sockets, which answer the library's process listings/signals.
  - *Supervisor* tracks members via kqueue `NOTE_FORK`, the responsible-process
    relationship and an env tag; samples every **100 ms** (the CFS period):
    `--memory` = sum of physical footprints + per-process jetsam fatal limit
    (`posix_spawnattr_setjetsam_ext`, which survives no fork/exec and cannot be
    changed afterwards); `--cpus` via `SIGSTOP` until quota repaid;
    `--pids-limit` via the library asking the shim before `fork`.
  - *Network I/O accounting* via the unprivileged `com.apple.network.statistics`
    control socket.
  - *Nested engines* for `--privileged`: since macOS refuses a second Seatbelt
    profile, nested containers are the outer engine's processes in sandboxes
    of their own.
  - *Container library*: interposes ~160 libSystem functions (paths, identity,
    hostname, sockets, DNS incl. Network.framework's dnssd path, ICMP).
    `sendfile`, refused under a profile, becomes a copy.
- **§4 Root filesystem**: every layer unpacked once; image root built with
  `clonefile` per subtree so images share blocks; container root = `clonefile(2)`
  of image root — "copy-on-write, constant time, and near zero bytes until the
  container writes, with no union mount and no root". Owners and setuid bits
  stored in xattrs and only presented.
- **§5 Per-stack assignment**: ports 20000–29999 in blocks of 100; paths under
  `stacks/<stack>/`; persisted in `alloc.json`.
- **§6 Networking without root**: Seatbelt allows binding exactly the
  container's host ports on loopback. Isolation between stacks is the port-block
  fence; **between members of one stack the separation is the library's, not
  the kernel's**. Member addresses in `127.88.0.0/16` are presented, never
  routed. **Egress**: "Seatbelt can allow loopback ports or every destination,
  nothing in between", so internet goes through a per-stack HTTP+SOCKS5 proxy
  with HMAC credentials per container; the proxy resolves once, refuses
  loopback/link-local/multicast/host addresses and dials the checked address
  ("so DNS cannot rebind a name onto the host").
- **§9 Launch sequence & start cost**: process start ≈ **3.4 ms** native to
  reach `main`, **7 ms** with any inserted library (dyld loses its prebuilt
  launch closure), ≈ **4 ms** more for the library's 160 interposed functions
  (~25 µs each) — `BenchmarkStartCost`, CI macOS 26 runner.
- **§11 Testing**: "Every isolation property is proven by a test that tries to
  break it, on a macOS runner"; flagship e2e: two Compose stacks
  (postgres+redis+app) that cannot reach each other's ports or paths.

## Excerpts
> "This is **isolation by assignment, enforced by Seatbelt**: the engine hands
> out non-overlapping resources, and Seatbelt stops a container using anything
> it was not handed." (§2)

> "macOS gives an unprivileged process no cgroups, namespaces or capability
> sets. The engine composes what it does give — `posix_spawn` attributes,
> `setrlimit`, `setpriority`, `setiopolicy_np`, `proc_pid_rusage`, kqueue
> process events, `SIGSTOP`/`SIGCONT` and Seatbelt's filters — into the same
> knobs, each enforced by a real mechanism or refused" (§3a)

> "Compiling a profile's text takes libsandbox about 15 ms; applying bytecode
> takes the kernel about 35 µs." (§3a)

> "Seatbelt can allow loopback ports or every destination, nothing in between,
> so containers reach the internet through a proxy the engine runs for each
> stack" (§6)

> "fakechroot and fakeroot in one, presented and not enforced, as Seatbelt
> still decides every access by the engine's user." (§3a, Container library)

## Relevance to the talk
The technical core for an fws section: a concrete mapping table of
Linux-container primitives → macOS unprivileged substitutes. Key talk points:
(1) Seatbelt is the *enforcement* layer, the interposed library is only the
*view* — the enforce/present split is a crisp way to explain why this is not
a security boundary; (2) the egress-proxy trick shows Seatbelt's network
filter expressiveness gap (loopback ports or "everything") — directly
relevant to coding agents that need internet but must not hit the host;
(3) numbers: ~35 µs to apply a sandbox, millisecond-scale starts, no VM memory
reservation.
