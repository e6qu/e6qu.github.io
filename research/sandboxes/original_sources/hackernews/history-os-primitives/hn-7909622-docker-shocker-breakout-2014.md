---
title: "Docker container breakout?"
url: https://news.ycombinator.com/item?id=7909622
story_url: http://stealth.openwall.net/xSports/shocker.c
authors: HN discussion of Sebastian Krahmer's "shocker.c" exploit; commenters include shykes and ewindisch (Docker), rwmj (Red Hat), amluto and philips in a companion thread
date: 2014-06-18
accessed: 2026-11-22
kind: discussion
points: 317
comments: 89
---

Read via the HN Algolia items API. Companion thread the same day:
[Docker breakout exploit analysis](https://news.ycombinator.com/item?id=7913420)
(16 points), where Andy Lutomirski and CoreOS's Brandon Philips comment.

## Summary
The first public Docker escape: shocker.c used `open_by_handle_at()`,
reachable because Docker ≤0.11 left `CAP_DAC_READ_SEARCH` in containers,
to brute-force inode handles and read the host's `/etc/shadow`. Docker
1.0 had already dropped the capability (switching from a capability
deny-list to an allow-list), so the exploit failed on current releases.
Hykes' reply is the clearest statement from Docker's creator that Docker
was not, out of the box, a sandbox for untrusted root code.

## Key points
- Mechanism: `CAP_DAC_READ_SEARCH` + `open_by_handle_at(2)` lets a process open files by handle and bypass the mount namespace entirely; a commenter confirmed it also worked against stock LXC on Ubuntu 12.04 until `dac_read_search` was added to `lxc.cap.drop`.
- The fix had landed for non-security reasons: Docker moved from a capability "drop" list to a "keep" list before 1.0 (gtjay, citing docker issue 5661).
- Hykes' advice: add AppArmor or SELinux, map trust groups to separate machines, don't grant root; user namespaces "a great additional security layer but also not a silver bullet".
- Others: "Use SELinux. Nothing with a shared kernel is going to be very secure" (hapless); "real virtualization + SELinux + sVirt" (rwmj); "Now try breaking out of a FreeBSD jail" (floatboth).
- In the companion thread Lutomirski says user namespaces solve the problem and are "far better than doing containerization with funny cgroup games and crossed fingers"; Philips replies that libcontainer is getting user-namespace support.
- A paraphrased Theo de Raadt line circulates: people writing VM/container software do not "suddenly… gain super human programming powers".

## Excerpts
> "Please remember that at this time, we don't claim Docker out-of-the-box is suitable for containing untrusted programs with root privileges." — shykes, <https://news.ycombinator.com/item?id=7910117>

> "When we feel comfortable saying that Docker out-of-the-box can safely contain untrusted uid0 programs, we will say so clearly." — shykes, <https://news.ycombinator.com/item?id=7910117>

> "Here is your annual reminder: Use SELinux. Nothing with a shared kernel is going to be very secure." — hapless, <https://news.ycombinator.com/item?id=7910470>

> "Why does everything think that when it comes to writing VM/container software suddenly people gain super human programming powers and no longer make the same mistakes they make writing operating systems?" (paraphrasing de Raadt) — valarauca1, <https://news.ycombinator.com/item?id=7910049>

> "user namespaces solve this problem… they're far better than doing containerization with funny cgroup games and crossed fingers (i.e. what Docker does now)." — amluto, <https://news.ycombinator.com/item?id=7913797>

> "Now try breaking out of a FreeBSD jail ;-)" — floatboth, <https://news.ycombinator.com/item?id=7911530>

## Relevance to the talk
The concrete case behind "containers don't contain": a single leftover
capability defeated the mount namespace. Shows the deny-list → allow-list
lesson that seccomp profiles and Docker's default capability set later
encoded, and the early hope placed in user namespaces.
