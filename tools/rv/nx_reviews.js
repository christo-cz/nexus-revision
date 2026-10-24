/* nxr:start (Nexus reviews kit: the wall, the review sheet and the nudge. The same block lives in the hub and in every lab: edit it in one place and copy it.) */
const NXR = (() => {
  const API = "/api/reviews", DAY = 864e5;
  const WORDS = ["", "Not useful", "Could be better", "Good", "Very good", "Excellent"];
  const TAGS = ["Exam-like", "Clear corrections", "Good on phone", "Saves time", "Too easy", "Too hard", "Found a mistake"];
  const WHAT = { case: "a full case", quiz: "a quiz", deck: "the whole flashcard pile", sprint: "a 60-second sprint", drills: "15 drills", diagram: "a causal diagram",
    figures: "every key figure", open: "five exam answers", exam: "a mock exam", chapter: "a whole chapter", td: "a tutorial exercise", lab: "a lab", spot: "a Spot it round" };
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sget = k => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
  const sput = (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const announce = t => { const l = document.getElementById("live"); if (l){ l.textContent = ""; setTimeout(() => { l.textContent = t; }, 40); } };
  const did = () => { let d = get("nexus-did", null); if (!d){ d = Math.random().toString(36).slice(2) + Date.now().toString(36); put("nexus-did", d); } return d; };
  const reviewed = lab => { const m = get("nexus-reviewed", {}); return !!(m[lab] && Date.now() - m[lab] < DAY); };
  const markDone = lab => { const m = get("nexus-reviewed", {}); m[lab] = Date.now(); put("nexus-reviewed", m); };
  const stars = n => `<span class="nx-st" role="img" aria-label="${n} out of 5 stars">${"★".repeat(n)}<span class="off">${"★".repeat(5 - n)}</span></span>`;
  const ago = ts => { const d = Math.floor((Date.now() - ts) / DAY); if (d <= 0) return "today"; if (d === 1) return "yesterday"; if (d < 30) return d + " days ago"; return new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };
  const unit = s => { let x = 2166136261; for (const c of String(s)) x = Math.imul(x ^ c.charCodeAt(0), 16777619); return (x >>> 0) / 4294967295; };
  /* a red-pen circle, drawn by hand around a grade */
  const RING = '<svg class="nx-ring" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M76 7C58 1 23 3 10 16-1 28 8 50 37 55c28 4 58-5 58-23S74 6 46 6C35 7 27 9 20 13"/></svg>';
  const PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>';

  /* ---- data: one request per page and lab, shared by every part of the page ---- */
  const cache = {};
  function load(lab, force){
    const k = lab || "*";
    const q = [lab ? "lab=" + encodeURIComponent(lab) : "", force ? "fresh=" + Date.now() : ""].filter(Boolean).join("&");   /* fresh= skips the CDN copy */
    if (!cache[k] || force) cache[k] = fetch(API + (q ? "?" + q : ""), { headers: { accept: "application/json" } }).then(r => r.ok ? r.json() : null).catch(() => null);
    return cache[k];
  }
  function forget(id){
    Object.keys(cache).forEach(k => {
      cache[k] = cache[k].then(d => {
        if (!d) return d;
        const r = d.items.find(x => x.id === id); if (!r) return d;
        d.items = d.items.filter(x => x.id !== id);
        const s = d.labs[r.lab]; if (s && s.count){ s.avg = s.count > 1 ? (s.avg * s.count - r.stars) / (s.count - 1) : null; s.count--; r.tags.forEach(t => { if (s.tags[t]) s.tags[t]--; }); }
        return d;
      });
    });
  }
  function remember(item){
    Object.keys(cache).forEach(k => {
      if (k !== "*" && k !== item.lab) return;
      cache[k] = cache[k].then(d => {
        if (!d || d.items.some(r => r.id === item.id)) return d;
        d.items.unshift(item);
        const s = d.labs[item.lab] || (d.labs[item.lab] = { count: 0, avg: 0, tags: {} });
        s.avg = ((s.avg || 0) * s.count + item.stars) / (s.count + 1); s.count++;
        item.tags.forEach(t => { s.tags[t] = (s.tags[t] || 0) + 1; });
        return d;
      });
    });
  }
  const listeners = new Set();
  const changed = item => { remember(item); listeners.forEach(f => f(item)); };

  /* ---- one review, as a slip of exam paper taped to the wall ---- */
  function slip(r, o = {}){
    const u = unit(r.id), rot = ((u * 2 - 1) * 1.7).toFixed(2), tape = (14 + unit(r.id + "t") * 52).toFixed(0);
    const L = o.labs && o.labs[r.lab];
    return `<li class="nx-slip${o.fresh === r.id ? " nx-new" : ""}" style="--r:${rot}deg;--tx:${tape}%${L ? `;--c:${L.c}` : ""}">
      <div class="nx-top">${stars(r.stars)}<span class="nx-grade" aria-hidden="true"><b>${r.stars}</b><i>/5</i>${RING}</span></div>
      <p class="nx-txt">${esc(r.text)}</p>
      ${r.tags && r.tags.length ? `<p class="nx-tg">${r.tags.map(t => `<span>${esc(t)}</span>`).join("")}</p>` : ""}
      <p class="nx-by"><b>${esc(r.name || "BBA1 student")}</b>${L ? `<a class="nx-lab" href="${L.href}">${esc(L.name)}</a>` : ""}<span>${ago(r.at)}</span></p>
      ${o.admin ? `<button class="nx-del" type="button" data-nxdel="${esc(r.id)}">Delete</button>` : ""}</li>`;
  }
  function reveal(box){
    const items = box.querySelectorAll(".nx-slip:not(.in), .nx-big:not(.in)");
    if (still() || !("IntersectionObserver" in window)){ items.forEach(x => x.classList.add("in")); return; }
    box.classList.add("nx-anim");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ setTimeout(() => e.target.classList.add("in"), 120 + Math.random() * 260); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    items.forEach(x => io.observe(x));
  }

  /* ---- the form ---- */
  function form(o){
    const f = document.createElement("form"); f.className = "rv-form nx-form"; f.noValidate = true;
    const picker = o.labs ? Object.entries(o.labs).map(([k, L]) => `<button type="button" role="radio" aria-checked="false" data-lab="${k}" style="--c:${L.c}"${reviewed(k) ? " disabled" : ""}>${esc(L.name)}${reviewed(k) ? " <small>done today</small>" : ""}</button>`).join("") : "";
    f.innerHTML = `${o.labs ? `<fieldset><legend>Which subject?</legend><div class="nx-pick" role="radiogroup" aria-label="Subject">${picker}</div></fieldset>` : ""}
      <fieldset><legend>Your rating</legend><div class="stars" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="false" data-star="${n}" aria-label="${n} star${n > 1 ? "s" : ""}: ${WORDS[n]}">★</button>`).join("")}<output aria-live="polite"></output></div></fieldset>
      <fieldset><legend>What stood out? <span class="opt-l">Optional, up to 4</span></legend><div class="tagpick">${TAGS.map(x => `<button type="button" aria-pressed="false" data-tag="${esc(x)}">${esc(x)}</button>`).join("")}</div></fieldset>
      <fieldset><label class="lbl" for="nxText${o.uid || ""}">Your review</label><textarea id="nxText${o.uid || ""}" maxlength="600" placeholder="What helped you? What is missing? What should I fix?"></textarea><span class="cnt" aria-hidden="true">0/600</span></fieldset>
      <div class="two"><div><label class="lbl" for="nxName${o.uid || ""}" style="display:block">First name <span class="opt-l">optional</span></label><input type="text" id="nxName${o.uid || ""}" maxlength="32" autocomplete="given-name" placeholder="Leave blank to stay anonymous"></div>
        <button class="nx-btn" type="submit">${PEN}Pin my review</button></div>
      <div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <p class="msg" role="status"></p>`;
    let rating = 0, lab = o.labs ? null : o.lab;
    const sb = [...f.querySelectorAll("[data-star]")], out = f.querySelector("output"), msg = f.querySelector(".msg"), ta = f.querySelector("textarea"), cnt = f.querySelector(".cnt");
    const paint = n => sb.forEach((b, i) => b.classList.toggle("on", i < n));
    const setStars = n => { rating = n; paint(n); sb.forEach((x, j) => x.setAttribute("aria-checked", String(j === n - 1))); out.textContent = WORDS[n]; msg.textContent = ""; };
    sb.forEach((b, i) => {
      b.addEventListener("click", () => setStars(i + 1));
      b.addEventListener("mouseenter", () => paint(i + 1)); b.addEventListener("mouseleave", () => paint(rating));
      b.addEventListener("keydown", e => { const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key]; if (d){ e.preventDefault(); const n = Math.min(5, Math.max(1, (rating || 0) + d)); setStars(n); sb[n - 1].focus(); } });
    });
    if (o.stars) setStars(o.stars);
    f.querySelectorAll("[data-lab]").forEach(b => b.addEventListener("click", () => { lab = b.dataset.lab; f.querySelectorAll("[data-lab]").forEach(x => x.setAttribute("aria-checked", String(x === b))); msg.textContent = ""; }));
    if (o.labs && o.lab && !reviewed(o.lab)){ const b = f.querySelector(`[data-lab="${o.lab}"]`); if (b) b.click(); }
    f.querySelectorAll("[data-tag]").forEach(b => b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") === "true";
      if (!on && f.querySelectorAll('[data-tag][aria-pressed="true"]').length >= 4){ msg.className = "msg err"; msg.textContent = "Pick up to 4 tags."; return; }
      b.setAttribute("aria-pressed", String(!on)); msg.textContent = "";
    }));
    ta.addEventListener("input", () => { cnt.textContent = ta.value.length + "/600"; });
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const fail = (m, el) => { msg.className = "msg err"; msg.textContent = m; if (el) el.focus(); };
      if (!lab) return fail("Choose the subject you are reviewing.", f.querySelector("[data-lab]:not([disabled])"));
      if (!rating) return fail("Choose a number of stars.", sb[0]);
      if (ta.value.trim().length < 10) return fail("Write at least a short sentence (10 characters).", ta);
      const btn = f.querySelector("[type=submit]"); btn.disabled = true; btn.lastChild.textContent = "Pinning…"; msg.className = "msg"; msg.textContent = "";
      const body = { lab, stars: rating, tags: [...f.querySelectorAll('[data-tag][aria-pressed="true"]')].map(b => b.dataset.tag), text: ta.value, name: f.querySelector("input[type=text]").value, did: did(), website: f.querySelector("[name=website]").value };
      try {
        const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
        const d = await r.json().catch(() => ({}));
        if (!r.ok){ btn.disabled = false; btn.lastChild.textContent = "Pin my review"; if (r.status === 429) markDone(lab); return fail(d.error || "Something went wrong. Try again."); }
        markDone(lab); announce("Review posted. Thank you.");
        const item = d.item || { id: "local-" + Date.now(), lab, stars: rating, tags: body.tags, text: ta.value.trim(), name: body.name.trim(), at: Date.now() };
        changed(item); o.onDone && o.onDone(item);
      } catch (err){ btn.disabled = false; btn.lastChild.textContent = "Pin my review"; fail("No connection. Check your internet and try again."); }
    });
    return f;
  }

  const PLEA = `<b>A review helps me a lot.</b> I build Nexus on my own, for our class. Thirty seconds of feedback tells me what to fix next, and it shows the others that the site is worth their time.`;

  /* ---- the sheet: the form in a dialog, from any page ---- */
  let uid = 0;
  function sheet(o = {}){
    const open = document.querySelector("dialog.nx-sheet"); if (open) return;
    const d = document.createElement("dialog"); d.className = "nx-sheet"; d.setAttribute("aria-labelledby", "nxSheetH");
    d.innerHTML = `<div class="nx-sh-in"><button class="nx-x" type="button" aria-label="Close">×</button>
      <h2 id="nxSheetH">${o.labs ? "Write a review" : `Review the ${esc(o.name)} lab`}</h2>
      <p class="nx-plea-s">${PLEA} <span class="nx-sig">Christo</span></p><div data-f></div></div>`;
    const prev = document.activeElement;
    const f = form({ ...o, uid: "s" + (++uid), onDone: item => {
      d.querySelector("[data-f]").innerHTML = `<div class="nx-pinned"><p class="nx-ok">Pinned to the wall. Thank you, it really helps.</p><ul class="nx-wall nx-one">${slip(item, { labs: o.labs, fresh: item.id })}</ul><button class="nx-btn" type="button" data-close>Close</button></div>`;
      const c = d.querySelector("[data-close]"); c.focus(); o.onDone && o.onDone(item);
    } });
    d.querySelector("[data-f]").append(f);
    document.body.append(d);
    d.addEventListener("close", () => { d.remove(); if (prev && prev.focus) prev.focus(); });
    d.addEventListener("click", e => { if (e.target === d || e.target.closest(".nx-x,[data-close]")) d.close(); });
    if (d.showModal) d.showModal(); else d.setAttribute("open", "");
    requestAnimationFrame(() => { const t = o.stars ? f.querySelector("textarea") : (f.querySelector('[data-lab][aria-checked="false"]:not([disabled])') && !o.lab ? f.querySelector("[data-lab]:not([disabled])") : f.querySelector("[data-star]")); if (t) t.focus({ preventScroll: true }); });
  }

  /* ---- the nudge: once per visit, after the visitor finishes something ---- */
  function nudge(o, kind){
    if (reviewed(o.lab) || sget("nexus-rv-nudge") || document.querySelector(".nx-nudge, dialog.nx-sheet")) return;
    const later = get("nexus-rv-later", []).filter(t => Date.now() - t < 4 * DAY);
    if (later.length >= 2) return;
    setTimeout(() => {
      if (document.querySelector(".nx-nudge, dialog.nx-sheet")) return;
      const vis = [...document.querySelectorAll(".rv-form")].some(x => { const b = x.getBoundingClientRect(); return b.height && b.bottom > 0 && b.top < innerHeight; });
      if (vis) return;
      sput("nexus-rv-nudge", "1");
      const el = document.createElement("aside"); el.className = "nx-nudge"; el.setAttribute("aria-label", "Review request");
      el.innerHTML = `<button class="nx-x" type="button" aria-label="Close">×</button>
        <p class="nx-n1">You just finished ${WHAT[kind] || "a module"}.</p>
        <p class="nx-n2">How would you rate the ${esc(o.name)} lab? <b>A review would help me a lot.</b></p>
        <div class="nx-qs" role="group" aria-label="Rate the ${esc(o.name)} lab">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-q="${n}" aria-label="${n} star${n > 1 ? "s" : ""}: ${WORDS[n]}">★</button>`).join("")}</div>
        <div class="nx-nf"><span class="nx-sig">Christo, who builds Nexus</span><button class="nx-later" type="button">Not now</button></div>`;
      document.body.append(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("show")));
      const qs = [...el.querySelectorAll("[data-q]")];
      qs.forEach((b, i) => { b.addEventListener("mouseenter", () => qs.forEach((x, j) => x.classList.toggle("on", j <= i))); b.addEventListener("focus", () => qs.forEach((x, j) => x.classList.toggle("on", j <= i))); });
      el.querySelector(".nx-qs").addEventListener("mouseleave", () => qs.forEach(x => x.classList.remove("on")));
      const close = later => {
        if (!el.isConnected) return;
        if (later){ const l = get("nexus-rv-later", []); l.push(Date.now()); put("nexus-rv-later", l.slice(-5)); }
        el.classList.remove("show"); setTimeout(() => el.remove(), 450);
      };
      el.addEventListener("click", e => {
        const q = e.target.closest("[data-q]");
        if (q){ close(false); sheet({ ...o, stars: +q.dataset.q }); return; }
        if (e.target.closest(".nx-x, .nx-later")) close(true);
      });
      el.addEventListener("keydown", e => { if (e.key === "Escape") close(true); });
      setTimeout(() => { if (el.isConnected && !el.matches(":hover, :focus-within")) close(false); }, 40000);
    }, 1100);
  }

  /* ---- inline slot, at the end of a case or a mock exam ---- */
  function slot(el, o){
    if (reviewed(o.lab)){ el.innerHTML = `<p class="nx-thx">✓ Your review is on the wall. Thank you, it helps.</p>`; return; }
    const w = document.createElement("div"); w.className = "nx-slot";
    w.innerHTML = `<p class="nx-plea-s"><b>Before you go: a review would help me a lot.</b> It tells me what to fix next, and it shows the others that the site is worth their time. <span class="nx-sig">Christo</span></p>`;
    w.append(form({ ...o, uid: "i" + (++uid), onDone: () => { el.innerHTML = `<p class="nx-thx">✓ Pinned to the wall. Thank you, it really helps.</p>`; } }));
    el.replaceChildren(w);
  }

  /* ---- the wall ---- */
  function wall(box, o){
    const admin = get("nexus-admin-key", "");
    let all = false, data = null, fresh = null;
    const labsOf = () => o.labs ? Object.keys(o.labs) : [o.lab];
    function head(){
      const keys = labsOf();
      let n = 0, sum = 0; keys.forEach(k => { const s = data.labs[k]; if (s && s.count){ n += s.count; sum += s.avg * s.count; } });
      const avg = n ? sum / n : 0;
      const doneAll = keys.every(reviewed);
      const lines = o.labs ? keys.map(k => { const s = data.labs[k], L = o.labs[k]; return s && s.count ? `<a class="nx-labline" href="${L.href}" style="--c:${L.c}"><span class="nm">${esc(L.name)}</span><b>${s.avg.toFixed(1)}</b>${stars(Math.round(s.avg))}<span class="n">${s.count} review${s.count > 1 ? "s" : ""}</span></a>` : ""; }).join("") : "";
      const tags = (() => { const t = {}; keys.forEach(k => { const s = data.labs[k]; if (s) Object.entries(s.tags).forEach(([a, b]) => { t[a] = (t[a] || 0) + b; }); }); return Object.entries(t).filter(([, b]) => b > 0).sort((a, b) => b[1] - a[1]).slice(0, 4); })();
      return `<div class="nx-head">
        ${n ? `<div class="nx-score"><span class="nx-big" aria-hidden="true"><b>${avg.toFixed(1)}</b><i>/5</i>${RING}</span><div class="nx-sc"><span class="nx-sr">Average ${avg.toFixed(1)} out of 5.</span>${stars(Math.round(avg))}<span class="nx-cnt">${n} review${n > 1 ? "s" : ""} from the class</span>${tags.length ? `<span class="nx-most">Most said: ${tags.map(([a, b]) => `${esc(a)} <i>${b}</i>`).join(", ")}</span>` : ""}</div></div>` : ""}
        <div class="nx-plea"><p>${PLEA}</p><p class="nx-sig">Christo</p>
          ${doneAll ? `<p class="nx-thx">✓ Your review is on the wall. Thank you.</p>` : `<button class="nx-btn" type="button" data-nxwrite>${PEN}Write a review</button>`}</div>
        ${lines ? `<div class="nx-lines">${lines}</div>` : ""}</div>`;
    }
    function draw(){
      if (!data){ box.innerHTML = `<p class="nx-empty">Reviews could not be loaded right now. <button class="nx-link" type="button" data-nxwrite>Write one anyway</button></p>`; return; }
      const keys = labsOf();
      const items = data.items.filter(r => keys.includes(r.lab));
      const cap = o.labs ? 9 : 6, shown = all || admin ? items : items.slice(0, cap);
      const empty = `<li class="nx-slip nx-blank" style="--r:-1.2deg;--tx:40%"><p class="nx-txt"><b>This wall is empty.</b> Your review could be the first one pinned here.</p><button class="nx-btn" type="button" data-nxwrite>${PEN}Pin the first review</button></li>`;
      box.innerHTML = head() + `<ul class="nx-wall">${items.length ? shown.map(r => slip(r, { labs: o.labs, admin, fresh })).join("") : empty}</ul>` +
        (shown.length < items.length ? `<button class="nx-more" type="button" data-nxmore>Show all ${items.length} reviews</button>` : "");
      reveal(box); fresh = null;
    }
    box.addEventListener("click", e => {
      if (e.target.closest("[data-nxmore]")){ all = true; draw(); return; }
      if (e.target.closest("[data-nxwrite]")){ sheet({ lab: o.lab, name: o.name, labs: o.labs }); return; }
      const del = e.target.closest("[data-nxdel]");
      if (del){
        if (!del.dataset.armed){ del.dataset.armed = "1"; del.textContent = "Tap again to delete"; return; }
        fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "delete", id: del.dataset.nxdel, key: admin }) })
          .then(r => {
            /* 404 = already gone (an earlier tap worked, the wall showed a cached copy): drop it here too */
            if (r.ok || r.status === 404){ forget(del.dataset.nxdel); return load(o.labs ? null : o.lab).then(d => { data = d; draw(); }); }
            return r.json().then(x => { del.textContent = x.error || "Failed"; });
          }).catch(() => { del.textContent = "No connection. Try again."; });
      }
    });
    listeners.add(item => { if (!labsOf().includes(item.lab)) return; fresh = item.id; load(o.labs ? null : o.lab).then(d => { data = d; draw(); }); });
    box.innerHTML = `<p class="nx-empty">Loading reviews…</p>`;
    load(o.labs ? null : o.lab).then(d => { data = d; draw(); });
  }

  /* a lab home: the section heading, then the wall */
  function section(sec, o){
    sec.innerHTML = `<div class="sec-h"><h2>What our users say</h2></div><div class="nx-host"></div>`;
    wall(sec.querySelector(".nx-host"), o);
  }
  return { load, reviewed, form, sheet, nudge, slot, wall, section, stars, PEN };
})();
/* nxr:end */
