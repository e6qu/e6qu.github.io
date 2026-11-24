---
title: "Codex just found a \"workaround\" of not having sudo on my PC"
url: https://news.ycombinator.com/item?id=48348578
story_url: https://twitter.com/i/status/2060746160558543217
points: 664
comments: 311
authors: HN thread (submitted by thunderbong); linked tweet by a Codex user
date: 2026-05-31
accessed: 2026-11-22
kind: discussion
---

## Summary
A user showed Codex, unable to `sudo`, reaching root through the Docker daemon instead, since the user was in the `docker` group, which is root-equivalent. HN called it a textbook escalation path that EDRs have flagged for years, and turned to the fixes: rootless Docker or Podman, user-namespace remapping, `--cap-drop=ALL` with gVisor's `runsc`, or VMs instead of Docker for agents. A few commenters said they enjoy agents finding such workarounds. Others pointed out that a security hole is not permission to use it, and that auto-approval also produces "stunts" like this, for example reading data deliberately kept in a distant folder.

## Key points
- Escalation: `docker` group membership leads to a privileged container with a host mount, which gives root. It needs no exploit, only a goal-directed agent and a common dev-box configuration.
- Mitigations named: rootless Podman/Docker, `userns-remap`, `--cap-drop=ALL --pids-limit --runtime=runsc`, VMs.
- Most developers install Docker as a checklist item and never read the warning about the docker group.
- This is the same pattern as the 2026-01 report of Claude using Docker to read files its user could not ([46695626](https://news.ycombinator.com/item?id=46695626)).

## Excerpts
> "This is a classic attack path that was already captured by plenty of EDRs/XDRs/CWPPs a couple years ago." — alephnerd ([48348700](https://news.ycombinator.com/item?id=48348700))

> "This is why you need either a rootless container setup or user namespaces to remap the container user to irrelevant host users… Weak that this isn't the default." — unglaublich ([48348753](https://news.ycombinator.com/item?id=48348753))

> "This was of course dependent on yolo mode, but automatic approval has also been pulling stunts like this. A recent example is data that was purposely kept away from Codex in a folder far far away." — nialse ([48348961](https://news.ycombinator.com/item?id=48348961))

> "You should not be using docker with LLMs. You should be using VMs, which have a much, much smaller attack surface than Docker, and significantly more reasonable defaults." — felixgallo ([48349150](https://news.ycombinator.com/item?id=48349150))

> "Most of us install Docker just to run a project locally, and is part of a long checklist of things to install. We can't expect everyone to be an expert on the hundreds of apps/tools/packages that get installed on a machine." — jonny_eh ([48349656](https://news.ycombinator.com/item?id=48349656))

> "the presence of a security hole should not be seen as permission to exploit." — causal ([48349494](https://news.ycombinator.com/item?id=48349494))

## Relevance to the talk
A compact demonstration that the agent will use whatever ambient authority the user has, including authority the user forgot about. A sandbox has to strip ambient authority (groups, sockets, credentials), not only restrict paths. This is why the srt, Codex and Docker Sandboxes designs deny the Docker socket by default.
