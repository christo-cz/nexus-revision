import os
import asyncio, sys, json
from playwright.async_api import async_playwright
BASE = "http://localhost:8770/global/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
ROUTES = ["home", "learn", "learn-systems", "learn-sd", "learn-ecology", "learn-bounds", "learn-social", "learn-economy", "learn-method", "studio", "studio-heat", "studio-cocoa", "studio-free", "studio-drills", "sort", "figures", "quiz", "cards", "open", "open-x1", "open-d1", "exam", "recap"]
SHOTS = set(sys.argv[1].split(",")) if len(sys.argv) > 1 and sys.argv[1] else set()

async def run():
    import os; os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        problems = []
        for theme in ["dark", "light"]:
            for vw, vh, tag in [(1440, 900, "d"), (390, 844, "m")]:
                ctx = await b.new_context(viewport={"width": vw, "height": vh}, device_scale_factor=1)
                await ctx.add_init_script(f"try{{localStorage.setItem('nexus-theme','{theme}');sessionStorage.setItem('nexus-fs-inv','1')}}catch(e){{}}")
                page = await ctx.new_page()
                errs = []
                page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text and "fonts.g" not in m.text else None)
                page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
                await page.goto(BASE + "#home"); await page.wait_for_timeout(500)
                for r in ROUTES:
                    await page.evaluate(f"location.hash = '{r}'"); await page.wait_for_timeout(1100 if SHOTS else 450)
                    ov = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                    wide = await page.evaluate("""() => { const out = []; const W = document.documentElement.clientWidth; document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && r.right > W + 1 && getComputedStyle(e).position !== 'fixed') { let p = e.parentElement, clipped = false; while (p) { const s = getComputedStyle(p); if (/(auto|hidden|scroll|clip)/.test(s.overflowX)) { clipped = true; break; } p = p.parentElement; } if (!clipped) out.push(e.tagName + '.' + e.className + ' ' + Math.round(r.right)); } }); return out.slice(0, 5); }""")
                    if ov > 0 or wide: problems.append((theme, tag, r, ov, wide))
                    key = f"{r}-{tag}-{theme}"
                    if r in SHOTS or key in SHOTS or (SHOTS and "all" in SHOTS):
                        await page.screenshot(path=OUT + key + ".png", full_page=False)
                if errs: problems.append((theme, tag, "console", errs[:8]))
                await ctx.close()
        await b.close()
        print(json.dumps(problems, indent=1) if problems else "NO PROBLEMS")
asyncio.run(run())
