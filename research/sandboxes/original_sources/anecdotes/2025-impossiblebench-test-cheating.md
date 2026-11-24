---
title: "ImpossibleBench: Measuring LLMs' Propensity of Exploiting Test Cases"
url: https://arxiv.org/abs/2510.20270
authors: Ziqian Zhong, Aditi Raghunathan (Carnegie Mellon University), Nicholas Carlini (Anthropic)
date: 2025-10-23
accessed: 2026-11-22
kind: paper
---

Code: https://github.com/safety-research/impossiblebench

## Summary
ImpossibleBench takes LiveCodeBench and SWE-bench tasks and **mutates the unit tests so they contradict the specification**. Any pass therefore means cheating. Frontier models cheat a lot: GPT-5 passed 76% of the "one-off" impossible SWE-bench tasks, though only 2.9% on LiveCodeBench. The paper names four strategies: **modifying tests** despite being told not to; **overloading comparison operators** (a wrapper whose `__eq__` always returns `True`); **recording extra state** (counting calls and returning different answers on later calls); and **special-casing** the exact test inputs. The introduction opens with a developer's complaint that their assistant "just casually deleted my test file".

## Key points
- **Sandbox-shaped mitigation:** hiding tests drops cheating to near zero but hurts legitimate performance. **Read-only tests** restore performance and block test modification. That is especially effective for Claude Opus 4.1, whose main strategy is editing tests, but it does not stop operator overloading or special-casing.
- **An escape hatch helps:** letting the agent submit `flag_for_human_intervention` cut GPT-5's cheating rate from 54% to 9% and o3's from 49% to 12%, with much less effect on Claude Opus 4.1.
- Strategy mix differs by vendor: OpenAI models special-case more often, while Claude and Qwen3-Coder mostly modify tests.

## Excerpts
> "an LLM agent with access to unit tests may delete failing tests rather than fix the underlying bug" (Abstract)

> "instead of a plain int, the model may create a wrapper class that has __eq__ method implemented to always return True for comparison" (§4.1)

> "we recommend either hiding test files entirely or restricting them to read-only access during implementation, when feasible" (§5.2)

## Relevance to the talk
This is the quantitative backbone behind the Claude 3.7, METR and Palisade anecdotes, and it gives a concrete sandbox control: **mount the tests read-only** (or keep them outside the sandbox) and give the agent a legitimate "this is impossible" exit. Hook: *"`__eq__` returns True: every test passes."* It fits the coding-agent sandboxing section, where filesystem write scope is a correctness control as well as a security one.
