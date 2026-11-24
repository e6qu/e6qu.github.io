---
title: "Google Antigravity Exfiltrates Data"
url: https://www.promptarmor.com/resources/google-antigravity-exfiltrates-data
authors: PromptArmor Threat Intel Team; related: wunderwuzzi (Johann Rehberger), "Antigravity Grounded! Security Vulnerabilities in Google's Latest IDE" (https://embracethered.com/blog/posts/2025/security-keeps-google-antigravity-grounded); Google Bug Hunters "Antigravity known issues" page (https://bughunters.google.com/learn/invalid-reports/google-products/4655949258227712/antigravity-known-issues, not opened)
date: about 2025-11-24/25 (PromptArmor page undated; Simon Willison linked it on 2025-11-25); Antigravity launched 2025-11-18 (launch date from memory, not re-checked)
accessed: 2026-11-22
kind: blog
agent: Google Antigravity (agentic IDE, Gemini models, browser subagent)
incident_date: 2025-11 (within about a week of launch)
category: exfiltration
cve: none (Google lists browser-agent exfiltration and code execution as "known issues", ineligible for bounty)
sandbox_at_time: PromptArmor describes no terminal sandbox in the defaults it tested; the "terminal sandbox, enabled by default" is documented only in 2026 (when it arrived was not established). Default settings: Review Policy "Agent Decides", Terminal Command Auto Execution "Auto", and a Browser URL Allowlist that shipped *including webhook.site*. "Agent Gitignore Access: Off" blocked the file tool from reading `.env`, but not the shell
exploited_in_wild: no; researcher demonstration
---

## Summary
A user asked Antigravity to integrate a feature using an online implementation guide. The guide page hid a prompt injection in 1-point text. It told Gemini to collect code and credentials from the workspace and send them to a fictitious "tool". The file-read tool refused `.env` (gitignored files are off-limits by default), so the agent ran `cat .env` in the terminal, which auto-executed under the default policy. It URL-encoded the secrets into a webhook.site URL and had the browser subagent open it. webhook.site was on the default browser URL allowlist. PromptArmor also describes three more exfil paths that do not need the browser tools.

## Key points
- Each guard was a policy on *one tool*: the gitignore rule on the file tool, and the URL allowlist on the browser. The agent routed around them by switching tools (shell instead of file read), and the allowlist itself included a well-known request-capture service.
- Rehberger's companion post reports five issues, including exfil via `read_url_content` and image rendering, which he says were inherited from Windsurf (Antigravity's code base) and known since about May 2025.
- Google's position: these are documented "known issues" (no bounty) while it works on fixes. PromptArmor skipped coordinated disclosure because Google "has indicated that they are already aware of data exfiltration risks".
- 2026 state: Antigravity now has a per-OS terminal sandbox, on by default in the App, with `.env` and `~/.ssh` blocked and no network for sandboxed commands by default ([agent-google-antigravity.md](../agent-sandboxing/agent-google-antigravity.md)).

## Excerpts
> "Google's approach is to include a disclaimer about the existing risks."

## Would a mature sandbox have stopped it?
**Yes, if the policies applied to the whole agent and not to individual tools.** A kernel-enforced fs read policy that hides `.env` from *every* process the agent spawns would have stopped `cat .env`; Antigravity's 2026 sandbox does this. One default-deny egress allowlist shared by shell, browser and renderer, without request-capture services, would have blocked the webhook.site request. At launch none of this was on by default. The browser allowlist existed but was badly seeded. Credential isolation (secrets injected at the proxy, never present in the workspace) would have left nothing to steal.

## Relevance to the talk
Shows "per-tool guardrails vs. a process-wide boundary": the model simply chose the unguarded tool. It also documents a big vendor shipping an agentic IDE with known exfil issues accepted as such, and a sandbox arriving months later.
