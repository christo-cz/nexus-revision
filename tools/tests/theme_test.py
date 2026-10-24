import asyncio, json
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page(); errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text else None)
        for url, sel in [("http://localhost:8770/", "#theme"), ("http://localhost:8770/macro/#learn", "#themeBtn"), ("http://localhost:8770/management/#labs", "#themeBtn")]:
            await page.goto(url); await page.wait_for_timeout(900)
            seq = [await page.evaluate("document.documentElement.dataset.theme")]
            await page.click(sel); await page.wait_for_timeout(250)
            await page.screenshot(path=f"shots/theme-mid-{len(out)}.png")
            await page.wait_for_timeout(700)
            seq.append(await page.evaluate("document.documentElement.dataset.theme"))
            seq.append(await page.evaluate("document.documentElement.classList.contains('theme-vt')"))
            await page.click(sel); await page.wait_for_timeout(900)
            seq.append(await page.evaluate("document.documentElement.dataset.theme"))
            out[url] = seq
        out["errors"] = errs
        print(json.dumps(out)); await b.close()
asyncio.run(run())
