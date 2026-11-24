---
title: "Flatpak – a security nightmare"
url: https://news.ycombinator.com/item?id=18180017
story_url: http://flatkill.org/
authors: HN discussion of the anonymous flatkill.org post; commenters include cyphar (runc), geofft, comex, pcwalton, jbk (VLC)
date: 2018-10-09
accessed: 2026-11-22
kind: discussion
points: 377
comments: 257
---

Read via the HN Algolia items API. Follow-ups:
[Flatpak: A security nightmare – two years later](https://news.ycombinator.com/item?id=24661126) (2020-10-02, 377 points),
[Response to Flatkill.org](https://news.ycombinator.com/item?id=26521390) (2021-03-20, 65 points),
[Flatpak: Complete Sandbox Escape](https://news.ycombinator.com/item?id=47699396) (2026-04-09, 20 points).
Our note: [bubblewrap-readme](../../os-primitives/bubblewrap-readme.md).

## Summary
flatkill.org argued that Flathub labelled apps "sandboxed" while most
popular ones requested `filesystem=host` or `home`, so escaping was one
line appended to `~/.bashrc`, and that bundled runtimes lagged on
security fixes. The thread is the main HN debate on desktop app
sandboxing. Defenders say Flatpak is a packaging system whose sandbox
needs apps to adopt portals; critics say a sandbox badge on an app with
home-directory write access is misleading. Sarai uses the thread to
explain user namespaces, bubblewrap and why mounting `docker.sock` is
root.

## Key points
- The core complaint: "Almost all popular applications on flathub come with filesystem=host, filesystem=home or device=all permissions… all it takes to "escape the sandbox" is echo download_and_execute_evil >> ~/.bashrc" (quoted by zeroname).
- Why GUI apps resist sandboxing: editors, GIMP, VLC "are used to open random files anywhere on the system" (dralley); the fix is a broker file chooser (portal) running outside the sandbox — "Same way it works on the web" (pcwalton, comex).
- Sarai: Docker's user-namespace support is "off by default, and I've never actually seen someone use them"; bind-mounting `docker.sock` is equivalent to or worse than privileged containers; bubblewrap supports user namespaces; Docker and LXC block userns creation inside containers by seccomp.
- geofft: SELinux and AppArmor cannot tell an editor writing `.bashrc` because the user asked from one doing it spontaneously; "There are capability-based systems that permit distinguishing between these cases".
- 2021 response thread: "flatpak has never claimed to be a security panacea" (nickysielicki) versus "Lying about sandboxing is inexcusable" (IshKebab).

## Excerpts
> "all it takes to "escape the sandbox" is echo download_and_execute_evil >> ~/.bashrc. That's it." — zeroname quoting flatkill.org, <https://news.ycombinator.com/item?id=18180379>

> "How does SELinux or AppArmor distinguish between those cases? More interestingly, how can it tell that VSCode spontaneously editing .bashrc is bad, but doing so in response to user input is good?" — geofft, <https://news.ycombinator.com/item?id=18180447>

> "Use a broker process that grants access via a file select dialog." — pcwalton, <https://news.ycombinator.com/item?id=18181065>

> "Docker has support for user namespaces but it's off by default, and I've never actually seen someone use them" — cyphar, <https://news.ycombinator.com/item?id=18181011>

> "It should also be noted that bind-mounting docker.sock is equivalent (or much worse -- it's easier to exploit at least) to using privileged containers" — cyphar, <https://news.ycombinator.com/item?id=18181075>

> "Lying about sandboxing is inexcusable though." — IshKebab (2021), <https://news.ycombinator.com/item?id=26543154>

## Relevance to the talk
Desktop sandboxing fails at the same place agent sandboxing does: the
useful app needs the user's files. The "powerbox" (portal/file chooser)
answer is the capability idea from KeyKOS and Capsicum in GUI form, and
the "sandboxed badge with home access" complaint is a direct warning for
agent tools that ship permissive defaults.
