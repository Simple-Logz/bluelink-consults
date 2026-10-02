import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, Layers, ShieldCheck, SlidersHorizontal, ClipboardCheck, ArrowRight } from "lucide-react";

const reasons = [
  {icon:Target,title:"Your institution comes first",text:"We start with your priorities, workflows and constraints before recommending technology."},
  {icon:Layers,title:"One connected technology partner",text:"Assessment, modernization, cloud, automation, validation and operational support work together."},
  {icon:ShieldCheck,title:"Risk considered before release",text:"We examine dependencies, security and deployment readiness to help protect critical operations."},
  {icon:SlidersHorizontal,title:"Recommendations that fit",text:"Solutions are shaped around your existing systems, budget and growth plans."},
  {icon:ClipboardCheck,title:"A clear path from assessment to delivery",text:"Our Engage, Assess and Transform framework keeps priorities, responsibilities and next steps clear."},
];

export default function WhyInstitutionsChoose({ embedded = false }) {
  useEffect(() => { if (!embedded) document.title = "Why Institutions Choose BlueLink | BlueLink Consults"; }, [embedded]);
  const Heading = embedded ? "h2" : "h1";
  return <section className="bl-why" aria-labelledby={embedded ? "bl-why-home-title" : "bl-why-page-title"}>
    <style>{`
      .bl-why{background:#0b2236;color:#fff;padding:54px 32px}
      .bl-why-inner{max-width:1160px;margin:auto;display:grid;grid-template-columns:1.08fr 1fr;gap:48px;align-items:center}
      .bl-why-kicker{display:block;color:#8dc4ff;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:18px}
      .bl-why h1,.bl-why h2{font-family:Inter,system-ui,sans-serif;color:#fff;font-size:clamp(30px,2.7vw,40px);line-height:1.12;letter-spacing:-.035em;margin:0 0 24px;font-weight:650}
      .bl-why ul{padding:0;margin:0;list-style:none;display:grid;gap:16px}
      .bl-why li{display:grid;grid-template-columns:26px 1fr;gap:14px}
      .bl-why li>svg{color:#8dc4ff;margin-top:3px}
      .bl-why li strong{display:block;font-size:16px;line-height:1.4;font-weight:650;margin-bottom:5px}
      .bl-why li p{font-size:14px;line-height:1.55;color:#c6d5e5;margin:0}
      .bl-why-photo{margin:0;min-width:0}
      .bl-why-photo img{width:100%;height:470px;display:block;object-fit:cover;object-position:center;border-radius:12px}
      .bl-why-cta{display:inline-flex;align-items:center;gap:10px;margin-top:24px;color:#fff!important;font-weight:700;font-size:15px;text-decoration:none;border-bottom:1px solid #8dc4ff;padding-bottom:7px}
      .bl-why-cta:hover{color:#8dc4ff!important}
      @media(max-width:900px){.bl-why-inner{gap:36px;grid-template-columns:1fr}.bl-why-photo img{height:auto;aspect-ratio:3/2}.bl-why{padding:44px 24px}}
      @media(max-width:520px){.bl-why{padding:36px 20px}.bl-why h1,.bl-why h2{font-size:32px}.bl-why ul{gap:20px}}
    `}</style>
    <div className="bl-why-inner">
      <div>
        <span className="bl-why-kicker">Built around your institution</span>
        <Heading id={embedded ? "bl-why-home-title" : "bl-why-page-title"}>Why Institutions Choose BlueLink</Heading>
        <ul>{reasons.map(({icon:Icon,title,text})=><li key={title}><Icon size={23} aria-hidden="true"/><div><strong>{title}</strong><p>{text}</p></div></li>)}</ul>
        <Link className="bl-why-cta" to="/request-demo">Discuss your institution’s needs <ArrowRight size={18}/></Link>
      </div>
      <figure className="bl-why-photo"><img src="/images/bluelink-boardroom.png" alt="Illustrative image of Black business professionals discussing plans in a bright modern boardroom" loading={embedded ? "lazy" : "eager"} width="1536" height="1024"/></figure>
    </div>
  </section>;
}
