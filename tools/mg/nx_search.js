/* ---------- search: every card, exam question and case, one keystroke away (/ or Ctrl K) ---------- */
const norm = s => String(s == null ? "" : s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/<[^>]+>/g, " ");
const GOTO = { note: null };
let SEARCH_INDEX = null;
function searchIndex(){
  if (SEARCH_INDEX) return SEARCH_INDEX;
  const out = [];
  COURSE.forEach(c => c.sections.forEach(sec => sec.cards.forEach(k => out.push({ kind: "Card", t: k.title, s: [k.line, ...(k.points || []), k.example || "", k.formula || "", k.trap || ""].join(" "), href: "#learn-" + c.id, note: k.id, c: c.c, where: `${c.short} · ${sec.title}` }))));
  OPEN.forEach(o => out.push({ kind: "Exam question", t: o.q, s: o.points.join(" "), href: "#open-" + o.id, c: CH[o.ch].c, where: CH[o.ch].short }));
  CARDS.forEach(([ch, f, bk]) => out.push({ kind: "Definition", t: f, s: bk, href: (typeof CARDS_HREF === "string" ? CARDS_HREF : "#cards-") + ch, c: CH[ch].c, where: bk }));
  SEARCH_EXTRA().forEach(x => out.push(x));
  out.forEach(x => { x.nt = norm(x.t); x.ns = norm(x.s); });
  return (SEARCH_INDEX = out);
}
function searchFind(q){
  const words = norm(q).split(/[\s,.;:!?()"']+/).filter(w => w.length > 1 || /\d/.test(w)); if (!words.length) return [];
  const res = [];
  for (const x of searchIndex()){
    let sc = 0, ok = true;
    for (const w of words){ const it = x.nt.indexOf(w), is = x.ns.indexOf(w); if (it < 0 && is < 0){ ok = false; break; } sc += it === 0 ? 7 : it > 0 ? (/\W/.test(x.nt[it - 1] || " ") ? 5 : 3) : 1; }
    if (ok) res.push([sc + (x.kind === "Card" ? .6 : x.kind === "Definition" ? .5 : 0), x]);
  }
  return res.sort((a, b) => b[0] - a[0]).slice(0, 14).map(r => r[1]);
}
function markIn(text, q){
  const words = norm(q).split(/\s+/).filter(w => w.length > 1); if (!words.length) return esc(text);
  const n = norm(text); const hits = [];
  words.forEach(w => { let i = n.indexOf(w); while (i >= 0){ hits.push([i, i + w.length]); i = n.indexOf(w, i + w.length); } });
  if (!hits.length) return esc(text);
  hits.sort((a, b) => a[0] - b[0]); let out = "", at = 0;
  for (const [a, b] of hits){ if (a < at) continue; out += esc(text.slice(at, a)) + "<mark>" + esc(text.slice(a, b)) + "</mark>"; at = b; }
  return out + esc(text.slice(at));
}
const SRCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>';
function openSearch(){
  if (document.querySelector(".srch")) return;
  const back = document.activeElement;
  const box = h("div", { class: "srch", role: "dialog", "aria-modal": "true", "aria-label": "Search the course" });
  box.innerHTML = `<div class="srch-panel"><label class="srch-in">${SRCH_ICON}<input type="search" placeholder="${SEARCH_HINT}" aria-label="Search the course" autocomplete="off" spellcheck="false" enterkeyhint="go"><kbd>Esc</kbd></label><ul class="srch-res" role="listbox" aria-label="Results"></ul><p class="srch-foot"><span>↑ ↓ to move · Enter to open</span><span>${searchIndex().length} cards, questions and cases</span></p></div>`;
  document.body.append(box);
  const inp = box.querySelector("input"), list = box.querySelector(".srch-res");
  let items = [], sel = 0;
  const paint = () => {
    const q = inp.value;
    items = q.trim() ? searchFind(q) : [];
    if (sel >= items.length) sel = 0;
    list.innerHTML = items.length ? items.map((x, i) => `<li role="option" id="sr-${i}" aria-selected="${i === sel}" data-i="${i}" style="--c:${x.c}"><span class="sk">${x.kind}</span><b>${markIn(x.t, q)}</b><span class="sw">${esc(x.where)}</span></li>`).join("")
      : q.trim() ? `<li class="srch-none">Nothing found for “${esc(q)}”. Try one word, an author or a model.</li>`
      : `<li class="srch-none">Try ${SEARCH_TRY.map(w => `<button type="button" data-try="${esc(w)}">${esc(w)}</button>`).join(" ")}</li>`;
    if (items.length) inp.setAttribute("aria-activedescendant", "sr-" + sel); else inp.removeAttribute("aria-activedescendant");
  };
  const close = () => { box.classList.add("out"); document.removeEventListener("keydown", onKey, true); setTimeout(() => box.remove(), 160); if (back && back.focus) back.focus({ preventScroll: true }); };
  const pick = x => { close(); if (!x) return; if (x.note) GOTO.note = x.note; if (location.hash === x.href) render(); else location.hash = x.href.slice(1); };
  const onKey = e => {
    if (e.key === "Escape"){ e.preventDefault(); close(); return; }
    if (e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); if (!items.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; list.querySelectorAll("li[data-i]").forEach(li => li.setAttribute("aria-selected", String(+li.dataset.i === sel))); const cur = list.querySelector(`[data-i="${sel}"]`); if (cur) cur.scrollIntoView({ block: "nearest" }); inp.setAttribute("aria-activedescendant", "sr-" + sel); return; }
    if (e.key === "Enter" && e.target === inp){ e.preventDefault(); pick(items[sel]); }
  };
  document.addEventListener("keydown", onKey, true);
  inp.addEventListener("input", () => { sel = 0; paint(); });
  list.addEventListener("click", e => { const t = e.target.closest("[data-try]"); if (t){ inp.value = t.dataset.try; paint(); inp.focus(); return; } const li = e.target.closest("li[data-i]"); if (li) pick(items[+li.dataset.i]); });
  list.addEventListener("pointermove", e => { const li = e.target.closest("li[data-i]"); if (li && +li.dataset.i !== sel){ sel = +li.dataset.i; list.querySelectorAll("li[data-i]").forEach(x => x.setAttribute("aria-selected", String(+x.dataset.i === sel))); } });
  box.addEventListener("pointerdown", e => { if (e.target === box) close(); });
  paint(); requestAnimationFrame(() => inp.focus());
}
(function(){
  const b = $("#srchBtn"); if (b){ b.innerHTML = SRCH_ICON + `<span class="tl">Search</span><kbd class="sk2">/</kbd>`; b.addEventListener("click", openSearch); }
  document.addEventListener("keydown", e => {
    const typing = e.target.closest && e.target.closest("input,textarea,select,[contenteditable]");
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)){ e.preventDefault(); openSearch(); return; }
    if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey){ e.preventDefault(); openSearch(); }
  });
})();
/* after a search, the chapter scrolls to the card and lights it up */
function landOnNote(){
  if (!GOTO.note) return;
  const id = GOTO.note; GOTO.note = null;
  requestAnimationFrame(() => requestAnimationFrame(() => { const el = document.getElementById("n-" + id); if (!el) return; el.classList.add("rv-on"); el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1800); }));
}

/* ---------- RECAP: every idea of the course on one page ---------- */
function viewRecap(){
  const root = h("div", { class: "mod recap", html: `${mhead(LAB_NAME, "Recap", "Every idea of the course on one page: the rule in one line, and the formula when there is one. Filter it, print it, revise from it the night before.",
    `<div class="row recap-tools"><label class="field recap-f">${SRCH_ICON}<input type="search" placeholder="Filter: a word, an author, a model" aria-label="Filter the recap" autocomplete="off"></label><button class="btn glassy small" type="button" data-print>Print</button><a class="btn glassy small" href="#learn">Back to Learn</a></div><p class="muted small recap-n" aria-live="polite"></p>`)}
  <div class="rc">${COURSE.map(c => `<section class="rc-ch" style="--c:${c.c}"><h2><span class="num">${String(c.n).padStart(2, "0")}</span>${c.title}</h2><div class="rc-cols">${c.sections.map(sec => `<div class="rc-sec"><h3>${sec.title}</h3>${sec.cards.map(k => `<a class="rc-it" href="#learn-${c.id}" data-note="${k.id}" data-txt="${esc(norm([k.title, k.line, k.formula || "", ...(k.points || [])].join(" ")))}"><b>${k.title}</b><span>${k.line}</span>${k.formula ? `<code>${k.formula}</code>` : ""}</a>`).join("")}</div>`).join("")}</div></section>`).join("")}</div>
  ${creditHtml()}` });
  const inp = root.querySelector(".recap-f input"), n = root.querySelector(".recap-n"), all = [...root.querySelectorAll(".rc-it")];
  const filter = () => {
    const words = norm(inp.value).split(/\s+/).filter(Boolean); let shown = 0;
    all.forEach(a => { const on = words.every(w => a.dataset.txt.includes(w)); a.hidden = !on; if (on) shown++; });
    root.querySelectorAll(".rc-sec").forEach(s => { s.hidden = !s.querySelector(".rc-it:not([hidden])"); });
    root.querySelectorAll(".rc-ch").forEach(s => { s.hidden = !s.querySelector(".rc-it:not([hidden])"); });
    n.textContent = words.length ? `${shown} of ${all.length} cards` : `${all.length} cards`;
  };
  inp.addEventListener("input", filter); filter();
  root.addEventListener("click", e => { const a = e.target.closest(".rc-it"); if (a){ GOTO.note = a.dataset.note; if (location.hash === a.getAttribute("href")){ e.preventDefault(); render(); } } if (e.target.closest("[data-print]")) window.print(); });
  return root;
}
