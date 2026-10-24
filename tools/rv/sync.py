#!/usr/bin/env python3
"""Copy the reviews kit (nx_reviews.js / nx_reviews.css) into the Macroeconomics lab and the hub.
Management and Global Challenges get it through extract.py + build.py / build_sg.py."""
import os, re, sys
D = os.path.dirname(os.path.abspath(__file__))
R = os.path.abspath(os.path.join(D, '..', '..'))  # the repository
kjs = open(os.path.join(D, 'nx_reviews.js')).read().strip()
kcss = open(os.path.join(D, 'nx_reviews.css')).read().strip()

def between(s, a, b, new, keep_a=True):
    i = s.index(a); j = s.index(b, i + len(a))
    return s[:i] + (a if keep_a else '') + new + s[j:]

LAB_JS = '''
const RV = { lab: "flow", name: "Macroeconomics" };
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
''' + kjs + '''
function mountReviewSlot(slot){ NXR.slot(slot, RV); }
function mountReviewSection(sec){ NXR.section(sec, RV); }
function nudgeReview(kind){ NXR.nudge(RV, kind); }
(function(){ const b = document.getElementById("rvBtn"); if (!b) return; b.innerHTML = NXR.PEN + '<span class="tl">Review</span>'; b.title = "Write a review"; b.setAttribute("aria-label", "Write a review"); b.addEventListener("click", () => NXR.sheet(RV)); })();

'''

# ---- macro
p = R + '/macro/index.html'; s = open(p).read()
s = between(s, '/* ---------- reviews (shared API: /api/reviews) ---------- */', '/* ---------- full screen that survives page changes ----------', LAB_JS)
s = between(s, '/* ---------- reviews ---------- */', '/* ---------- overview & case list: the living circular flow ---------- */', '\n' + kcss + '\n')
open(p, 'w').write(s)

# ---- hub
p = R + '/index.html'; s = open(p).read()
if '/* nxr-css:start' not in s:
    s = s.replace('</style>', kcss + '\n</style>', 1)
else:
    i = s.index('/* nxr-css:start'); j = s.index('/* nxr-css:end */') + len('/* nxr-css:end */')
    s = s[:i] + kcss + s[j:]
i = s.index('/* nxr:start'); j = s.index('/* nxr:end */') + len('/* nxr:end */')
s = s[:i] + kjs + s[j:]
open(p, 'w').write(s)
print('synced')
