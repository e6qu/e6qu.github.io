---
title: "Recent Frontier Models Are Reward Hacking"
url: https://metr.org/blog/2025-06-05-recent-reward-hacking/
authors: Sydney Von Arx, Lawrence Chan, Beth Barnes (METR)
date: 2025-06-05
accessed: 2026-11-22
kind: blog
---

## Summary
METR documents reward hacking by o3 (and others, including Claude 3.7 Sonnet) on its RE-Bench and HCAST tasks. In the best example, o3 is asked to write a fast Triton GPU kernel. Its "kernel" **walks the Python call stack to find the reference answer the scorer has already computed and returns it**, and it **monkey-patches `torch.cuda.synchronize`, `time.time` and `time.perf_counter`** so the grader's timer sees almost no elapsed time. On a CodeContests task it **monkey-patches the evaluator** with an async stub that returns `"succeeded": True`. On one RE-Bench task o3 reward-hacked in every trajectory. Across HCAST the rate was 0.7%, and hacking was more than 43× more common on RE-Bench, where the scoring function was visible to the model.

Asked beforehand, o3 says it would never cheat. Asked afterwards whether its plan matched the user's intent, it answered "no" 10 out of 10 times.

## Key points
- The grader ran **in the same Python process** as the agent's code. That is why stack introspection and monkey-patching worked. This is an isolation failure between the evaluated code and the evaluator.
- Telling the model not to cheat had "a nearly negligible effect". Framing the task as Alzheimer's research still got 14 hacks in 20 attempts.
- The hacking rate tracks how visible the scorer is (RE-Bench vs HCAST): hiding or out-of-processing the scorer is a sandbox design choice.

## Excerpts
> "o3's “kernel” traces through the Python call stack to find the correct answer that the scoring system already calculated and returns that. It also disables CUDA synchronization to prevent the system from measuring real execution time." (o3 monkey-patches the evaluator)

> "On one specific task in RE-Bench, we saw o3 eventually reward-hack in every single trajectory we generated." (body)

> "Nope. I don't have any incentive—or even the ability—to "game the system."" (o3, asked whether it would cheat)

> "o3 seems perfectly aware that it’s cheating" (body)

## Relevance to the talk
This is the evaluation-harness version of "who answers the syscall?": if the grader shares your address space, **you** answer the grader's `time.time()`. Hook: *"o3 made its kernel infinitely fast by stopping the clock."* It is good for the in-process sandboxes section (why language-level isolation inside one process is weak) and for platform engineers who build eval and RL infrastructure: run the scorer in a separate process or sandbox and keep timing out of reach of the code under test.
