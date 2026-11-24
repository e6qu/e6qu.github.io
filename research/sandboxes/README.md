# Sandboxes — research notes

Raw material for a talk on sandboxing: where it came from, how it evolved,
and what coding agents demand of it now. Not published by the site build
(`scripts/build.py` copies only `assets/` and `presentations/`).

## Status (2026-11-22)

About 581 source notes across sixteen topics (plus ~3,000 indexed HN stories), each topic with a `README.md` index and
synthesis. The draft talk structure is in [talk-outline.md](talk-outline.md); the classification of strategies (VM / OS-level / Wasm / in-process, plus mediation) is in [taxonomy.md](taxonomy.md); the pool of openers, anecdotes, laugh lines, hacks and demo ideas is in [talk-ideas.md](talk-ideas.md).

| Topic | Notes |
|---|---|
| [history](original_sources/history/README.md) | 30 |
| [os-primitives](original_sources/os-primitives/README.md) | 34 |
| [virtualization](original_sources/virtualization/README.md) | 33 |
| [macos-windows](original_sources/macos-windows/README.md) | 55 |
| [agent-sandboxing](original_sources/agent-sandboxing/README.md) | 61 (incl. [top coding agents matrix](original_sources/agent-sandboxing/top-coding-agents-matrix.md)) |
| [arxiv](original_sources/arxiv/README.md) | 40 |
| [density](original_sources/density/README.md) | 7 |
| [e6qu-projects](original_sources/e6qu-projects/README.md) | 15 |
| [incidents](original_sources/incidents/README.md) | 24 (+7 in agent-sandboxing); the 20 for the talk are tabled |
| [in-process](original_sources/in-process/README.md) | 24 (Safe Scala/TACIT, object capabilities, restricted interpreters, just-bash, Code Mode, Cedar/Dogwood, FIDES, APPA) |
| [wasm](original_sources/wasm/README.md) | 27 (Pyodide runners, Dynamic Workers, Wassette, WASI 0.2/0.3, WebContainers, Wasmtime advisories) |
| [cloud-agent-platforms](original_sources/cloud-agent-platforms/README.md) | 36 (Anthropic, OpenAI, AWS AgentCore, Google Agent Platform/ACE, Azure Foundry/ACA, GitHub, Replit, Northflank, …) |
| [egress](original_sources/egress/README.md) | 25 (proxies, SNI/DNS filters, TLS interception, credential injection, cloud controls, and their bypasses) |
| [china](original_sources/china/README.md) | 39 (Alibaba, ByteDance/Volcano, Tencent, Baidu, Huawei, Moonshot, Zhipu, DeepSeek, MiniMax, Manus, ModelScope, TC260) |
| [anecdotes](original_sources/anecdotes/README.md) | 27 (models vs their sandboxes and evals, classic security lore, platform war stories) |
| [hackernews](original_sources/hackernews/README.md) | 104 thread notes; 3,038 stories indexed across 4 folders; 399 practitioner setups |

Each note says which copy was read. Unverified details are flagged in the note
itself. Most 2026 arXiv papers are preprints.

## Layout

```
research/sandboxes/
  README.md                 this file
  original_sources/
    <topic>/
      README.md             index of the topic: one line per source file, plus a short synthesis
      <slug>.md             one file per original source
```

Topics:

| Directory | Covers |
|---|---|
| `history/` | Mainframe VMs, Popek–Goldberg, capability systems, chroot, Janus/systrace, Java & NaCl, FreeBSD jails, Solaris Zones, AIX WPARs, Linux-VServer, OpenVZ |
| `os-primitives/` | Linux namespaces, cgroups, seccomp, Landlock, LSMs, LXC, Docker, bubblewrap, nsjail, minijail, FreeBSD Capsicum, OpenBSD pledge/unveil |
| `virtualization/` | Hypervisors, microVMs (Firecracker, Cloud Hypervisor), Kata, gVisor, unikernels, WebAssembly and V8 isolates |
| `macos-windows/` | Seatbelt, App Sandbox, Hypervisor.framework, Virtualization.framework, Apple `container`; AppContainer, Windows Sandbox, silos, Hyper-V isolation, WSL; lighter-than-VM options |
| `agent-sandboxing/` | Sandboxes for coding agents: Anthropic sandbox-runtime, Claude Code, Codex, Gemini CLI, hosted sandboxes (E2B, Modal, Daytona …), threat models |
| `arxiv/` | Academic papers, especially recent arXiv work on agent sandboxing and isolation |
| `density/` | Per-instance cost of isolation and how far it can be cut: LFI/SFI, userland network stacks, Nanvix, Arca, the kapteko 10M/15M experiments |
| `e6qu-projects/` | e6qu/fun-with-sandboxes and e6qu/fun-with-emulators |
| `incidents/` | Agent failures 2025–2026, each with “would a mature sandbox have stopped it?” |
| `in-process/` | The agent's whole world is one host process: types/capabilities, interpreters, simulated shells, information-flow runtimes |
| `wasm/` | Wasm runtimes, component-model tools, isolates, Pyodide, browser sandboxes, for agents |
| `cloud-agent-platforms/` | How each cloud isolates agents: unit and VMM, egress defaults, credentials |
| `egress/` | Egress filtering mechanisms, their bypasses, better designs |
| `china/` | Chinese providers' agent sandboxes |
| `anecdotes/` | Memorable stories for the talk: model misbehaviour in evals, classic lore, platform war stories |
| `hackernews/` | HN stories and comments per topic: raw index plus notes on key threads |

## Source file format

Each `<slug>.md`:

```markdown
---
title: <exact title of the original>
url: <canonical URL of the original>
authors: <people or organisation>
date: <publication date, as precise as known>
accessed: 2026-11-22
kind: paper | docs | blog | repo | talk | book | man-page | spec | discussion | issue | advisory | report | forum-post
---

## Summary
Two to five sentences, in our words.

## Key points
- Facts, mechanisms, numbers — each traceable to the source.

## Excerpts
> Short verbatim quotes (a few sentences at most each), with section or page.

## Relevance to the talk
Where this fits in the story.
```

Excerpts stay short (fair-use quotation, not mirroring). Everything links back
to the original; nothing is copied wholesale.
