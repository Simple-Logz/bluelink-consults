import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import EnterpriseArchitectureMotion from './EnterpriseArchitectureMotion';

const phases = [
  ['01', 'Engage', 'Agree the business priorities, scope and success measures.', 'Engagement brief and decision owners'],
  ['02', 'Assess', 'Review dependencies, technical constraints, costs and risks.', 'Findings report and prioritized roadmap'],
  ['03', 'Transform', 'Implement, validate and hand over the approved changes.', 'Test evidence and operational runbooks'],
];
const resources = [
  { label: 'CLOUD', title: 'Cloud infrastructure designed around your workload, security and recovery needs', path: '/services/cloud-infrastructure', image: '/images/ng-cloud-architecture.webp', alt: 'Illustration of connected cloud infrastructure' },
  { label: 'DELIVERY FRAMEWORK', title: 'A practical path from technology assessment to controlled implementation', path: '/solutions/eat-framework', image: '/images/ng-engineering-collaboration.webp', alt: 'Illustrative engineers reviewing an application together' },
  { label: 'RELEASE READINESS', title: 'What to validate before your next application release reaches production', path: '/services/predeployment-validation', image: '/images/hero/slides/laptop-work-v5.webp', alt: 'Reviewing notes alongside a laptop' },
  { label: 'TECHNOLOGY ASSESSMENT', title: 'Understand your technology risks before committing to modernization', path: '/services/technology-audit-assessment', image: '/images/hero/slides/consultation-v5.webp', alt: 'Reviewing documents during a technology consultation' },
];
const industries = ['Professional services', 'Healthcare support', 'Logistics and field operations', 'Retail and service companies', 'Construction and facilities', 'Growing technology teams'];

export function NigeriaEnterpriseHome() {
  return <main className="ng-enterprise-home">
    <section className="ng-enterprise-hero">
      <div className="ng-container ng-hero-layout">
      <div className="ng-hero-copy">
        <p className="ng-kicker">APPLICATIONS. CLOUD. SOFTWARE DELIVERY.</p>
        <h1>Modernize your applications.<br />Strengthen your business.</h1>
        <p className="ng-hero-intro">Connect your systems, strengthen your cloud infrastructure and deliver software with greater control.</p>
        <p className="ng-hero-detail">From assessment to implementation, we help your team make practical improvements.</p>
        <div className="ng-actions"><Link className="ng-btn" to="/contact#consultation">Talk to an Expert <ArrowRight size={18} /></Link><Link className="ng-btn ng-btn-outline" to="/services">Explore Our Services <ArrowRight size={18} /></Link></div>
      </div>
      <div className="ng-hero-media"><img src="/images/ng-cloud-architecture.webp" alt="Architectural illustration of connected cloud infrastructure" width="1536" height="1024" fetchPriority="high" /></div>
      </div>
    </section>
    <section className="ng-platforms ng-section"><div className="ng-container"><div className="ng-platform-heading"><p className="ng-kicker">TECHNOLOGY FIT</p><p>Engineering across the platforms your business depends on.</p></div><div className="ng-platform-grid">{['AWS','Microsoft Azure','Kubernetes','Terraform','GitHub'].map(name => <span key={name}>{name}</span>)}</div></div></section>
    <section className="ng-capabilities ng-section"><div className="ng-container ng-services-feature">
      <div className="ng-services-media"><img src="/images/ng-engineering-collaboration.webp" alt="Illustrative engineering collaboration at a software workstation" width="1536" height="1024" loading="lazy" decoding="async" /></div>
      <div className="ng-services-copy"><p className="ng-kicker">OUR SERVICES</p><h2>The right expertise.<br />A clear path forward.</h2><p>Whether you need to improve an existing application or strengthen the technology behind it, start with a service that fits your challenge.</p><p>Explore how we assess, modernize and support your systems—and the deliverables you can expect from each engagement.</p><Link className="ng-btn" to="/services">Explore Our Services <ArrowRight size={18} /></Link><Link className="ng-link ng-assessment-link" to="/services/technology-audit-assessment">Not sure where to start? Begin with an assessment <ArrowRight size={18} /></Link></div>
    </div></section>
    <section className="ng-outcomes ng-section" id="connected-architecture"><div className="ng-container ng-architecture-layout"><div className="ng-architecture-copy">
      <div className="ng-section-intro"><p className="ng-kicker">HOW WE WORK</p><h2>Connected thinking.<br />Accountable delivery.</h2><p>Application, infrastructure and operational decisions belong in the same conversation. Our approach keeps the dependencies and delivery evidence visible.</p></div>
      <Link className="ng-link" to="/about/why-bluelink">Why BlueLink Consults <ArrowRight size={18} /></Link>
      </div><EnterpriseArchitectureMotion />
    </div></section>
    <section className="ng-delivery ng-section"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">THE EAT FRAMEWORK</p><h2>A reviewable result at every stage.</h2></div><div className="ng-phase-grid">{phases.map(([number,title,text,result]) => <article key={number}><span className="ng-phase-number">{number}</span><h3>{title}</h3><p>{text}</p><div className="ng-phase-result"><span>{result}</span></div></article>)}</div><Link className="ng-link" to="/solutions/eat-framework">Explore our delivery framework <ArrowRight size={18} /></Link></div></section>
    <section className="ng-industries ng-section"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">WHO WE HELP</p><h2>Technology shaped around your operating needs.</h2><p>Explore the application, infrastructure and delivery challenges relevant to your organization.</p></div><div className="ng-industry-grid">{industries.map(name => <Link key={name} to="/solutions/who-we-help"><span>{name}</span><ArrowRight size={18} /></Link>)}</div></div></section>
    <section className="ng-resources ng-section" id="featured-guides" aria-labelledby="ng-guides-heading"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">EXPLORE BLUELINK</p><h2 id="ng-guides-heading">Technology in focus.</h2></div><div className="ng-resource-grid">{resources.map(({label,title,path,image,alt}) => <Link className="ng-resource-card" key={path} to={path}><img src={image} alt={alt} loading="lazy" decoding="async" width="600" height="450" /><span className="ng-kicker">{label}</span><h3>{title}</h3><span className="ng-link">Learn more <ArrowRight size={18} aria-hidden="true" /></span></Link>)}</div></div></section>
    <section className="ng-enterprise-cta"><div className="ng-container"><div><p className="ng-kicker">LET’S PLAN YOUR NEXT STEP</p><h2>What needs to work better?</h2><p>Tell us about the systems, constraints and outcomes that matter to your organization.</p></div><Link className="ng-btn ng-btn-white" to="/contact#consultation">Discuss Your Project <ArrowRight size={18} /></Link></div></section>
  </main>;
}

export function NigeriaEnterpriseFooter({ services }) {
  return <footer className="ng-enterprise-footer">
    <div className="ng-container ng-footer-grid"><div><Link className="ng-footer-brand" to="/">BlueLink <span>Consults</span></Link><p>Technology assessment, application modernization, cloud engineering and controlled delivery for Nigerian organizations.</p><a href="mailto:info@bluelinkconsults.com">info@bluelinkconsults.com</a><a href="tel:+2348068649496">Nigeria: +234 806 864 9496</a><a href="tel:+14014402434">US: +1 401-440-2434</a></div><div><h2>Services</h2><Link to="/services">Explore All Services</Link><Link to="/services/technology-audit-assessment">Start with an Assessment</Link><Link to="/contact">Discuss Your Requirements</Link></div><div><h2>Explore</h2><Link to="/solutions/eat-framework">The EAT Framework</Link><Link to="/solutions/who-we-help">Who We Help</Link><Link to="/about/why-bluelink">Why BlueLink</Link><Link to="/insights">Insights</Link><Link to="/request-demo">Request Demo</Link><a href="/BlueLink-Company-Profile.pdf" download>Company Profile</a></div><div><h2>Company</h2><Link to="/about/our-story">Our Story</Link><Link to="/about/our-team">Our Team</Link><Link to="/events">Events & Activities</Link><Link to="/client-login">Client Login</Link><Link to="/faqs">FAQs</Link><Link to="/contact">Contact Us</Link><a href="https://www.facebook.com/share/19XEu6zf1n/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.instagram.com/bluelinkconsults" target="_blank" rel="noopener noreferrer">Instagram</a></div></div>
    <div className="ng-container ng-footer-bottom"><span>© {new Date().getFullYear()} BlueLink Consults. All rights reserved.</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div></div>
  </footer>;
}
