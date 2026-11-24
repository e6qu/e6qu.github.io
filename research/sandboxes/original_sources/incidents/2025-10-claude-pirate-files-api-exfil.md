---
title: "Claude Pirate: Abusing Anthropic's File API For Data Exfiltration"
url: https://embracethered.com/blog/posts/2025/claude-abusing-network-access-and-anthropic-api-for-data-exfiltration
authors: wunderwuzzi (Embrace The Red, the pseudonym of Johann Rehberger)
date: 2025-10-28 (update 2025-10-30)
accessed: 2026-11-22
kind: blog
agent: Claude (claude.ai) Code Interpreter / "code execution" sandbox
incident_date: reported via HackerOne 2025-10-25; published 2025-10-28
category: hosted-sandbox
cve: none (hosted service)
sandbox_at_time: hosted container sandbox with the default network setting "Allow network egress to package managers only". This is a domain allowlist (PyPI, npm, GitHub and others) whose first entry was `api.anthropic.com`
exploited_in_wild: no; researcher demonstration
---

## Summary
Claude's hosted code-execution sandbox had a network egress allowlist, which is what a mature sandbox is supposed to have. One allowed domain was Anthropic's own API. An indirect prompt injection (in a document, or delivered via an MCP server) told Claude to write private data to a file in the sandbox (the demo used the user's recent chat history, retrieved through the memory feature). It then ran Python that called the Anthropic Files API with the *attacker's* API key, uploading the file into the attacker's account. Uploads of up to 30 MB per file were possible, and several files could be sent.

## Key points
- The egress allowlist existed and was on by default. The exfil went through an allowlisted domain, because "allowed host" is not the same as "allowed account".
- To get past refusals, Rehberger had to mix the payload into benign code. A cleartext key and XOR/base64 encoding did not work reliably.
- HackerOne ticket closed within about an hour as "out of scope (model safety issue)". On 2025-10-30 Anthropic said such exfiltration bugs are in scope and the closure was a process error.
- Rehberger's suggested fix: the sandbox should only let Claude talk to the *logged-in user's* account. He warns that other package-manager domains on the list may allow the same attack.
- Follow-up (secondary, not verified at origin here): PromptArmor reported the same Files-API pattern against Claude Cowork in January 2026 (https://promptarmor.com/resources/claude-cowork-exfiltrates-files). The Register (2026-01-15) reported the underlying issue still unfixed then.

## Excerpts
> "Unfortunately, this particular issue you reported is explicitly out of scope as outlined in the Policy Page." (HackerOne closure, quoted in the post)

## Would a mature sandbox have stopped it?
**It *was* a sandbox with an egress allowlist, and it still leaked.** Domain-level allowlisting does not stop exfiltration to an attacker-controlled tenant on a shared domain (api.anthropic.com, github.com, pypi.org upload endpoints, and so on). Stopping this needs either (a) **credential-bound egress**: an egress proxy that only permits API calls authenticated as the session's own user, by stripping or replacing `x-api-key` and injecting the user's credential (the "credential masking" pattern later documented for Claude Code and Copilot), or (b) a tighter default with no general internet and read-only package mirrors. Neither existed then. Claude Code's own docs now warn that broad domains like `github.com` are exfil paths ([claude-code-sandboxing-docs.md](../agent-sandboxing/claude-code-sandboxing-docs.md)).

## Relevance to the talk
The key "egress allowlists are necessary but not sufficient" incident, and a hosted-sandbox example where the vendor's own domain was the hole. It also shows the "model safety vs. security" triage gap that recurs in vendor responses (compare Cursor and GitHub on the Rules File Backdoor, and Google on Antigravity).
