/* ---------- the signature: a living causal system (canvas 2D, 3D projection, no library) ----------
   The heatwave diagram of session 1 floats in depth: environmental variables at the back, social in the
   middle, economic in front. Influence flows along every arrow as small pulses (warm for +, cool for −).
   Four views light up what the course teaches: the whole system, a reinforcing loop, balancing loops,
   and the unintended consequence of air conditioning. Clicking a variable pushes it up: the change
   spreads through the arrows, and every variable it reaches rises (▲) or falls (▼), worked out from
   the signs. The scene sways slowly in 3D, the pointer tilts it. */
const SYS_VIEWS = [
  { name: "The system", def: "Fifteen variables, twenty-one arrows: the causes and consequences of heatwaves act on each other." },
  { name: "Reinforcing loop", def: "Warming dries soils, dry soils burn, fires emit CO₂, CO₂ warms more. Only + signs: the loop amplifies." },
  { name: "Balancing loops", def: "Air conditioning lowers indoor heat; a higher price lowers consumption. One − sign each: these loops dampen." },
  { name: "Unintended consequence", def: "AC cools the room, but its emissions feed warming, which brings more heat: the fix feeds the problem." },
  { name: "Your turn", def: "Tap any variable to push it up, and follow the signs through the system." }
];
function mountSystem(hero, o = {}){
  const cv = o.canvas || hero.querySelector("canvas"), ctx = cv.getContext("2d");
  const btns = o.mini ? [] : [...hero.querySelectorAll("[data-view]")], def = o.mini ? null : hero.querySelector(".formdef");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const M = cldModel(CLDI[o.id || "heat"]), loops = findLoops(M);
  const ZK = { env: -.42, soc: .12, eco: .5 };
  const P = M.nodes.map((n, i) => ({ ...n, lines: wrapLabel(n.label, 20).slice(0, 2), X: (n.x - 500) / 500 * 1.25, Y: (n.y - 300) / 300 * .82, Z: ZK[n.kind] + Math.sin(i * 2.3) * .14, sx: 0, sy: 0, s: 1, zz: 0, glow: 0, mark: 0, dl: 0 }));
  const PI = Object.fromEntries(P.map(p => [p.id, p]));
  const L = M.links.map((l, i) => ({ ...l, a: PI[l.from], b: PI[l.to], hot: 0, pulses: [Math.random(), (Math.random() + .5) % 1], sp: .18 + Math.random() * .12 }));
  const findLoop = ids => loops.find(x => x.nodes.length === ids.length && ids.every(i => x.nodes.includes(i)));
  const VIEWLINKS = [null,
    new Set((findLoop(["ghg", "temp", "heat", "soil", "fire", "emi"]) || { links: [] }).links.map(linkKey)),
    new Set([...(findLoop(["indoor", "ac"]) || { links: [] }).links, ...(findLoop(["elec", "price"]) || { links: [] }).links].map(linkKey)),
    new Set((loops.find(x => x.nodes.includes("ac") && x.nodes.includes("ghg") && !x.nodes.includes("elec")) || { links: [] }).links.map(linkKey).concat(["ac>indoor"])),
    null];
  let W = 0, H = 0, dpr = 1, area = { cx: 0, cy: 0, R: 100 }, view = 0, since = 0, nextAuto = 6.5, auto = !reduce && !o.mini, hoverLock = false, push = null, pushT = 0, hover = null;
  let raf = 0, dead = false, onScreen = true, last = performance.now(), T = 0, slow = 0, frames = 0, low = false, col = {}, dark = true;
  const mouse = { x: -1e4, y: -1e4, nx: 0, ny: 0, tx: 0, ty: 0, in: false };
  const hx = s => { s = s.trim(); if (s.startsWith("#")) return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const m = s.match(/\d+(\.\d+)?/g); return m ? m.slice(0, 3).map(Number) : [128, 128, 128]; };
  function readCols(){ const cs = getComputedStyle(document.documentElement); dark = document.documentElement.dataset.theme !== "light";
    col = { fg: hx(cs.getPropertyValue("--fg")), muted: hx(cs.getPropertyValue("--muted")), faint: hx(cs.getPropertyValue("--faint")), env: hx(cs.getPropertyValue("--pri")), soc: hx(cs.getPropertyValue("--c3")), eco: hx(cs.getPropertyValue("--c1")), plus: hx(cs.getPropertyValue("--c4")), minus: hx(cs.getPropertyValue("--c5")), bg: hx(cs.getPropertyValue("--bg")), fbody: cs.getPropertyValue("--f-body").trim() || "sans-serif", fmono: cs.getPropertyValue("--f-mono").trim() || "monospace" }; }
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
  function size(){
    const r = hero.getBoundingClientRect(); dpr = Math.min(low ? 1 : 2, devicePixelRatio || 1); W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    if (o.mini){ const n = W < 700; area = { cx: W * (n ? .5 : .6), cy: H * .5, R: Math.min(W * (n ? .44 : .3), H * .62) }; }
    else if (W < 821){ const row = hero.querySelector(".row"), top = row ? row.getBoundingClientRect().bottom - r.top + 18 : H * .55, avail = Math.max(300, H - top); area = { cx: W / 2, cy: top + avail / 2, R: Math.min(W * .46, avail * .62) }; }
    else area = { cx: W * .73, cy: H * .53, R: Math.min(W * .21, H * .41) };
  }
  function setView(v, force){
    v = (v + SYS_VIEWS.length) % SYS_VIEWS.length; if (v === view && !force) return;
    view = v; since = T; nextAuto = T + 6.5; if (v !== 4) push = null;
    btns.forEach((b, i) => b.setAttribute("aria-pressed", String(i === view)));
    if (def) def.innerHTML = `<b>${SYS_VIEWS[view].name}.</b> ${SYS_VIEWS[view].def}`;
    if (reduce) draw();
  }
  function project(p, yaw, pitch){
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = p.X * cy + p.Z * sy, z1 = -p.X * sy + p.Z * cy, y2 = p.Y * cp - z1 * sp, z2 = p.Y * sp + z1 * cp, f = 3.4, s = f / (f + z2);
    p.s = s; p.zz = z2; p.sx = area.cx + x1 * s * area.R; p.sy = area.cy + y2 * s * area.R;
  }
  const qpt = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  function draw(){
    const yaw = reduce ? .22 : Math.sin(T * .16) * .42 + mouse.nx * .35, pitch = .2 + (reduce ? 0 : mouse.ny * .18);
    P.forEach(p => project(p, yaw, pitch));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const VL = VIEWLINKS[view], hotSet = VL && VL.size ? VL : null, settle = reduce ? 1 : Math.min(1, (T - since) / .8);
    const reached = push ? propagate(M, push) : null, pAge = T - pushT;
    if (dark) ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    /* links */
    L.forEach(l => {
      const a = [l.a.sx, l.a.sy], b = [l.b.sx, l.b.sy], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      const c = [(a[0] + b[0]) / 2 - dy / len * len * .12, (a[1] + b[1]) / 2 + dx / len * len * .12];
      const k = linkKey(l), on = hotSet ? hotSet.has(k) : reached ? ((l.from === push || reached[l.from]) && reached[l.to] && pAge > (reached[l.to].step - .6) * .4) : true;
      const tgt = hotSet ? (on ? 1 : .12) : reached ? (on ? 1 : .14) : .5; l.hot += (tgt - l.hot) * .08;
      const cc = l.sign > 0 ? col.plus : col.minus, depth = Math.min(1, Math.max(.35, (Math.min(l.a.s, l.b.s) - .7) / .45));
      ctx.lineWidth = (o.mini ? 1 : 1.4) * (l.hot > .6 ? 1.6 : 1);
      ctx.strokeStyle = rgba(cc, (o.mini ? .22 : .3) * l.hot * depth + .05); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(c[0], c[1], b[0], b[1]); ctx.stroke();
      /* arrow head near the target */
      const e = qpt(a, c, b, .86), f = qpt(a, c, b, .8), ang = Math.atan2(e[1] - f[1], e[0] - f[0]), hs = o.mini ? 4 : 6;
      ctx.fillStyle = rgba(cc, .5 * l.hot * depth + .08); ctx.beginPath(); ctx.moveTo(e[0] + Math.cos(ang) * hs, e[1] + Math.sin(ang) * hs); ctx.lineTo(e[0] + Math.cos(ang + 2.5) * hs, e[1] + Math.sin(ang + 2.5) * hs); ctx.lineTo(e[0] + Math.cos(ang - 2.5) * hs, e[1] + Math.sin(ang - 2.5) * hs); ctx.fill();
      /* pulses: influence travelling along the arrow */
      if (!low || !o.mini){
        const sp = l.sp * (hotSet && on ? 2.2 : 1);
        l.pulses.forEach((t0, j) => { const t = reduce ? (j ? .7 : .3) : (t0 + T * sp) % 1, p = qpt(a, c, b, .12 + t * .7), r = (o.mini ? 1.6 : 2.4) * (l.hot > .6 ? 1.4 : 1);
          ctx.fillStyle = rgba(cc, (.25 + .7 * l.hot) * depth * Math.sin(t * Math.PI)); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); ctx.fill(); });
      }
      /* sign, on the highlighted arrows */
      if (!o.mini && l.hot > .7 && (hotSet || reached)){ const m = qpt(a, c, b, .55); ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = rgba(col.bg, .85); ctx.beginPath(); ctx.arc(m[0], m[1], 9, 0, 7); ctx.fill(); ctx.fillStyle = rgba(cc, 1); ctx.font = "700 13px " + col.fmono; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(l.sign > 0 ? "+" : "−", m[0], m[1] + .5); if (dark) ctx.globalCompositeOperation = "lighter"; }
    });
    /* variables, far first */
    const order = P.slice().sort((a, b) => b.zz - a.zz);
    for (const p of order){
      const kc = col[p.kind], depth = Math.min(1, Math.max(.3, (p.s - .72) / .42));
      const lit = hotSet ? [...hotSet].some(k => k.split(">").includes(p.id)) : reached ? (p.id === push || (reached[p.id] && pAge > reached[p.id].step * .4)) : true;
      p.glow += ((lit ? 1 : .25) - p.glow) * .08;
      const r = (o.mini ? 3.4 : 6.5) * p.s * (p.id === hover ? 1.5 : 1) * (p.id === push ? 1.6 : 1);
      if (!low){ ctx.fillStyle = rgba(kc, .1 * p.glow * depth); ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 4.2, 0, 7); ctx.fill(); }
      ctx.fillStyle = rgba(kc, (dark ? .55 : .75) * p.glow * depth + .18); ctx.beginPath(); ctx.arc(p.sx, p.sy, r, 0, 7); ctx.fill();
      if (!o.mini){
        const showLabel = W >= 821 || lit && (hotSet || reached) || p.id === hover;
        if (showLabel){
          ctx.globalCompositeOperation = "source-over";
          ctx.font = `600 ${W < 821 ? 11 : 12.5}px ` + col.fbody; ctx.textAlign = "center"; ctx.textBaseline = "top";
          ctx.fillStyle = rgba(col.fg, (.25 + .75 * p.glow) * depth); p.lines.forEach((t, k) => ctx.fillText(t, p.sx, p.sy + r + 5 + k * (W < 821 ? 13 : 15)));
          if (reached && reached[p.id] && pAge > reached[p.id].step * .4){ const e = reached[p.id].eff; ctx.font = "700 13px sans-serif"; ctx.fillStyle = rgba(e === "up" ? col.plus : e === "down" ? col.minus : col.muted, 1); ctx.fillText(e === "up" ? "▲" : e === "down" ? "▼" : "▲▼", p.sx, p.sy - r - 18); }
          if (dark) ctx.globalCompositeOperation = "lighter";
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }
  function step(now){
    raf = 0; if (dead) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; T += dt;
    frames++; if (dt > .034) slow++; if (frames === 90){ if (slow > 45 && !low){ low = true; size(); } frames = 0; slow = 0; }
    if (auto && !hoverLock && T > nextAuto && view !== 4) setView(view + 1 > 3 ? 0 : view + 1);
    mouse.nx += (mouse.tx - mouse.nx) * .05; mouse.ny += (mouse.ty - mouse.ny) * .05;
    draw();
    if (onScreen && !document.hidden) raf = requestAnimationFrame(step);
  }
  const kick = () => { if (!raf && !dead && !reduce && onScreen && !document.hidden){ last = performance.now(); raf = requestAnimationFrame(step); } };
  const pick = (x, y) => { let best = null, bd = 26; P.forEach(p => { const d = Math.hypot(p.sx - x, p.sy - y); if (d < bd){ bd = d; best = p.id; } }); return best; };
  const onLeave = () => { mouse.in = false; mouse.tx = mouse.ty = 0; hover = null; };
  const onMove = e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (o.mini && (mouse.y > H + 40 || mouse.y < -40)){ onLeave(); return; } mouse.in = e.pointerType === "mouse"; mouse.tx = (mouse.x / W - .5) * 2; mouse.ty = (mouse.y / H - .5) * 2; if (!o.mini){ hover = pick(mouse.x, mouse.y); cv.style.cursor = hover ? "pointer" : "default"; } };
  const onClick = e => { if (e.target.closest("a,button,input,textarea")) return; const r = hero.getBoundingClientRect(), id = pick(e.clientX - r.left, e.clientY - r.top); if (!id) return; auto = false; setView(4, true); push = id; pushT = T; if (reduce) draw(); };
  const host = o.mini ? window : hero;
  host.addEventListener("pointermove", onMove, { passive: true });
  if (!o.mini){ hero.addEventListener("pointerleave", onLeave); hero.addEventListener("click", onClick); }
  btns.forEach((b, i) => {
    b.addEventListener("click", () => { auto = false; setView(i, true); });
    b.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse") return; hoverLock = true; if (i !== 4) setView(i); });
    b.addEventListener("pointerleave", () => { hoverLock = false; nextAuto = T + 6.5; });
  });
  const io = new IntersectionObserver(es => { onScreen = es[0].isIntersecting; if (onScreen) kick(); }); io.observe(hero);
  const onVis = () => { if (!document.hidden) kick(); }; document.addEventListener("visibilitychange", onVis);
  const onResize = () => { size(); if (reduce) draw(); }; addEventListener("resize", onResize);
  const onTheme = () => { readCols(); if (reduce) draw(); }; addEventListener("nexus-theme", onTheme);
  readCols(); size(); setView(o.mini ? 0 : 0, true);
  if (reduce) draw(); else kick();
  return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); removeEventListener("resize", onResize); removeEventListener("nexus-theme", onTheme); host.removeEventListener("pointermove", onMove); };
}
