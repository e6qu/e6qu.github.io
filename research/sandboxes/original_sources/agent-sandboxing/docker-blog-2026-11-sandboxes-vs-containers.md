---
title: "Docker Sandboxes vs. Containers: Choosing the Right Isolation for AI Agents"
url: https://www.docker.com/blog/docker-sandboxes-vs-containers/
authors: Srini Sekaran, Oleg Selajev (Docker Inc.)
date: 2026-11-05
accessed: 2026-11-22
kind: blog
---
Related: Docker's WeAreDevelopers North America keynote recap, "Manufacturing Trust for AI Agents"
(Deanna Sparks, 2026-09-24, https://www.docker.com/blog/manufacturing-trust-for-ai-agents/).
The keynote demo video the post links is https://www.youtube.com/live/G1tT3pwbsMM (from about 0:55).
Its captions could not be read (HTTP 429), so the demo is known only through this post.
The YouTube explainer [a1crew-2026-containers-vs-sandboxes-video.md](a1crew-2026-containers-vs-sandboxes-video.md)
retells this post.

## Summary
Docker's own explanation of why a container is the wrong boundary for a coding agent, and
where containers still fit. A container is "a process, or a group of processes, running on
the host" that "shares the host kernel". A coding agent is "an actor: it makes decisions and
operates on your systems the way a developer uses a laptop". Docker Sandboxes give each agent
a microVM "with their own Linux kernel, filesystem, network, and Docker Engine". The post's
rule of thumb: containers when you control the code and its dependencies; sandboxes when the
workload "generates or fetches code at runtime and needs its own boundary".

## Key points
- **Cavage, paraphrased (not a direct quote):** "In his WeAreDevelopers keynote, Docker President
  Mark Cavage said containers are doing exactly the job they were designed to do, but we're asking
  them to do a different job." The keynote recap paraphrases him the same way and has no
  "containers are dead" claim.
- **Docker socket:** mounting `/var/run/docker.sock` "hands the container control of the host
  Docker daemon, which Docker limits to trusted users because it can mount host paths and start
  privileged containers". "An agent doesn't need an exploit to use that." The keynote demo is
  summed up as an agent reaching "a secrets file on the host with no zero-day involved".
- **Isolation boundary:** "If an agent escapes its container, it lands in a disposable microVM,
  and the host stays out of reach." Two agents "can't reach each other's sandboxes either". The
  private Docker Engine means the host daemon and its socket "stay outside the microVM the entire time".
- **Egress proxy and credential broker:** "Outbound traffic goes through a host-side proxy with a
  deny-by-default policy". For supported HTTP services the proxy injects credentials, "without the
  raw value ever entering the VM".
- **Costs stated:** it needs a supported hypervisor ("Apple silicon on macOS 14 or later, Windows
  Hypervisor Platform, or KVM on supported Ubuntu systems"), and "running inside another VM
  requires nested virtualization". The separate kernel and Docker Engine "consume more memory and
  disk than one additional container would". No boot time is given.
- **Setup:** `sbx run claude`; Kits package "tools, files, commands, network rules, credentials,
  and agent instructions"; an `sbxenv.yaml` committed to the repo recreates the sandbox for a
  teammate. "Kits are in early access and environment files are experimental".
- **Key takeaways (verbatim):** containers "stay the right choice for packaged applications, CI jobs,
  and short-lived execution"; "Sandbox the agent, containerize the application it works on."
- Not in the post: Wasm, Claude Code's sandbox, package hallucination, Trivy or Clair, named CI vendors.
- **Fine print from Docker's own docs (read the same day).** The defaults "include broad wildcards"
  such as `*.googleapis.com` (https://docs.docker.com/ai/sandboxes/security/). In direct mode,
  "There is no boundary between the agent's edits and your host filesystem". Git hooks, CI configs
  and `Makefile` or `package.json` scripts run later on the host
  (https://docs.docker.com/ai/sandboxes/security/isolation/). Clone mode "protects your host
  repository from modification, not from inspection".

## Excerpts
> "But a coding agent is an actor: it makes decisions and operates on your systems the way a developer uses a laptop."

> "Containers share one kernel, even inside a VM."

> "An agent doesn't need an exploit to use that."

> "If an agent escapes its container, it lands in a disposable microVM, and the host stays out of reach."

> "Choose a container when you control the code and its dependencies, and choose Docker Sandboxes when the workload generates or fetches code at runtime and needs its own boundary."

> "Sandbox the agent, containerize the application it works on."

## Relevance to the talk
This is the primary source for Docker's position. Thirteen years after its founder warned on HN
against running untrusted code as root in a container
(`../hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md`), Docker tells developers
to put the agent in a microVM, behind an egress proxy that injects credentials. That is "borrow the
boundary" plus switches 2 and 3. Docker's own docs supply the caveat for the escapes slide: the
workspace is still a door back to the host, through files the host runs later.
