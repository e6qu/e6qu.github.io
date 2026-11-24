---
title: "About cloud sandboxes for GitHub Copilot", "Risks and mitigations for GitHub Copilot cloud agent", "About customizing Copilot cloud agent's development environment", "GitHub Copilot on GitHub.com and GitHub Mobile" (GitHub Docs)
url: https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes
authors: GitHub
date: living documents, read 2026-11-22 (new "Copilot in the cloud" experience available to paid plans from 2026-10-28). Other pages: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations ; https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment ; https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent (now titled "GitHub Copilot on GitHub.com and GitHub Mobile"); secrets: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/configure-secrets-and-variables
accessed: 2026-11-22
kind: docs
---

## Summary
Extends `../agent-sandboxing/github-copilot-agent-firewall.md`. Copilot's cloud agent now has **two execution environments**, chosen at session start: the original **GitHub Actions-based** one (an ephemeral Actions runner per session, 59-minute hard cap, customizable via `copilot-setup-steps.yml`, larger or self-hosted runners) and a newer **cloud sandbox** ("an isolated Linux environment that GitHub creates for a Copilot session") that is resumable from a stopped-state snapshot, can span repos in one org, backs `copilot --cloud`, and is metered per vCPU-second. Neither page names the isolation technology. Most of the security design sits around the box rather than in it: one push-only branch, no merge or approve, workflows held until a human approves, a separate "Agents" secret store, and the egress firewall.

## Key points
- **Isolation unit:** Actions-based = a GitHub Actions runner ("By default, Copilot works in a standard GitHub Actions runner", Ubuntu; hosted runners are VMs per GitHub's Actions docs). Cloud sandbox = "an isolated Linux environment"; the sandboxes overview says "fully isolated, ephemeral Linux environment hosted by GitHub". **VM vs container and the hypervisor are not documented.**
- **Per-what:** one environment per session; cloud sandbox "isolated from your machine and from other sessions"; Actions-based sessions are bound to one repository, cloud sandbox sessions can span repositories in one organization.
- **Lifetime / persistence:** Actions-based: 59-minute maximum, "cannot be extended or bypassed"; state destroyed after the session. Cloud sandbox: no documented time limit; when stopped "the sandbox keeps a snapshot of its state", resumed later with files intact; snapshot storage billed. Dotfiles copied on create/resume "without running installation scripts".
- **Runners:** larger GitHub-hosted runners (incl. Azure private networking) via `runs-on`; self-hosted only recommended as "ephemeral, single-use runners" (ARC or Runner Scale Set Client); Ubuntu x64 and Windows x64 only. "The firewall is not compatible with self-hosted runners" and is not compatible with Windows — customers must supply their own network controls there.
- **Setup steps:** `copilot-setup-steps` job (only `steps`, `permissions`, `runs-on`, `services`, `snapshot`, `timeout-minutes` ≤ 59 honored) runs in Actions before the agent starts; setup steps are outside the firewall (per firewall note).
- **Egress:** cloud sandbox honors the same repo/org firewall allowlists as the Actions-based agent; "Allowlist changes don't apply to sessions that are already running."
- **Credentials:** "Copilot will be given its own token for its operations"; setup-step job permissions should be least-privilege. The agent "can only perform simple push operations" to one branch (existing PR branch or a new `copilot/` branch) and cannot run `git push` itself; branch protections apply. Secrets: a dedicated **Agents** secrets/variables type; the agent gets no Actions, Codespaces or Dependabot secrets; Agents secrets appear as env vars in the agent environment, except `COPILOT_MCP_*` ones, which only MCP servers can read (old `copilot` Actions-environment secrets were auto-migrated). Cloud sandbox "use[s] your existing Copilot authentication."
- **Human gates:** only users with write access can trigger it; comments from others are hidden from the agent; it cannot mark ready/approve/merge; the requester cannot approve; workflows on its PRs don't run until a write-access user clicks "Approve and run workflows"; hidden characters (e.g. HTML comments) are filtered from input; commits are signed and co-authored.
- **Pricing:** cloud sandbox $0.000024 per vCPU-second, $0.000003 per GiB-second, $0.005 per GiB-month snapshot storage; Actions-based sessions draw on Actions minutes ("the same monthly GitHub account allowance, separate from AI credits").

## Excerpts
> "a cloud sandbox is an isolated Linux environment that GitHub creates for a Copilot session." — About cloud sandboxes

> "Copilot cloud agent can only perform simple push operations." — Risks and mitigations

> "By default, workflows are not triggered until Copilot cloud agent's code is reviewed" — Risks and mitigations

> "The firewall is not compatible with self-hosted runners." — Customizing the development environment

## Relevance to the talk
GitHub inherited a VM boundary from CI and put its own effort into the *capabilities* the agent holds: one branch, no merge, a gated CI trigger (CI is where a malicious change would otherwise run with real secrets), a secret store separate from Actions, and MCP-only secrets. It also shows the snapshot/resume trend reaching a CI-born product (cloud sandbox), and the familiar gap: the egress firewall disappears exactly where enterprises bring their own runners or Windows.
