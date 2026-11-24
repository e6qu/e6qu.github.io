---
title: "GitHub - coze-dev/coze-studio (Coze Studio is an all-in-one AI agent development tool)"
url: https://github.com/coze-dev/coze-studio
authors: ByteDance (coze-dev)
date: repo active; wiki last edited 2026-03-16; no GitHub releases listed
accessed: 2026-11-22
kind: repo
---

## Summary
Coze Studio is the open-source, self-hosted version of ByteDance's Coze (扣子) agent platform. Python code in its workflow "code node" goes through one of two runners. The `sandbox` runner uses Deno plus Pyodide, so CPython compiled to WebAssembly runs inside Deno's permission system. The `local` runner uses a plain venv with "no env isolation". The debug env template sets `local` as the default. Network, env, file read/write, subprocess and FFI access in sandbox mode are controlled by Deno `--allow-*` allowlists, and the only network host allowed by default is the Pyodide CDN.

## Key points
- Isolation unit: In `sandbox` mode, a Deno process running `jsr:@langchain/pyodide-sandbox@0.0.4`, which is Python in Pyodide (Wasm) under Deno permissions. In `local` mode there is none: a python3 subprocess in a venv.
  - The runner is called through `backend/infra/coderunner/impl/script/sandbox.py`, which builds a command of the form `deno run --allow-… --v8-flags=--max-old-space-size=N jsr:@langchain/pyodide-sandbox@0.0.4`.
  - The Go side (`backend/infra/coderunner/impl/sandbox/runner.go`) returns "js not supported yet", so only Python is supported.
- Per-session?: A new `python3 sandbox.py` process is spawned for each execution, with the request and result passed over pipes (runner.go).
- Network egress: `CODE_RUNNER_ALLOW_NET`, a list of domains/IPs. The default is `"cdn.jsdelivr.net"`, which is needed to fetch Pyodide packages. Everything else is denied by Deno.
- Persistence: none by default. Read and write are allowed only to `node_modules` unless `CODE_RUNNER_ALLOW_READ` / `CODE_RUNNER_ALLOW_WRITE` add paths.
- Limits:
  - Env template comments give the defaults: timeout "default 60 seconds" and memory "default 100MB" (V8 old-space).
  - In sandbox.py itself, `execute()` defaults `timeout_seconds` and `memory_limit_mb` to `None`, while `_build_command` defaults memory to 100 MB. The effective defaults depend on what the Go side passes, which I could not fully verify.
- Other env switches (docker/.env.debug.example):
  - `CODE_RUNNER_ALLOW_ENV`, `CODE_RUNNER_ALLOW_RUN`, `CODE_RUNNER_ALLOW_FFI` and `CODE_RUNNER_NODE_MODULES_DIR`, all empty by default.
  - The production template `docker/.env.example` did not contain `CODE_RUNNER_*` lines when I fetched it, so the production default could not be verified from the repo.
- Pricing: free, open source.
- Repo facts at access time: about 21.8k stars, 3.1k forks, Apache-2.0, and no GitHub releases listed.
- README security warning: "Python execution environments in workflow code nodes" and SSRF are listed among the risks to assess before deploying on a public network.
- Third-party advisory: Lasso's database lists "CVE-2026-77934: Unsandboxed Python Code Runner in Debug Default Deployment" (CVSS 8.8), https://www.lasso.security/vulnerability-database/cve-2026-77934. It says the `make`/`make debug` default is `CODE_RUNNER_TYPE=local`, which has "no filesystem isolation, network restriction, or capability dropping", and that the keyword import filter can be bypassed with `__import__()`. It also says `make web` uses the Deno/Pyodide sandbox. Cross-checked on OSV (https://osv.dev/vulnerability/CVE-2026-77934, published 2026-10-20, CVSS v4 8.7; VulnCheck is the source advisory): "Coze Studio before 0.5.0 RCE via Unsandboxed Local Python Code Runner". Affected: all versions before 0.5.0. Fixed by commits 5f11c49 and fcf40d1, which make the Deno+Pyodide `sandbox` runner the default. NVD/vendor advisory pages themselves not read. The fix commit fcf40d1 ("feat(infra): Set the Code Runner environment to sandbox by default (#2339)", 2025-10-17, read via GitHub API) changed only `docker/.env.example` from `local` to `sandbox`; on main as of 2026-11-22, `docker/.env.debug.example` still has `export CODE_RUNNER_TYPE="local"`, and `docker/.env.example` no longer contains any `CODE_RUNNER_*` line. The repo comment "Default using local" in .env.debug.example does confirm the debug default.
- Coze cloud (coze.cn / coze.com) code node and plugin IDE: the official docs pages are client-rendered and I could not read them. Third-party articles say only built-in Python libraries are available and third-party packages cannot be installed. **Unverified.** I could not find how Coze's hosted runner is isolated.
- Coze Space (扣子空间, launched 2025-04 per press): I found no official documentation of its agent execution sandbox. **Unverified / not found.**

## Excerpts
> "# - sandbox: execute python code in a sandboxed env with deno + pyodide" / "# - local: using venv, no env isolation" — docker/.env.debug.example, Workflow Code Runner Configuration (https://raw.githubusercontent.com/coze-dev/coze-studio/main/docker/.env.debug.example)

> "# The following CDN supports downloading the packages required for pyodide to run Python code. Sandbox may not work properly if removed." followed by `export CODE_RUNNER_ALLOW_NET="cdn.jsdelivr.net"` — same file

> `PKG_NAME = "jsr:@langchain/pyodide-sandbox@0.0.4"` — backend/infra/coderunner/impl/script/sandbox.py

> "Possible security risks include account registration functions, Python execution environments in workflow code nodes," — README, Warning

## Relevance to the talk
Coze Studio is a clear example of Wasm-as-sandbox: Pyodide inside Deno, with capability flags (`--allow-net=host`) acting as the egress allowlist. It is also a cautionary tale, because the convenient default (`local`, no isolation) is the insecure one, and CVE-2026-77934 (fixed in 0.5.0 by switching the default to `sandbox`) was filed over exactly that. It makes a good contrast with Dify's seccomp-based DifySandbox.
