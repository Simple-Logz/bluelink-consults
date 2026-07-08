// supabase/functions/notify/index.ts
// Sends email notification (via Resend) every time a client
// messages or comments. Deploy with: supabase functions deploy notify

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const {
      type,
      senderName,
      milestoneTitle,
      messagePreview,
      recipientEmail,
    } = await req.json();

    const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_KEY) {
      return new Response("RESEND_API_KEY not set", { status: 500 });
    }

    const isMessage = type === "message";

    const subject = isMessage
      ? `📩 New message from ${senderName} — BlueLink Portal`
      : `💬 New comment from ${senderName} — BlueLink Portal`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Gold header bar -->
        <tr><td style="background:#c9a84c;height:5px;"></td></tr>
        <!-- Header -->
        <tr>
          <td style="background:#0d1b2e;padding:24px 32px;">
            <p style="margin:0;font-family:'Georgia',serif;font-size:22px;font-weight:700;color:#ffffff;">BlueLink Consults</p>
            <p style="margin:4px 0 0;font-size:12px;color:#7a8eaa;letter-spacing:0.08em;text-transform:uppercase;">Client Portal Notification</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#c9a84c;text-transform:uppercase;letter-spacing:0.1em;">
              ${isMessage ? "New Direct Message" : "New Milestone Comment"}
            </p>
            <h2 style="margin:0 0 20px;font-size:20px;color:#0d1b2e;font-weight:700;">
              ${senderName} sent you a ${isMessage ? "message" : "comment"}
            </h2>
            <!-- Message preview -->
            <div style="background:#f8fafc;border-left:4px solid #c9a84c;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">${messagePreview}</p>
            </div>
            ${milestoneTitle ? `<p style="margin:0 0 24px;font-size:13px;color:#7a8eaa;">On milestone: <strong style="color:#374151;">${milestoneTitle}</strong></p>` : ""}
            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#c9a84c;border-radius:8px;">
                  <a href="https://www.bluelinkconsults.com/client-login"
                    style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0d1b2e;text-decoration:none;">
                    Open Portal →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:18px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              BlueLink Consults · offiongconnect@gmail.com · 401-440-2434
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BlueLink Consults <noreply@bluelinkconsults.com>",
        to: recipientEmail,
        subject,
        html,
      }),
    });

    const emailData = await emailRes.json();

    return new Response(JSON.stringify({ success: true, email: emailData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
