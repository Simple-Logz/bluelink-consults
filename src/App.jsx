import { zoomBookingUrl } from "./siteBooking";
import { submitInquiry } from "./submitInquiry";
import { InstitutionalSectorsPage, ProfessionalEATPage, MigrationReadinessPage, DeliveryExamplesPage, EventsActivitiesPage } from "./InstitutionalPages";
import { SiteMetadata } from "./SiteMetadata";
import SocialLinks, { SocialLogo } from "./SocialLinks";
import { CbnArticle, BlogFeature } from "./CbnBlog";
import { serviceContent } from "./serviceContent";
import StaffWorkspace from "./StaffWorkspace";
import WhyInstitutionsChoose from "./WhyInstitutionsChoose";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Search,
  CheckCircle2,
  Cloud,
  ShieldCheck,
  Workflow,
  ServerCog,
  Database,
  Activity,
  LockKeyhole,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  CalendarDays,
  Send,
  Clock,
  Target,
  Users,
  Zap,
  Globe2,
  Linkedin,
  Facebook,
  Instagram,
  Download,
  UserPlus,
  Code2,
  FlaskConical,
  Sun,
  Moon,
} from "lucide-react";
import "./styles.css";
import { supabase } from "./supabaseClient";
import ClientPortal from "./ClientPortal";
import DemoRequestPage from "./DemoRequestPage";
import { NigeriaEnterpriseHome, NigeriaEnterpriseFooter } from "./NigeriaEnterprise";
import { NigeriaHeader, DemoBanner, OurStory, OurTeam, BlogPage, HeaderUtility, FAQsPage } from "./NigeriaPages";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const globalServices = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: Code2,
    summary: "Fast, professional websites and web applications that represent your business the way it deserves.",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop",
    body: "Your website is often the first impression a prospective client has of your business — and an outdated, slow, or clunky site undermines the credibility you've worked hard to build. BlueLink Consults designs and builds modern, responsive websites and web applications: marketing sites, client portals, booking and intake tools, and custom internal platforms. We focus on speed, clarity, and conversion, backed by clean, maintainable code that your team can build on for years.",
    tools: [
      "React, Next.js, and modern frontend frameworks",
      "Responsive, mobile-first design systems",
      "Headless CMS and content workflows",
      "Node.js / API-driven backends",
      "Performance optimization and SEO fundamentals",
      "Hosting on Vercel, Netlify, Azure, or AWS",
    ],
    outcomes: [
      "A fast, professional site that builds trust instantly",
      "Mobile-friendly, accessible design",
      "Clear calls to action that drive real leads",
      "Clean codebase your team can extend",
      "Improved search visibility",
      "A site that scales as your business grows",
    ],
    blueLinkHelp: [
      "Understand your business goals, audience, and brand.",
      "Design and build a modern, responsive site or web app.",
      "Optimize for speed, accessibility, and search engines.",
      "Connect the site to the tools and data your business runs on.",
      "Hand over a maintainable, well-documented codebase.",
    ],
  },
  {
    slug: "application-modernization",
    title: "Application Modernization",
    icon: ServerCog,
    summary: "Transform outdated business applications into secure, scalable, cloud-ready platforms.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    body: "BlueLink Consults helps organizations move legacy applications away from fragile, outdated, difficult-to-maintain systems into modern, secure, scalable platforms. We assess your current application, identify business and technical risks, redesign the user experience, modernize APIs, improve performance, and create a practical path toward cloud-ready architecture.",
    tools: [
      "React / Angular / modern frontend frameworks",
      "Node.js, .NET, Python, or Java APIs",
      "Azure App Service, AWS ECS, AKS, or EKS",
      "API Gateway, Azure API Management, or reverse proxy patterns",
      "CI/CD pipelines with GitHub Actions or Azure DevOps",
      "Monitoring with Application Insights, CloudWatch, or Datadog",
    ],
    outcomes: [
      "Modern, professional user experience",
      "API-ready application architecture",
      "Improved performance and scalability",
      "Reduced technical debt and maintenance risk",
      "More reliable deployment and rollback process",
      "Clear modernization roadmap for leadership",
    ],
    blueLinkHelp: [
      "Assess your aging application and identify modernization priorities.",
      "Redesign the frontend experience so the app looks current and credible.",
      "Separate frontend, backend, database, and integration concerns properly.",
      "Introduce API-first architecture for future mobile, web, and partner integrations.",
      "Containerize or cloud-host the application for better reliability and scaling.",
      "Set up monitoring, logging, CI/CD, and secure identity controls.",
    ],
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud Infrastructure",
    icon: Cloud,
    summary: "Reliable Azure, AWS, hybrid, and container-based environments — plus the DevOps automation that keeps them shipping safely.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    body: "We design cloud environments that help businesses move away from unreliable infrastructure and toward secure, governed, scalable hosting foundations. Cloud infrastructure and delivery automation go hand in hand, so this service also covers the DevOps side: replacing manual deployment processes with repeatable, secure, automated delivery pipelines — from infrastructure design through to the CI/CD workflows that ship changes reliably.",
    tools: ["Azure, AWS, hybrid cloud", "Landing zones and network design", "Terraform and Infrastructure as Code", "Containers, AKS, EKS, ECS, App Service", "Azure DevOps, GitHub Actions, GitLab CI/CD", "Cloud cost governance, backup, and monitoring"],
    outcomes: ["Reliable, scalable cloud hosting", "Faster, lower-risk releases", "Repeatable environments and rollback plans", "Better cost visibility and governance", "More secure infrastructure", "Clear migration and delivery roadmap"],
    blueLinkHelp: ["Review your current infrastructure and cloud readiness.", "Design secure and scalable target architecture.", "Create a phased migration plan.", "Build CI/CD pipelines and automate infrastructure deployment.", "Implement monitoring, governance, and release approval gates."],
    subServices: [
      {
        title: "Cloud Infrastructure Design",
        desc: "Landing zones, network design, Infrastructure as Code, and container platforms built for security and scale.",
      },
      {
        title: "DevOps Automation & Delivery",
        desc: "CI/CD pipelines, automated deployments, and release governance so changes ship faster with less risk.",
      },
    ],
  },
  {
    slug: "data-integration",
    title: "Data & Integration",
    icon: Database,
    summary: "Modernize data movement, APIs, databases, reports, and business workflows.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
    body: "We help organizations connect systems, improve data flows, expose APIs, and reduce manual operational work.",
    tools: ["SQL and cloud databases", "REST APIs", "Azure Data Factory", "Logic Apps", "Power Automate", "Reporting and dashboards"],
    outcomes: ["Connected systems", "Reduced manual work", "Cleaner data movement", "Better reporting", "Improved workflow visibility", "More reliable integrations"],
    blueLinkHelp: ["Review data and workflow pain points.", "Design integration patterns.", "Modernize APIs and reporting flows.", "Automate repetitive business processes."],
  },
  {
    slug: "predeployment-validation",
    title: "Predeployment Validation",
    icon: FlaskConical,
    summary: "LytHouse, our own release-validation product, catches issues before they reach production — built by BlueLink Consults and used on every engagement we deliver.",
    image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2000&auto=format&fit=crop",
    body: "LytHouse is a predeployment validation product built by BlueLink Consults from the ground up. We built it because we needed it: on every consulting engagement we deliver, LytHouse is the tool our own team uses to validate a release before it ships — checking configuration, environment parity, dependencies, and core workflows, and giving a clear go/no-go signal instead of a guess. We now offer LytHouse directly to the market as a standalone product, so your team can get the same release confidence we build into our own delivery work.",
    tools: [
      "LytHouse — BlueLink's own predeployment validation engine",
      "Automated smoke and regression checks",
      "Environment parity and configuration diffing",
      "Secret and config validation",
      "Rollback safety checks",
      "Integration with GitHub Actions, Azure DevOps, or GitLab CI/CD",
    ],
    outcomes: [
      "Fewer production incidents",
      "Clear go/no-go confidence before release",
      "Faster detection of configuration drift",
      "Safer, more predictable rollbacks",
      "Less manual pre-release checking",
      "Stronger release governance",
    ],
    blueLinkHelp: [
      "Map the checks that matter most before your releases ship.",
      "Set up LytHouse in your pipeline for automated predeployment validation.",
      "Catch environment and configuration drift before it causes an outage.",
      "Give your team a clear, repeatable go/no-go gate for every release.",
    ],
    plans: [
      {
        name: "Starter",
        price: "Contact us",
        tagline: "For small teams shipping their first automated release gate.",
        features: ["Core predeployment checks", "1 CI/CD pipeline integration", "Config & secret validation", "Email support"],
      },
      {
        name: "Team",
        price: "Contact us",
        tagline: "For growing engineering teams shipping frequently.",
        features: ["Everything in Starter", "Unlimited pipeline integrations", "Environment parity diffing", "Rollback safety checks", "Priority support"],
        highlight: true,
      },
      {
        name: "Enterprise",
        price: "Contact us",
        tagline: "For organizations with complex, multi-environment release processes.",
        features: ["Everything in Team", "Custom validation rules", "Dedicated onboarding", "SLA-backed support", "Delivered as part of a BlueLink engagement"],
      },
    ],
  },
];

// Keep the existing international website intact; Nigeria uses its own catalogue.
const isNigeriaSite = ["bluelinkconsults.ng", "www.bluelinkconsults.ng"].includes(window.location.hostname);
const nigeriaServices = [
  { slug: "technology-audit-assessment", title: "Technology Audit & Assessment", icon: ShieldCheck,
    summary: "Understand your technology risks, costs and improvement priorities before investing in change.",
    body: "We assess application architecture, infrastructure configurations, dependencies, resource utilisation and access controls. Findings are prioritised by business impact and technical risk, with a practical improvement roadmap.",
    tools: ["Architecture and dependency review", "Configuration and access-control assessment", "Resource utilisation and cost analysis"],
    outcomes: ["Evidence-based findings report", "Risk register with priorities", "Phased improvement roadmap"],
    blueLinkHelp: ["Agree the assessment scope and evidence required.", "Review systems and validate findings with your team.", "Assign priorities, owners and recommended next steps."] },
  { slug: "application-modernization", title: "Application Modernization", icon: ServerCog,
    summary: "Improve fragile applications, slow transactions and disconnected systems with a clear modernization plan.",
    body: "We review code structure, APIs, database dependencies, performance and maintainability, then select the right approach: refactoring, replatforming, rebuilding or integrating. Delivery is phased to support business continuity.",
    tools: ["Code and database dependency analysis", "API and integration design", "Performance and regression testing"],
    outcomes: ["Target application architecture", "Modernized application components", "Documented test results and handover"],
    blueLinkHelp: ["Identify technical debt and business-critical workflows.", "Agree a target architecture and delivery plan.", "Implement and test changes in manageable phases."] },
  { slug: "cloud-infrastructure", title: "Cloud Infrastructure", icon: Cloud,
    summary: "Build secure, scalable public, private or hybrid infrastructure with recovery built into the design.",
    body: "We design and implement compute, storage, networking, identity, backup and recovery foundations. Architecture decisions reflect workload needs, operating costs and your team's support capabilities.",
    tools: ["Azure, AWS and hybrid environments", "Network and identity design", "Backup and recovery validation"],
    outcomes: ["Infrastructure architecture and deployment configuration", "Access and network controls", "Backup and recovery plan"],
    blueLinkHelp: ["Assess workload and availability requirements.", "Design and deploy the infrastructure foundation.", "Validate recovery and document operational ownership."] },
  { slug: "devops-automation", title: "DevOps & Automation", icon: Workflow,
    summary: "Replace manual builds and deployments with repeatable, version-controlled delivery workflows.",
    body: "We connect source control, build pipelines, automated testing, infrastructure provisioning and secrets management. Release approvals and rollback procedures make changes traceable and easier to operate.",
    tools: ["GitHub Actions, Azure DevOps and GitLab CI/CD", "Terraform and configuration automation", "Secrets management and release gates"],
    outcomes: ["Repeatable delivery pipelines", "Version-controlled infrastructure", "Release and rollback runbooks"],
    blueLinkHelp: ["Map the existing delivery workflow and bottlenecks.", "Automate build, test and provisioning steps.", "Document approvals and train your delivery team."] },
  { slug: "predeployment-validation", title: "Pre-Deployment Validation", icon: FlaskConical,
    summary: "Check configuration, integration, security and rollback readiness before a release reaches production.",
    body: "We define release acceptance criteria and validate applications, infrastructure and configuration against them. Evidence, unresolved exceptions and a release recommendation help your team make an informed deployment decision.",
    tools: ["Configuration and environment checks", "Integration and performance tests", "Security checks and rollback rehearsal"],
    outcomes: ["Validation report with test evidence", "Unresolved exceptions and remediation actions", "Release readiness recommendation"],
    blueLinkHelp: ["Agree acceptance criteria for the release.", "Run validation checks in the target environment.", "Review exceptions and recommend the next release action."] },
  { slug: "operational-incident-support", title: "Operational & Incident Support", icon: Activity,
    summary: "Improve visibility, diagnose incidents and restore services with practical operational support.",
    body: "We help teams configure metrics, logs and alerting, investigate incidents and restore affected services. Runbooks and incident reviews turn operational learning into concrete improvements.",
    tools: ["Metrics, logs and alerting", "Incident diagnosis and service restoration", "Operational runbooks and incident reviews"],
    outcomes: ["Monitoring and alert configurations", "Operational response runbooks", "Incident reports and improvement actions"],
    blueLinkHelp: ["Identify critical services and monitoring gaps.", "Configure actionable alerts and response procedures.", "Investigate incidents and track corrective actions."] },
].map(service => ({ ...service, ...({
  "technology-audit-assessment": {
    "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Analytics on a laptop during a technology assessment"
  },
  "application-modernization": {
    "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Software development workspace with application code"
  },
  "cloud-infrastructure": {
    "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Physical server infrastructure in a data centre"
  },
  "devops-automation": {
    "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Engineering team collaborating around laptops"
  },
  "predeployment-validation": {
    "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Colleagues reviewing work together on a laptop"
  },
  "operational-incident-support": {
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85",
    "imageAlt": "Operational analytics and performance charts on a screen"
  }
})[service.slug] }));
const internationalServices = [
  ...globalServices,
  ...nigeriaServices.filter(service => !globalServices.some(item => item.slug === service.slug)),
].map(service => ({ ...service, ...serviceContent[service.slug] }));
const services = isNigeriaSite ? nigeriaServices : internationalServices;
const serviceAliases = { 'devops': 'devops-automation', 'pre-deployment-validation': 'predeployment-validation', 'application-modernisation': 'application-modernization' };

const industries = [
  {
    name: "Professional Services",
    desc: "Law firms, accountancies, and consultancies struggling with fragmented systems, manual billing workflows, and outdated client portals that undermine the professional image they work hard to maintain.",
  },
  {
    name: "Healthcare Support Teams",
    desc: "Healthcare administration and support operations dealing with legacy EMR integrations, compliance gaps, unreliable infrastructure, and systems that slow down the delivery of patient-facing services.",
  },
  {
    name: "Logistics & Field Operations",
    desc: "Logistics providers and field service businesses held back by disconnected tracking systems, manual dispatch processes, and operational tools that cannot scale as route volumes or team sizes grow.",
  },
  {
    name: "Retail & Service Companies",
    desc: "Retailers and service businesses whose customer experience is limited by aging e-commerce platforms, siloed inventory systems, and back-office tools that were never designed to work together.",
  },
  {
    name: "Construction & Facilities",
    desc: "Construction firms and facilities managers running projects on spreadsheets and disconnected apps — without the visibility, auditability, or scalability that modern project and asset management demands.",
  },
  {
    name: "Growing Technology Teams",
    desc: "Engineering teams that have outgrown their early infrastructure — facing deployment bottlenecks, mounting technical debt, weak observability, and the need for DevOps maturity to support faster growth.",
  },
];

const fallbackInsights = [
  {
    slug: "modernization-assessment",
    title: "How to Start a Modernization Assessment",
    category: "Modernization",
    text: "A practical first step for understanding application risk, infrastructure debt, security exposure, and business impact.",
    content: "A modernization assessment begins with a clear inventory of your current systems: which applications are business-critical, which are aging, and which create the most operational risk. From there, you score each system on technical debt, security posture, performance, and maintainability. The output is a prioritized roadmap that shows leadership where to invest first and why. Starting with a focused assessment — rather than a large transformation — allows you to build confidence, reduce risk, and demonstrate early wins before committing to full-scale change.",
    minutes: "6 min read",
  },
  {
    slug: "cloud-readiness",
    title: "Is Your Business Ready for Cloud Migration?",
    category: "Cloud",
    text: "Cloud migration should begin with application dependencies, security design, cost governance, and operational readiness.",
    content: "Cloud readiness is not just about having a cloud account. It requires a clear understanding of which applications can move, what dependencies they carry, how security and identity will be handled in the new environment, and what the ongoing cost model looks like. Organizations that move to cloud without this preparation often find themselves with higher costs, more complexity, and the same reliability problems they had on-premise. A structured readiness review takes two to four weeks and produces a migration plan with risk scores, dependency maps, and a cost model before any infrastructure is touched.",
    minutes: "5 min read",
  },
  {
    slug: "identity-security",
    title: "Why Identity Is Central to Modern Application Security",
    category: "Security",
    text: "SSO, RBAC, conditional access, and governance are no longer optional for serious digital platforms.",
    content: "Identity is the new perimeter. With applications spread across cloud platforms, remote workers, and third-party integrations, the traditional network boundary no longer defines who can access what. Modern security requires that every user, service, and device is authenticated, authorized with the right roles, and subject to continuous access review. SSO reduces password fatigue and improves audit trails. RBAC ensures users only see what they need. Conditional access policies add a second layer of protection for sensitive operations. Together, these controls form the foundation of a defensible security posture.",
    minutes: "7 min read",
  },
];

/* ─── INSIGHTS CONTEXT ───────────────────────────────────── */
function normalizeInsight(item) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category || "Insight",
    text: item.excerpt || item.text || "",
    content: item.content || item.text || "",
    minutes: item.read_time || item.minutes || "5 min read",
    image_url: item.image_url || "",
    author: item.author || "BlueLink Consults",
    created_at: item.created_at,
  };
}

const InsightsContext = createContext({ insights: fallbackInsights, loading: false, error: "" });

function InsightsProvider({ children }) {
  const [insights, setInsights] = useState(fallbackInsights);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        setError("Supabase not connected. Showing fallback insights.");
        setLoading(false);
        return;
      }
      const { data, error: err } = await supabase
        .from("insights")
        .select("id,slug,title,excerpt,content,category,author,image_url,read_time,published,created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (err) { setError(err.message); setInsights(fallbackInsights); }
      else if (data && data.length > 0) setInsights(data.map(normalizeInsight));
      else setInsights(fallbackInsights);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <InsightsContext.Provider value={{ insights, loading, error }}>
      {children}
    </InsightsContext.Provider>
  );
}

function useInsights() { return useContext(InsightsContext); }

/* ─── SEARCH INDEX ───────────────────────────────────────── */
function buildSiteSearchIndex(currentInsights = fallbackInsights) {
  return [
    ...services.map((s) => ({
      title: s.title, category: "Service", path: `/services/${s.slug}`,
      description: s.summary,
      keywords: [s.title, s.summary, s.body, ...s.tools, ...s.outcomes, ...s.blueLinkHelp].join(" "),
    })),
    ...currentInsights.map((i) => ({
      title: i.title, category: "Insight", path: `/insights/${i.slug}`,
      description: i.text,
      keywords: [i.title, i.category, i.text, i.content || "", i.minutes].join(" "),
    })),
    { title: "Solutions", category: "Page", path: "/solutions", description: "Solutions for growing organizations.", keywords: industries.map(i => i.name).join(" ") },
    { title: "About BlueLink Consults", category: "Page", path: "/about", description: "Learn about BlueLink Consults.", keywords: "about company modernization consultancy cloud infrastructure devops security" },
    { title: "Contact BlueLink Consults", category: "Page", path: "/contact", description: "Contact BlueLink Consults.", keywords: "contact consultation modernization review phone email inquiry" },
    { title: "Client Portal", category: "Portal", path: "/client-login", description: "Secure client login.", keywords: "client login portal dashboard documents support requests" },
  ];
}

/* ─── HELPERS ────────────────────────────────────────────── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth > 1050 : true
  );
  useEffect(() => {
    function handleResize() { setIsDesktop(window.innerWidth > 1050); }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isDesktop;
}

function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | BlueLink Consults`
      : "BlueLink Consults | Application Modernization, Cloud & DevOps";
  }, [title]);
}

/* ─── HEADER ─────────────────────────────────────────────── */
function Header() {
  const [mobileSection, setMobileSection] = useState(null);
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [utilityOpen, setUtilityOpen] = useState(false);
  const utilityRef = useRef(null);

  useEffect(() => {
    if (!utilityOpen) return;
    const outside = event => {
      if (!utilityRef.current?.contains(event.target)) setUtilityOpen(false);
    };
    const escape = event => {
      if (event.key === "Escape") {
        setUtilityOpen(false);
        utilityRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("click", outside, true);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("click", outside, true);
      document.removeEventListener("keydown", escape);
    };
  }, [utilityOpen]);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const isDesktop = useIsDesktop();
  const { insights: cmsInsights } = useInsights();

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isDesktop) setMegaOpen(null);
  }, [isDesktop]);

  const close = () => {
    setOpen(false);
    setMegaOpen(null);
    setUtilityOpen(false);
  };

  const toggleMega = (name) => {
    // A mouse click follows mouse-enter; keep the hovered menu open.
    setMegaOpen(name);
    setUtilityOpen(false);
  };

  return (
    <>
      <div className="bl-header-shell"><HeaderUtility /><header className={headerScrolled ? "site-header qore-header scrolled" : "site-header qore-header"}>
        <Link to="/" className="brand-logo-wrap brand-home-link" onClick={close} aria-label="BlueLink Consults home">
          <img src="/bluelink-logo-mark.png" alt="" className="brand-logo-mark" />
          <span className="brand-wordmark"><strong>Blue<span>Link</span></strong><small>Consults</small></span>
        </Link>

        <nav className="qore-desktop-nav" aria-label="Primary navigation" onKeyDown={event => { if (event.key === "Escape") setMegaOpen(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMegaOpen(null); }}>
          <div className="qore-nav-item"
            onMouseEnter={() => setMegaOpen("services")}
            onMouseLeave={() => setMegaOpen(null)}>
            <button onClick={() => toggleMega("services")} aria-expanded={megaOpen === "services"}>
              Services <ChevronDown size={14}/>
            </button>
            <div className={megaOpen === "services" ? "qore-mega services show" : "qore-mega services"}>
              <div className="qore-mega-intro">
                <span className="qore-menu-kicker">What we do</span>
                <h3>Technology built around your business.</h3>
                <p>Assess, modernize and operate critical technology with a practical delivery partner.</p>
                <Link to="/contact" onClick={close}>Talk to BlueLink <ArrowRight size={15}/></Link>
              </div>
              <div className="qore-mega-links">
                {services.map((s) => {
                  const Icon=s.icon;
                  return <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}><span className="qore-menu-icon"><Icon size={18}/></span><span><strong>{s.title}</strong><small>{s.summary}</small></span><ArrowRight className="qore-menu-arrow" size={15}/></Link>;
                })}
              </div>
            </div>
          </div>

          <div className="qore-nav-item"
            onMouseEnter={() => setMegaOpen("solutions")}
            onMouseLeave={() => setMegaOpen(null)}>
            <button onClick={() => toggleMega("solutions")} aria-expanded={megaOpen === "solutions"}>
              Solutions <ChevronDown size={14}/>
            </button>
            <div className={megaOpen === "solutions" ? "qore-mega compact show" : "qore-mega compact"}>
              <div className="qore-mega-intro">
                <span className="qore-menu-kicker">How we engage</span>
                <h3>From assessment to transformation.</h3>
                <p>Structured engagements for organizations that need clarity, modernization and reliable delivery.</p>
              </div>
              <div className="qore-mega-links">
                <Link to="/solutions/who-we-help" onClick={close}><span className="qore-menu-icon"><Building2 size={18}/></span><span><strong>Who We Help</strong><small>Solutions shaped around operating realities.</small></span><ArrowRight size={15}/></Link>
                <Link to="/solutions/eat-framework" onClick={close}><span className="qore-menu-icon"><Target size={18}/></span><span><strong>The EAT Framework</strong><small>Engage. Assess. Transform.</small></span><ArrowRight size={15}/></Link>
              </div>
            </div>
          </div>

          <div className="qore-nav-item"
            onMouseEnter={() => setMegaOpen("insights")}
            onMouseLeave={() => setMegaOpen(null)}>
            <button onClick={() => toggleMega("insights")} aria-expanded={megaOpen === "insights"}>
              Insights <ChevronDown size={14}/>
            </button>
            <div className={megaOpen === "insights" ? "qore-mega compact show" : "qore-mega compact"}>
              <div className="qore-mega-intro">
                <span className="qore-menu-kicker">Thinking</span>
                <h3>Practical technology insight.</h3>
                <p>Guidance for leaders making infrastructure, modernization and delivery decisions.</p>
              </div>
              <div className="qore-mega-links">
                {cmsInsights.slice(0,4).map((i)=><Link key={i.slug} to={`/insights/${i.slug}`} onClick={close}><span className="qore-menu-icon"><FileText size={18}/></span><span><strong>{i.title}</strong><small>{i.category} · {i.minutes}</small></span><ArrowRight size={15}/></Link>)}
              </div>
            </div>
          </div>

          <div className="qore-nav-item"
            onMouseEnter={() => setMegaOpen("about")}
            onMouseLeave={() => setMegaOpen(null)}>
            <button onClick={() => toggleMega("about")} aria-expanded={megaOpen === "about"} aria-controls="qore-about-menu">
              About Us <ChevronDown size={14}/>
            </button>
            <div id="qore-about-menu" className={megaOpen === "about" ? "qore-mega compact show" : "qore-mega compact"}>
              <div className="qore-mega-intro"><span className="qore-menu-kicker">About BlueLink</span><h3>Meet your technology partner.</h3><p>Our story, our people and the way we work.</p></div>
              <div className="qore-mega-links">
                <Link to="/about/our-story" onClick={close}><span className="qore-menu-icon"><Building2 size={18}/></span><span><strong>Our Story</strong><small>Why BlueLink exists and how we work.</small></span><ArrowRight size={15}/></Link>
                <Link to="/about/our-team" onClick={close}><span className="qore-menu-icon"><Users size={18}/></span><span><strong>Our Team</strong><small>The people behind BlueLink.</small></span><ArrowRight size={15}/></Link>
                <Link to="/about/why-bluelink" onClick={close}><span className="qore-menu-icon"><Target size={18}/></span><span><strong>Why BlueLink</strong><small>Built around your institution.</small></span><ArrowRight size={15}/></Link>
              </div>
            </div>
          </div>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="qore-header-actions">
          <Link className="qore-demo-btn" to="/contact#consultation">Book a Consultation <ArrowRight size={15}/></Link>
          <div className="qore-utility-wrap" ref={utilityRef}>
            <button className="qore-menu-btn" onClick={() => setUtilityOpen(v=>!v)} aria-label="Open quick links" aria-expanded={utilityOpen}><Menu size={21}/></button>
            <div className={utilityOpen ? "qore-utility show" : "qore-utility"}>
              <Link to="/simulator" onClick={close}><Zap size={17}/><span><strong>Staff Workspace</strong><small>Staff sign-in required</small></span></Link>
              <Link to="/client-login" onClick={close}><LockKeyhole size={17}/><span><strong>Client Login</strong><small>Access your workspace</small></span></Link>
              <Link to="/events" onClick={close}><CalendarDays size={17}/><span><strong>Events &amp; Activities</strong><small>Conferences and team highlights</small></span></Link>
              <Link to="/blog" onClick={close}><FileText size={17}/><span><strong>Blog</strong><small>Ideas and updates</small></span></Link>
            </div>
          </div>
          <button className="qore-mobile-toggle" onClick={()=>setOpen(v=>!v)} aria-label="Toggle navigation">{open ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
      </header></div>

      <AnimatePresence>
        {open && (
          <motion.div className="qore-mobile-panel" initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.22}}>
            <div className="qore-mobile-top"><span>Explore BlueLink</span><button onClick={close}><X size={20}/></button></div>
            <div className="qore-mobile-links">
              <div className={"mobile-accordion "+(mobileSection==="services"?"open":"")}><button type="button" onClick={()=>setMobileSection(v=>v==="services"?null:"services")}><span>Services</span><span className="mobile-accordion-arrow">⌄</span></button>{mobileSection==="services"&&<div className="mobile-accordion-content">{services.map(s=><Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>{s.title}<ArrowRight size={14}/></Link>)}</div>}</div>
              <div className={"mobile-accordion "+(mobileSection==="solutions"?"open":"")}><button type="button" onClick={()=>setMobileSection(v=>v==="solutions"?null:"solutions")}><span>Solutions</span><span className="mobile-accordion-arrow">⌄</span></button>{mobileSection==="solutions"&&<div className="mobile-accordion-content"><Link to="/solutions/who-we-help" onClick={close}>Who We Help <ArrowRight size={14}/></Link><Link to="/solutions/eat-framework" onClick={close}>The EAT Framework <ArrowRight size={14}/></Link></div>}</div>
              <Link to="/insights" onClick={close}>Insights <ArrowRight size={15}/></Link>
              <div className={"mobile-accordion "+(mobileSection==="about"?"open":"")}><button type="button" onClick={()=>setMobileSection(v=>v==="about"?null:"about")}><span>About Us</span><span className="mobile-accordion-arrow">⌄</span></button>{mobileSection==="about"&&<div className="mobile-accordion-content"><Link to="/about/our-story" onClick={close}>Our Story <ArrowRight size={14}/></Link><Link to="/about/our-team" onClick={close}>Our Team <ArrowRight size={14}/></Link><Link to="/about/why-bluelink" onClick={close}>Why BlueLink <ArrowRight size={14}/></Link><Link to="/events" onClick={close}>Events &amp; Activities <ArrowRight size={14}/></Link><Link to="/contact" onClick={close}>Contact BlueLink <ArrowRight size={14}/></Link></div>}</div>
              <Link to="/contact" onClick={close}>Contact <ArrowRight size={15}/></Link>
            </div>
            <div className="qore-mobile-actions">
              <Link to="/simulator" onClick={close}>Staff Workspace</Link>
              <Link to="/client-login" onClick={close}>Client Login</Link>
              <Link className="primary" to="/contact#consultation" onClick={close}>Book a Consultation <ArrowRight size={15}/></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── PAGE TRANSITION & SCROLL ───────────────────────────── */
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); return; }
    const id = location.hash.replace("#", "");
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);
  return null;
}

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

/* ─── SHARED COMPONENTS ──────────────────────────────────── */
function PageHero({ label, title, text }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}



function EventsPage() { usePageTitle("Events & Activities"); return <EventsActivitiesPage />; }

function Footer() {
  if (isNigeriaSite) return <NigeriaEnterpriseFooter services={services} />;
  return (
    <footer className="footer">
      <div>
        <strong>BlueLink Consults</strong>
        <p>{isNigeriaSite ? "Technology assessment, application modernization, cloud infrastructure, automation, release validation and operational support for Nigerian organizations." : "Technology assessment, application modernization, cloud infrastructure, DevOps automation, pre-deployment validation and operational support for growing organizations."}</p>
        <div className="footer-socials"><strong>Follow BlueLink</strong><SocialLinks follow={false} /></div>
      </div>
      <div>
        <strong>Our Services</strong>
        {services.map(service => <Link key={service.slug} to={`/services/${service.slug}`}>{service.title}</Link>)}
        {isNigeriaSite && <a href="/BlueLink-Company-Profile.pdf" download>Download Company Profile</a>}
        <Link to="/events">Events &amp; Activities</Link>
        <Link to="/insights">Insights</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
      <div className="footer-contact-numbers"><a href="tel:+14014402434">US: +1 401-440-2434</a><a href="tel:+2348068649496">Nigeria: +234 806 864 9496</a></div>
      <small>© 2026 BlueLink Consults. All rights reserved. · {isNigeriaSite ? "Nigeria" : "Providence, RI, USA"} · info@bluelinkconsults.com</small>
    </footer>
  );
}

/* ─── CTA BANNER (between Hero and Process on homepage) ──── */
function CTABanner() {
  if (isNigeriaSite) return <DemoBanner />;
  return (
    <section style={{
      background: "#0B1F3A",
      padding: "62px 7vw",
      textAlign: "center",
      fontFamily: "inherit",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg, #1A5EAB, #0EA5E9, #1A5EAB)",
      }} />
      {/* Bottom accent line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: "linear-gradient(90deg, #1A5EAB, #0EA5E9, #1A5EAB)",
      }} />

      {/* Eyebrow pill */}
      <span style={{
        display: "inline-block",
        background: "#0EA5E9",
        color: "#042C53",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "4px 14px",
        borderRadius: 40,
        marginBottom: 20,
      }}>BlueLink Consults</span>

      {/* Headline */}
      <h2 style={{
        fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)",
        fontWeight: 700,
        color: "#FFFFFF",
        lineHeight: 1.2,
        maxWidth: 680,
        margin: "0 auto 12px",
        fontFamily: "Libre Baskerville, serif",
      }}>
        Are your websites and applications old and slow?
      </h2>

      {/* Tagline */}
      <p style={{
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#FFFFFF",
        margin: "0 auto 32px",
      }}>
        <span style={{ color: "#0EA5E9" }}>We can fix that</span> — and keep you ahead of the competition.
      </p>

      {/* Three cards — responsive grid */}
      <style>{`
        .bl-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          max-width: 860px;
          margin: 0 auto 24px;
        }
        .bl-card-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(14,165,233,0.22);
          border-radius: 10px;
          padding: 16px;
          text-align: left;
        }
        .bl-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1A5EAB;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          padding: 13px 32px;
          border-radius: 9px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(29,111,216,0.35);
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .bl-cta-btn:hover {
          background: #0EA5E9;
          color: #042C53;
          transform: translateY(-2px);
        }
        .bl-card-item .bl-icon {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .bl-card-item:hover .bl-icon {
          transform: scale(1.18) rotate(-8deg);
        }
        @media (min-width: 721px) {
          .bl-cards-grid {
            max-width: 980px;
            gap: 18px;
          }
          .bl-card-item {
            padding: 22px 20px;
            gap: 16px;
          }
          .bl-cta-btn {
            font-size: 15px;
            padding: 15px 38px;
          }
        }
        @media (max-width: 720px) {
          .bl-cards-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            max-width: 100%;
          }
          .bl-card-item {
            align-items: center;
            padding: 14px;
          }
          .bl-cta-btn {
            width: 100%;
            justify-content: center;
            font-size: 15px;
            padding: 14px 20px;
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="bl-cards-grid">
        {[
          {
            title: "Stop the slowdowns",
            body: "Old systems make everything take longer. We modernize them so your team moves at full speed.",
            svg: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L4.5 13.5H11L10 22L20 10H13.5L13 2Z" />
              </svg>
            ),
          },
          {
            title: "Stay protected",
            body: isNigeriaSite ? "We assess security gaps and strengthen access, configuration and release controls." : "Outdated software is the number one way hackers break in. We close those doors permanently.",
            svg: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3L4 6V12C4 16.4 7.4 20.5 12 21.9C16.6 20.5 20 16.4 20 12V6L12 3Z" />
                <path d="M9 12L11 14L15 10" />
              </svg>
            ),
          },
          {
            title: "Grow without limits",
            body: "Modern systems scale with your business — no more hitting walls right when things get good.",
            svg: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C12 2 7 6 7 13H17C17 6 12 2 12 2Z" />
                <path d="M7 13L5 17H19L17 13" />
                <path d="M10 17V21" /><path d="M14 17V21" />
                <circle cx="12" cy="9" r="1.5" />
              </svg>
            ),
          },
        ].map(({ title, body, svg }) => (
          <div key={title} className="bl-card-item">
            <div className="bl-icon" style={{
              width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
              background: "rgba(14,165,233,0.15)",
              border: "1.5px solid rgba(14,165,233,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {svg}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", margin: "0 0 5px" }}>{title}</p>
              <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"} className="bl-cta-btn">
        {isNigeriaSite ? "Request Demo" : "Get a free 20-minute consultation →"}
      </Link>

      <p style={{ fontSize: 12, color: "#0EA5E9", marginTop: 10, marginBottom: 0 }}>
        {isNigeriaSite ? "www.bluelinkconsults.ng" : "www.bluelinkconsults.com"}
      </p>
    </section>
  );
}

/* ─── HOME ───────────────────────────────────────────────── */
function WhoWeServeStrip() {
  return (
    <section className="who-serve-strip" style={{
      background: "white",
      padding: "52px 7vw 48px",
      borderBottom: "1px solid var(--line)",
    }}>
      <style>{`
        .who-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 1060px;
          margin: 0 auto;
        }
        .who-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: var(--cream);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 18px 20px;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .who-card:hover {
          border-color: var(--bronze);
          background: #f0ebe4;
        }
        .who-card strong {
          font-size: 0.95rem;
          color: var(--text-dark);
          font-weight: 800;
          line-height: 1.3;
        }
        .who-card .who-desc {
          font-size: 0.84rem;
          color: var(--muted);
          line-height: 1.55;
        }
        .who-card .who-cta {
          font-size: 0.82rem;
          color: var(--bronze);
          font-weight: 700;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        /* Mobile: 2 columns, name only — no description, no cta text */
        @media (max-width: 720px) {
          .who-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .who-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 13px 14px;
          }
          .who-card strong { font-size: 0.86rem; }
          .who-card .who-desc { display: none; }
          .who-card .who-cta { display: none; }
          .who-card .who-arrow { display: block !important; }
        }
        @media (max-width: 400px) {
          .who-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <p className="eyebrow">Who We Help</p>
        <h2 style={{
          fontFamily: "Libre Baskerville, serif",
          fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
          color: "var(--text-dark)",
          margin: "8px auto 10px",
          maxWidth: 680,
          lineHeight: 1.2,
        }}>
          We work with businesses across every industry
        </h2>
        <p style={{ color: "var(--muted)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
          If your technology is slowing you down, we can help — regardless of what kind of business you run.
        </p>
      </div>

      <div className="who-grid">
        {industries.map((ind) => (
          <Link key={ind.name} to={isNigeriaSite ? "/request-demo" : "/contact#consultation"} className="who-card">
            <strong>{ind.name}</strong>
            {/* Description — visible on desktop, hidden on mobile */}
            <span className="who-desc">{ind.desc}</span>
            {/* Talk to us — visible on desktop, hidden on mobile */}
            <span className="who-cta">Talk to us <ArrowRight size={13} /></span>
            {/* Arrow — visible on mobile only */}
            <ArrowRight size={14} className="who-arrow" style={{ display: "none", color: "var(--bronze)", flexShrink: 0 }} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function ClientLogos() {
  const clients = [
    { name: "Skills to Hired", src: "/logos/client-skillstohired.png", scale: 1 },
    { name: "Acceleration Hub", src: "/logos/client-accelerationhub.png", scale: 1.3 },
    { name: "Vector", src: "/logos/client-vector.png", scale: 1 },
    { name: "National Association Inc.", src: "/logos/client-nationalassoc.png", scale: 1.55 },
    { name: "RedHotDealz.com", src: "/logos/client-redhotdealz.png", scale: 0.85 },
    { name: "MegaProz Consult", src: "/logos/client-megaproz.png", scale: 1.15 },
  ];
  return (
    <section style={{
      background: "var(--cream)",
      padding: "48px 7vw 56px",
      borderBottom: "1px solid var(--line)",
    }}>
      <style>{`
        .client-logo-row {
          --logo-h: 58px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: clamp(36px, 6vw, 76px);
          max-width: 1100px;
          margin: 30px auto 0;
        }
        .client-logo-row img {
          height: calc(var(--logo-h) * var(--scale, 1));
          width: auto;
          max-width: 190px;
          object-fit: contain;
          filter: grayscale(100%);
          opacity: 0.6;
          transition: filter 0.2s ease, opacity 0.2s ease;
        }
        .client-logo-row img:hover {
          filter: grayscale(0%);
          opacity: 1;
        }
        @media (max-width: 600px) {
          .client-logo-row {
            --logo-h: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            row-gap: 36px;
            column-gap: 16px;
            justify-items: center;
            align-items: center;
          }
          .client-logo-row img { max-width: 130px; }
        }
      `}</style>
      <div style={{ textAlign: "center" }}>
        <p className="eyebrow">Our Clients</p>
      </div>
      <div className="client-logo-row">
        {clients.map((c) => (
          <img key={c.name} src={c.src} alt={c.name} title={c.name} loading="lazy" style={{ "--scale": c.scale }} />
        ))}
      </div>
    </section>
  );
}

function ServiceNetwork() {
  const [activeService, setActiveService] = useState(null);
  const stageRef = useRef(null);
  const coreRef = useRef(null);
  const [coreConnection, setCoreConnection] = useState({left:504,right:696,y:533});
  useEffect(() => {
    const stage = stageRef.current;
    const core = coreRef.current;
    if (!stage || !core) return;
    const alignConnections = () => {
      const stageBox = stage.getBoundingClientRect();
      const coreBox = core.getBoundingClientRect();
      if (!stageBox.width || !stageBox.height) return;
      setCoreConnection({
        left: (coreBox.left - stageBox.left + coreBox.width * .25) / stageBox.width * 1200,
        right: (coreBox.right - stageBox.left - coreBox.width * .25) / stageBox.width * 1200,
        y: (coreBox.top - stageBox.top) / stageBox.height * 700,
      });
    };
    alignConnections();
    const observer = new ResizeObserver(alignConnections);
    observer.observe(stage);
    observer.observe(core);
    return () => observer.disconnect();
  }, []);
  const nodes = [
    { icon: Search, title:"Technology Audit", status:"Assessing environment", slug:"technology-audit-assessment", cls:"sn-a", value:"Understand risk, gaps and priorities before you invest." },
    { icon: ServerCog, title:"App Modernization", status:"Modernizing systems", slug:"application-modernization", cls:"sn-b", value:"Modernize legacy applications without losing business continuity." },
    { icon: Cloud, title:"Cloud Infrastructure", status:"Engineering platform", slug:"cloud-infrastructure", cls:"sn-c", value:"Build secure, scalable infrastructure around real workload needs." },
    { icon: Workflow, title:"DevOps & Automation", status:"Automating delivery", slug:"devops-automation", cls:"sn-d", value:"Reduce manual delivery work and make releases repeatable." },
    { icon: ShieldCheck, title:"Pre-deployment", status:"Validating release", slug:"pre-deployment-validation", cls:"sn-e", value:"Find deployment risks before they reach production." },
    { icon: Activity, title:"Operational Support", status:"Monitoring operations", slug:"operational-incident-support", cls:"sn-f", value:"Keep critical systems stable when incidents and operational issues occur." },
  ];
  const active = nodes.find(n => n.slug === activeService);
  return (
    <section className="service-network">
      <svg width="0" height="0" aria-hidden="true" style={{position:"absolute",pointerEvents:"none"}}>
        <defs>
          <filter id="network-logo-white-ring" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 -3 -3 -3 0 1.8" result="darkPixels"/>
            <feComposite in="darkPixels" in2="SourceAlpha" operator="in" result="ringMask"/>
            <feFlood floodColor="#ffffff" result="white"/>
            <feComposite in="white" in2="ringMask" operator="in" result="whiteRing"/>
            <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="whiteRing"/></feMerge>
          </filter>
        </defs>
      </svg>
      <div className="service-network-copy"><span>Connected technology services</span><h2>One partner. Six connected capabilities.</h2><p>Select a capability to see how it creates value, then explore the service in detail.</p></div>
      <div ref={stageRef} className={active ? "network-stage has-active" : "network-stage"}>
        <svg className="network-lines" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
          <path className={activeService==="technology-audit-assessment"?"line-a active":"line-a"} d="M600 405 C470 405 485 120 315 120"/><path className={activeService==="application-modernization"?"line-b active":"line-b"} d="M600 405 C730 405 715 120 885 120"/>
          <path className={activeService==="cloud-infrastructure"?"line-c active":"line-c"} d="M600 405 C450 405 450 290 250 290"/><path className={activeService==="devops-automation"?"line-d active":"line-d"} d="M600 405 C750 405 750 290 950 290"/>
          <path className={activeService==="pre-deployment-validation"?"line-e active":"line-e"} d={`M600 405 C470 405 ${coreConnection.left} ${coreConnection.y - 70} ${coreConnection.left} ${coreConnection.y}`}/><path className={activeService==="operational-incident-support"?"line-f active":"line-f"} d={`M600 405 C730 405 ${coreConnection.right} ${coreConnection.y - 70} ${coreConnection.right} ${coreConnection.y}`}/>
          <circle className="pulse p1" cx="600" cy="405" r="5"/>
        </svg>
        {nodes.map(({icon:Icon,title,status,slug,cls})=><Link key={slug} to={`/services/${slug}`} className={activeService===slug?`network-node ${cls} active`:`network-node ${cls}`} onMouseEnter={()=>setActiveService(slug)} onMouseLeave={()=>setActiveService(null)} onFocus={()=>setActiveService(slug)} onBlur={()=>setActiveService(null)}>
          <span className="network-node-icon"><Icon size={22}/></span><div><strong>{title}</strong><small>{status}</small></div><ArrowRight className="network-node-arrow" size={18}/>
        </Link>)}
        <Link ref={coreRef} to="/services" className={active ? "network-core active" : "network-core"}>
          <img src="/bluelink-logo-mark.png" alt=""/><div><strong>BlueLink</strong><small>{active ? active.value : "Engage · Assess · Transform"}</small>{active && <span>Explore {active.title} <ArrowRight size={13}/></span>}</div>
        </Link>
      </div>
    </section>
  );
}

function SimulatorTeaser() {
  return (
    <section style={{
      background: "var(--navy)",
      padding: "64px 7vw",
      textAlign: "center",
    }}>
      <p className="eyebrow" style={{ color: "var(--bronze)" }}>Interactive Tool</p>
      <h2 style={{
        fontFamily: "Libre Baskerville, serif",
        fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
        color: "white",
        margin: "10px auto 16px",
        maxWidth: 640,
        lineHeight: 1.2,
      }}>
        See exactly what modernization would do for your application
      </h2>
      <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.75, fontSize: "0.97rem" }}>
        Pick your language, services, and modernization tools. Run a simulation and see your before and after — load time, uptime, security score, infrastructure cost, and deployment speed.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
        {["5.5× faster load time", "57% cost reduction", "99.99% uptime", "50+ deploys/year"].map(stat => (
          <div key={stat} style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: "0.84rem",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 600,
          }}>{stat}</div>
        ))}
      </div>
      <Link
        to="/simulator"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bronze)",
          color: "white",
          padding: "15px 36px",
          fontWeight: 800,
          textDecoration: "none",
          borderRadius: 9,
          fontSize: "1rem",
          boxShadow: "0 4px 20px rgba(169,94,33,0.4)",
          transition: "background 0.2s, transform 0.15s",
        }}
        onMouseOver={e => { e.currentTarget.style.background = "var(--bronze-dark)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "var(--bronze)"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Open staff workspace <ArrowRight size={18} />
      </Link>
      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: 14 }}>
        Staff access · Verified company email required
      </p>
    </section>
  );
}

function Home() {
  usePageTitle(null);
  if (isNigeriaSite) return <NigeriaEnterpriseHome services={services} />;
  return <div className="bl-home-organized">
    <Hero />
    <section className="bl-home-services" aria-labelledby="home-services-title">
      <div className="bl-home-service-guide">
        <div className="bl-home-section-heading" style={{ marginBottom: 0 }}>
          <span>Our services</span>
          <h2 id="home-services-title">Technology services built around you.</h2>
          <p>Discover how BlueLink can help you assess, modernize and support the technology your business depends on.</p>
          <Link to="/services">Explore Our Services <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
    <section className="bl-home-about" aria-labelledby="home-about-title"><div className="bl-home-about-inner">
      <img src="/images/team-discussion.jpg" alt="Professionals discussing technology in a conference room" loading="lazy" width="1536" height="1024" />
      <div className="bl-home-section-heading"><span>About BlueLink Consults</span><h2 id="home-about-title">A clear path to better technology.</h2><p>We help organizations understand what they have, improve what matters and support the systems their business depends on.</p><p>Engage. Assess. Transform. Our approach connects business priorities with practical technology decisions.</p><Link to="/about/why-bluelink">Why choose BlueLink <ArrowRight size={18} aria-hidden="true" /></Link></div>
    </div></section>
    <WhoWeServeStrip /><EditorialShowcase />
    <section className="bl-home-contact"><span>Let’s work together</span><h2>What would you like your technology to do better?</h2><Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}>{isNigeriaSite ? "Request Demo" : "Contact Us"} <ArrowRight size={18} aria-hidden="true" /></Link></section>
  </div>;
}

function Hero() {
  return <section className="bl-editorial-hero"><div className="bl-editorial-hero-inner">
    <div className="bl-editorial-hero-copy"><div className="bl-editorial-accent" />
      <p className="hero-kicker">APPLICATIONS · CLOUD · SOFTWARE DELIVERY</p>
      <h1>Modernize your applications.<br/>Improve how your business runs.</h1>
      <p>BlueLink Consults helps organizations upgrade legacy applications, connect business systems, build cloud infrastructure and automate software delivery—with security and release validation built into the work.</p>
      <div className="hero-actions"><Link className="bl-editorial-hero-cta" to="/contact#consultation">Discuss Your Project <ArrowRight size={18}/></Link><Link className="hero-secondary" to="/services">Explore Our Services <ArrowRight size={18}/></Link></div>
    </div>
  </div></section>;
}

function EditorialShowcase() {
  const stories = [
    {
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop",
      eyebrow: "The EAT Framework",
      title: "A modernization plan your business and engineering teams can review.",
      text: "A practical path from legacy constraints to secure, maintainable applications.",
      to: "/solutions/eat-framework",
    },
    {
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=900&auto=format&fit=crop",
      eyebrow: "Cloud",
      title: "Cloud infrastructure with clear costs and tested recovery.",
      to: "/services/cloud-infrastructure",
    },
    {
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=900&auto=format&fit=crop",
      eyebrow: "Automation",
      title: "Automate builds, tests and deployments.",
      to: "/services/devops-automation",
    },
    {
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=900&auto=format&fit=crop",
      eyebrow: "Validation",
      title: "Validate your release before production.",
      to: "/services/predeployment-validation",
    },
  ];
  const lead=stories[0];
  return (
    <section className="editorial-showcase">
      <div className="editorial-heading">
        <div><span>From BlueLink</span><h2><Link to="/solutions/eat-framework" style={{color:"inherit",textDecoration:"none"}}>Technology in practice.</Link></h2></div>
        <Link to="/solutions/eat-framework">Explore EAT Framework <ArrowRight size={16}/></Link>
      </div>
      <div className="editorial-lead">
        <Link to={lead.to} className="editorial-lead-image"><img src={lead.image} alt="" loading="lazy"/></Link>
        <div className="editorial-lead-copy">
          <span>{lead.eyebrow}</span>
          <h3>{lead.title}</h3>
          <p>{lead.text}</p>
          <Link to={lead.to}>Explore the approach <ArrowRight size={16}/></Link>
        </div>
      </div>
      <div className="editorial-row">
        {stories.slice(1).map((story)=><Link className="editorial-card" to={story.to} key={story.title}>
          <img src={story.image} alt="" loading="lazy"/>
          <div><span>{story.eyebrow}</span><h3>{story.title}</h3><small>Explore <ArrowRight size={13}/></small></div>
        </Link>)}
      </div>
    </section>
  );
}

function HomeValueProps() {
  const props = [
    { icon: Code2, title: "Web Development", text: "Fast, professional websites and web applications that represent your business the way it deserves." },
    { icon: ServerCog, title: "Application Modernization", text: "Move legacy systems to modern, secure, scalable platforms without disrupting your business." },
    { icon: Cloud, title: "Cloud Infrastructure", text: "Reliable, governed cloud environments on Azure, AWS, or hybrid cloud — plus the DevOps automation that keeps releases safe." },
    { icon: Database, title: "Data & Integration", text: "Connect systems, modernize APIs, and automate the workflows that power your operations." },
    { icon: FlaskConical, title: "Predeployment Validation", text: "Catch issues before they reach production with automated checks, powered by our own validation tooling." },
  ];
  return (
    <section className="section white-section">
      <div className="section-heading narrow">
        <p className="eyebrow">What We Do</p>
        <h2>End-to-end modernization for growing organizations</h2>
        <p>From new websites to aging applications, cloud infrastructure, DevOps, data, and predeployment validation — BlueLink Consults helps you build a technology foundation that supports long-term growth.</p>
        <Link to="/services" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--bronze)", color:"white", padding:"12px 22px", fontWeight:800, marginTop:16, textDecoration:"none" }}>
          Explore All Services <ArrowRight size={17} />
        </Link>
      </div>
      <div className="card-grid" style={{ marginTop:40 }}>
        {props.map((p) => {
          const Icon = p.icon;
          return (
            <article className="border-card" key={p.title}>
              <div className="card-icon"><Icon size={24} /></div>
              <h3>{p.title}</h3>
              <div className="rule" />
              <p>{p.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EATPreview() {
  return (
    <section className="eat-preview-section">
      <div className="eat-preview-inner">
        <p className="eyebrow" style={{ color:"var(--bronze)" }}>Our Delivery Framework</p>
        <h2>We don't just deploy solutions — we <em>EAT</em> through complexity.</h2>
        <p>Every engagement BlueLink Consults delivers follows our structured EAT framework — a three-phase approach that defines priorities, assesses technical constraints and delivers changes against agreed acceptance criteria.</p>
        <div className="eat-phases">
          <div className="eat-phase engage">
            <span className="eat-letter">E</span>
            <div>
              <strong>Engage</strong>
              <p>We start by understanding your business, your people, your goals, and your constraints — before touching a single system.</p>
            </div>
          </div>
          <div className="eat-phase assess">
            <span className="eat-letter">A</span>
            <div>
              <strong>Assess</strong>
              <p>We audit your current technology environment — applications, infrastructure, security posture, costs, and technical debt — and give you an honest picture of where you stand.</p>
            </div>
          </div>
          <div className="eat-phase transform">
            <span className="eat-letter">T</span>
            <div>
              <strong>Transform</strong>
              <p>With alignment and clarity secured, we execute — modernizing systems, automating delivery, and building digital foundations built to last.</p>
            </div>
          </div>
        </div>
        <Link to="/solutions" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--bronze)", color:"white", padding:"13px 24px", fontWeight:800, marginTop:32, textDecoration:"none" }}>
          See How We Apply EAT <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="section services-section">
      <div className="section-heading">
        <p className="eyebrow">What We Do</p>
        <h2>{isNigeriaSite ? "Expertise for your next technology priority." : "The right modernization solution for every organization we serve"}</h2>
      </div>
      <div className="card-grid">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <motion.article className="border-card" key={s.slug} whileHover={{ y: -7 }} transition={{ duration: 0.2 }}>
              <div className="card-icon"><Icon size={26} /></div>
              <h3>{s.title}</h3>
              <div className="rule" />
              <p>{s.summary}</p>
              <Link to={`/services/${s.slug}`}>Learn More <ArrowRight size={18} /></Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function SolutionsPreview() {
  return (
    <section className="section white-section">
      <div className="section-heading narrow">
        <p className="eyebrow">Who We Help</p>
        <h2>Modern digital foundations for growing companies and institutions</h2>
        <p>Whether your business is struggling with outdated systems, manual processes, weak security, or unreliable infrastructure, BlueLink Consults helps define a practical path forward.</p>
      </div>
      <div className="solution-list">
        {industries.map((industry) => (
          <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"} key={industry}>
            <span>{industry}</span>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["01", "Engage", "Collaborate with stakeholders to understand business goals, operational challenges, application landscape, and transformation priorities."],
    ["02", "Assess", "Evaluate applications, infrastructure, security, data, processes, and technical debt to identify risks and modernization opportunities."],
    ["03", "Transform", "Execute modernization initiatives through cloud adoption, automation, application enhancement, DevOps practices, and operational improvements."],
  ];
  return (
    <section className="split-section">
      <div className="split-image" />
      <div className="split-copy">
        <p className="eyebrow">The "EAT" Framework</p>
        <h2>Clear strategy. Practical solutions. Stronger collaborative culture.</h2>
        <p>Using our "EAT" framework, we help business leaders understand the current state, identify risk, prioritize modernization, and execute improvements without unnecessary complexity.</p>
        <div className="step-list">
          {steps.map(([number, title, text]) => (
            <div key={number}>
              <strong>{number}</strong>
              <span><b>{title}</b><small>{text}</small></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsPreview() {
  const { insights, loading, error } = useInsights();
  return (
    <section className="section resource-section">
      <div className="section-heading narrow">
        <p className="eyebrow">Insights &amp; Starting Points</p>
        <h2>Practical guidance for modernization decisions</h2>
        {loading && <p>Loading latest insights...</p>}
        {error && <p>Live CMS content could not be loaded — fallback insights are shown.</p>}
      </div>
      <div className="resource-grid">
        {insights.map((card, i) => (
          <article className="resource-card" key={card.slug}>
            <div
              className={`resource-image resource-img-${(i % 3) + 1}`}
              style={card.image_url ? { backgroundImage: `url(${card.image_url})` } : undefined}
            />
            <div className="resource-content">
              <p className="mini-label">{card.category}</p>
              <h3>{card.title}</h3>
              <div className="rule" />
              <p>{card.text}</p>
              <Link to={`/insights/${card.slug}`}>Read Insight <ArrowRight size={18} /></Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── SERVICES ───────────────────────────────────────────── */
function ServicesPage() {
  usePageTitle("Services");
  return (
    <>
      <PageHero label="Services" title="Explore BlueLink Consults services." text={isNigeriaSite ? "Six services to assess, modernize, deploy and support your technology." : "We help organizations improve the full technical foundation: websites, applications, cloud infrastructure, DevOps, data, and predeployment validation."} />
      <ServicesPreview />
    </>
  );
}

function ServiceDetail() {
  const { slug } = useParams();
  const canonicalSlug = serviceAliases[slug] || slug;
  const service = services.find(item => item.slug === canonicalSlug);
  usePageTitle(service?.title || "Service not found");
  if (canonicalSlug !== slug) return <Navigate replace to={`/services/${canonicalSlug}`} />;
  if (!service) return <><PageHero label="404" title="Service not found." text="This service address does not exist. Explore our services or contact us to discuss your project." /><section className="section"><Link to="/services">Explore our services <ArrowRight size={18}/></Link></section></>;
  const Icon = service.icon;
  return (
    <>
      <section className="service-hero">
        <div className="service-hero-copy">
          <p className="eyebrow">Service Detail</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
        </div>
        <div className="service-hero-image" role="img" aria-label={service.imageAlt || service.title} style={{ backgroundImage: `url(${service.image})` }} />
      </section>
      <section className="service-detail-section">
        <div className="service-detail-main">
          <div className="service-icon-large"><Icon size={40} /></div>
          <h2>What {service.title} means for your business</h2>
          <p>{service.body}</p>
          <div className="detail-grid">
            <div className="detail-card">
              <h3>What the work supports</h3>
              <div className="detail-list">
                {service.outcomes.map((item) => (
                  <span key={item}><CheckCircle2 size={17} /> {item}</span>
                ))}
              </div>
            </div>
            <div className="detail-card">
              <h3>Tools selected for your environment</h3>
              <div className="detail-list">
                {service.tools.map((item) => (
                  <span key={item}><CheckCircle2 size={17} /> {item}</span>
                ))}
              </div>
            </div>
          </div>
          {service.subServices && (
            <div className="detail-card" style={{ marginBottom: 32 }}>
              <h3>What's included:</h3>
              <div className="sub-services-grid">
                {service.subServices.map((sub) => (
                  <div key={sub.title} className="sub-service-card">
                    <strong>{sub.title}</strong>
                    <p>{sub.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {service.deliverables && <div className="detail-card delivery-card"><h3>What you receive</h3><div className="detail-list">{service.deliverables.map(item => <span key={item}><CheckCircle2 size={17}/>{item}</span>)}</div><p className="scope-note">Final scope, integrations and acceptance criteria are agreed before implementation.</p></div>}
          <div className="blue-help-panel">
            <h2>How BlueLink Consults can help</h2>
            <p>{service.deliveryIntro || "We agree the scope, implement and test the changes, and document the operational responsibilities with your team."}</p>
            <div className="help-steps">
              {service.blueLinkHelp.map((item, i) => (
                <div key={item}>
                  <strong>{String(i + 1).padStart(2, "0")}</strong>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="service-detail-aside">
          {service.slug === "predeployment-validation" ? (
            <><h3>See LytHouse in action</h3><p>Review validation checks, pipeline compatibility and the evidence your team needs before approving a release.</p><Link to="/request-demo">Request a LytHouse Demo <ArrowRight size={17}/></Link></>
          ) : service.slug === "web-development" ? (
            <>
              <h3>Start your website project</h3>
              <p>Tell us a bit about your business and what you're hoping to launch, and we'll follow up with next steps.</p>
              <Link to="/contact?type=web-development#consultation">Request A Quote <ArrowRight size={17} /></Link>
            </>
          ) : (
            <>
              <h3>Discuss your project</h3>
              <p>Tell us which systems need to change, the constraints you face and your priorities. We will agree the next assessment or delivery step with you.</p>
              <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}>Book a Consultation <ArrowRight size={17} /></Link>
            </>
          )}
        </aside>
      </section>
      {service.plans && (
        <section className="section" style={{ background: "var(--cream)" }}>
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <p className="eyebrow">Plans</p>
            <h2 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)", color: "var(--navy)", marginBottom: 10 }}>
              What we're offering with {service.slug === "predeployment-validation" ? "LytHouse" : service.title}
            </h2>
            <p style={{ color: "var(--muted)" }}>Simple plans that scale with your release volume. Contact us for pricing tailored to your team.</p>
          </div>
          <div className="card-grid" style={{ maxWidth: 1040, margin: "0 auto" }}>
            {service.plans.map((plan) => (
              <article
                key={plan.name}
                className="solution-card"
                style={plan.highlight ? { border: "2px solid var(--navy)", position: "relative" } : undefined}
              >
                {plan.highlight && (
                  <span style={{
                    position: "absolute", top: -14, left: 24,
                    background: "var(--navy)", color: "white",
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em",
                    padding: "4px 12px", borderRadius: 20, textTransform: "uppercase",
                  }}>For growing teams</span>
                )}
                <h3>{plan.name}</h3>
                <p style={{ fontFamily: "Libre Baskerville, serif", fontSize: "1.5rem", color: "var(--bronze)", margin: "6px 0 4px" }}>{plan.price}</p>
                <div className="rule" />
                <p>{plan.tagline}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 22px", display: "grid", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 8, fontSize: "0.92rem", color: "var(--text-dark)", alignItems: "flex-start" }}>
                      <CheckCircle2 size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: 3 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}>Talk to us <ArrowRight size={18} /></Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
function SolutionsPage() {
  usePageTitle("Solutions");
  return (
    <>
      <PageHero
        label="Solutions"
        title="Technology solutions built around your business."
        text="BlueLink Consults helps growing organizations modernize systems, strengthen infrastructure, and build digital foundations that support long-term growth."
      />
      <section className="section white-section">
        <div className="card-grid" style={{ maxWidth:700, margin:"0 auto" }}>
          <article className="solution-card" style={{ cursor:"pointer" }}>
            <Building2 size={32} style={{ color:"var(--bronze)", marginBottom:14 }} />
            <h3>Who We Help</h3>
            <div className="rule" />
            <p>We work with professional services, healthcare, logistics, retail, construction, and growing technology teams — each with unique modernization challenges we understand deeply.</p>
            <Link to="/solutions/who-we-help">See Industries We Serve <ArrowRight size={18} /></Link>
          </article>
          <article className="solution-card" style={{ cursor:"pointer" }}>
            <Target size={32} style={{ color:"var(--bronze)", marginBottom:14 }} />
            <h3>The EAT Framework</h3>
            <div className="rule" />
            <p>Our three-phase delivery framework — Engage, Assess, Transform — ensures we deeply understand your business before recommending or deploying any technology change.</p>
            <Link to="/solutions/eat-framework">Explore the Framework <ArrowRight size={18} /></Link>
          </article>
        </div>
      </section>
    </>
  );
}

function WhoWeHelpPage() {
  if (isNigeriaSite) return <InstitutionalSectorsPage />;
  return <GlobalWhoWeHelpPage />;
}
function GlobalWhoWeHelpPage() {
  usePageTitle("Who We Help");
  return (
    <>
      <PageHero
        label="Who We Help"
        title="Industry-specific modernization for organizations with real operational complexity."
        text="We work with teams across six key sectors — each facing distinct technology challenges that require practical, business-first solutions."
      />
      <section className="section white-section">
        <div className="card-grid">
          {industries.map((industry) => (
            <article className="solution-card" key={industry.name}>
              <h3>{industry.name}</h3>
              <div className="rule" />
              <p>{industry.desc}</p>
              <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}>Discuss Your Needs <ArrowRight size={18} /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section" style={{ background:"var(--navy, #050e1f)", padding:"60px 0" }}>
        <div style={{ maxWidth:700, margin:"0 auto", padding:"0 48px", textAlign:"center" }}>
          <p className="eyebrow" style={{ color:"var(--bronze)" }}>Ready to start?</p>
          <h2 style={{ fontFamily:"var(--font-display)", color:"white", marginBottom:16, fontSize:"clamp(1.6rem,2.8vw,2.2rem)" }}>Not sure which category fits you?</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", marginBottom:28, lineHeight:1.7 }}>Most organizations we work with don't fit a single box. If your challenge is technology-related, we can help — regardless of sector. Start with a consultation and we'll assess where you stand.</p>
          <Link to={isNigeriaSite ? "/request-demo" : "/contact#consultation"} style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--bronze)", color:"white", padding:"13px 26px", fontWeight:800, textDecoration:"none" }}>
            Request a Free Consultation <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

function EATFrameworkPage() { return <ProfessionalEATPage />; }

/* ─── INSIGHTS ───────────────────────────────────────────── */
function InsightsPage() {
  usePageTitle("Insights");
  return (
    <>
      <PageHero label="Insights" title="Practical guidance for application modernization and cloud readiness." text="Short business-focused guides to help leaders think about technology improvement with clarity." />
      <BlogFeature />
      <InsightsPreview />
    </>
  );
}

function InsightDetail() {
  const { slug } = useParams();
  const { insights, loading, error } = useInsights();
  const article = insights.find((i) => i.slug === slug) || null;
  usePageTitle(article ? article.title : "Insight");

  if (loading) return <PageHero label="Insights" title="Loading insight..." text="Fetching the latest article." />;

  if (!article) {
    return (
      <>
        <PageHero label="Insights" title="Insight not found." text="The requested article could not be found." />
        <article className="article">
          <Link className="article-cta" to="/insights">Back to Insights <ArrowRight size={17} /></Link>
        </article>
      </>
    );
  }

  return (
    <>
      <PageHero label={article.category} title={article.title} text={article.text} />
      <article className="article">
        <p className="article-meta">
          <Clock size={17} /> {article.minutes}
          {article.author ? ` · ${article.author}` : ""}
        </p>
        {error && <p className="auth-message">Live CMS content could not be loaded — fallback content is shown.</p>}
        {article.content && (
          <>
            <h2>Overview</h2>
            <p>{article.content}</p>
          </>
        )}
        <h2>What to review first</h2>
        <ul>
          <li>Which applications are most important to business operations?</li>
          <li>Where are users experiencing delays, errors, or poor experience?</li>
          <li>Which systems create security, access, or audit concerns?</li>
          <li>Which deployments are manual, fragile, or difficult to roll back?</li>
          <li>Which platforms lack monitoring, logging, and ownership?</li>
        </ul>
        <h2>How BlueLink can help</h2>
        <p>We help convert uncertainty into a clear modernization roadmap with phased priorities, practical recommendations, and execution support.</p>
        <Link className="article-cta" to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}>Discuss this with BlueLink <ArrowRight size={17} /></Link>
      </article>
    </>
  );
}

/* ─── PROPOSALS ──────────────────────────────────────────── */
const proposals = [
  {
    slug: "foundation-modernization",
    packageLabel: "Package 1",
    title: "Starter Package",
    price: "From ₦250,000",
    priceNote: "based on system complexity",
    bestFor: "Small businesses needing a professional online presence.",
    file: "/proposals/package-1-starter.pdf",
    imageBase: "/proposals/images/package-1-starter",
    pages: 2,
  },
  {
    slug: "cloud-migration-devops",
    packageLabel: "Package 2",
    title: "Business Package",
    price: "From ₦500,000",
    priceNote: "based on system size and scope",
    bestFor: "Growing businesses that need bookings, payments, CRM and automation.",
    file: "/proposals/package-2-business.pdf",
    imageBase: "/proposals/images/package-2-business",
    pages: 3,
  },
  {
    slug: "full-architecture-modernization",
    packageLabel: "Package 3",
    title: "Enterprise Package",
    price: "From ₦1,000,000",
    priceNote: "custom quote based on scope",
    bestFor: "Companies requiring custom systems, integrations, portals, and advanced functionality.",
    file: "/proposals/package-3-enterprise.pdf",
    imageBase: "/proposals/images/package-3-enterprise",
    pages: 4,
  },
];

function ProposalsPage() {
  usePageTitle("Proposals");
  return (
    <>
      <PageHero label="Service Packages" title="Proposal Documents." text="Detailed package breakdowns you can view online or download as a PDF." />
      <section style={{ background: "white", padding: "64px 7vw 88px" }}>
        <style>{`
          .proposals-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; max-width:1100px; margin:0 auto; }
          @media (max-width:900px) { .proposals-grid { grid-template-columns:1fr; } }
        `}</style>
        <div className="proposals-grid">
          {proposals.map((p) => (
            <Link
              key={p.slug}
              to={`/proposals/${p.slug}`}
              style={{
                textDecoration: "none", display: "block", background: "var(--cream)",
                border: "1px solid var(--line)", borderRadius: 12, padding: 26,
                transition: "border-color 0.15s, transform 0.15s",
              }}
            >
              <p style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--bronze)", marginBottom: 8 }}>{p.packageLabel}</p>
              <h3 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "1.2rem", color: "var(--text-dark)", marginBottom: 10, lineHeight: 1.25 }}>{p.title}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 16 }}>{p.bestFor}</p>
              <p style={{ fontWeight: 800, color: "var(--text-dark)", marginBottom: 12 }}>{p.price}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--bronze)", fontWeight: 700, fontSize: "0.86rem" }}>
                View proposal <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function ProposalViewer() {
  const { slug } = useParams();
  const proposal = proposals.find((p) => p.slug === slug) || null;
  usePageTitle(proposal ? proposal.title : "Proposal");
  const [page, setPage] = useState(1);

  if (!proposal) {
    return (
      <>
        <PageHero label="Proposals" title="Proposal not found." text="The requested document could not be found." />
        <div style={{ textAlign: "center", padding: "40px 7vw 80px" }}>
          <Link className="article-cta" to="/proposals">Back to Proposals <ArrowRight size={17} /></Link>
        </div>
      </>
    );
  }

  const totalPages = proposal.pages;
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      <PageHero label={proposal.packageLabel} title={proposal.title} text={proposal.bestFor} />
      <section style={{ background: "var(--cream)", padding: "48px 7vw 88px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
            gap: 16, marginBottom: 24, background: "white", border: "1px solid var(--line)",
            borderRadius: 12, padding: "20px 26px",
          }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-dark)", margin: 0 }}>{proposal.price}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0" }}>{proposal.priceNote}</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href={proposal.file}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bronze)",
                  color: "#fff", padding: "13px 26px", borderRadius: 9, fontWeight: 700,
                  textDecoration: "none", fontSize: "0.92rem",
                }}
              >
                <Download size={17} /> Download PDF
              </a>
              <Link
                to={isNigeriaSite ? "/request-demo" : "/contact#consultation"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "transparent",
                  color: "var(--bronze)", border: "1.5px solid var(--bronze)", padding: "13px 26px",
                  borderRadius: 9, fontWeight: 700, textDecoration: "none", fontSize: "0.92rem",
                }}
              >
                Discuss This Package
              </Link>
            </div>
          </div>

          {/* Fixed page image — no pinch/zoom/pan viewer, just a static page that fits the screen */}
          <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow)" }}>
            <img
              src={`${proposal.imageBase}-p${page}.png`}
              alt={`${proposal.title} — page ${page} of ${totalPages}`}
              style={{ width: "100%", height: "auto", display: "block", userSelect: "none", touchAction: "pan-y" }}
              draggable={false}
            />
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 18 }}>
              <button
                type="button"
                onClick={goPrev}
                disabled={page === 1}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, background: "white",
                  border: "1.5px solid var(--line)", borderRadius: 9, padding: "10px 18px",
                  fontWeight: 700, fontSize: "0.88rem", color: page === 1 ? "var(--muted)" : "var(--text-dark)",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} /> Previous
              </button>
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600 }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={page === totalPages}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, background: "white",
                  border: "1.5px solid var(--line)", borderRadius: 9, padding: "10px 18px",
                  fontWeight: 700, fontSize: "0.88rem", color: page === totalPages ? "var(--muted)" : "var(--text-dark)",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next <ArrowRight size={15} />
              </button>
            </div>
          )}

          <p style={{ fontSize: "0.82rem", color: "var(--muted)", textAlign: "center", marginTop: 14 }}>
            Prefer the original file? <a href={proposal.file} download style={{ color: "var(--bronze)", fontWeight: 700 }}>Download the PDF directly</a>.
          </p>
        </div>
      </section>
    </>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────── */
function AboutPage() {
  usePageTitle("About");
  return (
    <>
      <PageHero
        label="About BlueLink Consults"
        title="We fix the technology that holds businesses back."
        text="BlueLink Consults is a specialist application modernization consultancy based in Providence, RI. We work with growing organizations across the US and beyond to replace old, slow, broken systems with technology that actually works."
      />

      <style>{`
        .about-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          max-width: 1100px;
          margin: 0 auto;
          align-items: center;
        }
        .about-split-media {
          border-radius: 14px;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 4 / 3;
          background-size: cover;
          background-position: center;
        }
        .about-split-media.about-ceo-photo { aspect-ratio: 1 / 1; }
        @media (max-width: 720px) {
          .about-split-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .about-split-media { aspect-ratio: 4 / 3 !important; }
        }
      `}</style>

      {/* ── OUR CEO ── */}
      <section style={{ background: "white", padding: "72px 7vw 52px" }}>
        <div className="about-split-grid">
          {/* CEO photo — left */}
          <div
            className="about-split-media about-ceo-photo"
            style={{ backgroundImage: "url('/john-offiong-ceo.jpg')", backgroundPosition: "center top" }}
          />
          {/* CEO write-up — right */}
          <div>
            <p className="eyebrow">Our CEO</p>
            <h2 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--bronze)", lineHeight: 1.1, margin: "10px 0 20px" }}>
              John Offiong, Founder &amp; CEO
            </h2>
            <p style={{ lineHeight: 1.8, color: "var(--text-dark)", marginBottom: 18, fontSize: "1rem" }}>
              John is the Founder and CEO of BlueLink Consults, a technology consulting firm that helps enterprises replace outdated, legacy systems with modern, scalable technology built for long-term growth. BlueLink delivers solutions across web development, application modernization, cloud infrastructure, data and systems integration, and pre-deployment validation — guided by its "Engage, Access, Transform" approach.
            </p>
            <p style={{ lineHeight: 1.8, color: "var(--muted)", marginBottom: 18, fontSize: "0.97rem" }}>
              With extensive experience in Cloud and DevOps, John has spent much of his career helping enterprises design and deliver solutions across software and infrastructure, building lasting partnerships that guide organizations through every stage of technological change.
            </p>
            <p style={{ lineHeight: 1.8, color: "var(--muted)", fontSize: "0.97rem" }}>
              John is also the Founder of <strong><em style={{ color: "#7C3AED" }}>Zarfy.ai</em></strong>, a pre-deployment validation platform helping IT enterprises identify risks, validate systems, and deploy technology with greater confidence.
            </p>
          </div>
        </div>
      </section>

      {/* ── THIN DIVIDER ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 7vw" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--bronze) 50%, transparent)", opacity: 0.55 }} />
      </div>

      {/* ── ORIGIN STORY ── */}
      <section style={{ background: "white", padding: "52px 7vw 72px" }}>
        <div className="about-split-grid">
          {/* Write-up — left */}
          <div>
            <p className="eyebrow">Our Story</p>
            <h2 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--bronze)", lineHeight: 1.1, margin: "10px 0 20px" }}>
              Born from a clear and growing need in the market.
            </h2>
            <p style={{ lineHeight: 1.8, color: "var(--text-dark)", marginBottom: 18, fontSize: "1rem" }}>
              BlueLink Consults was founded after observing a clear and accelerating trend: organizations across every industry are under pressure to modernize their applications — and many of them do not know where to start, who to trust, or how to do it without disrupting the operations they depend on.
            </p>
            <p style={{ lineHeight: 1.8, color: "var(--muted)", marginBottom: 18, fontSize: "0.97rem" }}>
              This is especially true in service delivery industries, where legacy applications directly affect how teams work, how clients are served, and how quickly the business can respond to change. The demand for modernization is real, urgent, and only growing — and we built BlueLink Consults to meet it.
            </p>
            <p style={{ lineHeight: 1.8, color: "var(--muted)", fontSize: "0.97rem" }}>
              Our approach is straightforward. We come in, take the time to properly understand your environment, and work with your team to modernize what matters most — in a way that is practical, sustainable, and built to last long after our engagement ends.
            </p>
          </div>
          {/* Story image — right */}
          <div
            className="about-split-media"
            style={{
              backgroundImage: "linear-gradient(rgba(5,11,45,0.08), rgba(5,11,45,0.08)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop')",
            }}
          />
        </div>
      </section>



      {/* ── OUR VALUES ── */}
      <section style={{ background: "var(--navy)", padding: "72px 7vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p className="eyebrow" style={{ color: "var(--bronze)" }}>What We Stand For</p>
            <h2 style={{ fontFamily: "Libre Baskerville, serif", fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", color: "white", margin: "10px auto 0", maxWidth: 560, lineHeight: 1.2 }}>
              Five principles that guide every decision we make
            </h2>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { n: "01", title: "Excellence",   body: "We hold ourselves to the highest standard in everything we deliver — from the quality of our code to the clarity of our communication. Good enough is never good enough. Every engagement carries our name, and we intend to be proud of all of them." },
              { n: "02", title: "Collaboration", body: "The best outcomes come from working together — with your team, not just for them. We embed ourselves in your context, listen before we speak, and treat your people as partners throughout the engagement. Transformation is a team sport." },
              { n: "03", title: "Speed",         body: "We move with urgency because your business cannot afford to wait. Our frameworks, tools, and experience are designed to cut the time between problem identification and working solution — without creating new problems in the process." },
              { n: "04", title: "Integrity",     body: "We say what we mean and do what we say. We scope engagements honestly, price fairly, and walk away from work that is not the right fit rather than take money we have not earned. Trust is the foundation every client relationship is built on." },
              { n: "05", title: "Innovation",    body: "The technology landscape moves fast and so do we. We continuously invest in learning new tools, platforms, and architectural patterns — so that every client benefits from what is current, not what was modern five years ago. Standing still is falling behind." },
            ].map(({ n, title, body }) => (
              <div key={n} style={{
                display: "flex",
                gap: 24,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "24px 28px",
                alignItems: "flex-start",
              }}>
                <span style={{ fontFamily: "Libre Baskerville, serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--bronze)", flexShrink: 0, opacity: 0.7 }}>{n}</span>
                <div>
                  <p style={{ fontWeight: 800, color: "white", fontSize: "0.97rem", marginBottom: 6 }}>{title}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.875rem", lineHeight: 1.75 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </>
  );
}

/* ─── CONTACT ────────────────────────────────────────────── */
const businessTypes = [
  "Laundry", "Restaurant", "Hospitality", "Entertainment", "Logistics",
  "Administration", "Religious Organization", "Education", "Agriculture",
  "Transportation", "E-commerce / Retail", "Other",
];

const customerVolumes = [
  "0 – 100", "100 – 500", "500 – 5,000", "5,000 – 50,000", "50,000+",
];

function ContactPage() {
  const location = useLocation();
  const isWebDev = new URLSearchParams(location.search).get("type") === "web-development";
  usePageTitle(isWebDev ? "Request A Quote" : "Contact");
  const [submitted, setSubmitted] = useState(false);
  const [inquiryReceipt,setInquiryReceipt] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const formspreeEndpoint = `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID || "meedwzan"}`;
  async function handleSubmit(event) {
    event.preventDefault();
    if (formLoading) return;
    const form = event.currentTarget;
    setFormError("");
    setFormLoading(true);
    try {
      const receipt=await submitInquiry(form,'contact');
      setInquiryReceipt(receipt);
      setSubmitted(true);
    } catch(error) { setFormError(error.message); }
    finally { setFormLoading(false); }
  }

  return (
    <>
      {isWebDev ? (
        <PageHero label="Contact" title="Let's build your new website." text="Tell us a bit about your business and what you're hoping to launch." />
      ) : (
        <PageHero label="Contact" title="Let's discuss what is slowing your technology down." text="Share your application, infrastructure, cloud, security, DevOps, or reliability challenge." />
      )}
      <section className="contact-section" id="consultation">
        <div className="contact-copy">
          <p className="eyebrow">Contact BlueLink Consults</p>
          <h2>{isWebDev ? "Start your website project." : "Start with a modernization conversation."}</h2>
          <p>Share your requirements and our team will review the next step with you.</p>
          <div style={{ margin:"22px 0 26px" }}><a className="contact-booking-button" href={zoomBookingUrl}>Schedule Demo <ArrowRight size={17} /></a><p style={{ marginTop:10, fontSize:"0.9rem" }}>Book a 30-minute Zoom discussion at a time that suits you.</p></div>
          <div className="contact-details">
            <a href="mailto:info@bluelinkconsults.com"><Mail size={17} /> info@bluelinkconsults.com</a>
            <a href="tel:+14014402434"><Phone size={17} /> US: +1 401-440-2434</a><a href="tel:+2348068649496"><Phone size={17} /> Nigeria: +234 806 864 9496</a>
            {!isNigeriaSite && <span><MapPin size={17} /> Providence, RI, 02909 United States</span>}
            <span><Building2 size={17} /> {isNigeriaSite ? "Blue Link Consults Ltd · Financial services, healthcare, public institutions & enterprises" : "Serving growing organizations and business teams"}</span>
          </div>
        </div>
        {submitted ? (
          <div className="success-box">
            <CheckCircle2 size={40} />
            <h3>Inquiry received</h3>
            <p>Thank you. Your request has been recorded for our team. Reference: {inquiryReceipt?.reference?.slice(0,8).toUpperCase()}.</p><p>We will respond using the email address you supplied. You can also book a 30-minute Zoom discussion.</p><a className="ng-link" href={zoomBookingUrl}>Choose a meeting time <ArrowRight size={17}/></a>
            <button onClick={() => { setSubmitted(false); setFormError(""); }}>Submit another inquiry</button>
          </div>
        ) : isWebDev ? (
          <form
            className="contact-form"
            id="consultation-form"
            action="/api/inquiry"
            method="POST"
            onSubmit={handleSubmit}
          >
            {formError && <div className="auth-message">{formError}</div>}
            <input className="bl-form-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><input type="hidden" name="_subject" value="New Web Development inquiry from bluelinkconsults.com" />
            <label>Full Name<input required name="name" type="text" placeholder="Your name" /></label>
            <label>Business Email<input required name="email" type="email" placeholder="you@company.com" /></label>
            <label>Company Name<input name="company" type="text" placeholder="Company name" /></label>
            <label>Phone Number (optional)<input name="phone" type="tel" placeholder={isNigeriaSite ? "+234 ..." : "+1 ..."} /></label>
            <label>
              What type of business are you in?
              <select required name="businessType" defaultValue="">
                <option value="" disabled>Select business type</option>
                {businessTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>
              How many customers do you hope to serve?
              <select required name="customerVolume" defaultValue="">
                <option value="" disabled>Select a range</option>
                {customerVolumes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <label>Tell us about your business<textarea required name="message" rows="4" placeholder="What does your business do, and what would you like your new website to do for you?" /></label>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Sending..." : "Submit Inquiry"} <Send size={18} />
            </button>
            <small>Your inquiry will be securely delivered to BlueLink Consults.</small>
          </form>
        ) : (
          <form
            className="contact-form"
            id="consultation-form"
            action="/api/inquiry"
            method="POST"
            onSubmit={handleSubmit}
          >
            {formError && <div className="auth-message">{formError}</div>}
            <input className="bl-form-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" /><input type="hidden" name="_subject" value="New BlueLink Consults website inquiry" />
            <label>Full Name<input required name="name" type="text" placeholder="Your name" /></label>
            <label>Business Email<input required name="email" type="email" placeholder="you@company.com" /></label>
            <label>Company<input name="company" type="text" placeholder="Company name" /></label>
            <label>Phone Number (optional)<input name="phone" type="tel" placeholder={isNigeriaSite ? "+234 ..." : "+1 ..."} /></label>
            <div style={{ display: "grid", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: "0.92rem" }}>What are your biggest pain points? <span style={{ color: "var(--bronze)" }}>(Check all that apply)</span></span>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>This helps us come prepared with the right answers for your consultation.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px 16px", marginTop: 6 }}>
                {[
                  "Application modernization",
                  "Cloud migration & infrastructure",
                  "DevOps & CI/CD automation",
                  "Security & identity (IAM / SSO)",
                  "Monitoring & observability",
                  "AI & machine learning adoption",
                  "Application performance & scaling",
                  "Storage & database optimization",
                  "Infrastructure as Code (Terraform)",
                  "Data integration & reporting",
                  "Compliance & audit readiness",
                  "Legacy system replacement",
                ].map((item) => (
                  <label key={item} className="pain-chip">
                    <input type="checkbox" name="painPoints" value={item} />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <label>Message<textarea minLength={5} maxLength={10000} required name="message" rows="4" placeholder="Tell us a bit more about your situation..." /></label>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Sending..." : "Submit Inquiry"} <Send size={18} />
            </button>
            <small>Your inquiry will be securely delivered to BlueLink Consults.</small>
          </form>
        )}
      </section>
    </>
  );
}

/* ─── 404 ────────────────────────────────────────────────── */
function NotFound() {
  usePageTitle("Page Not Found");
  return (
    <>
      <PageHero label="404" title="Page not found." text="The page you're looking for doesn't exist. It may have moved or the URL may be incorrect." />
      <section className="section white-section" style={{ textAlign: "center" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bronze)", color: "white", padding: "15px 24px", fontWeight: 800 }}>
          Return to Home <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}

/* ─── TESTIMONIALS SECTION ───────────────────────────────── */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "BlueLink came in and within two weeks had a clearer picture of our systems than our own team did. The modernization roadmap they delivered paid for itself in the first quarter.",
      name: "Marcus T.",
      title: "CTO",
      company: "Regional Financial Services Firm",
      initials: "MT",
    },
    {
      quote: "Our deployment pipeline was a disaster — manual, unreliable, and nobody understood it. BlueLink rebuilt the whole thing in six weeks. We went from releasing once a month to every week.",
      name: "Sandra O.",
      title: "VP Engineering",
      company: "Logistics & Field Operations Company",
      initials: "SO",
    },
    {
      quote: "We had security gaps we didn't even know about. BlueLink's assessment was eye-opening. They didn't just find the problems — they fixed them and made sure our team understood how to keep them fixed.",
      name: "David K.",
      title: "IT Director",
      company: "Healthcare Support Organization",
      initials: "DK",
    },
  ];

  return (
    <section style={{
      background: "var(--navy)",
      padding: "72px 7vw",
    }}>
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <p className="eyebrow" style={{ color: "var(--bronze)" }}>Client Results</p>
        <h2 style={{
          fontFamily: "Libre Baskerville, serif",
          fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
          color: "white",
          margin: "8px auto 12px",
          maxWidth: 640,
          lineHeight: 1.2,
        }}>
          What our clients say
        </h2>
        <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontSize: "0.95rem" }}>
          Real outcomes from real organizations we've helped modernize.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
        maxWidth: 1100,
        margin: "0 auto",
      }}>
        <style>{`
          @media (max-width: 720px) {
            .testimonial-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 1050px) and (min-width: 721px) {
            .testimonial-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
        {testimonials.map((t) => (
          <div key={t.name} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "28px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}>
            {/* Stars */}
            <div style={{ display: "flex", gap: 3 }}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--bronze)" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            {/* Quote */}
            <p style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.92rem",
              lineHeight: 1.75,
              flex: 1,
              fontStyle: "italic",
            }}>
              "{t.quote}"
            </p>
            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "rgba(169,94,33,0.25)",
                border: "1.5px solid rgba(169,94,33,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, color: "var(--bronze)", fontSize: "0.88rem", flexShrink: 0,
              }}>
                {t.initials}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "white", fontSize: "0.875rem" }}>{t.name}</p>
                <p style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)" }}>{t.title}, {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── PRIVACY POLICY PAGE ────────────────────────────────── */
function PrivacyPolicyPage() {
  usePageTitle("Privacy Policy");
  return (
    <>
      <PageHero label="Legal" title="Privacy Policy" text="How BlueLink Consults collects, uses, and protects your information." />
      <article className="article">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 32 }}>Last updated: 9 October 2026</p>

        <h2>1. Who We Are</h2>
        <p>BlueLink Consults ("we", "us", "our") provides technology consulting services. For our Nigeria operations, the company is Blue Link Consults Ltd, serving organizations across Nigeria; our US contact is based in Providence, Rhode Island. We can be contacted at <strong>info@bluelinkconsults.com</strong> or by phone at <strong>401-440-2434</strong>.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect information you provide directly to us, including when you fill in our contact or consultation form (name, business email, company name, and details of your enquiry), when you create a Client Portal account (name, email, company), and when you communicate with us by email or phone. Our hosting and service providers may process technical request information, such as IP address and device or browser details, for service delivery and security.</p>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to respond to your consultation requests and enquiries, to deliver and manage client engagements through our Client Portal, to send you updates relevant to your project, and to improve our website and services. We do not sell your personal information. We share relevant information with service providers to operate the website, store requests and arrange meetings.</p>

        <h2>4. Data Storage & Security</h2>
        <p>Inquiry records and client portal data are stored using Supabase in a United States hosting region. Our website is hosted on Vercel. Formspree is used to forward inquiry notifications, and Zoom Scheduler handles meeting bookings. These providers may process information outside Nigeria. We use access controls and appropriate technical and organizational measures to protect the information we handle. Please do not submit payment transaction records, credentials or sensitive system information through these public forms.</p>

        <h2>5. Cookies</h2>
        <p>The public website does not require an account to browse. Client portal and staff sign-in use browser storage to maintain authentication. External scheduling and social platforms apply their own cookie and privacy policies. Blocking authentication storage may prevent signed-in features from working.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, email us at <strong>info@bluelinkconsults.com</strong>. We will review your request in accordance with applicable data protection requirements. Inquiry information is kept while needed to respond and manage the relationship; relevant engagement records may be retained for contractual, legal or accounting purposes. Contact us for a review or deletion request.</p>

        <h2>7. Third-Party Services</h2>
        <p>Our website uses the following third-party services: Vercel (hosting), Supabase (database and authentication), Formspree (inquiry notifications), and Zoom (scheduling). Social links lead to Facebook, Instagram and LinkedIn. Stock photographs are sourced from Pexels and other credited providers. Each of these services has their own privacy policy governing their use of data.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will post the updated policy on this page with a revised date. Continued use of our website or services after any changes constitutes your acceptance of the updated policy.</p>

        <h2>9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <strong>info@bluelinkconsults.com</strong> or write to us at BlueLink Consults, Providence, RI 02909, United States.</p>
      </article>
    </>
  );
}

/* ─── TERMS OF SERVICE PAGE ──────────────────────────────── */
function TermsPage() {
  usePageTitle("Terms of Service");
  return (
    <>
      <PageHero label="Legal" title="Terms of Service" text="The terms and conditions governing use of BlueLink Consults services and website." />
      <article className="article">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 32 }}>Last updated: 9 October 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing our website at bluelinkconsults.com or using our Client Portal, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.</p>

        <h2>2. Services</h2>
        <p>BlueLink Consults provides application modernization, cloud infrastructure, DevOps automation, security, and related technology consulting services. The specific scope, deliverables, timeline, and fees for any engagement are defined in a separate Statement of Work or engagement agreement signed by both parties.</p>

        <h2>3. Client Portal</h2>
        <p>Access to our Client Portal is by invitation only. You are responsible for maintaining the confidentiality of your login credentials. You must not share your account with any other person. BlueLink Consults reserves the right to suspend or terminate portal access if these terms are breached.</p>

        <h2>4. Intellectual Property</h2>
        <p>All content on this website — including text, graphics, logos, and code — is the property of BlueLink Consults and is protected by applicable copyright and intellectual property laws. Work product delivered to clients as part of an engagement is governed by the terms of the relevant engagement agreement.</p>

        <h2>5. Confidentiality</h2>
        <p>BlueLink Consults treats all client information as strictly confidential. We will not disclose your business information, technical details, or project specifics to any third party without your written consent, except where required by law.</p>

        <h2>6. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, BlueLink Consults shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services. Our total liability for any claim arising from a consulting engagement shall not exceed the fees paid by the client for that specific engagement.</p>

        <h2>7. Website Use</h2>
        <p>You may use our website for lawful purposes only. You must not attempt to gain unauthorized access to any part of our website or Client Portal, transmit any harmful or malicious code, or use our website in any way that could damage, disable, or impair it.</p>

        <h2>8. Governing Law</h2>
        <p>These Terms of Service are governed by the laws of the State of Rhode Island, United States. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of Rhode Island.</p>

        <h2>9. Changes to These Terms</h2>
        <p>We may update these Terms of Service at any time. Updated terms will be posted on this page with a revised date. Continued use of our website or services after changes are posted constitutes acceptance of the updated terms.</p>

        <h2>10. Contact</h2>
        <p>Questions about these terms? Contact us at <strong>info@bluelinkconsults.com</strong> or call <strong>401-440-2434</strong>.</p>
      </article>
    </>
  );
}


/* ─── MODERNIZATION SIMULATOR PAGE ──────────────────────── */
function SimulatorPage() { return <StaffWorkspace />; }


function ConnectPage() {
  const connectUrl = "https://www.bluelinkconsults.com/connect";
  const website = "https://www.bluelinkconsults.com";
  const phoneDisplay = "+1 (401) 440-2434";
  const phoneLink = "+14014402434";
  const email = "info@bluelinkconsults.com";
  const linkedIn = "https://www.linkedin.com/company/bluelinkconsults/";

  const actions = [
    { icon: Globe2, title: "Visit Our Website", detail: "bluelinkconsults.com", href: website },
    { icon: Phone, title: "Call Us", detail: phoneDisplay, href: `tel:${phoneLink}` },
    { icon: Mail, title: "Email Us", detail: email, href: `mailto:${email}` },
    { icon: CalendarDays, title: "Book a Consultation", detail: "Schedule a free consultation", href: "/contact" },
    { icon: props => <SocialLogo name="LinkedIn" {...props} />, title: "Connect on LinkedIn", detail: "Follow us for updates and insights", href: linkedIn },
    { icon: Download, title: "Save Contact", detail: "Download BlueLink Consults vCard", href: "/BlueLink-Consults.vcf", download: true },
  ];

  return (
    <main className="connect-shell">
      <section className="connect-panel" id="top">
        <div className="connect-hero">
          <div className="connect-copy">
            <Link to="/" aria-label="Go to BlueLink Consults homepage" className="connect-logo-link">
              <img src="/bluelink-logo-mark.png" alt="BlueLink Consults" className="connect-logo" />
            </Link>
            <p className="connect-kicker">BlueLink Consults</p>
            <h1>Let’s Modernize <span>Your Business.</span></h1>
            <p className="connect-intro">
              We build modern websites, upgrade legacy applications, and deliver smart IT solutions that drive growth and efficiency.
            </p>
            <div className="connect-service-row" aria-label="Services">
              <span>Website Development</span>
              <span>App Modernization</span>
              <span>IT Consultation</span>
            </div>
          </div>

          <div className="connect-qr-card" aria-label="QR code to this page">
            <p>Scan to Connect</p>
            <img src="/bluelink-connect-qr.png" alt={`QR code for ${connectUrl}`} />
            <small>Open your camera and scan to connect instantly.</small>
          </div>
        </div>

        <div className="connect-actions" aria-label="Quick actions">
          {actions.map(({ icon: Icon, title, detail, href, download }) => (
            <a key={title} href={href} className="connect-action" {...(download ? { download: true } : {})}>
              <span className="connect-action-icon"><Icon size={24} strokeWidth={2.3} /></span>
              <span>
                <strong>{title}</strong>
                <em>{detail}</em>
              </span>
              <ArrowRight className="connect-arrow" size={22} aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="connect-footer-note">
          <MapPin size={19} />
          <span>Providence, RI 02909</span>
        </div>
        <p className="connect-signature">Building Solutions. Strengthening Connections.</p>
      </section>
    </main>
  );
}


/* ─── PRIVATE ROOFING OUTREACH DEMOS ────────────────────── */
const roofingOutreachCompanies = {
  "mr-roof-7k2p9": "Mr. Roof Inc.",
  "five-stars-4m8qx": "Five Stars Roofing Company",
  "peak-9v3rn": "Peak Roofing",
  "mike-gorman-6t2kw": "Mike Gorman Roofing Inc.",
  "bobbygs-8p4mz": "Bobbyg’s Roofing",
  "jmk-3x7qd": "JMK Roofing Inc.",
  "budget-5n9vc": "Budget Roofing Construction",
  "suali-joseph-2r6hf": "Suali Joseph & Sons Roofing Co.",
  "gorman-7w4kb": "Gorman Roofing",
  "jeremy-pennaccini-9q2mt": "Jeremy Pennaccini Roofing",
  "prime-state-4h8nx": "Prime State Roofing",
};

function RoofingOutreachDemo() {
  const { demoKey } = useParams();
  const company = roofingOutreachCompanies[demoKey];

  useEffect(() => {
    const previousTitle = document.title;
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = "noindex, nofollow, noarchive";
    document.title = company ? `Website Concept for ${company} | BlueLink Consults` : "Private Website Concept";
    return () => { document.title = previousTitle; if (created) robots.remove(); else robots.content = "index, follow"; };
  }, [company]);

  if (!company) return <NotFound />;

  return <main className="roof-demo">
    <section className="roof-demo-marquee" aria-label="We can build a website like this for your business and more">
      <div><span>WE CAN BUILD A WEBSITE LIKE THIS FOR YOUR BUSINESS AND MORE.</span><i>•</i><span aria-hidden="true">WE CAN BUILD A WEBSITE LIKE THIS FOR YOUR BUSINESS AND MORE.</span></div>
    </section>
    <section className="roof-demo-contact">
      <a href="https://www.bluelinkconsults.com"><small>VISIT OUR WEBSITE</small>www.bluelinkconsults.com ↗</a>
      <a href="tel:+14014402434"><small>CALL BLUELINK</small>(401) 440-2434</a>
      <a href="mailto:info@bluelinkconsults.com"><small>EMAIL US</small>info@bluelinkconsults.com</a>
    </section>
    <div className="roof-demo-personal"><span>PERSONALIZED WEBSITE CONCEPT FOR</span><strong>{company}</strong></div>
    <nav className="roof-demo-nav"><a href="#roof-top" className="roof-demo-logo">{company}<small>ROOFING WEBSITE CONCEPT</small></a><div><a href="#roof-services">Services</a><a href="#roof-proof">Why us</a><a href="#roof-quote" className="roof-demo-nav-cta">Free estimate</a></div></nav>
    <section className="roof-demo-hero" id="roof-top"><div><p>ROOF REPAIRS · REPLACEMENTS · INSPECTIONS</p><h1>{company}</h1><span>Professional roofing services for homes and businesses across Rhode Island and nearby Massachusetts.</span><div className="roof-demo-actions"><a href="#roof-quote">Request a free inspection</a><a href="#roof-services">Explore services ↓</a></div></div></section>
    <section className="roof-demo-proof" id="roof-proof"><div><b>20+</b><span>Years of local experience</span></div><div><b>4.9</b><span>Average customer rating</span></div><div><b>10 yr</b><span>Workmanship warranty</span></div><div><b>24 hr</b><span>Emergency response</span></div></section>
    <section className="roof-demo-services" id="roof-services"><p>WHAT WE DO</p><h2>Honest recommendations.<br/>Solid workmanship.</h2><div><article><b>01</b><h3>Roof replacement</h3><span>Complete asphalt-shingle systems with proper ventilation, flashing and cleanup.</span></article><article><b>02</b><h3>Repairs & leaks</h3><span>Targeted repairs for active leaks, storm damage, flashing and missing shingles.</span></article><article><b>03</b><h3>Gutters & ventilation</h3><span>Gutter replacement and attic airflow improvements that help protect your roof.</span></article></div></section>
    <section className="roof-demo-quote" id="roof-quote"><p>NO PRESSURE. NO SURPRISES.</p><h2>Know exactly what your roof needs.</h2><span>Request an inspection and receive photos, recommendations and a written estimate.</span><a href="tel:+14014402434">Call for a free estimate</a></section>
    <footer className="roof-demo-footer"><strong>{company}</strong><span>Personalized website demonstration by BlueLink Consults</span><a href="https://www.bluelinkconsults.com">www.bluelinkconsults.com</a></footer>
  </main>;
}

/* ─── APP ROOT ───────────────────────────────────────────── */
function AppInner() {
  const location = useLocation();
  const isPortal = location.pathname === "/client-login";
  const isConnectPage = location.pathname === "/connect";
  const isPrivateDemo = location.pathname.startsWith("/preview/roofing/");

  // Lock horizontal scroll globally — critical for mobile
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.maxWidth  = "100vw";
    document.body.style.overflowX = "hidden";
    document.body.style.maxWidth  = "100vw";
    document.body.style.width     = "100%";
    return () => {};
  }, []);

  return (
    <>
      {!isPortal && !isConnectPage && !isPrivateDemo && (isNigeriaSite ? <NigeriaHeader services={services} /> : <Header />)}
      {!isPortal && !isConnectPage && !isPrivateDemo && <div className="header-spacer" aria-hidden="true" />}
      <SiteMetadata />
      <ScrollToHash />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/client-login"            element={<ClientPortal />} />
          <Route path="/connect"                 element={<ConnectPage />} />
          <Route path="/preview/roofing/:demoKey" element={<RoofingOutreachDemo />} />
          <Route path="/"                        element={<Home />} />
          <Route path="/services"                element={<ServicesPage />} />
          <Route path="/services/:slug"          element={<ServiceDetail />} />
          <Route path="/insights"                element={<InsightsPage />} />
          <Route path="/blog/cbn-data-localisation-migration" element={<CbnArticle />} />
          <Route path="/insights/cbn-data-localisation-migration" element={<CbnArticle />} />
          <Route path="/insights/:slug"          element={<InsightDetail />} />
          <Route path="/proposals"               element={<ProposalsPage />} />
          <Route path="/proposals/:slug"         element={<ProposalViewer />} />
          <Route path="/solutions/data-localisation" element={<MigrationReadinessPage />} />
          <Route path="/resources/delivery-examples" element={<DeliveryExamplesPage />} />
          <Route path="/solutions"               element={<SolutionsPage />} />
          <Route path="/solutions/who-we-help"   element={<WhoWeHelpPage />} />
          <Route path="/solutions/eat-framework" element={<EATFrameworkPage />} />
          <Route path="/about/why-bluelink" element={<WhyInstitutionsChoose />} />
          <Route path="/about"                   element={isNigeriaSite ? <OurStory /> : <AboutPage />} />
          <Route path="/about/our-story"         element={isNigeriaSite ? <OurStory /> : <AboutPage />} />
          <Route path="/about/our-team"          element={<OurTeam />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/blog"                    element={isNigeriaSite ? <BlogPage /> : <InsightsPage />} />
          <Route path="/contact"                 element={<ContactPage />} />
          <Route path="/request-demo"            element={<DemoRequestPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/privacy-policy"          element={<PrivacyPolicyPage />} />
          <Route path="/simulator"               element={<SimulatorPage />} />
          <Route path="/terms"                   element={<TermsPage />} />
          <Route path="*"                        element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!isPortal && !isConnectPage && !isPrivateDemo && <Footer />}
    </>
  );
}

function App() {
  return (
    <InsightsProvider>
      <AppInner />
    </InsightsProvider>
  );
}

export default App;
