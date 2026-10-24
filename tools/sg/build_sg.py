#!/usr/bin/env python3
"""Assemble /global/index.html (Societal and Global Challenges) from the shared Nexus pieces
(extracted from the Macroeconomics lab into ../mg by extract.py), some Management pieces, and this lab's own files."""
import os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
MG = os.path.join(os.path.dirname(D), 'mg')
ROOT = os.path.abspath(os.path.join(D, '..', '..'))  # the repository
OUT = os.path.join(ROOT, 'global', 'index.html')
r = lambda p: open(os.path.join(D, p)).read()
m = lambda p: open(os.path.join(MG, p)).read()

def sub(text, pairs, name):
    for a, b in pairs:
        if a not in text:
            print(f'!! {name}: not found: {a[:80]!r}', file=sys.stderr); sys.exit(1)
        text = text.replace(a, b)
    return text

COLOR = [('--flow-soft', '--pri-soft'), ('--flow-2', '--pri-2'), ('--on-flow', '--on-pri'), ('--flow', '--pri'),
         ('--inj-soft', '--c4-soft'), ('--inj', '--c4'), ('--leak-soft', '--c3-soft'), ('--leak', '--c3'), ('--ch4', '--c5')]
def recolor(t):
    for a, b in COLOR: t = t.replace(a, b)
    return t

# Management CSS: keep the generic sections (hero frame, overview, widgets, spot, exam, tilt), not cases, labs or project
mgcss = m('mg.css')
secs = re.split(r'(?m)^(?=/\* )', mgcss)
keep = []
for s in secs:
    head = s.split('\n', 1)[0]
    if any(k in head for k in ['cases list', 'case view', '/* labs', 'group project']): continue
    keep.append(s)
mgcss = ''.join(keep)

css = r('sg_tokens.css') + recolor(m('css_base.css') + m('css_book.css') + m('css_reviews.css') + m('css_ov.css') + m('css_td.css') + m('css_mod.css')) + mgcss + r('sg.css')
css = css.replace('color:var(--surface)', 'color:var(--bg)')

util = sub(m('js_util.js'), [('"flow-v1"', '"sgc-v1"'), ('const BURST = ["--flow", "--inj", "--leak"];', 'const BURST = ["--pri", "--c4", "--c3", "--c1"];')], 'util')
reviews = sub(m('js_reviews.js'), [('const RV = { lab: "flow", name: "Macroeconomics" };', 'const RV = { lab: "sgc", name: "Global Challenges" };')], 'reviews')
aura = sub(recolor(m('js_aura.js')), [('teal → amber → coral across the screen', 'leaf → ochre → rose across the screen')], 'aura')
learn = sub(recolor(m('js_learn.js')), [
    ('mhead("Macroeconomics", "Learn the course", "Four chapters, cut into short cards: the rule in one line, the formula, an example, the trap, and what the exam wants. Tick each card when you know it."',
     'mhead("Societal and Global Challenges", "Learn the course", "Six sessions and the tutorial, cut into short cards: the notion in one line, the key points, an example, the trap, and what the exam wants. Tick each card when you know it."'),
    ('<li><b>Read a chapter</b><span>Card by card. Tick what you could explain to a friend.</span></li>', '<li><b>Read a session</b><span>Card by card, and play with each model. Tick what you could explain to a friend.</span></li>'),
    ('<li><b>Test it</b><span>Run the chapter quiz and read every explanation, even when you are right.</span></li>', '<li><b>Test it</b><span>Run the session quiz and read every explanation, even when you are right.</span></li>'),
    ('<li><b>Drill the numbers</b><span>Short exercises until the formulas are automatic.</span></li>', '<li><b>Draw the diagram</b><span>In the Causal studio, draw the session\'s diagram and get each link checked.</span></li>'),
    ('<li><b>Write one open answer</b><span>Then compare with the model answer and tick the key points.</span></li>', '<li><b>Explain one notion</b><span>Write it as in the exam, then compare with the model answer and tick the key points.</span></li>'),
    ('All chapters', 'All sessions'), ('>Quiz this chapter<', '>Practise this session<'), ('href="#quiz-${c.id}"', 'href="#practice-${c.id}"'), ('href="#cards-${c.id}"', 'href="#practice-cards-${c.id}"'),
    ('mhead(`Chapter ${c.n}`', 'mhead(`Session ${c.n}`'), ('>Test this chapter<', '>Test this session<'),
    ('<span>Run the session quiz and read every explanation, even when you are right.</span>', '<span>In Practice, run the session\'s questions and read every explanation, even when you are right.</span>'),
], 'learn')
qc = recolor(m('js_quizcards.js')).replace('mhead("Macroeconomics"', 'mhead("Societal and Global Challenges"')
focus = sub(m('js_focus.js'), [('card.querySelector("input:not([disabled]), .opt:not([disabled])")', 'card.querySelector("input:not([disabled]), .opt:not([disabled]), textarea")')], 'focus')
practice = m('mg_practice.js')
helpers = '''const RI = (a, b, s = 1) => a + s * Math.floor(Math.random() * ((b - a) / s + 1));
const PICK = a => a[Math.floor(Math.random() * a.length)];
const PR_LEDE = "Exam-style multiple choice and fast sorting (environmental, social or economic; macro, meso or micro; which boundary, which scenario), mixed. Every answer comes with its explanation.";
'''
js = '\n'.join([util, m('js_credit.js'), reviews, m('js_tint.js'), aura, helpers,
                r('s_course.js'), r('s_quiz.js'), r('s_open.js'), r('s_sort.js'), r('s_cld.js'), r('s_figures.js'),
                m('js_ms.js'), learn, qc, r('sg_engine.js'), r('sg_widgets.js'), r('sg_studio.js'), r('sg_hero.js'), practice, r('sg_home.js'), r('sg_exam.js'), focus,
                r('sg_search_consts.js'), m('nx_search.js'), 'document.addEventListener("click", e => { if (e.target.closest("[data-search]")) openSearch(); });', r('sg_render.js')])
B = 'https://nexus-revision-bba1.netlify.app'
head = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Societal and Global Challenges · Nexus</title>
<meta name="description" content="Societal and Global Challenges revision for EDHEC BBA1: systems thinking and causal diagrams, sustainable development, ecology, planetary boundaries, the Doughnut, poverty and inequality, growth. A studio to draw causal diagrams, key figures and model answers.">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nexus">
<meta property="og:url" content="{B}/global/">
<meta property="og:title" content="Societal and Global Challenges · Nexus">
<meta property="og:description" content="Causal diagrams, planetary boundaries, the Doughnut, poverty and growth: the course in cards, live models and a studio to draw causal diagrams.">
<meta property="og:image" content="{B}/global/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Societal and Global Challenges on Nexus: a causal diagram studio, key figures and model answers.">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B120F">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@500;700&display=swap">
<script>var t="dark";try{{if(localStorage.getItem("nexus-theme")==="light")t="light";}}catch(e){{}}document.documentElement.dataset.theme=t;</script>
<style>
'''
body = '''</style>
</head>
<body>
<header class="hdr"><div class="hdr-in">
  <div class="crumb"><a class="hub" href="/" title="All subjects">Nexus</a><span class="sl">/</span><a class="here" href="#home"><b>Global Challenges</b></a></div>
  <nav class="nav" aria-label="Sections">
    <a href="#home" data-route="home">Overview</a>
    <a href="#learn" data-route="learn">Learn</a>
    <a href="#studio" data-route="studio">Causal studio</a>
    <a href="#figures" data-route="figures">Key figures</a>
    <a href="#practice" data-route="practice">Practice</a>
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
html = head + css + body + js + tail
open(OUT, 'w').write(html)
print('wrote', OUT, len(html), 'bytes')
