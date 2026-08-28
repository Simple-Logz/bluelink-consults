const SUPABASE_URL = "https://kqjyubxrbjyvakpvcymc.supabase.co";
const SUPABASE_KEY = "sb_publishable_yNpvKpFRVhqTs02wclmX6A_FJwhg_5c";

const STORE = "bluelink_simulator_state_v2";
const fresh = () => ({ sessionId: crypto.randomUUID(), started: false, stack: [], services: [], modules: [], users: 2000 });
let state;
try { state = JSON.parse(sessionStorage.getItem(STORE)) || fresh(); } catch { state = fresh(); }
const save = () => sessionStorage.setItem(STORE, JSON.stringify(state));

async function record(eventType, extra = {}) {
  if (location.pathname !== "/simulator") return;
  const payload = {
    session_id: state.sessionId,
    event_type: eventType,
    status: eventType === "completed" ? "completed" : eventType === "started" ? "started" : "in_progress",
    last_step: Math.min(4, Number(extra.last_step ?? 0)),
    technology_stack: state.stack,
    legacy_services: state.services,
    modernization_modules: state.modules,
    user_count: state.users,
    page_path: location.pathname,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    completed_at: eventType === "completed" ? new Date().toISOString() : null,
    ...extra,
  };
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/simulator_sessions`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (_) {}
}

function selectedLabels() {
  return [...document.querySelectorAll(".sim-opt.on .sim-ol")].map(x => x.textContent.trim());
}

function captureStep() {
  const step = document.querySelector(".sim-ey")?.textContent || "";
  const labels = selectedLabels();
  if (step.includes("Step 1")) state.stack = labels;
  if (step.includes("Step 2")) state.services = labels;
  if (step.includes("Step 4")) state.modules = labels;
  const slider = document.querySelector("#susl");
  if (slider) state.users = Number(slider.value || 2000);
  save();
}

function buildAssessment() {
  const svc = state.services.map(x => x.toLowerCase());
  const mods = state.modules.map(x => x.toLowerCase());
  const findings = [];
  const recs = [];
  const add = (severity, title, detail, recommendation) => { findings.push({ severity, title, detail }); recs.push(recommendation); };

  if (svc.some(x => x.includes("manual deployment"))) add("High", "Release process is manually dependent", "Manual deployments increase release inconsistency, recovery time, and operational dependency on individual staff.", "Introduce a staged CI/CD pipeline with approval gates, rollback, and automated validation.");
  if (svc.some(x => x.includes("custom auth") || x.includes("ldap"))) add("High", "Identity modernization opportunity", "Legacy or custom identity increases access-control overhead and makes MFA, SSO, and centralized governance harder.", "Move toward managed identity with SSO, MFA, role-based access, and auditable access policies.");
  if (svc.some(x => x.includes("ftp"))) add("High", "Legacy file-transfer exposure", "FTP-based workflows create avoidable security and operational risk, especially when business-critical data is transferred outside modern controls.", "Replace FTP workflows with encrypted managed transfer, object storage, or API-based exchange.");
  if (svc.some(x => x.includes("paper"))) add("High", "Manual workflow bottleneck", "Paper-based processes limit visibility, create re-entry work, and make approvals and reporting difficult to scale.", "Digitize the workflow first, then automate routing, approvals, notifications, and reporting.");
  if (svc.some(x => x.includes("on-prem database") || x.includes("virtual servers"))) add("Medium", "Infrastructure concentration risk", "Core workloads appear dependent on locally managed infrastructure, increasing maintenance burden and limiting elasticity.", "Assess cloud/hybrid readiness, backup posture, recovery objectives, and phased migration options.");
  if (svc.some(x => x.includes("soap"))) add("Medium", "Integration architecture is aging", "SOAP/XML dependencies can slow partner integration and make modern web/mobile services harder to evolve.", "Introduce an API modernization layer and migrate interfaces incrementally rather than rewriting everything at once.");
  if (svc.some(x => x.includes("monolithic"))) add("Medium", "Deployment coupling detected", "A single deployment unit increases blast radius and makes independent scaling or releases more difficult.", "Identify high-change domains and separate them selectively; avoid unnecessary full microservice decomposition.");
  if (svc.some(x => x.includes("no caching"))) add("Medium", "Performance headroom identified", "Lack of caching can increase database/application load and worsen response time under traffic spikes.", "Profile real bottlenecks, then add application, data, CDN, or edge caching where measurements justify it.");
  if (!findings.length) add("Low", "No major red flag selected", "The supplied answers do not indicate an obvious critical modernization blocker, but a questionnaire cannot verify production performance or security.", "Validate the result with a short technical discovery review before committing to modernization work.");

  const high = findings.filter(f => f.severity === "High").length;
  const medium = findings.filter(f => f.severity === "Medium").length;
  const score = Math.max(20, Math.min(92, 88 - high * 14 - medium * 7 - Math.max(0, state.services.length - 3) * 2));
  const priority = high >= 2 ? "High priority" : high === 1 || medium >= 3 ? "Moderate priority" : "Monitor / validate";
  return { findings: findings.slice(0, 5), recommendations: [...new Set(recs)].slice(0, 5), score, priority };
}

function enhanceResults() {
  if (document.querySelector("#bluelink-assessment")) return;
  const results = document.querySelector(".sim-ins");
  if (!results || !document.body.textContent.includes("Health before")) return;
  const A = buildAssessment();
  const panel = document.createElement("section");
  panel.id = "bluelink-assessment";
  panel.style.cssText = "margin-top:18px;border:1px solid #d9e4ef;border-radius:14px;background:#fff;padding:22px;color:#0d1b2e";
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap">
      <div><div style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#378add">Business Technology Assessment</div><h3 style="margin:6px 0 4px;font-size:22px">What your answers actually indicate</h3><p style="margin:0;color:#5a7090;font-size:13px">Evidence-based guidance from the conditions you selected — not a promise of future performance.</p></div>
      <div style="min-width:130px;text-align:center;background:#f5f9fd;border-radius:12px;padding:12px"><div style="font-size:28px;font-weight:800">${A.score}/100</div><div style="font-size:12px;color:#5a7090">Readiness score</div><div style="font-size:12px;font-weight:800;color:${A.priority.startsWith("High") ? "#b42318" : "#b8720f"};margin-top:4px">${A.priority}</div></div>
    </div>
    <div style="margin-top:20px"><strong>Priority findings</strong>${A.findings.map(f => `<div style="margin-top:10px;padding:12px;border-left:3px solid ${f.severity === "High" ? "#dc4545" : f.severity === "Medium" ? "#b8720f" : "#1d9e75"};background:#f8fafc"><div style="font-weight:800;font-size:14px">${f.severity}: ${f.title}</div><div style="font-size:13px;color:#52657a;margin-top:3px;line-height:1.5">${f.detail}</div></div>`).join("")}</div>
    <div style="margin-top:20px"><strong>Recommended next moves</strong><ol style="margin:10px 0 0;padding-left:20px;color:#52657a;font-size:13px;line-height:1.65">${A.recommendations.map(r => `<li style="margin-bottom:6px">${r}</li>`).join("")}</ol></div>
    <div style="margin-top:20px;padding:16px;background:#0d1b2e;border-radius:12px;color:#fff"><strong>Want this assessment tied to your company?</strong><p style="font-size:13px;color:#c6d2df;margin:5px 0 12px">Leave your details and BlueLink can review the result against your real environment. No obligation.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><input id="bla-company" placeholder="Company" style="padding:10px;border-radius:7px;border:1px solid #50657c"><input id="bla-email" type="email" placeholder="Business email" style="padding:10px;border-radius:7px;border:1px solid #50657c"></div><button id="bla-save" style="margin-top:9px;background:#378add;color:white;border:0;border-radius:7px;padding:10px 16px;font-weight:800;cursor:pointer">Save my assessment</button><span id="bla-msg" style="font-size:12px;margin-left:10px;color:#a9c9e8"></span></div>`;
  results.insertAdjacentElement("afterend", panel);
  record("completed", { last_step: 4, health_score: A.score, priority_level: A.priority, findings: A.findings, recommendations: A.recommendations, result_snapshot: { stack: state.stack, services: state.services, modules: state.modules, users: state.users } });
  panel.querySelector("#bla-save")?.addEventListener("click", () => {
    const company = panel.querySelector("#bla-company").value.trim();
    const email = panel.querySelector("#bla-email").value.trim();
    if (!email || !email.includes("@")) { panel.querySelector("#bla-msg").textContent = "Enter a valid email."; return; }
    record("lead", { last_step: 4, company_name: company || null, contact_email: email, health_score: A.score, priority_level: A.priority, findings: A.findings, recommendations: A.recommendations });
    panel.querySelector("#bla-msg").textContent = "Assessment saved.";
  });
}

function watch() {
  if (location.pathname !== "/simulator") return;
  if (!state.started) { state.started = true; save(); record("started", { last_step: 0 }); }
  document.addEventListener("click", e => {
    if (!e.target.closest(".simulator-page, .sim-wrap, [class*='sim-']")) return;
    setTimeout(() => {
      captureStep();
      const txt = e.target.textContent || "";
      if (/Continue/.test(txt)) record("progress", { last_step: Math.min(4, Number((document.querySelector(".sim-ey")?.textContent.match(/Step (\d)/) || [0,0])[1])) });
      if (/Run simulation/.test(txt)) record("simulation_run", { last_step: 4 });
      if (/Start over/.test(txt)) { state = fresh(); save(); record("restarted", { last_step: 0 }); }
    }, 50);
  }, true);
  const observer = new MutationObserver(() => { captureStep(); enhanceResults(); });
  observer.observe(document.getElementById("root") || document.body, { childList: true, subtree: true });
  setTimeout(enhanceResults, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
