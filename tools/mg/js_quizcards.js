/* ---------------- QUIZ: exam-style multiple choice ---------------- */
function viewQuiz(pre){
  const sel = new Set(pre && CH[pre] ? [pre] : COURSE.map(c => c.id));
  const root = h("div", { class: "mod", html: `${mhead("Macroeconomics", "Quiz", "Exam-style multiple choice on the lectures. Every answer comes with its explanation.")}<div class="qzwrap"></div>` });
  const W = root.querySelector(".qzwrap");
  let len = 10, Qs = [], i = 0, score = 0, wrong = [];
  function setup(){
    const hist = MS.get("quiz", {});
    W.innerHTML = `<div class="qzsetup"><h2>Choose your quiz</h2>
      <div class="mchips">${COURSE.map(c => chipCh(c, sel.has(c.id))).join("")}</div>
      <div class="seg" role="group" aria-label="Length">${[10, 20, 0].map(n => `<button type="button" data-len="${n}" aria-pressed="${n === len}">${n || "All"} questions</button>`).join("")}</div>
      <p class="muted" data-avail></p>
      <button class="btn primary big" type="button" data-start>Start the quiz</button>
      ${hist.last ? `<p class="muted small">Last quiz: ${hist.last.score}/${hist.last.n} (${Math.round(hist.last.score / hist.last.n * 100)}%).</p>` : ""}</div>`;
    const avail = () => { W.querySelector("[data-avail]").textContent = `${QUIZ.filter(q => sel.has(q.ch)).length} questions available.`; };
    avail();
    W.onclick = e => {
      const cb = e.target.closest("[data-ch]"); if (cb){ const k = cb.dataset.ch; if (sel.has(k) && sel.size > 1) sel.delete(k); else sel.add(k); cb.classList.toggle("on", sel.has(k)); cb.setAttribute("aria-pressed", String(sel.has(k))); avail(); }
      const lb = e.target.closest("[data-len]"); if (lb){ len = +lb.dataset.len; W.querySelectorAll("[data-len]").forEach(b => b.setAttribute("aria-pressed", String(b === lb))); }
      if (e.target.closest("[data-start]")){ const pool = shuffle(QUIZ.filter(q => sel.has(q.ch))); start(len ? pool.slice(0, len) : pool); }
    };
  }
  function start(list){ Qs = list.map(q => { const order = shuffle(q.o.map((_, j) => j)); return { ...q, order }; }); i = 0; score = 0; wrong = []; show(); }
  function show(){
    const q = Qs[i], c = CH[q.ch], L = "ABCD";
    W.innerHTML = `<div class="qzq" style="--c:${c.c}"><div class="qzprog"><span>${i + 1} / ${Qs.length}</span><div class="mbar"><i style="width:${i / Qs.length * 100}%"></i></div><span class="tag">${c.short}</span></div>
      <p class="dqt">${q.q}</p><div class="opts">${q.order.map((j, k) => `<button class="opt" type="button" data-pick="${j}"><span class="k">${L[k]}</span><span>${q.o[j]}</span></button>`).join("")}</div><div class="dout"></div></div>`;
    W.onclick = e => {
      const pb = e.target.closest("[data-pick]");
      if (pb && !q.done){ q.done = true; const j = +pb.dataset.pick, good = j === q.a; if (good){ score++; burst(pb); } else wrong.push(q);
        W.querySelectorAll(".opt").forEach(b => { b.disabled = true; const v = +b.dataset.pick; if (v === q.a) b.classList.add("right"); else if (v === j) b.classList.add("wrong"); });
        const box = W.querySelector(".qzq"); box.classList.add(good ? "ok" : "bad");
        W.querySelector(".dout").innerHTML = `<div class="verdict ${good ? "ok" : "bad"}"><div class="vh"><b>${good ? "Correct" : "Not quite"}</b></div><p>${q.why}</p></div><button class="btn quiet small next" type="button" data-nx>${i + 1 < Qs.length ? "Next question" : "See my score"} ${ICO.arrow}<kbd>Enter</kbd></button>`;
        W.querySelector("[data-nx]").focus({ preventScroll: true }); }
      if (e.target.closest("[data-nx]")){ i++; if (i < Qs.length) show(); else end(); }
    };
  }
  function end(){
    const pct = Math.round(score / Qs.length * 100), hist = MS.get("quiz", {}); hist.last = { score, n: Qs.length }; hist.count = (hist.count || 0) + 1; MS.set("quiz", hist);
    const byCh = COURSE.map(c => { const qs = Qs.filter(q => q.ch === c.id); return qs.length ? `<div class="bs" style="--c:${c.c}"><b>${qs.filter(q => !wrong.includes(q)).length}/${qs.length}</b><span>${c.short}</span></div>` : ""; }).join("");
    W.innerHTML = `<div class="qzend"><span class="kicker">Quiz finished</span><h2>${pct}% · ${score} of ${Qs.length} right</h2><div class="blocks-sum">${byCh}</div>
      <div class="row">${wrong.length ? `<button class="btn primary" type="button" data-retry>Retry my ${wrong.length} mistake${wrong.length > 1 ? "s" : ""}</button>` : ""}<button class="btn glassy" type="button" data-new>New quiz</button><a class="btn glassy" href="#learn">Back to the course</a></div>
      ${wrong.length ? `<h3>Review</h3><ul class="review">${wrong.map(q => `<li><p class="rq">${q.q}</p><p class="ra">${ICO.check}<span>${q.o[q.a]}</span></p><p class="muted">${q.why}</p></li>`).join("")}</ul>` : ""}</div>`;
    W.onclick = e => { if (e.target.closest("[data-retry]")) start(shuffle(wrong.map(q => ({ ...q, done: false })))); if (e.target.closest("[data-new]")) setup(); };
    nudgeReview("quiz");
  }
  root.addEventListener("keydown", e => {
    if (e.target.matches("input,textarea")) return;
    if (e.key === "Enter"){ const nx = W.querySelector("[data-nx]"); if (nx){ e.preventDefault(); nx.click(); } return; }
    const k = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 }[e.key.toLowerCase()];
    if (k != null){ const b = W.querySelectorAll(".opt:not([disabled])")[k]; if (b){ e.preventDefault(); b.click(); } }
  });
  setup();
  return root;
}

/* ---------------- FLASHCARDS ---------------- */
function viewCards(pre){
  const sel = new Set(pre && CH[pre] ? [pre] : COURSE.map(c => c.id));
  const root = h("div", { class: "mod", html: `${mhead("Macroeconomics", "Flashcards", "Say the answer out loud, then flip. Cards you know leave the pile; the others come back.")}
    <div class="drillbar"><div class="mchips">${COURSE.map(c => chipCh(c, sel.has(c.id))).join("")}</div><div class="seg"><button type="button" data-shuffle>Shuffle</button><button type="button" data-resetk>Reset known</button></div></div>
    <div class="mprog"><div class="mbar"><i data-fbar></i></div><span data-fcount></span></div>
    <div class="fstage"></div>` });
  const stage = root.querySelector(".fstage");
  let deck = [];
  const known = () => MS.get("cards", {});
  const build = (mix) => { const k = known(); deck = CARDS.map((c, i) => ({ i, ch: c[0], f: c[1], b: c[2] })).filter(c => sel.has(c.ch) && !k[c.i]); if (mix) deck = shuffle(deck); paint(); };
  function paint(){
    const k = known(), total = CARDS.filter(c => sel.has(c[0])).length, kn = CARDS.filter((c, i) => sel.has(c[0]) && k[i]).length;
    root.querySelector("[data-fbar]").style.width = (total ? kn / total * 100 : 0) + "%"; root.querySelector("[data-fcount]").textContent = `${kn} of ${total} known · ${deck.length} left in the pile`;
    if (!deck.length){ stage.innerHTML = `<div class="sprintend"><span class="kicker">Pile empty</span><h2>You know all ${total} cards</h2><div class="row"><button class="btn primary" type="button" data-resetk>Start over</button><a class="btn glassy" href="#quiz">Take a quiz</a></div></div>`; return; }
    const c = deck[0], C = CH[c.ch];
    stage.innerHTML = `<div class="fdeck" data-n="${Math.min(2, deck.length - 1)}"><button class="flip enter" type="button" aria-label="Flip the card" style="--c:${C.c}"><span class="face front"><em>${C.short}</em><b>${c.f}</b><small>Click or press Space to flip</small></span><span class="face back"><em>${c.f}</em><b>${c.b}</b></span></button></div>
      <div class="fact"><button class="btn glassy big" type="button" data-again>Again <kbd>←</kbd></button><button class="btn primary big" type="button" data-know>I knew it <kbd>→</kbd></button></div>`;
  }
  const flip = () => { const f = stage.querySelector(".flip"); if (f) f.classList.toggle("on"); };
  /* the card leaves the deck: to the right when known, to the back when it comes again */
  let busy = false;
  const leave = (dir, fn) => { const f = stage.querySelector(".flip"); if (busy) return; if (!f || matchMedia("(prefers-reduced-motion: reduce)").matches){ fn(); return; } busy = true; f.classList.add("fly-" + dir); setTimeout(() => { busy = false; fn(); }, 260); };
  const again = () => { if (!deck.length) return; leave("l", () => { deck.push(deck.shift()); paint(); }); };
  const got = () => { if (!deck.length) return; burst(stage.querySelector("[data-know]"), ["--ok", "--flow", "--inj"]); leave("r", () => { const k = known(); k[deck[0].i] = 1; MS.set("cards", k); deck.shift(); paint(); if (!deck.length) nudgeReview("deck"); }); };
  root.addEventListener("click", e => {
    const cb = e.target.closest("[data-ch]"); if (cb){ const k = cb.dataset.ch; if (sel.has(k) && sel.size > 1) sel.delete(k); else sel.add(k); cb.classList.toggle("on", sel.has(k)); cb.setAttribute("aria-pressed", String(sel.has(k))); build(true); }
    if (e.target.closest(".flip")) flip();
    if (e.target.closest("[data-again]")) again();
    if (e.target.closest("[data-know]")) got();
    if (e.target.closest("[data-shuffle]")) build(true);
    if (e.target.closest("[data-resetk]")){ const k = known(); CARDS.forEach((c, i) => { if (sel.has(c[0])) delete k[i]; }); MS.set("cards", k); build(true); }
  });
  const onKey = e => { if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; } if (e.target.matches && e.target.matches("input,textarea")) return;
    if (e.key === " "){ e.preventDefault(); flip(); } if (e.key === "ArrowLeft") again(); if (e.key === "ArrowRight") got(); };
  document.addEventListener("keydown", onKey);
  build(true);
  return root;
}

