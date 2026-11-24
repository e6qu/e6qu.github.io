---
title: "From Automation to Infection: How OpenClaw AI Agent Skills Are Being Weaponized" (VirusTotal); "OpenClaw's Skill Marketplace and the Emerging AI Supply Chain Threat" (Unit 42); "OpenClaw Partners with VirusTotal for Skill Security" (OpenClaw)
url: https://blog.virustotal.com/2026/02/from-automation-to-infection-how.html
authors: Bernardo Quintero (VirusTotal, 2026-02-02); Shresta Bellary Seetharam, Nabeel Mohamed, Billy Melicher, Oleksii Starov (Palo Alto Networks Unit 42, 2026-06-23, https://unit42.paloaltonetworks.com/openclaw-ai-supply-chain/); Peter Steinberger, Jamieson O'Reilly, Bernardo Quintero (OpenClaw, 2026-02-07, https://www.openclaw.ai/blog/virustotal-partnership). Original Koi Security "ClawHavoc" audit (Oren Yomtov) not read: its URL now redirects to a Palo Alto Networks product page
date: 2026-02-02 to 2026-06-23
accessed: 2026-11-22
kind: blog
agent: OpenClaw (formerly Clawdbot/Moltbot) personal agent; ClawHub skill marketplace
incident_date: late January to early February 2026 (first wave); further skills February to May 2026
category: malicious-mcp-or-extension
cve: none
sandbox_at_time: none for skills. Skills are markdown and code that run in the agent's context with the agent's tools, credentials and local system access. ClawHub had no pre-publication scanning until the VirusTotal integration (announced 2026-02-07)
exploited_in_wild: YES; live malware distribution (AMOS macOS stealer, Windows trojans) to real users; victim counts not published
---

## Summary
OpenClaw, an open-source "personal AI agent" that grew very fast in early 2026, loads community "skills" from ClawHub. Within weeks the marketplace was flooded with malicious ones. Koi Security's audit (as reported by The Hacker News and others) found 341 malicious skills out of 2,857, 335 of them in one campaign it named "ClawHavoc". VirusTotal analysed more than 3,016 skills and found hundreds malicious; one publisher had 314, all malicious. The usual technique was a fake "prerequisite" setup step that told the agent or user to download and run a binary: a password-protected ZIP holding a packed trojan on Windows, and a base64-obfuscated script fetching an Atomic Stealer (AMOS) variant on macOS. Unit 42 later found five more malicious skills (February to May 2026) that *passed* the new VirusTotal and ClawScan screening, one by padding itself with about 22 MB to exceed scanner size limits.

## Key points
- Payload is natural language: VirusTotal says "The malware is the workflow". The skill's instructions get the agent to fetch and run the dropper, so a signature scan of the skill finds nothing.
- OpenClaw's own post says skills run "in your agent's context, with access to your tools and your data" and that scanning "won't catch everything".
- Unit 42 adds agent-native abuse beyond stealers: a skill steering financial advice to swappable affiliate links, and one coordinating agents to pool SOL for a pump-and-dump.
- Response: VirusTotal Code Insight scanning on publish (malicious blocked, suspicious labelled), account bans, NVIDIA-assisted skill analysis (Unit 42). Koi released a "Clawdex" pre-install scanner (secondary sources).
- Numbers above 341 (824, 1,184) appear only in secondary reports and are not verified here.

## Excerpts
> "The malware is the workflow." (VirusTotal)

> "A skill that uses natural language to instruct an agent to do something malicious won't trigger a virus signature." (OpenClaw blog)

> "Skills are markdown-driven packages with broad local system access" (Unit 42)

## Would a mature sandbox have stopped it?
**Largely yes, but OpenClaw had no sandbox for skills.** The infection chain needs the agent to (1) download from an arbitrary host and (2) execute a binary with access to the keychain, browser profiles and wallets. A default-deny **network egress allowlist** blocks (1). An fs policy that hides credential stores and browser data, combined with no-exec in writable scratch space, blocks or contains (2). **Credential isolation** keeps the agent's own messaging and API tokens out of reach of skill code. **Per-skill isolation** (each skill or MCP server in its own sandbox with declared capabilities) is what is missing at the ecosystem level. Marketplace scanning was the response that shipped, and Unit 42 showed it is evadable.

## Relevance to the talk
The 2026 "app store without a sandbox" moment for agents. It repeats the browser-extension and npm history, except the package is prose and the interpreter is an LLM with shell access. A strong slide for why scanning and reputation cannot replace a capability boundary.
