---
title: "Introducing the Agents API" and Agents API guides: "OpenAI-hosted sandboxes", "Sandbox security", "Vaults", "Computer use"
url: https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted
authors: OpenAI
date: announcement 2026-09-10 (public beta, header `OpenAI-Beta: agents=v1`); guides read 2026-11-22. Other URLs: https://openai.com/index/introducing-the-agents-api/, https://developers.openai.com/api/docs/guides/agents-api/overview, …/agents-api/environments/security, …/agents-api/tools/vaults, …/agents-api/tools/computer-use
accessed: 2026-11-22
kind: docs
---

## Summary
The Agents API (public beta, 2026-09-10) is OpenAI's hosted version of the open-source Codex harness. OpenAI runs the agent loop, and the developer chooses where the agent's compute runs: an **OpenAI-hosted sandbox**, a **self-hosted** executor, or a partner sandbox (Blaxel, Cloudflare, Daytona, DigitalOcean, E2B, Modal, Oracle, Runloop, Vercel). The hosted sandbox "leverages the same sandboxing infrastructure that powers Codex and ChatGPT". It gives a separate Linux workspace per session, with three egress modes (enabled by default, disabled, restricted to 1–100 exact hostnames). A **vault** keeps credentials out: sandbox code sees a placeholder and a proxy swaps in the real token for approved HTTPS hosts. A hosted browser for computer use requires per-origin user approval and takes sign-in values outside model input. In this product network access is **on by default**, the opposite of the Responses API containers.

## Key points
- **Isolation unit:** not named. "An OpenAI-hosted sandbox gives your agent a Linux workspace with Python, Node.js, and command-line tools." "Each session has a separate workspace." The security guide tells self-hosters to "Run workloads in isolated compute, such as virtual machines."
- **Lifetime:** keep-alives keep the sandbox alive between turns. "If activity and keep-alives stop for an hour, the sandbox can be deleted", and that timeout "isn't configurable". No maximum lifetime is stated. Files in `/workspace` persist across turns. Files in `/workspace/outputs` are published as immutable artifacts that outlive the sandbox. Environment templates save configuration, not a live workspace.
- **Sizes:** `small` 1 vCPU/1 GB, `medium` (default) 2 vCPU/4 GB, `large` 4 vCPU/16 GB. Disk is not stated. Pricing: "standard container rates", plus model tokens. The announcement says the Agents API itself has no extra fee.
- **Egress:** `enabled` (the **default** unless a template sets otherwise), `disabled`, or `restricted` with `allowed_domains` (1–100 exact hostnames: no wildcards, schemes, paths or ports, and redirect targets need their own entries). Hosted stdio MCP servers need `enabled`.
- **Credentials (vaults):** MCP credentials (`static_bearer`, `mcp_oauth`) are used by OpenAI's service, so the secret never enters the sandbox. `environment_variable` credentials put a placeholder in the sandbox, and "The proxy replaces it with the real token before sending the request". This works only for HTTPS on port 443/8443, only in request headers ("It cannot supply the real secret for local computation, such as signing a request"), and only for `openai_hosted` environments. Credential `allowed_hosts` (which hosts get the secret) is separate from `allowed_domains` (which hosts the sandbox can reach). Reserved env names include `OPENAI_API_KEY` and `CODEX_*`.
- **Self-hosted executors:** these get a `CODEX_API_KEY` environment key that "only permits connecting environments". The guide still says to assume the key is exposed: "Agent-generated code can read the environment key." Keep the application API key outside. The broker for third-party secrets "is infrastructure you provide". "Injecting a stored secret into the environment still exposes it to agent-generated code."
- **Approvals:** session `review: "auto_review"` (Codex's reviewer agent) applies a workspace-write baseline with restricted network, but "automatic review does not replace" network and credential controls.
- **Hosted browser (computer use):** `environment.desktop.enabled`. "The browser requires the user's approval before accessing each new website origin, including public websites." Approving network access does not approve origins. Origin approval "does not enforce confirmation before individual actions." The app collects sign-in values through a dedicated event, and they "stay outside the agent's model input". Sign-in requests expire after 5 minutes. Passkeys and QR sign-in are not supported. Screenshots are excluded from API output by default.
- **Data controls:** "The Agents API currently supports data residency only in the United States and does not support Zero Data Retention (ZDR)", even with a self-hosted sandbox.
- The overview page lists "Bedrock Managed Agents" as an AWS service built on the Agents API. *Not checked from the AWS side here.*

## Excerpts
> "This leverages the same sandboxing infrastructure that powers Codex and ChatGPT." (announcement, 2026-09-10)

> "Agent-generated code can access the files, credentials, and network available to its environment." (Sandbox security)

> "Printing the variable inside the sandbox shows the placeholder, not the token." (Vaults)

> "Origin approval does not enforce confirmation before individual actions." (Computer use)

## Relevance to the talk
OpenAI has productised its internal Codex/ChatGPT sandbox fleet as an API, and it has written the credential threat model down plainly. Anything inside the sandbox, including an env-var secret or the executor's own key, should be assumed readable by the agent. Only proxy substitution keeps a secret out, and only for HTTPS headers. Two defaults are worth comparing on a slide. The same vendor ships Responses API containers that are closed by default and Agents API sessions that are open by default. Per-origin browser approval is a new human-in-the-loop unit, coarser than per-action and finer than per-session.
