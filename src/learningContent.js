export const learningGuides = [
  {
    "slug": "devops-delivery",
    "title": "Build a DevOps process your team can actually use",
    "category": "DevOps",
    "intro": "A deployment should not depend on the one engineer who remembers which command to run. Start by making one application's release repeatable, then automate it.",
    "image": "photo-1522071820081-009f0129c71c",
    "alt": "Developers working together around laptops",
    "sections": [
      [
        "Find where a change waits",
        "Follow one recent change from commit to production. Record review time, test time, approval queues and manual deployment steps. If a five-minute build waits two days for an environment, a faster build is not the first problem to solve."
      ],
      [
        "Build once and promote the same artefact",
        "Keep application code, deployment scripts and infrastructure definitions in version control. Have CI build and test a versioned package or container. Promote that exact artefact through environments; keep environment configuration separate and obtain secrets at runtime. Use workload identity or short-lived credentials where supported."
      ],
      [
        "Give the pipeline a clear path",
        "For one application, start with pull request review → automated checks → package → test environment → validation evidence → production approval where required → controlled rollout → health checks. Assign an owner to each failure. Keep a tested recovery path; reverting code will not necessarily reverse a database change."
      ],
      [
        "Worked example",
        "A three-person team currently uploads files to a server. First, document the upload and restart procedure. Then implement it in a reviewed workflow with a versioned package, a smoke test and a deployment log. Only add more tooling when the team can explain the failure it prevents."
      ],
      [
        "Tools and a task for this week",
        "Use GitHub Actions, GitLab CI or Jenkins for orchestration; Terraform for repeatable infrastructure where appropriate; and an artefact registry for packages. Choose tools the team can maintain. Map your last release, remove one manual step and rehearse recovery in a test environment. Track lead time, deployment failures and recovery time, rather than the number of pipeline jobs."
      ]
    ],
    "quote": "Use the same packages for every environment.",
    "source": "DORA — Deployment automation",
    "url": "https://dora.dev/capabilities/deployment-automation/",
    "takeaway": "A release map, a versioned artefact and a repeatable deployment for one application."
  },
  {
    "slug": "choosing-cloud-vendors",
    "title": "Choose between AWS, Azure and Google Cloud",
    "category": "Cloud computing",
    "intro": "Do not begin with a provider's service catalogue. Begin with the application, the people who will operate it and the constraints the business must meet.",
    "image": "photo-1558494949-ef010cbdcc31",
    "alt": "Server racks and network cabling",
    "sections": [
      [
        "Write down the non-negotiables",
        "List user locations, data-location requirements, availability targets, existing licences, connectivity and support needs. Check service availability in the intended region. A provider having a nearby region does not mean every service or backup feature is available there."
      ],
      [
        "Compare equivalent operating models",
        "For virtual machines, compare EC2, Azure Virtual Machines and Compute Engine. For managed Kubernetes, compare EKS, AKS and GKE. For function-based workloads, consider AWS Lambda, Azure Functions and Google Cloud's Cloud Run functions. These are evaluation starting points, not feature-for-feature equivalents. Check current limits, runtime support and pricing in the official documentation."
      ],
      [
        "Include the costs outside compute",
        "Estimate databases, storage, outbound transfer, backups, NAT or gateways, logging, support and engineering time. Price the same workload assumptions on each provider. Include the cost of running two environments during migration and the work needed to exit the platform."
      ],
      [
        "Run a small comparison",
        "Deploy the same representative transaction on your strongest two candidates. Measure response time, failure recovery, monthly cost and how confidently the team operates it. Existing Microsoft identity and licences may make Azure worth testing; existing AWS operations may favour AWS; a data workload may justify evaluating Google Cloud. None of those facts settles the decision alone."
      ],
      [
        "Make the choice reviewable",
        "Create a one-page decision record: requirements, options, evidence, estimated cost, trade-offs and owner. Use a weighted scorecard agreed before demonstrations. Do not adopt multiple clouds merely to avoid choosing: duplicate identity, networking and support can cost more than the proposed benefit."
      ]
    ],
    "quote": "a constructive conversation about architectural decisions",
    "source": "AWS Well-Architected Framework",
    "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
    "extra": [
      [
        "Microsoft Azure Well-Architected Framework",
        "https://learn.microsoft.com/en-us/azure/well-architected/"
      ],
      [
        "Google Cloud Well-Architected Framework",
        "https://cloud.google.com/architecture/framework"
      ]
    ],
    "takeaway": "A provider decision record supported by a representative workload test and cost estimate."
  },
  {
    "slug": "modernise-an-application",
    "title": "Modernise an application without a full rewrite",
    "category": "Application modernisation",
    "intro": "A slow or difficult application does not automatically need microservices. Establish the business problem, then change the smallest part that can deliver a useful improvement.",
    "image": "photo-1498050108023-c5249f4df085",
    "alt": "Application code on a developer's laptop",
    "sections": [
      [
        "Choose a business transaction",
        "Pick one outcome: submitting a customer application, checking an order or reconciling a payment. Record its current response time, failures, manual steps and support burden. Interview the people who use it. Agree the improvement before selecting an architecture."
      ],
      [
        "Inspect the dependencies",
        "Map the code, scheduled jobs, databases, file transfers, integrations and identity checks used by that transaction. Add an owner for each. Use application traces, repository searches and staff interviews together: an architecture diagram alone may miss a nightly export that a finance team depends on."
      ],
      [
        "Choose the least disruptive option",
        "Refactor when the structure can be improved in place. Replatform when the runtime or hosting is the main constraint. Replace or extract a capability when an independently owned boundary is justified. A modular monolith can be a sensible destination for a small team; microservices add network failures, deployment coordination and operational costs."
      ],
      [
        "Worked example",
        "An order-status page is slow because every request scans the billing database. First measure and optimise the query. If independent release and scale are still needed, create a read model or separate status service and route just that capability through a proxy. Define how updates arrive, how stale data may be and how the route can be switched back."
      ],
      [
        "Prove the change and retire the old path",
        "Run compatibility, integration and recovery tests. Compare the same transaction before and after. Keep one authoritative owner for each data item and avoid uncontrolled dual writes. Remove the old route only after consumers, support teams and retention obligations are understood. Keep the migration plan small enough to review and fund."
      ]
    ],
    "quote": "Incrementally migrate a legacy system",
    "source": "Microsoft — Strangler Fig pattern",
    "url": "https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig",
    "takeaway": "A dependency map and an incremental plan for one measurable business improvement."
  },
  {
    "slug": "productive-tech-meetings",
    "title": "Run a tech meeting that ends with decisions",
    "category": "Team leadership",
    "intro": "A useful technical meeting resolves a question, removes a blocker or agrees a next step. A round of updates can happen in writing; meeting time should be used for work that needs people together.",
    "image": "photo-1516321318423-f06f85e504b3",
    "alt": "Colleagues reviewing a laptop together",
    "sections": [
      [
        "State the decision before sending the invitation",
        "Replace 'project catch-up' with a question such as 'Can we approve the release with the current payment-test results?' Send the evidence, options and proposed decision in advance. Invite the decision owner, people doing the work and anyone who owns an affected dependency."
      ],
      [
        "Use a 30-minute working agenda",
        "Spend five minutes confirming the outcome and reviewing outstanding actions, ten minutes examining evidence, ten minutes deciding and five minutes reading back commitments. This is a starting agenda: an incident or design review may need a different format. Put unrelated issues in a follow-up list with an owner."
      ],
      [
        "Make disagreement safe and specific",
        "Ask 'What could make this fail?' and invite input from people who have not spoken. Challenge the proposal with evidence rather than judging the person. When someone reports a delay, ask what changed and what help is required. A positive meeting still holds people accountable for commitments."
      ],
      [
        "Worked example",
        "The team is split on releasing a new payment integration. The test lead shows a duplicated-payment failure. The meeting records a no-go decision, assigns a developer to implement idempotency and names a reviewer for the retest. The next checkpoint is tied to passing evidence, not another general discussion."
      ],
      [
        "Close with a usable action record",
        "Record the decision, reason, accountable owner, due date and evidence of completion. 'Investigate the API' is vague; 'Reproduce the timeout in staging, attach logs and recommend a fix by Thursday' is actionable. At the next meeting, review unresolved commitments first. Measure completed actions and blockers resolved, not attendance."
      ]
    ],
    "quote": "Ensure your team meetings have a clear agenda and designated leader.",
    "source": "Google re:Work — Understand team effectiveness",
    "url": "https://rework.withgoogle.com/intl/en/guides/understand-team-effectiveness",
    "takeaway": "A decision log and an action list with owners, dates and evidence of completion."
  },
  {
    "slug": "pre-deployment-validation",
    "title": "Check release readiness before production",
    "category": "Pre-deployment validation",
    "intro": "A green pipeline proves that configured jobs passed. It does not establish that the configuration, integrations, recovery plan and operational support are ready for this particular release.",
    "image": "photo-1519389950473-47ba0277781c",
    "alt": "Team reviewing work across multiple computers",
    "sections": [
      [
        "Define what must be true",
        "Agree acceptance criteria before the release. Identify the affected customer transaction, changed dependencies, data migrations and operational risks. Assign a reviewer for each required check and define which findings block release. Evidence should identify the artefact version, target environment and time of the test."
      ],
      [
        "Validate beyond the build",
        "Check environment variables, secrets references, certificates, permissions, network paths and dependency versions. Test the integrations a customer transaction actually uses. Review security findings and expected load. Use masked or synthetic test data; do not copy live customer information into an uncontrolled environment."
      ],
      [
        "Rehearse failure and recovery",
        "Exercise the rollback or roll-forward procedure in a suitable environment. A database migration can make the previous application version incompatible. Prefer backward-compatible changes where practical, verify backup recovery where needed and state the point beyond which rollback is unsafe."
      ],
      [
        "Worked example",
        "A booking release passes unit tests, but staging is using a payment sandbox and production requires a different callback URL. A readiness check compares the planned production configuration and detects the missing callback registration. The release is held until the authorised provider setup is completed and evidence is reviewed."
      ],
      [
        "Record the decision and observe the rollout",
        "Keep a release record with results, open findings, accepted risks, approving owner and recovery instructions. Start with limited exposure when the architecture supports it. Define stop conditions, monitoring and an observation period suited to the workload. CI/CD automates delivery; pre-deployment validation supplies evidence for a release decision. Neither guarantees that production will be incident-free."
      ]
    ],
    "quote": "All changes to the production workload are inherently risky",
    "source": "Microsoft — Safe deployment practices",
    "url": "https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments",
    "takeaway": "A release-readiness record linking each acceptance criterion to evidence and an accountable reviewer."
  },
  {
    "slug": "incident-response",
    "title": "Handle a production incident without losing control",
    "category": "Service operations",
    "intro": "During an outage, the first job is to protect customers and restore a usable service. Finding every contributing cause can continue after the immediate impact is contained.",
    "image": "photo-1551288049-bebda4e38f71",
    "alt": "Operational metrics displayed on a monitor",
    "sections": [
      [
        "Establish impact and ownership",
        "Confirm which customer transaction is failing, when it started and how widely it is affected. Declare severity using agreed business-impact criteria. Name an incident lead, a technical response owner and a communications owner; on a small team one person may hold more than one role, but responsibility must remain explicit."
      ],
      [
        "Stabilise before chasing every theory",
        "Review recent changes and available evidence. Consider a controlled rollback, traffic shift or temporary feature disablement when it is safe and authorised. Preserve logs and timestamps. Avoid several engineers changing different things at once without a shared record of actions."
      ],
      [
        "Make alerts useful",
        "Page for actionable customer impact or a credible imminent failure. Attach the affected service, owner, dashboard and runbook. Group related notifications and suppress downstream noise when the monitoring system supports it. Review noisy alerts after the incident rather than permanently muting a real failure."
      ],
      [
        "Worked example",
        "Checkout errors rise after a connection-pool configuration change. The responder compares deployment time with error and database-connection metrics, restores the previous safe configuration and checks successful checkout transactions. CPU returning to normal is not sufficient evidence that customers can pay."
      ],
      [
        "Recover, communicate and follow through",
        "Confirm recovery using the affected transaction and a suitable monitoring period. Record customer impact, mitigation and any data-reconciliation work still required. Produce a blameless timeline with contributing conditions and corrective actions. Give each action an owner, date and verification step. Rehearse the updated runbook so the next responder can use it."
      ]
    ],
    "quote": "Stopping the bleeding should be your first priority",
    "source": "Google SRE — Effective Troubleshooting",
    "url": "https://sre.google/sre-book/effective-troubleshooting/",
    "takeaway": "An incident timeline, a verified recovery record and corrective actions that can be tested."
  }
];
