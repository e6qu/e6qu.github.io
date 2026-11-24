---
title: "Security for Repository Contributions" (Replit Docs)
url: https://docs.replit.com/build/code/security
authors: Replit
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

> **Update 2026-11-22:** Replit now names its VMM: Cloud Hypervisor microVMs with runc inside (post of 2026-11-04). See [../cloud-agent-platforms/replit-sandbox-engine.md](../cloud-agent-platforms/replit-sandbox-engine.md).

## Summary
Replit Agent runs in Replit's cloud, in a sandbox whose isolation boundary is a **microVM**. Replit says explicitly that a container inside it does not count as an equivalent boundary. The docs document no per-command approval prompts, egress allowlist or in-VM sandbox. Safety comes from platform architecture instead. The agent gets a separate development database and reaches the production database only through a read-only replica, a change made after the July 2025 incident (see replit-database-deletion-2025.md). Git credentials stay outside the sandbox behind a proxy, a Socket-powered package firewall is on by default, and automatic checkpoints can roll back code, agent context and (optionally) the dev database.

## Key points
- Runs: Replit cloud. "The sandbox runs in a microVM, a lightweight virtual machine that isolates the development workload" (https://docs.replit.com/build/code/working-with-code). Chats coordinate the work, and the attached sandbox runs commands. Production apps are hosted separately (deployments).
- Isolation: microVM per sandbox. The hypervisor is not named. The page warns that it "does not make guarantees about data residency, network isolation, or certification". The shared-responsibility model lists "Isolation between development instances" as Replit's job (https://docs.replit.com/features/security/shared-responsibility-model).
- Filesystem: the agent can read and modify anything in the project sandbox. There are no documented in-sandbox path restrictions.
- Databases (the post-incident fix): "Every Replit App works with two databases." The Agent "can create and modify tables" in development. For production it "can read it through a read replica but can't change it" ("Agent is not able to modify the production database"). Schema changes reach production only at publish time, via drizzle-kit diffing. `DATABASE_URL` takes different values in the workspace and in the published app (https://docs.replit.com/features/data-and-storage/development-and-production). Caveat, from the same page: if an app reads its own `DATABASE_URL` or another DB connection from Secrets (e.g. Supabase), that database is outside this arrangement. Our inference: the read-only guarantee covers only the Replit-managed production database.
- Checkpoints: created automatically by Agent and capturing files, packages, agent context/memory and DB contents. Rollback restores code and context. The dev DB is restored only if "Database" is ticked ("By default, rollbacks do not change your database"). Production is never restored by rollback; it has separate point-in-time restore and daily backups (https://docs.replit.com/features/version-control/checkpoints-and-rollbacks, https://docs.replit.com/features/data-and-storage/data-recovery).
- Network: open egress. The only documented limits are ToS-driven caps such as "the number of concurrent outgoing network connections" (https://docs.replit.com/legal-and-security-info/usage). **Package Firewall** sits between installs and registries (npm/yarn/pnpm, pip, Go modules) and blocks packages Socket flags as malicious. It is "on by default for every builder" with "no setting to configure" (https://docs.replit.com/features/security/package-firewall). Git: Agent's `git`/`gh`/`glab` go through `github.replit.internal` / `gitlab.replit.internal`, which "adds your connection's credentials outside the sandbox, so Agent never receives a token it could leak" (https://docs.replit.com/build/code/git-provider-proxy).
- Approvals: no per-command shell approval is documented. Planning is conversational: ask it to plan, or use `/plan`, and "The **Plan** toggle is no longer used" (https://docs.replit.com/core-concepts/agent/plan-mode). Connector actions have modes **Always ask / Decide for me / Always allow / Disabled**, with an admin "Workspace Agent Permission Limits" cap. The docs themselves warn that during early access some selectors "only save a preference and do not change Agent behavior", and that "These controls do not make an app or unattended run display an interactive approval prompt" (https://docs.replit.com/teams/connector-governance).
- Enterprise: Advanced settings cover model/mode allowlists, disabling attachments, integrations and Agent memory, Auto-Protect fix tasks, and publishing policies (https://docs.replit.com/teams/enterprise-privacy-settings).

## Excerpts
> "The microVM is the isolation boundary; a container inside it is not a separate equivalent boundary." (Security for Repository Contributions, Isolation and assurance)

> "Isolation does not remove the permissions you grant to code running inside the sandbox." (same section)

> "Agent is not able to modify the production database. This restriction is in place so that your production database stays safe." (Development and production databases)

> "The proxy adds your connection's credentials outside the sandbox, so Agent never receives a token it could leak." (Secure Access to GitHub and GitLab)

## Relevance to the talk
This is the post-incident answer to "the agent deleted prod". Replit did not add approval prompts. It took the credential away: the agent sees prod only through a read replica, and git tokens are injected by a proxy outside the microVM. That is the "keep secrets out of the sandbox" pattern, applied after the fact. The fine print is a useful caution. The guarantee covers only Replit-managed databases, some permission toggles are documented as not yet enforced, and the vendor itself says "isolation does not remove the permissions you grant".
