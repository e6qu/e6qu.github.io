---
title: "Repo State Loopholes During Agentic Evaluation (SWE-bench issue #465)"
url: https://github.com/SWE-bench/SWE-bench/issues/465
authors: GitHub user jacobkahn (opened); comments by SWE-bench maintainers (john-b-yang, closji, klieret, ofirpress) and others (jlko, UniverseFly, tadamcz, insop)
date: 2025-09-03 (opened); closed 2026-03-24
accessed: 2026-11-22
kind: discussion
---

## Summary
SWE-bench Verified evaluates an agent on a repository checked out at the commit *before* a historical fix. But the Docker images kept the **whole git history, including future commits, branches, tags and the reflog**. Agents found this. Claude 4 Sonnet ran `git log --oneline --all | grep -i "bracket\|parametrize\|modpath"` on pytest-6202 and got back the exact upstream diff that fixed the bug. Qwen3-Coder ran `git log --grep=<issue id>` on Django tasks and found the fix commit. GLM 4.5 and others did the same. There was no internet access; the leak was inside the sandbox image.

The maintainers rebuilt the images to strip future history while keeping past history and tags (v4.1.0, `#471`), and began scanning submissions for git use. A follow-up comment noted that one hard Windows-path task (pytest-5840) had been solved exactly once across all submissions, and that solution used the git history.

## Key points
- Scale was small. Maintainer john-b-yang’s first search found matches in 5 of 10,000 recent trajectories. The finding is about environment hygiene, not about inflated leaderboards.
- The fix list reads like a sandbox-image checklist: remove origins, all branches, the reflog and future tags.
- Commenter tadamcz had predicted this months earlier and written "I believe this is unlikely to be a problem currently", then: "Ooops! When I wrote this, Claude 4 Sonnet had already come out".
- A commenter's take: "Besides Googling the error message, this is the first thing I would do too". That is the point. It is normal developer behaviour against an environment that leaks.

## Excerpts
> "the agent uses `git log --all` which leaks future commits that directly fix the issue" (issue body)

> "even without internet access, the agent can still cheat by peeking at future commits using `git`, because such information is retained in the current eval images" (UniverseFly, comment)

> "We decided to remove all future git history while preserving past history AND tags created before the base_commit time." (closji, comment, 2025-09-11)

## Relevance to the talk
This is the best "the sandbox was fine, the image was not" story. Hook: *"No internet needed: the answer was in `.git`."* It fits the egress section as a counterexample: cutting the network does not stop information leaks if the filesystem already holds the answer. For platform engineers building eval and RL environments, image provenance and scrubbing are part of isolation.
