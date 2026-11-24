---
title: "Containers and Docker: how secure are they?"
url: https://news.ycombinator.com/item?id=6252182
story_url: http://blog.docker.io/2013/08/containers-docker-how-secure-are-they/
authors: HN discussion of Jérôme Petazzoni's Docker blog post; commenters include jpetazzo, shykes (Docker), bcantrill and dap (Joyent), mjg59, justincormack
date: 2013-08-21
accessed: 2026-11-22
kind: discussion
points: 117
comments: 54
---

Read via the HN Algolia items API, all comments.

## Summary
The first HN argument about whether Linux containers are a security
boundary, held five months after Docker launched (version 0.5). Petazzoni
asks for "a documented exploit for LXC" and argues that once kernel
capabilities and device access are locked down, threats are hard to
find; kernel people answer that any local-root kernel bug works from
inside a container. Joyent engineers object to the post calling Solaris
zones less exposed, and Cantrill and Petazzoni trade barbs over whose
containers are "widely deployed". Hykes admits Docker is not yet
production-ready for untrusted code, and lists the options then under
discussion: OpenVZ support, SELinux, whitelisting, or mapping root
containers to dedicated VMs.

## Key points
- Two camps form here and persist for a decade: "containers are fine once locked down; VMs have bugs too" (Petazzoni) versus "the shared kernel is the attack surface; any local root exploit escapes" (justincormack, mjg59, pacala).
- Petazzoni's counter: exploits against containers are generic Linux bugs, so they "draw much more attention and scrutiny than exploits affecting hypervisors".
- mjg59: capabilities help, but a business built on "the kernel performs capabilities checks everywhere it should" needs to review kernel entry points itself.
- Hykes (insider history): dotCloud ran "tens of thousands of lxc containers currently running untrusted code in production"; before that OpenVZ, before that vserver. Docker itself was not used in production at dotCloud.
- Petazzoni on configuration: Docker shipped `lxc.cap.drop` (deny-list) rather than `lxc.cap.keep` because many users had LXC 0.7; the `-privileged` flag was about to ship in 0.6.
- Joyent's dap: Solaris zones "have been open source since 2005 and running in hostile production environments that whole time".
- Cantrill: Joyent has "deployed hundreds of thousands of zones into production over the years -- and Joyent was running with FreeBSD jails before that."

## Excerpts
> "By the way, if anyone knows of a documented exploit for LXC, I would love to hear about it." — jpetazzo, <https://news.ycombinator.com/item?id=6252327>

> "Any local root vulnerability will also work in a container… note that a lot of kernel vulnerabilities are never really announced, just quietly fixed." — justincormack, <https://news.ycombinator.com/item?id=6253375>

> "if your business model is built on the assumption that the kernel performs capabilities checks everywhere it should then you really ought to be actively reviewing kernel entry points yourself." — mjg59, <https://news.ycombinator.com/item?id=6255624>

> "exploits affecting containers are likely to be exploits affecting all Linux systems, meaning that they will draw much more attention and scrutiny than exploits affecting hypervisors" — jpetazzo, <https://news.ycombinator.com/item?id=6253659>

> "we (dotCloud) have tens of thousands of lxc containers currently running untrusted code in production on shared infrastructure… Before that we ran openvz. And before that, we ran vserver." — shykes, <https://news.ycombinator.com/item?id=6252723>

> "Perhaps OS virtualization is a new technology for you, but understand that it's not new for everyone; some of us have been doing this for a while" — bcantrill, <https://news.ycombinator.com/item?id=6254092>

## Relevance to the talk
The opening round of the "are containers a security boundary?" debate,
with the arguments already fully formed in 2013. Pairs with
[hn-7909622](hn-7909622-docker-shocker-breakout-2014.md), where the
first public Docker breakout arrived ten months later.
