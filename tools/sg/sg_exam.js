/* =====================================================================
   EXAM QUESTIONS (define, explain, apply, draw) and the timed MOCK EXAM.
   ===================================================================== */
function openState(){ return MS.get("open", { ans: {}, ticks: {} }); }
const SRC = { define: ["Define", ""], explain: ["Explain", "ex"], apply: ["Apply", "ap"], diagram: ["Causal diagram", "dg"] };
const METHOD = `<div class="method"><b>A method that works</b><span>Define the notion precisely</span><span>Explain the mechanism</span><span>Back it with a figure or study from class</span><span>Draw the links when there is a system</span><span>Conclude with the lesson</span></div>`;
function oItem(o, s){
  const t = (s.ticks[o.id] || []).length, w = (s.ans[o.id] || "").trim().split(/\s+/).filter(Boolean).length, sr = SRC[o.src] || SRC.explain;
  return `<a class="oitem" href="#open-${o.id}"><span class="oq">${o.q}</span><span class="ometa"><span class="osrc ${sr[1]}">${sr[0]}</span><span>${o.min} min</span>${w ? `<span>${w} words</span>` : ""}${t ? `<span class="osc">${t}/${o.points.length} points</span>` : `<span>Not tried</span>`}</span></a>`;
}
function viewOpen(){
  const s = openState(), dg = OPEN.filter(o => o.src === "diagram");
  return h("div", { class: "mod", html: `${mhead("Societal and Global Challenges", "Exam questions", "The exam asks you to define the key concepts, explain the lessons of the research shown in class, and probably draw a causal diagram. Write your answer, then compare it with a model answer and tick the key points you covered.")}
  ${METHOD}
  <a class="tdfull" href="#exam"><span><b>Mock exam, timed</b><span>Notions to define and explain, then a causal diagram to draw, marked against the key points.</span></span>${ICO.arrow}</a>
  <div class="olist">${COURSE.map(c => { const qs = OPEN.filter(o => o.ch === c.id && o.src !== "diagram"); return qs.length ? `<section class="ogrp" style="--c:${c.c}"><h2>${c.n}. ${c.title}</h2>${qs.map(o => oItem(o, s)).join("")}</section>` : ""; }).join("")}
  <section class="ogrp" style="--c:var(--c4)"><h2>Causal diagrams to draw</h2>${dg.map(o => oItem(o, s)).join("")}</section></div>
  ${creditHtml()}` });
}
function viewOpenQ(id){
  const o = OPEN.find(x => x.id === id) || OPEN[0], c = CH[o.ch], s = openState(), idx = OPEN.indexOf(o), nx = OPEN[idx + 1], pv = OPEN[idx - 1], sr = SRC[o.src] || SRC.explain;
  const ticks = new Set(s.ticks[o.id] || []), M = o.cld ? cldModel(CLDI[o.cld]) : null;
  const root = h("div", { class: "mod oq-page", style: `--c:${c.c}`, html: `
    <a class="tocback" href="#open">${ICO.back}All exam questions</a>
    <header class="mhead"><p class="kicker">${c.n}. ${c.short} · about ${o.min} minutes · ${sr[0].toLowerCase()}</p><h1 class="oqt">${o.q}</h1></header>
    ${M ? `<div class="dgtip"><p>Draw it first, on paper or in the studio, then explain it in words below. ${o.cld && CLDI[o.cld].src === "nexus" ? "This is a practice case built for Nexus." : "This diagram comes from the course."}</p><a class="btn glassy small" href="#studio-${o.cld}">Draw it in the Causal studio</a></div>` : ""}
    <div class="owrite"><label for="oans" class="lbl">Your answer</label><textarea id="oans" placeholder="Write as you would in the exam. Your text is saved on this device.">${esc(s.ans[o.id] || "")}</textarea>
      <div class="orow"><span class="muted" data-wc></span><button class="btn primary" type="button" data-reveal>Compare with the model answer</button></div></div>
    <section class="omodel" hidden>
      ${M ? `<div class="oans dgmodel"><h2>The diagram</h2><div class="boardwrap sm">${boardSVG(M, { label: CLDI[o.cld].title, loops: findLoops(M).length <= 4 ? findLoops(M) : null })}</div>${legendHtml()}</div>` : ""}
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
  root.addEventListener("change", e => { const cb = e.target.closest("[data-tick]"); if (!cb) return; const k = +cb.dataset.tick; if (cb.checked) ticks.add(k); else ticks.delete(k); const st = openState(); st.ticks[o.id] = [...ticks]; MS.set("open", st); score(); const n = Object.values(st.ticks).filter(t => t.length).length; if (n === 5) nudgeReview("open"); });
  score();
  return root;
}

/* ---------- mock exam: notions to explain, then a causal diagram to draw ---------- */
const EXAM_FMT = { 60: { q: 3 }, 90: { q: 5 } };
function newExam(min){
  min = EXAM_FMT[min] ? min : 60;
  const chs = shuffle(COURSE.map(c => c.id)).slice(0, EXAM_FMT[min].q);
  const qs = chs.map(ch => { const pool = OPEN.filter(o => o.ch === ch && o.src !== "diagram"); return pool.length ? PICK(pool).id : null; }).filter(Boolean);
  const dg = PICK(OPEN.filter(o => o.src === "diagram")).id;
  return { min, qs, dg, ans: {}, mine: [], start: null, end: null, ticks: {}, score: null };
}
function viewExam(){
  let E = MS.get("exam", null); if (!E || !E.qs || !E.dg || !EXAM_FMT[E.min]){ E = newExam(60); MS.set("exam", E); }
  const root = h("div", { class: "mod exampage" });
  let tick = 0;
  const save = () => MS.set("exam", E);
  const fmtT = ms => { const s = Math.max(0, Math.round(ms / 1000)), m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; };
  const Q = () => E.qs.map(id => OPEN.find(o => o.id === id)).filter(Boolean), D = () => OPEN.find(o => o.id === E.dg), DM = () => cldModel(CLDI[D().cld]);
  const blocks = () => Q().concat(D());
  const total = () => blocks().reduce((a, o) => a + o.points.length, 0);
  function dgScore(){ const m = DM(), mk = Object.fromEntries(E.mine.map(l => [linkKey(l), l])); return { ok: m.links.filter(l => mk[linkKey(l)] && mk[linkKey(l)].sign === l.sign).length, tot: m.links.length }; }
  function histHtml(){
    const H = MS.get("examHist", []).slice(-5).reverse(); if (!H.length) return "";
    return `<section class="mkhist"><h2>Your last mock exams</h2><ol>${H.map(x => `<li><span class="num">${new Date(x.t).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span><span>${x.min} min</span><span><b class="num">${x.score}%</b> key points</span>${x.dg ? `<span><b class="num">${x.dg}</b> links</span>` : ""}</li>`).join("")}</ol></section>`;
  }
  function dgEditor(phase){
    const m = DM(), opts = m.nodes.map(n => `<option value="${n.id}">${esc(n.label)}</option>`).join("");
    if (phase === "write") return `<p class="small muted">Variables you may use (the exam may not give them: list your own on paper first). Build your diagram arrow by arrow:</p>
      <div class="addlk"><select data-af aria-label="Cause">${opts}</select><span>→</span><select data-at aria-label="Effect">${opts}</select><select data-as aria-label="Sign"><option value="1">+</option><option value="-1">−</option></select><button class="btn glassy small" type="button" data-add>Add the arrow</button></div>
      <div class="boardwrap sm">${boardSVG(m, { label: "Your diagram", links: E.mine, straight: true })}</div>
      <ol class="lklist edit">${E.mine.map((l, i) => `<li><span class="lk-ft">${esc(nodeLabel(m, l.from))} <b class="sgn-mini ${l.sign > 0 ? "p" : "m"}">${signTxt(l.sign)}</b> ${esc(nodeLabel(m, l.to))}</span><span class="pm"><button type="button" data-mdel="${i}" aria-label="Remove">✕</button></span></li>`).join("")}</ol>`;
    const mk = Object.fromEntries(E.mine.map(l => [linkKey(l), l])), extra = E.mine.filter(l => !m.links.some(x => linkKey(x) === linkKey(l))), s = dgScore();
    return `<p class="verd"><span>Your diagram</span><b>${s.ok}/${s.tot}</b></p><p class="small muted">course links found with the right sign${extra.length ? `, plus ${extra.length} of yours not in the course diagram` : ""}.</p>
      <div class="boardwrap sm">${boardSVG(m, { label: "Course diagram", links: m.links.concat(extra.map(l => ({ ...l, extra: 1 }))), cls: l => l.extra ? "extra" : !mk[linkKey(l)] ? "miss" : mk[linkKey(l)].sign === l.sign ? "ok" : "bad", sign: l => l.extra ? l.sign : mk[linkKey(l)] ? mk[linkKey(l)].sign : l.sign })}</div>
      <ul class="cldleg st"><li><i class="ln ok"></i>right</li><li><i class="ln bad"></i>wrong sign</li><li><i class="ln miss"></i>missing</li><li><i class="ln extra"></i>yours, not in the course</li></ul>`;
  }
  function paint(){
    cancelAnimationFrame(tick);
    const phase = E.end ? "mark" : E.start ? "write" : "ready", qs = Q(), d = D();
    let html = `<a class="tocback" href="#open">${ICO.back}Exam questions</a>${mhead("Societal and Global Challenges", "Mock exam", phase === "ready" ? "Notions to define and explain, then a causal diagram. The exam's exact length and format are not in the slides you have: pick a length and treat this as training, not a prediction." : phase === "write" ? "Write in full sentences, back each answer with a figure or a study from class. Your answers are saved on this device." : "Time to mark yourself. Tick only what your answer states clearly.")}`;
    if (phase === "ready"){
      html += `<div class="exready"><div class="mklen" role="group" aria-label="Length">${Object.keys(EXAM_FMT).map(Number).map(m => `<button type="button" data-len="${m}" aria-pressed="${E.min === m}"><b>${m} minutes</b><span>${EXAM_FMT[m].q} notions and 1 diagram</span></button>`).join("")}</div>
        <ol class="exlist">${qs.map(o => `<li><span class="osrc" style="--c:${CH[o.ch].c}">${CH[o.ch].short}</span>${o.q}</li>`).join("")}<li><span class="osrc dg">Causal diagram</span>${d.q}</li></ol>
        <div class="row"><button class="btn primary big" type="button" data-start>Start the clock: ${E.min} minutes</button><button class="btn glassy big" type="button" data-new>Draw other questions</button></div>
        <p class="muted small">Suggested split: about ${Math.round((E.min - 20) / qs.length)} minutes per notion, 15 for the diagram, 5 to reread.</p>${histHtml()}</div>`;
    } else {
      html += `<div class="exbar is-${phase}"><div><b class="num" data-clock>${phase === "write" ? fmtT(E.start + E.min * 60000 - Date.now()) : "Done"}</b><span>${phase === "write" ? "left" : `${E.score}% of key points`}</span></div><div class="mbar"><i data-tbar></i></div>${phase === "write" ? `<button class="btn primary small" type="button" data-finish>Finish and mark</button>` : `<button class="btn glassy small" type="button" data-new>New mock exam</button>`}</div>
        <div class="exqs">${blocks().map((o, i) => { const isD = o === d; return `<section class="exq" style="--c:${isD ? "var(--c4)" : CH[o.ch].c}"><p class="kicker">Question ${i + 1} · ${isD ? "causal diagram" : CH[o.ch].title} · about ${o.min} min</p><h2>${o.q}</h2>
          ${isD && CLD_TEXT[o.cld] ? `<blockquote class="cldtext">${esc(CLD_TEXT[o.cld].text)}</blockquote>` : ""}${isD ? `<div class="dgbox">${dgEditor(phase)}</div>` : ""}
          ${phase === "write" ? `<textarea class="tdta" data-ans="${o.id}" placeholder="${isD ? "Explain your diagram: the main chains, the loops and their polarity" : "Your answer"}" aria-label="Your answer to question ${i + 1}">${esc(E.ans[o.id] || "")}</textarea><span class="muted small" data-wc="${o.id}"></span>`
          : `<div class="exmine"><p class="lbl">Your answer</p><p>${esc(E.ans[o.id] || "(no answer)").replace(/\n/g, "<br>")}</p></div>
             <div class="tdmodel"><div class="ochk"><h3>Key points <span>${(E.ticks[o.id] || []).length}/${o.points.length}</span></h3><ul>${o.points.map((p, k) => `<li><label><input type="checkbox" data-xt="${o.id}" data-k="${k}" ${(E.ticks[o.id] || []).includes(k) ? "checked" : ""}><span>${p}</span></label></li>`).join("")}</ul></div><details class="oans"><summary>Model answer</summary>${o.model.map(p => `<p>${p}</p>`).join("")}</details></div>`}</section>`; }).join("")}</div>
        ${phase === "mark" ? `<section class="exend"><h2>${E.score}% of the key points</h2><p class="muted">${E.score >= 70 ? "Exam-ready on these questions. Draw a new set tomorrow." : E.score >= 45 ? "Good base. Reread the model answers and rewrite the weakest answer from memory." : "Go back to Learn and the Causal studio for the notions you missed, then try a new mock."}</p><div class="row"><button class="btn primary" type="button" data-new>New mock exam</button><a class="btn glassy" href="#studio">Causal studio</a></div><div data-rvslot></div></section>` : ""}`;
    }
    root.innerHTML = html;
    root.querySelectorAll("textarea[data-ans]").forEach(ta => { const id = ta.dataset.ans, wc = root.querySelector(`[data-wc="${id}"]`), cnt = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = n ? `${n} words` : ""; }; cnt(); let t; ta.addEventListener("input", () => { cnt(); clearTimeout(t); t = setTimeout(() => { E.ans[id] = ta.value; save(); }, 300); }); });
    if (phase === "write"){
      const clock = root.querySelector("[data-clock]"), bar = root.querySelector("[data-tbar]"), bx = root.querySelector(".exbar");
      const run = () => { if (!root.isConnected) return; const left = E.start + E.min * 60000 - Date.now(); clock.textContent = fmtT(left); bar.style.width = Math.max(0, left / (E.min * 60000) * 100) + "%"; bx.classList.toggle("late", left < 10 * 60000); if (left <= 0){ finish(); return; } tick = requestAnimationFrame(run); };
      tick = requestAnimationFrame(run);
    }
    if (phase === "mark"){ root.querySelector("[data-tbar]").style.width = E.score + "%"; const slot = root.querySelector("[data-rvslot]"); if (slot) mountReviewSlot(slot); }
  }
  function collect(){ root.querySelectorAll("textarea[data-ans]").forEach(ta => { E.ans[ta.dataset.ans] = ta.value; }); }
  function finish(){ collect(); E.end = Date.now(); E.score = 0; save(); const H = MS.get("examHist", []); H.push({ t: E.end, min: E.min, score: 0, dg: `${dgScore().ok}/${dgScore().tot}` }); MS.set("examHist", H.slice(-20)); paint(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function rescore(){ const got = Object.values(E.ticks).reduce((a, t) => a + t.length, 0); E.score = Math.round(got / total() * 100); save(); const H = MS.get("examHist", []), last = H.find(x => x.t === E.end); if (last){ last.score = E.score; MS.set("examHist", H); } const b = root.querySelector(".exbar span"); if (b) b.textContent = `${E.score}% of key points`; const h2 = root.querySelector(".exend h2"); if (h2) h2.textContent = `${E.score}% of the key points`; const bar = root.querySelector("[data-tbar]"); if (bar) bar.style.width = E.score + "%"; }
  root.addEventListener("click", e => {
    if (e.target.closest("[data-start]")){ E.start = Date.now(); save(); paint(); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-new]")){ E = newExam(E.min); save(); paint(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const ln = e.target.closest("[data-len]"); if (ln){ E = newExam(+ln.dataset.len); save(); paint(); return; }
    if (e.target.closest("[data-add]")){ const f = root.querySelector("[data-af]").value, t = root.querySelector("[data-at]").value, s = +root.querySelector("[data-as]").value; if (f !== t && !E.mine.some(l => l.from === f && l.to === t)){ collect(); E.mine.push({ from: f, to: t, sign: s }); save(); const y = scrollY; paint(); scrollTo(0, y); } return; }
    const md = e.target.closest("[data-mdel]"); if (md){ collect(); E.mine.splice(+md.dataset.mdel, 1); save(); const y = scrollY; paint(); scrollTo(0, y); return; }
    const f = e.target.closest("[data-finish]");
    if (f){ if (!f.dataset.armed){ f.dataset.armed = "1"; f.textContent = "Tap again to finish"; setTimeout(() => { if (f.isConnected){ delete f.dataset.armed; f.textContent = "Finish and mark"; } }, 3500); return; } finish(); }
  });
  root.addEventListener("change", e => { const cb = e.target.closest("[data-xt]"); if (!cb) return; const id = cb.dataset.xt, k = +cb.dataset.k, t = new Set(E.ticks[id] || []); if (cb.checked) t.add(k); else t.delete(k); E.ticks[id] = [...t]; cb.closest(".ochk").querySelector("h3 span").textContent = `${t.size}/${OPEN.find(o => o.id === id).points.length}`; rescore(); });
  paint();
  return root;
}
