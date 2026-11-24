---
title: "A Decade of OS Access-Control Extensibility"
url: https://doi.org/10.1145/2408776.2408792
authors: Robert N. M. Watson (University of Cambridge)
date: 2013-02 (Communications of the ACM, vol. 56, no. 2; also ACM Queue)
accessed: 2026-11-22
kind: paper
---

## Summary
A retrospective on the TrustedBSD MAC Framework by its principal author. The framework was developed
from 2000 and shipped in FreeBSD 5.0 in 2003, then was adopted by Apple for Mac OS X and iOS, by Juniper
for Junos and by others. It gives a timeline of Apple's adoption: Leopard's sandbox, then iPhone OS 2's
App Store sandboxing, then mandatory Mac App Store sandboxing in Mountain Lion. It also lists the MAC
policies Apple shipped. Read from the PDF mirrored at https://css.csail.mit.edu/6.566/2014/readings/watson-extensibility.pdf.

## Key points
- Timeline:
  - January 2003: FreeBSD 5.0 ships the MAC Framework.
  - October 2007: Apple ships OS X Leopard (10.5) with MAC Framework support and the sandboxing model.
  - July 2008: iPhone OS 2.0 ships with the App Store and sandboxed third-party apps.
  - July 2011: OS X Lion ships "preliminary" app sandboxing.
  - July 2012: OS X Mountain Lion ships "mandatory app sandboxing" for App Store apps.
- Snow Leopard shipped three MAC policies: Sandbox, Quarantine and Time Machine Safety Net.
- iOS 2.0 shipped Sandbox plus AMFI (Apple Mobile File Integrity, tied to code signing).
- Apple's use diverged from the framework's design assumptions and needed significant adaptation.
  Improvements made at Apple were merged back into FreeBSD in October 2007 and August 2008.

## Excerpts
> "October 2007: Apple ships OS X Leopard with MAC Framework support and sandboxing model" — timeline sidebar

> "Sandbox. Provides policy-driven sandboxing of risky components that process untrustworthy data such as network services and video codecs." — "Apple OS X and iOS"

> "With OS X Mountain Lion, applications distributed via Apple's App Store have mandatory sandboxing." — "Apple OS X and iOS"

## Relevance to the talk
A primary source for the origin claim: Seatbelt descends from the TrustedBSD MAC Framework and arrived
in Leopard (10.5) in 2007. It connects the BSD and research lineage (os-primitives and history topics)
to the macOS story, and dates the App Sandbox requirement.
