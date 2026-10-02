import { createClient } from "npm:@supabase/supabase-js@2.106.2";

const services = ["Technology Audit & Assessment", "Application Modernisation", "Cloud Infrastructure", "DevOps & Automation", "Pre-Deployment Validation", "Operational & Incident Support"];
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const zoomKeys = ["ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET", "ZOOM_HOST_USER_ID"];
const allowedOrigins = new Set(["https://bluelinkconsults.ng", "https://www.bluelinkconsults.ng", "https://bluelinkconsults.com", "https://www.bluelinkconsults.com"]);
const client = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const publicBooking = (row: any) => ({ id: row.id, starts_at: row.starts_at, status: row.status, join_url: row.join_url, notification_status: row.notification_status });

Deno.serve(async req => {
  const origin = req.headers.get("origin");
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store", "Access-Control-Allow-Origin": origin && allowedOrigins.has(origin) ? origin : "https://bluelinkconsults.ng", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
  const reply = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
  if (origin && !allowedOrigins.has(origin)) return reply({ error: "Origin not allowed" }, 403);
  if (req.method === "OPTIONS") return reply({});
  if (req.method !== "POST") return reply({ error: "Method not allowed" }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 12000) return reply({ error: "Request too large" }, 413);
    const body = JSON.parse(raw);
    const db = client();
    const configured = zoomKeys.every(key => !!Deno.env.get(key));
    if (body.action === "slots") {
      if (!configured) return reply({ configured: false, slots: [] });
      const { data: slots, error } = await db.from("demo_slots").select("id,starts_at,duration_minutes").eq("enabled", true).gte("starts_at", new Date(Date.now() + 7200000).toISOString()).lte("starts_at", new Date(Date.now() + 60 * 86400000).toISOString()).order("starts_at").limit(1000);
      if (error) throw error;
      const { data: busy, error: busyError } = await db.from("demo_bookings").select("slot_id").in("status", ["processing", "confirmed", "needs_review"]).gte("starts_at", new Date().toISOString());
      if (busyError) throw busyError;
      const taken = new Set(busy?.map(row => row.slot_id));
      return reply({ configured: true, slots: slots?.filter(slot => !taken.has(slot.id)) });
    }
    if (body.action !== "book") return reply({ error: "Invalid action" }, 400);
    if (!uuid.test(body.request_key || "")) return reply({ error: "Invalid booking reference" }, 400);
    // Retries return the original outcome and never create another Zoom meeting.
    const { data: existing, error: lookupError } = await db.from("demo_bookings").select("*").eq("request_key", body.request_key).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) return reply({ booking: publicBooking(existing) }, existing.status === "confirmed" ? 200 : 409);
    if (!configured) return reply({ error: "Online scheduling is being configured. Please email info@bluelinkconsults.com." }, 503);
    const payload: Record<string, string> = { request_key: body.request_key, slot_id: body.slot_id };
    for (const [key, max] of [["full_name", 120], ["email", 254], ["organisation", 200], ["phone", 40], ["service", 80], ["message", 4000], ["timezone", 80]] as const) {
      if (typeof body[key] !== "string" || body[key].length > max || (key !== "phone" && !body[key].trim())) return reply({ error: "Please complete all required fields." }, 400);
      payload[key] = body[key].trim();
    }
    if (!uuid.test(payload.slot_id || "") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) || !services.includes(payload.service)) return reply({ error: "Invalid booking details." }, 400);
    try { new Intl.DateTimeFormat("en", { timeZone: payload.timezone }); } catch { return reply({ error: "Invalid timezone." }, 400); }
    const { data: booking, error: reserveError } = await db.rpc("reserve_demo_booking", { payload });
    if (reserveError) return reply({ error: reserveError.message.includes("booking_rate_limit") ? "Too many booking attempts. Please contact our team." : "That time is no longer available. Please select another slot." }, 409);
    // Another identical request may have won the race. Only its owner creates Zoom.
    // reserve_demo_booking returns _existing for concurrent duplicate requests.
    if (booking._existing) return reply({ booking: publicBooking(booking) }, booking.status === "confirmed" ? 200 : 409);
    let meetingRequestStarted = false;
    try {
      const tokenResponse = await fetch("https://zoom.us/oauth/token", { method: "POST", headers: { Authorization: `Basic ${btoa(`${Deno.env.get("ZOOM_CLIENT_ID")}:${Deno.env.get("ZOOM_CLIENT_SECRET")}`)}`, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "account_credentials", account_id: Deno.env.get("ZOOM_ACCOUNT_ID")! }), signal: AbortSignal.timeout(15000) });
      if (!tokenResponse.ok) throw new Error("zoom_auth_failed");
      const token = await tokenResponse.json();
      meetingRequestStarted = true;
      const meetingResponse = await fetch(`https://api.zoom.us/v2/users/${encodeURIComponent(Deno.env.get("ZOOM_HOST_USER_ID")!)}/meetings`, { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ topic: `BlueLink Demo — ${payload.service}`, agenda: `Booking reference: ${booking.id}`, type: 2, start_time: booking.starts_at, timezone: "UTC", duration: 30, settings: { waiting_room: true, join_before_host: false, use_pmi: false } }), signal: AbortSignal.timeout(20000) });
      if (!meetingResponse.ok) { meetingRequestStarted = false; throw new Error("zoom_create_rejected"); }
      const meeting = await meetingResponse.json();
      const link = new URL(meeting.join_url);
      if (link.protocol !== "https:" || !(link.hostname === "zoom.us" || link.hostname.endsWith(".zoom.us")) || !meeting.id) throw new Error("zoom_invalid_response");
      const { data: confirmed, error: saveError } = await db.from("demo_bookings").update({ status: "confirmed", meeting_id: String(meeting.id), join_url: meeting.join_url }).eq("id", booking.id).select().single();
      if (saveError) throw new Error("meeting_save_failed");
      // Email failures are recorded separately: the confirmed booking remains valid.
      const resendKey = Deno.env.get("RESEND_API_KEY");
      let notificationsSent = false;
      if (resendKey) {
        const when = new Intl.DateTimeFormat("en-GB", { timeZone: payload.timezone, dateStyle: "full", timeStyle: "short" }).format(new Date(booking.starts_at));
        const text = `BlueLink demo confirmed\n\n${payload.full_name}\n${payload.organisation}\n${payload.email}\n${payload.phone}\nService: ${payload.service}\nWhen: ${when} (${payload.timezone})\nDuration: 30 minutes\nMeeting link: ${meeting.join_url}\nReference: ${booking.id}\n\nSession priorities: ${payload.message}`;
        const results = await Promise.allSettled([payload.email, Deno.env.get("DEMO_NOTIFY_EMAIL") || "info@bluelinkconsults.com"].map(to => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `demo-${booking.id}-${to === payload.email ? "client" : "team"}` }, body: JSON.stringify({ from: Deno.env.get("DEMO_FROM_EMAIL") || "BlueLink Consults <noreply@bluelinkconsults.com>", to, subject: "BlueLink demo confirmed", text }), signal: AbortSignal.timeout(10000) })));
        notificationsSent = results.every(result => result.status === "fulfilled" && result.value.ok);
      }
      const notificationStatus = notificationsSent ? "sent" : "failed";
      await db.from("demo_bookings").update({ notification_status: notificationStatus }).eq("id", booking.id);
      return reply({ booking: { ...publicBooking(confirmed), notification_status: notificationStatus } });
    } catch (error) {
      const failure = error instanceof Error ? error.message : "provider_error";
      await db.from("demo_bookings").update({ status: meetingRequestStarted ? "needs_review" : "failed", failure_code: failure }).eq("id", booking.id);
      return reply({ error: meetingRequestStarted ? "Your booking needs review. Please contact our team with this reference before booking again.": "We could not create your meeting. Please try another booking or contact our team.", reference: booking.id, retryable: !meetingRequestStarted }, 502);
    }
  } catch {
    return reply({ error: "Unable to process scheduling. Please try again or contact our team." }, 500);
  }
});
