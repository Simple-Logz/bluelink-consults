import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, CalendarDays, ClipboardCheck } from 'lucide-react';
import { zoomBookingUrl } from './siteBooking';

const phases = [
  ['01', 'Engage', 'Agree the business priorities, scope and success measures.', 'Engagement brief and decision owners'],
  ['02', 'Assess', 'Review dependencies, technical constraints, costs and risks.', 'Findings report and prioritized roadmap'],
  ['03', 'Transform', 'Implement, validate and hand over the approved changes.', 'Test evidence and operational runbooks'],
];
const resources = [
  { label: 'DELIVERY FRAMEWORK', title: 'From assessment to controlled implementation.', path: '/solutions/eat-framework', image: '/images/team-discussion.jpg', alt: 'Professionals discussing technology in a conference room' },
  { label: 'RELEASE READINESS', title: 'Prepare your next release with confidence.', path: '/services/predeployment-validation', image: '/images/professional-laptop.jpg', alt: 'A professional working at her laptop in a modern office' },
  { label: 'TECHNOLOGY ASSESSMENT', title: 'Understand the risks. Plan the improvements.', path: '/services/technology-audit-assessment', image: '/images/professional-notes.jpg', alt: 'A professional taking notes during her work' },
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
        <div className="ng-actions"><a className="ng-btn" href={zoomBookingUrl}>Schedule Demo <ArrowRight size={18} /></a><Link className="ng-btn ng-btn-outline" to="/services">Explore Our Services <ArrowRight size={18} /></Link></div>
      </div>
      <div className="ng-hero-media"><img src="/images/hero-professional.jpg" alt="A smiling professional working at her laptop in a modern office" width="1400" height="933" fetchPriority="high" /></div>
      </div>
    </section>
    <section className="ng-home-actions" aria-label="Explore BlueLink"><div className="ng-container ng-home-action-grid">
      <Link to="/services"><Layers size={25} aria-hidden="true" /><h2>Find the right expertise <ArrowRight size={19} /></h2><p>Explore our six technology services.</p></Link>
      <a href={zoomBookingUrl}><CalendarDays size={25} aria-hidden="true" /><h2>Schedule a demo <ArrowRight size={19} /></h2><p>Choose a time for your 30-minute Zoom session.</p></a>
      <Link to="/solutions/eat-framework"><ClipboardCheck size={25} aria-hidden="true" /><h2>See how we work <ArrowRight size={19} /></h2><p>Engage. Assess. Transform.</p></Link>
    </div></section>
    <section className="ng-capabilities ng-section"><div className="ng-container ng-services-feature">
      <div className="ng-services-media"><img src="/images/team-discussion.jpg" alt="Professionals discussing technology in a conference room" width="1536" height="1024" loading="lazy" decoding="async" /></div>
      <div className="ng-services-copy"><p className="ng-kicker">OUR SERVICES</p><h2>The right expertise.<br />A clear path forward.</h2><p>Whether you need to improve an existing application or strengthen the technology behind it, start with a service that fits your challenge.</p><p>Explore how we assess, modernize and support your systems—and the deliverables you can expect from each engagement.</p><Link className="ng-btn" to="/services">Explore Our Services <ArrowRight size={18} /></Link><Link className="ng-link ng-assessment-link" to="/services/technology-audit-assessment">Not sure where to start? Begin with an assessment <ArrowRight size={18} /></Link></div>
    </div></section>
    <section className="ng-outcomes ng-section" id="connected-architecture"><div className="ng-container ng-working-panel"><div className="ng-architecture-copy">
      <div className="ng-section-intro"><p className="ng-kicker">HOW WE WORK</p><h2>Connected thinking.<br />Accountable delivery.</h2><p>Application, infrastructure and operational decisions belong in the same conversation. Our approach keeps the dependencies and delivery evidence visible.</p></div>
      <Link className="ng-link" to="/about/why-bluelink">Why BlueLink Consults <ArrowRight size={18} /></Link>
      </div><img className="ng-working-photo" src="/images/conference-work.jpg" alt="A group of professionals reviewing work together in a conference room" width="1400" height="933" loading="lazy" />
    </div></section>
    <section className="ng-delivery ng-section"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">THE EAT FRAMEWORK</p><h2>A reviewable result at every stage.</h2></div><div className="ng-phase-grid">{phases.map(([number,title,text,result]) => <article key={number}><span className="ng-phase-number">{number}</span><h3>{title}</h3><p>{text}</p><div className="ng-phase-result"><span>{result}</span></div></article>)}</div><Link className="ng-link" to="/solutions/eat-framework">Explore our delivery framework <ArrowRight size={18} /></Link></div></section>
    <section className="ng-industries ng-section"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">WHO WE HELP</p><h2>Technology shaped around your operating needs.</h2><p>Explore the application, infrastructure and delivery challenges relevant to your organization.</p></div><div className="ng-industry-grid">{industries.map(name => <Link key={name} to="/solutions/who-we-help"><span>{name}</span><ArrowRight size={18} /></Link>)}</div></div></section>
    <section className="ng-resources ng-section" id="featured-guides" aria-labelledby="ng-guides-heading"><div className="ng-container"><div className="ng-section-intro"><p className="ng-kicker">EXPLORE BLUELINK</p><h2 id="ng-guides-heading">Technology in focus.</h2></div><div className="ng-resource-grid">{resources.map(({label,title,path,image,alt}) => <Link className="ng-resource-card" key={path} to={path}><img src={image} alt={alt} loading="lazy" decoding="async" width="600" height="450" /><span className="ng-kicker">{label}</span><h3>{title}</h3><span className="ng-link">Learn more <ArrowRight size={18} aria-hidden="true" /></span></Link>)}</div></div></section>
    <section className="ng-enterprise-cta"><div className="ng-container"><div><p className="ng-kicker">LET’S PLAN YOUR NEXT STEP</p><h2>What needs to work better?</h2><p>Tell us about the systems, constraints and outcomes that matter to your organization.</p></div><Link className="ng-btn ng-btn-white" to="/contact#consultation">Discuss Your Project <ArrowRight size={18} /></Link></div></section>
  </main>;
}

export function NigeriaEnterpriseFooter({ services }) {
  return <footer className="ng-enterprise-footer">
    <div className="ng-container ng-footer-grid"><div><Link className="ng-footer-brand" to="/">BlueLink <span>Consults</span></Link><p>Technology assessment, application modernization, cloud engineering and controlled delivery for Nigerian organizations.</p><a href="mailto:info@bluelinkconsults.com">info@bluelinkconsults.com</a><a href="tel:+2348068649496">Nigeria: +234 806 864 9496</a><a href="tel:+14014402434">US: +1 401-440-2434</a></div><div><h2>Services</h2><Link to="/services">Explore All Services</Link><Link to="/services/technology-audit-assessment">Start with an Assessment</Link><Link to="/contact">Discuss Your Requirements</Link></div><div><h2>Explore</h2><Link to="/solutions/eat-framework">The EAT Framework</Link><Link to="/solutions/who-we-help">Who We Help</Link><Link to="/about/why-bluelink">Why BlueLink</Link><Link to="/insights">Insights</Link><a href={zoomBookingUrl}>Schedule Demo</a><a href="/BlueLink-Company-Profile.pdf" download>Company Profile</a></div><div><h2>Company</h2><Link to="/about/our-story">Our Story</Link><Link to="/about/our-team">Our Team</Link><Link to="/events">Events & Activities</Link><Link to="/client-login">Client Login</Link><Link to="/faqs">FAQs</Link><Link to="/contact">Contact Us</Link><a href="https://www.facebook.com/share/19XEu6zf1n/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.instagram.com/bluelinkconsults" target="_blank" rel="noopener noreferrer">Instagram</a></div></div>
    <div className="ng-container ng-footer-bottom"><span>© {new Date().getFullYear()} BlueLink Consults. All rights reserved.</span><div><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms">Terms of Service</Link></div></div>
  </footer>;
}
