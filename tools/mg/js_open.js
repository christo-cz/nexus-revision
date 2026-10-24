/* ---------------- OPEN QUESTIONS ---------------- */
function openState(){ return MS.get("open", { ans: {}, ticks: {} }); }
function viewOpen(){
  const s = openState();
  return h("div", { class: "mod", html: `${mhead("Macroeconomics", "Open questions", "The final exam opens with questions on the lectures. Write your answer, then compare it with a model answer and tick the key points you covered.")}
  ${MOCK_BANNER()}
  <div class="method"><b>A method that works</b><span>Define the key terms</span><span>Give the Classical or Neoclassical view</span><span>Give the Keynesian view</span><span>Add a real example</span><span>Conclude in one sentence</span></div>
  <div class="olist">${COURSE.map(c => { const qs = OPEN.filter(o => o.ch === c.id); return qs.length ? `<section class="ogrp" style="--c:${c.c}"><h2>${c.n}. ${c.title}</h2>${qs.map(o => { const t = (s.ticks[o.id] || []).length, w = (s.ans[o.id] || "").trim().split(/\s+/).filter(Boolean).length;
    return `<a class="oitem" href="#open-${o.id}"><span class="oq">${o.q}</span><span class="ometa"><span>${o.min} min</span>${w ? `<span>${w} words</span>` : ""}${t ? `<span class="osc">${t}/${o.points.length} points</span>` : `<span>Not tried</span>`}</span></a>`; }).join("")}</section>` : ""; }).join("")}</div>
  ${creditHtml()}` });
}
function viewOpenQ(id){
  const o = OPEN.find(x => x.id === id) || OPEN[0], c = CH[o.ch], s = openState(), idx = OPEN.indexOf(o), nx = OPEN[idx + 1], pv = OPEN[idx - 1];
  const ticks = new Set(s.ticks[o.id] || []);
  const root = h("div", { class: "mod oq-page", style: `--c:${c.c}`, html: `
    <a class="tocback" href="#open">${ICO.back}All open questions</a>
    <header class="mhead"><p class="kicker">${c.n}. ${c.short} · about ${o.min} minutes</p><h1 class="oqt">${o.q}</h1></header>
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
  if (ticks.size || (s.ans[o.id] || "").length > 40) { model.hidden = false; }
  root.addEventListener("click", e => { if (e.target.closest("[data-reveal]")){ model.hidden = false; const st = openState(); st.ans[o.id] = ta.value; MS.set("open", st); model.scrollIntoView({ behavior: "smooth", block: "start" }); } });
  root.addEventListener("change", e => { const cb = e.target.closest("[data-tick]"); if (!cb) return; const k = +cb.dataset.tick; if (cb.checked) ticks.add(k); else ticks.delete(k); const st = openState(); st.ticks[o.id] = [...ticks]; MS.set("open", st); score(); if (Object.values(st.ticks).filter(t => t.length).length >= 3) nudgeReview("open"); });
  score();
  return root;
}

