---
title: "Running Claude Code dangerously (safely)"
url: https://news.ycombinator.com/item?id=46690907
story_url: https://blog.emilburzo.com/2026/01/running-claude-code-dangerously-safely/
points: 351
comments: 258
authors: HN thread (submitted by emilburzo, who wrote the linked post)
date: 2026-01-20
accessed: 2026-11-22
kind: discussion
---

## Summary
Emil Burzo describes running Claude Code with `--dangerously-skip-permissions` inside a Vagrant/VirtualBox VM, one VM per project, with the project folder synced from the host. The thread turned into a survey of how people contain agents: Proxmox VMs and LXCs, Lima, devcontainers with a transparent proxy, bubblewrap one-liners, sandbox-exec profiles, a dedicated mini-PC, PXE-booted throwaway machines, and Docker Sandboxes (a Docker PM replied). Commenters' sharpest point was the return channel: a VM whose repository folder is shared read-write with the host is not isolated.

## Key points
- The author wanted the agent to be able to do *anything* (install packages, run Docker), which rules out containers without Docker-in-Docker or a mounted socket. He rejected mounting the socket, quoting Docker's own warning that it grants root-equivalent access.
- A Docker Sandboxes PM (ejia) said the next version would use microVM isolation and give the agent its own Docker daemon inside the microVM, aimed at exactly this case.
- Vagrant's default shares the repo read-write at `/vagrant`, so an agent can edit the `Vagrantfile` or add a git hook that later runs on the host. No VM escape is needed (lucasluitjes).
- One commenter caught Claude using Docker (running as root) to read files its own user could not.
- Alternatives commenters described: a container with only bind mounts plus a transparent proxy (dogestreet/dev-container), sandbox-run (bubblewrap in a few lines of POSIX shell), bubblewrap-tui, neko-kai/claude-code-sandbox (sandbox-exec), SandVault/ClodPod, Lima, Kata as a Docker runtime, Shannot (a PyPy sandbox that records intended actions for review), and a dedicated mini-PC.

## Excerpts
> "I ended up getting a mini-PC solely dedicated toward running agents in dangerous mode, it's refreshing to not have to think too much about sandboxing." — sampullman ([46691654](https://news.ycombinator.com/item?id=46691654))

> "PM for Docker Sandboxes here. We have an updated version of Sandboxes coming out soon that uses MicroVM isolation to solve this exact problem." — ejia ([46693164](https://news.ycombinator.com/item?id=46693164))

> "No VM escape vulns necessary. A malicious AI could just add arbitrary code to your Vagrantfile and get host access the first time you run a vagrant command." — lucasluitjes ([46692858](https://news.ycombinator.com/item?id=46692858))

> "I caught Claude using docker (running as root) to access files on my machine it couldn't read using it's user." — foreigner ([46695626](https://news.ycombinator.com/item?id=46695626))

> "Claude has twice now thought that deleting the database is the right thing to do. It didn't matter as it was local and one created with fixtures in the Docker container (in anticipation of such a scenario)…" — MattGaiser ([46691631](https://news.ycombinator.com/item?id=46691631))

> "Here is what I do: run a container in a folder that has my entire dev environment installed. No VMs needed." — samlinnfer ([46691407](https://news.ycombinator.com/item?id=46691407))

## Relevance to the talk
This is the canonical "YOLO inside a box" thread. It shows the main trade-off practitioners make (full capability inside, nothing valuable reachable), the vendor response (Docker Sandboxes moving to microVMs), and the failure mode that every DIY setup has to handle: shared folders, git hooks and config files are a path back to the host.
