import asyncio, json
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        for vw, tag in [(1440, "d"), (390, "m")]:
            ctx = await b.new_context(viewport={"width": vw, "height": 844})
            await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
            page = await ctx.new_page()
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text and "fonts.g" not in m.text else None)
            await page.goto("http://localhost:8770/management/#exam"); await page.wait_for_timeout(600)
            await page.click("[data-start]"); await page.wait_for_timeout(300)
            for t in await page.query_selector_all("textarea[data-ans]"): await t.fill("An organization coordinates roles and rules toward collective goals.")
            await page.wait_for_timeout(400)
            await page.click("[data-finish]"); await page.wait_for_timeout(100); await page.click("[data-finish]"); await page.wait_for_timeout(600)
            for c in (await page.query_selector_all("[data-xt]"))[:4]: await c.check()
            await page.wait_for_timeout(300)
            out[tag + " score"] = await page.evaluate("document.querySelector('.exend h2').textContent")
            await page.click("[data-new]"); await page.wait_for_timeout(600)
            out[tag + " hist"] = await page.evaluate("document.querySelector('.mkhist') ? document.querySelector('.mkhist').innerText.replace(/\\n/g,' ') : 'none'")
            out[tag + " overflow"] = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            await ctx.close()
        out["errors"] = errs; print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
