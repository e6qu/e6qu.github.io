---
title: "fun-with-sandboxes — README"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/README.md
authors: e6qu (Adrian Mârza), the talk's author
date: 2026-11-22 (file last changed in commit 19c2f5b; repo first commit 2026-11-01)
accessed: 2026-11-22
kind: repo
---

## Summary
fun-with-sandboxes (`fwsd`, "fws") is a container engine for Apple-silicon
macOS that serves the Docker Engine API (plus Podman's libpod and Kubernetes'
CRI) on a Unix socket, so stock `docker`, `docker compose`, Testcontainers,
`podman --remote`, `crictl`, the kubelet and kind drive it unchanged. It uses
no VM and no root: each container is a host process tree confined by a
generated **Seatbelt** profile and rooted in an **APFS copy-on-write clone** of
its image; each Compose project ("stack") gets its own block of loopback host
ports and its own directory tree. Images are macOS-native (`darwin/arm64`),
built from Nix; Linux images cannot run. The README states plainly that it is
for running a project's tests and services, **not a boundary for untrusted or
multi-tenant code**.

## Key points
- Pitch: "a container starts in milliseconds and costs only its processes,
  where Docker on a Mac runs everything in a Linux VM."
- Install is `go install` of `fwsd` + `fws-shim`; at start `fwsd` builds the
  container library and spawn helper with clang. It **refuses to run as root**.
- Daemon flags worth noting for the talk: `-port-base/-port-limit/-block-size`
  (default ports 20000–30000 in blocks of 100 per stack), `-egress` (per-stack
  HTTP + SOCKS5 proxy, on by default), `-machine-guard` (pause the heaviest
  container under critical memory pressure or <2 GiB free disk),
  `-qos-clamp` (default `utility`: containers yield CPU/disk to the user),
  `-live-restore`.
- **The container contract** — because macOS gives an unprivileged process "no
  private `/` and no private network stack", a container cannot own
  `/var/lib/postgresql/data` or port 5432. An injected container library maps
  container paths into the root and container ports onto loopback host ports;
  `SANDBOX_ROOT`, `SANDBOX_PORT_<n>`, `SANDBOX_<SERVICE>_PORT_<n>`,
  `SANDBOX_IPC_PREFIX` etc. tell programs that do not load the library.
- **Allowed/denied table** (the one-slide summary of what Seatbelt gives):
  - Files: write own root + volumes, read macOS system tree; denied reading
    `/Users`, `/Volumes`, `/Library`, `/opt`, `/usr/local`, `/nix`, temp dirs,
    other stacks.
  - Network: listen only on assigned loopback ports; connect only to own
    stack's ports; internet only via the stack's egress proxy (which refuses
    the host itself).
  - Processes: exec only binaries in its root + system shells; signal only its
    own processes.
  - Mach services: user lookup, notifications, logging, cert trust; denied
    keychain, pasteboard, Launch Services, TCC "and everything else".
  - IPC: POSIX shm/semaphores and Mach services under its own prefix; SysV
    under its own keys.
  - Everything else (IOKit, Mach registration, preferences, kernel control
    sockets) denied by `(deny default)`.
- `--security-opt seatbelt=gui` opens the login session (WindowServer,
  pasteboard, fonts, GPU, audio) so Electron apps / VS Code run in a container;
  keychain stays denied. Chromium-based apps need `--no-sandbox` because macOS
  refuses a second Seatbelt profile to an already-sandboxed process.
- Resource limits without cgroups: a per-container supervisor enforces
  `--memory`, `--cpus`, `--cpu-quota`, `--pids-limit`; `--ulimit`,
  `--cpu-shares` (nice) and `--blkio-weight` (I/O tier) applied at spawn.
  Things that need root or a VM (cpusets, added capabilities, host networking,
  non-bridge drivers, devices) **fail with an error** rather than being
  silently dropped.
- `--privileged` gives a container a nested engine of its own (Docker-in-Docker,
  kind nodes), nothing more.
- Catalog: ~46 darwin images (Postgres, MySQL, Redis, Kafka, Mongo, etcd, the
  Kubernetes 1.37.2 control plane, kubelet, kind-node, k3s, dind, Playwright…)
  published as `ghcr.io/e6qu/fws-*`; `fws-mkimage` turns any Nix closure into
  a self-contained image. BuildKit is embedded with a darwin worker; `RUN`
  steps run under the same Seatbelt confinement.

## Excerpts
> "A container engine for macOS that runs Docker Compose stacks side by side on
> one Mac — without root and without a virtual machine." (opening)

> "It is not a boundary for untrusted or multi-tenant code." (opening)

> "Each container is a process tree on the host, confined by a generated
> Seatbelt profile (the macOS sandbox) and rooted in an APFS copy-on-write
> clone of its image." (opening)

> "macOS gives an unprivileged process no private `/` and no private network
> stack, so a container cannot own `/var/lib/postgresql/data` or port 5432."
> (§ The container contract)

## Relevance to the talk
The headline example of "lighter than a VM per agent on macOS": a full
Docker-compatible workflow where isolation is Seatbelt + COW clones + port
assignment. The allowed/denied table is slide-ready and shows exactly what
the macOS sandbox can express (files, ports, Mach services, IPC prefixes,
signals) and what it can't (no private PID/net namespaces). The explicit
"not a boundary for untrusted code" is important for honesty in an
agent-sandboxing talk: it is a *mistake* fence, not an *attacker* fence.
