/* ---------- utilities ---------- */
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs = {}, ...kids) => { const e = document.createElement(tag); for (const k in attrs){ const v = attrs[k]; if (v == null || v === false) continue; if (k === "class") e.className = v; else if (k === "html") e.innerHTML = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v); } kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : String(c))); return e; };
const store = { get(){ try { return JSON.parse(localStorage.getItem("flow-v1")) || {}; } catch (e) { return {}; } }, set(v){ try { localStorage.setItem("flow-v1", JSON.stringify(v)); } catch (e) {} } };
const fmt = (n, d = 0) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n, d = 0) => (n < 0 ? "−€" : "€") + fmt(Math.abs(n), d);
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function parseNum(s){
  s = String(s || "").trim().replace(/[€$%\s]/g, "").replace(/−/g, "-");
  if (!s) return NaN;
  if (s.includes(",") && s.includes(".")) s = s.replace(/,/g, "");
  else if (/^-?\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(",", ".");
  return Number(s);
}
const say = t => { const l = $("#live"); l.textContent = ""; setTimeout(() => l.textContent = t, 30); };
/* a small burst of dots in the lab colours, for a right answer */
const BURST = ["--flow", "--inj", "--leak"];
function burst(at, cols = BURST){
  if (!at || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = at.getBoundingClientRect(), cs = getComputedStyle(document.documentElement), C = cols.map(v => cs.getPropertyValue(v).trim());
  const layer = document.createElement("div"); layer.className = "burst"; layer.style.left = (r.left + Math.min(32, r.width / 2)) + "px"; layer.style.top = (r.top + r.height / 2) + "px";
  for (let i = 0; i < 16; i++){ const d = document.createElement("i"), a = Math.random() * Math.PI * 2, dist = 24 + Math.random() * 52; d.style.setProperty("--x", (Math.cos(a) * dist).toFixed(1) + "px"); d.style.setProperty("--y", (Math.sin(a) * dist).toFixed(1) + "px"); d.style.background = C[i % C.length]; d.style.animationDelay = Math.round(Math.random() * 70) + "ms"; layer.append(d); }
  document.body.append(layer); setTimeout(() => layer.remove(), 1000);
}
const bump = el => { if (!el) return; el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); };

/* ---------- theme (shared with the Nexus hub) ---------- */
const ICON = {
  light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
};
const THEME_LABEL = { light: "Light", dark: "Dark" };
/* Dark by default; light only if the visitor chose it. */
let theme = "dark"; try { if (localStorage.getItem("nexus-theme") === "light") theme = "light"; } catch (e) {}
function applyTheme(){ document.documentElement.dataset.theme = theme; const b = $("#themeBtn"); b.innerHTML = ICON[theme] + `<span class="tl">${THEME_LABEL[theme]}</span>`; const nx = theme === "dark" ? "light" : "dark"; b.setAttribute("aria-label", `Theme: ${THEME_LABEL[theme]}. Switch to ${nx}`); b.title = "Switch to " + nx; window.dispatchEvent(new Event("nexus-theme")); }
applyTheme();
/* switching theme: the new colours spread from the button in a circle (where the browser can) */
function themeSwap(btn, swap){
  const root = document.documentElement;
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches){ swap(); return; }
  const r = btn.getBoundingClientRect();
  root.style.setProperty("--tx", (r.left + r.width / 2).toFixed(0) + "px"); root.style.setProperty("--ty", (r.top + r.height / 2).toFixed(0) + "px");
  root.classList.add("theme-vt");
  const vt = document.startViewTransition(swap);
  vt.finished.finally(() => root.classList.remove("theme-vt"));
}
$("#themeBtn").addEventListener("click", () => themeSwap($("#themeBtn"), () => { theme = theme === "dark" ? "light" : "dark"; try { localStorage.setItem("nexus-theme", theme); } catch (e) {} applyTheme(); }));

