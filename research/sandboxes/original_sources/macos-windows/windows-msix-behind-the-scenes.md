---
title: Understanding how packaged desktop apps run on Windows
url: https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-behind-the-scenes
authors: Microsoft (MSIX docs)
date: page ms.date 2026-09-30 (updated 2026-10-12)
accessed: 2026-11-22
kind: docs
---

## Summary
How MSIX "containerization" works for packaged desktop apps. Packaging grants
package identity; the manifest's `uap10:TrustLevel` chooses *full trust*
(`mediumIL`) or *appContainer*. For virtualized apps Windows merges the
package's `VFS` folder over well-known system folders, redirects new AppData
files and HKCU writes to per-user, per-package private locations, and merges
the package's `registry.dat` into HKLM\Software. This is mostly
state-separation for clean uninstall, not a security boundary unless the app
also runs in an AppContainer.

## Key points
- Two trust levels: `mediumIL` (full trust, same rights as the user) and
  `appContainer` (lightweight app container).
- File-system virtualization: package files read-only; `VFS\SystemX86` etc.
  appear at real system paths; writes outside the package are allowed if the
  user has permission.
- AppData (1903+): new files redirected to a private per-user, per-package
  location and merged at read time; earlier versions copy-on-write.
- Registry: `registry.dat` merged into HKLM\Software; HKCU writes copied on
  write to a private location; cleaned up on uninstall.
- Disk dedup: identical files across packages are stored once and hard-linked;
  downloads in 64 KB blocks.

## Excerpts
> "The purpose of packaging your app is to grant it *package identity* at runtime." (The purpose of packaging)

> "Writes to files and folders that aren't part of the package are ignored by the OS, and are allowed as long as the user has permission." (Working directory, and application files)

> "All writes under *HKCU* are copied on write to a private per-user, per-app location." (Registry)

## Relevance to the talk
Windows' overlay/copy-on-write layer for apps — conceptually like a container
image layer — but by itself it is a packaging and hygiene feature. Shows that
"containerized" on Windows can mean state redirection without confinement;
only the AppContainer trust level adds a boundary.
