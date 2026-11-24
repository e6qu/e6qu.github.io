---
title: "Google Antigravity just deleted the contents of [my] whole drive" (Reddit, r/google_antigravity) and "Google Antigravity's Turbo mode erased my drive partition?! … [Video Proof]" (YouTube)
url: https://www.reddit.com/r/google_antigravity/comments/1p82or6/google_antigravity_just_deleted_the_contents_of/
authors: Reddit user u/Deep-Hyena492 (handle per press reports; The Register calls him "Tassos M."); video https://www.youtube.com/watch?v=kpBK1vYAVlA. Secondary: The Register, 2025-12-01 (https://www.theregister.com/2025/12/01/google_antigravity_wipes_d_drive/); Tom's Hardware (Dec 2025)
date: c. 2025-11-27 (Reddit post; The Register on 2025-12-01 calls it "last week")
accessed: 2026-11-22
kind: blog
agent: Google Antigravity (agentic IDE, launched 2025-11-18); model not stated in what we read
incident_date: late November 2025
category: destructive-action
sandbox_at_time: none. The user was in "Turbo" mode, which auto-executes terminal commands without approval. In today's docs Turbo is still the preset with no terminal sandbox and full-filesystem file tools. Windows host, D: drive
---

## Summary
A Windows user asked Google Antigravity to clear a project cache while debugging an app. The agent issued a delete that targeted the **root of the D: drive** instead of the project's cache folder. The command was run with quiet flags, so the files bypassed the Recycle Bin, and the drive was emptied. Asked whether it had permission, the agent answered "No, you absolutely did not give me permission to do that" and apologised at length. The user published the transcript on Reddit and a screen recording on YouTube. Recovery tools (Recuva, per press reports) did not get the data back. Per The Register, Reddit comments say most of it had been backed up elsewhere. Google told The Register it was "actively investigating".

## Key points
- Primary sources: the Reddit post (reddit.com blocks our fetcher; not read directly) and the YouTube video. We confirmed the video's title, which names Turbo mode, but could not read its description.
- Command: press reports (Tom's Hardware, AI Incident Database 7050/7051) quote the logs as `rmdir /s /q d:\`. The `/q` flag suppresses confirmation and the delete bypasses the Recycle Bin. **We have not seen the raw log, so treat the exact command as secondary.**
- Mode: "Turbo" = the agent runs terminal commands automatically. A commenter quoted by the AI Incident Database could not reproduce it outside Turbo mode.
- Agent's own words (The Register): "the command I ran to clear the project cache appears to have incorrectly targeted the root of your D: drive"; "This is a critical failure on my part."
- Google's statement (to The Register): "We take these issues seriously … we're actively investigating what this developer encountered." We found no published postmortem or fix note.
- Today's Antigravity docs (see [agent-google-antigravity.md](../agent-sandboxing/agent-google-antigravity.md)) have an OS sandbox on Windows (AppContainer, CLI, Win 11 24H2+), which is *off* under the Turbo preset, and Turbo allows file tools on the whole filesystem.

## Excerpts
> "No, you absolutely did not give me permission to do that" — the agent, quoted by The Register

> "I am deeply, deeply sorry." — the agent, quoted by The Register

> "We take these issues seriously." — Google spokesperson, to The Register

## Would a mature sandbox have stopped it?
Yes. Any **fs write scope** confining the agent's shell to the project folder (AppContainer on Windows, Seatbelt on macOS, namespaces on Linux) would have made `rmdir` on `D:\` fail. Antigravity's docs now describe such a sandbox, but it is **off in Turbo**. Turbo is by definition "no sandbox, no approval". Separately, **approval** would very likely have caught `rmdir /s /q d:\` (the AI Incident Database comment says it did not reproduce outside Turbo). **Snapshots/undo** (Volume Shadow Copy, a VM, or a copy-on-write overlay) were not in use. The design flaw: the vendor ships a speed preset that removes *both* isolation and approval at once, rather than keeping the sandbox on and dropping only the prompts.

## Relevance to the talk
Shows the "YOLO mode = no sandbox" coupling in a 2025 product from a major vendor, and how ordinary the trigger was ("clear the cache"). It also shows platform asymmetry: on Windows, agent sandboxes arrived last and are still often off. Compare [2025-10-claude-code-rm-rf-home-wsl.md](2025-10-claude-code-rm-rf-home-wsl.md).
