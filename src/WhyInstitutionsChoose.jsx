import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Layers, ShieldCheck, SlidersHorizontal, ClipboardCheck, ArrowRight } from "lucide-react";

const reasons = [
  {icon:Target,title:"An agreed scope before implementation",text:"Your business workflows, constraints and success measures define the work."},
  {icon:Layers,title:"Connected architecture and delivery",text:"Application, data, infrastructure and release decisions are reviewed together so dependencies remain visible."},
  {icon:ShieldCheck,title:"Evidence before release",text:"Agreed security, integration and rollback checks support an informed approval decision."},
  {icon:SlidersHorizontal,title:"Explicit technical trade-offs",text:"Recommendations explain their cost assumptions, operating requirements and implementation risks."},
  {icon:ClipboardCheck,title:"A documented operational handover",text:"Runbooks, ownership and knowledge transfer help your team operate the delivered solution."},
];

export default function WhyInstitutionsChoose({ embedded = false }) {
  useEffect(() => { if (!embedded) document.title = "Why BlueLink Consults | BlueLink Consults"; }, [embedded]);
  const Heading = embedded ? "h2" : "h1";
  return <><section className="bl-why" aria-labelledby={embedded ? "bl-why-home-title" : "bl-why-page-title"}>
    <style>{`
      .bl-why{background:#0b2236;color:#fff;padding:56px 32px}
      .bl-why-inner{max-width:1240px;margin:auto;display:grid;grid-template-columns:1.08fr 1fr;gap:40px;align-items:center}
      .bl-why-kicker{display:block;color:#8dc4ff;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:12px}
      .bl-why h1,.bl-why h2{font-family:Inter,system-ui,sans-serif;color:#fff;font-size:clamp(28px,2.4vw,34px);line-height:1.12;letter-spacing:-.035em;margin:0 0 18px;font-weight:650}
      .bl-why ul{padding:0;margin:0;list-style:none;display:grid;gap:10px}
      .bl-why li{display:grid;grid-template-columns:26px 1fr;gap:14px}
      .bl-why li>svg{color:#8dc4ff;margin-top:3px}
      .bl-why li strong{display:block;font-size:16px;line-height:1.3;font-weight:650;margin-bottom:3px}
      .bl-why li p{font-size:14px;line-height:1.45;color:#c6d5e5;margin:0}
      .bl-why-photo{margin:0;min-width:0}
      .bl-why-photo img{width:100%;height:380px;display:block;object-fit:cover;object-position:center;border-radius:12px}
      .bl-why-cta{display:inline-flex;align-items:center;gap:10px;margin-top:18px;color:#fff!important;font-weight:700;font-size:15px;text-decoration:none;border-bottom:1px solid #8dc4ff;padding-bottom:7px}
      .bl-why-cta:hover{color:#8dc4ff!important}
      @media(max-width:900px){.bl-why-inner{gap:24px;grid-template-columns:1fr}.bl-why-photo img{height:auto;aspect-ratio:3/2}.bl-why{padding:44px 24px}}
      @media(max-width:520px){.bl-why{padding:40px 20px}.bl-why h1,.bl-why h2{font-size:28px}.bl-why ul{gap:12px}}
    `}</style>
    <div className="bl-why-inner">
      <div>
        <span className="bl-why-kicker">What to expect from an engagement</span>
        <Heading id={embedded ? "bl-why-home-title" : "bl-why-page-title"}>Why BlueLink Consults</Heading>
        <ul>{reasons.map(({icon:Icon,title,text})=><li key={title}><Icon size={23} aria-hidden="true"/><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
        <Link className="bl-why-cta" to="/contact#consultation">Discuss your project <ArrowRight size={18}/></Link>
      </div>
      <figure className="bl-why-photo"><img src="/images/team-discussion.jpg" alt="Professionals discussing technology in a conference room" loading={embedded ? "lazy" : "eager"} width="1536" height="1024"/></figure>
    </div>
  </section>{!embedded && <section className="reviewable-deliverables"><div><h2>What you can review before committing</h2><p>Ask to see the proposed scope, acceptance criteria and handover requirements. The examples below illustrate the documents to agree for your project; they are not client results.</p><div className="evidence-grid"><article><h3>Architecture and migration plan</h3><p>Service dependencies, API contracts, data ownership and staged migration decisions—for example, extracting order tracking while billing remains in the existing application.</p></article><article><h3>Release evidence</h3><p>The deployed version, test results, failed checks, approved exceptions and rollback criteria, with a named release decision owner.</p></article><article><h3>Operating handover</h3><p>Monitoring signals, alert thresholds, escalation contacts, recovery steps and the responsibilities your team accepts after delivery.</p></article></div><p className="scope-note">The deliverables and level of detail depend on the agreed engagement scope.</p></div></section>}</>;
}
