---
title: JetBrians端插件更新日志 - 智能代码助手公有云COMATE | 百度智能云文档
url: https://cloud.baidu.com/doc/COMATE/s/2lup980mt
authors: Baidu AI Cloud (百度智能云) / 文心快码 Comate team
date: page updated 2026-06-11 (entries from 2025-05-19 to 2025-12-22 used below)
accessed: 2026-11-22
kind: docs
---

## Summary
Baidu Comate (文心快码) includes an agent named Zulu, plus a Zulu-CLI, that can run terminal commands, including auto-execution. I found no Baidu documentation describing a sandbox for those commands: no OS sandbox, container or command allowlist. What is documented is a changelog: auto-execution of detected commands, terminal reuse, a "tool security" change that blocks illegal writes to sensitive files, and fine-grained rollback. This note records the absence. The page title's typo "JetBrians" is Baidu's.

## Key points
- Isolation unit: none documented. Commands run in the user's local terminal.
- Per-session?: not applicable.
- Network egress: not documented.
- Persistence: not applicable. Rollback restores the code state before each prompt or each tool call (v3.21.0, 2025-12-22). That is recovery after the fact, not containment.
- Limits: not documented.
- Pricing: not relevant to sandboxing.
- Dated changelog facts (same page):
  - v3.6.0 (2025-05-19): Zulu can auto-execute the commands it identifies.
  - v3.10.0 (2025-07-22): commands reuse the same terminal.
  - v3.15.0 (2025-09-15): "Zulu tool security enhancement", which prevents illegal writes to and modification of sensitive files. The protected file list is not given.
- Searches in Chinese and English for 文心快码/Comate together with 沙箱, 白名单 or sandbox returned no official sandbox documentation. A CSDN post claiming to excerpt "internal docs" on an ERNIE Bot (文心一言) code interpreter sandbox, using namespaces and cgroups v2 with no network, is unverifiable and concerns a different product.

## Excerpts
> "Zulu 智能体现在支持自动执行识别到的命令，让任务执行更连贯。" — English: "The Zulu agent now supports automatically executing the commands it identifies, for more continuous task execution." (v3.6.0)

> "Zulu 工具安全增强：防止对敏感文件的非法写入与修改，提升系统安全性。" — English: "Zulu tool security enhancement: prevent illegal writes and modifications to sensitive files." (v3.15.0)

## Relevance to the talk
This is a counter-example. A major Chinese coding agent ships auto-execute with only file-write guards and rollback, and no documented sandbox. Tencent CodeBuddy and Huawei CodeArts Agent, by contrast, both document OS-level sandboxes with network policy.
