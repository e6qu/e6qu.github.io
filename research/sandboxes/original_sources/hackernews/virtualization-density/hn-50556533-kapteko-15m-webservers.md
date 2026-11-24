---
title: "15M web servers on one VM – smoltcp, DPDK, AF_XDP"
url: https://news.ycombinator.com/item?id=50556533
story_url: https://kapteko.com/15-million-webservers/
authors: HN discussion (submitted by fessguid) of Artem's kapteko.com post
date: 2026-11-19
accessed: 2026-11-22
kind: discussion
points: 409
comments: 45
---

## Summary
The kapteko post reached the HN front page (409 points). Its companion post, "Running 10 million Codex CLIs on one server – LFI processes", got 1 point (https://news.ycombinator.com/item?id=50155677), and so did the userland scheduler post (https://news.ycombinator.com/item?id=50357431). Most comments praise the writing and humour. The few technical comments question what counts as "a web server", say smoltcp's default connection limits make it a toy for real traffic, compare kernel-bypass designs to exokernels, and criticise XDP in practice. Nobody in the thread engages with the LFI isolation side.

## Key points
- Setup as restated by a commenter: "15 million web servers on one VM with 10GB of RAM and 1 CPU core" (3abiton).
- Definition challenge: from the client side, "15 million IP/port combinations that respond to HTTP", which an iptables transparent-proxy wildcard could also do (cowlevel).
- Skepticism: "Smoltcp has such low concurrent connection limits by default there's no way it would be used in any meaningful way to serve web content on the internet" (pomatic).
- Architecture lens: eBPF/XDP plus a user-space TCP/IP library looks more like an exokernel than a microkernel (bewo001). The Cheetah web server on XOK, which stored pre-formatted TCP packets, is cited (cowlevel).
- XDP in practice: features vary by NIC driver, so you may have to read kernel source (iakie).
- The density claims and per-guest numbers (about 620 B idle per smoltcp server, kernel socket about 3.3 KB) are in `../../density/kapteko-15-million-webservers.md`, not in the thread.

## Excerpts
> "The goal is to run 15 million web servers on one VM with 10GB of RAM and 1 CPU core. The title is underselling the story." — 3abiton, https://news.ycombinator.com/item?id=50557301

> "From the client perspective it actually means 15 million IP/port combinations that respond to HTTP - which you can do all in one go with an appropriate wildcard selector (such as with iptables transparent proxy)" — cowlevel, https://news.ycombinator.com/item?id=50558328

> "Smoltcp has such low concurrent connection limits by default there's no way it would be used in any meaningful way to serve web content on the internet." — pomatic, https://news.ycombinator.com/item?id=50559783

> "with ebpf, I'd argue it's getting closer to an exokernel" — bewo001, https://news.ycombinator.com/item?id=50558378

> "With the trend of moving everything to userland, maybe Linux finally become a microkernel." — mrheosuper, https://news.ycombinator.com/item?id=50557257

## Relevance to the talk
Shows how HN received the density experiments: the 15M demo was popular, but the LFI isolation argument behind it ("10 million Codex CLIs") got no discussion. The commenters' "what counts as a server" objection is worth pre-empting on the slide. Pairs with `../../density/kapteko-10-million-codex-clis.md`.
