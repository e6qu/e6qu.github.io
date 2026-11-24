---
title: "Remote Prompt Injection in GitLab Duo Leads to Source Code Theft"
url: https://www.legitsecurity.com/blog/remote-prompt-injection-in-gitlab-duo
authors: Omer Mayraz (Legit Security)
date: 2025-05-20
accessed: 2026-11-22
kind: blog
agent: GitLab Duo (Duo Chat, hosted on gitlab.com)
incident_date: reported 2025-02-12; published 2025-05-20
category: exfiltration
cve: none stated in the write-up
sandbox_at_time: hosted assistant acting with the viewing user's GitLab permissions. Output went through DOMPurify, but `<img>`, `<form>` and `<a>` survive its defaults, and streamed partial HTML was rendered before sanitisation. There was no egress restriction on rendered content
exploited_in_wild: no; researcher demonstration
---

## Summary
Legit Security hid instructions in places GitLab Duo reads as context: merge-request descriptions and comments, commit messages, issue text and source code. They concealed them with KaTeX white-on-white text, Unicode smuggling and base16 encoding. When a victim asked Duo about the MR, the hidden prompt made Duo take code changes from a *private* MR the victim could see, base64-encode them, and put them in the URL of an `<img>` tag. The victim's browser then sent the data to the attacker's server as it rendered Duo's streamed answer.

## Key points
- The assistant runs with the *viewer's* access, so an injection planted by an outsider in public content reads private content. This is Willison's lethal trifecta inside one SaaS UI.
- The exfil channel is the client's markdown/HTML renderer. Streaming rendering let raw HTML through before sanitisation.
- Legit says the same technique could leak confidential issues such as undisclosed zero-days, but did not demonstrate it.
- Fix: GitLab's duo-ui!52 stops Duo rendering unsafe tags (`<img>`, `<form>`) that point to domains outside gitlab.com. The write-up gives no version or release date for the fix.

## Excerpts
> "A hidden comment was enough to make GitLab Duo leak private source code and inject untrusted HTML into its responses."

> "AI assistants are now part of your application's attack surface."

## Would a mature sandbox have stopped it?
**Not an OS sandbox. The fix that worked was an egress allowlist at the rendering layer.** No code ran on anyone's machine. The data left through the browser fetching an image URL, and GitLab's fix is exactly an output egress allowlist (only gitlab.com targets). In mature form that is the same rule agent sandboxes apply to network traffic: default-deny egress, with the allowlist enforced where the request is made (here the renderer). Credential isolation would also help: scope the assistant to the resources in the current conversation rather than everything the user can see. Neither existed by default at the time.

## Relevance to the talk
Shows that "egress" for an agent includes every client that renders its output, not just its shell. The same class of bug (markdown-image exfiltration) recurs in Antigravity, Windsurf, Copilot Chat and others, so "network allowlist" must cover renderers as well as processes.
