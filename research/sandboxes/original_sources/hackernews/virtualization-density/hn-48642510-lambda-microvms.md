---
title: "MicroVMs: Run isolated sandboxes with full lifecycle control"
url: https://news.ycombinator.com/item?id=48642510
story_url: https://aws.amazon.com/blogs/aws/run-isolated-sandboxes-with-full-lifecycle-control-aws-lambda-introduces-microvms/
authors: HN discussion (submitted by justincormack) of AWS's Lambda MicroVMs announcement
date: 2026-06-23
accessed: 2026-11-22
kind: discussion
points: 386
comments: 212
---

## Summary
AWS launched Lambda MicroVMs: Firecracker sandboxes built from a Dockerfile, with suspend/resume and up to 8 hours of total runtime. They are aimed at running user- and AI-generated code. Marc Brooker (AWS) confirmed it is the same stack as Bedrock AgentCore Runtime, which has given each agent session its own microVM for a year. The thread asked whether agents need microVMs at all. It discussed the crowded sandbox market (E2B, Fly Sprites, exe.dev, SlicerVM, libkrun locally) and whether "sandbox" is even the right shape for long-lived agent workspaces.

## Key points
- Lineage: "AWS AgentCore runtime has been around for about a year ... it's the same underlying technology as the Lambda MicroVMs" (mjb). tptacek: "Presumably it is Firecracker", like Lambda and Fargate.
- Why per-session microVMs (mjb): for "multi-tenant and multi-agent systems with strong security boundaries, then having a VM or MicroVM per agent session ... really simplifies things".
- Limits, as quoted from the announcement: up to 8 hours total runtime, priced per instance-second. A commenter estimates about 4× the cost of an equivalent Graviton EC2 instance if kept running.
- Market: commenters list snapshot/fork, SSH/VPN access and network-layer secret hiding as the features that set sandbox providers apart. E2B (disclosed employee) pitches 24-hour timeouts and self-hosting. libkrun is suggested for local sandboxes.
- Skeptics: "What's the point of microVMs for running agents?" Why not a regular VM, or a container inside a VM (TacticalCoder)? exe.dev's David Crawshaw (crawshaw) avoids the word "sandbox": agent VMs might need to live 30 minutes or a month.
- Resource sharing is the pain point: fixed RAM allocations per sandbox waste memory when idle and limit it when busy.

## Excerpts
> "You absolutely can run agents on a regular VM. But if you want to build multi-tenant and multi-agent systems with strong security boundaries, then having a VM or MicroVM per agent session (or session with a group of agents) really simplifies things." — mjb (AWS), https://news.ycombinator.com/item?id=48689958

> "AWS AgentCore runtime has been around for about a year ... (spoiler, it's the same underlying technology as the Lambda MicroVMs)." — mjb, https://news.ycombinator.com/item?id=48689878

> "Presumably it is Firecracker. It's just a different shape of offering, along with Lambda and Fargate, which are also Firecracker." — tptacek, https://news.ycombinator.com/item?id=48688794

> "This is why I have been avoiding the word sandbox for exe.dev. I don’t think developers agents need something “sandbox” shaped." — crawshaw, https://news.ycombinator.com/item?id=48690127

> "What's the point of microVMs for running agents? Are you guys literally spinning up agents where a 100 ms boot time vs a 3 seconds boot time makes a difference?" — TacticalCoder, https://news.ycombinator.com/item?id=48689299

## Relevance to the talk
The hyperscaler confirmation that "one microVM per agent session" is the default architecture for hosted coding agents. The thread also raises the open question for the talk's ending: are agents short-lived sandboxes or long-lived computers? Cross-reference `../../agent-sandboxing/`.
