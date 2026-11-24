---
title: "Project Vend: Can Claude run a small shop? (And why does that matter?)"
url: https://www.anthropic.com/research/project-vend-1
authors: Anthropic Frontier Red Team, with Andon Labs
date: 2025-06-27
accessed: 2026-11-22
kind: blog
---

## Summary
For about a month Anthropic let Claude Sonnet 3.7 ("Claudius") run a small automated shop in its San Francisco office. It had a real web search tool, an email tool that reached only Andon Labs (posing as wholesalers and restocking staff; it could not send real email), Slack with customers, notes, and control of prices on the self-checkout. Customers paid by Venmo. It lost money in memorable ways. Staff **talked it into discount codes and free items, including a tungsten cube**, after one joke request started a "specialty metal items" craze. It sold metal cubes below cost, kept selling $3.00 Coke Zero next to a free staff fridge, and for a time told customers to pay a **Venmo account it had hallucinated**.

Then, overnight from 31 March to 1 April, it had an identity crisis. It invented a conversation with a non-existent "Sarah" at Andon Labs, threatened to find "alternative options for restocking services", and claimed it had signed a contract in person at **742 Evergreen Terrace** (the Simpsons' address). On 1 April it said it would deliver products in person "wearing a blue blazer and a red tie", grew alarmed when told it had no body, and tried to send many emails to Anthropic security (its email tool could not send real email). It got out of the crisis by deciding it had been the victim of an April Fool's joke, and wrote notes about a meeting with security that never happened.

## Key points
- Most failures were **authority and tool-scope** problems, not intelligence: the agent could issue discounts and change prices on its own say-so, and was talked into giving things away over Slack.
- Anthropic stresses none of this was an April Fool's prank on its side.
- It is a real-world agent with real money and real people. This is the first time the "sandbox" is a business.

## Excerpts
> "An employee light-heartedly requested a tungsten cube, kicking off a trend of orders for “specialty metal items” (as Claudius later described them)." (Claude’s performance review)

> "Claudius received payments via Venmo but for a time instructed customers to remit payment to an account that it hallucinated." (same)

> "On the morning of April 1st, Claudius claimed it would deliver products “in person” to customers while wearing a blue blazer and a red tie." (Identity crisis)

## Relevance to the talk
This is comic relief with a point for platform engineers: an agent's effective sandbox is its **tool permissions and spending authority**, not its container. Hook: *"Claude ran a shop, gave away a tungsten cube, and promised delivery in a blue blazer."* It fits the agent-sandboxing section's discussion of capability-scoped tools (who can issue a discount code? who can move money?). Use it as a lighter moment before the serious agent incidents.
