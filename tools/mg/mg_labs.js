/* =====================================================================
   LABS: Kelley trainer (generated scenes), equity calculator (generated numbers, answers computed),
   the Big Five test used in class (scores computed with your answers), who said what.
   ===================================================================== */
const LABS = [
  { id: "kelley", title: "Person or situation?", sub: "Kelley's attribution trainer", what: "A new scene every time. Read the clues, rate distinctiveness, consensus and consistency, then decide: internal or external cause.", c: "var(--c3)", ch: "decide" },
  { id: "equity", title: "Is it fair?", sub: "Equity calculator", what: "Two colleagues, their pay and their hours. Compute each outcomes-to-inputs ratio, judge the equity, name the reaction.", c: "var(--c4)", ch: "motiv" },
  { id: "bigfive", title: "Your Big Five", sub: "The 10-item test from lecture 2", what: "Rate yourself, see each score computed with your own answers, and what high and low mean at work.", c: "var(--pri)", ch: "person" },
  { id: "who", title: "Who said what?", sub: "Authors and their ideas", what: "Match each author with their idea, against the clock. Six pairs a round.", c: "var(--c1)", ch: "org" }
];
const labMark = id => { const l = MS.get("labs", {}); if (!l[id]){ l[id] = 1; MS.set("labs", l); } };
const LAB_ART = {
  kelley: '<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 20h40l20 12v28H50L30 48z" opacity=".35"/><path d="M30 20v28M70 20v28l20 12M30 48h40"/><circle cx="30" cy="20" r="4" fill="currentColor"/><circle cx="70" cy="48" r="4" fill="currentColor"/><circle cx="90" cy="60" r="4" fill="currentColor"/></svg>',
  equity: '<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M60 12v58M36 70h48M22 26h76"/><path d="M22 26 12 48h20zM98 26l-10 22h20z"/><path d="M12 48a10 6 0 0 0 20 0M88 48a10 6 0 0 0 20 0"/><circle cx="60" cy="12" r="4" fill="currentColor"/></svg>',
  bigfive: '<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M60 8 98 36 84 74H36L22 36z" opacity=".35"/><path d="M60 22 84 38 76 64H46L38 40z" fill="currentColor" fill-opacity=".18"/><path d="M60 8v32M98 36 60 40M84 74 60 40M36 74l24-34M22 36l38 4" opacity=".5"/></svg>',
  who: '<svg viewBox="0 0 120 80" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="10" y="10" width="34" height="14" rx="5"/><rect x="10" y="33" width="34" height="14" rx="5"/><rect x="10" y="56" width="34" height="14" rx="5"/><rect x="76" y="10" width="34" height="14" rx="5"/><rect x="76" y="33" width="34" height="14" rx="5"/><rect x="76" y="56" width="34" height="14" rx="5"/><path d="M44 17c16 0 16 46 32 46M44 40h32M44 63c16 0 16-46 32-46" opacity=".6"/></svg>'
};
function viewLabs(){
  const done = MS.get("labs", {});
  return h("div", { class: "mod", html: `
  ${mhead("Management and Organizations", "Labs", "Four interactive tools built on the models of the course. Scenes and numbers are generated, so you never run out of practice.")}
  <div class="labgrid">${LABS.map(l => `<a class="labt" href="#lab-${l.id}" style="--c:${l.c}"><span class="lart">${LAB_ART[l.id]}</span><span class="lsub">${l.sub}</span><b>${l.title}</b><span class="lwhat">${l.what}</span><span class="lgo">${done[l.id] ? "Open again" : "Open"} ${ICO.arrow}</span></a>`).join("")}</div>
  ${creditHtml()}` });
}
function labShell(id, lede, body){
  const L = LABS.find(l => l.id === id);
  return h("div", { class: "mod labpage", style: `--c:${L.c}`, html: `<a class="tocback" href="#labs">${ICO.back}All labs</a>${mhead(L.sub, L.title, lede)}${body}` });
}

/* ---------- Kelley ---------- */
const KEL_NAMES = ["Inès", "Hugo", "Léa", "Karim", "Chloé", "Tom", "Yasmine", "Lucas", "Nora", "Mathis", "Sofia", "Adam"];
const KEL = [
  { ev: "{N}, a sales rep, missed the monthly target.", d: ["{N}'s client reports and follow-ups are still excellent.", "{N} is also behind on reports and internal deadlines."], c: ["Most of the sales team missed the target this month.", "Everyone else in the team hit the target."], s: ["{N} has missed the target almost every month this year.", "{N} had hit the target every month for two years."] },
  { ev: "{N} arrived late to the Monday team meeting.", d: ["{N} is on time for every other meeting and client call.", "{N} is late to most meetings, whatever the day."], c: ["Half the team arrived late as well.", "Everyone else was on time."], s: ["{N} has been late to this meeting nearly every week.", "This is the first time in a year that {N} is late to it."] },
  { ev: "A customer complained about {N}'s service at the restaurant.", d: ["Customers on {N}'s other shifts leave glowing reviews.", "{N} gets complaints on almost every shift."], c: ["This customer complained about every waiter that evening.", "This customer praised all the other waiters."], s: ["{N} gets complaints in this section of the room every week.", "{N} has worked this section for months without a complaint."] },
  { ev: "{N} failed the statistics midterm.", d: ["{N} got good grades in every other course.", "{N} also failed most of the other midterms."], c: ["Most of the class failed this midterm.", "Almost everyone else passed it comfortably."], s: ["{N} has failed every statistics test so far.", "{N} passed all the previous statistics tests."] },
  { ev: "The feature {N} released this week crashed for customers.", d: ["{N}'s other recent releases worked perfectly.", "{N}'s other releases also needed urgent fixes."], c: ["Most developers' releases had bugs this week.", "No other developer had a problem this week."], s: ["{N}'s releases on this product have crashed almost every sprint.", "{N}'s releases on this product had never crashed before."] },
  { ev: "{N}'s client gave outstanding feedback on the last project.", d: ["On {N}'s other projects, client feedback is ordinary.", "{N} gets outstanding feedback on almost every project."], c: ["This client gives outstanding feedback to every consultant.", "This client is known to be harsh with every other consultant."], s: ["This client has praised {N} on every project they did together.", "This client had never praised {N} before."] },
  { ev: "{N} lost their temper with a supplier on the phone.", d: ["{N} is calm and polite with colleagues and other suppliers.", "{N} often gets angry with colleagues and other suppliers too."], c: ["Most buyers who deal with this supplier end up arguing with them.", "Other buyers find this supplier easy to work with."], s: ["{N} argues with this supplier on almost every call.", "{N} had always been calm with this supplier before."] },
  { ev: "{N} skipped the compliance training session.", d: ["{N} attends every other training and team event.", "{N} skips most trainings and team events."], c: ["Most of the team skipped this session too.", "Everyone else attended."], s: ["{N} has skipped this training every time it was scheduled.", "{N} had attended this training every time before."] }
];
function makeKelley(prevKey){
  let t, n, ext, key;
  do { t = Math.floor(Math.random() * KEL.length); n = PICK(KEL_NAMES); ext = Math.random() < .5; key = t + (ext ? "e" : "i"); } while (key === prevKey);
  const T = KEL[t], f = s => s.replace(/\{N\}/g, n);
  /* external: high distinctiveness, high consensus, low consistency. internal: the opposite. */
  const v = ext ? { d: "H", c: "H", s: "L" } : { d: "L", c: "L", s: "H" };
  const cues = shuffle([["d", f(T.d[ext ? 0 : 1])], ["c", f(T.c[ext ? 0 : 1])], ["s", f(T.s[ext ? 1 : 0])]]);
  return { key, ev: f(T.ev), cues, v, ext, name: n };
}
const KDIM = { d: ["Distinctiveness", "Does the person behave differently in other situations?"], c: ["Consensus", "Do other people behave the same way in this situation?"], s: ["Consistency", "Does the person always act this way in this situation?"] };
function labKelley(){
  labMark("kelley");
  const root = labShell("kelley", "Read the scene and the three clues. Rate each dimension high or low, then decide whether the cause is the person (internal) or the situation (external). Every scene is generated.",
    `<div class="drillstats"><div><b data-s="streak">0</b><span>streak</span></div><div><b data-s="score">0/0</b><span>this session</span></div><div><b data-s="best">${MS.get("kel", { best: 0 }).best}</b><span>best streak</span></div><div><b data-s="all">${MS.get("kel", { n: 0 }).n || 0}</b><span>scenes done</span></div></div>
    <article class="dq kel"></article>
    <div class="kelrule"><div><b>External</b><span>High distinctiveness · high consensus · low consistency</span></div><div><b>Internal</b><span>Low distinctiveness · low consensus · high consistency</span></div></div>`);
  const box = root.querySelector(".kel"), S = k => root.querySelector(`[data-s="${k}"]`);
  let cur = null, streak = 0, ok = 0, tot = 0, ans = {};
  const stats = () => { const s = MS.get("kel", { best: 0, n: 0 }); S("streak").textContent = streak; S("score").textContent = `${ok}/${tot}`; S("best").textContent = s.best || 0; S("all").textContent = s.n || 0; };
  function next(){
    cur = makeKelley(cur && cur.key); ans = {};
    box.classList.remove("ok", "bad");
    box.innerHTML = `<p class="kev">${cur.ev}</p><ul class="kcues">${cur.cues.map(([k, t]) => `<li data-cue="${k}">${t}</li>`).join("")}</ul>
      <div class="kgrid">${["d", "c", "s"].map(k => `<div class="krow"><div><b>${KDIM[k][0]}</b><span>${KDIM[k][1]}</span></div><div class="seg" role="group" aria-label="${KDIM[k][0]}"><button type="button" data-k="${k}" data-v="H" aria-pressed="false">High</button><button type="button" data-k="${k}" data-v="L" aria-pressed="false">Low</button></div></div>`).join("")}
      <div class="krow kfinal"><div><b>So the cause is…</b><span>The person, or the situation?</span></div><div class="seg" role="group" aria-label="Attribution"><button type="button" data-k="a" data-v="int" aria-pressed="false">Internal</button><button type="button" data-k="a" data-v="ext" aria-pressed="false">External</button></div></div></div>
      <div class="row"><button class="check" type="button" data-kcheck>Check</button><span class="muted small" data-kmsg></span></div><div class="dout"></div>`;
  }
  function check(){
    if (["d", "c", "s", "a"].some(k => !ans[k])){ box.querySelector("[data-kmsg]").textContent = "Answer the four questions first."; return; }
    const res = { d: ans.d === cur.v.d, c: ans.c === cur.v.c, s: ans.s === cur.v.s, a: (ans.a === "ext") === cur.ext };
    const good = res.d && res.c && res.s && res.a;
    tot++; if (good){ ok++; streak++; } else streak = 0;
    const st = MS.get("kel", { best: 0, n: 0 }); st.n = (st.n || 0) + 1; if (streak > (st.best || 0)) st.best = streak; MS.set("kel", st); stats(); if (tot === 8) nudgeReview("lab");
    box.querySelectorAll("[data-k]").forEach(b => { b.disabled = true; const k = b.dataset.k, right = k === "a" ? (cur.ext ? "ext" : "int") : cur.v[k]; if (b.dataset.v === right) b.classList.add("right"); else if (b.getAttribute("aria-pressed") === "true") b.classList.add("wrong"); });
    box.querySelectorAll("[data-cue]").forEach(li => { const k = li.dataset.cue; li.insertAdjacentHTML("afterbegin", `<em class="${cur.v[k] === "H" ? "hi" : "lo"}">${KDIM[k][0]}: ${cur.v[k] === "H" ? "high" : "low"}</em>`); });
    if (good){ burst(box.querySelector('[data-k="a"].right')); bump(S("streak")); }
    box.querySelector("[data-kcheck]").remove(); box.querySelector("[data-kmsg]").remove();
    box.classList.add(good ? "ok" : "bad");
    box.querySelector(".dout").innerHTML = `<div class="verdict ${good ? "ok" : "bad"}"><div class="vh"><b>${good ? "Correct" : "Not quite"}</b><span>${cur.ext ? "External attribution: the situation." : "Internal attribution: the person."}</span></div>
      <p>${cur.ext ? "High distinctiveness, high consensus and low consistency point to the situation. A manager should look at the task, the market or the resources before judging the person (blaming the person here would be the fundamental attribution error)." : "Low distinctiveness, low consensus and high consistency point to the person: their effort, skills or habits. The manager should address it with them directly, with feedback, support or training."}</p></div>
      <button class="btn quiet small next" type="button" data-knext>Next scene ${ICO.arrow}<kbd>Enter</kbd></button>`;
    box.querySelector("[data-knext]").focus({ preventScroll: true });
  }
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-k]");
    if (b && !b.disabled){ ans[b.dataset.k] = b.dataset.v; box.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach(x => x.setAttribute("aria-pressed", String(x === b))); const m = box.querySelector("[data-kmsg]"); if (m) m.textContent = ""; }
    if (e.target.closest("[data-kcheck]")) check();
    if (e.target.closest("[data-knext]")) next();
  });
  const onKey = e => { if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; } if (e.key === "Enter" && box.querySelector("[data-knext]")){ e.preventDefault(); next(); } };
  document.addEventListener("keydown", onKey);
  next(); stats();
  return root;
}

/* ---------- Equity ---------- */
const EQ_PAIRS = [["Lina", "Tom"], ["Sami", "Emma"], ["Jade", "Noah"], ["Rayan", "Clara"], ["Maëlle", "Enzo"], ["Ilyes", "Manon"]];
const EQ_UNDER = [["I'll just do the minimum from now on.", "Change inputs"], ["I'm going to ask for a raise.", "Change outcomes"], ["Maybe I'm not as fast as I thought; my pay is fair after all.", "Distort perceptions of self"], ["Their job looks easy, but it's more stressful than mine.", "Distort perceptions of others"], ["At least I earn more than my friends from school.", "Choose a different referent"], ["I've started applying elsewhere.", "Leave the field"]];
const EQ_OVER = [["I'll put in extra hours to deserve this.", "Change inputs"], ["My experience must be worth more than I thought.", "Distort perceptions of self"], ["Their job must be easier than it looks.", "Distort perceptions of others"]];
const EQ_ACTS = ["Change inputs", "Change outcomes", "Distort perceptions of self", "Distort perceptions of others", "Choose a different referent", "Leave the field"];
function makeEquity(){
  const [me, ref] = PICK(EQ_PAIRS), HRS = [32, 35, 37, 39, 40, 42, 45];
  const h1 = PICK(HRS), h2 = PICK(HRS), pay2 = RI(48, 84) * 50, r2x = pay2 / h2;
  const d = PICK([-.24, -.16, -.11, -.07, 0, 0, 0, .07, .12, .2]);
  const pay1 = Math.round(r2x * (1 + d) * h1 / 10) * 10;
  const r1 = pay1 / h1, r2 = pay2 / h2, diff = (r1 - r2) / r2;
  const state = Math.abs(diff) < .02 ? "eq" : diff < 0 ? "under" : "over";
  const quote = state === "under" ? PICK(EQ_UNDER) : state === "over" ? PICK(EQ_OVER) : null;
  return { me, ref, h1, h2, pay1, pay2, r1, r2, diff, state, quote };
}
function labEquity(){
  labMark("equity");
  const root = labShell("equity", "Equity theory compares outcomes divided by inputs. Here the outcome is the monthly pay and the input is the weekly hours. Real inputs also include effort, skill and experience; real outcomes include recognition and flexibility.",
    `<div class="drillstats"><div><b data-s="score">0/0</b><span>this session</span></div><div><b data-s="all">${MS.get("eqlab", { n: 0 }).n}</b><span>cases done</span></div></div><article class="dq eqlab"></article>`);
  const box = root.querySelector(".eqlab"), S = k => root.querySelector(`[data-s="${k}"]`);
  let E = null, ok = 0, tot = 0, stage = 0;
  const stats = () => { S("score").textContent = `${ok}/${tot}`; S("all").textContent = MS.get("eqlab", { n: 0 }).n; };
  const per = (p, hh) => `€${fmt(p / hh, 2)}`;
  function next(){
    E = makeEquity(); stage = 0; box.classList.remove("ok", "bad");
    box.innerHTML = `<div class="eqcards"><div class="eqc"><span class="eqn">${E.me}</span><dl><dt>Pay</dt><dd>€${fmt(E.pay1)} / month</dd><dt>Hours</dt><dd>${E.h1} h / week</dd></dl></div><span class="eqvs">vs</span><div class="eqc ref"><span class="eqn">${E.ref} <small>the referent</small></span><dl><dt>Pay</dt><dd>€${fmt(E.pay2)} / month</dd><dt>Hours</dt><dd>${E.h2} h / week</dd></dl></div></div>
      <div class="eqsteps">
        <div class="eqstep" data-st="0"><p class="dqt">What is ${E.me}'s ratio, in € of monthly pay per weekly hour? Two decimals.</p><div class="ans"><label class="field"><input inputmode="decimal" autocomplete="off" aria-label="${E.me}'s ratio"><span class="unit">€ / h</span></label><button class="check" type="button" data-eqnum="r1">Check</button></div><div class="eqo"></div></div>
        <div class="eqstep" data-st="1" hidden><p class="dqt">And ${E.ref}'s ratio?</p><div class="ans"><label class="field"><input inputmode="decimal" autocomplete="off" aria-label="${E.ref}'s ratio"><span class="unit">€ / h</span></label><button class="check" type="button" data-eqnum="r2">Check</button></div><div class="eqo"></div></div>
        <div class="eqstep" data-st="2" hidden><p class="dqt">Compared with ${E.ref}, ${E.me} is…</p><div class="opts">${[["under", "under-rewarded"], ["eq", "treated equitably"], ["over", "over-rewarded"]].map(([k, t], j) => `<button class="opt" type="button" data-eqv="${k}"><span class="k">${"ABC"[j]}</span><span>${t}</span></button>`).join("")}</div><div class="eqo"></div></div>
        <div class="eqstep" data-st="3" hidden></div>
      </div>`;
    box.querySelector("input").focus({ preventScroll: true });
  }
  function done(good, el, html){ el.innerHTML = `<div class="verdict ${good ? "ok" : "bad"}">${html}</div>`; }
  function finish(){
    tot++; const st = MS.get("eqlab", { n: 0 }); st.n++; MS.set("eqlab", st); if (tot === 6) nudgeReview("lab");
    const allOk = !box.querySelector(".eqo .verdict.bad");
    if (allOk) ok++; stats();
    box.classList.add(allOk ? "ok" : "bad");
    box.insertAdjacentHTML("beforeend", `<button class="btn quiet small next" type="button" data-eqnext>New case ${ICO.arrow}<kbd>Enter</kbd></button>`);
    box.querySelector("[data-eqnext]").focus({ preventScroll: true });
  }
  box.addEventListener("click", e => {
    const nb = e.target.closest("[data-eqnum]");
    if (nb){
      const stepEl = nb.closest(".eqstep"), inp = stepEl.querySelector("input"), v = parseNum(inp.value); if (Number.isNaN(v)){ inp.focus(); return; }
      const isMe = nb.dataset.eqnum === "r1", target = isMe ? E.r1 : E.r2, good = Math.abs(v - target) <= .06;
      if (good) burst(inp);
      inp.disabled = true; nb.remove();
      done(good, stepEl.querySelector(".eqo"), `<div class="vh"><b>${good ? "Correct" : "Not quite"}</b>${good ? "" : `<span>The ratio is <span class="exp">€${fmt(target, 2)}</span></span>`}</div><div class="calc">${isMe ? `€${fmt(E.pay1)} / ${E.h1} h = ${per(E.pay1, E.h1)} per weekly hour` : `€${fmt(E.pay2)} / ${E.h2} h = ${per(E.pay2, E.h2)} per weekly hour`}</div>`);
      const nx = box.querySelector(`[data-st="${isMe ? 1 : 2}"]`); nx.hidden = false; const ni = nx.querySelector("input"); if (ni) ni.focus({ preventScroll: true }); else nx.querySelector(".opt").focus({ preventScroll: true });
    }
    const vb = e.target.closest("[data-eqv]");
    if (vb && !vb.disabled){
      const stepEl = vb.closest(".eqstep"), good = vb.dataset.eqv === E.state; if (good) burst(vb);
      stepEl.querySelectorAll(".opt").forEach(b => { b.disabled = true; if (b.dataset.eqv === E.state) b.classList.add("right"); else if (b === vb) b.classList.add("wrong"); });
      const pct = Math.abs(E.diff * 100);
      done(good, stepEl.querySelector(".eqo"), `<div class="vh"><b>${good ? "Correct" : "Not quite"}</b></div><div class="calc">(${per(E.pay1, E.h1)} − ${per(E.pay2, E.h2)}) / ${per(E.pay2, E.h2)} = ${E.diff < 0 ? "−" : "+"}${fmt(pct, 1)}%</div><p>${E.state === "eq" ? "The ratios are within 2% of each other: no real gap, so no tension to reduce." : E.state === "under" ? `${E.me} gets less per unit of input than ${E.ref}: perceived inequity creates tension that ${E.me} will try to reduce.` : `${E.me} gets more per unit of input than ${E.ref}. Over-reward also creates tension (often guilt), usually weaker.`}</p>`);
      const s3 = box.querySelector('[data-st="3"]');
      if (E.quote){
        const opts = E.state === "under" ? shuffle(EQ_ACTS.filter(a => a !== E.quote[1])).slice(0, 3).concat(E.quote[1]) : ["Change inputs", "Distort perceptions of self", "Distort perceptions of others", "Leave the field"];
        const o = shuffle(opts);
        s3.hidden = false; s3.innerHTML = `<p class="dqt">${E.me} says: “${E.quote[0]}” How is ${E.me} restoring equity?</p><div class="opts">${o.map((t, j) => `<button class="opt" type="button" data-eqr="${esc(t)}"><span class="k">${"ABCD"[j]}</span><span>${t}</span></button>`).join("")}</div><div class="eqo"></div>`;
      } else finish();
    }
    const rb = e.target.closest("[data-eqr]");
    if (rb && !rb.disabled){
      const stepEl = rb.closest(".eqstep"), good = rb.dataset.eqr === E.quote[1]; if (good) burst(rb);
      stepEl.querySelectorAll(".opt").forEach(b => { b.disabled = true; if (b.dataset.eqr === E.quote[1]) b.classList.add("right"); else if (b === rb) b.classList.add("wrong"); });
      done(good, stepEl.querySelector(".eqo"), `<div class="vh"><b>${good ? "Correct" : "Not quite"}</b><span>${E.quote[1]}.</span></div><p>The six ways: change inputs, change outcomes, distort perceptions of self, distort perceptions of others, choose a different referent, leave the field.</p>`);
      finish();
    }
    if (e.target.closest("[data-eqnext]")) next();
  });
  box.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.matches("input")){ e.preventDefault(); const b = e.target.closest(".eqstep").querySelector("[data-eqnum]"); if (b) b.click(); } });
  const onKey = e => { if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; } if (e.key === "Enter" && !e.target.matches("input") && box.querySelector("[data-eqnext]")){ e.preventDefault(); next(); } };
  document.addEventListener("keydown", onKey);
  next(); stats();
  return root;
}

/* ---------- Big Five ---------- */
const B5_ITEMS = ["Extraverted, enthusiastic", "Critical, quarrelsome", "Dependable, self-disciplined", "Anxious, easily upset", "Open to new experiences, complex", "Reserved, quiet", "Sympathetic, warm", "Disorganized, careless", "Calm, emotionally stable", "Conventional, uncreative"];
const B5_SCALE = ["Disagree strongly", "Disagree moderately", "Disagree a little", "Neither agree nor disagree", "Agree a little", "Agree moderately", "Agree strongly"];
const B5_TRAITS = [
  { k: "E", name: "Extraversion", a: 1, b: 6, rev: "b", q: "How much social interaction and stimulation do I seek?", hi: "Sociable, energetic, assertive, comfortable taking the lead. Risk: may dominate conversations, talk more than listen, act impulsively.", lo: "Reflective, comfortable working alone, often a good listener. Risk: less visible in groups, may seem less involved even when you are not." },
  { k: "A", name: "Agreeableness", a: 2, b: 7, rev: "a", q: "How cooperative and considerate am I toward others?", hi: "Cooperative, empathetic, supportive. Risk: difficulty making tough decisions, setting boundaries or confronting others.", lo: "Assertive, competitive, willing to challenge ideas. Risk: seen as less considerate, more prone to conflict." },
  { k: "C", name: "Conscientiousness", a: 3, b: 8, rev: "b", q: "How organized, disciplined and goal-oriented am I?", hi: "Disciplined, reliable, hard-working: the best predictor of job performance. Risk: rigid, perfectionistic, reluctant to deviate from plans.", lo: "Spontaneous, flexible, less perfectionistic. Risk: disorganized, inconsistent, prone to procrastination." },
  { k: "S", name: "Emotional stability", a: 4, b: 9, rev: "a", q: "How emotionally reactive and stress-resilient am I?", hi: "Calm under pressure, resilient, not easily overwhelmed. Risk: may be less vigilant about potential problems.", lo: "More sensitive to potential problems or threats. Risk: more prone to anxiety, stress and emotional distress." },
  { k: "O", name: "Openness to experience", a: 5, b: 10, rev: "b", q: "How open am I to new ideas and experiences?", hi: "Creative, curious, eager to learn. Risk: bored by routine, may favor novelty over practicality or keep exploring when a quick decision is needed.", lo: "Practical, conventional, comfortable with routine. Risk: may resist change or unfamiliar ideas." }
];
function labBigFive(){
  labMark("bigfive");
  const saved = MS.get("big5", {}), A = Object.assign({}, saved.a || {});
  const root = labShell("bigfive", "The short test used in lecture 2. Rate how well each pair of traits describes you, from 1 (disagree strongly) to 7 (agree strongly), even if one word fits better than the other. For self-reflection only: it is not a selection tool.",
    `<div class="b5wrap"><ol class="b5items">${B5_ITEMS.map((t, i) => `<li class="b5item" data-q="${i + 1}"><span class="b5n">${i + 1}</span><span class="b5t">I see myself as <b>${t}</b>${[2, 4, 6, 8, 10].includes(i + 1) ? `<em title="Reverse-scored">R</em>` : ""}</span><span class="b5scale" role="radiogroup" aria-label="Item ${i + 1}">${B5_SCALE.map((s, v) => `<button type="button" role="radio" data-v="${v + 1}" aria-checked="${A[i + 1] === v + 1}" title="${s}">${v + 1}</button>`).join("")}</span></li>`).join("")}</ol>
      <div class="b5legend"><span>1 = disagree strongly</span><span>4 = neither</span><span>7 = agree strongly</span></div>
      <div class="row"><span class="muted" data-b5count></span><button class="btn quiet small" type="button" data-b5reset>Clear my answers</button></div></div>
    <section class="b5res" aria-live="polite"></section>
    <section class="b5warn"><h2>Read your result like a manager would</h2><ul><li><b>Traits are tendencies, not guarantees.</b> Trait Activation Theory: the situation decides which traits come out.</li><li><b>Self-reports can be biased.</b> Social desirability: we answer in the way that looks good.</li><li><b>Higher is not always better.</b> Each end has strengths and risks; in sales, ambiverts sell best.</li><li><b>Never the sole basis for a decision.</b> Complement with references, interviews and observation.</li></ul></section>`);
  const res = root.querySelector(".b5res");
  const R = v => 8 - v;
  function paint(){
    const n = Object.keys(A).length;
    root.querySelector("[data-b5count]").textContent = `${n} of 10 answered`;
    if (n < 10){ res.innerHTML = n ? `<p class="muted">Answer all ten items to see your scores.</p>` : ""; return; }
    res.innerHTML = `<h2>Your scores</h2><div class="b5bars">${B5_TRAITS.map(t => {
      const qa = A[t.a], qb = A[t.b], va = t.rev === "a" ? R(qa) : qa, vb = t.rev === "b" ? R(qb) : qb, sc = (va + vb) / 2;
      const side = sc >= 5 ? "hi" : sc <= 3 ? "lo" : "mid";
      const calc = `(${t.rev === "a" ? `Q${t.a}R = 8 − ${qa} = ${va}` : `Q${t.a} = ${qa}`} + ${t.rev === "b" ? `Q${t.b}R = 8 − ${qb} = ${vb}` : `Q${t.b} = ${qb}`}) / 2 = ${fmt(sc, 1)}`;
      return `<article class="b5bar" style="--p:${(sc - 1) / 6}"><div class="b5h"><b>${t.name}</b><span class="num">${fmt(sc, 1)}</span></div><p class="muted small">${t.q}</p>
        <div class="b5track" aria-hidden="true"><i></i><span>1</span><span>4</span><span>7</span></div><div class="calc">${calc}</div>
        <p>${side === "hi" ? `<b>High side.</b> ${t.hi}` : side === "lo" ? `<b>Low side.</b> ${t.lo}` : `<b>Middle.</b> You sit between the two poles. High: ${t.hi.split(". Risk")[0]}. Low: ${t.lo.split(". Risk")[0]}.`}</p></article>`; }).join("")}</div>`;
  }
  root.addEventListener("click", e => {
    const b = e.target.closest(".b5scale [data-v]");
    if (b){ const q = +b.closest(".b5item").dataset.q; A[q] = +b.dataset.v; b.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-checked", String(x === b))); MS.set("big5", { a: A }); paint();
      const nx = root.querySelector(`.b5item[data-q="${q + 1}"]`); if (nx && !A[q + 1] && matchMedia("(min-width: 700px)").matches) nx.scrollIntoView({ behavior: "smooth", block: "nearest" }); if (Object.keys(A).length === 10 && q === 10) res.scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (e.target.closest("[data-b5reset]")){ Object.keys(A).forEach(k => delete A[k]); MS.set("big5", {}); root.querySelectorAll(".b5scale button").forEach(x => x.setAttribute("aria-checked", "false")); paint(); }
  });
  paint();
  return root;
}

/* ---------- Who said what ---------- */
function labWho(){
  labMark("who");
  const root = labShell("who", "Pick an author on the left, then their idea on the right. Six pairs per round; mistakes and time are counted.",
    `<div class="drillstats"><div><b data-s="time">0.0 s</b><span>time</span></div><div><b data-s="miss">0</b><span>mistakes</span></div><div><b data-s="best">${(MS.get("who", {}).best || 0) ? fmt(MS.get("who", {}).best, 1) + " s" : "–"}</b><span>best clean round</span></div></div><div class="who"></div>`);
  const W = root.querySelector(".who"), S = k => root.querySelector(`[data-s="${k}"]`);
  let pairs = [], selA = null, t0 = 0, raf = 0, miss = 0, found = 0;
  function round(){
    pairs = shuffle(WHO).slice(0, 6); selA = null; t0 = 0; miss = 0; found = 0; cancelAnimationFrame(raf); S("time").textContent = "0.0 s"; S("miss").textContent = "0";
    const right = shuffle(pairs.map((p, i) => i));
    W.innerHTML = `<div class="wcol">${pairs.map((p, i) => `<button class="wtile" type="button" data-wa="${i}">${p[0]}</button>`).join("")}</div><div class="wcol">${right.map(i => `<button class="wtile idea" type="button" data-wb="${i}">${pairs[i][1]}</button>`).join("")}</div>`;
  }
  const tick = () => { if (!root.isConnected) return; S("time").textContent = fmt((performance.now() - t0) / 1000, 1) + " s"; raf = requestAnimationFrame(tick); };
  W.addEventListener("click", e => {
    const a = e.target.closest("[data-wa]"), b = e.target.closest("[data-wb]");
    if (!t0 && (a || b)){ t0 = performance.now(); raf = requestAnimationFrame(tick); }
    if (a && !a.disabled){ W.querySelectorAll("[data-wa]").forEach(x => x.classList.toggle("on", x === a)); selA = +a.dataset.wa; }
    if (b && !b.disabled){
      if (selA == null){ b.classList.add("shake"); setTimeout(() => b.classList.remove("shake"), 400); return; }
      const ta = W.querySelector(`[data-wa="${selA}"]`);
      if (+b.dataset.wb === selA){ burst(b, ["--ok", "--pri", "--c1"]); ta.disabled = b.disabled = true; ta.classList.remove("on"); ta.classList.add("done"); b.classList.add("done"); found++; selA = null;
        if (found === pairs.length){ cancelAnimationFrame(raf); const t = (performance.now() - t0) / 1000, st = MS.get("who", {}); const rec = !miss && (!st.best || t < st.best); if (rec){ st.best = t; MS.set("who", st); }
          W.insertAdjacentHTML("afterend", `<div class="sprintend wend"><span class="kicker">Round done</span><h2>${fmt(t, 1)} s · ${miss} mistake${miss === 1 ? "" : "s"}</h2><p class="muted">${rec ? "New best clean round." : miss ? "A clean round (no mistakes) can set a record." : "Clean round."}</p><div class="row"><button class="btn primary" type="button" data-wagain>Next round</button></div></div>`); nudgeReview("lab");
          S("best").textContent = fmt(MS.get("who", {}).best || t, 1) + " s"; }
      } else { miss++; S("miss").textContent = miss; b.classList.add("shake", "nope"); setTimeout(() => b.classList.remove("shake", "nope"), 450); }
    }
  });
  root.addEventListener("click", e => { if (e.target.closest("[data-wagain]")){ root.querySelector(".wend").remove(); round(); } });
  round();
  return root;
}
const LABVIEWS = { kelley: labKelley, equity: labEquity, bigfive: labBigFive, who: labWho };
function viewLab(id){ return (LABVIEWS[id] || viewLabs)(); }
