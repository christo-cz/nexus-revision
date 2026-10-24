/* ---------------- interactive models inside Learn ---------------- */
const SVGPLOT = (w, hgt, inner) => `<svg class="plot" viewBox="0 0 ${w} ${hgt}" role="img">${inner}</svg>`;
const poly = (pts) => pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
/* a compact viewer of a course diagram: tap a variable to push it up; optional highlight buttons */
function cldViewer(el, id, title, cap, extras = []){
  const d = CLDI[id], M = cldModel(d), loops = findLoops(M);
  let push = null, hl = null;
  el.innerHTML = `<h3 class="wt">${title}</h3><p class="wcap">${cap}</p>${extras.length ? `<div class="seg wseg" role="group">${extras.map((x, i) => `<button type="button" data-hl="${i}" aria-pressed="false">${x.name}</button>`).join("")}</div>` : ""}<div class="boardwrap sm"><div class="boardin"></div></div><p class="wnote" aria-live="polite"></p><a class="wlink" href="#studio-${id}">Draw it yourself in the Causal studio ${ICO.arrow}</a>`;
  const bin = el.querySelector(".boardin"), note = el.querySelector(".wnote");
  const draw = () => {
    const P = push ? propagate(M, push) : null, H = hl ? new Set(hl.links) : null;
    bin.innerHTML = boardSVG(M, { label: d.title, focusable: true, loops: hl && hl.loops ? hl.loops : null,
      ncls: n => P ? (n.id === push ? "pushed" : P[n.id] ? "e-" + P[n.id].eff : "far") : H ? (hl.nodes.has(n.id) ? "" : "far") : "",
      cls: l => P ? ((l.from === push || P[l.from]) && P[l.to] ? "hot" : "dim") : H ? (H.has(linkKey(l)) ? "hot" : "dim") : "n" });
    if (P) bin.querySelectorAll(".nd").forEach(g => { const e = P[g.dataset.n]; if (e) g.style.setProperty("--dl", (e.step * 160) + "ms"); });
    note.innerHTML = P ? `<b>${esc(nodeLabel(M, push))}</b> rises: ${Object.entries(P).map(([k, e]) => `${esc(nodeLabel(M, k))} ${e.eff === "up" ? "▲" : e.eff === "down" ? "▼" : "▲▼"}`).join(" · ") || "no arrow leaves it"}.` : hl ? hl.text : "Tap a variable to push it up and follow the signs.";
    el.querySelectorAll("[data-hl]").forEach(b => b.setAttribute("aria-pressed", String(hl && hl === extras[+b.dataset.hl])));
  };
  extras.forEach(x => { x.nodes = new Set(x.links.flatMap(k => k.split(">"))); });
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-hl]"); if (b){ const x = extras[+b.dataset.hl]; hl = hl === x ? null : x; push = null; draw(); return; }
    const g = e.target.closest(".nd"); if (g){ push = push === g.dataset.n ? null : g.dataset.n; hl = null; draw(); }
  });
  el.addEventListener("keydown", e => { const g = e.target.closest && e.target.closest(".nd"); if (g && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); push = push === g.dataset.n ? null : g.dataset.n; hl = null; draw(); } });
  draw();
  return { M, loops };
}
const loopLinks = (M, L) => L.links.map(linkKey);

const WIDGETS = {
  /* read a link: what happens to B when A moves */
  sign(el){
    const all = CLD.flatMap(d => { const m = cldModel(d); return m.links.map(l => ({ m, l })); }).filter(x => x.l.why);
    let cur = 0, up = true;
    const pick = () => { cur = Math.floor(Math.random() * all.length); };
    pick();
    el.innerHTML = `<h3 class="wt">Read a causal link</h3><p class="wcap">An arrow says \"A influences B\"; its sign says in which direction, all else being equal. Move A and watch B.</p><div class="lkdemo" aria-live="polite"></div><div class="row"><div class="seg" role="group" aria-label="A moves"><button type="button" data-up="1">A rises</button><button type="button" data-up="0">A falls</button></div><button class="btn glassy small" type="button" data-nx>Another link</button></div>`;
    const box = el.querySelector(".lkdemo");
    const draw = () => {
      const { m, l } = all[cur], bUp = up === (l.sign > 0);
      el.querySelectorAll("[data-up]").forEach(b => b.setAttribute("aria-pressed", String((b.dataset.up === "1") === up)));
      box.innerHTML = `<div class="lkv k-${m.nodes.find(n => n.id === l.from).kind}"><i class="${up ? "u" : "d"}">${up ? "▲" : "▼"}</i>${esc(nodeLabel(m, l.from))}</div><div class="lka"><b class="sgn-mini ${l.sign > 0 ? "p" : "m"}">${signTxt(l.sign)}</b><span></span></div><div class="lkv k-${m.nodes.find(n => n.id === l.to).kind}"><i class="${bUp ? "u" : "d"}">${bUp ? "▲" : "▼"}</i>${esc(nodeLabel(m, l.to))}</div>
        <p class="lks">All else being equal, when <b>${esc(nodeLabel(m, l.from).toLowerCase())}</b> ${up ? "rises" : "falls"}, <b>${esc(nodeLabel(m, l.to).toLowerCase())}</b> ${bUp ? "rises" : "falls"}. ${l.why}</p>`;
      box.classList.remove("go"); void box.offsetWidth; box.classList.add("go");
    };
    el.addEventListener("click", e => { const b = e.target.closest("[data-up]"); if (b){ up = b.dataset.up === "1"; draw(); } if (e.target.closest("[data-nx]")){ pick(); draw(); } });
    draw();
  },
  /* build a loop, count the minus signs, see what the loop does to a small push */
  loop(el){
    let signs = [1, 1, -1];
    const NAMES = ["A", "B", "C", "D", "E"];
    el.innerHTML = `<h3 class="wt">The loop polarity rule</h3><p class="wcap">Tap a sign to flip it, add or remove variables. The verdict and the small simulation follow the rule of the course.</p>
      <div class="wgrid"><div class="loopsvg"></div><div class="wctl"><div class="row"><button class="btn glassy small" type="button" data-n="-1">− variable</button><button class="btn glassy small" type="button" data-n="1">+ variable</button></div><p class="verd"><span>Verdict</span><b data-v></b></p><p class="small" data-why></p><div data-sim></div></div></div>`;
    const draw = () => {
      const k = signs.length, R = 108, cx = 160, cy = 140, P = signs.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / k; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; });
      let s = "";
      signs.forEach((sg, i) => { const a = P[i], b = P[(i + 1) % k], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ox = (mx - cx) * .28, oy = (my - cy) * .28, c = [mx + ox, my + oy];
        const px = .25 * a[0] + .5 * c[0] + .25 * b[0], py = .25 * a[1] + .5 * c[1] + .25 * b[1];
        const sh = (p, q, r) => { const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy); return [p[0] + dx / L * r, p[1] + dy / L * r]; };
        const a2 = sh(a, c, 26), b2 = sh(b, c, 30);
        s += `<path d="M${a2[0].toFixed(1)},${a2[1].toFixed(1)} Q${c[0].toFixed(1)},${c[1].toFixed(1)} ${b2[0].toFixed(1)},${b2[1].toFixed(1)}" class="lpl" marker-end="url(#lpa)"/><g class="sgn ${sg > 0 ? "p" : "m"}" data-sg="${i}" transform="translate(${px.toFixed(1)},${py.toFixed(1)})" role="button" tabindex="0" aria-label="Sign ${i + 1}: ${sg > 0 ? "plus" : "minus"}"><circle r="13"/><text dy=".36em">${signTxt(sg)}</text></g>`; });
      P.forEach((p, i) => { s += `<g class="lpn"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="22"/><text x="${p[0].toFixed(1)}" y="${p[1].toFixed(1)}" dy=".36em">${NAMES[i]}</text></g>`; });
      const neg = signs.filter(x => x < 0).length, R2 = neg % 2 === 0;
      el.querySelector(".loopsvg").innerHTML = SVGPLOT(320, 280, `<defs><marker id="lpa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker></defs><text x="${cx}" y="${cy}" dy=".36em" class="lpc ${R2 ? "R" : "B"}">${R2 ? "R" : "B"}</text>${s}`);
      el.querySelector("[data-v]").textContent = R2 ? "Reinforcing (positive)" : "Balancing (negative)";
      el.querySelector("[data-v]").style.color = R2 ? "var(--c4)" : "var(--c1)";
      el.querySelector("[data-why]").textContent = `${neg === 0 ? "Only + signs" : `${neg} minus sign${neg > 1 ? "s" : ""}, an ${neg % 2 ? "odd" : "even"} number`}: the loop ${R2 ? "amplifies" : "attenuates"} any change in A.`;
      const v = [1]; for (let t = 1; t < 12; t++) v.push(v[t - 1] * (R2 ? 1.24 : -.6));
      const mx = Math.max(...v.map(Math.abs)), pts = v.map((y, i) => [20 + i * 24, 70 - y / mx * 52]);
      el.querySelector("[data-sim]").innerHTML = SVGPLOT(300, 140, `<line x1="20" y1="70" x2="290" y2="70" class="ax"/><path d="${poly(pts)}" class="ln ${R2 ? "r" : "b"}"/>${pts.map(p => `<circle cx="${p[0]}" cy="${p[1].toFixed(1)}" r="3" class="dt ${R2 ? "r" : "b"}"/>`).join("")}<text x="20" y="134" class="tk">a push on A, then each trip around the loop →</text>`);
    };
    el.addEventListener("click", e => { const g = e.target.closest("[data-sg]"); if (g){ const i = +g.dataset.sg; signs[i] = -signs[i]; draw(); } const n = e.target.closest("[data-n]"); if (n){ const d = +n.dataset.n; if (d > 0 && signs.length < 5) signs.push(1); if (d < 0 && signs.length > 2) signs.pop(); draw(); } });
    el.addEventListener("keydown", e => { const g = e.target.closest && e.target.closest("[data-sg]"); if (g && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); signs[+g.dataset.sg] *= -1; draw(); el.querySelector(`[data-sg="${g.dataset.sg}"]`).focus(); } });
    draw();
  },
  heatmap(el){
    const M = cldModel(CLDI.heat), L = findLoops(M);
    const by = ids => L.find(x => x.nodes.length === ids.length && ids.every(i => x.nodes.includes(i)));
    const fire = by(["ghg", "temp", "heat", "soil", "fire", "emi"]), veg = by(["ghg", "temp", "heat", "soil", "veg", "abs"]), acl = by(["indoor", "ac"]), el2 = by(["elec", "price"]), unin = L.find(x => x.nodes.includes("ac") && x.nodes.includes("ghg") && !x.nodes.includes("elec"));
    const X = [];
    if (fire) X.push({ name: "Reinforcing: fires", links: loopLinks(M, fire), text: `${esc(loopName(M, fire))}: ${loopWhy(fire)}, so it amplifies warming.` });
    if (veg) X.push({ name: "Reinforcing: vegetation", links: loopLinks(M, veg), text: `${esc(loopName(M, veg))}: ${loopWhy(veg)}, so it amplifies warming too.` });
    if (acl) X.push({ name: "Balancing: AC", links: loopLinks(M, acl), text: `${esc(loopName(M, acl))}: ${loopWhy(acl)}. The desired effect of air conditioning.` });
    if (el2) X.push({ name: "Balancing: price", links: loopLinks(M, el2), text: `${esc(loopName(M, el2))}: ${loopWhy(el2)}. Price dampens consumption.` });
    if (unin) X.push({ name: "Unintended consequence", links: loopLinks(M, unin), text: `${esc(loopName(M, unin))}. The fix (AC) feeds the cause: ${loopWhy(unin)}, a reinforcing loop.` });
    cldViewer(el, "heat", "The heatwave system", "The diagram of session 1 (non-exhaustive). Light up a loop, or tap a variable.", X);
  },
  cocoa(el){ cldViewer(el, "cocoa", "From warming to chocolate prices", "Session 4's answer. Tap \"Global average temperature\": two paths reach chocolate consumption, both lowering it."); },
  homicide(el){ cldViewer(el, "homicide", "A cause tree: the US homicide rate", "The tutorial's illustrative example. Every arrow points towards the homicide rate: no loop, a cause tree."); },
  /* von Carlowitz: harvest a forest that regrows */
  msy(el){
    const r = .08, K = 1000, MSY = r * K / 4;
    el.innerHTML = `<h3 class="wt">Harvest a forest that regrows</h3><p class="wcap">The forest regrows fastest at half its natural size. Harvest each year, and see whether timber lasts 150 years.</p>
      <div class="wgrid"><div data-plot></div><div class="wctl" style="--c:var(--c2)"><label>Timber harvested per year <output data-o>16</output><input type="range" min="0" max="34" step="1" value="16" data-h></label><dl class="wout"><div><dt>Maximum sustainable yield</dt><dd>${MSY}</dd></div><div><dt>Stock after 150 years</dt><dd data-end></dd></div></dl><p class="verd"><span>Verdict</span><b data-v></b></p></div></div><p class="wnote">A logistic model (regrowth = 8% × stock × (1 − stock / 1,000)): MSY = 8% × 1,000 ÷ 4 = 20. Below it, the stock settles; above it, it collapses.</p>`;
    const draw = () => {
      const H = +el.querySelector("[data-h]").value; el.querySelector("[data-o]").textContent = H;
      let S = K; const pts = [[0, S]]; for (let t = 1; t <= 150; t++){ S = Math.max(0, S + r * S * (1 - S / K) - H); pts.push([t, S]); }
      const X = t => 36 + t * 1.75, Y = s => 170 - s * .15;
      el.querySelector("[data-plot]").innerHTML = SVGPLOT(310, 200, `<line x1="36" y1="170" x2="300" y2="170" class="ax"/><line x1="36" y1="20" x2="36" y2="170" class="ax"/><line x1="36" y1="${Y(500)}" x2="300" y2="${Y(500)}" class="gd"/><text x="40" y="${Y(500) - 4}" class="tk">half the forest: fastest regrowth</text><path d="${poly(pts.map(([t, s]) => [X(t), Y(s)]))}" class="ln ${H > MSY ? "b" : "r"}"/><text x="36" y="186" class="tk">0</text><text x="290" y="186" class="tk">150 years</text><text x="4" y="${Y(1000) + 4}" class="tk">1,000</text>`);
      el.querySelector("[data-end]").textContent = fmt(S, 0);
      const v = el.querySelector("[data-v]"); v.textContent = H > MSY ? "Overexploited: the forest disappears" : H === MSY ? "At the MSY: on a knife-edge" : "Sustainable: the stock settles"; v.style.color = H > MSY ? "var(--bad)" : "var(--ok)";
    };
    el.addEventListener("input", draw); draw();
  },
  /* two loops of population */
  popul(el){
    el.innerHTML = `<h3 class="wt">Births against deaths</h3><p class="wcap">Population feeds a positive loop through births and a negative loop through deaths. Change their strength.</p>
      <div class="wgrid"><div data-plot></div><div class="wctl" style="--c:var(--c2)"><label>Births per 1,000 people a year (fertility) <output data-ob></output><input type="range" min="5" max="45" value="30" data-b></label><label>Deaths per 1,000 people a year (mortality) <output data-od></output><input type="range" min="5" max="45" value="12" data-d></label><p class="verd"><span>Regime</span><b data-v></b></p><p class="small" data-why></p></div></div>`;
    const draw = () => {
      const b = +el.querySelector("[data-b]").value, d = +el.querySelector("[data-d]").value; el.querySelector("[data-ob]").textContent = b; el.querySelector("[data-od]").textContent = d;
      let P = 1; const pts = [[0, 1]]; for (let t = 1; t <= 100; t++){ P *= 1 + (b - d) / 1000; pts.push([t, P]); }
      const mx = Math.max(2, ...pts.map(p => p[1])), X = t => 30 + t * 2.7, Y = p => 170 - p / mx * 150;
      el.querySelector("[data-plot]").innerHTML = SVGPLOT(310, 196, `<line x1="30" y1="170" x2="300" y2="170" class="ax"/><line x1="30" y1="${Y(1)}" x2="300" y2="${Y(1)}" class="gd"/><path d="${poly(pts.map(([t, p]) => [X(t), Y(p)]))}" class="ln ${b > d ? "r" : "b"}"/><text x="30" y="188" class="tk">0</text><text x="270" y="188" class="tk">100 years</text><text x="2" y="${Y(1) + 4}" class="tk">start</text>`);
      const v = el.querySelector("[data-v]"), g = b - d;
      v.textContent = Math.abs(g) <= 2 ? "(+) ≈ (−): roughly stable" : g > 0 ? "(+) > (−): growth" : "(−) > (+): decline";
      el.querySelector("[data-why]").textContent = `Net change ${g > 0 ? "+" : ""}${(g / 10).toFixed(1)}% a year: after 100 years, ×${pts[100][1] >= 10 ? fmt(pts[100][1], 0) : pts[100][1].toFixed(2)}.`;
    };
    el.addEventListener("input", draw); draw();
  },
  /* the three pillars */
  venn(el){
    const Z = { env: ["Environment", "Preserve ecosystems, their capacity to regenerate and Holocene-like conditions."], soc: ["Social", "Meet everyone's needs, with social justice within and between generations."], eco: ["Economic", "Produce and distribute goods and services, and keep activity going."],
      bear: ["Bearable", "Environment + social: a liveable environment for people."], viab: ["Viable", "Environment + economic: an economy that lasts because it respects natural limits."], equi: ["Equitable", "Social + economic: a fair distribution of what the economy produces."], sus: ["Sustainable", "All three pillars at once: the aim of sustainable development."] };
    el.innerHTML = `<h3 class="wt">Three pillars, four overlaps</h3><p class="wcap">Tap a circle or an overlap.</p><div class="wgrid"><div>${SVGPLOT(300, 280, `<g class="venn"><circle cx="150" cy="100" r="78" class="v-env" data-z="env"/><circle cx="105" cy="178" r="78" class="v-soc" data-z="soc"/><circle cx="195" cy="178" r="78" class="v-eco" data-z="eco"/>
      <text x="150" y="58" data-z="env">Environment</text><text x="70" y="214" data-z="soc">Social</text><text x="232" y="214" data-z="eco">Economic</text><text x="104" y="128" data-z="bear" class="sm">Bearable</text><text x="196" y="128" data-z="viab" class="sm">Viable</text><text x="150" y="216" data-z="equi" class="sm">Equitable</text><text x="150" y="160" data-z="sus" class="sm b">Sustainable</text></g>`)}</div><div class="vout" aria-live="polite"></div></div>`;
    const out = el.querySelector(".vout");
    const show = z => { out.innerHTML = `<p class="verd"><b>${Z[z][0]}</b></p><p>${Z[z][1]}</p>`; el.querySelectorAll("[data-z]").forEach(x => x.classList.toggle("on", x.dataset.z === z)); };
    el.addEventListener("click", e => { const t = e.target.closest("[data-z]"); if (t) show(t.dataset.z); });
    show("sus");
  },
  /* resilience and tipping point: a ball in a landscape */
  basin(el){
    el.innerHTML = `<h3 class="wt">Resilience, then a tipping point</h3><p class="wcap">The ball is the system, the valleys are its possible states. Raise the pressure, give it a push, then lower the pressure again.</p>
      <canvas class="basin" width="640" height="300" aria-label="A ball in a two-valley landscape"></canvas>
      <div class="row wbar"><label class="pr">Pressure <input type="range" min="0" max="60" value="0" data-p aria-label="Pressure"></label><button class="btn glassy small" type="button" data-kick>Disturb it</button><button class="btn quiet small" type="button" data-reset>Start again</button></div><p class="wnote" aria-live="polite" data-st></p>`;
    const cv = el.querySelector("canvas"), ctx = cv.getContext("2d"), reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = -1, v = 0, p = 0, raf = 0, last = 0, tipped = false;
    const V = (x, p) => x ** 4 / 4 - x * x / 2 - p * x, dV = (x, p) => x ** 3 - x - p, PC = 2 / (3 * Math.sqrt(3));
    const col = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    function frame(){
      const W = cv.width, H = cv.height, X = s => W / 2 + s * 200, Y = y => H * .62 - y * 210;
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 3; ctx.strokeStyle = col("--muted"); ctx.beginPath();
      for (let i = 0; i <= 160; i++){ const s = -1.6 + i * 3.2 / 160; const yy = Y(V(s, p)); i ? ctx.lineTo(X(s), yy) : ctx.moveTo(X(s), yy); } ctx.stroke();
      ctx.font = "600 15px " + col("--f-body"); ctx.fillStyle = col("--muted"); ctx.textAlign = "center";
      ctx.fillText("initial state", X(-1), H - 14); ctx.fillText("new state", X(1), H - 14);
      ctx.fillStyle = tipped ? col("--bad") : col("--pri"); ctx.beginPath(); ctx.arc(X(x), Y(V(x, p)) - 13, 13, 0, 7); ctx.fill();
    }
    function step(t){
      raf = 0; const dt = Math.min(.05, (t - (last || t)) / 1000) * 3; last = t;
      for (let k = 0; k < 4; k++){ v += (-dV(x, p) - 1.4 * v) * dt / 4; x += v * dt / 4; }
      if (x > .2 && !tipped){ tipped = true; status(); }
      frame(); if (Math.abs(v) > .002 || Math.abs(dV(x, p)) > .002) raf = requestAnimationFrame(step); else last = 0;
    }
    const kick = () => { if (!raf){ last = 0; raf = requestAnimationFrame(step); } };
    function status(){ el.querySelector("[data-st]").textContent = tipped ? (p < PC ? "Tipped, and the pressure is back down, but the system stays in its new state: that is a tipping point (irreversible)." : "Past the threshold, the initial valley disappears: the system tips into a new state.") : p > PC * .8 ? "Close to the threshold: resilience is low, a small push could tip it." : "Resilient: after a disturbance the ball rolls back to its initial state."; }
    el.addEventListener("input", e => { if (!e.target.matches("[data-p]")) return; p = +e.target.value / 100; status(); if (reduce){ if (p > PC){ x = 1; tipped = true; } frame(); status(); } else kick(); });
    el.addEventListener("click", e => {
      if (e.target.closest("[data-kick]")){ if (reduce){ if (p > PC * .7){ x = 1; tipped = true; } frame(); status(); } else { v += .9; kick(); } }
      if (e.target.closest("[data-reset]")){ x = -1; v = 0; p = 0; tipped = false; el.querySelector("[data-p]").value = 0; status(); frame(); }
    });
    addEventListener("nexus-theme", frame); frame(); status();
  },
  accel(el){
    const SE = ["Population", "Real GDP", "Foreign direct investment", "Urban population", "Primary energy use", "Fertilizer consumption", "Large dams", "Water use", "Paper production", "Transportation", "Telecommunications", "International tourism"];
    const ES = ["Carbon dioxide", "Nitrous oxide", "Methane", "Stratospheric ozone", "Surface temperature", "Ocean acidification", "Marine fish capture", "Shrimp aquaculture", "Nitrogen to coastal zones", "Tropical forest loss", "Domesticated land", "Terrestrial biosphere degradation"];
    const curve = [[0, 0], [40, 2], [80, 6], [110, 12], [130, 22], [150, 40], [165, 64], [178, 92], [190, 124]];
    el.innerHTML = `<h3 class="wt">The Great Acceleration: 24 curves, one shape</h3><p class="wcap">From 1750 to today, twelve socio-economic trends and twelve Earth-system trends bend sharply upward after 1950 (Steffen et al., 2015). The curve is schematic: it shows the shared shape, not data.</p>
      <div class="wgrid"><div>${SVGPLOT(300, 170, `<line x1="30" y1="150" x2="290" y2="150" class="ax"/><line x1="182" y1="18" x2="182" y2="150" class="gd"/><text x="186" y="30" class="tk">1950</text><path d="${poly(curve.map(([a, b]) => [40 + a * 1.25, 148 - b]))}" class="ln r"/><text x="30" y="166" class="tk">1750</text><text x="262" y="166" class="tk">today</text>`)}</div>
      <div class="acc"><div><b>Socio-economic trends</b><p>${SE.map(t => `<span class="chip">${t}</span>`).join("")}</p></div><div><b>Earth-system trends</b><p>${ES.map(t => `<span class="chip e">${t}</span>`).join("")}</p></div></div></div>`;
  },
  /* planetary boundaries: which are crossed, year by year */
  pb(el){
    const PB = [["Biodiversity loss", 2009, "core"], ["Climate change", 2009, "core"], ["Nitrogen and phosphorus", 2009], ["Land-use change", 2015], ["Novel entities", 2022], ["Freshwater", 2023], ["Ocean acidification", 2025], ["Ozone depletion", 0], ["Aerosols", 0]];
    const YEARS = [2009, 2015, 2022, 2023, 2025];
    let yr = 2025, cur = null;
    el.innerHTML = `<h3 class="wt">Nine boundaries, seven crossed</h3><p class="wcap">Move through the scientific assessments. Tap a boundary.</p><div class="seg wseg" role="group" aria-label="Assessment">${YEARS.map(y => `<button type="button" data-y="${y}">${y}</button>`).join("")}</div><div class="wgrid"><div data-wheel></div><div class="pbout" aria-live="polite"></div></div>`;
    const draw = () => {
      el.querySelectorAll("[data-y]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.y === yr)));
      const n = PB.length, cx = 150, cy = 150; let s = `<circle cx="${cx}" cy="${cy}" r="58" class="pb-safe"/><text x="${cx}" y="${cy - 6}" class="pbc">${PB.filter(b => b[1] && b[1] <= yr).length}/9</text><text x="${cx}" y="${cy + 14}" class="tk" text-anchor="middle">crossed</text>`;
      PB.forEach((b, i) => { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n + .03, a1 = a0 + 2 * Math.PI / n - .06, crossed = b[1] && b[1] <= yr, R0 = 64, R1 = crossed ? 132 : 96;
        const pt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
        s += `<path d="M${pt(R0, a0)} L${pt(R1, a0)} A${R1},${R1} 0 0 1 ${pt(R1, a1)} L${pt(R0, a1)} A${R0},${R0} 0 0 0 ${pt(R0, a0)} z" class="pbw ${crossed ? "x" : "ok"} ${cur === i ? "on" : ""} ${b[2] ? "core" : ""}" data-b="${i}" tabindex="0" role="button" aria-label="${b[0]}: ${crossed ? "crossed" : "not crossed"}"/>`; });
      el.querySelector("[data-wheel]").innerHTML = SVGPLOT(300, 300, s);
      const b = cur == null ? null : PB[cur];
      el.querySelector(".pbout").innerHTML = b ? `<p class="verd"><b>${b[0]}</b></p><p>${b[1] ? (b[1] <= yr ? `Crossed${b[1] === 2009 ? " by 2009, at the first assessment" : ` in ${b[1]}`}.` : `Not yet crossed in ${yr}; crossed in ${b[1]}.`) : "Still within the safe operating space in 2025."}${b[2] ? " A core boundary: linked to all the others." : ""}</p>` : `<p><b>${PB.filter(b => b[1] && b[1] <= yr).length} of 9</b> boundaries crossed in ${yr}.</p><ul class="pbl">${PB.filter(b => b[1] && b[1] <= yr).map(b => `<li>${b[0]} <em>${b[1] === 2009 ? "≤ 2009" : b[1]}</em></li>`).join("")}</ul><p class="small muted">Longer wedges are crossed boundaries. Still within in 2025: ozone depletion and aerosols.</p>`;
    };
    el.addEventListener("click", e => { const y = e.target.closest("[data-y]"); if (y){ yr = +y.dataset.y; draw(); } const b = e.target.closest("[data-b]"); if (b){ cur = cur === +b.dataset.b ? null : +b.dataset.b; draw(); } });
    el.addEventListener("keydown", e => { const b = e.target.closest && e.target.closest("[data-b]"); if (b && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); cur = +b.dataset.b; draw(); } });
    draw();
  },
  drivers(el){
    const D = [["Land- and sea-use change", "Forests cleared, wetlands drained, coasts built over."], ["Direct exploitation", "Fishing, hunting and logging faster than populations regrow."], ["Climate change", "Species must move or adapt to new temperatures."], ["Pollution", "Pesticides, fertilizers, plastics."], ["Invasive alien species", "Species introduced outside their range, such as the Asian hornet."]];
    const I = ["Demographic and sociocultural", "Economic and technological", "Institutions and governance", "Conflicts and epidemics"];
    el.innerHTML = `<h3 class="wt">Why nature declines (IPBES)</h3><p class="wcap">Indirect drivers, rooted in values and behaviours, act through five direct drivers.</p><div class="drv"><div class="drv-i">${I.map(t => `<span>${t}</span>`).join("")}</div><div class="drv-a" aria-hidden="true">→</div><div class="drv-d">${D.map(([a, b]) => `<div class="drv-c"><b>${a}</b><span>${b}</span></div>`).join("")}</div><div class="drv-a" aria-hidden="true">→</div><div class="drv-n"><b>Nature declines</b><span>Ecosystems −47% · 25% of species threatened · wild mammal biomass −82%</span></div></div>`;
  },
  doughnut(el){
    const SOC = ["Water", "Food", "Health", "Education", "Income and work", "Peace and justice", "Political voice", "Social equity", "Gender equality", "Housing", "Networks", "Energy"];
    const ECO = ["Climate change", "Ocean acidification", "Chemical pollution", "Nitrogen and phosphorus loading", "Freshwater withdrawals", "Land conversion", "Biodiversity loss", "Air pollution", "Ozone layer depletion"];
    let cur = null;
    el.innerHTML = `<h3 class="wt">The Doughnut</h3><p class="wcap">Inner ring: the social foundation (12). Outer ring: the ecological ceiling (9). Between them, the safe and just space for humanity. Tap a segment.</p><div class="wgrid"><div data-d></div><div class="dout" aria-live="polite"></div></div>`;
    const draw = () => {
      const cx = 160, cy = 160; let s = `<circle cx="${cx}" cy="${cy}" r="104" class="dg-space"/><circle cx="${cx}" cy="${cy}" r="70" class="dg-hole"/>`;
      const ring = (arr, r0, r1, cls, tag) => arr.forEach((n, i) => { const k = arr.length, a0 = -Math.PI / 2 + i * 2 * Math.PI / k + .02, a1 = a0 + 2 * Math.PI / k - .04, pt = (r, a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
        s += `<path d="M${pt(r0, a0)} L${pt(r1, a0)} A${r1},${r1} 0 0 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0},${r0} 0 0 0 ${pt(r0, a0)} z" class="${cls} ${cur === tag + i ? "on" : ""}" data-dg="${tag}${i}" tabindex="0" role="button" aria-label="${n}"/>`; });
      ring(SOC, 52, 70, "dg-s", "s"); ring(ECO, 104, 124, "dg-e", "e");
      s += `<text x="${cx}" y="${cy - 4}" class="tk" text-anchor="middle">safe and just</text><text x="${cx}" y="${cy + 12}" class="tk" text-anchor="middle">space</text>`;
      el.querySelector("[data-d]").innerHTML = SVGPLOT(320, 320, s);
      const o = el.querySelector(".dout");
      if (!cur) o.innerHTML = `<p><b>Shortfall</b> inside the social ring: people below the foundation. <b>Overshoot</b> beyond the ecological ring: pressure above the ceiling.</p><p class="small muted">In 2025 no country is inside the doughnut: the richest 20% of countries cause over 40% of overshoot, the poorest 40% bear over 60% of shortfalls.</p>`;
      else { const soc = cur[0] === "s", i = +cur.slice(1); o.innerHTML = `<p class="verd"><span>${soc ? "Social foundation" : "Ecological ceiling"}</span><b>${soc ? SOC[i] : ECO[i]}</b></p><p>${soc ? "A minimum of this need must be met for everyone: falling below it is a shortfall." : "A planetary boundary: going beyond it is an overshoot."}</p>`; }
    };
    el.addEventListener("click", e => { const g = e.target.closest("[data-dg]"); if (g){ cur = cur === g.dataset.dg ? null : g.dataset.dg; draw(); } });
    el.addEventListener("keydown", e => { const g = e.target.closest && e.target.closest("[data-dg]"); if (g && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); cur = g.dataset.dg; draw(); } });
    draw();
  },
  /* standard of living and the French poverty line */
  living(el){
    const st = { ad: 2, teen: 0, kid: 1, inc: 3000, ben: 0, tax: 300 };
    const LINE = 1337;
    el.innerHTML = `<h3 class="wt">Is this household below the poverty line?</h3><p class="wcap">Set the household. The consumption units, disposable income and standard of living are computed as Insee does.</p>
      <div class="wgrid"><div class="wctl" style="--c:var(--c3)">${[["ad", "Adults", 1, 6], ["teen", "Children aged 14 or over", 0, 6], ["kid", "Children under 14", 0, 6]].map(([k, l, a, b]) => `<div class="step"><span>${l}</span><button type="button" data-st="${k}" data-d="-1" aria-label="Fewer">−</button><output data-v="${k}"></output><button type="button" data-st="${k}" data-d="1" aria-label="More">+</button></div>`).join("")}
        ${[["inc", "Earnings, pensions, asset income (€ a month)"], ["ben", "Social benefits (€ a month)"], ["tax", "Direct taxes: income tax, CSG, CRDS (€ a month)"]].map(([k, l]) => `<label>${l}<input type="number" min="0" step="50" value="${st[k]}" data-in="${k}" inputmode="numeric"></label>`).join("")}</div>
      <div><dl class="wout"><div><dt>Disposable income</dt><dd data-o="di"></dd></div><div><dt>Consumption units</dt><dd data-o="cu"></dd></div><div><dt>Standard of living</dt><dd data-o="sl"></dd></div><div><dt>Poverty line (France, 2024)</dt><dd>€1,337</dd></div></dl><div class="lvbar"><i data-o="bar"></i><b style="left:${LINE / 3000 * 100}%"></b></div><p class="verd"><b data-o="v"></b></p><p class="small" data-o="calc"></p></div></div>`;
    const draw = () => {
      ["ad", "teen", "kid"].forEach(k => el.querySelector(`[data-v="${k}"]`).textContent = st[k]);
      const di = st.inc + st.ben - st.tax, cu = 1 + .5 * (st.ad - 1 + st.teen) + .3 * st.kid, sl = di / cu;
      const O = k => el.querySelector(`[data-o="${k}"]`);
      O("di").textContent = eur(di); O("cu").textContent = fmt(cu, 1); O("sl").textContent = eur(sl);
      O("bar").style.width = Math.max(0, Math.min(100, sl / 3000 * 100)) + "%"; O("bar").className = sl < LINE ? "poor" : "";
      O("v").textContent = sl < LINE ? `Below the line by ${eur(LINE - sl)}: in relative monetary poverty` : `Above the line by ${eur(sl - LINE)}`; O("v").style.color = sl < LINE ? "var(--bad)" : "var(--ok)";
      O("calc").textContent = `CU = 1${st.ad > 1 || st.teen ? ` + 0.5 × ${st.ad - 1 + st.teen}` : ""}${st.kid ? ` + 0.3 × ${st.kid}` : ""} = ${fmt(cu, 1)} · ${fmt(di)} ÷ ${fmt(cu, 1)} = ${eur(sl)}`;
    };
    el.addEventListener("click", e => { const b = e.target.closest("[data-st]"); if (!b) return; const k = b.dataset.st, lo = k === "ad" ? 1 : 0; st[k] = Math.max(lo, Math.min(6, st[k] + +b.dataset.d)); draw(); });
    el.addEventListener("input", e => { const i = e.target.closest("[data-in]"); if (!i) return; st[i.dataset.in] = Math.max(0, +i.value || 0); draw(); });
    draw();
  },
  /* Lorenz curve, Gini and Palma for an illustrative society */
  lorenz(el){
    el.innerHTML = `<h3 class="wt">Make a society more or less unequal</h3><p class="wcap">An illustrative society of ten income groups (deciles). The Gini coefficient and the Palma index are computed from its Lorenz curve. Can you match France, then the United States?</p>
      <div class="wgrid"><div data-plot></div><div class="wctl" style="--c:var(--c3)"><label>Inequality <output data-o></output><input type="range" min="0" max="300" value="80" data-a></label><dl class="wout"><div><dt>Gini coefficient</dt><dd data-g></dd></div><div><dt>Palma index</dt><dd data-p></dd></div><div><dt>Top 10% share</dt><dd data-t></dd></div></dl><p class="small" data-near></p></div></div>`;
    const draw = () => {
      const a = +el.querySelector("[data-a]").value / 100; el.querySelector("[data-o]").textContent = a.toFixed(2);
      const raw = Array.from({ length: 10 }, (_, i) => (i + 1) ** a), sum = raw.reduce((x, y) => x + y, 0), sh = raw.map(x => x / sum);
      let cum = 0; const L = [[0, 0]]; sh.forEach((s, i) => { cum += s; L.push([(i + 1) / 10, cum]); });
      let B = 0; for (let i = 1; i < L.length; i++) B += (L[i][0] - L[i - 1][0]) * (L[i][1] + L[i - 1][1]) / 2;
      const gini = 1 - 2 * B, palma = sh[9] / (sh[0] + sh[1] + sh[2] + sh[3]);
      const X = x => 30 + x * 230, Y = y => 250 - y * 230;
      el.querySelector("[data-plot]").innerHTML = SVGPLOT(280, 270, `<path d="M${X(0)},${Y(0)} L${X(1)},${Y(1)} L${X(1)},${Y(0)} z" class="lz-area"/><path d="${poly(L.map(([x, y]) => [X(x), Y(y)]))} L${X(1)},${Y(0)} L${X(0)},${Y(0)} z" class="lz-under"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" class="gd"/><path d="${poly(L.map(([x, y]) => [X(x), Y(y)]))}" class="ln r"/><text x="${X(.36)}" y="${Y(.5)}" class="tk" transform="rotate(-45 ${X(.36)} ${Y(.5)})">perfect equality</text><text x="30" y="266" class="tk">0%</text><text x="236" y="266" class="tk">100% of people</text><text x="2" y="${Y(1) + 4}" class="tk">100%</text>`);
      el.querySelector("[data-g]").textContent = gini.toFixed(3); el.querySelector("[data-p]").textContent = palma.toFixed(2); el.querySelector("[data-t]").textContent = (sh[9] * 100).toFixed(1) + "%";
      el.querySelector("[data-near]").textContent = Math.abs(gini - .292) < .012 ? "About France's Gini (0.292, 2019)." : Math.abs(gini - .375) < .012 ? "About the United States' Gini (0.375, 2021)." : gini < .292 ? "More equal than France (0.292)." : gini < .375 ? "Between France (0.292) and the United States (0.375)." : "More unequal than the United States (0.375).";
    };
    el.addEventListener("input", draw); draw();
  },
  words(el){
    const W = [["Economy", "All activities that produce, store and distribute goods. Several models exist: capitalism is one of them.", "Oikos + nomos: household management."], ["Market", "A place where goods, capital or labour are exchanged for money. Older than capitalism.", "A farmers' market; an online marketplace."], ["Capitalism", "Market exchanges + the possibility of investing money to make more money (Fulcher).", "Buying shares of the East India Company."], ["Market economy", "Supply and prices set by free market forces rather than the state (versus planned or mixed).", "Prices of phones set by supply and demand."]];
    el.innerHTML = `<h3 class="wt">Four words not to confuse</h3><p class="wcap">They are not synonyms. Tap each one.</p><div class="wds">${W.map(([a, b, c], i) => `<button type="button" class="wd" data-w="${i}"><b>${a}</b><span class="wd-d">${b}</span><em>${c}</em></button>`).join(`<i class="neq" aria-hidden="true">≠</i>`)}</div>`;
    el.addEventListener("click", e => { const b = e.target.closest("[data-w]"); if (b) b.classList.toggle("open"); });
  },
  growth(el){
    const G = [["Brown growth", "Growth continues as now, on fossil fuel extraction and a linear economy.", "Climate scepticism, economic libertarianism, techno-solutionism.", "\"Drill, baby, drill.\"", "S4 Restoration gamble keeps carbon-based growth, betting on technology to repair."],
      ["Green growth", "Growth decoupled from environmental pressures enough to stay within planetary boundaries.", "Techno-optimism, economic liberalism, weak sustainability.", "OECD (2011)", "S3 Green technologies."],
      ["Selective growth", "Growth differentiated by countries' level of wealth and by economic sector.", "Techno-scepticism, reformist environmentalism, strong sustainability.", "Jackson (2009)", "S2 Regional cooperation (qualitative growth)."],
      ["Degrowth", "Abandon growth as a primary objective, or deliberately reduce production and consumption where needed.", "Techno-criticism, anti-capitalism, strong sustainability.", "Latouche (2024)", "S1 Frugal generation."]];
    el.innerHTML = `<h3 class="wt">Four positions on growth</h3><p class="wcap">Slide from \"grow as before\" to \"stop chasing growth\".</p><input type="range" min="0" max="3" step="1" value="1" class="gslide" aria-label="Position" data-g><div class="gscale">${G.map(g => `<span>${g[0]}</span>`).join("")}</div><div class="gcard" aria-live="polite"></div><p class="wnote">The link with ADEME's scenarios is our reading, not the slides'.</p>`;
    const draw = () => { const g = G[+el.querySelector("[data-g]").value]; el.querySelector(".gcard").innerHTML = `<p class="verd"><b>${g[0]}</b></p><p>${g[1]}</p><dl class="wout"><div><dt>Foundations</dt><dd>${g[2]}</dd></div><div><dt>Reference</dt><dd>${g[3]}</dd></div><div><dt>Closest ADEME scenario</dt><dd>${g[4]}</dd></div></dl>`; };
    el.addEventListener("input", draw); draw();
  },
  ademe(el){
    const S = ["S1 Frugal generation", "S2 Regional cooperation", "S3 Green technologies", "S4 Restoration gamble"];
    const T = [["Society", ["Search for meaning; frugality chosen but also imposed; local sourcing; nature protected", "Sustainable lifestyle changes; sharing economy; fairness; nature's preservation in law", "New technologies rather than less consumption; green consumerism for the well-off; nature's services optimized", "Mass consumption kept; nature a resource to exploit; confidence in repairing ecosystems"]],
      ["Food", ["Meat ÷3; 70% organic", "Meat halved; 50% organic", "Meat −30%; 30% organic", "Meat almost stable (−10%), plus synthetic or plant proteins"]],
      ["Housing", ["Massive, rapid renovation; strong limits on new construction", "Massive renovation; housing adapted to household size", "Large-scale demolition and rebuilding; only half deeply renovated", "New construction maintained; only half the stock renovated; appliances multiply"]],
      ["Mobility", ["Distance per person −⅓; half of journeys on foot or by bike", "Distance −17%; nearly half on foot or by bike", "Distance +13%; 30% on foot or by bike; teleworking", "Distance +28%; speed first; 20% on foot or by bike"]],
      ["Technical", ["Low-tech, reuse, repair; stable data-centre use", "Massive investment in efficiency and renewables; stable data centres", "Most competitive technologies to decarbonize; data centres ×10", "Innovation everywhere; carbon capture essential; data centres ×15"]],
      ["Governance", ["Local decisions; regulation, prohibition, rationing via quotas", "Shared governance; environmental taxation and redistribution; European cooperation", "Minimum regulation; the state as planner; targeted carbon tax", "Supply-side support; targeted international cooperation; centralized energy planning"]],
      ["Economy", ["New prosperity indicators; less international trade; 70% recycled materials", "Qualitative growth; re-industrialization; 80% recycled materials", "Green growth; globalized trade; 60% recycled materials", "Carbon-based growth; minimal carbon tax; 45% recycled materials"]]];
    let row = 0;
    el.innerHTML = `<h3 class="wt">ADEME's four scenarios, side by side</h3><p class="wcap">Pick a topic and compare the four paths to 2050.</p><div class="seg wseg" role="group" aria-label="Topic">${T.map((t, i) => `<button type="button" data-t="${i}">${t[0]}</button>`).join("")}</div><div class="ad4" aria-live="polite"></div>`;
    const draw = () => { el.querySelectorAll("[data-t]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.t === row))); el.querySelector(".ad4").innerHTML = S.map((s, i) => `<div class="ads s${i + 1}"><b>${s}</b><p>${T[row][1][i]}</p></div>`).join(""); };
    el.addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (b){ row = +b.dataset.t; draw(); } });
    draw();
  }
};
