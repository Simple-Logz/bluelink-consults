const pendingForms = new WeakMap();
export async function submitInquiry(form, source='contact') {
  const values = new FormData(form), data={};
  for(const [key,value] of values) {
    if(key.startsWith('_')) continue;
    if(data[key]!==undefined) data[key]=[].concat(data[key],String(value));
    else data[key]=String(value);
  }
  const fingerprint=JSON.stringify(data);
  let pending=pendingForms.get(form);
  if(!pending || pending.fingerprint!==fingerprint) { pending={fingerprint,id:crypto.randomUUID()}; pendingForms.set(form,pending); }
  const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,source,request_id:pending.id}),signal:AbortSignal.timeout(25000)});
  const result=await response.json().catch(()=>({}));
  if(!response.ok || !result.ok) throw new Error(result.error || 'Your request could not be confirmed. Please try again or email info@bluelinkconsults.com.');
  return result;
}
