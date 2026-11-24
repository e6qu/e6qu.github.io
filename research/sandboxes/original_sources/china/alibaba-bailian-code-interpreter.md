---
title: 如何在qwen api 中使用代码解释器 (Model Studio / 阿里云百炼)
url: https://help.aliyun.com/zh/model-studio/qwen-code-interpreter
authors: Alibaba Cloud (Model Studio / 百炼)
date: undated on the page ("更新时间" blank); read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Alibaba Cloud Model Studio (百炼) offers a built-in, server-side Python code interpreter for Qwen and some hosted third-party models (DeepSeek, Kimi). It is enabled as the `code_interpreter` tool in the Responses API, or with `enable_code_interpreter` in Chat Completions and DashScope. The docs say only that the model writes and runs Python "在沙箱环境里" (in a sandbox environment). They do not describe the isolation technology, network access, packages, timeouts or memory. The older Assistant API code-interpreter plugin, which is being taken offline, says that sandbox cannot access external networks.

## Key points
- Isolation unit: **not documented**. The page says only "在沙箱环境里编写与运行 Python 代码". No VM, container or microVM wording.
- Per-session?: not documented. One request can trigger several model calls and code executions (think → execute → integrate → answer, repeated).
- Network egress: not documented for the current tool. The legacy Assistant API plugin page (https://help.aliyun.com/zh/model-studio/code-interpreter, section "Assistant API（下线中）") lists "无法访问外部网络" (cannot access external networks) as a limitation. That page also says it cannot process data files directly and that compute resources and run time are "limited" (no numbers).
- Persistence: not documented.
- Limits: it cannot be combined with Function Calling ("代码解释器与 Function Calling 互斥"). Chat Completions and DashScope support it only in thinking mode and streaming. Chat Completions does not return the executed code. The DashScope Java SDK is not supported. Models: the Qwen3.5–3.8 / qwen4-max families, plus deepseek-v4.1-flash-1017 and kimi-k3.1-pro (Bailian deployment).
- Pricing: the tool is free for a limited time ("限时免费"), but its tokens are billed. Responses API usage reports the call count (`x_tools`).

## Excerpts
> "调用模型时启用内置的 Python 代码解释器，可使模型在沙箱环境里编写与运行 Python 代码" — English: "Enabling the built-in Python code interpreter lets the model write and run Python code in a sandbox environment." (qwen code interpreter page)

> "代码解释器与 Function Calling 互斥，不可同时启用。" — English: "The code interpreter and Function Calling are mutually exclusive and cannot be enabled together." (qwen code interpreter page)

## Relevance to the talk
This is the "hosted tool" model, like OpenAI's or Anthropic's code-execution tools. The provider runs the sandbox, and the customer gets no documented isolation boundary, network policy or limits. It contrasts with Alibaba's own Agent Sandbox and AgentBay docs, which describe VMs and egress rules in detail. For a talk it is an example of how little a model API tells you about where your model's code actually runs.
