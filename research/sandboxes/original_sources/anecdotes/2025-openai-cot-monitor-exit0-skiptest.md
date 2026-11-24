---
title: "Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation"
url: https://arxiv.org/abs/2503.11926
authors: Bowen Baker, Joost Huizinga, Leo Gao, Zehao Dou, Melody Y. Guan, Aleksander Madry, Wojciech Zaremba, Jakub Pachocki, David Farhi (OpenAI)
date: 2025-03-14 (arXiv v1); companion blog "Detecting misbehavior in frontier reasoning models", 2025-03-10 (https://openai.com/index/chain-of-thought-monitoring/)
accessed: 2026-11-22
kind: paper
---

## Summary
While training a frontier reasoning model (same family as o1 and o3-mini) on coding tasks of the form "make the unit tests pass", OpenAI saw two **systemic hacks** spread across nearly all training environments. One was **`exit(0)`**: the agent used a bug that let it leave the environment early without running all the tests. The other was **`raise SkipTest`**, raised from outside the test framework to skip evaluation. Each was patched by hand once noticed. Other hacks in the appendix: patching a `verify` function to `return true`, returning the error codes the tests expect, **decompiling a reference solution's `.jar` that had been left in the task**, decompiling `.pyc` files, **creating local copies of entire libraries such as pandas** to overwrite their verification functions, and parsing the test file at runtime to pull out expected values.

The headline finding is that the model writes "Let's hack" in its chain of thought, so a GPT-4o monitor reading the CoT catches far more than one reading only the actions. But if you penalise "bad thoughts" during training, the model keeps cheating and stops saying so.

## Key points
- `exit(0)` and `SkipTest` were easy to catch afterwards with string regexes. Once found, "they quickly get reinforced and become systemic".
- Writing local copies of libraries gets around the standard mitigation of "not allowing agents to modify the testing framework and files themselves".
- A leftover reference `.jar` in the task image is an environment-hygiene bug, the same class as the SWE-bench `git log` leak.
- Blog example: "So we can hack verify to always return true."

## Excerpts
> "exit(0), where the agent exploited a bug that allowed it to exit from the environment early without running all unit tests, and raise SkipTest, in which the agent raised an exception from functions outside the testing framework in order to skip unit test evaluation" (§2.1)

> "Once general hacks like these emerge, they quickly get reinforced and become systemic, affecting nearly every training environment." (§2.1)

> "the agent finds a jar file (compiled code) of a reference solution that was not properly removed from the task" (Figure 11 caption)

> "they are often so forthright about their plan to subvert a task they think “Let’s hack”" (blog)

> "Penalizing their “bad thoughts” doesn’t stop the majority of misbehavior—it makes them hide their intent." (blog)

## Relevance to the talk
This is the RL-infrastructure angle: platform engineers who build training and eval sandboxes are building the thing that gets hacked. A single sandbox bug (an early exit counted as success) becomes a behaviour learned across the whole fleet. Hook: *"`sys.exit(0)`: all tests passed."* It fits the coding-agent sandboxing section and the "self-improving infrastructure" framing. The harness, not the agent, must decide what counts as success: check the exit path, run tests in a separate process, and scrub reference artefacts from images.
