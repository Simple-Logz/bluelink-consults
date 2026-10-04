import React, {lazy, Suspense, useEffect, useState} from 'react';
import {LockKeyhole, ArrowRight} from 'lucide-react';
import {supabase} from './supabaseClient';
import {STAFF_DOMAIN, isStaffEmail} from './staffAccess';
import './enterpriseSimulator.css';
const Workspace = lazy(() => import('./EnterpriseSimulator'));

export default function StaffWorkspace() {
  const [user,setUser] = useState(null), [checking,setChecking] = useState(true), [accessError,setAccessError] = useState('');
  const [mode,setMode] = useState('login'), [email,setEmail] = useState(''), [name,setName] = useState(''), [password,setPassword] = useState(''), [confirm,setConfirm] = useState('');
  const [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState(''), [recovery,setRecovery] = useState(false);
  useEffect(() => {
    let alive = true;
    const previousRobots = document.querySelector('meta[name="robots"]');
    const previousContent = previousRobots?.content;
    const robots = previousRobots || document.createElement('meta');
    robots.name='robots'; robots.content='noindex,nofollow'; if(!previousRobots) document.head.appendChild(robots);
    async function check() {
      if (!supabase) {if(alive){setAccessError('Staff sign-in is not configured. Please contact the site administrator.');setChecking(false);}return;}
      try {
        const {data,error:authError} = await supabase.auth.getUser();
        if(!alive)return;
        if(authError && authError.name !== 'AuthSessionMissingError') {setAccessError('Unable to verify your session. Please sign in again.');setUser(null);return;}
        if(!data?.user){setUser(null);return;}
        if(!isStaffEmail(data.user.email) || !data.user.email_confirmed_at){setUser(null);setAccessError('Use a verified @'+STAFF_DOMAIN+' account to enter this workspace.');return;}
        const {data:allowed,error:policyError} = await supabase.rpc('bluelink_staff_access');
        if(!alive)return;
        if(policyError || allowed !== true){setAccessError('Staff access could not be verified. Please sign in again or contact the administrator.');setUser(null);return;}
        setAccessError(''); setUser(data.user);
      } catch {if(alive){setUser(null);setAccessError('Unable to connect. Check your connection and try again.');}}
      finally {if(alive)setChecking(false);}
    }
    check();
    const subscription = supabase?.auth.onAuthStateChange((event) => {
      if(event==='PASSWORD_RECOVERY'){setRecovery(true);setMode('reset');setUser(null);setChecking(false);return;}
      if(event==='SIGNED_OUT'){setUser(null);setRecovery(false);setChecking(false);return;}
      setTimeout(() => {if(alive)check();},0);
    }).data.subscription;
    return () => {alive=false;subscription?.unsubscribe();if(previousRobots)robots.content=previousContent;else robots.remove();};
  },[]);
  const redirect = () => window.location.origin + '/simulator';
  function changeMode(next){setMode(next);setPassword('');setConfirm('');setError('');setNotice('');}
  async function submit(e) {
    e.preventDefault();setError('');setNotice('');
    const normalized=email.trim().toLowerCase();
    if(mode!=='reset'&&!isStaffEmail(normalized)){setError('Enter your @'+STAFF_DOMAIN+' email address.');return;}
    if(['signup','reset'].includes(mode)&&(password.length<10||password!==confirm)){setError(password.length<10?'Use at least 10 characters for your password.':'The passwords do not match.');return;}
    setBusy(true);
    try {
      let response;
      if(mode==='signup') response=await supabase.auth.signUp({email:normalized,password,options:{emailRedirectTo:redirect(),data:{full_name:name.trim(),company:'BlueLink Consults'}}});
      else if(mode==='forgot') response=await supabase.auth.resetPasswordForEmail(normalized,{redirectTo:redirect()});
      else if(mode==='reset') response=await supabase.auth.updateUser({password});
      else response=await supabase.auth.signInWithPassword({email:normalized,password});
      if(response.error)throw response.error;
      setPassword('');setConfirm('');setAccessError('');
      if(mode==='signup'){setMode('verify');setNotice('Check your company inbox for the confirmation email. Confirm your address, then return here to sign in.');}
      if(mode==='forgot')setNotice('If this account exists, a password reset email has been sent. Check your company inbox.');
      if(mode==='reset'){setRecovery(false);setMode('login');setNotice('Password updated. Sign in with your new password.');await supabase.auth.signOut();}
    } catch (err) {
      const text=err.message||'Sign-in could not be completed.';
      setError(/email address.*not authorized|sending emails/i.test(text)?'Email delivery is not available for this address. Ask the administrator to check Supabase email delivery settings.':text);
    } finally {setBusy(false);}
  }
  async function resend(){setBusy(true);setError('');try{const {error:err}=await supabase.auth.resend({type:'signup',email:email.trim().toLowerCase(),options:{emailRedirectTo:redirect()}});if(err)throw err;setNotice('Confirmation email requested. Check your inbox and spam folder.');}catch(err){setError(err.message);}finally{setBusy(false);}}
  async function signOut(){const {error:err}=await supabase.auth.signOut();if(err)setAccessError('Sign-out failed. Please try again.');}
  if(checking)return <main className="es-app es-technical es-auth"><div className="es-auth-card" role="status">Checking staff access…</div></main>;
  if(user&&!recovery)return <Suspense fallback={<main className="es-app es-technical" role="status">Opening assessment workspace…</main>}><Workspace user={user} onSignOut={signOut}/></Suspense>;
  const titles={login:'Staff sign-in',signup:'Create your staff account',forgot:'Reset your password',reset:'Choose a new password',verify:'Verify your company email'};
  return <main className="es-app es-technical es-auth"><section className="es-auth-card"><div className="es-auth-mark"><LockKeyhole size={24}/></div><p className="es-eyebrow">BlueLink / Assessment workspace</p><h1>{titles[mode]}</h1><p className="es-auth-intro">Private access for BlueLink staff using a verified <strong>@{STAFF_DOMAIN}</strong> email.</p>
    {accessError&&<div className="es-auth-message" role="alert">{accessError}<button type="button" className="es-text-button" onClick={signOut}>Sign out of the current account</button></div>}
    {error&&<div className="es-auth-message es-auth-error" role="alert">{error}</div>}{notice&&<div className="es-auth-message" role="status">{notice}</div>}
    {mode==='verify'?<div className="es-auth-links"><button disabled={busy} onClick={resend}>Resend confirmation</button><button onClick={()=>changeMode('login')}>Back to sign-in</button></div>:<form onSubmit={submit}>
      {mode==='signup'&&<label>Full name <span className="es-required">*</span><input required maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/></label>}
      {mode!=='reset'&&<label>Company email <span className="es-required">*</span><input required type="email" autoComplete="email" placeholder={'name@'+STAFF_DOMAIN} value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      {mode!=='forgot'&&<label>{mode==='reset'?'New password':'Password'} <span className="es-required">*</span><input required type="password" autoComplete={mode==='login'?'current-password':'new-password'} minLength={mode==='login'?undefined:10} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)}/>{mode!=='login'&&<small>Use at least 10 characters.</small>}</label>}
      {['signup','reset'].includes(mode)&&<label>Confirm password <span className="es-required">*</span><input required type="password" autoComplete="new-password" value={confirm} maxLength={128} onChange={e=>setConfirm(e.target.value)}/></label>}
      <button className="es-primary" type="submit" disabled={busy||!supabase}>{busy?'Please wait…':mode==='signup'?'Create account':mode==='forgot'?'Send reset email':mode==='reset'?'Update password':'Sign in'}<ArrowRight size={16}/></button>
    </form>}
    {!['verify','reset'].includes(mode)&&<div className="es-auth-links">{mode==='login'?<><button type="button" onClick={()=>changeMode('signup')}>Create a staff account</button><button type="button" onClick={()=>changeMode('forgot')}>Forgot password?</button></>:<button type="button" onClick={()=>changeMode('login')}>Back to sign-in</button>}</div>}
    <p className="es-auth-foot">Accounts and assessments are managed through BlueLink’s secure workspace.</p>
  </section></main>;
}
