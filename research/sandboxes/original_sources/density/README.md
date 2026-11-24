# Density — how many isolated workloads fit on one machine

Sources on the per-instance cost of isolation, from the kernel's own bookkeeping
down to software fault isolation, and on designs that cut it.

| File | Source |
|---|---|
| [kapteko-15-million-webservers.md](kapteko-15-million-webservers.md) | kapteko, 2026-11-18: 15M web servers on one 10 GB / 1-core VM with LFI + smoltcp + DPDK/AF_XDP |
| [kapteko-10-million-codex-clis.md](kapteko-10-million-codex-clis.md) | kapteko, 2026-10-21: a 70 KB minimal Linux process, and why containers, gVisor and microVMs keep per-agent costs; LFI as the alternative |
| [kapteko-userland-scheduler.md](kapteko-userland-scheduler.md) | kapteko, 2026-11-03: a preemptive userland scheduler, so the sandbox runtime is also the scheduler and clock |
| [lfi-asplos24.md](lfi-asplos24.md) | Yedidia, ASPLOS '24: Lightweight Fault Isolation, 64Ki sandboxes per address space at ~7% overhead, with a verifier |
| [llvm-lfi-docs.md](llvm-lfi-docs.md) | LLVM docs: LFI is an upstream AArch64/x86-64 target |
| [nanvix-arxiv-2604.11669.md](nanvix-arxiv-2604.11669.md) | Segarra et al., 2026: per-invocation micro-VMs plus a shared per-tenant system VM, 20–100× fewer servers |
| [arca-osdi26.md](arca-osdi26.md) | Srivatsan et al., OSDI '26: continuation capture as an OS service (pause, migrate, fork) |

## Synthesis

Per-instance memory floors, as reported by the sources above (the VM and microVM
rows are filled in from `../virtualization/`):

| Isolation unit | Approx. memory per idle instance | Source |
|---|---|---|
| Minimal Linux process (kernel bookkeeping) | ~70 KB (~45 KB tuned) | kapteko 10M Codex |
| Minimal C web server process | ~1.5 MB | kapteko 15M |
| Kernel TCP socket | ~3.3 KB | kapteko 15M |
| LFI guest in a shared runtime (realistic runtime, 100 guests) | ~150 KB each | kapteko 10M Codex |
| LFI guest in a toy 3-syscall runtime | 8 B | kapteko 10M Codex |
| smoltcp web server guest | ~620 B idle / ~1 KB active | kapteko 15M |

Switch and syscall costs (LFI paper, Apple M1): an LFI runtime call takes 22 ns,
against 129 ns for a Linux syscall and ~12 µs for a gVisor syscall. Cross-sandbox
yield takes ~17 ns (~50 cycles), against thousands of cycles for a Linux process
context switch.

Pattern: density comes from taking the kernel out of the per-instance path. The
designs differ in what they keep. LFI keeps one address space and has the runtime
act as the OS, with security resting on a ~300-line verifier. Nanvix keeps
hardware VMs between tenants and shares the OS within a tenant. Arca makes idle
instances cheap by capturing them as continuations. For coding agents, the open
question is that a real agent needs a POSIX-ish filesystem, network egress, process
spawning (git, compilers, test runners) and hundreds of syscalls. Every toy number
above grows as that surface is added, and the sandbox runtime becomes a small OS
whose bugs are the escape path (the same trade-off gVisor makes).
