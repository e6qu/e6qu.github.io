---
title: "fun-with-emulators — Linux on macOS"
url: https://github.com/e6qu/fun-with-emulators/blob/main/docs/linux-on-macos.md
authors: e6qu (Adrian Mârza)
date: 2026-11-21 (file last changed in commit 7041f84)
accessed: 2026-11-22
kind: repo
---

## Summary
The big reference (~250 KB, ~3,100 lines): which binaries run in which
backend and why, which instructions are rewritten, how the VM is used, and
— the part most relevant to sandboxing — a primitive-by-primitive mapping of
Linux onto macOS ("Linux to macOS"), a status table for every Linux mechanism
("What fwe enforces": enforced / emulated / host / kept / ignored / refused),
and how host events reach the guest ("macOS to Linux"). Read selectively:
intro, "Two kernels, one CPU", "The low 4 GiB", "Which binaries need the
least translation", "Kernel-wide state", "Namespaces", "cgroups", "Mounts",
"Credentials and capabilities", "seccomp", "Security modules", "eBPF",
**"Isolation and security"**, "How the VM is actually used", and the
"Security" and "Namespaces and cgroups" enforcement tables.

## Key points
- **Two kernels, one CPU**: every guest process is one host process — a copy
  of `fwe` holding guest code + memory + the *kernel crate*. "What Linux keeps
  in one kernel for all processes (mount tables, namespaces, IPC objects) fwe
  keeps in records its processes share" — files in a private directory under
  the user's temp dir, changed under a lock, with a mapped generation counter.
  No server process (unlike Wine's `wineserver`).
- **Native vs VM**: native sees 16 KiB pages, VM 4 KiB; native guest
  addresses are host addresses. Syscall natively = `svc #0` rewritten to a
  branch to a stub that calls fwe's gate (or `brk #0x4c58` "LX" where no stub
  fits); in the VM = exception to EL1 → fwe's vector does `hvc #2` → vCPU exit.
- **The low 4 GiB**: macOS's mandatory 4 GiB `__PAGEZERO` means non-PIE
  executables linked at `0x400000` (GCC/clang default) or `0x10000` (static
  Go) can't run in-process; relocatable ones are moved 1 TiB up; the rest
  (Debian's python3.11, GCC, clang, Go 1.19, Debian's podman) go to the VM.
- **How namespaces are emulated** (§ Namespaces) — "macOS has no namespaces.
  fwe makes each as a shared record the processes in it name":
  - pid: numbers from 1 in a record mapping to host pids; `getpid`, `kill`,
    `wait`, `siginfo` translated; init's end kills the rest.
  - mount: a mount table per namespace, followed by fwe's path resolver
    (macOS mounts need root); propagation, `nosuid`/`nodev`/`noexec` enforced
    by fwe; overlayfs implemented with copy-up as an APFS clone.
  - user: `uid_map`/`gid_map` with Linux's rules; capabilities scoped per
    user namespace (`ns_capable` semantics).
  - network: loopback only; ports are host loopback ports mapped through a
    per-namespace table, "so each namespace has its own port 80".
  - UTS, IPC, cgroup namespaces emulated; time namespace refused (`EINVAL`).
- **How cgroups are emulated** (§ cgroups): one cgroup v2 tree per host user,
  directories in fwe's private dir, shown by a `cgroup2` mount. Enforced:
  delegation rules, `pids.max` (natively, not for VM threads), `cgroup.freeze`
  (`SIGSTOP`/`SIGCONT`), `cgroup.kill`, eBPF device programs (interpreted).
  **`memory.max`, `cpu.max`, `io.max`, `cpuset.*` — "kept and read back …
  not enforced"** ("macOS has no such limit for a process").
- **Credentials**: virtual uids/gids (root by default) and full Linux
  capability sets; `chown` stored in an xattr; the host file stays the user's.
- **seccomp**: classic-BPF filters run by fwe before either backend routes a
  call ("so none escapes it"); Docker/Podman seccomp profiles hold; no
  `SECCOMP_RET_USER_NOTIF` listener.
- **LSMs**: capabilities, **Landlock ABI 6** and Yama enforced by fwe;
  SELinux/AppArmor absent. **eBPF**: interpreted (2^20-step cap); cgroup
  device programs and socket filters only.
- **Isolation and security** (the key section for the talk): namespaces,
  cgroups, credentials, seccomp and Landlock are enforced *by fwe*, "between
  the guest's system calls and the host". That keeps well-behaved programs
  apart but "is not a boundary against a program that sets out to cross it":
  - native backend: the program shares fwe's address space; code that writes
    fwe's memory, jumps into libSystem or issues a raw macOS `svc #0x80` acts
    as the user.
  - VM backend: guest memory is separate; reaches the host only via syscalls
    and faults — "a much smaller surface, but fwe's userspace kernel is not
    hardened as a sandbox's is."
  - every guest user is the same macOS user; macOS's own protections (Seatbelt,
    SIP, TCC, firewall) apply to `fwe` as to any program.
  - "**So fwe isolates as `chroot` does, not as a VM does.**"
- **Timers**: Linux expects wakeups within 50 µs slack; macOS coalesces ≥1 ms;
  fwe uses a kqueue `NOTE_CRITICAL` timer per thread (tens of µs).
- **Not available** (`ENOSYS`): io_uring, perf_event_open, fanotify,
  userfaultfd, modules, kexec, swap, NUMA, rseq, memfd_secret…

## Excerpts
> "macOS has no namespaces. fwe makes each as a shared record the processes in
> it name; a process in an initial namespace sees the host's" (§ Namespaces)

> "macOS has no cgroups and no unprivileged way to hold a process to a memory
> or CPU budget." (§ cgroups)

> "Namespaces, cgroups, credentials, seccomp and Landlock are enforced by fwe,
> between the guest's system calls and the host. That is enough to run
> container runtimes and their containers as they expect, and to keep
> well-behaved programs apart. It is not a boundary against a program that sets
> out to cross it" (§ Isolation and security)

> "So fwe isolates as `chroot` does, not as a VM does. A program that must not
> be trusted is better run in a Linux VM" (§ Isolation and security)

## Relevance to the talk
The definitive answer to "how do you get namespaces/cgroups on macOS without
a VM?": emulate them in a userspace kernel as shared records, like gVisor's
Sentry implements them on Linux and WSL1 did in NT. The "Isolation and
security" section is the honest counterpoint: syscall-ABI emulation in the
*same address space* (native backend) is not a security boundary; the VM
backend shrinks the surface to the syscall interface (gVisor-KVM-like) but the
kernel isn't hardened. Good contrast slide: gVisor = userspace kernel *for
isolation*; fwe = userspace kernel *for compatibility*.
