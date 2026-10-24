/* =====================================================================
   PRACTICE: one module with three tabs (Questions, Flashcards, Exam questions).
   Questions merges the multiple-choice quiz (QUIZ, right answer at o[a] in the data)
   and the classification items (SPOT, the right option is the item's category;
   wrong options come from the same family). Three ways to play: a scored quiz, a streak, a 60 s sprint.
   ===================================================================== */
function spotItem(it){
  const [fam, text, right, why] = it, F = FAMILIES[fam];
  let opts = F.opts.slice();
  if (opts.length > 4){ const others = shuffle(opts.filter(o => o !== right)).slice(0, 3); opts = shuffle([right, ...others]); }
  else if (opts.length > 2) opts = shuffle(opts);
  return { fam, ch: F.ch, q: F.q, text, opts, right: opts.indexOf(right), why, label: right };
}
const prPool = sel => [...QUIZ.filter(q => sel.has(q.ch)).map(d => ({ quiz: d })), ...SPOT.filter(it => sel.has(FAMILIES[it[0]].ch)).map(d => ({ sort: d }))];
function prBuild(x){
  if (x.quiz){ const q = x.quiz, order = shuffle(q.o.map((_, j) => j)); return { ch: q.ch, prompt: "", text: q.q, opts: order.map(j => q.o[j]), right: order.indexOf(q.a), why: q.why, label: q.o[q.a] }; }
  const s = spotItem(x.sort); return { ch: s.ch, prompt: s.q, text: s.text, opts: s.opts, right: s.right, why: s.why, label: s.label, scene: true };
}
const PR_MODES = [["quiz", "Quiz", "A set of questions, your score at the end, your mistakes to retry."], ["streak", "Streak", "Questions without end: how long can you go without a mistake?"], ["sprint", "Sprint 60 s", "As many right answers as you can in one minute."]];
function viewQuestions(pre){
  const sel = new Set(pre && CH[pre] ? [pre] : COURSE.map(c => c.id));
  const root = h("div", { class: "mod", html: `${mhead(LAB_NAME, "Questions", PR_LEDE)}<div class="qzwrap"></div>` });
  const W = root.querySelector(".qzwrap");
  let mode = "quiz", len = 10, Qs = [], i = 0, score = 0, wrong = [], cur = null, streak = 0, ok = 0, tot = 0, deck = [], sprintOn = false, t0 = 0, tick = 0;
  const L = "ABCD";
  const qHtml = (q, head) => `<div class="qzq spotq" style="--c:${CH[q.ch].c}"><div class="qzprog">${head}<span class="tag">${CH[q.ch].short}</span></div>${q.prompt ? `<p class="qprompt">${q.prompt}</p>` : ""}<p class="dqt${q.scene ? " scene" : ""}">${q.text}</p><div class="opts">${q.opts.map((o, j) => `<button class="opt" type="button" data-o="${j}"><span class="k">${L[j]}</span><span>${o}</span></button>`).join("")}</div><div class="dout"></div></div>`;
  function setup(){
    sprintOn = false; cur = null; cancelAnimationFrame(tick);
    const qz = MS.get("quiz", {}), sp = MS.get("spot", { best: 0, sprint: 0 });
    const rec = [qz.last ? `Last quiz: ${qz.last.score}/${qz.last.n} (${Math.round(qz.last.score / qz.last.n * 100)}%)` : "", sp.best ? `best streak ${sp.best}` : "", sp.sprint ? `best sprint ${sp.sprint}` : ""].filter(Boolean).join(" · ");
    W.innerHTML = `<div class="qzsetup"><h2>Choose your questions</h2>
      <div class="mchips">${COURSE.map(c => chipCh(c, sel.has(c.id))).join("")}</div>
      <div class="seg" role="group" aria-label="Mode">${PR_MODES.map(([k, l]) => `<button type="button" data-mode="${k}" aria-pressed="${k === mode}">${l}</button>`).join("")}</div>
      <p class="muted small" data-mdesc>${PR_MODES.find(m => m[0] === mode)[2]}</p>
      <div class="seg" role="group" aria-label="Length" data-lens style="${mode === "quiz" ? "" : "display:none"}">${[10, 20, 0].map(n => `<button type="button" data-len="${n}" aria-pressed="${n === len}">${n || "All"} questions</button>`).join("")}</div>
      <p class="muted" data-avail></p>
      <button class="btn primary big" type="button" data-start>Start</button>
      ${rec ? `<p class="muted small">${rec}.</p>` : ""}</div>`;
    avail();
  }
  const avail = () => { const el = W.querySelector("[data-avail]"); if (el) el.textContent = `${prPool(sel).length} questions available.`; };
  /* scored quiz */
  function start(list){ Qs = list; i = 0; score = 0; wrong = []; show(); }
  function show(){ cur = Qs[i]; cur.done = false; W.innerHTML = qHtml(cur, `<span>${i + 1} / ${Qs.length}</span><div class="mbar"><i style="width:${i / Qs.length * 100}%"></i></div>`); }
  function end(){
    cur = null;
    const pct = Math.round(score / Qs.length * 100), hist = MS.get("quiz", {}); hist.last = { score, n: Qs.length }; hist.count = (hist.count || 0) + 1; MS.set("quiz", hist);
    const byCh = COURSE.map(c => { const qs = Qs.filter(q => q.ch === c.id); return qs.length ? `<div class="bs" style="--c:${c.c}"><b>${qs.filter(q => !wrong.includes(q)).length}/${qs.length}</b><span>${c.short}</span></div>` : ""; }).join("");
    W.innerHTML = `<div class="qzend"><span class="kicker">Quiz finished</span><h2>${pct}% · ${score} of ${Qs.length} right</h2><div class="blocks-sum">${byCh}</div>
      <div class="row">${wrong.length ? `<button class="btn primary" type="button" data-retry>Retry my ${wrong.length} mistake${wrong.length > 1 ? "s" : ""}</button>` : ""}<button class="btn glassy" type="button" data-setup>New questions</button><a class="btn glassy" href="#learn">Back to the course</a></div>
      ${wrong.length ? `<h3>Review</h3><ul class="review">${wrong.map(q => `<li><p class="rq">${q.prompt ? q.prompt + " " : ""}${q.text}</p><p class="ra">${ICO.check}<span>${q.label}</span></p><p class="muted">${q.why}</p></li>`).join("")}</ul>` : ""}</div>`;
    nudgeReview("quiz");
  }
  /* streak and sprint */
  const S = k => W.querySelector(`[data-s="${k}"]`);
  const stats = () => { const s = MS.get("spot", { best: 0, sprint: 0 }); if (!S("streak")) return; S("streak").textContent = streak; S("score").textContent = `${ok}/${tot}`; S("best").textContent = s.best; S("sprint").textContent = s.sprint; };
  function play(){
    streak = 0; ok = 0; tot = 0; deck = [];
    W.innerHTML = `<div class="drillstats"><div><b data-s="streak">0</b><span>streak</span></div><div><b data-s="best">0</b><span>best streak</span></div><div><b data-s="score">0/0</b><span>this session</span></div><div><b data-s="sprint">0</b><span>best sprint</span></div></div>
      <div class="timer"${mode === "sprint" ? "" : " hidden"}><i></i></div><div class="prq"></div><div class="row prback"><button class="btn quiet small" type="button" data-setup>${ICO.back}Change the questions</button></div>`;
    stats();
    if (mode === "sprint"){ sprintOn = true; t0 = performance.now(); cancelAnimationFrame(tick); tick = requestAnimationFrame(run); }
    nextPlay();
  }
  function nextPlay(){
    if (!deck.length) deck = shuffle(prPool(sel));
    cur = prBuild(deck.pop()); cur.done = false;
    W.querySelector(".prq").innerHTML = qHtml(cur, `<span>${mode === "sprint" ? "Sprint" : "Streak"}</span>`);
  }
  function run(){
    if (!root.isConnected || !sprintOn) return;
    const left = 1 - (performance.now() - t0) / 60000, bar = W.querySelector(".timer i"); if (bar) bar.style.width = Math.max(0, left * 100) + "%";
    if (left > 0){ tick = requestAnimationFrame(run); return; }
    sprintOn = false; cur = null;
    const s = MS.get("spot", { best: 0, sprint: 0 }), rec = ok > s.sprint; if (rec){ s.sprint = ok; MS.set("spot", s); } stats();
    W.querySelector(".prq").innerHTML = `<div class="sprintend"><span class="kicker">Time</span><h2>${ok} right out of ${tot}</h2><p class="muted">${rec ? "New personal best." : `Your best is ${s.sprint}.`}</p><div class="row"><button class="btn primary" type="button" data-again>Go again</button></div></div>`;
    nudgeReview("sprint");
  }
  /* an answer, in any mode */
  function pick(j){
    if (!cur || cur.done) return;
    cur.done = true; const good = j === cur.right, box = W.querySelector(".qzq");
    box.querySelectorAll(".opt").forEach((b, k) => { b.disabled = true; if (k === cur.right) b.classList.add("right"); else if (k === j) b.classList.add("wrong"); });
    if (good) burst(box.querySelectorAll(".opt")[j]);
    box.classList.add(good ? "ok" : "bad");
    let nxt = "Next";
    if (mode === "quiz"){ if (good) score++; else wrong.push(cur); nxt = i + 1 < Qs.length ? "Next question" : "See my score"; }
    else {
      tot++; if (good){ ok++; streak++; } else streak = 0;
      const s = MS.get("spot", { best: 0, sprint: 0 }); if (streak > s.best){ s.best = streak; MS.set("spot", s); }
      stats(); if (good) bump(S("streak"));
      if (tot === 15 && mode === "streak") nudgeReview("spot");
    }
    box.querySelector(".dout").innerHTML = `<div class="verdict ${good ? "ok" : "bad"}"><div class="vh"><b>${good ? "Correct" : "Not quite"}</b>${good ? "" : `<span>It is <b>${cur.label}</b>.</span>`}</div><p>${cur.why}</p></div><button class="btn quiet small next" type="button" data-next>${nxt} ${ICO.arrow}<kbd>Enter</kbd></button>`;
    box.querySelector("[data-next]").focus({ preventScroll: true });
    if (mode === "sprint" && sprintOn){ const c0 = cur; setTimeout(() => { if (cur === c0 && sprintOn) nextPlay(); }, good ? 500 : 1500); }
  }
  function advance(){ if (mode === "quiz"){ i++; if (i < Qs.length) show(); else end(); } else if (mode === "streak" || sprintOn) nextPlay(); }
  root.addEventListener("click", e => {
    const cb = e.target.closest("[data-ch]");
    if (cb){ const k = cb.dataset.ch; if (sel.has(k) && sel.size > 1) sel.delete(k); else sel.add(k); cb.classList.toggle("on", sel.has(k)); cb.setAttribute("aria-pressed", String(sel.has(k))); avail(); return; }
    const mb = e.target.closest("[data-mode]");
    if (mb){ mode = mb.dataset.mode; W.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b === mb))); W.querySelector("[data-mdesc]").textContent = PR_MODES.find(m => m[0] === mode)[2]; W.querySelector("[data-lens]").style.display = mode === "quiz" ? "" : "none"; return; }
    const lb = e.target.closest("[data-len]");
    if (lb){ len = +lb.dataset.len; W.querySelectorAll("[data-len]").forEach(b => b.setAttribute("aria-pressed", String(b === lb))); return; }
    if (e.target.closest("[data-start]")){ if (mode === "quiz"){ const pool = shuffle(prPool(sel)); start((len ? pool.slice(0, len) : pool).map(prBuild)); } else play(); return; }
    const ob = e.target.closest("[data-o]"); if (ob){ pick(+ob.dataset.o); return; }
    if (e.target.closest("[data-next]")){ advance(); return; }
    if (e.target.closest("[data-retry]")){ start(shuffle(wrong.map(q => ({ ...q, done: false })))); return; }
    if (e.target.closest("[data-again]")){ play(); return; }
    if (e.target.closest("[data-setup]")) setup();
  });
  const onKey = e => {
    if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; }
    if (!cur || (e.target.matches && e.target.matches("input,textarea")) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Enter" && cur.done){ e.preventDefault(); advance(); return; }
    const k = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 }[e.key.toLowerCase()];
    if (k != null && !cur.done && k < cur.opts.length){ e.preventDefault(); pick(k); }
  };
  document.addEventListener("keydown", onKey);
  setup();
  return root;
}

/* the module: one heading, three tabs; each tab keeps its own view (and its listeners) */
const PR_TABS = [["q", "Questions", "#practice"], ["cards", "Flashcards", "#practice-cards"], ["open", "Exam questions", "#practice-open"]];
function viewPractice(tab, ch){
  const view = tab === "cards" ? viewCards(ch) : tab === "open" ? viewOpen() : viewQuestions(ch);
  MS.set("practice", tab);
  const mh = view.querySelector(".mhead"), k = mh && mh.querySelector(".kicker");
  if (k) k.textContent = `${LAB_NAME} · Practice`;
  const n = { q: QUIZ.length + SPOT.length, cards: CARDS.length, open: OPEN.length };
  const tabs = `<nav class="prtabs" aria-label="Practice">${PR_TABS.map(([t, l, href]) => `<a href="${href}${t !== "open" && ch && CH[ch] ? "-" + ch : ""}" aria-current="${t === tab ? "page" : "false"}">${l}<span>${n[t]}</span></a>`).join("")}</nav>`;
  if (mh) mh.insertAdjacentHTML("afterend", tabs); else view.insertAdjacentHTML("afterbegin", tabs);
  return view;
}
/* old links (#sort, #spot, #quiz, #cards, #open, with or without a chapter) lead to the right tab */
function practiceHash(hs){
  let m = hs.match(/^(?:sort|spot|quiz)(?:-(\w+))?$/); if (m) return "practice" + (m[1] ? "-" + m[1] : "");
  m = hs.match(/^cards(?:-(\w+))?$/); if (m) return "practice-cards" + (m[1] ? "-" + m[1] : "");
  if (hs === "open") return "practice-open";
  return null;
}
function practiceRoute(hs){
  if (hs === "practice") return { view: "practice", id: { tab: "q" } };
  if (hs === "practice-open") return { view: "practice", id: { tab: "open" } };
  let m = hs.match(/^practice-cards(?:-(\w+))?$/); if (m) return { view: "practice", id: { tab: "cards", ch: m[1] } };
  m = hs.match(/^practice-(\w+)$/); if (m) return { view: "practice", id: { tab: "q", ch: m[1] } };
  return null;
}
