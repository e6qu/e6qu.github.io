---
title: "Microsandbox: Virtual Machines that feel and perform like containers"
url: https://news.ycombinator.com/item?id=44135977
story_url: https://github.com/microsandbox/microsandbox
points: 402
comments: 186
authors: HN thread (submitted by makeboss); project by appcypher (Stephen Akinyemi)
date: 2025-05-30
accessed: 2026-11-22
kind: discussion
---

## Summary
microsandbox is a self-hostable microVM runtime built on libkrun ("the same technology as Firecracker", using Hypervisor.framework on macOS), with an `msb server` and SDKs aimed at AI developers who need to run untrusted, LLM-generated code. The creator answered questions throughout. The thread is a good snapshot of mid-2025 expectations: Simon Willison wants a sandbox "a billion dollar company with a professional security team is running in production", complains that macOS sandboxing is undocumented, and does not want to tell his users "step 1: install Docker". Others ask about VM escapes, networking limits and how it compares with Kata and Firecracker.

## Key points
- libkrun-based. macOS support through Hypervisor.framework. Firecracker has no macOS port and, per the author, its team is not interested in one.
- Hosting microVMs needs bare metal or nested virtualisation, which containers do not.
- Networking used libkrun's TSI at the time, with a user-space network stack planned. Per-sandbox network restriction was possible via a `scope` property.
- Willison's two asks stand for the whole period: a sandbox with a big company's security team behind it, and one that is easy to embed without Docker.

## Excerpts
> "This project is meant to make creating microvms from your machine as easy as using Docker containers." — appcypher ([44136409](https://news.ycombinator.com/item?id=44136409))

> "It is a lighweight VM and uses the same technology as Firecracker" — appcypher ([44137012](https://news.ycombinator.com/item?id=44137012))

> "I need something which a billion dollar company with a professional security team is running in production on a daily basis." — simonw ([44138795](https://news.ycombinator.com/item?id=44138795))

> "The lack of documentation for that system is so frustrating! Security feature are the one thing where great documentation should be table stakes…" — simonw, on macOS sandboxing ([44143896](https://news.ycombinator.com/item?id=44143896))

> "hosting microVMs require dedicated hardware or VMs with nested virt support. Containers don't have that problem." — appcypher ([44138849](https://news.ycombinator.com/item?id=44138849))

> "when you say 'bullet proof' security, there are exploits to break out of VMs that exist. Have you looked into those?" — spicybright ([44141986](https://news.ycombinator.com/item?id=44141986))

## Relevance to the talk
This is the start of the local-microVM wave for agents (later Docker Sandboxes, smolvm, Apple `container`). Willison's "billion dollar company" quote explains why vendor-built sandboxes eventually won over a long tail of hobby projects, despite all the distrust shown in other threads.
