# virtualization/ — index

Hypervisors, microVMs, Kata, gVisor, unikernels, WebAssembly and V8 isolates, and the Spectre-era rethink of in-process isolation. All sources accessed 2026-11-22.

## Index

Hypervisors and hardware support
- [vmware-binary-translation-asplos2006.md](vmware-binary-translation-asplos2006.md): Adams & Agesen (VMware), ASPLOS 2006. x86 was not trap-and-emulate virtualizable; binary translation often beat first-generation VT-x/SVM.
- [xen-sosp2003.md](xen-sosp2003.md): Barham et al., SOSP 2003. Paravirtualization (guest kernel in ring 1), up to 100 VMs per host, a few percent overhead.
- [intel-vt-x-computer2005.md](intel-vt-x-computer2005.md): Uhlig et al., IEEE Computer, May 2005. VT-x: VMX root/non-root, VM entry/exit, VMCS.
- [kvm-ols2007.md](kvm-ols2007.md): Kivity et al., OLS 2007. `/dev/kvm`, "guest mode", VMs as Linux processes; merged in Linux 2.6.20 (Feb 2007).
- [github-hosted-runners-kvm.md](github-hosted-runners-kvm.md): GitHub docs and changelog (2024-04-02). Hosted Linux runners expose KVM ("hardware acceleration for Android SDK tools"); arm64 macOS runners cannot nest.

MicroVMs
- [firecracker-nsdi2020.md](firecracker-nsdi2020.md): Agache et al., NSDI 2020. Covers Lambda's move to microVMs, the 125 ms / <5 MB / 150 per second figures, measured overhead of ~3 MB (Firecracker) vs ~13 MB (Cloud Hypervisor) vs ~131 MB (QEMU), and the jailer.
- [firecracker-aws-launch-2018.md](firecracker-aws-launch-2018.md): Jeff Barr, 2018-11-26. Open-source launch; Lambda and Fargate in production; "We started with crosvm".
- [firecracker-specification.md](firecracker-specification.md): Firecracker SPECIFICATION.md. Numbers enforced in CI: VMM start in 8 CPU ms, ≤5 MiB overhead, ≤125 ms from API call to `/sbin/init`.
- [cloud-hypervisor.md](cloud-hypervisor.md): Rust VMM on KVM/MSHV for general cloud workloads; shares code with Firecracker and crosvm.
- [crosvm.md](crosvm.md): ChromeOS VMM; each device runs in its own Minijail-sandboxed process.
- [qemu-microvm.md](qemu-microvm.md): QEMU's Firecracker-inspired machine type, with no PCI and no ACPI (QEMU 4.2, Dec 2019).
- [libkrun.md](libkrun.md): libkrun/krunvm, a VM as a library (KVM/HVF), with TSI networking. Its docs warn that "the VM boundary does not restrict host resources exposed through devices".

VM-isolated containers and application kernels
- [kata-containers-launch-2017.md](kata-containers-launch-2017.md): Kata launched in Dec 2017 by merging Intel Clear Containers and Hyper runV.
- [kata-containers-architecture.md](kata-containers-architecture.md): Kata's shimv2 runtime, a VM per pod and an agent in the guest. It can use QEMU, Cloud Hypervisor, Firecracker or Dragonball.
- [gvisor-announcement-2018.md](gvisor-announcement-2018.md): Google, 2018-05-02. gVisor is a user-space kernel written in Go and runs as `runsc`; it supported about 200 syscalls at launch.
- [gvisor-security-introduction-docs.md](gvisor-security-introduction-docs.md): gVisor docs. Covers the Sentry and Gofer, and the argument that a container is "one system call away from host compromise".
- [gvisor-platforms-docs.md](gvisor-platforms-docs.md): gVisor's three platforms (KVM, systrap, ptrace). Systrap became the default in mid-2023.
- [gvisor-systrap-2023.md](gvisor-systrap-2023.md): Systrap release (2023-04-28). It intercepts syscalls with seccomp `SECCOMP_RET_TRAP` and patches syscall instructions into jumps.
- [gvisor-true-cost-hotcloud2019.md](gvisor-true-cost-hotcloud2019.md): Young et al., HotCloud 2019. Under gVisor, syscalls were 2.2× slower and file opens 216× slower.

Unikernels
- [mirageos-unikernels-asplos2013.md](mirageos-unikernels-asplos2013.md): Madhavapeddy et al., ASPLOS 2013. OCaml unikernels; a 200 kB DNS appliance; boots in under 50 ms.
- [lightvm-sosp2017.md](lightvm-sosp2017.md): Manco et al., SOSP 2017. VM boot in 2.3 ms and 8000 VMs per host on a redesigned Xen toolstack.

Language and runtime sandboxes
- [webassembly-pldi2017.md](webassembly-pldi2017.md): Haas et al., PLDI 2017. Wasm design and safety model; benchmarks run within 10% to 2× of native speed.
- [wasi-standardizing-2019.md](wasi-standardizing-2019.md): Lin Clark, 2019-03-27. WASI gives Wasm a capability-based system interface.
- [wasmtime-security-docs.md](wasmtime-security-docs.md): Wasmtime's sandbox guarantees, defence in depth and partial Spectre mitigations.
- [rlbox-usenix-security2020.md](rlbox-usenix-security2020.md): Narayan et al., USENIX Security 2020. RLBox sandboxes libraries with Wasm and tainted types; it shipped in Firefox 74/75.
- [cloudflare-workers-security-model-2020.md](cloudflare-workers-security-model-2020.md): Kenton Varda, 2020-07-29. Multi-tenant V8 isolates; per-tenant process isolation would cost 10× the CPU; Spectre mitigations.
- [v8-sandbox-2024.md](v8-sandbox-2024.md): Samuel Groß, 2024-04-04. An in-process sandbox for the V8 heap, with about 1% overhead.

Spectre era
- [spectre-attacks.md](spectre-attacks.md): Kocher et al. Disclosed 2018-01-03, published at IEEE S&P 2019. Shows speculative execution breaks process, container, JIT and JavaScript sandboxes.
- [meltdown-usenix2018.md](meltdown-usenix2018.md): Lipp et al., USENIX Security 2018. Kernel memory readable from user space; Docker, LXC and Xen PV affected.
- [spectre-is-here-to-stay-2019.md](spectre-is-here-to-stay-2019.md): McIlroy et al. (V8), Feb 2019. Language-enforced confidentiality is defeated, so Chrome moved to process isolation.
- [site-isolation-usenix2019.md](site-isolation-usenix2019.md): Reis et al., USENIX Security 2019. One site per renderer process at 9–13% memory overhead; enabled for 99% of desktop users in Chrome 67.

Comparisons and benchmarks
- [blending-firecracker-gvisor-vee2020.md](blending-firecracker-gvisor-vee2020.md): Anjali et al., VEE 2020. Both gVisor and Firecracker exercise more host kernel code than native Linux.
- [closer2021-lightweight-hypervisors-comparison.md](closer2021-lightweight-hypervisors-comparison.md): Li et al., CLOSER 2021. Startup and per-container memory compared across Docker, gVisor, Kata and QEMU.
- [edera-goldilocks-isolation-2025.md](edera-goldilocks-isolation-2025.md): Moore & Zenla (Edera, vendor), arXiv 2025/2026. Startup table covering Docker, gVisor, Kata, Firecracker and Edera.

## Synthesis

Hardware-enforced isolation on x86 began as software. VMware's binary translation (1999–2006) and Xen's paravirtualization (SOSP 2003) worked around an ISA that Popek–Goldberg trap-and-emulate could not virtualize. Intel VT-x (described May 2005) and AMD's SVM moved the boundary into silicon, but the first generation was often *slower* than binary translation (Adams & Agesen 2006). KVM (Linux 2.6.20, Feb 2007) turned that silicon into a Linux process abstraction, and every later VMM builds on it.

Linux containers were cheap but share one kernel. Two answers emerged. Intel Clear Containers and Hyper runV gave each container a small VM, and the two merged into Kata (Dec 2017). gVisor (May 2018) re-implemented the kernel in Go as a sandboxed process instead. Research showed VMs could be tiny (MirageOS 2013; LightVM 2017, 2.3 ms boot). AWS made that production-grade with Firecracker (Nov 2018; NSDI 2020): ≤125 ms boot, <5 MB overhead and up to 150 microVMs/s, serving trillions of Lambda requests a month.

In January 2018, Spectre and Meltdown undercut the cheapest boundaries. Meltdown read kernel memory from Docker/LXC containers and Xen PV guests. Spectre read process memory from JavaScript. By 2019 the V8 team concluded that language-enforced confidentiality is defeated. Chrome moved to one site per process (9–13% memory overhead), and Cloudflare kept isolates but added process isolation for suspicious Workers. Wasm (2017) and the V8 sandbox (2024) remain valuable *integrity* layers inside an outer process or VM.

For coding agents the trade-off is still the one in the table. Process sandboxes are cheapest but share the kernel. gVisor costs little memory, but syscall- and file-heavy work runs much slower under it. MicroVMs give the strongest boundary, at about 125 ms raw boot (about 1–2.5 s end-to-end through containerd) and roughly 3–130 MB per instance.

### Timeline
- 1974: Popek & Goldberg define the requirements for a VMM (cited by Adams & Agesen).
- 2003-10: Xen (SOSP).
- 2005-05: Intel VT-x described in IEEE Computer. AMD's SVM follows (both are used by KVM 2007).
- 2006-10: Adams & Agesen find that software BT often beats first-generation hardware assist.
- 2007-02-05: KVM ships in Linux 2.6.20.
- 2013-03: MirageOS unikernels (ASPLOS).
- 2017-06: WebAssembly paper (PLDI).
- 2017-10: LightVM (SOSP).
- 2017-12-05: Kata Containers announced.
- 2018-01-03: Spectre and Meltdown disclosed (reported to vendors 2017-06-01).
- 2018-05-02: gVisor open-sourced.
- 2018-07-11: Chrome 67 enables Site Isolation for 99% of desktop users.
- 2018-11-26: Firecracker open-sourced.
- 2019-02: "Spectre is here to stay".
- 2019-03-27: WASI announced.
- 2019-04: Cloud Hypervisor repo created.
- 2019-12-12: QEMU 4.2 adds the `microvm` machine type.
- 2020-02: Firecracker paper (NSDI) and RLBox in Firefox 74.
- 2020-07-29: Cloudflare Workers security model post.
- 2023-04-28: gVisor Systrap released; it becomes the default in mid-2023.
- 2024-04-04: V8 Sandbox enters Chrome's VRP.

### Isolation vs startup vs per-instance overhead

| Mechanism | Isolation boundary (strength) | Startup | Per-instance memory overhead | Sources |
|---|---|---|---|---|
| V8 isolate (Workers) | Same process; language VM plus V8 sandbox. Weak against Spectre on its own. | Sub-ms context switches; "thousands of tenants" per machine | "a couple megabytes" per guest | Cloudflare 2020; V8 2024; McIlroy 2019 |
| Wasm instance | Same process; SFI and linear memory. Integrity yes, confidentiality vs Spectre no. | Engine startup 18–30 ms (V8/SpiderMonkey, 2017) | Linear memory plus guards (no fixed figure in sources) | Haas 2017; Wasmtime docs |
| Container (runc/Docker) | Shared host kernel; namespaces, cgroups and seccomp. "One syscall away". | ~0.38 s (Edera 2025, Docker) | ~1.4 MB (CLOSER 2021) | CLOSER 2021; Edera 2025; gVisor docs |
| gVisor (runsc) | User-space Go kernel (Sentry) under seccomp; 53–68 host syscalls | ~0.44–0.68 s; about the same as or slightly faster than Docker (CLOSER) | ~10–11 MB (CLOSER); "designed for 15 MB" | CLOSER 2021; Edera 2025; Young 2019; Anjali 2020 |
| Firecracker microVM | Hardware VM (KVM) plus jailer; 36 host syscalls (VEE 2020) or 24 (NSDI) | ≤125 ms VMM API to init; ~2.4 s via firecracker-containerd (Edera) | ~3 MB VMM (NSDI), ≤5 MiB spec | NSDI 2020; spec; Edera 2025 |
| Kata Containers | Hardware VM per pod with a guest kernel and agent | ~0.6 s over gVisor (CLOSER); ~1.9 s (Edera, Dragonball) | ~125–138 MB (CLOSER, default 2 GB VM) | CLOSER 2021; Edera 2025 |
| Full QEMU/KVM VM | Hardware VM with full device model | ~8.8 s (Ubuntu boot, CLOSER) | ~131 MB VMM (NSDI); ~456 MB total (CLOSER) | NSDI 2020; CLOSER 2021 |
| Unikernel on tuned Xen (LightVM) | Hardware VM with a minimal guest | 2.3 ms | 3.6 MB running | Manco 2017 |

Caveats: the numbers come from different machines, versions and definitions of "startup" (VMM-to-init vs. container-ready), and Edera is a vendor source. Compare rows as orders of magnitude, not as exact figures.
