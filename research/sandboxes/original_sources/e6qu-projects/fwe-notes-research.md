---
title: "fun-with-emulators — notes/research (survey notes)"
url: https://github.com/e6qu/fun-with-emulators/tree/main/notes/research
authors: e6qu (Adrian Mârza)
date: 2026-11-20 to 2026-11-21 (directory last changed in commit b0bd53d)
accessed: 2026-11-22
kind: repo
---

## Summary
(Skimmed list.) Five research notes written alongside fwe's M6/M7 work, each
with sources beside every fact and "not found" where nothing settled a
question. The most useful for the talk is `linux-on-mac.md`, a survey of every
way to run Linux programs on macOS with published start-up, syscall and fork
numbers.

## Key points
- Files:
  - [`linux-on-mac.md`](https://github.com/e6qu/fun-with-emulators/blob/main/notes/research/linux-on-mac.md)
    (2026-11-20) — "Running Linux programs on macOS and Apple Silicon: a
    survey": Apple's stack, Linux VMs on the Mac, kernel-less approaches,
    Asahi, FEX/Box64, 4 KiB on 16 KiB, cross-cutting numbers.
  - [`in-process-opportunities.md`](https://github.com/e6qu/fun-with-emulators/blob/main/notes/research/in-process-opportunities.md)
    (2026-11-20) — what fwe could answer in-process instead of asking macOS,
    from CI benchmark logs.
  - [`terminals-on-macos.md`](https://github.com/e6qu/fun-with-emulators/blob/main/notes/research/terminals-on-macos.md)
    — macOS pty behaviour and terminal-emulator read speed.
  - [`wine-on-apple-silicon.md`](https://github.com/e6qu/fun-with-emulators/blob/main/notes/research/wine-on-apple-silicon.md)
    — Wine, CrossOver, GPTK, Whisky, Proton, Hangover, FEX on ARM.
  - [`wine-on-asahi.md`](https://github.com/e6qu/fun-with-emulators/blob/main/notes/research/wine-on-asahi.md)
    (2026-11-21) — Wine's 4 KiB-page simulation on 16 KiB hosts, muvm.
- From `linux-on-mac.md` §1, a landscape table (who answers syscalls / files /
  memory returned / start-up as published): one shared Linux VM (OrbStack,
  Docker Desktop, Lima, Colima, Podman machine) — seconds; a VM per container
  (Apple `container`) — "sub-second"; library VMM (libkrun, krunkit, muvm);
  VM per process with no kernel (Noah, Carrick, elfuse, hl, alvm, fwe's VM
  backend) — Carrick ~90 ms; in-process rewriting (fwe native, Line,
  ASC-Hook) — milliseconds; emulators with own syscall layer (Blink, iSH);
  kernel personalities (WSL1, Linuxulator, NetBSD, illumos lx).
- From §8 "Cross-cutting numbers" (as published, different machines, order of
  magnitude only — secondary citations, verify before quoting):
  - one syscall: native Linux getpid 62 ns; in-process rewrite (ASC-Hook)
    +33.5 ns; gVisor KVM platform 830 ns; signal-based interception 987 ns;
    ptrace 2,060–6,249 ns; virtio-fs `unlinkat` through libkrun VM 103–161 µs.
  - fork: native Linux ~30 µs; WSL1 2–5 ms; Carrick 5.7 ms; NoahW 106 ms.
  - start-up: Carrick 90 ms; Apple `container` "a few hundred milliseconds"
    (Apple) / 0.92 s (third party); OrbStack seconds; Docker Resource Saver
    3–10 s to wake.
  - file I/O through a VM: bind mounts ~3× native for `npm install` on Lima
    and Docker Desktop (VZ), ~1.25× on OrbStack.

## Excerpts
> "Numbers are as the source states them, on its hardware, and are not
> comparable across rows unless the row says so." (linux-on-mac.md, intro)

## Relevance to the talk
A ready-made, sourced comparison of macOS Linux-execution options with
latency numbers — good for a "cost of each isolation tier" slide (VM boot in
seconds vs per-container VM sub-second vs per-process kernel-less VM ~90 ms vs
in-process ms). The underlying primary sources should be fetched into
`macos-windows/` / `virtualization/` before any number goes on a slide.
