---
title: So you want to code your own cloud
footer: So you want to code your own cloud
---

<!--
A technical talk: 25 minutes, about 20 seconds per slide.
The story: why people keep rebuilding the cloud, what contract they must honour,
how to build a serverless cloud first, then VMs, then how to scale the result.
Code links point at sockerless-cloud a614ccf (v3.0.1) and Floci b280a77 (2.3.0),
both read on 2026-10-26.
-->

:: title

### sockerless-cloud and Floci

# So you want to code your own cloud.

What it takes to rebuild the basic services of AWS, Google Cloud and Azure.

- Adrian Mârza
- e6qu.github.io
- October 2026

---

:: agenda dense

### Agenda

## Eight parts in 25 minutes

1. **Introduction, motivation** — 2 min
2. Timeline of events — 2 min
3. Two codebases — 2 min
4. A Minimal Viable Cloud — 3 min
5. The serverless core — 6 min
6. Beyond serverless — 3 min
7. Keeping it honest — 4 min
8. Scaling the emulator — 3 min

---

:: section

## Introduction, motivation

---

:: content dense footer="Sources: [sockerless README](https://github.com/e6qu/sockerless) · sockerless-cloud [first commit](https://github.com/e6qu/sockerless-cloud/commit/3ea55959) · [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md)"

### Where this started

## Docker without the socks

sockerless reimplements the Docker API on cloud primitives: `docker run` becomes an ECS task, a Lambda function, a Cloud Run job or an Azure Functions app.

- **It worked**, but testing it against real AWS got expensive
- **So I mocked** the AWS APIs it called, then the whole services behind them
- **The mocks grew** into reimplementations of real services, on AWS, Google Cloud, Azure
- **In August** they needed their own repository: sockerless-cloud started from a 677k-line snapshot
- **Since then:** 114 releases in 76 days

---

:: content dense footer="Sources: Hacker News on [CI needs](https://news.ycombinator.com/item?id=47475473) · [local development as an anti-pattern](https://news.ycombinator.com/item?id=28822696) · [drift](https://news.ycombinator.com/item?id=47593285) · [DynamoDB Local](https://news.ycombinator.com/item?id=49870948)"

### Motivation

## CI what I did there

Integration tests need environments that start in seconds, behave the same on every run, stay isolated, cost nothing per merge. [Real cloud accounts offer none of that](https://news.ycombinator.com/item?id=47475473).

- **The case against:** [drift](https://news.ycombinator.com/item?id=47593285) between emulator and cloud breaks tests later; some teams give each developer [a short-lived real environment](https://news.ycombinator.com/item?id=28822696) instead; even AWS's own [DynamoDB Local fails part](https://news.ycombinator.com/item?id=49870948) of an independent conformance suite
- **The cost:** the clouds change their APIs daily; matching all of it is too much for a small team
- **Cloud slices 🍉:** emulate the few services an application uses, in depth
- **Start small:** a Minimal Viable Cloud, run on cheap providers such as Hetzner
- **Keep one real environment** for the last mile

---

:: section

## Timeline of events

---

:: table dense footer="Each Hacker News entry links its thread"

### Timeline, part 1

## 2008 to 2019: from private clouds to local emulators

| When | What happened | On Hacker News |
| --- | --- | --- |
| 2008 | Eucalyptus, an open-source private cloud from UC Santa Barbara, speaks the EC2 API on your own hardware | [AWS Outposts thread, 2018](https://news.ycombinator.com/item?id=18554318): the same idea, a decade later |
| 2010 | OpenStack, from Rackspace and NASA, launches as a whole cloud made of many services | [How We Failed at OpenStack, 2015](https://news.ycombinator.com/item?id=8911021): too many moving parts |
| 2013 | moto, a Python library, mocks AWS inside boto tests | [Careful with moto](https://news.ycombinator.com/item?id=34070272): a wrong setup leaks calls to real AWS |
| Mar 2017 | LocalStack, an AWS emulator started at Atlassian, puts AWS in a container | [First big thread](https://news.ycombinator.com/item?id=13966088); commenters suggest ElasticMQ, an SQS-compatible server, for queues alone |
| Nov 2018 | AWS open-sources Firecracker, the microVM under Lambda | [Launch thread](https://news.ycombinator.com/item?id=18539539); [debate](https://news.ycombinator.com/item?id=24993949) over its roots in crosvm, Chrome OS's VM monitor |
| Nov 2019 | LocalStack on the front page again | [LocalStack, 2019](https://news.ycombinator.com/item?id=21436244): it handles the common calls, fails on error conditions |

---

:: table dense footer="Each Hacker News entry links its thread"

### Timeline, part 2

## 2021 to 2025: MinIO, LocalStack change course

| When | What happened | On Hacker News |
| --- | --- | --- |
| Apr 2021 | MinIO, the popular S3 reimplementation, moves to the AGPL | [Minio Changes License to AGPL](https://news.ycombinator.com/item?id=26919510) |
| Oct 2021 | LocalStack thread | [Local AWS Emulator](https://news.ycombinator.com/item?id=28820012): [one commenter calls local cloud development "an anti-pattern"](https://news.ycombinator.com/item?id=28822696) |
| Jul 2022 | LocalStack 1.0; "LocalStack and AWS Parity Explained" | [LocalStack 1.0](https://news.ycombinator.com/item?id=32193132), [Parity Explained](https://news.ycombinator.com/item?id=32343548): commenters name Azurite, Microsoft's Storage emulator, the one good one |
| Oct 2022 | 37signals, maker of Basecamp, leaves the cloud | [37signals Leaves the Cloud](https://news.ycombinator.com/item?id=33260061): the repatriation era begins |
| Oct 2023 | Oxide Computer launches a rack-scale private cloud | [The Cloud Computer](https://news.ycombinator.com/item?id=38023891): owning the whole stack, from firmware up |
| Oct–Dec 2025 | MinIO stops free images, then enters maintenance mode | [Free images stop](https://news.ycombinator.com/item?id=45665452), [maintenance mode](https://news.ycombinator.com/item?id=46136023): S3 is the interface everyone must speak |
| Dec 2025 | [LocalStack announces](https://blog.localstack.cloud/the-road-ahead-for-localstack/) one image with a mandatory auth token | The clone wave starts to form |

---

:: table dense footer="Each Hacker News entry links its thread"

### Timeline, part 3

## Attack of the clones

| When | What happened | On Hacker News |
| --- | --- | --- |
| Feb | sockerless starts; MinIO marks its repository unmaintained | [MinIO repository is no longer maintained](https://news.ycombinator.com/item?id=47000041) |
| Early Mar | LocalStack Community requires an account | [Community edition abandoned](https://news.ycombinator.com/item?id=47245078) |
| 15–22 Mar | Floci 1.0.0 ships on its first commit's day; a week later it reaches the front page | [Floci](https://news.ycombinator.com/item?id=47471801): a 51k-line first commit draws suspicion; [CI users cheer](https://news.ycombinator.com/item?id=47475473) |
| 23 Mar | LocalStack archives its GitHub repository | [Repo archived, account required](https://news.ycombinator.com/item?id=47493657): pin the `community-archive` tag |
| 31 Mar | MiniStack, another open-source LocalStack replacement | [MiniStack](https://news.ycombinator.com/item?id=47593285): commenters name drift as LocalStack's real problem |
| Apr | Fakecloud, a Rust AWS emulator that tests itself against AWS's Smithy API models | [Show HN: Fakecloud](https://news.ycombinator.com/item?id=47782696): fewer services, correct behaviour |
| Aug | sockerless-cloud splits from sockerless; Floci adds Google Cloud, Azure siblings | [Using floci to emulate GCP, AWS, Azure](https://news.ycombinator.com/item?id=49475568): the maintainer presents the Google Cloud, Azure siblings |
| 26–27 Sep | Floci, Fakecloud on the front page again | [Floci](https://news.ycombinator.com/item?id=49854416), [Fakecloud](https://news.ycombinator.com/item?id=49856885): an independent conformance suite finds gaps in Fakecloud's DynamoDB |

---

:: section

## Two codebases

---

:: stats dense footer="Sources: Floci [git history](https://github.com/floci-io/floci/commits/main) · [README](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/README.md) · cloc at each tag"

### The other codebase

## Floci, a LocalStack replacement

Floci is the work of Hector Ventura (`hectorvent` on GitHub), its creator and most active committer. The first commit, on 15 March 2026, added 51,124 lines for 19 AWS services. Floci 1.0.0 shipped that day as a drop-in LocalStack replacement: same port, environment variables, `test` credentials.

- **129** AWS service packages in 2.3.0
- **3** clouds: Google Cloud, Azure joined in August, as floci-gcp, floci-az

---

:: comparison pick=0

### The two projects

## Two clouds walk into a bar

#### sockerless-cloud (SC from here on)

- Grown out of sockerless
- Go, one binary per cloud: AWS, Google Cloud, Azure
- Workloads really run, in containers or Firecracker microVMs
- v3.0.1, released 26 October 2026

#### Floci

- Hector Ventura's LocalStack replacement
- Java 25 on Quarkus, as a native binary or an image
- AWS first; floci-gcp, floci-az are separate projects
- 2.3.0, released 15 October 2026

---

:: table dense footer="SLOC: cloc counts code lines in every language, application plus tests, without docs, specs or web consoles. The Floci columns sum its AWS, Google Cloud, Azure repositories."

### Lines of code over time

## Lines of code, March to October 2026

| Date | SC SLOC total | of which tests | Floci SLOC total | of which tests |
| --- | --- | --- | --- | --- |
| Mar 2026 | 31,187 | 9,404 | 39,077 | 6,531 |
| May 2026 | 53,736 | 17,734 | 287,749 | 146,143 |
| Jul 2026 | 380,419 | 141,404 | 459,267 | 230,578 |
| Aug 2026 (split) | 498,049 | 187,077 | 490,288 | 249,960 |
| Sep 2026 | 618,148 | 234,615 | 756,957 | 410,332 |
| Oct 2026 | 877,522 | 348,578 | 1,871,210 | 1,128,657 |

---

:: table dense footer="SLOC: cloc code lines, all languages, application plus tests, at sockerless-cloud a614ccf (v3.0.1), Floci b280a77, floci-gcp 9d269e1, floci-az e2b6c90"

### The code bases

## Per cloud, in source lines of code

| Repository part | Language | SLOC total | of which tests |
| --- | --- | --- | --- |
| SC: AWS | Go | 434,698 | 172,713 |
| SC: Google Cloud | Go | 181,306 | 73,074 |
| SC: Azure | Go | 192,209 | 83,750 |
| SC: `sim` framework, tools | Go | 69,309 | 19,041 |
| **SC total** | Go | 877,522 | 348,578 |
| Floci: AWS (floci) | Java | 1,558,736 | 971,301 |
| Floci: Google Cloud (floci-gcp) | Java | 154,504 | 76,100 |
| Floci: Azure (floci-az) | Java | 157,970 | 81,256 |
| **Floci total** | Java | 1,871,210 | 1,128,657 |

---

:: comparison pick=0

### Dependencies

## Software stacks

#### sockerless-cloud (Go)

- `modernc.org/sqlite`: pure Go, so release builds need no C compiler
- The moby client, for Docker or Podman
- gRPC, `miekg/dns`, `cel-go`, `go-amqp`, OpenTelemetry
- nftables, only inside the microVM node agent
- Google's own `cloud.google.com/go` protobuf packages

#### Floci (Java)

- Quarkus 3.40.1, Red Hat's Java framework, compiled native with GraalVM's Mandrel
- Jackson, with CBOR for the binary protocols
- docker-java 3.7.1; a Kubernetes launcher for Lambda
- BouncyCastle, JSONata, Jayway JSONPath, Velocity
- The AWS SDK appears only in tests

---

:: terminal title=~/clouds

## `localhost` is my cloud provider

```console
$ go install github.com/e6qu/sockerless-cloud/simulator-aws@latest
$ simulator-aws                      # :4566, workloads need Docker or Podman
$ docker run --rm -p 4566:4566 -e SIM_RUNTIME=process ghcr.io/e6qu/sockerless-simulator-aws:v3.0.1
$ docker run --rm -p 4566:4566 -v /var/run/docker.sock:/var/run/docker.sock floci/floci:latest
$ export AWS_ENDPOINT_URL=http://localhost:4566 AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test
$ aws sqs create-queue --queue-name orders
✓ the same CLI, SDKs, Terraform: only the endpoint moved
```

<!-- Each SC simulator is one Go program: sim.Main(sim.Program{Provider, DefaultPort, Configure, Build}). Ports: AWS 4566, Google 4567 (gRPC 4569), Azure 4568. Floci is one Quarkus process; Quarkus generates main, boot logic sits in EmulatorLifecycle.onStart. Floci needs Docker only for container-backed services such as Lambda or EC2 instances. SIM_RUNTIME=process makes SC API-only. -->

---

:: section

## A Minimal Viable Cloud

---

:: table dense footer="Sources: [How Workers work](https://developers.cloudflare.com/workers/reference/how-workers-works/) · [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)"

### Serverless-only

## A Minimal Viable Cloud, per cloud

| Service | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Identity | IAM, STS | IAM, service accounts | Entra ID, role-based access |
| Functions | Lambda | Cloud Run functions | Azure Functions |
| Events | EventBridge | Eventarc | Event Grid |
| Queues | SQS | Pub/Sub | Service Bus |
| Workflows | Step Functions | Workflows | Logic Apps |
| Object storage | S3 | Cloud Storage | Blob Storage |
| Key-value, documents | DynamoDB | Firestore | Cosmos DB |
| Logs, metrics | CloudWatch | Cloud Logging, Cloud Monitoring | Azure Monitor |
| Audit | CloudTrail | Cloud Audit Logs | Activity Log |

No VMs, instance metadata or software-defined network. Cloudflare Workers show the model works: functions get "bindings" to other services.

---

:: table dense footer="Europe-headquartered providers only, from their docs, 2026-10: [Scaleway](https://www.scaleway.com/en/docs/) · [OVHcloud](https://docs.ovhcloud.com/) · [Hetzner](https://docs.hetzner.com/cloud/) · [STACKIT](https://docs.stackit.cloud/) · [OTC](https://docs.otc.t-systems.com/) · [UpCloud](https://upcloud.com/docs) · [Exoscale](https://community.exoscale.com/)"

### Europe

## Cloud sovereignty, à la carte

| Provider | VMs | Kubernetes | Functions | Events | Queues | Audit | IAM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Scaleway (FR) | Own | Kapsule | Knative + gVisor | SNS-compatible | SQS-compatible, NATS | Beta | Policies, CEL |
| OVHcloud (FR) | OpenStack | Managed | — | — | Kafka | To LDP | URN policies |
| Hetzner (DE) | Own | — | — | — | — | — | Read or Read & Write |
| STACKIT (DE) | OpenStack | SKE | — | — | RabbitMQ | Central log | Roles, OIDC federation |
| Open Telekom (DE) | OpenStack-derived | CCE | FunctionGraph | SMN | Kafka, RabbitMQ | 7 days | Agencies |
| UpCloud (FI) | Own | Managed | — | — | — | 180 days | Subaccounts |
| Exoscale (CH) | Own | SKS | — | — | — | 30 days | Org + role policies |

All seven offer S3-compatible object storage; none offers an EventBridge-style rule bus.

---

:: table dense footer="Sources, 2026-10: [Scaleway](https://www.scaleway.com/en/cloud-database-solutions/) · [OVHcloud](https://docs.ovhcloud.com/en/guides/public-cloud/databases/capabilities) · [STACKIT](https://stackit.com/en/products/database) · [OTC RDS](https://open-telekom-cloud.com/en/products-services/relational-database-service) · [UpCloud](https://upcloud.com/docs/guides/managed-databases/) · [Exoscale](https://www.exoscale.com/dbaas)"

### Europe

## Managed databases in European clouds

| Provider | Relational | Other engines | Serverless |
| --- | --- | --- | --- |
| Scaleway | PostgreSQL, MySQL | MongoDB, Redis, ClickHouse (beta) | Serverless SQL Database: PostgreSQL that scales to zero |
| OVHcloud | PostgreSQL, MySQL | MongoDB, Valkey, Kafka, OpenSearch | — |
| Hetzner | — | — | — |
| STACKIT | PostgreSQL Flex, MariaDB, SQL Server Flex | MongoDB Flex, Redis, OpenSearch | — |
| Open Telekom Cloud | RDS: MySQL, PostgreSQL, SQL Server | DDS (MongoDB), DCS (Redis) | — |
| UpCloud | PostgreSQL, MySQL | Valkey, OpenSearch | — |
| Exoscale | PostgreSQL, MySQL | Valkey, Kafka, OpenSearch | — |

None lists a DynamoDB-style key-value service: a Minimal Viable Cloud on these providers brings its own, or builds one on object storage.

---

:: table dense footer="Sources: the providers' docs, 2026-10 · [Firecracker requirements](https://github.com/firecracker-microvm/firecracker/blob/main/docs/getting-started.md) · [pos3ql](https://github.com/e6qu/pos3ql) · [SlateDB](https://slatedb.io)"

### Build up from the cheapest layer

## An MVC on a cheap provider

| MVC service | Build it on | Notes |
| --- | --- | --- |
| Identity, request signing | Your own control plane | It issues the keys and tokens, evaluates the policies |
| Functions | Containers on managed Kubernetes or plain VMs | Firecracker microVMs need KVM: dedicated servers, or VMs with nested virtualization |
| Events, queues | Managed Kafka, RabbitMQ or NATS where offered | Or a queue table in PostgreSQL |
| Workflows | An interpreter in your control plane | State in PostgreSQL |
| Object storage | The provider's S3-compatible storage | Every provider here offers it |
| Key-value, documents | Managed PostgreSQL, or a store on object storage | pos3ql, SlateDB |
| Logs, metrics, audit | Managed OpenSearch where offered | The front door writes the audit records |

On Hetzner, everything above VMs, dedicated servers and object storage is yours to build.

---

:: section

## The serverless core

---

:: pause label="Identity and access"

## Who goes there?

AWS IAM · Google Cloud IAM · Microsoft Entra ID

---

:: code dense footer="Source: SC [simulator-aws/main.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/main.go#L197-L228)"

## Papers, please

```go
// sockerless-cloud: authenticate, authorize, act, record, for every request
srv.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
	body, _ = io.ReadAll(r.Body)        // buffered: CloudTrail needs it after the handler
	rec := &cloudTrailStatusRecorder{ResponseWriter: w}
	// Runs before authorization so a forged Credential= can never reach the policy evaluator.
	if !sigv4EnforceControlPlane(rec, r, body) {
		return
	}
	// Runs after authentication, so the principal is one the caller proved possession of.
	if !iamEnforce(rec, r) {
		return
	}
	awsRouter.ServeHTTP(rec, r)         // X-Amz-Target, or queryRouter for Action=
	cloudTrailRecordAPICall(srv, r, body, rec.statusCode(), rec.Header(), rec.body.Bytes())
})
```

---

:: code dense footer="Sources: Floci [AccountContextFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/AccountContextFilter.java#L34-L35) · [SigV4HeaderSignatureFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/SigV4HeaderSignatureFilter.java#L97-L148) · [IamEnforcementFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/IamEnforcementFilter.java#L1433-L1446)"

## Floci: the same steps as a chain of JAX-RS filters

```java
// Floci: the same steps as JAX-RS filters, ordered by @Priority; both checks are opt-in
@Priority(Priorities.AUTHENTICATION - 100)
public class AccountContextFilter implements ContainerRequestFilter { … }  // the access key picks the account

@Priority(Priorities.AUTHENTICATION)
public class SigV4HeaderSignatureFilter implements ContainerRequestFilter {
    public void filter(ContainerRequestContext ctx) throws IOException {
        if (!configProvider.get().auth().validateSignatures()) return;  // authenticate: opt-in
        …

public class IamEnforcementFilter implements ContainerRequestFilter {  // default priority: runs next
    public void filter(ContainerRequestContext ctx) {
        if (!config.services().iam().enforcementEnabled()) return;       // authorize: opt-in
        if ("test".equals(akid)) return; // root bypass
        …
        Decision decision = evaluator.evaluateResolvedResourcePolicy(
                caller, effectiveDecision, accountRelationship, action, resource, effectiveContext);
        if (decision != Decision.DENY) return;                           // act: the resource method runs
        if (deniedEvent != null)                                         // record: S3 requests only
            emitS3Denial(akid, deniedEvent.name(), resource, deniedEvent.region(), denyMessage);
        throw new AwsException("AccessDenied", denyMessage, 403);
```

---

:: table dense footer="Sources: [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) · [Google IAM deny](https://docs.cloud.google.com/iam/docs/deny-overview) · [Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/overview)"

### Three identity models

## Identity models in the three clouds

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Credential | Access key + secret, SigV4 | Service-account key signs a JWT | App secret or certificate |
| Token | STS session (key, secret, token) | OAuth 2.0 access token | Entra ID JWT |
| Policy | JSON policies on identities, resources | Role bindings down the hierarchy | Role assignments at a scope |
| Deny | Explicit deny always wins | Deny policies win, checked first | Deny assignments, which only Azure creates |
| Front door | Each service's endpoint | Each API's endpoint | Resource Manager |

---

:: content dense footer="Source: [policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)"

### AWS policy evaluation

## Deny everything, then negotiate

Every request starts denied. AWS then checks the policies in this order:

1. **Any explicit deny**, in any policy, ends the evaluation with a deny
2. **Organization guardrails** (SCPs, RCPs) can only narrow what the account allows
3. **A resource policy** on the target can allow the call, enough within one account
4. **An identity policy** on the caller must allow it for calls across accounts
5. **Permissions boundaries, session policies** intersect with the result; they never add permissions

sockerless-cloud evaluates steps 1, 3, 4 plus users' permissions boundaries. Floci, once you turn enforcement on, evaluates denies, SCPs, resource, identity, boundary, session policies.

---

:: table dense footer="Sources: SC [docs/iam.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/iam.md) · Floci [IamEnforcementFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/IamEnforcementFilter.java#L324-L327) · [multi-account.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/configuration/multi-account.md)"

### What each emulator enforces

## Authentication, authorization in each emulator

| Emulator | Authentication | Authorization |
| --- | --- | --- |
| SC, AWS | SigV4 always; `test` is an ordinary IAM user | Every call: "No principal bypasses evaluation" |
| SC, Google Cloud | Every REST call needs a valid bearer | Four places, e.g. Cloud Run invoke |
| SC, Azure | Entra tokens from its own tenant | Data planes only; any valid ARM token may do anything |
| Floci, AWS | SigV4 opt-in; the access key picks the account | Full evaluator, opt-in; the `test` key is a root bypass |
| floci-gcp | Ignores auth headers | GCS bucket IAM, opt-in |
| floci-az | Issues real RS256 tokens | Accepts any bearer |

---

:: table footer="Sources: [Lambda env vars](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) · [ECS task roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html) · [Cloud Run identity](https://docs.cloud.google.com/run/docs/securing/service-identity) · [App Service identity](https://learn.microsoft.com/azure/app-service/overview-managed-identity)"

### Workload credentials

## Who am I, and who's asking?

| Where the code runs | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Lambda | Role session in env vars | Env vars; environments retire before expiry | Env vars, a session that never expires |
| ECS task | 169.254.170.2 endpoint | Full URI through a forwarder | A proxy container on 169.254.170.2 |
| Cloud Run, functions | Metadata server, even serverless | Metadata server behind a sidecar | `GCE_METADATA_HOST` to the main port |
| Azure Functions | `IDENTITY_ENDPOINT` + header | `/msi/token`, per-site header | Managed identity endpoint |

sockerless-cloud is also the identity provider: it signs Google tokens, serves their JWKS, runs an Entra ID tenant.

---

:: pause label="Functions"

## Functions

AWS Lambda · Cloud Run functions · Azure Functions

---

:: code dense footer="Source: SC [lambda_runtime.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/lambda_runtime.go#L131-L134)"

## The Lambda Runtime API

```go
// sockerless-cloud: one listener per execution environment, inside the simulator,
// passed to the container as AWS_LAMBDA_RUNTIME_API
mux.HandleFunc("GET /2018-06-01/runtime/invocation/next", s.handleNext)
mux.HandleFunc("POST /2018-06-01/runtime/invocation/{id}/response", s.handleResponse)
mux.HandleFunc("POST /2018-06-01/runtime/invocation/{id}/error", s.handleInvocationError)
mux.HandleFunc("POST /2018-06-01/runtime/init/error", s.handleInitError)

s.server = &http.Server{
	Handler:     mux,
	ReadTimeout: 0, // Next is a long poll
}

// Floci: one Vert.x server per container on ports 12000-12499, non-blocking.
// Both run AWS's own public.ecr.aws/lambda base images.
```

---

:: table dense footer="Sources: [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) · [Cloud Run environments](https://docs.cloud.google.com/run/docs/about-execution-environments) · [Container Apps](https://learn.microsoft.com/azure/container-apps/overview) · [Functions hosting](https://learn.microsoft.com/azure/azure-functions/functions-scale)"

### Serverless compute

## What does Cloud Run run?

| Service | What you deploy | What runs it | Credentials |
| --- | --- | --- | --- |
| AWS Lambda | A zip or container image with a handler | A Firecracker microVM per execution environment, polling the Runtime API | Env vars |
| Cloud Run | A container image serving HTTP on `$PORT` | gVisor, a user-space kernel (gen1), or a microVM (gen2) | Metadata server |
| Cloud Run functions | Source code; Cloud Build turns it into a Cloud Run service | The same as Cloud Run: the function is that service | Metadata server |
| Azure Container Apps | Container images | A managed Kubernetes environment, scaled by KEDA | `IDENTITY_ENDPOINT` |
| Azure Functions | Code with triggers, bindings | The Functions host plus a language worker, on App Service | `IDENTITY_ENDPOINT` |

The emulators run these as containers: Lambda on AWS's base images, Azure Functions on Microsoft's host image. sockerless-cloud can use Firecracker microVMs instead; floci-gcp keeps Cloud Run functions as metadata only.

---

:: pause label="Events and queues"

## Events and queues

EventBridge, SQS · Eventarc, Pub/Sub · Event Grid, Service Bus

---

:: comparison pick=0

### Events

## Event pattern matching

#### sockerless-cloud

- One grammar for EventBridge patterns, SNS filter policies, Lambda event filters
- Per-consumer dialects decide what `anything-but` may wrap
- Every operator, including numeric, cidr, wildcard, `$or`

#### Floci

- A hand-written matcher over Jackson trees
- No `numeric`, `cidr` or `wildcard` in EventBridge
- Pipes, SNS, Lambda filters each have their own matcher
- It re-parses each pattern for every event

---

:: table footer="Sources: [SQS parameters](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-queue-parameters.html) · [Pub/Sub properties](https://docs.cloud.google.com/pubsub/docs/subscription-properties) · [Service Bus locks](https://learn.microsoft.com/azure/service-bus-messaging/message-transfers-locks-settlement)"

### Queues

## Queue semantics

| Aspect | Amazon SQS | Google Pub/Sub | Azure Service Bus |
| --- | --- | --- | --- |
| Lease | Visibility timeout, 30 s (max 12 h) | Ack deadline, 10 s (max 600 s) | Peek-lock, 1 min (max 5 min) |
| Long poll | Up to 20 s | Streaming pull | AMQP link, or REST |
| Ordering | FIFO per message group | Ordering keys, opt-in | Sessions |
| Poison messages | `maxReceiveCount`, then a DLQ | Dead-letter topic | 10 deliveries, then the DLQ |
| Max message | 1 MiB since Aug 2025 | 10 MB | 256 KB Standard |

---

:: pause label="Storage and databases"

## Bucket list

S3, RDS, DynamoDB · Cloud Storage, Cloud SQL, Firestore · Blob Storage, Azure Database, Cosmos DB

---

:: table dense footer="Sources: SC [architecture.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/architecture.md) · [BUGS.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/BUGS.md) · Floci [s3.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/s3.md), [rds.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/rds.md), [dynamodb.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/dynamodb.md) · floci-az [cosmos.md](https://github.com/floci-io/floci-az/blob/e2b6c9022fbb6bf8545450a0c48b29619491661d/docs/services/cosmos.md)"

### Honest status

## Storage, databases in the emulators

| Kind | sockerless-cloud | Floci family |
| --- | --- | --- |
| Object storage | One blob store serves S3, Cloud Storage, Blob Storage, contents in files; S3 ACLs, Block Public Access not enforced yet | S3 with most bucket features, RestoreObject a stub; GCS over REST, gRPC; Blob over HTTP, in Floci's own storage modes |
| Relational | Real PostgreSQL, MySQL containers behind RDS, Cloud SQL, Azure Database | Real PostgreSQL, MySQL, MariaDB, SQL Server containers; a mock mode keeps metadata only |
| Key-value, documents | Own Go engines: DynamoDB without Streams, Firestore with listeners, Spanner on SQLite, Cosmos DB | DynamoDB in Java, with Streams; Firestore, Datastore; Cosmos DB in process, stored procedures never run |

Both run the real engine for SQL. Nobody ships DynamoDB, Firestore or Cosmos DB as a container, so both rebuild those.

---

:: pause label="Workflows and provisioning"

## Workflows and provisioning

Step Functions, CloudFormation · Workflows · Logic Apps, Resource Manager

---

:: comparison pick=0 dense

### Workflows

## Step Functions in both emulators

#### sockerless-cloud: Step Functions

- JSONPath, JSONata; Standard, Express
- Tasks call services through `sim.Server.Call`: authentication, IAM, audit, spec validation
- `.sync` waits wake on store changes; Wait states use real time
- Running executions resume from a checkpoint after a restart
- Azure Logic Apps: a `runAfter` engine that fails actions it cannot run

#### Floci: Step Functions

- An interpreter for the Amazon States Language
- Tasks call services as in-process Java methods
- Caps waits, retry delays at 30 s by default, as its docs state
- A restart aborts running executions
- Also Simple Workflow (SWF), Lambda durable executions

---

:: table dense footer="Sources: [registry history](https://www.amazonaws.cn/en/blog-selection/cloudformation-coverage/) · [Amplify FAQ](https://docs.amplify.aws/vue/how-amplify-works/faq/) · [Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/customize-containers.html) · [Service Catalog product](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html) · [Control Tower](https://docs.aws.amazon.com/controltower/latest/userguide/creating-resources-with-cloudformation.html) · [Cloud Control](https://docs.aws.amazon.com/cloudcontrolapi/latest/userguide/resource-types.html)"

### Infrastructure as code inside the cloud

## AWS tools built on CloudFormation

| Tool or service | How it uses CloudFormation |
| --- | --- |
| AWS CDK, AWS SAM | Turn code or a short template into a CloudFormation template, then deploy it as a stack |
| Amplify Gen 2 | "layered on top of the AWS CDK and AWS CloudFormation" |
| Elastic Beanstalk | Launches each environment's resources as a CloudFormation stack |
| Service Catalog | Provisioning a product launches a CloudFormation stack |
| Control Tower | Applies controls to every account with CloudFormation StackSets |
| Cloud Control API | Serves the registry's resource handlers as one create, read, update, delete, list API; Terraform's `awscc` provider uses it |

Each service team owns its resource handlers in the CloudFormation registry. AWS credits that model for RDS supporting Aurora Serverless v2 in CloudFormation within about a month.

---

:: pause label="Logs, metrics, audit"

## Logs, metrics, audit

CloudWatch, CloudTrail · Cloud Logging, Audit Logs · Azure Monitor

---

:: table dense footer="Sources: SC simulator READMEs · Floci [cloudwatch.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/cloudwatch.md) · floci-az monitor.md"

### Application logs, metrics

## Log queries, alarms

| Feature | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Logs Insights | fields, filter, stats, parse, sort | A query engine in the CloudWatch slice | fields, filter (=, !=), sort, dedup, limit |
| Filter patterns | Terms, JSON, space-delimited | Supports all three | Supports all three; compares with AWS |
| Cloud Logging filter | Full language, sinks | Routing, sinks, exclusions | A subset, sinks to GCS |
| KQL | Full language | where, extend, summarize, order by | where, project, take |
| Alarms | M of N periods, missing-data rules | Every 250 ms; skips M of N | Every 10 s; skips metric math |

---

:: content dense footer="Sources: [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html) · [record contents](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html) · [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit) · [Activity Log](https://learn.microsoft.com/azure/azure-monitor/platform/activity-log)"

### The cloud's own logs

## Audit logs in the three clouds

Every cloud logs the calls made against it: who called, which action, on which resource, from where, with what result. Teams use it to investigate incidents, to show compliance, to trigger automation.

- **AWS CloudTrail** always records management events, the control-plane calls, with 90 days of history for free. Data events, such as S3 object reads, are opt-in. Records arrive in about five minutes
- **Google Cloud Audit Logs** always write Admin Activity, System Event logs, kept 400 days. Data Access logs are opt-in; Policy Denied logs record refusals
- **Azure Activity Log** records every Resource Manager write for 90 days; data-plane activity goes to separate resource logs
- An emulator must record at the front door, after authentication, for every caller, services included; anywhere else, the trail misses calls

---

:: table dense footer="Sources: [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html) · [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit) · [Activity Log](https://learn.microsoft.com/azure/azure-monitor/platform/activity-log) · SC [cloudtrail.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/cloudtrail.go#L878-L920) · Floci [CloudTrailJsonHandler.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/cloudtrail/CloudTrailJsonHandler.java#L222-L226)"

### The cloud's own logs, compared

## Who logs the loggers?

| Trail | sockerless-cloud | Floci family |
| --- | --- | --- |
| AWS CloudTrail | Records every call at the one front door, 90 days | S3 data events only; LookupEvents returns an empty list |
| Google Audit Logs | Admin Activity, Data Access, from vendored audit docs; they feed Eventarc | floci-gcp: none |
| Azure Activity Log | Every ARM write | floci-az: every write, 10,000 in memory |

---

:: section

## Beyond serverless

---

:: pause label="Virtual machines"

## Virtual machines

Amazon EC2 · Compute Engine · Azure Virtual Machines

---

:: content dense footer="Sources: SC [placement/microvm.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/placement/microvm.go#L378-L397) · [nodeagent guest.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/nodeagent/cmd/nodeagent/guest.go#L311-L367) · [firecracker.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/nodeagent/cmd/nodeagent/firecracker.go#L23-L95) · [guestinit](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/nodeagent/cmd/guestinit/main.go)"

### A VM in an emulator

## Light my Firecracker

1. **Export the image.** sockerless-cloud creates a container from the image without starting it, then exports its filesystem as a tar archive through the Docker or Podman API
2. **Hand it to the node agent**, a container that holds `/dev/kvm`, `/dev/net/tun` and its own network namespace, with no engine socket
3. **Build the disk.** The agent unpacks the archive, adds its init (`sockerless-init`), the guest's configuration, the mount points; `mkfs.ext4 -d` packs the tree into `rootfs.ext4`
4. **Boot.** Through Firecracker's API the agent sets its own Linux kernel, vCPUs, memory, the root drive, a tap on the cloud network, a vsock; the kernel command line carries the address
5. **Run.** The init mounts the kernel filesystems, sets the hostname, resolver, starts the workload, streams its output to the agent over vsock, powers off when the workload ends

A stopped guest keeps its disk; capturing an image exports that disk again. Floci runs each instance as a privileged Docker container instead.

---

:: content dense footer="Sources: [EC2 instance lifecycle](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html) · SC [ec2_instance_launch.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/ec2_instance_launch.go#L425-L438) · Floci [Ec2Service.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/ec2/Ec2Service.java#L4768-L4775)"

### Lifecycles

## State machines: an EC2 instance

```text
 RunInstances
      |
      v
 +---------+  boot done  +---------+  StopInstances  +----------+      +---------+
 | pending | ----------> | running | --------------> | stopping | ---> | stopped |
 +---------+             +---------+                 +----------+      +---------+
      ^                       |                                             |
      +-----------------------|--------- StartInstances --------------------+
                              | TerminateInstances
                              v
                      +---------------+       +------------+
                      | shutting-down | ----> | terminated |
                      +---------------+       +------------+
```

- sockerless-cloud moves pending to running only when the instance's init writes a ready marker
- Floci moves pending to running on the next DescribeInstances
- AWS refuses to reboot a pending instance: an emulator that skips pending hides that race

---

:: content dense footer="Sources: [Azure VM states](https://learn.microsoft.com/azure/virtual-machines/states-billing) · SC [compute.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/compute.go#L1428-L1437)"

### Lifecycles

## State machines: an Azure VM

```text
 Provisioning state: the last control-plane operation
   Creating --> Succeeded      Updating --> Succeeded | Failed      Deleting

 Power state: the machine itself
   starting --> running --> stopping --> stopped --> deallocating --> deallocated
       ^                                    |                              |
       +------------ start -----------------+----------- start ------------+
```

- A deallocated VM has released its host; a stopped one keeps it
- sockerless-cloud keeps a table of power verbs, each naming its transitional, settled state
- floci-az reports Succeeded at once in its default mocked mode; with real containers it waits for the container to run

---

:: content dense footer="Sources: [operations.proto](https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto) · [ARM async operations](https://learn.microsoft.com/azure/azure-resource-manager/management/async-operations)"

### Lifecycles

## Long-running operations

```text
 Google: google.longrunning.Operation
   create --> { done: false } --- poll or wait ---> { done: true, response }
                                                 \--> { done: true, error }

 Azure Resource Manager
   PUT --> 201/202 + Azure-AsyncOperation URL --- poll, honour Retry-After ---> Succeeded
                                                                          \--> Failed | Canceled
```

- All three clouds model an operation as running, then done with a result or an error
- sockerless-cloud has three trackers (Google operations, Compute zone operations, Azure), with a merge planned; floci-gcp has one
- floci-gcp derives an operation's status from a 50 ms clock
- Both end every running operation at a restart, with an error

---

:: code-split dense footer="Sources: botocore [ec2 waiters-2.json](https://github.com/boto/botocore/blob/develop/botocore/data/ec2/2016-11-15/waiters-2.json) · Terraform [helper/retry/state.go](https://github.com/hashicorp/terraform-plugin-sdk/blob/main/helper/retry/state.go)"

## Are we there yet?

```json
"InstanceRunning": {
  "operation": "DescribeInstances",
  "delay": 15, "maxAttempts": 40,
  "acceptors": [
    {"matcher": "pathAll", "expected": "running", "state": "success"},
    {"matcher": "pathAny", "expected": "shutting-down",
     "state": "failure"},
    {"matcher": "pathAny", "expected": "terminated", "state": "failure"},
    {"matcher": "pathAny", "expected": "stopping", "state": "failure"},
    {"matcher": "error",
     "expected": "InvalidInstanceID.NotFound", "state": "retry"}
  ]
}
```

1. botocore ships 642 waiters like this one, as data
2. Retry on NotFound: a new instance may not be visible yet
3. Terraform: a state "other than the Target state or one listed in Pending" fails the apply

---

:: pause label="Instance metadata"

## Instance metadata

EC2 IMDS · Compute Engine metadata server · Azure IMDS

---

:: table footer="Sources: [EC2 IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-v2-how-it-works.html) · [Google metadata](https://docs.cloud.google.com/compute/docs/metadata/querying-metadata) · [Azure IMDS](https://learn.microsoft.com/azure/virtual-machines/instance-metadata-service) · [comparison](https://ahmet.im/blog/comparison-of-instance-metadata-services/)"

### Instance metadata

## Instance metadata services

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Address | 169.254.169.254 | metadata.google.internal | 169.254.169.254, WireServer 168.63.129.16 |
| Credentials | `iam/security-credentials/<role>` | `service-accounts/default/token` | `identity/oauth2/token` |
| Serverless | Not on Lambda | Yes, on Cloud Run too | `IDENTITY_ENDPOINT` instead |

---

:: content dense footer="Sources: [EC2 IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-v2-how-it-works.html) · [hop limit](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html) · [Google metadata](https://docs.cloud.google.com/compute/docs/metadata/querying-metadata) · [Azure IMDS](https://learn.microsoft.com/azure/virtual-machines/instance-metadata-service)"

### Instance metadata

## There's no place like ~~127.0.0.1~~ 169.254.169.254

In a real VM, 169.254.169.254 is a link-local address the host answers itself. The request never leaves the host, so it carries no credentials: the host already knows which instance sent it.

- **AWS:** IMDSv2 asks for a PUT to get a session token; the token's hop limit of 1 keeps it from crossing a router, so a container on the instance needs a limit of 2
- **Google Cloud:** `metadata.google.internal` resolves to the same address; every request carries `Metadata-Flavor: Google`
- **Azure:** requests carry `Metadata: true` plus an `api-version`, never `X-Forwarded-For`; the service answers 5 requests per second per VM
- **Emulators** cannot own a link-local address without privilege. sockerless-cloud points workloads at a sidecar per network through the SDKs' environment variables; Floci answers on each instance's loopback, from a privileged container

---

:: pause label="Networks"

## Networks

Amazon VPC · Google Cloud VPC · Azure Virtual Network

---

:: comparison pick=0 dense

### Networks, security groups, user data

## Networks, security groups in the emulators

#### sockerless-cloud

- One engine network per VPC, over the resource's own CIDR
- DNS, metadata sidecar at the address the cloud reserves
- The microVM's tap enforces security groups; nothing filters container-to-container traffic yet
- 376 lines of POSIX shell reimplement cloud-init's stages

#### Floci

- One Docker bridge per VPC; Floci swaps overlapping CIDRs, with a warning
- Opt-in enforcement: a helper container runs nftables, default deny
- No routing, NACLs, NAT or peering enforcement
- User data runs as a script after SSH key injection; its output goes to CloudWatch Logs

---

:: section

## Keeping it honest

---

:: table

### Five sources of truth

## Spec-ulation

| Source | What it gives you | What it misses |
| --- | --- | --- |
| API specs | Operations, shapes, protocols, errors | Behaviour, timing, limits |
| SDKs | Waiters, paginators, retries, endpoint rules | Server-side semantics |
| Terraform providers | Read-after-write, exact states, deletes | Anything Terraform never calls |
| Documentation | Quotas, defaults, state diagrams | Precision; it drifts from the API |
| The real cloud | The truth, today | Cost, accounts, repeatability |

The specs keep changing: AWS publishes Smithy models, Google Discovery documents and protos, Azure OpenAPI files.

---

:: content dense footer="Sources: [botocore data](https://github.com/boto/botocore/tree/develop/botocore/data) · SC [docs/specifications.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/specifications.md) · Floci [tools/aws](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/tools/aws)"

### What specs leave out

## What SDKs add to the specs

A spec describes operations and shapes. The behaviour lives elsewhere:

- botocore adds 642 waiters, paginators, retry rules, endpoint rule sets
- The models can be wrong: S3 GetObject declares only a 200, yet a ranged read answers 206. sockerless-cloud keeps each correction, with evidence, in a `supplement.json` beside the spec
- AWS speaks six wire protocols: rest-json, json, query, rest-xml, ec2, smithy-rpc-v2-cbor. SQS answers both XML and JSON 1.0 for older SDKs
- Floci generates request shapes from botocore to reject wrongly typed JSON the way AWS does
- floci-gcp takes its gRPC format from Google's official protos

---

:: code-split dense footer="Sources: SC [tutorial/main.tf](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/terraform-tests/tutorial/main.tf#L25-L45) · Floci [provider.tf](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests/compat-terraform/provider.tf#L17-L76)"

## Terraform on AWS: one endpoint key per service

```hcl
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true  # [1]
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style           = true  # [2]

  endpoints {                         # [3]
    sts    = var.endpoint
    iam    = var.endpoint
    lambda = var.endpoint
    sqs    = var.endpoint
    logs   = var.endpoint             # [4]
    events = var.endpoint
  }
}
```

1. Skip the calls that would check keys, account ID, instance metadata against real AWS
2. Buckets as paths: `localhost:4566/bucket`, so no wildcard DNS
3. List every service the configuration touches; an unlisted one goes to real AWS. Floci's file lists 48
4. Keys are the provider's names: `logs`, `events`, `sfn`, `cognitoidp`; all take the same URL, http://localhost:4566

---

:: code-split dense footer="Sources: SC [simulator-gcp/README.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/README.md) · floci-gcp [provider.tf](https://github.com/floci-io/floci-gcp/blob/9d269e174298f86a6ed5024525ce944af74f3ce0/compatibility-tests/compat-terraform/provider.tf)"

## Terraform on Google Cloud: one endpoint per API, with its path

```hcl
provider "google" {
  project     = "test-project"
  credentials = var.credentials                  # [1]

  compute_custom_endpoint          = "${var.endpoint}/compute/v1/"   # [2]
  storage_custom_endpoint          = "${var.endpoint}/storage/v1/"
  sql_custom_endpoint              = "${var.endpoint}/sql/v1beta4/"
  pubsub_custom_endpoint           = "${var.endpoint}/v1/"
  cloud_run_v2_custom_endpoint     = "${var.endpoint}/v2/"
  iam_beta_custom_endpoint         = "${var.endpoint}/v1/"          # [3]
  resource_manager_custom_endpoint = "${var.endpoint}/v1/"
}
```

1. SC: a service-account key whose `token_uri` is the emulator. floci-gcp: any `GOOGLE_OAUTH_ACCESS_TOKEN`, since it ignores auth
2. The value is the emulator's address plus that API's own base path, ending in `/`
3. Some resources call other APIs: `google_service_account` uses IAM beta; `google_project` reads Resource Manager, Billing
4. Terraform cannot redirect gRPC-only APIs (Firestore, Datastore) this way; Bigtable needs `BIGTABLE_EMULATOR_HOST`

---

:: code-split dense footer="Sources: SC [simulator-azure/README.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/README.md) · floci-az [provider.tf](https://github.com/floci-io/floci-az/blob/e2b6c9022fbb6bf8545450a0c48b29619491661d/compatibility-tests/compat-terraform/provider.tf)"

## Terraform on Azure: one metadata host, over HTTPS

```hcl
provider "azurerm" {
  client_id       = "test-client-id"
  client_secret   = "test-client-secret"
  tenant_id       = "11111111-…"
  subscription_id = "00000000-…-000000000001"
  metadata_host   = "azure.sockerless.localhost:8443" # [1]

  resource_provider_registrations = "none" # [2]
  features {}
}

# floci-az instead:
#   environment   = "stack" # [3]
#   metadata_host = "localhost:4577"
```

1. azurerm reads `/metadata/endpoints` on this host, over HTTPS only; that document names the login, Resource Manager, every data plane
2. Skip registering resource providers on a subscription the emulator owns
3. Azure Stack mode: the same metadata discovery, against floci-az's own port
4. Data planes live at their own host names (`<account>.blob…`, `<vault>.vault…`): SC serves them behind a local TLS gateway with wildcard names

---

:: table dense footer="Sources: SC [artifactregistry.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/artifactregistry.go#L34) · [apim.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/apim.go#L105) · [SOURCES.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/specs/cloud-api/aws/SOURCES.md) · Floci [EC2 filter test](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/test/java/io/github/hectorvent/floci/services/ec2/Ec2VpcCidrBlockAssociationFilterIntegrationTest.java#L58)"

### Terraform providers

## What Terraform providers expect

| What the provider does | What the emulator must do | Example |
| --- | --- | --- |
| Reads each resource back after a create or update | Return every field exactly as written, or the next plan shows a change | SC's Google APIs return fields unchanged, so `plan` stays empty |
| Waits on a resource with its own filters and states | Answer the exact query its waiter sends | Floci's EC2 tests replay terraform-provider-aws's waiter filter |
| Deletes with its own defaults | Behave the way the provider expects | azurerm purges API Management on destroy; SC purges too |
| Ships data AWS publishes nowhere else | Copy that data from the provider's source | SC vendors the ELB hosted-zone ID table from terraform-provider-aws |

---

:: table dense footer="Sources: SC [specs/](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/specs) · [spec-freshness.yml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.github/workflows/spec-freshness.yml) · [gcp_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/gcp_coverage_test.go#L57-L65)"

### Pinning and refreshing

## Pin it to win it

| Step | sockerless-cloud | Floci |
| --- | --- | --- |
| Store | Every spec, gzipped, in `specs/` | 21 JSON files derived from botocore, the IAM Service Reference, CloudFormation schemas |
| Record the origin | A `SOURCES.md` row per file: upstream, path, licence, commit or hash | 23 `regen_*.py` scripts, each with its own test |
| Build | Fetches no spec at build or test time | Ships the generated files in its source tree |
| Refresh | A periodic workflow re-vendors drifted specs onto a pull request | Periodic workflows check IAM data, CloudFormation schemas |
| Use | Specs generate tables; people write the handlers | Same |

---

:: table dense footer="Sources: SC [.pre-commit-config.yaml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.pre-commit-config.yaml) · Floci [compatibility-tests](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests)"

### Testing a cloud

## Kinds of tests

| Kind | sockerless-cloud | Floci |
| --- | --- | --- |
| Unit | Go tests per package; `sim` libraries run without a simulator | JUnit tests in each repository: 36,500 methods in the AWS one |
| SDK, against a running emulator | One Go module per cloud starts the real binary | Java, Python, Node, Go SDK suites against a live native build |
| CLI | `aws`, `gcloud`, `az` suites | AWS CLI (bats); `gcloud` in floci-gcp; `az` in floci-az |
| Infrastructure as code | Terraform suites; tutorial stacks: apply, empty plan, destroy | Terraform, OpenTofu, CDK suites |
| Spec conformance | Coverage gates; validates every response against the spec | Checks request shapes against botocore; compares log filters with real AWS |

sockerless-cloud's three-client rule: a pre-commit hook rejects any new route that no SDK, CLI or Terraform test exercises. Tests make up 40% of its 878k SLOC.

---

:: content dense footer="Sources: SC [gcp_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/gcp_coverage_test.go) · [azure_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/azure_coverage_test.go) · [model_drift_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/model_drift_test.go)"

### Coverage gates

## 501 ways to say no

The vendored specs list every method a cloud documents. Four checks turn that list into a coverage count that cannot drift silently:

1. **Count what the spec declares.** A table records each document's method total (Google: 5,714). A refreshed spec that adds methods changes the total, failing the test until someone serves the new methods or records why not
2. **Call every method.** A probe sends one concrete request per documented method through the real handler chain: routing, authentication, the handler
3. **Classify each answer.** A method counts as served only when the route that answered names it. Every other method must answer a declared 501 Not Implemented; a router 404 fails the test
4. **Lock the floor.** A second table records the served count (Google: 5,600; Azure: 2,678 of 2,685). Any change, up or down, fails until both tables change together

On AWS a simpler gate fails when an operation in a vendored Smithy model is neither implemented nor on an exemption list.

---

:: comparison pick=0 dense footer="Sources: SC [run-fuzz.sh](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/scripts/run-fuzz.sh) · [fuzz-nightly.yml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.github/workflows/fuzz-nightly.yml) · Floci [RuleSqlFuzzTest.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/test/java/io/github/hectorvent/floci/services/iot/rules/RuleSqlFuzzTest.java)"

### Testing

## Fuzz Lightyear

#### sockerless-cloud: Go's built-in fuzzing

- 45 fuzz targets across 28 test files
- Targets: EventBridge patterns, cron expressions, DynamoDB expressions, PartiQL, CloudWatch filter patterns, KQL, OData filters, AMQP frames, Step Functions definitions, request parsers
- A nightly workflow runs every target for a fixed time, in sharded jobs
- Any panic fails the run; the crashing input becomes a regression test

#### Floci: one deterministic fuzz test

- Targets the IoT rules SQL parser
- A fixed seed produces 400 mutations of each valid statement
- The parser may raise only its own parse error
- Every statement it accepts must evaluate against any payload

---

:: section

## Scaling the emulator

---

:: comparison pick=0 dense

### One process per cloud

## One binary

#### sockerless-cloud

- One binary per cloud; every service on one port, the way SDKs reach a cloud through one endpoint override
- Slices share one Go package, reading each other's stores directly
- No way to start a subset of services; `SIM_RUNTIME=process` turns workloads off
- Already outside the process: workloads, sidecars, node agents, managed databases

#### Floci

- One Quarkus process serves every AWS service on 4566
- `FLOCI_SERVICES_<SVC>_ENABLED=false` blocks a service with a request filter; its code still ships
- Most services start lazily, so idle ones cost little
- Several processes may share a Docker daemon, never a state directory

---

:: comparison pick=0 dense

### State

## Where the emulators keep their state

#### sockerless-cloud: SQLite

- In memory by default; `SIM_PERSIST=true` writes one database file
- One table per store: `key TEXT PRIMARY KEY, value BLOB` holding JSON
- WAL mode with `synchronous=NORMAL`, trading power-loss safety for speed
- Object bytes live in files, which SC writes before the row
- A restart re-adopts running workload containers

#### Floci: four modes

- `memory`, the shipped default
- `persistent`: every put rewrites the whole store as JSON
- `hybrid`: in memory, flushed every few seconds
- `wal`: a binary append-only log in CBOR, compacted to a JSON snapshot every 30 s

---

:: content dense footer="Sources: [static stability](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) · [cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html) · SC [PLAN.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/PLAN.md)"

### Scaling

## Scaling out

- The real clouds split control plane from data plane, run in independent cells, keep workloads running when the control plane fails
- Their metadata lives in distributed databases: AWS's DynamoDB, Google's Spanner, Azure's Service Fabric
- An emulator is one cell, one zone, both planes in one process
- sockerless-cloud's next milestone moves node agents to other hosts, with networks that span hosts: the data plane scales first
- Splitting its control plane means replacing in-process stores, change signals, metadata tokens, the single SQLite writer
- Floci keeps every service's state inside one process, with no clustering

---

:: content dense footer="Sources: SameOldChat [modules.md](https://github.com/e6qu/someoldchat/blob/d328d21c49b78d923644762b880b61562fbcf4a2/docs/modules.md) · [modules.json](https://github.com/e6qu/someoldchat/blob/d328d21c49b78d923644762b880b61562fbcf4a2/modules.json) · fwp [services.md](https://github.com/e6qu/fun-with-pipes/blob/f5621cb46828273f7ce8edf92be4062ccec0f17c/docs/services.md) · Go [text/template](https://pkg.go.dev/text/template) · Rust [build scripts](https://doc.rust-lang.org/cargo/reference/build-scripts.html) · Java [annotation processing](https://docs.oracle.com/en/java/javase/21/docs/api/java.compiler/javax/annotation/processing/Processor.html)"

### Scaling

## Compose the cloud at build time

Write each module against an interface. A manifest says which binary holds each one; build-time tooling emits the wiring: `go generate` with `text/template` in Go, macros or `build.rs` in Rust, annotation processors in Java, `comptime` in Zig.

- **One binary:** the wiring hands each caller the implementation; a call stays an ordinary function call
- **Separate binaries:** the generator emits a gRPC client with the same interface, plus a server in the owning binary
- **The interface becomes a protocol:** arguments, results, errors must survive Protocol Buffers; any call can time out
- **Next, replicas:** prefer stateless services, with state in a shared store; then each binary runs as several replicas behind one address
- **SameOldChat**, a self-hosted Slack clone, generates both providers from `modules.json`, which also sets replicas per process
- **fwp**, a pipe-based language, swaps calls into a module for gRPC stubs when built with `--service`

---

:: table dense footer="Sources: [pos3ql](https://github.com/e6qu/pos3ql/blob/dbfb0d303db0ff64ce2ff4256d64b72a262085c3/README.md) · [Neon architecture](https://neon.com/docs/introduction/architecture-overview) · [SlateDB](https://slatedb.io) · [Litestream](https://litestream.io/how-it-works/) · DuckDB [httpfs](https://duckdb.org/docs/stable/core_extensions/httpfs/overview), [DuckLake](https://ducklake.select)"

### State

## Scaling: better stateless

| Store | What it is | Where the data lives |
| --- | --- | --- |
| pos3ql | A PostgreSQL-compatible database in Rust | An S3-compatible store; memory, disk only cache |
| Neon | Serverless PostgreSQL | Compute nodes keep nothing; pages, WAL end up in object storage |
| SlateDB | An embedded key-value store | Object storage, written as an LSM tree |
| Litestream | Replication for SQLite | Streams the WAL to S3; restores the file on start |
| DuckDB | An in-process analytics database | A local file; reads Parquet on S3 through `httpfs`, or a DuckLake catalog |

A replica that keeps no local state can crash, restart, scale out; the object store stays the one durable place.

---

:: content dense

### Takeaways

## Code your own cloud

1. Start with CI: emulate the cloud slices 🍉 your tests use, in depth
2. Let the real SDKs, CLIs, Terraform providers be your tests
3. Vendor the specs; pin them, never edit them, refresh them periodically
4. Authenticate, authorize, act, audit in one place, for every caller
5. Store the cloud's exact states; put real work behind every transition
6. Answer an unserved method with a declared 501
7. Start serverless; add VMs once they run real workloads
8. Compose at build time; keep services stateless, with state in object storage

---

:: closing mario

### Questions welcome

## Thanks, this was Adrian Mârza

[https://e6qu.github.io/](https://e6qu.github.io/)

[adi11235@gmail.com](mailto:adi11235@gmail.com)
