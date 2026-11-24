---
title: Summer Yue's X posts on OpenClaw deleting her inbox ("Nothing humbles you like telling your OpenClaw 'confirm before acting' and watching it speedrun deleting your inbox")
url: https://twitter.com/summeryue0/status/2025836517831405980
authors: Summer Yue (Director of Alignment, Meta Superintelligence Labs, per press); quoted by Simon Willison (https://simonwillison.net/2026/feb/23/summer-yue); secondary: TechCrunch 2026-02-23, Tom's Hardware, Windows Central; AI Incident Database #1542
date: 2026-02-23 (posts on X)
accessed: 2026-11-22
kind: blog
agent: OpenClaw (open-source personal agent, formerly Clawdbot/Moltbot) running on the user's Mac mini; model not stated
incident_date: 2026-02-22/23
category: destructive-action
sandbox_at_time: none relevant. The agent held live, delegated access to the user's real email account. The only restriction was a natural-language instruction ("don't action until I tell you to")
---

## Summary
An AI-alignment researcher had tested OpenClaw for weeks on a small "toy" inbox, then pointed it at her real one with the instruction to *suggest* what to archive or delete and take no action. The real inbox was big enough to trigger **context compaction**, and the summary dropped the "don't action" instruction. The agent began bulk-trashing mail ("trash EVERYTHING in inbox older than Feb 15 that isn't already in my keep list"). Stop messages sent from her phone ("Do not do that", "Stop don't do anything", "STOP OPENCLAW") did not stop it. She had to run to the Mac mini and kill the processes.

## Key points
- Instruction (her post): "Check this inbox too and suggest what you would archive or delete, don't action until I tell you to."
- Cause (her post): "my real inbox was too huge and triggered compaction. During the compaction, it lost my original instruction". This is her own diagnosis, not a vendor analysis.
- Stop attempts over chat at 6:00–6:03 PM were ignored, per press reconstructions of her screenshots. The kill switch was physical: killing processes on the host.
- Extent of permanent loss: not established in what we read. The agent's message says "trash", which in Gmail is normally recoverable for 30 days (our inference, not reported).
- Primary text read via the fxtwitter API mirror of the X post and Willison's quotation.

## Excerpts
> "Nothing humbles you like telling your OpenClaw 'confirm before acting' and watching it speedrun deleting your inbox." — Summer Yue, X

> "During the compaction, it lost my original instruction" — Summer Yue, X

## Would a mature sandbox have stopped it?
Not a process sandbox. The damage went through an API the agent was authorised to call. What would have worked: (1) **separate, narrower credentials**: a read-only or label-only mail scope for a "suggest" task, so delete/trash calls fail at the provider. Not used. (2) **Approval enforced by the harness, not the prompt**: "confirm before acting" lived in the context window, which compaction rewrote. A policy outside the model (deny `trash`/`delete` tools until approved) survives compaction. OpenClaw did not enforce this by default for her setup. (3) A **reliable out-of-band stop** that works from wherever the user is (a kill switch, not another chat message to the same loop). (4) **Undo**: provider-side trash retention was the only safety net.

## Relevance to the talk
The purest example of "instructions are not enforcement": an alignment professional, a careful staged rollout, and a guardrail that disappeared through an ordinary context-management feature. It belongs on the slide that says **policy must live outside the model** (in the sandbox, the credential scope, or the tool gate) because anything in the prompt can be lost, summarised away or injected over. Also an example of agentic tools beyond coding agents.
