---
title: "Network access for shell commands" (Cowork docs), "What to expect with Claude Cowork in the cloud" (support), "Set up Cowork (local mode) for a HIPAA-ready organization", and Claude Desktop on 3P overview
url: https://claude.com/docs/cowork/guide/network-access
authors: Anthropic
date: living documents; read 2026-11-22. Other pages: https://support.claude.com/en/articles/15811196-what-to-expect-with-claude-cowork-in-the-cloud, https://claude.com/docs/cowork/hipaa-setup, https://claude.com/docs/cowork/3p/. Architecture article https://support.claude.com/en/articles/14479288 now redirects to a gated Trust Center document (not read; only search snippets seen)
accessed: 2026-11-22
kind: docs
---

## Summary
Cowork is Anthropic's general-purpose (non-coding) agent workspace in Claude Desktop, web and mobile. It runs in two modes. **Local mode** runs shell commands in a full Linux VM on the user's computer (Virtualization.framework on macOS, HCS on Windows, per `anthropic-how-we-contain-claude.md`), with only connected folders mounted. **Cloud mode** (from autumn 2026) runs both inference and the VM on Anthropic's servers, one sandbox per session. Network policy is an org-level egress allowlist with a notable twist: package registries and GitHub are *download-only*, so the proxy filters by operation, not just host.

## Key points
- **Local VM:** "When a Cowork task runs on your computer, Claude runs its shell commands in a virtual machine (VM)." The VM image ("VM workspace bundle") is downloaded from `downloads.claude.ai` and stored as disk images in `vm_bundles`. The same local VM is used when Claude Desktop runs against Bedrock, Vertex or Foundry ("Code execution sandbox: Local VM (identical)").
- **Mounts:** only folders the member connects to a task, plus the Cowork files folder (`~/Claude`). Mount modes and the MDM allowlist are described in the containment post.
- **Cloud mode:** tasks run "on Anthropic's servers instead of your computer" and keep running with the laptop closed. They cannot reach local files, local MCP servers, Claude in Chrome or computer use unless the desktop app is connected. Working files not delivered to the user are discarded when the session ends. Felix Rieseberg (Anthropic, quoted by Simon Willison, 2026-10-05): "The 'new' version of Cowork runs model inference and the VM in the cloud", each session in its own sandbox. The cloud VM technology is **not documented**. Search snippets of the now-gated architecture article say the cloud VM "enforces its own network egress filtering, syscall restrictions, and per-session user isolation" behind "a mandatory proxy" the sandbox "can't reconfigure or bypass" (*unverified: the page could not be read*).
- **Egress levels** (Settings / Organization settings > Capabilities):
  - **Allow network egress** off: only `anthropic.com` and `claude.com` hosts. Per the snippets, this is the default for Enterprise orgs (*unverified*).
  - **Domain allowlist = None**: those hosts plus "Additional allowed domains".
  - **Package managers only**: the same plus registries and `github.com`.
  - **All domains**: any host (unavailable under HIPAA).
- **Download-only hosts:** npm/yarn/crates.io allow installs but block publish, unpublish and account changes. `github.com` allows HTTPS clone/fetch/pull but blocks `git push`, uploads, Git LFS and SSH remotes. The docs warn: "These limits aren't a security boundary."
- **Outside the VM:** connectors (sent via Anthropic's servers), desktop extensions and local MCP servers (run on the host with the host's network) are not subject to the VM egress settings. The managed setting `requireCoworkFullVmSandbox` can pull plugin MCP servers into the VM.
- **Credentials:** connectors are linked to the account and brokered outside the VM. Host credentials stay in the keychain, and the VM gets a scoped per-session token (containment post).
- **Monitoring gap:** the containment post notes that host EDR sees only "an opaque hypervisor process". Anthropic offers OTLP export (metadata only by default).
- **Plans:** desktop on all paid plans. Cloud on web/mobile for Pro, Max, Ultra and Team (beta), and Enterprise when enabled. No separate sandbox pricing documented.

## Excerpts
> "When a Cowork task runs on your computer, Claude runs its shell commands in a virtual machine (VM)." (Network access)

> "If a task can reach these hosts, it can download from them, but uploads to them are blocked." (Download-only hosts)

> "These limits aren't a security boundary. Don't rely on them alone to keep data inside the VM." (Download-only hosts)

## Relevance to the talk
Cowork has used both ends of the design space within a year: a local hypervisor VM per user, then a cloud VM per session. It also answers the "granted by host, not by operation" critique from the CMA docs with method- and path-aware filtering (no `git push`, no `npm publish`), while saying plainly that this filtering is not a boundary. It shows that connectors and MCP servers sit outside the sandbox in every Anthropic product.
