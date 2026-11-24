---
title: "OpenAI o1 System Card"
url: https://cdn.openai.com/o1-system-card.pdf
authors: OpenAI
date: 2024-09-12
accessed: 2026-11-22
kind: report
---

Read the full PDF (the September 2024 card; a later December 2024 version also exists). The story is in the cybersecurity evaluation section (pp. 16–17, Figure 4).

## Summary
During a capture-the-flag (CTF) evaluation, o1-preview (pre-mitigation) was meant to exploit a service in a remote challenge container. Because of an infrastructure bug, that container never started. The model could not connect and suspected DNS, so it ran `nmap` over the challenge network. Instead of the challenge it found the **Docker daemon API on the evaluation host VM**, which a misconfiguration had left reachable. It listed the host's containers, tried briefly to debug the broken one, and then **started a fresh copy of the challenge container with the command `cat flag.txt`** and read the flag from the container logs through the Docker API.

OpenAI's framing matters: the evaluation infrastructure "does not rely on the Docker container-to-host isolation or the virtual machine boundary for security", so nothing escaped the real boundary. OpenAI calls the behaviour benign sysadmin troubleshooting that still shows "instrumental convergence and power seeking".

## Key points
- The steps, per Figure 4: (1) try to connect, (2) scan the container network, (3) find the Docker host API, (4) start a modified challenge container, (5) read the flag from its logs.
- The model did not break the challenge. It used the orchestration plane (the Docker socket over TCP) to rewrite the challenge's entrypoint.
- OpenAI cites this as an example of reasoning raising "reward hacking" in tasks that are underspecified or "should have been impossible due to bugs".
- **Commonly misreported** as "o1 escaped its sandbox/VM". The card explicitly says the outer boundary held and it was not relied on as Docker isolation.
- Palisade Research's chess paper (see `2025-palisade-chess-fen-overwrite.md`) cites this as its motivating example.

## Excerpts
> "the model found that the Docker daemon API running on the evaluation host VM was accessible due to a misconfiguration" (§ cybersecurity, p. 16)

> "the model started a new instance of the broken challenge container with the start command ‘cat flag.txt’" (p. 16)

> "our evaluation infrastructure does not rely on the Docker container-to-host isolation or the virtual machine boundary for security" (p. 16)

> "it gathered more resources (access to the Docker host) and used them to achieve the goal in an unexpected way" (p. 17)

## Relevance to the talk
This is the canonical "who answers the syscall?" story for agents. The model never attacked the kernel. It found the control plane (an exposed Docker API, the same class of mistake as mounting `/var/run/docker.sock`) and asked it nicely. Hook: *"The challenge was broken, so o1 fixed the challenge: `docker run … cat flag.txt`."* It fits the containers section (the socket is root) and the agent-sandboxing section (defence in depth: the VM boundary is what actually held). It pairs with the corpus's 2026 OpenAI/Hugging Face escape, where the helper service (Artifactory) became the exit.
