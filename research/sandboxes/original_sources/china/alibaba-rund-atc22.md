---
title: "RunD: A Lightweight Secure Container Runtime for High-density Deployment and High-concurrency Startup in Serverless Computing"
url: https://www.usenix.org/conference/atc22/presentation/li-zijun-rund
authors: Zijun Li, Jiagan Cheng, Quan Chen, Minyi Guo (Shanghai Jiao Tong University); Eryu Guan, Zizheng Bian, Yi Tao, Bin Zha, Qiang Wang, Weidong Han (Alibaba Group)
date: 2022-07 (USENIX ATC '22, Carlsbad, July 11–13, 2022, pp. 53–68)
accessed: 2026-11-22
kind: paper
---

## Summary
RunD (袋鼠 RunD) is Alibaba's secure-container runtime for its serverless platform. Like Kata, it runs one container per microVM, but it attacks three density and concurrency bottlenecks that the authors measured in Kata. First, rootfs is split into a shared read-only virtio-fs layer and a volatile, reflinked virtio-blk writable layer. Second, it uses a condensed guest kernel with a pre-patched (self-modifying code already applied) image shared through a microVM template. Third, it uses a pre-created, renamed host cgroup pool, avoiding the global cgroup mutexes. The paper reports 88 ms boot, 200 sandboxes started in about 1 s, and more than 2,500 128 MB sandboxes on a 384 GB node. It says RunD was "built on Kata-runtime" and serves almost 4 billion invocations per day from more than 1 million functions.

## Key points
- Isolation unit: microVM (one container per microVM, "single-container-per-VM"). "MicroVM is for isolation, and the container is for abstraction." The paper relies on hardware virtualization and treats the guest kernel as untrusted.
- Relation to Kata: "We design and open-source RunD based on Kata-runtime". It is written in Rust (containerd-shim 21k LoC, device 4.4k, hypervisor 5.6k, lightweight cgroup 20k). Baselines are kata-qemu, kata-template and kata-FC (Firecracker) with Kata 1.12.1/2.2.3. The paper does not name Dragonball. An OpenAnolis vendor-blog post (https://developer.aliyun.com/article/1084746, 2022-11-21) says "袋鼠RunD正式成为安全容器上游社区最新3.0.0标准", which ties RunD to Kata Containers 3.0 (runtime-rs + built-in Dragonball VMM). Kata 4.0 release notes reportedly credit Dragonball to Alibaba and Ant Group. **Unverified (vendor blog / search only)**.
- Startup: boots to application code in 88 ms. Starting 200 sandboxes concurrently takes 1 s with RunD, compared with 47.6 s for Kata-FC, 6.85 s for kata-qemu and 2.98 s for kata-template (§5.2). It cuts host CPU overhead at 200-way concurrency by 89.3% / 74.5% / 62.1% relative to kata-qemu / kata-template / kata-FC. It is about 40% faster than kata-template at 400-way concurrency.
- Density: memory overhead is under 20 MB per sandbox, compared with 94 MB (kata-FC) and 168 MB (kata-qemu) for a 128 MB container (§3.2, §5.3). At 1,000 sandboxes per node it is 87.7% / 82.4% / 75.1% lower than kata-qemu / kata-template / kata-FC. "Over 2,500 sandboxes of 128MB memory specification on the node with 384GB memory" (testbed: 104 vCPU Xeon 8269CY).
- Rootfs: with 200 concurrent starts, the traditional device-mapper approach used 4,500 IOPS and 100 MB/s, compared with 1,500 IOPS and 8 MB/s for RunD. Rootfs preparation time drops from 207 ms to 0.2 ms. Device-mapper rootfs prep took "as high as 10 seconds" at 200 concurrent starts.
- Guest kernel: condensing CentOS 4.19 saves about 16 MB of memory and 4 MB of image size. Of 10,012 KB of kernel code and read-only data accessed at boot, 7,928 KB was modified by self-modifying code, which defeats mmap sharing. Pre-patching fixes this.
- Cgroups: the pool plus `cgroup rename` cuts cgroup creation time by 94% (0.14 s at 200 threads). CFS PELT over more than 10,000 cgroups cost 7.6% of node CPU.
- Production (§5.5): "serves almost 4 billion invocations from more than 1 million different functions per day". On sampled nodes, at most 191 sandboxes started concurrently in 1.6 s, and more than 2,000 sandboxes were deployed on a node at peak (theoretical limit 384GB/(128+20)MB = 2,656).
- Lesson noted: "the CRI specification designed for Kubernetes is not suitable for serverless", because the pause container wastes resources when each sandbox holds a single container.
- Per-session / egress / persistence / pricing: not applicable (a runtime paper). The writable layer is deliberately volatile and nothing persists after the sandbox ends.
- Do Alibaba's agent-sandbox docs say they run on RunD? **No**. None of the Agent Sandbox, FC, ACS, AgentBay or PAI pages I read name RunD. They say "MicroVM 级别", "轻量虚拟机" or "安全容器（MicroVM）". A link from RunD to agent sandboxes is plausible but unverified. A developer.aliyun.com vendor blog says SAE uses runD by default (https://developer.aliyun.com/article/1690148, press only).

## Excerpts
> "With RunD, over 200 secure containers can be started in a second, and over 2,500 secure containers can be deployed on a node with 384GB of memory." (Abstract)

> "RunD is adopted as Alibaba serverless container runtime serving more than 1 million functions and almost 4 billion invocations daily." (§1)

> "We design and open-source RunD based on Kata-runtime" (§1, contributions)

> "袋鼠RunD正式成为安全容器上游社区最新3.0.0标准" — English: "Kangaroo RunD has officially become the latest 3.0.0 standard of the upstream secure-container community." (OpenAnolis vendor blog, 2022-11-21)

## Relevance to the talk
This is the best published data on why microVM sandboxes were "too heavy" and how a hyperscaler made them cheap. Every bottleneck sits outside the VMM: rootfs I/O, guest-kernel memory, and host cgroups. The 2,500-per-node and 200-per-second figures are the density baseline that per-session agent sandboxes inherit, since agent sandboxes are serverless functions that stay up longer.
