import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function DemoBookingsAdmin() {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  async function load() {
    setLoading(true); setError("");
    const results = await Promise.all([supabase.from("demo_bookings").select("id,full_name,email,organisation,phone,service,message,timezone,starts_at,status,join_url,notification_status,failure_code").order("created_at", { ascending: false }).limit(200), supabase.from("demo_slots").select("id,starts_at,enabled").gte("starts_at", new Date().toISOString()).order("starts_at").limit(1000)]);
    const failure = results.find(result => result.error);
    if (failure) setError("Could not load demo bookings. Check your demo administrator access.");
    else { setBookings(results[0].data); setSlots(results[1].data); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);
  async function addSlot(event) {
    event.preventDefault(); setError(""); setSaving(true);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const start = new Date(`${values.date}T${values.time}:00+01:00`);
    if (!Number.isFinite(start.getTime()) || start.getTime() < Date.now() + 7200000 || start.getTime() > Date.now() + 60 * 86400000 || ![0, 30].includes(start.getUTCMinutes())) { setError("Choose a half-hour slot between two hours and 60 days from now."); setSaving(false); return; }
    const { error: insertError } = await supabase.from("demo_slots").insert({ starts_at: start.toISOString() });
    if (insertError) setError("Unable to add this time. It may already exist or your access may be restricted.");
    else { form.reset(); await load(); }
    setSaving(false);
  }
  async function toggle(slot) {
    const { error: updateError } = await supabase.from("demo_slots").update({ enabled: !slot.enabled }).eq("id", slot.id);
    if (updateError) setError("Unable to change availability."); else await load();
  }
  const when = value => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  return <section><h2>Demo bookings</h2><p>Publish times when your team and Zoom host are available. All times below are Nigeria time (Africa/Lagos). Bookings are stored in Supabase.</p><p>These slots do not sync with an external calendar. Disable a slot if the host becomes unavailable. A confirmed booking stays booked when a slot is disabled.</p><form onSubmit={addSlot} style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}><label>Date <input required type="date" name="date" /></label><label>Time <input required type="time" name="time" step="1800" /></label><button disabled={saving} type="submit">{saving ? "Saving…" : "Add 30-minute slot"}</button></form>{error && <p role="alert">{error}</p>}<button onClick={load} disabled={loading}>{loading ? "Loading…" : "Refresh bookings"}</button><h3>Upcoming availability</h3><div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{slots.map(slot => <button key={slot.id} onClick={() => toggle(slot)}>{when(slot.starts_at)} · {slot.enabled ? "Enabled (click to disable)" : "Disabled (click to enable)"}</button>)}</div>{!slots.length && <p>No slots published yet.</p>}<h3>Recent bookings</h3>{!bookings.length && <p>No demo bookings yet.</p>}{bookings.map(booking => <article key={booking.id} style={{ background: "white", border: "1px solid #ddd", borderRadius: 12, padding: 20, margin: "14px 0", overflowWrap: "anywhere" }}><h4>{booking.organisation} · {booking.full_name}</h4><p>{when(booking.starts_at)} · {booking.status} · Emails: {booking.notification_status}</p><p><a href={`mailto:${booking.email}`}>{booking.email}</a> · {booking.phone || "No phone supplied"}</p><p>{booking.service}</p><p style={{ whiteSpace: "pre-wrap" }}>{booking.message}</p>{booking.join_url && <p><a target="_blank" rel="noreferrer" href={booking.join_url}>Zoom meeting link</a></p>}<small>Visitor timezone: {booking.timezone} · Reference: {booking.id}{booking.failure_code ? ` · Issue: ${booking.failure_code}` : ""}</small></article>)}</section>;
}
