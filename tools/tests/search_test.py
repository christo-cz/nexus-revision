import asyncio, json
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}
        for lab, q, q2 in [("management", "halo", "kelley"), ("macro", "multiplier", "big mac"), ("global", "tipping point", "gini")]:
            for vw, vh, tag in [(1440, 900, "d"), (390, 844, "m")]:
                ctx = await b.new_context(viewport={"width": vw, "height": vh})
                await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
                page = await ctx.new_page(); errs = []
                page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text else None)
                page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
                await page.goto(f"http://localhost:8770/{lab}/#learn"); await page.wait_for_timeout(800)
                if tag == "d": await page.keyboard.press("/")
                else: await page.click("#srchBtn")
                await page.wait_for_timeout(300)
                await page.keyboard.type(q); await page.wait_for_timeout(250)
                res = await page.locator(".srch-res li[data-i]").all_inner_texts()
                if tag == "d": await page.screenshot(path=f"shots/search-{lab}-{tag}.png")
                await page.keyboard.press("Enter"); await page.wait_for_timeout(1400)
                hash_ = await page.evaluate("location.hash")
                flash = await page.evaluate("!!document.querySelector('.note.flash')")
                inview = await page.evaluate("(() => { const n = document.querySelector('.note.flash'); if (!n) return null; const r = n.getBoundingClientRect(); return r.top > -10 && r.bottom < innerHeight + 300; })()")
                out[f"{lab} {tag}"] = {"n": len(res), "first": res[0][:80] if res else None, "hash": hash_, "flash": flash, "inview": inview}
                # recap
                await page.evaluate("location.hash='recap'"); await page.wait_for_timeout(900)
                await page.fill(".recap-f input", q2); await page.wait_for_timeout(200)
                out[f"{lab} {tag} recap"] = await page.locator(".recap-n").inner_text()
                if tag == "d": await page.screenshot(path=f"shots/recap-{lab}-{tag}.png")
                await page.fill(".recap-f input", ""); await page.wait_for_timeout(200)
                if tag == "d": await page.screenshot(path=f"shots/recap-full-{lab}-{tag}.png", full_page=True)
                ov = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                out[f"{lab} {tag} overflow"] = ov
                out[f"{lab} {tag} errors"] = errs
                await ctx.close()
        await b.close(); print(json.dumps(out, indent=1))
asyncio.run(run())
