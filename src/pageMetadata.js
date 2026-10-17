export const pageMetadata = {
 '/': ['Technology consulting for dependable operations','Technology assessment, application modernization, cloud infrastructure, DevOps, release validation and operational support for Nigerian institutions and enterprise teams.'],
 '/services':['Our six technology services','Explore technology assessment, application modernization, cloud infrastructure, DevOps, pre-deployment validation and operational support.'],
 '/solutions':['Technology solutions','Practical solutions for connected systems, reliable infrastructure and controlled delivery.'],
 '/solutions/who-we-help':['Institutions and industries we support','Technology engineering for banks, microfinance institutions, fintechs, hospitals, public institutions and enterprise teams.'],
 '/solutions/eat-framework':['Engage. Assess. Transform.','See how BlueLink connects agreed priorities, technical evidence and controlled implementation through the EAT delivery framework.'],
 '/solutions/data-localisation':['Data localisation and migration readiness','Review payment-data location, application dependencies, target infrastructure, cutover planning and migration validation.'],
 '/resources/delivery-examples':['Sample assessment and delivery documents','Inspect illustrative technology assessment, migration planning and release validation documents from BlueLink Consults.'],
 '/blog':['BlueLink Blog','Practical articles on cloud infrastructure, data governance and dependable technology delivery.'],
 '/blog/cbn-data-localisation-migration':['CBN’s payment data localisation policy: planning a reliable migration','A practical briefing on the January 2027 payment-data requirement, migration assessment, cutover validation and operating handover.'],
 '/insights':['Technology insights','Guidance for application modernization, cloud readiness, data governance and reliable delivery.'],
 '/insights/cbn-data-localisation-migration':['CBN’s payment data localisation policy: planning a reliable migration','A practical briefing on payment-data localisation, migration assessment and reliable cutover.'],
 '/events':['Events & activities','Follow BlueLink’s technology discussions, industry perspectives and team updates.'],
 '/about':['Our story','Learn about BlueLink Consults and the approach behind our technology assessment and engineering services.'],
 '/about/our-story':['Our story','Learn about BlueLink Consults and the approach behind our technology assessment and engineering services.'],
 '/about/our-team':['Our team','Meet the leadership, engineering and client engagement team at BlueLink Consults.'],
 '/about/why-bluelink':['Why BlueLink Consults','Agreed scope, connected architecture, evidence before release and a documented operational handover.'],
 '/contact':['Contact BlueLink Consults','Discuss your application, infrastructure, cloud, DevOps or reliability requirements with our team.'],
 '/request-demo':['Book a consultation or product demo','Choose a meeting time or share your requirements with BlueLink Consults.'],
 '/faqs':['Frequently asked questions','Services, engagement scope, scheduling and working with BlueLink Consults.'],
 '/privacy-policy':['Privacy policy','How BlueLink Consults handles inquiries, account information, hosting and third-party services.'],
 '/terms':['Terms of service','Terms for using the BlueLink Consults website.'],
};
for(const [slug,title] of Object.entries({'technology-audit-assessment':'Technology Audit & Assessment','application-modernization':'Application Modernization','cloud-infrastructure':'Cloud Infrastructure','devops-automation':'DevOps & Automation','predeployment-validation':'Pre-Deployment Validation','operational-incident-support':'Operational & Incident Support'})) pageMetadata[`/services/${slug}`]=[title,`${title} services from BlueLink Consults. Review the scope, expected deliverables and approach for your institution.`];
export const profileLinks=['https://www.facebook.com/share/19XEu6zf1n/?mibextid=wwXIfr','https://www.instagram.com/bluelinkconsults','https://www.linkedin.com/company/bluelinkconsults/'];

pageMetadata['/learning']=['Learning','Practical guides to DevOps, cloud selection, application modernisation, meetings, release validation and incident response.'];
pageMetadata['/learning/devops-delivery']=["Build a DevOps process your team can actually use","A deployment should not depend on the one engineer who remembers which command to run. Start by making one application's release repeatable, then automate it."];
pageMetadata['/learning/choosing-cloud-vendors']=["Choose between AWS, Azure and Google Cloud","Do not begin with a provider's service catalogue. Begin with the application, the people who will operate it and the constraints the business must meet."];
pageMetadata['/learning/modernise-an-application']=["Modernise an application without a full rewrite","A slow or difficult application does not automatically need microservices. Establish the business problem, then change the smallest part that can deliver a useful improvement."];
pageMetadata['/learning/productive-tech-meetings']=["Run a tech meeting that ends with decisions","A useful technical meeting resolves a question, removes a blocker or agrees a next step. A round of updates can happen in writing; meeting time should be used for work that needs people together."];
pageMetadata['/learning/pre-deployment-validation']=["Check release readiness before production","A green pipeline proves that configured jobs passed. It does not establish that the configuration, integrations, recovery plan and operational support are ready for this particular release."];
pageMetadata['/learning/incident-response']=["Handle a production incident without losing control","During an outage, the first job is to protect customers and restore a usable service. Finding every contributing cause can continue after the immediate impact is contained."];
