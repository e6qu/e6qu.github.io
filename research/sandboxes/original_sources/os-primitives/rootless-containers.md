---
title: Rootless Containers
url: https://rootlesscontaine.rs/
authors: Rootless Containers community (Akihiro Suda, Aleksa Sarai et al.)
date: living site
accessed: 2026-11-22
kind: docs
---

## Summary
Defines rootless containers — created and run by an unprivileged user — and explains the mechanics: user
namespaces for UID mapping (with setuid `newuidmap`/`newgidmap` as the only privileged helpers), user-mode
networking (slirp4netns/pasta) instead of host veth, overlayfs in user namespaces, and cgroup v2 delegation.

## Key points
- Mitigates container-breakout impact (escapee is an ordinary user on the host), but explicitly not a complete solution.
- Main drawback: complexity. If more of the runtime runs setuid, it's no longer rootless.
- Useful for shared machines (HPC).
- How-it-works pages: /how-it-works/userns/, /netns/, /overlayfs/, /cgroups/; /caveats/.
- (Maintainer names in frontmatter from general knowledge; not stated on the page we read.)

## Excerpts
> "Rootless containers refers to the ability for an unprivileged user to create, run and otherwise manage containers."

## Relevance to the talk
The direct answer to CVE-2019-5736-style escapes — and the reason user namespaces had to be unprivileged.
Also the model that local agent sandboxes inherit (no root daemon on the developer's laptop).
