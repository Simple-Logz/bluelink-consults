import React, { useEffect, useState } from 'react';
import { Download, ArrowUpRight, ArrowRight, Phone, Mail, Globe2, Share2, UserPlus, FileText } from 'lucide-react';
import { SocialLogo, socialProfiles } from './SocialLinks';
import './conference-connect.css';
const profile='/BlueLink-Company-Profile.pdf';
const services=[['Technology Audit & Assessment','technology-audit-assessment'],['Application Modernisation','application-modernization'],['Cloud Infrastructure','cloud-infrastructure'],['DevOps & Automation','devops-automation'],['Pre-Deployment Validation','predeployment-validation'],['Operational & Incident Support','operational-incident-support']];
const contacts=[
 {label:'Nigeria',value:'+234 806 864 9496',href:'tel:+2348068649496',Icon:Phone},
 {label:'United States',value:'+1 401-440-2434',href:'tel:+14014402434',Icon:Phone},
 {label:'Email us',value:'info@bluelinkconsults.com',href:'mailto:info@bluelinkconsults.com',Icon:Mail},
 {label:'Visit our website',value:'bluelinkconsults.ng',href:'https://www.bluelinkconsults.ng',Icon:Globe2},
];
export default function ConferenceConnect(){
 const [notice,setNotice]=useState('');
 useEffect(()=>{document.title='Company Profile & Contact | BlueLink Consults';},[]);
 async function share(){try{const url=window.location.origin+'/connect';if(navigator.share)await navigator.share({title:'BlueLink Consults | Company Profile',url});else{await navigator.clipboard.writeText(url);setNotice('Link copied. You can now share our company profile.');}}catch(e){if(e.name!=='AbortError')setNotice('To share our profile, copy the page address from your browser.');}}
 return <main className="blc-page">
  <a className="blc-skip" href="#company-profile">Skip to company profile</a>
  <header className="blc-header"><div className="blc-container blc-header-inner">
   <a className="blc-brand" href="/" aria-label="BlueLink Consults homepage"><img src="/bluelink-logo.png" alt=""/><span>BlueLink<span>Consults</span></span></a>
   <div className="blc-header-actions"><a href="https://www.bluelinkconsults.ng">Our website <ArrowUpRight size={20}/></a><button onClick={share}><Share2 size={20}/><span>Share profile</span></button></div>
  </div></header>
  <section className="blc-hero" id="company-profile" aria-labelledby="blc-title"><div className="blc-container blc-hero-grid">
   <div className="blc-hero-copy"><div className="blc-kicker"><span/> MEET BLUELINK CONSULTS</div><h1 id="blc-title">Technology built<br/>for <span>your business.</span></h1><p>We help organisations build, modernise and strengthen the technology that powers their business.</p>
    <div className="blc-hero-actions"><a className="blc-button blc-button-white" href={profile} download><Download size={22}/> Download company profile</a><a className="blc-online" href={profile} target="_blank" rel="noopener noreferrer">View online <ArrowUpRight size={21}/></a></div>
    <div className="blc-file-info"><FileText size={18}/><span>Company profile</span><i/><span>12 pages</span><i/><span>PDF · 6.5 MB</span></div>
    <div className="blc-approach"><span>Engage</span><i/><span>Assess</span><i/><span>Transform</span></div>
   </div>
   <a className="blc-publication" href={profile} target="_blank" rel="noopener noreferrer" aria-label="View the BlueLink Consults company profile"><div className="blc-publication-image"><img src="/images/company-profile-cover.svg" alt="BlueLink Consults business profile cover"/></div><div className="blc-publication-footer"><span>Our company. Our capabilities.</span><span className="blc-publication-arrow"><ArrowUpRight size={26}/></span></div></a>
  </div></section>
  <div className="blc-container blc-body"><section className="blc-connect" aria-labelledby="blc-contact-title">
   <p className="blc-eyebrow">KEEP THE CONVERSATION GOING</p><h2 id="blc-contact-title">Connect with BlueLink.</h2><p className="blc-section-intro">Tell us what your business needs. Let’s explore how we can help.</p>
   <div className="blc-contacts">{contacts.map(({label,value,href,Icon})=><a className="blc-contact" href={href} key={label}><span className="blc-contact-top"><Icon size={23}/><ArrowUpRight size={20}/></span><span className="blc-contact-label">{label}</span><strong>{value}</strong></a>)}</div>
   <div className="blc-save-row"><a className="blc-button blc-button-navy" href="/BlueLink-Conference.vcf" download><UserPlus size={21}/> Save our contact details</a><span>Keep BlueLink in your contacts.</span></div>
   <div className="blc-social"><h3>Follow our work</h3><div>{socialProfiles.map(({name,href})=><a key={name} href={href} target="_blank" rel="noopener noreferrer"><SocialLogo name={name} size={22}/><span>{name}</span><ArrowUpRight size={17}/></a>)}</div></div>
  </section>
  <aside className="blc-services" aria-labelledby="blc-expertise-title"><p className="blc-eyebrow">OUR EXPERTISE</p><h2 id="blc-expertise-title">From assessment<br/>to transformation.</h2><p>Six connected services. Built around your business.</p><div className="blc-service-list">{services.map(([name,slug],i)=><a href={'/services/'+slug} key={slug}><span className="blc-service-number">0{i+1}</span><span>{name}</span><ArrowUpRight size={21}/></a>)}</div><a className="blc-project-link" href="/contact">Discuss your project <ArrowRight size={23}/></a></aside>
  </div>
  <footer className="blc-footer"><div className="blc-container blc-footer-inner"><a className="blc-footer-brand" href="/">BlueLink Consults<span>Engage | Assess | Transform</span></a><span>© {new Date().getFullYear()} BlueLink Consults Ltd.</span><a href="/privacy-policy">Privacy policy</a></div></footer>
  <div className="blc-toast" role="status">{notice}</div>
 </main>;
}
