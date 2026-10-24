/* search and recap settings for this lab */
const LAB_NAME = "Management and Organizations";
const CARDS_HREF = "#practice-cards-";
const SEARCH_HINT = "Search: a theory, an author, a bias…";
const SEARCH_TRY = ["Kelley", "halo effect", "Herzberg", "Weber", "groupthink", "SMART"];
const SEARCH_EXTRA = () => [
  ...CASES.map(c => ({ kind: "Case", t: c.title, s: [c.org, c.intro, ...c.sheet.map(b => b.h + " " + b.t)].join(" "), href: "#case-" + c.id, c: CH[c.ch[0]].c, where: c.org })),
  ...LABS.map(l => ({ kind: "Lab", t: l.title, s: l.sub + " " + l.what, href: "#lab-" + l.id, c: l.c, where: l.sub })),
  { kind: "Page", t: "Mock exam", s: "90 minutes timed exam practice", href: "#exam", c: "var(--c4)", where: "Practice · Exam questions" },
  { kind: "Page", t: "Questions", s: "spot it scenes bias need factor justice quiz multiple choice streak sprint", href: "#practice", c: "var(--c3)", where: "Practice" },
  { kind: "Page", t: "Flashcards", s: "cards flip definitions authors models", href: "#practice-cards", c: "var(--c1)", where: "Practice" },
  { kind: "Page", t: "Exam questions", s: "self-check questions model answers key points", href: "#practice-open", c: "var(--c3)", where: "Practice" },
  { kind: "Page", t: "Group project", s: "presentation 40% session 9 structure checklist theory finder checkpoints Q&A", href: "#project", c: "var(--pri)", where: "Group presentation" },
  { kind: "Page", t: "Recap", s: "one page summary cheat sheet all cards", href: "#recap", c: "var(--c1)", where: "Learn" }
];
