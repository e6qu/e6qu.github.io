---
title: "AWS Lambda MicroVMs" (Lambda Developer Guide: overview, core concepts, networking, security) and product page
url: https://docs.aws.amazon.com/lambda/latest/dg/lambda-microvms-guide.html
authors: Amazon Web Services
date: launched 2026-06-23 (AWS News Blog "Run isolated sandboxes with full lifecycle control: AWS Lambda introduces MicroVMs"; the blog body did not render for us, only its title); docs living, read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Lambda MicroVMs is AWS's general-purpose sandbox primitive, positioned for "sandboxes for AI", interactive dev environments, RL environments and multi-tenant CI. It is explicitly **Firecracker**: you upload a Dockerfile, Lambda builds it, boots it, and captures a Firecracker memory+disk snapshot, and every `run-microvm` restores from that snapshot. Each MicroVM is "an isolated compute environment for a single tenant, user session, or job". It can auto-suspend when idle with state preserved and resume on traffic, for up to 8 h. Egress is **open to the public internet by default**, with a VPC egress connector as the alternative. Inbound goes through a service-managed HTTPS endpoint gated by port-scoped JWE tokens. AWS's Marc Brooker said on HN that this is the same technology as AgentCore Runtime (`../hackernews/virtualization-density/hn-48642510-lambda-microvms.md`).

## Key points
- **VMM:** "AWS Lambda MicroVMs deliver these core capabilities through Firecracker virtualization, which powers Lambda Functions' 15 trillion+ monthly invocations." The guest is Amazon Linux 2023 built on a Lambda-published managed base image.
- **Snapshot build:** Lambda provisions a fresh MicroVM, runs the Dockerfile, starts the app, waits for the `/ready` hook, then "captures a snapshot of the disk and memory state, including all running processes". **Clone hazard:** unique content generated at build time ("unique IDs, secrets, or network connections") "is shared across all MicroVMs run from the same image version". Generate it in the `/run` hook instead.
- **Lifecycle:** PENDING → RUNNING → SUSPENDING → SUSPENDED → RUNNING … → TERMINATED. Suspension happens after `maxIdleDurationSeconds` or via API, and "No compute charges accrue" while suspended. Auto-resume on traffic is optional. Termination happens after `maximumDurationInSeconds` or `suspendedDurationSeconds`. The product page says "preserves full memory and disk state for up to 8 hours". There are lifecycle hooks `/run`, `/resume`, `/suspend`, `/terminate`, `/ready`, `/validate`.
- **Sizes:** The bandwidth table lists baselines from 0.5 GB / 0.25 vCPU to 8 GB / 4 vCPU, with vertical burst "to 4x of configured baseline". Ingress bandwidth is 2 MB/s per vCPU. *(A full quota table was not retrieved.)*
- **Inbound:** Each MicroVM has a unique `*.lambda-microvm.<region>.on.aws` HTTPS endpoint. Every request needs an `X-aws-proxy-auth` JWE token scoped to one MicroVM, a set of ports, and an expiry. Connectors: `HTTP_INGRESS`, `SHELL_INGRESS` ("Don't attach SHELL_INGRESS to production MicroVMs") and `NO_INGRESS`. Caveat: routing is by port, not path, so a token for the hooks' port can call the lifecycle-hook URLs.
- **Egress:** "By default, MicroVMs have public internet access." A customer-managed VPC egress connector (ENIs, security groups, NACLs, NAT or service-managed Elastic IPs, IPAM/BYOIP) routes outbound traffic through your VPC. Build-time and run-time connectors can differ, so a networked build can be followed by a locked-down run, the same two-phase idea as Codex cloud. No domain allowlist is offered. *(Whether egress can be switched off entirely without a VPC connector is not stated.)*
- **Credentials:** Two optional IAM roles: a build role (S3, logs, ECR) and an execution role ("If you do not provide an execution role … your MicroVM cannot access other AWS services"). Hooks run under the role of their phase. *(The delivery mechanism, presumably MMDS as in AgentCore, is not documented on the pages read.)*
- **PrivateLink:** `com.amazonaws.<region>.lambda-microvm` for data-plane traffic. Endpoint policies evaluate a pseudo-action `lambda:ConnectMicrovm` with an anonymous principal, because callers authenticate by JWE token rather than SigV4.
- **Pricing:** "per-second, based on baseline and peak usage", plus snapshot operations and storage, plus data transfer (product page). A suspended MicroVM costs no compute. *(Rates and Regions not retrieved; HN commenters estimated roughly 4× an equivalent Graviton EC2 instance if kept running.)*

## Excerpts
> "A MicroVM is a resource that represents an isolated compute environment for a single tenant, user session, or job." (Core concepts)

> "When you create or update a MicroVM image, Lambda performs a build process that produces a Firecracker snapshot." (How Lambda builds your image)

> "By default, MicroVMs have public internet access. You can create a customer-managed VPC egress connector to route outbound traffic through your VPC instead." (Networking)

## Relevance to the talk
This is where the hyperscaler turned "sandbox for agents" into a commodity primitive: Firecracker plus snapshot-restore plus suspend/resume is exactly the E2B/Vercel/Sprites recipe (`../agent-sandboxing/e2b-runtime.md`, `vercel-sandbox.md`, `flyio-sprites-code-and-let-live.md`), now as a Lambda API. Two talk points stand out. The snapshot-clone hazard (shared secrets and entropy across every restored VM) is the old VM-cloning RNG problem returning. And even AWS's purpose-built AI sandbox ships with open egress by default.
