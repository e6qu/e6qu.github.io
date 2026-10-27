---
title: So you want to code your own cloud
footer: So you want to code your own cloud
---

<!--
A technical talk: 25 minutes, about 20 seconds per slide.
The story: why people keep rebuilding the cloud, what contract they must honour,
how to build a serverless cloud first, then VMs, then how to scale the result.
Code is pinned to sockerless-cloud a614ccf (v3.0.1) and Floci b280a77 (2.3.0),
both read on 2026-10-26.
-->

:: title

### A field guide from two emulators

# So you want to code your own cloud.

What it takes to rebuild the basic services of AWS, Google Cloud and Azure.

- Adrian Mârza
- e6qu.github.io
- October 2026

---

:: agenda

### Agenda

## Five parts in 25 minutes

1. **Why people keep rebuilding the cloud** — 5 min
2. The contract: specs, clients, tests — 5 min
3. A minimal viable cloud, serverless only — 9 min
4. Adding virtual machines — 3 min
5. Scaling the emulator, then the lessons — 3 min

---

:: comparison pick=0

### Two projects, one question

## How far can you get rebuilding a cloud?

#### sockerless-cloud (SC from here on)

- Go, one binary per cloud: AWS, Google Cloud, Azure
- Workloads really run, in containers or Firecracker microVMs
- Rule: "No stubs. No fakes. No mocks."
- v3.0.1, released 26 October 2026

#### Floci

- Java 25 on Quarkus, as a native binary or an image
- AWS first; floci-gcp, floci-az are separate projects
- Breadth: 129 AWS service packages
- 2.3.0, released 15 October 2026

---

:: section

## Why people keep rebuilding the cloud

---

:: table dense footer="Sources: HN on [OpenStack](https://news.ycombinator.com/item?id=8911021) · [LocalStack, 2017](https://news.ycombinator.com/item?id=13966088) · [Firecracker](https://news.ycombinator.com/item?id=18539539) · [Capital One](https://news.ycombinator.com/item?id=20560342) · [LocalStack, 2019](https://news.ycombinator.com/item?id=21436244)"

### Timeline, part 1

## 2008 to 2019: from private clouds to local emulators

| When | What happened | On Hacker News |
| --- | --- | --- |
| 2008 | Eucalyptus speaks the EC2 wire protocol on your own hardware | Recalled when AWS Outposts launched: the same idea, a decade later |
| 2010 | OpenStack launches as a whole cloud made of many services | "How We Failed at OpenStack" (2015): too many moving parts |
| 2013 | moto mocks AWS inside Python tests | Praised for unit tests; a wrong setup leaks calls to real AWS |
| Mar 2017 | LocalStack, from Atlassian, puts AWS in a container | First big thread; ElasticMQ suggested for SQS alone |
| Nov 2018 | AWS open-sources Firecracker, the microVM under Lambda | Debate over its roots in Google's crosvm |
| Jul 2019 | Capital One breach through the EC2 metadata service | IMDSv2 follows in November |
| Nov 2019 | LocalStack on the front page again | Covers "80/20 of the APIs", fails on error conditions |

---

:: table dense footer="Sources: HN on [LocalStack 2021](https://news.ycombinator.com/item?id=28820012) · [LocalStack 1.0](https://news.ycombinator.com/item?id=32193132) · [37signals](https://news.ycombinator.com/item?id=33260061) · [Oxide](https://news.ycombinator.com/item?id=38023891) · [MinIO maintenance](https://news.ycombinator.com/item?id=46136023) · [LocalStack, The Road Ahead](https://blog.localstack.cloud/the-road-ahead-for-localstack/)"

### Timeline, part 2

## 2021 to 2025: the cloud gets expensive, open source gets closed

| When | What happened | On Hacker News |
| --- | --- | --- |
| Apr 2021 | MinIO, the popular S3 reimplementation, moves to the AGPL | Licence backlash |
| Oct 2021 | LocalStack thread | Local cloud development called "an anti-pattern" |
| Jul 2022 | LocalStack 1.0; "LocalStack and AWS Parity Explained" | Azurite named the one good Azure emulator |
| Oct 2022 | 37signals leaves the cloud | The repatriation era begins |
| Oct 2023 | Oxide launches "The Cloud Computer" | Owning the whole stack, from firmware up |
| Nov 2023 | IMDSv2 becomes the default for new EC2 instance types | Security win, migration pain |
| Oct–Dec 2025 | MinIO stops free images, then enters maintenance mode | S3 is now the interface everyone must speak |
| Dec 2025 | LocalStack announces one image with a mandatory auth token | The clone wave starts to form |

---

:: table dense footer="Sources: HN on [community edition](https://news.ycombinator.com/item?id=47245078) · [Floci](https://news.ycombinator.com/item?id=47471801) · [repo archived](https://news.ycombinator.com/item?id=47493657) · [MiniStack](https://news.ycombinator.com/item?id=47593285) · [Fakecloud](https://news.ycombinator.com/item?id=47782696) · [multi-cloud Floci](https://news.ycombinator.com/item?id=49475568) · [Floci, Sep](https://news.ycombinator.com/item?id=49854416) · [Fakecloud, Sep](https://news.ycombinator.com/item?id=49856885)"

### Timeline, part 3

## 2026: LocalStack closes, the clones arrive

| When | What happened | On Hacker News |
| --- | --- | --- |
| Feb | sockerless starts; MinIO's repository is marked unmaintained | — |
| Early Mar | LocalStack Community requires an account | "Community edition abandoned" |
| 15 Mar | Floci 1.0.0: first commit, first release, same day | — |
| 22 Mar | Floci reaches the front page, about 220 points | A 51k-line first commit draws suspicion; CI users cheer |
| 23 Mar | LocalStack archives its GitHub repository | Workaround: pin the `community-archive` tag |
| 31 Mar | MiniStack, another replacement | Drift named as LocalStack's real problem |
| Apr | Fakecloud: 13 services tested against the Smithy models | Fewer services, correct behaviour |
| 11 Aug | sockerless-cloud splits from sockerless | — |
| Aug | Floci adds Google Cloud, Azure siblings | floci-gcp emulates 26 services |
| 26–27 Sep | Floci, Fakecloud on the front page again | An independent suite fails Fakecloud on 583 of 1,279 DynamoDB tests |

---

:: stats footer="Sources: Floci [git history](https://github.com/floci-io/floci/commits/main) · [README](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/README.md) · cloc at each tag"

### Floci

## Breadth from day one

Hector Ventura's first commit, on 15 March 2026, added 51,124 lines covering 19 AWS services. Floci 1.0.0 shipped the same day as a drop-in LocalStack replacement: same port, same environment variables, same `test` credentials. Seven months later, version 2.3.0 has 129 service packages.

- **30k → 484k** lines of production Java, 1.0.0 to 2.3.0
- **1.66×** test code relative to production code
- **4** clouds in the family: AWS, Azure, Google Cloud, OCI

---

:: stats footer="Sources: [sockerless README](https://github.com/e6qu/sockerless) · SC [first commit](https://github.com/e6qu/sockerless-cloud/commit/3ea55959) · [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md)"

### sockerless-cloud

## Depth, grown out of a test fixture

sockerless is a Docker API daemon that runs containers on ECS, Lambda, Cloud Run or Azure Functions. To test it without cloud accounts, it grew simulators. By August they outgrew the product, moving to their own repository as "a general-purpose reimplementation of slices of the clouds".

- **10.6k → 297k** lines of Go before the split, February to August
- **677k** lines moved on 11 August, as a snapshot without history
- **114** releases in the 76 days since the split

---

:: table footer="Method: cloc code lines at each revision. SC: Go, all clouds plus framework. Floci: Java in src/main, AWS only."

### Lines of code over time

## Production code, and the tests that check it

| Date | SC prod | SC test | Floci prod | Floci test |
| --- | --- | --- | --- | --- |
| Mar 2026 | 12,324 | 8,042 | 30,095 | 6,531 |
| May 2026 | 26,573 | 16,062 | 110,031 | 131,892 |
| Jul 2026 | 229,108 | 136,347 | 162,280 | 198,031 |
| Aug 2026 (split) | 296,664 | 182,265 | 169,133 | 210,377 |
| Sep 2026 | 347,292 | 229,263 | 263,492 | 356,216 |
| Oct 2026 | 463,496 | 336,450 | 483,659 | 804,650 |

---

:: table footer="SC slices: vendored spec models (AWS services, Google APIs, Azure provider families). Registrations: register calls in each main.go. Floci: service packages."

### Supported slices over time

## Floci grows wide; sockerless-cloud grows deep

| Date | SC spec slices | SC registrations | Floci services |
| --- | --- | --- | --- |
| Feb 2026 | — | 36 | — |
| Jun 2026 | 88 | 113 | 63 |
| Aug 2026 (split) | 93 | 171 | 70 |
| Sep 2026 | 95 | 219 | 123 |
| Oct 2026 | 98 | 226 | 129 |

---

### AI authorship

## Both projects are written with coding agents

sockerless says so in its README: "highly experimental" and "fully vibe-coded". sockerless-cloud keeps its agent instructions in `AGENTS.md`, its agent skills in the repository, co-author trailers in its commits. Floci keeps `AGENTS.md` beside Copilot instructions. Both ship faster than any human team could type.

On Hacker News, a 51k-line first commit drew suspicion. Hiding the author would not answer it. Conformance against published specs, checked by tests anyone can repeat, does. That is the subject of the next part.

---

:: table dense footer="cloc 2.10 code lines at v3.0.1 and 2.3.0; floci-gcp 0.11.0, floci-az 0.15.0 counted as service packages"

### The code bases

## Half a million lines each, cut differently

| Part | Language | Production | Test |
| --- | --- | --- | --- |
| SC: AWS | Go | 239,808 | — |
| SC: Google Cloud | Go | 96,310 | — |
| SC: Azure | Go | 98,139 | — |
| SC: `sim` framework, support | Go | 29,239 | — |
| **SC total** | Go | 463,496 | 336,450 |
| **Floci (AWS)** | Java | 483,659 | 804,650 |
| floci-gcp, floci-az | Java | 27 + 30 packages | — |

---

:: comparison pick=0

### Significant dependencies

## What each one leans on

#### sockerless-cloud (Go)

- `modernc.org/sqlite`: pure Go, so release builds need no C compiler
- The moby client, for Docker or Podman
- gRPC, `miekg/dns`, `cel-go`, `go-amqp`, OpenTelemetry
- nftables, only inside the microVM node agent
- Google's own `cloud.google.com/go` protobuf packages

#### Floci (Java)

- Quarkus 3.40.1 on Vert.x, compiled native with Mandrel
- Jackson, with CBOR for the binary protocols
- docker-java 3.7.1; a Kubernetes launcher for Lambda
- BouncyCastle, JSONata, Jayway JSONPath, Velocity
- The AWS SDK appears only in tests

---

:: terminal title=~/clouds

## Running them

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

:: code-split dense footer="Sources: SC [tutorial/main.tf](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/terraform-tests/tutorial/main.tf#L25-L45) · Floci [provider.tf](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests/compat-terraform/provider.tf#L17-L27)"

## Terraform against either one: AWS

```hcl
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true  # [1]
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true  # [2]
  s3_use_path_style           = true  # [3]

  endpoints {
    lambda = var.endpoint             # [4]
    sqs    = var.endpoint
    iam    = var.endpoint
    sts    = var.endpoint
  }
}
```

1. The provider would otherwise check the keys with real AWS
2. In Floci's file: no instance metadata on a laptop
3. Buckets as paths, so no wildcard DNS is needed
4. One endpoint for every service, http://localhost:4566 by default

---

:: code dense footer="Sources: SC [gcp tutorial](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/terraform-tests/fixtures/tutorial/main.tf#L36-L51) · [azure tutorial](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/terraform-tests/tutorial/main.tf#L26-L37) · floci-az provider.tf"

## Terraform: Google Cloud and Azure

```hcl
provider "google" {
  project                         = "test-project"
  credentials                     = var.credentials  # token_uri: the emulator
  pubsub_custom_endpoint          = "${var.endpoint}/v1/"
  cloudfunctions2_custom_endpoint = "${var.endpoint}/v2/"
  logging_custom_endpoint         = "${var.endpoint}/v2/"
}

provider "azurerm" {
  client_id                       = "test-client-id"
  client_secret                   = "test-client-secret"
  tenant_id                       = "11111111-1111-1111-1111-111111111111"
  subscription_id                 = "00000000-0000-0000-0000-000000000001"
  metadata_host                   = trimprefix(var.endpoint, "https://")
  # floci-az: environment = "stack", metadata_host = "localhost:4577"
  resource_provider_registrations = "none"
  features {}
}
```

---

:: section

## The contract: specs, clients, tests

---

:: table

### Five sources of truth

## No single document is the contract

| Source | What it gives you | What it misses |
| --- | --- | --- |
| API specs | Operations, shapes, protocols, errors | Behaviour, timing, limits |
| SDKs | Waiters, paginators, retries, endpoint rules | Server-side semantics |
| Terraform providers | Read-after-write, exact states, deletes | Anything Terraform never calls |
| Documentation | Quotas, defaults, state diagrams | Precision; it drifts from the API |
| The real cloud | The truth, today | Cost, accounts, repeatability |

---

:: table footer="Sources: [aws/api-models-aws](https://github.com/aws/api-models-aws) · [Google Discovery](https://developers.google.com/discovery) · [googleapis](https://github.com/googleapis/googleapis) · [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) · measured 2026-10-26"

### The specs

## Every cloud publishes its API as data

| Cloud | Format | Size | Updated |
| --- | --- | --- | --- |
| AWS | Smithy 2.0 JSON, one model per service | 435 services, 169 MB | Daily |
| AWS (older) | botocore `service-2.json` | 468 models, 126 MB | Near daily |
| Google | Discovery documents | 316 APIs (Compute: 1,018 methods) | Per revision |
| Google | googleapis protobuf | 7,475 `.proto` files | Continuous |
| Azure | OpenAPI 2.0, increasingly written in TypeSpec | 15,336 versioned files | Continuous |

---

:: content dense footer="Sources: [botocore data](https://github.com/boto/botocore/tree/develop/botocore/data) · SC [docs/specifications.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/specifications.md) · Floci [tools/aws](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/tools/aws)"

### Specs are necessary, not sufficient

## The clients know things the spec does not

A spec describes shapes, not behaviour. botocore adds 642 waiters, paginators, retry rules, endpoint rule sets. The models themselves can be wrong: S3 GetObject declares only a 200 response, yet a ranged read answers 206. sockerless-cloud records each such correction in a `supplement.json` beside the spec, with the evidence.

AWS alone speaks six wire protocols: rest-json, json, query, rest-xml, ec2, smithy-rpc-v2-cbor. SQS moved from XML to JSON 1.0, so an emulator must answer both for older SDKs. Floci generates request shapes from botocore to reject wrongly typed JSON the way AWS does. floci-gcp takes its gRPC format from Google's official protos.

---

:: content dense footer="Sources: SC [artifactregistry.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/artifactregistry.go#L34) · [apim.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/apim.go#L105) · [SOURCES.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/specs/cloud-api/aws/SOURCES.md) · Floci [EC2 filter test](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/test/java/io/github/hectorvent/floci/services/ec2/Ec2VpcCidrBlockAssociationFilterIntegrationTest.java#L58)"

### Terraform providers

## The strictest client reads back everything it writes

A provider writes a resource, reads it back, then compares. A field returned in a different shape shows up as drift in the next plan. sockerless-cloud's code cites the providers about 200 times: its Google read paths "round-trip without drift"; its Azure API Management purges on destroy because azurerm expects it. Floci's EC2 tests replay "the exact filter terraform-provider-aws's waiter sends".

The provider's source is itself a source. ELB hosted-zone IDs per region are published nowhere as data. sockerless-cloud vendors the Go table from terraform-provider-aws instead, pinned to a commit under its MPL-2.0 licence.

---

:: content dense footer="Sources: SC [specs/](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/specs) · [spec-freshness.yml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.github/workflows/spec-freshness.yml) · [gcp_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/gcp_coverage_test.go#L57-L65)"

### Pinning and refreshing

## Commit every source, never edit it, refresh it daily

sockerless-cloud commits every spec gzipped, with a `SOURCES.md` row naming its upstream, path, licence, commit or hash. Nothing downloads at build time: a clean checkout is the whole truth. A daily workflow compares each source with upstream, then pushes re-vendored specs onto a pull request. Before that gate existed, 43 AWS operations drifted unnoticed for eleven days.

Floci regenerates 21 JSON files from 23 tested `regen_*.py` scripts. Weekly workflows check its IAM data, CloudFormation schemas for drift. Both projects generate tables from specs while writing handlers by hand: a generated stub "would count as served while doing no real work".

---

:: content dense footer="Sources: SC [.pre-commit-config.yaml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.pre-commit-config.yaml) · Floci [compatibility-tests](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests)"

### Testing a cloud

## The real clients are the test oracle

sockerless-cloud enforces a three-client rule: a pre-commit hook rejects any new route that no SDK, CLI or Terraform test exercises in the same commit. Each suite starts the real simulator binary. Test code grew from 0.31 of production code in February to 0.73 today: 336k lines, 112k of them in the AWS SDK suite alone.

Floci's compatibility suites drive a live native build with the Java, Python, Node, Go SDKs, the AWS CLI, Terraform, OpenTofu, CDK. Its README claims 2,576 such tests; a count today finds about 4,000, beside 36,500 unit test methods.

---

:: code dense footer="Source: SC [gcp_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/gcp_coverage_test.go#L1097-L1111)"

## Coverage gates: an unserved method must say so

```go
// One concrete request per documented method, through the real handler chain.
// Floors: Google 5,600 of 5,714 method spellings served, Azure 2,678 of 2,685.
func TestServiceConformance_GCPUnservedMethodsDeclareThemselves(t *testing.T) {
	p := newGCPCoverageProbe(t)
	var silent []string
	for _, d := range loadDiscoveryDocs(t) {
		_, _, quiet := p.docCoverageDetail(d)
		for _, m := range quiet {
			silent = append(silent, strings.TrimSuffix(d.File, ".discovery.json.gz")+": "+m)
		}
	}
	if len(silent) > 0 {
		t.Errorf("%d unserved methods answered something other than a declared 501",
			len(silent))
	}
}
```

---

:: content dense footer="Sources: SC [sim/specvalidate.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/specvalidate.go) · [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md) · Floci [capture_filter_patterns.py](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/tools/aws-capture/cloudwatchlogs/capture_filter_patterns.py)"

### Validate the answers, test the tests

## A green suite proves only what it checks

sockerless-cloud validates every response body against the spec during the SDK, CLI suites: unknown members fail, wrong types fail. The allow list is empty for AWS, Google; it holds four lines for Azure. Floci validates request shapes; no response validation was found. It asks real AWS instead, through an opt-in capture of synthetic, read-only log filter tests.

Gates need tests too. After the split, two of sockerless-cloud's gates scanned the old monorepo's directories, found nothing, passed, hiding two live panics. Now every gate must fail on a planted violation; a gate with nothing to scan exits non-zero.

---

:: section

## A minimal viable cloud, serverless only

---

:: content dense footer="Sources: [How Workers work](https://developers.cloudflare.com/workers/reference/how-workers-works/) · [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)"

### Skip the VMs

## A serverless-only cloud is a fifth of the work

Keep identity with request signing, functions, events, queues, schedules, logs, metrics, audit. Drop the hypervisor fleet, VM lifecycles, instance metadata, the software-defined network, block storage, machine images. Cloudflare proves the model works: Workers run as V8 isolates, with capability "bindings" in place of a metadata service.

In sockerless-cloud the AWS serverless slice is about 59k of 280k lines (21%). IAM with SigV4 is its largest part, at 25k. In Floci, Lambda, EventBridge, Scheduler, SQS, CloudWatch, CloudTrail come to 51k of 693k lines (7.4%). Only Lambda needs Docker.

---

:: code dense footer="Source: SC [simulator-aws/main.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/main.go#L197-L228)"

## Every request: authenticate, authorize, act, record

```go
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

:: diagram key=4 footer="Sources: [Signature Version 4](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-create-signed-request.html) · [troubleshooting](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_sigv-troubleshooting.html)"

### AWS Signature Version 4

## Proving you hold the secret, without sending it

1. Canonical request: **Normalise** — method, path, query, signed headers, SHA-256 of the body
2. String to sign: **Scope it** — algorithm, timestamp, date/region/service/aws4_request
3. Signing key: **Derive** — HMAC chain over date, region, service, from the secret
4. Verify: **Compare in constant time** — reject requests more than five minutes old

<!-- SC always verifies, with hmac.Equal; it does not yet check clock skew (BUG-3766) or streaming chunk signatures (BUG-3739). Floci verifies only with FLOCI_AUTH_VALIDATE_SIGNATURES=true, with a 15-minute window. -->

---

:: table footer="Sources: [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) · [Google IAM deny](https://docs.cloud.google.com/iam/docs/deny-overview) · [Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/overview)"

### Three identity models

## Who you are, and what you may do

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Credential | Access key + secret, SigV4 | Service-account key signs a JWT | App secret or certificate |
| Token | STS session (key, secret, token) | OAuth 2.0 access token | Entra ID JWT |
| Policy | JSON policies on identities, resources | Role bindings down the hierarchy | Role assignments at a scope |
| Deny | Explicit deny always wins | Deny policies checked first | Deny assignments, made by Azure |
| Front door | Each service's endpoint | Each API's endpoint | Resource Manager |

---

:: diagram key=1 footer="Source: [policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)"

### AWS policy evaluation

## Deny by default, explicit deny wins, then look for an allow

1. Any policy: **Explicit deny** — ends the evaluation
2. Organizations: **SCPs, RCPs** — guardrails that only narrow
3. Resource policy: **Allow at the target** — enough within one account
4. Identity policy: **Allow for the caller** — needed across accounts
5. Boundaries: **Boundary, session policy** — intersect, never widen

<!-- SC evaluates 1, 3, 4, the user's permissions boundary, plus iam:PassRole on every role ARN in a request. SCPs, RCPs, session policies are not evaluated yet (BUG-3738). Floci evaluates all of it, SCPs included, once enforcement is on. -->

---

:: table dense footer="Sources: SC [docs/iam.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/iam.md) · Floci [IamEnforcementFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/IamEnforcementFilter.java#L324-L327) · [multi-account.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/configuration/multi-account.md)"

### What each emulator enforces

## Authentication is easy; authorization is where they differ

| Emulator | Authentication | Authorization |
| --- | --- | --- |
| SC, AWS | SigV4 always; `test` is an ordinary IAM user | Every call: "No principal bypasses evaluation" |
| SC, Google Cloud | Every REST call needs a valid bearer | Four places, e.g. Cloud Run invoke |
| SC, Azure | Entra tokens from its own tenant | Data planes only; any valid ARM token may do anything |
| Floci, AWS | SigV4 opt-in; the access key picks the account | Full evaluator, opt-in; the `test` key is a root bypass |
| floci-gcp | Auth headers ignored | GCS bucket IAM, opt-in |
| floci-az | Real RS256 tokens | Any bearer accepted |

---

:: table footer="Sources: [Lambda env vars](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) · [ECS task roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html) · [Cloud Run identity](https://docs.cloud.google.com/run/docs/securing/service-identity) · [App Service identity](https://learn.microsoft.com/azure/app-service/overview-managed-identity)"

### Workload credentials

## How code inside the cloud gets its credentials

| Where the code runs | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Lambda | Role session in env vars | Env vars, retired before expiry | Env vars, a session that never expires |
| ECS task | 169.254.170.2 endpoint | Full URI through a forwarder | A proxy container on 169.254.170.2 |
| Cloud Run, functions | Metadata server, even serverless | Metadata server behind a sidecar | `GCE_METADATA_HOST` to the main port |
| Azure Functions | `IDENTITY_ENDPOINT` + header | `/msi/token`, per-site header | Managed identity endpoint |

---

:: stats footer="Sources: [IT Brew on re:Inforce 2025](https://www.itbrew.com/stories/2025/06/25/how-aws-iam-stays-busy-behind-the-scenes) · [AWS Service Reference](https://docs.aws.amazon.com/service-authorization/latest/reference/service-reference.html)"

### IAM is the biggest service you will write

## An emulator is also an identity provider

sockerless-cloud signs Google tokens with its own RSA key, serves the JWKS, runs its own Entra tenant. Its STS session tokens seal their expiry with a key kept in the database, so sessions survive a restart. IAM, STS, SigV4 total 25k lines: more than Lambda, SQS, EventBridge, Scheduler together.

- **1.2B** authorization calls per second at AWS, 2025
- **4,310** (action, condition key) pairs in the Service Reference
- **615** of those pairs SC does not build yet, listed in a test file

---

:: diagram key=2 footer="Sources: [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) · [Runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html)"

### Functions

## A function is a long poll over a pool of sandboxes

1. Init: **Start the sandbox** — extensions, runtime, your static code; 10 s cap
2. Next: **The runtime asks for work** — GET /runtime/invocation/next blocks until an event arrives
3. Respond: **Post the result** — /response or /error, keyed by the request ID
4. Freeze: **Keep it warm** — the next Next ends this invocation; idle sandboxes retire

---

:: code dense footer="Source: SC [lambda_runtime.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/lambda_runtime.go#L131-L134)"

## The Lambda Runtime API is four routes

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

:: comparison pick=0

### Warm pools and concurrency

## Throttling is a feature you must build

#### sockerless-cloud: `sim/funcrt`

- Lease an idle environment, join one starting, or start one
- Limits form a tree: reserved concurrency owns its capacity; the rest share the account's 1,000
- Over the limit: `TooManyRequestsException`
- Environments retire before their role session expires

#### Floci: `WarmPool`

- Reuse containers; evict after an idle timeout
- At most max(4, CPUs) warm per function, plus an optional global cap
- Reserved, unreserved pools: 1,000, 100 by default
- Executor: Docker, or Kubernetes pods for CI without a socket

---

:: table footer="Sources: [Firecracker spec](https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md) · [Cloud Run environments](https://docs.cloud.google.com/run/docs/about-execution-environments) · [Workers security model](https://developers.cloudflare.com/workers/reference/security-model/)"

### The isolation spectrum

## What the clouds run your function in

| Sandbox | Used by | Start | Boundary |
| --- | --- | --- | --- |
| V8 isolate | Cloudflare Workers, Bunny | Milliseconds | The JavaScript engine |
| gVisor | Cloud Run gen1, Scaleway | Fast, partial syscalls | A user-space kernel |
| Firecracker microVM | Lambda, Fargate, Koyeb | ≤ 125 ms to init | Hardware virtualization |
| Container | Both emulators by default | Seconds | Namespaces, shared kernel |

<!-- SC can place functions in Firecracker microVMs through its node agent (SIM_PLACEMENT). Cloud Run functions are Cloud Run services, which get credentials from the metadata server. Azure Functions run as App Service sites. floci-gcp keeps Cloud Functions as metadata only. -->

---

:: diagram key=4 footer="Sources: [EventBridge retries](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html) · [Event Grid retries](https://learn.microsoft.com/azure/event-grid/delivery-and-retry) · [Eventarc](https://docs.cloud.google.com/eventarc/docs/overview)"

### Events

## A bus matches, transforms, delivers, retries for a day

1. Publish: **PutEvents** — to a bus; up to 1 MB on Eventarc Advanced
2. Match: **Patterns over JSON** — prefix, suffix, anything-but, numeric, cidr, wildcard
3. Transform: **Input transformers** — each target gets the shape it expects
4. Deliver: **At least once** — EventBridge: 185 retries over 24 h, then a drop without a DLQ

---

:: code dense footer="Source: SC [eventbridge_delivery.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/eventbridge_delivery.go#L41-L73)"

## One bus library, three clouds

```go
ebBus = eventbus.New(srv, eventbus.Config[EBEventRecord, ebRoute, ebTargetDelivery]{
	Subscriptions: ebBusRoutes,
	Admits: func(route ebRoute, record EBEventRecord) bool {
		return route.Rule.EventPattern != "" &&
			ebEventPatternMatches(route.Rule.EventPattern, ebBuildEvent(record))
	},
	Transform: func(route ebRoute, records []EBEventRecord) (ebTargetDelivery, bool) { ... },
	Archive:   archiveEBEvent,
	Delivery: &eventbus.Delivery[ebTargetDelivery]{
		Store:      store, // persisted: retries resume after a restart
		Policy:     func(d ebTargetDelivery) delivery.Policy { ... },
		Attempt:    func(ctx context.Context, item *delivery.Item[...]) delivery.Outcome { ... },
		DeadLetter: ebDeadLetterTargetDelivery,
	},
})
ebBus.Resume()
```

---

:: comparison pick=0

### Pattern matching is a language

## Write one matcher, then fuzz it

#### sockerless-cloud

- One grammar for EventBridge patterns, SNS filter policies, Lambda event filters
- Per-consumer dialects decide what `anything-but` may wrap
- Every operator, including numeric, cidr, wildcard, `$or`
- Fuzzed nightly

#### Floci

- A hand-written matcher over Jackson trees
- No `numeric`, `cidr` or `wildcard` in EventBridge
- Pipes, SNS, Lambda filters each have their own matcher
- Each pattern is re-parsed for every event

---

:: table footer="Sources: [SQS parameters](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-queue-parameters.html) · [Pub/Sub properties](https://docs.cloud.google.com/pubsub/docs/subscription-properties) · [Service Bus locks](https://learn.microsoft.com/azure/service-bus-messaging/message-transfers-locks-settlement)"

### Queues

## A queue is a lease, a receipt, a redrive

| Aspect | Amazon SQS | Google Pub/Sub | Azure Service Bus |
| --- | --- | --- | --- |
| Lease | Visibility timeout, 30 s (max 12 h) | Ack deadline, 10 s (max 600 s) | Peek-lock, 1 min (max 5 min) |
| Long poll | Up to 20 s | Streaming pull | AMQP link, or REST |
| Ordering | FIFO per message group | Ordering keys, opt-in | Sessions |
| Poison messages | `maxReceiveCount`, then a DLQ | Dead-letter topic | 10 deliveries, then the DLQ |
| Max message | 1 MiB since Aug 2025 | 10 MB | 256 KB Standard |

---

:: code-split dense footer="Sources: SC [sqs_wait.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/sqs_wait.go#L10-L35) · Floci [SqsService.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/sqs/SqsService.java#L1481-L1484)"

## Long polling without a timer

```go
// sockerless-cloud: wake on a write, or when a message becomes visible
var sqsArrivals = msgq.NewWaiter(func(name string, now time.Time) (
	time.Time, bool) {
	q, ok := sqsQueues.Get(name)
	if !ok {
		return time.Time{}, false
	}
	return q.Messages.NextChange(sqsPolicy(q), now) // [1]
})
```

```java
// Floci: a monitor per queue, woken on send, re-checked every second
synchronized (lock) {
    lock.wait(Math.min(1000, maxWait - elapsed)); // [2]
}
```

1. One waiter serves SQS, Pub/Sub pulls, Service Bus, Cloud Tasks
2. Simple, correct; a parked receive holds a worker thread

---

:: table footer="Sources: botocore [lambda model](https://github.com/boto/botocore/tree/develop/botocore/data/lambda) · [operations.proto](https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto) · [ARM async operations](https://learn.microsoft.com/azure/azure-resource-manager/management/async-operations)"

### Lifecycles

## Every resource is a state machine

| Resource | States the client waits on |
| --- | --- |
| EC2 instance | pending → running → stopping → stopped; shutting-down → terminated |
| Lambda function | Pending → Active or Failed; 8 states, plus LastUpdateStatus |
| CloudFormation stack | 23 stack statuses, 28 resource statuses |
| Google operation | `done` false, then exactly one of `error` or `response` |
| Azure resource | `provisioningState`, polled at `Azure-AsyncOperation` or `Location` |
| Azure VM | A provisioning state plus a power state, at the same time |

---

:: code-split dense footer="Sources: botocore [ec2 waiters-2.json](https://github.com/boto/botocore/blob/develop/botocore/data/ec2/2016-11-15/waiters-2.json) · Terraform [helper/retry/state.go](https://github.com/hashicorp/terraform-plugin-sdk/blob/main/helper/retry/state.go)"

## Clients encode the machine

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

:: content dense footer="Sources: SC [ec2_instance_launch.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/ec2_instance_launch.go#L425-L438) · Floci [Ec2Service.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/ec2/Ec2Service.java#L4768-L4775)"

### Real work behind every transition

## An instant ACTIVE hides bugs

A client that reboots an instance still pending works against an instant emulator, then fails in AWS. sockerless-cloud found this exact race in its own code once a sidecar image stopped committing instantly. Its instances turn running only when their init writes a ready marker. Each resource either shows its transient state for one read or settles at once, with the choice documented. Floci settles EC2 on the next DescribeInstances; floci-gcp derives status from a 50 ms clock.

Long-running operations need one tracker per cloud: running, then done with a result or an error. sockerless-cloud still has three trackers, with a merge planned; floci-gcp has one. Neither leaves an operation running across a restart.

---

:: comparison pick=0 dense

### Workflows

## A workflow engine is an interpreter that calls your API

#### sockerless-cloud: Step Functions

- JSONPath, JSONata; Standard, Express
- Tasks call services through `sim.Server.Call`: authentication, IAM, audit, spec validation
- `.sync` waits wake on store changes; Wait states use real time
- Running executions resume from a checkpoint after a restart
- Logic Apps: a `runAfter` engine that fails actions it cannot run

#### Floci: Step Functions

- 15k lines; the ASL executor alone is 6.4k
- Tasks call services as in-process Java methods, not HTTP requests
- Waits, retry delays capped at 30 s by default, documented
- A restart aborts running executions
- Also SWF, Lambda durable executions

---

:: content dense footer="Sources: [ProgressEvent](https://github.com/aws-cloudformation/cloudformation-cli-java-plugin) · Floci [cloudformation](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/cloudformation) · [EC2 state-change events](https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/monitoring-instance-state-changes.md) · [Deployment Manager deprecation](https://docs.cloud.google.com/deployment-manager/docs/deprecations)"

### Infrastructure as code inside the cloud

## CloudFormation is a workflow engine over every service

A CloudFormation resource provider returns IN_PROGRESS with a callback context until its resource is done. Floci implements CloudFormation in 50k lines, about 194 resource types. It provisions one resource at a time after a topological sort, where AWS works in parallel. Its provisioners call service methods directly, past the request filter where IAM is enforced. floci-az runs ARM deployments through its normal request router instead. sockerless-cloud serves none of these; it tests with Terraform from outside.

State machines should also emit events. AWS sends "EC2 Instance State-change Notification" to EventBridge on every transition; neither emulator does. Floci emits ECS task events for states its own model never passes through. Emit from the state machine itself, or the events will contradict the API.

---

:: diagram key=3 footer="Sources: SC [sim/logstore](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/logstore) · Floci [ContainerLogStreamer.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/docker/ContainerLogStreamer.java#L270-L274)"

### Logging

## From a container's stdout to a log you can query

1. Follow: **Stream the engine's logs** — split stdout from stderr, line by line
2. Drain: **Lose nothing at exit** — re-read the full log, skip lines already written
3. Store: **One row per entry** — keyed by stream, arrival order; never rewritten whole
4. Query: **Insights, filters, KQL** — retention by each entry's own timestamp

<!-- SC uses this path for all three clouds. Floci calls putLogEvents once per line, in process, keeping at most 20,000 events per account. -->

---

:: table dense footer="Sources: SC simulator READMEs · Floci [cloudwatch.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/cloudwatch.md) · floci-az monitor.md"

### Query languages and alarms

## Every cloud has its own query language

| Feature | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Logs Insights | fields, filter, stats, parse, sort | A query engine in the CloudWatch slice | fields, filter (=, !=), sort, dedup, limit |
| Filter patterns | Terms, JSON, space-delimited | Implemented | Implemented, checked against AWS |
| Cloud Logging filter | Full language, sinks | Routing, sinks, exclusions | A subset, sinks to GCS |
| KQL | Full language | where, extend, summarize, order by | where, project, take |
| Alarms | M of N periods, missing-data rules | Every 250 ms; M of N not modelled | Every 10 s; metric math not evaluated |

---

:: table dense footer="Sources: [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html) · [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit) · [Activity Log](https://learn.microsoft.com/azure/azure-monitor/platform/activity-log) · SC [cloudtrail.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/cloudtrail.go#L878-L920) · Floci [CloudTrailJsonHandler.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/cloudtrail/CloudTrailJsonHandler.java#L222-L226)"

### Audit

## The audit trail is where the emulators differ most

| Trail | Real cloud | sockerless-cloud | Floci family |
| --- | --- | --- | --- |
| AWS CloudTrail | Management events, 90 days, about 5 min delay | Every call, recorded at the one front door, 90 days | S3 data events only; LookupEvents returns an empty list |
| Google Audit Logs | Admin Activity always; Data Access opt-in | Both, from vendored audit docs; they feed Eventarc | floci-gcp: none |
| Azure Activity Log | ARM writes, 90 days | Every ARM write | floci-az: every write, 10,000 in memory |

---

:: section

## Adding virtual machines

---

:: table dense footer="Sources: [Nitro System](https://docs.aws.amazon.com/whitepapers/latest/security-design-of-aws-nitro-system/the-components-of-the-nitro-system.html) · [Google KVM hardening](https://cloud.google.com/blog/products/gcp/7-ways-we-harden-our-kvm-hypervisor-at-google-cloud-security-in-plaintext) · [Azure hypervisor](https://learn.microsoft.com/azure/security/fundamentals/hypervisor) · [Azure VM states](https://learn.microsoft.com/azure/virtual-machines/states-billing)"

### The real thing

## Three clouds, three hypervisors, all with custom hardware

| Aspect | AWS EC2 | Compute Engine | Azure VMs |
| --- | --- | --- | --- |
| Hypervisor | Minimal KVM-based Nitro Hypervisor | Hardened KVM, Google's own VMM | Hyper-V based Azure Hypervisor |
| Offload | Nitro Cards: storage, network, control | Andromeda SDN on the host | Azure Boost: FPGA storage, MANA NIC |
| Lifecycle | pending, running, stopped, terminated | PROVISIONING, STAGING, RUNNING, TERMINATED | A power state plus a provisioning state |
| Billing trap | Volumes bill while stopped | Suspended memory keeps billing | "Stopped" still bills compute; only "deallocated" stops it |

---

:: comparison pick=0 dense

### A VM in an emulator

## A container that boots like a machine, or a real microVM

#### sockerless-cloud

- A digest-pinned OCI image whose init runs cloud-init, the startup script, then writes a ready marker
- Stop keeps the disk; a guest that powers itself off ends like a real one
- Or a Firecracker microVM, booted by a node agent from an ext4 image of the same OCI image
- No host privilege: no capabilities, devices or engine socket for workloads

#### Floci

- One Docker container per instance, `tail -f /dev/null` unless the AMI wants systemd
- Stop is `docker stop`, reboot is `docker restart`
- Instance types map to `--cpus`, `--memory`
- Privileged by default, to add the metadata address to loopback

---

:: table footer="Sources: [EC2 IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-v2-how-it-works.html) · [Google metadata](https://docs.cloud.google.com/compute/docs/metadata/querying-metadata) · [Azure IMDS](https://learn.microsoft.com/azure/virtual-machines/instance-metadata-service) · [comparison](https://ahmet.im/blog/comparison-of-instance-metadata-services/)"

### Instance metadata

## The magic IP, three ways

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Address | 169.254.169.254 | metadata.google.internal | 169.254.169.254, WireServer 168.63.129.16 |
| Anti-SSRF | PUT for a token; hop limit 1 | Header `Metadata-Flavor: Google` | Header `Metadata: true`, no `X-Forwarded-For` |
| Credentials | `iam/security-credentials/<role>` | `service-accounts/default/token` | `identity/oauth2/token` |
| Serverless | Not on Lambda | Yes, on Cloud Run too | `IDENTITY_ENDPOINT` instead |

---

:: comparison pick=0

### Answering at the magic IP

## Routing 169.254.169.254 needs privilege; SC refuses it

#### sockerless-cloud

- The link-local address does not answer (BUG-3485)
- Workloads get the SDK variables instead: `AWS_EC2_METADATA_SERVICE_ENDPOINT`, `GCE_METADATA_HOST`, `IDENTITY_ENDPOINT`
- A sidecar per network proxies to the simulator with a token it mints
- The caller is the TCP peer the sidecar saw: no workload can claim another's address

#### Floci

- A privileged container adds 169.254.169.254 to its loopback
- A `socat` relay forwards it to Floci's metadata server on port 9169
- The caller is the container's source IP
- IMDSv2 tokens are UUIDs bound to the instance

---

:: comparison pick=0 dense

### Networks, security groups, user data

## A VPC is an engine network; a security group is nftables

#### sockerless-cloud

- One engine network per VPC, over the resource's own CIDR
- DNS, metadata sidecar at the address the cloud reserves
- Security groups enforced at the microVM's tap; container-to-container traffic is not filtered yet (BUG-3481)
- cloud-init's stages reimplemented in 376 lines of POSIX shell

#### Floci

- One Docker bridge per VPC; overlapping CIDRs are substituted, with a warning
- Opt-in enforcement: a helper container runs nftables, default deny
- No routing, NACLs, NAT or peering enforcement
- User data runs as a script after SSH key injection; its output goes to CloudWatch Logs

---

:: section

## Scaling the emulator

---

:: comparison pick=0 dense

### One process per cloud

## Fat binaries, on purpose

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

### Storage

## SQLite, or JSON files with a write-ahead log

#### sockerless-cloud: SQLite

- In memory by default; `SIM_PERSIST=true` writes one database file
- One table per store: `key TEXT PRIMARY KEY, value BLOB` holding JSON
- WAL mode with `synchronous=NORMAL`: FULL made DynamoDB writes take 500–1,100 ms, against single-digit ms on AWS
- Object bytes live in files, written before the row
- Workload containers are adopted again after a restart

#### Floci: four modes

- `memory`, the shipped default
- `persistent`: every put rewrites the whole store as JSON
- `hybrid`: in memory, flushed every few seconds
- `wal`: a binary append-only log in CBOR, compacted to a JSON snapshot every 30 s

---

:: code-split dense footer="Source: SC [sim/state_sqlite.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/state_sqlite.go#L303-L332)"

## A store update is read, modify, write, under one lock

```go
func (s *SQLiteStore[T]) Update(id string, fn func(*T)) bool {
	s.mu.Lock() // [1]
	defer s.mu.Unlock()
	var data []byte
	s.db.QueryRow(`SELECT value FROM ... WHERE key = ?`, id).Scan(&data)
	...
	var v T
	unmarshalPersistentValue(data, &v)
	fn(&v) // [2]
	updated, _ := marshalPersistentValue(v)
	s.db.Exec(`INSERT OR REPLACE INTO ... VALUES (?, ?)`, id, updated)
	s.generation.Store(nextStoreGeneration()) // [3]
	return true
}
```

1. A Go mutex per store, not a SQL transaction: one process, one writer
2. A whole SQS queue is one row, so each send rewrites the queue
3. Waiters watch the generation, not a timer

---

:: content dense footer="Sources: [static stability](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) · [cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html) · SC [PLAN.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/PLAN.md)"

### The way out

## Split the data plane first, the control plane later

The real clouds separate control plane from data plane. They run in independent cells; workloads keep running when the control plane fails. Their metadata lives in DynamoDB (89.2 million requests per second at peak), Spanner, Service Fabric. An emulator is the opposite: one cell, one zone, both planes in one address space.

sockerless-cloud's milestone M5 moves node agents to other hosts, reached over their API, with engine networks that span hosts. That scales the data plane. Splitting the control plane would mean replacing shared package-level stores, in-process change signals, in-memory metadata tokens, the single SQLite writer. Floci keeps every service's state inside its process, with no clustering.

---

:: table dense footer="Europe-headquartered providers only, from their docs, 2026-10: [Scaleway](https://www.scaleway.com/en/docs/) · [OVHcloud](https://docs.ovhcloud.com/) · [Hetzner](https://docs.hetzner.com/cloud/) · [STACKIT](https://docs.stackit.cloud/) · [OTC](https://docs.otc.t-systems.com/) · [UpCloud](https://upcloud.com/docs) · [Exoscale](https://community.exoscale.com/)"

### Europe

## What independent European clouds actually ship

| Provider | VMs | Functions | Events | Queues | Audit | IAM |
| --- | --- | --- | --- | --- | --- | --- |
| Scaleway (FR) | Own | Knative + gVisor | SNS-compatible | SQS-compatible, NATS | Beta | Policies, CEL |
| OVHcloud (FR) | OpenStack | — | — | Kafka | To LDP | URN policies |
| Hetzner (DE) | Own | — | — | — | — | Read or Read & Write |
| STACKIT (DE) | OpenStack | — | — | RabbitMQ | Central log | Roles, OIDC federation |
| Open Telekom (DE) | OpenStack-derived | FunctionGraph | SMN | Kafka, RabbitMQ | 7 days | Agencies |
| UpCloud (FI) | Own | — | — | — | 180 days | Subaccounts |
| Exoscale (CH) | Own | — | — | — | 30 days | Org + role policies |

---

:: content dense footer="Sources: [Hetzner tokens](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token) · [OTC metadata](https://docs.otc.t-systems.com/elastic-cloud-server/umn/) · [Scaleway messaging](https://www.scaleway.com/en/docs/messaging/faq)"

### What Europe teaches

## The minimal viable cloud already exists, and sells

Hetzner's entire authorization model is a project token that is either "Read" or "Read & Write". Most European providers stop at VMs, Kubernetes, S3-compatible storage. Queues are managed open-source brokers; no provider surveyed offers an EventBridge-style rule bus.

The exceptions are instructive. Scaleway reimplemented the SQS, SNS wire protocols in-house, so AWS SDKs work unchanged. Open Telekom Cloud is the only one handing VMs temporary keys from metadata, at `/openstack/latest/securitykey`. Scaleway serves user data only to source ports below 1024, a cheap defence against SSRF.

---

:: content dense footer="Sources: HN [LocalStack thread, 2021](https://news.ycombinator.com/item?id=28822696) · [MiniStack thread](https://news.ycombinator.com/item?id=47593285) · [DynamoDB Local](https://news.ycombinator.com/item?id=49870948) · [CI use case](https://news.ycombinator.com/item?id=47475473)"

### The pushback

## Should you emulate the cloud at all?

The case against is serious. Some teams treat local cloud development as an anti-pattern, giving each developer a short-lived real environment instead. Drift between emulator and cloud breaks tests in staging. Even AWS's own DynamoDB Local fails about 100 tests of an independent conformance suite.

The case for is CI. Integration tests need environments that start in seconds, behave deterministically, stay isolated, cost nothing per merge. Real accounts offer none of that. The answer is both: emulate for the fast loop, keep one real environment for the last mile.

---

:: content dense

### Rules for coding your own cloud

## What both projects learned the hard way

1. Let the real SDKs, CLIs, Terraform providers be your tests
2. Vendor the specs; pin them, never edit them, refresh them daily
3. Authenticate, authorize, act, audit in one place, for every caller, services included
4. Store the cloud's exact states; put real work behind every transition
5. Wake on writes, not timers; never leave an operation running across a restart
6. Answer an unserved method with a declared 501, never an empty 200
7. Start serverless; add VMs when you can do them without lying

---

:: closing mario

### Questions welcome

## Thanks, this was Adrian Mârza

[https://e6qu.github.io/](https://e6qu.github.io/)

[adi11235@gmail.com](mailto:adi11235@gmail.com)
