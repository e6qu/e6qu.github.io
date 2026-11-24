---
title: "ChatGPT Agent System Card" (2025-07-17), "ChatGPT agent" help article, and "ChatGPT Work cloud security" (successor)
url: https://cdn.openai.com/pdf/839e66fc-602c-48bf-81d3-b21eacc3459d/chatgpt_agent_system_card.pdf
authors: OpenAI
date: system card 2025-07-17; help article and ChatGPT Work docs read 2026-11-22 (ChatGPT Work announced 2026-07-09 per Simon Willison's 2026-08-30 post). Other URLs: https://help.openai.com/en/articles/11752874-chatgpt-agent, https://learn.chatgpt.com/docs/enterprise/chatgpt-work-cloud-security, https://simonwillison.net/2026/Aug/30/understanding-chatgpt-work/
accessed: 2026-11-22
kind: report
---

## Summary
ChatGPT agent (July 2025) combined Operator's remote visual browser, deep research's text browser, a terminal with "limited network access", and Connectors, all running on an OpenAI-hosted "virtual computer". Its system card leans almost entirely on model and product mitigations rather than sandbox mechanics. For prompt injection it lists safety training, monitors, user confirmations, watch mode, GET-only terminal networking and disabled memory. The help centre now says ChatGPT agent "is no longer available" and points users to **ChatGPT Work**. Work's cloud mode runs the Codex harness in "VM-backed sandboxes" on shared OpenAI infrastructure, with admin switches for network and browser use.

## Key points
- **System card (2025-07-17), terminal network:** "terminal network requests will have additional restrictions, including being limited to GET requests to download images or certain datasets (such as commonly used official government datasets)". This was "at launch", with "We may revisit this in the future."
- **Memory disabled** "To mitigate the risk of prompt injections attempting to exfiltrate data from memory".
- **Watch mode:** when the visual browser is in a sensitive context (e.g. logged into email or banking), watch mode applies for the rest of the trajectory and pauses execution if the user goes inactive or navigates away.
- **Model-level prompt-injection numbers** (model only, "not our full end-to-end stack"): ignored irrelevant instructions in the visual browser 95%. Resisted in-context exfiltration 78%. Resisted active exfiltration (agent must fetch the secret) **67%**. Confirmation recall 91%; critical confirmations (permissions, high-stakes messages, financial transactions) 99.9–100%.
- **The system card does not describe the virtual computer's isolation** (VM vs container, per-task or per-user). It defers to "Product-Specific Risk Mitigations" only.
- **Help article (current):** status "no longer available", use ChatGPT Work. Operator was folded into agent mode. Takeover: when a login is needed the agent "will pause and prompt you to take control of the virtual browser"; screenshots are not captured during takeover. "Cookies persist across sessions". Workspace owners can block domains (incl. subdomains) "across both the virtual browser and apps". On Enterprise, agent mode cannot read synced-app data (e.g. Google Drive sync).
- **ChatGPT Work cloud (successor):** tasks run on the Codex task-execution harness in "VM-backed sandboxes" on shared OpenAI infrastructure. "This doesn't mean every task receives a new container or that each customer has a dedicated physical host." State is tied to the authenticated user, and environments can be reused across tasks or replaced while keeping eligible state. Snapshots follow their own retention lifecycle, and some are covered by Enterprise Key Management. The environment does not inherit the user's local files, browser session or corporate-network access.
- **Work egress:** shell/code internet access has its own policy. When it is off, a managed destination allowlist keeps required destinations reachable. Admin toggles are "Allow network access" and "Use a browser" under *Let agents use cloud computers*. The docs state no default. Willison observed "the default appears to be open to all", with an admin domain allowlist available. *His observation, not an OpenAI statement.*
- **Work credentials:** connected apps act with the authorising account's permissions (individual, shared or agent-owned; shared ones "can reach more than the requesting person can"). Per-app action levels (read-only/all/custom) and ask policies apply. The cloud browser has a separate profile and a hosted sign-in flow. Willison: sign-in happens "without round-tripping those credentials through the model itself". A "Use password manager" permission exists.
- Regions: agent mode is available in supported countries, with EU data residency for Enterprise. Work's `enforce_residency` disables local-computer access.

## Excerpts
> "In addition to using monitors and filters, at launch, terminal network requests will have additional restrictions, including being limited to GET requests" (System card §3.1.2.5)

> "To mitigate the risk of prompt injections attempting to exfiltrate data from memory, at launch we will disable memory." (System card §3.1.2.6)

> "This doesn't mean every task receives a new container or that each customer has a dedicated physical host." (ChatGPT Work cloud security)

## Relevance to the talk
This is a consumer agent whose published safety case is mostly *not* a sandbox. The controls are a GET-only network, memory switched off, monitors, confirmations and a human watching. The system card's own number is useful: the model alone resisted only 67% of active exfiltration attempts, which is why the network restriction carries the weight. The successor product moved to VM-backed Codex sandboxes and admin-controlled egress. Its documentation is careful to say a VM boundary per task or per customer is *not* promised.
