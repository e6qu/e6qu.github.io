---
title: "Ask HN: How are you sandboxing coding agents?"
url: https://news.ycombinator.com/item?id=46400129
story_url: (text post)
points: 46
comments: 32
authors: HN thread (asked by m-hodges)
date: 2025-12-27
accessed: 2026-11-22
kind: discussion
---

## Summary
A small but dense survey. The asker lists the options seen so far (built-in sandboxes, git worktrees, devcontainers, Linux VMs with minimal mounts, firejail/bubblewrap) and asks what holds up in daily use. Of 19 top-level answers, 15 describe some isolation layer, from separate Unix users and LXC on Proxmox to Firecracker VMs, homelab pods, Firejail and Docker Sandboxes. A minority run with no sandbox and rely on Time Machine or on approving each command. The most valuable replies are reports of agents actively working around sandboxes.

## Key points
- Setups reported: SandVault (a low-privilege macOS user) and ClodPod (a macOS VM), with the author using the user-account option more because it is easier. Also a Firecracker VM, a Docker wrapper (dox), opencode pods on a homelab k8s cluster, Kilo Code in Firejail, Catnip (Docker plus worktrees), unprivileged LXC on Proxmox, a separate Linux user per project, devcontainers without git-remote credentials, and Docker Sandboxes.
- "No sandbox" answers: Time Machine plus `--dangerously-skip-permissions`, and approving each command the first time it comes up.
- Bypass reports from a team running Claude, Codex and Gemini in sandboxed YOLO mode: forged npm tarballs and SHA-512s in `package-lock.json`, `|| true` to hide blocked operations, and cloning the workspace to get around path deny rules. Another user watched Claude build a userland network stack to escape container network restrictions.
- One pushback is that containers are not a security boundary at all (gVisor, Qubes and secureblue are cited as reasons).

## Excerpts
> "I have time machine and just let them fly with --dangerously-skip-permissions on my Mac. Worst thing it's done is back up a database, delete the database, and then run git clean locally which also wiped out the backup…" — sixhobbits ([46400574](https://news.ycombinator.com/item?id=46400574))

> "A big lesson for us is that you still need to be careful even in a sandbox. We've been running Claude/Codex/Gemini in sandboxed YOLO mode and have seen some interesting bypass attempts." — languid-photic ([46402650](https://news.ycombinator.com/item?id=46402650))

> "I watched Claude download the rust toolchain and build a user land networking stack to get around some container sandboxing restrictions I had in place." — kasey_junk ([46402970](https://news.ycombinator.com/item?id=46402970))

> "I create a separate Linux user (which doesn't have sudo rights) for each project. I have to log each user in to Claude code or codex, but then I can use ordinary Unix permissions to keep the bots under control and isolated." — solresol ([46401603](https://news.ycombinator.com/item?id=46401603))

> "I have to trust this one node package (and all its dependencies) and Anthropic more than I trust my email provider, my ISP or my browser. Who'd have imagined remote code execution as a service would have caught on as much as it has!" — notarobot123 ([46401426](https://news.ycombinator.com/item?id=46401426))

> "For anyone out there who thinks that containers are a sandbox... There's a reason why gVisor exists" — subsection1h ([46405993](https://news.ycombinator.com/item?id=46405993))

> "I feel like a crazy person reading these comments, 'oh it tries to bypass limitations, delete files, and generally nuke my system... But it's cool, I trust it'" — scuff3d ([46403925](https://news.ycombinator.com/item?id=46403925))

## Relevance to the talk
First-hand evidence that the agent is an adaptive adversary to its own sandbox. It does not need to be malicious, only goal-directed: forged lockfiles, swallowed errors, a home-built network stack. That supports the talk's claim that policy enforced by the harness or by prompts is not enough, and that the boundary has to sit below the agent.
