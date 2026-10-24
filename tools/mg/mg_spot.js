/* =====================================================================
   SPOT IT: name what you see. Wrong options come from the same family (all biases, all justice types...).
   ===================================================================== */
function spotItem(it){
  const [fam, text, right, why] = it, F = FAMILIES[fam];
  let opts = F.opts.slice();
  if (opts.length > 4){ const others = shuffle(opts.filter(o => o !== right)).slice(0, 3); opts = shuffle([right, ...others]); }
  else if (opts.length > 2) opts = shuffle(opts);
  return { fam, ch: F.ch, q: F.q, text, opts, right: opts.indexOf(right), why, label: right };
}
function viewSpot(pre){
  const sel = new Set(pre && CH[pre] ? [pre] : COURSE.map(c => c.id));
  const st0 = MS.get("spot", { best: 0, sprint: 0 });
  const root = h("div", { class: "mod", html: `
  ${mhead("Management and Organizations", "Spot it", "Short workplace scenes. Name the bias, the need, the factor or the type of justice. The exam asks you to apply concepts: this is the reflex to train.")}
  <div class="drillbar"><div class="mchips">${COURSE.map(c => chipCh(c, sel.has(c.id))).join("")}</div>
    <div class="seg" role="group" aria-label="Mode"><button type="button" data-mode="practice" aria-pressed="true">Practice</button><button type="button" data-mode="sprint" aria-pressed="false">Sprint 60 s</button></div></div>
  <div class="drillstats"><div><b data-s="streak">0</b><span>streak</span></div><div><b data-s="best">${st0.best}</b><span>best streak</span></div><div><b data-s="score">0/0</b><span>this session</span></div><div><b data-s="sprint">${st0.sprint}</b><span>best sprint</span></div></div>
  <div class="timer" hidden><i></i></div>
  <article class="dq spotq" aria-live="polite"></article>` });
  let mode = "practice", streak = 0, ok = 0, tot = 0, cur = null, t0 = 0, tick = 0, sprintOn = false, deck = [];
  const dq = root.querySelector(".dq"), S = k => root.querySelector(`[data-s="${k}"]`), timer = root.querySelector(".timer");
  const stats = () => { const s = MS.get("spot", { best: 0, sprint: 0 }); S("streak").textContent = streak; S("score").textContent = `${ok}/${tot}`; S("best").textContent = s.best; S("sprint").textContent = s.sprint; };
  const refill = () => { deck = shuffle(SPOT.filter(it => sel.has(FAMILIES[it[0]].ch))); };
  function next(){
    if (!deck.length) refill();
    if (!deck.length){ dq.innerHTML = `<p class="muted">Pick at least one lecture.</p>`; return; }
    cur = spotItem(deck.pop()); cur.done = false; dq.classList.remove("ok", "bad");
    const c = CH[cur.ch], L = "ABCD";
    dq.style.setProperty("--c", c.c);
    dq.innerHTML = `<div class="qzprog"><span class="tag">${c.short}</span><span>${cur.q}</span></div><p class="dqt scene">${cur.text}</p><div class="opts">${cur.opts.map((o, j) => `<button class="opt" type="button" data-o="${j}"><span class="k">${L[j]}</span><span>${o}</span></button>`).join("")}</div><div class="dout"></div>`;
  }
  function verdict(good){
    cur.done = true; tot++; if (good){ ok++; streak++; } else streak = 0;
    const s = MS.get("spot", { best: 0, sprint: 0 }); if (streak > s.best){ s.best = streak; MS.set("spot", s); }
    stats(); if (good) bump(S("streak"));
    if (tot === 15 && mode === "practice") nudgeReview("spot");
    dq.classList.add(good ? "ok" : "bad");
    dq.querySelector(".dout").innerHTML = `<div class="verdict ${good ? "ok" : "bad"}"><div class="vh"><b>${good ? "Correct" : "Not quite"}</b>${good ? "" : `<span>It is <b>${cur.label}</b>.</span>`}</div><p>${cur.why}</p></div><button class="btn quiet small next" type="button" data-next>Next ${ICO.arrow}<kbd>Enter</kbd></button>`;
    dq.querySelector("[data-next]").focus({ preventScroll: true });
    if (mode === "sprint" && sprintOn) setTimeout(() => { if (cur.done && sprintOn) next(); }, good ? 500 : 1500);
  }
  root.addEventListener("click", e => {
    const cb = e.target.closest("[data-ch]");
    if (cb){ const k = cb.dataset.ch; if (sel.has(k) && sel.size > 1) sel.delete(k); else sel.add(k); cb.classList.toggle("on", sel.has(k)); cb.setAttribute("aria-pressed", String(sel.has(k))); refill(); next(); }
    const mb = e.target.closest("[data-mode]");
    if (mb){ mode = mb.dataset.mode; root.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b === mb))); streak = 0; ok = 0; tot = 0; stats(); if (mode === "sprint") startSprint(); else { sprintOn = false; timer.hidden = true; next(); } }
    const ob = e.target.closest("[data-o]");
    if (ob && cur && !cur.done){ const j = +ob.dataset.o; if (j === cur.right) burst(ob); dq.querySelectorAll(".opt").forEach((b, i) => { b.disabled = true; if (i === cur.right) b.classList.add("right"); else if (i === j) b.classList.add("wrong"); }); verdict(j === cur.right); }
    if (e.target.closest("[data-next]")) next();
    if (e.target.closest("[data-again]")) startSprint();
  });
  const onKey = e => {
    if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; }
    if (!cur || (e.target.matches && e.target.matches("input,textarea"))) return;
    if (e.key === "Enter" && cur.done){ e.preventDefault(); next(); return; }
    const k = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 }[e.key.toLowerCase()];
    if (k != null && !cur.done){ const b = dq.querySelectorAll(".opt")[k]; if (b){ e.preventDefault(); b.click(); } }
  };
  document.addEventListener("keydown", onKey);
  function startSprint(){
    sprintOn = true; ok = 0; tot = 0; streak = 0; stats(); timer.hidden = false; t0 = performance.now(); refill(); next();
    cancelAnimationFrame(tick);
    const run = () => { if (!root.isConnected){ sprintOn = false; return; } const left = 1 - (performance.now() - t0) / 60000; timer.firstChild.style.width = Math.max(0, left * 100) + "%";
      if (left <= 0){ sprintOn = false; const s = MS.get("spot", { best: 0, sprint: 0 }), rec = ok > s.sprint; if (rec){ s.sprint = ok; MS.set("spot", s); } stats();
        dq.classList.remove("ok", "bad"); cur = null; dq.innerHTML = `<div class="sprintend"><span class="kicker">Time</span><h2>${ok} right out of ${tot}</h2><p class="muted">${rec ? "New personal best." : `Your best is ${s.sprint}.`}</p><div class="row"><button class="btn primary" type="button" data-again>Go again</button></div></div>`; nudgeReview("sprint"); return; }
      tick = requestAnimationFrame(run); };
    tick = requestAnimationFrame(run);
  }
  refill(); requestAnimationFrame(next);
  return root;
}
