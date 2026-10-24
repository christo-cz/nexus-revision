/* search and recap settings for this lab */
const LAB_NAME = "Societal and Global Challenges";
const CARDS_HREF = "#practice-cards-";
const SEARCH_HINT = "Search: a concept, an author, a figure…";
const SEARCH_TRY = ["tipping point", "Doughnut", "MSY", "Brundtland", "Gini", "feedback loop"];
const SEARCH_EXTRA = () => [
  ...CLD.map(d => ({ kind: "Diagram", t: d.title, s: d.story + " " + d.nodes.map(n => n[1]).join(" "), href: "#studio-" + d.id, c: "var(--c4)", where: `Causal studio · ${d.where}` })),
  ...FIGS.map(f => ({ kind: "Figure", t: `${f[1]}: ${f[2]}`, s: f[3] + " " + f[4], href: "#figures", c: CH[f[0]].c, where: `Key figures · ${f[3]}` })),
  { kind: "Page", t: "Free board", s: "draw your own causal diagram loops variables download image", href: "#studio-free", c: "var(--c4)", where: "Causal studio" },
  { kind: "Page", t: "Diagram drills", s: "sign loop polarity effect reinforcing balancing sprint", href: "#studio-drills", c: "var(--c4)", where: "Causal studio" },
  { kind: "Page", t: "Questions", s: "quiz multiple choice sort it classify environmental social economic macro meso micro scenario boundary streak sprint", href: "#practice", c: "var(--c1)", where: "Practice" },
  { kind: "Page", t: "Flashcards", s: "cards flip definitions authors dates", href: "#practice-cards", c: "var(--c2)", where: "Practice" },
  { kind: "Page", t: "Exam questions", s: "open questions define explain apply draw model answers key points", href: "#practice-open", c: "var(--pri)", where: "Practice" },
  { kind: "Page", t: "Mock exam", s: "timed exam practice define explain diagram 60 90 minutes", href: "#exam", c: "var(--pri)", where: "Practice · Exam questions" },
  { kind: "Page", t: "Recap", s: "one page summary cheat sheet all cards", href: "#recap", c: "var(--c2)", where: "Learn" }
];

