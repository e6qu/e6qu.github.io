---
title: "OSX Sandboxing Design"
url: https://www.chromium.org/developers/design-documents/sandbox/osx-sandboxing-design/
authors: The Chromium Projects (no individual authors listed)
date: undated design document (written for the original Mac Chrome port, c. 2009; current page undated)
accessed: 2026-11-22
kind: docs
---

## Summary
Chromium's design document for sandboxing renderer and other child processes on macOS. It uses the
OS's `sandbox_init()` (Seatbelt) with custom `.sb` profiles kept in the source tree. Access is cut off
early in the child's life, before any untrusted web content is processed. The doc is candid about what
Seatbelt does not cover.

## Key points
- The mechanism is the `sandbox_init()` API (Seatbelt), not the App Sandbox. Chromium keeps its own
  `.sb` profiles in the tree.
- Restrictions are applied before the renderer is exposed to third-party input. Anything needed later
  must be opened beforehand or brokered through the browser process.
- The renderer is allowed specific services, such as the font server.
- Limitations stated by the doc:
  - Seatbelt does not restrict memory allocation, threading, or OS facilities opened before sandboxing.
  - It does not stop heap overflows; it limits what a compromised process can do.
  - Which privileges each Apple API needs is undocumented.

## Excerpts
> "sandbox_init(), which sets the access restrictions of a process from that point on." — Overview

> "Seatbelt does not place restrictions on memory allocation, threading, or access to previously opened OS facilities." — limitations

> "There is no documentation available about which privileges each API needs." — implementation notes

## Relevance to the talk
This is the long-running, high-stakes production user of Seatbelt; billions of Chrome renderers have
run under it. It shows that per-process Seatbelt sandboxing can be the security boundary for untrusted
code at very high process counts. It also names the gap that matters for agents: there are no resource
limits (memory, threads) and no isolation of what was already open.
