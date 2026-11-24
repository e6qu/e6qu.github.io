---
title: "Claude Desktop spawns 1.8 GB Hyper-V VM on every launch, even for chat-only use"
url: https://news.ycombinator.com/item?id=48479452
story_url: https://github.com/anthropics/claude-code/issues/29045
points: 434
comments: 304
authors: HN thread (submitted by tonyrice); GitHub issue on anthropics/claude-code
date: 2026-06-10
accessed: 2026-11-22
kind: discussion
---

## Summary
A GitHub issue reported that Claude Desktop on Windows boots a 1.8 GB Hyper-V VM (the Cowork sandbox) at every launch, even for users who only chat. A sibling thread from March ([47218288](https://news.ycombinator.com/item?id=47218288), 377 points) covered the ~10 GB VM bundle Cowork installs on macOS via Apple's Virtualization framework. Together they are HN's main argument about the user-visible cost of VM sandboxing: disk, RAM, idle overhead, nested-virtualisation conflicts, and no opt-out. Commenters agreed the VM is the right sandbox for Cowork and objected only to it starting eagerly. One noted that Claude Code itself had no native sandbox on Windows at the time.

## Key points
- Cost: 1.8 GB RAM per launch on Windows (Hyper-V), and a ~10 GB bundle on macOS that users could not remove.
- Nested virtualisation: users running Claude inside their own VMs hit nested-VM errors. One avoided Cowork by leaving out the "Virtual Machine Platform" feature in his guest.
- macOS debate: Seatbelt (as Codex uses) was suggested as lighter, and another user replied that Claude Code's Seatbelt use "is barely good for anything".
- Windows gap: "Claude (both Desktop and CLI) ships on Windows without any sandboxing support for Code" (as of June 2026).

## Excerpts
> "The VM itself is for Claude Cowork which does all work within the VM sandbox. That doesn't help answer why they spin it up immediately and don't have a way to disable it though." — nathanyz ([48480336](https://news.ycombinator.com/item?id=48480336))

> "I won't understand why Cowork isn't simply opt-in. It also installs a ~10GB vm bundle which you cannot remove" — tom1337 ([48480172](https://news.ycombinator.com/item?id=48480172))

> "Claude (both Desktop and CLI) ships on Windows without any sandboxing support for Code. They only have sandboxing for Linux and macOS." — electroly ([48483892](https://news.ycombinator.com/item?id=48483892))

> "I use Claude Code CLI myself (inside a VM, to isolate it from the host) for >90% of my needs." — bostik ([48481141](https://news.ycombinator.com/item?id=48481141))

> "It makes it so I can't use the Claude Cowork within my VMs and that's when I found out it was running a VM, because it caused a nested VM error." — bachittle ([47218762](https://news.ycombinator.com/item?id=47218762))

> "I very much disagree that Seatbelt is better. Claude Code (aka `claude`) uses it, and it's barely good for anything." — ctmnt ([47221147](https://news.ycombinator.com/item?id=47221147))

## Relevance to the talk
A rare case of a VM sandbox shipped to consumers by default, and of the backlash, which was about cost and not security. It illustrates the density/overhead trade-off from the user's side, and the uneven state of Windows sandboxing before MXC.
