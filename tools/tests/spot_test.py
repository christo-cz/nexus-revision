import os
import asyncio, json
from playwright.async_api import async_playwright
SH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        for w in [1440, 390]:
            ctx = await b.new_context(viewport={"width": w, "height": 900})
            await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1');sessionStorage.setItem('nexus-rv-nudge','1')}catch(e){}")
            page = await ctx.new_page()
            page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            await page.goto("http://localhost:8770/macro/#spot"); await page.wait_for_timeout(1200)
            for k in range(25):
                await page.click(".dq .opt >> nth=0"); await page.wait_for_timeout(60)
                await page.click("[data-next]"); await page.wait_for_timeout(60)
            out[f"spot {w}"] = await page.evaluate("document.querySelector('[data-s=score]').textContent")
            out[f"overflow spot {w}"] = await page.evaluate("document.documentElement.scrollWidth > innerWidth")
            await page.screenshot(path=SH + f"mspot-{w}.png")
            await page.goto("http://localhost:8770/macro/#home"); await page.wait_for_timeout(1500)
            out[f"nav {w}"] = await page.evaluate("(() => { const n = document.querySelector('.nav'); return n.scrollWidth + '/' + n.clientWidth; })()")
            el = await page.query_selector(".mods"); await el.scroll_into_view_if_needed(); await page.wait_for_timeout(800); await el.screenshot(path=SH + f"mmods-{w}.png")
            await page.screenshot(path=SH + f"mhdr-{w}.png", clip={"x": 0, "y": 0, "width": w, "height": 110})
            await ctx.close()
        out["errors"] = errs; print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
