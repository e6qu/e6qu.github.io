---
title: "Security Update for Amazon Q Developer Extension for Visual Studio Code (Version #1.84)" (AWS-2025-015)
url: https://aws.amazon.com/security/security-bulletins/AWS-2025-015/
authors: Amazon Web Services
date: 2025-07-23 (updated 2025-07-25)
accessed: 2026-11-22
kind: docs
---

## Summary
AWS's bulletin on a malicious change shipped in version 1.84.0 of the Amazon Q Developer extension for VS Code. An overly scoped GitHub token in the CodeBuild configuration let a threat actor commit code to the extension's open-source repository, which was automatically included in a release. AWS says the code was designed to make changes to services or customer environments but failed to execute due to a syntax error. (Press reports at the time described the injected change as a prompt instructing the agent to wipe the system and cloud resources; the bulletin itself does not describe the payload's content.)

## Key points
- Affected: Amazon Q Developer for VS Code 1.84.0; fixed 1.85.0; CVE-2025-8217.
- Root cause per AWS: overly scoped GitHub token in CodeBuild → malicious commit → auto-released.
- AWS: no services or customer environments changed; code remains present (inert) in 1.84.0 installs; 1.84.0 pulled from distribution.

## Excerpts
> "the malicious code was distributed with the extension but was unsuccessful in executing due to a syntax error."

> "While the malicious code cannot execute, it is still present in existing installations of 1.84.0."

## Relevance to the talk
The agent itself as supply-chain target: an agent extension with broad local and cloud permissions shipped attacker-authored content through the vendor's own pipeline. Sandboxing the agent (rather than trusting it) bounds the blast radius even when the agent's own code or instructions are compromised. The prompt-payload detail is from secondary press and unverified here.
