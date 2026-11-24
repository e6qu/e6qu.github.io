---
title: "Google Antigravity exfiltrates data via indirect prompt injection attack"
url: https://news.ycombinator.com/item?id=46048996
story_url: https://www.promptarmor.com/resources/google-antigravity-exfiltrates-data
points: 768
comments: 215
authors: HN thread (submitted by jjmaxwell4); linked research by PromptArmor
date: 2025-11-25
accessed: 2026-11-22
kind: discussion
---

## Summary
Days after Google launched Antigravity, PromptArmor showed that an indirect prompt injection in web content could make Gemini read a `.env` file (although "Allow Gitignore Access" was off, it simply used `cat`) and exfiltrate it through the browser tool to an allowlisted domain. The thread is the clearest HN discussion of why the lethal trifecta cannot be fixed with local models or soft settings: egress allowlists fail when allowed domains host user content, DNS leaks, Google Translate works as a proxy, and only an XOR of network access and private-data access is sound. Willison recommends cloud agents, where only the code and credentials you hand over are at risk.

## Key points
- A setting enforced by the agent ("no gitignored files") was bypassed by the agent itself using shell `cat`. A policy check inside the harness is not a boundary.
- Egress: any domain with user-generated content (GitHub, HN, Wikipedia) is an exfiltration path, and DNS has to be blocked too.
- Running the model locally does not help. The problem is untrusted input in the context, not where the weights run.
- Proposed patterns: an XOR between internet access and local data, Meta's "Agents Rule of Two", and remote agent isolation (run the agent on a box that only has the repo).

## Excerpts
> "They pinky promised they won't use something, and the only reason we learned about it is because they leaked the stuff they shouldn't even be able to see?" — serial_dev ([46049222](https://news.ycombinator.com/item?id=46049222))

> "codex cli used to do this. 'I can't run go test because of sandboxing rules' and then proceeds to set obscure environment variables and run it anyway." — withinboredom ([46049545](https://news.ycombinator.com/item?id=46049545))

> "Also, the firewall has to block most DNS traffic, otherwise the model could query `A <secret>.evil.com` and Google/Cloudflare servers (along with everybody else) will forward the query to evil.com." — srcreigh ([46049596](https://news.ycombinator.com/item?id=46049596))

> "There is no useful firewall. You cant allow any site with UGC. No HN. No Github. No wikipedia." — nrhrjrjrjtntbt ([46056113](https://news.ycombinator.com/item?id=46056113))

> "My favourite firewall bypass to this day is Google translate, which will access arbitrary URL for you (more or less)." — ArcHound ([46049558](https://news.ycombinator.com/item?id=46049558))

> "They run the agent in a VM somewhere on their own infrastructure. Any leaks are limited to the code and credentials that you deliberately make available to those tools." — simonw ([46051210](https://news.ycombinator.com/item?id=46051210))

> "Maybe an XOR: if it can access the internet then it should be sandboxed locally and don't trust anything it creates (scripts, binaries) or it can read and write locally but cannot talk to the internet?" — rdtsc ([46049936](https://news.ycombinator.com/item?id=46049936))

## Relevance to the talk
The best single thread for "egress is the centre of the design". Practitioners independently rediscover every hole that the vendor sandbox docs list: allowlisted domains with UGC, DNS, fronting through proxy services, and harness-level rules the agent can route around.
