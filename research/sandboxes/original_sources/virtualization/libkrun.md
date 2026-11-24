---
title: libkrun (README and Security Model) / krunvm
url: https://github.com/libkrun/libkrun
authors: libkrun project (Sergio Lopez et al.; formerly github.com/containers/libkrun)
date: repo created 2020-08-13; README and docs/security-model.md read at main on 2026-11-22. krunvm repo created 2021-01-26.
accessed: 2026-11-22
kind: repo
---

## Summary
libkrun is a dynamic library that gives a program "Virtualization-based process isolation": it embeds a minimal VMM (KVM on Linux, Hypervisor.framework on macOS/ARM64, WHP on Windows upcoming) behind a C/Rust API, so a process can run its workload inside a microVM without managing VM images. krunvm (https://github.com/libkrun/krunvm) is a CLI that creates microVMs from OCI images using libkrun and buildah; crun uses libkrun for `podman --runtime=krun`. Its security model doc is unusually candid that the VM boundary does not restrict what the VMM exposes through devices.

## Key points
- Variants: libkrun (generic), libkrun-sev (AMD SEV/SEV-ES/SEV-SNP with attestation), libkrun-tdx (Intel TDX).
- Devices: virtio-console, -block, -fs, -gpu (venus / native context), -net, -vsock (for TSI), -balloon (free-page reporting only), -rng.
- Networking option "Transparent Socket Impersonation (TSI)": guest socket syscalls hooked over virtio-vsock and proxied by the VMM using the host's network — no virtual NIC.
- Users: crun/Podman (`--runtime=krun`), krunkit (GPU VMs on macOS), muvm (Asahi Linux, games needing 4k pages).
- Security model: "The VM boundary alone does not restrict the host resources exposed through those devices"; recommends running the VMM in namespaces with unprivileged UID/GID and resource limits; virtio-fs export path is not a sandbox; TSI uses the VMM's network context; AF_UNIX hijacking can reach host sockets.
- krunvm features: minimal footprint, fast boot, zero disk image maintenance, zero network configuration; runs on Linux/KVM x86_64 and AArch64 and macOS/Hypervisor.framework ARM64.

## Excerpts
> "The VM boundary does not restrict host resources exposed through devices. Limit the VMM's host permissions and exposed paths." (README caution)

> "For many operations, the VMM acts as a proxy for the guest within the host." (docs/security-model.md)

## Relevance to the talk
The closest thing to "VM as a library call" and one of the few microVM stacks that runs on macOS — relevant to local coding-agent sandboxes. Its security-model caveat is a good general lesson: a VM is only as isolated as the devices/shares you hand it.
