---
title: "fun-with-sandboxes — Seatbelt"
url: https://github.com/e6qu/fun-with-sandboxes/blob/main/docs/SEATBELT.md
authors: e6qu (Adrian Mârza)
date: 2026-11-20 (file last changed in commit 208ffab)
accessed: 2026-11-22
kind: repo
---

## Summary
A self-contained explainer and hands-on tutorial for Seatbelt, the macOS
sandbox (`Sandbox.kext`, `libsandbox`, `sandbox-exec`), followed by how fws
renders and applies a per-container profile. It explains the SBPL profile
language (a Scheme dialect), its two non-obvious precedence rules, a
five-step tutorial anyone can run on a Mac, the sections of fws's generated
profile, how fws applies compiled bytecode without `sandbox-exec`, and
Seatbelt's limits ("Seatbelt confines a process. It does not virtualise
one"). Probably the single most reusable document for a talk section on
macOS sandboxing.

## Key points
- **Mechanism**: a kernel extension checks each operation a sandboxed process
  makes against its profile: file read/write, socket bind/connect, Mach
  service lookup/register, POSIX and SysV IPC, IOKit user clients, exec,
  signals. Denials fail with `EPERM` and are logged (`log stream --predicate
  'sender == "Sandbox"'`).
- **Entering**: `sandbox-exec -f profile.sb cmd`, or `sandbox_init` /
  `sandbox_init_with_parameters`. Inherited by every child. **No root needed.**
  A process enters once and cannot leave.
- **No nesting**: macOS refuses `sandbox_init`/`sandbox_apply` with `EPERM` to
  a process already under *any* profile, even `(allow default)`, on macOS 15
  and 26 (`TestSecondSandboxRefused`). Consequence: Chromium/Electron inside a
  container must run `--no-sandbox`; nested engines can't stack profiles.
  (Relevant for agents: an agent tool that sandboxes itself cannot be run
  inside another Seatbelt sandbox.)
- **Status**: Apple marks `sandbox-exec` deprecated and leaves SBPL
  undocumented, "but both keep working, and macOS's own services depend on
  them"; best references are `/System/Library/Sandbox/Profiles/` and
  `/usr/share/sandbox/`.
- **SBPL**: `(version 1) (deny default) (import "system.sb")` then rules with
  filters: `literal`, `subpath`, `regex`, `(local ip "localhost:8080")`,
  `(remote ip …)`, `global-name`/`global-name-prefix` for Mach,
  `ipc-posix-name-prefix`, `(param "ROOT")`.
- **Precedence gotchas**: (1) among rules for the same operation the *last*
  match wins; (2) a rule with *no filter* outranks every filtered rule
  wherever it stands — so `(allow file-read*)` undoes a later
  `(deny file-read* (subpath …))`; use `(allow file-read* (subpath "/"))`.
  Also: matching uses resolved paths (`/tmp` → `/private/tmp`).
- **Tutorial** (runs as any user, nothing to install): confine writes to one
  dir; deny reads below an allowed tree; confine a server to loopback port
  8080 (binding 8081 or `0.0.0.0:8080` fails); show children inherit.
- **fws's generated profile, by section**: baseline (`deny default` +
  `system.sb`, forks, sysctl reads, ptys; deny kernel-control and link-layer
  socket domains 32 and 27); file writes (root, volumes, port dir); file reads
  (all of `/` minus `DeniedReadRoots`, plus own root etc.; only the libraries
  may be mapped executable from outside the root); exec (root, volumes not
  `noexec`, system shells, `/usr/bin/env`, `fws-shim`); network (own Unix
  sockets; bind assigned loopback ports; connect to own stack's block and
  egress proxy); Mach (fixed list `MachServices`, plus own services under the
  IPC prefix); IPC (prefix-filtered); signals/process-info (same sandbox only);
  GUI session only with `seatbelt=gui` (keychain still denied); read-only and
  masked paths last; IOKit and everything else denied.
- **Applying without `sandbox-exec`**: the engine compiles once with
  `sandbox_compile_string`; the C spawn helper applies bytecode with
  `sandbox_apply` "in microseconds (compiling takes about 15 ms)" and execs the
  program directly. Avoiding an Apple-signed binary in between matters because
  macOS strips `DYLD_INSERT_LIBRARIES` from Apple-signed (and hardened-runtime)
  programs; fws re-signs hardened binaries ad hoc so the container library
  still loads.
- **"Seatbelt decides what a container may do; the library decides only what
  it sees."**
- **Exec anchor**: a process that enters a profile by itself is a *separate*
  sandbox, and may only signal processes of its own sandbox — so execs and
  health checks go through an anchor started inside the main process's sandbox.
- **Limits** (§ Limits):
  - "The host's view stays visible": shared process list, loopback and SysV
    IPC keys.
  - Containers run as the engine's user — "still no security boundary against
    code that sets out to attack the host".
  - Undocumented interface: Apple can change operations and filters between
    releases; rule tests in `internal/seatbelt` (profile text tests + probes
    under the real sandbox) are what notice.

## Excerpts
> "The engine confines containers with Seatbelt because it is the one
> confinement macOS gives an unprivileged process: no root, no kernel extension
> of its own, no virtual machine." (intro)

> "A sandboxed process cannot enter a second one: macOS refuses `sandbox_init`
> and `sandbox_apply` with `EPERM` to a process under any profile, even
> `(allow default)`, on macOS 15 and 26" (§ How it works)

> "A rule with no filter outranks every filtered rule for its operation,
> wherever it stands." (§ The profile language)

> "Seatbelt confines a process. It does not virtualise one" (§ Limits)

## Relevance to the talk
Core source for the macOS part of the talk: what Seatbelt *is*, how to write
a profile, live-demo-able tutorial commands, and a precise list of what it
can confine (files, sockets by loopback port, Mach services, IPC names, exec,
signals, IOKit) versus what it cannot (it gives no private process list, no
private network stack, no private SysV key space, no identity change, no
nesting). Pairs naturally with the Anthropic sandbox-runtime / Claude Code
and Codex Seatbelt usage in `agent-sandboxing/` — those tools hit the same
"no nesting" and "network = loopback ports or everything → use a proxy"
constraints.
