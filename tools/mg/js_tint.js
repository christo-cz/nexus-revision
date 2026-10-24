/* ---------- background colour that follows the scroll ----------
   Two or three colours, blended in OKLab so the fade looks even. The last colour is reached at `end` of the scroll
   and then stays. */
function scrollTint(getStops, getStart, end = 0.85, onTint = null){
  const root = document.documentElement;
  const dark = () => { const t = root.dataset.theme; return t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const gam = c => { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.round(Math.min(1, Math.max(0, c)) * 255); };
  const toLab = h => { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16)));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]; };
  const toRGB = ([L, A, B]) => { const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
    return [gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)]; };
  let raf = 0;
  function upd(){
    raf = 0;
    const stops = getStops(dark());
    if (!stops){ root.style.removeProperty("--bg"); root.style.removeProperty("--scrim"); if (onTint) onTint([0, 0, 0]); return; }
    const start = getStart(), span = Math.max(1, (root.scrollHeight - innerHeight) * end - start);
    const p = Math.min(1, Math.max(0, (scrollY - start) / span)), e = p * p * (3 - 2 * p);
    const x = e * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(x)), f = x - i;
    const a = toLab(stops[i]), b = toLab(stops[i + 1]), c = toRGB(a.map((v, k) => v + (b[k] - v) * f));
    root.style.setProperty("--bg", `rgb(${c.join(" ")})`); root.style.setProperty("--scrim", c.join(" "));
    if (onTint) onTint(c);
  }
  const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
  addEventListener("scroll", q, { passive: true }); addEventListener("resize", q); addEventListener("nexus-theme", q);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", q);
  q(); return q;
}

