/* ---------- colour aura that follows the pointer (teal → amber → coral across the screen) ---------- */
const AURA = (() => {
  const el = document.createElement("div"); el.className = "aura"; el.setAttribute("aria-hidden", "true"); document.body.prepend(el);
  const st = { x: innerWidth * .7, y: innerHeight * .4, tx: innerWidth * .7, ty: innerHeight * .4 }; let raf = 0, on = false;
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const hx = h => [1, 3, 5].map(i => parseInt(h.trim().slice(i, i + 2), 16));
  function tick(){
    raf = 0; st.x += (st.tx - st.x) * .09; st.y += (st.ty - st.y) * .09;
    const cs = getComputedStyle(document.documentElement), f = Math.min(1, Math.max(0, st.x / innerWidth));
    const c = f < .5 ? mix(hx(cs.getPropertyValue("--flow")), hx(cs.getPropertyValue("--inj")), f * 2) : mix(hx(cs.getPropertyValue("--inj")), hx(cs.getPropertyValue("--leak")), f * 2 - 1);
    el.style.setProperty("--ax", st.x + "px"); el.style.setProperty("--ay", st.y + "px"); el.style.setProperty("--ac", `rgb(${c.join(" ")})`);
    if (on && (Math.abs(st.tx - st.x) > .5 || Math.abs(st.ty - st.y) > .5)) raf = requestAnimationFrame(tick);
  }
  addEventListener("pointermove", e => { if (!on || e.pointerType !== "mouse") return; st.tx = e.clientX; st.ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  addEventListener("scroll", () => { if (!on || matchMedia("(hover: hover)").matches) return; const p = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight); st.tx = innerWidth * (.15 + .7 * p); st.ty = innerHeight * (.3 + .4 * p); if (!raf) raf = requestAnimationFrame(tick); }, { passive: true });
  return { set(v){ on = v; el.hidden = !v; if (v && !raf) raf = requestAnimationFrame(tick); } };
})();

