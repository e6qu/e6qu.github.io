---
title: How Manus Uses E2B to Provide Agents With Virtual Computers
url: https://e2b.dev/blog/how-manus-uses-e2b-to-provide-agents-with-virtual-computers
authors: E2B (Tereza Tizkova)
date: 2025-05-06
accessed: 2026-11-22
kind: blog
---

## Summary
E2B's customer story confirms that Manus runs its agent sandboxes on E2B, which is built on Firecracker microVMs. Manus self-hosts E2B on its own machines. Manus chose it over Docker because Docker containers took 10–20 s to start and did not give the full OS the agent needs to install apps and packages. E2B sandboxes start in about 150 ms, can run for hours, and can be paused and resumed. Paid users' sandbox data is kept for up to 14 days (in 2025; Manus's 2026 blog gives 7/21 days).

## Key points
- Isolation unit: Firecracker microVM ("ephemeral, lightweight virtual machines originally developed by AWS").
- Per-session?: one microVM per agent task ("virtual computer").
- Network egress: not described; agents browse the web with Chromium inside the VM, so internet access is implied.
- Persistence: sessions can run for hours; pause/resume for user input, credentials or "verify you are human"; paid users can keep sandbox data up to 14 days (2025 figure).
- Deployment: self-hosted ("Manus runs E2B on its own machines"; "E2B self-hosting is easy to manage"). Implemented in about half a day (vendor claim).
- Startup: about 150 ms versus 10–20 s for Docker in Manus's tests (vendor-reported).
- Tools: E2B's customers index lists the story as "Manus: virtual computers for agents that use 27 tools" (https://e2b.dev/customers.md). The same index says E2B overall has more than 100,000 teams and 2 billion sandbox starts as of October 2026.
- Limits / pricing: not given for Manus (self-hosted).

## Excerpts
> "E2B was the best solution, and it looked like every company was using it." (Tao Zhang, Manus co-founder)

> "We chose E2B because we were thinking about the future." (Tao Zhang)

## Relevance to the talk
The best-known Chinese-founded agent runs on Firecracker via open-source E2B, self-hosted. The same E2B API now shows up in Moonshot's AgentENV, Alibaba Cloud's Agent Sandbox (it accepts the E2B SDK) and ModelScope's ms-enclave. The quoted comparison (containers slow to start, not a full OS) is a common argument for microVMs.
