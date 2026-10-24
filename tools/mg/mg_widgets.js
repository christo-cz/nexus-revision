/* ---------------- interactive models inside Learn ---------------- */
const ORG_EX = [
  { t: "People queuing at a bakery", crit: [0, 0, 0, 0, 0], inter: 0, why: "Each person wants their own bread: no common goal, no coordination. Only co-presence." },
  { t: "Old classmates in a group chat", crit: [0, 0, 0, 0, 1], inter: 1, why: "They interact and feel they belong, but they share no task. A group." },
  { t: "Four students preparing one presentation", crit: [1, 1, 1, 0, 0], inter: 1, why: "A common goal, interdependent parts and split roles, but it ends on Friday and has no lasting rules. A team." },
  { t: "A pick-up football game in the park", crit: [1, 1, 1, 1, 0], inter: 1, why: "A shared goal, coordination, positions and the rules of the game, but nothing lasts beyond the match. A team, not yet an organization." },
  { t: "The EDHEC student association", crit: [1, 1, 1, 1, 1], inter: 1, why: "Goals, a board with roles, statutes and rules, events year after year: all five criteria." },
  { t: "A mafia family", crit: [1, 1, 1, 1, 1], inter: 1, why: "Uncomfortable but true: goals, coordination, roles, strict rules, continuity. \"Organization\" does not mean legal, nor company." },
  { t: "A local tennis club", crit: [1, 1, 1, 1, 1], inter: 1, why: "Membership, a committee, rules, tournaments every season. An organization that is not a company." },
  { t: "A hospital", crit: [1, 1, 1, 1, 1], inter: 1, why: "Goals of care, coordinated shifts, defined roles, protocols, continuity: an organization whose performance is not profit." }
];
const CRIT = ["Common goals", "Coordination", "Roles", "Rules or norms", "Continuity"];
const orgVerdict = e => e.crit.every(Boolean) ? "Organization" : e.crit[0] && e.crit[1] ? "Team" : e.inter ? "Group" : "Crowd";

const SCHOOLS = [
  { y: "1910s", n: "Administrative", who: "Fayol", q: "How should a manager administer?", k: "Shown on the timeline of the lecture; not developed in the slides.", c: "var(--faint)" },
  { y: "1920s", n: "Bureaucracy", who: "Weber", q: "How can an organization run in a stable, predictable, continuous way?", k: "Legal-rational authority: hierarchy of offices, division of labor, formal rules, merit, impersonality.", c: "var(--c1)" },
  { y: "1920s", n: "Efficiency", who: "Taylor, Ford", q: "How can work be done as efficiently as possible?", k: "Scientific management: the one best way, selection and training, managers plan and workers execute, specialization, performance pay.", c: "var(--c3)" },
  { y: "1930s–60s", n: "Humanistic", who: "Mayo, Herzberg, McGregor", q: "How can we improve performance by understanding the human side of work?", k: "Hawthorne: social relationships, attitudes and morale, and supervision shape performance.", c: "var(--pri)" },
  { y: "1950s–80s", n: "Contingency", who: "Woodward, Chandler, Lawrence & Lorsch, Mintzberg", q: "What if there is no single best way?", k: "Effectiveness depends on the fit with the task, people, technology, strategy and environment.", c: "var(--c4)" },
  { y: "1980s–now", n: "Contemporary", who: "Drucker", q: "Different times, same question.", k: "Shown on the timeline of the lecture; Drucker is also quoted in lecture 3 on decisions.", c: "var(--faint)" }
];
/* Schwartz: nine sectors clockwise from the top (conformity and tradition share one), as on the slide */
const SVAL = [
  { n: "Self-direction", s: 0, g: "open" }, { n: "Universalism", s: 1, g: "trans" }, { n: "Benevolence", s: 2, g: "trans" },
  { n: "Conformity", s: 3, g: "cons" }, { n: "Tradition", s: 3, g: "cons", outer: 1 }, { n: "Security", s: 4, g: "cons" },
  { n: "Power", s: 5, g: "enh" }, { n: "Achievement", s: 6, g: "enh" }, { n: "Hedonism", s: 7, g: "enh", both: 1 }, { n: "Stimulation", s: 8, g: "open" }
];
const SGROUP = { open: ["Openness to change", "var(--c3)"], trans: ["Self-transcendence", "var(--c4)"], cons: ["Conservation", "var(--c1)"], enh: ["Self-enhancement", "var(--pri)"] };
function schwartzRel(a, b){
  const d0 = Math.abs(a.s - b.s), d = Math.min(d0, 9 - d0);
  if (a === b) return null;
  if (d === 0) return ["Same motivational goal", "They share a sector of the circle: fully compatible.", "ok"];
  if (d === 1) return ["Adjacent: complementary", "Neighbors on the circle pursue compatible goals. Agreement is easy.", "ok"];
  if (d === 2) return ["Close: mostly compatible", "Two steps apart: some common ground.", "ok"];
  if (d === 3) return ["Far apart: tension", "Most of the circle separates them: priorities will often differ.", "bad"];
  return ["Opposite: incongruent", "Bipolar values pull in opposite directions. Expect conflict over what to prioritize or reward.", "bad"];
}
const PUZZLES = [
  { q: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?", o: ["10 cents", "5 cents"], r: 1, why: "System 1 jumps to 10 cents. Check: 0.10 + 1.10 = 1.20. With 5 cents: 0.05 + 1.05 = 1.10." },
  { q: "You are running a race with two other runners. At the end, you overtake the runner in second place. In what place do you finish?", o: ["First", "Second"], r: 1, why: "You take the place of the person you passed: second. System 1 hears \"overtake\" and says first." },
  { q: "Mary's mother had four children. The youngest three are called Spring, Summer and Autumn. What is the eldest child's name?", o: ["Winter", "Mary"], r: 1, why: "The pattern pulls you to Winter, but the first sentence told you: Mary." }
];
const CONT = [
  { n: "Amotivation", q: "\"I don't really see why I'm doing this.\"", dr: "No driver", loc: "None", k: "none" },
  { n: "External regulation", q: "\"I do this for a reward, to avoid punishment, or because I'm forced.\"", dr: "External rewards or punishments", loc: "External", k: "ctrl" },
  { n: "Introjection", q: "\"I do this because I'd feel guilty or ashamed otherwise, or to be approved.\"", dr: "Internal pressure, guilt, ego, approval (relatedness and ego-competence; autonomy absent)", loc: "Somewhat external", k: "ctrl" },
  { n: "Identification", q: "\"I do this because I personally believe it is important.\"", dr: "Personal value and usefulness (autonomy activated)", loc: "Somewhat internal", k: "auto" },
  { n: "Integration", q: "\"I do this because it fits my values and my sense of who I am.\"", dr: "Full alignment with identity and values (autonomy fully satisfied)", loc: "Internal", k: "auto" },
  { n: "Intrinsic motivation", q: "\"I do this because the activity itself is interesting or enjoyable.\"", dr: "The task itself", loc: "Internal", k: "intr" }
];
const JCM_DIMS = [
  { n: "Skill variety", st: 0, d: "Many different skills and talents are used." },
  { n: "Task identity", st: 0, d: "You complete a whole, identifiable piece of work." },
  { n: "Task significance", st: 0, d: "The job affects other people's lives or work." },
  { n: "Autonomy", st: 1, d: "Freedom to decide how the work is done." },
  { n: "Feedback", st: 2, d: "The work itself tells you how well you are doing." }
];
const JCM_STATES = ["Experienced meaningfulness", "Experienced responsibility for outcomes", "Knowledge of the actual results"];
const JCM_JOBS = { "Call-center agent (scripted)": [1, 1, 3, 1, 2], "Hospital nurse": [4, 3, 5, 3, 4], "Assembly-line worker": [1, 1, 2, 1, 2], "Start-up product designer": [5, 4, 3, 5, 3] };

const WIDGETS = {
  orgtest(el){
    let cur = 0;
    el.innerHTML = `<h3 class="wt">Crowd, group, team or organization?</h3><p class="wcap">Pick an example. The verdict is worked out from the five criteria.</p>
      <div class="wsplit"><div class="wlist">${ORG_EX.map((e, i) => `<button type="button" data-ex="${i}">${e.t}</button>`).join("")}</div><div class="wout2" aria-live="polite"></div></div>`;
    const out = el.querySelector(".wout2");
    const draw = () => {
      const e = ORG_EX[cur], v = orgVerdict(e);
      el.querySelectorAll("[data-ex]").forEach(b => b.classList.toggle("on", +b.dataset.ex === cur));
      out.innerHTML = `<ul class="crit">${CRIT.map((c, k) => `<li class="${e.crit[k] ? "y" : "n"}"><i>${e.crit[k] ? "✓" : "–"}</i>${c}</li>`).join("")}</ul><p class="verd"><span>Verdict</span><b>${v}</b></p><p class="small">${e.why}</p>`;
    };
    el.addEventListener("click", e => { const b = e.target.closest("[data-ex]"); if (b){ cur = +b.dataset.ex; draw(); } });
    draw();
  },
  schools(el){
    let cur = 1;
    el.innerHTML = `<h3 class="wt">Six schools, one question: how do we get controlled performance?</h3><div class="tl">${SCHOOLS.map((s, i) => `<button class="tlb" type="button" data-s="${i}" style="--c:${s.c}"><i></i><b>${s.y}</b><span>${s.n}</span></button>`).join("")}</div><div class="schoolcard" aria-live="polite"></div>`;
    const card = el.querySelector(".schoolcard");
    const draw = () => { const s = SCHOOLS[cur]; el.querySelectorAll(".tlb").forEach(b => b.classList.toggle("on", +b.dataset.s === cur)); card.style.setProperty("--c", s.c); card.innerHTML = `<p class="sc-who">${s.y} · ${s.who}</p><h4>${s.n} approach</h4><p class="sc-q">${s.q}</p><p>${s.k}</p>`; };
    el.addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (b){ cur = +b.dataset.s; draw(); } });
    draw();
  },
  schwartz(el){
    let pick = [7, 2];
    const cx = 160, cy = 160, R = 140, r0 = 46, step = 2 * Math.PI / 9, a0 = -Math.PI / 2 - step;
    const pt = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    const wedge = (s, r1, r2) => { const a = a0 + s * step, b = a + step, [x1, y1] = pt(a, r2), [x2, y2] = pt(b, r2), [x3, y3] = pt(b, r1), [x4, y4] = pt(a, r1); return `M${x1} ${y1}A${r2} ${r2} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${r1} ${r1} 0 0 0 ${x4} ${y4}Z`; };
    el.innerHTML = `<h3 class="wt">Schwartz's circle of values</h3><p class="wcap">Pick two values. Their distance on the circle tells you whether they are complementary or in conflict.</p>
      <div class="wgrid"><svg class="swheel" viewBox="0 0 320 320" role="img" aria-label="Schwartz value circle">${SVAL.map((v, i) => { const inner = v.s === 3 ? (v.outer ? 92 : r0) : r0, outer = v.s === 3 ? (v.outer ? R : 92) : R, mid = a0 + (v.s + .5) * step, rr = (inner + outer) / 2, [tx, ty] = pt(mid, rr);
        return `<g class="sw" data-v="${i}" tabindex="0" role="button" aria-label="${v.n}" style="--c:${SGROUP[v.g][1]}"><path d="${wedge(v.s, inner, outer)}"/><text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle">${v.n.replace("Self-direction", "Self-dir.").replace("Universalism", "Universal.").replace("Achievement", "Achieve.").replace("Benevolence", "Benevol.").replace("Stimulation", "Stimul.").replace("Conformity", "Conform.")}</text></g>`; }).join("")}<circle cx="${cx}" cy="${cy}" r="${r0 - 4}" class="swc"/></svg>
      <div class="wctl"><div class="swpair"><span data-a></span><span class="swvs">and</span><span data-b></span></div><div class="swrel" aria-live="polite"></div>
        <ul class="swleg">${Object.values(SGROUP).map(g => `<li><i style="background:${g[1]}"></i>${g[0]}</li>`).join("")}</ul>
        <div class="row"><button class="btn glassy small" type="button" data-pre="7,2">The bonus dilemma</button><button class="btn glassy small" type="button" data-pre="7,6">Achievement + power</button></div></div></div>`;
    let turn = 0;
    const draw = () => {
      const a = SVAL[pick[0]], b = SVAL[pick[1]];
      el.querySelectorAll(".sw").forEach(g => { const i = +g.dataset.v; g.classList.toggle("a", i === pick[0]); g.classList.toggle("b", i === pick[1]); });
      el.querySelector("[data-a]").textContent = a.n; el.querySelector("[data-b]").textContent = b.n;
      const rel = schwartzRel(a, b);
      el.querySelector(".swrel").innerHTML = rel ? `<b class="${rel[2]}">${rel[0]}</b><p>${rel[1]}</p><p class="muted small">${a.n}: ${SGROUP[a.g][0]}${a.both ? " (between openness and self-enhancement)" : ""}. ${b.n}: ${SGROUP[b.g][0]}${b.both ? " (between openness and self-enhancement)" : ""}.</p>` : `<p class="muted">Pick a second value.</p>`;
    };
    const choose = i => { if (pick[turn] === i) return; pick[turn] = i; turn = 1 - turn; draw(); };
    el.addEventListener("click", e => { const g = e.target.closest(".sw"); if (g) choose(+g.dataset.v); const p = e.target.closest("[data-pre]"); if (p){ pick = p.dataset.pre.split(",").map(Number); turn = 0; draw(); } });
    el.addEventListener("keydown", e => { const g = e.target.closest(".sw"); if (g && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); choose(+g.dataset.v); } });
    draw();
  },
  strength(el){
    const on = { Clarity: false, Consistency: false, Constraints: false, Consequences: false };
    const desc = { Clarity: "Rules and expectations are clear.", Consistency: "Procedures and cues are the same every time.", Constraints: "The range of acceptable behavior is narrow.", Consequences: "Behavior has clear, important consequences." };
    el.innerHTML = `<h3 class="wt">How strong is the situation?</h3><p class="wcap">Switch on the four Cs and watch how much room is left for personality.</p>
      <div class="wgrid"><div class="cs4">${Object.keys(on).map(k => `<button type="button" data-c="${k}" aria-pressed="false"><b>${k}</b><span>${desc[k]}</span></button>`).join("")}</div>
      <div class="wctl"><div class="meter"><i></i></div><div class="meterlbl"><span>Weak</span><span>Strong</span></div><div class="strout" aria-live="polite"></div></div></div>`;
    const draw = () => {
      const n = Object.values(on).filter(Boolean).length;
      el.querySelector(".meter i").style.width = (n / 4 * 100) + "%";
      el.querySelector(".strout").innerHTML = n <= 1 ? `<b>Weak situation</b><p>Unclear expectations, many acceptable behaviors. Personality has a lot of room: an extravert and an introvert will act very differently. Example: an open brainstorming.</p>`
        : n === 2 ? `<b>In between</b><p>Some cues guide behavior. Traits still show, but within limits.</p>`
        : `<b>Strong situation</b><p>The situation dictates behavior and people act alike, whatever their traits. Example: strict exam rules, a cockpit checklist.</p>`;
      el.querySelectorAll("[data-c]").forEach(b => b.setAttribute("aria-pressed", String(on[b.dataset.c])));
    };
    el.addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b){ on[b.dataset.c] = !on[b.dataset.c]; draw(); } });
    draw();
  },
  puzzles(el){
    el.innerHTML = `<h3 class="wt">Answer fast: System 1 at work</h3><p class="wcap">Pick the first answer that comes to mind, then let System 2 check.</p><div class="puz">${PUZZLES.map((p, i) => `<div class="pz" data-p="${i}"><p>${p.q}</p><div class="row">${p.o.map((o, j) => `<button class="btn glassy small" type="button" data-o="${j}">${o}</button>`).join("")}</div><p class="pzo" hidden></p></div>`).join("")}</div>`;
    el.addEventListener("click", e => { const b = e.target.closest("[data-o]"); if (!b) return; const box = b.closest(".pz"), p = PUZZLES[+box.dataset.p], good = +b.dataset.o === p.r; box.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; x.classList.toggle("pzr", +x.dataset.o === p.r); }); if (good) burst(b); const o = box.querySelector(".pzo"); o.hidden = false; o.innerHTML = `<b class="${good ? "ok" : "bad"}">${good ? "System 2 won." : "System 1 won this time."}</b> ${p.why}`; });
  },
  framing(el){
    let frame = "gain";
    const F = { gain: { a: "Treatment A saves 200 lives.", b: "Treatment B has a 1/3 chance of saving all 600 people and a 2/3 chance of saving no one.", res: "72% chose A" }, loss: { a: "With treatment A, 400 people will die.", b: "With treatment B, there is a 1/3 chance that nobody dies and a 2/3 chance that all 600 die.", res: "78% chose B" } };
    el.innerHTML = `<h3 class="wt">The disease problem: 600 people at risk</h3><p class="wcap">Same outcomes, two frames. Pick a treatment, then compare the frames.</p>
      <div class="seg" role="group" aria-label="Frame"><button type="button" data-f="gain" aria-pressed="true">Gain frame</button><button type="button" data-f="loss" aria-pressed="false">Loss frame</button></div>
      <div class="frm"><button type="button" class="fropt" data-t="a"></button><button type="button" class="fropt" data-t="b"></button></div><div class="frout" aria-live="polite"></div>`;
    const draw = () => { el.querySelectorAll("[data-f]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.f === frame))); el.querySelector('[data-t="a"]').innerHTML = `<b>A</b>${F[frame].a}`; el.querySelector('[data-t="b"]').innerHTML = `<b>B</b>${F[frame].b}`; el.querySelectorAll(".fropt").forEach(b => b.classList.remove("on")); el.querySelector(".frout").innerHTML = ""; };
    el.addEventListener("click", e => {
      const f = e.target.closest("[data-f]"); if (f){ frame = f.dataset.f; draw(); }
      const t = e.target.closest("[data-t]");
      if (t){ el.querySelectorAll(".fropt").forEach(b => b.classList.toggle("on", b === t));
        const ev = 600 / 3;
        el.querySelector(".frout").innerHTML = `<div class="calc">A: 200 saved for sure = 400 die for sure. B: expected lives saved = 1/3 × 600 = ${fmt(ev)}.</div><p>Both A are the same and both B are the same. In the study, <b>${F.gain.res}</b> in the gain frame and <b>${F.loss.res}</b> in the loss frame: losses make people risk-seeking (loss aversion).</p>`; }
    });
    draw();
  },
  kelley(el){
    const v = { d: "H", c: "H", s: "L" };
    el.innerHTML = `<h3 class="wt">Kelley's model</h3><p class="wcap">Set the three cues. The attribution follows. Peter's case is preset.</p>
      <div class="wgrid"><div class="kgrid">${["d", "c", "s"].map(k => `<div class="krow"><div><b>${KDIM[k][0]}</b><span>${KDIM[k][1]}</span></div><div class="seg"><button type="button" data-k="${k}" data-v="H">High</button><button type="button" data-k="${k}" data-v="L">Low</button></div></div>`).join("")}</div>
      <div class="wctl kout" aria-live="polite"></div></div><div class="row"><a class="btn glassy small" href="#lab-kelley">Train on generated scenes ${ICO.arrow}</a></div>`;
    const draw = () => {
      el.querySelectorAll("[data-k]").forEach(b => b.setAttribute("aria-pressed", String(v[b.dataset.k] === b.dataset.v)));
      const ext = (v.d === "H") + (v.c === "H") + (v.s === "L");
      el.querySelector(".kout").innerHTML = ext === 3 ? `<b class="ok">External attribution</b><p>The situation explains the behavior. Peter's dip came from the market: most reps were down.</p>` : ext === 0 ? `<b class="bad">Internal attribution</b><p>The person explains the behavior: they act this way everywhere, unlike others, all the time.</p>` : `<b>Mixed cues</b><p>The lecture's clear cases are the two patterns: high, high, low (external) and low, low, high (internal). With mixed cues, gather more information before judging.</p>`;
    };
    el.addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b){ v[b.dataset.k] = b.dataset.v; draw(); } });
    draw();
  },
  continuum(el){
    let i = 1;
    el.innerHTML = `<h3 class="wt">The internalization continuum</h3><p class="wcap">Slide from amotivation to intrinsic motivation.</p>
      <input type="range" min="0" max="5" step="1" value="${i}" aria-label="Type of motivation" class="crange">
      <div class="cticks">${CONT.map((c, k) => `<button type="button" data-ci="${k}">${c.n}</button>`).join("")}</div><div class="cout" aria-live="polite"></div>`;
    const draw = () => {
      const c = CONT[i]; el.querySelector(".crange").value = i;
      el.querySelectorAll("[data-ci]").forEach(b => b.classList.toggle("on", +b.dataset.ci === i));
      const tag = c.k === "ctrl" ? "Controlled extrinsic motivation" : c.k === "auto" ? "Autonomous extrinsic motivation" : c.k === "intr" ? "Intrinsic motivation" : "No motivation";
      el.querySelector(".cout").innerHTML = `<p class="cq">${c.q}</p><dl class="wout"><div><dt>Type</dt><dd>${tag}</dd></div><div><dt>Driver</dt><dd>${c.dr}</dd></div><div><dt>Perceived locus of causality</dt><dd>${c.loc}</dd></div></dl>`;
      el.style.setProperty("--cp", i / 5);
    };
    el.addEventListener("input", e => { if (e.target.matches(".crange")){ i = +e.target.value; draw(); } });
    el.addEventListener("click", e => { const b = e.target.closest("[data-ci]"); if (b){ i = +b.dataset.ci; draw(); } });
    draw();
  },
  jcm(el){
    let job = Object.keys(JCM_JOBS)[0], v = JCM_JOBS[job].slice();
    el.innerHTML = `<h3 class="wt">The Job Characteristics Model</h3><p class="wcap">Pick a job, then redesign it: raise a dimension and see which psychological state it feeds.</p>
      <div class="seg jobs" role="group" aria-label="Job">${Object.keys(JCM_JOBS).map(j => `<button type="button" data-job="${esc(j)}">${j}</button>`).join("")}</div>
      <div class="jcm"><div class="jdims">${JCM_DIMS.map((d, k) => `<label class="jd" data-st="${d.st}"><span><b>${d.n}</b><small>${d.d}</small></span><input type="range" min="1" max="5" step="1" data-d="${k}" aria-label="${d.n}"><output></output></label>`).join("")}</div>
      <div class="jstates">${JCM_STATES.map((s, k) => `<div class="js" data-s="${k}"><span>${s}</span><div class="mbar"><i></i></div></div>`).join("")}<p class="jout"></p></div></div>
      <p class="wnote">Moderators: knowledge and skill, growth need strength, context satisfactions. Not everyone wants a job high on all five.</p>`;
    const draw = () => {
      el.querySelectorAll("[data-job]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.job === job)));
      el.querySelectorAll("[data-d]").forEach(r => { const k = +r.dataset.d; r.value = v[k]; r.nextElementSibling.textContent = v[k]; });
      const st = [(v[0] + v[1] + v[2]) / 3, v[3], v[4]];
      el.querySelectorAll(".js").forEach(s => { const k = +s.dataset.s; s.querySelector("i").style.width = ((st[k] - 1) / 4 * 100) + "%"; s.classList.toggle("low", st[k] < 2.5); });
      const lowS = st.map((x, k) => x < 2.5 ? JCM_STATES[k].toLowerCase() : null).filter(Boolean);
      el.querySelector(".jout").innerHTML = lowS.length ? `Weak link${lowS.length > 1 ? "s" : ""}: ${lowS.join(", ")}. Expect low intrinsic motivation and satisfaction.` : `All three states are present: high intrinsic motivation, growth and job satisfaction, work effectiveness.`;
    };
    el.addEventListener("input", e => { const r = e.target.closest("[data-d]"); if (r){ v[+r.dataset.d] = +r.value; draw(); el.querySelectorAll(".jd").forEach(l => l.classList.toggle("hl", l.dataset.st === r.closest(".jd").dataset.st)); el.querySelectorAll(".js").forEach(s => s.classList.toggle("hl", s.dataset.s === r.closest(".jd").dataset.st)); } });
    el.addEventListener("click", e => { const b = e.target.closest("[data-job]"); if (b){ job = b.dataset.job; v = JCM_JOBS[job].slice(); draw(); } });
    draw();
  },
  equity(el){
    const v = { p1: 3000, h1: 40, p2: 3300, h2: 40 };
    el.innerHTML = `<h3 class="wt">Outcomes ÷ inputs</h3><p class="wcap">Change the numbers: pay per month as the outcome, hours per week as the input.</p>
      <div class="eqmini">${[["p1", "My pay (€)"], ["h1", "My hours"], ["p2", "Referent's pay (€)"], ["h2", "Referent's hours"]].map(([k, l]) => `<label class="field"><span class="unit" style="padding:0 0 0 12px">${l}</span><input inputmode="decimal" data-q="${k}" value="${v[k]}"></label>`).join("")}</div>
      <div class="eqout" aria-live="polite"></div><div class="row"><a class="btn glassy small" href="#lab-equity">Practice with new cases ${ICO.arrow}</a></div>`;
    const draw = () => {
      if ([v.p1, v.h1, v.p2, v.h2].some(x => !(x > 0))){ el.querySelector(".eqout").innerHTML = `<p class="muted">Enter positive numbers.</p>`; return; }
      const r1 = v.p1 / v.h1, r2 = v.p2 / v.h2, d = (r1 - r2) / r2, st = Math.abs(d) < .02 ? "Equity" : d < 0 ? "Under-rewarded" : "Over-rewarded";
      el.querySelector(".eqout").innerHTML = `<div class="calc">Me: €${fmt(v.p1)} / ${fmt(v.h1)} h = €${fmt(r1, 2)} · Referent: €${fmt(v.p2)} / ${fmt(v.h2)} h = €${fmt(r2, 2)} · gap ${d < 0 ? "−" : "+"}${fmt(Math.abs(d * 100), 1)}%</div><p><b class="${st === "Equity" ? "ok" : "bad"}">${st}.</b> ${st === "Equity" ? "No tension." : st === "Under-rewarded" ? "Tension: change inputs, ask for a raise, distort perceptions of self or others, change referent, or leave." : "Tension too, often felt as guilt: you may work harder or decide you deserve it."}</p>`;
    };
    el.addEventListener("input", e => { const q = e.target.dataset.q; if (q){ v[q] = parseNum(e.target.value); draw(); } });
    draw();
  }
};
