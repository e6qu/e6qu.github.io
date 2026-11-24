---
title: "Security & Trust | Bolt" (Bolt platform security page), with Lovable's docs on preview environments
url: https://bolt.new/platform/security
authors: StackBlitz (Bolt); Lovable
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Both are prompt-to-app builders that users drive from a browser, but the generated code runs in different places. **Bolt.new** (StackBlitz) runs the project client-side in a **WebContainer**, a WebAssembly-based Node.js environment inside the user's browser tab. Its isolation is the browser's own sandbox ("its own browser-level sandbox, separated from other projects and from our infrastructure"). Safari and mobile are the exception: there Bolt falls back to a server-hosted preview. **Lovable** runs a preview/dev server per project in a **cloud sandbox**: "a temporary cloud environment that Lovable starts for your project". Its own docs don't name the isolation technology. Modal's case study says every Lovable app-generation session runs on Modal Sandboxes, which default to gVisor (see modal-sandboxes.md). Neither documents per-command approvals or an egress policy. Both rely on Plan/Chat modes, version-history rollback and publish-time governance.

## Key points
- Bolt runs in the user's browser. "Bolt executes your project client-side, inside your browser, in an isolated WebContainer environment" (Security & Trust). The terminal "runs in your browser, inside your project", and commands on the user's own computer "don't reach your Bolt project" (https://support.bolt.new/building/code-view). Bolt "only supports JavaScript-based backends" (no Python/PHP) (https://support.bolt.new/reference/supported-technologies). In Safari, "Previews are hosted rather than running in the browser", and the terminal is unavailable (same page). WebContainers need cross-origin isolation and fully work only in Chromium (https://webcontainers.io/guides/browser-support, "Last update: October 2026").
- Bolt isolation: the browser's sandbox, with one WebContainer per project. There is no OS-level mechanism to choose per OS, and the boundary is the same on macOS, Linux and Windows. The user's local filesystem is not exposed. The agent's writes stay inside the WebContainer's virtual FS and the project's backups.
- Bolt network: not documented for Bolt. WebContainer traffic is browser-mediated. A StackBlitz post (2024-05-07, https://blog.stackblitz.com/posts/cors-proxy) says StackBlitz can reroute external requests to "a proxy which has no CORS restrictions". The post does not mention Bolt, so whether Bolt uses this proxy is not documented. The backend ("Bolt Cloud": database, auth, storage, server functions, hosting) runs on Bolt's servers, with secrets stored there (https://support.bolt.new/bolt-cloud).
- Bolt approvals: the agent ("Standard" or "Max") runs setup and dev-server commands itself (the terminal's "Bolt" tab "Shows the commands Bolt runs in the background"). No approval setting is documented. Plan Mode discusses before writing code (https://support.bolt.new/prompting/plan-mode). Undo is via version history, automatic backups and download (https://support.bolt.new/managing-projects/rollback-backup).
- Lovable runs in a cloud sandbox. "Your preview runs in a temporary cloud environment that Lovable starts for your project while you work", which pauses when idle. Lovable "still builds and tests your changes behind the scenes in its own environment" (https://docs.lovable.dev/features/projects/preview). Engineering posts describe about a million sandboxes a day, each running a real dev server (Vite, moving to the Rust "OJ") (https://lovable.dev/blog/faster-previews-oj, 2026-09-15). Its stateful sandboxes "checkpoint the machine's memory, CPU state and disk" and can fork an app "with its working environment and database" (Anton Osika, https://lovable.dev/blog/how-we-built-lovable-and-why-we-keep-rebuilding-it, 2026-11-04).
- Lovable isolation: not documented by Lovable. The sandbox provider is Modal per Modal's customer story: "Modal Sandboxes are now used to serve every app generation session in Lovable", and each sandbox reaches its dev server through an encrypted Tunnel (https://modal.com/blog/lovable-case-study, 2025-07-07). Modal's default runtime is gVisor. That is Modal's documentation, not Lovable's, and current use in 2026 is not confirmed by Lovable.
- Lovable data caveat: "the preview and your published app share the same backend and data, so changes to your database affect both" (preview docs). That is the opposite of Replit's post-incident dev/prod split.
- Lovable approvals: **Chat mode** never changes code. **Plan mode** writes a plan "you can review, edit, and approve before any code is written" (https://docs.lovable.dev/features/plan-mode). **Build mode** (docs URL `features/agent-mode`) "handl[es] execution end to end with minimal supervision" (https://docs.lovable.dev/features/agent-mode). There is no per-tool approval, but a running request can be stopped and changes undone via version history. Enterprise policies can block publishing or require admin approval (public apps, connector-using apps, apps with sensitive-data findings), and can require approval "before a project enables Lovable's built-in backend". Admins can also disable public preview links and gate MCP servers (https://docs.lovable.dev/introduction/lovable-for-enterprise).
- Lovable network: not documented for the build sandbox. Enterprise can route custom-MCP traffic through Lovable static IPs (Enterprise page).

## Excerpts
> "Every project runs in its own browser-level sandbox, separated from other projects and from our infrastructure." (Bolt, Security & Trust)

> "Bolt's terminal is different from the Terminal or Command Prompt app on your computer." (Bolt, Use Code view)

> "Your preview runs in a temporary cloud environment that Lovable starts for your project while you work." (Lovable, Preview and test your app)

> "Keep in mind that the preview and your published app share the same backend and data, so changes to your database affect both." (Lovable, Preview and test your app)

## Relevance to the talk
Bolt is the only mainstream agent whose sandbox is the browser itself. WebAssembly plus the same-origin model give it isolation from the user's machine and from the vendor's servers at almost no cost, but it is limited to JavaScript, and Safari falls back to the server. Lovable is the opposite: a fleet of short-lived cloud sandboxes, apparently on Modal/gVisor, so isolation is outsourced to a sandbox vendor. In both cases the risky part is not the sandbox but the connected backend. Lovable says outright that preview and production share one database.
