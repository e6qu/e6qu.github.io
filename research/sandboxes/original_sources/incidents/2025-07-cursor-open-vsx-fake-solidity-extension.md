---
title: "Code highlighting with Cursor AI for $500,000"
url: https://securelist.com/open-source-package-for-cursor-ai-turned-into-a-crypto-heist/116908/
authors: Georgy Kucherin (Kaspersky GReAT)
date: 2025-07-10
accessed: 2026-11-22
kind: blog
agent: Cursor (extension marketplace = Open VSX)
incident_date: extension updated 2025-06-15; taken down 2025-07-02; published 2025-07-10
category: malicious-mcp-or-extension
cve: none
sandbox_at_time: none. VS Code-family extensions, Cursor's included, run in the extension host with the user's full privileges and network, with no permission model. Open VSX ranked results by relevance, which weighs recency and downloads, and download counts could be inflated
exploited_in_wild: YES, a real victim; about USD 500,000 in crypto stolen
---

## Summary
A blockchain developer in Russia searched Cursor's extension marketplace, which is backed by the Eclipse Open VSX registry rather than Microsoft's, for Solidity support. He installed "Solidity Language" (`solidityai.solidity-1.0.9`), a fake whose description was copied from the legitimate extension and which had no highlighting code at all. It downloaded PowerShell scripts that installed ScreenConnect for remote access, then the Quasar backdoor and an infostealer. The attackers took wallet passphrases and drained about $500,000. The fake ranked *above* the real extension (4th vs 8th) because its update date was more recent, and it showed about 54k downloads to the real one's 61k.

## Key points
- Cursor, Windsurf and other VS Code forks cannot use Microsoft's marketplace, so they rely on Open VSX, a smaller registry with weaker curation. That makes it the natural target for attacks on "AI IDE" users.
- After the takedown a second fake ("solidity", lookalike publisher name with a capital I for a lower-case l) appeared, claiming about 2 million downloads.
- The victim's OS had been freshly installed a few days earlier, and he used online scanners rather than endpoint AV.
- The extension was removed on 2025-07-02. The write-up does not describe a response from Open VSX itself.

## Excerpts
> "The extension has nothing to do with smart contracts."

> "Always verify that the package you're downloading isn't a fake."

## Would a mature sandbox have stopped it?
**An agent sandbox: no. An extension sandbox: largely yes, but none exists.** The agent was never involved. The weak point is the IDE's extension host, which runs every extension as the user with full filesystem and network access. Agent-command sandboxes such as Cursor's Seatbelt/Landlock sandbox ([cursor-agent-sandboxing.md](../agent-sandboxing/cursor-agent-sandboxing.md)) wrap agent shell commands, not extensions. A mature design would run extensions with a declared capability set (no process spawning, no network beyond declared hosts, no reads of wallet or browser profile directories). Neither VS Code nor its forks offer that. Registry-side provenance and publisher verification would also have helped.

## Relevance to the talk
A reminder that an "AI IDE" is a whole IDE. Its oldest and least sandboxed plugin surface is still there, now with a less-curated registry. It also sets up the agent-era equivalents: skills and MCP servers (see the ClawHub and postmark-mcp notes).
