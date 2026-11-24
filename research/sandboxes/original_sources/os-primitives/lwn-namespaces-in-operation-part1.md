---
title: "Namespaces in operation, part 1: namespaces overview"
url: https://lwn.net/Articles/531114/
authors: Michael Kerrisk (LWN.net)
date: 2013-01-04
accessed: 2026-11-22
kind: blog
---

## Summary
Opening article of Kerrisk's seven-plus-part LWN series, written just as user namespaces were completed
for Linux 3.8. It gives the history of each namespace type with the kernel version in which it appeared,
and frames namespaces as the basis for lightweight virtualization ("containers").

## Key points
- Mount namespaces: Linux 2.4.19, 2002 — the first namespace type.
- UTS namespaces: Linux 2.6.19 (released late 2006; release year ours, not the article's).
- IPC namespaces: Linux 2.6.19 (System V IPC); POSIX message queues added in 2.6.30.
- PID namespaces: Linux 2.6.24 (released January 2008).
- Network namespaces: work started in 2.6.24, largely complete around 2.6.29.
- User namespaces: started in 2.6.23, "functionally complete" in Linux 3.8 (released February 2013).
- Not in the 2013 article (later additions, see namespaces(7)): cgroup namespace (4.6, 2016), time namespace (5.6, 2020).
- Series parts: 2 API; 3–4 PID namespaces; 5–6 user namespaces; 7 network namespaces; plus mount-propagation articles.

## Excerpts
> "The purpose of each namespace is to wrap a particular global system resource in an abstraction" — intro

> "Mount namespaces were the first type of namespace to be implemented on Linux, appearing in 2002." — history section

> "the implementation of user namespaces is now functionally complete." — on Linux 3.8

## Relevance to the talk
Source for the namespace timeline slide: an eleven-year assembly (2002 → 2013) of the pieces that
Docker would package in 2013. Containers were never a single kernel feature.
