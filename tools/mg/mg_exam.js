/* =====================================================================
   EXAM QUESTIONS and the 90-minute MOCK EXAM.
   ===================================================================== */
function openState(){ return MS.get("open", { ans: {}, ticks: {} }); }
const METHOD = `<div class="method"><b>A method that works</b><span>Define the key concept</span><span>Explain the theory and its mechanism</span><span>Apply it to the facts</span><span>Recommend, linked to the theory</span><span>Add a limit or nuance</span></div>`;
function oItem(o, s){
  const t = (s.ticks[o.id] || []).length, w = (s.ans[o.id] || "").trim().split(/\s+/).filter(Boolean).length;
  return `<a class="oitem" href="#open-${o.id}"><span class="oq">${o.q}</span><span class="ometa">${o.src === "slides" ? `<span class="osrc">From the slides</span>` : o.src === "apply" ? `<span class="osrc ap">Application case</span>` : `<span class="osrc cr">From the lecture</span>`}<span>${o.min} min</span>${w ? `<span>${w} words</span>` : ""}${t ? `<span class="osc">${t}/${o.points.length} points</span>` : `<span>Not tried</span>`}</span></a>`;
}
function viewOpen(){
  const s = openState(), apply = OPEN.filter(o => o.src === "apply");
  return h("div", { class: "mod", html: `${mhead("Management and Organizations", "Exam questions", "Every self-check question from the slides, plus application cases in the spirit of the exam. Write your answer, then compare it with a model answer and tick the key points you covered.")}
  ${METHOD}
  <a class="tdfull" href="#exam"><span><b>Mock exam, 90 minutes</b><span>Four lecture questions and one application case, timed, then marked against the key points.</span></span>${ICO.arrow}</a>
  <div class="olist">${COURSE.map(c => { const qs = OPEN.filter(o => o.ch === c.id && o.src !== "apply"); return qs.length ? `<section class="ogrp" style="--c:${c.c}"><h2>${c.n}. ${c.title}</h2>${qs.map(o => oItem(o, s)).join("")}</section>` : ""; }).join("")}
  <section class="ogrp" style="--c:var(--c3)"><h2>Application cases</h2>${apply.map(o => oItem(o, s)).join("")}</section></div>
  ${creditHtml()}` });
}
function viewOpenQ(id){
  const o = OPEN.find(x => x.id === id) || OPEN[0], c = CH[o.ch], s = openState(), idx = OPEN.indexOf(o), nx = OPEN[idx + 1], pv = OPEN[idx - 1];
  const ticks = new Set(s.ticks[o.id] || []);
  const root = h("div", { class: "mod oq-page", style: `--c:${c.c}`, html: `
    <a class="tocback" href="#open">${ICO.back}All exam questions</a>
    <header class="mhead"><p class="kicker">${c.n}. ${c.short} · about ${o.min} minutes · ${o.src === "slides" ? "self-check question from the slides" : o.src === "apply" ? "application case" : "from the lecture"}</p><h1 class="oqt">${o.q}</h1></header>
    <div class="owrite"><label for="oans" class="lbl">Your answer</label><textarea id="oans" placeholder="Write as you would in the exam. Your text is saved on this device.">${esc(s.ans[o.id] || "")}</textarea>
      <div class="orow"><span class="muted" data-wc></span><button class="btn primary" type="button" data-reveal>Compare with the model answer</button></div></div>
    <section class="omodel" hidden>
      <div class="ochk"><h2>Key points <span data-osc></span></h2><p class="muted">Tick each point your answer covers.</p>
        <ul>${o.points.map((p, k) => `<li><label><input type="checkbox" data-tick="${k}" ${ticks.has(k) ? "checked" : ""}><span>${p}</span></label></li>`).join("")}</ul></div>
      <div class="oans"><h2>Model answer</h2>${o.model.map(p => `<p>${p}</p>`).join("")}</div>
    </section>
    <nav class="chnext">${pv ? `<a class="btn glassy" href="#open-${pv.id}">${ICO.back}Previous</a>` : "<span></span>"}${nx ? `<a class="btn glassy" href="#open-${nx.id}">Next question${ICO.arrow}</a>` : "<span></span>"}</nav>` });
  const ta = root.querySelector("textarea"), wc = root.querySelector("[data-wc]"), model = root.querySelector(".omodel");
  const count = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = n ? `${n} words` : ""; };
  let tmr; ta.addEventListener("input", () => { count(); clearTimeout(tmr); tmr = setTimeout(() => { const st = openState(); st.ans[o.id] = ta.value; MS.set("open", st); }, 300); });
  count();
  const score = () => { root.querySelector("[data-osc]").textContent = `${ticks.size}/${o.points.length}`; };
  if (ticks.size || (s.ans[o.id] || "").length > 40) model.hidden = false;
  root.addEventListener("click", e => { if (e.target.closest("[data-reveal]")){ model.hidden = false; const st = openState(); st.ans[o.id] = ta.value; MS.set("open", st); model.scrollIntoView({ behavior: "smooth", block: "start" }); } });
  root.addEventListener("change", e => { const cb = e.target.closest("[data-tick]"); if (!cb) return; const k = +cb.dataset.tick; if (cb.checked) ticks.add(k); else ticks.delete(k); const st = openState(); st.ticks[o.id] = [...ticks]; MS.set("open", st); score(); });
  score();
  return root;
}

/* ---------- mock exam: one question per lecture + one application case, 90 minutes ---------- */
const EXAM_MIN = 90;
function newExam(){
  const qs = COURSE.map(c => PICK(OPEN.filter(o => o.ch === c.id && o.src !== "apply")).id).concat(PICK(OPEN.filter(o => o.src === "apply")).id);
  return { qs, ans: {}, start: null, end: null, ticks: {}, score: null };
}
function viewExam(){
  let E = MS.get("exam", null); if (!E || !E.qs) { E = newExam(); MS.set("exam", E); }
  const Q = E.qs.map(id => OPEN.find(o => o.id === id)).filter(Boolean);
  const total = Q.reduce((a, o) => a + o.points.length, 0);
  const root = h("div", { class: "mod exampage" });
  let tick = 0;
  const save = () => MS.set("exam", E);
  const fmtT = ms => { const s = Math.max(0, Math.round(ms / 1000)), m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; };
  function paint(){
    cancelAnimationFrame(tick);
    const phase = E.end ? "mark" : E.start ? "write" : "ready";
    root.innerHTML = `<a class="tocback" href="#open">${ICO.back}Exam questions</a>
      ${mhead("Management and Organizations", "Mock exam", phase === "ready" ? `${Q.length} questions in ${EXAM_MIN} minutes: one per lecture, then an application case. The real exam tests understanding and application; its exact format is not in the syllabus, so treat this as training, not a prediction.` : phase === "write" ? "Write in full sentences. Your answers are saved on this device as you type." : "Time to mark yourself. Tick only what your answer states clearly.")}
      ${phase === "ready" ? `<div class="exready"><ol class="exlist">${Q.map(o => `<li><span class="osrc ${o.src === "apply" ? "ap" : ""}" style="--c:${CH[o.ch].c}">${o.src === "apply" ? "Application case" : CH[o.ch].short}</span>${o.q}</li>`).join("")}</ol>
          <div class="row"><button class="btn primary big" type="button" data-start>Start the clock: ${EXAM_MIN} minutes</button><button class="btn glassy big" type="button" data-new>Draw other questions</button></div>
          <p class="muted small">Suggested split: about 15 minutes per lecture question, 25 for the case, 5 to reread.</p>${histHtml()}</div>`
      : `<div class="exbar is-${phase}"><div><b class="num" data-clock>${phase === "write" ? fmtT(E.start + EXAM_MIN * 60000 - Date.now()) : "Done"}</b><span>${phase === "write" ? "left" : `${E.score}% of key points`}</span></div><div class="mbar"><i data-tbar></i></div>${phase === "write" ? `<button class="btn primary small" type="button" data-finish>Finish and mark</button>` : `<button class="btn glassy small" type="button" data-new>New mock exam</button>`}</div>
        <div class="exqs">${Q.map((o, i) => `<section class="exq" data-q="${o.id}" style="--c:${CH[o.ch].c}"><p class="kicker">Question ${i + 1} · ${o.src === "apply" ? "application case" : CH[o.ch].title} · about ${o.min} min</p><h2>${o.q}</h2>
          ${phase === "write" ? `<textarea class="tdta" data-ans="${o.id}" placeholder="Your answer" aria-label="Your answer to question ${i + 1}">${esc(E.ans[o.id] || "")}</textarea><span class="muted small" data-wc="${o.id}"></span>`
          : `<div class="exmine"><p class="lbl">Your answer</p><p>${esc(E.ans[o.id] || "(no answer)").replace(/\n/g, "<br>")}</p></div>
             <div class="tdmodel"><div class="ochk"><h3>Key points <span>${(E.ticks[o.id] || []).length}/${o.points.length}</span></h3><ul>${o.points.map((p, k) => `<li><label><input type="checkbox" data-xt="${o.id}" data-k="${k}" ${(E.ticks[o.id] || []).includes(k) ? "checked" : ""}><span>${p}</span></label></li>`).join("")}</ul></div><details class="oans"><summary>Model answer</summary>${o.model.map(p => `<p>${p}</p>`).join("")}</details></div>`}
        </section>`).join("")}</div>
        ${phase === "mark" ? `<section class="exend"><h2>${E.score}% of the key points</h2><p class="muted">${E.score >= 70 ? "Exam-ready on these questions. Draw a new set tomorrow." : E.score >= 45 ? "Good base. Reread the model answers and rewrite the weakest answer from memory." : "Go back to Learn for the lectures you missed, then try a new mock."}</p><div class="row"><button class="btn primary" type="button" data-new>New mock exam</button><a class="btn glassy" href="#learn">Back to Learn</a></div><div data-rvslot></div></section>` : ""}`}`;
    root.querySelectorAll("[data-ans]").forEach(ta => { const id = ta.dataset.ans, wc = root.querySelector(`[data-wc="${id}"]`), cnt = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = n ? `${n} words` : ""; }; cnt(); let t; ta.addEventListener("input", () => { cnt(); clearTimeout(t); t = setTimeout(() => { E.ans[id] = ta.value; save(); }, 300); }); });
    if (phase === "write"){
      const clock = root.querySelector("[data-clock]"), bar = root.querySelector("[data-tbar]");
      const run = () => { if (!root.isConnected) return; const left = E.start + EXAM_MIN * 60000 - Date.now(); clock.textContent = fmtT(left); bar.style.width = Math.max(0, left / (EXAM_MIN * 60000) * 100) + "%"; root.querySelector(".exbar").classList.toggle("late", left < 10 * 60000); if (left <= 0){ finish(); return; } tick = requestAnimationFrame(run); };
      tick = requestAnimationFrame(run);
    }
    if (phase === "mark"){ const bar = root.querySelector("[data-tbar]"); bar.style.width = E.score + "%"; const slot = root.querySelector("[data-rvslot]"); if (slot) mountReviewSlot(slot); }
  }
  function histHtml(){
    const H = MS.get("examHist", []).slice(-5).reverse();
    if (!H.length) return "";
    return `<section class="mkhist"><h2>Your last mock exams</h2><ol>${H.map(x => `<li><span class="num">${new Date(x.t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span><span>${x.n} questions</span><span><b class="num">${x.score}%</b> key points</span></li>`).join("")}</ol></section>`;
  }
  function finish(){ root.querySelectorAll("[data-ans]").forEach(ta => { E.ans[ta.dataset.ans] = ta.value; }); E.end = Date.now(); E.score = 0; save(); const H = MS.get("examHist", []); H.push({ t: E.end, n: Q.length, score: 0 }); MS.set("examHist", H.slice(-20)); paint(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function rescore(){ const got = Object.values(E.ticks).reduce((a, t) => a + t.length, 0); E.score = Math.round(got / total * 100); save(); const H = MS.get("examHist", []), last = H.find(x => x.t === E.end); if (last){ last.score = E.score; MS.set("examHist", H); } const b = root.querySelector(".exbar span"); if (b) b.textContent = `${E.score}% of key points`; const h2 = root.querySelector(".exend h2"); if (h2) h2.textContent = `${E.score}% of the key points`; const bar = root.querySelector("[data-tbar]"); if (bar) bar.style.width = E.score + "%"; }
  root.addEventListener("click", e => {
    if (e.target.closest("[data-start]")){ E.start = Date.now(); save(); paint(); }
    if (e.target.closest("[data-new]")){ E = newExam(); save(); render(); }
    const f = e.target.closest("[data-finish]");
    if (f){ if (!f.dataset.armed){ f.dataset.armed = "1"; f.textContent = "Tap again to finish"; setTimeout(() => { if (f.isConnected){ delete f.dataset.armed; f.textContent = "Finish and mark"; } }, 3500); return; } finish(); }
  });
  root.addEventListener("change", e => { const cb = e.target.closest("[data-xt]"); if (!cb) return; const id = cb.dataset.xt, k = +cb.dataset.k, t = new Set(E.ticks[id] || []); if (cb.checked) t.add(k); else t.delete(k); E.ticks[id] = [...t]; cb.closest(".ochk").querySelector("h3 span").textContent = `${t.size}/${OPEN.find(o => o.id === id).points.length}`; rescore(); });
  paint();
  return root;
}
