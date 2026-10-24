/* ---------- render ---------- */
const MODVIEWS = { learn: viewLearn, chapter: viewChapter, studio: viewStudio, case: viewStudioCase, free: viewStudioFree, cdrills: viewStudioDrills, figures: viewFigures, practice: o => viewPractice(o.tab, o.ch), openq: viewOpenQ, exam: viewExam, recap: viewRecap };
const TITLES = { learn: "Learn", chapter: "Learn", studio: "Causal studio", case: "Causal studio", free: "Free board", cdrills: "Diagram drills", figures: "Key figures", practice: "Practice", openq: "Exam questions", exam: "Mock exam", recap: "Recap" };
/* a small living diagram in the header of each module: a different system of the course each time */
const MINI = {
  learn: "heat", recap: "heat", studio: "amazon", cdrills: "popul", figures: "cocoa", openq: null,
  practice: o => ({ q: "fish", cards: "lez", open: "homicide" })[o.tab],
  chapter: id => ({ systems: "heat", sd: "fish", ecology: "amazon", bounds: "cocoa", social: "paygap", economy: "lez", method: "homicide" })[id] || "heat"
};
new ResizeObserver(() => document.documentElement.style.setProperty("--hdr", document.querySelector(".hdr").offsetHeight + "px")).observe(document.querySelector(".hdr"));
const STAGE = { stops: [], view: null };
const QUIET = new Set(["case", "free", "exam"]);
function render(){
  const r = route();
  STAGE.stops.forEach(f => f && f()); STAGE.stops = [];
  STAGE.view = r.view; AURA.set(!QUIET.has(r.view)); TINT();
  document.body.dataset.view = r.view;
  const NAVOF = { chapter: "learn", case: "studio", free: "studio", cdrills: "studio", openq: "practice", exam: "practice", recap: "learn" };
  document.querySelectorAll(".nav a").forEach(a => { const on = a.dataset.route === (NAVOF[r.view] || r.view); a.setAttribute("aria-current", on ? "page" : "false"); if (on) a.scrollIntoView({ block: "nearest", inline: "nearest" }); });
  const app = $("#app");
  if (MODVIEWS[r.view]){
    const view = MODVIEWS[r.view](r.id);
    app.replaceChildren(view);
    const t = r.view === "case" ? (CLDI[r.id] || CLD[0]).title : r.view === "practice" ? PR_TABS.find(x => x[0] === r.id.tab)[1] + " · Practice" : TITLES[r.view] || "Societal and Global Challenges";
    document.title = t + " · Societal and Global Challenges";
    window.scrollTo(0, 0);
    const mini = typeof MINI[r.view] === "function" ? MINI[r.view](r.id) : MINI[r.view];
    if (mini && view.classList.contains("mod")){
      const box = h("div", { class: "mini3d", "aria-hidden": "true" }, h("canvas"));
      view.prepend(box);
      STAGE.stops.push(mountSystem(box, { mini: true, id: mini }));
    }
    STAGE.stops.push(mountReveal(app));
    if (r.view === "chapter") landOnNote();
  } else {
    app.replaceChildren(viewHome());
    const fh = app.querySelector(".fhero"); if (fh){ STAGE.stops.push(mountSystem(fh)); STAGE.stops.push(heroTilt(fh)); }
    const rs = app.querySelector("#reviews"); if (rs) mountReviewSection(rs);
    document.title = "Societal and Global Challenges · Nexus";
    if (location.hash === "#reviews") setTimeout(() => { const s = $("#reviews"); if (s) s.scrollIntoView(); }, 60); else window.scrollTo(0, 0);
    STAGE.stops.push(mountReveal(app));
  }
}
/* the hero scene tips back and fades as you scroll past it */
function heroTilt(hero){
  const cv = hero && hero.querySelector("canvas"); if (!cv || matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  cv.style.transformOrigin = "50% 100%";
  let raf = 0;
  const upd = () => { raf = 0; const p = Math.min(1, Math.max(0, scrollY / Math.max(1, hero.offsetHeight))), e = p * p * (3 - 2 * p);
    cv.style.transform = e ? `perspective(1400px) rotateX(${(e * 30).toFixed(2)}deg) translateY(${(e * 40).toFixed(1)}px) scale(${(1 - e * .1).toFixed(3)})` : "";
    cv.style.opacity = (1 - e * .85).toFixed(3); };
  const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
  addEventListener("scroll", q, { passive: true }); q();
  return () => { removeEventListener("scroll", q); cancelAnimationFrame(raf); cv.style.transform = ""; cv.style.opacity = ""; };
}
/* blocks ease in as they enter the view, once */
function mountReveal(app){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return null;
  const els = [...app.querySelectorAll(".note,.widget,.page > .sec,.page > .exam,.page > .credit,.modt,.chtile,.cscard,.fig,.oitem,.steps li")];
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ const t = en.target; t.classList.add("rv-on"); io.unobserve(t); if (t.style.transitionDelay) setTimeout(() => { t.style.transitionDelay = ""; }, 900); } }), { rootMargin: "0px 0px -6% 0px" });
  els.forEach(e => {
    const r = e.getBoundingClientRect();
    if (r.top < innerHeight * .92) return;
    e.classList.add("rv-in");
    const sib = e.parentElement ? [...e.parentElement.children].filter(x => x.matches(".modt,.chtile,.cscard,.fig,.steps li")) : [];
    const k = sib.indexOf(e); if (k > 0) e.style.transitionDelay = (k % 4) * 70 + "ms";
    io.observe(e);
  });
  return () => io.disconnect();
}
/* tiles lean toward the pointer, with a soft light under it */
(function tilt(){
  const SEL = ".modt,.chtile,.cscard", fine = matchMedia("(hover: hover) and (pointer: fine)"), reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let cur = null;
  const reset = t => { t.style.removeProperty("--rx"); t.style.removeProperty("--ry"); };
  document.addEventListener("pointermove", e => {
    if (!fine.matches || reduce.matches || e.pointerType !== "mouse") return;
    const t = e.target.closest ? e.target.closest(SEL) : null;
    if (cur && cur !== t) reset(cur);
    cur = t; if (!t) return;
    const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty("--ry", ((x - .5) * 8).toFixed(2) + "deg"); t.style.setProperty("--rx", ((.5 - y) * 8).toFixed(2) + "deg");
    t.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); t.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
  }, { passive: true });
  document.addEventListener("pointerleave", () => { if (cur){ reset(cur); cur = null; } });
})();
FS.bind($("#fsBtn"));
if (!QUIET.has(route().view)) FS.invite($("#fsBtn"));
/* forest night → deep ocean → ember, which stays (dark); sage paper → sky → warm sand, which stays (light) */
const TINT = scrollTint(dark => QUIET.has(STAGE.view) ? null : dark ? ["#0B120F", "#08182A", "#2A1409"] : ["#F4F7F1", "#EAF2F8", "#FBEBDC"], () => innerHeight * 0.55, 0.9);
const canVT = !!document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches;
window.addEventListener("hashchange", () => { if (canVT) document.startViewTransition(render); else render(); });
render();
