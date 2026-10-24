#!/usr/bin/env python3
"""Assemble /management/index.html from the shared Nexus pieces (extracted from the Macroeconomics lab)
and the Management lab's own CSS, content and code. Run after editing any part."""
import os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
S = os.path.dirname(D)
ROOT = os.path.abspath(os.path.join(D, '..', '..'))  # the repository
OUT = os.path.join(ROOT, 'management', 'index.html')
r = lambda p: open(os.path.join(D, p)).read()
rs = lambda p: open(os.path.join(S, p)).read()

def sub(text, pairs, name):
    for a, b in pairs:
        if a not in text:
            print(f'!! {name}: not found: {a[:70]!r}', file=sys.stderr); sys.exit(1)
        text = text.replace(a, b)
    return text

COLOR = [('--flow-soft', '--pri-soft'), ('--flow-2', '--pri-2'), ('--on-flow', '--on-pri'), ('--flow', '--pri'),
         ('--inj-soft', '--c3-soft'), ('--inj', '--c3'), ('--leak-soft', '--c1-soft'), ('--leak', '--c1'), ('--ch4', '--c4')]
def recolor(t):
    for a, b in COLOR: t = t.replace(a, b)
    return t

css = r('mg_tokens.css') + recolor(r('css_base.css') + r('css_book.css') + r('css_reviews.css') + r('css_ov.css') + r('css_td.css') + r('css_mod.css')) + r('mg.css')
# inside .mod, --surface is translucent glass: text on solid ok/bad fills must use the page background instead
css = css.replace('color:var(--surface)', 'color:var(--bg)')

util = sub(r('js_util.js'), [('"flow-v1"', '"mgmt-v1"'), ('const BURST = ["--flow", "--inj", "--leak"];', 'const BURST = ["--pri", "--c1", "--c3", "--c4"];')], 'util')
reviews = sub(r('js_reviews.js'), [('const RV = { lab: "flow", name: "Macroeconomics" };', 'const RV = { lab: "mgmt", name: "Management" };')], 'reviews')
aura = sub(recolor(r('js_aura.js')), [('teal → amber → coral across the screen', 'berry → violet → orange across the screen')], 'aura')
learn = sub(recolor(r('js_learn.js')), [
    ('mhead("Macroeconomics", "Learn the course", "Four chapters, cut into short cards: the rule in one line, the formula, an example, the trap, and what the exam wants. Tick each card when you know it."',
     'mhead("Management and Organizations", "Learn the course", "Four lectures and two tutorials, cut into short cards: the idea in one line, the key points, an example, the trap, and what the exam wants. Tick each card when you know it."'),
    ('<li><b>Read a chapter</b><span>Card by card. Tick what you could explain to a friend.</span></li>', '<li><b>Read a lecture</b><span>Card by card. Tick what you could explain to a friend.</span></li>'),
    ('<li><b>Test it</b><span>Run the chapter quiz and read every explanation, even when you are right.</span></li>', '<li><b>Test it</b><span>In Practice, run the lecture\'s questions and read every explanation, even when you are right.</span></li>'),
    ('<li><b>Drill the numbers</b><span>Short exercises until the formulas are automatic.</span></li>', '<li><b>Apply it</b><span>Workplace scenes in Practice, then a case: name the concept, then use it.</span></li>'),
    ('<li><b>Write one open answer</b><span>Then compare with the model answer and tick the key points.</span></li>', '<li><b>Write one exam answer</b><span>Then compare with the model answer and tick the key points.</span></li>'),
    ('All chapters', 'All lectures'), ('>Quiz this chapter<', '>Practise this lecture<'), ('href="#quiz-${c.id}"', 'href="#practice-${c.id}"'), ('href="#cards-${c.id}"', 'href="#practice-cards-${c.id}"'), ('mhead(`Chapter ${c.n}`', 'mhead(`Lecture ${c.n}`'), ('>Test this chapter<', '>Test this lecture<'),
], 'learn')
qc = recolor(r('js_quizcards.js')).replace('mhead("Macroeconomics"', 'mhead("Management and Organizations"')
focus = sub(r('js_focus.js'), [('card.querySelector("input:not([disabled]), .opt:not([disabled])")', 'card.querySelector("input:not([disabled]), .opt:not([disabled]), textarea")')], 'focus')
helpers = '''const RI = (a, b, s = 1) => a + s * Math.floor(Math.random() * ((b - a) / s + 1));
const PICK = a => a[Math.floor(Math.random() * a.length)];
const PR_LEDE = "Short workplace scenes to name (the bias, the need, the factor, the type of justice) and exam-style multiple choice, mixed. Every answer comes with its explanation.";
'''
js = '\n'.join([util, r('js_credit.js'), reviews, r('js_tint.js'), aura, helpers,
                rs('m_course.js'), rs('m_quiz.js'), rs('m_open.js'), rs('m_spot.js'), rs('m_cases.js'),
                r('js_ms.js'), learn, qc, r('mg_widgets.js'), r('mg_home.js'), r('mg_case.js'), r('mg_practice.js'), r('mg_labs.js'), r('mg_exam.js'), r('mg_project.js'), focus, r('mg_search_consts.js'), r('nx_search.js'), 'document.addEventListener("click", e => { if (e.target.closest("[data-search]")) openSearch(); });', r('mg_render.js')])
# the full-screen helper lives in the reviews cut (it sits between reviews and the tint in the macro file)
head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Fundamentals of Management and Organizations · Nexus</title>
<meta name="description" content="Fundamentals of Management and Organizations revision for EDHEC BBA1: the four lectures in cards, people-problem cases, Kelley and equity labs, the Big Five test, and every self-check question with a model answer.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nexus">
<meta property="og:url" content="https://nexus-revision-bba1.netlify.app/management/">
<meta property="og:title" content="Management and Organizations · Nexus">
<meta property="og:description" content="Fundamentals of Management and Organizations revision for EDHEC BBA1: the four lectures in cards, people-problem cases, labs and every exam question with a model answer.">
<meta property="og:image" content="https://nexus-revision-bba1.netlify.app/management/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Management and Organizations on Nexus: cases, labs and a mock exam.">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#120D14">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@500;700&display=swap">
<script>var t="dark";try{if(localStorage.getItem("nexus-theme")==="light")t="light";}catch(e){}document.documentElement.dataset.theme=t;</script>
<style>
'''
body = '''</style>
</head>
<body>
<header class="hdr"><div class="hdr-in">
  <div class="crumb"><a class="hub" href="/" title="All subjects">Nexus</a><span class="sl">/</span><a class="here" href="#home"><b>Management</b></a></div>
  <nav class="nav" aria-label="Sections">
    <a href="#home" data-route="home">Overview</a>
    <a href="#learn" data-route="learn">Learn</a>
    <a href="#cases" data-route="cases">Cases</a>
    <a href="#practice" data-route="practice">Practice</a>
    <a href="#labs" data-route="labs">Labs</a>
  </nav>
  <span class="grow"></span>
  <button class="theme" id="rvBtn" type="button" aria-label="Write a review"></button>
  <button class="theme" id="srchBtn" type="button" aria-label="Search the course (/)"></button>
  <button class="theme" id="fsBtn" type="button"></button>
  <button class="theme" id="themeBtn" type="button"></button>
</div></header>
<main id="app"></main>
<div class="sr" aria-live="polite" id="live"></div>
<script>
'''
tail = '''</script>
</body>
</html>
'''
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w').write(head + css + body + js + tail)
print('wrote', OUT, len(head + css + body + js + tail), 'bytes')
