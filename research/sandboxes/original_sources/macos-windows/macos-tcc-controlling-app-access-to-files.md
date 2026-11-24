---
title: "Controlling app access to files in macOS (Apple Platform Security)"
url: https://support.apple.com/guide/security/controlling-app-access-to-files-secddd1d86a6/web
authors: Apple Inc.
date: living document (Apple Platform Security guide); consent model enforced from macOS 10.15
accessed: 2026-11-22
kind: docs
---

## Summary
The Apple Platform Security guide's description of the user-consent layer for files, commonly called
TCC (Transparency, Consent, and Control), although this page does not use that name. From macOS 10.15,
apps need user consent before reading Desktop, Documents, Downloads, iCloud Drive, network volumes and
removable volumes. Access to the full disk needs an explicit grant in System Settings.

## Key points
- Protected locations: Desktop, Documents, Downloads, iCloud Drive, network volumes and removable volumes.
- The consent model is system-enforced from macOS 10.15. Full-disk access requires an explicit grant in
  System Settings.
- TCC is per app (code identity) and per user. It is not a per-process policy that can be set at launch.
- Commonly known but not stated on this page: consent is attributed to the "responsible" app, so CLI
  tools launched from a terminal inherit the terminal's grants.

## Excerpts
> "In macOS 10.15 or later, this model is enforced by the system to help ensure that all apps have obtained user consent" — Files and folders

> "apps that require access to the full storage device need to be explicitly added in System Settings" — Full Disk Access

## Relevance to the talk
TCC is the "ask the human" layer, not an isolation boundary for agents. An agent run from an already
granted terminal inherits that terminal's consent. It belongs in the gaps list: consent prompts do not
scale to many unattended agents.
