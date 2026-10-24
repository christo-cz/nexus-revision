import os
import asyncio, json
from playwright.async_api import async_playwright
SH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page(); page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(5200)
        act = "document.querySelector('.pen-chips [aria-pressed=true]').textContent + ' | ' + document.querySelector('.pen-card h2').textContent"
        out["rest"] = await page.evaluate(act)
        await page.screenshot(path=SH + "pen-rest.png")
        st = await page.query_selector(".pen-stage"); bb = await st.bounding_box()
        cx, cy = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2
        await page.mouse.move(cx, cy); await page.mouse.down()
        for k in range(10): await page.mouse.move(cx, cy - 12 * (k + 1)); await page.wait_for_timeout(16)
        await page.mouse.up(); await page.wait_for_timeout(1800)
        out["after drag up 120px"] = await page.evaluate(act)
        await page.click(".pen-chips [data-go='3']"); await page.wait_for_timeout(1500)
        out["chip mock"] = await page.evaluate(act + " + ' | links ' + document.querySelectorAll('.pen-card .go a').length")
        await page.screenshot(path=SH + "pen-mock.png")
        await page.click("[data-next]"); await page.wait_for_timeout(1400)
        out["next"] = await page.evaluate(act)
        await page.click(".pen-chips [data-go='2']"); await page.wait_for_timeout(1500)
        await page.mouse.click(cx, cy); await page.wait_for_timeout(1500)
        out["click front"] = page.url
        out["errors"] = errs; print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
