---
title: bubblewrap — Low-level unprivileged sandboxing tool used by Flatpak and similar projects
url: https://github.com/containers/bubblewrap
authors: bubblewrap maintainers (originally Alexander Larsson, Colin Walters et al.; Flatpak/Project Atomic)
date: README is living (project dates from c. 2016 — not verified here)
accessed: 2026-11-22
kind: repo
---

## Summary
bubblewrap (`bwrap`) is a small tool that builds a sandbox from namespaces (user, mount, PID, net, IPC, UTS,
cgroup), bind mounts and an optional seccomp filter, entirely from command-line arguments. It is the
engine behind Flatpak, and its code descends from xdg-app's helper and linux-user-chroot. It deliberately
is *not* a policy: the protection depends wholly on the arguments.

## Key points
- Runs unprivileged via user namespaces; the older setuid mode "has been removed".
- Always sets `PR_SET_NO_NEW_PRIVS`.
- Caveats: without a seccomp filter blocking `TIOCSTI`, use `--new-session` to avoid terminal injection
  (CVE-2017-5226); anything bind-mounted in (e.g. a D-Bus socket) can be an escape path — hence xdg-dbus-proxy.
- Contrasts itself with Firejail (setuid, large, path-whitelisting) and runc (designed to be run by root).
- Also the Linux backend of several coding-agent sandboxes (not stated in this README; see agent-sandboxing/ notes).

## Excerpts
> "not suitable to give to unprivileged users" — README, on Docker-style tools

## Relevance to the talk
The workhorse of desktop and agent sandboxing on Linux: a tiny, auditable builder of namespace jails that
leaves policy to the caller.
