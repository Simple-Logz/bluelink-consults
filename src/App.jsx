import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
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
  Download,
  UserPlus,
} from "lucide-react";
import "./styles.css";
import { supabase } from "./supabaseClient";
import ClientPortal from "./ClientPortal";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const services = [
  {
    slug: "application-modernization",
    title: "Application Modernization",
    icon: ServerCog,
    summary: "Transform outdated business applications into secure, scalable, cloud-ready platforms.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2000&auto=format&fit=crop",
    body: "BlueLink Consult helps organizations move legacy applications away from fragile, outdated, difficult-to-maintain systems into modern, secure, scalable platforms. We assess your current application, identify business and technical risks, redesign the user experience, modernize APIs, improve performance, and create a practical path toward cloud-ready architecture.",
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
    summary: "Design reliable Azure, AWS, hybrid, and container-based environments.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
    body: "We design cloud environments that help businesses move away from unreliable infrastructure and toward secure, governed, scalable hosting foundations.",
    tools: ["Azure, AWS, hybrid cloud", "Landing zones and network design", "Terraform and Infrastructure as Code", "Containers, AKS, EKS, ECS, App Service", "Cloud cost governance and tagging", "Backup, recovery, and monitoring"],
    outcomes: ["Reliable cloud hosting", "Improved scalability", "Better cost visibility", "Stronger governance", "More secure infrastructure", "Clear migration roadmap"],
    blueLinkHelp: ["Review your current infrastructure and cloud readiness.", "Design secure and scalable target architecture.", "Create a phased migration plan.", "Implement automation, monitoring, and governance."],
  },
  {
    slug: "devops-automation",
    title: "DevOps Automation",
    icon: Workflow,
    summary: "Improve delivery speed with pipelines, IaC, automation, and release governance.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    body: "We help organizations replace manual deployment processes with repeatable, secure, automated delivery workflows.",
    tools: ["Azure DevOps", "GitHub Actions", "GitLab CI/CD", "Terraform", "Docker and container registries", "Deployment gates and rollback planning"],
    outcomes: ["Faster releases", "Lower deployment risk", "Repeatable environments", "Better rollback process", "Improved engineering confidence", "Clear release governance"],
    blueLinkHelp: ["Review current release process.", "Build CI/CD pipelines.", "Automate infrastructure deployment.", "Introduce approval gates and rollback plans."],
  },
  {
    slug: "security-identity",
    title: "Security & Identity",
    icon: ShieldCheck,
    summary: "Strengthen IAM, SSO, RBAC, Zero Trust, and audit readiness.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2000&auto=format&fit=crop",
    body: "We help businesses modernize identity, access, and security controls across applications and infrastructure.",
    tools: ["Microsoft Entra ID", "SSO and OAuth/OIDC", "RBAC and access reviews", "Conditional Access", "Customer identity patterns", "Audit and compliance controls"],
    outcomes: ["Stronger access control", "Reduced identity risk", "Improved SSO experience", "Better audit readiness", "Cleaner role governance", "Security-first architecture"],
    blueLinkHelp: ["Review identity and access model.", "Design SSO and RBAC improvements.", "Support Entra ID and external identity planning.", "Improve governance and security controls."],
  },
  {
    slug: "platform-reliability",
    title: "Platform Reliability",
    icon: Activity,
    summary: "Improve monitoring, logging, incident response, and operational visibility.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
    body: "We help teams understand system health, reduce incident confusion, and improve operational reliability.",
    tools: ["Application Insights", "Azure Monitor", "CloudWatch", "Datadog", "Log Analytics", "Dashboards and alerting"],
    outcomes: ["Clear operational visibility", "Faster troubleshooting", "Better alert quality", "Reduced downtime", "Documented support process", "Improved incident readiness"],
    blueLinkHelp: ["Assess monitoring gaps.", "Design dashboards and alerts.", "Improve log collection.", "Build incident response workflows."],
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
];

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
    author: item.author || "BlueLink Consult",
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
    { title: "About BlueLink Consult", category: "Page", path: "/about", description: "Learn about BlueLink Consult.", keywords: "about company modernization consultancy cloud infrastructure devops security" },
    { title: "Contact BlueLink Consult", category: "Page", path: "/contact", description: "Contact BlueLink Consult.", keywords: "contact consultation modernization review phone email inquiry" },
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
      ? `${title} | BlueLink Consult`
      : "BlueLink Consults — We Fix Old & Slow Applications";
  }, [title]);
}

/* ─── HEADER ─────────────────────────────────────────────── */
function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const searchRef = useRef(null);
  const isDesktop = useIsDesktop();
  const { insights: cmsInsights } = useInsights();
  const siteSearchIndex = buildSiteSearchIndex(cmsInsights);

  const close = () => {
    setOpen(false);
    setServicesOpen(false);
    setSolutionsOpen(false);
    setInsightsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleServices = () => { setServicesOpen((c) => !c); setSolutionsOpen(false); setInsightsOpen(false); setSearchOpen(false); };
  const toggleSolutions = () => { setSolutionsOpen((c) => !c); setServicesOpen(false); setInsightsOpen(false); setSearchOpen(false); };
  const toggleInsights = () => { setInsightsOpen((c) => !c); setServicesOpen(false); setSolutionsOpen(false); setSearchOpen(false); };
  const toggleSearch = () => { setSearchOpen((c) => !c); setServicesOpen(false); setSolutionsOpen(false); setInsightsOpen(false); setSearchQuery(""); };

  useEffect(() => {
    function handler(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSearchResults = searchQuery.trim().length > 1
    ? siteSearchIndex.filter((item) => {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q)
          || item.category.toLowerCase().includes(q)
          || item.description.toLowerCase().includes(q)
          || item.keywords.toLowerCase().includes(q);
      })
    : [];

  return (
    <>
      {/* Mobile overlay — tap anywhere outside menu to close it */}
      {open && (
        <div
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 8998,
            background: "rgba(5,11,45,0.35)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
          aria-hidden="true"
        />
      )}
    <header className="site-header">
      <Link to="/" className="brand-logo-wrap brand-home-link" onClick={close} aria-label="Go to BlueLink Consults homepage">
        <img
          src="/bluelink-logo-mark.png"
          alt="BlueLink Consults"
          className="brand-logo-mark"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "block";
          }}
        />
        <span className="brand-wordmark">
          <strong>Blue<span>Link</span></strong>
          <small>Consults</small>
        </span>
        <span className="brand-text-fallback" style={{ display: "none" }}>BlueLink Consults</span>
      </Link>

      <nav className={open ? "main-nav open" : "main-nav"}>
        <div
          className="nav-dropdown"
          onMouseEnter={() => isDesktop && setServicesOpen(true)}
          onMouseLeave={() => isDesktop && setServicesOpen(false)}
        >
          <button type="button" onClick={toggleServices} aria-expanded={servicesOpen} aria-haspopup="true">
            Services <ChevronDown size={15} />
          </button>
          <div className={servicesOpen ? "dropdown-menu show" : "dropdown-menu"}>
            <span className="dropdown-heading">Modernization Services</span>
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link key={s.slug} to={`/services/${s.slug}`} onClick={close} className="simple-dropdown-item">
                  <Icon size={17} />
                  <strong>{s.title}</strong>
                </Link>
              );
            })}
          </div>
        </div>

        <div
          className="nav-dropdown"
          onMouseEnter={() => isDesktop && setSolutionsOpen(true)}
          onMouseLeave={() => isDesktop && setSolutionsOpen(false)}
        >
          <button type="button" onClick={toggleSolutions} aria-expanded={solutionsOpen} aria-haspopup="true">
            Solutions <ChevronDown size={15} />
          </button>
          <div className={solutionsOpen ? "dropdown-menu show" : "dropdown-menu"}>
            <span className="dropdown-heading">Solutions</span>
            <Link to="/solutions/who-we-help" onClick={close} className="simple-dropdown-item">
              <Building2 size={17} />
              <strong>Who We Help</strong>
            </Link>
            <Link to="/solutions/eat-framework" onClick={close} className="simple-dropdown-item">
              <Target size={17} />
              <strong>The EAT Framework</strong>
            </Link>
          </div>
        </div>

        <div
          className="nav-dropdown"
          onMouseEnter={() => isDesktop && setInsightsOpen(true)}
          onMouseLeave={() => isDesktop && setInsightsOpen(false)}
        >
          <button type="button" onClick={toggleInsights} aria-expanded={insightsOpen} aria-haspopup="true">
            Insights <ChevronDown size={15} />
          </button>
          <div className={insightsOpen ? "dropdown-menu compact show" : "dropdown-menu compact"}>
            <span className="dropdown-heading">Resources</span>
            {cmsInsights.map((i) => (
              <Link key={i.slug} to={`/insights/${i.slug}`} onClick={close}>
                <FileText size={16} />
                <span>
                  <strong>{i.title}</strong>
                  <small>{i.category} · {i.minutes}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <NavLink to="/about" onClick={close}>About</NavLink>
        <NavLink to="/contact" onClick={close}>Contact</NavLink>

        <div className="search-wrapper" ref={searchRef}>
          {isDesktop ? (
            <>
              <button type="button" className="search-button" onClick={toggleSearch} aria-label="Search">
                <Search size={19} />
              </button>
              {searchOpen && (
                <div className="search-dropdown">
                  <div className="search-input-wrap">
                    <Search size={16} />
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search services, insights, DevOps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {searchQuery.trim().length > 1 && (
                    <div className="search-results">
                      {filteredSearchResults.length > 0 ? (
                        filteredSearchResults.map((item) => (
                          <Link key={item.path} to={item.path} onClick={() => { setSearchQuery(""); setSearchOpen(false); close(); }}>
                            <strong>{item.title}</strong>
                            <small>{item.category} — {item.description}</small>
                          </Link>
                        ))
                      ) : (
                        <div className="no-search-results">No results found.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="search-dropdown">
              <div className="search-input-wrap">
                <Search size={16} />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search services, insights, DevOps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery.trim().length > 1 && (
                <div className="search-results">
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((item) => (
                      <Link key={item.path} to={item.path} onClick={() => { setSearchQuery(""); close(); }}>
                        <strong>{item.title}</strong>
                        <small>{item.category} — {item.description}</small>
                      </Link>
                    ))
                  ) : (
                    <div className="no-search-results">No results found.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <NavLink to="/simulator" onClick={close} style={{
          display:"inline-flex", alignItems:"center", gap:6,
          background:"linear-gradient(135deg,#0d2a1a,#0a1e10)",
          color:"#1d9e75",
          border:"1px solid #1d9e75",
          padding:"7px 14px",
          borderRadius:20,
          fontWeight:700,
          fontSize:"0.82rem",
          textDecoration:"none",
          letterSpacing:"0.02em",
          animation:"simPulse 2.5s ease-in-out infinite",
          flexShrink:0,
        }}>
          <Zap size={13} style={{ color:"#1d9e75", flexShrink:0 }} />
          Try Simulator
          <span style={{ fontSize:"0.65rem", background:"#1d9e75", color:"#0a1e10", padding:"1px 5px", borderRadius:4, fontWeight:800, letterSpacing:"0.06em" }}>NEW</span>
        </NavLink>
        <style>{`@keyframes simPulse{0%,100%{box-shadow:0 0 0 0 rgba(29,158,117,0.4)}50%{box-shadow:0 0 0 6px rgba(29,158,117,0)}}`}</style>
        <NavLink to="/client-login" className="login-btn" onClick={close}>Client Login</NavLink>
        <NavLink to="/contact#consultation" className="contact-btn" onClick={close}>Contact Us</NavLink>
      </nav>

      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
    </>
  );
}

/* ─── PAGE TRANSITION & SCROLL ───────────────────────────── */
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
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



function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>BlueLink Consults</strong>
        <p>We fix old and slow applications — cloud advisory, DevOps automation, security, identity, and operational reliability for growing organizations.</p>
      </div>
      <div>
        <Link to="/services/application-modernization">Application Modernization</Link>
        <Link to="/services/cloud-infrastructure">Cloud Infrastructure</Link>
        <Link to="/services/security-identity">Security &amp; Identity</Link>
        <Link to="/insights">Insights</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
      </div>
      <small>© 2026 BlueLink Consults. All rights reserved. · Providence, RI, USA · info@bluelinkconsults.com</small>
    </footer>
  );
}

/* ─── CTA BANNER (between Hero and Process on homepage) ──── */
function CTABanner() {
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
            body: "Outdated software is the number one way hackers break in. We close those doors permanently.",
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
      <Link to="/contact#consultation" className="bl-cta-btn">
        Get a free 20-minute consultation →
      </Link>

      <p style={{ fontSize: 12, color: "#0EA5E9", marginTop: 10, marginBottom: 0 }}>
        www.bluelinkconsults.com
      </p>
    </section>
  );
}

/* ─── HOME ───────────────────────────────────────────────── */
function WhoWeServeStrip() {
  return (
    <section style={{
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
          <Link key={ind.name} to="/contact#consultation" className="who-card">
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
        Launch the simulator <ArrowRight size={18} />
      </Link>
      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", marginTop: 14 }}>
        Free · No signup required · Results in under 2 minutes
      </p>
    </section>
  );
}

function Home() {
  usePageTitle(null);
  return (
    <>
      <Hero />
      <CTABanner />
      <WhoWeServeStrip />
      <Process />
      <SimulatorTeaser />
      {/* <TestimonialsSection /> */}{/* TESTIMONIALS — uncomment when ready */}
    </>
  );
}

function Hero() {
  return (
    <section className="hero-section-v2">
      <style>{`
        .hero-section-v2 {
          position: relative;
          overflow: hidden;
          background: var(--cream);
          display: flex;
          align-items: stretch;
          min-height: 560px;
        }
        .hero-bg-v2 {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(5,11,45,0.18), rgba(5,11,45,0.08)),
            url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2400&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }
        .hero-message-v2 {
          position: relative;
          z-index: 1;
          margin-left: auto;
          margin-right: 6vw;
          width: min(600px, 52vw);
          background: rgba(244, 240, 235, 0.95);
          padding: 52px 44px;
          backdrop-filter: blur(8px);
          box-shadow: 0 25px 70px rgba(5,11,45,0.2);
          align-self: center;
        }
        .hero-message-v2 h1 {
          font-family: 'Libre Baskerville', serif;
          font-size: clamp(1.9rem, 3.2vw, 3.4rem);
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: var(--bronze);
          margin: 0 0 18px;
        }
        .hero-message-v2 p {
          font-size: 1.02rem;
          line-height: 1.72;
          margin: 0 0 24px;
          color: var(--text-dark);
        }
        .hero-message-v2 a {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--bronze);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          padding: 15px 38px;
          border-radius: 9px;
          border: 0;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(169,94,33,0.35);
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        .hero-message-v2 a:hover {
          background: var(--bronze-dark);
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        @media (max-width: 720px) {
          .hero-section-v2 {
            flex-direction: column;
            min-height: auto;
          }
          .hero-bg-v2 {
            position: relative;
            inset: auto;
            height: 220px;
            flex-shrink: 0;
          }
          .hero-message-v2 {
            width: 100%;
            margin: 0;
            padding: 30px 22px;
            box-shadow: none;
            backdrop-filter: none;
          }
          .hero-message-v2 h1 {
            font-size: clamp(1.7rem, 7vw, 2.2rem);
          }
          .hero-message-v2 a {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="hero-bg-v2" />

      <motion.div
        className="hero-message-v2"
        initial={{ opacity: 0, x: 26 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
      >
        <h1>Modernize your applications. Accelerate your business performance.</h1>
        <p>Your website is slow. Your systems break. Your team wastes hours on things that should be automatic. We come in, find what's broken, and rebuild it properly — so your business runs the way it should.</p>
        <Link to="/contact#consultation">Get a Free 20-Minute Consultation <ArrowRight size={19} /></Link>
      </motion.div>
    </section>
  );
}

function HomeValueProps() {
  const props = [
    { icon: ServerCog, title: "Application Modernization", text: "Move legacy systems to modern, secure, scalable platforms without disrupting your business." },
    { icon: Cloud, title: "Cloud Infrastructure", text: "Design reliable, governed, cost-controlled environments on Azure, AWS, or hybrid cloud." },
    { icon: Workflow, title: "DevOps Automation", text: "Replace fragile manual deployments with automated, repeatable, auditable delivery pipelines." },
    { icon: ShieldCheck, title: "Security & Identity", text: "Strengthen access controls, SSO, RBAC, and audit posture across your entire environment." },
    { icon: Activity, title: "Platform Reliability", text: "Build observability, alerting, and incident response so your team can operate with confidence." },
    { icon: Database, title: "Data & Integration", text: "Connect systems, modernize APIs, and automate the workflows that power your operations." },
  ];
  return (
    <section className="section white-section">
      <div className="section-heading narrow">
        <p className="eyebrow">What We Do</p>
        <h2>End-to-end modernization for growing organizations</h2>
        <p>From aging applications to cloud infrastructure, DevOps, security, and data — BlueLink Consult helps you build a technology foundation that supports long-term growth.</p>
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
        <p>Every engagement BlueLink Consult delivers follows our structured EAT framework — a proven three-phase approach that ensures we deeply understand your business before recommending any technology change.</p>
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
        <h2>The right modernization solution for every organization we serve</h2>
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
        <p>Whether your business is struggling with outdated systems, manual processes, weak security, or unreliable infrastructure, BlueLink Consult helps define a practical path forward.</p>
      </div>
      <div className="solution-list">
        {industries.map((industry) => (
          <Link to="/contact#consultation" key={industry}>
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
      <PageHero label="Services" title="Explore BlueLink Consult services." text="We help organizations improve the full technical foundation: applications, infrastructure, security, DevOps, data, and operations." />
      <ServicesPreview />
    </>
  );
}

function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug) || services[0];
  const Icon = service.icon;
  usePageTitle(service.title);
  return (
    <>
      <section className="service-hero">
        <div className="service-hero-copy">
          <p className="eyebrow">Service Detail</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
        </div>
        <div className="service-hero-image" style={{ backgroundImage: `url(${service.image})` }} />
      </section>
      <section className="service-detail-section">
        <div className="service-detail-main">
          <div className="service-icon-large"><Icon size={40} /></div>
          <h2>What {service.title} means for your business</h2>
          <p>{service.body}</p>
          <div className="detail-grid">
            <div className="detail-card">
              <h3>Key outcomes to expect:</h3>
              <div className="detail-list">
                {service.outcomes.map((item) => (
                  <span key={item}><CheckCircle2 size={17} /> {item}</span>
                ))}
              </div>
            </div>
            <div className="detail-card">
              <h3>Tools and platforms commonly used:</h3>
              <div className="detail-list">
                {service.tools.map((item) => (
                  <span key={item}><CheckCircle2 size={17} /> {item}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="blue-help-panel">
            <h2>How BlueLink Consult can help</h2>
            <p>We do not only make systems look better. We help redesign the technical foundation so the application becomes easier to operate, secure, scale, and improve over time.</p>
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
          <h3>Start with a modernization review</h3>
          <p>We can begin with a focused review of your current environment and provide a practical modernization roadmap.</p>
          <Link to="/contact#consultation">Request Review <ArrowRight size={17} /></Link>
        </aside>
      </section>
    </>
  );
}

/* ─── SOLUTIONS ──────────────────────────────────────────── */
function SolutionsPage() {
  usePageTitle("Solutions");
  return (
    <>
      <PageHero
        label="Solutions"
        title="Technology solutions built around your business."
        text="BlueLink Consult helps growing organizations modernize systems, strengthen infrastructure, and build digital foundations that support long-term growth."
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
            <p>Our proven three-phase delivery methodology — Engage, Assess, Transform — ensures we deeply understand your business before recommending or deploying any technology change.</p>
            <Link to="/solutions/eat-framework">Explore the Framework <ArrowRight size={18} /></Link>
          </article>
        </div>
      </section>
    </>
  );
}

function WhoWeHelpPage() {
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
              <Link to="/contact#consultation">Discuss Your Needs <ArrowRight size={18} /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section" style={{ background:"var(--navy, #050e1f)", padding:"60px 0" }}>
        <div style={{ maxWidth:700, margin:"0 auto", padding:"0 48px", textAlign:"center" }}>
          <p className="eyebrow" style={{ color:"var(--bronze)" }}>Ready to start?</p>
          <h2 style={{ fontFamily:"var(--font-display)", color:"white", marginBottom:16, fontSize:"clamp(1.6rem,2.8vw,2.2rem)" }}>Not sure which category fits you?</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", marginBottom:28, lineHeight:1.7 }}>Most organizations we work with don't fit a single box. If your challenge is technology-related, we can help — regardless of sector. Start with a consultation and we'll assess where you stand.</p>
          <Link to="/contact#consultation" style={{ display:"inline-flex", alignItems:"center", gap:8, background:"var(--bronze)", color:"white", padding:"13px 26px", fontWeight:800, textDecoration:"none" }}>
            Request a Free Consultation <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

function EATFrameworkPage() {
  usePageTitle("EAT Framework");
  const phases = [
    {
      number: "01", letter: "E", label: "Engage", tagline: "We start by truly understanding you.",
      color: "#2563eb", colorLight: "rgba(37,99,235,0.08)", colorBorder: "rgba(37,99,235,0.2)",
      description: "Before any assessment or solution, we invest time in understanding your business — your goals, your customers, your team culture, and your constraints. This phase is not about technology. It is about alignment, trust, and building the shared understanding that makes transformation possible.",
      steps: [
        "Stakeholder discovery sessions with leadership and operations teams",
        "Business goals, KPI definition, and success criteria alignment",
        "Customer journey mapping and experience gap identification",
        "Scope definition, governance model, and communication rhythm setup",
        "Risk appetite and change readiness assessment",
      ],
      outcome: "A shared, documented understanding of where you are, where you want to go, and what success looks like — agreed by all stakeholders before any work begins.",
    },
    {
      number: "02", letter: "A", label: "Assess", tagline: "We diagnose before we prescribe.",
      color: "#7c3aed", colorLight: "rgba(124,58,237,0.08)", colorBorder: "rgba(124,58,237,0.2)",
      description: "We conduct a rigorous, structured review of your current technology environment. This is where we get honest about technical debt, security exposure, cost inefficiencies, and scalability constraints — giving you a clear picture of what you have, what it costs, and what it will take to modernize it responsibly.",
      steps: [
        "Full application portfolio audit — architecture, dependencies, and maintainability",
        "Infrastructure review — cloud, on-premise, hybrid, containerization readiness",
        "Security posture assessment — IAM, access controls, compliance gaps, vulnerabilities",
        "Cost analysis — cloud spend, licensing, operational overhead, and waste identification",
        "Scalability and performance bottleneck mapping",
        "Technical debt scoring and risk prioritization matrix",
      ],
      outcome: "A clear, prioritized modernization roadmap with risk scores, cost projections, phased recommendations, and honest trade-off analysis — before a single line of code is changed.",
    },
    {
      number: "03", letter: "T", label: "Transform", tagline: "We execute with precision, speed, and accountability.",
      color: "#c9a84c", colorLight: "rgba(201,168,76,0.08)", colorBorder: "rgba(201,168,76,0.25)",
      description: "With alignment secured and the environment fully understood, we execute. Using modern tools, proven architectures, and agile delivery practices, we modernize your systems phase by phase — delivering measurable value at every milestone and leaving your team fully equipped to operate and extend what we build.",
      steps: [
        "Phased implementation plan with milestone-based delivery and sign-off gates",
        "CI/CD pipeline implementation for fast, reliable, auditable deployments",
        "Cloud migration, infrastructure automation, and environment standardization",
        "Security hardening — identity modernization, RBAC enforcement, access governance",
        "Monitoring, observability, alerting, and incident response configuration",
        "Knowledge transfer, runbook documentation, and team enablement",
      ],
      outcome: "A modernized, secure, scalable technology platform — delivered on time, within budget, with your team fully equipped to operate it and your leadership with full visibility at every step.",
    },
  ];

  return (
    <>
      <PageHero
        label="Our Delivery Framework"
        title="The EAT Framework — How BlueLink Consult Delivers Results."
        text={
          <>
            EAT stands for <strong>Engage</strong>, <strong>Assess</strong>, and{" "}
            <strong>Transform</strong>. It is our proven methodology for understanding
            your business, evaluating your technology landscape, and delivering
            measurable transformation outcomes.
          </>
        }
      />
      <section className="section white-section">
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
          <p className="eyebrow">Why EAT?</p>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,2.5vw,2rem)", marginBottom:16 }}>Most technology failures are not technology problems.</h2>
          <p style={{ color:"#5d687d", lineHeight:1.8, fontSize:"1rem", marginBottom:16 }}>They are alignment problems. Solutions deployed without understanding the business. Migrations executed without understanding the dependencies. Security controls imposed without understanding how people actually work. The EAT Framework exists to prevent all of that.</p>
          <p style={{ color:"#5d687d", lineHeight:1.8, fontSize:"1rem" }}>Every BlueLink Consult engagement — regardless of size or service — follows this same three-phase process. It is how we ensure every transformation we deliver is grounded in reality, aligned to business goals, and built to last.</p>
        </div>
      </section>
      <section className="section" style={{ background:"#f8f7f5" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 48px" }}>
          {phases.map((phase, idx) => (
            <div key={phase.letter} style={{ marginBottom: idx < phases.length - 1 ? 48 : 0 }}>
              <div className="eat-full-phase-card" style={{ background:"white", border:`2px solid ${phase.colorBorder}`, borderRadius:16, padding:"40px 44px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:16, right:32, fontFamily:"var(--font-display)", fontSize:"8rem", fontWeight:900, color:phase.color, opacity:0.05, lineHeight:1 }}>{phase.number}</div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:24, marginBottom:24 }}>
                  <div style={{ width:60, height:60, borderRadius:"50%", background:phase.colorLight, border:`2px solid ${phase.colorBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:"1.5rem", fontWeight:700, color:phase.color, flexShrink:0 }}>
                    {phase.letter}
                  </div>
                  <div>
                    <p style={{ fontSize:"0.72rem", fontWeight:800, color:phase.color, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:4 }}>{phase.number} · {phase.label}</p>
                    <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,2vw,1.8rem)", color:"#0d1b2e", marginBottom:6 }}>{phase.tagline}</h2>
                  </div>
                </div>
                <p style={{ color:"#5d687d", lineHeight:1.8, fontSize:"0.95rem", marginBottom:24 }}>{phase.description}</p>
                <div style={{ display:"grid", gap:10, marginBottom:24 }}>
                  {phase.steps.map((step, i) => (
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background:phase.colorLight, border:`1px solid ${phase.colorBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:800, color:phase.color, flexShrink:0, marginTop:2 }}>{i+1}</div>
                      <p style={{ fontSize:"0.875rem", color:"#374151", lineHeight:1.6 }}>{step}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background:phase.colorLight, border:`1px solid ${phase.colorBorder}`, borderRadius:10, padding:"14px 18px", borderLeft:`4px solid ${phase.color}` }}>
                  <p style={{ fontSize:"0.72rem", fontWeight:800, color:phase.color, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>Outcome</p>
                  <p style={{ fontSize:"0.875rem", color:"#5d687d", lineHeight:1.65 }}>{phase.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section" style={{ background:"var(--navy, #050e1f)", padding:"72px 0" }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"0 48px", textAlign:"center" }}>
          <p className="eyebrow" style={{ color:"var(--bronze)" }}>Ready to begin?</p>
          <h2 style={{ fontFamily:"var(--font-display)", color:"white", marginBottom:16, fontSize:"clamp(1.6rem,2.5vw,2.2rem)" }}>Start with Engage — it costs you nothing but a conversation.</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", marginBottom:32, lineHeight:1.7 }}>The first phase of every BlueLink Consult engagement is a discovery session. No obligation. No sales pressure. Just an honest conversation about your technology, your goals, and whether we are the right fit.</p>
          <Link to="/contact#consultation" style={{ display:"inline-flex", alignItems:"center", gap:10, background:"var(--bronze)", color:"white", padding:"14px 28px", fontWeight:800, textDecoration:"none" }}>
            Schedule Your Discovery Session <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ─── INSIGHTS ───────────────────────────────────────────── */
function InsightsPage() {
  usePageTitle("Insights");
  return (
    <>
      <PageHero label="Insights" title="Practical guidance for application modernization and cloud readiness." text="Short business-focused guides to help leaders think about technology improvement with clarity." />
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
        <Link className="article-cta" to="/contact#consultation">Discuss this with BlueLink <ArrowRight size={17} /></Link>
      </article>
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

      {/* ── ORIGIN STORY ── */}
      <section style={{ background: "white", padding: "72px 7vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, maxWidth: 1100, margin: "0 auto", alignItems: "center" }}>
          <style>{`
            @media (max-width: 720px) {
              .about-story-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            }
          `}</style>
          <div className="about-story-grid">
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
          {/* Stats column */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { n: "10+",   l: "Years of combined technology experience" },
              { n: "12+",   l: "Industries served across the US and internationally" },
              { n: "98%",   l: "Client satisfaction rate across all engagements" },
              { n: "6",     l: "Core practice areas covering the full technology stack" },
            ].map(({ n, l }) => (
              <div key={n} style={{
                background: "var(--cream)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "28px 22px",
                textAlign: "center",
              }}>
                <p style={{ fontFamily: "Libre Baskerville, serif", fontSize: "2.6rem", fontWeight: 700, color: "var(--bronze)", lineHeight: 1, marginBottom: 10 }}>{n}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.55 }}>{l}</p>
              </div>
            ))}
          </div>
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
function ContactPage() {
  usePageTitle("Contact");
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ID
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
    : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!formspreeEndpoint) {
      setFormError("Form is not configured. Please email info@bluelinkconsults.com directly.");
      return;
    }
    setFormLoading(true);
    try {
      const res = await fetch(formspreeEndpoint, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (res.ok) { e.currentTarget.reset(); setSubmitted(true); }
      else {
        const data = await res.json().catch(() => null);
        setFormError(data?.errors?.[0]?.message || "Your message could not be sent. Please email info@bluelinkconsults.com.");
      }
    } catch {
      setFormError("Network error. Please check your connection or email info@bluelinkconsults.com.");
    } finally { setFormLoading(false); }
  }

  return (
    <>
      <PageHero label="Contact" title="Let's discuss what is slowing your technology down." text="Share your application, infrastructure, cloud, security, DevOps, or reliability challenge." />
      <section className="contact-section" id="consultation">
        <div className="contact-copy">
          <p className="eyebrow">Contact BlueLink Consult</p>
          <h2>Start with a modernization conversation.</h2>
          <p>Submit your inquiry below. We will respond within one business day.</p>
          <div className="contact-details">
            <span><Mail size={17} /> info@bluelinkconsults.com</span>
            <span><Phone size={17} /> 401-440-2434</span>
            <span><MapPin size={17} /> Providence, RI, 02909 United States</span>
            <span><Building2 size={17} /> Serving growing organizations and business teams</span>
          </div>
        </div>
        {submitted ? (
          <div className="success-box">
            <CheckCircle2 size={40} />
            <h3>Inquiry sent successfully</h3>
            <p>Thank you. Your message was successfully delivered to BlueLink Consult.</p>
            <button onClick={() => { setSubmitted(false); setFormError(""); }}>Submit another inquiry</button>
          </div>
        ) : (
          <form className="contact-form" id="consultation-form" onSubmit={handleSubmit}>
            {formError && <div className="auth-message">{formError}</div>}
            <input type="hidden" name="_subject" value="New BlueLink Consult website inquiry" />
            <label>Full Name<input required name="name" type="text" placeholder="Your name" /></label>
            <label>Business Email<input required name="email" type="email" placeholder="you@company.com" /></label>
            <label>Company<input name="company" type="text" placeholder="Company name" /></label>
            <div style={{ display: "grid", gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: "0.92rem" }}>What are your biggest pain points? <span style={{ color: "var(--bronze)" }}>(Check all that apply)</span></span>
              <p style={{ fontSize: "0.82rem", color: "var(--muted)", margin: 0 }}>This helps us come prepared with the right answers for your consultation.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginTop: 6 }}>
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
                  <label key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", fontWeight: 400, fontSize: "0.88rem", color: "var(--text-dark)" }}>
                    <input
                      type="checkbox"
                      name="painPoints"
                      value={item}
                      style={{ marginTop: 2, accentColor: "var(--bronze)", width: 15, height: 15, flexShrink: 0 }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <label>Message<textarea required name="message" rows="4" placeholder="Tell us a bit more about your situation..." /></label>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Sending..." : "Submit Inquiry"} <Send size={18} />
            </button>
            <small>Your inquiry will be securely delivered to BlueLink Consult.</small>
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
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 32 }}>Last updated: June 2026</p>

        <h2>1. Who We Are</h2>
        <p>BlueLink Consults ("we", "us", "our") is an application modernization and cloud advisory consultancy based in Providence, RI, USA. We can be contacted at <strong>info@bluelinkconsults.com</strong> or by phone at <strong>401-440-2434</strong>.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect information you provide directly to us, including when you fill in our contact or consultation form (name, business email, company name, and details of your enquiry), when you create a Client Portal account (name, email, company), and when you communicate with us by email or phone. We also collect standard website analytics data (pages visited, time on site, device type) through anonymous analytics tools.</p>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to respond to your consultation requests and enquiries, to deliver and manage client engagements through our Client Portal, to send you updates relevant to your project, and to improve our website and services. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>

        <h2>4. Data Storage & Security</h2>
        <p>Client Portal data is stored securely using Supabase, a SOC 2 compliant cloud database platform hosted in the United States. Contact form submissions are processed through Formspree. We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse.</p>

        <h2>5. Cookies</h2>
        <p>Our website uses minimal cookies required for basic functionality. We do not use advertising or tracking cookies. You can disable cookies in your browser settings without affecting your ability to use the site.</p>

        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, email us at <strong>info@bluelinkconsults.com</strong>. We will respond within 30 days.</p>

        <h2>7. Third-Party Services</h2>
        <p>Our website uses the following third-party services: Supabase (database and authentication), Formspree (contact form processing), and Unsplash (stock photography). Each of these services has their own privacy policy governing their use of data.</p>

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
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: 32 }}>Last updated: June 2026</p>

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
function SimulatorPage() {
  usePageTitle("Modernization Simulator");
  const simRef = useRef(null);

  useEffect(() => {
    const el = simRef.current;
    if (!el) return;

    const LANGS=[
      {id:"cobol",l:"COBOL",s:"~45yr legacy"},
      {id:"vb6",l:"Visual Basic 6",s:"~28yr legacy"},
      {id:"java",l:"Java EE monolith",s:"~18yr legacy"},
      {id:"php",l:"PHP legacy",s:"~14yr legacy"},
      {id:"net",l:".NET Framework",s:"~12yr legacy"},
      {id:"cpp",l:"C / C++",s:"~20yr legacy"},
      {id:"python",l:"Python (legacy)",s:"~10yr legacy"},
      {id:"ruby",l:"Ruby on Rails",s:"~12yr legacy"},
      {id:"perl",l:"Perl",s:"~25yr legacy"},
      {id:"cold",l:"ColdFusion",s:"~20yr legacy"},
      {id:"node",l:"Node.js (dated)",s:"~6yr legacy"},
      {id:"as400",l:"AS/400 / RPG",s:"~35yr legacy"},
    ];
    const SVCS=[
      {id:"db",l:"On-prem database",s:"Oracle / SQL Server"},
      {id:"auth",l:"Custom auth layer",s:"no SSO or MFA"},
      {id:"api",l:"SOAP / XML APIs",s:"legacy protocol"},
      {id:"files",l:"Local file storage",s:"no cloud storage"},
      {id:"cache",l:"No caching layer",s:"slow responses"},
      {id:"email",l:"Raw SMTP email",s:"unreliable delivery"},
      {id:"rpts",l:"Crystal Reports",s:"2000s-era reporting"},
      {id:"queue",l:"Manual job queues",s:"error-prone batch"},
      {id:"mono",l:"Monolithic deployment",s:"single deploy unit"},
      {id:"ftp",l:"FTP file transfers",s:"no encryption"},
      {id:"ldap",l:"LDAP / Active Directory",s:"on-prem identity"},
      {id:"vms",l:"On-prem virtual servers",s:"costly, fragile"},
      {id:"manual",l:"Manual deployments",s:"no automation"},
      {id:"paper",l:"Paper-based workflows",s:"no digitization"},
      {id:"erp",l:"Legacy ERP system",s:"SAP / Oracle older"},
      {id:"crm",l:"Legacy CRM",s:"Siebel / ACT!"},
    ];
    const TOOLS=[
      {id:"dock",l:"Docker",s:"Containerize apps"},
      {id:"k8s",l:"Kubernetes",s:"Orchestrate at scale"},
      {id:"ci",l:"CI/CD pipeline",s:"Automate deployments"},
      {id:"cloud",l:"Cloud migration",s:"AWS / Azure / GCP"},
      {id:"rest",l:"REST APIs",s:"Replace SOAP / XML"},
      {id:"sso",l:"SSO & OAuth 2.0",s:"Modern identity"},
      {id:"obs",l:"Observability stack",s:"Metrics, logs, traces"},
      {id:"micro",l:"Microservices",s:"Decompose monolith"},
      {id:"db2",l:"Cloud database",s:"PostgreSQL / Aurora"},
      {id:"cdn",l:"CDN & edge caching",s:"Global performance"},
      {id:"iac",l:"Infrastructure as Code",s:"Terraform / Pulumi"},
      {id:"sec",l:"Security hardening",s:"Zero-trust + WAF"},
      {id:"api2",l:"API gateway",s:"Rate limiting & routing"},
      {id:"data",l:"Data pipeline modern.",s:"ETL to streaming"},
      {id:"mq",l:"Message queues",s:"Kafka / RabbitMQ"},
      {id:"ai",l:"AI / ML integration",s:"Intelligent automation"},
    ];
    const DLOGS=[
      {t:"r",m:"Initializing BlueLink deploy engine..."},
      {t:"l",m:"Scanning legacy codebase and dependencies..."},
      {t:"k",m:"Dependency graph resolved successfully"},
      {t:"r",m:"Building container image (linux/amd64)..."},
      {t:"k",m:"Container image built and verified"},
      {t:"r",m:"Provisioning cloud infrastructure..."},
      {t:"k",m:"VPC, subnets and security groups configured"},
      {t:"k",m:"IAM roles and policies applied"},
      {t:"r",m:"Deploying application services..."},
      {t:"k",m:"API gateway — 3/3 replicas healthy"},
      {t:"k",m:"Auth service — OAuth 2.0 active"},
      {t:"k",m:"Database migrated — zero downtime confirmed"},
      {t:"r",m:"Running post-deployment health checks..."},
      {t:"k",m:"All endpoints responding — latency nominal"},
      {t:"k",m:"Load balancer traffic shifted 100%"},
      {t:"w",m:"Legacy infrastructure decommissioned"},
      {t:"k",m:"Deployment complete — 99.99% SLA active"},
    ];

    let S={step:0,langs:[],svcs:[],users:2000,tools:[],phase:"idle",pct:0,logs:[],ai:"",aiDone:false};
    let dIv=null,tIv=null;

    function calc(langs,svcs,users,tools){
      const ns=svcs.length,t=tools.length,nl=langs.length;
      const ages={cobol:45,vb6:28,java:18,php:14,net:12,cpp:20,python:10,ruby:12,perl:25,cold:20,node:6,as400:35};
      const bases={cobol:14,vb6:20,java:38,php:33,net:48,cpp:25,python:45,ruby:40,perl:18,cold:22,node:63,as400:12};
      const avgAge=langs.length?langs.reduce((s,l)=>s+(ages[l]||15),0)/langs.length:15;
      const avgBase=langs.length?langs.reduce((s,l)=>s+(bases[l]||28),0)/langs.length:28;
      const lp=Math.max(0,(nl-1)*4);
      const bLoad=2.4+ns*0.32+(users>1000?1.1:0)+nl*0.3;
      const bSec=Math.max(18,60-ns*3-(avgAge>20?14:0)-lp);
      const bCost=Math.round((750+ns*95+users*0.13+nl*120)/100)*100;
      const bVel=Math.round(5+ns*1.2+nl*1.5);
      const bUp=parseFloat((97.5-ns*0.22-nl*0.3).toFixed(1));
      const bDep=Math.max(1,4-Math.floor(t/3));
      const aLoad=Math.max(0.15,bLoad*0.13);
      const aSec=Math.min(97,bSec+t*7+18);
      const aCost=Math.round(bCost*0.40/100)*100;
      const aVel=Math.round(Math.max(0.5,bVel*0.16));
      const aDep=t>7?"80+":t>5?"50+":t>3?"25+":"12+";
      const sb=Math.max(10,Math.min(55,avgBase-ns*2-lp-(users>5000?8:0)));
      const sa=Math.max(54,Math.min(99,sb+t*6+18));
      const sav=bCost>0?Math.round((1-aCost/bCost)*100):0;
      const spd=aLoad>0?parseFloat((bLoad/aLoad).toFixed(1)):1;
      return{
        bef:{load:bLoad.toFixed(1)+"s",up:bUp+"%",dep:bDep+"x/yr",sec:bSec+"/100",cost:"$"+bCost+"/mo",vel:bVel+" wks"},
        aft:{load:aLoad.toFixed(2)+"s",up:"99."+(t>7?"99":t>5?"99":t>3?"95":"9")+"%",dep:aDep+"x/yr",sec:aSec+"/100",cost:"$"+aCost+"/mo",vel:aVel+" wks"},
        sb,sa,sav,spd,secG:aSec-bSec
      };
    }

    const has=(a,id)=>a.indexOf(id)>=0;
    const tog=(a,id)=>has(a,id)?a.filter(x=>x!==id):[...a,id];
    const lc=(t)=>t==="k"?"sim-lk":t==="r"?"sim-lr":t==="w"?"sim-lw":"sim-ll";

    function opt(id,label,sub,on,prefix){
      const cbStyle=on?"background:#378add;border-color:#378add":"background:#0d1525;border:1.5px solid #2a3d56";
      return `<div class="sim-opt${on?" on":""}" id="${prefix}_${id}">
        <div class="sim-cb" style="${cbStyle}">${on?"<span style='font-size:10px;color:#fff;line-height:1'>&#10003;</span>":""}</div>
        <div class="sim-ot"><div class="sim-ol">${label}</div><div class="sim-os">${sub}</div></div>
      </div>`;
    }

    function renderDots(){
      const d=el.querySelector("#sim-dots");if(!d)return;
      d.innerHTML=[0,1,2,3].map(i=>`<div class="sim-sd${i<S.step?" sim-done":i===S.step?" sim-active":""}"></div>`).join("");
    }

    function render(){
      const body=el.querySelector(".sim-body");if(!body)return;
      renderDots();let h="";

      if(S.phase==="idle"){
        if(S.step===0){
          h+=`<div class="sim-ey" style="color:#1d9e75">Step 1 of 4</div>
<div class="sim-st" style="color:#1d9e75">What is your application's primary technology stack?</div>
<div class="sim-sub">Select your dominant language &mdash; if your app uses multiple languages or services, select all that apply</div>
<div class="sim-g2">`;
          LANGS.forEach(l=>{h+=opt(l.id,l.l,l.s,has(S.langs,l.id),"sl");});
          h+=`</div>`;
          if(S.langs.length>0)h+=`<div class="sim-hint">${S.langs.length===1?"Primary stack identified &mdash; ready to proceed.":S.langs.length===2?"Dual-language stack (polyglot architecture) &mdash; common in enterprise systems. BlueLink handles these regularly.":"Multi-language polyglot stack &mdash; this is more complex but very manageable. BlueLink has deep experience with these migrations."}</div>`;
          h+=`<div class="sim-nav"><span></span><button class="sim-btn-n" id="sn1" ${S.langs.length===0?"disabled":""}>Continue &rarr;</button></div>`;
        }
        else if(S.step===1){
          h+=`<div class="sim-ey" style="color:#ef9f27">Step 2 of 4</div>
<div class="sim-st" style="color:#ef9f27">Which legacy services does your application use?</div>
<div class="sim-sub">Check all that apply &mdash; each adds complexity to the migration scope</div>
<div class="sim-g2">`;
          SVCS.forEach(s=>{h+=opt(s.id,s.l,s.s,has(S.svcs,s.id),"ss");});
          h+=`</div>
<div class="sim-hint">${S.svcs.length} service${S.svcs.length===1?"":"s"} selected${S.svcs.length>6?" &mdash; high complexity. BlueLink specializes in exactly this.":S.svcs.length>3?" &mdash; moderate complexity engagement.":""}</div>
<div class="sim-nav"><button class="sim-btn-b" id="sb1">&larr; Back</button><button class="sim-btn-n" id="sn2">Continue &rarr;</button></div>`;
        }
        else if(S.step===2){
          const tier=S.users<=500?"Small":S.users<=5000?"Mid-market":"Enterprise";
          const cmplx=S.users<=500?"Low":S.users<=5000?"Medium":"High";
          const mig=S.users<=500?"~2 weeks":S.users<=5000?"~6 weeks":"~16 weeks";
          h+=`<div class="sim-ey" style="color:#378add">Step 3 of 4</div>
<div class="sim-st" style="color:#378add">How many users does your application serve?</div>
<div class="sim-sub">This determines scale requirements and migration window</div>
<div class="sim-srow"><input type="range" min="50" max="50000" step="50" value="${S.users}" id="susl"><span class="sim-sv" id="suval">${S.users.toLocaleString()}</span></div>
<div class="sim-g3">
  <div class="sim-mc"><div class="sim-mv">${tier}</div><div class="sim-ml">Scale tier</div></div>
  <div class="sim-mc"><div class="sim-mv">${cmplx}</div><div class="sim-ml">Infra complexity</div></div>
  <div class="sim-mc"><div class="sim-mv">${mig}</div><div class="sim-ml">Migration window</div></div>
</div>
<div class="sim-nav"><button class="sim-btn-b" id="sb2">&larr; Back</button><button class="sim-btn-n" id="sn3">Continue &rarr;</button></div>`;
        }
        else if(S.step===3){
          h+=`<div class="sim-ey" style="color:#dc4545">Step 4 of 4</div>
<div class="sim-st" style="color:#dc4545">Choose your modernization stack</div>
<div class="sim-sub">Check all you want applied &mdash; more modules means greater impact</div>
<div class="sim-g2">`;
          TOOLS.forEach(t=>{h+=opt(t.id,t.l,t.s,has(S.tools,t.id),"st");});
          h+=`</div>
<div class="sim-hint">${S.tools.length} module${S.tools.length===1?"":"s"} selected${S.tools.length>=8?" &mdash; comprehensive modernization. Maximum impact.":S.tools.length>=4?" &mdash; solid foundation. Consider adding security and observability.":""}</div>
<div class="sim-nav"><button class="sim-btn-b" id="sb3">&larr; Back</button><button class="sim-btn-r" id="srun" ${S.tools.length===0?"disabled":""}>&nbsp;Run simulation</button></div>`;
        }
      }
      else if(S.phase==="running"){
        h+=`<div class="sim-ey" style="color:#378add">Running simulation</div>
<div class="sim-st" style="color:#c8d4e4">Deploying your modernized stack...</div>
<div class="sim-dl"><span style="color:#5a7090">Progress</span><span style="color:#378add;font-weight:500" id="spval">${S.pct}%</span></div>
<div class="sim-prog"><div class="sim-pf${S.pct>=100?" ok":""}" id="spfill" style="width:${S.pct}%"></div></div>
<div class="sim-log" id="slb">`;
        S.logs.forEach(l=>{h+=`<div class="${lc(l.t)}">${l.m}</div>`;});
        h+=`</div>`;
      }
      else if(S.phase==="done"){
        const R=calc(S.langs,S.svcs,S.users,S.tools);
        const keys=["load","up","dep","sec","cost","vel"];
        const knames=["Load time","Uptime","Deployments","Security score","Infra cost","Dev velocity"];
        const lnames={cobol:"COBOL",vb6:"VB6",java:"Java EE",php:"PHP",net:".NET",cpp:"C/C++",python:"Python",ruby:"Ruby",perl:"Perl",cold:"ColdFusion",node:"Node.js",as400:"AS/400"};
        const stackLabel=S.langs.map(l=>lnames[l]||l).join(" + ");
        h+=`<div class="sim-ey" style="color:#1d9e75">Results</div>
<div class="sim-rh">
  <div class="sim-sp"><div class="sim-sb2"><div class="sim-sn" style="color:#dc4545">${R.sb}</div><div class="sim-sl2">Health before</div></div><div style="color:#374d68;font-size:20px">&rarr;</div><div class="sim-sb2"><div class="sim-sn" style="color:#1d9e75">${R.sa}</div><div class="sim-sl2">Health after</div></div></div>
  <div class="sim-gps"><div class="sim-gp">+${R.sav}% cost saving</div><div class="sim-gp">${R.spd}&#215; faster</div><div class="sim-gp">+${R.secG} security pts</div></div>
</div>
<div class="sim-cmp">
  <div class="sim-cc bad"><div class="sim-ch bad">Before &mdash; legacy</div>`;
        keys.forEach((k,i)=>{h+=`<div class="sim-cr"><span class="sim-ck">${knames[i]}</span><span class="sim-cbad">${R.bef[k]}</span></div>`;});
        h+=`</div><div class="sim-cc good"><div class="sim-ch good">After &mdash; modernized</div>`;
        keys.forEach((k,i)=>{h+=`<div class="sim-cr"><span class="sim-ck">${knames[i]}</span><span class="sim-cgood">${R.aft[k]}</span></div>`;});
        h+=`</div></div>
<div class="sim-ins" id="sins">${S.ai}${S.aiDone?"":"<span class=\"sim-cur\"></span>"}</div>
<div class="sim-bn" style="flex-wrap:wrap;gap:10px">
  <button class="sim-btn-rst" id="srst">Start over</button>
  <div style="display:flex;gap:10px;flex-wrap:wrap">
    <button onclick="window.bluelinkDownloadReport()" style="font-size:13px;font-weight:500;color:#1d9e75;background:#0a1e12;border:1px solid #1d9e75;padding:9px 18px;border-radius:8px;cursor:pointer;font-family:var(--font-sans);display:inline-flex;align-items:center;gap:6px">
      &#11123; Download Report
    </button>
    <a href="/contact#consultation" style="font-size:14px;font-weight:500;color:#fff;background:#378add;padding:10px 22px;border-radius:8px;text-decoration:none;display:inline-block">Talk to BlueLink &rarr;</a>
  </div>
</div>`;
      }

      body.innerHTML=h;
      bindEvents();
    }

    function bindEvents(){
      const q=(id)=>el.querySelector("#"+id);
      const qo=(id,fn)=>{const e=q(id);if(e)e.onclick=fn;};
      LANGS.forEach(({id})=>{const e=q("sl_"+id);if(e)e.onclick=()=>{S.langs=tog(S.langs,id);render();};});
      SVCS.forEach(({id})=>{const e=q("ss_"+id);if(e)e.onclick=()=>{S.svcs=tog(S.svcs,id);render();};});
      TOOLS.forEach(({id})=>{const e=q("st_"+id);if(e)e.onclick=()=>{S.tools=tog(S.tools,id);render();};});
      qo("sn1",()=>{S.step=1;render();});qo("sn2",()=>{S.step=2;render();});qo("sn3",()=>{S.step=3;render();});
      qo("sb1",()=>{S.step=0;render();});qo("sb2",()=>{S.step=1;render();});qo("sb3",()=>{S.step=2;render();});
      qo("srun",startDeploy);
      qo("srst",()=>{if(dIv)clearInterval(dIv);if(tIv)clearInterval(tIv);dIv=null;tIv=null;S={step:0,langs:[],svcs:[],users:2000,tools:[],phase:"idle",pct:0,logs:[],ai:"",aiDone:false};render();});
      const sl=q("susl");
      if(sl)sl.oninput=function(){S.users=parseInt(this.value);const uv=q("suval");if(uv)uv.textContent=S.users.toLocaleString();render();};
    }

    function startDeploy(){
      if(dIv)clearInterval(dIv);if(tIv)clearInterval(tIv);
      S.phase="running";S.pct=0;S.logs=[];S.ai="";S.aiDone=false;render();
      let p=0,li=0;
      dIv=setInterval(()=>{
        p=Math.min(100,p+5);S.pct=p;
        const thresh=Math.floor((li+1)*(100/DLOGS.length));
        if(p>=thresh&&li<DLOGS.length){li++;S.logs=DLOGS.slice(0,li);}
        const pf=el.querySelector("#spfill");if(pf){pf.style.width=p+"%";if(p>=100)pf.classList.add("ok");}
        const pv=el.querySelector("#spval");if(pv)pv.textContent=p+"%";
        const lb=el.querySelector("#slb");if(lb){let lh="";S.logs.forEach(l=>{lh+=`<div class="${lc(l.t)}">${l.m}</div>`;});lb.innerHTML=lh;lb.scrollTop=lb.scrollHeight;}
        if(p>=100){clearInterval(dIv);dIv=null;setTimeout(()=>{S.phase="done";render();typeIt();},500);}
      },140);
    }

    function typeIt(){
      if(tIv)clearInterval(tIv);
      const R=calc(S.langs,S.svcs,S.users,S.tools);
      const lnames={cobol:"COBOL",vb6:"VB6",java:"Java EE",php:"PHP",net:".NET",cpp:"C/C++",python:"Python",ruby:"Ruby on Rails",perl:"Perl",cold:"ColdFusion",node:"Node.js",as400:"AS/400"};
      const stackLabel=S.langs.map(l=>lnames[l]||l).join(" + ");
      const text="Based on your configuration, a "+stackLabel+" application serving "+S.users.toLocaleString()+" users with "+S.svcs.length+" legacy services would achieve a "+R.spd+"x speed improvement and "+R.sav+"% infrastructure cost reduction with "+S.tools.length+" modernization modules applied. Your system health score moves from "+R.sb+" to "+R.sa+". BlueLink recommends beginning with an ATLAS Assessment to validate these projections against your real environment before committing to a full migration engagement.";
      let i=0;
      tIv=setInterval(()=>{
        i++;S.ai=text.slice(0,i);
        const ins=el.querySelector("#sins");
        if(ins)ins.innerHTML=S.ai+(i<text.length?"<span class=\"sim-cur\"></span>":"");
        if(i>=text.length){clearInterval(tIv);tIv=null;S.aiDone=true;}
      },16);
    }

    function downloadReport(){
      const R=calc(S.langs,S.svcs,S.users,S.tools);
      const lnames={cobol:"COBOL",vb6:"VB6",java:"Java EE",php:"PHP",net:".NET",cpp:"C/C++",python:"Python",ruby:"Ruby on Rails",perl:"Perl",cold:"ColdFusion",node:"Node.js",as400:"AS/400"};
      const stackLabel=S.langs.map(l=>lnames[l]||l).join(", ");
      const svcLabels=S.svcs.map(id=>{const s=SVCS.find(x=>x.id===id);return s?s.l:id;});
      const toolLabels=S.tools.map(id=>{const t=TOOLS.find(x=>x.id===id);return t?t.l:id;});
      const keys=["load","up","dep","sec","cost","vel"];
      const knames=["Load time","Uptime","Deployments","Security score","Infra cost","Dev velocity"];
      const date=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});

      // Build HTML for the report and use print window
      const html=`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>BlueLink Consults — Modernization Assessment Report</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;color:#1a2840;background:#fff;padding:0}
  .page{max-width:760px;margin:0 auto;padding:40px 48px}
  .header{border-bottom:3px solid #0d1b2e;padding-bottom:24px;margin-bottom:32px;display:flex;justify-content:space-between;align-items:flex-start}
  .brand{font-size:22px;font-weight:800;color:#0d1b2e;letter-spacing:-.02em}
  .brand span{color:#1d9e75}
  .report-title{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:.12em;margin-top:4px}
  .date-block{text-align:right;font-size:12px;color:#888}
  .section{margin-bottom:28px}
  .section-title{font-size:13px;font-weight:700;color:#0d1b2e;text-transform:uppercase;letter-spacing:.1em;border-left:4px solid #1d9e75;padding-left:10px;margin-bottom:14px}
  .config-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .config-item{background:#f8fafc;border-radius:6px;padding:12px 14px}
  .config-label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
  .config-value{font-size:14px;font-weight:600;color:#1a2840}
  .compare-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .compare-card{border-radius:8px;padding:16px 18px}
  .compare-card.bad{background:#fff5f5;border:1px solid #fecaca}
  .compare-card.good{background:#f0fdf4;border:1px solid #bbf7d0}
  .compare-head{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}
  .compare-head.bad{color:#dc2626}.compare-head.good{color:#16a34a}
  .compare-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:13px}
  .compare-row:last-child{border:none}
  .compare-key{color:#6b7280}
  .compare-val-bad{color:#dc2626;font-weight:600}
  .compare-val-good{color:#16a34a;font-weight:600}
  .score-strip{display:flex;align-items:center;justify-content:center;gap:32px;background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px}
  .score-block{text-align:center}
  .score-num{font-size:40px;font-weight:800}
  .score-lbl{font-size:11px;color:#888;margin-top:4px}
  .score-arrow{font-size:28px;color:#ccc}
  .gain-row{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap}
  .gain-pill{background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a;font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px}
  .services-list{display:flex;flex-wrap:wrap;gap:8px}
  .service-tag{background:#f1f5f9;border-radius:4px;padding:4px 10px;font-size:12px;color:#475569}
  .insight-box{background:#f0fdf4;border-left:4px solid #1d9e75;border-radius:0 8px 8px 0;padding:14px 18px;font-size:13px;color:#374151;line-height:1.75}
  .next-steps{background:#f8fafc;border-radius:8px;padding:16px 18px}
  .next-step{display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;font-size:13px;color:#374151}
  .next-step:last-child{margin-bottom:0}
  .step-num{width:22px;height:22px;border-radius:50%;background:#0d1b2e;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
  .footer{border-top:2px solid #0d1b2e;padding-top:16px;margin-top:40px;display:flex;justify-content:space-between;align-items:center}
  .footer-brand{font-size:14px;font-weight:800;color:#0d1b2e}
  .footer-brand span{color:#1d9e75}
  .footer-contact{text-align:right;font-size:11px;color:#888;line-height:1.7}
  .footer-contact a{color:#0d1b2e;text-decoration:none}
  .disclaimer{font-size:10px;color:#aaa;margin-top:8px;text-align:center}
  @media print{
    body{print-color-adjust:exact;-webkit-print-color-adjust:exact}
    .header{position:running(header)}
    .footer{position:running(footer)}
    .no-print{display:none}
    @page{
      margin:20mm 16mm;
      @top-right{content:element(header)}
      @bottom-center{content:element(footer)}
    }
  }
  @page{size:A4;margin:20mm 16mm}
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div style="display:flex;align-items:center;gap:16px">
      <div style="width:48px;height:48px;background:#0d1b2e;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:18px;font-weight:900;color:#1d9e75;letter-spacing:-.04em">BL</span>
      </div>
      <div>
        <div class="brand">Blue<span>Link</span> Consults</div>
        <div class="report-title">Application Modernization &amp; Cloud Advisory</div>
      </div>
    </div>
    <div class="date-block">
      <strong style="font-size:13px;color:#1a2840;display:block;margin-bottom:4px">Modernization Assessment Report</strong>
      Generated: ${date}
    </div>
  </div>

  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:10px 16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:12px;font-weight:600;color:#16a34a">&#10003; BlueLink Consults — Confidential Assessment Report</span>
    <span style="font-size:11px;color:#6b7280">For internal deliberation purposes only</span>
  </div>

  <div class="section">
    <div class="section-title">Application Configuration</div>
    <div class="config-grid">
      <div class="config-item"><div class="config-label">Technology Stack</div><div class="config-value">${stackLabel||"Not specified"}</div></div>
      <div class="config-item"><div class="config-label">Active Users</div><div class="config-value">${S.users.toLocaleString()}</div></div>
      <div class="config-item"><div class="config-label">Legacy Services Identified</div><div class="config-value">${S.svcs.length} service${S.svcs.length===1?"":"s"}</div></div>
      <div class="config-item"><div class="config-label">Modernization Modules</div><div class="config-value">${S.tools.length} module${S.tools.length===1?"":"s"} selected</div></div>
    </div>
  </div>

  ${svcLabels.length>0?`<div class="section">
    <div class="section-title">Legacy Services Inventory</div>
    <div class="services-list">${svcLabels.map(s=>`<span class="service-tag">${s}</span>`).join("")}</div>
  </div>`:""}

  ${toolLabels.length>0?`<div class="section">
    <div class="section-title">Modernization Stack Selected</div>
    <div class="services-list">${toolLabels.map(t=>`<span class="service-tag" style="background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0">${t}</span>`).join("")}</div>
  </div>`:""}

  <div class="section">
    <div class="section-title">Health Score Assessment</div>
    <div class="score-strip">
      <div class="score-block"><div class="score-num" style="color:#dc2626">${R.sb}</div><div class="score-lbl">Current Health Score</div></div>
      <div class="score-arrow">&#8594;</div>
      <div class="score-block"><div class="score-num" style="color:#16a34a">${R.sa}</div><div class="score-lbl">Projected Health Score</div></div>
    </div>
    <div class="gain-row">
      <div class="gain-pill">+${R.sav}% infrastructure cost reduction</div>
      <div class="gain-pill">${R.spd}&#215; faster load time</div>
      <div class="gain-pill">+${R.secG} security score points</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Before &amp; After Comparison</div>
    <div class="compare-grid">
      <div class="compare-card bad">
        <div class="compare-head bad">Before — Legacy System</div>
        ${keys.map((k,i)=>`<div class="compare-row"><span class="compare-key">${knames[i]}</span><span class="compare-val-bad">${R.bef[k]}</span></div>`).join("")}
      </div>
      <div class="compare-card good">
        <div class="compare-head good">After — Modernized</div>
        ${keys.map((k,i)=>`<div class="compare-row"><span class="compare-key">${knames[i]}</span><span class="compare-val-good">${R.aft[k]}</span></div>`).join("")}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">BlueLink Assessment</div>
    <div class="insight-box">
      Based on this configuration, a ${stackLabel} application serving ${S.users.toLocaleString()} users with ${S.svcs.length} legacy services would achieve a ${R.spd}x speed improvement and ${R.sav}% infrastructure cost reduction with ${S.tools.length} modernization modules applied. Your system health score moves from ${R.sb} to ${R.sa}. These projections are indicative — actual results are validated through BlueLink's ATLAS Assessment process.
    </div>
  </div>

  <div class="section">
    <div class="section-title">Recommended Next Steps</div>
    <div class="next-steps">
      <div class="next-step"><div class="step-num">1</div><div><strong>ATLAS Assessment (10 business days)</strong> — BlueLink maps your full application landscape, scores technical debt, identifies migration risks, and produces a board-ready modernization roadmap.</div></div>
      <div class="next-step"><div class="step-num">2</div><div><strong>Free 20-minute consultation</strong> — Speak directly with a BlueLink engineer about your specific environment before committing to any engagement.</div></div>
      <div class="next-step"><div class="step-num">3</div><div><strong>Phased modernization engagement</strong> — BlueLink delivers in phases, starting with the highest-impact components, ensuring zero business disruption throughout.</div></div>
    </div>
  </div>

  <div class="footer">
    <div>
      <div class="footer-brand">Blue<span>Link</span> Consults</div>
      <div style="font-size:11px;color:#888;margin-top:3px">Application Modernization &amp; Cloud Advisory</div>
    </div>
    <div class="footer-contact">
      <a href="https://www.bluelinkconsults.com">www.bluelinkconsults.com</a><br>
      info@bluelinkconsults.com &nbsp;&bull;&nbsp; 401-440-2434<br>
      Providence, RI, USA
    </div>
  </div>
  <div class="disclaimer">This report was generated by the BlueLink Consults Modernization Simulator. All projections are based on industry benchmarks and should be validated through a formal ATLAS Assessment engagement. &copy; ${new Date().getFullYear()} BlueLink Consults (BlueLink Consulting Ltd). All rights reserved.</div>

</div>
</body>
</html>`;

      const win=window.open("","_blank");
      if(!win){alert("Please allow popups to download the report.");return;}
      win.document.write(html);
      win.document.close();
      setTimeout(()=>win.print(),600);
    }

    window.bluelinkDownloadReport=downloadReport;

    render();
    return ()=>{if(dIv)clearInterval(dIv);if(tIv)clearInterval(tIv);};
  }, []);

  const css=[
    ".sim-root{background:#0f1623;border-radius:16px;overflow:hidden;font-family:var(--font-sans)}",
    ".sim-hdr{background:#151e2e;border-bottom:1px solid #1f2d42;padding:18px 26px;display:flex;align-items:center;justify-content:space-between}",
    ".sim-hdr-h{font-size:20px;font-weight:600;color:#1d9e75;letter-spacing:-.01em;margin:0}",
    ".sim-hdr-p{font-size:13px;color:#5a7090;margin-top:3px}",
    ".sim-dots{display:flex;gap:6px}",
    ".sim-sd{width:8px;height:8px;border-radius:50%;background:#1f2d42;transition:background .2s}",
    ".sim-done{background:#1d9e75}.sim-active{background:#378add}",
    ".sim-body{padding:26px}",
    ".sim-ey{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}",
    ".sim-st{font-size:16px;font-weight:600;margin-bottom:4px}",
    ".sim-sub{font-size:13px;color:#4a6888;margin-bottom:16px}",
    ".sim-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}",
    ".sim-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px}",
    ".sim-opt{background:#151e2e;border:1px solid #1f2d42;border-radius:10px;padding:11px 13px;cursor:pointer;transition:all .18s;user-select:none;display:flex;align-items:flex-start;gap:10px}",
    ".sim-opt:hover{border-color:#2a4060;background:#1a2535}",
    ".sim-opt.on{border-color:#378add;background:#0d1e35}",
    ".sim-cb{width:16px;height:16px;border-radius:4px;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all .18s}",
    ".sim-ot{flex:1}",
    ".sim-ol{font-size:13px;font-weight:500;color:#8aa4c0;transition:color .18s}",
    ".sim-opt.on .sim-ol{color:#7bbfed}",
    ".sim-os{font-size:11px;color:#374d68;margin-top:2px}",
    ".sim-opt.on .sim-os{color:#2a5878}",
    ".sim-hint{font-size:13px;color:#4a6888;margin-top:8px;line-height:1.55;padding:10px 14px;background:#0d1421;border-radius:8px;border-left:2px solid #1f3050}",
    ".sim-nav{display:flex;justify-content:space-between;align-items:center;margin-top:20px}",
    ".sim-btn-b{font-size:13px;color:#4a6888;background:none;border:none;cursor:pointer;padding:8px 0;font-family:var(--font-sans)}",
    ".sim-btn-b:hover{color:#8aa4c0}",
    ".sim-btn-n{font-size:14px;font-weight:500;color:#0d1e35;background:#378add;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:var(--font-sans)}",
    ".sim-btn-n:hover{background:#4a9fe8}",
    ".sim-btn-n:disabled{background:#1f2d42;color:#374d68;cursor:not-allowed}",
    ".sim-btn-r{font-size:14px;font-weight:500;color:#0a1e10;background:#1d9e75;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-family:var(--font-sans)}",
    ".sim-btn-r:hover{background:#22b585}",
    ".sim-btn-r:disabled{background:#1f2d42;color:#374d68;cursor:not-allowed}",
    ".sim-srow{display:flex;align-items:center;gap:16px;margin-bottom:10px}",
    ".sim-srow input{flex:1;accent-color:#378add;height:4px}",
    ".sim-sv{font-size:22px;font-weight:500;color:#7bbfed;min-width:88px;text-align:right}",
    ".sim-mc{background:#151e2e;border:1px solid #1f2d42;border-radius:10px;padding:12px 16px}",
    ".sim-mv{font-size:15px;font-weight:500;color:#c8d4e4}",
    ".sim-ml{font-size:11px;color:#374d68;margin-top:3px}",
    ".sim-dl{display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px}",
    ".sim-prog{height:6px;background:#1f2d42;border-radius:3px;overflow:hidden;margin-bottom:14px}",
    ".sim-pf{height:100%;border-radius:3px;background:#378add;transition:width .2s}",
    ".sim-pf.ok{background:#1d9e75}",
    ".sim-log{background:#0a1019;border-radius:8px;padding:13px 15px;font-family:var(--font-mono);font-size:12px;line-height:1.85;max-height:170px;overflow-y:auto}",
    ".sim-lk{color:#1d9e75}.sim-lr{color:#378add}.sim-lw{color:#ba7517}.sim-ll{color:#374d68}",
    ".sim-rh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:12px}",
    ".sim-sp{display:flex;align-items:center;gap:16px;background:#151e2e;border:1px solid #1f2d42;border-radius:10px;padding:14px 20px}",
    ".sim-sb2{text-align:center}",
    ".sim-sn{font-size:32px;font-weight:500}",
    ".sim-sl2{font-size:11px;color:#374d68;margin-top:2px}",
    ".sim-gps{display:flex;gap:8px;flex-wrap:wrap}",
    ".sim-gp{font-size:12px;font-weight:500;padding:5px 12px;border-radius:20px;background:#0a1e12;color:#1d9e75;border:1px solid #0f4028}",
    ".sim-cmp{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}",
    ".sim-cc{background:#151e2e;border-radius:10px;padding:15px 17px}",
    ".sim-cc.bad{border:1px solid #3a1515}.sim-cc.good{border:1px solid #0f4028}",
    ".sim-ch{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px}",
    ".sim-ch.bad{color:#dc4545}.sim-ch.good{color:#1d9e75}",
    ".sim-cr{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #1a2535;font-size:13px}",
    ".sim-cr:last-child{border:none}",
    ".sim-ck{color:#374d68}.sim-cbad{color:#dc4545;font-weight:500}.sim-cgood{color:#1d9e75;font-weight:500}",
    ".sim-ins{background:#0a1019;border-radius:10px;padding:15px 17px;font-size:14px;color:#7a9ab8;line-height:1.75;margin-bottom:18px;min-height:48px;border-left:3px solid #1d3a5f}",
    ".sim-cur{display:inline-block;width:2px;height:14px;background:#378add;vertical-align:middle;margin-left:3px;animation:simBlink .7s step-end infinite}",
    "@keyframes simBlink{0%,100%{opacity:1}50%{opacity:0}}",
    ".sim-bn{display:flex;justify-content:space-between;align-items:center}",
    ".sim-btn-rst{font-size:13px;color:#4a6888;background:none;border:1px solid #1f2d42;padding:8px 16px;border-radius:8px;cursor:pointer;font-family:var(--font-sans)}",
    ".sim-btn-rst:hover{border-color:#2a4060;color:#8aa4c0}",
    "@media(max-width:600px){.sim-g2,.sim-cmp,.sim-g3{grid-template-columns:1fr}.sim-rh{flex-direction:column}}",
  ].join(" ");

  return (
    <>
      <style>{css}</style>
      <PageHero label="Interactive Tool" title="App Modernization Simulator" text="Configure your application stack and run a deployment simulation. See exactly what modernization delivers — speed, uptime, security, cost, and developer velocity." />
      <section style={{ padding:"48px 7vw", background:"#060b14" }}>
        <div className="sim-root" ref={simRef}>
          <div className="sim-hdr">
            <div>
              <p className="sim-hdr-h">Modernization Simulator</p>
              <p className="sim-hdr-p">Configure your application — see your before and after</p>
            </div>
            <div className="sim-dots" id="sim-dots"></div>
          </div>
          <div className="sim-body" />
        </div>
      </section>
    </>
  );
}


function ConnectPage() {
  const connectUrl = "https://www.bluelinkconsults.com/connect";
  const website = "https://www.bluelinkconsults.com";
  const phoneDisplay = "+1 (401) 440-2434";
  const phoneLink = "+14014402434";
  const email = "info@bluelinkconsults.com";
  const linkedIn = "https://www.linkedin.com/company/bluelink-consults";

  const actions = [
    { icon: Globe2, title: "Visit Our Website", detail: "bluelinkconsults.com", href: website },
    { icon: Phone, title: "Call Us", detail: phoneDisplay, href: `tel:${phoneLink}` },
    { icon: Mail, title: "Email Us", detail: email, href: `mailto:${email}` },
    { icon: CalendarDays, title: "Book a Consultation", detail: "Schedule a free consultation", href: "/contact" },
    { icon: Linkedin, title: "Connect on LinkedIn", detail: "Follow us for updates and insights", href: linkedIn },
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


/* ─── APP ROOT ───────────────────────────────────────────── */
function AppInner() {
  const location = useLocation();
  const isPortal = location.pathname === "/client-login";
  const isConnectPage = location.pathname === "/connect";

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
      {!isPortal && !isConnectPage && <Header />}
      <ScrollToHash />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/client-login"            element={<ClientPortal />} />
          <Route path="/connect"                 element={<ConnectPage />} />
          <Route path="/"                        element={<Home />} />
          <Route path="/services"                element={<ServicesPage />} />
          <Route path="/services/:slug"          element={<ServiceDetail />} />
          <Route path="/insights"                element={<InsightsPage />} />
          <Route path="/insights/:slug"          element={<InsightDetail />} />
          <Route path="/solutions"               element={<SolutionsPage />} />
          <Route path="/solutions/who-we-help"   element={<WhoWeHelpPage />} />
          <Route path="/solutions/eat-framework" element={<EATFrameworkPage />} />
          <Route path="/about"                   element={<AboutPage />} />
          <Route path="/contact"                 element={<ContactPage />} />
          <Route path="/privacy-policy"          element={<PrivacyPolicyPage />} />
          <Route path="/simulator"               element={<SimulatorPage />} />
          <Route path="/terms"                   element={<TermsPage />} />
          <Route path="*"                        element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!isPortal && !isConnectPage && <Footer />}
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
