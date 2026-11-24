---
title: "'microvm' virtual platform (microvm) — QEMU documentation"
url: https://www.qemu.org/docs/master/system/i386/microvm.html
authors: QEMU project (machine type contributed by Sergio Lopez, Red Hat)
date: introduced by commit "hw/i386: Introduce the microvm machine type" (2019-10-02); first released in QEMU v4.2.0 (tagged 2019-12-12)
accessed: 2026-11-22
kind: docs
---

## Summary
QEMU's answer to Firecracker: a minimalist x86 machine type "inspired by Firecracker and constructed after its machine model", with no PCI and no ACPI, intended for short-lived guests and as a benchmark baseline for boot time and footprint. It keeps the QEMU codebase (and its larger attack surface) but strips the virtual hardware.

## Key points
- Devices: ISA bus, optional i8259 PIC / i8254 PIT / MC146818 RTC / one ISA serial port, LAPIC, IOAPIC, kvmclock, fw_cfg, up to eight virtio-mmio devices.
- Not supported: PCI-only devices, any hotplug, live migration across QEMU versions.
- Uses qboot as BIOS by default "to obtain better boot times"; since no firmware can boot from virtio-mmio block devices, guests are started with a host-side kernel (direct kernel boot).
- History (verified via the qemu/qemu GitHub mirror): first commit 2019-10-02 by Sergio Lopez; included in v4.2.0, tagged 2019-12-12.
- Firecracker NSDI 2020 measured QEMU at ~131 MB per-VM memory overhead (not specifically microvm).

## Excerpts
> "microvm is a machine type inspired by Firecracker and constructed after its machine model."

> "It's a minimalist machine type without PCI nor ACPI support, designed for short-lived guests."

## Relevance to the talk
Evidence that Firecracker's minimal-device-model idea was adopted by the incumbent. Useful nuance: fewer devices shrinks guest-visible surface, but the VMM process is still large C code — the reason AWS chose Rust and a rewrite.
