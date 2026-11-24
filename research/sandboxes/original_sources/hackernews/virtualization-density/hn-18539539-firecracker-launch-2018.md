---
title: "Firecracker – Lightweight Virtualization for Serverless Computing"
url: https://news.ycombinator.com/item?id=18539539
story_url: https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/
authors: HN discussion (submitted by leef) of Jeff Barr's AWS launch post
date: 2018-11-27
accessed: 2026-11-22
kind: discussion
points: 368
comments: 110
---

## Summary
The HN thread on the day AWS open-sourced Firecracker. Most commenters wanted to know whether it meant "containers as Lambdas" and faster cold starts. The informed part of the thread is about lineage: Intel Clear Containers/Kata had shown sub-200 ms KVM containers earlier, Firecracker is a stripped-down VMM rather than a hypervisor, and it began as a fork of ChromeOS's crosvm. Anthony Liguori (AWS) explains the design choice: keep KVM, drop QEMU.

## Key points
- Firecracker's own principal engineer (aliguori) frames it as a QEMU replacement inside Kata-style stacks, not a Kata competitor: "Firecracker just replaces the QEMU part".
- Prior-art complaint: Clear Containers had "sub 200 ms boot times" more than three years earlier (kraemate).
- Comparison to gVisor came up immediately: Firecracker's jailer (cgroups plus seccomp-BPF) prompted "So basically, a gVisor alternative?" The thread does not settle the question.
- Fargate angle: commenters expected the VM to stop being the per-customer boundary for Fargate, which would mean less over-provisioning.
- Justin Cormack (Docker) recalls that Clear Containers first had its own KVM VMM, then went back to a trimmed QEMU.
- Bryan Cantrill says Joyent had moved from KVM to bhyve "for several of the same reasons that motivated Firecracker".
- Cloudflare's kentonv was tagged with a question about whether a microVM has roughly a Worker's memory footprint. That comparison came back later in the isolates threads.

## Excerpts
> "Kata Containers is a lot of infrastructure for running containers and it uses QEMU to run the actual VMs. Firecracker just replaces the QEMU part and we're eager to work with folks like the Kata community." — aliguori (AWS), https://news.ycombinator.com/item?id=18540022

> "I love QEMU, it's an amazing project, but it does a ton and it's very oriented towards running disk images and full operating systems. We wanted to explore something really focused on serverless." — aliguori, https://news.ycombinator.com/item?id=18540022

> "Clear containers (now called kata containers) did this more than three years ago, with similar performance numbers (sub 200 ms boot times)." — kraemate, https://news.ycombinator.com/item?id=18542667

> "This is huge! It basically removes the VM as the security boundary for something like Fargate [1]." — talawahtech, https://news.ycombinator.com/item?id=18539887

> "From memory the original version of Intel Clear Containers had its own kvm based vmm but they moved back to qemu (or a more minimal patched version they maintain)." — justincormack, https://news.ycombinator.com/item?id=18542035

> "we have recently moved from KVM to bhyve[2] for several of the same reasons that motivated Firecracker." — bcantrill, https://news.ycombinator.com/item?id=18547429

## Relevance to the talk
This is the moment the industry decided that "VM per function" was affordable. Pair it with `../../virtualization/firecracker-aws-launch-2018.md`. The thread is also a reminder that microVMs had predecessors: Clear Containers, Hyper runV and kvmtool all came first.
