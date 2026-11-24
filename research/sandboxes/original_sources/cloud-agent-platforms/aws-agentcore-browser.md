---
title: "Interact with web applications using Amazon Bedrock AgentCore Browser", plus "Using browser proxies", "Using browser enterprise policies" and "Reducing CAPTCHAs with Web Bot Auth" (AWS docs)
url: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser-tool.html
authors: Amazon Web Services
date: living documents; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
AgentCore Browser is a managed, per-session headless Chromium. Agents drive it over a WebSocket automation stream (CDP/Playwright, Nova Act, Strands), and a human can watch or take over through a Live View stream. AWS describes it as "a containerized environment". Like Runtime and Code Interpreter, it gets credentials through MMDS. Egress control is layered: `PUBLIC` or `VPC` network mode at the network layer, and Chromium enterprise policies and an external proxy at the browser layer. The docs say explicitly that the browser-layer settings are not a security boundary.

## Key points
- **Isolation:** "Containerized environment separate from your system"; "Ephemeral sessions: Temporary sessions that reset after each use". The credentials page groups Browser with Runtime and Code Interpreter as compute that uses MMDS, which suggests a microVM. *(The VMM is not named by AWS.)*
- **Per what / lifetime:** One isolated browser per session. Timeout defaults to 15 min, max 8 h. There is 1 automation stream and 1 live-view stream per session. Optional session recording (DOM changes, user actions, console, network events) goes to the customer's S3, with replay in the console.
- **Limits:** 1 vCPU / 4 GB per session; 10 GB disk; 1,000 concurrent sessions per account; up to 10 extensions per session.
- **Persistence:** Sessions are ephemeral, but *browser profiles* (cookies + localStorage, ≤50 MB, 100 per account) can be saved and reloaded into later sessions. This is the persistence channel for logged-in state.
- **Network:** `PUBLIC` or `VPC` mode. In VPC mode, browsing needs a private subnet plus NAT.
- **Proxies (browser layer):** Up to 5 customer proxies per session, with `domainPatterns` routing and a `bypass` list. Basic-auth proxy credentials are fetched from Secrets Manager and "never returned in API responses". The proxy is applied via Chromium's `--proxy-server`. The docs state: "It is not a network-level control and does not guarantee that all traffic will transit the proxy."
- **Enterprise policies:** Chromium managed policies (fixed at browser creation) and recommended policies (per session) are loaded from S3, for example to disable autofill and the password manager. URL allow/block lists are possible through standard Chrome policy keys. *(The specific `URLBlocklist`/`URLAllowlist` use is not shown in AWS's examples; inferred from Chrome policy support.)*
- **Identity to websites:** Optional *Web Bot Auth* (preview) signs every HTTP request with an AWS-held private key (IETF HTTP Message Signatures; `Signature`, `Signature-Agent`, `Signature-Input` headers). It is verified by Cloudflare, Akamai, HUMAN, DataDome and F5. It is off by default.
- **Credentials to AWS:** An optional execution role is delivered via MMDS, with the same "any code … inside the VM" caveat as the other tools.
- **Pricing:** Per second; $0.0895 per vCPU-hour, $0.00945 per GB-hour; memory is billed at peak per second; idle and I/O wait are free.

## Excerpts
> "Proxy configuration is a browser-level routing setting and does not provide network-level traffic control. For network-layer enforcement, deploy browser sessions in your VPC." (Using browser proxies)

> "Isolation: Containerized environment separate from your system" (Security Features)

## Relevance to the talk
This is the browser-use version of the egress problem. The vendor offers in-application controls (proxy flag, Chrome policies) and then tells you they are advisory, so the real boundary is again the VPC and security groups. Web Bot Auth is a new idea worth a slide: instead of hiding that it is a bot, the sandbox cryptographically *identifies* the agent to the sites it visits. That is attribution as a control, the inverse of a credential.
