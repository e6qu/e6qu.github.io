---
title: "Software License Agreement for macOS Tahoe"
url: https://www.apple.com/legal/sla/docs/macOSTahoe.pdf
authors: Apple Inc.
date: macOS Tahoe (26) SLA; identical clause in the macOS Sequoia SLA (https://www.apple.com/legal/sla/docs/macOSSequoia.pdf)
accessed: 2026-11-22
kind: spec
---

## Summary
The macOS licence lets you run up to two additional copies of macOS in virtual machines on each Mac
you own or control, and only for listed purposes such as development, testing, macOS Server or
personal use. This is a legal, not technical, cap on macOS-in-macOS VM density.

## Key points
- Section 2B(iii) allows "up to two (2) additional copies or instances" of macOS in VMs per Apple-branded computer.
- Permitted purposes: software development, testing during development, macOS Server, and personal non-commercial use.
- The cap applies to macOS guests only. Linux guests under Virtualization.framework are not limited by
  this licence.

## Excerpts
> "to install, use and run up to two (2) additional copies or instances of the Apple Software ... within virtual operating system environments on each Apple-branded computer you own or control" — §2B(iii)

## Relevance to the talk
This is key to the density argument. If agents must run macOS-native toolchains (Xcode, Swift for
Apple platforms, codesign), a VM per agent caps out at two per Mac. Process-level sandboxing (Seatbelt)
is the only way to run many macOS-native agents on one Mac. Linux-toolchain agents can instead use
many Linux microVMs or one shared Linux VM.
