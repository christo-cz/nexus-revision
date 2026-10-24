/* =====================================================================
   CASES: people problems solved with the course method. Case sheet on the left, steps on the right.
   ===================================================================== */
const seededOrder = (n, key) => { let s = 7; for (const ch of key) s = (Math.imul(s, 31) + ch.charCodeAt(0)) | 0; const r = mulberry32(s), a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const RESTART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';

function viewCases(){
  const o = caseOverall();
  return h("div", { class: "mod", html: `
  ${mhead("Management and Organizations", "Cases", "People problems in invented but realistic organizations. Each case follows the method of the course: define the problem, find its cause in the evidence, recommend with a theory. The case sheet stays on the left, the steps scroll on the right.",
    `<div class="mprog"><div class="mbar"><i style="width:${o.fin / CASES.length * 100}%"></i></div><span>${o.fin} of ${CASES.length} cases solved</span></div>`)}
  <ol class="method3"><li><b>Define the problem</b><span>The gap between the desired and the actual outcome.</span></li><li><b>Identify the cause</b><span>Test explanations against the facts.</span></li><li><b>Recommend</b><span>Each action linked to a theory and its mechanism.</span></li></ol>
  <div class="clist">${CASES.map(c => { const s = caseStat(c), done = s.done === s.total;
    return `<a class="ccard" href="#case-${c.id}" style="--c:${CH[c.ch[0]].c}">
      <span class="ctop"><span class="cn">${String(c.n).padStart(2, "0")}</span><span class="cst${done ? " done" : s.done ? " go" : ""}">${done ? `${Math.round(s.right / s.total * 100)}%` : s.done ? `${s.done}/${s.total}` : `${s.total} steps`}</span></span>
      <b>${c.title}</b><span class="corg">${c.org}</span>
      <span class="ctags">${c.ch.map(k => `<i style="--c:${CH[k].c}">${CH[k].short}</i>`).join("")}</span>
      <span class="mini" aria-hidden="true"><i style="width:${s.done / s.total * 100}%${done ? ";background:var(--ok)" : ""}"></i></span></a>`; }).join("")}</div>
  ${creditHtml()}` });
}

function viewCase(id){
  const C = CASES.find(c => c.id === id) || CASES[0], P = caseP(C.id), T = C.steps.length, idx = CASES.indexOf(C), NX = CASES[(idx + 1) % CASES.length];
  const root = h("div", { class: "book mgbook" });
  const sheet = h("aside", { class: "sheet closed", "aria-label": "Case sheet" });
  sheet.innerHTML = `<div class="sheet-h"><a class="tocback" href="#cases">${ICO.back}All cases</a><span class="eyebrow">Case ${C.n} of ${CASES.length}</span><h1>${C.title}</h1><p>${C.org}</p></div>
    <p class="cintro">${C.intro}</p>
    <button class="btn quiet small sheet-toggle" type="button" data-act="sheet" aria-expanded="false">Show the case sheet</button>
    ${C.sheet.map(b => `<section class="blk" data-blk="${b.k}" data-act="jump" tabindex="0" title="Go to the steps that use this part"><span class="go">Go to the steps</span><h2><span class="tg">${b.k}</span>${b.h}</h2><p>${b.t}</p></section>`).join("")}`;
  const qmap = h("nav", { class: "qmap", "aria-label": "Jump to a step" });
  qmap.innerHTML = `<div class="qmap-h"><span>Steps</span><span data-qinfo></span></div><div class="qrow">${C.steps.map((s, i) => `<button class="qsq" type="button" data-act="goq" data-i="${i}" aria-label="Step ${i + 1}">${i + 1}</button>`).join("")}</div>`;
  sheet.querySelector(".cintro").after(qmap);
  const qs = h("section", { class: "qs", "aria-label": "Steps" });
  const bar = h("div", { class: "bar" });
  bar.innerHTML = `<div class="bar-row"><div class="bar-t"><b>${C.title}</b><span>${C.ch.map(k => CH[k].short).join(" · ")}</span></div><div class="score"><b class="num" data-sc></b><span data-sc2></span></div><button class="restart" type="button" data-act="reset" data-label="Restart" title="Erase your answers and start this case again">${RESTART}<span class="tl">Restart</span></button></div><div class="prog" aria-hidden="true"><i class="r" data-pr></i><i class="w" data-pw></i></div>`;
  qs.append(bar);
  const cards = C.steps.map((s, i) => stepCard(C, s, i, P));
  const end = h("section", { class: "end", "aria-label": "End of the case" });
  qs.append(...cards, end);
  root.append(sheet, qs);

  function refresh(){
    const vals = Object.values(P.ans), done = vals.length, right = vals.filter(a => a.ok).length, wrong = done - right;
    bar.querySelector("[data-sc]").textContent = `${done}/${T}`;
    bar.querySelector("[data-sc2]").textContent = done ? `${right} right` : "answered";
    bar.querySelector("[data-pr]").style.width = (right / T * 100) + "%"; bar.querySelector("[data-pw]").style.width = (wrong / T * 100) + "%";
    qmap.querySelectorAll(".qsq").forEach(s => { const a = P.ans[s.dataset.i]; s.classList.toggle("ok", !!a && a.ok); s.classList.toggle("bad", !!a && !a.ok); });
    qmap.querySelector("[data-qinfo]").textContent = done ? `${right} right, ${wrong} to review` : "";
    caseSave(C.id, P);
    const pct = Math.round(right / T * 100);
    end.innerHTML = done < T
      ? `<h2>${T - done} step${T - done > 1 ? "s" : ""} to go</h2><p class="muted">So far: ${right} right out of ${done}.</p><div class="row"><button class="btn primary" type="button" data-act="first-open">Go to the next open step</button></div>`
      : `<span class="eyebrow">Case solved</span><h2>${pct}% · ${right} of ${T} right</h2>
         <p class="muted">${pct >= 80 ? "A solid diagnosis. Try to write the final recommendation again tomorrow without looking." : "Read each explanation again, then restart the case in a few days."}</p>
         <div class="row">${wrong ? `<button class="btn quiet" type="button" data-act="first-wrong">Review the ${wrong} step${wrong > 1 ? "s" : ""} to improve</button>` : ""}<a class="btn primary" href="#case-${NX.id}">Next case</a><button class="btn quiet" type="button" data-act="reset" data-label="Restart this case">Restart this case</button></div><div data-rvslot></div>`;
    const slot = end.querySelector("[data-rvslot]"); if (slot) mountReviewSlot(slot);
  }
  root.addEventListener("answered", refresh);
  sheet.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("blk")){ e.preventDefault(); e.target.click(); } });
  root.addEventListener("click", e => {
    const t = e.target.closest("[data-act]"); if (!t) return;
    const a = t.dataset.act;
    if (a === "sheet"){ const closed = sheet.classList.toggle("closed"); t.textContent = closed ? "Show the case sheet" : "Hide the case sheet"; t.setAttribute("aria-expanded", String(!closed)); }
    if (a === "next"){ const i = +t.dataset.i; focusCard(cards.slice(i + 1).find(c => !P.ans[c.dataset.i]) || cards[i + 1] || end); }
    if (a === "jump"){ focusCard(cards.find(c => c.dataset.blk === t.dataset.blk && !P.ans[c.dataset.i]) || cards.find(c => c.dataset.blk === t.dataset.blk)); }
    if (a === "first-open") focusCard(cards.find(c => !P.ans[c.dataset.i]));
    if (a === "first-wrong") focusCard(cards.find(c => P.ans[c.dataset.i] && !P.ans[c.dataset.i].ok));
    if (a === "goq") focusCard(cards[+t.dataset.i]);
    if (a === "reset"){ const lab = t.querySelector(".tl") || t; if (t.dataset.armed){ caseSave(C.id, { ans: {} }); render(); } else { t.dataset.armed = "1"; lab.textContent = "Tap again to erase"; setTimeout(() => { if (t.isConnected){ delete t.dataset.armed; lab.textContent = t.dataset.label || "Restart"; } }, 4000); } }
  });
  requestAnimationFrame(() => {
    const desk = matchMedia("(min-width: 981px)").matches;
    const setCur = card => {
      cards.forEach(c => c.classList.toggle("cur", c === card)); qs.classList.add("has-cur");
      qmap.querySelectorAll(".qsq").forEach(s => s.classList.toggle("cur", cards[+s.dataset.i] === card));
      const blk = card.dataset.blk;
      sheet.classList.toggle("focus", !!blk);
      sheet.querySelectorAll(".blk").forEach(b => b.classList.toggle("on", b.dataset.blk === blk));
      if (desk && blk){ const b = sheet.querySelector(`.blk[data-blk="${blk}"]`); if (b){ const top = b.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop - 16; if (Math.abs(sheet.scrollTop - top) > 40) sheet.scrollTo({ top, behavior: "smooth" }); } }
    };
    let lock = 0, raf = 0, last = null;
    const pick = () => {
      raf = 0; if (performance.now() < lock) return;
      let mid;
      if (desk){ const r = qs.getBoundingClientRect(); mid = r.top + 100 + (qs.clientHeight - 124) / 2; }
      else { const b = bar.getBoundingClientRect(); mid = b.bottom + (innerHeight - b.bottom) / 2; }
      let best = null, bd = 1e9;
      for (const c of cards){ const r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bd){ bd = d; best = c; } }
      if (best && best !== last){ last = best; setCur(best); }
    };
    (desk ? qs : window).addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(pick); }, { passive: true });
    root.addEventListener("focuscard", e => { last = e.detail; setCur(e.detail); lock = performance.now() + 900; setTimeout(() => { lock = 0; pick(); }, 950); });
    const first = cards.find(c => !P.ans[c.dataset.i]);
    if (first && first !== cards[0]) focusCard(first, true); else setCur(cards[0]);
  });
  refresh();
  return root;
}

function stepCard(C, s, i, P){
  const prev = P.ans[i], blk = C.sheet.find(b => b.k === s.b), isLast = i === C.steps.length - 1;
  const card = h("article", { class: "card" + (prev ? (prev.ok ? " ok" : " bad") : ""), "data-i": String(i), "data-blk": s.b || "", "aria-labelledby": `qt-${C.id}-${i}` });
  const kindL = { mcq: "Choose one", multi: "Select all that apply", write: "Write, then compare" }[s.kind];
  card.innerHTML = `<div class="qhead"><span class="qn">${i + 1}</span><span class="qtag">${kindL}${s.b ? ` · uses ${s.b}` : ""}</span></div><p class="qtext" id="qt-${C.id}-${i}">${s.q}</p>${blk ? `<p class="snip"><b>${blk.k} · ${blk.h}.</b> ${blk.t}</p>` : ""}`;
  const out = h("div", { class: "stack" });
  const record = (ok, v, extra = {}) => { P.ans[i] = { ok, v, ...extra }; card.dispatchEvent(new CustomEvent("answered", { bubbles: true })); };
  const nextBtn = () => h("button", { class: "btn quiet small next", type: "button", "data-act": "next", "data-i": String(i) }, isLast ? "See my result" : "Next step", h("kbd", {}, "Enter"));
  const show = (ok, why, label) => {
    out.replaceChildren();
    const v = h("div", { class: "verdict " + (ok ? "ok" : "bad"), role: "status" });
    v.append(h("div", { class: "vh" }, h("b", {}, label || (ok ? "Correct" : "Not quite"))), h("p", {}, why));
    out.append(v, nextBtn());
    card.classList.remove("ok", "bad"); card.classList.add(ok ? "ok" : "bad");
  };
  const focusNext = () => setTimeout(() => { const nb = out.querySelector(".next"); if (nb) nb.focus({ preventScroll: true }); }, 30);
  const L = "ABCDEF";
  if (s.kind === "mcq"){
    const order = seededOrder(s.o.length, C.id + i);
    const box = h("div", { class: "opts", role: "group", "aria-label": "Options" });
    const btns = order.map((j, k) => h("button", { class: "opt", type: "button", "data-j": String(j) }, h("span", { class: "k" }, L[k]), h("span", {}, s.o[j])));
    const lock = sel => btns.forEach(b => { const j = +b.dataset.j; b.disabled = true; if (j === s.a) b.classList.add("right"); else if (j === sel) b.classList.add("wrong"); });
    btns.forEach(b => b.addEventListener("click", () => { const j = +b.dataset.j, ok = j === s.a; if (ok) burst(b); lock(j); record(ok, j); show(ok, s.why); say(ok ? "Correct." : "Not quite."); focusNext(); }));
    card.addEventListener("keydown", e => { if (btns[0].disabled || e.target.matches("textarea,input")) return; const k = { a: 0, b: 1, c: 2, d: 3, e: 4, "1": 0, "2": 1, "3": 2, "4": 3, "5": 4 }[e.key.toLowerCase()]; if (k != null && btns[k]){ e.preventDefault(); btns[k].click(); } });
    box.append(...btns); card.append(box, out);
    if (prev){ lock(prev.v); show(prev.ok, s.why); }
  } else if (s.kind === "multi"){
    const order = seededOrder(s.o.length, C.id + i), right = new Set(s.right);
    const box = h("div", { class: "opts multi", role: "group", "aria-label": "Select all that apply" });
    const btns = order.map((j, k) => h("button", { class: "opt", type: "button", "data-j": String(j), "aria-pressed": "false" }, h("span", { class: "k box" }, ""), h("span", {}, s.o[j])));
    btns.forEach(b => b.addEventListener("click", () => { if (b.disabled) return; b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); }));
    const chk = h("button", { class: "check", type: "button" }, "Check my selection");
    const lock = sel => { chk.remove(); btns.forEach(b => { const j = +b.dataset.j, on = sel.includes(j); b.disabled = true; b.setAttribute("aria-pressed", String(on)); if (right.has(j) && on) b.classList.add("right"); else if (on) b.classList.add("wrong"); else if (right.has(j)) b.classList.add("missed"); }); };
    chk.addEventListener("click", () => {
      const sel = btns.filter(b => b.getAttribute("aria-pressed") === "true").map(b => +b.dataset.j);
      if (!sel.length){ chk.textContent = "Select at least one option"; return; }
      const ok = sel.length === right.size && sel.every(j => right.has(j));
      if (ok) burst(chk);
      lock(sel); record(ok, sel); show(ok, s.why, ok ? "Correct" : `Not quite: ${s.right.length} correct option${s.right.length > 1 ? "s" : ""}`); focusNext();
    });
    box.append(...btns); card.append(box, h("div", { class: "row" }, chk), out);
    if (prev){ lock(prev.v); show(prev.ok, s.why, prev.ok ? "Correct" : `Not quite: ${s.right.length} correct option${s.right.length > 1 ? "s" : ""}`); }
  } else {
    const ta = h("textarea", { class: "tdta", placeholder: "Write as you would in the exam. Saved on this device.", "aria-label": "Your answer" });
    ta.value = prev ? prev.v || "" : "";
    const wc = h("span", { class: "muted small" }, "");
    const count = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = n ? `${n} words` : ""; };
    const reveal = h("button", { class: "btn primary small", type: "button" }, "Compare with the model answer");
    const model = h("div", { class: "tdmodel", hidden: true });
    const ticks = new Set(prev && prev.t ? prev.t : []);
    model.innerHTML = `<div class="ochk"><h3>Key points <span data-osc></span></h3><p class="muted small">Tick each point your answer covers.</p><ul>${s.points.map((p, k) => `<li><label><input type="checkbox" data-tk="${k}" ${ticks.has(k) ? "checked" : ""}><span>${p}</span></label></li>`).join("")}</ul></div><div class="oans"><h3>Model answer</h3><p>${s.model}</p></div>`;
    const sc = () => { model.querySelector("[data-osc]").textContent = `${ticks.size}/${s.points.length}`; };
    const save = () => { const ok = ticks.size / s.points.length >= .6; record(ok, ta.value, { t: [...ticks] }); card.classList.remove("ok", "bad"); card.classList.add(ok ? "ok" : "bad"); };
    let tmr; ta.addEventListener("input", () => { count(); clearTimeout(tmr); tmr = setTimeout(() => { if (P.ans[i]){ P.ans[i].v = ta.value; caseSave(C.id, P); } }, 400); });
    reveal.addEventListener("click", () => { model.hidden = false; reveal.remove(); save(); sc(); out.replaceChildren(h("p", { class: "muted small" }, "Count a point only if your answer states it clearly. 60% of the points counts as right."), nextBtn()); model.scrollIntoView({ behavior: "smooth", block: "nearest" }); });
    model.addEventListener("change", e => { const cb = e.target.closest("[data-tk]"); if (!cb) return; const k = +cb.dataset.tk; if (cb.checked) ticks.add(k); else ticks.delete(k); sc(); save(); });
    card.append(ta, h("div", { class: "orow" }, wc, reveal), model, out);
    count();
    if (prev){ model.hidden = false; reveal.remove(); sc(); out.replaceChildren(h("p", { class: "muted small" }, "Count a point only if your answer states it clearly. 60% of the points counts as right."), nextBtn()); }
  }
  return card;
}
