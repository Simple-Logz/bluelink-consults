import React, { useEffect, useState } from "react";
import { CheckCircle2, Download, Mail, Send, CalendarDays } from "lucide-react";

const bookingUrl = "https://scheduler.zoom.us/bluelink-consults-fe0ra0/30-mins-with-bluelink";
const isNigeriaSite = ["bluelinkconsults.ng", "www.bluelinkconsults.ng"].includes(window.location.hostname);
const bookingButtonStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#1557c0", color: "#fff", padding: "14px 22px", borderRadius: 8, fontWeight: 700, textDecoration: "none", margin: "12px 0" };
function BookingButton() {
  return <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={bookingButtonStyle}><CalendarDays size={18} aria-hidden="true" /> {isNigeriaSite ? "Book a 30-minute demo" : "Book a LytHouse demo"}</a>;
}

const services = ["Technology Audit & Assessment", "Application Modernisation", "Cloud Infrastructure", "DevOps & Automation", "Pre-Deployment Validation", "Operational & Incident Support"];

export default function DemoRequestPage() {
  useEffect(() => { document.title = `${isNigeriaSite ? "Request Demo" : "Request a LytHouse Demo"} | BlueLink Consults`; }, []);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    setStatus("sending");
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID || "meedwzan"}`, {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" }, signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("Request not accepted");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("Your request could not be confirmed. Please try again or email info@bluelinkconsults.com.");
    } finally { clearTimeout(timeout); }
  }
  return <>
    <section className="page-hero" style={{ paddingBottom: 40 }}><p className="eyebrow">BlueLink Consults</p><h1>{isNigeriaSite ? "Request Demo" : "Request a LytHouse Demo"}</h1><p>{isNigeriaSite ? "Choose a time for a 30-minute Zoom demo, or send us your requirements so we can prepare a session for your team." : "Explore release validation with your engineering team. Share your pipeline and validation priorities so we can discuss supported checks, integration requirements and release evidence."}</p></section>
    <section className="contact-section" id="consultation" style={{ paddingTop: 48 }}>
      <div className="contact-copy">
        <p className="eyebrow">Engage · Assess · Transform</p>
        <BookingButton />
        <p>{isNigeriaSite ? "Prefer to discuss your requirements first? Select a service and send us your priorities using the form." : "During the session, we will review your release workflow, discuss the checks that matter and confirm the appropriate validation scope."}</p>
        {!isNigeriaSite && <p>For application, cloud or DevOps consulting, <a href="/contact#consultation">book a consultation</a>.</p>}
        <div className="contact-details"><a href="mailto:info@bluelinkconsults.com"><Mail size={17} /> info@bluelinkconsults.com</a><a href="tel:+14014402434">US: +1 401-440-2434</a><a href="tel:+2348068649496">Nigeria: +234 806 864 9496</a></div>
      </div>
      {status === "sent" ? <div className="success-box" role="status"><CheckCircle2 size={40} /><h3>Demo request received</h3><p>Thank you. Choose an available time below to book your demo. If you have already booked, our team will use these details to prepare your session.</p><BookingButton /><br /><a href="/BlueLink-Company-Profile.pdf" download><Download size={18} /> Download Company Profile</a><p><a href="mailto:info@bluelinkconsults.com?subject=BlueLink%20Nigeria%20demo%20follow-up">Email our team</a></p><button onClick={() => setStatus("idle")}>Send another request</button></div> :
      <form className="contact-form" onSubmit={submit}>
        <input type="hidden" name="_subject" value="BlueLink demo request" />
        <input type="hidden" name="source" value="BlueLink / Request Demo" />
        <label>Full Name<input required name="name" autoComplete="name" /></label>
        <label>Work Email<input required name="email" type="email" autoComplete="email" /></label>
        <label>Organization<input required name="company" autoComplete="organization" /></label>
        <label>Phone Number (optional)<input name="phone" type="tel" autoComplete="tel" placeholder="Include your country code" /></label>
        {isNigeriaSite ? <label>Service of Interest<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service}>{service}</option>)}</select></label> : <input type="hidden" name="service" value="LytHouse — Pre-Deployment Validation" />}
        <label>What would you like to see?<textarea required name="message" rows="4" placeholder={isNigeriaSite ? "Describe your technical challenge and what your team would like to explore." : "Tell us about your CI/CD platform, environments and the checks you need before production."} /></label>
        <label>Preferred Date (optional)<input name="preferredDate" type="date" /></label>
        <small>We will confirm availability with you by email. Please do not include passwords or confidential system data.</small>
        <div className="demo-profile"><strong>Learn more about BlueLink Consults</strong><a href="/BlueLink-Company-Profile.pdf" download><Download size={18} /> Download Company Profile</a><small>Optional background information about our services.</small></div>
        {error && <p className="auth-message" role="alert">{error} <a href="mailto:info@bluelinkconsults.com?subject=BlueLink%20Nigeria%20demo%20request">Email us instead</a></p>}
        <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Demo Request"} <Send size={18} /></button>
        <small>By sending this request, you agree that we may contact you about your enquiry. <a href="/privacy-policy">Privacy policy</a></small>
      </form>}
    </section>
  </>;
}
