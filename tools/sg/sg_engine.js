/* =====================================================================
   CAUSAL DIAGRAM ENGINE — models, loops, paths and effects (computed, never written by hand),
   and an SVG board shared by the Learn widgets, the Causal studio and the exam.
   ===================================================================== */
const BOARD = { W: 1000, H: 620 };
/* a diagram from the data file → { nodes: [{id,label,kind,x,y}], links: [{from,to,sign,why,via}] } */
function cldModel(d){
  return { id: d.id, nodes: d.nodes.map(n => Array.isArray(n) ? { id: n[0], label: n[1], kind: n[2], x: n[3], y: n[4] } : { ...n }),
    links: d.links.map(l => Array.isArray(l) ? { from: l[0], to: l[1], sign: l[2], why: l[3] || "", via: (l[4] || {}).via || null, at: (l[4] || {}).at } : { ...l }) };
}
const linkKey = l => l.from + ">" + l.to;
/* every elementary loop; polarity by the course's rule (count the minus signs) */
function findLoops(m, cap = 80){
  const ids = m.nodes.map(n => n.id), idx = Object.fromEntries(ids.map((id, i) => [id, i])), out = {};
  m.links.forEach(l => { if (idx[l.from] != null && idx[l.to] != null) (out[l.from] = out[l.from] || []).push(l); });
  const loops = [];
  ids.forEach((start, s) => {
    const seen = new Set([start]), path = [];
    const dfs = v => {
      if (loops.length >= cap) return;
      for (const l of out[v] || []){
        if (l.to === start){ loops.push(path.concat(l)); continue; }
        if (idx[l.to] > s && !seen.has(l.to)){ seen.add(l.to); path.push(l); dfs(l.to); path.pop(); seen.delete(l.to); }
      }
    };
    dfs(start);
  });
  return loops.map(ls => { const neg = ls.filter(l => l.sign < 0).length; return { links: ls, nodes: ls.map(l => l.from), neg, kind: neg % 2 ? "B" : "R" }; })
    .sort((a, b) => a.links.length - b.links.length);
}
/* every simple path from a to b, with the product of its signs */
function pathsBetween(m, a, b, cap = 60, maxLen = 10){
  const out = {}; m.links.forEach(l => (out[l.from] = out[l.from] || []).push(l));
  const res = [], seen = new Set([a]), path = [];
  const dfs = v => {
    if (res.length >= cap || path.length > maxLen) return;
    for (const l of out[v] || []){
      if (l.to === b){ const p = path.concat(l); res.push({ links: p, sign: p.reduce((s, x) => s * x.sign, 1) }); continue; }
      if (!seen.has(l.to)){ seen.add(l.to); path.push(l); dfs(l.to); path.pop(); seen.delete(l.to); }
    }
  };
  dfs(a);
  return res;
}
/* the effect of a rise in a on b, all else being equal: "up", "down", "mixed" or null (no path) */
function effectOf(m, a, b){
  const ps = pathsBetween(m, a, b); if (!ps.length) return { eff: null, paths: [] };
  const pos = ps.some(p => p.sign > 0), neg = ps.some(p => p.sign < 0);
  return { eff: pos && neg ? "mixed" : pos ? "up" : "down", paths: ps };
}
/* push a variable up: every variable it reaches, with the direction and the step at which it is reached */
function propagate(m, a){
  const res = {}, nodes = m.nodes.map(n => n.id);
  nodes.forEach(id => { if (id === a) return; const e = effectOf(m, a, id); if (e.eff) res[id] = { eff: e.eff, step: Math.min(...e.paths.map(p => p.links.length)) }; });
  return res;
}
const nodeLabel = (m, id) => (m.nodes.find(n => n.id === id) || { label: id }).label;
const signTxt = s => s > 0 ? "+" : s < 0 ? "−" : "?";
const loopName = (m, L) => L.nodes.map(id => nodeLabel(m, id)).concat(nodeLabel(m, L.nodes[0])).join(" → ");
const loopWhy = L => L.neg === 0 ? "only + signs" : `${L.neg} minus sign${L.neg > 1 ? "s" : ""}, an ${L.neg % 2 ? "odd" : "even"} number`;

/* ---------- drawing ---------- */
function wrapLabel(t, max = 19){
  const words = String(t).split(" "), lines = []; let cur = "";
  words.forEach(w => { if ((cur + " " + w).trim().length > max && cur){ lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
  if (cur) lines.push(cur);
  return lines;
}
function nodeBox(n){
  const lines = wrapLabel(n.label), w = Math.max(104, Math.min(186, Math.max(...lines.map(l => l.length)) * 7.4 + 26)), h = 18 + lines.length * 15;
  return { lines, w, h, x0: n.x - w / 2, y0: n.y - h / 2 };
}
function edgePoint(n, b, tx, ty, pad = 4){
  const dx = tx - n.x, dy = ty - n.y; if (!dx && !dy) return [n.x, n.y];
  const sx = (b.w / 2 + pad) / Math.abs(dx || 1e-9), sy = (b.h / 2 + pad) / Math.abs(dy || 1e-9), s = Math.min(sx, sy);
  return [n.x + dx * s, n.y + dy * s];
}
/* a path through the waypoints with rounded corners; returns the "d", and a point near the end for the sign */
function routePath(pts, bend, at){
  if (pts.length === 2){
    const [a, b] = pts;
    if (bend){ const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, cx = mx - dy / L * bend * L, cy = my + dx / L * bend * L;
      const t = .62, px = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0], py = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
      return { d: `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`, sx: px, sy: py }; }
    const t = .66; return { d: `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`, sx: a[0] + (b[0] - a[0]) * t, sy: a[1] + (b[1] - a[1]) * t };
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++){
    const p = pts[i], a = pts[i - 1], b = pts[i + 1], r = 14;
    const la = Math.hypot(p[0] - a[0], p[1] - a[1]) || 1, lb = Math.hypot(b[0] - p[0], b[1] - p[1]) || 1, ra = Math.min(r, la / 2), rb = Math.min(r, lb / 2);
    const p1 = [p[0] - (p[0] - a[0]) / la * ra, p[1] - (p[1] - a[1]) / la * ra], p2 = [p[0] + (b[0] - p[0]) / lb * rb, p[1] + (b[1] - p[1]) / lb * rb];
    d += ` L${p1[0].toFixed(1)},${p1[1].toFixed(1)} Q${p[0]},${p[1]} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const z = pts[pts.length - 1], y = pts[pts.length - 2];
  d += ` L${z[0].toFixed(1)},${z[1].toFixed(1)}`;
  const k = at == null ? .55 : at; return { d, sx: y[0] + (z[0] - y[0]) * k, sy: y[1] + (z[1] - y[1]) * k };
}
/* the board: o.links overrides the model's links (a student's diagram); o.cls(link) and o.ncls(node) add classes;
   o.sign(link) returns the sign to show (null hides it, 0 shows "?"); o.loops draws R/B markers */
function boardSVG(m, o = {}){
  const links = o.links || m.links, N = Object.fromEntries(m.nodes.map(n => [n.id, n])), B = Object.fromEntries(m.nodes.map(n => [n.id, nodeBox(n)]));
  const keys = new Set(links.map(linkKey)), uid = "b" + Math.random().toString(36).slice(2, 7);
  const marker = (id, c) => `<marker id="${uid}${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  const kinds = ["n", "ok", "bad", "miss", "extra", "hot", "dim", "up", "down"];
  const COL = { n: "var(--muted)", ok: "var(--ok)", bad: "var(--bad)", miss: "var(--faint)", extra: "var(--c4)", hot: "var(--c4)", dim: "var(--line-2)", up: "var(--c4)", down: "var(--c1)" };
  let defs = `<defs>${kinds.map(k => marker(k, COL[k])).join("")}</defs>`;
  const linkSvg = links.map((l, i) => {
    const a = N[l.from], b = N[l.to]; if (!a || !b) return "";
    const via = !o.straight && l.via ? l.via : null, rev = keys.has(l.to + ">" + l.from);
    const first = via ? via[0] : [b.x, b.y], last = via ? via[via.length - 1] : [a.x, a.y];
    let s = edgePoint(a, B[l.from], first[0], first[1]), e = edgePoint(b, B[l.to], last[0], last[1], 7);
    const pts = via ? [s, ...via, e] : [s, e];
    const r = routePath(pts, !via && rev ? .16 : 0, via ? l.at : null);
    const cls = (o.cls && o.cls(l, i)) || "n", sg = o.sign ? o.sign(l, i) : l.sign;
    return `<g class="lk ${cls}" data-li="${i}"><path class="lkhit" d="${r.d}"/><path class="lkp" d="${r.d}" marker-end="url(#${uid}${kinds.includes(cls) ? cls : "n"})"/>${sg === null ? "" : `<g class="sgn ${sg > 0 ? "p" : sg < 0 ? "m" : "q"}" data-sl="${i}" transform="translate(${r.sx.toFixed(1)},${r.sy.toFixed(1)})"><circle r="11.5"/><text dy=".36em">${signTxt(sg)}</text></g>`}</g>`;
  }).join("");
  const nodeSvg = m.nodes.map(n => { const b = B[n.id], cls = (o.ncls && o.ncls(n)) || "";
    return `<g class="nd k-${n.kind} ${cls}" data-n="${n.id}" transform="translate(${b.x0.toFixed(1)},${b.y0.toFixed(1)})" tabindex="${o.focusable ? 0 : -1}" role="${o.focusable ? "button" : "img"}" aria-label="${esc(n.label)}"><rect width="${b.w.toFixed(1)}" height="${b.h}" rx="9"/>${b.lines.map((t, k) => `<text x="${(b.w / 2).toFixed(1)}" y="${(17 + k * 15).toFixed(1)}">${esc(t)}</text>`).join("")}</g>`; }).join("");
  let loopSvg = "";
  if (o.loops) loopSvg = o.loops.map((L, k) => { const xs = L.nodes.map(id => N[id].x), ys = L.nodes.map(id => N[id].y), cx = xs.reduce((a, b) => a + b, 0) / xs.length, cy = ys.reduce((a, b) => a + b, 0) / ys.length;
    return `<g class="lpm ${L.kind}" transform="translate(${cx.toFixed(1)},${cy.toFixed(1)})"><path d="M-13,-4 A13,13 0 1 1 -4,12" /><path class="ah" d="M-8,9 L-3,13 L-9,15"/><text dy=".35em">${L.kind}${o.loops.length > 1 ? k + 1 : ""}</text></g>`; }).join("");
  return `<svg class="board" viewBox="0 0 ${BOARD.W} ${BOARD.H}" role="img" aria-label="${esc(o.label || "Causal diagram")}">${defs}<g class="lks">${linkSvg}</g><g class="lps">${loopSvg}</g><g class="nds">${nodeSvg}</g></svg>`;
}
const legendHtml = () => `<ul class="cldleg">${Object.entries(KINDS).map(([k, v]) => `<li><i class="k-${k}"></i>${v.name} variables</li>`).join("")}<li><b class="sgn-mini p">+</b>same direction</li><li><b class="sgn-mini m">−</b>opposite directions</li></ul>`;
