# Demo booking activation

The demo form now calls the Supabase `book-demo` Edge Function instead of Formspree. Booking records, published availability, visitor details, Zoom meeting IDs, join links, and email delivery states are saved in Supabase.

## Required configuration

In BlueLink-Site's Supabase Dashboard → Edge Functions → Secrets, set:

- ZOOM_ACCOUNT_ID
- ZOOM_CLIENT_ID
- ZOOM_CLIENT_SECRET
- ZOOM_HOST_USER_ID (the Zoom host's user ID or email)

Create and activate a Zoom Server-to-Server OAuth app owned by your business's Zoom account. Give it the granular `meeting:write:meeting:admin` scope (or the applicable create-meeting scope shown by Zoom for your app). Keep secrets on the backend; do not use VITE_ variables for Zoom or service-role credentials.

Email notifications use the existing RESEND_API_KEY secret. The sender defaults to `noreply@bluelinkconsults.com`; verify that domain with Resend. Optional overrides: DEMO_FROM_EMAIL, DEMO_NOTIFY_EMAIL. The team recipient defaults to `info@bluelinkconsults.com`. Each confirmed booking records whether both confirmation emails succeeded. If delivery fails, visitors still receive the confirmed Zoom link onscreen and can download a calendar event. This is a calendar download, not automatic external calendar synchronization or a scheduled retry system.

Deploy the frontend with the existing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (legacy anon JWT) pointing to BlueLink-Site. The Edge Function's gateway verifies JWTs; opaque publishable keys require revisiting gateway authentication before switching keys.

## Availability and access

Log into the client portal with an existing admin account. Open Demo Bookings and add 30-minute slots in Nigeria time (Africa/Lagos). No business hours are assumed or populated. Only published slots between two hours and 60 days away are bookable. Slots start on the hour or half hour. This release does not synchronize a Zoom/Google/Outlook calendar's busy periods: the host must publish genuinely available times.

The migration enrolls existing profiles with role='admin' into a separate protected demo_booking_admins table. New booking administrators must be enrolled explicitly by a trusted backend operator; visitors cannot add themselves. Public clients cannot read booking details or directly write bookings. The service-role-only reservation function atomically reserves each slot and limits each email to three attempts per day.

## Recovery

Repeated submissions with the same request UUID never create another meeting. If Zoom returns an explicit creation rejection, the booking is marked failed and the slot is released. If a provider response is ambiguous or saving an already-created meeting fails, it is marked needs_review and the slot remains reserved. Look up the booking reference in the Zoom host's meeting list (the agenda contains that reference), recover its meeting ID and join URL, then update the booking to confirmed through a trusted server/database operation. Do not blindly mark a needs_review booking failed: an active Zoom meeting may already exist.

This is not full calendar sync, automated reminder delivery, or self-service cancellation. Visitors contact the team to reschedule/cancel. Avoid publicly enabling online scheduling until Zoom creation and email delivery pass a controlled test with your own address.

## Validation

Run `npm run build` and `node --test tests/demo-booking.test.mjs`. Verify RLS prevents anonymous booking reads and direct inserts. In a transaction, test two reservations of the same slot and retries with the same UUID, then roll back the test records. A real Zoom booking requires configured account credentials and a host-published slot.

References: https://developers.zoom.us/docs/api/meetings/ and https://developers.zoom.us/docs/internal-apps/s2s-oauth/.
