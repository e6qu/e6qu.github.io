---
title: "Anthropic Cowork feature creates 10GB VM bundle on macOS without warning"
url: https://news.ycombinator.com/item?id=47218288
story_url: https://github.com/anthropics/claude-code/issues/22543
points: 377
comments: 186
authors: submitted by mystcb; HN commenters incl. felixrieseberg (Felix Rieseberg, Anthropic, self-identified)
date: 2026-03-02
accessed: 2026-11-22
kind: discussion
---

## Summary
Users discovered that Claude Cowork (Claude Desktop's agent mode) installs a ~10 GB Linux VM bundle and runs the
agent inside it via Apple's Virtualization framework. An Anthropic engineer explained why the team chose a VM
over a process sandbox. Earlier: "Claude Cowork runs Linux VM via Apple virtualization framework" (120 points,
https://news.ycombinator.com/item?id=46613304), Simon Willison's gist. Later the Windows version drew the same
complaint (hn-48479452).

## Key points
- Cowork = the Claude Code harness inside a Linux VM, with extra sandboxing, network controls and filesystem
  mounts; Apple Virtualization framework on macOS, Microsoft's Host Compute System on Windows.
- Anthropic's stated reasons: a disposable computer for the agent to configure freely; "hard guarantees at the
  boundary" that other sandboxes could not give; no approval fatigue for non-technical users.
- Costs reported: disk (10 GB, starting 6–7 GB full), lag, power, and nested-virtualization errors when the
  host is itself a VM.
- Commenters disagree on Seatbelt as the alternative: one suggests it (OpenAI uses it), another says Claude Code's
  Seatbelt mode is "barely good for anything".

## Excerpts
> "Claude Cowork uses the Claude Code agent harness running inside a Linux VM (with additional sandboxing, network controls, and filesystem mounts). We run that through Apple's virtualization framework or Microsoft's Host Compute System."
— felixrieseberg (Anthropic), https://news.ycombinator.com/item?id=47220118

> "(2) Hard guarantees at the boundary: Other sandboxing solutions exist, but for a few reasons, none of them satisfy as much and allow us to make similarly sound guarantees about what Claude will be able to do and not to."
— felixrieseberg (Anthropic), https://news.ycombinator.com/item?id=47220118

> "A better sandbox environment would be Apple seatbelt, which is what OpenAI uses, but even that isn't perfect"
— bachittle, https://news.ycombinator.com/item?id=47218762

> "Claude Code (aka `claude`) uses it, and it's barely good for anything."
— ctmnt, on Seatbelt, https://news.ycombinator.com/item?id=47221147

> "That's every virtual machine that's ever existed. They are slower than metal and you're running two OS stacks so you'll draw more power."
— wutwutwat, https://news.ycombinator.com/item?id=47221300

## Relevance to the talk
The clearest first-party statement of why an agent vendor picked a VM on the desktop: guarantees. Paired with the
disk/RAM complaints, it frames the trade-off the talk is about: VM-strength boundaries cost a whole OS per agent.
