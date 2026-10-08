// Concrete scope and reviewable outputs, rather than unverified client results.
export const serviceContent = {
  'web-development': {
    deliveryIntro: 'We define the pages, user journeys and integrations, then build and test the site across desktop and mobile. You receive the source code, publishing instructions and an agreed handover.',
    deliverables: ['Page designs and reusable components', 'Tested forms and integrations', 'Accessibility and performance findings', 'Source code and publishing guide'],
  },
  'application-modernization': {
    summary: 'Upgrade legacy applications in manageable stages, preserving the workflows your business depends on.',
    body: 'We map application dependencies, inspect code and database constraints, and compare refactoring, replatforming and replacement. Where independent releases justify microservices, we extract one business capability behind a versioned API while the existing system continues to operate. Contract tests, data migration checks and rollback criteria control the transition.',
    deliveryIntro: 'We agree which capability to modernize first, document its API and data ownership, and validate the new implementation against existing business workflows. Each stage has acceptance criteria and a rollback route.',
    blueLinkHelp: ['Map code, database and integration dependencies.', 'Select the modernization approach and document its cost and risk trade-offs.', 'Extract or refactor a capability with clear API contracts and data ownership.', 'Test compatibility, performance and data reconciliation.', 'Release incrementally with monitoring, rollback and team handover.'],
    deliverables: ['Dependency map and target architecture', 'Phased migration backlog and cost assumptions', 'API contracts and migration test evidence', 'Deployment, rollback and support runbooks'],
  },
  'cloud-infrastructure': {
    summary: 'Design and build AWS, Azure or hybrid infrastructure with defined security, cost and recovery requirements.',
    body: 'We translate workload needs into compute, storage, network and identity designs. Availability targets, recovery objectives and data location requirements guide the architecture. Infrastructure is version-controlled; backup restoration, failover and access controls are checked before operational handover. Cost estimates include usage assumptions so your team can compare options.',
    deliveryIntro: 'We assess the workload, design the target environment and implement it through infrastructure as code. Your team reviews the architecture, cost assumptions and recovery test results before accepting the environment.',
    blueLinkHelp: ['Agree workload capacity, availability and recovery objectives.', 'Design network boundaries, identity controls and environment separation.', 'Provision infrastructure using reviewed Terraform or cloud-native templates.', 'Validate backups, recovery and monitoring.', 'Document costs, operating procedures and accountable owners.'],
    subServices: [{title:'Cloud foundation',desc:'Network, identity, compute, storage and environment configuration.'},{title:'Migration and recovery',desc:'Migration stages, backup restoration tests, failover procedures and operational handover.'}],
    deliverables: ['Architecture diagram and infrastructure code', 'Access and network control configuration', 'Cost model with usage assumptions', 'Migration and recovery test records'],
  },
  'data-integration': {
    summary: 'Connect applications and make business data dependable across systems and workflows.',
    body: 'We define source systems, data owners and interface contracts before building integrations. APIs support immediate requests; events or scheduled pipelines handle asynchronous movement. Schema validation, retry limits, duplicate handling and reconciliation checks help identify missing or inconsistent records. Monitoring shows failed handoffs and processing delays.',
    deliveryIntro: 'We trace one business workflow from its source data to its final output, implement the interfaces and check the resulting records against agreed reconciliation rules.',
    blueLinkHelp: ['Map source systems, data owners and workflow dependencies.', 'Choose API, event or batch integration patterns.', 'Implement authentication, schema checks and controlled retries.', 'Validate completeness, duplicates and reconciliation totals.', 'Add monitoring and a runbook for failed records.'],
    deliverables: ['Data flow diagram and interface contracts', 'Integration code and transformation rules', 'Reconciliation and failure-handling tests', 'Monitoring and support procedures'],
  },
  'predeployment-validation': {
    title: 'Pre-Deployment Validation',
    summary: 'Use LytHouse to review release readiness before deploying to production.',
    body: 'LytHouse is BlueLink Consults’ release-validation product. A useful release decision needs more than a successful build: the target configuration, dependencies, critical workflows and rollback approach must meet agreed acceptance criteria. We scope the checks with your team and review how LytHouse fits your pipeline, environments and approval process during a demonstration.',
    deliveryIntro: 'We identify your critical release checks, confirm the supported integrations and configure the agreed validation scope. Your team reviews results and outstanding exceptions before an authorized release decision.',
    blueLinkHelp: ['Define acceptance criteria for configuration, dependencies and critical workflows.', 'Confirm pipeline compatibility and access requirements.', 'Configure checks and review the evidence with your engineering team.', 'Document failed checks, exceptions and the release approval process.'],
    tools: ['LytHouse release validation', 'Smoke and regression tests', 'Configuration and environment comparison', 'GitHub Actions, Azure DevOps or GitLab integration review', 'Release acceptance and rollback criteria'],
    outcomes: ['Documented release readiness checks', 'Visible failures and outstanding exceptions', 'Repeatable validation evidence', 'Traceable approval decisions'],
    deliverables: ['Validation scope and acceptance criteria', 'Configured checks and integration instructions', 'Release results and exception record', 'Approval and rollback checklist'],
    plans: [
      { name: 'Starter', price: 'Contact us', tagline: 'Discuss a focused validation scope for one delivery workflow.', features: ['Agreed core release checks', 'Pipeline compatibility assessment', 'Configuration review', 'Onboarding scope agreed'] },
      { name: 'Team', price: 'Contact us', tagline: 'Discuss validation across your delivery team and environments.', features: ['Multi-environment validation scope', 'Release approval workflow review', 'Rollback criteria review', 'Support requirements agreed'] },
      { name: 'Enterprise', price: 'Contact us', tagline: 'Define validation and governance for a complex release process.', features: ['Organization-specific validation scope', 'Integration and access assessment', 'Onboarding and governance review', 'Support terms agreed in contract'] },
    ],
  },
  'devops-automation': {
    title: 'DevOps & CI/CD',
    summary: 'Automate builds, tests and deployments with secure, traceable delivery pipelines.',
    deliveryIntro: 'We map the path from commit to production, automate repeatable work and make approvals explicit. The pipeline produces versioned artifacts, test results and deployment records that your team can inspect.',
    tools: ['GitHub Actions, Azure DevOps or GitLab CI/CD', 'Terraform and infrastructure as code', 'Artifact registries and dependency scanning', 'Secrets management and deployment approvals'],
    blueLinkHelp: ['Agree repository access, branching and review rules.', 'Automate builds, tests and security checks.', 'Promote the same versioned artifact through environments.', 'Configure scoped credentials, approvals and rollback steps.', 'Document pipeline ownership and train the delivery team.'],
    deliverables: ['Version-controlled pipeline configuration', 'Repository and approval rules', 'Build, test and deployment evidence', 'Rollback runbook and team handover'],
  },
  'technology-audit-assessment': {
    deliveryIntro: 'We agree the systems and evidence to review, validate findings with your team and distinguish urgent risks from longer-term improvements. Recommendations include priorities, owners and cost assumptions.',
    deliverables: ['Application and infrastructure inventory', 'Evidence-based findings and risk register', 'Prioritized improvement roadmap', 'Scope and cost assumptions for the next phase'],
  },
  'operational-incident-support': {
    deliveryIntro: 'We identify critical service signals, tune alerts to actionable failures and document escalation paths. Incident reviews track contributing causes and corrective actions, rather than stopping at service restoration.',
    deliverables: ['Monitoring dashboards and alert rules', 'Escalation and response runbooks', 'Incident timeline and contributing causes', 'Corrective-action backlog with owners'],
  },
};
