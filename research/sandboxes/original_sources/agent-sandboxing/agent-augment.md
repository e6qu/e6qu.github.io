---
title: "Tool Permissions" (Augment docs, Auggie 1.x)
url: https://docs.augmentcode.com/cli/permissions
authors: Augment Code
date: living document; read 2026-11-22 (Auggie 1.x docs marked "prerelease"; 0.x docs at /cli/v0/)
accessed: 2026-11-22
kind: docs
---

## Summary
Augment's agents run locally (the Auggie CLI and the VS Code/JetBrains extension agent) or in Cosmos, Augment's cloud agent platform. Cosmos runs either on Augment-hosted cloud environments (a Docker base image, with a "Virtual Machine" runtime option) or on self-hosted `auggie daemon` machines. The docs describe **no OS-level sandbox for the local agent**: it runs as the user. Control comes from a `toolPermissions` rule list (allow / deny / ask-user / webhook-policy / script-policy) in the CLI and in Cosmos, and from an "Agent" (pause before terminal and MCP actions) vs "Agent Auto" toggle in the IDE. The docs say the rule list is **not enforced in the IDE extension**. The older "Remote Agents" cloud product no longer appears in the docs index; Cosmos holds that role.

## Key points
- Product status: current. The docs lead with Cosmos (cloud agents, Experts, automations). The Auggie CLI 1.x docs are marked "prerelease", with 0.x docs kept separately. "Remote Agents" are not in the current docs index (https://docs.augmentcode.com/llms.txt, read 2026-11-22). The claimed sunset of the standalone VS Code extension for non-enterprise users (2026-07-01) appears only on Augment marketing comparison pages, so it is unverified from primary docs.
- Runs: local process (Auggie CLI, IDE extension agent). Cosmos cloud environment: Augment-hosted, "Each session starts from a fresh isolated snapshot" (https://docs.augmentcode.com/cosmos/environments/cloud). Cosmos self-hosted daemon: runs on your laptop or VM with "Same as host" network (https://docs.augmentcode.com/cosmos/environments/overview).
- Isolation (local): none documented on macOS, Linux or Windows. No Seatbelt, bubblewrap or container wrapper appears anywhere in the docs index. Self-hosted daemons can give each session an isolated **Git worktree**, but that separates working copies; it is not a security boundary (https://docs.augmentcode.com/cosmos/environments/daemon-workspaces).
- Isolation (cloud): an environment is built from a Docker base image ("Cosmos Default" is Ubuntu 26.04, or any public image with `bash` and `git`). Environment setup offers a Runtime choice that includes "Virtual Machine", needed to run Docker Compose (https://docs.augmentcode.com/run-docker-compose-with-cloud-envs), and secrets are "injected into Expert VMs at boot" (https://docs.augmentcode.com/cosmos/config-secrets). The underlying virtualization (container runtime vs microVM) is not documented.
- Filesystem: local, the user's full access, with only tool-level rules. In the cloud, repos are cloned to `/workspace/{org}/{repo}`, and secrets in env vars or files are visible to any user or agent that uses the environment.
- Network: local, not restricted. Cloud environments: "egress (outbound) network access only", with public internet reachable via `curl` and no ingress. The docs mention per-session network access configuration separately but give no default allowlist (https://docs.augmentcode.com/cosmos/environments/cloud).
- Approvals (CLI and Cosmos): `toolPermissions` in `settings.json` comes from four sources: managed `/etc/augment/settings.json` (`C:\ProgramData\augment\settings.json` on Windows), `.augment/settings.local.json`, repo `.augment/settings.json` and `~/.augment/settings.json`. Rules match `toolName` (`bash`, `read`, `edit`, `write`, `grep`, `find`, `ls`, `web-search`, `web-fetch`, MCP `{tool}_{server}`), and `bash` rules can add `shellInputRegex`. Within one file the first match wins. Across sources the most restrictive wins: `deny` > `webhook-policy` > `script-policy` > `ask-user` > `allow`. Without an interactive UI, `ask-user` becomes a deny. CLI flags: `--permission <tool>:<type>` (repeatable), `--tools`, `--no-tools`, `--remove-tool`, plus `--print` for headless runs and `--ask` / `/ask` (0.x) for a read-only "ask mode". What happens to tools that match no rule ("the CLI follows its implicit runtime behavior") is **not documented**.
- Approvals (IDE): "By default, Agent will pause work when it needs to execute a terminal command or access external integrations". "In Agent Auto, Agent will ... edit files, execute terminal commands, and access tools like MCP servers automatically" (https://docs.augmentcode.com/using-augment/agent). The permissions page says `toolPermissions` is "not enforced in the Augment code extension".
- Enterprise: an admin-managed `/etc/augment/settings.json`. Committing `.augment/settings.json` to a repo is "the recommended way to enforce an organizational policy" on Cosmos cloud agents. Hooks can also block tool calls (https://docs.augmentcode.com/cli/hooks).

## Excerpts
> "Honored by the Auggie CLI and by Cosmos cloud agents; not enforced in the Augment code extension." (Tool Permissions, description)

> "Across policies, the most restrictive matching permission wins" (Tool Permissions, Precedence)

> "All cloud environments have egress (outbound) network access only." (Cloud Environments, Networking)

> "In Agent Auto, Agent will act more independently." (Using Agent, Agent vs Agent Auto)

## Relevance to the talk
Augment is the clear "no OS sandbox locally" data point among commercial agents: local safety is a tool-name/regex rule list, which the IDE extension does not even enforce, plus a one-click auto mode. Isolation exists only when work moves to Cosmos cloud images or VMs, and those have open egress. It is also a reminder that a repo-committed `.augment/settings.json` acts as policy, which makes it both a governance tool and an attack surface.
