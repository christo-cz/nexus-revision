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
            page = await ctx.new_page(); page.on("pageerror", lambda e: errs.append(str(e)))
            for cid in ["heat", "amazon", "paygap"]:
                await page.goto(f"http://localhost:8770/global/#studio-{cid}"); await page.wait_for_timeout(700)
                out[f"{cid} mode {w}"] = await page.evaluate("document.querySelector('[data-mode][aria-pressed=true]').textContent + ' / ' + document.querySelectorAll('.vp').length + ' chips / board hidden ' + document.querySelector('.boardwrap').hidden")
                n = await page.evaluate("document.querySelectorAll('.vp').length")
                for i in range(0, n, 2): await page.click(f".vp >> nth={i}")
                await page.click("[data-check]"); await page.wait_for_timeout(300)
                out[f"{cid} score {w}"] = await page.evaluate("document.querySelector('.stscore').innerText.replace(/\\n/g,' ')")
                if cid == "heat": await page.screenshot(path=SH + f"text-heat-{w}.png", full_page=True)
                await page.click(".stscore [data-mode=links]"); await page.wait_for_timeout(300)
                out[f"{cid} after next {w}"] = await page.evaluate("document.querySelector('[data-mode][aria-pressed=true]').textContent + ' board ' + !document.querySelector('.boardwrap').hidden")
            out[f"overflow {w}"] = await page.evaluate("document.documentElement.scrollWidth > innerWidth")
            await ctx.close()
        out["errors"] = errs; print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
