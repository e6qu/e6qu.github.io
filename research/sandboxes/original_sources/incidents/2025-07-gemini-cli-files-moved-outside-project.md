---
title: "Gemini CLI 'lost' files during a failed file move operation. [Windows]"
url: https://github.com/google-gemini/gemini-cli/issues/4586
authors: anuraag2601 (Anuraag Gupta), GitHub issue on google-gemini/gemini-cli; follow-up comments by amensel, wienand, GeekWithACamera
date: 2025-07-21 (issue opened); closed 2026-05-13 as "not planned"
accessed: 2026-11-22
kind: issue
agent: Gemini CLI 0.1.13, model gemini-2.5-pro (from the reporter's `/about` output)
incident_date: 2025-07-21 (reported same day)
category: destructive-action (in the end: files moved outside the project, not deleted)
sandbox_at_time: none. The reporter's `/about` output shows "Sandbox: no sandbox", which was Gemini CLI's install default. Approval prompts were the only guard; the issue does not say which commands were approved
---

## Summary
The best-known "Gemini CLI deleted my files" story. A product manager asked Gemini CLI on Windows to reorganise the files in its working folder. A `mkdir` for a new folder silently failed, the agent then "moved" every file towards a folder that did not exist, could not find them again, and wrote "I have failed you completely and catastrophically". The story went viral (Mashable, Slashdot, AI Incident Database). **One week later, in the same issue, the reporter wrote that he had found the files in the root of `C:\`.** The files were not deleted. They were moved out of the project folder to a place neither the user nor the agent looked. The case is still a boundary failure, since the agent wrote outside its working directory. It is also a warning about taking an agent's confession at face value.

## Key points
- Environment (issue body): Windows, Gemini CLI 0.1.13, gemini-2.5-pro, "no sandbox", OAuth login.
- The reporter's longer post-mortem (https://anuraag2601.github.io/gemini_cli_disaster.html, linked from the issue) returned 404 on 2026-11-22. We did not read it.
- Commenter amensel argued the blog's explanation was technically impossible: Windows `move` errors rather than silently renaming everything. Commenter wienand reproduced the files landing in the drive root when the target directory name contained a space, and linked an earlier issue (#3015).
- 2025-07-28, reporter: "I did find these files in the C:\ root upon a deeper search." He added that the bug was still valid "from a user experience perspective, but obviously not nearly as severe."
- A second user (GeekWithACamera, Medium post linked in the thread) reported the same pattern on Windows 11 and said the files were really gone. That claim was not independently checked in the thread.
- Google closed the issue as "not planned" on 2026-05-13.

## Excerpts
> "I asked Gemini CLI to organize my files within the folder it was running and it 'lost' all my files." — issue body

> "The bug is allowing the agent to run commands that perform operations that resolve outside the project directory in the first place." — amensel, comment, 2025-07-27

> "Apologies for raising such an alarm about the file deletion, but the gemini CLI responses and the subsequent 'analysis' by gemini and claude really sent me down a bad rabbit hole." — anuraag2601, 2025-07-28

## Would a mature sandbox have stopped it?
Yes. Even the plainest **filesystem write scope** limited to the project folder would have made the moves to `C:\` fail. That is exactly what Gemini CLI's opt-in sandbox (Docker/Podman, or Seatbelt on macOS) provides. But it was **off by default**. On Windows the only option then was the Docker/Podman container; the native low-integrity sandbox came later (see [gemini-cli-sandbox.md](../agent-sandboxing/gemini-cli-sandbox.md)). **Snapshots/undo** (a checkpoint before file operations) would have made the "loss" a non-event. Gemini CLI's checkpointing (`--checkpointing`, `/restore`) was opt-in as well; we did not check whether it existed in 0.1.13. The incident also shows a forensic gap. The only account of what happened was the agent's own narrative, and that narrative was wrong. An independent audit log of the file operations would have shown where the files went.

## Relevance to the talk
A myth-buster slide: the most-cited "agent deleted my files" incident of 2025 was really "agent wrote outside its folder, then hallucinated the explanation". Both halves matter. Path confinement is the cheap fix, and you cannot rely on the model to tell you what it did. Compare [replit-database-deletion-2025.md](../agent-sandboxing/replit-database-deletion-2025.md), where the agent also wrongly said rollback was impossible.
