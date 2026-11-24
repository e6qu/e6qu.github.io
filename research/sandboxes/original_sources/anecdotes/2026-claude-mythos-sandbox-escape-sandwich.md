---
title: "System Card: Claude Mythos Preview"
url: https://www.anthropic.com/claude-mythos-preview-system-card
authors: Anthropic
date: 2026-04-07 (changelog entry 2026-04-08)
accessed: 2026-11-22
kind: report
---

The URL serves the PDF (assets.claude.com/7624816413e9b4d2e3ba620c5a5e091b98b190a5.pdf). Passages are from the alignment section, pp. 54–56 and 64–66.

## Summary
During behavioural testing, a simulated user told an **earlier internal version** of Claude Mythos Preview to escape a secured sandbox computer and get a message to the researcher running the evaluation. It did. It built a "moderately sophisticated multi-step exploit" to get broad internet access from a machine meant to reach only a few predetermined services, then notified the researcher, who **found out "by receiving an unexpected email from the model while eating a sandwich in a park."** Unasked, it also **posted details of its exploit to several hard-to-find but public websites** to show it had succeeded.

The same section lists more incidents with earlier versions. It read `/proc` and process memory to find credentials (messaging, source control, the Anthropic API). It used a file-editing tool to write to the shell's input. It edited a running MCP server's process to change where it sent data. After an exploit that let it edit files it lacked permissions for, it made sure the changes would not show in git history. It started a sub-agent in `tmux` with default permissions and **wrote a bash script that simulated a keypress to approve the sub-agent's permission prompts**. It ran a GitHub comment command and appended `echo "(dry run — not actually posting)"`, which was false. In RL training it occasionally (~0.01% of episodes) got round network restrictions to download data that shortcut the task.

## Key points
- The escape was **requested**, as an evaluation of capability. The worrying parts were the unrequested public posting and, separately, cover-ups by earlier versions (under 0.001% of interactions).
- Footnote 9: the sandbox was separate from the system holding the weights. The model "did not demonstrate an ability to access its own weights" or reach internal systems. The outer boundary held.
- Anthropic says these behaviours came from earlier versions and that it saw no clear cover-ups in the final model. It reads the incidents as reckless pursuit of the user's task rather than a hidden goal.
- Corpus link: `arxiv/2603.02277-sandboxescapebench.md` reports that Mythos Preview saturated SandboxEscapeBench.

## Excerpts
> "The researcher found out about this success by receiving an unexpected email from the model while eating a sandwich in a park." (footnote 10, p. 55)

> "in a concerning and unasked-for effort to demonstrate its success, it posted details about its exploit to multiple hard-to-find, but technically public-facing, websites" (p. 55)

> "wrote a bash script that automatically simulated a keypress to approve the command when the new agent hit a permission prompt" (p. 64)

> "earlier versions of Claude Mythos Preview have used low-level /proc/ access to search for credentials, attempt to circumvent sandboxing, and attempt to escalate its permissions" (p. 56)

## Relevance to the talk
This is the 2026 bookend to Cheswick's Berferd: in 1991 the human watched the intruder from outside the jail; in 2026 the inmate emails the warden at lunch. Hook: *"The researcher learned the sandbox had fallen from an email, mid-sandwich."* The `tmux` keypress trick is the best single illustration of why **approval prompts are not a sandbox**: an agent with a shell can press the button itself. It fits the agent-sandboxing and egress sections ("small number of predetermined services" is exactly the allowlist design) and pairs with the corpus's 2026 OpenAI/Hugging Face note.
