---
title: "Hardened Runtime"
url: https://developer.apple.com/documentation/security/hardened-runtime
authors: Apple Inc.
date: living documentation (introduced with macOS 10.14 Mojave, 2018, per general knowledge; the page itself gives no date)
accessed: 2026-11-22
kind: docs
---

## Summary
The Hardened Runtime is a code-signing option. Together with System Integrity Protection (SIP), it
protects a process's runtime integrity against code injection, dylib hijacking and memory tampering.
Exceptions such as JIT are opted into by entitlement. It is required for notarization. It is an
integrity feature, not a confinement sandbox.

## Key points
- Blocks code injection, DLL (dylib) hijacking and process-memory tampering by default.
- Runtime exceptions (for example `com.apple.security.cs.allow-jit`) and resource-access entitlements
  loosen it.
- Libraries and plug-ins inherit the host executable's entitlements.
- Required for notarized distribution outside the App Store.

## Excerpts
> "The Hardened Runtime, along with System Integrity Protection (SIP), protects the runtime integrity of your software by preventing certain classes of exploits, like code injection, dynamically linked library (DLL) hijacking, and process memory space tampering." — overview

> "To upload a macOS app to be notarized, you must enable the Hardened Runtime capability." — note

## Relevance to the talk
Belongs in the "what macOS gives you" inventory as integrity protection, not isolation. A hardened
agent host process is harder to inject into, but it can still read your home directory unless Seatbelt
or TCC stops it.
