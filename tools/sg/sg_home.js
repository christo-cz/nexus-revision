/* ---------- routing ---------- */
function route(){
  const hs = location.hash.slice(1);
  if (hs === "learn") return { view: "learn" };
  if (/^learn-\w+$/.test(hs)) return { view: "chapter", id: hs.slice(6) };
  if (hs === "studio") return { view: "studio" };
  if (hs === "studio-free") return { view: "free" };
  if (hs === "studio-drills") return { view: "cdrills" };
  if (/^studio-\w+$/.test(hs)) return { view: "case", id: hs.slice(7) };
  if (hs === "sort" || /^sort-\w+$/.test(hs)) return { view: "sort", id: hs.slice(5) };
  if (hs === "figures") return { view: "figures" };
  if (hs === "quiz" || /^quiz-\w+$/.test(hs)) return { view: "quiz", id: hs.slice(5) };
  if (hs === "cards" || /^cards-\w+$/.test(hs)) return { view: "cards", id: hs.slice(6) };
  if (hs === "open") return { view: "open" };
  if (/^open-\w+$/.test(hs)) return { view: "openq", id: hs.slice(5) };
  if (hs === "exam") return { view: "exam" };
  if (hs === "recap") return { view: "recap" };
  return { view: "home" };
}
function go(hash){ if (location.hash === "#" + hash) render(); else location.hash = hash; }
const words = s => s.split(" ").map((w, i) => `<span class="w" style="animation-delay:${i * 80 + 100}ms">${w}</span>`).join(" ");
const RND = (a, b) => a + Math.random() * (b - a);

/* ---------- overview: the modules ---------- */
const MOD_ICONS = {
  learn: '<path d="M4 5h7a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4zM20 5h-5a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h6z"/>',
  studio: '<circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="8" r="2.6"/><circle cx="10" cy="18" r="2.6"/><path d="M8.5 6.6 15.4 7.6M16.6 10.3l-4.8 5.6M8.8 15.6 6.8 8.5"/>',
  sort: '<path d="M4 6h10M4 12h7M4 18h4M17 4v16M14 17l3 3 3-3"/>',
  figures: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17v.5"/>',
  cards: '<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v10"/>',
  open: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13 7l4 4"/>',
  exam: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'
};
function modulesHtml(){
  const L = learnStats(), st = studioState(), sp = MS.get("spot", { best: 0, sprint: 0 }), qz = MS.get("quiz", {}), fk = Object.keys(MS.get("cards", {})).length, op = Object.values(openState().ticks || {}).filter(t => t.length).length, ex = MS.get("exam", null), fg = Object.keys(MS.get("figs", {})).length;
  const done = CLD.filter(d => (st[d.id] || {}).best != null).length;
  const M = [
    ["#learn", "Learn", "The six sessions and the tutorial in short cards, with eighteen interactive models.", `${L.known}/${L.total} cards known`, "var(--pri)", "learn"],
    ["#studio", "Causal studio", "Draw the course's causal diagrams and get each link checked. Free board, loops found for you, drills.", done ? `${done}/${CLD.length} diagrams drawn` : `${CLD.length} diagrams`, "var(--c4)", "studio"],
    ["#sort", "Sort it", "Environmental, social or economic? Macro, meso or micro? Which scenario, which boundary? Streaks and a sprint.", sp.best ? `best streak ${sp.best}` : `${SPOT.length} items`, "var(--c5)", "sort"],
    ["#figures", "Key figures", "Every number and study shown in class, with the lesson to draw. Hide the numbers and test yourself.", `${fg}/${FIGS.length} known`, "var(--c3)", "figures"],
    ["#quiz", "Quiz", "Exam-style multiple choice on every session, each answer explained.", qz.last ? `last ${Math.round(qz.last.score / qz.last.n * 100)}%` : `${QUIZ.length} questions`, "var(--c1)", "quiz"],
    ["#cards", "Flashcards", "Definitions, authors, dates and models to flip.", `${fk}/${CARDS.length} known`, "var(--c2)", "cards"],
    ["#open", "Exam questions", "Define and explain the key notions, and draw the diagrams, with model answers and key points.", `${op}/${OPEN.length} tried`, "var(--pri)", "open"],
    ["#exam", "Mock exam", "Timed: explain notions, then draw a causal diagram, marked against the key points.", ex && ex.score != null ? `last ${ex.score}%` : "60 or 90 min", "var(--c4)", "exam"]
  ];
  return `<section class="sec"><div class="sec-h"><h2>Revise</h2><p>Learn the notions, then practise the three things the exam asks: define, explain with evidence, draw the causal diagram.</p></div>
    <div class="mods mods4">${M.map(m => `<a class="modt" href="${m[0]}" style="--c:${m[4]}"><span class="mi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${MOD_ICONS[m[5]]}</svg></span><b>${m[1]}</b><span class="md">${m[2]}</span><span class="ms">${m[3]}</span></a>`).join("")}</div></section>`;
}

/* ---------- overview ---------- */
function viewHome(){
  const L = learnStats(), st = studioState(), done = CLD.filter(d => (st[d.id] || {}).best != null).length;
  return h("div", { class: "ov", html: `
  <section class="fhero swarm sys" aria-label="Societal and Global Challenges">
    <canvas aria-hidden="true"></canvas>
    <div class="fh-in">
      <p class="kicker">BBA1, semester 1 · six sessions and a tutorial</p>
      <h1 class="ov-title mg-title"><span class="clip">${words("Societal and")}</span><span class="clip">${words("Global Challenges")}</span></h1>
      <div class="forms" role="group" aria-label="Views of the heatwave system">${SYS_VIEWS.map((f, i) => `<button type="button" data-view="${i}" aria-pressed="${i === 0}"><i>${i + 1}</i>${f.name}</button>`).join("")}</div>
      <p class="formdef" aria-live="polite"><b>${SYS_VIEWS[0].name}.</b> ${SYS_VIEWS[0].def}</p>
      <p class="lede">Heatwaves, planetary boundaries, the Doughnut, poverty, growth: the course in cards and live models, a studio to draw causal diagrams, and every key notion with a model answer.</p>
      <div class="row"><a class="btn primary big" href="#learn">${L.known ? "Continue learning" : "Start with Learn"}</a><a class="btn glassy big" href="#studio">Draw a causal diagram</a></div>
      ${L.known || done ? `<div class="mystats" aria-label="Your progress"><div><b class="num">${L.known}/${L.total}</b><span>cards known</span></div><div><b class="num">${done}/${CLD.length}</b><span>diagrams drawn</span></div><div><b class="num">${Object.values(openState().ticks || {}).filter(t => t.length).length}</b><span>exam answers written</span></div></div>` : ""}
    </div>
  </section>
  <div class="page">
  ${modulesHtml()}
  <section class="exam mgexam" aria-label="How the course is graded">
    <div><h2>The individual exam is 80%</h2><p>Organized by the Hub, on all the slides of sessions 1 to 8. Expect to define the key concepts, to explain the lessons of the empirical research shown in class, and, very likely, to draw a causal diagram.</p>
      <ul class="legend legend2"><li><i class="sw" style="background:var(--pri)"></i><b>80%</b>Individual exam</li><li><i class="sw" style="background:var(--c4)"></i><b>20%</b>Group work in class</li></ul></div>
    <div><div class="split" aria-hidden="true"><i style="width:80%;background:var(--pri)"></i><i style="width:20%;background:var(--c4)"></i></div>
      <ol class="mstep"><li><b>Define</b><span>The notion in one precise sentence, with its author and date when the course gives them.</span></li><li><b>Explain the mechanism</b><span>Causes, effects, loops: say why, not only what. A small causal diagram often says it best.</span></li><li><b>Back it with evidence</b><span>One figure or study from class, and the lesson it supports.</span></li></ol></div>
  </section>
  <section class="sec" id="reviews" aria-label="Reviews"></section>
  ${creditHtml()}
  <footer class="foot"><span>Part of <a href="/">Nexus</a>, a student project to help with revision. Not an official EDHEC website.</span><span>Your progress is saved in this browser only.</span></footer>
  </div>` });
}

/* ---------- key figures: the evidence from class ---------- */
function viewFigures(){
  const known = MS.get("figs", {});
  let hide = false;
  const root = h("div", { class: "mod figures", html: `${mhead("Societal and Global Challenges", "Key figures", "The exam asks you to understand the lessons drawn from the research shown in class. Here is every figure, its source and its lesson. Hide the numbers to test yourself.",
    `<div class="row"><button class="btn glassy small" type="button" data-hide aria-pressed="false">Hide the numbers</button><span class="muted small" data-n></span></div>`)}
  ${COURSE.map(c => { const fs = FIGS.map((f, i) => [f, i]).filter(([f]) => f[0] === c.id); return fs.length ? `<section class="figsec" style="--c:${c.c}"><h2>${c.n}. ${c.title}</h2><div class="figgrid">${fs.map(([f, i]) => `<article class="fig${known[i] ? " known" : ""}" data-f="${i}"><button class="fignum" type="button" data-reveal aria-label="Show the figure"><span>${esc(f[1])}</span></button><p class="figwhat">${f[2]}</p><p class="figlesson">${f[4]}</p><div class="figfoot"><span>${esc(f[3])}</span><button type="button" class="gotit" data-fk="${i}" aria-pressed="${!!known[i]}">${ICO.check}<span>${known[i] ? "Known" : "I know it"}</span></button></div></article>`).join("")}</div></section>` : ""; }).join("")}
  ${creditHtml()}` });
  const count = () => { const k = MS.get("figs", {}); root.querySelector("[data-n]").textContent = `${Object.keys(k).length} of ${FIGS.length} known`; };
  root.addEventListener("click", e => {
    const hb = e.target.closest("[data-hide]"); if (hb){ hide = !hide; hb.setAttribute("aria-pressed", String(hide)); hb.textContent = hide ? "Show the numbers" : "Hide the numbers"; root.classList.toggle("hidenum", hide); root.querySelectorAll(".fig").forEach(f => f.classList.remove("shown")); return; }
    const rv = e.target.closest("[data-reveal]"); if (rv && hide){ rv.closest(".fig").classList.add("shown"); return; }
    const k = e.target.closest("[data-fk]"); if (k){ const all = MS.get("figs", {}), i = k.dataset.fk; if (all[i]) delete all[i]; else all[i] = 1; MS.set("figs", all); const on = !!all[i]; if (on) burst(k, ["--ok", "--pri"]); k.setAttribute("aria-pressed", String(on)); k.querySelector("span").textContent = on ? "Known" : "I know it"; k.closest(".fig").classList.toggle("known", on); count(); if (Object.keys(all).length === FIGS.length) nudgeReview("figures"); }
  });
  count();
  return root;
}
