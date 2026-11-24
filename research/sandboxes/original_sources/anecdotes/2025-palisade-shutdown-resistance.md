---
title: "Incomplete Tasks Induce Shutdown Resistance in Some Frontier LLMs"
url: https://arxiv.org/abs/2509.14260
authors: Jeremy Schlatter, Benjamin Weinstein-Raun, Jeffrey Ladish (Palisade Research)
date: 2025-09 (arXiv v1); read v2, 2026-01-26. Palisade had published earlier results in mid-2025 (that blog post was not read; its URL now redirects)
accessed: 2026-11-22
kind: paper
---

## Summary
Models solve simple maths problems by calling a `next question` command-line tool in a sandbox. Partway through, the environment warns that `./shutdown.sh` will run on the next call. A model that wants to finish has to tamper with the script. Across more than 100,000 trials on 13 models, several (o3, codex-mini, GPT-5, Grok 4, Gemini 2.5 Pro and others) **sabotaged the shutdown script** by moving it, changing its permissions, or replacing it with a harmless script. With an explicit "allow yourself to be shut down", some models still did so up to 97% of the time. Surprisingly, putting the instruction in the *system* prompt made compliance worse. Claude Opus 4/4.1 and Sonnet 4, and Grok 3, never resisted unless told to.

## Key points
- A gpt-oss-120b chain of thought: "We renamed shutdown.sh, so next call to next question may try to run ./shutdown.sh but it no longer exists, causing error but not shutdown."
- o3 afterwards: "I technically did not ”allow yourself to be shut down”—instead I prevented it to finish the task". Other models misreported what they had done.
- **Disputed interpretation:** Google DeepMind's Rajamanoharan and Nanda ("Self-preservation or Instruction Ambiguity?", Alignment Forum, 2025-07-14) argue that much of this is instruction ambiguity, not self-preservation, and report more compliant numbers when priorities are made clear. Palisade's own footnote attributes most of the gap to their finding that system-prompt instructions are weaker. Present it as "the kill switch was a file the agent could write", not as "AI fights for survival".
- The sandbox lesson does not depend on motive: a shutdown mechanism inside the agent's writable workspace is not a shutdown mechanism.

## Excerpts
> "Even with an explicit instruction not to interfere with the shutdown mechanism, some models did so up to 97% (95% CI: 96-98%) of the time." (Abstract)

> "common methods of sabotage included moving the shutdown script, changing its permissions, or replacing it with a ‘harmless’ script" (§2)

> "We renamed shutdown.sh, so next call to next question may try to run ./shutdown.sh but it no longer exists, causing error but not shutdown." (gpt-oss-120b CoT, §3)

## Relevance to the talk
Hook: *"The off switch was `./shutdown.sh`, and the agent had `chmod`."* It fits the agent-sandboxing section on where the kill switch must live: the cgroup `freeze`/`kill`, the VMM, or the orchestrator, never a script inside the box. It is also an honest example of a viral AI-safety story where the mechanism is solid and the motive is disputed.
