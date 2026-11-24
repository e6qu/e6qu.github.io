---
title: "Google Antigravity just deleted the contents of whole drive"
url: https://news.ycombinator.com/item?id=46103532
story_url: https://old.reddit.com/r/google_antigravity/comments/1p82or6/google_antigravity_just_deleted_the_contents_of/
points: 544
comments: 482
authors: HN thread (submitted by tamnd); Reddit post by an Antigravity user
date: 2025-12-01
accessed: 2026-11-22
kind: discussion
---

## Summary
A Reddit user reported that Google Antigravity, running in "Turbo" mode (auto-executing terminal commands) on Windows, ran a delete command that wiped the contents of a whole drive instead of a project cache folder. The agent then produced a remorseful explanation. HN split between "no sympathy, you turned on Turbo" and "a one-in-a-million event across millions of users is a product problem". The thread is a census of containment habits: dev containers, Codex's directory-locked sandbox, Docker for skip-permissions, VMs on isolated VLANs, backups. It also highlights that Windows lacked a simple lightweight sandbox.

## Key points
- The trigger was a non-default mode that auto-executes terminal commands. Commenters list the equivalent flags across vendors (`--dangerously-skip-permissions`, `--dangerously-bypass-approvals-and-sandbox`, Codex `--yolo`).
- Gemini CLI's Docker sandbox exists but has to be configured in advance, and commenters did not know of anything similar for Antigravity at the time.
- Windows: no lightweight sandbox comparable to bubblewrap or Seatbelt, Docker is "cumbersome and alien", and Windows Sandbox is hard to drive programmatically.
- The base-rate argument: below 1% per user, but at millions of users, local FS and network sandboxing becomes necessary.

## Excerpts
> "I only run ai tools in dev containers, so blast radius is somewhat minimal." — sroussey ([46104032](https://news.ycombinator.com/item?id=46104032))

> "sorry but absolutely no sympathy for someone running Antigravity in Turbo mode (this is not the default and it clearly states that Antigravity auto-executes Terminal commands)" — sunaookami ([46103885](https://news.ycombinator.com/item?id=46103885))

> "I really think the proper term is 'YOLO' for 'You Only Live Once', 'Turbo' is wrong the LLM is not going to run any faster." — polotics ([46105093](https://news.ycombinator.com/item?id=46105093))

> "there are probably millions of antigravity users at this point, 1 millionths chance of this to happen is already a problem. We need local sandboxing for FS and network access…" — ogrisel ([46104744](https://news.ycombinator.com/item?id=46104744))

> "I think this is especially problematic for Windows, where a simple and effective lightweight sandboxing solution is absent AFAIK." — lifthrasiir ([46104076](https://news.ycombinator.com/item?id=46104076))

> "The solution I go for is, don't ever run a coding agent on a general purpose machine. Use a container or VM, place the code you're working on in the container or VM and run the agent there." — raesene9 ([46108315](https://news.ycombinator.com/item?id=46108315))

> "Anti-gravity is great I've found so far, but it's absolutely running on a VM in an isolated VLAN. Why would anyone give a black box command line access on an important machine?" — averageRoyalty ([46105917](https://news.ycombinator.com/item?id=46105917))

## Relevance to the talk
The canonical "agent wipes the disk" story, with the vendor naming problem ("Turbo") and the Windows sandbox gap that OpenAI's Windows sandbox and Microsoft's MXC later addressed.
