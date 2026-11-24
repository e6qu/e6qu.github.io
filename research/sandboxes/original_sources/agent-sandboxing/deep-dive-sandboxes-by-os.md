---
title: "How coding agents sandbox the commands they run: a per-OS deep dive (macOS, Linux, Windows, WSL)"
url: https://github.com/anthropics/sandbox-runtime
authors: Compiled for this talk from vendor source code and docs (Anthropic, OpenAI, Google, Anysphere/Cursor, GitHub/Microsoft, Zed Industries, AWS, Factory, Cognition, Kilo, JetBrains, Qwen, Anomaly, AAIF)
date: 2026-11-22
accessed: 2026-11-22
kind: report
---

# How coding agents sandbox the commands they run, per OS

[top-coding-agents-matrix.md](top-coding-agents-matrix.md) says *which* agents ship a sandbox. This report says *how each one works*: the primitive, the policy text, and the plumbing that gets a domain allowlist into a process that has no network. Where code is public I read the code. Everything else comes from vendor docs and is marked as such. "Not documented" means I looked and the vendor does not say.

**Versions read (source):**

| Repo | Commit / tag | Date | Single-source note |
|---|---|---|---|
| anthropics/sandbox-runtime (srt) | v0.0.83, `0bbebed` | 2026-11-12 | [srt-source-seatbelt-bwrap-seccomp.md](srt-source-seatbelt-bwrap-seccomp.md) |
| openai/codex | main `61cb947` | 2026-11-22 | [codex-sandboxing-source.md](codex-sandboxing-source.md) |
| google-gemini/gemini-cli | main `eecccfc` (0.71.0-nightly) | 2026-11-20 | [gemini-cli-tool-sandbox-source.md](gemini-cli-tool-sandbox-source.md) |
| zed-industries/zed | main `d31d107` | 2026-11-22 | [zed-sandbox-crates.md](zed-sandbox-crates.md) |
| microsoft/mxc | main `5c331f2` (SDK 1.1.0) | 2026-11-21 | [mxc-seatbelt-bubblewrap-backends.md](mxc-seatbelt-bubblewrap-backends.md) |
| Kilo-Org/kilocode | main `83a0856` | 2026-11-22 | (this report) |
| QwenLM/qwen-code | main `18ac669a` (0.28.3) | 2026-11-22 | [agent-qwen-code.md](agent-qwen-code.md) |
| anomalyco/opencode | dev `8ba4445` (2.3.0; release v2.3.2) | 2026-11-22 | [opencode-v2-permissions.md](opencode-v2-permissions.md) |
| aaif-goose/goose | `36b2911` | 2026-11-20 | [agent-goose.md](agent-goose.md) |
| microsoft/vscode | main `611b35e` | 2026-11-22 | [agent-vscode-copilot-agent-mode.md](agent-vscode-copilot-agent-mode.md) |
| cline/cline | `8075d2e` | 2026-11-20 | [agent-cline.md](agent-cline.md) |

Closed source, so docs only: Cursor ([cursor-run-modes-sandbox-docs.md](cursor-run-modes-sandbox-docs.md)), Claude Code itself (its sandbox is srt), Copilot CLI (its sandbox is MXC), Antigravity, Kiro, Factory Droid, Devin Local, Junie, Warp and Amp.

**Two reuse facts frame everything below.**
- Anthropic's **srt** is used by Claude Code, by JetBrains Junie CLI, and by VS Code's legacy terminal sandbox (npm `@vscode/sandbox-runtime` 0.0.1 lists `anthropic-experimental/sandbox-runtime` as its repository). Kilo Code ships srt's `apply-seccomp` binary.
- Microsoft's **MXC** is used by Copilot CLI and VS Code's Copilot harness on all three OSes, by Factory Droid on Windows, and as opt-in backends of Codex and srt on Windows.
- So two libraries sit underneath most agents that ship a sandbox.

---

## 1. macOS

### How agents use the platform
macOS gives an unprivileged process exactly one usable confinement primitive: **Seatbelt**. It is a TrustedBSD MAC policy module whose policy is a Scheme dialect (SBPL) compiled in userspace. It has been documented as deprecated for years ([../macos-windows/macos-sandbox-exec-man-pages.md](../macos-windows/macos-sandbox-exec-man-pages.md)). Every macOS agent sandbox in this survey is Seatbelt, and they share a recipe:

1. **Entry point.** Most agents run `/usr/bin/sandbox-exec -p '<profile string>' -- cmd` (srt, Codex) or `-f <file>` (Zed, Gemini). MXC is the exception: it calls `sandbox_init()` itself between `fork()` and `exec()` in `mxc-exec-mac`. Codex pins the absolute path "to defend against an attacker trying to inject a malicious version on the PATH". Children inherit the policy, so the whole process tree is confined.
2. **Profile shape.** The profile starts `(version 1)(deny default)`, and the allow rules are copied from **Chromium's renderer policy**: Codex's `.sbpl` cites `chromium/src/sandbox/policy/mac/common.sb`, srt says "based on Chrome sandbox policy", and Gemini's profiles cite the same Chromium lines. The common allows are:
   - `process-exec`/`process-fork`;
   - `signal` and `process-info*` restricted to `(target same-sandbox)`;
   - a `sysctl-read` allowlist;
   - a *named* `mach-lookup` allowlist (trustd, SecurityServer, configd for TLS and DNS).
   Gemini's tool sandbox instead does `(import "system.sb")` to "avoid \"Abort trap: 6\"".
3. **Filesystem.** Almost everyone does `(allow file-read*)` (read the whole disk) and then `(allow file-write* (subpath <workspace>) (subpath <tmp>))` with `require-not` carve-outs for protected paths. Seatbelt can express globs and regexes, so macOS is the platform where protected-path lists are most complete.
4. **Network.** Seatbelt has no notion of domains, and its `network-outbound` filter accepts only `localhost` or `*` as host. So every agent that filters by domain allows **only** `(remote ip "localhost:<proxyPort>")` and runs an HTTP CONNECT/SOCKS5 proxy in the (unsandboxed) agent process. The proxy matches the hostname against the allowlist and dials out. Processes reach the proxy through `HTTP(S)_PROXY`/`ALL_PROXY`; tools that ignore those variables simply fail to connect.
   srt's comments document two traps. `(local ip …)` on outbound matches the *source* address, which is `INADDR_ANY` at `connect()`, so it "admits every outbound connection". And Seatbelt's `localhost` does not match IPv4-mapped `::ffff:127.0.0.1`, which is why srt forces Java onto AF_INET.
5. **What Seatbelt does not do:** hide processes (a sandboxed `ps` sees the host), limit memory or CPU, or isolate Mach services that the profile allows. srt and Claude Code document `allowMachLookup` services as unconfined.

### Table: macOS

| Agent | Mechanism | Confines | FS default | Network | On by default? | Escape hatch | Links |
|---|---|---|---|---|---|---|---|
| **Claude Code** (srt) | `env … /usr/bin/sandbox-exec -p <generated>`; `(deny default (with message …))` | Bash, PowerShell, Monitor tool commands + children. Not: Read/Edit/Write tools, hooks, MCP, LSP, `!` commands | R: whole disk (incl. `~/.ssh` unless `denyRead`); W: CWD + temp + `--add-dir`; mandatory denies | Only `localhost:<http>`/`<socks>`; host proxy, allowlist starts empty, new host prompts | **No** (`/sandbox`) | Retry with `dangerouslyDisableSandbox` (on unless `allowUnsandboxedCommands:false`); `failIfUnavailable` default false | [srt macos-sandbox-utils.ts](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/macos-sandbox-utils.ts), [docs](https://code.claude.com/docs/en/sandboxing) |
| **Codex CLI** | `/usr/bin/sandbox-exec -p` + 4 `.sbpl` files + `-DWRITABLE_ROOT_n` params | Every shell command + children; `codex sandbox <cmd>` for arbitrary tools | `workspace-write`: workspace + `$TMPDIR` + `/tmp`; `.git`, `.agents`, `.codex`, `.aws` read-only; broad reads | Off; proxy mode allows only `localhost:<port>`; DNS only after a request is allowed | **Yes** (`workspace-write` + `on-request`) | Per-command `require_escalated` (user or `auto_review`); `danger-full-access` | [seatbelt_base_policy.sbpl](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl), [seatbelt.rs](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt.rs) |
| **Gemini CLI** | Whole-CLI: `sandbox-exec -D… -f sandbox-macos-<profile>.sb` (default `permissive-open`); tool sandbox: `sandbox-exec -f` with `(import "system.sb")` | Whole CLI process, or individual tool runs (`toolSandboxing`, default false) | Project writes, all reads; `~/.gemini` and OAuth files write-denied; Docker sockets and binaries denied | `permissive-open`: `(allow network-outbound)`; `*-proxied` via proxy; tool layer on/off only | **No** (`-s`) | Sandbox Expansion Request prompt; `--yolo` | [sandbox-macos-permissive-open.sb](https://github.com/google-gemini/gemini-cli/blob/main/packages/cli/src/utils/sandbox-macos-permissive-open.sb), [baseProfile.ts](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/macos/baseProfile.ts) |
| **Antigravity** (App, `agy`) | Seatbelt `sandbox-exec` with SBPL (docs; closed source) | Agent terminal commands | Project rw; `~/.ssh`, `.env` blocked; unmounted paths invisible | Closed; `read_url` domains join an allowlist (enforcement not documented) | **App yes** (Default preset); CLI yes via `auto` mode | Turbo / `always-proceed` = `--dangerously-skip-permissions`; `unsandboxed(...)` rules (business) | [docs](https://antigravity.google/docs/sandbox/) |
| **Cursor** | Seatbelt via `sandbox-exec`, generated profile (docs; closed) | Shell commands only (MCP/Fetch go to classifier) | Workspace rw; reads system-wide (default) or Workspace (3.23+); protected list incl. `.git/hooks/**`, `.git/config`, `.vscode/**`, `.cursor/*.json`, `.claude/*.json` | Blocked, then sandbox.json + ~100 default domains; proxy (CLI changelog) | **Yes** (since 2.0, 2025-10-29) | Classifier-reviewed rerun outside sandbox; allowlisted commands run outside | [run modes](https://cursor.com/docs/agent/security/run-modes), [sandbox.json](https://cursor.com/docs/reference/sandbox) |
| **Copilot CLI** | MXC → `mxc-exec-mac` applies generated profile with `sandbox_init()` (macOS 15+) | Shell, rg-based grep/glob, local MCP and LSP servers (default) | Deny-by-default: cwd + temp rw; repo readable; `.git` writable; home not granted | **Outbound open**, local closed; host rules via local proxy; credential masking | **No** (`/sandbox enable`) | Bypass requests on by default (approved bypass also skips proxy) | [GitHub docs](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes), [MXC Seatbelt backend](https://github.com/microsoft/mxc/blob/main/docs/backends/seatbelt/seatbelt-backend.md) |
| **VS Code Copilot agent** | Copilot harness: Copilot SDK runtime (MXC); legacy Local harness: `@vscode/sandbox-runtime` (srt fork) | Terminal + local MCP/LSP (settings) | cwd rw + dev-tool caches; rw/ro/deny lists | **Outbound open** by default (`allowNetwork: true`), local closed | **No** | "Allow Outside Sandbox" (`allowUnsandboxedCommands` default true) | [docs](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) |
| **Zed Agent** | `sandbox-exec -f <cfg>`; `(deny default)`, `(allow file-read*)`, mach-lookup allowlist | Zed Agent `terminal` + `fetch` only (not LSP, tasks, external ACP agents) | Project dirs rw except Git metadata; per-thread `$TMPDIR` | Closed; `(allow network-outbound (remote tcp "localhost:{port}"))` to Zed's proxy | **Yes** | Per-request grants; `allow_unsandboxed` default false | [macos_seatbelt.rs](https://github.com/zed-industries/zed/blob/main/crates/sandbox/src/macos_seatbelt.rs), [docs](https://zed.dev/docs/ai/sandboxing) |
| **Kiro** | Seatbelt via `sandbox-exec` (docs; closed) | Shell + children; stdio MCP if `mcpSandboxing` | Shaped by `fs_read`/`fs_write` rules | `DEFAULT_BLOCKED` via proxy; `COMMON_DEPENDENCIES`, `DEFAULT_ALLOWED` | **No**; forced on by `/autonomous on` | Org can require; project file can only tighten | [docs](https://kiro.dev/docs/sandbox/) |
| **Factory Droid** | Seatbelt profiles (docs; closed) | `per-command` (default) or `whole-process` (incl. MCP, subagents); hooks wrapped | Reads ok; W: CWD + `allowWrite` | Deny except Factory/WorkOS; `allowedDomains` via HTTP/SOCKS proxy | **No** | Fails closed; `--skip-permissions-unsafe` | [docs](https://docs.factory.com/autonomy-and-safety/sandbox) |
| **Devin Local / Devin CLI** | "OS-level isolation"; macOS primitive **not documented** | Shell; edit tools run outside (always prompt) | Workspace + `Write()` grants | **Open** by default; opt-in loopback proxy ("unstable") | **No** (`--sandbox`) | `sandbox.excluded` `Exec(...)` rules run outside; fails closed | [docs](https://docs.devin.ai/cli/sandbox) |
| **Kilo Code** | `sandbox-exec`; base profile is Codex's (`(deny default)` + same sysctl list) | Agent tools (bash etc.); not MCP lifecycle, plugin hooks | W: workspace + Kilo dirs; `.git` ro; reads unrestricted | Deny; proxy mode `(allow network-outbound (remote ip "localhost:<port>"))` + SNI-checking proxy | **No** | Mutating git → one-shot unsandboxed escalation | [seatbelt-base.ts](https://github.com/Kilo-Org/kilocode/blob/main/packages/kilo-sandbox/src/seatbelt-base.ts), [seatbelt-network.ts](https://github.com/Kilo-Org/kilocode/blob/main/packages/kilo-sandbox/src/seatbelt-network.ts) |
| **Junie CLI** | srt (JetBrains build), EAP | Terminal commands; native edit tools restricted | Project, git dirs, temp, tool caches | **Open** by default; `allowedDomains` opt-in | **No** (`--sandbox`) | Global-only policy; edits need one-shot approval | [docs](https://junie.jetbrains.com/docs/junie-cli.html) |
| **Qwen Code** | Whole-CLI Seatbelt (Gemini-derived profiles), default `permissive-open` | Whole CLI | Project writes, broad reads | Open (default profile) | **No** | `--yolo` does not enable sandbox | [docs](https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/) |
| Cline, OpenCode (1.x and 2.x), goose, Aider, Warp, Amp, Augment, Crush | **None** (goose's opt-in Seatbelt, v1.25.0, was removed) | — | User's full access; tool-level rules only | None | — | — | [opencode-v2-permissions.md](opencode-v2-permissions.md), [agent-goose.md](agent-goose.md) |

### macOS details

**Claude Code / srt.** The profile is generated per command. Its head, verbatim from `macos-sandbox-utils.ts` (v0.0.83):
```scheme
(version 1)
(deny default (with message "<logTag>"))
; Essential permissions - based on Chrome sandbox policy
(allow process-exec)
(allow process-fork)
(allow process-info* (target same-sandbox))
(allow signal (target same-sandbox))
```
With the network restricted, the only network rules are the proxy ports:
```scheme
(allow network-outbound (remote ip "localhost:${httpProxyPort}"))
(allow network-outbound (remote ip "localhost:${socksProxyPort}"))
```
Unix sockets need three separate allowances (`system-socket (socket-domain AF_UNIX)`, `network-bind`, `network-outbound (remote unix-socket …)`) and are blocked unless configured. The mandatory write-deny list is in `sandbox-utils.ts`: `.gitconfig`, `.gitmodules`, shell rc files, `.ripgreprc`, `.mcp.json`, `.vscode`, `.idea`, `.claude/commands`, `.claude/agents`, `.git/hooks`, `.git/config`. It is matched case-insensitively. Claude Code adds its own settings files and `~/.claude` (docs). The `with message` tag lets srt find its own denials in the macOS sandbox log and feed them back to the model.

**Codex.** The base policy file `seatbelt_base_policy.sbpl` begins:
```scheme
(version 1)
; inspired by Chrome's sandbox policy: …/sandbox/policy/mac/common.sb
; start with closed-by-default
(deny default)
; child processes inherit the policy of their parent
(allow process-exec)
(allow process-fork)
(allow signal (target same-sandbox))
```
Writable roots are passed as `-D` parameters and expanded into a single `require-all`:
```scheme
(allow file-write*
  (require-all (subpath (param "WRITABLE_ROOT_0"))
    (require-not (literal (param "WRITABLE_ROOT_0_EXCLUDED_0")))
    (require-not (subpath (param "WRITABLE_ROOT_0_EXCLUDED_0")))))
```
The `literal` carve-out exists because "`subpath` alone leaves a gap for first-time creation of the protected directory itself, such as `mkdir .codex`". This is exactly the bug class behind Claude Code's CVE-2026-25725 on Linux. The network policy file adds only AF_SYSTEM sockets and TLS/DNS mach services. Proxy ports are injected as `localhost:<port>`, and tests assert that no `*:53` DNS rule exists. DNS is resolved by the proxy only after the request is allowed ([openai-inside-the-codex-sandbox.md](openai-inside-the-codex-sandbox.md)).

**Gemini CLI.** Gemini CLI has two layers. The whole-CLI profile `permissive-open` was rewritten in 2026 from `(allow default)` to `(deny default)` ("do not switch to (allow default)"). It still ends with `(allow network-outbound)`, and it adds an unusually specific container block list:
```scheme
(deny file-read* file-write* (literal "/var/run/docker.sock") (subpath (string-append (param "HOME_DIR") "/.orbstack/run")) …)
(deny process-exec (literal "/opt/homebrew/bin/docker") (subpath "/Applications/OrbStack.app/Contents/MacOS/") …)
(deny mach-lookup (xpc-service-name-prefix "com.docker.") (global-name-prefix "dev.kdrag0n.OrbStack"))
```
The newer tool sandbox (`packages/core/src/sandbox/macos/`) is all-or-nothing on network. Its `security.toolSandboxing` setting defaults to **false** in `settingsSchema.ts` and `config.ts`, even though the sandbox guide is written as if it were on.

**Cursor** (docs only). "Cursor uses Seatbelt through `sandbox-exec`. A generated sandbox profile limits file access, network access, and other process behavior for the full subprocess tree." Sandboxing has been on by default on macOS since 2.0 (2025-10-29). The protected-path list now includes *another vendor's* config (`.claude/*.json`), a direct result of CVE-2026-48124. The internal helper is called `cursorsandbox`; only the advisory GHSA-3p48-7v9f-v5cw names it.

**MXC-based (Copilot CLI, VS Code Copilot harness).** MXC "translates your JSON policy into a Seatbelt profile and applies it with `sandbox_init()` between `fork()` and `exec()`. The profile is passed as a string — no temp files." It requires macOS 15. Its capability table says inbound is "All-or-nothing — cannot be scoped". The policy is the opposite of the srt/Codex default: GitHub ships **outbound open** and closes only local network.

**Zed.** The profile opens with `(deny default)` / `(allow file-read*)` and uses a mach-lookup "ALLOWLIST, not a blanket `(allow mach-lookup)`". The proxy rule is `(allow network-outbound (remote tcp "localhost:{port}"))`. Zed's `allowed_unix_sockets` policy field is honoured only on macOS: "The Linux and WSL backends reject any policy that lists a socket."

**Kilo Code.** `seatbelt-base.ts` is byte-for-byte the start of Codex's base policy (`(deny default)`, the same `/dev/null` rule and sysctl list). Proxy mode emits:
```scheme
(deny network-outbound (with message "Sandbox denied direct outbound network access"))
(allow network-outbound (remote ip "localhost:${proxy.port}"))
```

---

## 2. Linux

### How agents use the platform
Linux has no single sandbox call. Agents compose primitives ([../os-primitives/README.md](../os-primitives/README.md)), and three approaches are in use:

1. **bubblewrap (namespaces) + seccomp-BPF.** This is the majority design: srt/Claude Code, Codex, Zed, MXC (Copilot CLI, VS Code), Kiro, Factory, Devin Local, Kilo, Junie and the Qwen/Gemini tool sandboxes.
   - **Filesystem:** an unprivileged `bwrap` creates a user + mount namespace, `--ro-bind / /` (whole host read-only), then `--bind` each writable root, then `--ro-bind` protected paths *over* them ("later binds win").
   - **Namespaces:** `--unshare-pid` + `--proc /proc` hides host processes. srt: "If we don't have --unshare-pid, it is possible to escape the sandbox".
   - **Network:** `--unshare-net` leaves only a private loopback.
   - **seccomp** then closes what namespaces leave open, as the next subsection describes.
2. **Landlock + seccomp.** Used by Cursor (kernel 6.2+, Landlock v3) and by Qwen's fallback (ABI ≥ 3, reported as "partial"). Codex used it from 2025-05 and demoted it to a deprecated "legacy" option after vendoring bubblewrap in 2026-02, because Landlock "cannot isolate app-server Unix sockets". Landlock needs no namespaces, but it cannot create a network namespace, so "network closed" needs seccomp or bwrap on top.
3. **Containers / user-space kernel** (Gemini CLI whole-CLI mode: Docker/Podman, gVisor `runsc`, LXC; Qwen Docker; OpenHands Docker). These are opt-in and outside the scope of "native" sandboxes.

**Why seccomp is still needed after `--unshare-net`.** Unix-domain sockets are not network-namespaced by path. Zed's source comment puts it plainly: "a read-only bind mount does not stop `connect()` to a unix socket". So a sandboxed command could reach `/var/run/docker.sock`, the D-Bus session bus, an ssh-agent or WSL's interop socket, and run code outside. Agents therefore deny `socket(AF_UNIX)` creation, and they deny `io_uring` too, because `IORING_OP_SOCKET` (5.19+) creates sockets without the `socket()` syscall.

**Getting a domain allowlist into an empty network namespace.** Three designs exist:
- **socat over a bind-mounted Unix socket** (srt; Kiro and Devin Local document a `socat` dependency). The host runs `socat UNIX-LISTEN:/tmp/claude-http-<id>.sock,fork TCP:localhost:<proxy>`. Inside, a second socat listens on `localhost:3128` (HTTP) and `localhost:1080` (SOCKS) and forwards to the bind-mounted socket. `HTTP_PROXY=http://localhost:3128` is set, and `GIT_SSH_COMMAND` uses socat for SOCKS. seccomp is applied *after* the inner socats start, so the workload cannot open new Unix sockets.
- **In-helper TCP→UDS relay** (Codex `codex-linux-sandbox`, Zed's `--zed-linux-sandbox-launcher`). Same idea without socat: the helper re-execs itself inside the namespace, runs the bridge, then installs seccomp and `exec`s the command. Codex also has an experimental *transparent* mode: a TUN device and an in-helper TCP stack, plus a DNS stub mapping names to `198.18.0.0/15`, so non-proxy-aware clients (`psql`) are attributed by name.
- **slirp4netns + in-namespace iptables** (MXC → Copilot CLI, VS Code). A user-mode TCP/IP stack gives the namespace real connectivity, and `iptables`/`ip6tables` chains *inside* the namespace enforce egress, with "no root needed". That is why VS Code's Linux prerequisites list `slirp4netns`, util-linux ≥ 2.35 and iptables.

**Platform friction.**
- Ubuntu 23.10+/24.04 restrict unprivileged user namespaces through AppArmor (`kernel.apparmor_restrict_unprivileged_userns`). bwrap then fails unless a profile is installed: Cursor ships `cursor-sandbox-apparmor`, Junie ships `junie-sandbox-setup.sh`, and Zed tells users to add an AppArmor profile.
- Zed refuses setuid-root `bwrap`.
- Codex takes the first `bwrap` on `PATH` *outside the cwd* (so a repo cannot plant one), else its bundled copy.
- Kilo verifies a bundled binary's SHA-256.

### Table: Linux

| Agent | Mechanism | Confines | FS default | Network | On by default? | Escape hatch | Links |
|---|---|---|---|---|---|---|---|
| **Claude Code** (srt) | `bwrap --unshare-net --unshare-pid --unshare-user --proc /proc --dev /dev --die-with-parent` + `--ro-bind`/`--bind`; `apply-seccomp` (optional; warns if missing) | Bash/PowerShell/Monitor + children | As macOS; globs expanded with `rg` at wrap time; non-existent deny paths not covered | netns + 2× socat → host HTTP/SOCKS proxy; UDP/QUIC/ICMP cannot leave | **No** | As macOS; `enableWeakerNestedSandbox` for Docker | [linux-sandbox-utils.ts](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts), [seccomp-unix-block.c](https://github.com/anthropics/sandbox-runtime/blob/main/vendor/seccomp-src/seccomp-unix-block.c) |
| **Codex CLI** | `codex-linux-sandbox`: bwrap (`--new-session --die-with-parent --unshare-user --unshare-pid --unshare-ipc [--unshare-net] --proc`) + seccompiler + `PR_SET_NO_NEW_PRIVS`; Landlock deprecated | Every shell command; also MCP via `codex sandbox` | `--ro-bind / /`; workspace rw; `.git`(incl. resolved `gitdir:`)/`.codex` ro; deny globs masked | Restricted: seccomp blocks `connect`/`bind`/… ; proxy: in-helper TCP→UDS bridge; transparent-TCP (TUN) experimental | **Yes** | As macOS | [bwrap.rs](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/src/bwrap.rs), [seccomp.rs](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/src/seccomp.rs), [README](https://github.com/openai/codex/tree/main/codex-rs/linux-sandbox) |
| **Gemini CLI** | Tool sandbox: `bwrap --unshare-all [--share-net] --ro-bind / / --tmpfs /tmp --seccomp 9`; whole-CLI: Docker/Podman/runsc/LXC | Tools or whole CLI | Workspace rw, `/` ro, private `/tmp` | On/off only (`--share-net`), YOLO ⇒ network on | **No** | Expansion request; `--yolo` | [bwrapArgsBuilder.ts](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/linux/bwrapArgsBuilder.ts), [LinuxSandboxManager.ts](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/linux/LinuxSandboxManager.ts) |
| **Antigravity** | "Kernel namespaces" (tool not named) | Terminal commands | As macOS | As macOS | App yes; CLI via `auto` (needs unprivileged userns) | As macOS | [docs](https://antigravity.google/docs/sandbox/) |
| **Cursor** | Landlock v3 (kernel ≥ 6.2) + seccomp; bubblewrap fallback (`CURSOR_SANDBOX_LANDLOCK_STATUS=bubblewrap`); else **asks for approval** | Shell | Workspace rw; overlay FS hides `.cursorignore`d files (blog) | Default-deny proxy (CLI changelog) | **Yes** where supported | As macOS | [run modes](https://cursor.com/docs/agent/security/run-modes), [blog](https://cursor.com/blog/agent-sandboxing) |
| **Copilot CLI / VS Code** | MXC bubblewrap backend: `--ro-bind-try --clearenv --seccomp FD`, unshare user/pid/ipc/uts; bwrap ≥ 0.5.0 | As macOS | As macOS | Deny: `--unshare-net`; allow/proxy: slirp4netns + in-netns iptables; "bubblewrap cannot separately control local-network access" (GitHub docs) | **No** | As macOS | [MXC bwrap backend](https://github.com/microsoft/mxc/blob/main/docs/backends/bwrap/bubblewrap-backend.md) |
| **Zed Agent** | Non-setuid bwrap (`--ro-bind / /`, `--bind` per project, `--unshare-user/-ipc/-uts/-pid/-cgroup-try`, `--unshare-net`, `--tmpfs /tmp`) + launcher-installed seccomp; experimental seccomp-unotify `sandbox_linux` (2026-11-17) | terminal + fetch | Project rw (inode-pinned, re-validated in sandbox); `.git` ro (only if it exists) | Launcher TCP→UDS bridge to in-process proxy | **Yes** (unsandboxed with warning if no usable bwrap) | `allow_unsandboxed` grant | [linux_bubblewrap.rs](https://github.com/zed-industries/zed/blob/main/crates/sandbox/src/linux_bubblewrap.rs), [DESIGN.md](https://github.com/zed-industries/zed/blob/main/crates/sandbox_linux/DESIGN.md) |
| **Kiro** | `bwrap` on PATH + `socat` (docs) | Shell (+ stdio MCP opt-in) | Rules-driven | `DEFAULT_BLOCKED` via proxy | **No** | Runs *without* isolation if bwrap is missing, unless org requires | [docs](https://kiro.dev/docs/sandbox/) |
| **Factory Droid** | bubblewrap + seccomp (filter contents not documented) | per-command / whole-process | As macOS | Proxy allowlist | **No** | Fails closed | [docs](https://docs.factory.com/autonomy-and-safety/sandbox) |
| **Devin Local** | `bwrap` + `socat` (docs) | Shell | As macOS | Open; opt-in proxy | **No** | Fails closed | [docs](https://docs.devin.ai/cli/sandbox) |
| **Kilo Code** | `bwrap --unshare-user --disable-userns --unshare-pid [--unshare-net] --ro-bind / /`; srt's `apply-seccomp` **only in proxy mode** | Agent tools | As macOS | `deny`: netns only; `proxy`: relay + seccomp + SNI-checking proxy | **No** | As macOS | [bubblewrap.ts](https://github.com/Kilo-Org/kilocode/blob/main/packages/kilo-sandbox/src/bubblewrap.ts) |
| **Junie CLI** | srt (bwrap + socat + ripgrep) | Terminal | As macOS | Open by default | **No** | — | [docs](https://junie.jetbrains.com/docs/junie-cli.html) |
| **Qwen Code** | `tools.executionSandbox`: bwrap (pid + net ns) or Landlock ABI ≥ 3 "partial" (no net closing, no pid ns); or Docker | Tools only (MCP/LSP/hooks disabled under it) | `workspace-write`: "reads remain broad" | bwrap: `closed` possible; Landlock: `open` only | **No**; user/system settings only | — | [Landlock design doc](https://github.com/QwenLM/qwen-code/blob/main/docs/design/2026-09-20-landlock-execution-backend.md) |
| Cline, OpenCode, goose, Aider, Warp, Amp, Augment, Crush | **None** | — | — | — | — | — | — |

### seccomp filters compared (what each agent's BPF actually blocks)

| Agent (file) | Default | `socket` families | `io_uring` | Other denies | Notes |
|---|---|---|---|---|---|
| srt / Claude Code (`seccomp-unix-block.c`) | Allow | Deny `AF_UNIX`, `AF_VSOCK` | Deny setup/enter/register | `unshare`/`clone` with `CLONE_NEWUSER`\|`CLONE_NEWNS`; `clone3` → `ENOSYS`; `setns`, `mount`, `umount2`, `pivot_root`, `open_tree`, `move_mount`, `fs*`, `mount_setattr`, `open_tree_attr` | io_uring added 2026-03-30 (#183); ia32 unsupported (`socketcall`) |
| Codex (`seccomp.rs`), Restricted mode | Allow | Only `AF_UNIX` allowed | Deny | `connect`, `accept(4)`, `bind`, `listen`, `get{peer,sock}name`, `shutdown`, `sendto`, `sendmmsg`, `recvmmsg`, `{get,set}sockopt`, `ptrace`, `process_vm_*`, `request_key` | `recvfrom` left open for `cargo clippy` |
| Codex, ProxyRouted mode | Allow | Only `AF_INET`/`AF_INET6` (+`NETLINK_ROUTE` in TUN mode) | Deny | `ptrace`, `process_vm_*`, `request_key` | New `AF_UNIX` denied unless `dangerously_allow_all_unix_sockets` |
| Zed (`linux_bubblewrap.rs`) | Allow | Only `AF_INET`/`AF_INET6`/`AF_NETLINK`; `socketpair` only `AF_UNIX` | Deny | `ptrace`, `process_vm_*`; foreign arch killed | Installed by launcher right before `exec` |
| MXC (`seccomp_filter.rs`) | Allow | Only `AF_UNIX`/`AF_INET`/`AF_INET6`/`AF_NETLINK` | Deny | VSOCK, packet; `clone3` handling | "always active" |
| Gemini CLI tool sandbox (`LinuxSandboxManager.ts`) | Allow | **No rule** | **No rule** | `ptrace` only; foreign arch killed | Network isolation relies only on netns |
| Kilo (srt binary) | as srt | as srt | as srt | as srt | Applied only when `network.mode == "proxy"` |

From reading the source, not tested: under Gemini's Linux tool sandbox, and under Kilo's default `deny` network mode, nothing visible in the argv blocks `connect()` to host Unix sockets reachable through the read-only root bind. That is the same channel Zed's comment warns about.

---

## 3. Windows (native)

### How agents use the platform
Windows has rich access-check primitives (tokens, SIDs, integrity levels, AppContainer, job objects, WFP) but no unprivileged "confine this process tree to these paths, no network" call like Seatbelt or bubblewrap. OpenAI's post explains why AppContainer, Windows Sandbox and MIC alone did not fit ([openai-codex-windows-sandbox.md](openai-codex-windows-sandbox.md)). Five designs are in use, in rough order of age:

1. **Separate local user + WFP + restricted token** (Codex "elevated", srt alpha).
   - An admin install creates sandbox accounts: Codex's `CodexSandboxOffline`/`CodexSandboxOnline`, srt's `srt-sandbox`.
   - Windows Firewall/WFP filters keyed on that account's SID block egress except loopback to the proxy ports (srt: 60080–60089).
   - Commands run under a write-restricted token in a job object, and NTFS ACEs grant the workspace.
   - It is "fail-closed" for direct sockets but needs elevation, leaves persistent host state, and is slow because ACL stamping is proportional to tree size.
   - Firewall rules cannot match restricted tokens or child processes, which is why a separate *principal* is required.
2. **Restricted token + ACLs only** (Codex "unelevated", legacy). Has no kernel network block: offline is "environment-level", meaning proxy variables point at a dead endpoint, so "Network protection is weak".
3. **Restricted token + Low integrity + job object** (Gemini CLI `GeminiSandbox.cs`). `CreateRestrictedToken(DISABLE_MAX_PRIVILEGE)` → `SetTokenInformation(TokenIntegrityLevel, S-1-16-4096)` → `CreateJobObject`. "No network" is a **job-object bandwidth throttle** (`JobObjectNetRateControlInformation`, `MaxBandwidth = 1`), which on failure only prints "Network might not be throttled." `icacls` Low labels on writable paths persist after the session.
4. **AppContainer** (Antigravity CLI, Windows 11 24H2 with the Aug 2026 update). Folders outside the user profile are readable but not writable (docs). The internals are not documented.
5. **Microsoft MXC** (GA 2026-10-07): Copilot CLI and VS Code (Windows 11, Sept 2026 update recommended), Factory Droid, Codex (`windows.sandbox = "mxc"`), and srt (opt-in `windows.backend: 'mxc'`, 2026-11-06).
   - MXC's Windows backends include an AppContainer `processcontainer` with WFP egress filters and a newer **BaseContainer**/PSEC tier.
   - Codex's MXC crate "never invokes MXC's AppContainer dispatcher". It creates the child suspended, assigns a kill-on-close job, allows loopback only for the proxy, and denies direct egress and inbound.
   - srt likewise refuses MXC's AppContainer tiers because "MXC's AppContainer network enforcement is cooperative". GitHub's docs agree from the other side: "On Windows, the sandbox relies on programs honoring the proxy settings."
   - Codex documents NTFS alias gaps: "Hard-link names retain independent path permissions", and junctions to volume roots can widen grants.

Everyone else on native Windows either **runs unsandboxed** (Claude Code: "On native Windows, Claude Code runs commands unsandboxed"; Zed native shells; Kilo, Devin Local and Junie "not supported") or **sends you to WSL2** (Cursor, Zed).

### Table: Windows native

| Agent | Mechanism | Confines | FS default | Network | On by default? | Escape hatch | Links |
|---|---|---|---|---|---|---|---|
| **Claude Code** | **None** natively (docs). srt itself has alpha `srt-win` (user + WFP + restricted token + job + ACEs) and opt-in MXC BaseContainer; not used by Claude Code per docs | — | — | — | No sandbox; `failIfUnavailable` makes it exit | — | [docs](https://code.claude.com/docs/en/sandboxing), [srt README Windows](https://github.com/anthropics/sandbox-runtime#windows-alpha) |
| **Codex CLI** | `elevated` (sandbox users + firewall/WFP + restricted token via `codex-command-runner.exe`), `unelevated` (restricted token + ACLs), `mxc` (BaseContainer + kill-on-close job) | Shell (PowerShell) + children | Workspace rw; `.git`/`.codex`/`.agents` denied; MXC: deny > ro > rw | Elevated: firewall blocks; MXC: loopback-only to proxy; unelevated: weak | **Level defaults to `Disabled`**; TUI prompts setup before Agent mode; `prefer_mxc` default off | `requirements.toml` can constrain backends; `allow_mxc=false` | [windows_sandbox.rs](https://github.com/openai/codex/blob/main/codex-rs/core/src/windows_sandbox.rs), [mxc-sandbox README](https://github.com/openai/codex/blob/main/codex-rs/mxc-sandbox/README.md), [docs](https://learn.chatgpt.com/docs/windows/windows-sandbox) |
| **Gemini CLI** | Restricted token + Low IL + job object (`GeminiSandbox.cs`); or Docker/Podman | Tool runs | Low-IL writable paths via `icacls` (persist); secret files denied | Job-object bandwidth throttle (`MaxBandwidth=1`) | **No** | — | [GeminiSandbox.cs](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/windows/GeminiSandbox.cs) |
| **Antigravity CLI** | AppContainer (Win 11 24H2 + Aug 2026) | Terminal | Outside-profile folders read-only | Closed + allowlist (mechanism not documented) | Via `auto` mode where available | As macOS | [docs](https://antigravity.google/docs/sandbox/) |
| **Copilot CLI / VS Code** | MXC native (Windows 11; features vary by build) | As macOS | As macOS | Proxy relies on programs honouring proxy settings; VS Code needs `allowLocalNetwork: true` for proxy | **No** (VS Code: "Experimental") | As macOS | [GitHub docs](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes), [VS Code docs](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) |
| **Factory Droid** | MXC native, or Linux sandbox in WSL2 | As macOS | As macOS | Proxy | **No** | Fails closed | [docs](https://docs.factory.com/autonomy-and-safety/sandbox) |
| **Kiro** | Native, one-time admin setup (`/sandbox setup`); mechanism **not documented** | Shell | Rules | `DEFAULT_BLOCKED` works before setup | **No** | — | [docs](https://kiro.dev/docs/sandbox/) |
| **Cursor** | **No native sandbox documented**; Linux sandbox in WSL2 | — | — | — | — | — | [blog](https://cursor.com/blog/agent-sandboxing) |
| **Zed, Kilo, Devin Local, Junie** | **None** native (Zed → WSL; others hard-fail or hide the option) | — | — | — | — | — | per-agent notes |
| **Qwen Code** | Docker/Podman whole-CLI only | — | — | — | No | — | [docs](https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/) |

### Windows details worth a slide
- **srt-win's limits, stated by the vendor.**
  - Schannel/WinHTTP clients cannot complete TLS under the restricted token, so PowerShell `Invoke-WebRequest` and cargo's libcurl-on-Schannel fail. git is steered to OpenSSL.
  - "Traffic carried by system services is not matched by the fence": SMB and the WSL service act for the sandboxed process under another identity.
  - `initialize()` actively probes that direct connects are blocked, including under lowered-integrity copies of the token, and "refuses to start if any of them gets out".
- **Codex's journey.** From the unelevated prototype ("Network protection is weak"), to the elevated design (2026-05-13 post), to MXC (2026-11-18 post). In source on 2026-11-22, however, `prefer_mxc` is "UnderDevelopment" and off by default, and `WindowsSandboxLevel` defaults to `Disabled`. The post's "moved to MXC" describes the direction and the Desktop rollout, not the CLI default.
- **Gemini's "offline" is a QoS knob.** A job-object network rate limit is a bandwidth throttle, not an egress block. Slow exfiltration still gets through, and on failure there is only a warning. (Reading of source; not tested.)

---

## 4. WSL

### How agents use the platform
**WSL2** runs a real Linux kernel in a lightweight utility VM, so the Linux sandboxes (bwrap + seccomp, Landlock) work unchanged. **WSL1** translates syscalls in the NT kernel (pico processes), has no namespaces, and is rejected: Codex ("WSL1 is rejected"), Claude Code ("Sandboxing needs WSL2"), VS Code ("WSL1 unsupported"). Three WSL-specific hazards decide whether the Linux sandbox is still a boundary:

1. **Windows interop.** WSL launches `cmd.exe`, `powershell.exe` or anything under `/mnt/c/` by handing it to the Windows host "over a Unix socket" (Claude Code docs) under `/run/WSL`. The launched process is a normal Windows process with the user's full rights, outside every Linux namespace and filter.
   - **Codex** masks it: "WSL's Windows-process bridge uses Unix sockets under /run/WSL. Mask them after all filesystem binds so network access cannot bypass the Linux filesystem policy by launching an unrestricted Windows process" (`--tmpfs /run/WSL`).
   - **Zed** does the same (`mask_interop_dir`).
   - **Claude Code/srt** has no interop-specific code (grep at v0.0.83). Its docs say interop "follows the sandbox's Unix-socket settings", meaning the seccomp `AF_UNIX` block. That block is optional on Claude Code's Linux install.
2. **`/mnt/c` is 9p onto NTFS.**
   - Linux permission bits on `/mnt/c` are synthetic. srt: "the Windows ACL decides what can be created, and Linux is told nothing of it: every folder looks like yours and writable", so srt pre-creates mount points on 9p.
   - Zed documents a weaker guarantee for grants on NTFS-backed paths, because inode pinning "doesn't pin the Windows object", and admits it "doesn't fully guarantee TOCTOU-freedom on WSL when going across the plan9 bridge".
3. **Networking.** WSL2's NAT or mirrored networking is shared with Windows. Zed on WSL is "all-or-nothing" (no proxy confinement yet). srt warns that "`wsl.exe` and the WSL service also answer a sandboxed process" on the *Windows* side.

### Table: WSL

| Agent | WSL support | Mechanism in WSL | Interop handling | Notes / links |
|---|---|---|---|---|
| Claude Code | WSL2 yes; WSL1 refused | bwrap + socat (+ optional seccomp), same as Linux | Via seccomp `AF_UNIX` block (docs) | [docs](https://code.claude.com/docs/en/sandboxing) |
| Codex CLI | WSL2 yes; WSL1 rejected | bwrap + seccomp | `--tmpfs /run/WSL`; WSLg views masked | [bwrap.rs](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/src/bwrap.rs) |
| Zed Agent | The **only** Windows sandbox: Zed on Windows runs a helper inside the distro | bwrap + seccomp, argv built Windows-side | Masks `/run/WSL`; network all-or-nothing; NTFS grants weaker | [windows_wsl.rs](https://github.com/zed-industries/zed/blob/main/crates/sandbox/src/windows_wsl.rs) |
| Cursor | Windows = WSL2 only | Landlock/bwrap Linux sandbox | Not documented | [blog](https://cursor.com/blog/agent-sandboxing) |
| VS Code Copilot | Linux/WSL2 (glibc); WSL1, musl unsupported | MXC bwrap + slirp4netns | Not documented | [docs](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) |
| Factory Droid | When Droid runs in WSL2 | bwrap + seccomp | Not documented | [docs](https://docs.factory.com/autonomy-and-safety/sandbox) |
| Copilot CLI, Kiro, Devin Local, Kilo, Junie | Treated as Linux where the CLI runs inside WSL (not separately documented) | Linux mechanism | Not documented | per-agent notes |

---

## 5. Cross-OS comparison

### The common recipe (as of 2026-11)
1. **Wrap each command, not the agent.** The agent process (model calls, file-edit tools, hooks, MCP, LSP) stays outside, and `sandbox-exec`/`bwrap`/a runner wraps each shell call. Exceptions: Factory `whole-process`, Gemini/Qwen whole-CLI mode, and Copilot/VS Code (which also sandbox local MCP and LSP servers).
2. **Read most of the disk, write the workspace plus temp, protect a list of files** that something outside the sandbox will later execute or load.
3. **Kernel-level "no network", then a userspace proxy on loopback** that knows about domains. The proxy is the policy engine for egress, credential masking and approval prompts.
4. **Feed denials back to the model**, through srt's `<sandbox_violations>`, Codex's escalation requests, Zed's `reason`, and Cursor's "failures name the blocking constraint".
5. **An approval or classifier only at the boundary**, plus a "run unsandboxed" escape hatch.

### Where they differ

| Dimension | Options seen | Who |
|---|---|---|
| Build vs reuse | Own code: Codex, Zed, Cursor, Gemini, Kilo (Codex-derived SBPL + srt seccomp). srt: Claude Code, Junie, VS Code legacy. MXC: Copilot CLI, VS Code, Factory (Win), Codex (Win opt-in), srt (Win opt-in) | — |
| macOS entry point | `sandbox-exec -p` string / `-f` file vs `sandbox_init()` in-process | srt, Codex / Zed, Gemini / MXC |
| Linux FS layer | bwrap mounts vs Landlock | most / Cursor, Qwen fallback (Codex legacy) |
| Linux net bridge | socat×2 over UDS; in-helper relay; slirp4netns + iptables; on/off only | srt, Kiro, Devin / Codex, Zed / MXC / Gemini tool sandbox |
| seccomp scope | Wide (Unix sockets + io_uring + ns/mount syscalls) to minimal (ptrace only) | srt, Codex, Zed, MXC / Gemini |
| Default network inside sandbox | Closed: Claude Code, Codex, Cursor, Zed, Kiro, Kilo, Factory, Antigravity. **Open**: Copilot CLI, VS Code, Junie, Devin Local, Gemini/Qwen default profile | — |
| On by default | Codex, Cursor, Zed, Antigravity (App) — everyone else opt-in | — |
| If the primitive is missing | Fail closed (Factory, Devin Local, Kilo, Kiro headless/required, Claude Code with `failIfUnavailable`), fall back to asking (Cursor), or run unsandboxed with a warning (Zed, Kiro default, Claude Code default) | — |
| Windows | MXC / own user+WFP / restricted token+Low IL / AppContainer / none / WSL2 | see §3 |
| Protected paths | Codex `.git .agents .codex .aws`; srt rc files, `.gitconfig`, `.gitmodules`, `.mcp.json`, `.vscode`, `.idea`, `.claude/{commands,agents}`, `.git/{hooks,config}`; Cursor adds `.git/info/attributes`, `.cursorignore`, `.claude/*.json`; Zed all Git metadata incl. worktrees; Kilo `.git` + own config; Gemini `~/.gemini`, OAuth files | — |
| Project config may widen sandbox? | No (Kiro, Kilo, Junie, Qwen, srt `allowAppleEvents`, Claude Code managed settings, Cursor merge order) | — |

Cloud sandbox platforms and Chinese coding agents are covered separately in [deep-dive-cloud-and-china.md](deep-dive-cloud-and-china.md).

---

## 6. Cloud agents (Western vendors' own)

The whole environment is the sandbox, so the questions are the isolation unit and egress. Facts come from vendor docs fetched 2026-11-22; none of these products publish source.

| Agent | Isolation unit | Egress default | Credentials | Source |
|---|---|---|---|---|
| **Codex cloud** | "creates a container and checks out your repo"; state cached ≤ 12 h (VM vs container internals not documented) | Setup scripts online; **agent phase blocked**; allowlist presets; GET/HEAD/OPTIONS-only option | Secrets for setup only; proxy-substituted secrets ([note](openai-codex-cloud-internet-access.md)) | [cloud env](https://learn.chatgpt.com/docs/environments/cloud-environment), [internet access](https://learn.chatgpt.com/docs/cloud/internet-access) |
| **Claude Code on the web** | "each session gets a fresh virtual machine (VM) running Ubuntu 24.04"; gVisor not mentioned | **Limited** + "Allow package managers" by default; None / Limited / Full; Anthropic API and GitHub proxy bypass the level | Git proxy holds real GitHub creds; scoped credential swapped at proxy; only branch pushes | [cloud environments](https://code.claude.com/docs/en/cloud-environments), [engineering post](https://www.anthropic.com/engineering/claude-code-sandboxing) |
| **Copilot cloud agent** | "isolated Linux environment" (cloud sandbox, default) or GitHub Actions runner; VM vs container not documented | Firewall on + recommended allowlist; covers Bash-tool processes, **not** MCP servers or setup steps | Repo-scoped token | [cloud sandboxes](https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/security-governance-and-network-settings/about-cloud-sandboxes), [firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall) |
| **Cursor Cloud Agents** | "Each agent runs in its own VM boundary … Firecracker-based microVM infrastructure"; separate AWS account | **Open** by default; Default + allowlist; Allow-list only (Cursor services and SCM always reachable) | GitHub App token inside (cf. CVE-2026-61613) | [security](https://cursor.com/docs/cloud-agent/security), [network](https://cursor.com/docs/cloud-agent/security-network) |
| **Jules** (shuts down 2026-12-31) | "fresh virtual machine", Ubuntu, snapshots | "with internet access"; no egress controls documented | Not documented | [FAQ](https://jules.google/docs/faq/), [environment](https://jules.google/docs/environment/) |
| **Devin** | "its own isolated machine" (Devin-managed VM; hypervisor not documented) | **Open** without a Security Profile; profile allowlist enforced "at the machine level" | Secrets as env vars | [security profiles](https://docs.devin.ai/product-guides/security-profiles) |
| **Replit Agent** | Sandbox engine moved from Docker on GCE to **Cloud Hypervisor microVMs** (post 2026-11-04; whether all Agent sandboxes use it is not stated) | "restricted outbound access" during build; enforcement outside the guest with TLS-SNI and DNS filtering | Git creds held by proxy ([note](agent-replit.md)) | [frontier.replit.com post](https://frontier.replit.com/sandbox-engine-microvms-part-1/), [docs](https://docs.replit.com/help/agent-and-ai) |

Correction to the matrix: Codex cloud's docs say **container**, not VM.

---

## 7. Known escapes by mechanism

Almost none of these break the kernel primitive. They go *around* it, through a more-privileged component that trusts something the sandboxed process could write. Links are to the original advisories and researcher posts.

| Mechanism class | Agent / CVE | What happened | Fixed | Links |
|---|---|---|---|---|
| **Protected-path list gap: write a file something unsandboxed executes later** | Cursor CVE-2026-26268 | Sandbox did not protect `.git` config and hooks; hook runs outside on the next git command | 2.5 (2026-02-13) | [GHSA-8pcm-8jpx-hv8r](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r) |
| ″ | Claude Code CVE-2026-25725 | bwrap protected `settings.local.json` but not a *not-yet-existing* `settings.json`; create it with a `SessionStart` hook | 2.1.2 (2026-02-06) | [GHSA-ff64-7w26-62rf](https://github.com/anthropics/claude-code/security/advisories/GHSA-ff64-7w26-62rf) |
| ″ | Cursor CVE-2026-48124 | Cursor ran *Claude Code's* hooks from workspace `.claude/settings.local.json` | 2026-05-21 | [GHSA-pc9j-3qc2-95wv](https://github.com/cursor/cursor/security/advisories/GHSA-pc9j-3qc2-95wv) |
| ″ | Claude Code CVE-2026-55607 | Git worktree named `.git` + symlinks + `fsmonitor` → overwrite `~/.zshenv`, out of Seatbelt | 2.1.163 (2026-06-25) | [GHSA-7835-87q9-rgvv](https://github.com/anthropics/claude-code/security/advisories/GHSA-7835-87q9-rgvv) |
| ″ | Cursor CVE-2026-73217 | Replace a venv's `python`; the Python extension runs it outside | 3.1.2 (2026-07-14) | [GHSA-p9g2-cr55-cw9c](https://github.com/cursor/cursor/security/advisories/GHSA-p9g2-cr55-cw9c) |
| ″ (git config, not sandbox) | Copilot CLI CVE-2026-45033; goose CVE-2026-72718 | Nested bare repo / `core.fsmonitor` executes commands | 2026-05 / 2026-07 | [GHSA-9ccr-r5hg-74gf](https://github.com/github/copilot-cli/security/advisories/GHSA-9ccr-r5hg-74gf), [GHSA-r5pp-p5r8-466r](https://github.com/block/goose/security/advisories/GHSA-r5pp-p5r8-466r) |
| **Split brain: unsandboxed write tool follows a path the sandbox made** | Claude Code CVE-2026-39861 | Sandbox creates symlink; unsandboxed app writes through it | 2.1.64 (2026-04-20) | [GHSA-vp62-r36r-9xqp](https://github.com/anthropics/claude-code/security/advisories/GHSA-vp62-r36r-9xqp) |
| ″ | Claude Code CVE-2026-103435; CVE-2026-88968 | Write-time symlink TOCTOU; macOS race against Edit tool's check | 2026-10-05; 2.1.251 (2026-10-26) | [GHSA-5j29-h97v-84ch](https://github.com/anthropics/claude-code/security/advisories/GHSA-5j29-h97v-84ch), [GHSA-5xjx-9qx6-jcrv](https://github.com/anthropics/claude-code/security/advisories/GHSA-5xjx-9qx6-jcrv) |
| ″ | Cursor CVE-2026-50549 | Canonicalisation failure → raw path → symlink write anywhere | 3.0 (2026-06-05) | [GHSA-3v8f-48vw-3mjx](https://github.com/cursor/cursor/security/advisories/GHSA-3v8f-48vw-3mjx) |
| **Policy derived from agent-controlled input** | Codex CVE-2025-59532 | Model-generated `cwd` became the writable root (network-off still held) | 0.39.0 (2025-09-19) | [GHSA-w5fx-fh39-j5rw](https://github.com/openai/codex/security/advisories/GHSA-w5fx-fh39-j5rw) |
| ″ | Cursor CVE-2026-50548 | Agent-set `working_directory` made writable → overwrite `cursorsandbox` helper | 3.0 (2026-06-05) | [GHSA-3p48-7v9f-v5cw](https://github.com/cursor/cursor/security/advisories/GHSA-3p48-7v9f-v5cw) |
| **Host service reachable from inside** | Cursor CVE-2026-73218 | Docker Desktop + Dev Containers CLI: privileged container mounts `virtiofs0` → home dir | < 3.0.0 (2026-07-14) | [GHSA-v4xv-rqh3-w9mc](https://github.com/cursor/cursor/security/advisories/GHSA-v4xv-rqh3-w9mc) |
| **Network policy logic** | srt CVE-2025-66479 | Empty `allowedDomains` treated as "no restriction" | 0.0.16 (2025-12-04) | [GHSA-9gqj-5w7c-vx47](https://github.com/advisories/GHSA-9gqj-5w7c-vx47) |
| ″ (tool allowlist, not OS sandbox) | Claude Code CVE-2026-24052; CVE-2026-54316; CVE-2025-55284 | `startsWith` domain check; pre-approved `huggingface.co` as exfil; `ping`/DNS exfil | 2026-02 / 2026-06 / 2025-08 | [GHSA-vhw5-3g5m-8ggf](https://github.com/anthropics/claude-code/security/advisories/GHSA-vhw5-3g5m-8ggf), [GHSA-fg94-h982-f3mm](https://github.com/anthropics/claude-code/security/advisories/GHSA-fg94-h982-f3mm), [GHSA-x5gv-jw7f-j6xj](https://github.com/anthropics/claude-code/security/advisories/GHSA-x5gv-jw7f-j6xj), [Embrace The Red](https://embracethered.com/blog/posts/2025/claude-code-exfiltration-via-dns-requests/) |
| **The agent turns the sandbox off itself** | Claude Code (research, no CVE) | Denylisted `npx` run via `/proc/self/root/usr/bin/npx`; when bwrap failed, the agent retried unsandboxed; then `ld-linux` to run a blocked binary via `mmap` | n/a (2026-03-03) | [Ona](https://ona.com/blog/how-claude-code-escapes-its-own-denylist-and-sandbox) |
| **Hosted sandbox: local control endpoint + token inside** | Cursor Cloud Agents CVE-2026-61613 | Browser content hits unauthenticated agent-control endpoint in the container; GitHub App token exposed | Server-side 2026-03-31 | [GHSA-whx2-4gvm-m3r3](https://github.com/cursor/cursor/security/advisories/GHSA-whx2-4gvm-m3r3) |

No advisories were found against the Zed, Codex Linux/Seatbelt, MXC, Gemini, Kilo or Qwen OS-sandbox code itself. Zed's advisories are allowlist/config bypasses, not sandbox escapes. Wider context: [../incidents/2026-06-agent-sandbox-escape-advisories.md](../incidents/2026-06-agent-sandbox-escape-advisories.md).

---

## 8. Slide-ready takeaways

1. **Two libraries now sit under most agent sandboxes.** Anthropic's srt (Claude Code, Junie, VS Code legacy, Kilo's seccomp) and Microsoft's MXC (Copilot CLI, VS Code, Factory, opt-in in Codex and srt on Windows). — [srt](https://github.com/anthropics/sandbox-runtime), [MXC](https://github.com/microsoft/mxc)
2. **On macOS it is all Seatbelt with a Chromium-derived `(deny default)` profile.** Network is reduced to `(remote ip "localhost:<proxyPort>")`, because SBPL has no domains. A deprecated, undocumented 2007 API carries the security of Anthropic, OpenAI, Google, Microsoft, Cursor and Zed agents. — [Codex seatbelt_base_policy.sbpl](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl)
3. **On Linux the recipe is `bwrap --ro-bind / / --unshare-net` + seccomp, and seccomp has to chase the kernel.** It blocks `socket(AF_UNIX)` because "a read-only bind mount does not stop `connect()` to a unix socket", and blocks `io_uring` because `IORING_OP_SOCKET` skips `socket()`. srt added the io_uring rule only in 2026-03. — [Zed linux_bubblewrap.rs](https://github.com/zed-industries/zed/blob/main/crates/sandbox/src/linux_bubblewrap.rs), [srt seccomp-unix-block.c](https://github.com/anthropics/sandbox-runtime/blob/main/vendor/seccomp-src/seccomp-unix-block.c)
4. **A domain allowlist enters an empty network namespace through a Unix socket.** Two socat hops (srt), an in-helper relay (Codex, Zed), or slirp4netns + in-namespace iptables (MXC). Then seccomp forbids every *other* Unix socket. — [srt linux-sandbox-utils.ts](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts)
5. **Landlock lost.** Codex deprecated it ("cannot isolate app-server Unix sockets"), Qwen labels it "partial", and only Cursor still uses it, falling back to bubblewrap and then to asking you. — [Codex linux-sandbox README](https://github.com/openai/codex/tree/main/codex-rs/linux-sandbox), [Cursor run modes](https://cursor.com/docs/agent/security/run-modes)
6. **Windows has five answers and none is a Seatbelt.** Options range from sandbox users + WFP + restricted tokens, to AppContainer, to MXC BaseContainer. Gemini's "offline" is a job-object bandwidth throttle of `MaxBandwidth = 1`. srt calls MXC's AppContainer network enforcement "cooperative". Claude Code runs unsandboxed natively. — [GeminiSandbox.cs](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/windows/GeminiSandbox.cs), [srt mxc-sandbox-utils.ts](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/mxc-sandbox-utils.ts)
7. **WSL2 is a Linux sandbox with a back door to Windows.** `/run/WSL` interop sockets launch unconfined Windows processes. Codex and Zed mask that directory with a tmpfs; Claude Code relies on its (optional) Unix-socket seccomp. — [Codex bwrap.rs](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/src/bwrap.rs)
8. **The escapes go around the sandbox, not through it.** Every 2026 Cursor and Claude Code sandbox CVE abuses a file that an *unsandboxed* component later runs or writes through: git hooks, a not-yet-existing `settings.json`, venv `python`, worktree `fsmonitor`, or a symlink followed by the agent's own edit tool. — [GHSA-ff64-7w26-62rf](https://github.com/anthropics/claude-code/security/advisories/GHSA-ff64-7w26-62rf), [GHSA-8pcm-8jpx-hv8r](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r)
9. **"Create, don't edit" is a property of bubblewrap.** You cannot bind-mount over a path that does not exist yet. Zed: "it's not possible to protect `.git` if it doesn't already exist". Codex adds a `literal` rule on macOS for `mkdir .codex`. Zed's experimental fix is a seccomp-unotify supervisor (2026-11-17). — [Zed sandbox README](https://github.com/zed-industries/zed/blob/main/crates/sandbox/README.md), [DESIGN.md](https://github.com/zed-industries/zed/blob/main/crates/sandbox_linux/DESIGN.md)
10. **Not everyone is converging.** OpenCode 2 (Oct 2026), a ground-up rewrite, ships no OS sandbox and *loosened* its default: "V1 asks before accessing paths outside the project. V2 does not." goose removed its Seatbelt sandbox. — [OpenCode migration guide](https://github.com/anomalyco/opencode/blob/dev/services/site/src/docs/content/migrate-v1.mdx)

---

## 9. Corrections to existing notes, and what could not be verified

**Corrections found while reading source:**
- [gemini-cli-sandbox.md](gemini-cli-sandbox.md) says tool sandboxing is "default on". `settingsSchema.ts` and `config.ts` default `security.toolSandboxing` to **false**, and the reference docs agree. Only the narrative guide implies otherwise.
- [top-coding-agents-matrix.md](top-coding-agents-matrix.md) shows Codex Windows as "**Native (MXC)**", on by default. In source, `WindowsSandboxLevel` defaults to `Disabled`, the TUI prompts for setup before Agent mode, and MXC is opt-in (`prefer_mxc` default off, "UnderDevelopment"). The docs call MXC "recommended on compatible devices".
- The matrix and README list Codex cloud as a "Per-task VM". The docs say "creates a container".
- Claude Code docs now cite versions up to v2.1.315 (the matrix row reflects v2.1.284).

**Not verified / not documented:**
- macOS mechanism of Devin Local (not named); Windows mechanism of Kiro (not named); Linux tool used by Antigravity ("kernel namespaces"); Factory's seccomp filter contents; how Antigravity enforces its `read_url` allowlist.
- Cursor's internals (closed source). Its docs were fetched for us by a research subagent and quoted; the IDE's network enforcement is described only in the CLI changelog.
- Whether Copilot CLI's bundled MXC version uses the BaseContainer or AppContainer tier on a given Windows build (GitHub docs say only that "feature support varies by build").
- The Unix-socket reachability under Gemini's Linux tool sandbox and Kilo's `deny` mode is inferred from argv and filter source, not tested.
- WSL interop under srt with seccomp absent is inferred, not tested.
- OpenCode 2.0's exact announcement date: the `v2.0.0` tag commit is dated 2026-09-11, the in-repo changelog starts at v2.0.26 (2026-10-08), and the 2026-10-13 public-launch date comes from third-party coverage only.
