---
title: "The lethal trifecta for AI agents: private data, untrusted content, and external communication"
url: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
authors: Simon Willison
date: 2025-06-16
accessed: 2026-11-22
kind: blog
---

## Summary
Willison's now-standard threat model for tool-using LLM agents: data theft becomes possible whenever one system combines (1) access to private data, (2) exposure to untrusted content, and (3) the ability to communicate externally. Because LLMs follow instructions wherever they appear in their context and cannot reliably distinguish trusted from attacker-supplied text, any agent holding all three can be made to exfiltrate. Guardrail products that catch "95%" of attacks are, by web-security standards, a failing grade.

## Key points
- The three legs: private data; untrusted content (any attacker-controllable text or image reaching the model); external communication usable for exfiltration.
- Lists production systems exploited this way: Microsoft 365 Copilot, GitHub's official MCP server, GitLab Duo, ChatGPT and plugins, Google Bard, Amazon Q, NotebookLM, GitHub Copilot Chat, Slack, Mistral Le Chat, Grok, Claude iOS app, ChatGPT Operator — mostly fixed by vendors, but users who mix their own tools remain exposed.
- MCP encourages mixing tools from different sources; a single tool can supply two or three legs (the GitHub MCP exploit combined all three). Any outbound request — even loading an image or rendering a link — can carry data out.
- Recommendations: design patterns that constrain an agent once it has ingested untrusted input (cites "Design Patterns for Securing LLM Agents" and DeepMind's CaMeL); for end users, avoid combining all three.
- Prompt injection (a term Willison coined) is distinct from jailbreaking.

## Excerpts
> "Everything eventually gets glued together into a sequence of tokens and fed to the model."

> "If you look closely they'll almost always carry confident claims that they capture “95% of attacks” or similar... but in web application security 95% is very much a failing grade."

> "it is critically important that you understand the risk of combining tools with the following three characteristics. Failing to understand this can let an attacker steal your data."

## Relevance to the talk
The organising threat model for the final section. A sandbox's job for agents can be stated in trifecta terms: filesystem policy limits leg 1 (private data), egress policy cuts leg 3 (exfiltration); leg 2 (untrusted content — the repo, issues, web pages, dependencies) is unavoidable for a coding agent. This explains why network egress control, not syscall filtering, is the novel centre of agent sandboxes.
