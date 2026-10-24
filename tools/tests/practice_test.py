import asyncio, json, sys
from playwright.async_api import async_playwright
# the Practice module: old links land on the right tab, a quiz runs to its score, streak and sprint count, keys work, progress keys are kept
LABS = sys.argv[1].split(",") if len(sys.argv) > 1 else ["global"]
OLD = {"global": {"sort": "practice", "sort-bounds": "practice-bounds", "quiz": "practice", "quiz-sd": "practice-sd", "cards": "practice-cards", "cards-social": "practice-cards-social", "open": "practice-open", "open-x1": "open-x1"},
       "management": {"spot": "practice", "quiz": "practice", "quiz-decide": "practice-decide", "cards": "practice-cards", "open": "practice-open"}}
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}
        for lab in LABS:
            for vw, vh, tag in [(1440, 900, "d"), (390, 844, "m")]:
                ctx = await b.new_context(viewport={"width": vw, "height": vh})
                await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1');sessionStorage.setItem('nexus-rv-nudge','1')}catch(e){}")
                pg = await ctx.new_page(); errs = []
                pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "fonts.g" not in m.text else None)
                pg.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
                base = f"http://localhost:8770/{lab}/"
                r = {}
                for old, new in OLD[lab].items():
                    await pg.goto(base + "#" + old); await pg.wait_for_timeout(400)
                    h = await pg.evaluate("location.hash.slice(1)")
                    cur = await pg.evaluate("(document.querySelector('.prtabs [aria-current=page]')||{}).textContent || ''")
                    nav = await pg.evaluate("(document.querySelector('.nav [aria-current=page]')||{}).textContent || ''")
                    r[old] = "ok" if h == new and nav == "Practice" else f"BAD hash={h} nav={nav} tab={cur}"
                out[f"{lab} {tag} old links"] = r
                # a 10-question quiz, answered with the keyboard (b, then Enter), to its score
                await pg.goto(base + "#practice"); await pg.wait_for_timeout(500)
                before = await pg.evaluate(f"(JSON.parse(localStorage.getItem('{'sgc-v1' if lab == 'global' else 'mgmt-v1'}'))||{{}}).quiz || null")
                await pg.click("[data-start]"); await pg.wait_for_timeout(200)
                for i in range(10):
                    await pg.keyboard.press("b"); await pg.wait_for_timeout(60)
                    assert await pg.locator(".verdict").count() == 1, "no verdict"
                    await pg.keyboard.press("Enter"); await pg.wait_for_timeout(60)
                end = await pg.locator(".qzend h2").inner_text()
                q = await pg.evaluate(f"(JSON.parse(localStorage.getItem('{'sgc-v1' if lab == 'global' else 'mgmt-v1'}'))||{{}}).quiz")
                out[f"{lab} {tag} quiz"] = {"end": end, "saved": q, "count+1": (q or {}).get("count", 0) == ((before or {}).get("count", 0) + 1)}
                # the right answer is the one the code marks: click it, it must say Correct
                await pg.click("[data-setup]"); await pg.click("[data-mode=streak]"); await pg.click("[data-start]"); await pg.wait_for_timeout(200)
                goods = 0
                for i in range(12):
                    right = await pg.evaluate("(() => { const s = [...document.querySelectorAll('.qzq .opt')]; return s.length; })()")
                    # pick the first option, read the verdict; on a wrong pick the right one is highlighted
                    await pg.click(".qzq .opt >> nth=0"); await pg.wait_for_timeout(50)
                    v = await pg.locator(".verdict b").first.inner_text()
                    hi = await pg.locator(".qzq .opt.right").count()
                    if v == "Correct": goods += 1
                    assert hi == 1, "exactly one right option must be highlighted"
                    await pg.click("[data-next]"); await pg.wait_for_timeout(50)
                stats = await pg.evaluate("[...document.querySelectorAll('.drillstats b')].map(x => x.textContent)")
                out[f"{lab} {tag} streak"] = {"stats": stats, "goods": goods}
                # sprint starts, the timer runs
                await pg.click("[data-setup]"); await pg.click("[data-mode=sprint]"); await pg.click("[data-start]"); await pg.wait_for_timeout(1200)
                w = await pg.evaluate("document.querySelector('.timer i').style.width")
                out[f"{lab} {tag} sprint timer"] = w
                # tabs
                for t in ["practice-cards", "practice-open"]:
                    await pg.goto(base + "#" + t); await pg.wait_for_timeout(500)
                    out[f"{lab} {tag} {t}"] = await pg.evaluate("[(document.querySelector('.prtabs [aria-current=page]')||{}).textContent, document.querySelectorAll('.prtabs a').length, !!document.querySelector('.fstage > *, .olist .oitem')]")
                ov = await pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                out[f"{lab} {tag} overflow"] = ov
                out[f"{lab} {tag} errors"] = errs
                await ctx.close()
        await b.close(); print(json.dumps(out, indent=1))
asyncio.run(run())
