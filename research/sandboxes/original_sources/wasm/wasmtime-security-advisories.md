---
title: Security advisories — bytecodealliance/wasmtime (GitHub Security Advisories, 2021–2026)
url: https://github.com/bytecodealliance/wasmtime/security/advisories
authors: Wasmtime maintainers (Bytecode Alliance); individual reporters credited per advisory
date: list as of 2026-11-22 (95 published advisories; read via `gh api repos/bytecodealliance/wasmtime/security-advisories`)
accessed: 2026-11-22
kind: advisory
---

## Summary
Wasmtime's published advisories are the best record of how a production Wasm sandbox actually fails. Counts by year: 2021: 4, 2022: 8, 2023: 4, 2024: 4, 2025: 4, **2026: 71** (5 critical, 4 high, 42 medium, 20 low). The 2026 jump follows LLM-assisted bug hunting (see wasmtime-april-2026-llm-advisories.md). Genuine sandbox escapes come from two places: JIT miscompilation in Cranelift/Winch (memory escape), and host-side code — WASI filesystem path handling and the component-model ABI. Most 2026 advisories are host-side DoS/panics in WASI and component-model code.

## Key points
Codegen (Cranelift/Winch) escapes — guest reads/writes host memory:
- CVE-2021-32629 (critical, 2021-05-21): "Memory access due to code generation flaw in Cranelift module".
- CVE-2023-26489 / GHSA-ff4p-7xrq-q5r8 (critical 9.9, 2023-03-08): x86_64 address-mode computed a 35-bit instead of 33-bit effective address; with default settings guest could read/write ~6 GB–~34 GB past linear-memory base — possibly other instances' memory in the pooling allocator, or the embedder's.
- CVE-2026-34971 / GHSA-jhxm-h53p-jm7w (critical, 2026-04-09): aarch64 Cranelift miscompile of `load(iadd(base, ishl(index, amt)))` → bounds check and load use different addresses → arbitrary host read/write. Needs memory64 and Spectre mitigations or signals-based traps disabled. Credits: shumbo, bholley, deian.
- CVE-2026-34987 / GHSA-xx5w-cvp6-jv83 (critical, 2026-04-09): non-default Winch baseline compiler; PoC on aarch64 accessed up to 32 KiB before / ~4 GiB after memory, "potentially an arbitrary RCE".
- CVE-2026-115889 / GHSA-897f-g5gm-fmxm (critical 9.9, 2026-10-19): Cranelift bit-packed SSA value indices could silently overflow in release builds; a huge or crafted function body → arbitrary miscompilation → sandbox escape, any architecture, default settings.
- CVE-2026-115893 / GHSA-mghf-wjfp-p5xm (critical 9.9, 2026-10-19): aarch64 `br_table` with >~256k targets → wrong branch target → jump to arbitrary code; affects all aarch64 support "since the initial release of that support in 2020".
- Also: CVE-2026-24116 and CVE-2026-34944 (x86-64 "unused out-of-sandbox load" with `f64.copysign` / `f64x2.splat`).
Host-side (runtime / WASI / component model):
- CVE-2026-115384 / GHSA-32h6-97mm-8q3c (critical, 2026-10-02): unvalidated result count of a component-model async-lifted callback lets the guest write ~16 KB of chosen data to the native stack (return-address overwrite); validation in `wasmparser` and runtime checks all missed it.
- Filesystem sandbox escapes in `wasmtime-wasi` (via cap-std): CVE-2026-115392 (high, 2026-08-20, trailing slashes in paths/symlinks — "a full filesystem sandbox escape"; not on Linux ≥5.6 with `openat2` RESOLVE_BENEATH, but macOS and older Linux affected); GHSA-m9f7-9w4p-gv38 (high, 2026-10-14, renaming symlinks with trailing slashes); GHSA-f2pq-268w-886c (high, 2026-11-19, Windows drive-prefixed path); CVE-2024-51745 (low, Windows device filenames).
- Permission bypasses: CVE-2026-47261 (high 7.5) `path_open(TRUNCATE)` bypasses `FilePerms::WRITE`; CVE-2026-58494 (medium) hard links/renames bypass destination FilePerms; GHSA-hmmr-87qq-258j (medium) wasip3 UDP send to a receive-only address; GHSA-5qpp-g3j2-8frx (low) wasi-http absolute-form requests to different hosts.
- Cross-instance leaks: CVE-2022-39393 (high 8.6) "Data leakage between instances in the pooling allocator"; CVE-2026-34988 (low) same class.
- Resource exhaustion / host panics: dozens in 2026 (WASIp3 streams, wasi-http bodies, handle tables, fuel-accounting bypasses such as CVE-2026-115390 "exponential fuel amplification").
- Rough classification of the 71 advisories of 2026 by keyword in the title (ours, approximate): ~43 mention WASI/HTTP/filesystem/component/stream/async host code; ~10 mention Cranelift/Winch/miscompilation. Of the 9 critical/high: 4 codegen, 1 component-model ABI, 4 WASI filesystem.

## Excerpts
> "a wasm-controlled load/store operation could read/write addresses up to 35 bits away from the base of linear memory" (GHSA-ff4p-7xrq-q5r8)

> "This is a sandbox escape as guests are able to read/write arbitrary host memory." (GHSA-jhxm-h53p-jm7w)

> "This bug is a full filesystem sandbox escape for guests." (GHSA-vqjp-4c8c-hfgg)

## Relevance to the talk
The evidence for "Wasm is a memory sandbox; the host interface is the attack surface": the core memory-safety argument fails only through compiler bugs (rare, but critical, and arch-specific — aarch64 had no continuous fuzzing), while the bulk of failures, including real filesystem escapes, are in host code that grants capabilities. For agent hosts: run Wasm runtimes inside a process/VM boundary (hyperlight-wasm-2025.md), prefer Linux with `openat2`, keep runtimes patched (fixes shipped across up to five LTS branches at once), and treat each new WASI interface as new kernel-like attack surface.
