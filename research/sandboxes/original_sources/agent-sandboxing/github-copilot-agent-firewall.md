---
title: "Customizing or disabling the firewall for Copilot cloud agent" (GitHub Docs)
url: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall
authors: GitHub
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
GitHub's Copilot cloud (coding) agent runs in a GitHub Actions runner or a cloud sandbox, and its internet access is limited by default by a firewall with a recommended allowlist (package registries, container registries, CAs, Playwright browser downloads, plus GitHub hosts Copilot itself needs). The docs are explicit that coverage is partial — MCP servers and setup steps are outside it — and that sophisticated attacks may bypass it.

## Key points
- Firewall on by default; recommended allowlist on by default; GitHub hosts always allowed.
- Covers processes started via the agent's Bash tool, and (in cloud sandboxes) the built-in Playwright MCP server and its browsers.
- Not covered: other MCP servers (including repo-configured replacements for Playwright); processes in configured Copilot setup steps.
- Custom allowlists: domains (incl. subdomains) or URLs (scheme+host+path); org- and repo-level rules combined; org owners can delegate to repos.

## Excerpts
> "By default, Copilot's access to the internet is limited by a firewall."

> "Sophisticated attacks may bypass the firewall, potentially allowing unauthorized network access and data exfiltration."

## Relevance to the talk
A CI-runner-based agent sandbox where the VM boundary is inherited from GitHub Actions and the new piece is again an egress allowlist — with the familiar holes (MCP servers, setup phase) and an honest disclaimer.
