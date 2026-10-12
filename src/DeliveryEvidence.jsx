import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function DeliveryEvidence() {
  return <section className="ng-container bl-content-section bl-delivery-evidence" aria-labelledby="delivery-evidence-heading">
    <div className="bl-section-heading"><p className="ng-kicker">PEOPLE & DELIVERY EVIDENCE</p><h2 id="delivery-evidence-heading">Know who leads the work. Inspect what you receive.</h2><p>Meet the people responsible for strategy, engineering and client engagement, and review our sample documents before agreeing your scope.</p></div>
    <div className="bl-sector-grid">
      <article><h3>Founder-led cloud experience</h3><p>John Offiong, Founder & CEO, brings hands-on experience working with Azure Kubernetes Service (AKS) environments.</p><Link className="ng-link" to="/about/our-team">Meet John and the team <ArrowRight size={16}/></Link></article>
      <article><h3>Named engineering leadership</h3><p>Samuel Kubiangha leads Technology & Engineering. Efefiom Archibong leads Cloud & DevOps Engineering.</p><Link className="ng-link" to="/about/our-team">Meet our engineering leads <ArrowRight size={16}/></Link></article>
      <article><h3>Reviewable work products</h3><p>Inspect assessment, modernization, migration, DevOps, release validation and incident support samples. Each uses illustrative information to show the structure of the work.</p><Link className="ng-link" to="/resources/delivery-examples">Inspect sample deliverables <ArrowRight size={16}/></Link></article>
    </div>
  </section>;
}
