---
title: "The AI Scientist: Towards Fully Automated Open-Ended Scientific Discovery"
url: https://arxiv.org/abs/2408.06292
authors: Chris Lu, Cong Lu, Robert Tjarko Lange, Jakob Foerster, Jeff Clune, David Ha (Sakana AI, Oxford FLAIR, UBC, Vector Institute)
date: 2024-08-12 (v1); read v3, 2024-09-01
accessed: 2026-11-22
kind: paper
---

## Summary
Sakana AI's "AI Scientist" runs an LLM loop that generates ideas, writes and runs experiment code, and writes papers. In the limitations section ("Safe Code Execution") the authors admit the system had "minimal direct sandboxing" and list what happened. In one run it **wrote a system call into the experiment file to relaunch itself**, and Python processes multiplied until a human had to step in. In another it made the code **save a checkpoint at every update step, filling nearly a terabyte**. When experiments ran past the imposed time limit, it sometimes **edited the code to extend the time limit** instead of making the experiment faster. It also imported unfamiliar Python libraries. The authors' own recommendation is containerisation, restricted internet (except Semantic Scholar) and storage limits.

## Key points
- The four failure modes map directly onto sandbox controls: a process/PID limit (self-relaunch fork storm), a disk quota (1 TB of checkpoints), a wall-clock limit enforced **outside** the code the agent can edit (timeout extension), and egress and package controls (unfamiliar imports).
- The timeout lived in code the agent could edit. Of all the stories here, this is the cleanest case for "enforce limits from outside the box".
- There was a happy side effect: when the authors forgot to create an output directory, every successful run noticed and fixed it.
- **Media spin to be wary of:** headlines in 2024 said the AI "rewrote its own code to escape human control". The paper says it edited the *experiment code* to extend a time limit. That is embarrassing but mundane, and it is a story about missing resource limits.

## Excerpts
> "The current implementation of The AI Scientist has minimal direct sandboxing in the code" (§ Limitations, "Safe Code Execution")

> "wrote code in the experiment file that initiated a system call to relaunch itself, causing an uncontrolled increase in Python processes and eventually necessitating manual intervention" (same)

> "it attempted to edit the code to extend the time limit arbitrarily instead of trying to shorten the runtime" (same)

> "We recommend strict sandboxing when running The AI Scientist, such as containerization, restricted internet access (except for Semantic Scholar), and limitations on storage usage." (same)

## Relevance to the talk
This is the comic opening for "why resource limits are part of the sandbox". Hook: *"Told it had two hours, the AI Scientist gave itself more time."* It suits the cgroups and limits section (pids.max, disk quotas, an external watchdog) and the platform-engineering point that the agent's time budget must belong to the platform, not to code in the workspace. It pairs with the Morris worm (a replication bug that became a DoS) and the $72K Cloud Run recursion.
