import { randomUUID } from 'node:crypto';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  const origin = req.headers.origin;
  const allowed = ['https://www.bluelinkconsults.ng','https://bluelinkconsults.ng','https://www.bluelinkconsults.com','https://bluelinkconsults.com'];
  if (origin && !allowed.includes(origin)) return res.status(403).json({ error: 'Invalid origin.' });
  let payload;
  try { payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'Invalid request.' }); }
  if (!payload || JSON.stringify(payload).length > 30000) return res.status(400).json({ error: 'Request too large or empty.' });
  if (payload.website) return res.status(400).json({ error: 'Please submit the form manually.' });
  const source = payload.source === 'demo' ? 'demo' : 'contact';
  const data = {};
  for (const [key,value] of Object.entries(payload)) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) || key === 'request_id' || key === 'website') continue;
    if (Array.isArray(value)) data[key] = value.slice(0,20).map(v=>String(v).slice(0,500));
    else if (typeof value === 'string') data[key] = value.trim().slice(0,10000);
  }
  if (typeof data.name !== 'string' || typeof data.email !== 'string' || typeof data.message !== 'string' || (data.name?.length || 0) < 2 || data.name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '') || data.email.length > 320 || (data.message?.length || 0) < 5) return res.status(400).json({ error: 'Please provide your name, a valid email and a message of at least five characters.' });
  data.source=source;
  const id = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.request_id || '') ? payload.request_id : randomUUID();
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key) return res.status(503).json({ error: 'The inquiry service is temporarily unavailable. Please email info@bluelinkconsults.com.' });
  try {
    const saved = await fetch(`${base}/rest/v1/form_submissions`, { method:'POST', headers:{ apikey:key, 'Content-Type':'application/json', Prefer:'return=minimal' }, body:JSON.stringify({ id,client_id:null,project_id:null,form_type:source==='demo'?'website_demo':'website_inquiry',data }),signal:AbortSignal.timeout(12000) });
    if (!saved.ok) {
      const result = await saved.json().catch(()=>({}));
      if (result.code === '23505') return res.status(200).json({ ok:true, reference:id, notification:'previous_submission' });
      console.error('Inquiry storage failed',saved.status,result.code);
      return res.status(503).json({ error:'We could not record your request. Please try again or email info@bluelinkconsults.com.' });
    }
    let notification='pending';
    try {
      const notify = await fetch(`https://formspree.io/f/${process.env.VITE_FORMSPREE_ID || 'meedwzan'}`, { method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...data,_subject:`BlueLink ${source} request · ${id.slice(0,8)}`,reference:id}),signal:AbortSignal.timeout(8000) });
      const response = await notify.json().catch(()=>({}));
      if (notify.ok && response.ok) notification='accepted';
      else console.warn('Inquiry saved; notification not confirmed',notify.status);
    } catch { console.warn('Inquiry saved; notification request failed'); }
    return res.status(200).json({ ok:true,reference:id,notification });
  } catch { return res.status(503).json({ error:'The request could not be confirmed. Retry with the same form, or email info@bluelinkconsults.com.' }); }
}
