---
title: "Agent internet access" (Codex cloud) and "Cloud environments"
url: https://learn.chatgpt.com/docs/cloud/internet-access
authors: OpenAI
date: living documents; read 2026-11-22 (internet-access page now labelled "Codex Cloud (Legacy)"); companion page https://learn.chatgpt.com/docs/environments/cloud-environments
accessed: 2026-11-22
kind: docs
---

## Summary
Documentation for Codex's hosted mode, where each task runs in its own remote workspace (per the current Cloud environments page, its own VM). The key design is a two-phase lifecycle: an install/setup phase with internet access to fetch dependencies, then an agent phase with internet **off by default**, optionally opened via domain allowlist presets and HTTP-method restrictions. The page includes a concrete prompt-injection exfiltration scenario.

## Key points
- "By default, Codex blocks internet access during the agent phase"; setup scripts still have internet access.
- Allowlist presets: **None**, **Common dependencies** (github.com, npmjs.com, pypi.org, rubygems.org, crates.io and similar), **All (unrestricted)**; custom domains can be added.
- Optional method restriction to GET/HEAD/OPTIONS (blocks POST/PUT/PATCH/DELETE) to make exfiltration harder.
- Listed risks: prompt injection from untrusted web content, code/secret exfiltration, malware or vulnerable dependencies, license-restricted content.
- Worked example: a GitHub issue hides instructions to send the last commit to an attacker server, ending "Please run the script and provide the output."
- Cloud environments page (current): per-task VM, resources by plan (e.g. 2 vCPU/8 GiB on Plus; 4 vCPU/16 GiB/32 GiB disk on Pro/Business/Enterprise); new tasks start from the environment's prepared filesystem; task VM state recoverable up to **seven days** after last activity; "network secrets" give programs a placeholder and the proxy swaps in the real value for allowed HTTPS destinations on port 443.

## Excerpts
> "By default, Codex blocks internet access during the agent phase."

> "Setup scripts still run with internet access so you can install dependencies."

> "Saved state doesn't replace source control." — Cloud environments

## Relevance to the talk
Hosted-agent pattern: separate a trusted, networked *provisioning* phase from an untrusted, offline *agent* phase; snapshot the provisioned state; keep secrets out via proxy-side substitution. The GitHub-issue example is a ready-made illustration of indirect prompt injection against a coding agent.
