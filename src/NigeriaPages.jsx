import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight, Zap, Users, FileText, CalendarDays, Mail, Phone } from "lucide-react";

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
  const extras = [{ title: "Try Simulator", path: "/simulator", icon: Zap }, { title: "Client Login", path: "/client-login", icon: Users }, { title: "Request Demo", path: "/request-demo", icon: CalendarDays, Mail, Phone }, { title: "Blog", path: "/blog", icon: FileText }];
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
    <div className="bl-header-shortcuts"><Link to="/faqs">FAQs</Link><a href="https://www.facebook.com/share/19XEu6zf1n/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="BlueLink Consults on Facebook"><svg width="20" height="20" fill="#0866FF" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg></a><a href="https://www.instagram.com/bluelinkconsults?stkn=MWw5Nm1mY3dhZWNodw%3D%3D&amp;utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="BlueLink Consults on Instagram"><svg width="20" height="20" fill="#E4405F" aria-hidden="true" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg></a></div>
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
