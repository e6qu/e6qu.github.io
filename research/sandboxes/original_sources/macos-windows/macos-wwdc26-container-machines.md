---
title: "Discover container machines (WWDC26 session 389)"
url: https://developer.apple.com/videos/play/wwdc2026/389/
authors: Apple Inc. (presenter introduced as "Michael")
date: 2026-06 (WWDC26, 8–12 June 2026); container 1.0.0 released 2026-06-09
accessed: 2026-11-22
kind: talk
---

## Summary
Introduces "container machines": persistent Linux environments in `container` 1.0, each in its own
lightweight VM and built from OCI images. They mirror the macOS username and working directory and share
project files automatically, aiming to feel like "an extension of macOS", much like WSL on Windows.

## Key points
- Each machine runs in its own lightweight VM with the same image format as containers.
- Sub-second start times are claimed for Containerization VMs in general.
- Automatic sharing of the user's directories. The machine has an isolated network.
- Points back to "Meet Containerization" (WWDC25) for the architecture.

## Excerpts
> "each Container machine runs inside of its own, lightweight virtual machine, and use the same image format as containers." — transcript

> "A Container machine is fast and lightweight, like a container, and persistent like a virtual machine." — transcript

## Relevance to the talk
Apple is converging on a WSL-like developer experience. Integration features such as home-directory
sharing directly erode the isolation the VM provides; see macos-apple-container-machine-doc.md for
Apple's own warning.
