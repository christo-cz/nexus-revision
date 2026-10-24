/* ---------------- LEARN: index ---------------- */
function viewLearn(){
  const all = learnStats();
  return h("div", { class: "mod", html: `
  ${mhead("Macroeconomics", "Learn the course", "Four chapters, cut into short cards: the rule in one line, the formula, an example, the trap, and what the exam wants. Tick each card when you know it.",
    `<div class="mprog"><div class="mbar"><i style="width:${all.total ? all.known / all.total * 100 : 0}%"></i></div><span>${all.known} of ${all.total} cards known</span></div><div class="row"><a class="btn glassy small" href="#recap">One-page recap</a><button class="btn glassy small" type="button" data-search>Search the course</button></div>`)}
  <section class="chgrid">${COURSE.map(c => { const s = learnStats(c.id), started = s.known > 0;
    return `<a class="chtile" href="#learn-${c.id}" style="--c:${c.c}">
      <span class="chn">${String(c.n).padStart(2, "0")}</span>
      <h2>${c.title}</h2><p>${c.intro}</p>
      <div class="chfoot"><span class="ring" style="--p:${s.total ? s.known / s.total : 0}"><b>${s.known}/${s.total}</b></span><span class="chgo">${s.known === s.total ? "Review" : started ? "Continue" : "Start"} ${ICO.arrow}</span></div>
    </a>`; }).join("")}</section>
  <section class="sec"><div class="sec-h"><h2>A good order to revise</h2></div>
    <ol class="steps">
      <li><b>Read a chapter</b><span>Card by card. Tick what you could explain to a friend.</span></li>
      <li><b>Test it</b><span>Run the chapter quiz and read every explanation, even when you are right.</span></li>
      <li><b>Drill the numbers</b><span>Short exercises until the formulas are automatic.</span></li>
      <li><b>Write one open answer</b><span>Then compare with the model answer and tick the key points.</span></li>
    </ol></section>
  ${creditHtml()}` });
}

/* ---------------- LEARN: a chapter ---------------- */
function noteCard(k, known){
  return `<article class="note${known ? " known" : ""}" id="n-${k.id}" data-note="${k.id}">
    <div class="note-h"><h3>${k.title}</h3><button class="gotit" type="button" data-know="${k.id}" aria-pressed="${!!known}">${ICO.check}<span>${known ? "Known" : "I know this"}</span></button></div>
    <p class="nline">${k.line}</p>
    ${k.formula ? `<pre class="formula">${k.formula}</pre>` : ""}
    ${k.points ? `<ul class="npts">${k.points.map(p => `<li>${p}</li>`).join("")}</ul>` : ""}
    ${k.example ? `<div class="nbox ex"><span class="nb-h">${ICO.ex}Example</span><p>${k.example.replace(/\n/g, "<br>")}</p></div>` : ""}
    ${k.trap ? `<div class="nbox trap"><span class="nb-h">${ICO.warn}Trap</span><p>${k.trap}</p></div>` : ""}
    ${k.exam ? `<div class="nbox exam"><span class="nb-h">${ICO.pen}In the exam</span><p>${k.exam}</p></div>` : ""}
  </article>`;
}
function viewChapter(id){
  const c = CH[id] || COURSE[0], known = MS.get("learn", {});
  const idx = COURSE.indexOf(c), prev = COURSE[idx - 1], next = COURSE[idx + 1];
  const s = learnStats(c.id);
  const root = h("div", { class: "mod chapter", style: `--c:${c.c}`, html: `
  <div class="chlay">
    <aside class="toc" aria-label="Sections">
      <a class="tocback" href="#learn">${ICO.back}All chapters</a>
      <div class="toc-h"><span class="chn">${String(c.n).padStart(2, "0")}</span><b>${c.title}</b></div>
      <div class="mprog sm"><div class="mbar"><i data-chbar style="width:${s.known / s.total * 100}%"></i></div><span data-chcount>${s.known}/${s.total} known</span></div>
      <nav class="toc-l">${c.sections.map((sec, i) => `<button type="button" data-sec="${i}"><span>${sec.title}</span><em data-seccount="${i}"></em></button>`).join("")}</nav>
      <div class="toc-act"><a class="btn primary small" href="#quiz-${c.id}">Quiz this chapter</a><a class="btn glassy small" href="#cards-${c.id}">Flashcards</a><a class="btn glassy small" href="#recap">Recap</a></div>
    </aside>
    <div class="chbody">
      ${mhead(`Chapter ${c.n}`, c.title, c.intro)}
      ${c.sections.map((sec, i) => `<section class="nsec" data-seci="${i}"><h2>${sec.title}</h2>${[].concat(sec.widget || []).map(w => `<div class="widget" data-widget="${w}"></div>`).join("")}${sec.cards.map(k => noteCard(k, known[k.id])).join("")}</section>`).join("")}
      <nav class="chnext">${prev ? `<a class="btn glassy" href="#learn-${prev.id}">${ICO.back}${prev.title}</a>` : "<span></span>"}<a class="btn primary" href="#quiz-${c.id}">Test this chapter</a>${next ? `<a class="btn glassy" href="#learn-${next.id}">${next.title}${ICO.arrow}</a>` : "<span></span>"}</nav>
    </div>
  </div>` });
  const counts = () => {
    const k = MS.get("learn", {});
    c.sections.forEach((sec, i) => { const n = sec.cards.filter(x => k[x.id]).length, el = root.querySelector(`[data-seccount="${i}"]`); el.textContent = sec.cards.length ? `${n}/${sec.cards.length}` : ""; el.classList.toggle("full", sec.cards.length && n === sec.cards.length); });
    const st = learnStats(c.id); root.querySelector("[data-chbar]").style.width = (st.known / st.total * 100) + "%"; root.querySelector("[data-chcount]").textContent = `${st.known}/${st.total} known`;
  };
  counts();
  root.addEventListener("click", e => {
    const kb = e.target.closest("[data-know]");
    if (kb){ const k = MS.get("learn", {}), id = kb.dataset.know; if (k[id]) delete k[id]; else k[id] = 1; MS.set("learn", k);
      const on = !!k[id]; if (on) burst(kb, ["--ok", "--flow"]); kb.setAttribute("aria-pressed", String(on)); kb.querySelector("span").textContent = on ? "Known" : "I know this"; kb.closest(".note").classList.toggle("known", on); counts(); if (on && !root.querySelector(".note:not(.known)")) nudgeReview("chapter"); }
    const sb = e.target.closest("[data-sec]");
    if (sb){ const t = root.querySelector(`[data-seci="${sb.dataset.sec}"]`); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
  /* the section in view lights up in the table of contents */
  requestAnimationFrame(() => {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) root.querySelectorAll("[data-sec]").forEach(b => b.classList.toggle("on", b.dataset.sec === en.target.dataset.seci)); }), { rootMargin: "-30% 0px -60% 0px" });
    root.querySelectorAll(".nsec").forEach(s => io.observe(s));
    root.querySelectorAll("[data-widget]").forEach(w => WIDGETS[w.dataset.widget] && WIDGETS[w.dataset.widget](w));
  });
  return root;
}

