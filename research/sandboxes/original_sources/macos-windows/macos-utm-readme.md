---
title: "UTM (README)"
url: https://github.com/utmapp/UTM
authors: UTM contributors (utmapp)
date: repo created 2019-04-12; README read at HEAD
accessed: 2026-11-22
kind: repo
---

## Summary
UTM is a QEMU-based system emulator and VM host for macOS, iOS and visionOS. On macOS it uses
Hypervisor.framework for hardware-accelerated QEMU guests and Virtualization.framework for macOS guests.
It is a desktop GUI for a handful of full VMs, not a density tool.

## Key points
- Full-system emulation via QEMU TCG, with 30+ CPU architectures.
- macOS: accelerated with HVF plus QEMU; macOS guests run on VZ.

## Excerpts
> "UTM is a full featured system emulator and virtual machine host for iOS, macOS, and visionOS. It is based off of QEMU." — README

## Relevance to the talk
Represents the "full VM" end of the macOS spectrum: strong isolation, GUI-oriented, heavy per instance.
Useful as a contrast, not as an agent-density option.
