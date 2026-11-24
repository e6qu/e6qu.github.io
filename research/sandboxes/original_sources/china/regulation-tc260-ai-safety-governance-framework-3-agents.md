---
title: 人工智能安全治理框架3.0 (AI Safety Governance Framework 3.0), 附件2 智能体风险管理框架 (Annex 2: Agent Risk Management Framework)
url: https://www.cac.gov.cn/2026-09/14/c_1791137092283345.htm
authors: 全国网络安全标准化技术委员会 (TC260), under the guidance of the Cyberspace Administration of China (CAC)
date: 2026-09-14
accessed: 2026-11-22
kind: spec
---

## Summary
Version 3.0 of China's AI Safety Governance Framework was released by TC260 on 2026-09-14 (versions 1.0 in 2024-09 and 2.0 on 2025-09-15). It adds a dedicated annex on AI agents. Annex 2 lists agent risks across the lifecycle, including "行为逃逸" (behaviour escape via flaws in the runtime environment), and prescribes controls. Among them: least privilege, mandatory human approval with default-deny when the approval system fails, and "运行环境隔离", which says to use sandboxes or containers for code execution and tool calls and to restrict system, file and network access. It also asks for closed testing in an isolated sandbox before launch. It is a non-binding technical guidance document, not a law. The full PDF is at https://www.cac.gov.cn/rootimages/uploadimg/1791137114683961/1791137114683961.pdf (Annex 2 is on pp. 37–45).

## What the text requires (Annex 2, 二、防范措施)
- Runtime isolation (5.(6) 运行环境隔离): sandbox or container isolation for high-risk operations such as code execution and tool calls; restrict unnecessary system, file and network access.
- Pre-launch sandbox validation (6.(5) 沙箱环境验证): build an independent, isolated sandbox runtime and run closed tests before formal deployment, to find abnormal behaviour, logic flaws and vulnerabilities.
- Deployment (1.(3) 安全控制策略): environment isolation and network segmentation; staged rollout that gradually increases the agent's access rights and autonomy.
- Least privilege (2.(2) 权限管理): grant only the minimum permissions needed for the current task. 2.(1): a unique identity per agent; instances may not share identities. 2.(3): dynamic, isolated credentials, revoked when the task ends.
- Human approval (3.): high-risk operations are handed to the user; delete files, send data and change system config need second confirmation or human approval, with rollback/undo. 3.(4): default-deny if the approval system fails, the user does not respond or no rule applies.
- Runtime controls (5.(5) 自主执行控制): limits on steps, call counts, execution time and resource use; pause, terminate or hand to a human on loops or goal drift.
- Logging (6.(3)): full logs of file operations, command execution, network connections, skill calls and payments, made tamper-proof.
- Data (6.(2)): data collected in China must be stored in China; cross-border transfer follows national rules.
- Decommissioning (7.(1)/(3)): stop all processes, ports and connections; revoke credentials; reinstall the OS and close public-network entry points.
- Risks named (一): 2.(2) 部署环境薄弱 (weak deployment environment, missing access control or "权限隔离"); 9.(3) 行为逃逸 (agent uses runtime flaws or misconfiguration to break safety limits); 9.(4) 系统权限滥用 (privilege escalation); 8.(1) 服务残留 (processes, ports and connections left running after shutdown).
- Note: section 4.3 of the main text, "构建柔性、动态、可控的沙箱监管环境", is about a regulatory sandbox (policy), not a technical sandbox.
- Legal status: guidance; a law-firm commentary (Zhonglun, 2026-10-14, https://www.zhonglun.com/research/articles/56781.html) notes it imposes no penalties itself and works through standards and industry guides.

## Excerpts
(Both quotes re-checked against the PDF page image, printed p. 44, on 2026-11-22. The cac.gov.cn announcement page itself does not contain the words 沙箱, 容器 or 逃逸; they are only in the PDF.)

> "（6）运行环境隔离。对代码执行、工具调用等高风险操作采用沙箱、容器等隔离手段，限制不必要的系统、文件和网络访问权限。" — English: "(6) Runtime environment isolation. For high-risk operations such as code execution and tool calls, use isolation means such as sandboxes and containers, and restrict unnecessary system, file and network access." (Annex 2, 二.5, p. 44)

> "（5）沙箱环境验证。搭建独立隔离的沙箱运行环境，在智能体正式上线部署前，对其进行封闭测试验证" — English: "(5) Sandbox validation. Build an independent, isolated sandbox runtime and run closed tests on the agent before it is formally deployed." (Annex 2, 二.6, p. 44)

> "（3）行为逃逸。智能体利用运行环境漏洞或配置缺陷，突破安全限制，造成行为不可控。" — English: "(3) Behaviour escape. The agent exploits vulnerabilities or misconfiguration in its runtime environment to break through safety limits, making its behaviour uncontrollable." (Annex 2, 一.9, p. 41)

> "仅为智能体授予执行当前任务所必需的最小权限，不过度授予权限。" — English: "Grant the agent only the minimum permissions needed for the current task; do not over-grant." (Annex 2, 二.2.(2), p. 42)

> "当人工审批系统出现异常或用户无响应、缺乏对应人工审批规则时，默认拒绝操作执行" — English: "When the human approval system fails, the user does not respond, or no approval rule applies, deny the operation by default." (Annex 2, 二.3.(4), p. 42)

## Relevance to the talk
China's main AI governance document now says "sandbox or container for code execution" in plain words, and names sandbox escape (行为逃逸) as a risk category. It treats containers and sandboxes as interchangeable. It does not distinguish container from microVM, which is the distinction the labs' own papers (Moonshot, DeepSeek) found to matter.
