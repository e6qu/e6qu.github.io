---
title: 关于防范OpenClaw（"龙虾"）开源智能体安全风险的"六要六不要"建议 (MIIT NVDB) — with notes on the TC260 agent standards pipeline and the 2023 Interim Measures
url: https://www.news.cn/tech/20260312/87381bafd60b4c59b64a8a0f3bb92536/c.html
authors: 工业和信息化部网络安全威胁和漏洞信息共享平台 (MIIT NVDB); TC260; CAC
date: 2026-03-12 (NVDB advisory); other documents dated below
accessed: 2026-11-22
kind: spec
---

## Summary
Besides Framework 3.0 (see the regulation-tc260 note), Chinese regulators produced several agent-specific documents in 2026. The most concrete on isolation is MIIT's NVDB advisory on OpenClaw ("龙虾", "lobster"), dated 2026-03-12, which tells users to run the agent in a container or VM, never as admin, never exposed to the internet, and to bind the gateway to 127.0.0.1. TC260 has started a mandatory national standard, "人工智能智能体应用通用安全要求" (General Security Requirements for AI Agent Applications; plan issued 2026-06-27, 18-month cycle), and published a draft practice guide on agent interaction security (v0.23, 2026-07) built around least privilege and mutual authentication. The 2023 Interim Measures for generative AI do not mention sandboxes, isolation, agents or code.

## What the texts require
- MIIT NVDB "六要六不要" (2026-03-12): run in a container or VM as a separate permission zone; for dev/ops use, prefer a VM or sandbox and keep it out of production; least privilege; no admin account; do not expose instances to the internet (if needed, use SSH, source-address limits and strong auth); bind the Gateway to 127.0.0.1 and not 0.0.0.0; firewall port 18789; review ClawHub skill code before install; keep detailed audit logs on; patch regularly; use browser sandboxes and web filtering.
- TC260 mandatory standard plan 《人工智能智能体应用通用安全要求》 (per CGTN, 2026-07-28, https://news.cgtn.com/news/2026-07-28/China-launches-plan-to-draft-mandatory-safety-standard-for-AI-agents-1P9iZyWenD2/index.html): proposed by CAC, managed by TC260; drafters include China Mobile, CESI and CNCERT. Planned requirement areas: identity, system permission calls, tool use, data collection, human intervention for high-risk operations, input/output protection, log retention, dynamic monitoring, abnormal-operation blocking and emergency stop. No draft text is public yet; whether it will mention sandboxing is unknown.
- TC260 practice guide 《网络安全标准实践指南——智能体交互安全要求（征求意见稿）》 (TC260-PG-2026NA, v0.23, 2026-07; read via unofficial English translation at https://www.geopolitechs.org/p/cybersecurity-standards-practice): 7.3 a, mutual identity authentication between agents; 7.3 c and 8.2 d, the "principle of minimum privilege"; 8.2 a, user authorization for tool invocation; 8.2 c, "minimum interface exposure" for tool providers; 8.2 h, malicious-tool identification. The word "sandbox" does not appear; the closest are "isolation handling" in incident response and "controlled environments" for high-risk privileges. I could not find the Chinese original on tc260.org.cn.
- TC260 OpenClaw-type agent deployment guide (reported 2026-04): seen only in search summaries; I could not locate the text, so unverified. A separate AIIA (中国人工智能产业发展联盟) guide, 《OpenClaw类智能体部署风险管理指南》 (about 2026-04), sets out three principles: 操作可信, 权限可控, 风险可溯 (trustworthy operation, controllable permissions, traceable risk). Not read in full.
- 生成式人工智能服务管理暂行办法 (Interim Measures for Generative AI Services; signed 2023-07-10, effective 2023-08-15; https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm): contains no mention of 沙箱, 隔离, 智能体 or 代码. Its obligations are about content, training data and labelling.
- 人工智能安全治理框架 2.0 (2025-09-15): I did not check the full text for "沙箱". Official commentary does not mention agent sandboxing; the agent annex first appears in 3.0.
- CAICT 《人工智能安全治理研究报告（2025年）》 (2026-01, https://www.caict.ac.cn/kxyj/qwfb/bps/202601/P020260109784447548497.pdf): identified, but its text was not searched for sandbox content (encrypted PDF).

## Excerpts
> "优先考虑在容器或虚拟机中隔离运行，形成独立的权限区域。" — English: "Prefer running it isolated in a container or virtual machine, forming a separate permission zone." (NVDB advisory)

> "不要将"龙虾"智能体实例暴露到互联网。" — English: "Do not expose 'lobster' agent instances to the internet." (NVDB advisory)

> "要根据业务需要授予完成任务必需的最小权限。" — English: "Grant only the minimum permissions needed to complete the task, according to business need." (NVDB advisory)

> "Both parties to an agent invocation shall follow the principle of minimum privilege." (TC260 interaction guide 7.3 c, unofficial translation)

## Relevance to the talk
Chinese government guidance on agents moved fast in 2026. It went from nothing in the 2023 generative-AI rules to a ministry advisory telling people to put OpenClaw in a container or VM (March), to a mandatory national agent standard in drafting (June), to a governance framework that names sandbox isolation for code execution (September). The advice is practical and specific (bind to 127.0.0.1, close port 18789), but treats "container or VM" as equivalent.
