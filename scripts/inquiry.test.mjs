import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/inquiry.js';

test('inquiry storage and notification outcomes', async () => {
  const originalFetch=global.fetch;
  const originalUrl=process.env.VITE_SUPABASE_URL;
  const originalKey=process.env.VITE_SUPABASE_ANON_KEY;
  process.env.VITE_SUPABASE_URL='https://example.invalid';
  process.env.VITE_SUPABASE_ANON_KEY='test';
  const payload={name:'Example Visitor',email:'visitor@example.invalid',message:'Please discuss our migration.',request_id:'aaaaaaaa-0000-4000-8000-000000000001'};
  const invoke=async(body=payload,headers={})=>{
    const res={setHeader(){},status(code){this.code=code;return this;},json(value){this.value=value;return this;}};
    await handler({method:'POST',headers,body},res);return res;
  };
  try {
    let calls=[];
    global.fetch=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({ok:true})};};
    let r=await invoke();assert.equal(r.code,200);assert.equal(r.value.notification,'accepted');assert.equal(calls.length,2);
    const row=JSON.parse(calls[0].options.body);assert.equal(row.form_type,'website_inquiry');assert.equal(row.client_id,null);assert.equal(row.id,payload.request_id);
    calls=[];r=await invoke({...payload,name:['Invalid']});assert.equal(r.code,400);assert.equal(calls.length,0);
    r=await invoke(payload,{origin:'https://unknown.invalid'});assert.equal(r.code,403);
    global.fetch=async()=>({ok:false,status:400,json:async()=>({code:'42501'})});r=await invoke();assert.equal(r.code,503);assert.equal(r.value.ok,undefined);
    let count=0;global.fetch=async()=>{if(count++===0)return{ok:true};throw Error('notification unavailable');};r=await invoke({...payload,source:'demo'});assert.equal(r.code,200);assert.equal(r.value.notification,'pending');
    global.fetch=async()=>({ok:false,json:async()=>({code:'23505'})});r=await invoke();assert.equal(r.code,200);assert.equal(r.value.notification,'previous_submission');
    global.fetch=async()=>{throw Error('storage unavailable');};r=await invoke();assert.equal(r.code,503);
  } finally {global.fetch=originalFetch;if(originalUrl===undefined)delete process.env.VITE_SUPABASE_URL;else process.env.VITE_SUPABASE_URL=originalUrl;if(originalKey===undefined)delete process.env.VITE_SUPABASE_ANON_KEY;else process.env.VITE_SUPABASE_ANON_KEY=originalKey;}
});
