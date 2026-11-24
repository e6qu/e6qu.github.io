---
title: "We Burnt $72K testing Firebase + Cloud Run and almost went Bankrupt [Part 1] (and Part 2)"
url: https://blog.tomilkieway.com/72k-1/
authors: Sudeep Chauhan (Milkie Way, Inc.)
date: 2020-12-08 (events 2020-03-27)
accessed: 2026-11-22
kind: blog
---

The original domain no longer resolves. Read via the Wayback Machine: Part 1 https://web.archive.org/web/20220223145731/https://blog.tomilkieway.com/72k-1/ and Part 2 https://web.archive.org/web/20220223145718/https://blog.tomilkieway.com/72k-2/

## Summary
A startup testing a small web-scraping function on Google Cloud Run set a **$7 budget** and kept Firebase on the free plan. To get around Cloud Run's request timeout, the scraper POSTed each discovered URL back to the service, so that one instance scraped one page. **There was no stopping condition**: pages that linked back made the service call itself recursively, and with **max instances set to 1,000** the recursion grew exponentially. Each instance read from and wrote to Firestore every few milliseconds. The founder woke from a nap to emails saying Firebase had auto-upgraded to paid and the card had been declined. The bill rose from about $5,000 to $15,000 to $25,000 in minutes and settled near **$72,000** after two hours. At peak Firestore served about **1 billion reads per minute**, and the month's total was **116 billion reads and 33 million writes**. All the company's projects were suspended because they shared one card. Google eventually waived the bill "as a one time gesture".

## Key points
- A budget is not a limit: GCP billing lagged by about a day, so budget alerts and auto-shutoff functions fired after the damage.
- This is a self-invoking workload with an autoscaler as amplifier. It is the cloud version of the Morris worm's immortal copies and the AI Scientist's self-relaunch.
- The right sandbox controls are **hard concurrency caps, recursion and loop detection, and spend limits enforced by the platform**, not a dashboard.

## Excerpts
> "We burnt $72,000 while exploring and internally testing Cloud Run with Firebase within a few hours." (Part 1)

> "After 5 minutes, the bill read $15,000, in 20 mins, it said $25,000." (Part 1)

> "this recursion is multiplying exponentially (our max instances were set to 1000!)" (Part 2)

> "Google let go of our bill as a one time gesture!" (Part 2)

## Relevance to the talk
This is the platform-engineering horror story for "self-service infrastructure needs hard limits", and it transfers directly to agents that can spawn sub-agents or cloud jobs. Hook: *"A $7 budget, a scraper that called itself, and a $72,000 bill by teatime."* It fits the closing section on efficient, self-service agent platforms: quotas and kill switches belong to the platform.
