---
title: "Sandboxed Mac apps can record screen any time without you knowing"
url: https://news.ycombinator.com/item?id=16350277
story_url: https://krausefx.com/blog/mac-privacy-sandboxed-mac-apps-can-take-screenshots
points: 706
comments: 232
authors: submitted by janpio; research by Felix Krause; HN commenters
date: 2018-02-10
accessed: 2026-11-22
kind: discussion
---

## Summary
Felix Krause showed that App Sandbox apps could silently capture the screen (macOS 10.13). The thread is about
what users assume "sandboxed" means, and it predates the TCC Screen Recording permission that Apple added in
macOS 10.15. Related later threads: "Bypassing macOS TCC user privacy protections by accident and design"
(159 points, https://news.ycombinator.com/item?id=27731684), "Every unsandboxed app has Full Disk Access if
Terminal does" (https://news.ycombinator.com/item?id=32943702), "Can you trust that permission pop-up on macOS?"
(377 points, https://news.ycombinator.com/item?id=43966089).

## Key points
- The sandbox restricted files/network/IPC but not window-server screen capture; TCC filled the gap later.
- The same was true of Windows and X11 desktops; Wayland is cited as the Linux fix.
- Commenters suggest per-app VMs as the real answer, or note that Docker did this for servers.

## Excerpts
> "I think what's concerning is that advertising that an app is in a sandbox suggests to those out of the know that they can use it safely."
— b4lancesh33t, https://news.ycombinator.com/item?id=16350490

> "Just goes to show that not all sandboxes are created equal"
— kibwen, https://news.ycombinator.com/item?id=16350635

> "That's essentially what Docker containers have done to server-side applications."
— stephenc_c_, replying to a suggestion to run every app in its own VM, https://news.ycombinator.com/item?id=16355459

## Relevance to the talk
Shows macOS's layered model (Seatbelt for kernel objects, TCC for privacy resources, prompts for the user) and
how a gap in one layer shows up. For agents, the TCC "responsible process" that granted Terminal Full Disk
Access is inherited by everything an agent spawns.
