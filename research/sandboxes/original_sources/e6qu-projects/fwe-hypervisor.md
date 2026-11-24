---
title: "fun-with-emulators — The hypervisor backend"
url: https://github.com/e6qu/fun-with-emulators/blob/main/docs/hypervisor.md
authors: e6qu (Adrian Mârza)
date: 2026-11-20 (file last changed in commit a9bffa1)
accessed: 2026-11-22
kind: repo
---

## Summary
fwe's second backend runs a program that can't live in-process (a non-PIE
executable fixed below 4 GiB, where macOS keeps `__PAGEZERO`) in a minimal
Hypervisor.framework VM that holds **only the guest's CPU and memory — no
Linux kernel**; every syscall exits the VM to the same kernel crate as the
native backend. The document is largely about **safety rules**: misusing
Hypervisor.framework "can bring the whole Mac down, as a watchdog reset or a
kernel panic with no useful report". It describes the rules fwe keeps, a
Unicorn-based software **stand-in** that models and checks them in hosted CI,
a crash-surviving **flight recorder** for real-hardware runs, and the CI
arrangement (real VM tests only on a self-hosted bare-metal Mac "whose crash
costs nothing").

## Key points
- Needs the `com.apple.security.hypervisor` entitlement (ad hoc signature
  suffices), **no root**. Framework is `dlopen`ed lazily.
- **Design invariant**: "the framework must never see host memory change
  behind the VM, and a VM must never outlive its process." Stage 2 mapped once
  (the "slab" of guest memory + fwe's page-table pool and code page) and never
  changed while running; only the guest's stage-1 page tables (written by fwe,
  4 KiB pages, 40-bit VA) change. Break-before-make, TLB flush stub at EL1.
- **Run loop**: guest exceptions at EL0 go to fwe's vector → `hvc #2` (not
  `hvc #0`, which the framework may treat as firmware call) → vCPU exit →
  dispatch on `ESR_EL1` (SVC64 → syscall; aborts → SIGSEGV or retry; BRK →
  SIGTRAP; etc.).
- **Suspected crash causes**: VM process ending with VM alive; several VM
  processes ending together; a failed map then destroy; private memory mapped
  into two VMs. Peers that avoid trouble (hyper-linux, elfuse, Carrick) all map
  guest memory once and never share pages across VMs.
- **Safety rules** fwe keeps:
  - plain `cargo test` never starts a VM (real VM only with `FWE_HV_TESTS=1`);
  - every exit path tears the VM down first (exit_group, fatal signal, panics,
    execve); vCPUs destroyed by their own threads;
  - terminating signals caught; guest `SIGKILL` to an fwe process is sent as
    `SIGINFO` so the target tears down then dies of `SIGKILL`;
  - no host `fork` of a VM process (child would inherit an unusable VM);
    `fork` = fresh `fwe --hv-fork-child`, given a copy;
  - host memory behind the VM never replaced; `munmap`/`MADV_DONTNEED` edit
    stage 1 and zero slab memory;
  - one VM test at a time; never alongside another hypervisor client (krunkit,
    vfkit, QEMU, Virtualization.framework VMs, Podman machine).
- **Stand-in** (`fwe --hv-standin`): every framework call goes to Unicorn
  (QEMU's CPU emulator as a library); creates no VM, so safe anywhere; models
  stage 2 / stage 1 / exceptions / PAC / BTI and prints `VIOLATION:` lines that
  fail tests when a rule is broken. "A stand-in proves nothing about the real
  framework", so a real-hardware job exists.
- **Flight recorder** (`--hv-record`): synchronous log lines (with
  `F_FULLFSYNC`, or UDP datagrams "which a reset cannot take back") before and
  after every VM-changing call, plus heartbeats — so a machine crash leaves
  evidence.
- **CI fact**: GitHub's hosted macOS runners are VMs without nested
  virtualization — `hv_vm_create` returns `HV_UNSUPPORTED` even when correctly
  signed — so real-framework tests need a self-hosted bare-metal Apple-silicon
  runner. As of the roadmap, that run is still pending (an owner action).

## Excerpts
> "The VM holds only the guest's CPU and memory, no Linux kernel: every system
> call leaves the VM for the same kernel crate the native backend uses" (§ Summary)

> "Misusing Hypervisor.framework can bring the whole Mac down, as a watchdog
> reset or a kernel panic with no useful report." (§ Never end a VM process
> abnormally)

> "A stand-in proves nothing about the real framework: its rules are what fwe
> has seen the framework do, and the kernel crashes the backend may cause
> cannot happen in it." (§ The stand-in)

## Relevance to the talk
Shows the "VM per process, no kernel" point in the design space (Noah's
lineage; analogous to gVisor's KVM platform): hardware gives the guest a
separate address space, and the syscall interface becomes the only way out —
a materially smaller surface than the native backend. Also a vivid caution
about building on Hypervisor.framework from user space (host panics, nested
virtualization absent on hosted CI runners) — relevant to anyone proposing
"just spin up a microVM per agent on a Mac" (cf. `macos-windows/`).
