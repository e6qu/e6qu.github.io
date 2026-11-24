---
title: "Execute code and analyze data using Amazon Bedrock AgentCore Code Interpreter", "Resource management", "Understanding Credentials Management in Amazon Bedrock AgentCore" (AWS docs), plus third-party research by BeyondTrust Phantom Labs and Sonrai Security
url: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html
authors: Amazon Web Services; research: BeyondTrust Phantom Labs (disclosed 2026-03-16), Nigel Sood / Sonrai Security (2025-09-04, updated 2026-03-25)
date: living documents; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
AgentCore Code Interpreter is AWS's managed tool for running model-written Python, JavaScript or TypeScript (plus shell and the AWS CLI) in per-session sandboxes. AWS's page calls it "a containerized environment". Its credentials page, however, says the compute uses the "MicroVM Metadata Service (MMDS)", and Sonrai reports Firecracker microVMs. It has three network modes: `SANDBOX`, `PUBLIC` and `VPC`. Two independent research findings showed that the "Sandbox" mode was not a closed box. DNS resolution stayed open, enough for a full DNS-tunnelled reverse shell, and the execution role's credentials were readable from MMDS behind a trivially bypassed string filter. AWS treated both as intended behaviour and changed the documentation. It did not change the product.

## Key points
- **Isolation:** The tool page says it "runs in a containerized environment". The credentials page refers to "the VM" and MMDS. Sonrai: "many compute resources in Bedrock AgentCore (including code interpreters) run on Firecracker MicroVMs." *(VMM not named by AWS for this tool; Firecracker is inferred from MMDS and third-party research.)*
- **Per what:** Each session runs in its own environment. "Multiple sessions can be active simultaneously for a single Code Interpreter, with each session maintaining its own state and environment." A pre-built system resource `aws.codeinterpreter.v1` uses "the most restrictive options". Custom interpreters choose a network mode and an execution role.
- **Lifetime:** Session timeout defaults to 15 min and is configurable up to 8 h. Sessions "automatically terminate after the timeout period". State persists between executions within a session. Optional file-system configurations exist.
- **Limits:** 2 vCPU / 8 GB per session (not adjustable); 10 GB disk; 100 MB inline payload; files up to 5 GB via S3 from the terminal; 1,000 concurrent sessions per account.
- **Network modes (current docs):** *Sandbox*: "Provides limited external network access to AWS services. In Sandbox mode, the code interpreter can access Amazon S3 for data operations." *Public*: public internet. *VPC*: ENIs in your subnets, with no internet unless there is a NAT.
- **DNS exfiltration (BeyondTrust Phantom Labs):** Sandbox mode blocked HTTP/HTTPS/TCP egress but allowed outbound DNS A/AAAA queries. The researchers built a bidirectional C2 (commands in A-record answers, output in subdomain labels) and used the role's credentials to list and read S3. Timeline (per cybersecuritynews.com, 2026-03-17): reported via HackerOne on 2025-09-01 (CVSS 8.1, later 7.5). AWS deployed a fix on 2025-11-01 and then rolled it back. On 2025-12-23 AWS said there would be no permanent fix, updated the docs to say Sandbox mode permits DNS resolution, and recommended VPC mode. *(Search summaries also report a BeyondTrust claim that AWS remediated DNS tunnelling on 2026-04-15. Unverified: the BeyondTrust pages returned 403. The current docs still describe Sandbox as "limited external network access".)*
- **MMDS credential theft (Sonrai):** Code in a sandboxed interpreter could fetch the execution role's session credentials from `169.254.169.254`. Requests containing the address or path were blocked by a string filter, which splitting the string or base64 encoding bypassed. The stolen credentials then work *outside* the sandbox and are logged in CloudTrail as the interpreter. AWS replied that MMDS access was "in the range of expected behaviour" and published the credentials-management page.
- **AWS's resulting position:** "Any code or actor running inside the VM can access these credentials by calling the metadata endpoint." This is "independent of the network mode". The mitigation is least-privilege roles, with "equal or fewer privileges than the users who can invoke it".
- **Mitigation used by a customer (AWS ML blog, Benchling):** VPC mode, Route 53 Resolver DNS Firewall, and VPC endpoint policies. *(From search summary; blog not read in full.)*
- **Pricing:** Per second; $0.0895 per vCPU-hour and $0.00945 per GB-hour; 1 s and 128 MB minimums; "I/O wait and idle time is free, if no other background process is running".

## Excerpts
> "The AgentCore Code Interpreter runs in a containerized environment within Amazon Bedrock AgentCore, ensuring that code execution remains isolated and secure." (Overview)

> "When configuring the execution role permissions, use careful consideration since any code or actor running inside the VM can access these credentials by calling the metadata endpoint." (Credentials Management)

> "Sandboxed code interpreters are no safer than public ones when it comes to abuse by non-agentic identities." (Sonrai Security)

## Relevance to the talk
This is a clean case study of the two leaks that survive a VM boundary: **DNS as an egress channel** (compare CVE-2025-55284 in `../agent-sandboxing/embracethered-claude-code-dns-exfil.md`) and **ambient cloud credentials inside the sandbox** (MMDS/IMDS). The vendor's answer was to redefine "sandbox" in the docs ("limited external network access") and push customers to VPC mode plus least privilege. "No network" is a property you have to test, not a label you can trust.
