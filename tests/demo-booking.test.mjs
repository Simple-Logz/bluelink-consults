import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';

let handler;
let rows;
let environment;
let providerMode;
let zoomCalls;
const requestKey = '9718f0dc-69cd-4e0d-8d81-32a099a90b92';
const slotId = 'd76a328d-a79c-4327-968d-cd956a73f111';
const body = { action:'book', request_key:requestKey, slot_id:slotId, full_name:'Test User',email:'test@example.com',organisation:'Test Organisation',phone:'',service:'Cloud Infrastructure',message:'Show a demo',timezone:'Africa/Lagos' };
globalThis.Deno = { env: { get: key => environment[key] }, serve: fn => { handler=fn; } };
globalThis.__demoCreateClient = () => ({ from(table) {
  let update;
  const chain = { select(){ return chain; },eq(){ return chain; },async maybeSingle(){ return {data:rows[0]||null,error:null}; },update(value){ update=value; return chain; },async single(){ if(providerMode==='save_failed') return {error:{message:'storage failed'}}; Object.assign(rows[0],update); return {data:{...rows[0]},error:null}; },then(resolve){ if(update) Object.assign(rows[0],update); resolve({error:null}); } };
  return chain;
}, async rpc(){ const row={...body,id:'test-booking',status:'processing',starts_at:new Date(Date.now()+86400000).toISOString(),notification_status:'pending'};rows.push(row);return {data:row,error:null}; } });
const source=(await readFile(new URL('../supabase/functions/book-demo/index.ts',import.meta.url),'utf8')).replace(/import \{ createClient \}[^\n]+/, 'const createClient = globalThis.__demoCreateClient;');
await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const originalFetch=globalThis.fetch;
function setup(mode='ok'){
  rows=[];providerMode=mode;zoomCalls=0;
  environment={ SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'private',ZOOM_ACCOUNT_ID:'account',ZOOM_CLIENT_ID:'client',ZOOM_CLIENT_SECRET:'secret',ZOOM_HOST_USER_ID:'host',RESEND_API_KEY:'email-key' };
  globalThis.fetch=async url=>{
    if(url.includes('/oauth/token')) return Response.json({access_token:'test-token'});
    if(url.includes('/meetings')){zoomCalls++;if(mode==='timeout')throw new Error('timeout'); if(mode==='rejected')return Response.json({error:'denied'},{status:400});return Response.json({id:123456,join_url:'https://zoom.us/j/123456'});}
    if(url.includes('resend.com'))return Response.json({}, {status:mode==='email_failed'?500:200});
    throw new Error('unexpected fetch');
  };
}
const request=(data=body)=>new Request('https://example.test/book-demo',{method:'POST',headers:{origin:'https://bluelinkconsults.ng','content-type':'application/json'},body:JSON.stringify(data)});
test('unconfigured scheduler does not advertise bookable slots',async()=>{setup();delete environment.ZOOM_CLIENT_SECRET;const res=await handler(request({action:'slots'}));assert.deepEqual(await res.json(),{configured:false,slots:[]});assert.equal(rows.length,0);});
test('rejects invalid data before reserving or calling Zoom',async()=>{setup();const res=await handler(request({...body,email:'invalid'}));assert.equal(res.status,400);assert.equal(rows.length,0);assert.equal(zoomCalls,0);});
test('confirmed link is persisted and retries do not create another Zoom meeting',async()=>{setup();const res=await handler(request());assert.equal(res.status,200);assert.equal(rows[0].status,'confirmed');assert.equal(rows[0].join_url,'https://zoom.us/j/123456');assert.equal((await res.json()).booking.notification_status,'sent');const retry=await handler(request());assert.equal(retry.status,200);assert.equal(zoomCalls,1);});
test('explicit Zoom rejection releases the booking and never confirms',async()=>{setup('rejected');const res=await handler(request());assert.equal(res.status,502);assert.equal(rows[0].status,'failed');assert.equal((await res.json()).retryable,true);});
test('ambiguous Zoom timeout holds the slot for review',async()=>{setup('timeout');const res=await handler(request());assert.equal(res.status,502);assert.equal(rows[0].status,'needs_review');assert.equal((await res.json()).retryable,false);await handler(request());assert.equal(zoomCalls,1);});
test('meeting save failure does not return a false confirmation',async()=>{setup('save_failed');const res=await handler(request());assert.equal(res.status,502);assert.equal(rows[0].status,'needs_review');});
test('email failure preserves the confirmed booking and is reported',async()=>{setup('email_failed');const res=await handler(request());assert.equal(res.status,200);assert.equal(rows[0].status,'confirmed');assert.equal((await res.json()).booking.notification_status,'failed');});
test('rejects an unapproved browser origin',async()=>{setup();const res=await handler(new Request('https://example.test',{method:'POST',headers:{origin:'https://attacker.example'},body:JSON.stringify(body)}));assert.equal(res.status,403);assert.equal(rows.length,0);});
process.on('exit',()=>{globalThis.fetch=originalFetch;});
