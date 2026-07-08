import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";
import {
  LayoutDashboard, FolderKanban, FileText, CreditCard,
  MessageSquare, LogOut, ChevronDown, ChevronRight,
  CheckCircle2, Clock, AlertCircle, Circle, Send, Plus,
  User, Mail, Shield, Inbox, Eye, Trash2,
  ArrowRight, Loader2, Users, Building2, Briefcase,
  Star, BookOpen, Zap, Target, TrendingUp, Edit3, Save, X
} from "lucide-react";

/* ─── DESIGN TOKENS ──────────────────────────────────────── */
const T = {
  bg:       "#0d1b2e",
  bg2:      "#152236",
  bg3:      "#1c2d45",
  bg4:      "#243552",
  card:     "#ffffff",
  cardBg:   "#f8fafc",
  gold:     "#c9a84c",
  gold2:    "#e8c56a",
  goldDim:  "rgba(201,168,76,0.12)",
  goldLine: "rgba(201,168,76,0.3)",
  navy:     "#0d1b2e",
  text:     "#1a2840",
  textMid:  "#4a5e7a",
  textLight:"#7a8eaa",
  white:    "#ffffff",
  border:   "rgba(13,27,46,0.1)",
  borderDark:"rgba(255,255,255,0.08)",
  success:  "#16a34a",
  warning:  "#d97706",
  danger:   "#dc2626",
  info:     "#2563eb",
  engage:   "#1e3a5f",
  assess:   "#1e3a5f",
  transform:"#c9a84c",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .portal-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .portal-root {
    font-family: 'DM Sans', sans-serif;
    background: ${T.bg};
    color: ${T.text};
    min-height: 100vh;
  }

  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
  @keyframes eatPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.02)} }

  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .spin { animation: spin 1s linear infinite; }

  .nav-btn {
    width:100%; background:transparent; border:none;
    color:${T.textLight}; padding:9px 14px; cursor:pointer;
    display:flex; align-items:center; gap:10px;
    font-size:0.875rem; font-weight:500; border-radius:8px;
    transition:all 0.18s ease; text-align:left; font-family:inherit;
  }
  .nav-btn:hover { background:rgba(255,255,255,0.06); color:#e8eaf0; }
  .nav-btn.active {
    background:${T.goldDim}; color:${T.gold};
    border-left:3px solid ${T.gold}; padding-left:11px;
  }

  .card {
    background:${T.card}; border:1px solid ${T.border};
    border-radius:14px; padding:24px;
    box-shadow:0 2px 12px rgba(13,27,46,0.06);
    transition:box-shadow 0.2s ease, transform 0.2s ease;
  }
  .card:hover { box-shadow:0 6px 24px rgba(13,27,46,0.1); }

  /* card-click — fully clickable on desktop AND mobile touch */
  .card-click {
    background:${T.card}; border:1px solid ${T.border};
    border-radius:14px; padding:24px;
    box-shadow:0 2px 12px rgba(13,27,46,0.06);
    transition:all 0.2s ease;
    display:block; width:100%; text-align:left;
    cursor:pointer;
    touch-action:manipulation;
    -webkit-tap-highlight-color:rgba(201,168,76,0.15);
    user-select:none;
    position:relative;
  }
  .card-click:hover { box-shadow:0 8px 28px rgba(13,27,46,0.12); transform:translateY(-2px); border-color:${T.goldLine}; }
  .card-click:active { transform:scale(0.99); border-color:${T.goldLine}; box-shadow:0 2px 8px rgba(13,27,46,0.08); }

  .card-dark {
    background:${T.bg2}; border:1px solid ${T.borderDark};
    border-radius:14px; padding:24px;
  }

  .btn-gold {
    display:inline-flex; align-items:center; gap:8px;
    background:linear-gradient(135deg,${T.gold},${T.gold2});
    color:${T.navy}; border:none; padding:10px 20px;
    font-weight:700; font-size:0.875rem; border-radius:8px;
    cursor:pointer; font-family:inherit; transition:all 0.2s ease;
    box-shadow:0 2px 8px rgba(201,168,76,0.25);
  }
  .btn-gold:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(201,168,76,0.35); }
  .btn-gold:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

  .btn-outline {
    display:inline-flex; align-items:center; gap:8px;
    background:transparent; color:${T.gold};
    border:1.5px solid ${T.goldLine}; padding:9px 18px;
    font-weight:600; font-size:0.875rem; border-radius:8px;
    cursor:pointer; font-family:inherit; transition:all 0.2s ease;
  }
  .btn-outline:hover { background:${T.goldDim}; border-color:${T.gold}; }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    background:transparent; color:${T.textMid};
    border:none; padding:6px 10px; font-weight:500;
    font-size:0.82rem; border-radius:6px; cursor:pointer;
    font-family:inherit; transition:all 0.15s ease;
  }
  .btn-ghost:hover { color:${T.text}; background:${T.cardBg}; }

  .inp {
    width:100%; background:${T.cardBg}; border:1.5px solid ${T.border};
    color:${T.text}; padding:10px 14px; border-radius:8px;
    font-family:inherit; font-size:0.875rem; outline:none;
    transition:border-color 0.2s ease;
  }
  .inp:focus { border-color:${T.gold}; }
  .inp::placeholder { color:${T.textLight}; }

  .lbl { display:grid; gap:5px; font-size:0.76rem; font-weight:700; color:${T.textMid}; letter-spacing:0.06em; text-transform:uppercase; }

  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:20px; font-size:0.72rem; font-weight:700; }

  .prog-bg { height:6px; background:${T.cardBg}; border-radius:3px; overflow:hidden; border:1px solid ${T.border}; }
  .prog-fill { height:100%; background:linear-gradient(90deg,${T.gold},${T.gold2}); border-radius:3px; transition:width 0.6s ease; }

  .topbar {
    height:64px; background:${T.bg2};
    border-bottom:1px solid ${T.borderDark};
    display:flex; align-items:center; justify-content:space-between;
    padding:0 28px; position:sticky; top:0; z-index:100;
  }

  .sidebar {
    width:240px; background:${T.bg2};
    border-right:1px solid ${T.borderDark};
    min-height:calc(100vh - 64px); padding:16px 10px;
    display:flex; flex-direction:column; gap:2px; flex-shrink:0;
  }

  .main-content { flex:1; padding:32px; background:${T.cardBg}; overflow-x:hidden; min-height:calc(100vh - 64px); }

  .section-title { font-family:'Playfair Display',serif; font-size:clamp(1.6rem,2.5vw,2.2rem); color:${T.text}; font-weight:700; margin-bottom:4px; }
  .gold-bar { width:36px; height:3px; background:linear-gradient(90deg,${T.gold},${T.gold2}); border-radius:2px; margin-bottom:22px; }
  .eyebrow { font-size:0.72rem; font-weight:800; color:${T.gold}; text-transform:uppercase; letter-spacing:0.12em; margin-bottom:4px; }

  .eat-badge {
    font-family:'Playfair Display',serif; font-size:1.1rem;
    font-style:italic; font-weight:600;
    background:linear-gradient(135deg,${T.gold},${T.gold2});
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation:eatPulse 3s ease infinite;
  }
  .eat-phase-card { border-radius:14px; padding:24px; position:relative; overflow:hidden; }
  .eat-engage   { background:rgba(13,27,46,0.04); border:1.5px solid rgba(13,27,46,0.12); }
  .eat-assess   { background:rgba(13,27,46,0.04); border:1.5px solid rgba(13,27,46,0.12); }
  .eat-transform{ background:rgba(201,168,76,0.06); border:1.5px solid rgba(201,168,76,0.2); }

  .bubble-me   { max-width:72%; background:linear-gradient(135deg,${T.gold},${T.gold2}); color:${T.navy}; padding:10px 14px; border-radius:16px 16px 4px 16px; font-size:0.875rem; line-height:1.55; font-weight:500; }
  .bubble-them { max-width:72%; background:${T.bg3}; border:1px solid ${T.borderDark}; color:#e8eaf0; padding:10px 14px; border-radius:16px 16px 16px 4px; font-size:0.875rem; line-height:1.55; }

  .ms-row { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:10px; border:1.5px solid ${T.border}; background:${T.card}; cursor:pointer; transition:all 0.18s ease; margin-bottom:8px; }
  .ms-row:hover { border-color:${T.goldLine}; background:${T.cardBg}; box-shadow:0 2px 10px rgba(13,27,46,0.08); }
  .ms-row.open { border-color:${T.gold}; }

  .invite-row { background:${T.card}; border:1px solid ${T.border}; border-radius:12px; padding:18px 20px; display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:10px; box-shadow:0 2px 8px rgba(13,27,46,0.05); }

  /* ── MOBILE LAYOUT ── */
  @media(max-width:768px){
    .sidebar { display:none; }
    .main-content { padding:16px 14px 90px 14px; } /* bottom padding for mobile nav */
    .topbar { padding:0 14px; height:54px; }

    /* Mobile bottom navigation bar */
    .mobile-nav {
      display:flex;
      position:fixed;
      bottom:0; left:0; right:0;
      background:${T.bg2};
      border-top:1px solid ${T.borderDark};
      z-index:200;
      height:60px;
      align-items:stretch;
    }
    .mobile-nav-btn {
      flex:1; display:flex; flex-direction:column; align-items:center;
      justify-content:center; gap:3px; background:transparent; border:none;
      color:${T.textLight}; font-size:0.6rem; font-weight:600;
      cursor:pointer; padding:6px 2px; transition:all 0.15s ease;
      font-family:inherit; -webkit-tap-highlight-color:rgba(201,168,76,0.2);
    }
    .mobile-nav-btn.active { color:${T.gold}; }
    .mobile-nav-btn svg { flex-shrink:0; }

    /* Make card-click work reliably on iOS/Android */
    .card-click {
      cursor:pointer !important;
      -webkit-tap-highlight-color:rgba(201,168,76,0.15) !important;
      touch-action:manipulation !important;
    }

    /* Stack grid layouts on mobile */
    .portal-stat-grid-mobile { grid-template-columns:1fr 1fr !important; gap:10px !important; }
  }

  @media(min-width:769px){
    .mobile-nav { display:none !important; }
  }
`;

/* ─── STATUS CONFIG ──────────────────────────────────────── */
const statusCfg = {
  pending:     { color: T.warning,  bg: "rgba(217,119,6,0.1)",   label: "Pending" },
  in_progress: { color: T.info,     bg: "rgba(37,99,235,0.1)",   label: "In Progress" },
  review:      { color: T.gold,     bg: T.goldDim,               label: "Review" },
  completed:   { color: T.success,  bg: "rgba(22,163,74,0.1)",   label: "Completed" },
  active:      { color: T.info,     bg: "rgba(37,99,235,0.1)",   label: "Active" },
  paused:      { color: T.warning,  bg: "rgba(217,119,6,0.1)",   label: "Paused" },
  cancelled:   { color: T.danger,   bg: "rgba(220,38,38,0.1)",   label: "Cancelled" },
  paid:        { color: T.success,  bg: "rgba(22,163,74,0.1)",   label: "Paid" },
  overdue:     { color: T.danger,   bg: "rgba(220,38,38,0.1)",   label: "Overdue" },
};

function StatusBadge({ status }) {
  const c = statusCfg[status] || statusCfg.pending;
  return <span className="badge" style={{ background: c.bg, color: c.color }}><span style={{ width:6, height:6, borderRadius:"50%", background:c.color, flexShrink:0 }} />{c.label}</span>;
}

function Spinner({ size=18 }) { return <Loader2 size={size} className="spin" style={{ color:T.gold }} />; }

/* ── Notification helper ────────────────────────────────────
   Calls a Supabase Edge Function to send email + push alerts.
   Deploy edge function: supabase/functions/notify/index.ts
   (see instructions at bottom of this file)
─────────────────────────────────────────────────────────── */
async function sendNotification({ type, senderName, projectName, milestoneTitle, messagePreview, recipientEmail }) {
  try {
    await supabase.functions.invoke("notify", {
      body: { type, senderName, projectName, milestoneTitle, messagePreview, recipientEmail },
    });
  } catch (e) {
    // Notification failure should never block the main action
    console.warn("Notification send failed:", e.message);
  }
}

function Empty({ icon:Icon, title, text }) {
  return (
    <div style={{ textAlign:"center", padding:"56px 24px", color:T.textLight }}>
      <Icon size={36} style={{ margin:"0 auto 14px", display:"block", opacity:0.3, color:T.gold }} />
      <p style={{ fontWeight:700, marginBottom:6, color:T.textMid, fontSize:"0.95rem" }}>{title}</p>
      <p style={{ fontSize:"0.84rem" }}>{text}</p>
    </div>
  );
}

/* ─── EAT FRAMEWORK DATA ─────────────────────────────────── */
const EAT_DEFAULT = {
  catchphrase: "Let's EAT!",
  tagline: "Our proven framework for transforming your technology.",
  phases: [
    {
      key: "engage", label: "Engage", icon: "Users", color: "#2563eb",
      headline: "We start by truly understanding you.",
      description: "Every successful transformation begins with a conversation. We take time to deeply understand your business — your goals, your culture, your customers, and your constraints.",
      steps: ["Stakeholder discovery sessions with leadership and teams","Business goals and KPI alignment workshop","Understanding your customer journey and pain points","Defining success metrics and transformation scope","Establishing communication rhythms and governance"],
      outcome: "A shared understanding of where you are, where you want to go, and what success looks like.",
    },
    {
      key: "assess", label: "Assess", icon: "Search", color: "#7c3aed",
      headline: "We diagnose before we prescribe.",
      description: "Before recommending any solution, we conduct a rigorous assessment of your current technology environment.",
      steps: ["Full application and infrastructure audit","Security vulnerability and compliance review","Cost analysis: cloud spend, licensing, operational overhead","Scalability and performance bottleneck identification","Technical debt scoring and risk prioritization","Team skill gap analysis and tooling review"],
      outcome: "A clear, prioritized modernization roadmap with honest risk scores, cost projections, and recommended actions.",
    },
    {
      key: "transform", label: "Transform", icon: "Zap", color: "#c9a84c",
      headline: "We execute with precision and speed.",
      description: "With alignment and clarity in place, we move to execution using cutting-edge tools, proven architectures, and agile delivery practices.",
      steps: ["Phased implementation with milestone-based delivery","CI/CD pipeline setup for fast, reliable deployments","Cloud migration, containerization, and infrastructure automation","Security hardening and identity modernization","Monitoring, observability, and incident response setup","Knowledge transfer and team enablement"],
      outcome: "A modernized, secure, scalable technology platform — delivered on time, on budget, with your team fully equipped to operate it.",
    },
  ],
  services: [
    { slug:"application-modernization", title:"Application Modernization", engage:"We interview your users, product owners, and engineers to understand how the application is used today.", assess:"We audit the codebase for technical debt, analyze performance bottlenecks, and review the current architecture.", transform:"We rebuild or re-platform the application using modern frameworks, API-first architecture, and cloud-native deployment." },
    { slug:"cloud-infrastructure", title:"Cloud Infrastructure", engage:"We understand your hosting history, your team's cloud experience, your compliance requirements, and your cost tolerance.", assess:"We map all workloads, dependencies, and data flows and analyze current spend.", transform:"We design and implement a secure cloud landing zone, migrate workloads in priority order, and establish governance." },
    { slug:"devops-automation", title:"DevOps Automation", engage:"We observe your current release process, speak with developers and ops teams, and understand the pain points.", assess:"We map every manual step in your delivery pipeline and score deployment frequency and failure rates.", transform:"We implement CI/CD pipelines, infrastructure as code, automated testing gates, and release governance." },
    { slug:"security-identity", title:"Security & Identity", engage:"We understand your user types, access patterns, compliance obligations, and past security incidents.", assess:"We review your IAM configuration, audit access policies, and test for over-permissioned roles.", transform:"We implement SSO, enforce RBAC and least-privilege access, and deploy conditional access policies." },
    { slug:"platform-reliability", title:"Platform Reliability", engage:"We speak with your on-call engineers, review incident histories, and understand which system failures have the highest business impact.", assess:"We audit your monitoring coverage, alert quality, runbooks, and on-call processes.", transform:"We implement observability stacks, tune alert thresholds, build incident response workflows, and set up SLO dashboards." },
    { slug:"data-integration", title:"Data & Integration", engage:"We map your data flows, understand who consumes data and how, and identify manual data processes that slow down operations.", assess:"We audit your integration landscape, assess data quality, review API contracts, and score reliability.", transform:"We modernize data pipelines, expose clean APIs, automate workflows, and implement reporting layers." },
  ],
};

/* ─── CONTEXT ────────────────────────────────────────────── */
const PortalContext = createContext(null);
function usePortal() { return useContext(PortalContext); }

function PortalProvider({ session, children }) {
  const [profile, setProfile]       = useState(null);
  const [projects, setProjects]     = useState([]);
  const [invoices, setInvoices]     = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [eatContent, setEatContent] = useState(EAT_DEFAULT);
  const [loading, setLoading]       = useState(true);

  const fetchAll = useCallback(async () => {
    if (!session?.user) return;
    const uid = session.user.id;
    const profileRes = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (!profileRes.data) { setLoading(false); return; }
    const prof = profileRes.data;
    setProfile(prof);
    const isAdmin = prof.role === "admin";

    const projQuery = isAdmin
      ? supabase.from("projects").select("*, milestones(*), profiles(full_name,company,email)").order("created_at", { ascending: false })
      : supabase.from("projects").select("*, milestones(*)").eq("client_id", uid).order("created_at", { ascending: false });
    const invQuery = isAdmin
      ? supabase.from("invoices").select("*").order("created_at", { ascending: false })
      : supabase.from("invoices").select("*").eq("client_id", uid).order("created_at", { ascending: false });
    const clientsQuery = isAdmin
      ? supabase.from("profiles").select("*").eq("role", "client")
      : Promise.resolve({ data: [] });

    const [projRes, invRes, clientsRes] = await Promise.all([projQuery, invQuery, clientsQuery]);
    if (projRes.data)    setProjects(projRes.data);
    if (invRes.data)     setInvoices(invRes.data);
    if (clientsRes.data) setAllClients(clientsRes.data);

    const { data: eatData } = await supabase.from("eat_content").select("*").single();
    if (eatData?.content) { try { setEatContent(JSON.parse(eatData.content)); } catch {} }
    setLoading(false);
  }, [session]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!session?.user) return;
    const ch = supabase.channel("portal-rt")
      .on("postgres_changes", { event:"*", schema:"public", table:"projects"   }, fetchAll)
      .on("postgres_changes", { event:"*", schema:"public", table:"milestones" }, fetchAll)
      .on("postgres_changes", { event:"*", schema:"public", table:"profiles"   }, fetchAll)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [session, fetchAll]);

  return (
    <PortalContext.Provider value={{ profile, projects, invoices, allClients, eatContent, setEatContent, loading, refetch: fetchAll, session }}>
      {children}
    </PortalContext.Provider>
  );
}

/* ─── MAIN EXPORT ────────────────────────────────────────── */
export default function ClientPortal() {
  const [session, setSession]     = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data?.session || null); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) return (
    <div className="portal-root" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh" }}>
      <style>{css}</style><Spinner size={32} />
    </div>
  );
  if (!session) return <div className="portal-root"><style>{css}</style><PortalAuth setSession={setSession} /></div>;

  return (
    <div className="portal-root">
      <style>{css}</style>
      <PortalProvider session={session}>
        <PortalShell activeTab={activeTab} setActiveTab={setActiveTab} />
      </PortalProvider>
    </div>
  );
}

/* ─── AUTH ───────────────────────────────────────────────── */
function PortalAuth({ setSession }) {
  const [mode, setMode]       = useState("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [token, setToken]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [msg, setMsg]         = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setMsg(""); setLoading(true);
    try {
      if (mode === "login") {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(err.message); else setSession(data.session);
      } else {
        const cleanToken = token.trim().toUpperCase();
        const cleanEmail = email.toLowerCase().trim();
        const { data: invList } = await supabase.from("invitations").select("*").eq("accepted", false);
        const inv = invList ? invList.find(i => i.token.toUpperCase() === cleanToken) : null;
        if (!inv) { setError("Invalid or expired invitation code. Please check the code and try again."); return; }
        if (inv.email.toLowerCase().trim() !== cleanEmail) { setError("This invite code was sent to a different email address."); return; }
        const { error: e2 } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, company } } });
        if (e2) { setError(e2.message); return; }
        await supabase.from("invitations").update({ accepted: true }).eq("id", inv.id);
        setMsg("Account created! Check your email to confirm, then sign in."); setMode("login");
      }
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:`radial-gradient(ellipse at 30% 40%, ${T.bg3} 0%, ${T.bg} 65%)` }}>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:T.goldDim, border:`1px solid ${T.goldLine}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
            <Shield size={22} style={{ color:T.gold }} />
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.9rem", color:T.white, marginBottom:6 }}>BlueLink Portal</h1>
          <p style={{ color:T.textLight, fontSize:"0.875rem" }}>{mode==="login" ? "Sign in to your workspace" : "Create your account"}</p>
          <p className="eat-badge" style={{ marginTop:8, display:"block" }}>Let's EAT!</p>
        </div>
        <div style={{ background:T.bg2, border:`1px solid ${T.borderDark}`, borderRadius:16, padding:32 }}>
          {error && <div style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:"0.84rem", color:"#fca5a5" }}>{error}</div>}
          {msg   && <div style={{ background:"rgba(22,163,74,0.1)",  border:"1px solid rgba(22,163,74,0.3)",  borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:"0.84rem", color:"#86efac" }}>{msg}</div>}
          <form onSubmit={handleSubmit} style={{ display:"grid", gap:14 }}>
            {mode==="signup" && <>
              <label className="lbl" style={{ color:T.textLight }}>Full Name <input className="inp" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required /></label>
              <label className="lbl" style={{ color:T.textLight }}>Company <input className="inp" type="text" value={company} onChange={e=>setCompany(e.target.value)} placeholder="Company name" required /></label>
              <label className="lbl" style={{ color:T.textLight }}>Invitation Code <input className="inp" type="text" value={token} onChange={e=>setToken(e.target.value)} placeholder="Your invite code" required /></label>
            </>}
            <label className="lbl" style={{ color:T.textLight }}>Email <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required /></label>
            <label className="lbl" style={{ color:T.textLight }}>Password <input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 6 characters" minLength={6} required /></label>
            <button type="submit" disabled={loading} className="btn-gold" style={{ justifyContent:"center", marginTop:4 }}>
              {loading ? <Spinner size={15} /> : mode==="login" ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
          <div style={{ textAlign:"center", marginTop:18 }}>
            <button onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); setMsg(""); }}
              style={{ background:"none", border:"none", color:T.gold, fontWeight:600, cursor:"pointer", fontSize:"0.84rem", fontFamily:"inherit" }}>
              {mode==="login" ? "Have an invite code? Create account" : "Already have an account? Sign in"}
            </button>
          </div>
          {mode==="login" && <p style={{ textAlign:"center", marginTop:14, fontSize:"0.76rem", color:T.textLight }}>Access by invitation only · <span style={{ color:T.gold }}>info@bluelinkconsults.com</span></p>}
        </div>
      </div>
    </div>
  );
}

/* ─── SHELL ──────────────────────────────────────────────── */
function PortalShell({ activeTab, setActiveTab }) {
  const { profile, loading } = usePortal();
  const isAdmin = profile?.role === "admin";

  const clientTabs = [
    { id:"dashboard", label:"Home",        icon:LayoutDashboard },
    { id:"projects",  label:"Projects",    icon:FolderKanban },
    { id:"messages",  label:"Messages",    icon:MessageSquare },
    { id:"invoices",  label:"Invoices",    icon:CreditCard },
    { id:"forms",     label:"Forms",       icon:FileText },
    { id:"eat",       label:"Approach",    icon:Star },
  ];
  const adminTabs = [
    { id:"dashboard", label:"Home",         icon:LayoutDashboard },
    { id:"clients",   label:"Clients",      icon:Users },
    { id:"projects",  label:"Projects",     icon:FolderKanban },
    { id:"messages",  label:"Messages",     icon:MessageSquare },
    { id:"invoices",  label:"Invoices",     icon:CreditCard },
    { id:"invites",   label:"Invitations",  icon:Mail },
    { id:"eat_admin", label:"EAT",          icon:BookOpen },
    { id:"inbox",     label:"Inbox",        icon:Inbox },
  ];
  const tabs = isAdmin ? adminTabs : clientTabs;

  // Mobile-visible tabs (first 5 only for bottom nav)
  const mobileTabs = tabs.slice(0, 5);

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", isolation:"isolate" }}>
      {/* Gold accent bar */}
      <div style={{ background:T.gold, height:3, width:"100%", flexShrink:0 }} />

      {/* ── TOPBAR ── */}
      <div className="topbar">
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/bluelink-logo-mark.png" alt="BlueLink Consults" style={{ height:34, width:"auto" }}
            onError={e => { e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="block"; }} />
          <span style={{ display:"none", fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:T.white }}>BlueLink</span>
          <span style={{ color:T.textLight, fontSize:"0.72rem", borderLeft:`1px solid ${T.borderDark}`, paddingLeft:10 }}>Portal</span>
          {isAdmin && <span className="badge" style={{ background:T.goldDim, color:T.gold, border:`1px solid ${T.goldLine}` }}>ADMIN</span>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:"0.82rem", fontWeight:600, color:T.white, lineHeight:1.2 }}>{profile?.full_name || "Client"}</p>
            <p style={{ fontSize:"0.68rem", color:T.textLight }}>{profile?.company}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="btn-ghost"
            style={{ border:`1px solid ${T.borderDark}`, borderRadius:8, padding:"6px 10px", color:T.textLight }}>
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display:"flex", flex:1, minHeight:0 }}>

        {/* Desktop sidebar */}
        <aside className="sidebar">
          <div style={{ padding:"4px 6px 10px", marginBottom:4, borderBottom:`1px solid ${T.borderDark}` }}>
            <p style={{ fontSize:"0.65rem", fontWeight:800, color:T.textLight, textTransform:"uppercase", letterSpacing:"0.12em" }}>
              {isAdmin ? "Admin" : "Navigation"}
            </p>
          </div>
          {tabs.map(tab => { const Icon=tab.icon; return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`nav-btn${activeTab===tab.id?" active":""}`}>
              <Icon size={15} />{tab.label}
            </button>
          );})}
          <div style={{ flex:1 }} />
          <a href="/" style={{ display:"flex", alignItems:"center", gap:8, color:T.gold, padding:"10px 14px",
            fontSize:"0.84rem", fontWeight:600, textDecoration:"none", borderRadius:8,
            border:`1px solid ${T.goldLine}`, background:T.goldDim, marginBottom:8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Back to Website
          </a>
          <div style={{ borderTop:`1px solid ${T.borderDark}`, paddingTop:10, marginTop:4 }}>
            <p style={{ fontSize:"0.66rem", color:"rgba(255,255,255,0.3)", padding:"0 6px" }}>info@bluelinkconsults.com</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="main-content">
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner size={32} /></div>
          ) : (
            <div className="fade-up">
              {activeTab==="dashboard" && (isAdmin ? <AdminDashboard setActiveTab={setActiveTab} /> : <ClientDashboard setActiveTab={setActiveTab} />)}
              {activeTab==="eat"       && <EATPage />}
              {activeTab==="eat_admin" && isAdmin && <EATAdmin />}
              {activeTab==="projects"  && (isAdmin ? <AdminProjects /> : <ClientProjects />)}
              {activeTab==="messages"  && <Messages />}
              {activeTab==="forms"     && <Forms />}
              {activeTab==="invoices"  && <Invoices />}
              {activeTab==="clients"   && isAdmin && <AdminClients />}
              {activeTab==="invites"   && isAdmin && <AdminInvites />}
              {activeTab==="inbox"     && isAdmin && <AdminInbox />}
            </div>
          )}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV BAR ── */}
      <nav className="mobile-nav">
        {mobileTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`mobile-nav-btn${activeTab===tab.id?" active":""}`}
              onClick={() => setActiveTab(tab.id)}
              onTouchEnd={e => { e.preventDefault(); setActiveTab(tab.id); }}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
        {/* Back to website as last mobile nav item */}
        <a href="/" className="mobile-nav-btn" style={{ textDecoration:"none", color:T.gold }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          Website
        </a>
      </nav>
    </div>
  );
}

/* ─── ADMIN DASHBOARD ────────────────────────────────────── */
function AdminDashboard({ setActiveTab }) {
  const { projects, allClients, invoices } = usePortal();
  const active     = projects.filter(p=>p.status==="active").length;
  const totalMs    = projects.flatMap(p=>p.milestones||[]).length;
  const doneMs     = projects.flatMap(p=>p.milestones||[]).filter(m=>m.status==="completed").length;
  const pendingAmt = invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+Number(i.amount),0);

  return (
    <div style={{ maxWidth:1000 }}>
      <p className="eyebrow">Admin Overview</p>
      <h1 className="section-title">Command Center</h1>
      <div className="gold-bar" />

      <div style={{ background:`linear-gradient(135deg,${T.bg3},${T.bg4})`, border:`1px solid ${T.goldLine}`, borderRadius:14, padding:"20px 28px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p className="eat-badge" style={{ fontSize:"1.4rem", display:"block", marginBottom:4 }}>Let's EAT!</p>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.84rem" }}>Engage · Assess · Transform — your clients' technology journey starts here.</p>
        </div>
        <div style={{ display:"flex", gap:16 }}>
          {["E","A","T"].map((l,i) => (
            <div key={l} style={{ width:44, height:44, borderRadius:"50%", background:"rgba(201,168,76,0.1)", border:`1.5px solid ${T.goldLine}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontWeight:700, color:T.gold, fontSize:"1.1rem" }}>{l}</div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:32 }}>
        {[
          { label:"Active Clients",   value:allClients.length,              icon:Users,        action:()=>setActiveTab("clients")  },
          { label:"Active Projects",  value:active,                         icon:Briefcase,    action:()=>setActiveTab("projects") },
          { label:"Milestones Done",  value:`${doneMs}/${totalMs}`,         icon:CheckCircle2, action:()=>setActiveTab("projects") },
          { label:"Revenue Pending",  value:`$${pendingAmt.toLocaleString()}`, icon:CreditCard, action:()=>setActiveTab("invoices") },
        ].map(s => { const Icon=s.icon; return (
          <div key={s.label} className="card-click" onClick={s.action}>
            <Icon size={20} style={{ color:T.gold, marginBottom:12 }} />
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", color:T.gold, fontWeight:700 }}>{s.value}</p>
            <p style={{ fontSize:"0.78rem", color:T.textMid, marginTop:4, fontWeight:600 }}>{s.label}</p>
          </div>
        );})}
      </div>

      <h2 style={{ fontSize:"1rem", fontWeight:700, color:T.text, marginBottom:14 }}>Recent Projects</h2>
      {projects.length===0 ? <Empty icon={FolderKanban} title="No projects yet" text="Create your first project from the Projects tab." /> : (
        <div style={{ display:"grid", gap:10 }}>
          {projects.slice(0,4).map(p => {
            const ms=p.milestones||[]; const done=ms.filter(m=>m.status==="completed").length; const pct=ms.length?Math.round((done/ms.length)*100):0;
            return (
              <div key={p.id} className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:20 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, color:T.text, marginBottom:2, fontSize:"0.9rem" }}>{p.name}</p>
                  <p style={{ fontSize:"0.76rem", color:T.textMid }}>{p.profiles?.full_name} · {p.service_type}</p>
                  <div className="prog-bg" style={{ marginTop:8 }}><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <StatusBadge status={p.status} />
                  <p style={{ fontSize:"0.7rem", color:T.textLight, marginTop:5 }}>{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── CLIENT DASHBOARD — FIXED: projects are now clickable ── */
function ClientDashboard({ setActiveTab }) {
  const { profile, projects, invoices, eatContent } = usePortal();

  // ── KEY FIX: local selectedProject state so dashboard cards
  //    open the detail view directly without switching tabs ──
  const [selectedProject, setSelectedProject] = useState(null);
  const { refetch } = usePortal();

  const doneMs   = projects.flatMap(p=>p.milestones||[]).filter(m=>m.status==="completed").length;
  const totalMs  = projects.flatMap(p=>p.milestones||[]).length;
  const pending  = invoices.filter(i=>i.status==="pending");

  // If a project is selected, show its detail view
  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);
    if (project) return (
      <ProjectDetail
        project={project}
        onBack={() => { setSelectedProject(null); refetch(); }}
        isAdmin={false}
      />
    );
  }

  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Welcome back</p>
      <h1 className="section-title">{profile?.full_name || "Client"}</h1>
      <p style={{ color:T.textMid, marginBottom:4, fontSize:"0.9rem" }}>{profile?.company} · BlueLink Consult Workspace</p>
      <div className="gold-bar" />

      {/* EAT banner */}
      <div style={{ background:`linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))`, border:`1px solid ${T.goldLine}`, borderRadius:14, padding:"18px 24px", marginBottom:28, cursor:"pointer" }} onClick={()=>setActiveTab("eat")}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p className="eat-badge" style={{ fontSize:"1.1rem", display:"block", marginBottom:3 }}>{eatContent.catchphrase}</p>
            <p style={{ color:T.textMid, fontSize:"0.84rem" }}>{eatContent.tagline}</p>
          </div>
          <span style={{ fontSize:"0.8rem", color:T.gold, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>Explore our approach <ArrowRight size={13} /></span>
        </div>
      </div>

      {/* Stat cards — clicking Projects or Milestones navigates to projects tab */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
        {[
          { label:"Active Projects",  value:projects.filter(p=>p.status==="active").length, icon:FolderKanban, action:()=>setActiveTab("projects") },
          { label:"Milestones Done",  value:`${doneMs}/${totalMs}`,                         icon:CheckCircle2, action:()=>setActiveTab("projects") },
          { label:"Pending Invoices", value:pending.length,                                 icon:CreditCard,   action:()=>setActiveTab("invoices") },
        ].map(s => { const Icon=s.icon; return (
          <div key={s.label} className="card-click" onClick={s.action}>
            <Icon size={18} style={{ color:T.gold, marginBottom:10 }} />
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", color:T.gold, fontWeight:700 }}>{s.value}</p>
            <p style={{ fontSize:"0.76rem", color:T.textMid, marginTop:4 }}>{s.label}</p>
          </div>
        );})}
      </div>

      {/* Project cards — FIXED: now clickable, opens ProjectDetail inline */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <h2 style={{ fontSize:"1rem", fontWeight:700, color:T.text }}>Your Projects</h2>
        <button className="btn-ghost" onClick={()=>setActiveTab("projects")} style={{ fontSize:"0.8rem", color:T.gold }}>
          View all <ArrowRight size={13} />
        </button>
      </div>

      {projects.length===0 ? (
        <Empty icon={FolderKanban} title="No projects yet" text="BlueLink Consult will set up your first project shortly." />
      ) : (
        <div style={{ display:"grid", gap:12 }}>
          {projects.map(p => {
            const ms=p.milestones||[]; const done=ms.filter(m=>m.status==="completed").length; const pct=ms.length?Math.round((done/ms.length)*100):0;
            return (
              <div
                key={p.id}
                className="card-click"
                onClick={() => setSelectedProject(p.id)}
                onTouchEnd={e => { e.preventDefault(); setSelectedProject(p.id); }}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key==="Enter" && setSelectedProject(p.id)}
              >
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div>
                    <p style={{ fontWeight:700, color:T.text }}>{p.name}</p>
                    <p style={{ fontSize:"0.78rem", color:T.textMid, marginTop:2 }}>{p.service_type}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.74rem", marginBottom:5 }}>
                  <span style={{ color:T.textMid }}>Progress</span>
                  <span style={{ color:T.gold, fontWeight:700 }}>{pct}%</span>
                </div>
                <div className="prog-bg"><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                  <p style={{ fontSize:"0.7rem", color:T.textLight }}>{done} of {ms.length} milestones complete</p>
                  <span style={{ fontSize:"0.76rem", color:T.gold, display:"flex", alignItems:"center", gap:4, fontWeight:600 }}>
                    View milestones <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── EAT PAGE ───────────────────────────────────────────── */
function EATPage() {
  const { eatContent } = usePortal();
  const [activeService, setActiveService] = useState(null);
  const phaseIcons = { engage: Users, assess: Target, transform: Zap };

  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">BlueLink Methodology</p>
      <h1 className="section-title">How We Deliver</h1>
      <div className="gold-bar" />
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <p className="eat-badge" style={{ fontSize:"2.2rem", display:"block", marginBottom:10 }}>{eatContent.catchphrase}</p>
        <p style={{ color:T.textMid, fontSize:"1rem", maxWidth:600, margin:"0 auto" }}>{eatContent.tagline}</p>
      </div>
      <div style={{ display:"grid", gap:20, marginBottom:44 }}>
        {eatContent.phases.map((phase, idx) => {
          const Icon = phaseIcons[phase.key] || Star;
          return (
            <div key={phase.key} className={`eat-phase-card eat-${phase.key}`}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:phase.color+"18", border:`1.5px solid ${phase.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={20} style={{ color:phase.color }} />
                </div>
                <div>
                  <span style={{ fontSize:"0.68rem", fontWeight:800, color:phase.color, textTransform:"uppercase", letterSpacing:"0.1em" }}>{String(idx+1).padStart(2,"0")} · {phase.label}</span>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", color:T.text, fontWeight:600 }}>{phase.headline}</h3>
                </div>
              </div>
              <p style={{ color:T.textMid, fontSize:"0.875rem", lineHeight:1.75, marginBottom:16 }}>{phase.description}</p>
              <div style={{ display:"grid", gap:8 }}>
                {phase.steps.map((step,i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background:phase.color+"18", border:`1px solid ${phase.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.6rem", fontWeight:800, color:phase.color, flexShrink:0, marginTop:1 }}>{i+1}</div>
                    <p style={{ fontSize:"0.84rem", color:T.text, lineHeight:1.55 }}>{step}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16, padding:"12px 16px", background:phase.color+"0d", borderRadius:8, borderLeft:`3px solid ${phase.color}` }}>
                <p style={{ fontSize:"0.78rem", fontWeight:700, color:phase.color, marginBottom:2 }}>Outcome</p>
                <p style={{ fontSize:"0.84rem", color:T.textMid }}>{phase.outcome}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginBottom:16 }}>
        <p className="eyebrow">Service Breakdowns</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", color:T.text, marginBottom:6 }}>How We Apply EAT to Each Service</h2>
        <p style={{ color:T.textMid, fontSize:"0.875rem", marginBottom:20 }}>Click any service to see how Engage, Assess, and Transform plays out in that context.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        {eatContent.services.map(svc => (
          <div key={svc.slug} className="card-click" onClick={() => setActiveService(activeService===svc.slug?null:svc.slug)} style={{ border:activeService===svc.slug?`1.5px solid ${T.gold}`:undefined }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:activeService===svc.slug?14:0 }}>
              <p style={{ fontWeight:700, color:T.text, fontSize:"0.9rem" }}>{svc.title}</p>
              <ChevronDown size={15} style={{ color:T.gold, transform:activeService===svc.slug?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0 }} />
            </div>
            {activeService===svc.slug && (
              <div style={{ display:"grid", gap:12 }}>
                {[["engage",T.engage,"Engage"],["assess",T.assess,"Assess"],["transform",T.transform,"Transform"]].map(([key,color,label]) => (
                  <div key={key} style={{ padding:"10px 14px", background:color+"0d", borderRadius:8, borderLeft:`3px solid ${color}44` }}>
                    <p style={{ fontSize:"0.68rem", fontWeight:800, color:color, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4 }}>{label}</p>
                    <p style={{ fontSize:"0.82rem", color:T.textMid, lineHeight:1.6 }}>{svc[key]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── EAT ADMIN ──────────────────────────────────────────── */
function EATAdmin() {
  const { eatContent, setEatContent } = usePortal();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(JSON.stringify(eatContent, null, 2));
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  async function save() {
    setSaving(true);
    try {
      const parsed = JSON.parse(draft);
      const { error } = await supabase.from("eat_content").upsert({ id:1, content:JSON.stringify(parsed) });
      if (error) setMsg("Error: " + error.message);
      else { setEatContent(parsed); setMsg("Saved!"); setEditing(false); }
    } catch(e) { setMsg("Invalid JSON: " + e.message); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Admin</p>
      <h1 className="section-title">EAT Framework Content</h1>
      <div className="gold-bar" />
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
          <div>
            <h3 style={{ fontWeight:700, color:T.text, marginBottom:4 }}>Edit EAT Content</h3>
            <p style={{ color:T.textMid, fontSize:"0.84rem" }}>Changes here update what clients see in "Our Approach".</p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {!editing ? (
              <button className="btn-gold" onClick={() => { setDraft(JSON.stringify(eatContent,null,2)); setEditing(true); }}><Edit3 size={14}/> Edit</button>
            ) : (
              <>
                <button className="btn-gold" onClick={save} disabled={saving}>{saving?<Spinner size={14}/>:<Save size={14}/>} Save</button>
                <button className="btn-ghost" onClick={() => { setEditing(false); setMsg(""); }}><X size={14}/> Cancel</button>
              </>
            )}
          </div>
        </div>
        {msg && <div style={{ padding:"8px 14px", borderRadius:8, background:msg.includes("Error")||msg.includes("Invalid")?"rgba(220,38,38,0.1)":"rgba(22,163,74,0.1)", color:msg.includes("Error")||msg.includes("Invalid")?T.danger:T.success, fontSize:"0.84rem", marginBottom:12 }}>{msg}</div>}
        <div style={{ display:"grid", gap:14, marginBottom:editing?16:0 }}>
          <label className="lbl">Catchphrase
            <input className="inp" value={eatContent.catchphrase} readOnly={!editing} onChange={e=>setEatContent(p=>({...p,catchphrase:e.target.value}))} style={{ background:editing?T.cardBg:"#f1f5f9", cursor:editing?"text":"default" }} />
          </label>
          <label className="lbl">Tagline
            <input className="inp" value={eatContent.tagline} readOnly={!editing} onChange={e=>setEatContent(p=>({...p,tagline:e.target.value}))} style={{ background:editing?T.cardBg:"#f1f5f9", cursor:editing?"text":"default" }} />
          </label>
        </div>
        {editing && <textarea className="inp" value={draft} onChange={e=>setDraft(e.target.value)} rows={20} style={{ fontFamily:"monospace", fontSize:"0.78rem", resize:"vertical", background:"#f8fafc" }} />}
      </div>
    </div>
  );
}

/* ─── ADMIN PROJECTS ─────────────────────────────────────── */
function AdminProjects() {
  const { projects, allClients, refetch } = usePortal();
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState({ name:"", description:"", service_type:"Application Modernization", client_id:"", status:"active", start_date:"" });
  const [saving, setSaving]         = useState(false);
  const serviceTypes = ["Application Modernization","DevOps Automation","Monitoring & Analytics","Data Management","Security Improvement","Scaling Improvements","Cloud Infrastructure","Platform Reliability"];

  async function createProject(e) {
    e.preventDefault(); setSaving(true);
    const { error } = await supabase.from("projects").insert({ ...form });
    if (!error) { await refetch(); setShowCreate(false); setForm({ name:"", description:"", service_type:"Application Modernization", client_id:"", status:"active", start_date:"" }); }
    setSaving(false);
  }

  if (selected) {
    const project = projects.find(p=>p.id===selected);
    if (project) return <ProjectDetail project={project} onBack={() => { setSelected(null); refetch(); }} isAdmin />;
  }

  return (
    <div style={{ maxWidth:1000 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div><p className="eyebrow">Manage</p><h1 className="section-title">Projects</h1></div>
        <button className="btn-gold" onClick={() => setShowCreate(!showCreate)}><Plus size={15}/> New Project</button>
      </div>
      <div className="gold-bar" />
      {showCreate && (
        <div className="card" style={{ marginBottom:24, border:`1.5px solid ${T.goldLine}` }}>
          <h3 style={{ color:T.gold, fontWeight:700, marginBottom:16, fontSize:"1rem" }}>Create New Project</h3>
          <form onSubmit={createProject} style={{ display:"grid", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <label className="lbl">Project Name * <input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="e.g. App Modernization Phase 1" /></label>
              <label className="lbl">Assign to Client *
                <select className="inp" value={form.client_id} onChange={e=>setForm(f=>({...f,client_id:e.target.value}))} required style={{ cursor:"pointer" }}>
                  <option value="">Select a client...</option>
                  {allClients.map(c=><option key={c.id} value={c.id}>{c.full_name} — {c.company}</option>)}
                </select>
              </label>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <label className="lbl">Service Type
                <select className="inp" value={form.service_type} onChange={e=>setForm(f=>({...f,service_type:e.target.value}))} style={{ cursor:"pointer" }}>
                  {serviceTypes.map(s=><option key={s}>{s}</option>)}
                </select>
              </label>
              <label className="lbl">Start Date <input className="inp" type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} /></label>
            </div>
            <label className="lbl">Description <textarea className="inp" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Brief engagement description..." style={{ resize:"vertical" }} /></label>
            <div style={{ display:"flex", gap:10 }}>
              <button type="submit" disabled={saving} className="btn-gold">{saving?<Spinner size={14}/>:"Create Project"}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {allClients.length===0 && (
        <div className="card" style={{ marginBottom:16, border:`1px solid rgba(217,119,6,0.3)`, background:"rgba(217,119,6,0.05)" }}>
          <p style={{ color:T.warning, fontWeight:700, marginBottom:4, fontSize:"0.875rem" }}>No clients yet</p>
          <p style={{ color:T.textMid, fontSize:"0.84rem" }}>Invite clients first before creating a project.</p>
        </div>
      )}
      {projects.length===0 ? <Empty icon={FolderKanban} title="No projects yet" text="Create your first project above." /> : (
        <div style={{ display:"grid", gap:12 }}>
          {projects.map(p => {
            const ms=p.milestones||[]; const done=ms.filter(m=>m.status==="completed").length; const pct=ms.length?Math.round((done/ms.length)*100):0;
            return (
              <div key={p.id} className="card-click" onClick={() => setSelected(p.id)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:12 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, color:T.text, fontSize:"0.95rem", marginBottom:3 }}>{p.name}</p>
                    <p style={{ fontSize:"0.78rem", color:T.textMid }}>{p.profiles?.full_name||"Unassigned"} · {p.service_type}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.72rem", marginBottom:5 }}>
                  <span style={{ color:T.textMid }}>{done}/{ms.length} milestones</span>
                  <span style={{ color:T.gold }}>{pct}%</span>
                </div>
                <div className="prog-bg"><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── CLIENT PROJECTS — also clickable ───────────────────── */
function ClientProjects() {
  const { projects, refetch } = usePortal();
  const [selected, setSelected] = useState(null);
  if (selected) {
    const project = projects.find(p=>p.id===selected);
    if (project) return <ProjectDetail project={project} onBack={() => { setSelected(null); refetch(); }} isAdmin={false} />;
  }
  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Your Engagements</p>
      <h1 className="section-title">Projects</h1>
      <div className="gold-bar" />
      {projects.length===0 ? <Empty icon={FolderKanban} title="No projects yet" text="Your BlueLink Consult projects will appear here once created." /> : (
        <div style={{ display:"grid", gap:14 }}>
          {projects.map(p => {
            const ms=p.milestones||[]; const done=ms.filter(m=>m.status==="completed").length; const pct=ms.length?Math.round((done/ms.length)*100):0;
            return (
              <div key={p.id} className="card-click" onClick={() => setSelected(p.id)} onTouchEnd={e=>{e.preventDefault();setSelected(p.id);}} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setSelected(p.id)}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, marginBottom:12 }}>
                  <div><p style={{ fontWeight:700, color:T.text, fontSize:"1rem", marginBottom:3 }}>{p.name}</p><p style={{ fontSize:"0.8rem", color:T.textMid }}>{p.service_type}</p></div>
                  <StatusBadge status={p.status} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.74rem", marginBottom:5 }}>
                  <span style={{ color:T.textMid }}>Progress</span><span style={{ color:T.gold, fontWeight:700 }}>{pct}%</span>
                </div>
                <div className="prog-bg"><div className="prog-fill" style={{ width:`${pct}%` }} /></div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                  <span style={{ fontSize:"0.7rem", color:T.textLight }}>{done} of {ms.length} milestones complete</span>
                  <span style={{ fontSize:"0.76rem", color:T.gold, display:"flex", alignItems:"center", gap:4, fontWeight:600 }}>View milestones <ChevronRight size={13} /></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── PROJECT DETAIL ─────────────────────────────────────── */
function ProjectDetail({ project, onBack, isAdmin }) {
  const [milestones, setMilestones] = useState(project.milestones||[]);
  const [openMs, setOpenMs]         = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [msForm, setMsForm]         = useState({ title:"", description:"", status:"pending", due_date:"", order_index:0 });
  const [saving, setSaving]         = useState(false);
  const { session } = usePortal();

  useEffect(() => {
    const ch = supabase.channel(`ms-${project.id}`)
      .on("postgres_changes", { event:"*", schema:"public", table:"milestones", filter:`project_id=eq.${project.id}` }, payload => {
        if (payload.eventType==="INSERT") setMilestones(prev=>[...prev,payload.new]);
        if (payload.eventType==="UPDATE") setMilestones(prev=>prev.map(m=>m.id===payload.new.id?payload.new:m));
        if (payload.eventType==="DELETE") setMilestones(prev=>prev.filter(m=>m.id!==payload.old.id));
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [project.id]);

  async function addMilestone(e) {
    e.preventDefault(); setSaving(true);
    await supabase.from("milestones").insert({ ...msForm, project_id:project.id, order_index:milestones.length+1 });
    setMsForm({ title:"", description:"", status:"pending", due_date:"", order_index:0 });
    setShowAdd(false); setSaving(false);
  }

  async function updateStatus(id, status) {
    await supabase.from("milestones").update({ status }).eq("id", id);
  }

  const statusIcons = {
    pending:     <Circle size={15}       style={{ color:T.warning, flexShrink:0 }} />,
    in_progress: <Clock size={15}        style={{ color:T.info,    flexShrink:0 }} />,
    review:      <AlertCircle size={15}  style={{ color:T.gold,    flexShrink:0 }} />,
    completed:   <CheckCircle2 size={15} style={{ color:T.success, flexShrink:0 }} />,
  };

  const sorted = [...milestones].sort((a,b)=>a.order_index-b.order_index);

  return (
    <div style={{ maxWidth:860 }}>
      <div style={{ display:"flex", gap:10, marginBottom:20, alignItems:"center" }}>
        <button className="btn-ghost" onClick={onBack}>← Back to projects</button>
        <span style={{ color:T.textLight, fontSize:"0.76rem" }}>·</span>
        <button className="btn-ghost" onClick={() => onBack()} style={{ color:T.gold }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
          Dashboard
        </button>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div>
          <p className="eyebrow">{project.service_type}</p>
          <h1 className="section-title">{project.name}</h1>
          {project.description && <p style={{ color:T.textMid, marginTop:4, fontSize:"0.875rem" }}>{project.description}</p>}
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="gold-bar" />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h2 style={{ fontSize:"1rem", fontWeight:700, color:T.text }}>Milestones</h2>
        {isAdmin && <button className="btn-gold" style={{ padding:"7px 14px", fontSize:"0.8rem" }} onClick={() => setShowAdd(!showAdd)}><Plus size={13}/> Add Milestone</button>}
      </div>
      {isAdmin && showAdd && (
        <div className="card" style={{ marginBottom:16, border:`1.5px solid ${T.goldLine}` }}>
          <form onSubmit={addMilestone} style={{ display:"grid", gap:12 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <label className="lbl">Title * <input className="inp" value={msForm.title} onChange={e=>setMsForm(f=>({...f,title:e.target.value}))} required placeholder="Milestone name" /></label>
              <label className="lbl">Due Date <input className="inp" type="date" value={msForm.due_date} onChange={e=>setMsForm(f=>({...f,due_date:e.target.value}))} /></label>
            </div>
            <label className="lbl">Description <textarea className="inp" value={msForm.description} onChange={e=>setMsForm(f=>({...f,description:e.target.value}))} rows={2} style={{ resize:"vertical" }} placeholder="What does this milestone involve?" /></label>
            <label className="lbl">Initial Status
              <select className="inp" value={msForm.status} onChange={e=>setMsForm(f=>({...f,status:e.target.value}))} style={{ cursor:"pointer" }}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <div style={{ display:"flex", gap:8 }}>
              <button type="submit" disabled={saving} className="btn-gold" style={{ padding:"8px 16px", fontSize:"0.8rem" }}>{saving?<Spinner size={12}/>:"Add Milestone"}</button>
              <button type="button" className="btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {sorted.length===0 ? <Empty icon={CheckCircle2} title="No milestones yet" text={isAdmin?"Add your first milestone above.":"BlueLink Consult will add milestones shortly."} /> : (
        <div>
          {sorted.map((m, idx) => (
            <div key={m.id}>
              <div className={`ms-row${openMs===m.id?" open":""}`} onClick={() => setOpenMs(openMs===m.id?null:m.id)} onTouchEnd={e=>{e.preventDefault();setOpenMs(openMs===m.id?null:m.id);}}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:T.cardBg, border:`1.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", color:T.textMid, fontWeight:700, flexShrink:0 }}>{idx+1}</div>
                {statusIcons[m.status]||statusIcons.pending}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, color:T.text, fontSize:"0.875rem" }}>{m.title}</p>
                  {m.due_date && <p style={{ fontSize:"0.72rem", color:T.textMid, marginTop:1 }}>Due {new Date(m.due_date).toLocaleDateString()}</p>}
                </div>
                <StatusBadge status={m.status} />
                {isAdmin && (
                  <select value={m.status} onChange={e=>{e.stopPropagation();updateStatus(m.id,e.target.value);}} onClick={e=>e.stopPropagation()}
                    style={{ background:T.cardBg, border:`1.5px solid ${T.border}`, color:T.text, borderRadius:6, padding:"4px 8px", fontSize:"0.72rem", cursor:"pointer", fontFamily:"inherit" }}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                )}
                <ChevronDown size={14} style={{ color:T.textMid, transform:openMs===m.id?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0 }} />
              </div>
              {openMs===m.id && (
                <div style={{ background:T.cardBg, border:`1.5px solid ${T.border}`, borderTop:"none", borderRadius:"0 0 10px 10px", padding:"16px 20px", marginBottom:8 }}>
                  {m.description && <p style={{ color:T.textMid, fontSize:"0.84rem", lineHeight:1.7, marginBottom:16 }}>{m.description}</p>}
                  <MilestoneComments milestoneId={m.id} session={session} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MILESTONE COMMENTS ─────────────────────────────────── */
function MilestoneComments({ milestoneId, session }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [posting, setPosting]   = useState(false);
  const bottomRef = useRef(null);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from("comments").select("*, profiles(full_name,role)").eq("milestone_id", milestoneId).order("created_at", { ascending:true });
    if (data) setComments(data);
    setLoading(false);
  }, [milestoneId]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    const ch = supabase.channel(`c-${milestoneId}`).on("postgres_changes", { event:"INSERT", schema:"public", table:"comments", filter:`milestone_id=eq.${milestoneId}` }, fetch).subscribe();
    return () => supabase.removeChannel(ch);
  }, [milestoneId, fetch]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [comments]);

  async function post(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    // Get poster profile so we know their name and role
    const { data: senderProfile } = await supabase.from("profiles").select("full_name,role,email").eq("id", session.user.id).single();
    await supabase.from("comments").insert({ milestone_id:milestoneId, author_id:session.user.id, content:text.trim() });
    // Notify the other party — if client posts, notify admin and vice versa
    const { data: adminProfiles } = await supabase.from("profiles").select("email").eq("role", senderProfile?.role==="admin" ? "client" : "admin");
    for (const recipient of (adminProfiles||[])) {
      await sendNotification({
        type: "comment",
        senderName: senderProfile?.full_name || "A team member",
        milestoneTitle: "project milestone",
        messagePreview: text.trim().substring(0, 120),
        recipientEmail: recipient.email,
      });
    }
    setText(""); setPosting(false);
  }

  return (
    <div>
      <p style={{ fontSize:"0.72rem", fontWeight:700, color:T.textMid, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Comments ({comments.length})</p>
      {loading ? <Spinner size={15} /> : comments.length===0 ? (
        <p style={{ fontSize:"0.8rem", color:T.textLight, fontStyle:"italic", marginBottom:12 }}>No comments yet. Start the conversation.</p>
      ) : (
        <div style={{ display:"grid", gap:10, marginBottom:14, maxHeight:240, overflowY:"auto" }}>
          {comments.map(c => {
            const isMe = c.author_id===session.user.id;
            const isAdm = c.profiles?.role==="admin";
            return (
              <div key={c.id} style={{ display:"flex", gap:8, justifyContent:isMe?"flex-end":"flex-start" }}>
                {!isMe && <div style={{ width:28, height:28, borderRadius:"50%", background:isAdm?T.goldDim:T.cardBg, border:`1.5px solid ${isAdm?T.goldLine:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.68rem", fontWeight:700, color:isAdm?T.gold:T.textMid, flexShrink:0 }}>{(c.profiles?.full_name||"?")[0].toUpperCase()}</div>}
                <div style={{ maxWidth:"72%" }}>
                  {!isMe && <p style={{ fontSize:"0.68rem", color:isAdm?T.gold:T.textMid, marginBottom:2, fontWeight:600 }}>{c.profiles?.full_name}{isAdm&&" · BlueLink"}</p>}
                  <div className={isMe?"bubble-me":"bubble-them"}>
                    {c.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                      /^https?:\/\//.test(part)
                        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                            style={{ color: isMe ? "#0d1b2e" : T.gold, textDecoration:"underline", wordBreak:"break-all" }}>{part}</a>
                        : part
                    )}
                  </div>
                  <p style={{ fontSize:"0.62rem", color:T.textLight, marginTop:2, textAlign:isMe?"right":"left" }}>{new Date(c.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
      <form onSubmit={post} style={{ display:"flex", gap:8 }}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment..." className="inp" style={{ flex:1 }} />
        <button type="submit" disabled={posting||!text.trim()} className="btn-gold" style={{ padding:"10px 14px" }}>{posting?<Spinner size={13}/>:<Send size={13}/>}</button>
      </form>
    </div>
  );
}

/* ─── MESSAGES ───────────────────────────────────────────── */
function Messages() {
  const { session, profile } = usePortal();
  const isAdmin = profile?.role==="admin";
  const [threads, setThreads] = useState([]);
  const [active, setActive]   = useState(null);
  const [msgs, setMsgs]       = useState([]);
  const [text, setText]       = useState("");
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("profiles").select("*").eq("role", isAdmin?"client":"admin");
      setThreads(data||[]); setLoading(false);
    }
    load();
  }, [isAdmin]);

  useEffect(() => {
    if (!active) return;
    async function loadMsgs() {
      const { data } = await supabase.from("direct_messages").select("*, sender:profiles!sender_id(full_name,role)").or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${active.id}),and(sender_id.eq.${active.id},recipient_id.eq.${session.user.id})`).order("created_at",{ascending:true});
      setMsgs(data||[]);
    }
    loadMsgs();
    const ch = supabase.channel(`dm-${[session.user.id,active.id].sort().join("-")}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"direct_messages"},loadMsgs).subscribe();
    return () => supabase.removeChannel(ch);
  }, [active, session]);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()||!active) return;
    setPosting(true);
    const { data: senderProfile } = await supabase.from("profiles").select("full_name,email").eq("id", session.user.id).single();
    await supabase.from("direct_messages").insert({ sender_id:session.user.id, recipient_id:active.id, content:text.trim() });
    // Email the recipient
    await sendNotification({
      type: "message",
      senderName: senderProfile?.full_name || "A team member",
      messagePreview: text.trim().substring(0, 120),
      recipientEmail: active.email,
    });
    setText(""); setPosting(false);
  }

  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Communication</p>
      <h1 className="section-title">Messages</h1>
      <div className="gold-bar" />
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gap:16, minHeight:500 }}>
        <div className="card" style={{ padding:10 }}>
          <p style={{ fontSize:"0.68rem", fontWeight:800, color:T.textMid, textTransform:"uppercase", letterSpacing:"0.1em", padding:"4px 8px", marginBottom:8 }}>{isAdmin?"Clients":"Team"}</p>
          {loading ? <Spinner size={15} /> : threads.length===0 ? <p style={{ fontSize:"0.8rem", color:T.textLight, padding:"10px 8px" }}>No contacts yet.</p> : threads.map(t => (
            <button key={t.id} onClick={() => setActive(t)} style={{ width:"100%", background:active?.id===t.id?T.goldDim:"transparent", border:active?.id===t.id?`1.5px solid ${T.goldLine}`:"1.5px solid transparent", borderRadius:8, padding:"10px 12px", cursor:"pointer", textAlign:"left", marginBottom:4, transition:"all 0.15s ease" }}>
              <p style={{ fontSize:"0.84rem", fontWeight:600, color:active?.id===t.id?T.gold:T.text }}>{t.full_name}</p>
              <p style={{ fontSize:"0.72rem", color:T.textMid }}>{t.company}</p>
            </button>
          ))}
        </div>
        <div className="card" style={{ display:"flex", flexDirection:"column", padding:0, overflow:"hidden" }}>
          {!active ? <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><Empty icon={MessageSquare} title="Select a conversation" text="Choose a contact from the left." /></div> : <>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${T.border}`, background:T.cardBg }}>
              <p style={{ fontWeight:700, color:T.text, fontSize:"0.9rem" }}>{active.full_name}</p>
              <p style={{ fontSize:"0.72rem", color:T.textMid }}>{active.company}</p>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:20, display:"grid", gap:12, alignContent:"start", minHeight:300, maxHeight:380 }}>
              {msgs.length===0 ? <p style={{ fontSize:"0.8rem", color:T.textLight, textAlign:"center", padding:"40px 0" }}>No messages yet.</p> : msgs.map(m => {
                const isMe = m.sender_id===session.user.id;
                return <div key={m.id} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start" }}>
                  <div>
                    <div className={isMe?"bubble-me":"bubble-them"}>
                      {m.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                        part.startsWith("http")
                          ? <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                              style={{ color: isMe ? "#0d1b2e" : T.gold, textDecoration:"underline", wordBreak:"break-all" }}>{part}</a>
                          : part
                      )}
                    </div>
                    <p style={{ fontSize:"0.62rem", color:T.textLight, marginTop:2, textAlign:isMe?"right":"left" }}>{new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                  </div>
                </div>;
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={send} style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8 }}>
              <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." className="inp" style={{ flex:1 }} />
              <button type="submit" disabled={posting||!text.trim()} className="btn-gold" style={{ padding:"10px 16px" }}>{posting?<Spinner size={13}/>:<Send size={13}/>}</button>
            </form>
          </>}
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN INVITES ──────────────────────────────────────── */
function AdminInvites() {
  const { session } = usePortal();
  const [invites, setInvites] = useState([]);
  const [email, setEmail]     = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(null);

  useEffect(() => {
    supabase.from("invitations").select("*").order("created_at",{ascending:false}).then(({data}) => { if(data)setInvites(data); setLoading(false); });
  }, []);

  async function send(e) {
    e.preventDefault(); setSending(true);
    const token = Math.random().toString(36).substring(2,8).toUpperCase()+Math.random().toString(36).substring(2,8).toUpperCase();
    const { data } = await supabase.from("invitations").insert({ email:email.toLowerCase().trim(), invited_by:session.user.id, token }).select().single();
    if (data) setInvites(prev=>[data,...prev]);
    setEmail(""); setSending(false);
  }

  async function del(id) {
    await supabase.from("invitations").delete().eq("id",id);
    setInvites(prev=>prev.filter(i=>i.id!==id));
  }

  function copy(token) {
    navigator.clipboard.writeText(token);
    setCopied(token); setTimeout(()=>setCopied(null),2000);
  }

  return (
    <div style={{ maxWidth:760 }}>
      <p className="eyebrow">Access Control</p>
      <h1 className="section-title">Invitations</h1>
      <div className="gold-bar" />
      <div className="card" style={{ marginBottom:28, border:`1.5px solid ${T.goldLine}` }}>
        <h3 style={{ color:T.gold, fontWeight:700, marginBottom:6, fontSize:"0.95rem" }}>Generate Invite Code</h3>
        <p style={{ color:T.textMid, fontSize:"0.82rem", marginBottom:14 }}>Only clients with a valid invite code can create an account.</p>
        <form onSubmit={send} style={{ display:"flex", gap:10 }}>
          <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@company.com" required style={{ flex:1 }} />
          <button type="submit" disabled={sending} className="btn-gold">{sending?<Spinner size={14}/>:<><Mail size={14}/> Generate</>}</button>
        </form>
      </div>
      <h2 style={{ fontSize:"1rem", fontWeight:700, color:T.text, marginBottom:14 }}>All Invitations</h2>
      {loading ? <Spinner /> : invites.length===0 ? <Empty icon={Mail} title="No invitations yet" text="Generate your first invitation above." /> : (
        <div>
          {invites.map(inv => (
            <div key={inv.id} className="invite-row">
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:600, color:T.text, fontSize:"0.875rem", marginBottom:6 }}>{inv.email}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <code style={{ background:T.cardBg, border:`1.5px solid ${T.border}`, padding:"3px 12px", borderRadius:6, fontSize:"0.82rem", color:T.gold, fontFamily:"monospace", letterSpacing:"0.1em" }}>{inv.token}</code>
                  <button onClick={() => copy(inv.token)} className="btn-ghost" style={{ padding:"3px 8px", fontSize:"0.76rem" }}>{copied===inv.token?"✓ Copied":"Copy"}</button>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <span className="badge" style={{ background:inv.accepted?"rgba(22,163,74,0.1)":"rgba(217,119,6,0.1)", color:inv.accepted?T.success:T.warning }}>{inv.accepted?"Accepted":"Pending"}</span>
                {!inv.accepted && <button onClick={() => del(inv.id)} className="btn-ghost" style={{ color:T.danger, padding:"4px 8px" }}><Trash2 size={13}/></button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN CLIENTS ──────────────────────────────────────── */
function AdminClients() {
  const { allClients, projects } = usePortal();
  const [query, setQuery] = useState("");
  const filtered = allClients.filter(c => {
    const q = query.toLowerCase();
    return !q || c.full_name?.toLowerCase().includes(q) || c.company?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });
  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Manage</p>
      <h1 className="section-title">Clients</h1>
      <div className="gold-bar" />
      {/* Search bar */}
      <div style={{ position:"relative", marginBottom:20, maxWidth:420 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.textLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className="inp"
          type="text"
          placeholder="Search by name, company or email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft:36 }}
        />
        {query && (
          <button onClick={() => setQuery("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.textLight, fontSize:"1rem", lineHeight:1 }}>×</button>
        )}
      </div>
      {allClients.length===0 ? <Empty icon={Users} title="No clients yet" text="Send invitations to add clients." /> :
       filtered.length===0 ? <Empty icon={Users} title="No results" text={`No clients match "${query}"`} /> : (
        <div style={{ display:"grid", gap:12 }}>
          {filtered.map(c => {
            const cp=projects.filter(p=>p.client_id===c.id);
            return (
              <div key={c.id} className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:T.goldDim, border:`1.5px solid ${T.goldLine}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, color:T.gold, fontSize:"1rem", flexShrink:0 }}>{(c.full_name||"?")[0].toUpperCase()}</div>
                  <div>
                    <p style={{ fontWeight:700, color:T.text }}>{c.full_name}</p>
                    <p style={{ fontSize:"0.78rem", color:T.textMid }}>{c.company}</p>
                    <p style={{ fontSize:"0.72rem", color:T.textLight }}>{c.email}</p>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontSize:"0.9rem", color:T.gold, fontWeight:700 }}>{cp.length} project{cp.length!==1?"s":""}</p>
                  <p style={{ fontSize:"0.72rem", color:T.textMid }}>{cp.filter(p=>p.status==="active").length} active</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN INBOX ────────────────────────────────────────── */
function AdminInbox() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("form_submissions").select("*, profiles(full_name,company,email)").order("submitted_at",{ascending:false});
      if(data)setItems(data); setLoading(false);
    }
    load();
    const ch = supabase.channel("inbox-rt").on("postgres_changes",{event:"INSERT",schema:"public",table:"form_submissions"},load).subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const labels = { onboarding:"Onboarding", discovery:"Discovery", milestone_signoff:"Sign-Off", support_request:"Support" };
  const colors = { onboarding:{bg:"rgba(37,99,235,0.1)",color:T.info}, discovery:{bg:T.goldDim,color:T.gold}, milestone_signoff:{bg:"rgba(22,163,74,0.1)",color:T.success}, support_request:{bg:"rgba(220,38,38,0.1)",color:T.danger} };

  function summary(item) {
    const d=item.data||{};
    switch(item.form_type) {
      case "onboarding":       return `${d.company_name||"—"} · ${d.industry||"—"}`;
      case "discovery":        return `${d.project_name||"—"} · ${d.service_type||"—"}`;
      case "milestone_signoff":return `${d.milestone_name||"—"} · By: ${d.approved_by||"—"}`;
      case "support_request":  return `[${d.priority||"—"}] ${d.subject||"—"}`;
      default: return JSON.stringify(d).substring(0,80);
    }
  }

  const filtered = filter==="all"?items:items.filter(i=>i.form_type===filter);

  if (selected) {
    const item=items.find(i=>i.id===selected);
    const c=colors[item.form_type]||colors.onboarding;
    return (
      <div style={{ maxWidth:760 }}>
        <button className="btn-ghost" onClick={()=>setSelected(null)} style={{ marginBottom:20 }}>← Back to inbox</button>
        <div className="card">
          <span className="badge" style={{ background:c.bg, color:c.color, marginBottom:14, display:"inline-flex" }}>{labels[item.form_type]}</span>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.gold, marginBottom:6, fontSize:"1.4rem" }}>{item.profiles?.full_name||"Unknown"}</h2>
          <p style={{ color:T.textMid, fontSize:"0.8rem", marginBottom:20 }}>{item.profiles?.company} · {item.profiles?.email} · {new Date(item.submitted_at).toLocaleString()}</p>
          <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:18, display:"grid", gap:14 }}>
            {Object.entries(item.data||{}).map(([key,val])=>(
              <div key={key} style={{ borderBottom:`1px solid ${T.border}`, paddingBottom:12 }}>
                <p style={{ fontSize:"0.7rem", fontWeight:700, color:T.textMid, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:4 }}>{key.replace(/_/g," ")}</p>
                <p style={{ color:T.text, fontSize:"0.875rem", lineHeight:1.65 }}>{String(val)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:900 }}>
      <p className="eyebrow">Admin View</p>
      <h1 className="section-title">Inbox</h1>
      <div className="gold-bar" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:22 }}>
        {[{label:"All",type:"all",value:items.length},{label:"Onboarding",type:"onboarding",value:items.filter(i=>i.form_type==="onboarding").length},{label:"Discovery",type:"discovery",value:items.filter(i=>i.form_type==="discovery").length},{label:"Sign-Off",type:"milestone_signoff",value:items.filter(i=>i.form_type==="milestone_signoff").length},{label:"Support",type:"support_request",value:items.filter(i=>i.form_type==="support_request").length}].map(s=>(
          <div key={s.label} className="card-click" onClick={()=>setFilter(s.type)} style={{ padding:"12px 14px", border:filter===s.type?`1.5px solid ${T.goldLine}`:`1px solid ${T.border}`, background:filter===s.type?T.goldDim:T.card }}>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", color:T.gold, fontWeight:700 }}>{s.value}</p>
            <p style={{ fontSize:"0.7rem", color:T.textMid, marginTop:3 }}>{s.label}</p>
          </div>
        ))}
      </div>
      {loading ? <Spinner /> : filtered.length===0 ? <Empty icon={Inbox} title="No submissions" text="Form submissions will appear here." /> : (
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
          {filtered.map((item,i)=>{
            const c=colors[item.form_type]||colors.onboarding;
            return (
              <div key={item.id} style={{ display:"grid", gridTemplateColumns:"110px 1fr 150px 110px auto", gap:14, padding:"14px 20px", borderBottom:i<filtered.length-1?`1px solid ${T.border}`:"none", alignItems:"center" }}>
                <span className="badge" style={{ background:c.bg, color:c.color }}>{labels[item.form_type]}</span>
                <p style={{ fontSize:"0.82rem", color:T.text, lineHeight:1.5 }}>{summary(item)}</p>
                <div><p style={{ fontWeight:600, fontSize:"0.8rem", color:T.text }}>{item.profiles?.full_name||"—"}</p><p style={{ fontSize:"0.7rem", color:T.textMid }}>{item.profiles?.company}</p></div>
                <p style={{ fontSize:"0.74rem", color:T.textMid }}>{new Date(item.submitted_at).toLocaleDateString()}</p>
                <button onClick={()=>setSelected(item.id)} className="btn-ghost" style={{ border:`1px solid ${T.border}`, padding:"5px 10px", borderRadius:6 }}><Eye size={12}/> View</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── FORMS ──────────────────────────────────────────────── */
function Forms() {
  const { session, projects } = usePortal();
  const [active, setActive] = useState(null);
  const [subs, setSubs]     = useState([]);

  useEffect(() => {
    supabase.from("form_submissions").select("form_type,submitted_at").eq("client_id",session.user.id).then(({data})=>{if(data)setSubs(data);});
  }, [session]);

  const defs = [
    { id:"onboarding",        title:"Client Onboarding",   icon:User,         desc:"Tell us about your business and goals." },
    { id:"discovery",         title:"Project Discovery",   icon:Briefcase,    desc:"Help us understand your technical landscape." },
    { id:"milestone_signoff", title:"Milestone Sign-Off",  icon:CheckCircle2, desc:"Formally approve a completed milestone." },
    { id:"support_request",   title:"Support Request",     icon:MessageSquare,desc:"Submit a question or request to BlueLink." },
  ];

  if (active) return <FormView formId={active} onBack={()=>setActive(null)} projects={projects} session={session} />;

  return (
    <div style={{ maxWidth:860 }}>
      <p className="eyebrow">Submit & Track</p>
      <h1 className="section-title">Forms</h1>
      <div className="gold-bar" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        {defs.map(f => { const Icon=f.icon; const sub=subs.find(s=>s.form_type===f.id); return (
          <div key={f.id} className="card-click" onClick={()=>setActive(f.id)} style={{ position:"relative" }}>
            {sub && <span className="badge" style={{ position:"absolute", top:14, right:14, background:"rgba(22,163,74,0.1)", color:T.success }}>Submitted</span>}
            <Icon size={24} style={{ color:T.gold, marginBottom:12 }} />
            <p style={{ fontWeight:700, color:T.text, marginBottom:5 }}>{f.title}</p>
            <p style={{ color:T.textMid, fontSize:"0.82rem", lineHeight:1.6, marginBottom:12 }}>{f.desc}</p>
            <span style={{ color:T.gold, fontSize:"0.8rem", fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>{sub?"View / Resubmit":"Fill out form"} <ArrowRight size={12}/></span>
          </div>
        );})}
      </div>
    </div>
  );
}

function FormView({ formId, onBack, projects, session }) {
  const [data, setData]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone]         = useState(false);
  const s = (k,v) => setData(p=>({...p,[k]:v}));

  const forms = {
    onboarding: { title:"Client Onboarding Form", fields:[
      {key:"company_name",label:"Company Name",type:"text",required:true},
      {key:"industry",label:"Industry",type:"text",required:true},
      {key:"company_size",label:"Company Size",type:"select",options:["1–10","11–50","51–200","201–500","500+"]},
      {key:"primary_goal",label:"Primary Goal with BlueLink",type:"textarea",required:true},
      {key:"current_challenges",label:"Current Technical Challenges",type:"textarea"},
      {key:"preferred_contact",label:"Preferred Contact",type:"select",options:["Email","Phone","Video call","Slack"]},
      {key:"timezone",label:"Timezone",type:"text"},
    ]},
    discovery: { title:"Project Discovery", fields:[
      {key:"project_name",label:"Project Name",type:"text",required:true},
      {key:"service_type",label:"Service Type",type:"select",options:["Application Modernization","DevOps Automation","Monitoring & Analytics","Data Management","Security Improvement","Scaling Improvements","Cloud Infrastructure"]},
      {key:"current_stack",label:"Current Tech Stack",type:"textarea",required:true},
      {key:"pain_points",label:"Key Pain Points",type:"textarea",required:true},
      {key:"timeline",label:"Desired Timeline",type:"select",options:["ASAP","1–3 months","3–6 months","6–12 months","Flexible"]},
      {key:"budget_range",label:"Budget Range",type:"select",options:["Under $5k","$5k–$15k","$15k–$50k","$50k–$100k","$100k+","TBD"]},
      {key:"success_criteria",label:"Success Criteria",type:"textarea",required:true},
    ]},
    milestone_signoff: { title:"Milestone Sign-Off", fields:[
      {key:"project_id",label:"Project",type:"project_select"},
      {key:"milestone_name",label:"Milestone Name",type:"text",required:true},
      {key:"meets_requirements",label:"Meets Requirements?",type:"select",options:["Yes","No","Needs revision"]},
      {key:"feedback",label:"Feedback",type:"textarea"},
      {key:"approved_by",label:"Approved By",type:"text",required:true},
      {key:"date",label:"Date",type:"date",required:true},
    ]},
    support_request: { title:"Support Request", fields:[
      {key:"category",label:"Category",type:"select",options:["Technical issue","Project question","Invoice query","General enquiry","Urgent escalation"]},
      {key:"subject",label:"Subject",type:"text",required:true},
      {key:"description",label:"Description",type:"textarea",required:true},
      {key:"priority",label:"Priority",type:"select",options:["Low","Medium","High","Critical"]},
    ]},
  };

  const form = forms[formId];

  async function submit(e) {
    e.preventDefault(); setSubmitting(true);
    await supabase.from("form_submissions").insert({ client_id:session.user.id, project_id:data.project_id||null, form_type:formId, data });
    setSubmitting(false); setDone(true);
  }

  if (done) return (
    <div style={{ maxWidth:500, textAlign:"center", padding:"56px 20px" }}>
      <CheckCircle2 size={48} style={{ color:T.success, margin:"0 auto 16px", display:"block" }} />
      <h2 style={{ fontFamily:"'Playfair Display',serif", color:T.text, marginBottom:10, fontSize:"1.6rem" }}>Submitted successfully</h2>
      <p style={{ color:T.textMid, marginBottom:24 }}>BlueLink Consult will review and follow up within one business day.</p>
      <button onClick={onBack} className="btn-gold">Back to forms</button>
    </div>
  );

  return (
    <div style={{ maxWidth:680 }}>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom:20 }}>← Back to forms</button>
      <h1 className="section-title">{form.title}</h1>
      <div className="gold-bar" />
      <div className="card" style={{ border:`1.5px solid ${T.goldLine}` }}>
        <form onSubmit={submit} style={{ display:"grid", gap:16 }}>
          {form.fields.map(field=>(
            <label key={field.key} className="lbl">
              {field.label}{field.required&&<span style={{color:T.gold}}> *</span>}
              {field.type==="text"         && <input className="inp" required={field.required} value={data[field.key]||""} onChange={e=>s(field.key,e.target.value)} />}
              {field.type==="date"         && <input className="inp" type="date" required={field.required} value={data[field.key]||""} onChange={e=>s(field.key,e.target.value)} />}
              {field.type==="textarea"     && <textarea className="inp" rows={3} required={field.required} value={data[field.key]||""} onChange={e=>s(field.key,e.target.value)} style={{resize:"vertical"}} />}
              {field.type==="select"       && <select className="inp" required={field.required} value={data[field.key]||""} onChange={e=>s(field.key,e.target.value)} style={{cursor:"pointer"}}><option value="">Select...</option>{field.options.map(o=><option key={o}>{o}</option>)}</select>}
              {field.type==="project_select"&&<select className="inp" value={data[field.key]||""} onChange={e=>s(field.key,e.target.value)} style={{cursor:"pointer"}}><option value="">None</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>}
            </label>
          ))}
          <button type="submit" disabled={submitting} className="btn-gold" style={{justifyContent:"center",marginTop:4}}>
            {submitting?<Spinner size={15}/>:"Submit Form"}{!submitting&&<Send size={14}/>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── INVOICES ───────────────────────────────────────────── */
function Invoices() {
  const { invoices, session } = usePortal();
  const [paying, setPaying] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const total   = invoices.reduce((s,i)=>s+Number(i.amount),0);
  const paid    = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+Number(i.amount),0);
  const pending = invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+Number(i.amount),0);
  const cartTotal = cartItems.reduce((s,i)=>s+Number(i.amount),0);

  function addToCart(inv) {
    if (!cartItems.find(c=>c.id===inv.id)) setCartItems(prev=>[...prev,inv]);
  }
  function removeFromCart(id) { setCartItems(prev=>prev.filter(c=>c.id!==id)); }

  async function payInvoice(inv) {
    setPaying(inv.id);
    // Check if invoice has a Stripe payment link stored
    if (inv.payment_link) { window.open(inv.payment_link, "_blank"); setPaying(null); return; }
    // Otherwise open email to request payment link
    const subject = encodeURIComponent("Payment for Invoice " + inv.invoice_number);
    const body    = encodeURIComponent(
      "Hi BlueLink Consults,\n\n" +
      "I would like to pay invoice " + inv.invoice_number + " for $" + Number(inv.amount).toLocaleString() + ".\n\n" +
      "Please send me a payment link.\n\nThank you."
    );
    window.open("mailto:info@bluelinkconsults.com?subject=" + subject + "&body=" + body);
    setPaying(null);
  }

  async function checkoutCart() {
    const subject = encodeURIComponent("Bulk Payment Request — " + cartItems.length + " Invoice(s)");
    const lines   = cartItems.map(i => "• " + i.invoice_number + " — $" + Number(i.amount).toLocaleString()).join("\n");
    const body    = encodeURIComponent(
      "Hi BlueLink Consults,\n\n" +
      "I would like to pay the following invoices:\n\n" +
      lines + "\n\n" +
      "Total: $" + cartTotal.toLocaleString() + "\n\n" +
      "Please send me a payment link.\n\nThank you."
    );
    window.open("mailto:info@bluelinkconsults.com?subject=" + subject + "&body=" + body);
  }

  return (
    <div style={{ maxWidth:900 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div><p className="eyebrow">Billing</p><h1 className="section-title">Invoices</h1></div>
        {/* Cart button */}
        {cartItems.length > 0 && (
          <button className="btn-gold" onClick={() => setShowCart(!showCart)}>
            <CreditCard size={15}/> Cart ({cartItems.length}) · ${cartTotal.toLocaleString()}
          </button>
        )}
      </div>
      <div className="gold-bar" />

      {/* Cart panel */}
      {showCart && cartItems.length > 0 && (
        <div style={{ background:T.card, border:`1.5px solid ${T.goldLine}`, borderRadius:12, padding:20, marginBottom:20 }}>
          <h3 style={{ fontWeight:700, color:T.text, marginBottom:14, fontSize:"0.95rem" }}>Payment Cart</h3>
          {cartItems.map(inv => (
            <div key={inv.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
              <div>
                <p style={{ fontWeight:700, color:T.text, fontSize:"0.875rem" }}>{inv.invoice_number}</p>
                <p style={{ fontSize:"0.76rem", color:T.textMid }}>{inv.description}</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <p style={{ fontWeight:700, color:T.gold }}>${Number(inv.amount).toLocaleString()}</p>
                <button onClick={() => removeFromCart(inv.id)} className="btn-ghost" style={{ color:T.danger, padding:"3px 8px" }}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:14 }}>
            <p style={{ fontWeight:800, color:T.text }}>Total: <span style={{ color:T.gold }}>${cartTotal.toLocaleString()}</span></p>
            <button className="btn-gold" onClick={checkoutCart}><Send size={14}/> Request Payment Link</button>
          </div>
          <p style={{ fontSize:"0.76rem", color:T.textMid, marginTop:10 }}>We will email you a secure Stripe payment link within one business hour.</p>
        </div>
      )}

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[
          {label:"Total Billed", value:`$${total.toLocaleString()}`,   color:T.text},
          {label:"Amount Paid",  value:`$${paid.toLocaleString()}`,    color:T.success},
          {label:"Amount Due",   value:`$${pending.toLocaleString()}`, color:T.gold},
        ].map(s=>(
          <div key={s.label} className="card">
            <p style={{ fontSize:"0.7rem", color:T.textMid, fontWeight:700, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.6rem", fontWeight:700, color:s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* How payment works */}
      <div style={{ background:"rgba(201,168,76,0.06)", border:`1px solid ${T.goldLine}`, borderRadius:10, padding:"14px 18px", marginBottom:20, fontSize:"0.84rem", color:T.textMid, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:"1.2rem" }}>💳</span>
        <div>
          <strong style={{ color:T.text }}>How to pay:</strong> Click <strong style={{ color:T.gold }}>Pay Now</strong> on any pending invoice, or add multiple invoices to your cart and request a single payment link. We use <strong style={{ color:T.text }}>Stripe</strong> for secure online payments. You will receive a payment link by email within one business hour.
        </div>
      </div>

      {invoices.length===0 ? <Empty icon={CreditCard} title="No invoices yet" text="Invoices from BlueLink Consult will appear here." /> : (
        <div style={{ display:"grid", gap:12 }}>
          {invoices.map(inv => (
            <div key={inv.id} className="card" style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"center" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <p style={{ fontWeight:700, color:T.text, fontSize:"0.95rem" }}>{inv.invoice_number}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <p style={{ color:T.textMid, fontSize:"0.84rem", marginBottom:4 }}>{inv.description}</p>
                <div style={{ display:"flex", gap:16, fontSize:"0.76rem", color:T.textLight }}>
                  {inv.due_date && <span>Due: {new Date(inv.due_date).toLocaleDateString()}</span>}
                  <span style={{ fontWeight:700, color:T.gold, fontSize:"1rem" }}>${Number(inv.amount).toLocaleString()}</span>
                </div>
              </div>
              {inv.status !== "paid" && (
                <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                  <button
                    className="btn-outline"
                    style={{ padding:"7px 12px", fontSize:"0.8rem" }}
                    onClick={() => addToCart(inv)}
                    disabled={!!cartItems.find(c=>c.id===inv.id)}
                  >
                    {cartItems.find(c=>c.id===inv.id) ? "✓ In Cart" : "+ Cart"}
                  </button>
                  <button
                    className="btn-gold"
                    style={{ padding:"8px 16px", fontSize:"0.84rem" }}
                    onClick={() => payInvoice(inv)}
                    disabled={paying===inv.id}
                  >
                    {paying===inv.id ? <Spinner size={13}/> : <><CreditCard size={13}/> Pay Now</>}
                  </button>
                </div>
              )}
              {inv.status === "paid" && (
                <div style={{ display:"flex", alignItems:"center", gap:6, color:T.success, fontSize:"0.84rem", fontWeight:700 }}>
                  <CheckCircle2 size={16}/> Paid
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop:18, padding:"12px 16px", background:T.cardBg, border:`1px solid ${T.border}`, borderRadius:8, fontSize:"0.8rem", color:T.textMid }}>
        <strong style={{ color:T.gold }}>Questions?</strong> Email <strong style={{ color:T.text }}>info@bluelinkconsults.com</strong> or call <strong style={{ color:T.text }}>401-440-2434</strong>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMAIL NOTIFICATION SETUP — One-time Supabase configuration
   ═══════════════════════════════════════════════════════════

   1. In your project root, create this file:
      supabase/functions/notify/index.ts

   2. Paste this into it:

   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

   serve(async (req) => {
     const { type, senderName, projectName, milestoneTitle, messagePreview, recipientEmail } = await req.json();
     const RESEND_KEY = Deno.env.get("RESEND_API_KEY"); // or use your SMTP key

     const subject = type === "message"
       ? `New message from ${senderName} — BlueLink Consults Portal`
       : `New comment on ${milestoneTitle} — BlueLink Consults Portal`;

     const html = `
       <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
         <h2 style="color:#0d1b2e;">BlueLink Consults Portal</h2>
         <p><strong>${senderName}</strong> sent you a ${type === "message" ? "message" : "comment"}:</p>
         <blockquote style="border-left:3px solid #c9a84c;padding-left:14px;color:#444;">${messagePreview}</blockquote>
         <a href="https://www.bluelinkconsults.com/client-login" style="display:inline-block;background:#c9a84c;color:#0d1b2e;padding:12px 24px;text-decoration:none;font-weight:700;border-radius:6px;margin-top:16px;">Open Portal</a>
       </div>`;

     await fetch("https://api.resend.com/emails", {
       method: "POST",
       headers: { "Authorization": \`Bearer \${RESEND_KEY}\`, "Content-Type": "application/json" },
       body: JSON.stringify({ from: "BlueLink Consults <noreply@bluelinkconsults.com>", to: recipientEmail, subject, html }),
     });

     return new Response("ok", { status: 200 });
   });

   3. Set your secret: supabase secrets set RESEND_API_KEY=your_key_here
   4. Deploy: supabase functions deploy notify
   ═══════════════════════════════════════════════════════════ */
