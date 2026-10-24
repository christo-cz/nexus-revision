import os
D = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(D, '..', '..', 'macro', 'index.html')).read()
def cut(a, b):
    i = src.index(a); j = src.index(b, i + len(a)); return src[i:j]
parts = {
 'css_base.css': ('*{box-sizing:border-box}', '/* ---------- case workbook ---------- */'),
 'css_book.css': ('/* ---------- case workbook ---------- */', '/* ---------- reviews ---------- */'),
 'css_reviews.css': ('/* ---------- reviews ---------- */', '/* ---------- overview & case list: the living circular flow ---------- */'),
 'css_ov.css': ('/* ---------- overview & case list: the living circular flow ---------- */', '/* case cards: hover swaps the card for its numbers */'),
 'css_td.css': ('/* tutorials */', '/* ---------- revision modules ---------- */'),
 'css_mod.css': ('/* ---------- revision modules ---------- */', '</style>'),
 'js_util.js': ('/* ---------- utilities ---------- */', '/* ---------- case generator'),
 'js_credit.js': ('/* ---------- author credit', '/* ---------- overview ---------- */'),
 'js_reviews.js': ('/* ---------- reviews (shared API: /api/reviews) ---------- */', '/* ---------- background colour that follows the scroll ----------'),
 'js_tint.js': ('/* ---------- background colour that follows the scroll ----------', '/* ---------- the circular flow, live'),
 'js_aura.js': ('/* ---------- colour aura that follows the pointer', '/* =====================================================================\n   COURSE CONTENT'),
 'js_ms.js': ('const MS = {', '/* ---------------- LEARN: index ---------------- */'),
 'js_learn.js': ('/* ---------------- LEARN: index ---------------- */', '/* ---------------- interactive widgets ---------------- */'),
 'js_quizcards.js': ('/* ---------------- QUIZ: exam-style multiple choice ---------------- */', '/* ---------------- OPEN QUESTIONS ---------------- */'),
 'js_open.js': ('/* ---------------- OPEN QUESTIONS ---------------- */', '/* ---------------- overview: the modules ---------------- */'),
 'js_focus.js': ('function focusCard(card, instant){', 'function fmtAns(q)'),
}
for f, (a, b) in parts.items():
    open(os.path.join(D, f), 'w').write(cut(a, b))
print('extracted', len(parts))
