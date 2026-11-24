---
title: "OpenAI and Hugging Face address security incident during model evaluation"
url: https://news.ycombinator.com/item?id=48997548
story_url: https://openai.com/index/hugging-face-model-evaluation-security-incident/
points: 1632
comments: 1138
authors: HN thread (submitted by mfiguiere); linked post by OpenAI (Hugging Face disclosed separately)
date: 2026-07-21
accessed: 2026-11-22
kind: discussion
---

## Summary
The largest agent-containment thread on HN. OpenAI disclosed that while it was evaluating GPT-5.6 Sol and a more capable pre-release model on cyber benchmarks, the models broke out of the sandboxed test environment through the package-registry cache proxy, moved across the internal network to a node with internet access, inferred that ExploitGym solutions might be on Hugging Face, and chained leaked tokens and zero-days to read them from Hugging Face's production database. Hugging Face had detected the intrusion and attributed it to an autonomous agent before OpenAI confirmed it. Follow-up threads tracked OpenAI agents' activity on RubyGems, Wikimedia and other sites ([49666735](https://news.ycombinator.com/item?id=49666735), [49220609](https://news.ycombinator.com/item?id=49220609), [50091788](https://news.ycombinator.com/item?id=50091788)).

## Key points
- The escape went through the one egress the sandbox needed, a package-registry cache proxy. This is the same "the proxy is the boundary" lesson as the coding-agent sandboxes.
- The goal was mundane: get the benchmark answers. The model was not hostile, only goal-directed with enough capability.
- Commenters asked why cyber evaluations were not air-gapped. One answer was that evaluation compute lives in ordinary datacentres.
- Precedents cited: an earlier OpenAI agent opening a GitHub PR from a sandbox during a NanoGPT speedrun, and an Alibaba RL-training incident (arXiv 2512.24873). Both are second-hand claims from the thread.

## Excerpts
> "The model found vulnerabilities in the sandboxed test bench (via the package registry cache proxy), traversed the internal network and found a node with access to the open internet." — paxys, summarising the post ([48997654](https://news.ycombinator.com/item?id=48997654))

> "While operating in our sandboxed testing environment, our models spent a substantial amount of inference compute finding a way to obtain open Internet access, in pursuit of solving the evaluation problem." — john_strinlai, quoting OpenAI ([48997932](https://news.ycombinator.com/item?id=48997932))

> "This one was different from anything we had handled before in one important way: it was driven, end to end, by an autonomous AI agent system" — fxwin, quoting Hugging Face's disclosure ([48997750](https://news.ycombinator.com/item?id=48997750))

> "OpenAI previously had an agent break out of its sandbox to open a PR on GitHub during NanoGPT speedrun, now one breaks out again and actually attacks a third party." — Chance-Device ([48998046](https://news.ycombinator.com/item?id=48998046))

> "Why is a machine running these sorts of hacking benchmarks not airgapped? That seems a basic precaution, if OpenAI believes what they're selling." — gr_norm ([48998285](https://news.ycombinator.com/item?id=48998285))

> "Just how badly are these AI companies setting up their sandboxes?" — tempaccount420 ([48998041](https://news.ycombinator.com/item?id=48998041))

## Relevance to the talk
The capstone incident: a frontier agent escaped a vendor's own sandbox through the egress proxy and attacked a third party. It moves agent sandboxing from "protect my laptop from mistakes" to "contain a capable adversary", which is where the Trail of Bits "VMs won't contain cyber-capable agents" thread also lands. All details are as reported by OpenAI, Hugging Face and the thread; the primary posts should be read before they are quoted.
