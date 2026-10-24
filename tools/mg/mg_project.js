/* =====================================================================
   GROUP PROJECT (40%): the brief from lecture 1, a theory finder, a checklist and Q&A practice.
   ===================================================================== */
const PJ_STEPS = [
  { h: "Find a real people problem", t: "A real organization, a problem about people and behavior (not mainly finance, marketing or operations). Specific enough to analyze why it happens, with enough reliable information.", ex: "Low morale or enthusiasm (motivation) · high turnover or a mismatch with the organization's values (personality, values) · a slow decision process (decision-making)." },
  { h: "Connect it to OB theory", t: "Use class notes, OB textbooks (those of the syllabus), academic articles (Google Scholar), respected business publications (HBR, MIT Sloan Review, Forbes) and case studies.", ex: "Diagnose with at least two frameworks: each one should explain part of the mechanism." },
  { h: "Recommend, theory in hand", t: "For each recommendation: what the organization should do, which theory or concept supports it, why it should work (the mechanism), and evidence or examples from other organizations or research when you can." }
];
const PJ_STRUCT = [["Organization overview", "Industry, size, context."], ["Problem statement", "Clear and concise: the gap. Say why it matters."], ["Diagnosis with OB theory", "At least two frameworks."], ["Theory-based recommendations", "Specific and realistic."], ["Implementation plan", "Timeline, steps, resources. Optional."], ["Expected outcomes and challenges", "What should change, and what could go wrong."], ["Q&A", "5 minutes with the whole group."]];
const PJ_DATES = [["September 25", "Organization name and problem", "Checkpoint 1, Blackboard"], ["October 9", "Theory-to-problem connection", "Checkpoint, Blackboard"], ["October 18", "Final presentation slides", "Submission, Blackboard"], ["Session 9", "Final presentation", "In class, by 2 team members drawn at random"]];
/* symptom → theories of the course that can explain it */
const PJ_FINDER = [
  { s: "People have lost their drive", sub: "low morale, low engagement, effort only when watched", th: [
    ["Self-Determination Theory", "Are competence, autonomy and relatedness met? Is motivation controlled (rewards, monitoring) rather than autonomous?", "motiv", "m-sdt"],
    ["Herzberg's two-factor theory", "Did the organization fix hygiene factors (pay, conditions) and expect motivation from them?", "motiv", "m-herz"],
    ["Job Characteristics Model", "Which core dimension is low: variety, identity, significance, autonomy, feedback?", "motiv", "m-jcm"],
    ["Goal-setting theory", "Are goals vague or easy? Is there feedback and commitment?", "motiv", "m-goal"]] },
  { s: "People leave, or do not fit", sub: "turnover, weak commitment, value mismatch", th: [
    ["Values and value congruence (Schwartz)", "Do the organization's priorities clash with what employees value?", "person", "p-schwartz"],
    ["Workplace attitudes", "Which attitude dropped: satisfaction, engagement, commitment, perceived support?", "person", "p-four"],
    ["Personality and job fit", "Do the job's demands fit people's traits? Were they selected on a weak tool (MBTI)?", "person", "p-select"],
    ["Equity theory", "Do people compare their outcomes/inputs ratio with someone else and feel short-changed?", "motiv", "m-equity"]] },
  { s: "Decisions are slow or poor", sub: "endless meetings, bad bets, nobody objects", th: [
    ["Groupthink and social influence", "Does the group value agreement over evaluation? Does the leader speak first?", "decide", "d-groupthink"],
    ["Decision biases", "Sunk costs, overconfidence, anchoring, framing: which one shows in the facts?", "decide", "d-sunk"],
    ["Bounded rationality (Simon)", "Are people trying to evaluate every option instead of satisficing?", "decide", "d-simon"],
    ["When intuition works", "Is someone deciding by gut on a task that can be broken into steps, without expertise?", "decide", "d-intuition"]] },
  { s: "People feel treated unfairly", sub: "complaints about pay, promotions, the way decisions are made", th: [
    ["Equity theory", "Who is the referent? Which of the six reactions are people choosing?", "motiv", "m-equity"],
    ["Organizational justice", "Is the problem the outcome (distributive), the process (procedural) or the treatment (interactional)?", "motiv", "m-justice"],
    ["Attribution errors", "Are managers blaming people (fundamental attribution error) for problems caused by the situation?", "decide", "d-fae"]] },
  { s: "Appraisals or hiring go wrong", sub: "biased ratings, the wrong people promoted or hired", th: [
    ["Halo and contrast effects", "Does one impression, or the previous person, color the rating?", "decide", "d-person"],
    ["Kelley's attribution model", "Distinctiveness, consensus, consistency: person or situation?", "decide", "d-kelley"],
    ["Using personality tests", "MBTI for selection, social desirability, no interviews or references?", "person", "p-select"]] },
  { s: "Nobody knows who does what", sub: "duplicated work, inconsistent decisions, growth pains", th: [
    ["Five criteria of an organization", "Which is weak: goals, coordination, roles, rules, continuity?", "org", "o-five"],
    ["Bureaucracy (Weber)", "Would clearer roles, rules and merit-based promotion help, where predictability matters?", "org", "o-weber"],
    ["Contingency approach", "Does the structure fit the task, the people, the technology, the environment?", "org", "o-contingency"]] }
];
const PJ_CHECK = [
  "The problem is stated as a gap (desired ≠ actual), not as a cause or a solution",
  "The problem is about people and behavior, not mainly finance, marketing or operations",
  "We have enough reliable information (interview, observation, articles, reports)",
  "At least two OB frameworks in the diagnosis",
  "Each framework explains part of the mechanism, with facts from the case",
  "Each recommendation names its theory and says why it should work",
  "Recommendations are specific and realistic (who, what, when)",
  "Expected outcomes and potential challenges are on a slide",
  "The talk fits in 10 minutes, rehearsed with a timer",
  "Every member can present: two of us are drawn at random"
];
const PJ_QA = [
  ["Why these two frameworks and not others?", "Show that each one explains a different part of the facts, and say which alternative you ruled out and why."],
  ["How do you know this is the real cause?", "Point to the evidence: interviews, figures, quotes. Contrast with a cause the facts do not support."],
  ["Is this really a people problem?", "Show the behavioral mechanism (motivation, perception, group dynamics) behind the business symptom."],
  ["What could go wrong with your recommendation?", "Name one limit (cost, moderators such as growth need strength, resistance) and how to reduce it."],
  ["How would you measure success?", "One indicator per recommendation: turnover, engagement survey, error rate, time to decide."],
  ["What would a manager do first on Monday?", "Give the first concrete step of your implementation plan."]
];
function viewProject(){
  const st = MS.get("project", { ticks: [] }), ticks = new Set(st.ticks || []);
  let sym = 0;
  const root = h("div", { class: "mod project", html: `
  ${mhead("Management and Organizations", "Group project", "40% of the grade: a 10-minute presentation in session 9, then 5 minutes of questions. Here is the brief from lecture 1, a tool to find the right theories, a checklist and the questions to rehearse.")}
  <section class="pj-steps">${PJ_STEPS.map((s, i) => `<article class="pj-step"><span class="pj-n">Step ${i + 1}</span><h2>${s.h}</h2><p>${s.t}</p>${s.ex ? `<p class="pj-ex">${s.ex}</p>` : ""}</article>`).join("")}</section>
  <section class="sec pj-finder"><div class="sec-h"><h2>Theory finder</h2><p>Pick what you observe. Each theory comes with the question to ask and a link to its card.</p></div>
    <div class="pjf"><div class="pjf-l" role="group" aria-label="Symptoms">${PJ_FINDER.map((f, i) => `<button type="button" data-sym="${i}"><b>${f.s}</b><span>${f.sub}</span></button>`).join("")}</div><div class="pjf-r" aria-live="polite"></div></div></section>
  <section class="sec"><div class="sec-h"><h2>The structure that is expected</h2><p>10 minutes + 5 minutes of Q&amp;A.</p></div>
    <ol class="pj-struct">${PJ_STRUCT.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join("")}</ol></section>
  <section class="sec"><div class="sec-h"><h2>Checkpoints</h2><p>Groups of 5 from your tutorial section. One member submits for the group, with every name on it.</p></div>
    <ol class="pj-dates">${PJ_DATES.map(([d, a, b]) => `<li><span class="num">${d}</span><b>${a}</b><small>${b}</small></li>`).join("")}</ol></section>
  <section class="sec pj-checks"><div class="sec-h"><h2>Before you present</h2><p data-pjn></p></div>
    <ul>${PJ_CHECK.map((c, i) => `<li><label><input type="checkbox" data-pj="${i}" ${ticks.has(i) ? "checked" : ""}><span>${c}</span></label></li>`).join("")}</ul></section>
  <section class="sec"><div class="sec-h"><h2>Rehearse the Q&amp;A</h2><p>Answer out loud, then open the tip.</p></div>
    <div class="pj-qa">${PJ_QA.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></section>
  ${creditHtml()}` });
  const out = root.querySelector(".pjf-r");
  const paint = () => {
    root.querySelectorAll("[data-sym]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.sym === sym)));
    const f = PJ_FINDER[sym];
    out.innerHTML = f.th.map(([t, q, ch, note]) => `<a class="pjt" href="#learn-${ch}" data-note="${note}" style="--c:${CH[ch].c}"><span class="pjt-ch">${CH[ch].short}</span><b>${t}</b><span>${q}</span></a>`).join("");
  };
  const count = () => { root.querySelector("[data-pjn]").textContent = `${ticks.size} of ${PJ_CHECK.length} done`; };
  root.addEventListener("click", e => {
    const b = e.target.closest("[data-sym]"); if (b){ sym = +b.dataset.sym; paint(); if (matchMedia("(max-width:820px)").matches) out.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
    const a = e.target.closest(".pjt"); if (a) GOTO.note = a.dataset.note;
  });
  root.addEventListener("change", e => { const cb = e.target.closest("[data-pj]"); if (!cb) return; const k = +cb.dataset.pj; if (cb.checked){ ticks.add(k); burst(cb, ["--ok", "--pri"]); } else ticks.delete(k); MS.set("project", { ticks: [...ticks] }); count(); });
  paint(); count();
  return root;
}
