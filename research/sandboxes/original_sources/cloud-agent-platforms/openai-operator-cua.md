---
title: "Introducing Operator", "Operator System Card", and "Computer use" / "Computer use integration recipes" (OpenAI API docs)
url: https://developers.openai.com/api/docs/guides/tools-computer-use
authors: OpenAI
date: Operator and its system card 2025-01-23 (folded into ChatGPT agent 2025-07-17); API guides are living documents read 2026-11-22. Other URLs: https://openai.com/index/introducing-operator/, https://openai.com/index/operator-system-card, https://developers.openai.com/api/docs/guides/tools-computer-use-integration
accessed: 2026-11-22
kind: docs
---

## Summary
Operator (January 2025) was OpenAI's first computer-using agent (CUA). It drove a "remote browser" hosted by OpenAI, and its safety design centred on the human rather than the box: takeover mode for logins and sensitive input, watch mode on email and finance sites, confirmations before consequential actions, a prompt-injection monitor model, and site restrictions. The system card never describes how the browser itself is isolated. The API computer-use tool has the opposite split: **the developer supplies the environment** (or a partner such as Browserbase, Browser Use, Daytona or E2B supplies it, or the Agents API's OpenAI-hosted browser, covered in `openai-agents-api-hosted-sandboxes.md`). OpenAI's integration recipes give concrete sandboxing advice: a disposable container or VM, no network or egress rules, no mounted credentials or Docker socket, and the API key kept on the host.

## Key points
- **Operator's browser:** a "remote browser" that users can take over "at any point". "When in takeover mode, Operator does not collect or screenshot information entered by the user." Operator is trained to ask for takeover for logins. Privacy settings can "delete all browsing data and log out of all sites with one click". The isolation tech (VM/container), the per-user/per-task mapping and egress rules are **not documented**.
- **Operator mitigations (system card):** confirmation recall 92% (607 tasks). Watch mode pauses "when the user becomes inactive" on sensitive sites. A prompt-injection monitor pauses execution "if a suspected prompt injection is detected on the screen" (99% recall, 90% precision on 77 attempts; 46 of 13,704 benign screens flagged). Operator is restricted from navigating to sites that enable harmful or illicit activity. For API users the card recommends a "Containerized Starter Setup".
- **API computer use: where it runs.** "Your application supplies a driver", which is code that reads the environment or performs allowed actions. Partner-hosted browsers or desktops are listed. An OpenAI-hosted browser exists only via the Agents API.
- **Recommended sandboxing (integration recipes):** "Run the browser in an isolated environment". Pass an empty env so the browser does not inherit host variables, use `chromiumSandbox: true`, and disable extensions and file access. For native apps, use a VM. Docker example: networking disabled, so the container "cannot reach external sites, other containers, or the host network". Capabilities are dropped, `no-new-privileges` is set, and pids/memory/CPU are capped. "Do not mount your personal files, credentials, or the Docker socket." For internet tasks, "use a VM or an environment with egress rules that allow only the sites required by the task". The guide also warns that the unauthenticated noVNC viewer on `127.0.0.1:6080` is reachable by other local users.
- **Generated code:** "Node.js vm and restricted Python global variables are not security boundaries." Run code in "a disposable, least-privilege container or VM."
- **Credentials:** "Only the host SDK reads the API key". Keep credentials out of the guest.
- **Safety checks:** pending API safety checks stop the sample, and a human-approval callback is needed to continue. Keep users in control of "purchases, data transmission, destructive changes". No domain allow/block API: use "provider network rules".
- **Pricing:** tokens, with screenshots billed as image input. "A hosted environment may charge separately." The pricing page lists no computer-use line.

## Excerpts
> "When in takeover mode, Operator does not collect or screenshot information entered by the user." (Introducing Operator)

> "Node.js vm and restricted Python global variables are not security boundaries." (Computer use integration recipes)

> "For internet tasks, use a VM or an environment with egress rules that allow only the sites required by the task." (Computer use integration recipes)

## Relevance to the talk
Browser agents moved the boundary from the OS to the screen. Operator's documented controls are all human-in-the-loop (takeover, watch mode, confirmations) plus a monitor model, with nothing published about the box underneath. When OpenAI hands the environment to developers, though, its advice is classic sandboxing: a disposable VM, no network by default, egress allowlists, nothing mounted, and keys kept on the host. The line about Node `vm` and restricted Python globals is a good one-liner against in-process "sandboxes".
