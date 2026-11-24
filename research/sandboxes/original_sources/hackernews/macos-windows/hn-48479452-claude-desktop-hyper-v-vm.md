---
title: "Claude Desktop spawns 1.8 GB Hyper-V VM on every launch, even for chat-only use"
url: https://news.ycombinator.com/item?id=48479452
story_url: https://github.com/anthropics/claude-code/issues/29045
points: 434
comments: 304
authors: submitted by tonyrice; HN commenters
date: 2026-06-10
accessed: 2026-11-22
kind: discussion
---

## Summary
The Windows sequel to the Cowork VM complaint: Claude Desktop starts its Cowork sandbox VM (via Hyper-V / Host
Compute System) at launch, a 1.8 GB VM per the title (one commenter: "it took up 12gb on mine"), even if the user only chats. Most of the thread is about product
quality, but it shows how visible a VM-per-agent design is on ordinary laptops.

## Key points
- The VM exists for Cowork, which "does all work within the VM sandbox"; the complaint is that it is not
  opt-in and starts eagerly.
- Disk: the ~10 GB bundle again, painful on 256 GB Macs; users chmod the folder to stop it.
- One commenter defends eager start as latency hiding: the VM boots while the user types.
- Others argue an idle VM should just be paged out, and that if competitors give equal security with less RAM
  that would be the interesting comparison.

## Excerpts
> "The VM itself is for Claude Cowork which does all work within the VM sandbox. That doesn't help answer why they spin it up immediately and don't have a way to disable it though."
— nathanyz, https://news.ycombinator.com/item?id=48480336

> "I won't understand why Cowork isn't simply opt-in. It also installs a ~10GB vm bundle which you cannot remove"
— tom1337, https://news.ycombinator.com/item?id=48480172

> "People take more time to type a prompt than the VM takes to spin up on a fast machine and on a slow machine, the cooldown naturally frees RAM back to the machine."
— gopalv, https://news.ycombinator.com/item?id=48480293

> "It seems obvious that Claude Desktop needs a VM for security for the majority of it's actual real world use. VM's take up memory, yeah."
— jrochkind1, https://news.ycombinator.com/item?id=48490746

## Relevance to the talk
Shows the VM-on-desktop default has reached consumer agent products on both Mac and Windows, and that users notice
the gigabytes. Good slide material for "the price of the strong boundary".
