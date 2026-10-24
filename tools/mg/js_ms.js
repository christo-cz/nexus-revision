const MS = {
  get(k, d){ const s = store.get(); return s[k] ?? d; },
  set(k, v){ const s = store.get(); s[k] = v; store.set(s); }
};
const CH = Object.fromEntries(COURSE.map(c => [c.id, c]));
const allCards = () => COURSE.flatMap(c => c.sections.flatMap(s => s.cards.map(k => ({ ...k, ch: c.id }))));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ICO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17v.5"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
  ex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19h16M7 15l3-4 3 2 4-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>'
};
function learnStats(chId){
  const known = MS.get("learn", {}), cards = allCards().filter(c => !chId || c.ch === chId);
  return { known: cards.filter(c => known[c.id]).length, total: cards.length };
}
function mhead(kicker, title, lede, extra = ""){
  return `<header class="mhead"><p class="kicker">${kicker}</p><h1 class="mtitle"><span class="clip">${words(title)}</span></h1>${lede ? `<p class="lede">${lede}</p>` : ""}${extra}</header>`;
}
const chipCh = (c, on, act = "ch") => `<button class="mchip${on ? " on" : ""}" type="button" data-${act}="${c.id}" style="--c:${c.c}" aria-pressed="${on}">${c.n}. ${c.short}</button>`;

