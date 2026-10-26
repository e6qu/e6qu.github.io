---
title: So you want to code your own cloud
footer: So you want to code your own cloud
---

<!--
A technical talk: 25 minutes, 100 slides, about 15 seconds each. The deck is the
handout: every slide links its sources. Code is pinned to sockerless-cloud at
a614ccf (v3.0.1 + 1) and Floci at b280a77 (2.3.0 + main), both read on 2026-10-26.
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

1. **How we got here: history and the two code bases** — 4 min
2. Sources of truth, and testing a cloud — 5 min
3. Act 1: the minimal viable cloud, serverless only — 8 min
4. Acts 2 and 3: virtual machines, then scaling the emulator — 5 min
5. Europe, the pushback, and the rules — 3 min

---

### What we mean by a cloud

## A cloud is an API that does real work

From the outside, a cloud is a set of HTTP APIs that the official SDKs, CLIs and Terraform providers already know how to call. Behind them:

- **Identity:** every request is signed, and every action is authorized
- **Compute:** functions now, virtual machines later
- **Events and queues:** work moves between services without you
- **Logs, metrics and audit:** proof of what happened, and who did it

If the real clients work unchanged against your endpoint, you have built a slice of that cloud.

---

:: comparison pick=0

### Two projects, one question

## How far can you get rebuilding a cloud?

#### sockerless-cloud (SC from here on)

- Go, one binary per cloud: AWS, Google Cloud and Azure
- Workloads really run: containers, or Firecracker microVMs
- Strict: "No stubs. No fakes. No mocks."
- v3.0.1, 26 October 2026

#### Floci

- Java 25 and Quarkus, a native binary or an image
- AWS first; floci-gcp and floci-az are siblings
- Broad: 129 AWS service packages
- 2.3.0, 15 October 2026

---

:: section

## How we got here

---

:: table dense footer="Sources: [HN: How We Failed at OpenStack](https://news.ycombinator.com/item?id=8911021) · [HN: LocalStack, 2017](https://news.ycombinator.com/item?id=13966088) · [moto](https://github.com/getmoto/moto)"

### People have rebuilt the cloud before

## Twenty years of reimplementing someone else's API

| Attempt | What it rebuilt | Lesson |
| --- | --- | --- |
| Eucalyptus | The EC2 wire protocol, on your hardware | Compatibility is a moving target |
| OpenStack | A whole cloud, as many services | "Too many moving parts" |
| moto | AWS as a Python mock for boto3 tests | In-process fakes are cheap and shallow |
| LocalStack | AWS in a container, for dev and CI | Breadth first, then a paywall |
| MinIO, Garage | S3, as a product of its own | One API can carry a company |
| Floci, sockerless-cloud | Many clouds, as emulators | Today's subject |

---

> OpenStack really has a bunch of problems. The big one is that OpenStack is about…
> — [Hacker News, Intel pulls out of OpenStack, 2017](https://news.ycombinator.com/item?id=14132355)

<!-- Verbatim opening of the comment, as HN search shows it; open the link to read the rest before quoting more. The theme of every "we built a cloud" thread: it is mostly operations. -->

---

:: content footer="Sources: [AWS security blog](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/) · [HN thread](https://news.ycombinator.com/item?id=20560342) · [IMDSv2 options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html)"

### 2019: instance metadata becomes an attack surface

## One GET to 169.254.169.254 leaked a bank's role credentials

- Capital One: a misconfigured WAF forwarded a request to the EC2 metadata service and returned temporary role credentials
- Those credentials read S3 buckets; AWS answered with IMDSv2
- IMDSv2 needs a PUT for a session token, and its hop limit of 1 keeps the token out of reach of a proxy
- New instance types default to IMDSv2 only since 2023

---

> localstack hits the 80/20 rule of apis and a 20/80 rule on error conditions.
> — kapilvt, [Hacker News, 2019](https://news.ycombinator.com/item?id=21436244)

<!-- Search-snippet quote: confirm the wording on the thread before presenting. The point: the happy path is the easy 80%; the errors are where the work is. -->

---

:: diagram key=4 footer="Sources: HN on MinIO: [AGPL](https://news.ycombinator.com/item?id=26919510) · [maintenance mode](https://news.ycombinator.com/item?id=46136023) · [no longer maintained](https://news.ycombinator.com/item?id=47000041) · [Garage](https://news.ycombinator.com/item?id=46326984)"

### One API can carry a company

## S3 became the interface everyone reimplements

1. Apr 2021: **MinIO moves to the AGPL** — the S3 reimplementation most people self-host
2. Oct 2025: **No more free Docker images** — the community UI was already cut back
3. Dec 2025: **Maintenance mode** — "S3 somehow became the defacto object storage interface"
4. Feb 2026: **No longer maintained** — Garage, SeaweedFS, RustFS and VersityGW take the users

---

:: diagram key=3 footer="Sources: [LocalStack, The Road Ahead](https://blog.localstack.cloud/the-road-ahead-for-localstack/) · [HN: community edition](https://news.ycombinator.com/item?id=47245078) · [HN: Floci](https://news.ycombinator.com/item?id=47471801)"

### March 2026

## The free LocalStack goes away, and the clones arrive

1. Dec 2025: **The road ahead** — LocalStack announces one image with a mandatory auth token
2. 15 Mar 2026: **Floci 1.0.0** — the first commit and the first release on the same day
3. 23 Mar 2026: **Repository archived** — the community edition's code goes read-only
4. Spring 2026: **MiniStack, Fakecloud** — more clones, each betting on a different trade-off

---

:: stats footer="Sources: Floci [git history](https://github.com/floci-io/floci/commits/main) and [README](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/README.md) · cloc at each tag"

### Floci

## Fifty-one thousand lines in the first commit

Hector Ventura's first commit on 15 March 2026 added 51,124 lines and 19 services. Seven months later, 2.3.0 has 129 service packages.

- **30k → 484k** production Java, 1.0.0 to 2.3.0
- **1.66×** as much test code as production code
- **4** clouds in the family: AWS, Azure, Google Cloud and OCI

---

### sockerless: the parent project

## sockerless-cloud began as a test fixture

[sockerless](https://github.com/e6qu/sockerless) is a Docker API daemon that runs containers on ECS, Lambda, Cloud Run, Cloud Functions, Container Apps and Azure Functions. To test it without cloud accounts, it grew simulators:

- "In-memory cloud API simulators for local development and testing."
- February 2026: about 10.6k lines of Go across three clouds
- By 28 February the rule was set: "local reimplementations of cloud provider services, not mocks, stubs, or fakes"

The README is honest about how it was built: "Sockerless is **highly experimental** and **fully vibe-coded**."

---

:: stats footer="Sources: [first commit](https://github.com/e6qu/sockerless-cloud/commit/3ea55959) · [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md)"

### 11 August 2026

## The split: a fresh snapshot without history

"The simulators are a general-purpose reimplementation of slices of the clouds, not a component of their first consumer."

- **2,420** files moved in one commit
- **677,338** lines added to the new repository
- **0** commits of history kept; sockerless now pins the simulators as Go modules

---

:: diagram key=4 footer="Source: [CHANGELOG.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/CHANGELOG.md) · 114 tags, v0.2.0 to v3.0.1"

### Since the split

## 114 releases in 76 days, mostly depth

1. Aug 2026: **Tests that proved nothing** — a sweep of every simulator, and fixes for what those tests hid
2. Sep 2026: **One framework** — three drifting copies of `shared/` become the `sim` module
3. Oct 2026: **Bug sweeps 2 to 23** — majors 1.0 and 2.0 come from `fix!` sweeps, not milestones
4. 25 Oct 2026: **3.0.0 removes host privilege** — engine networks, sidecars, a node agent for microVMs

---

:: table footer="Method: cloc code lines at each revision; SC = Go, all clouds plus framework; Floci = Java in src/main, AWS only"

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

:: table footer="SC slices = vendored spec models (AWS services, Google APIs, Azure provider families); registrations = register calls in main.go. Floci = service packages."

### Supported slices over time

## Breadth against depth

| Date | SC spec slices | SC registrations | Floci services |
| --- | --- | --- | --- |
| Feb 2026 | — | 36 | — |
| Jun 2026 | 88 | 113 | 63 |
| Aug 2026 (split) | 93 | 171 | 70 |
| Sep 2026 | 95 | 219 | 123 |
| Oct 2026 | 98 | 226 | 129 |

---

### AI authorship: we don't hide it

## Both projects are written with coding agents

- sockerless says so in its README: "fully vibe-coded"
- sockerless-cloud keeps `AGENTS.md` (`CLAUDE.md` is a symlink to it), project skills, and commits with `Co-Authored-By: Claude` trailers
- Floci keeps `AGENTS.md` and Copilot instructions, and ships faster than any team could type
- Hacker News pushes back: "freshly minted vibe code", "misaligned ASCII diagram"

<!-- The two HN phrases are search-snippet quotes; check them on the threads before presenting. -->

The answer to distrust is not a hidden author: it is conformance, specs and tests anyone can rerun. That is most of this talk.

---

:: section

## The two code bases

---

:: table dense footer="cloc 2.10 code lines (no blanks or comments) at v3.0.1 and 2.3.0; Floci's siblings at floci-gcp 0.11.0 and floci-az 0.15.0"

### Size

## Half a million lines each, cut differently

| Part | Language | Production | Test |
| --- | --- | --- | --- |
| SC: AWS | Go | 239,808 | — |
| SC: Google Cloud | Go | 96,310 | — |
| SC: Azure | Go | 98,139 | — |
| SC: `sim` framework and support | Go | 29,239 | — |
| **SC total** | Go | 463,496 | 336,450 |
| **Floci (AWS)** | Java | 483,659 | 804,650 |
| floci-gcp, floci-az | Java | 27 + 30 packages | — |

---

:: comparison pick=0

### Significant dependencies

## What each one leans on

#### sockerless-cloud (Go)

- `modernc.org/sqlite`: pure Go, so builds stay `CGO_ENABLED=0`
- The moby client for Docker or Podman
- gRPC, `miekg/dns`, `cel-go`, `go-amqp`, OpenTelemetry
- nftables and conntrack, only in the node agent
- Google's own `cloud.google.com/go` protobuf packages

#### Floci (Java)

- Quarkus 3.40.1 on Vert.x, built native with Mandrel
- Jackson, including CBOR for the binary protocols
- docker-java 3.7.1; a Kubernetes launcher for Lambda
- BouncyCastle, JSONata, Jayway JSONPath, Velocity
- The AWS SDK only in tests, never in production

---

:: code footer="Sources: [simulator-aws/main.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/main.go#L34) · Floci [EmulatorLifecycle.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/lifecycle/EmulatorLifecycle.java#L210)"

## Entry points: one program per cloud, one Quarkus app

```go
// sockerless-cloud: simulator-aws, simulator-gcp and simulator-azure each do this
func main() {
	sim.Main(sim.Program{
		Provider:    "aws",
		DefaultPort: "4566", // gcp 4567 (+gRPC 4569), azure 4568
		Configure:   func(cfg *sim.Config) error { ... },  // placement
		Build:       func(cfg sim.Config) (*sim.Server, error) { ... },
	})
}

// Floci: no main of its own; Quarkus generates it
void onStart(@Observes StartupEvent ignored) { ... }  // EmulatorLifecycle.java
```

---

:: terminal title=~/clouds

## Running them

```console
$ go install github.com/e6qu/sockerless-cloud/simulator-aws@latest
$ simulator-aws                      # :4566, needs Docker or Podman for workloads
$ docker run --rm -p 4566:4566 -e SIM_RUNTIME=process ghcr.io/e6qu/sockerless-simulator-aws:v3.0.1
$ docker run --rm -p 4566:4566 -v /var/run/docker.sock:/var/run/docker.sock floci/floci:latest
$ export AWS_ENDPOINT_URL=http://localhost:4566 AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test
$ aws sqs create-queue --queue-name orders
✓ the same CLI, the same SDKs, the same Terraform: only the endpoint moved
```

<!-- Floci is not containers-only: it is one native process, shipped as an image or a bare binary. Docker is needed only for container-backed services such as Lambda, ECS or EC2 instances. SIM_RUNTIME=process makes sockerless-cloud API-only: anything that runs a workload is refused. -->

---

:: code-split footer="Sources: SC [tutorial/main.tf](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/terraform-tests/tutorial/main.tf#L25-L45) · Floci [provider.tf](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests/compat-terraform/provider.tf#L17-L27)"

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

1. Both emulators answer STS, but the provider would check real AWS
2. Floci's file adds this: no instance metadata on your laptop
3. Buckets as paths: no wildcard DNS needed
4. One endpoint for every service, http://localhost:4566 by default

---

:: code dense footer="Sources: SC [gcp tutorial](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/terraform-tests/fixtures/tutorial/main.tf#L36-L51) and [azure tutorial](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/terraform-tests/tutorial/main.tf#L26-L37)"

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

## Sources of truth

---

:: table

### Five sources, each with blind spots

## No single document is the contract

| Source | What it gives you | What it misses |
| --- | --- | --- |
| API specs | Operations, shapes, protocols, errors | Behaviour, timing, limits |
| SDKs | Waiters, paginators, retries, endpoint rules | Server-side semantics |
| Terraform providers | Read-after-write, exact states, deletes | Anything Terraform never calls |
| Documentation | Quotas, defaults, state diagrams | Precision; it drifts from the API |
| The real cloud | The truth, today | Cost, accounts, and repeatability |

---

:: table footer="Sources: [aws/api-models-aws](https://github.com/aws/api-models-aws) · [Google Discovery](https://developers.google.com/discovery) · [googleapis](https://github.com/googleapis/googleapis) · [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) · measured 2026-10-26"

### The specs

## Every cloud publishes its API as data

| Cloud | Format | Size | Updated |
| --- | --- | --- | --- |
| AWS | Smithy 2.0 JSON, one model per service | 435 services, 169 MB | Daily |
| AWS (older) | botocore `service-2.json` | 468 models, 126 MB | Near daily |
| Google | Discovery documents | 316 APIs (Compute alone: 1,018 methods) | Per revision |
| Google | googleapis protobuf | 7,475 `.proto` files | Continuous |
| Azure | OpenAPI 2.0, more and more written in TypeSpec | 15,336 versioned files, 340k examples | Continuous |

---

:: content dense footer="Sources: [botocore protocol mix](https://github.com/boto/botocore/tree/develop/botocore/data) · SC [docs/specifications.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/specifications.md)"

### The specs are wrong sometimes

## Read the spec, then check it against the wire

- S3 GetObject declares only a 200, but a ranged read answers 206: SC keeps a `supplement.json` with the evidence and the upstream value it replaces
- The AWS models disagree on `message` versus `Message` in error shapes, "and each SDK reads exactly one": SC generates that table per error
- AWS speaks six wire protocols: rest-json, json, query, rest-xml, ec2 and smithy-rpc-v2-cbor
- SQS moved from XML Query to JSON 1.0, so an emulator must answer both for older SDKs

---

:: content dense footer="Sources: [botocore data](https://github.com/boto/botocore/tree/develop/botocore/data) · [LocalStack ASF](https://github.com/localstack/localstack/tree/main/localstack-core/localstack/aws) · Floci [tools/aws](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/tools/aws)"

### SDKs are generated from the specs, then add behaviour

## The client knows things the API description does not

- botocore ships 642 waiters, plus paginators, retry rules and endpoint rule sets
- LocalStack and moto build on botocore's models and parsers
- Floci generates request shapes from botocore `service-2.json` and rejects wrongly typed JSON the way AWS deserializers do
- floci-gcp takes its gRPC wire format from Google's official proto packages
- SC drives every SDK suite through the official clients: Go v2, the Google Cloud Go libraries, the Azure SDK for Go

---

:: content footer="Sources: SC [artifactregistry.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/artifactregistry.go#L34), [apim.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/apim.go#L105) · Floci [Ec2VpcCidrBlockAssociationFilterIntegrationTest](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/test/java/io/github/hectorvent/floci/services/ec2/Ec2VpcCidrBlockAssociationFilterIntegrationTest.java#L58)"

### Terraform providers are the strictest client

## The provider reads back everything it writes

- SC, Google Cloud: so "the terraform-provider-google read path round-trips without drift"
- SC, Azure: "terraform-provider-azurerm purges by default on destroy"
- Floci, EC2: "This is the exact filter terraform-provider-aws's waiter sends"
- Both projects cite the providers as evidence: about 200 mentions in SC's code, about 40 in Floci's

A plan that shows changes right after an apply is a bug in the emulator, not in your HCL.

---

:: code footer="Source: SC [specs/cloud-api/aws/SOURCES.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/specs/cloud-api/aws/SOURCES.md)"

## Even the provider's source code is a source

```text
kms.smithy.json.gz
  upstream  aws/aws-sdk-go-v2
  path      codegen/sdk-codegen/aws-models/kms.json
  pinned    af6568be69  (Apache-2.0)

elbv2-hosted-zone-ids.go.gz
  upstream  hashicorp/terraform-provider-aws
  path      internal/service/elbv2/hosted_zone_id_data_source.go
  pinned    a3082201a4  (MPL-2.0)

The ELB hosted-zone IDs per region are published nowhere as data;
the AWS provider keeps them as a Go table, so SC vendors that file.
```

---

:: content dense footer="Sources: [AWS Service Reference](https://docs.aws.amazon.com/service-authorization/latest/reference/service-reference.html) · [CloudFormation resource schemas](https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/resource-type-schemas.html)"

### Docs and published catalogs

## Behaviour lives in prose, so pin the prose too

- The AWS Service Reference: which IAM actions apply to which resources and condition keys; both projects generate from it
- Google's audit-logging pages: which methods write which audit log, compiled by SC into `audit_methods_vendored.json`
- Doc pages pinned by commit or content hash: AWS guides, Google docs, MicrosoftDocs
- Catalogs: EC2 instance types, ELB hosted zones, Cloud Armor expression sets
- Floci also generates its CloudFormation property types from the resource schemas

---

:: code footer="Source: Floci [capture_filter_patterns.py](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/tools/aws-capture/cloudwatchlogs/capture_filter_patterns.py)"

## The real cloud as an oracle

```python
"""Opt-in AWS oracle capture. Only synthetic, read-only TestMetricFilter requests."""

def cases():
    terms = ["ERROR", "ERRORS", "xERROR", "error", "[ERROR]", "ERROR_code", ...]
    for name, pattern in [
        ("substring", "ERROR"), ("case", "error"), ("and", "ERROR timeout"),
        ("negative", "ERROR -timeout"), ("optional", "?ERROR ?WARN"),
        ("wildcard", "ERR*"), ("missing-quote", '"ERROR'), ...
    ]:
        add(name, pattern, terms)   # ask real AWS, record its answer, compare
```

<!-- A read-only API with no side effects is the cheapest oracle there is. floci-az also keeps golden files, but those are snapshots of its own answers, a regression check, not recordings of Azure. -->

---

:: content dense footer="Source: SC [docs/specifications.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/specifications.md)"

### Storing and pinning

## Commit every source, pin it, never edit it

- SC: every spec gzipped in `specs/`, with one `SOURCES.md` row each: upstream, path, licence, commit or hash, date
- Corrections live beside the spec, never in it: `<doc>.supplement.json` names the value it replaces
- Nothing downloads at build or test time: a clean checkout is the whole truth
- Floci: 21 regenerated JSON files under `src/main/resources/aws`, from 23 `regen_*.py` generators, each with a test
- Both generate tables from specs and write handlers by hand: "A generated stub per operation would compile and answer, and would count as served while doing no real work"

---

> … forty-three AWS operations drifted unnoticed between 2026-08-12 and 2026-08-23 before that simulator's model drift gate existed.
> — sockerless-cloud, [gcp_coverage_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-gcp/gcp_coverage_test.go#L57-L65)

<!-- Refreshing: SC's spec-freshness workflow runs daily at 06:00 UTC and pushes re-vendored specs onto a pull request; the latest commit on main (a614ccf) is one. Floci runs IAM-data and CloudFormation-schema drift checks weekly, on Mondays. -->

---

:: section

## Testing a cloud

---

:: content dense footer="Sources: SC [.pre-commit-config.yaml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.pre-commit-config.yaml) · Floci [compatibility-tests](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/compatibility-tests)"

### The real clients are the test oracle

## Test through the SDK, the CLI and Terraform

- SC's three-client rule: a pre-commit hook rejects any new route that no SDK, CLI or Terraform test exercises in the same commit
- Every SC suite is its own Go module whose `TestMain` builds and starts the real simulator binary
- Floci's compatibility tests drive a live native build with the Java, Python, Node and Go SDKs, the AWS CLI, Terraform, OpenTofu and CDK
- floci-gcp adds gcloud, Ruby and Rust; floci-az adds the Azure CLI, .NET and C++

---

:: stats footer="Sources: cloc at each tag; Floci README test table; regex counts of test functions on 2026-10-26"

### How much test code

## The tests are bigger than the cloud

SC's test-to-production ratio grew from 0.31 in February to 0.61 at the split and 0.73 at v3.0.1. Floci's README claims 2,576 compatibility tests; a count today finds about 4,000.

- **336k** lines of Go tests in SC
- **112k** lines in SC's AWS SDK suite alone
- **805k** lines of Floci tests
- **36.5k** `@Test` methods in Floci

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

:: content dense footer="Sources: SC [sim/specvalidate.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/specvalidate.go) · Floci [RequestShapeCheck](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common)"

### Validate the answers, not only the questions

## Check every response against the spec while the tests run

- SC: `SOCKERLESS_SPEC_VALIDATE` checks every response body member by member: unknown members, wrong types
- CI arms it for every SDK and CLI suite; the allow list is empty for AWS and Google, four lines for Azure
- AWS: a test fails when a vendored model operation is neither implemented nor exempt
- Floci: `RequestShapeCheck` validates requests against botocore shapes; no response validation was found
- Without response validation, a missing field passes every test until a client reads it

---

:: content dense footer="Source: SC [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md)"

### Test the tests

## A gate that scans nothing passes forever

- SC #35 swept every simulator "for tests that proved nothing, and fix what they hid"
- After the split, "two gates once scanned the monorepo's directories, found nothing, and hid two live slice-bounds panics"
- Now every gate is shown to fail on a planted violation, and a gate whose scan set is empty exits non-zero
- Rules as tests: no `os/exec` in production code outside an allow list; every test claims its own network range; no full-store scans on request paths

---

:: content dense footer="Sources: SC [fuzz-nightly.yml](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/.github/workflows/fuzz-nightly.yml) · [ec2_imds_test.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/sdk-tests/ec2_imds_test.go)"

### Testing the hard parts

## Boot real machines, fuzz the languages, wait for real readiness

- VMs really boot in CI: a Firecracker job on KVM runners, plus containers everywhere else
- The metadata test runs inside the guest, through SSM; the images have no curl, so it uses bash's `/dev/tcp`
- Nightly fuzzing of event patterns, cron expressions, KQL and audit records
- A CloudWatch publisher's first flush raced the store's creation when the build finished just before the minute turned
- Log tails stream only what arrives after they start, so tests write a marker until the tail echoes it

---

:: content footer="Sources: SC [terraform-tests](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/terraform-tests) · Floci [IamEnforcementFilter](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/IamEnforcementFilter.java#L324-L327)"

### The tutorial is a test, and so is your CI

## Apply, check, plan for no changes, destroy

- SC's tutorial stacks run in CI as `TestTerraformTutorial`: apply, check, a plan that must be empty, then destroy
- In your own CI: start the emulator as a service container and set `AWS_ENDPOINT_URL`
- What a green emulator run cannot prove: Floci leaves IAM enforcement off by default, and its `test` key bypasses it even when on
- Neither proves performance, quotas, or the failure modes of a real region

---

:: section

## Act 1: the minimal viable cloud

---

:: content dense footer="Sources: [How Workers work](https://developers.cloudflare.com/workers/reference/how-workers-works/) · [Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)"

### Skip the VMs

## A serverless-only cloud is a fifth of the work

Keep identity and request signing, functions, events, queues, schedules, logs, metrics and audit. Drop the hypervisor fleet, VM lifecycles, instance metadata, the SDN, block storage and machine images.

- SC: the AWS serverless slice is about 59k of 280k lines (21%), with IAM and SigV4 the biggest part at 25k
- Floci: Lambda, EventBridge, Scheduler, SQS, CloudWatch and CloudTrail are 51k of 693k lines (7.4%); only Lambda needs Docker
- Existence proof: Cloudflare Workers run as V8 isolates, with bindings instead of a metadata service

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
3. Signing key: **Derive** — HMAC chain over date, region, service, starting from the secret
4. Verify: **Compare in constant time** — and reject requests more than five minutes old

<!-- SC verifies signatures always, compares with hmac.Equal, but does not check clock skew (BUG-3766) or streaming chunk signatures (BUG-3739). Floci verifies only with FLOCI_AUTH_VALIDATE_SIGNATURES=true, with a 15-minute skew window. -->

---

:: table footer="Sources: [IAM policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) · [Google IAM deny](https://docs.cloud.google.com/iam/docs/deny-overview) · [Azure RBAC](https://learn.microsoft.com/azure/role-based-access-control/overview)"

### Three identity models

## Who you are, and what you may do

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Credential | Access key + secret, SigV4 | Service-account key signs a JWT | App secret or certificate |
| Token | STS session (key, secret, token) | OAuth 2.0 access token | Entra ID JWT |
| Policy | JSON policies on identities and resources | Role bindings down the hierarchy | Role assignments at a scope |
| Deny | Explicit deny always wins | Deny policies checked first | Deny assignments, made by Azure |
| Front door | Each service's endpoint | Each API's endpoint | Resource Manager |

---

:: diagram key=1 footer="Source: [policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)"

### AWS policy evaluation

## Deny by default, explicit deny wins, then look for an allow

1. Any policy: **Explicit deny** — ends the evaluation
2. Organizations: **SCPs and RCPs** — guardrails that can only narrow
3. Resource policy: **Allow at the target** — enough within one account
4. Identity policy: **Allow for the caller** — needed across accounts
5. Boundaries: **Boundary and session policy** — intersect, never widen

<!-- SC evaluates 1, 3, 4 and the user's permissions boundary, plus iam:PassRole on every role ARN in a request; SCPs and RCPs are stored but not evaluated (BUG-3738), nor are session policies. Floci evaluates all of it, SCPs included, once you turn enforcement on. -->

---

:: code-split dense footer="Sources: SC [docs/iam.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/docs/iam.md) · Floci [IamEnforcementFilter.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/IamEnforcementFilter.java#L324-L327)"

## The `test` key: an ordinary user, or root

```java
// Floci, IamEnforcementFilter.java (enforcement is off by default)
String akid = accountResolver.extractAccessKeyId(auth);
if ("test".equals(akid)) {
    return; // root bypass  // [1]
}

// sockerless-cloud, docs/iam.md:
// "The test key belongs to an ordinary IAM user,
//  not the account root user. ...
//  No principal bypasses evaluation."  // [2]
```

1. Convenient: every LocalStack-era script keeps working
2. Strict: a deny in a policy you wrote still stops your own admin
3. Either way, say it in the docs: Floci warns not to treat accounts "as a security boundary"

---

:: table dense

### What each emulator enforces

## Authentication is easy; authorization is where they differ

| Emulator | Authentication | Authorization |
| --- | --- | --- |
| SC, AWS | SigV4 always | Every call; SCPs and session policies not yet |
| SC, Google Cloud | Every REST call needs a valid bearer | Four places, e.g. Cloud Run invoke |
| SC, Azure | Entra tokens | Data planes only; "Any valid ARM-audience token may perform any operation" |
| Floci, AWS | SigV4 opt-in | Full evaluator, opt-in; the `test` key bypasses it |
| floci-gcp | "ignores auth headers unconditionally" | GCS bucket IAM, opt-in |
| floci-az | Real RS256 tokens | "every service accepts any Bearer" |

---

:: table footer="Sources: [Lambda env vars](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html) · [ECS task roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-iam-roles.html) · [Cloud Run identity](https://docs.cloud.google.com/run/docs/securing/service-identity) · [App Service identity](https://learn.microsoft.com/azure/app-service/overview-managed-identity)"

### Workload credentials

## How code inside the cloud gets its credentials

| Where the code runs | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Lambda | Role session in env vars | Env vars, retired before expiry | Env vars, a session that never expires |
| ECS task | 169.254.170.2 endpoint | Full URI through a forwarder | A proxy container on 169.254.170.2 |
| Cloud Run, functions | Metadata server, even serverless | Metadata server behind a sidecar | `GCE_METADATA_HOST` to the main port |
| Azure Functions | `IDENTITY_ENDPOINT` + header | `/msi/token` with a per-site header | Managed identity endpoint |
| Cloudflare Workers | Bindings: capabilities on `env` | — | — |

---

:: content dense

### Tokens you mint yourself

## An emulator is also an identity provider

- SC signs Google access and ID tokens with its own RSA key and serves the JWKS; real Google access tokens are opaque, SC's are JWTs
- SC's Entra is its own tenant, `11111111-…`, with `test-client-id` and `test-client-secret`
- SC's STS session tokens seal their expiry with an HMAC key stored in the database, so they survive a restart
- Both accept federated tokens: SC verifies issuer discovery and the JWKS; Floci accepts third-party OIDC tokens as opaque unless enforcement is on
- floci-az issues real RS256 tokens, but `validate-tokens` "is reserved and currently has no effect"

---

:: stats footer="Sources: [IT Brew on re:Inforce 2025](https://www.itbrew.com/stories/2025/06/25/how-aws-iam-stays-busy-behind-the-scenes) · [Zelkova](https://aws.amazon.com/blogs/security/protect-sensitive-data-in-the-cloud-with-automated-reasoning-zelkova/) · SC [iam_condition_key_gaps.tsv](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws)"

### IAM is the biggest service you will write

## The real thing answers more than a billion questions a second

In SC, IAM, STS and SigV4 are 25k lines: more than Lambda, SQS, EventBridge and Scheduler together.

- **1.2B** authorization calls per second at AWS, 2025
- **4,310** (action, condition key) pairs in the Service Reference
- **615** of them SC does not build yet, listed in a test file
- **160 ms** for 99% of Zelkova's policy proofs

---

:: diagram key=2 footer="Sources: [Lambda execution environment](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) · [Runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html)"

### Functions

## A function is a long poll and a pool of sandboxes

1. Init: **Start the sandbox** — extensions, runtime, your static code; 10 s cap
2. Next: **The runtime asks for work** — GET /runtime/invocation/next blocks until there is an event
3. Respond: **Post the result** — /response or /error, keyed by the request ID
4. Freeze: **Keep it warm** — the next Next ends this invocation; idle sandboxes retire

---

:: code footer="Source: SC [lambda_runtime.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/lambda_runtime.go#L131-L134)"

## The Lambda Runtime API is four routes

```go
// sockerless-cloud: one listener per execution environment, inside the simulator process,
// passed to the container as AWS_LAMBDA_RUNTIME_API
mux.HandleFunc("GET /2018-06-01/runtime/invocation/next", s.handleNext)
mux.HandleFunc("POST /2018-06-01/runtime/invocation/{id}/response", s.handleResponse)
mux.HandleFunc("POST /2018-06-01/runtime/invocation/{id}/error", s.handleInvocationError)
mux.HandleFunc("POST /2018-06-01/runtime/init/error", s.handleInitError)

s.server = &http.Server{
	Handler:     mux,
	ReadTimeout: 0, // Next is a long poll
}

// Floci does the same on Vert.x: one server per container, ports 12000-12499,
// non-blocking on the event loop. Both run AWS's own public.ecr.aws/lambda base images.
```

---

:: comparison pick=0

### Warm pools and concurrency

## Throttling is a feature you must build

#### sockerless-cloud: `sim/funcrt`

- Lease an idle environment, join one starting, or start one
- Limits form a tree: reserved concurrency owns capacity; the rest share the account's 1,000
- Over the limit: `TooManyRequestsException`
- Environments retire before their role session expires

#### Floci: `WarmPool`

- Reuse containers; evict after an idle timeout
- At most max(4, CPUs) warm per function, plus an optional global cap
- Reserved and unreserved pools, 1,000 and 100 by default
- Executor: Docker, or Kubernetes pods for CI without a socket

---

:: table footer="Sources: [Firecracker spec](https://github.com/firecracker-microvm/firecracker/blob/main/SPECIFICATION.md) · [Cloud Run environments](https://docs.cloud.google.com/run/docs/about-execution-environments) · [Workers security model](https://developers.cloudflare.com/workers/reference/security-model/)"

### The isolation spectrum

## What the real clouds run your function in

| Sandbox | Used by | Start | Boundary |
| --- | --- | --- | --- |
| V8 isolate | Cloudflare Workers, Bunny | Milliseconds | The JavaScript engine |
| gVisor | Cloud Run gen1, Scaleway v2 | Fast, partial syscalls | A user-space kernel |
| Firecracker microVM | Lambda, Fargate, Koyeb | ≤ 125 ms to init | Hardware virtualization |
| Container | Both emulators, by default | Seconds | Namespaces, shared kernel |

<!-- SC can also place functions in Firecracker microVMs through its node agent (SIM_PLACEMENT). Firecracker's own spec: VMM up in 8 CPU ms, under 5 MiB of overhead. -->

---

:: table

### Three clouds, three function models

## Lambda, Cloud Run functions and Azure Functions differ in kind

| Aspect | AWS Lambda | Cloud Run functions | Azure Functions |
| --- | --- | --- | --- |
| What it is | Its own service | A Cloud Run service | An App Service site |
| Credentials | Env vars | Metadata server | Identity endpoint |
| sockerless-cloud | `funcrt` pool, real runtime images | The run.app service it creates | Functions host image, 25k lines of App Service |
| Floci | Containers or Kubernetes pods | floci-gcp: metadata only | floci-az: real host containers |

---

:: diagram key=4 footer="Sources: [EventBridge retries](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html) · [Event Grid retries](https://learn.microsoft.com/azure/event-grid/delivery-and-retry) · [Eventarc](https://docs.cloud.google.com/eventarc/docs/overview)"

### Events

## A bus is match, transform, deliver, and retry for a day

1. Publish: **PutEvents** — to a bus; up to 1 MB on Eventarc Advanced
2. Match: **Patterns over JSON** — prefix, suffix, anything-but, numeric, cidr, wildcard
3. Transform: **Input transformers** — the target receives what it expects
4. Deliver: **At least once** — EventBridge: 185 retries over 24 h, then drop, unless a DLQ catches it

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

## Write one matcher, and fuzz it

#### sockerless-cloud

- One grammar for EventBridge patterns, SNS filter policies and Lambda event filters
- Per-consumer dialects: what `anything-but` may wrap, whether nesting is allowed
- All operators, including numeric, cidr, wildcard and `$or`
- Fuzzed nightly

#### Floci

- A hand-written matcher over Jackson trees
- No `numeric`, `cidr` or `wildcard` in EventBridge
- Pipes, SNS and Lambda filters have their own matchers: three or more in total
- Each pattern is re-parsed for every event and rule

---

:: table footer="Sources: [SQS parameters](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-queue-parameters.html) · [Pub/Sub properties](https://docs.cloud.google.com/pubsub/docs/subscription-properties) · [Service Bus locks](https://learn.microsoft.com/azure/service-bus-messaging/message-transfers-locks-settlement)"

### Queues

## A queue is a lease, a receipt, and a redrive

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

1. The same waiter serves SQS, Pub/Sub pulls, Service Bus and Cloud Tasks
2. Simple and correct; a parked receive holds a worker thread

---

:: table footer="Sources: [EventBridge](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-retry-policy.html) · [Event Grid](https://learn.microsoft.com/azure/event-grid/delivery-and-retry) · [Pub/Sub](https://docs.cloud.google.com/pubsub/docs/subscription-properties) · [Service Bus DLQ](https://learn.microsoft.com/azure/service-bus-messaging/service-bus-dead-letter-queues)"

### Retries

## Every cloud retries differently, and the defaults matter

| Service | Default retry | When it gives up |
| --- | --- | --- |
| EventBridge | Exponential with jitter, 5xx and 429 only | 185 attempts or 24 h, then drop without a DLQ |
| Event Grid | 10 s, 30 s, 1 min … then every 12 h | 30 attempts or 24 h; 400 and 413 dead-letter at once |
| Pub/Sub | Backoff from 10 s to 600 s | Message retention, or a dead-letter topic |
| Service Bus | Redelivery when the lock expires | 10 deliveries, reason `MaxDeliveryCountExceeded` |
| Cloud Scheduler | Backoff with doublings | Only when both `retryCount` and `maxRetryDuration` run out |

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
| Azure VM | A provisioning state and a power state, at the same time |

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
2. Retry on NotFound: the instance you just launched may not be visible yet
3. Terraform: a state "other than the Target state or one listed in Pending" fails the apply

---

:: content dense footer="Sources: SC [ec2_instance_launch.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/ec2_instance_launch.go#L425-L438) · Floci [Ec2Service.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/ec2/Ec2Service.java#L4768-L4775)"

### An instant ACTIVE hides bugs

## Put real work behind every transition

- SC's log: "EC2 refuses to reboot a pending instance, and an instantly committed sidecar image had hidden that race"
- SC: an instance turns running only when its init writes a ready marker; Compute Engine verbs finish in the background
- SC's rule: each resource either shows its transient state for one read or settles at once, and says which
- Floci: EC2 settles on the next DescribeInstances; floci-gcp computes the status from a 50 ms clock
- Store the exact state field even when you collapse the transition: the SDK reads it

---

:: content dense

### Long-running operations

## One operation tracker per cloud, and a restart policy

- Every cloud has one shape: running, then done with a result or an error; a done signal; a bounded wait
- SC has three hand-rolled trackers (Google operations, Compute zone operations, Azure ARM) and plans to merge them
- floci-gcp has one shared service; Floci on AWS has 45 per-service executors
- Never leave an operation "in progress" across a restart: SC fails Azure ones with `OperationInterrupted` and ends Google ones as done with an error
- Wake waiters when the data changes: SC's `signals` package closes a channel on every write

---

:: comparison pick=0 dense

### Workflows

## A workflow engine is an interpreter that calls your API

#### sockerless-cloud: Step Functions

- JSONPath and JSONata; Standard and Express
- Tasks call services through `sim.Server.Call`: authentication, IAM, audit, spec validation
- `.sync` waits wake on store changes; Wait states use real time
- Running executions resume from a checkpoint after a restart
- Logic Apps: a `runAfter` engine that fails actions it cannot run

#### Floci: Step Functions

- 15k lines; the ASL executor alone is 6.4k
- Tasks call services as in-process Java methods, not HTTP requests
- Waits and retry delays capped at 30 s by default, documented
- A restart aborts running executions
- Also SWF and Lambda durable executions

---

:: content dense footer="Source: [EC2 state-change events](https://github.com/awsdocs/amazon-ec2-user-guide/blob/master/doc_source/monitoring-instance-state-changes.md)"

### State machines should emit events

## The lifecycle is part of the event contract

- AWS sends "EC2 Instance State-change Notification" to EventBridge on every transition: neither emulator does
- SC: on AWS only RDS publishes service events; on Google Cloud every audited change becomes an audit log that feeds Eventarc
- Floci publishes state changes for ECS, Step Functions, SSM, CodePipeline and more
- Floci's ECS events report the whole ladder, PROVISIONING to RUNNING, although its task model never passes through those states
- Lesson: emit from the state machine itself, or the events and the API will disagree

---

:: content dense footer="Sources: [ProgressEvent](https://github.com/aws-cloudformation/cloudformation-cli-java-plugin) · Floci [cloudformation](https://github.com/floci-io/floci/tree/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/cloudformation) · [Deployment Manager deprecation](https://docs.cloud.google.com/deployment-manager/docs/deprecations)"

### Infrastructure as code inside the cloud

## CloudFormation is a workflow engine over every service

- The provider contract: return IN_PROGRESS with a callback context until the resource is done
- Floci: CloudFormation is 50k lines with 134k lines of tests, about 194 resource types; unknown types become stubs unless strict mode is on
- Floci provisions one resource at a time after a topological sort, where AWS runs in parallel, and calls service methods directly, past the request filter where IAM is enforced
- floci-az runs ARM deployments through its normal request router, with what-if and linked templates
- SC serves no CloudFormation, ARM deployments or Infrastructure Manager: it tests with Terraform from outside
- Google's Deployment Manager reached end of support on 31 March 2026

---

:: diagram key=3 footer="Sources: SC [sim/logstore](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/logstore) · Floci [ContainerLogStreamer.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/core/common/docker/ContainerLogStreamer.java#L270-L274)"

### Logging

## From a container's stdout to a log you can query

1. Follow: **Stream the engine's logs** — demultiplex stdout and stderr, line by line
2. Drain: **Lose nothing at exit** — re-read the full log, skip lines already written
3. Store: **One row per entry** — keyed by stream and arrival order, never rewritten whole
4. Query: **Insights, filters, KQL** — retention by each entry's own timestamp

<!-- SC uses this path for all three clouds. Floci calls putLogEvents once per line, in process; it caps stored events at 20,000 per account. -->

---

:: table footer="Sources: SC simulator READMEs · Floci [cloudwatch.md](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/docs/services/cloudwatch.md) · floci-az monitor.md"

### Query languages

## Every cloud has its own log query language

| Language | Real cloud | sockerless-cloud | Floci |
| --- | --- | --- | --- |
| Logs Insights | fields, filter, stats, parse, sort | A query engine in the CloudWatch slice | fields, filter (=, !=), sort, dedup, limit |
| Filter patterns | Terms, JSON, space-delimited | Implemented | Implemented, checked against AWS |
| Cloud Logging filter | Full filter language, sinks | Routing, sinks, exclusions | A subset, sinks to GCS |
| KQL | Full language | where, extend, summarize, order by | where, project, take |

---

:: comparison pick=0

### Metrics and alarms

## An alarm is a state machine over time windows

#### sockerless-cloud

- An evaluator every 250 ms, through the real SNS publish path
- `TreatMissingData` modelled
- ALARM only when all evaluated periods breach: M-of-N is not modelled
- Google Cloud Monitoring is not served; Azure has metrics, no metric alerts

#### Floci

- An evaluator every 10 s
- Range of evaluation periods + 2, as in AWS's worked example
- Composite alarms, with cycle detection
- Metric-math alarms are stored but not evaluated

---

:: content dense footer="Source: SC [cloudtrail.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-aws/cloudtrail.go#L878-L920)"

### Audit

## Record every call at the front door, once

- SC records CloudTrail events in the one handler every AWS JSON and Query call passes through, plus a wrapper for each REST route
- It skips 5xx answers, and skips LookupEvents itself: "the read API used to walk the trail must not perturb the trail it walks"
- It refuses to invent an `eventSource` for a service it cannot map
- Google: Admin Activity always, Data Access only when the project's `auditConfigs` say so, from vendored audit docs
- Azure: a middleware writes BeginRequest and EndRequest events for every ARM write

---

:: table footer="Sources: [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/how-cloudtrail-works.html) · [Cloud Audit Logs](https://docs.cloud.google.com/logging/docs/audit) · [Activity Log](https://learn.microsoft.com/azure/azure-monitor/platform/activity-log)"

### Audit, compared

## The audit trail is where the emulators differ most

| Aspect | Real cloud | sockerless-cloud | Floci family |
| --- | --- | --- | --- |
| AWS CloudTrail | Management events, 90 days, about 5 min delay | Every call, 90 days, Lake SQL | S3 data events only; LookupEvents is a stub |
| Google Audit Logs | Admin Activity always; Data Access opt-in | Both, feeding Eventarc | floci-gcp: none |
| Azure Activity Log | ARM writes, 90 days | Every ARM write | floci-az: every write, 10,000 in memory |

---

:: code footer="Source: Floci [CloudTrailJsonHandler.java](https://github.com/floci-io/floci/blob/b280a7764a8e5cad24e3f364fc98c660735c0a85/src/main/java/io/github/hectorvent/floci/services/cloudtrail/CloudTrailJsonHandler.java#L222-L226)"

## Breadth has a cost: the stub you forget

```java
// Floci 2.3.0: CloudTrail exists, trails can be created, and the history is always empty
private Response lookupEvents(JsonNode req, String region) {
    ObjectNode resp = mapper.createObjectNode();
    resp.putArray("Events");
    return Response.ok(resp).build();
}

// A client that asks "who deleted this?" gets a valid, empty answer.
// SC's position is the opposite: an unserved method answers a declared 501.
```

---

:: table footer="Sources: [CloudWatch concepts](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html) · [PutLogEvents](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutLogEvents.html) · [Cloud Logging storage](https://docs.cloud.google.com/logging/docs/store-log-entries) · [Azure metrics](https://learn.microsoft.com/azure/azure-monitor/essentials/data-platform-metrics)"

### Numbers to copy

## Limits and retention are part of the API

| Limit | Value |
| --- | --- |
| CloudWatch metric retention | 1-minute points for 15 days, 1-hour points for 455 days |
| PutLogEvents batch | 1 MiB, 10,000 events, at most 24 h apart, none older than 14 days |
| CloudTrail event history | 90 days of management events, free, always on |
| Cloud Logging `_Required` bucket | 400 days, cannot be changed |
| Azure platform metrics | 93 days |

---

:: section

## Act 2: virtual machines

---

:: table footer="Sources: [Nitro System](https://docs.aws.amazon.com/whitepapers/latest/security-design-of-aws-nitro-system/the-components-of-the-nitro-system.html) · [Google KVM hardening](https://cloud.google.com/blog/products/gcp/7-ways-we-harden-our-kvm-hypervisor-at-google-cloud-security-in-plaintext) · [Azure hypervisor](https://learn.microsoft.com/azure/security/fundamentals/hypervisor)"

### The real thing

## Three clouds, three hypervisors, all with custom hardware

| Aspect | AWS EC2 | Compute Engine | Azure VMs |
| --- | --- | --- | --- |
| Hypervisor | Minimal KVM-based Nitro Hypervisor | Hardened KVM, Google's own VMM, no QEMU | Hyper-V based Azure Hypervisor |
| Offload | Nitro Cards: storage, network, control | Andromeda SDN on the host | Azure Boost: FPGA storage, MANA NIC |
| Control plane | Per-service APIs | Per-API endpoints | Fabric Controller per cluster |

---

:: comparison pick=0 dense

### A VM in an emulator

## A container that boots like a machine, or a real microVM

#### sockerless-cloud

- A digest-pinned OCI image with a seeded init that runs cloud-init, then the startup script, then writes a ready marker
- Stop keeps the disk; a guest that powers itself off ends like a real one
- Or a Firecracker microVM, through a node agent the operator chose to deploy
- No host privilege: no capabilities, devices or engine socket for workloads

#### Floci

- One Docker container per instance, `tail -f /dev/null` unless the AMI wants systemd
- Stop is `docker stop`, reboot is `docker restart`
- Instance types map to `--cpus` and `--memory`
- Privileged by default, to add the metadata address to loopback

---

:: content dense footer="Source: SC [WHAT_WE_DID.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/WHAT_WE_DID.md) · [sim/nodeagent](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/nodeagent)"

### MicroVMs in practice

## What booting Firecracker guests taught the node agent

- The node agent is a container with `/dev/kvm` and `/dev/net/tun`, its own network namespace, and no engine socket
- A guest's root disk is an ext4 image built from the same OCI image a container would run
- Firecracker's API server answers 503 past a handful of connections, so the client closes after each request
- The guest's API socket path is a digest of its ID, to stay under the 107-byte limit for Unix sockets
- The guest's init used to power off, which halts the CPU but leaves the VM running: every exit waited for a 15-second kill. A reboot, which `reboot=k` turns into a reset, exits at once

---

:: code dense footer="Source: SC [simulator-azure/compute.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/simulator-azure/compute.go#L1428-L1437)"

## Azure VMs: power verbs as a table

```go
// Each action names the power state the machine passes through and the
// one it settles in; a boot follows the halt only for start and restart.
for _, action := range []struct {
	name, transition, settled string
	halt, boot                bool
}{
	{name: "start", transition: "PowerState/starting",
		settled: "PowerState/running", boot: true},
	{name: "powerOff", transition: "PowerState/stopping",
		settled: "PowerState/stopped", halt: true},
	{name: "deallocate", transition: "PowerState/deallocating",
		settled: "PowerState/deallocated", halt: true},
	{name: "restart", transition: "PowerState/stopping",
		settled: "PowerState/running", halt: true, boot: true},
} { ... }

// On real Azure, "stopped" still bills for compute; only "deallocated" stops it.
```

---

:: table footer="Sources: [EC2 IMDSv2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-metadata-v2-how-it-works.html) · [Google metadata](https://docs.cloud.google.com/compute/docs/metadata/querying-metadata) · [Azure IMDS](https://learn.microsoft.com/azure/virtual-machines/instance-metadata-service) · [comparison](https://ahmet.im/blog/comparison-of-instance-metadata-services/)"

### Instance metadata

## The magic IP, three ways

| Aspect | AWS | Google Cloud | Azure |
| --- | --- | --- | --- |
| Address | 169.254.169.254 | metadata.google.internal | 169.254.169.254 (+ WireServer 168.63.129.16) |
| Anti-SSRF | PUT for a token; hop limit 1 | Header `Metadata-Flavor: Google` | Header `Metadata: true`, no `X-Forwarded-For` |
| Credentials | `iam/security-credentials/<role>` | `service-accounts/default/token` | `identity/oauth2/token` |
| Serverless | Not on Lambda | Yes, on Cloud Run too | `IDENTITY_ENDPOINT` instead |

---

:: comparison pick=0

### Answering at the magic IP

## Routing 169.254.169.254 needs privilege; SC refuses to take it

#### sockerless-cloud

- The link-local address does not answer (BUG-3485)
- Each workload gets the SDK variables instead: `AWS_EC2_METADATA_SERVICE_ENDPOINT`, `GCE_METADATA_HOST`, `IDENTITY_ENDPOINT`
- A sidecar per network proxies to the simulator, with a token it mints
- The caller is the TCP peer the sidecar saw: no workload can claim another's address

#### Floci

- A privileged container adds 169.254.169.254 to its loopback
- A `socat` relay forwards it to Floci's metadata server on port 9169
- The caller is the container's source IP
- IMDSv2 tokens are UUIDs bound to the instance

---

:: content dense footer="Sources: SC [sim/vminstance](https://github.com/e6qu/sockerless-cloud/tree/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/vminstance) · [cloud-init datasources](https://docs.cloud-init.io/en/latest/reference/datasources/)"

### cloud-init everywhere

## User data is a contract with the guest, not the API

- SC reimplements cloud-init's stages in 376 lines of POSIX shell: users, SSH keys, `write_files`, packages, `bootcmd`, scripts, per-instance semaphores
- It knows each distro's default user per cloud: Amazon Linux 2023, Ubuntu 24.04, Debian 12
- Floci copies decoded user data to a script, runs it after injecting the SSH key, and logs its output to CloudWatch Logs
- Every European provider surveyed exposes user data for cloud-init, each at its own metadata path

---

:: comparison pick=0

### Networks and security groups

## A VPC is an engine network; a security group is nftables

#### sockerless-cloud

- One engine network per VPC, over the resource's own CIDR
- The resolver and metadata sidecar sit at the address the cloud reserves
- Security groups enforced at the microVM's tap and on flows SC mediates
- Gap: container-to-container traffic on one network is not filtered (BUG-3481)

#### Floci

- One Docker bridge per VPC; overlapping CIDRs are substituted, with a warning
- "A Docker network is an isolation domain … That is exactly a VPC."
- Opt-in enforcement: a helper container runs nftables, default deny
- No routing, NACLs, NAT or peering enforcement

---

:: section

## Act 3: scaling the emulator

---

:: comparison pick=0

### One process per cloud

## Fat binaries, on purpose

#### sockerless-cloud

- One binary per cloud; every service on one port, the way SDKs reach a cloud through one endpoint override
- Slices are one Go package and share stores directly
- No way to start a subset; `SIM_RUNTIME=process` turns off workloads
- Already outside the process: workloads, sidecars, node agents, managed databases

#### Floci

- One Quarkus process serves every AWS service on 4566
- `FLOCI_SERVICES_<SVC>_ENABLED=false` blocks a service with a request filter; the code still ships
- Most services start lazily, so idle ones cost little
- Several processes can share one Docker daemon, never one state directory

---

:: comparison pick=0

### Storage

## SQLite, or JSON files and a write-ahead log

#### sockerless-cloud: SQLite

- In memory by default; `SIM_PERSIST=true` writes one database file
- One table per store: `key TEXT PRIMARY KEY, value BLOB` holding the resource's JSON
- WAL mode, `synchronous=NORMAL`, a 5 s busy timeout
- Object bytes live in files, written before the row
- Workload containers are adopted again after a restart

#### Floci: four modes

- `memory`, the shipped default
- `persistent`: every put rewrites the whole store as JSON, through a temp file
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
3. Waiters and caches watch the generation, not a timer

---

:: stats footer="Source: SC [sim/db.go](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/sim/db.go#L20-L66) comments"

### Durability versus fidelity

## A slow emulator is a wrong emulator

"A simulator that answers 100-1000x slower than the cloud it simulates breaks fidelity for any client whose behavior is timing sensitive."

- **500–1,100 ms** DynamoDB PutItem with `synchronous=FULL`, where AWS takes single-digit ms
- **368 MB** a WAL beside a 2.4 GB database
- **4 KiB** what the suspected S3 store held; retention sweeps had filled the WAL

---

:: content dense footer="Sources: [static stability](https://aws.amazon.com/builders-library/static-stability-using-availability-zones/) · [cell-based architecture](https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html) · SC [PLAN.md](https://github.com/e6qu/sockerless-cloud/blob/a614ccfa97d463dd823eed9e67b2a81f6c345e43/PLAN.md)"

### How the real clouds scale, and the way out

## Split the data plane first, the control plane later

- The real clouds separate control plane from data plane, run in cells, and keep running when the control plane fails
- AWS keeps metadata in DynamoDB (89.2 M requests/s at peak); Google in Spanner; Azure behind Resource Manager and Service Fabric
- SC's plan, milestone M5: node agents on other hosts, reached over their API, with engine networks that span hosts
- To split SC's control plane: shared package-level stores, in-process change signals and long polls, in-memory metadata tokens, and a single SQLite writer must all go
- Floci: every service's state lives in its process's maps; there is no clustering

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

:: content dense footer="Sources: [Hetzner tokens](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token) · [OTC metadata](https://docs.otc.t-systems.com/elastic-cloud-server/umn/) · [Scaleway messaging](https://www.scaleway.com/en/docs/messaging/faq) · [The Register on SBG2](https://www.theregister.com/2022/03/22/ovhcloud_fire_datacenter/)"

### What Europe teaches a cloud builder

## The minimal viable cloud already exists, and sells

- Hetzner's whole authorization model is a project token that is either "Read" or "Read & Write"
- Open Telekom Cloud is the only one surveyed that hands VMs temporary keys from metadata, at `/openstack/latest/securitykey`
- Scaleway reimplemented the SQS and SNS wire protocols in-house, and serves user data only to source ports below 1024
- Nobody surveyed offers an EventBridge-style rule bus; queues are managed open-source brokers
- OVHcloud's 2021 Strasbourg fire: a region is not an availability zone

---

### The pushback

## "Don't emulate the cloud": take it seriously

- "we consider local development like this an anti-pattern" — thdxr, [2021](https://news.ycombinator.com/item?id=28822696)
- "The real issue with LocalStack was always drift." — robshippr, [2026](https://news.ycombinator.com/item?id=47593285)
- "Funny fact, DynamoDB local fails about 100 of my conformance tests…" — [2026](https://news.ycombinator.com/item?id=49870948)
- The other side: CI needs environments that are fast, deterministic and isolated, without per-merge cost or account limits — [CSDude](https://news.ycombinator.com/item?id=47475473)

Emulate for the fast loop; keep a short-lived real environment for the last mile.

<!-- The first two are search-snippet quotes: confirm the wording on HN before presenting. The DynamoDB Local one is the verbatim opening of the comment. -->

---

:: content dense

### Rules for coding your own cloud

## What both projects learned the hard way

1. Let the real SDKs, CLIs and Terraform providers be your tests
2. Vendor the specs, pin them, never edit them, and refresh them daily
3. Authenticate, authorize, act and audit in one place, for every caller, services included
4. Store the cloud's exact states, and put real work behind every transition
5. Wake on writes, not timers; never leave an operation running across a restart
6. An unserved method says so: a declared 501 beats an empty 200
7. Start serverless; add VMs when you can do them without lying

---

:: closing mario

### Questions welcome

## Thanks, this was Adrian Mârza

[https://e6qu.github.io/](https://e6qu.github.io/)

[adi11235@gmail.com](mailto:adi11235@gmail.com)
