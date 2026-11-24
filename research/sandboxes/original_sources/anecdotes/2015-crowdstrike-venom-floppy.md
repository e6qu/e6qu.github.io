---
title: "VENOM: Virtualized Environment Neglected Operations Manipulation (CVE-2015-3456)"
url: https://www.crowdstrike.com/en-us/blog/venom-vulnerability-details/
authors: Jason Geffner (CrowdStrike)
date: 2015-05-13 (disclosure); technical details post 2015-05-15
accessed: 2026-11-22
kind: advisory
---

Also read: the original disclosure site venom.crowdstrike.com, via the Wayback Machine (snapshot 2015-12-20, https://web.archive.org/web/20151220124414/http://venom.crowdstrike.com/).

## Summary
VENOM is a buffer overflow in **QEMU's virtual floppy disk controller (FDC)**. The FDC keeps commands and their parameters in a 512-byte FIFO and resets it after each command, except for two commands. A guest with root could keep writing past the end and run code in the host's hypervisor process. Xen, KVM, VirtualBox and plain QEMU were affected; VMware, Hyper-V and Bochs were not. The bug had **existed since 2004**, when the FDC was added to QEMU. Two things make it memorable. Hardly anyone in 2015 had a floppy drive, yet **a virtual floppy was added to new VMs by default** on many platforms. And on Xen and QEMU, **even if the admin explicitly disabled the floppy drive, an unrelated bug left the vulnerable FDC code active**. Cloud providers (AWS, Linode, DigitalOcean, Rackspace and others) published advisories or patches.

## Key points
- CrowdStrike's claim to uniqueness: unlike earlier VM escapes (it lists Cloudburst, CVE-2009-1244, among them), VENOM affected many platforms, worked in default configurations and allowed direct code execution.
- It was not exploited in the wild before disclosure, according to CrowdStrike.
- It is the strongest argument for minimal device models: Firecracker deliberately emulates only a handful of devices, and certainly no floppy.

## Excerpts
> "VENOM, CVE-2015-3456, is a security vulnerability in the virtual floppy drive code used by many computer virtualization platforms." (disclosure site)

> "The VENOM vulnerability has existed since 2004, when the virtual Floppy Disk Controller was first added to the QEMU codebase." (disclosure site, Q&A)

> "on Xen and QEMU, even if the administrator explicitly disables the virtual floppy drive, an unrelated bug causes the vulnerable FDC code to remain active and exploitable by attackers" (disclosure site, Q&A)

> "QEMU's FDC uses a 512-byte first-in first-out (FIFO) buffer for data storage" (technical details post)

## Relevance to the talk
This is the best laugh line in the VMs and microVMs section. Hook: *"In 2015 you could escape the cloud through a floppy drive nobody had — and that you couldn't turn off."* It motivates "less device code = less attack surface" (Firecracker, Cloud Hypervisor, gVisor's own netstack) and pairs with Cloudburst (the graphics card).
