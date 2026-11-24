---
title: "Cloud environments" (Codex, current) and "Cloud environment" (Codex Cloud (Legacy)); plus Codex cloud branch-name token-theft report
url: https://learn.chatgpt.com/docs/environments/cloud-environments
authors: OpenAI (docs); BeyondTrust Phantom Labs (vulnerability report, via SiliconANGLE)
date: living documents read 2026-11-22; legacy page at https://learn.chatgpt.com/docs/environments/cloud-environment (old URL developers.openai.com/codex/cloud/environments 308-redirects there); SiliconANGLE report 2026-03-30
accessed: 2026-11-22
kind: docs
---

## Summary
This note adds to `../agent-sandboxing/openai-codex-cloud-internet-access.md`, which already covers the two-phase design (online setup, offline agent phase), allowlist presets, the GET-only option, per-plan VM sizes, 7-day state and proxy-substituted "network secrets". New here: the two documentation generations disagree on the isolation unit. The **legacy** page (still used for Code Review and the Linear/GitHub integrations) says Codex "creates a container". The **current** page says each task "runs in a VM". The legacy design also had setup-only secrets that are removed before the agent phase, a 12-hour container-state cache that Business/Enterprise users share, and the `universal` image. A March 2026 report showed that the GitHub OAuth token used to clone the repo was reachable inside the task container through a shell injection in the branch name.

## Key points
- **Isolation unit, two versions.** Legacy: "Codex creates a container and checks out your repo at the selected branch or commit SHA." Current: "Each cloud task runs in a VM with these default resources" (2 vCPU/8 GiB/8 GiB disk on Plus; 4 vCPU/16 GiB/32 GiB on Pro/Business/Enterprise/Edu; custom sizes for Enterprise on request). Neither page names the hypervisor or container runtime. The current Codex security page still says cloud tasks run "in isolated OpenAI-managed containers". *That the move was from container to VM is our reading of the two pages, not an OpenAI statement.*
- **Image:** the default image is `universal`, with common languages preinstalled. The reference Dockerfile is the public `openai/codex-universal` repo. Setup scripts add packages on top.
- **Setup vs agent phase** (legacy): the setup script runs with internet access in a separate Bash session, so `export`s do not carry into the agent phase. Agent-phase internet is off by default. An optional *maintenance script* runs when a cached container is resumed.
- **Secrets, legacy model:** secrets are "only available to setup scripts. For security reasons, secrets are removed before the agent phase starts". They are stored with extra encryption and decrypted only for task execution. Plain environment variables persist through both phases.
- **Secrets, current model:** environment variables are "passed directly to programs" (the value "is visible to the task"). **Network secrets** give programs a placeholder, and the egress proxy substitutes the real value only for allowed destinations, HTTPS on port 443, in setup and task phases alike. This "doesn't put the raw credential in a local process or file." A personal vault holds per-user values.
- **Caching:** legacy: "Codex caches container state for up to 12 hours". Changing the setup or maintenance script, env vars or secrets invalidates it, and a manual "Reset cache" exists. **For Business and Enterprise, caches are shared across users with access to the environment.** Current: repository refreshes run in the background "preserving dependency caches", new tasks start from the environment's prepared filesystem, and task VM state is recoverable for up to 7 days.
- **GitHub credentials:** neither page documents how the repo token is handled. The **BeyondTrust Phantom Labs** report (SiliconANGLE, 2026-03-30) says tasks "clone repositories and authenticate with short-lived GitHub OAuth tokens". A crafted branch name injected shell commands into environment setup inside the task container, which let an attacker extract that token and send it out through task output or the network. The report says the same technique also reached GitHub App installation tokens via code-review tasks triggered by PR comments. According to the report, OpenAI's fixes included input validation, shell escaping, "tighter controls on token exposure within container environments" and limits on token scope and lifetime. *The primary BeyondTrust post returned HTTP 403, so details are from secondary coverage.*
- Regions and pricing: not stated (Enterprise: "Contact your OpenAI account team").

## Excerpts
> "For security reasons, secrets are removed before the agent phase starts." (legacy Cloud environment page)

> "Programs receive a placeholder; the proxy substitutes the real value for allowed destinations." (current Cloud environments page)

> "Codex caches container state for up to 12 hours to speed up new chats and follow-ups." (legacy page)

## Relevance to the talk
This shows how the hosted-agent credential story changed in a year. First, secrets were available only in the setup phase and deleted before the agent ran. Next, secrets never entered the sandbox at all and were substituted at the egress proxy. The one credential the platform itself needs, the git token for clone and push, was the one that leaked, through a classic shell-injection path that runs before the model does anything. Business-tier cache sharing across users is a reminder that "per-task VM" does not mean "per-task state".
