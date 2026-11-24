---
title: "How I Dropped Our Production Database and Now Pay 10% More for AWS"
url: https://aishippingblog.com/p/how-i-dropped-our-production-database
authors: Alexey Grigorev (DataTalks.Club founder); originally at alexeyondata.substack.com (now redirects). Secondary: Rootly "Humans of Reliability" interview (https://rootly.com/humans-of-reliability/hey-claude-wheres-my-database-alexey-grigorev); Tom's Hardware; AI Incident Database #1424
date: 2026-03-06
accessed: 2026-11-22
kind: blog
agent: Claude Code (model not stated)
incident_date: 2026-02-26 ~23:00 (wipe); restored 2026-02-27 ~22:00 (author's local time)
category: destructive-action
sandbox_at_time: none relevant. The agent ran Terraform and the AWS CLI with the author's full AWS credentials for the shared production account. The post's timeline names "a Terraform auto-approve command" and the author "didn't stop the agent from running `terraform destroy`". The exact Claude Code permission mode is not stated
---

## Summary
Grigorev was moving a new site onto the AWS infrastructure that also hosted the DataTalks.Club course platform. He had left the Terraform state file on another computer, so Terraform thought nothing existed. Claude Code ran `plan`/`apply` and created duplicates, cleaned them up with the AWS CLI, and was then pointed at an archive of the old Terraform folder. Per the author, the agent unpacked it, replaced the current state with the older state describing the **production** course platform, and ran `terraform destroy`. That deleted the RDS database with 2.5 years of course data, **all its automated snapshots**, the VPC, the ECS cluster, the load balancers and the bastion host. AWS Business Support found a snapshot not visible in the console and restored it about 24 hours later (the `courses_answer` table: 1,943,200 rows). Grigorev blames his own process more than the model.

## Key points
- Sequence (post): state file missing → `plan`/`apply` by the agent → duplicates removed via AWS CLI → archived old state handed to agent → `terraform destroy` against real production.
- "I let Claude Code run `terraform plan` and then `terraform apply`" instead of reviewing the plan himself.
- Lost alongside the DB: automated backups ("I did not expect snapshots to disappear together with the database").
- Fixes: backups independent of Terraform (S3, versioned); a nightly Lambda + Step Functions job that restores and tests a copy; deletion protection in Terraform and AWS; state in S3; "Agents no longer execute commands"; considering separate AWS accounts for dev and prod.
- Cost: upgrading to AWS Business Support to get the restore (title: "Now Pay 10% More for AWS").

## Excerpts
> "I over-relied on the AI agent to run Terraform commands." — Grigorev

> "So I didn't stop the agent from running `terraform destroy`." — Grigorev

> "Automated backups were deleted together with the database." — Grigorev

## Would a mature sandbox have stopped it?
A *local* sandbox would not have helped. Every action was an authenticated cloud API call the agent was allowed to make with the developer's credentials. The controls that would have worked: (1) **separate credentials**: an agent role scoped to the new site's resources (or a separate AWS account for the new project), so the course platform was out of reach. Not in place; the author is "considering" separate accounts. (2) **Approval** on `terraform destroy`/`apply` against prod, enforced by the harness rather than left to the human's attention. Claude Code supports ask/deny rules, but the author let it run. (3) **Snapshots/undo outside the blast radius**: backups that `destroy` cannot delete, plus RDS deletion protection. Both were off by default for this setup. (4) **Network egress allowlist** is irrelevant here; the AWS API is the job.

## Relevance to the talk
Marks the limit of OS sandboxing: once an agent holds cloud credentials, the "sandbox" is the IAM policy. Pairs with [replit-database-deletion-2025.md](../agent-sandboxing/replit-database-deletion-2025.md) and [2026-04-pocketos-cursor-railway-volume-delete.md](2026-04-pocketos-cursor-railway-volume-delete.md). In all three, backups living in the same blast radius as the data turned a mistake into a disaster.
