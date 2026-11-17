import React, { useEffect, useRef, useState } from 'react';
import { sectorIds } from './engagementContent';
import DeliveryEvidence from './DeliveryEvidence';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Download, CheckCircle2, Image, X } from 'lucide-react';
import { zoomBookingUrl } from './siteBooking';
import SocialLinks from './SocialLinks';
import './institutional-pages.css';

export const institutionSectors = [
 ['Banks & microfinance institutions','Reliable payment services, recoverable infrastructure and traceable technology controls.','Review data location, legacy integrations, recovery arrangements and release evidence.'],
 ['Fintechs & payment operators','Payment infrastructure that can grow without losing control of operational risk.','Map transaction data, strengthen delivery pipelines and validate migration readiness.'],
 ['Hospitals & diagnostic centres','Dependable systems for clinical support, administration and patient-facing workflows.','Assess application integrations, access controls, backup recovery and service interruptions.'],
 ['Government & public institutions','Maintainable platforms that support public services and accountable delivery.','Review existing systems, define procurement-ready requirements and plan operational handover.'],
 ['Enterprises & professional services','Connected applications and infrastructure that support everyday business operations.','Resolve fragmented workflows, technical debt, manual deployments and avoidable infrastructure costs.'],
 ['Growing technology teams','Repeatable releases, useful monitoring and clearer engineering ownership.','Automate delivery, test failure recovery and establish practical incident response procedures.'],
];
export const sampleDocuments = [
 {title:'Technology assessment sample',file:'technology-assessment-sample.pdf',detail:'Scope, evidence register, sample findings and a prioritized action plan.'},
 {title:'Migration planning template',file:'migration-planning-template.pdf',detail:'Dependencies, target environment, cutover gates and rollback planning.'},
 {title:'Release validation sample',file:'release-validation-sample.pdf',detail:'Acceptance criteria, test evidence, exceptions and approval responsibilities.'},
 {title:'Application modernization plan',file:'application-modernization-sample.pdf',detail:'Assessment findings, phased changes and acceptance evidence.'},
 {title:'DevOps delivery and release runbook',file:'devops-delivery-sample.pdf',detail:'Pipeline gates, ownership, deployment and rollback instructions.'},
 {title:'Incident response and operating runbook',file:'incident-support-sample.pdf',detail:'Triage, restoration responsibilities, recovery checks and review actions.'},
];
export function InstitutionHero({label,title,text,image='/images/conference-work.jpg'}) {
 return <section className="bl-institution-hero"><div className="ng-container bl-institution-split"><div><p className="ng-kicker">{label}</p><h1>{title}</h1><p>{text}</p><a className="ng-btn" href={zoomBookingUrl}>Schedule a discussion <ArrowRight size={18}/></a></div><img src={image} alt="Professionals collaborating in a working meeting" width="1400" height="933" fetchPriority="high" /></div></section>;
}
function NextStep({title='Start with the right assessment.'}) {return <section className="bl-next-step ng-container"><div><h2>{title}</h2><p>Discuss your priorities, constraints and the evidence your team needs before committing to change.</p></div><a className="ng-btn" href={zoomBookingUrl}>Book a Consultation <ArrowRight size={18}/></a></section>;}
const sectorDeliverables = [
 'A technology findings register, recovery priorities and a phased improvement roadmap.',
 'A dependency map, migration plan and release acceptance evidence.',
 'An integration assessment, access-control findings and recovery priorities.',
 'A systems inventory, phased requirements and operational handover responsibilities.',
 'A workflow and application assessment, improvement priorities and implementation scope.',
 'Release acceptance criteria, an exception register and operating responsibilities.',
];
const sectorSamples = ['technology-assessment-sample.pdf','migration-planning-template.pdf','technology-assessment-sample.pdf','technology-assessment-sample.pdf','technology-assessment-sample.pdf','release-validation-sample.pdf'];
export function InstitutionalSectorsPage() {return <main><InstitutionHero label="WHO WE HELP" title="Technology for institutions that need dependable operations." text="Practical engineering for financial services, healthcare, public institutions and enterprise teams in Nigeria."/><section className="ng-container bl-content-section"><div className="bl-section-heading"><p className="ng-kicker">YOUR OPERATING CONTEXT</p><h2>Different institutions. Specific technology priorities.</h2><p>These are the organizations our services are designed to support. Engagement scope is agreed around your environment.</p></div><div className="bl-sector-grid">{institutionSectors.map(([name,need,approach],index)=><article id={sectorIds[index]} className="bl-sector-target" key={name}><h3>{name}</h3><p>{need}</p><p className="bl-small-copy">{approach}</p><h4>What your team receives</h4><p>{sectorDeliverables[index]}</p><a className="ng-link" href={`/resources/${sectorSamples[index]}`} download>Inspect a relevant sample <Download size={16}/></a><Link className="ng-link" to={`/contact?sector=${sectorIds[index]}#consultation`}>Discuss your requirements <ArrowRight size={16}/></Link></article>)}</div></section><NextStep/></main>;}

const deliveryStages = [
 {id:'engage',number:'01',name:'Engage',title:'Set the direction together.',text:'Begin with the workflows that matter, the people who depend on them and the constraints the project must respect.',image:'/images/team-discussion.jpg',alt:'Professionals discussing priorities face to face',activities:['Agree the business priorities and project boundary.','Name the decision owners and success measures.','Confirm the information needed for assessment.'],output:'Engagement brief, agreed scope and acceptance criteria.',gate:'Your team approves the scope before assessment starts.'},
 {id:'assess',number:'02',name:'Assess',title:'Make the decision evidence clear.',text:'Review systems and dependencies, validate the risks and compare practical options before committing to implementation.',image:'/images/professional-notes.jpg',alt:'A professional recording findings in a notebook',activities:['Map applications, data and infrastructure dependencies.','Review security, performance, recovery and delivery gaps.','Prioritize improvements against effort, cost and risk.'],output:'Findings report, risk register and phased roadmap.',gate:'Your team reviews the findings and approves the delivery plan.'},
 {id:'transform',number:'03',name:'Transform',title:'Deliver, validate and hand over.',text:'Implement the approved changes in controlled stages, with visible progress and a clear basis for release decisions.',image:'/images/conference-work.jpg',alt:'A team collaborating on implementation at their laptops',activities:['Implement changes with repeatable configuration and tests.','Validate integrations, performance and rollback readiness.','Complete runbooks, knowledge transfer and acceptance.'],output:'Implemented changes, release evidence and operating handover.',gate:'A named owner accepts the results and operating responsibilities.'},
];
export function ProfessionalEATPage() {return <main className="bl-eat-page"><InstitutionHero label="ENGAGE · ASSESS · TRANSFORM" title="A clear route from priority to dependable delivery." text="Our EAT framework connects business decisions, technical evidence and implementation. Every stage has a defined output and an approval point."/><nav className="bl-stage-nav ng-container" aria-label="Framework stages">{deliveryStages.map(s=><a key={s.id} href={`#${s.id}`}><span>{s.number}</span><strong>{s.name}</strong><ArrowRight size={18}/></a>)}</nav><section className="ng-container bl-eat-stages">{deliveryStages.map(s=><article id={s.id} className="bl-eat-stage" key={s.id}><div className="bl-eat-stage-photo"><img src={s.image} alt={s.alt} width="1400" height="933" loading="lazy"/></div><div className="bl-eat-stage-copy"><p className="ng-kicker">{s.number} · {s.name}</p><h2>{s.title}</h2><p>{s.text}</p><ul>{s.activities.map(a=><li key={a}><CheckCircle2 size={18} aria-hidden="true"/><span>{a}</span></li>)}</ul><div className="bl-delivery-output"><strong>What you receive</strong><p>{s.output}</p></div><p className="bl-approval-gate">{s.gate}</p></div></article>)}</section><section className="bl-eat-assurance"><div className="ng-container"><p className="ng-kicker">CONTROL THROUGHOUT DELIVERY</p><h2>Clear ownership. Visible decisions. A usable handover.</h2><div className="bl-assurance-grid"><div><h3>Scope & change control</h3><p>Changes to scope, cost and timing are reviewed with the agreed decision owners.</p></div><div><h3>Evidence & acceptance</h3><p>Findings and release results are documented against the criteria agreed for your project.</p></div><div><h3>Operational continuity</h3><p>Recovery, support responsibilities and knowledge transfer are part of the delivery plan.</p></div></div><Link className="ng-link" to="/resources/delivery-examples">Inspect sample deliverables <ArrowRight size={18}/></Link></div></section><NextStep title="What does your next stage need to achieve?"/></main>;}

export function MigrationReadinessPage() {return <main><InstitutionHero label="DATA LOCALISATION READINESS" title="Plan a migration your operations can rely on." text="Assess where payment data lives, understand application dependencies and define a controlled path to Nigerian-hosted infrastructure."/><section className="ng-container bl-content-section"><div className="bl-migration-intro"><div><p className="ng-kicker">BEGIN WITH THE FACTS</p><h2>Know the gap before choosing the platform.</h2><p>For banks and payment operators, a readiness assessment links data location to the systems, vendors and operating procedures that need to change.</p><Link className="ng-link" to="/blog/cbn-data-localisation-migration">Read our CBN policy briefing <ArrowRight size={18}/></Link></div><aside><h3>What the assessment should establish</h3><ul><li>Where relevant data is stored and managed</li><li>Which systems and vendors depend on it</li><li>What the target environment must support</li><li>What can be migrated safely, and in what order</li></ul></aside></div><div className="bl-section-heading"><h2>From discovery to operating handover.</h2></div><div className="bl-sector-grid">{[['Discover','Data inventory, data-flow map, vendor dependencies and an evidence request.'],['Assess','Current-state review, technical gaps, risks and target-platform requirements.'],['Plan','Migration waves, ownership, cost assumptions and a cutover runbook.'],['Validate','Reconciliation, performance tests, restore checks and rollback rehearsal.'],['Transition','Approved cutover, monitored stabilization and acceptance evidence.'],['Operate','Runbooks, escalation paths, recovery arrangements and knowledge transfer.']].map(([name,text])=><article key={name}><h3>{name}</h3><p>{text}</p></article>)}</div><div className="bl-policy-scope"><strong>Your compliance team owns the regulatory interpretation.</strong><p>BlueLink supports engineering assessment, migration and validation. The applicable data scope, regulatory submissions and legal requirements should be confirmed by your institution’s compliance and legal advisers.</p></div><p>Scope, price and delivery timing follow the assessment of workload complexity, dependencies and required controls.</p><a className="ng-link" href="/resources/migration-planning-template.pdf" download><Download size={18}/>Download the migration planning template</a></section><NextStep title="Discuss your data-location and migration priorities."/></main>;}

export function DeliveryExamplesPage() {return <main><InstitutionHero label="DELIVERY EXAMPLES" title="See the work behind the recommendations." text="Sample documents and illustrative scenarios show the level of clarity to agree before an engagement begins." image="/images/team-discussion.jpg"/><section className="ng-container bl-content-section"><div className="bl-section-heading"><h2>Documents your team can inspect.</h2><p>These samples use fictional information to demonstrate structure. They are not completed client audits, certifications or client results.</p></div><div className="bl-sector-grid bl-document-grid">{sampleDocuments.map(d=><article key={d.file}><p className="ng-kicker">PDF · ILLUSTRATIVE SAMPLE</p><h3>{d.title}</h3><p>{d.detail}</p><a className="ng-link" href={`/resources/${d.file}`} download><Download size={18}/>Download sample</a></article>)}</div><div className="bl-section-heading"><h2>How the approach applies.</h2><p>Illustrative engagement scenarios, rather than claims of past client work.</p></div><div className="bl-sector-grid">{[['Payment-data migration','A payment operator needs to review an offshore transaction database.','Map the data and dependencies, compare target hosting, rehearse replication and cutover, and retain reconciliation evidence.','Data inventory, migration runbook and acceptance record.'],['Hospital service reliability','A diagnostic centre needs to understand recurring application interruptions.','Assess service dependencies, monitor failure signals, test restore procedures and agree recovery responsibilities.','Findings register, monitoring plan and operating runbooks.'],['Safer application releases','An engineering team wants consistent release checks.','Agree acceptance criteria, automate repeatable checks and track unresolved exceptions before approval.','Validation report, exception register and release decision.']].map(([name,problem,approach,output])=><article key={name}><p className="ng-kicker">ILLUSTRATIVE SCENARIO</p><h3>{name}</h3><p>{problem}</p><p>{approach}</p><strong>Expected deliverables</strong><p className="bl-small-copy">{output}</p></article>)}</div></section><DeliveryEvidence/><NextStep/></main>;}

const conferenceGalleries = [
  { id: 'moonshot-2026', title: 'MOONSHOT 2026', artwork: '/images/events/moonshot-2026-artwork.jpg',
    photos: [
      { src: '/images/events/moonshot-2026/photo-01.jpg', alt: 'Moonshot 2026 conference photo 1' },
      { src: '/images/events/moonshot-2026/photo-02.jpg', alt: 'Moonshot 2026 conference photo 2' },
      { src: '/images/events/moonshot-2026/photo-03.jpg?v=2', alt: 'Moonshot 2026 conference photo 3' },
      { src: '/images/events/moonshot-2026/photo-04.jpg', alt: 'Moonshot 2026 conference photo 4' },
      { src: '/images/events/moonshot-2026/photo-05.jpg', alt: 'Moonshot 2026 conference photo 5' },
      { src: '/images/events/moonshot-2026/photo-06.jpg', alt: 'Moonshot 2026 conference photo 6' },
      { src: '/images/events/moonshot-2026/photo-07.jpg', alt: 'Moonshot 2026 conference photo 7' },
      { src: '/images/events/moonshot-2026/photo-08.jpg?v=2', alt: 'Moonshot 2026 conference photo 8' },
      { src: '/images/events/moonshot-2026/photo-09.jpg?v=2', alt: 'Moonshot 2026 conference photo 9' },
      { src: '/images/events/moonshot-2026/photo-10.jpg', alt: 'Moonshot 2026 conference photo 10' },
      { src: '/images/events/moonshot-2026/photo-11.jpg?v=2', alt: 'Moonshot 2026 conference photo 11' },
      { src: '/images/events/moonshot-2026/photo-12.jpg?v=2', alt: 'Moonshot 2026 conference photo 12' },
    ], videos: [] },
  { id: 'afsnet-2026', title: 'AfSNET 2026', artwork: '/images/events/afsnet-2026-artwork.jpg',
    photos: [
      { src: '/images/events/afsnet-2026/photo-01.jpg', alt: 'AfSNET 2026 conference photo 1' },
      { src: '/images/events/afsnet-2026/photo-02.jpg', alt: 'AfSNET 2026 conference photo 2' },
      { src: '/images/events/afsnet-2026/photo-03.jpg', alt: 'AfSNET 2026 conference photo 3' },
      { src: '/images/events/afsnet-2026/photo-04.jpg', alt: 'AfSNET 2026 conference photo 4' },
      { src: '/images/events/afsnet-2026/photo-05.jpg', alt: 'AfSNET 2026 conference photo 5' },
      { src: '/images/events/afsnet-2026/photo-06.jpg', alt: 'AfSNET 2026 conference photo 6' },
      { src: '/images/events/afsnet-2026/photo-07.jpg', alt: 'AfSNET 2026 conference photo 7' },
      { src: '/images/events/afsnet-2026/photo-08.jpg', alt: 'AfSNET 2026 conference photo 8' },
      { src: '/images/events/afsnet-2026/photo-09.jpg', alt: 'AfSNET 2026 conference photo 9' },
      { src: '/images/events/afsnet-2026/photo-10.jpg', alt: 'AfSNET 2026 conference photo 10' },
      { src: '/images/events/afsnet-2026/photo-11.jpg', alt: 'AfSNET 2026 conference photo 11' },
      { src: '/images/events/afsnet-2026/photo-12.jpg', alt: 'AfSNET 2026 conference photo 12' },
      { src: '/images/events/afsnet-2026/photo-13.jpg', alt: 'AfSNET 2026 conference photo 13' },
      { src: '/images/events/afsnet-2026/photo-14.jpg', alt: 'AfSNET 2026 conference photo 14' },
      { src: '/images/events/afsnet-2026/photo-15.jpg', alt: 'AfSNET 2026 conference photo 15' },
      { src: '/images/events/afsnet-2026/photo-16.jpg', alt: 'AfSNET 2026 conference photo 16' },
      { src: '/images/events/afsnet-2026/photo-17.jpg', alt: 'AfSNET 2026 conference photo 17' },
      { src: '/images/events/afsnet-2026/photo-18.jpg', alt: 'AfSNET 2026 conference photo 18' },
      { src: '/images/events/afsnet-2026/photo-19.jpg', alt: 'AfSNET 2026 conference photo 19' },
    ], videos: [] },
];

function GalleryCarousel({ photos, label, start = 0, onOpen }) {
  const track = useRef(null);
  const [index, setIndex] = useState(start);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (track.current) track.current.scrollLeft = track.current.clientWidth * start;
    });
    return () => cancelAnimationFrame(frame);
  }, [start]);

  function goTo(next) {
    const slide = track.current.children[next];
    if (slide) {
      track.current.scrollTo({
        left: slide.offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }

  function syncIndex() {
    const { children, scrollLeft, clientWidth } = track.current;
    if (clientWidth && children.length) {
      setIndex(Math.min(children.length - 1, Math.round(scrollLeft / clientWidth)));
    }
  }

  return (
    <div className="bl-gallery-carousel" role="region" aria-label={label}>
      <div
        className="bl-gallery-track"
        ref={track}
        onScroll={syncIndex}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          goTo(index + (event.key === 'ArrowRight' ? 1 : -1));
        }}
        tabIndex={photos.length > 1 ? 0 : undefined}
      >
        {photos.map(({ src, alt, caption, conference }, position) => (
          <figure className="bl-gallery-slide" key={`${conference || ''}-${src}`}>
            {onOpen ? (
              <button className="bl-photo-button" type="button" onClick={() => onOpen(position)} aria-label={`Enlarge photo: ${alt}`}>
                <img src={src} alt={alt} loading={position === start ? 'eager' : 'lazy'} decoding="async" />
              </button>
            ) : (
              <img src={src} alt={alt} loading={position === start ? 'eager' : 'lazy'} decoding="async" />
            )}
            {(conference || caption) && (
              <figcaption>{conference && <strong>{conference}</strong>}{caption && <span>{caption}</span>}</figcaption>
            )}
          </figure>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="bl-gallery-controls">
          <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label="Previous photo">
            <ChevronLeft aria-hidden="true" size={20} />
          </button>
          <span aria-live="polite">{index + 1} / {photos.length}</span>
          <button type="button" onClick={() => goTo(index + 1)} disabled={index === photos.length - 1} aria-label="Next photo">
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoViewer({ photos, start, onClose }) {
  return (
    <dialog
      className="bl-photo-viewer"
      aria-label="Enlarged conference photos"
      ref={(node) => {
        if (node && !node.open) node.showModal();
      }}
      onClose={onClose}
    >
      <form method="dialog" className="bl-photo-viewer-close">
        <button aria-label="Close photo viewer"><X aria-hidden="true" size={22} /></button>
      </form>
      <GalleryCarousel photos={photos} label="Enlarged photos" start={start} />
    </dialog>
  );
}

export function EventsActivitiesPage() {
  return (
    <main>
      <InstitutionHero
        label="EVENTS & ACTIVITIES"
        title="Conversations that inform our work."
        text="Follow BlueLink’s participation in technology discussions, professional gatherings and team activities."
      />
      <section className="ng-container bl-content-section bl-events-hub" aria-labelledby="bl-conferences-heading">
        <div>
          <h2 id="bl-conferences-heading">Conference galleries</h2>
          <div className="bl-conference-links">
            {conferenceGalleries.map(({ id, title, artwork, photos }) => (
              <Link className="bl-conference-link" data-conference={id} key={id} to={`/events/${id}`}>
                {(artwork || photos[0]) && (
                  <span className="bl-conference-artwork">
                    <img src={artwork || photos[0].src} alt="" loading="lazy" />
                    {id === 'moonshot-2026' && (
                      <span className="bl-conference-artwork-date">October 28–29, 2026</span>
                    )}
                  </span>
                )}
                <span className="bl-conference-link-content">
                  <span>{title}</span>
                  <span className="bl-conference-link-action">View gallery <ArrowRight aria-hidden="true" size={18} /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bl-events-social">
          <h2>Follow BlueLink</h2>
          <SocialLinks />
        </div>
      </section>
    </main>
  );
}

export function ConferenceGalleryPage() {
  const { conferenceId } = useParams();
  const conference = conferenceGalleries.find(({ id }) => id === conferenceId);
  return <ConferenceGallery key={conferenceId} conference={conference} />;
}

function ConferenceGallery({ conference }) {
  const [viewerIndex, setViewerIndex] = useState(null);

  return (
    <main>
      <header className="bl-gallery-header">
        <div className="ng-container">
          <Link to="/events"><ArrowLeft aria-hidden="true" size={18} /> Events &amp; Activities</Link>
          <h1>{conference?.title ?? 'Conference gallery unavailable'}</h1>
        </div>
      </header>
      {conference && (
        <section className="ng-container bl-content-section bl-event-media" aria-label={`${conference.title} gallery`}>
          {conference.photos.length === 0 && conference.videos.length === 0 && (
            <div className="bl-gallery-empty">
              <Image aria-hidden="true" size={28} />
              <p>Photos and videos will be posted here when available.</p>
            </div>
          )}
          {conference.photos.length > 0 && (
            <div className="bl-photo-grid">
              {conference.photos.map(({ src, alt, caption }, index) => (
                <figure key={src}>
                  <button className="bl-photo-button" type="button" onClick={() => setViewerIndex(index)} aria-label={`Enlarge photo: ${alt}`}>
                    <img src={src} alt={alt} loading="lazy" decoding="async" />
                  </button>
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {conference.videos.length > 0 && (
            <div className="bl-photo-grid">
              {conference.videos.map(({ src, caption, poster, captions }) => (
                <figure key={src}>
                  <video controls playsInline preload="metadata" src={src} poster={poster} aria-label={caption || conference.title}>
                    {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
                  </video>
                  {caption && <figcaption>{caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          {viewerIndex !== null && <PhotoViewer photos={conference.photos} start={viewerIndex} onClose={() => setViewerIndex(null)} />}
        </section>
      )}
    </main>
  );
}
