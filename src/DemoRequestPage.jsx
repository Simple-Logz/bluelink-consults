import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Download, Mail, Send } from "lucide-react";
import { supabase } from "./supabaseClient";

const services = ["Technology Audit & Assessment", "Application Modernisation", "Cloud Infrastructure", "DevOps & Automation", "Pre-Deployment Validation", "Operational & Incident Support"];
const zoneList = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : ["Africa/Lagos", "America/New_York", "Europe/London", "UTC"];
const format = (value, timezone) => new Intl.DateTimeFormat("en-GB", { timeZone: timezone, dateStyle: "full", timeStyle: "short" }).format(new Date(value));
const dateKey = (value, timezone) => new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));

export default function DemoRequestPage() {
  useEffect(() => { document.title = "Request Demo | BlueLink Consults"; }, []);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos");
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [booking, setBooking] = useState(null);
  const requestKey = useRef(crypto.randomUUID());
  const submitting = useRef(false);
  async function loadSlots() {
    setLoading(true);
    try {
      if (!supabase) throw new Error("Scheduling is unavailable. Please email info@bluelinkconsults.com.");
      const { data, error: callError } = await supabase.functions.invoke("book-demo", { body: { action: "slots" } });
      if (callError) throw new Error("Unable to load available times. Please retry or contact our team.");
      setConfigured(data.configured);
      setSlots(data.slots || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadSlots(); }, []);
  const dates = [...new Set(slots.map(slot => dateKey(slot.starts_at, timezone)))];
  async function submit(event) {
    event.preventDefault();
    if (submitting.current || !supabase || !slotId) return;
    submitting.current = true;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setStatus("sending"); setError("");
    try {
      const { data, error: callError } = await supabase.functions.invoke("book-demo", { body: { action: "book", ...values, timezone, slot_id: slotId, request_key: requestKey.current } });
      if (callError) {
        let details;
        try { details = await callError.context?.json(); } catch { /* transport failure; preserve request key */ }
        if (details?.retryable) requestKey.current = crypto.randomUUID();
        throw new Error(details?.error ? `${details.error}${details.reference ? ` Reference: ${details.reference}` : ""}` : details?.booking ? `Booking status: ${details.booking.status}. Contact our team with reference ${details.booking.id} before trying a new booking.` : "Confirmation could not be retrieved. Retry with the same form to check this booking, or contact our team.");
      }
      if (data?.booking?.status !== "confirmed" || !data.booking.join_url) throw new Error("Your meeting has not been confirmed. Please contact our team.");
      setBooking(data.booking); setStatus("sent");
    } catch (err) { setStatus("idle"); setError(err.message); }
    finally { submitting.current = false; }
  }
  function calendarDownload() {
    const stamp = value => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BlueLink Consults//Demo//EN", "BEGIN:VEVENT", `UID:${booking.id}@bluelinkconsults.ng`, `DTSTAMP:${stamp(Date.now())}`, `DTSTART:${stamp(booking.starts_at)}`, `DTEND:${stamp(new Date(booking.starts_at).getTime() + 1800000)}`, "SUMMARY:BlueLink Consults Demo", `DESCRIPTION:Join your demo: ${booking.join_url}`, `URL:${booking.join_url}`, "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "BlueLink-Demo.ics"; a.click(); URL.revokeObjectURL(url);
  }
  return <>
    <section className="page-hero"><p className="eyebrow">BlueLink Consults</p><h1>Request Demo</h1><p>Choose an available time for a focused, 30-minute demonstration with our team.</p></section>
    <section className="contact-section" id="consultation">
      <div className="contact-copy"><p className="eyebrow">Engage · Assess · Transform</p><h2>See how we can help.</h2><p>Select a service and share your priorities. Your confirmed booking includes a Zoom meeting link.</p><div className="contact-details"><a href="mailto:info@bluelinkconsults.com"><Mail size={17} /> info@bluelinkconsults.com</a><a href="tel:+2348068649496">+234 806 864 9496</a></div></div>
      {status === "sent" ? <div className="success-box" role="status"><CheckCircle2 size={40} /><h3>Your demo is booked</h3><p>{format(booking.starts_at, timezone)} ({timezone}) · 30 minutes</p><p><a href={booking.join_url} target="_blank" rel="noreferrer">Open your Zoom meeting</a></p><button onClick={calendarDownload}>Add to calendar</button><p>{booking.notification_status === "sent" ? "Confirmation emails have been sent to you and our team." : "Your booking is saved. Email delivery could not be confirmed; please save your meeting link and calendar event."}</p><small>Booking reference: {booking.id}</small><p><a href="mailto:info@bluelinkconsults.com">Contact our team to reschedule or cancel</a></p></div> :
      <form className="contact-form" onSubmit={submit}>
        <label>Full Name<input required name="full_name" maxLength={120} autoComplete="name" /></label>
        <label>Work Email<input required name="email" type="email" maxLength={254} autoComplete="email" /></label>
        <label>Organisation<input required name="organisation" maxLength={200} autoComplete="organization" /></label>
        <label>Phone Number (optional)<input name="phone" type="tel" maxLength={40} autoComplete="tel" placeholder="+234 ..." /></label>
        <label>Service of Interest<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map(service => <option key={service}>{service}</option>)}</select></label>
        <label>What would you like to see?<textarea required name="message" rows="4" maxLength={4000} placeholder="Describe your technical challenge and what your team would like to explore." /></label>
        <label>Timezone<select value={timezone} onChange={event => { setTimezone(event.target.value); setDate(""); setSlotId(""); }}>{[...new Set([timezone, "Africa/Lagos", ...zoneList])].map(zone => <option key={zone}>{zone}</option>)}</select></label>
        <label>Demo Date<select required value={date} disabled={loading || !configured || status === "sending"} onChange={event => { setDate(event.target.value); setSlotId(""); }}><option value="">Select an available day</option>{dates.map(day => <option key={day}>{day}</option>)}</select></label>
        <label>Demo Time<select required value={slotId} disabled={!date || status === "sending"} onChange={event => setSlotId(event.target.value)}><option value="">Select an available time</option>{slots.filter(slot => dateKey(slot.starts_at, timezone) === date).map(slot => <option key={slot.id} value={slot.id}>{new Intl.DateTimeFormat("en-GB", { timeZone: timezone, timeStyle: "short" }).format(new Date(slot.starts_at))} · 30 minutes</option>)}</select></label>
        {loading ? <p role="status">Loading available times…</p> : !configured ? <p role="status">Online scheduling is being configured. <a href="mailto:info@bluelinkconsults.com?subject=Demo%20booking">Email us to arrange your demo.</a></p> : slots.length === 0 ? <p role="status">No times are currently available. Please contact our team.</p> : <small>Times are shown in {timezone}. Your meeting is confirmed only after the booking and Zoom link are saved.</small>}
        <button type="button" onClick={() => { setError(""); loadSlots(); }} disabled={loading || status === "sending"}>Refresh available times</button>
        <div className="demo-profile"><strong>Learn more about BlueLink Consults</strong><a href="/BlueLink-Company-Profile.pdf" download><Download size={18} /> Download Company Profile</a></div>
        {error && <p className="auth-message" role="alert">{error}</p>}
        <button type="submit" disabled={status === "sending" || !configured || !slotId}>{status === "sending" ? "Creating your meeting…" : "Book Demo"} <Send size={18} /></button>
        <small>By booking, you agree that we may contact you about your enquiry. Please do not include passwords or confidential system data. <a href="/privacy-policy">Privacy policy</a></small>
      </form>}
    </section>
  </>;
}
