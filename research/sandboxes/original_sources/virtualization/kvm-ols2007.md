---
title: "kvm: the Linux Virtual Machine Monitor"
url: https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf
authors: Avi Kivity, Yaniv Kamay, Dor Laor, Uri Lublin (Qumranet), Anthony Liguori (IBM)
date: 2007 (Proceedings of the 2007 Linux Symposium, Ottawa, Volume One, pp. 225–230; held June 2007)
accessed: 2026-11-22
kind: paper
---

## Summary
KVM turns Linux itself into a hypervisor by exposing the new Intel/AMD hardware virtualization extensions through a character device, `/dev/kvm`. A VM is just a Linux process; each vCPU is a thread that issues an ioctl to enter "guest mode", a third execution mode alongside user and kernel mode. Device emulation stays in userspace (QEMU). This "VM = process" model is why later VMMs (Firecracker, Cloud Hypervisor, crosvm, libkrun) can be small userspace programs that rely on Linux for scheduling and memory management.

## Key points
- Hardware extensions summarised as: a guest mode with selectable trapping, a hardware state switch, and exit-reason reporting; Intel's and AMD's are "incompatible with each other" but "essentially similar". (§2)
- VMs created by opening `/dev/kvm`; ioctls create VMs, allocate memory, read/write vCPU registers, inject interrupts, run a vCPU. (§3.1)
- "Guest execution is performed in a triply-nested loop": userspace issues run ioctl → kernel enters guest mode → hardware runs guest until an exit; I/O exits go back to userspace. (§3)
- Arch-specific code split into `kvm-intel.ko` and `kvm-amd.ko` behind a `kvm_arch_ops` vector. (§3.2)
- Shadow page tables are the hard part (pre-EPT/NPT). (§4)
- Merge date (not in the paper): KVM was merged in Linux 2.6.20, released 5 February 2007 (https://kernelnewbies.org/Linux_2_6_20: "adds a driver for Intel's and AMD's hardware virtualization extensions to the x86 architecture").

## Excerpts
> "These virtual machines appear as normal Linux processes and integrate seamlessly with the rest of the system." (Abstract)

> "In effect, a new execution mode, guest mode is added to Linux, joining the existing kernel mode and user mode." (§3.1)

## Relevance to the talk
KVM is the substrate of the whole microVM wave. Firecracker's NSDI paper explicitly chooses "keep KVM, replace QEMU". The process-shaped VM is also what lets VMMs be wrapped in seccomp/namespaces (Firecracker jailer, crosvm minijail).
