---
title: "Finding Azurescape – Cross-Account Container Takeover in Azure Container Instances"
url: https://unit42.paloaltonetworks.com/azure-container-instances/
authors: Yuval Avrahami (Palo Alto Networks Unit 42)
date: 2021-09-09
accessed: 2026-11-22
kind: blog
---

## Summary
Unit 42 calls Azurescape "the first cross-account container takeover in the public cloud". They first deployed **WhoC**, a container image that reads the container runtime binary executing it (the CVE-2019-5736 trick turned to reading rather than writing). It showed that Azure Container Instances (ACI) ran **runC v1.0.0-rc2, released 1 October 2016** and vulnerable to at least two breakout CVEs. They reused their 2019 PoC for CVE-2019-5736 and got a root shell on the underlying Kubernetes node. That was still within their tenant, because ACI gave each customer its own node VM. The node ran Kubernetes 1.8–1.10 (2017–2018), with a Kubelet that allowed anonymous access. The cross-tenant step was an oddity: `az container exec` requests reached the node from a custom **"bridge" pod**, and those requests **carried the bridge's Kubernetes service account token in an `Authorization` header**, although the Kubelet did not need it. The token had the `pods/exec` privilege on any pod, including the api-server, which made them "cluster admins with full control over the multitenant cluster" (about 100 customer pods on about 120 nodes). A second route, tricking the bridge with a forged `status.hostIP`, gave the same result. Microsoft patched it; there was no known exploitation in the wild.

## Key points
- Defence in depth partly worked: the container escape landed in a per-tenant node VM, which is "a somewhat expected threat, tolerated through node-level isolation."
- What broke the tenancy was the **control plane**: an over-privileged token sent to every node. Compare o1 and the Docker API, and the OpenAI/Hugging Face Artifactory route.
- The runtime was five years old. Patch hygiene of the sandbox itself is part of the sandbox.

## Excerpts
> "Researchers named the vulnerability Azurescape – the first cross-account container takeover in the public cloud." (Executive Summary)

> "RunC v1.0.0-rc2 was released on Oct. 1, 2016, and was vulnerable to at least two container breakout CVEs." (Escaping Our Container)

> "While we escaped our container, we were still within the tenant boundary – the node VM." (same)

> "If you run Kubernetes, be careful to whom you send your service account tokens" (Bridge section)

## Relevance to the talk
This is the definitive "container in a VM, still owned" platform story for the containers and multi-tenancy section. Hook: *"Azure ran your container on a 2016 runC — and then mailed every node a cluster-admin token."* The lesson for agent platforms is that the container is not the boundary, the VM per tenant mostly held, and the control plane's credentials are what actually failed.
