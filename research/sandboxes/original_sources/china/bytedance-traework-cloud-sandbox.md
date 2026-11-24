---
title: Sandbox (TraeWork) and Cloud runtime environment configuration — TRAE docs (Chinese-language page)
url: https://docs.trae.cn/work_sandbox.md
authors: ByteDance (TRAE)
date: undated pages (current as of 2026-11; sandbox page references TraeWork desktop 0.1.20)
accessed: 2026-11-22
kind: docs
---

## Summary
By late 2026 TRAE ships TraeWork, an agent app for desktop, web and mobile, alongside the TraeCode IDE. The docs still call the mobile and web clients "TRAE SOLO" in places. I infer that TraeWork is where SOLO's cloud execution now lives, but the docs do not say so.

TraeWork has local tasks and cloud tasks. Every cloud task runs in an independent secure sandbox container per session, with its own disk and cache. It cannot see the host or other sessions. TraeWork web runs only cloud tasks. On Windows, desktop Work/Design mode instead uses an isolated virtualized runtime that is always on and cannot be turned off. Local tasks on macOS use `sandbox-exec`, and Code mode on Windows uses ByteDance's own sandbox SDK. Cloud environments can set a fixed egress allowlist of package sources. The docs do not say what egress is when none is set.

## Key points
- Isolation unit:
  - Cloud: an "independent cloud sandbox container" (translated from Chinese), one per cloud session, with disk, cache and runtime isolated between sessions. The runtime (runc, gVisor, Kata or microVM) is not named.
  - Windows desktop Work/Design: an "isolated virtualized runtime environment" (translated from Chinese), with project files mounted in. Writes outside the project go to a sandbox overlay area and are not visible locally. The hypervisor is not named.
  - macOS desktop, all modes: `sandbox-exec` for local tasks. Since 0.1.20 macOS Work mode uses the same policy as Code mode.
- Default: cloud tasks are always in the container. The Windows Work-mode VM is on by default and cannot be disabled. Local-task sandboxing is the "sandbox run (with allowlist)" option under the Auto-Run settings, and allowlisted prefixes run outside the sandbox.
- File access in the cloud sandbox: read-write to the current session's work directory and the container's temp and cache directories. No access to the host filesystem or other sessions' data. Command file permissions in cloud sessions follow the Auto-Run policy by default.
- Network egress (cloud environment config, Code mode only; https://docs.trae.cn/work_set-up-the-remote-environment.md):
  - Optional `network_policy`, with `mode: 1` and `allowlist_policy: 0` fixed, plus `common_dependencies` chosen from npm, pypi, maven, goproxy, rubygems, packagist, crates, docker, github and gitlab.
  - The docs say user-defined network policies are not yet supported (translated from Chinese).
  - The egress default with no `network_policy` is not documented.
  - Local tasks: the security policy "does not cover network access" (translated from Chinese).
  - Desktop custom permission profiles (`global.json` `customProfiles`) have `network.default: allow|deny`.
- Image: one TRAE-maintained all-in-one general-purpose container image. Custom images (`container_image`) are not supported. Language versions, install/start commands, secrets and environment variables are configurable.
- Persistence: session data (pulled code, conversation, context) is stored until the user deletes the session, then deleted permanently (remote-agent data storage statement, https://docs.trae.cn/ide_data-storage-policy-for-remote-agents.md). Tasks can be handed off between local and cloud (https://docs.trae.cn/ide_handoff.md).
- E2B compatibility: not documented. Volcano Engine's veFaaS/AgentKit sandboxes are E2B-compatible, but TRAE does not say it runs on them.
- TraeCode CLI 2.0 (https://docs.trae.cn/cli_permission-and-sandbox.md) has three modes:
  - Workspace Edit.
  - Auto-Review: same sandbox scope as Workspace Edit, with key operations reviewed automatically by a model.
  - Full Access: lifts sandbox and approval limits.
  - Its sandbox mechanism is not named on that page (translated from Chinese).

## Excerpts
> "All cloud tasks run inside independent secure sandbox containers. Each cloud session has an isolated runtime environment (including disk, cache and other resources), so that sessions do not interfere with each other." (translated from Chinese; Sandbox, TraeWork web section, https://docs.trae.cn/work_sandbox.md)

> "On Windows, the Work and Design modes of TraeWork desktop provide you with a secure, isolated virtualized runtime environment … The sandbox is enabled by default and cannot be turned off." (translated from Chinese; Sandbox, https://docs.trae.cn/work_sandbox.md)

> "Currently, you can restrict outbound traffic by configuring a `network_policy` object, allowing the environment to access only specified common dependency sources." (translated from Chinese; Cloud runtime environment configuration, https://docs.trae.cn/work_set-up-the-remote-environment.md)

## Relevance to the talk
This is ByteDance's version of the Codex-cloud / Cursor-background-agent pattern: a container per cloud session, a fixed image, and a coarse package-registry egress allowlist. It is also an unusual local design. On Windows, TraeWork's non-coding modes always run in a VM, while coding mode uses a process sandbox that an allowlist can bypass.
