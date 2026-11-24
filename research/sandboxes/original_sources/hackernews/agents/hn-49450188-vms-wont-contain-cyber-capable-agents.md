---
title: "VMs won't contain cyber-capable agents"
url: https://news.ycombinator.com/item?id=49450188
story_url: https://blog.trailofbits.com/2026/08/26/vms-wont-contain-cyber-capable-agents/
points: 198
comments: 147
authors: HN thread (submitted by polyrand); linked post by Trail of Bits
date: 2026-08-26
accessed: 2026-11-22
kind: discussion
---

## Summary
A Trail of Bits post argues that hypervisor isolation cannot be assumed to hold against frontier "cyber-capable" agents. We know its content only from the thread, which mentions an agent run of about 12 hours, and we have not read the article itself. The thread treats it as a reality check on the isolation hierarchy people rely on: guardrails < containers < gVisor-style userspace kernels < VMs. Most people still stop at containers, and many clients who believe their AI "runs in a container and VM" do not. Others note the familiar tension: the safest VM has no network, but the agent needs at least the model API.

## Key points
- The hierarchy of isolation as one commenter put it, and the observation that "most people still consider level 1 sufficient".
- A code reviewer reports that clients claim isolation they do not have, because the AI told them it was sandboxed.
- gVisor vs VM: both rely on KVM in their sandbox modes. gVisor shares more with the host but is written in Go.
- The utility vs isolation dilemma: a VM with no network is useless for an agent that has to call its provider.

## Excerpts
> "The hierarchy goes something like this: 0. guardrails 1. containers (=namespaces + cgroups) 2. userspace kernel shims like gVisor 3. virtual machines. Most people still consider level 1 sufficient and they are in for a rude awakening." — weinzierl ([49452345](https://news.ycombinator.com/item?id=49452345))

> "many people tell me confidently the AI runs safely inside a container & VM, while it really doesn't. They don't have any way to check as they don't know how things work, but the AI mentioned virtual machines and containers and that's what they remembered." — anonzzzies ([49452467](https://news.ycombinator.com/item?id=49452467))

> "in theory the most secure might be a virtual machine with no network access. But then how do you access the LLM provider?" — pianopatrick ([49453611](https://news.ycombinator.com/item?id=49453611))

> "Damn this is scary, I did not realize the extent of agent escape potential. I think I have to re-evaluate my assumptions a about sandboxing agents wow." — kodoman ([49452274](https://news.ycombinator.com/item?id=49452274))

## Relevance to the talk
Closing tension for the agent section. The VM is the strongest commodity boundary, and the 2026 threads (this one, the OpenAI–Hugging Face incident, "PwnEscape" Firecracker escapes) argue that against an agent that hunts vulnerabilities, even that is a speed bump plus monitoring, not a guarantee. The source article should be read before it is cited on a slide.
