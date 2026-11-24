# e6qu projects — fun-with-sandboxes and fun-with-emulators

The talk author's own two projects. Both answer, from opposite ends, the
question "how do you get container-like isolation on a Mac without a VM per
workload?". Accessed 2026-11-22 via the GitHub API (`gh`); nothing was
cloned or run.

## Repository metadata

| | [e6qu/fun-with-sandboxes](https://github.com/e6qu/fun-with-sandboxes) (fws) | [e6qu/fun-with-emulators](https://github.com/e6qu/fun-with-emulators) (fwe) |
|---|---|---|
| What | Docker/Podman/CRI-compatible container engine; containers = Seatbelt-confined macOS process trees on APFS clones | Linux user-space ABI on macOS (userspace Linux kernel); native in-process + Hypervisor.framework backends |
| Language | Go (≈2.2 MB) + C (spawn helper, interposed library), Nix | Rust (≈5.9 MB) + C, Python, asm |
| Licence | none declared | MIT |
| Repo created | 2026-10-31 | 2026-11-01 |
| First commit | 2026-11-01 `3122164` "docs: plan and design for a no-root, no-VM macOS container engine" | 2026-11-01 `d6e8797` "Add plan, roadmap and MIT license" |
| Commits on `main` | 95 | 110 |
| Latest commit | 2026-11-22 "The catalog at its newest upstream releases" | 2026-11-21 "M7: a display for Linux and Windows programs (#94)" |
| PRs (highest number) | #83 (open: catalog closer to upstream) | #95 (open: "M7: graphical programs at work") |
| Stars / forks | 0 / 0 | 0 / 0 |
| Size (GitHub `size`) | 10,602 KB | 9,386 KB |
| Status | "Feature-complete for its purpose"; roadmap closed (#80) | M0–M5 done (VM backend on real HW and first signed release pending); M6 native speed under way; M7 graphics/gVisor starting |

Both went from first commit to their current state in about three weeks
(fws carries a `CLAUDE.md`, fwe an `AGENTS.md`).

## Index

fun-with-sandboxes:
- [fws-readme.md](fws-readme.md) — overview, container contract, allowed/denied table, catalog.
- [fws-plan.md](fws-plan.md) — constraints ("no VM, no root", "honour or refuse"), non-goals (incl. "a security boundary against hostile code").
- [fws-design.md](fws-design.md) — "isolation by assignment, enforced by Seatbelt"; namespace/cgroup substitutes; egress proxy; start-cost numbers.
- [fws-seatbelt.md](fws-seatbelt.md) — Seatbelt explainer + tutorial; fws's profile sections; no nested sandboxes; limits.
- [fws-limitations.md](fws-limitations.md) — every gap vs Docker on Linux: shared UID/PIDs/loopback, presented addresses, kill-not-refuse limits.
- [fws-history.md](fws-history.md) — build history and investigations (responsible process, immutable profiles, 5.6 ms vs 1.7 ms start).

fun-with-emulators:
- [fwe-readme.md](fwe-readme.md) — overview, backends, CI-verified status.
- [fwe-plan.md](fwe-plan.md) — goal, Wine/WSL1 approach, 1.0 definition (incl. gVisor on fwe), principles.
- [fwe-roadmap.md](fwe-roadmap.md) — milestones, benchmark budgets, gVisor plan, virtual networking, not-planned list.
- [fwe-linux-on-macos.md](fwe-linux-on-macos.md) — namespaces/cgroups/seccomp/Landlock emulation; "isolates as chroot does, not as a VM does".
- [fwe-architecture.md](fwe-architecture.md) — crates, syscall path, container machinery.
- [fwe-comparisons.md](fwe-comparisons.md) — design-space taxonomy vs Wine, WSL1/2, gVisor, Linuxulator, QEMU, Noah, Rosetta, Apple `container`.
- [fwe-hypervisor.md](fwe-hypervisor.md) — kernel-less VM per process; safety rules; stand-in; flight recorder.
- [fwe-jit.md](fwe-jit.md) — (skim) translating JIT-generated code.
- [fwe-notes-research.md](fwe-notes-research.md) — (skim) survey notes, incl. published start-up/syscall/fork numbers for macOS Linux options.

## The author's framing (2026-11-22, for the talk)

- **fws is packaging, not containers.** It packages software for the Mac behind
  the Docker and Docker Compose APIs *without actual containers*. It uses whatever
  isolation macOS offers (Seatbelt, APFS clones, per-stack port blocks) and patches
  the remaining holes in the fws runtime: an interposed library, an egress proxy,
  and a machine guard for resource limits. This echoes Docker's 2013 origin as
  packaging on top of existing isolation (see `../os-primitives/docker-pycon-2013-lightning-talk.md`).
- **fwe copies containers' isolation primitives.** The point is to reproduce
  Linux's container machinery (namespaces, cgroups, seccomp, Landlock, mounts,
  overlayfs) on macOS, so unmodified container runtimes and images run. This
  is the WSL1/gVisor lineage: a userspace implementation of the Linux kernel ABI.

## Synthesis: "lighter than a VM per agent on macOS"

On Linux, a lightweight sandbox per agent is cheap: namespaces, cgroups,
seccomp and Landlock come with the kernel. macOS gives an unprivileged
process none of those, so the usual answer is a Linux VM, which costs
seconds to boot, a fixed memory allotment and file sharing through virtiofs.
The two projects show the two other routes.

**fws: confine macOS processes (Seatbelt-based process containers).** Each
container is an ordinary process tree under a generated Seatbelt profile,
rooted in an APFS copy-on-write clone, with a block of loopback ports per
stack and an egress proxy for internet. A start costs about 5.6 ms against
1.7 ms native; applying a compiled profile takes about 35 µs; an idle
container costs nothing. *What the kernel enforces:* file reads and writes by
path, binding and connecting only to assigned loopback ports, exec only from
the root, signals only within the sandbox, a short allow-list of Mach
services, IPC by name prefix, deny-by-default for IOKit and the rest.
*What it does not give:* a private PID space, network stack, UID or SysV key
space. Those are only *presented* by an interposed library, and resource
limits come from polling, `SIGSTOP` and jetsam. It also cannot be nested
(macOS refuses a second profile), and network filtering is "loopback ports or
everything", which is why the egress proxy exists. The project's own words:
"not a boundary for untrusted or multi-tenant code".

**fwe: run Linux binaries with no Linux kernel (syscall-ABI emulation like
WSL1 or gVisor).** Linux arm64 code runs directly on the M-series CPU.
Syscalls go to a userspace Linux kernel that emulates namespaces, cgroup v2,
mounts, overlayfs, capabilities, seccomp, Landlock and eBPF device filters,
enough for Docker, Podman and crun to run real images. Startup is in
milliseconds, with CI budgets of 1.5× native per syscall and 3× for
start-up and fork. *Isolation:* a hidden VM backend gives low-linked
programs their own address space, so the syscall interface is their only way
out (like gVisor-KVM or Noah). The native backend shares fwe's address
space. Memory and CPU cgroup limits are recorded but not enforced, and every
guest user is the same macOS user. fwe's own verdict: it "isolates as
`chroot` does, not as a VM does."

**Placing them in a talk.** Put them side by side on the axis "who answers
the syscalls?". fws keeps the macOS kernel and narrows what it will do, the
same Seatbelt route that Claude Code, Codex and sandbox-runtime take, scaled
up to a whole Docker-compatible engine. fwe replaces the kernel's personality,
the WSL1, Linuxulator and gVisor lineage. Neither is a hard boundary against
hostile code, and both say so. They show the ceiling of "lighter than a VM"
on macOS today: you can get cheap, dense, millisecond workloads that stop an
agent's mistakes, but stopping an attacker still needs a VM, or a layered
design such as fwe's goal of gVisor's `runsc` on top of fwe and a Seatbelt
profile around the whole stack.
