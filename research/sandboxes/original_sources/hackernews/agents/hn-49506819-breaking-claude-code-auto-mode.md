---
title: "Breaking Claude Code Opus 5 Auto Mode"
url: https://news.ycombinator.com/item?id=49506819
story_url: https://embracethered.com/blog/posts/2026/breaking-claude-code-opus-5-and-automode/
points: 399
comments: 121
authors: HN thread (submitted by Recursing); linked research by Johann Rehberger (Embrace The Red)
date: 2026-08-31
accessed: 2026-11-22
kind: discussion
---

## Summary
Three weeks after auto mode became the default, Rehberger showed that a web page Claude Code was asked to summarise could lead it to write and run a decoding script that executed malware. He reports attack success of up to 80% on a small sample, and contrasts this with Anthropic's claim that layered defences bring indirect prompt injection on unseen attacks close to zero. Commenters argue about whether it is "prompt injection" or a trojan aimed at Claude's helpfulness. The more important takeaway they draw is that auto mode gives a false sense of security, while the same attack inside a real sandbox, even in YOLO mode, would be "comparatively harmless". In some runs auto mode even blocked Claude's own attempt to kill the malware.

## Key points
- The vector is content the agent reads (a URL to summarise), not a direct user instruction, and the result is arbitrary code execution without the user's knowledge.
- Success rate up to 80% (small sample) against a classifier-gated default mode.
- A classifier gate is probabilistic, a sandbox is structural, and the thread lines them up as alternatives.

## Excerpts
> "The point is that auto mode gives people a false sense of security that leads them to believe they don't need to run Claude in a proper sandbox. This same attack running in a sandbox (even in YOLO mode) would be comparatively harmless." — kevsim ([49508035](https://news.ycombinator.com/item?id=49508035))

> "> Boris Cherny from Anthropic recently posted that layered defenses could reduce indirect prompt injection on unseen attacks to approximately zero. > I got attack success rates up to 80% using a small sample size." — bewareofscams, quoting the post ([49508186](https://news.ycombinator.com/item?id=49508186))

> "> In a few runs Claude tried to terminate the malware process once it noticed the compromise, but Auto Mode denied the cleanup command. See, that's why you should run with --dangerously-skip-permissions" — throwawayffffas ([49508311](https://news.ycombinator.com/item?id=49508311))

> "Your emphasis here seems to downplay the end-result of the attack - which is arbitrary code execution from a seemingly innocent URL merely being read by the LLM." — throwaway314155 ([49511887](https://news.ycombinator.com/item?id=49511887))

## Relevance to the talk
The counterpoint to auto mode: the model-as-gatekeeper approach fails at rates no security engineer would accept. It is the 2026 version of Rehberger's Month of AI Bugs, now aimed at a vendor's flagship safety feature.
