---
title: "ms-enclave: A modular and stable agent sandbox runtime environment" (GitHub README) — used by MS-Agent and EvalScope
url: https://github.com/modelscope/ms-enclave
authors: ModelScope (Alibaba)
date: latest PyPI release 0.0.9 on 2026-11-10; first release 0.0.0 on 2025-09-11
accessed: 2026-11-22
kind: repo
---

## Summary
ms-enclave is ModelScope's sandbox runtime for agents and code evaluation. It runs tools (Python, shell, file operations, multi-language code, Jupyter notebook) inside Docker containers, either in-process (`LocalSandboxManager`) or through a FastAPI server (`ms-enclave server`, used via `HttpSandboxManager`), and it can also use an E2B-compatible remote backend. MS-Agent added "Support Sandbox Framework" pointing to ms-enclave on 2025-11-07, and EvalScope uses it to run model-generated code for HumanEval, SWE-bench and other benchmarks. Isolation is plain Docker; the README offers privileged mode and read/write host mounts as options.

## Key points
- Isolation unit: Docker container ("Complete isolation and resource limits based on Docker"). Sandbox types `DOCKER` and `DOCKER_NOTEBOOK` (Jupyter Kernel Gateway). No gVisor, Kata or microVM option; optional E2B-compatible remote backend ("an E2B-compatible service and API key; local Docker is optional").
- Per-session?: managers pool sandboxes. Each execution borrows one and returns it, with FIFO queueing when all are busy (PyPI docs). Containers are removed on exit by default (`remove_on_exit`).
- Network egress: `network_enabled` flag (default not stated); the notebook sandbox requires it to be True with port 8888 exposed.
- Hardening knobs: `memory_limit`, `cpu_limit` (None means unlimited), `cap_add` default empty. Privileged mode and `volumes` with "rw" binds are configurable and weaken isolation if used. Tools are registered only if listed in `tools_config`.
- Persistence: none by default (containers removed on exit); volumes optional.
- Limits: no sandbox-level timeout documented (timeouts are per tool call).
- Repo stats: about 58 stars, Apache-2.0, PyPI 0.0.9 (2026-11-10).
- MS-Agent (https://github.com/modelscope/ms-agent): about 4.4k stars, Apache-2.0, v1.6.0 (2026-03-23). News 2025-11-07: "Support Sandbox Framework" (links ms-enclave). Default install "may install additional dependencies for local code execution", so local execution is the default and the sandbox is opt-in (our reading). WebUI asks for approval of file changes.
- EvalScope (https://evalscope.readthedocs.io/en/latest/user_guides/sandbox.html): `sandbox={'enabled': True, 'engine': 'docker'}`; remote mode via `base_url`; E2B and SandboxFusion engines; "SWE-bench creates a separate sandbox for grading."
- Pricing: open source.

## Excerpts
> "A modular and stable agent sandbox runtime environment." (README description)

> "Complete isolation and resource limits based on Docker" (README features)

> "EvalScope uses ms-enclave to create these environments, execute tasks and release resources automatically." (EvalScope docs)

## Relevance to the talk
The open-source Chinese ecosystem's default is still "Docker is the sandbox". That contrasts with the labs' own training infrastructure (Moonshot and DeepSeek moved to Firecracker after agents crashed shared kernels). ms-enclave also speaks the E2B API, so users can switch from local Docker to a microVM provider without code changes.
