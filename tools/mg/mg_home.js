/* ---------- Learn was compacted (79 → 49 cards): carry the ticks over once ---------- */
(function migrateLearn(){
  if (MS.get("learnV", 1) >= 2) return;
  const k = { ...MS.get("learn", {}) };
  Object.entries(LEARN_MERGED).forEach(([id, src]) => { const all = src.every(s => k[s]); src.forEach(s => delete k[s]); if (all) k[id] = 1; });
  MS.set("learn", k); MS.set("learnV", 2);
})();

/* ---------- routing ---------- */
function route(){
  let hs = location.hash.slice(1);
  const moved = practiceHash(hs);
  if (moved){ hs = moved; history.replaceState(null, "", "#" + hs); }
  const pr = practiceRoute(hs); if (pr) return pr;
  if (hs === "learn") return { view: "learn" };
  if (/^learn-\w+$/.test(hs)) return { view: "chapter", id: hs.slice(6) };
  if (hs === "cases") return { view: "cases" };
  if (/^case-\w+$/.test(hs)) return { view: "case", id: hs.slice(5) };
  if (hs === "labs") return { view: "labs" };
  if (/^lab-\w+$/.test(hs)) return { view: "lab", id: hs.slice(4) };
  if (/^open-\w+$/.test(hs)) return { view: "openq", id: hs.slice(5) };
  if (hs === "exam") return { view: "exam" };
  if (hs === "recap") return { view: "recap" };
  if (hs === "project") return { view: "project" };
  return { view: "home" };
}
function go(hash){ if (location.hash === "#" + hash) render(); else location.hash = hash; }
const words = s => s.split(" ").map((w, i) => `<span class="w" style="animation-delay:${i * 80 + 100}ms">${w}</span>`).join(" ");
const RND = (a, b) => a + Math.random() * (b - a);

/* ---------- case progress ---------- */
const caseP = id => { const all = MS.get("cases", {}), p = all[id]; return p && p.ans ? p : { ans: {} }; };
const caseSave = (id, p) => { const all = MS.get("cases", {}); all[id] = p; MS.set("cases", all); MS.set("lastcase", id); };
const caseStat = c => { const a = Object.values(caseP(c.id).ans); return { done: a.length, right: a.filter(x => x.ok).length, total: c.steps.length }; };
function caseOverall(){ let fin = 0, steps = 0, right = 0; CASES.forEach(c => { const s = caseStat(c); if (s.done === s.total) fin++; steps += s.done; right += s.right; }); return { fin, steps, right }; }
function nextCase(){ const last = MS.get("lastcase", null), c = CASES.find(x => x.id === last); if (c){ const s = caseStat(c); if (s.done && s.done < s.total) return c; } return CASES.find(x => caseStat(x).done < x.steps.length) || CASES[0]; }

/* ---------- overview: the modules ---------- */
const MOD_ICONS = {
  learn: '<path d="M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z"/>',
  cases: '<rect x="3" y="4" width="8" height="16" rx="2"/><path d="M14 6h7M14 11h7M14 16h4"/>',
  labs: '<path d="M9 3v6L4 18a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3M8 3h8M7 14h10"/>',
  practice: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 5 5M11 8v3l2 2"/>',
  exam: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'
};
function modulesHtml(){
  const L = learnStats(), o = caseOverall(), sp = MS.get("spot", { best: 0, sprint: 0 }), qz = MS.get("quiz", {}), fk = Object.keys(MS.get("cards", {})).length, op = Object.values(openState().ticks || {}).filter(t => t.length).length, ex = MS.get("exam", null), labs = MS.get("labs", {});
  const prSub = [qz.last ? `last quiz ${Math.round(qz.last.score / qz.last.n * 100)}%` : `${QUIZ.length + SPOT.length} questions`, sp.best ? `best streak ${sp.best}` : "", `${fk}/${CARDS.length} flashcards`, `${op}/${OPEN.length} exam questions tried`].filter(Boolean);
  const M = [
    ["#learn", "Learn", "The four lectures and two tutorials in short cards, with ten interactive models.", `${L.known}/${L.total} cards known`, "var(--c1)", "learn"],
    ["#cases", "Cases", "Diagnose people problems: define the gap, find the cause, recommend with a theory.", o.fin ? `${o.fin}/${CASES.length} cases solved` : `${CASES.length} cases`, "var(--pri)", "cases"],
    ["#exam", "Mock exam", "90 minutes, timed: explain the theories, then apply them to a case.", ex && ex.score != null ? `last ${ex.score}%` : "90 min", "var(--c4)", "exam"],
    ["#practice", "Practice", "Questions (workplace scenes to spot and multiple choice, as a quiz, a streak or a sprint), flashcards, and every self-check question with a model answer.", prSub.map(s => `<span>${s}</span>`).join(""), "var(--c3)", "practice", "wide"],
    ["#labs", "Labs", "Kelley's attribution trainer, the equity calculator, the Big Five test from class, who said what.", `${Object.keys(labs).length}/4 labs tried`, "var(--c4)", "labs"]
  ];
  return `<section class="sec"><div class="sec-h"><h2>Revise</h2><p>Learn the course, then train in every format the exam can take.</p></div>
    <div class="mods dense">${M.map(m => `<a class="modt${m[6] ? " " + m[6] : ""}" href="${m[0]}" style="--c:${m[4]}"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${MOD_ICONS[m[5]]}</svg></span><b>${m[1]}</b><span class="md">${m[2]}</span><span class="ms${m[6] ? " msub" : ""}">${m[3]}</span></a>`).join("")}</div>
    <a class="tdfull pjbanner" href="#project"><span><b>Group project, 40% of the grade</b><span>The brief from lecture 1, a theory finder for your problem, the expected structure, a checklist and the Q&amp;A to rehearse.</span></span>${ICO.arrow}</a></section>`;
}

/* ---------- overview ---------- */
const FORMS = [
  { name: "Crowd", def: "Co-presence, nothing more. Everyone moves for their own reasons." },
  { name: "Group", def: "Interactions and a sense of belonging. Clusters form, but there is no common task." },
  { name: "Team", def: "A common goal and interdependence. Everyone turns around the same target, linked to the next person." },
  { name: "Organization", def: "Common goals, coordination, roles, rules and continuity: a structure that outlasts its members." }
];
function viewHome(){
  const L = learnStats(), o = caseOverall(), nc = nextCase(), started = caseStat(nc).done > 0;
  return h("div", { class: "ov", html: `
  <section class="fhero swarm" aria-label="Fundamentals of Management and Organizations">
    <canvas aria-hidden="true"></canvas>
    <div class="fh-in">
      <p class="kicker">BBA1, semester 1 · 4 lectures, 5 tutorials</p>
      <h1 class="ov-title mg-title"><span class="clip sm">${words("Fundamentals of")}</span><span class="clip">${words("Management and")}</span><span class="clip">${words("Organizations")}</span></h1>
      <div class="forms" role="group" aria-label="From a crowd to an organization">${FORMS.map((f, i) => `<button type="button" data-form="${i}" aria-pressed="${i === 0}"><i>${i + 1}</i>${f.name}</button>`).join("")}</div>
      <p class="formdef" aria-live="polite"><b>${FORMS[0].name}.</b> ${FORMS[0].def}</p>
      <p class="lede">The course in short cards, cases to diagnose, scenes to spot, labs to play with, and every exam question from the slides with a model answer.</p>
      <div class="row"><a class="btn primary big" href="#learn">${L.known ? "Continue learning" : "Start with Learn"}</a><a class="btn glassy big" href="#case-${nc.id}">${started ? `Continue case ${nc.n}` : "Diagnose a case"}</a></div>
      ${L.known || o.steps ? `<div class="mystats" aria-label="Your progress"><div><b class="num">${L.known}/${L.total}</b><span>cards known</span></div><div><b class="num">${o.fin}/${CASES.length}</b><span>cases solved</span></div><div><b class="num">${Object.values(openState().ticks || {}).filter(t => t.length).length}</b><span>exam answers written</span></div></div>` : ""}
    </div>
  </section>
  <div class="page">
  ${modulesHtml()}
  <section class="exam mgexam" aria-label="How the course is graded">
    <div><h2>The written exam is 60%</h2><p>90 minutes, individual. The questions test both your understanding of the theories and your ability to apply them, from the lectures, the tutorials and the required readings.</p>
      <ul class="legend legend2"><li><i class="sw" style="background:var(--pri)"></i><b>60%</b>Written exam, 90 minutes</li><li><i class="sw" style="background:var(--c1)"></i><b>40%</b>Group presentation, session 9</li></ul></div>
    <div><div class="split" aria-hidden="true"><i style="width:60%;background:var(--pri)"></i><i style="width:40%;background:var(--c1)"></i></div>
      <ol class="mstep"><li><b>Define the problem</b><span>Desired outcome ≠ actual outcome. A cause or a solution is not a problem.</span></li><li><b>Identify the cause</b><span>Test several theories against the facts of the case.</span></li><li><b>Recommend</b><span>Each action linked to a theory, and why it should work.</span></li></ol></div>
  </section>
  <section class="sec" id="reviews" aria-label="Reviews"></section>
  ${creditHtml()}
  <footer class="foot"><span>Part of <a href="/">Nexus</a>, a student project to help with revision. Not an official EDHEC website.</span><span>Your progress is saved in this browser only.</span></footer>
  </div>` });
}

/* ---------- the signature: a crowd that becomes an organization (3D points, canvas 2D, no library) ----------
   Four formations taken from lecture 1. Crowd: everyone wanders alone. Group: clusters with links inside each.
   Team: one ring turning around a shared goal, each person linked to the next. Organization: a 3D hierarchy with
   roles (colours), reporting lines and a pulse that runs down the structure. The scene turns slowly in 3D, the
   pointer tilts it and pushes people aside; clicking the hero moves to the next formation. */
function mountSwarm(hero, o = {}){
  const cv = o.canvas || hero.querySelector("canvas"), ctx = cv.getContext("2d");
  const btns = o.mini ? [] : [...hero.querySelectorAll("[data-form]")], def = o.mini ? null : hero.querySelector(".formdef"), txt = o.mini ? null : hero.querySelector(".fh-in");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const N = o.N || (innerWidth < 821 ? 84 : 132), K = 5, DEPTS = 4, start = o.mode || 0;
  let W = 0, H = 0, dpr = 1, area = { cx: 0, cy: 0, R: 100 }, dark = true, col = {}, mode = start, since = 0, nextAuto = 5.4, auto = !reduce && !o.mini, hoverLock = false;
  let raf = 0, dead = false, onScreen = true, last = performance.now(), T = 0, slow = 0, frames = 0, low = false;
  const mouse = { x: -1e4, y: -1e4, nx: 0, ny: 0, tx: 0, ty: 0, in: false };
  const hx = s => { s = s.trim(); if (s.startsWith("#")) return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128]; };
  function readCols(){
    const cs = getComputedStyle(document.documentElement);
    dark = document.documentElement.dataset.theme !== "light";
    col = { fg: hx(cs.getPropertyValue("--fg")), muted: hx(cs.getPropertyValue("--faint")), pri: hx(cs.getPropertyValue("--pri")), c1: hx(cs.getPropertyValue("--c1")), c3: hx(cs.getPropertyValue("--c3")), c4: hx(cs.getPropertyValue("--c4")) };
    /* in the crowd, everyone keeps a hint of their own colour: individuals, not yet a structure */
    col.crowd = [col.pri, col.c1, col.c3, col.c4].map(c => c.map((v, k) => col.muted[k] + (v - col.muted[k]) * .55));
  }
  /* each person: 3D position, a home in the crowd, a cluster, a ring slot, a role in the hierarchy */
  const perDept = Math.ceil((N - 5) / DEPTS), ringN = 11;
  const P = Array.from({ length: N }, (_, i) => {
    const u = [RND(-1, 1), RND(-1, 1), RND(-1, 1)], ul = Math.hypot(...u) || 1;
    const m = i - 5, dept = i < 5 ? -1 : m % DEPTS, j = i < 5 ? 0 : Math.floor(m / DEPTS);
    return { i, x: RND(-1.4, 1.4), y: RND(-.9, .9), z: RND(-1, 1), hx: RND(-1.45, 1.45), hy: RND(-.85, .85), hz: RND(-1.05, 1.05),
      ph: Math.random() * 6.283, sp: RND(.6, 1.4), r: RND(.75, 1.25), cl: i % K, off: u.map(v => v / ul * RND(.06, .3)), d: Math.random() * .45,
      dept, lvl: i === 0 ? 0 : i < 5 ? 1 : 2, j, c: [140, 140, 150], ox: 0, oy: 0, sx: 0, sy: 0, s: 1, zz: 0 };
  });
  const clusters = Array.from({ length: K }, (_, k) => P.filter(p => p.cl === k));
  /* the four formations */
  function target(p, t){
    const i = p.i;
    if (mode === 0){ return [p.hx + .16 * Math.sin(t * .33 * p.sp + p.ph), p.hy + .11 * Math.sin(t * .27 * p.sp + p.ph * 1.7), p.hz + .16 * Math.cos(t * .29 * p.sp + p.ph)]; }
    if (mode === 1){
      const a = p.cl * 2 * Math.PI / K + .35, cx = Math.cos(a) * .92, cz = Math.sin(a) * .92, cy = Math.sin(p.cl * 1.9) * .34;
      const r = t * .35 + p.ph * .05, cr = Math.cos(r), sr = Math.sin(r), o = p.off;
      return [cx + o[0] * cr - o[2] * sr, cy + o[1] + .03 * Math.sin(t + p.ph), cz + o[0] * sr + o[2] * cr];
    }
    if (mode === 2){
      const th = i / N * 2 * Math.PI + t * .32, lane = i % 2 ? 1.04 : .9;
      return [Math.cos(th) * lane, .08 * Math.sin(th * 3 + t * .8), Math.sin(th) * lane];
    }
    /* organization: CEO, four managers, four departments stacked in rings under each manager */
    if (p.lvl === 0) return [0, -.85, 0];
    if (p.lvl === 1){ const a = (i - 1) * Math.PI / 2 + Math.PI / 4; return [Math.cos(a) * .62, -.25, Math.sin(a) * .62]; }
    const a = p.dept * Math.PI / 2 + Math.PI / 4, mx = Math.cos(a) * .9, mz = Math.sin(a) * .9, lv = Math.floor(p.j / ringN), q = p.j % ringN;
    const b = q / ringN * 2 * Math.PI + lv * .4 + t * .12;
    return [mx + Math.cos(b) * .24, .23 + lv * .21, mz + Math.sin(b) * .24];
  }
  function tcol(p){
    if (mode === 0) return o.vivid ? [col.pri, col.c1, col.c3, col.c4][p.i % 4] : col.crowd[p.i % 4];
    if (mode === 1) return [col.pri, col.c1, col.c3, col.c4, col.fg][p.cl];
    if (mode === 2) return col.pri;
    if (p.lvl === 0) return col.fg;
    if (p.lvl === 1) return col.c1;
    return [col.pri, col.c3, col.c4, col.c1][p.dept];
  }
  function size(){
    const r = hero.getBoundingClientRect();
    dpr = Math.min(low ? 1 : 2, devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    if (o.mini){ const n = W < 700; area = { cx: W * (n ? .5 : .58), cy: H * (n ? .46 : .5), R: Math.min(W * (n ? .3 : .27), H * .34) }; }
    else if (W < 821){
      const tb = txt ? txt.querySelector(".row") : null, top = tb ? tb.getBoundingClientRect().bottom - r.top + 20 : H * .55;
      const avail = Math.max(260, H - top);
      area = { cx: W / 2, cy: top + avail / 2, R: Math.min(W * .3, avail * .33) };
    } else area = { cx: W * .71, cy: H * .52, R: Math.min(W * .23, H * .33) };
  }
  function setMode(m, force){
    m = (m + 4) % 4; if (m === mode && !force) return;
    mode = m; since = T; nextAuto = T + 5.4;
    btns.forEach((b, i) => b.setAttribute("aria-pressed", String(i === mode)));
    if (def) def.innerHTML = `<b>${FORMS[mode].name}.</b> ${FORMS[mode].def}`;
    if (reduce){ P.forEach(p => { const tg = target(p, 0); p.x = tg[0]; p.y = tg[1]; p.z = tg[2]; p.c = tcol(p).slice(); }); draw(); }
  }
  /* projection: slow yaw, pointer tilts the scene */
  function project(p, yaw, pitch){
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), spp = Math.sin(pitch);
    const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
    const y2 = p.y * cp - z1 * spp, z2 = p.y * spp + z1 * cp, f = 3.2, s = f / (f + z2);
    p.s = s; p.zz = z2; p.sx = area.cx + x1 * s * area.R; p.sy = area.cy + y2 * s * area.R;
  }
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;
  function draw(){
    const yaw = reduce ? .5 : T * .11 + mouse.nx * .5, pitch = .38 + (reduce ? 0 : mouse.ny * .22);
    P.forEach(p => project(p, yaw, pitch));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const settle = reduce ? 1 : Math.min(1, Math.max(0, (T - since - .35) / 1.1));
    const X = p => p.sx + p.ox, Y = p => p.sy + p.oy, depthA = p => Math.min(1, Math.max(.15, (p.s - .72) / .5));
    ctx.lineCap = "round";
    if (dark) ctx.globalCompositeOperation = "lighter";
    /* links */
    if (settle > 0){
      if (mode === 0){
        /* passers-by: two people who come close exchange a glance, then move on */
        ctx.lineWidth = .8;
        for (let a = 0; a < N; a++){ const p = P[a]; for (let b = a + 1; b < N; b++){ const q = P[b], dx = p.x - q.x; if (dx > .27 || dx < -.27) continue; const d = Math.hypot(dx, p.y - q.y, p.z - q.z); if (d < .27){ ctx.strokeStyle = rgba(p.c, settle * .36 * (1 - d / .27) * depthA(p)); ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(q), Y(q)); ctx.stroke(); } } }
      } else if (mode === 1){
        ctx.lineWidth = 1;
        clusters.forEach(cl => { for (let a = 0; a < cl.length; a++) for (let b = a + 1; b < cl.length; b++){ const p = cl[a], q = cl[b], d = Math.hypot(p.x - q.x, p.y - q.y, p.z - q.z); if (d < .3){ ctx.strokeStyle = rgba(p.c, settle * .28 * (1 - d / .3) * depthA(p)); ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(q), Y(q)); ctx.stroke(); } } });
      } else if (mode === 2){
        ctx.lineWidth = 1.2;
        for (let i = 0; i < N; i++){ const p = P[i], q = P[(i + 2) % N]; ctx.strokeStyle = rgba(p.c, settle * .32 * depthA(p)); ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(q), Y(q)); ctx.stroke(); }
        const core = { x: 0, y: 0, z: 0 }; project(core, yaw, pitch);
        ctx.lineWidth = .8;
        for (let i = 0; i < N; i += 7){ const p = P[i]; ctx.strokeStyle = rgba(col.c3, settle * .12 * depthA(p)); ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(core.sx, core.sy); ctx.stroke(); }
        const pulse = 1 + .18 * Math.sin(T * 2.4);
        ctx.fillStyle = rgba(col.c3, settle * .18); ctx.beginPath(); ctx.arc(core.sx, core.sy, 26 * pulse, 0, 7); ctx.fill();
        ctx.fillStyle = rgba(col.c3, settle * .9); ctx.beginPath(); ctx.arc(core.sx, core.sy, 6.5, 0, 7); ctx.fill();
        ctx.strokeStyle = rgba(col.c3, settle * .6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(core.sx, core.sy, 13 * pulse, 0, 7); ctx.stroke();
      } else if (mode === 3){
        const ceo = P[0], wave = (T * .55) % 1.6;
        for (let k = 1; k < 5; k++){ const m = P[k]; ctx.lineWidth = 1.6; ctx.strokeStyle = rgba(col.c1, settle * .55 * depthA(m)); ctx.beginPath(); ctx.moveTo(X(ceo), Y(ceo)); ctx.lineTo(X(m), Y(m)); ctx.stroke(); }
        ctx.lineWidth = .9;
        for (let i = 5; i < N; i++){ const p = P[i], m = P[1 + p.dept], lv = Math.floor(p.j / ringN), hot = Math.max(0, 1 - Math.abs(wave - (.4 + lv * .3)) * 3);
          if (p.j % ringN === 0 || lv === 0){ ctx.strokeStyle = rgba(p.c, settle * (.16 + .5 * hot) * depthA(p)); ctx.beginPath(); ctx.moveTo(X(m), Y(m)); ctx.lineTo(X(p), Y(p)); ctx.stroke(); }
          const nb = P[i + DEPTS]; if (nb && nb.dept === p.dept && Math.floor(nb.j / ringN) === lv){ ctx.strokeStyle = rgba(p.c, settle * (.14 + .4 * hot) * depthA(p)); ctx.beginPath(); ctx.moveTo(X(p), Y(p)); ctx.lineTo(X(nb), Y(nb)); ctx.stroke(); } }
      }
    }
    /* people, far first */
    const order = P.slice().sort((a, b) => b.zz - a.zz);
    for (const p of order){
      const a = depthA(p), rad = (mode === 3 && p.lvl < 2 ? (p.lvl === 0 ? 6.4 : 4.8) : 2.6) * p.r * p.s;
      if (dark && !low){ ctx.fillStyle = rgba(p.c, .07 * a); ctx.beginPath(); ctx.arc(X(p), Y(p), rad * 3.4, 0, 7); ctx.fill(); }
      ctx.fillStyle = rgba(p.c, (dark ? .55 : .7) * a + .2); ctx.beginPath(); ctx.arc(X(p), Y(p), rad, 0, 7); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }
  function step(now){
    raf = 0; if (dead) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
    frames++; if (dt > .034) slow++; if (frames === 90){ if (slow > 45 && !low){ low = true; size(); } frames = 0; slow = 0; }
    if (auto && !hoverLock && T > nextAuto) setMode(mode + 1);
    mouse.nx += (mouse.tx - mouse.nx) * .05; mouse.ny += (mouse.ty - mouse.ny) * .05;
    const k = 1 - Math.pow(1 - .055, dt * 60), kc = 1 - Math.pow(1 - .05, dt * 60), el = T - since;
    for (const p of P){
      if (el > p.d){ const tg = target(p, T); p.x += (tg[0] - p.x) * k; p.y += (tg[1] - p.y) * k; p.z += (tg[2] - p.z) * k; }
      const tc = tcol(p); p.c[0] += (tc[0] - p.c[0]) * kc; p.c[1] += (tc[1] - p.c[1]) * kc; p.c[2] += (tc[2] - p.c[2]) * kc;
      if (mouse.in){ const dx = p.sx + p.ox - mouse.x, dy = p.sy + p.oy - mouse.y, d = Math.hypot(dx, dy); if (d < 120 && d > .01){ const f = (120 - d) / 120; p.ox += dx / d * f * 3.2; p.oy += dy / d * f * 3.2; } }
      p.ox *= .9; p.oy *= .9;
    }
    draw();
    if (onScreen && !document.hidden) raf = requestAnimationFrame(step);
  }
  const kick = () => { if (!raf && !dead && !reduce && onScreen && !document.hidden){ last = performance.now(); raf = requestAnimationFrame(step); } };
  const onLeave = () => { mouse.in = false; mouse.x = mouse.y = -1e4; mouse.tx = mouse.ty = 0; };
  const onMove = e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (o.mini && (mouse.y > H + 40 || mouse.y < -40)){ onLeave(); return; } mouse.in = e.pointerType === "mouse"; mouse.tx = (mouse.x / W - .5) * 2; mouse.ty = (mouse.y / H - .5) * 2; };
  const onClick = e => { if (e.target.closest("a,button,input,textarea")) return; auto = false; setMode(mode + 1); };
  const moveHost = o.mini ? window : hero;
  moveHost.addEventListener("pointermove", onMove, { passive: true }); if (!o.mini){ hero.addEventListener("pointerleave", onLeave); hero.addEventListener("click", onClick); }
  btns.forEach((b, i) => {
    b.addEventListener("click", () => { auto = false; setMode(i); });
    b.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse") return; hoverLock = true; setMode(i); });
    b.addEventListener("pointerleave", () => { hoverLock = false; nextAuto = T + 5.4; });
  });
  const io = new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) kick(); }); io.observe(hero);
  const onVis = () => { if (!document.hidden) kick(); }; document.addEventListener("visibilitychange", onVis);
  const onResize = () => { size(); if (reduce) draw(); }; addEventListener("resize", onResize);
  const onTheme = () => { readCols(); if (reduce){ P.forEach(p => p.c = tcol(p).slice()); draw(); } }; addEventListener("nexus-theme", onTheme);
  readCols(); size();
  P.forEach(p => { p.c = tcol(p).slice(); });
  if (reduce) setMode(o.mini ? start : 3, true); else kick();
  return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); removeEventListener("resize", onResize); removeEventListener("nexus-theme", onTheme); if (o.mini) window.removeEventListener("pointermove", onMove); };
}
