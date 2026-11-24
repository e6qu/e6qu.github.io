---
title: "Go hard on agents, not on your filesystem"
url: https://news.ycombinator.com/item?id=47550282
story_url: https://jai.scs.stanford.edu/
points: 635
comments: 329
authors: HN thread (submitted by mazieres, David Mazières, Stanford, the project's author)
date: 2026-03-28
accessed: 2026-11-22
kind: discussion
---

## Summary
`jai` is a zero-configuration Linux containment tool for AI agents from Stanford's SCS group. Its defaults: full access to the current directory, read-only access to the rest of the filesystem, and copy-on-write for `$HOME`, with stricter modes available. The author's argument is behavioural rather than technical. Many people do not use dev containers consistently and some enable YOLO on their real laptops, so the safe path has to be the zero-effort path. Commenters set it against bubblewrap ("the 15-flag bwrap invocation"), against Claude Code's built-in `sandbox` settings, and against simply giving the agent another machine.

## Key points
- Default policy: CWD read-write, everything else read-only, `$HOME` copy-on-write. Commenters said this "should be the default for agent systems".
- One commenter's reason for using an external tool rather than the built-in Claude Code sandbox config: "Something other than the fox" guarding the henhouse.
- The author's adoption point: people who are not 100% consistent about containers are the target.
- The counter-position from a power user: the "biggest unlock" was giving the agent SSH keys, though inside a VM with backups.

## Excerpts
> "What would it take for people to stop recklessly running unconstrained AI agents on machines they actually care about?" — mazieres ([47550283](https://news.ycombinator.com/item?id=47550283))

> "Empirically, a lot of people don't, and some people regularly enable YOLO mode on their actual laptops… if you aren't 100% consistent about using a container, then jai may be for you" — mazieres ([47569499](https://news.ycombinator.com/item?id=47569499))

> "I like the tradeoff offered: full access to the current directory, read-only access to the rest, copy-on-write for the home directory… It really feels like it should be the default for agent systems." — BoppreH ([47550575](https://news.ycombinator.com/item?id=47550575))

> "some random upcoming revision of claude-code could remove or simply change the config name just as silently as it was introduced. People might genuinely want some other software to do the sandboxing. Something other than the fox." — harikb ([47550804](https://news.ycombinator.com/item?id=47550804))

> "the biggest unlock was to stop being a worrywart early on and just literally giving it ssh keys and telling it to fix something. ofc I have backups and do run it in VM" — vardalab ([47550924](https://news.ycombinator.com/item?id=47550924))

## Relevance to the talk
An academic systems researcher's answer to agent risk is ergonomics: the safe default must cost nothing. jai's CWD-rw / rest-ro / home-CoW policy is a compact statement of what a coding agent actually needs, and it sits close to the Codex `workspace-write` and srt defaults.
