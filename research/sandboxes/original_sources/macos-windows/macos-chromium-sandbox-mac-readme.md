---
title: "Mac Sandbox (sandbox/mac/README.md)"
url: https://chromium.googlesource.com/chromium/src/+/HEAD/sandbox/mac/README.md
authors: The Chromium Authors
date: living document in chromium/src (HEAD as of access)
accessed: 2026-11-22
kind: docs
---

## Summary
The current in-tree description of Chromium's macOS sandbox. Policies are default-deny SBPL files, one
per process type, built on a shared `common.sb`. The browser compiles each policy to Seatbelt's binary
form with `Seatbelt::Compile` and sends it over Mojo to the new child. The child applies it in
`SeatbeltExecServer::ApplySandboxProfile`.

## Key points
- It explicitly uses the `sandbox(7)` "Seatbelt" facility and says this differs from the App Sandbox
  used by App Store apps.
- Policies start with `(deny default)`. The `--process-type` argument selects which profile applies.
- Processes keep file descriptors they opened before sandboxing. The pattern is to open what you need
  first and broker everything else through the browser process.
- Policy changes need review by `//sandbox/policy/mac/OWNERS`.

## Excerpts
> "(deny default)" — policy convention described in the README

## Relevance to the talk
Shows the modern "compile in a trusted parent, apply in the child" pattern. It is how an agent
supervisor could stamp a per-agent Seatbelt profile onto each worker process, and it suggests Seatbelt
stays in production use at Google despite its "deprecated" label.
