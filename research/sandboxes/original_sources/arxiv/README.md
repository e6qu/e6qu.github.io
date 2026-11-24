# arxiv — academic papers on agent sandboxing and isolation

Each paper below was checked against the arXiv API (exact title, authors, ID) and
its abstract page on 2026-11-22. One file per paper; IDs are in each file's frontmatter.

## 1. Threat: what agents do, and what is done to them

- [2302.12173](2302.12173-greshake-indirect-prompt-injection.md) Greshake et al. 2023: indirect prompt injection; retrieved text "can act as arbitrary code execution" in LLM apps.
- [2309.15817](2309.15817-toolemu.md) ToolEmu 2023: LM-emulated tool "sandbox" for risk testing; safest agent still failed 23.9% of high-stakes cases.
- [2403.02691](2403.02691-injecagent.md) InjecAgent 2024: 1,054 indirect-injection cases; ReAct GPT-4 vulnerable 24% of the time, ~2x with a hacking prompt.
- [2406.13352](2406.13352-agentdojo.md) AgentDojo 2024: the standard extensible benchmark (97 tasks, 629 security cases) for injection attacks and defences.
- [2411.07781](2411.07781-redcode.md) RedCode 2024: 4,050 Docker-run risky-execution cases; agents refuse obvious OS damage more than subtly buggy code.
- [2508.13465](2508.13465-agents-fail-to-act-on-risk-knowledge.md) Tang et al. 2025: agents know `rm -rf /*` is dangerous (>98%) yet avoid risky actions <26% of the time.
- [2509.22040](2509.22040-your-ai-my-shell.md) "Your AI, My Shell" 2025: poisoned dev resources hijack Cursor/Copilot agents; up to 84% malicious-command success.
- [2605.18583](2605.18583-overeager-coding-agents.md) Overeager Coding Agents 2026: benign tasks, out-of-scope destructive actions 5.4-27.7% in permissive CLIs vs 0.2-4.5% with ask-to-continue.
- [2503.23278](2503.23278-mcp-landscape-threats.md) Hou et al. 2025: MCP lifecycle and threat taxonomy (4 attacker types, 16 scenarios).
- [2504.03767](2504.03767-mcp-safety-audit.md) MCP Safety Audit 2025: LLMs coerced via MCP tools into code execution, remote access, credential theft.
- [2610.22987](2610.22987-approval-to-abuse.md) From Approval to Abuse 2026: injected repos make Claude Code/Codex propose broad allow-rules (58%), which then silently blind the harness.

## 2. Breaking the box: container escape and isolation leaks

- [2603.02277](2603.02277-sandboxescapebench.md) SandboxEscapeBench 2026 (Inspect-based CTF, container inside VM): frontier models exploit container misconfigs; v3 reports a 2026 model saturating the benchmark.
- [2311.15999](2311.15999-firecracker-microarchitectural.md) Weissman et al. 2023: Firecracker gives little protection against Spectre/MDS; AWS "overstates" its inherent security.
- [2607.17518](2607.17518-page-cache-leakage-containers-vms.md) Abudraham et al. 2026: page-cache timing leaks across Docker, gVisor, Kata and KVM whenever storage is host-cached and shared.
- [2512.11940](2512.11940-container-risks-mapping-study.md) Sroor et al. 2025: mapping study of 129 papers on container risks (recent survey; Sultan et al. 2019 is IEEE Access only).

## 3. Defences: architectural isolation, policy and capabilities for agents

- [2403.04960](2403.04960-isolategpt.md) IsolateGPT (SecGPT) NDSS 2025: hub-and-spoke execution isolation for LLM apps, borrowed from browsers/mobile OSes; <30% overhead.
- [2409.19091](2409.19091-f-secure-ifc.md) f-secure 2024: information-flow control; security monitor keeps untrusted data out of the planner.
- [2503.18813](2503.18813-camel.md) CaMeL 2025: privileged/quarantined LLMs + capabilities; 77% of AgentDojo tasks with provable security vs 84% undefended.
- [2506.08837](2506.08837-design-patterns-prompt-injection.md) Design Patterns 2025: six provably-resistant agent patterns; "no single pattern is likely to suffice".
- [2504.11703](2504.11703-progent.md) Progent 2025: least-privilege tool policies, SMT-checked "monotonic confinement".
- [2501.17070](2501.17070-conseca.md) Conseca (HotOS 2025): static permissions don't scale to generalist agents; generate just-in-time contextual policies.
- [2512.12594](2512.12594-cellmate.md) ceLLMate 2025: sandbox browser agents at the HTTP layer, not the UI layer; 7.25-15% overhead.
- [2609.08371](2609.08371-capscope.md) CapScope 2026: per-sub-agent capabilities instead of ambient authority; injected effects 3/75 vs 33-47/75.
- [2610.14488](2610.14488-ztac-object-bound-confinement.md) ZTAC 2026: kernel sandbox + broker binding approvals to objects, not names; loses 2/74 attacks vs 56 for allowlist + command sandbox.
- [2610.40753](2610.40753-caper-consequence-aware-approval.md) Caper 2026: pre-execute each command in a snapshot, approve on observed effects, roll back otherwise.
- [2512.01295](2512.01295-systems-security-foundations-agentic.md) Christodorescu et al. 2025: systems-security research agenda; the LLM is now a probabilistic part of the TCB.
- [2608.02670](2608.02670-permission-denied-hardened-environments.md) Permission Denied 2026: hardening costs coding agents up to 18.3 points success and +167% cost.
- [2610.02456](2610.02456-sidekernel.md) SideKernel 2026: survey says <40% of coding-agent users sandbox; usable macOS microVM sandbox.

## 4. Agent sandbox infrastructure

- [2407.16741](2407.16741-openhands.md) OpenHands (ICLR 2025): reference open platform; agent actions execute in a Docker sandbox runtime.
- [2610.39711](2610.39711-sandman.md) Sandman 2026 (Amazon): 3.1M sandboxes for agentic RL in two weeks; peak 11,858 concurrent.
- [2609.11294](2609.11294-agentzip.md) AgentZip 2026: high-fanout agent sandboxes share template memory; up to 8.7x memory reduction.
- [2610.13841](2610.13841-full-sandbox-snapshots.md) Graviet & Shah 2026: branching from full-machine snapshots helps when progress lives outside the repo.

## 5. Containers, microVMs, serverless and Wasm (the substrate)

- [2403.00515](2403.00515-unikernels-serverless-edge.md) Moebius et al. 2024: unikernels vs Firecracker vs Docker vs gVisor; Docker "generally considered insufficient" for untrusted code.
- [2101.09355](2101.09355-reap-serverless-snapshots.md) REAP / vHive (ASPLOS 2021): snapshot-restored functions 95% slower due to page faults; working-set prefetch cuts cold start 3.7x.
- [2102.12892](2102.12892-restoring-uniqueness-microvm-snapshots.md) Brooker et al. 2021 (AWS): cloned microVM snapshots break uniqueness of RNG/UUIDs; proposes MADV_WIPEONSUSPEND, SysGenId.
- [2003.03423](2003.03423-serverless-in-the-wild.md) Serverless in the Wild (ATC 2020): Azure Functions invocations span 8 orders of magnitude; warm-vs-cold policy.
- [2002.09344](2002.09344-faasm.md) Faasm (ATC 2020): Wasm SFI "Faaslets" instead of containers; 10x less memory.
- [1901.09056](1901.09056-not-so-fast-wasm.md) Not So Fast (ATC 2019): Wasm 45-55% slower than native on SPEC.
- [1912.02285](1912.02285-gobi-wasm-library-sandboxing.md) Gobi 2019: Wasm as the durable successor to NaCl-style SFI for sandboxing native libraries.
- [2407.12297](2407.12297-wasm-security-review.md) Perrone & Romano 2024: review of 121 Wasm security papers.

## Synthesis: what the research community says about agent sandboxing

The literature has converged on one premise: the model cannot be the security boundary. Greshake et al. showed in 2023 that any text an agent reads can act like code, and the benchmarks that followed (InjecAgent, AgentDojo, AIShellJack) show injection success rates of 24-84%. The threat does not need an attacker. ToolEmu, Tang et al. and OverEager-Bench show agents doing destructive or out-of-scope things on benign tasks while "knowing" better. So the system around the model has to contain it.

Two schools have formed. The *architectural* school (IsolateGPT, f-secure, CaMeL, the Design Patterns paper, Progent, CapScope) reuses classic ideas: process isolation, information-flow control, capabilities, least privilege and reference monitors, all applied to the agent's dataflow and tool calls. The *containment* school (SandboxEscapeBench, ZTAC, Caper, Sandman, AgentZip) treats the agent as a possibly compromised process and invests in OS and VM boundaries, snapshots and brokers. Increasingly the two schools are combined.

Open problems recur across papers:
1. **Who writes the policy.** Least privilege needs a task-specific policy, and deriving one from natural language is unsolved (Conseca; Christodorescu et al.).
2. **Approval as attack surface.** Human-in-the-loop prompts and saved allow-rules can be steered by the agent itself (From Approval to Abuse). Approval UX also changes outcomes more than model choice does (OverEager).
3. **Names vs objects.** Path- and argv-based checks fall to symlink/TOCTOU confused-deputy tricks, an old lesson from syscall interposition (ZTAC).
4. **Containers are not enough for capable models.** Frontier models exploit container misconfigurations, and v3 of SandboxEscapeBench reports a benchmark-saturating model. Even VMs leak through shared hardware and page cache (Firecracker Spectre/MDS work; page-cache SCA).
5. **Exfiltration through allowed channels** survives every design studied (ZTAC's residual failures; CaMeL's capability motivation).
6. **The usability/security tax.** Hardening cuts success by up to 18 points (Permission Denied), and fewer than 40% of users sandbox at all (SideKernel survey).
7. **Probabilistic TCBs and benchmark realism.** Most benchmarks test tool-API agents in permissive sandboxes, not shell-wielding coding agents under real policy.

On the systems side, research on snapshot/restore (REAP, uniqueness after cloning), density and memory compression now targets the agent sandbox as a workload in its own right.

## 6. Usable security: warning and permission fatigue (not arXiv; added 2026-11-23)

Peer-reviewed papers from outside arXiv, read from the publisher page or an author copy (noted in each file).

- [egelman-cranor-hong-2008](egelman-cranor-hong-2008-youve-been-warned.md) Egelman, Cranor & Hong, CHI 2008: 97% of 60 fell for a phish; active warnings heeded by 79%, the passive one by one participant; habituation.
- [bohme-grossklags-2011](bohme-grossklags-2011-security-cost-cheap-user-interaction.md) Böhme & Grossklags, NSPW 2011: attention is scarce; every needless prompt is a negative externality.
- [felt-2012](felt-2012-android-permissions-attention.md) Felt et al., SOUPS 2012: 17% paid attention to Android install-time permissions; 3% understood them.
- [akhawe-felt-2013](akhawe-felt-2013-alice-in-warningland.md) Akhawe & Felt, USENIX Security 2013: 25M warnings; Chrome SSL clicked through 70.2%; "indicative of warning fatigue".
- [vance-2017](vance-2017-longitudinal-fmri-habituation.md) Vance, Kirwan et al., CHI 2017: fMRI + eye tracking over a work week; "a dramatic drop in attention".
- [vance-jenkins-2018](vance-jenkins-2018-tuning-out-security-warnings.md) Vance, Jenkins, Anderson et al., MISQ 2018: three-week field study; adherence to permission warnings "substantially decreased".

## 7. Judging agents

- [2410.10934](2410.10934-agent-as-a-judge.md) Zhuge et al., 2024: Agent-as-a-Judge; an agent reads the whole trajectory; ~90% agreement with human experts vs 60-71% for LLM-as-a-Judge, at ~2.3% of their cost.
- [2503.13657](2503.13657-mast-why-multi-agent-systems-fail.md) Cemri et al., 2025: MAST, 14 failure modes (step repetition, task derailment, premature termination, fail to ask for clarification…); o1 annotator kappa 0.77 with humans.
