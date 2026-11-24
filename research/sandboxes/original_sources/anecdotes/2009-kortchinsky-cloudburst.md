---
title: "CLOUDBURST"
url: https://www.blackhat.com/presentations/bh-usa-09/KORTCHINSKY/BHUSA09-Kortchinsky-Cloudburst-PAPER.pdf
authors: Kostya Kortchinsky (Immunity, Inc.)
date: 2009-06-02 (paper "Last Updated"); presented at Black Hat USA, July 2009. CVE-2009-1244
accessed: 2026-11-22
kind: paper
---

The paper's title page reads just "CLOUDBURST" and "© Immunity, Inc., 2008-2009". The author is named by the Black Hat URL (`/KORTCHINSKY/`); the talk page itself was not read.

## Summary
This was the first widely publicised, reliable **VM escape** against VMware. Kortchinsky audited the emulated **"VMware SVGA II" virtual display adapter**, whose command FIFO lives in memory shared between guest and host. The guest writes commands there and the host parses them, and, as the paper puts it, "Parsing means potential bugs." Bugs in the 2D `RECT_COPY` handling gave both a **memory leak (read host memory)** and a **memory write**, enough to run code in the host's `vmware-vmx` process even with ASLR and non-executable pages. The paper adds a lovely detail: once it has escaped, the exploit's C2 channel (Immunity's MOSDEF) runs **over the video framebuffer**. The guest writes data into an off-screen Direct3D surface, and the host-side payload scans the framebuffer for a signature and replies through it. It worked on VMware Workstation 6.5.0/6.5.1 (Linux and Vista hosts) and ESX Server 4.0.0.

## Key points
- The attack surface is **device emulation**, not the CPU virtualisation. This is the template for VENOM (floppy), the virtio and QEMU device bugs, and why Firecracker ships only a handful of devices.
- Shared memory plus a host parser is the bug class: "Parsing means potential bugs."
- The framebuffer covert channel shows that any shared resource becomes a channel once a boundary is crossed.

## Excerpts
> "This report presents the results of an auditing work carried out against VMware virtualization products in an attempt to find a way to execute code on the host from the guest." (§1)

> "Yet the SVGA FIFO is a lot more interesting to have look at, since it can be written to by the guest and will be read from and parsed by the host. Parsing means potential bugs." (§2.2)

> "we were able to reliably execute code from the guest into the host" (§5)

## Relevance to the talk
This belongs in the VMs and microVMs section: the hypervisor is small, but the device models are big, and that is where escapes live. Hook: *"Escape VMware through the graphics card — then talk to your shell through the screen."* It sets up the minimal-device argument for Firecracker and Cloud Hypervisor, and VENOM.
