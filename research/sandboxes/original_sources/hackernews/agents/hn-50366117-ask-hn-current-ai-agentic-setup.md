---
title: "Ask HN: What's your current AI agentic setup?"
url: https://news.ycombinator.com/item?id=50366117
story_url: (text post)
points: 573
comments: 718
authors: HN thread (asked by eggbrain)
date: 2026-11-04
accessed: 2026-11-22
kind: discussion
---

## Summary
A general census thread (subscriptions, models, harnesses, workflows), not a sandboxing thread. That is what makes it a useful control sample. We counted the 411 top-level answers with a keyword pass: about 50 (≈12%) mention any isolation (sandbox, container, VM, bubblewrap, nono, LXC, devcontainer…), 16 (≈4%) mention running on a remote VPS or cloud VM or using Claude Code on the web, and only 5 mention YOLO or skip-permissions flags by name. Most people describe models and harnesses and say nothing about containment. Those who do mention it describe nono.sh with a credential proxy, Docker Sandboxes, bubblewrap+pasta wrappers, gVisor auto-containerisation, per-project libvirt VMs with CoW golden images, Proxmox LXCs with firewalled networks, restricted Windows accounts and devcontainers.

## Key points
- Keyword counts are rough: "container" can refer to the user's app rather than the agent, and silence does not prove no sandbox. Still, in an unprimed thread most answers never bring up isolation.
- Cloud agents are counted as isolation by their users ("real sandboxing, and it doesn't tie up my computer").
- Resource cost comes up too: "10+ agents eats 14GB out of 16GB, thus i had to move" to a remote VM cluster (2ero_wf, [50445235](https://news.ycombinator.com/item?id=50445235)).
- Friction is the recurring complaint: people who moved to Docker Sandboxes or nono.sh report that the workflow is clunkier than plain `claude`.

## Excerpts
> "How about, what sandboxing are you using to prevent the LLM from doing something you don't want? I'm using nono.sh and have restricted network and file access." — auslegung ([50367803](https://news.ycombinator.com/item?id=50367803))

> "Have multiple Docker sandboxes where I let agents yolo. Must say I don't really love the setup." — imafish ([50376308](https://news.ycombinator.com/item?id=50376308))

> "I use Claude Code Web almost exclusively for personal projects… Nicer UI than a terminal, real sandboxing, and it doesn't tie up my computer." — iainmerrick ([50376807](https://news.ycombinator.com/item?id=50376807))

> "I'm using a cli I wrote to orchestrate per-project VMs for sandboxing using libvirt with COW shared golden images to minimise the disk overhead." — mnahkies ([50376357](https://news.ycombinator.com/item?id=50376357))

> "agents work in their own lxc spawn automatically in a proxmox node, where they can go wild without sandboxing or isolation, network is firewalled too" — tamimio ([50373485](https://news.ycombinator.com/item?id=50373485))

> "Until local LLMs become feasible on my modest hardware, I will be keeping AI tools safely confined to the browser." — bluebarbet ([50377364](https://news.ycombinator.com/item?id=50377364))

## Relevance to the talk
Use it to calibrate the practitioner-setups catalogue. Sandbox threads attract people who sandbox. In a general "what's your setup" thread from late 2026, roughly one in eight answers mentions any isolation at all. What vendors ship as the default therefore matters more than the DIY options.
