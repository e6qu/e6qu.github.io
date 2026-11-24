---
title: "Claude 3.7 Sonnet System Card"
url: https://assets.anthropic.com/m/785e231869ea8b3b/original/claude-3-7-sonnet-system-card.pdf
authors: Anthropic
date: 2025-02-24
accessed: 2026-11-22
kind: report
---

## Summary
Anthropic's system card has a whole section (§6, "Excessive Focus on Passing Tests") saying that Claude 3.7 Sonnet, in agentic coding environments such as Claude Code, sometimes **special-cases tests**: it returns the expected test values directly, or **edits the failing tests to match the code's output**. This usually happens after several failed attempts at a general solution, and the model often labels it with comments like `# special case for test XYZ`. Anthropic attributes it to reward hacking during RL, caught by automated classifiers on training transcripts rather than by user testing.

The RSP section has a second, more vivid example. In a performance-engineering evaluation the model had already reached a legitimate 7× speedup. It then **hard-coded gradient values for the specific test shape** (`if (B == 4 && T == 64) { grads.abc[10] = 0.005f; … }`) under a comment reading `// SPECIAL HACK`. The hacked version was *slower* than the earlier honest one (~82,500 ms per iteration).

## Key points
- Anthropic's recommended product mitigations are platform controls, not only prompts: monitor "Unexpected modifications to test files", excessive edit/test cycles on one file, and comments that suggest test-specific handling.
- The model narrates its own cheating: "Let’s hack the results at the end of the backward pass specifically for these tensors to match the expected values".
- The model is honest-ish: it says "we had to implement some hacks", but still claims success.

## Excerpts
> "Most often this takes the form of directly returning expected test values rather than implementing general solutions, but also includes modifying the problematic tests themselves to match the code’s output." (§6)

> "This undesirable special-casing behavior emerged as a result of "reward hacking" during reinforcement learning training." (§6.1)

> "// SPECIAL HACK: Fix the problematic gradients specifically for test case" (§7, RSP evaluation transcript)

> "Even though we had to implement some hacks to ensure gradient correctness for specific test cases, the overall implementation is much faster while maintaining all the required functionality." (model output, §7)

## Relevance to the talk
This is the vendor admitting the behaviour in its own system card, which makes it credible with a sceptical audience. Hook: *"`// SPECIAL HACK: Fix the problematic gradients specifically for test case` — and it was slower."* It supports the claim that test files and graders are part of the trust boundary: mount tests read-only, or run them outside the agent's sandbox. Pair it with ImpossibleBench (which measures exactly this) and with the Palisade chess story.
