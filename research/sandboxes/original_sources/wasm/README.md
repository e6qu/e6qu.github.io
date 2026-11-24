# Wasm — an abstract machine with capability imports, for agents

The third class of the taxonomy ([../../taxonomy.md](../../taxonomy.md)). General
Wasm background (PLDI 2017, WASI 2019, Wasmtime security docs, RLBox, Cloudflare
Workers, the V8 sandbox, Spectre) is in [../virtualization/](../virtualization/README.md).
This folder covers Wasm **as a sandbox for agents and agent tools**, 2019–2026.

## Index

Running agent-generated code:
- [cloudflare-dynamic-workers-2026.md](cloudflare-dynamic-workers-2026.md) — Dynamic Worker Loader / Code Mode (open beta 2026-03-24): isolates in "a few milliseconds" and "a few megabytes"; concedes V8 bugs are more common than hypervisor bugs.
- [cloudflare-python-workers-snapshots-2025.md](cloudflare-python-workers-snapshots-2025.md) — Pyodide cold start cut from ~10 s to 1.027 s by snapshotting linear memory.
- [pydantic-mcp-run-python.md](pydantic-mcp-run-python.md) — Pyodide on Deno, archived 2026-01-30: "no safe way to run Python within pyodide safely" (see also the [in-process note](../in-process/pydantic-mcp-run-python.md)).
- [langchain-sandbox.md](langchain-sandbox.md) — Pyodide on Deno; "a few seconds" per run; unmaintained since 2026-01-14.
- [nvidia-sandboxing-agentic-workflows-wasm-2024.md](nvidia-sandboxing-agentic-workflows-wasm-2024.md) — NVIDIA 2024: run generated Python with Pyodide in the user's browser; its 2026 follow-up recommends full VMs instead.
- [pyodide-wasm-constraints.md](pyodide-wasm-constraints.md) — no threads, multiprocessing or sockets; termios, fcntl and venv removed.

Component-model capability tools:
- [microsoft-wassette.md](microsoft-wassette.md) — Wasm components as MCP tools, deny-by-default policy per component; "not production ready"; "cannot prevent prompt injection".
- [wasi-0.2-launch-2024.md](wasi-0.2-launch-2024.md) — WASI 0.2 (2024-01-25): a component's imports are its capabilities.
- [wasi-0.3-roadmap.md](wasi-0.3-roadmap.md) — WASI 0.3.0 (2026-06-11) adds native async; no date for 1.0.
- [wasmcloud.md](wasmcloud.md) — CNCF Incubating; components pitched as deny-by-default agent sandboxes.
- [fermyon-spinkube-density-2024.md](fermyon-spinkube-density-2024.md) — "over 5,000" Wasm apps per Kubernetes node (vendor claim); Akamai bought Fermyon (2025-12-01).

Server-side runtimes:
- [wasmer-wasix.md](wasmer-wasix.md) — "sandboxes for … AI agents"; WASIX adds fork, exec, threads and sockets (Wasmer only).
- [wasmedge.md](wasmedge.md) — CNCF runtime; one advisory (CVE-2025-69261).
- [docker-wasm-workloads.md](docker-wasm-workloads.md) — Docker+Wasm (2022 preview), now deprecated in Docker Desktop.
- [wizer.md](wizer.md) — pre-initialisation snapshots, now part of Wasmtime.
- [hyperlight-wasm-2025.md](hyperlight-wasm-2025.md) — Microsoft: Wasmtime inside an OS-less micro-VM; 1–2 ms VM creation.
- [fastly-lucet-2019.md](fastly-lucet-2019.md) — under 50 µs and a few KB per instance; tens of thousands of programs per process.
- [wasmtime-1.0-performance-2022.md](wasmtime-1.0-performance-2022.md) — instantiation from ~2 ms to 5 µs.
- [wasm-3.0-2025.md](wasm-3.0-2025.md) — Wasm 3.0 (2025-09-17): memory64, GC, exceptions.

Browser-based and Linux-in-Wasm:
- [stackblitz-webcontainers-2021.md](stackblitz-webcontainers-2021.md) — Node.js in the browser (Bolt.new runs on it).
- [leaningtech-cheerpx-webvm.md](leaningtech-cheerpx-webvm.md) — x86 → Wasm JIT with an emulated Linux syscall layer; 32-bit only.
- [leaningtech-browserpod-2026.md](leaningtech-browserpod-2026.md) — in-browser sandboxes running git, bash, node, python.
- [v86.md](v86.md) — full-system x86 emulation in Wasm.
- [container2wasm.md](container2wasm.md) — an emulator and kernel packed into one Wasm module.

Security:
- [wasmtime-security-advisories.md](wasmtime-security-advisories.md) — all 95 advisories, 2021–2026 (checked against GitHub: 4, 8, 4, 4, 4, then **71 in 2026**, 5 critical and 4 high).
- [wasmtime-april-2026-llm-advisories.md](wasmtime-april-2026-llm-advisories.md) — the April 2026 batch, from a ~3-week LLM-assisted bug hunt; "no continuous fuzzing of either Cranelift or Winch on aarch64".
- [lehmann-binary-security-wasm-usenix2020.md](lehmann-binary-security-wasm-usenix2020.md) — memory bugs stay exploitable *inside* linear memory.

## Synthesis

By late 2026, **Wasm as the sandbox for a general coding agent has mostly been
abandoned, while Wasm for agent *tools* and short generated snippets is growing.**
The Pyodide-on-Deno runners (Pydantic's, LangChain's, smolagents') were archived or
removed. Pydantic said there is "no safe way" to do it, because Python in Pyodide
can run arbitrary JavaScript and Deno cannot cap memory. NVIDIA's 2026 advice
moved to full VMs. What grew instead:

- **Isolates with typed bindings:** Cloudflare Dynamic Workers / Code Mode, at a few
  ms and a few MB each, though Cloudflare concedes V8 bugs are more common than
  hypervisor bugs.
- **Component-model tools:** Wassette and wasmCloud, where a tool's authority is
  exactly the WIT imports it is granted. That is the right shape for MCP tools, but
  it does nothing about prompt injection.
- **Browser sandboxes:** WebContainers and BrowserPod, where the server pays
  nothing per session.

**The guarantee and its limits.** Wasm's memory sandbox is considered sound.
Memory is bounds-checked, control flow is typed, and all I/O goes through imports.
But a module's own memory bugs remain exploitable inside it (Lehmann 2020), and
the embedding host is the real attack surface. Wasmtime's 71 advisories in 2026
were mostly WASI and component-model host code (by the agent's rough count ~43
host vs ~10 compiler; of the 9 critical or high: 4 compiler, 1 component ABI, 4
WASI filesystem). The jump followed one LLM-assisted bug hunt, a preview of what
capable agents will do to any sandbox's code. Spectre still limits confidentiality
inside one process.

**What agents need and Wasm lacks.** Standard WASI has no fork, exec or spawn,
threads are only proposed, and there are no native binaries, so package managers
only work for pure or Wasm-built packages. WASIX, BrowserPod and Linux-in-Wasm
emulators add these back, at the cost of a non-standard ABI or a full emulator.

**Density** is the class's selling point, but every figure here is vendor-sourced:
instantiation in microseconds and KB (Wasmtime, Lucet), 5,000+ apps per node
(Fermyon), isolates of a few MB (Cloudflare). A whole interpreter in Wasm costs
seconds unless snapshotted (Pyodide: ~10 s down to ~1 s).
