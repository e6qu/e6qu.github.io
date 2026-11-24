---
title: "@cloudflare/shell" (cloudflare/agents packages/shell): README at 0.0.2 (bash fork of just-bash) and 0.5.0 (JS state runtime, deprecated) + PRs #1103, #1122, #2564
url: https://github.com/cloudflare/agents/tree/main/packages/shell
authors: Cloudflare (PRs #1103 and #1122 by threepointone; deprecation PR #2564 by mattzcarey)
date: npm package created 2026-03-13; bash-interpreter release 0.0.2 published 2026-03-13; replaced by a non-bash rewrite in 0.1.0 (2026-03-19); deprecated in 0.5.0 (2026-10-20) in favour of @cloudflare/computer
accessed: 2026-11-23
kind: repo
---
Not a standalone repo: `gh api repos/cloudflare/shell` returns 404. The package lives in the monorepo
https://github.com/cloudflare/agents (created 2025-01-29, MIT) under `packages/shell`.
npm: https://www.npmjs.com/package/@cloudflare/shell (registry metadata read from
https://registry.npmjs.org/@cloudflare%2fshell). Tarballs for 0.0.0, 0.0.2 and 0.5.0 were downloaded
and their README/NOTICE/docs read directly.
Related: PR https://github.com/cloudflare/agents/pull/1103 (add), https://github.com/cloudflare/agents/pull/1122
(replace), https://github.com/cloudflare/agents/pull/2564 (deprecate); blog
https://blog.cloudflare.com/dynamic-workers/ (2026-03-24) and https://blog.cloudflare.com/cloudflare-computer/ (2026-08-03).

## Summary
`@cloudflare/shell` had two lives under one npm name. **0.0.2 (2026-03-13)** was a TypeScript bash
interpreter "Forked from just-bash", Apache-2.0, with a NOTICE crediting Vercel. It kept just-bash's
parser, interpreter, command set and in-memory FS, swapped native `RegExp` for RE2 (re2js), added 13
execution limits and SSRF protection, and moved SQL / JS+Python / HTML-to-Markdown behind pluggable
adapters (Durable Object SQLite or D1 for `sqlite3`, Dynamic Worker Loader isolates for `js-exec` /
`python3`, Workers AI for `html-to-markdown`). Six days later **0.1.0 (2026-03-19)** replaced it with a
different package, MIT: "**not** a bash interpreter". The LLM writes JavaScript that runs in a Dynamic
Worker (via `@cloudflare/codemode`) and calls a typed `state.*` filesystem API over RPC to a durable
`Workspace` (Durable Object SQLite, files over 1.5 MB spill to R2). Outbound network from that isolate
is blocked by default (`globalOutbound: null`). In **0.5.0 (2026-10-20)** the package was deprecated
(every version is marked deprecated on npm) in favour of `@cloudflare/computer`, whose "isolate shell"
backend runs upstream just-bash in a Dynamic Worker. So "Cloudflare's fork of just-bash" existed as a
published release for six days; Cloudflare's agent stack then went back to depending on just-bash itself.

## Key points
- **Name/owner/licence/version.** npm `@cloudflare/shell`, repo `cloudflare/agents` dir `packages/shell`.
  Latest 0.5.0 (2026-10-20), MIT, description "Deprecated: use @cloudflare/computer. ...". 0.0.0
  (2026-03-13, an empty ISC placeholder published by `threepointone`); 0.0.2 Apache-2.0; 0.1.0 onward MIT.
- **Fork relationship.** Not a GitHub fork (the shell lives in a monorepo; no `cloudflare/*` entry
  among `vercel-labs/just-bash` forks). The fork is a code-level one, stated in the 0.0.2 README,
  NOTICE and PR #1103: "Forked from just-bash (Apache-2.0, Vercel Labs)".
- **0.0.2 (bash era): what it was for.** "Runs anywhere: Cloudflare Workers, Node.js, or the browser";
  the Workers example constructs `new Shell(...)` "Inside a Durable Object or Agent". The interpreter
  itself runs in the calling isolate; only `js-exec`/`node`/`python3` go to a separate executor
  (`DynamicIsolateExecutor`: "fresh isolate"; `ChildProcessExecutor`: subprocess; `EmbeddedExecutor`:
  QuickJS/Pyodide Wasm, "Same process, sandboxed").
- **0.0.2 filesystem.** In-memory "POSIX-like" FS by default; custom `IFileSystem` allowed. Durable
  Object SQLite / D1 appear only as backends for the `sqlite3` command, not as the shell's filesystem.
- **0.0.2 network.** "disabled by default"; URL-prefix + method allow-list, `maxResponseSize`,
  optional `denyPrivateRanges` (DNS-level private-IP blocking, needs `nodejs_compat`).
- **0.0.2 vs just-bash (README "Differences from just-bash").** "structural fork, not a patch release";
  pluggable `SqlExecutor`/`CodeExecutor`/`MarkdownConverter` with zero implementations in core (no Wasm
  in core); re2js instead of native `RegExp` "to avoid ReDoS attacks"; 13 more execution limits (18
  total); response size limits and `denyPrivateRanges`; `xan` and `yq` not ported. Kept: "core bash
  interpreter, AST parser, expansion engine, command set, in-memory filesystem, `defineCommand()` API,
  and lazy command loading".
- **0.0.2 stated security.** README "Security" bullet list: no real FS access by default, no network by
  default, bounded execution, "No prototype pollution" (env uses `Map`), SSRF protection, virtual
  `/proc`. It does **not** contain an explicit "no VM isolation" statement like just-bash's.
- **0.1.0+ (state era).** PR #1122: "Replaces the old `@cloudflare/shell` (a bash interpreter forked
  from `just-bash`) ... Use `just-bash` if you need bash-like behavior." The LLM's code runs in a Dynamic
  Worker via `DynamicWorkerExecutor`; host-side `state.*` (read/write/glob/searchFiles/replaceInFiles/
  planEdits/archive/hash) plus `git.*` via isomorphic-git with host-injected credentials ("the LLM never
  sees secrets"). README "Rough command translation" maps `cat`, `grep`, `sed`, `jq`, `tar`, `git` to
  `state.*` calls.
- **0.1.0+ filesystem.** `Workspace`: "durable virtual filesystem backed by SQLite and optional R2
  large-file storage"; works with Durable Object SQLite, D1, or a custom SQL backend; one table per
  namespace `cf_workspace_<namespace>`; `inlineThreshold` default 1,500,000 bytes, above which content
  goes to R2.
- **0.1.0+ isolation/network.** Isolation boundary is the Dynamic Worker (V8 isolate) that Code Mode
  creates; outbound `fetch()`/`connect()` blocked by default via `globalOutbound: null` (Code Mode
  README). Code Mode default timeout 60000 ms. Workspace docs "Security considerations": `..`
  normalisation, namespace regex for table names, symlink depth cap 40 (`ELOOP`), 100 MB stream cap,
  10,000-line diff cap.
- **Deprecation.** PR #2564 (merged 2026-10-14) and 0.5.0 README: "Deprecated. Use
  `@cloudflare/computer`". Every npm version carries the deprecation message.
- **Successor uses just-bash directly.** `cloudflare/computer` README: "**Isolate shell** runs
  just-bash in a Dynamic Worker." The Computer blog (2026-08-03) says the same.
- **Advisories.** `cloudflare/agents` repository security advisories list two (GHSA-r7x9-8ph7-w8cg IDOR in
  email routing; GHSA-w5cr-2qhr-jqc5 XSS in AI Playground), neither about `shell`. The global GitHub
  Advisory DB query for `@cloudflare/shell` (npm) returned an empty list.
- **Blog.** No Cloudflare blog post announces `@cloudflare/shell` on its own. It is a short "File
  manipulation" section in "Sandboxing AI agents, 100x faster" (Kenton Varda, Sunil Pai, 2026-03-24,
  https://blog.cloudflare.com/dynamic-workers/), and that section describes the 0.1.0+ `state` API, not
  the bash fork.
- **Upstream reference (read 2026-11-23).** just-bash latest npm 3.6.1 (published 2026-11-16,
  Apache-2.0); repo pushed 2026-11-20. Its "Security Model" section (packages/just-bash/README.md) still
  says "All execution happens without VM isolation."

## Excerpts
> "A runtime-agnostic bash interpreter with an in-memory filesystem, 80+ built-in commands, and pluggable backends for SQL, code execution, and HTML-to-Markdown conversion. Runs anywhere: Cloudflare Workers, Node.js, or the browser.
>
> Forked from [just-bash](https://github.com/vercel-labs/just-bash) (Apache-2.0, Vercel Labs)." — @cloudflare/shell 0.0.2 README, intro

> "This product includes software derived from just-bash (https://github.com/vercel-labs/just-bash), which is licensed under the Apache License, Version 2.0. Original Copyright 2024-2025 Vercel, Inc." — @cloudflare/shell 0.0.2 NOTICE

> "`@cloudflare/shell` is a structural fork, not a patch release. The interpreter and parser heritage is shared, but the packaging, runtime model, and capability surface are substantially different." — 0.0.2 README, "Differences from just-bash"

> "just-bash uses native JavaScript `RegExp` for `grep`, `sed`, and `awk`. `@cloudflare/shell` uses [re2js](https://github.com/le0pard/re2js) — a pure-JS port of RE2 — to avoid ReDoS attacks from user-supplied patterns. This is critical when running untrusted shell scripts." — 0.0.2 README, "Regex engine"

> "just-bash has 5 configurable execution limits (...). `@cloudflare/shell` adds 13 additional limits covering string length, array size, output size, heredoc size, brace expansion, glob operations, file descriptors, command substitution depth, source file nesting, and per-language execution timeouts. All are designed to prevent resource exhaustion in multi-tenant environments." — 0.0.2 README, "Execution limits"

> "`@cloudflare/shell` additionally supports response size limits and optional DNS-level private IP blocking (`denyPrivateRanges`) to prevent SSRF via DNS rebinding." — 0.0.2 README, "Network security"

> "Runs code in isolated V8 workers using Cloudflare's Dynamic Worker Loader API. User code is embedded as module source and loaded into a fresh isolate — no `eval()` or `new Function()` needed. Enables `js-exec`, `node`, `python3`, and `python` commands" — 0.0.2 README, "`DynamicIsolateExecutor`"

> "**Replaces** the old `@cloudflare/shell` (a bash interpreter forked from `just-bash`) with a new `@cloudflare/shell` — a sandboxed JS execution and filesystem runtime for agents. Use [`just-bash`](https://www.npmjs.com/package/just-bash) if you need bash-like behavior." — PR #1122 description (merged 2026-03-19)

> "This is **not** a bash interpreter. It does not parse shell syntax, expose pipes, or emulate POSIX shell behavior. It executes JavaScript." — @cloudflare/shell 0.5.0 README, "What it is not"

> "Instead of parsing shell syntax, `@cloudflare/shell` runs JavaScript inside an isolated Worker and exposes a typed `state` object for operating on a filesystem backend." — 0.5.0 README, intro

> "Secure execution with isolate-level timeouts and outbound network blocking by default" — 0.5.0 README, "Design goals"

> "Files below the inline threshold (default 1.5 MB) are stored directly in SQLite. Larger files store metadata in SQLite and content in R2" — 0.5.0 docs/index.md, "R2 large-file storage"

> "External `fetch()` and `connect()` are **blocked by default** — enforced at the Workers runtime level via `globalOutbound: null`. Sandboxed code can only interact with the host through namespaced tool calls." — @cloudflare/codemode 0.5.6 README, "Network isolation"

> "**Deprecated.** Use [`@cloudflare/computer`](https://github.com/cloudflare/computer) for new agent workspaces." — 0.5.0 README banner (PR #2564)

> "@cloudflare/shell gives your agent a virtual filesystem inside a Dynamic Worker. Agent code calls typed methods on a state object — read, write, search, replace, diff, glob, JSON query/update, archive — with structured inputs and outputs instead of string parsing. Storage is backed by a durable Workspace (SQLite + R2), so files persist across executions." — blog "Sandboxing AI agents, 100x faster", 2026-03-24, "File manipulation"

> "Although all sandboxing mechanisms have bugs, security bugs in V8 are more common than security bugs in typical hypervisors. When using isolates to sandbox possibly-malicious code, it's important to have additional layers of defense-in-depth." — same post, "Battle-hardened security"

> "**Isolate shell** runs [just-bash](https://github.com/vercel-labs/just-bash) in a Dynamic Worker. It reaches the authoritative Workspace over Workers RPC, so there is no second store or sync round trip." — cloudflare/computer README

> "An isolate-based runtime environment that uses just-bash to translate shell code into JavaScript runs in a dynamic worker." — blog "Your agent needs a computer, not a container — introducing @cloudflare/computer", 2026-08-03

> "All execution happens without VM isolation. This does introduce additional risk. The code base was designed to be robust against prototype-pollution attacks and other break outs to the host JS engine and filesystem." — just-bash packages/just-bash/README.md, "Security Model" (main, read 2026-11-23; npm latest 3.6.1)

## Relevance to the talk
Useful as a short story, with one caution: do not present "Cloudflare's shell" as a maintained
just-bash fork. The bash fork shipped as `@cloudflare/shell` 0.0.2 for six days (2026-03-13 to
2026-03-19), then the name was reused for a JS-plus-typed-API design, and that was deprecated in
October 2026. Its hardening deltas still make good slide material, because they show what a cloud
provider adds to a simulated shell before putting it in front of many tenants: RE2 against ReDoS from
model-written regexes, 18 resource limits, SSRF/DNS-rebinding blocking, and code execution pushed out
to a fresh V8 isolate instead of in-process Wasm. The pivot is itself a design argument: instead of
emulating POSIX, give the model a typed capability API (`state.*`, `git.*` with host-held tokens) in an
isolate whose network is off (`globalOutbound: null`). The isolation boundary is V8 plus Cloudflare's
extra layers, not a hypervisor; Cloudflare's own post admits V8 bugs are more common than hypervisor
bugs. Cloudflare's current stack (`@cloudflare/computer`) runs upstream just-bash in a Dynamic Worker
and adds a container backend for real binaries, the same "simulated shell first, VM/container when
needed" escalation that Vercel's README recommends.
