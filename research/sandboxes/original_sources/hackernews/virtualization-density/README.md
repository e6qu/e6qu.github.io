# hackernews/virtualization-density/: index

Hacker News discussion on hypervisors, microVMs, gVisor/Kata, unikernels, WebAssembly, V8 isolates, Spectre, SFI/NaCl/RLBox, VM snapshots/fork and isolation density. Collected through the HN Algolia API (about 300 query variants, stories ≥ 20 points plus targeted low-point primary sources), accessed 2026-11-22.

- [index.md](index.md): raw list of 1,037 stories in 14 subtopics, newest first.
- 27 annotated threads below (`kind: discussion`). Each has the HN link, story link, points/comments, and 4–8 short quoted comments with permalinks.

## Annotated threads

MicroVMs and VMMs
- [hn-18539539-firecracker-launch-2018.md](hn-18539539-firecracker-launch-2018.md): Firecracker open-sourced (368 points). aliguori says "Firecracker just replaces the QEMU part". Commenters point to Clear Containers as prior art.
- [hn-22358252-firecracker-nsdi-paper.md](hn-22358252-firecracker-nsdi-paper.md): NSDI 2020 paper. Bonzini (KVM/QEMU) disputes the QEMU LOC and syscall figures, and co-author mjb replies.
- [hn-22512196-firecracker-fly-io.md](hn-22512196-firecracker-fly-io.md): mrkurt reports Fly.io microVMs booting apps in under 20 ms, and that Fly chose Firecracker over gVisor.
- [hn-36666782-replaced-firecracker-with-qemu.md](hn-36666782-replaced-firecracker-with-qemu.md): Hocus moves back to QEMU for long-lived dev VMs (memory reclaim, discard). CodeSandbox and Fly respond.
- [hn-50397219-firecracker-pwnescape.md](hn-50397219-firecracker-pwnescape.md): the 2026 Firecracker escape through host virtio-net checksum offload. tptacek on the jailer, KVM and verification.
- [hn-50396834-replit-microvms.md](hn-50396834-replit-microvms.md): Replit moves agents to microVMs. tptacek: the real line is shared kernel vs guest kernel.
- [hn-48642510-lambda-microvms.md](hn-48642510-lambda-microvms.md): AWS Lambda MicroVMs. mjb confirms one microVM per agent session in AgentCore. "Do agents need sandboxes at all?"

Application kernels and unikernels
- [hn-16975706-gvisor-open-sourcing.md](hn-16975706-gvisor-open-sourcing.md): gVisor launch. The team explains layered security (Sentry + seccomp + Gofer) and the KVM platform.
- [hn-44745539-what-is-gvisor.md](hn-44745539-what-is-gvisor.md): Modal on 2+ years of gVisor in production with GPUs and checkpoint/restore. tptacek: "gVisor uses KVM".
- [hn-10953766-unikernels-unfit-for-production.md](hn-10953766-unikernels-unfit-for-production.md): Cantrill's post and Hykes's "the hypervisor is an OS" reply.
- [hn-40353963-my-vm-is-lighter.md](hn-40353963-my-vm-is-lighter.md): the LightVM paper, revisited by its co-author. KraftCloud boots NGINX in 20 ms. Also covers the 2.3 ms vs 125 ms comparison.

VMs vs containers
- [hn-41070870-unfashionably-secure-isolated-vms.md](hn-41070870-unfashionably-secure-isolated-vms.md): Thinkst's per-customer VMs. tptacek: jails and zones are "materially less secure".
- [hn-31496744-fly-machines.md](hn-31496744-fly-machines.md): Fly Machines. "Use containers for single-tenant workloads; use micro-VMs … for multi-tenant."

Isolates, Wasm, SFI
- [hn-18415708-cloud-computing-without-containers.md](hn-18415708-cloud-computing-without-containers.md): Cloudflare's isolates pitch. kentonv claims 10,000+ tenants per machine and describes the defence-in-depth list. gVisor and Google Cloud push back.
- [hn-31740885-pros-cons-v8-isolates.md](hn-31740885-pros-cons-v8-isolates.md): kentonv vs mrkurt vs tptacek, head to head. Strict process isolation would add 10× overhead.
- [hn-49912444-netlify-isolates-to-firecracker.md](hn-49912444-netlify-isolates-to-firecracker.md): Netlify moves from isolates to snapshot-restored microVMs. kentonv: the threshold "is mostly vibes".
- [hn-39930809-v8-sandbox.md](hn-39930809-v8-sandbox.md): V8's in-process sandbox, and why Rust is said not to help.
- [hn-32987813-isolates-microvms-webassembly.md](hn-32987813-isolates-microvms-webassembly.md): Is Wasm a boundary? tptacek: as secure as the host wrapper. kentonv: security is not a boolean.
- [hn-19501614-standardizing-wasi.md](hn-19501614-standardizing-wasi.md): WASI announced and modelled on CloudABI/Capsicum. Commenters ask why this isn't just the JVM again.
- [hn-34078532-webassembly-docker-without-containers.md](hn-34078532-webassembly-docker-without-containers.md): Hykes's "If WASM+WASI existed in 2008…" and the pushback.
- [hn-43020684-wasm-will-replace-containers.md](hn-43020684-wasm-will-replace-containers.md): Titzer separates memory sandboxing from system sandboxing (WALI).
- [hn-29459499-rlbox-firefox-95.md](hn-29459499-rlbox-firefox-95.md): RLBox (Wasm→C). Titzer: Spectre breaks in-process confidentiality whatever the sandbox.
- [hn-610511-native-client-security.md](hn-610511-native-client-security.md): tptacek in 2009: NaCl is "a sandbox implemented with a verifier".

Spectre
- [hn-19727832-v8-year-with-spectre.md](hn-19727832-v8-year-with-spectre.md): V8 gives up on in-process confidentiality and moves to site isolation.

Snapshots, fork, density
- [hn-32683834-codesandbox-clone-vm.md](hn-32683834-codesandbox-clone-vm.md): forking running Firecracker VMs in 2 s. Also 200 × 2 GB VMs on a 128 GB host, and the RNG-uniqueness problem.
- [hn-46634450-fly-sprites.md](hn-46634450-fly-sprites.md): Sprites, checkpointable Firecracker VMs for agents. "Shell environments are by far the most difficult part."
- [hn-50556533-kapteko-15m-webservers.md](hn-50556533-kapteko-15m-webservers.md): 15M servers on one VM (409 points). The companion LFI post got 1 point.

## Synthesis

These HN threads do not argue whether to isolate but which kernel the attacker gets to talk to. Over 2018–2026 the insiders converge on tptacek's rule: "don't share kernels between tenants". Shared-kernel containers, jails and zones are treated as packaging, not boundaries, because kernel LPEs sit in "innocuous system calls" that no seccomp filter will catch. The cost objection to VMs fell away once Firecracker-class VMMs booted apps in under 20 ms (Fly, 2020). Snapshot/fork (CodeSandbox 2022, Netlify 2026) then removed application start-up as well. The 2026 hyperscaler position is mjb's "a VM or MicroVM per agent session".

The dissent comes from the density end. Cloudflare's kentonv argues that isolates buy far more tenants per machine (10,000+, with per-tenant memory "an order of magnitude better" than Sandstorm's 100 MB per container), that strict process isolation would cost "an order of magnitude more overhead", and that the line between acceptable and unacceptable boundaries "is mostly vibes". His point that a trusted JIT can work around hardware bugs a microVM must trust is the strongest argument for software isolation.

Spectre is the constraint on everything in-process. V8 concluded that untrusted code "can read a process's entire address space", and Titzer extends that to every sandbox (Wasm, RLBox, LFI). In-process SFI gives integrity cheaply, but confidentiality needs an address-space boundary or Cloudflare-style timer denial.

On Wasm, practitioners say the memory sandbox is sound and the risk is in the host interface (WASI, imports). Hykes's "we wouldn't have needed Docker" mostly draws the reply that Docker solved packaging.

Two warnings for 2026. The PwnEscape bug shows that a minimal VMM still exposes host paravirtual device code (virtio-net offload). And density work (LFI, kapteko) still gets little discussion on HN: the 15M-servers demo was popular, but the LFI isolation argument got one point.

## Best quotes for slides

1. "Use containers for single-tenant workloads; use micro-VMs, whichever flavor you like best, for multi-tenant." — tptacek, 2022, https://news.ycombinator.com/item?id=31498321
2. "With Isolates, we can host 10,000+ tenants on one machine -- something that's totally unrealistic with containers or VMs." — kentonv, 2018, https://news.ycombinator.com/item?id=18418120
3. "Some people argue that isolates are below the necessary threshold and micro VMs are above it. But this isn't really based on any rigorous mathematical analysis, it's mostly vibes." — kentonv, 2026, https://news.ycombinator.com/item?id=49925639
4. "I think "hardware" vs. "software" is the wrong way to frame this. The big difference is between shared-kernel multitenant and guest kernels." — tptacek, 2026, https://news.ycombinator.com/item?id=50398546
5. "Our conclusion is that Spectre, in all its flavors, break confidentiality for in-process memory, regardless of sandboxing technology." — titzer, 2021, https://news.ycombinator.com/item?id=29466606
6. "If WASM+WASI existed in 2008, we wouldn't have needed to create Docker." — Solomon Hykes, as quoted in the thread, https://news.ycombinator.com/item?id=34078737
7. "The key thing to realize, I think, is that if you're using virtualization, a unikernel is nothing more than a process that uses a very strange system call API." — ori_b, 2016, https://news.ycombinator.com/item?id=10954500
8. "We've booted some apps in Firecracker in <20ms, so if you build the app properly you can absolutely do a new VM per request or TCP connection even." — mrkurt, 2020, https://news.ycombinator.com/item?id=22513922

## Method and caveats
- Queries covered project names, paper and blog titles, and synonyms. Results were filtered by title regex per subtopic, and obvious false matches (KVM switches, "meltdown" in finance, Spectre.css, sprites in games) were removed. A few off-topic items may remain in `index.md`, and stories whose titles don't name a technology are missing unless a targeted query found them.
- HN points and comment counts change over time; values are as of 2026-11-22.
- Insider affiliations are as the commenters stated them in the thread (e.g. "Hi, I'm the tech lead of Workers", "I work on this project"), or are well-known HN handles (tptacek and mrkurt at Fly.io, mjb at AWS, bonzini as KVM/QEMU maintainer, titzer as a V8/Wasm engineer).
- Quotes are verbatim from the Algolia item API, cut to at most two sentences. "..." marks elisions.
