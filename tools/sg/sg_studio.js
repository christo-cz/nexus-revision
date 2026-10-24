/* =====================================================================
   CAUSAL STUDIO — draw the course's causal diagrams and get them checked link by link,
   build your own on a free board (loops and effects found by the code), and drill the reflexes.
   ===================================================================== */
const STUDIO_STEPS = [
  ["Name the key variable", "Start from the phenomenon you explain (heatwave frequency, the pay gap…), stated as a quantity that can rise or fall."],
  ["List causes and consequences", "Think environmental, social and economic. Each one is a variable: \"air-conditioning use\", not \"air conditioners\"."],
  ["Draw the arrows", "From cause to effect. Add intermediate variables when a link hides a mechanism."],
  ["Sign every arrow", "+ if they move together, − if they move in opposite directions, all else being equal."],
  ["Find the loops", "Follow arrows back to where you started. Even number of − (or none): reinforcing. Odd: balancing."],
  ["Look for side effects", "A measure with a desired effect can feed the problem elsewhere: an unintended consequence."]
];
const studioState = () => MS.get("studio", {});
const studioSave = (id, v) => { const s = studioState(); s[id] = { ...(s[id] || {}), ...v }; MS.set("studio", s); };
function viewStudio(){
  const st = studioState();
  const card = d => { const m = cldModel(d), best = (st[d.id] || {}).best; return `<a class="cscard" href="#studio-${d.id}" style="--c:${CH[d.ch].c}"><span class="cs-where">${d.where}</span><b>${d.title}</b><span class="cs-meta">${m.nodes.length} variables · ${m.links.length} links${best != null ? ` · <em>best ${best}%</em>` : ""}</span><span class="cs-mini" aria-hidden="true">${miniGlyph(m)}</span></a>`; };
  return h("div", { class: "mod studio", html: `${mhead("Societal and Global Challenges", "Causal studio", "A causal diagram is very likely in the exam. Draw the course's diagrams yourself, get each link checked, then build your own: the loops and effects are worked out by the code.")}
  <section class="sec"><div class="sec-h"><h2>Six steps to draw one</h2></div><ol class="steps six">${STUDIO_STEPS.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ol></section>
  <div class="studio-top"><a class="tdfull stfree" href="#studio-free"><span><b>Free board</b><span>Your own diagram: add variables, link them, sign them. Loops and effects appear as you build. Download it as an image.</span></span>${ICO.arrow}</a>
    <a class="tdfull stdrill" href="#studio-drills"><span><b>Diagram drills</b><span>Endless: sign a link, name a loop, predict an effect through the diagram. Streaks and a 60-second sprint.</span></span>${ICO.arrow}</a></div>
  <section class="sec"><div class="sec-h"><h2>The course's diagrams</h2><p>The diagrams from the slides and the tutorial. Read the text and pick the variables, fill in the signs, then draw the links yourself, as in the exam.</p></div>
    <div class="csgrid">${CLD.filter(d => d.src === "slides").map(card).join("")}</div></section>
  <section class="sec"><div class="sec-h"><h2>Practice cases</h2><p>Built for Nexus in the course's spirit, to train on situations you have not seen.</p></div>
    <div class="csgrid">${CLD.filter(d => d.src !== "slides").map(card).join("")}</div></section>
  ${creditHtml()}` });
}
/* a tiny picture of the diagram for its card */
function miniGlyph(m){
  const xs = m.nodes.map(n => n.x), ys = m.nodes.map(n => n.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const P = n => [8 + (n.x - x0) / Math.max(1, x1 - x0) * 104, 8 + (n.y - y0) / Math.max(1, y1 - y0) * 54], N = Object.fromEntries(m.nodes.map(n => [n.id, P(n)]));
  return `<svg viewBox="0 0 120 70">${m.links.map(l => `<line x1="${N[l.from][0].toFixed(1)}" y1="${N[l.from][1].toFixed(1)}" x2="${N[l.to][0].toFixed(1)}" y2="${N[l.to][1].toFixed(1)}" class="${l.sign < 0 ? "m" : "p"}"/>`).join("")}${m.nodes.map(n => `<circle cx="${N[n.id][0].toFixed(1)}" cy="${N[n.id][1].toFixed(1)}" r="3.6" class="k-${n.kind}"/>`).join("")}</svg>`;
}

/* ---------- one case: fill the signs, draw the links, or explore the course diagram ---------- */
function viewStudioCase(id){
  const d = CLDI[id] || CLD[0], M = cldModel(d), st = studioState()[d.id] || {};
  let mode = st.mode || (CLD_TEXT[d.id] ? "text" : "signs"), pick = new Set(st.pick || []), guess = Object.assign({}, st.guess || {}), mine = (st.mine || []).map(l => ({ ...l })), sel = null, checked = false, push = null, showLoops = false;
  const loops = findLoops(M);
  const root = h("div", { class: "mod studio-case", style: `--c:${CH[d.ch].c}`, html: `<a class="tocback" href="#studio">${ICO.back}Causal studio</a>
    ${mhead(`Causal studio · ${d.where}`, d.title, d.story)}
    <div class="seg stmode" role="group" aria-label="Exercise">${CLD_TEXT[d.id] ? `<button type="button" data-mode="text">1. Pick the variables</button>` : ""}<button type="button" data-mode="signs">${CLD_TEXT[d.id] ? "2" : "1"}. Fill in the signs</button><button type="button" data-mode="links">${CLD_TEXT[d.id] ? "3" : "2"}. Draw the links</button><button type="button" data-mode="model">The course's answer</button></div>
    <p class="sthint" aria-live="polite"></p>
    <div class="boardwrap"><div class="boardin"></div></div>
    ${legendHtml()}
    <div class="stpanel"></div>` });
  const bin = root.querySelector(".boardin"), hint = root.querySelector(".sthint"), panel = root.querySelector(".stpanel");
  const save = () => studioSave(d.id, { mode, guess, mine, pick: [...pick] });
  const TX = CLD_TEXT[d.id], CAND = TX ? (() => { const a = M.nodes.map(n => ({ id: n.id, label: n.label, real: 1 })).concat(TX.decoys.map((x, i) => ({ id: "x" + i, label: x[0], why: x[1] }))); let s = 0; for (const c of d.id) s = (s * 31 + c.charCodeAt(0)) >>> 0; return a.map(x => { s = (s * 1103515245 + 12345) >>> 0; return [s, x]; }).sort((p, q) => p[0] - q[0]).map(p => p[1]); })() : [];
  const HINTS = {
    text: "Read the text, then pick the variables of the diagram. A variable is something that can rise or fall.",
    signs: "All the arrows are drawn. Tap each sign to choose + or −, then check.",
    links: "Tap a variable, then the variable it influences: an arrow appears with +. Tap a sign to switch it to −, tap again to remove the arrow.",
    model: "The diagram from the course. Tap a variable to push it up and see what rises and what falls, all else being equal."
  };
  function draw(){
    root.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    hint.textContent = HINTS[mode];
    root.querySelector(".boardwrap").hidden = mode === "text"; root.querySelector(".cldleg").hidden = mode === "text";
    if (mode === "text"){ bin.innerHTML = ""; drawPanel(); return; }
    let svg;
    if (mode === "signs"){
      svg = boardSVG(M, { label: d.title, focusable: true, sign: l => checked ? (guess[linkKey(l)] || 0) : (guess[linkKey(l)] || 0), cls: l => !checked ? (guess[linkKey(l)] ? "n" : "dim") : guess[linkKey(l)] === l.sign ? "ok" : "bad" });
    } else if (mode === "links"){
      if (!checked) svg = boardSVG(M, { label: d.title, focusable: true, links: mine, straight: true, cls: () => "n", ncls: n => n.id === sel ? "sel" : "" });
      else {
        const mk = Object.fromEntries(mine.map(l => [linkKey(l), l])), extra = mine.filter(l => !M.links.some(x => linkKey(x) === linkKey(l)));
        const all = M.links.concat(extra.map(l => ({ ...l, extra: 1 })));
        svg = boardSVG(M, { label: d.title, links: all, cls: l => l.extra ? "extra" : !mk[linkKey(l)] ? "miss" : mk[linkKey(l)].sign === l.sign ? "ok" : "bad", sign: l => l.extra ? l.sign : mk[linkKey(l)] ? mk[linkKey(l)].sign : l.sign });
      }
    } else {
      const P = push ? propagate(M, push) : null;
      svg = boardSVG(M, { label: d.title, focusable: true, loops: showLoops ? loops : null, ncls: n => !P ? "" : n.id === push ? "pushed" : P[n.id] ? "e-" + P[n.id].eff : "far", cls: l => !P ? "n" : (l.from === push || P[l.from]) && P[l.to] ? "hot" : "dim" });
    }
    bin.innerHTML = svg;
    if (mode === "model" && push){ const P = propagate(M, push); bin.querySelectorAll(".nd").forEach(g => { const e = P[g.dataset.n]; if (e) g.style.setProperty("--dl", (e.step * 160) + "ms"); }); }
    drawPanel();
  }
  function scoreSigns(){ const ok = M.links.filter(l => guess[linkKey(l)] === l.sign).length; return { ok, tot: M.links.length }; }
  function scoreLinks(){ const mk = Object.fromEntries(mine.map(l => [linkKey(l), l])); const ok = M.links.filter(l => mk[linkKey(l)] && mk[linkKey(l)].sign === l.sign).length, sign = M.links.filter(l => mk[linkKey(l)] && mk[linkKey(l)].sign !== l.sign).length, miss = M.links.filter(l => !mk[linkKey(l)]).length, extra = mine.filter(l => !M.links.some(x => linkKey(x) === linkKey(l))).length; return { ok, sign, miss, extra, tot: M.links.length }; }
  const linksTable = (status) => `<ol class="lklist">${M.links.map(l => { const s = status ? status(l) : ""; return `<li class="${s}"><span class="lk-ft">${esc(nodeLabel(M, l.from))} <b class="sgn-mini ${l.sign > 0 ? "p" : "m"}">${signTxt(l.sign)}</b> ${esc(nodeLabel(M, l.to))}</span><span class="lk-why">${l.why}</span></li>`; }).join("")}</ol>`;
  const loopsHtml = () => loops.length ? `<ul class="lplist">${loops.map((L, k) => `<li class="${L.kind}"><b>${L.kind === "R" ? "Reinforcing" : "Balancing"} loop ${loops.length > 1 ? (L.kind) + (k + 1) : ""}</b><span>${esc(loopName(M, L))}</span><em>${loopWhy(L)} → ${L.kind === "R" ? "positive (reinforcing)" : "negative (balancing)"}</em></li>`).join("")}</ul>` : `<p class="muted">No feedback loop in this diagram: every arrow leads away from the causes (a cause tree).</p>`;
  function drawPanel(){
    if (mode === "text"){
      const real = CAND.filter(x => x.real), found = real.filter(x => pick.has(x.id)).length, wrong = CAND.filter(x => !x.real && pick.has(x.id)).length;
      panel.innerHTML = `<blockquote class="cldtext">${esc(TX.text)}</blockquote>
        <h3 class="sth">Which of these are variables of the diagram?</h3>
        <div class="varpick">${CAND.map(x => { const on = pick.has(x.id), cls = !checked ? (on ? "on" : "") : x.real ? (on ? "ok" : "miss") : on ? "bad" : "dim"; return `<button type="button" class="vp ${cls}" data-vp="${x.id}" aria-pressed="${on}"${checked ? " disabled" : ""}>${esc(x.label)}</button>`; }).join("")}</div>
        ${!checked ? `<div class="strow"><span class="muted">${pick.size} picked</span><div class="row"><button class="btn quiet small" type="button" data-reset>Clear</button><button class="btn primary" type="button" data-check ${pick.size ? "" : "disabled"}>Check my variables</button></div></div>`
        : `<div class="stscore ${found === real.length && !wrong ? "ok" : "bad"}"><b>${found}/${real.length}</b><span>variables found${wrong ? ` · ${wrong} picked that are not variables of this diagram` : ""}</span><div class="row"><button class="btn glassy small" type="button" data-again>Try again</button><button class="btn primary small" type="button" data-mode="links">Next: draw the links</button></div></div>
          <ul class="vpwhy">${CAND.filter(x => !x.real).map(x => `<li class="${pick.has(x.id) ? "bad" : ""}"><b>${esc(x.label)}</b><span>${esc(x.why)}</span></li>`).join("")}${(() => { const m = real.filter(x => !pick.has(x.id)); return m.length ? `<li class="miss"><b>Missed: ${m.map(x => esc(x.label)).join(", ")}</b><span>Each is a quantity that rises or falls, and the text gives at least one link for it.</span></li>` : ""; })()}</ul>`}`;
      if (checked && found === real.length && !wrong) burst(panel.querySelector(".stscore b"), ["--ok", "--pri", "--c4"]);
      return;
    }
    if (mode === "signs"){
      const n = M.links.filter(l => guess[linkKey(l)]).length;
      if (!checked){
        panel.innerHTML = `<div class="strow"><span class="muted">${n} of ${M.links.length} signs chosen</span><div class="row"><button class="btn quiet small" type="button" data-reset>Clear</button><button class="btn primary" type="button" data-check ${n ? "" : "disabled"}>Check my signs</button></div></div>
          <details class="stlist"><summary>Answer as a list (keyboard friendly)</summary><ol class="lklist edit">${M.links.map((l, i) => { const g = guess[linkKey(l)]; return `<li><span class="lk-ft">${esc(nodeLabel(M, l.from))} → ${esc(nodeLabel(M, l.to))}</span><span class="pm"><button type="button" data-gs="${i}" data-v="1" aria-pressed="${g === 1}">+</button><button type="button" data-gs="${i}" data-v="-1" aria-pressed="${g === -1}">−</button></span></li>`; }).join("")}</ol></details>`;
      } else {
        const s = scoreSigns(), pct = Math.round(s.ok / s.tot * 100);
        panel.innerHTML = `<div class="stscore ${pct >= 80 ? "ok" : "bad"}"><b>${s.ok}/${s.tot}</b><span>signs right (${pct}%)</span><div class="row"><button class="btn glassy small" type="button" data-again>Try again</button><button class="btn primary small" type="button" data-mode="links">Next: draw the links yourself</button></div></div>
          <h3 class="sth">Link by link</h3>${linksTable(l => guess[linkKey(l)] === l.sign ? "ok" : "bad")}<h3 class="sth">Loops in this diagram</h3>${loopsHtml()}`;
      }
    } else if (mode === "links"){
      if (!checked){
        const opts = M.nodes.map(n => `<option value="${n.id}">${esc(n.label)}</option>`).join("");
        panel.innerHTML = `<div class="strow"><span class="muted">${mine.length} arrow${mine.length === 1 ? "" : "s"} drawn · the course has ${M.links.length}</span><div class="row"><button class="btn quiet small" type="button" data-reset>Clear</button><button class="btn primary" type="button" data-check ${mine.length ? "" : "disabled"}>Check my diagram</button></div></div>
          <details class="stlist"><summary>Edit as a list (keyboard friendly)</summary>
            <div class="addlk"><select data-af aria-label="Cause">${opts}</select><span>→</span><select data-at aria-label="Effect">${opts}</select><select data-as aria-label="Sign"><option value="1">+</option><option value="-1">−</option></select><button class="btn glassy small" type="button" data-add>Add the arrow</button></div>
            <ol class="lklist edit">${mine.map((l, i) => `<li><span class="lk-ft">${esc(nodeLabel(M, l.from))} → ${esc(nodeLabel(M, l.to))}</span><span class="pm"><button type="button" data-ms="${i}" data-v="1" aria-pressed="${l.sign === 1}">+</button><button type="button" data-ms="${i}" data-v="-1" aria-pressed="${l.sign === -1}">−</button><button type="button" data-mdel="${i}" aria-label="Remove">✕</button></span></li>`).join("")}</ol></details>`;
      } else {
        const s = scoreLinks(), pct = Math.round(s.ok / s.tot * 100);
        const mk = Object.fromEntries(mine.map(l => [linkKey(l), l]));
        panel.innerHTML = `<div class="stscore ${pct >= 70 ? "ok" : "bad"}"><b>${s.ok}/${s.tot}</b><span>course links found with the right sign (${pct}%)${s.sign ? ` · ${s.sign} with the wrong sign` : ""}${s.miss ? ` · ${s.miss} missing` : ""}${s.extra ? ` · ${s.extra} not in the course diagram` : ""}</span><div class="row"><button class="btn glassy small" type="button" data-again>Edit my diagram</button><button class="btn quiet small" type="button" data-mode="model">Explore the course's answer</button></div></div>
          <ul class="cldleg st"><li><i class="ln ok"></i>right link, right sign</li><li><i class="ln bad"></i>wrong sign</li><li><i class="ln miss"></i>missing</li><li><i class="ln extra"></i>yours, not in the course diagram: is it defensible?</li></ul>
          <h3 class="sth">Link by link</h3>${linksTable(l => !mk[linkKey(l)] ? "miss" : mk[linkKey(l)].sign === l.sign ? "ok" : "bad")}<h3 class="sth">Loops in this diagram</h3>${loopsHtml()}`;
        const best = (studioState()[d.id] || {}).best || 0; if (pct > best) studioSave(d.id, { best: pct });
        if (pct >= 70) burst(panel.querySelector(".stscore b"), ["--ok", "--pri", "--c4"]);
        nudgeReview("diagram");
      }
    } else {
      const P = push ? propagate(M, push) : null;
      panel.innerHTML = `<div class="strow"><button class="btn glassy small" type="button" data-loops aria-pressed="${showLoops}">${showLoops ? "Hide" : "Show"} the loops</button>${push ? `<button class="btn quiet small" type="button" data-unpush>Clear the push</button>` : ""}</div>
        ${P ? `<div class="pushout"><p><b>${esc(nodeLabel(M, push))}</b> rises. All else being equal:</p><ul>${Object.entries(P).sort((a, b) => a[1].step - b[1].step).map(([id, e]) => `<li class="e-${e.eff}"><i>${e.eff === "up" ? "▲" : e.eff === "down" ? "▼" : "▲▼"}</i>${esc(nodeLabel(M, id))}<em>${e.eff === "up" ? "rises" : e.eff === "down" ? "falls" : "depends: paths of opposite signs"}</em></li>`).join("") || "<li>Nothing: no arrow leaves it.</li>"}</ul></div>` : ""}
        <h3 class="sth">Loops in this diagram</h3>${loopsHtml()}<h3 class="sth">Every link explained</h3>${linksTable()}`;
    }
  }
  const nodeTap = id => {
    if (mode === "links" && !checked){
      if (!sel){ sel = id; draw(); return; }
      if (sel === id){ sel = null; draw(); return; }
      if (!mine.some(l => l.from === sel && l.to === id)) mine.push({ from: sel, to: id, sign: 1 });
      sel = null; save(); draw(); return;
    }
    if (mode === "model"){ push = push === id ? null : id; draw(); }
  };
  root.addEventListener("click", e => {
    const mb = e.target.closest("[data-mode]"); if (mb){ mode = mb.dataset.mode; checked = false; sel = null; push = null; save(); draw(); return; }
    const sg = e.target.closest("[data-sl]");
    if (sg && !checked){ const i = +sg.dataset.sl;
      if (mode === "signs"){ const k = linkKey(M.links[i]), v = guess[k]; guess[k] = v === 1 ? -1 : 1; save(); draw(); return; }
      if (mode === "links"){ const l = mine[i]; if (l.sign === 1) l.sign = -1; else mine.splice(i, 1); save(); draw(); return; } }
    const vp = e.target.closest("[data-vp]"); if (vp && !checked){ const k = vp.dataset.vp; if (pick.has(k)) pick.delete(k); else pick.add(k); save(); draw(); return; }
    const nd = e.target.closest(".nd"); if (nd){ nodeTap(nd.dataset.n); return; }
    if (e.target.closest("[data-check]")){ checked = true; draw(); panel.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (e.target.closest("[data-again]")){ checked = false; draw(); return; }
    if (e.target.closest("[data-reset]")){ if (mode === "text") pick = new Set(); else if (mode === "signs") guess = {}; else mine = []; save(); draw(); return; }
    const gs = e.target.closest("[data-gs]"); if (gs){ guess[linkKey(M.links[+gs.dataset.gs])] = +gs.dataset.v; save(); draw(); return; }
    const ms = e.target.closest("[data-ms]"); if (ms){ mine[+ms.dataset.ms].sign = +ms.dataset.v; save(); draw(); return; }
    const md = e.target.closest("[data-mdel]"); if (md){ mine.splice(+md.dataset.mdel, 1); save(); draw(); return; }
    if (e.target.closest("[data-add]")){ const f = root.querySelector("[data-af]").value, t = root.querySelector("[data-at]").value, s = +root.querySelector("[data-as]").value; if (f !== t && !mine.some(l => l.from === f && l.to === t)){ mine.push({ from: f, to: t, sign: s }); save(); draw(); root.querySelector(".stlist").open = true; } return; }
    if (e.target.closest("[data-loops]")){ showLoops = !showLoops; draw(); return; }
    if (e.target.closest("[data-unpush]")){ push = null; draw(); }
  });
  root.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".nd")){ e.preventDefault(); nodeTap(e.target.closest(".nd").dataset.n); } });
  draw();
  return root;
}

/* ---------- free board: your own diagram ---------- */
function viewStudioFree(){
  let B = MS.get("board", null);
  if (!B || !B.nodes) B = { nodes: [], links: [] };
  let sel = null, eff = { a: "", b: "" };
  const root = h("div", { class: "mod studio-free", html: `<a class="tocback" href="#studio">${ICO.back}Causal studio</a>
    ${mhead("Causal studio", "Free board", "Add your variables, drag them where you want, tap one then another to draw an arrow, tap a sign to flip it. The loops and their polarity are found for you.")}
    <form class="addvar" autocomplete="off"><input type="text" maxlength="60" placeholder="A variable, e.g. Share of renewable electricity" aria-label="New variable"><select aria-label="Kind">${Object.entries(KINDS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join("")}</select><button class="btn primary small" type="submit">Add</button></form>
    <div class="row stfreebar"><label class="small muted">Start from <select data-tpl><option value="">a blank board</option>${CLD.map(d => `<option value="${d.id}">${esc(d.title)}</option>`).join("")}</select></label><button class="btn quiet small" type="button" data-delnode disabled>Delete the selected variable</button><button class="btn quiet small" type="button" data-clear>Clear the board</button><button class="btn glassy small" type="button" data-png>Download as image</button></div>
    <p class="sthint" aria-live="polite"></p>
    <div class="boardwrap"><div class="boardin"></div></div>${legendHtml()}
    <div class="stpanel"></div>` });
  const bin = root.querySelector(".boardin"), panel = root.querySelector(".stpanel"), hint = root.querySelector(".sthint");
  const save = () => MS.set("board", B);
  const M = () => ({ nodes: B.nodes, links: B.links });
  function spot(){ for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++){ const x = 110 + c * 195, y = 60 + r * 100; if (!B.nodes.some(n => Math.abs(n.x - x) < 150 && Math.abs(n.y - y) < 60)) return [x, y]; } return [500, 310]; }
  function draw(){
    hint.textContent = !B.nodes.length ? "Add a first variable, or start from a course diagram." : sel ? `Selected: ${nodeLabel(M(), sel)}. Tap the variable it influences.` : "Tap a variable, then the one it influences. Drag to move. Tap a sign to flip it; tap a − sign to remove the arrow.";
    const loops = findLoops(M());
    bin.innerHTML = boardSVG(M(), { label: "Your causal diagram", focusable: true, straight: true, loops: loops.length && loops.length <= 6 ? loops : null, ncls: n => n.id === sel ? "sel" : "" });
    root.querySelector("[data-delnode]").disabled = !sel;
    const opts = B.nodes.map(n => `<option value="${n.id}">${esc(n.label)}</option>`).join("");
    let effHtml = "";
    if (eff.a && eff.b && eff.a !== eff.b){ const r = effectOf(M(), eff.a, eff.b); effHtml = !r.eff ? `<p class="muted">No path leads from the first to the second.</p>` : `<p class="effans e-${r.eff}"><b>${esc(nodeLabel(M(), eff.b))} ${r.eff === "up" ? "rises" : r.eff === "down" ? "falls" : "may rise or fall: the paths have opposite signs, so it depends on their strength"}</b></p><ul class="paths">${r.paths.slice(0, 8).map(p => `<li>${p.links.map(l => esc(nodeLabel(M(), l.from))).concat(esc(nodeLabel(M(), eff.b))).join(" → ")} <em>(${p.links.map(l => signTxt(l.sign)).join(" × ")} = ${signTxt(p.sign)})</em></li>`).join("")}</ul>`; }
    panel.innerHTML = `<h3 class="sth">Loops (${loops.length})</h3>${loops.length ? `<ul class="lplist">${loops.slice(0, 12).map((L, k) => `<li class="${L.kind}"><b>${L.kind === "R" ? "Reinforcing" : "Balancing"}</b><span>${esc(loopName(M(), L))}</span><em>${loopWhy(L)}</em></li>`).join("")}</ul>` : `<p class="muted">No loop yet. A loop appears when arrows lead back to where they started.</p>`}
      <h3 class="sth">What happens if…</h3><div class="addlk"><select data-ea aria-label="Variable that rises"><option value="">a variable</option>${opts}</select><span>rises: effect on</span><select data-eb aria-label="Variable affected"><option value="">another</option>${opts}</select></div>${effHtml}`;
    if (eff.a) panel.querySelector("[data-ea]").value = eff.a; if (eff.b) panel.querySelector("[data-eb]").value = eff.b;
  }
  /* dragging a variable on the board */
  let drag = null;
  bin.addEventListener("pointerdown", e => {
    const g = e.target.closest(".nd"); if (!g) return;
    const svg = bin.querySelector("svg"), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const n = B.nodes.find(x => x.id === g.dataset.n); drag = { n, dx: n.x - p.x, dy: n.y - p.y, x0: e.clientX, y0: e.clientY, moved: false, g };
    g.setPointerCapture(e.pointerId);
  });
  bin.addEventListener("pointermove", e => {
    if (!drag) return; if (!drag.moved && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 5) return;
    drag.moved = true; const svg = bin.querySelector("svg"), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    drag.n.x = Math.max(60, Math.min(BOARD.W - 60, p.x + drag.dx)); drag.n.y = Math.max(24, Math.min(BOARD.H - 24, p.y + drag.dy));
    bin.innerHTML = boardSVG(M(), { focusable: true, straight: true, ncls: n => n.id === sel ? "sel" : "" }); drag.g = null;
  });
  bin.addEventListener("pointerup", e => { if (!drag) return; const d = drag; drag = null; if (d.moved){ save(); draw(); } else tap(d.n.id); });
  function tap(id){
    if (!sel){ sel = id; draw(); return; }
    if (sel === id){ sel = null; draw(); return; }
    if (!B.links.some(l => l.from === sel && l.to === id)) B.links.push({ from: sel, to: id, sign: 1 });
    sel = null; save(); draw();
  }
  root.querySelector(".addvar").addEventListener("submit", e => {
    e.preventDefault(); const inp = e.target.querySelector("input"), t = inp.value.trim(); if (!t) return;
    const [x, y] = spot(); B.nodes.push({ id: "v" + Date.now().toString(36), label: t, kind: e.target.querySelector("select").value, x, y }); inp.value = ""; save(); draw(); inp.focus();
  });
  root.addEventListener("click", e => {
    const sg = e.target.closest("[data-sl]"); if (sg){ const l = B.links[+sg.dataset.sl]; if (l.sign === 1) l.sign = -1; else B.links.splice(+sg.dataset.sl, 1); save(); draw(); return; }
    if (e.target.closest("[data-delnode]") && sel){ B.nodes = B.nodes.filter(n => n.id !== sel); B.links = B.links.filter(l => l.from !== sel && l.to !== sel); sel = null; save(); draw(); return; }
    const cl = e.target.closest("[data-clear]");
    if (cl){ if (!cl.dataset.armed){ cl.dataset.armed = "1"; cl.textContent = "Tap again to clear"; setTimeout(() => { if (cl.isConnected){ delete cl.dataset.armed; cl.textContent = "Clear the board"; } }, 3000); return; } B = { nodes: [], links: [] }; sel = null; save(); draw(); return; }
    if (e.target.closest("[data-png]")) downloadBoard(bin.querySelector("svg"));
  });
  root.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.closest && e.target.closest(".nd")){ e.preventDefault(); tap(e.target.closest(".nd").dataset.n); } });
  root.addEventListener("change", e => {
    const tp = e.target.closest("[data-tpl]"); if (tp && tp.value){ const m = cldModel(CLDI[tp.value]); B = { nodes: m.nodes.map(n => ({ ...n })), links: m.links.map(l => ({ from: l.from, to: l.to, sign: l.sign })) }; sel = null; save(); draw(); tp.value = ""; return; }
    if (e.target.matches("[data-ea]")){ eff.a = e.target.value; draw(); } if (e.target.matches("[data-eb]")){ eff.b = e.target.value; draw(); }
  });
  draw();
  return root;
}
/* the board as a PNG, with its colours written in (CSS variables do not survive outside the page) */
function downloadBoard(svg){
  if (!svg) return;
  const clone = svg.cloneNode(true), src = svg.querySelectorAll("*"), dst = clone.querySelectorAll("*");
  src.forEach((el, i) => { const cs = getComputedStyle(el), t = dst[i]; ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "font-size", "font-weight", "font-family"].forEach(p => { const v = cs.getPropertyValue(p); if (v) t.setAttribute(p, v); }); if (el.tagName === "text") t.setAttribute("text-anchor", "middle"); });
  const bg = getComputedStyle(document.body).backgroundColor;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg"); clone.setAttribute("width", BOARD.W * 2); clone.setAttribute("height", BOARD.H * 2);
  const data = new XMLSerializer().serializeToString(clone), img = new Image();
  img.onload = () => { const c = document.createElement("canvas"); c.width = BOARD.W * 2; c.height = BOARD.H * 2; const x = c.getContext("2d"); x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
    c.toBlob(b => { if (!b) return; const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "causal-diagram.png"; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }, "image/png"); };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
}

/* ---------- drills: sign a link, name a loop, predict an effect ---------- */
const DRILL_MODELS = () => CLD.map(cldModel);
function drillItem(){
  const ms = DRILL_MODELS(), r = Math.random();
  if (r < .34){ /* sign of a link */
    const m = PICK(ms), l = PICK(m.links);
    return { fam: "Sign the link", text: `${esc(nodeLabel(m, l.from))} → ${esc(nodeLabel(m, l.to))}`, opts: ["+ (same direction)", "− (opposite directions)"], right: l.sign > 0 ? 0 : 1, why: l.why, label: l.sign > 0 ? "+" : "−" };
  }
  if (r < .67){ /* polarity of a loop: a real one, or an abstract one */
    if (Math.random() < .5){ const m = PICK(ms.filter(x => findLoops(x).length)), L = PICK(findLoops(m));
      return { fam: "Name the loop", text: L.links.map(l => `${esc(nodeLabel(m, l.from))} <b class="sgn-mini ${l.sign > 0 ? "p" : "m"}">${signTxt(l.sign)}</b>`).join(" → ") + ` → back to ${esc(nodeLabel(m, L.nodes[0]))}`, opts: ["Reinforcing (positive)", "Balancing (negative)"], right: L.kind === "R" ? 0 : 1, why: `${loopWhy(L)}: ${L.kind === "R" ? "even, so the loop amplifies the change" : "odd, so the loop attenuates the change"}.`, label: L.kind === "R" ? "Reinforcing" : "Balancing" }; }
    const k = RI(2, 6), names = "ABCDEF".split("").slice(0, k), signs = names.map(() => Math.random() < .5 ? 1 : -1), neg = signs.filter(s => s < 0).length;
    return { fam: "Name the loop", text: names.map((n, i) => `${n} <b class="sgn-mini ${signs[i] > 0 ? "p" : "m"}">${signTxt(signs[i])}</b>`).join(" → ") + " → back to A", opts: ["Reinforcing (positive)", "Balancing (negative)"], right: neg % 2 ? 1 : 0, why: `${neg === 0 ? "Only + signs" : `${neg} minus sign${neg > 1 ? "s" : ""}, an ${neg % 2 ? "odd" : "even"} number`}: ${neg % 2 ? "balancing" : "reinforcing"}.`, label: neg % 2 ? "Balancing" : "Reinforcing" };
  }
  /* effect through the diagram */
  for (let t = 0; t < 40; t++){
    const m = PICK(ms), a = PICK(m.nodes), b = PICK(m.nodes); if (a === b) continue;
    const e = effectOf(m, a.id, b.id); if (!e.eff) continue; const direct = m.links.some(l => l.from === a.id && l.to === b.id); if (direct && Math.random() < .7) continue;
    const ps = e.paths.slice(0, 4).map(p => `${p.links.map(l => nodeLabel(m, l.from)).concat(b.label).join(" → ")} (${p.links.map(l => signTxt(l.sign)).join(" × ")} = ${signTxt(p.sign)})`).join("; ");
    return { fam: `Predict the effect · ${CLDI[m.id].title}`, text: `All else being equal, if <b>${esc(a.label)}</b> rises, what happens to <b>${esc(b.label)}</b>?`, opts: ["It rises", "It falls", "It depends: paths of opposite signs"], right: e.eff === "up" ? 0 : e.eff === "down" ? 1 : 2, why: `Multiply the signs along each path: ${esc(ps)}.`, label: e.eff === "up" ? "It rises" : e.eff === "down" ? "It falls" : "It depends" };
  }
  return drillItem();
}
function viewStudioDrills(){
  const st0 = MS.get("cdrill", { best: 0, sprint: 0 });
  const root = h("div", { class: "mod", html: `<a class="tocback" href="#studio">${ICO.back}Causal studio</a>
  ${mhead("Causal studio", "Diagram drills", "Three reflexes the exam rewards: sign a link, name a loop with the polarity rule, and follow the signs through a diagram. Every answer is computed from the course's diagrams.")}
  <div class="drillbar"><span></span><div class="seg" role="group" aria-label="Mode"><button type="button" data-mode="practice" aria-pressed="true">Practice</button><button type="button" data-mode="sprint" aria-pressed="false">Sprint 60 s</button></div></div>
  <div class="drillstats"><div><b data-s="streak">0</b><span>streak</span></div><div><b data-s="best">${st0.best}</b><span>best streak</span></div><div><b data-s="score">0/0</b><span>this session</span></div><div><b data-s="sprint">${st0.sprint}</b><span>best sprint</span></div></div>
  <div class="timer" hidden><i></i></div>
  <article class="dq spotq" aria-live="polite"></article>` });
  let mode = "practice", streak = 0, ok = 0, tot = 0, cur = null, t0 = 0, tick = 0, sprintOn = false;
  const dq = root.querySelector(".dq"), S = k => root.querySelector(`[data-s="${k}"]`), timer = root.querySelector(".timer");
  const stats = () => { const s = MS.get("cdrill", { best: 0, sprint: 0 }); S("streak").textContent = streak; S("score").textContent = `${ok}/${tot}`; S("best").textContent = s.best; S("sprint").textContent = s.sprint; };
  function next(){
    cur = drillItem(); cur.done = false; dq.classList.remove("ok", "bad"); const L = "ABC";
    dq.style.setProperty("--c", "var(--c4)");
    dq.innerHTML = `<div class="qzprog"><span class="tag">${cur.fam}</span></div><p class="dqt scene cldq">${cur.text}</p><div class="opts">${cur.opts.map((o, j) => `<button class="opt" type="button" data-o="${j}"><span class="k">${L[j]}</span><span>${o}</span></button>`).join("")}</div><div class="dout"></div>`;
  }
  function verdict(good){
    cur.done = true; tot++; if (good){ ok++; streak++; } else streak = 0;
    const s = MS.get("cdrill", { best: 0, sprint: 0 }); if (streak > s.best){ s.best = streak; MS.set("cdrill", s); }
    stats(); if (good) bump(S("streak"));
    dq.classList.add(good ? "ok" : "bad");
    dq.querySelector(".dout").innerHTML = `<div class="verdict ${good ? "ok" : "bad"}"><div class="vh"><b>${good ? "Correct" : "Not quite"}</b>${good ? "" : `<span>It is <b>${cur.label}</b>.</span>`}</div><p>${cur.why}</p></div><button class="btn quiet small next" type="button" data-next>Next ${ICO.arrow}<kbd>Enter</kbd></button>`;
    dq.querySelector("[data-next]").focus({ preventScroll: true });
    if (tot === 15) nudgeReview("drills");
    if (mode === "sprint" && sprintOn) setTimeout(() => { if (cur.done && sprintOn) next(); }, good ? 500 : 1600);
  }
  root.addEventListener("click", e => {
    const mb = e.target.closest("[data-mode]");
    if (mb){ mode = mb.dataset.mode; root.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b === mb))); streak = 0; ok = 0; tot = 0; stats(); if (mode === "sprint") startSprint(); else { sprintOn = false; timer.hidden = true; next(); } }
    const ob = e.target.closest("[data-o]");
    if (ob && cur && !cur.done){ const j = +ob.dataset.o; if (j === cur.right) burst(ob, ["--c4", "--pri", "--ok"]); dq.querySelectorAll(".opt").forEach((b, i) => { b.disabled = true; if (i === cur.right) b.classList.add("right"); else if (i === j) b.classList.add("wrong"); }); verdict(j === cur.right); }
    if (e.target.closest("[data-next]")) next();
    if (e.target.closest("[data-again]")) startSprint();
  });
  const onKey = e => {
    if (!root.isConnected){ document.removeEventListener("keydown", onKey); return; }
    if (!cur || (e.target.matches && e.target.matches("input,textarea,select"))) return;
    if (e.key === "Enter" && cur.done){ e.preventDefault(); next(); return; }
    const k = { a: 0, b: 1, c: 2, "1": 0, "2": 1, "3": 2 }[e.key.toLowerCase()];
    if (k != null && !cur.done){ const b = dq.querySelectorAll(".opt")[k]; if (b){ e.preventDefault(); b.click(); } }
  };
  document.addEventListener("keydown", onKey);
  function startSprint(){
    sprintOn = true; ok = 0; tot = 0; streak = 0; stats(); timer.hidden = false; t0 = performance.now(); next();
    cancelAnimationFrame(tick);
    const run = () => { if (!root.isConnected){ sprintOn = false; return; } const left = 1 - (performance.now() - t0) / 60000; timer.firstChild.style.width = Math.max(0, left * 100) + "%";
      if (left <= 0){ sprintOn = false; const s = MS.get("cdrill", { best: 0, sprint: 0 }), rec = ok > s.sprint; if (rec){ s.sprint = ok; MS.set("cdrill", s); } stats();
        dq.classList.remove("ok", "bad"); cur = null; dq.innerHTML = `<div class="sprintend"><span class="kicker">Time</span><h2>${ok} right out of ${tot}</h2><p class="muted">${rec ? "New personal best." : `Your best is ${s.sprint}.`}</p><div class="row"><button class="btn primary" type="button" data-again>Go again</button></div></div>`; nudgeReview("sprint"); return; }
      tick = requestAnimationFrame(run); };
    tick = requestAnimationFrame(run);
  }
  requestAnimationFrame(next);
  return root;
}
