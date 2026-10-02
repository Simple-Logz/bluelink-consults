import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, Zap, Users, FileText, CalendarDays, Mail, Phone, Facebook } from "lucide-react";

export function NigeriaHeader({ services }) {
  const [panel, setPanel] = useState(null);
  const root = useRef(null);
  const toggle = useRef(null);
  const location = useLocation();
  useEffect(() => { setPanel(null); }, [location.pathname]);
  useEffect(() => {
    const outside = event => { if (!root.current?.contains(event.target)) setPanel(null); };
    const escape = event => { if (event.key === "Escape") { setPanel(null); toggle.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);
  const close = () => setPanel(null);
  const flip = name => setPanel(current => current === name ? null : name);
  const primary = <>
    <div className="ng-nav-group"><button onClick={() => flip("services")} aria-expanded={panel === "services"} aria-controls="ng-services">Services <ChevronDown size={14} /></button>{panel === "services" && <div id="ng-services" className="ng-submenu">{services.map(service => <Link key={service.slug} to={`/services/${service.slug}`} onClick={close}>{service.title}</Link>)}</div>}</div>
    <div className="ng-nav-group"><button onClick={() => flip("solutions")} aria-expanded={panel === "solutions"} aria-controls="ng-solutions">Solutions <ChevronDown size={14} /></button>{panel === "solutions" && <div id="ng-solutions" className="ng-submenu"><Link to="/solutions/who-we-help" onClick={close}>Who We Help</Link><Link to="/solutions/eat-framework" onClick={close}>The EAT Framework</Link></div>}</div>
    <NavLink to="/insights" onClick={close}>Insights</NavLink>
    <div className="ng-nav-group" onMouseEnter={() => setPanel("about")} onMouseLeave={() => setPanel(current => current === "about" ? null : current)}><button onClick={() => flip("about")} aria-expanded={panel === "about"} aria-controls="ng-about">About Us <ChevronDown size={14} /></button>{panel === "about" && <div id="ng-about" className="ng-submenu"><Link to="/about/our-story" onClick={close}>Our Story</Link><Link to="/about/our-team" onClick={close}>Our Team</Link><Link to="/about/why-bluelink" onClick={close}>Why BlueLink</Link></div>}</div>
    <NavLink to="/contact" onClick={close}>Contact</NavLink>
  </>;
  const extras = [{ title: "Try Simulator", path: "/simulator", icon: Zap }, { title: "Client Login", path: "/client-login", icon: Users }, { title: "Request Demo", path: "/request-demo", icon: CalendarDays, Mail, Phone, Facebook }, { title: "Blog", path: "/blog", icon: FileText }];
  return <div className="bl-header-shell"><HeaderUtility nigeria /><header ref={root} className="site-header ng-header">
    <Link to="/" className="brand-logo-wrap brand-home-link" aria-label="BlueLink Consults homepage" onClick={close}><img src="/bluelink-logo-mark.png" alt="" className="brand-logo-mark" /><span className="brand-wordmark"><strong>Blue<span>Link</span></strong><small>Consults</small></span></Link>
    <nav className="ng-primary" aria-label="Main navigation">{primary}</nav>
    <Link to="/request-demo" onClick={close} className="bl-header-demo">Request Demo</Link>
    <button ref={toggle} type="button" className="ng-menu-toggle" onClick={() => flip("more")} aria-expanded={panel === "more"} aria-controls="ng-more" aria-label={panel === "more" ? "Close additional menu" : "Open additional menu"}>{panel === "more" ? <X size={23} /> : <Menu size={23} />}</button>
    <nav id="ng-more" className={`ng-more ${panel === "more" ? "is-open" : ""}`} aria-label="Additional navigation" hidden={panel !== "more"}>
      <div className="ng-mobile-primary">
        <details><summary><span>Services</span><span className="ng-dropdown-caret" aria-hidden="true" /></summary>{services.map(service => <Link key={service.slug} to={`/services/${service.slug}`} onClick={close}>{service.title}</Link>)}</details>
        <details><summary><span>Solutions</span><span className="ng-dropdown-caret" aria-hidden="true" /></summary><Link to="/solutions/who-we-help" onClick={close}>Who We Help</Link><Link to="/solutions/eat-framework" onClick={close}>The EAT Framework</Link></details>
        <Link to="/insights" onClick={close}>Insights</Link>
        <details><summary><span>About Us</span><span className="ng-dropdown-caret" aria-hidden="true" /></summary><Link to="/about/our-story" onClick={close}>Our Story</Link><Link to="/about/our-team" onClick={close}>Our Team</Link><Link to="/about/why-bluelink" onClick={close}>Why BlueLink</Link></details>
        <Link to="/contact" onClick={close}>Contact</Link>
      </div>
      {extras.map(({ title, path, icon: Icon }) => <Link key={path} to={path} onClick={close}><Icon size={18} /> {title}<ArrowRight size={15} /></Link>)}
    </nav>
  </header></div>;
}

export function DemoBanner() {
  return <section className="ng-demo-banner" aria-label="Request a demonstration"><div className="ng-demo-glow" aria-hidden="true" /><Link to="/request-demo">Request Demo <ArrowRight size={20} aria-hidden="true" /></Link></section>;
}

function Hero({ label, title, text }) {
  useEffect(() => { document.title = `${label} | BlueLink Consults`; }, [label]);
  return <section className="ng-about-hero"><p className="eyebrow">BlueLink Consults · {label}</p><h1>{title}</h1><p>{text}</p></section>;
}

export function OurStory() {
  return <>
    <Hero label="Our Story" title="Technology built for your business." text="We help organisations turn complex, outdated technology into secure, scalable systems that support real business goals." />
    <section className="ng-story-layout"><div><p className="eyebrow">Why BlueLink</p><h2>Start with the business.<br />Build the right technology.</h2></div><div><p>BlueLink Consults was founded by John Offiong with a clear purpose: help organisations make technology work better for the people and operations that depend on it.</p><p>Our work connects applications, infrastructure and day-to-day operations. Whether an organisation is modernising a legacy application, preparing a release or improving service reliability, we begin by understanding its challenges and the results it needs.</p><p>We combine technical engineering with practical delivery. Our six services support the journey from assessment and architecture through implementation, validation and operational support.</p></div></section>
    <section className="ng-principles"><div className="ng-section-heading"><p className="eyebrow">Our approach</p><h2>Engage. Assess. Transform.</h2></div><div className="ng-principle-grid">{[
      ["01", "Engage", "Understand your goals, your people and your operating reality. Agree what success should look like before recommending a solution."],
      ["02", "Assess", "Review systems, dependencies and technical gaps. Identify risks and opportunities, then prioritise a practical path forward."],
      ["03", "Transform", "Design and deliver changes in controlled stages. Validate readiness, hand over clearly and support reliable operation."],
    ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="ng-story-layout"><div><p className="eyebrow">What guides us</p><h2>Practical work.<br />Lasting value.</h2></div><div><p>Our mission is to transform complex and outdated technology into modern, secure and scalable solutions that improve efficiency, strengthen operations and deliver measurable business value.</p><p>Collaboration, innovation, excellence, integrity and sustainability guide how we work. We recommend technologies that fit the requirement and build with maintainability and future growth in mind.</p><Link className="ng-text-link" to="/about/our-team">Meet our team <ArrowRight size={18} /></Link></div></section><DemoBanner />
  </>;
}

const team = [
  ["john-offiong", "John Offiong", "Founder & CEO", "Leads BlueLink’s strategy, technology vision, and client transformation initiatives across our markets, guiding business growth, partnerships, and service innovation."],
  ["samuel-kubiangha", "Samuel Kubiangha", "Head of Technology & Engineering", "Leads technical delivery, application modernisation, and infrastructure engineering, ensuring quality, reliability, and alignment with client requirements."],
  ["efefiom-archibong", "Efefiom Archibong", "Cloud & DevOps Engineering Lead", "Leads cloud infrastructure, DevOps and automation initiatives, supporting scalable environments, reliable deployments and modern engineering practices."],
  ["nnamdi-richards", "Nnamdi Richards", "Business Development & Client Engagement Manager", "Drives client engagement, builds strategic relationships, and advances business growth through targeted outreach, partnerships, and new opportunities."],
  ["biwom-iklaki", "Biwom Iklaki", "Project Delivery Lead", "Coordinates client engagements, project execution, and successful solution delivery."],
];
export function OurTeam() {
  return <><Hero label="Our Team" title="The people behind the delivery." text="Leadership, engineering and client engagement working together to assess, modernise and support your technology." /><section className="ng-team-grid">{team.map(([slug, name, role, bio]) => <article className="ng-team-card" key={slug}><div className="ng-team-photo"><img src={`/team/${slug}.png`} alt={name} loading="lazy" /></div><div className="ng-team-info"><h2>{name}</h2><p className="ng-team-role">{role}</p><p>{bio}</p></div></article>)}</section><DemoBanner /></>;
}

export function BlogPage() {
  return <><Hero label="Blog" title="Ideas from BlueLink." text="Our blog is coming soon. In the meantime, explore our existing insights on technology modernisation and delivery." /><section className="ng-blog-empty"><FileText size={36} /><h2>More from our team, soon.</h2><Link className="ng-text-link" to="/insights">Explore Insights <ArrowRight size={18} /></Link></section></>;
}


export function HeaderUtility({ nigeria = false }) {
  const phone = nigeria ? "+234 806 864 9496" : "+1 (401) 440-2434";
  const phoneHref = nigeria ? "tel:+2348068649496" : "tel:+14014402434";
  return <div className="bl-header-utility"><div className="bl-header-utility-inner">
    <div className="bl-header-contact"><a href={phoneHref}><Phone size={15} aria-hidden="true" /><span>{phone}</span></a><a href="mailto:info@bluelinkconsults.com"><Mail size={15} aria-hidden="true" /><span>info@bluelinkconsults.com</span></a></div>
    <div className="bl-header-shortcuts"><Link to="/faqs">FAQs</Link><a href="https://www.facebook.com/share/19XEu6zf1n/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="BlueLink Consults on Facebook"><Facebook size={16} aria-hidden="true" /><span>Facebook</span></a></div>
  </div></div>;
}

export function FAQsPage() {
  const questions = [
    ["What services does BlueLink Consults provide?", "We provide technology audits and assessments, application modernisation, cloud infrastructure, DevOps and automation, pre-deployment validation, and operational and incident support."],
    ["How do we begin an engagement?", "Contact us to discuss your organisation’s goals and challenges. We agree the scope, deliverables and approach before work begins."],
    ["Can we see a demonstration first?", "Yes. Use Request Demo to tell us what you would like to explore. Our team will contact you to arrange a suitable time."],
    ["Can you work with our existing IT team and systems?", "Yes. We work with your team to assess the existing environment and plan improvements around your operational requirements."],
    ["How is project pricing determined?", "Pricing depends on the agreed scope, technical complexity and delivery requirements. Contact us for a proposal based on your needs."],
  ];
  return <><Hero label="FAQs" title="Your questions, answered." text="A few things to know before working with BlueLink Consults." /><section className="bl-faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}<Link className="bl-header-demo" to="/request-demo">Request Demo</Link></section></>;
}
