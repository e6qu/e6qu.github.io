---
title: "Protecting user data with App Sandbox"
url: https://developer.apple.com/documentation/security/protecting-user-data-with-app-sandbox
authors: Apple Inc.
date: living documentation
accessed: 2026-11-22
kind: docs
---

## Summary
Apple's guide to adopting App Sandbox. It lists the activities the OS forbids inside the sandbox and
describes the per-app container directory. Embedded command-line tools must inherit the parent's
sandbox.

## Key points
- Forbidden in the sandbox:
  - Authorization Services, accessibility APIs, and Apple Events to arbitrary apps.
  - Loading kernel extensions.
  - Reading or changing other apps' preferences.
  - Configuring network settings.
  - Terminating other apps.
- The OS creates a container directory with unrestricted read/write. The home folder is not freely
  accessible.
- Embedded helper tools must inherit the app's sandbox (`com.apple.security.inherit`).
- Activity Monitor has a "Sandbox" column for checking whether a process is sandboxed.

## Excerpts
> "The operating system creates a container directory when launching your sandboxed app, to which the app has unrestricted read and write access." — container section

> "If your macOS app embeds a command-line tool, that tool must inherit the containing app's sandbox configuration." — helper tools

## Relevance to the talk
App Sandbox's "container" is a per-app private directory, not a container in the Linux sense: no
namespaces and no resource limits. It is a filesystem and IPC confinement model. Useful to contrast
with Apple's 2025 `container` tool, which reuses the word to mean a per-container VM.
