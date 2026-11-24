---
title: "Cracks in the Bedrock: Escaping the AWS AgentCore Sandbox"
url: https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/
authors: Ori Hadad (Palo Alto Networks Unit 42); parallel research by BeyondTrust Phantom Labs
date: 2026-04-07 (Unit 42); BeyondTrust disclosure 2026-03-16
accessed: 2026-11-22
kind: blog
---

## Summary
Amazon Bedrock AgentCore Code Interpreter offers a "Sandbox" network mode. AWS originally
described it as "complete isolation with no external access". It blocked direct outbound TCP, but
its resolver still did recursive DNS for arbitrary public names. Unit 42 (and, separately,
BeyondTrust) built a two-way channel: data goes out as subdomains of an attacker-controlled zone,
commands come back in A-record answers. That is an interactive shell over DNS from a "no network"
agent sandbox. AWS treated it as intended behaviour: it changed the docs (Sandbox mode "can access
Amazon S3 for data operations and perform DNS resolution") and pointed customers to VPC mode plus
Route 53 Resolver DNS Firewall.

## Key points
- Network modes for custom Code Interpreters: PUBLIC, SANDBOX, VPC (AWS API docs). The current
  AWS developer guide says Sandbox mode "Provides limited external network access to AWS services".
- Unit 42 technique: encode data in labels under an attacker domain; the attacker's authoritative
  nameserver logs them; responses carry data back, so the channel is bidirectional.
- Chained with the microVM metadata service accepting unauthenticated GETs (MMDSv1-style). Unit 42
  shows how DNS tunnelling plus metadata could leak the agent's role credentials. AWS made MMDSv2
  the default for new agents as of 2026-02-14.
- AWS also called a pre-signed S3 URL and account ID found in metadata "backend infrastructure"
  and expected behaviour.
- BeyondTrust timeline (per the Cloud Security Alliance research note of 2026-03-20): reported via
  HackerOne 2025-09-01; a fix deployed in Nov 2025 and rolled back; AWS declined to patch on
  2025-12-23 and reworded the docs from "complete isolation" to "limited external network access";
  no CVE. BeyondTrust's own post reportedly says AWS later remediated DNS tunnelling (2026-04-15).
  **Not independently verified**: beyondtrust.com returned 403 to our fetch.
- AWS Config ships a rule flagging Code Interpreters whose network mode is PUBLIC or SANDBOX
  (per search results; rule page not read).

## Excerpts
> "Our research revealed that the restrictions of sandbox mode were not as complete as originally described." — Unit 42, conclusion
> "the code interpreter can access Amazon S3 for data operations and perform DNS resolution." — AWS developer guide as quoted by Unit 42

## Relevance to the talk
The hosted twin of Claude Code's CVE-2025-55284 (`ping`/DNS exfil:
[note](../agent-sandboxing/embracethered-claude-code-dns-exfil.md)), and the clearest case of a
vendor's "isolated" mode that still resolved DNS. It explains why Codex resolves DNS only after a
request is approved ([note](../agent-sandboxing/openai-inside-the-codex-sandbox.md)), why Modal
warns DNS is unrestricted unless all egress is blocked, and why E2B's BYOP doesn't tunnel DNS
([e2b-byop-tcp-only.md](e2b-byop-tcp-only.md)). DNS tunnelling is classic tradecraft (MITRE
ATT&CK T1071.004, https://attack.mitre.org/techniques/T1071/004/, names iodine and dnscat2).
