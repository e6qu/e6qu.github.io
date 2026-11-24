---
title: "Security design overview" (Cloud Run), "Code execution in Cloud Run" (docs) and "Google Cloud Run sandboxes are in public preview" (blog)
url: https://docs.cloud.google.com/run/docs/code-execution
authors: Google Cloud; blog by Ryan Pei and Greg Block (2026-07-10)
date: sandboxes public preview announced 2026-07-10 (release notes 2026-07-08); jobs/worker pools 2026-08-05; separate-image sandbox templates 2026-11-16 (release notes via search); docs read 2026-11-22. Companion: https://docs.cloud.google.com/run/docs/securing/security , https://cloud.google.com/blog/topics/developers-practitioners/google-cloud-run-sandboxes-are-in-public-preview
accessed: 2026-11-22
kind: docs
---

## Summary
Cloud Run has two layers of isolation. The platform layer: every instance runs in a sandbox with "a hardware-backed layer equivalent to individual VMs" plus a software kernel layer — gVisor for the first-generation execution environment, Linux microVMs for the second — on Borg. The new layer (preview, July 2026) is **Cloud Run sandboxes**: a `sandbox` CLI inside your container that spawns nested, gVisor-based, process-level sandboxes for untrusted, model-generated code, with no egress, no env vars, no metadata server and a discarded write overlay by default, at no extra charge.

## Key points
- **Platform isolation:** "The first generation execution environment is based on the gVisor container security platform"; "The second generation execution environment is based on Linux microVMs"; both use seccomp, gen2 also Sandbox2 namespaces; each instance is separated by "a boundary enforced by a virtual machine monitor (VMM)" (VMM not named). Container-level boundaries are "not as strong as the instance boundary". The metadata server "provides sandbox-specific credentials". Default egress: public internet via a shared regional dynamic IP pool; Direct VPC egress / VPC connectors route into a VPC.
- **Cloud Run sandboxes, isolation:** the blog says they run "inside isolated gVisor-based containers" (per search summary; docs page says only that sandboxes "isolate process execution"). They are spawned "within your existing Cloud Run service instances" — i.e. nested inside the instance, not a new instance.
- **Per what:** per `sandbox do` command (deleted after execution) or detached, longer-lived sandboxes for "long-running processes, headless browsers, or background servers".
- **Startup:** benchmark of 1,000 sandboxes "with an average of 500ms latency".
- **Filesystem:** read-only view of the container root FS; `--write` goes to a tmpfs overlay "lost when the sandbox is deleted"; tar import/export.
- **Egress:** "Outbound network access is blocked by default"; `--allow-egress` opens it (internet and whatever VPC endpoints the resource can reach). No host allowlist documented.
- **Credentials:** "By default, sandboxes don't have access to the parent workload, environment variables, secrets" or "the Google Cloud metadata server"; `--env` passes variables explicitly (docs warn against passing secrets).
- **Limits/pricing:** share the instance's CPU and memory; "there is no additional cost or premium". No per-sandbox caps documented.
- **ADK:** a `CloudRunSandboxCodeExecutor` was announced for "the next version" of ADK (not verified as shipped).

## Excerpts
> Both execution environments "use two layers of sandboxing consisting of a hardware-backed layer equivalent to individual VMs" and a software kernel layer. (Security design overview)

> "By default, sandboxes have zero outbound network access." (blog)

> "These sandboxes do not have access to the Cloud Run service's environment variables nor do they have the ability to call the Google Cloud metadata server." (blog)

## Relevance to the talk
A nice "sandbox inside the sandbox" example: the tenant boundary is the platform's VM/gVisor layer; the agent-vs-its-own-generated-code boundary is a second gVisor layer inside the tenant's instance. It is also the cheapest answer on the market (free, shares the instance) and shows the now-standard defaults: no egress, no ambient credentials, ephemeral writes.
