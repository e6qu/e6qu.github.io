---
title: "@minimax-ai/code 0.7.9 (MiniMax Code CLI, `mcode`) — npm bundle and changelog"
url: https://www.npmjs.com/package/@minimax-ai/code
authors: MiniMax
date: 0.7.9 published 2026-11-20 (changelog at https://code.minimax.io/docs/changelog.md, desktop v3.1.16 on 2026-11-16)
accessed: 2026-11-22
kind: package
---

## Summary
The MiniMax Code docs mention "sandboxing" but never name a mechanism, so this note reads the shipped CLI bundle. It contains a vendored copy of Anthropic's open-source sandbox-runtime. The evidence is `[sandbox-runtime]` log strings, a "sandbox-runtime ephemeral CA" for its credential-injecting proxy, the "Linux HTTP bridge socket" error, and the `autoAllowBashIfSandboxed` / `enableWeakerNestedSandbox` settings. I found no attribution in the package's `THIRD_PARTY_NOTICES.md`. Per OS: `sandbox-exec` on macOS; `bwrap` with seccomp on Linux, adding `--unshare-net` when network is restricted; and on Windows an `srt-win.exe` helper that stamps ACLs for a separate sandbox user SID. The defaults are fully open: `enabled:false`, filesystem `full_access`, network `allow_all`.

## Key points
These points come from reading the bundle, not from MiniMax documentation.
- Default config: `function hm(e){return{enabled:!1,filesystemMode:"full_access"}}`, wrapped into `{enabled, filesystem:{policy:{mode}}, network:{policy:{mode:"allow_all"},deniedDomains:[]}, localAccess:"open"}`.
  - Filesystem modes: `read_only`, `workspace_write`, `delete_guard` and `full_access`. Setting `sandbox.enabled` without a mode gives `delete_guard`.
  - Network modes: `deny` and `allow_all`.
- macOS: `sandbox-exec` with an SBPL profile; the strings `(allow default)` and `deny network` are present.
- Linux: `bwrap`, adding `--unshare-net` plus an HTTP/SOCKS bridge socket when network is restricted, and seccomp filters.
- Windows: the CLI runs `srt-win acl stamp --holder-pid … --sandbox-user-sid …` and later `acl restore`, which grants and revokes ACLs for a dedicated sandbox user. `srt-win.exe` is referenced under `vendor/srt-win/` but is not in the npm tarball, so it is presumably fetched or bundled with the desktop app (unverified).
- Permission interplay: with `sandboxEnabled && autoAllowBashIfSandboxed`, Bash "ask" rules are bypassed.
- Changelog (https://code.minimax.io/docs/changelog.md):
  - 0.4.8 (2026-09-16): Explore subagents get "a read-only filesystem policy when sandboxing is available".
  - 0.6.9 (2026-10-12): trash-instead-of-rm deletion; "Dynamic targets still require explicit approval when no sandbox is enabled, unless full permission was explicitly granted".
  - 0.7.0 (2026-10-26): Programmatic Tool Calling runs `run_code` "in a sandbox". That one is a QuickJS/WASM worker (`quickjs-worker.js`, `emscripten-module.wasm`), not the OS sandbox (inference).
- Permission modes (corpus note): Ask / Auto / Full access; headless `--permission ask|smart|full|off`.

## Excerpts
> "with a read-only filesystem policy when sandboxing is available" (CHANGELOG 0.4.8, 2026-09-16)

> "Dynamic targets still require explicit approval when no sandbox is enabled, unless full permission was explicitly granted." (CHANGELOG 0.6.9, 2026-10-12)

> `{enabled:!1,filesystemMode:"full_access"}` … `network:{policy:{mode:"allow_all"}` (0.7.9 bundle, `chunks/chunk-LXLQL23L.js`)

## Relevance to the talk
MiniMax is a third Chinese coding agent, after Tencent (formerly) and Baidu, that ships Anthropic's sandbox-runtime rather than its own boundary, without attributing it. Like many Western CLIs, it ships with the sandbox off and the network open by default.
