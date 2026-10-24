import asyncio, json
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page(); errs = []
        page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto("http://localhost:8770/macro/#mock"); await page.wait_for_timeout(600)
        await page.click("[data-start]"); await page.wait_for_timeout(300)
        await page.goto("http://localhost:8770/management/#exam"); await page.wait_for_timeout(600)
        await page.click("[data-start]"); await page.wait_for_timeout(300)
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(900)
        r = await page.evaluate("[...document.querySelectorAll('.rs')].map(a => a.innerText.replace(/\\n/g,' | ') + ' -> ' + a.getAttribute('href'))")
        await page.evaluate("document.getElementById('resume').scrollIntoView()"); await page.wait_for_timeout(900)
        await page.screenshot(path="shots/resume.png")
        print(json.dumps({"rows": r, "errors": errs}, indent=1)); await b.close()
asyncio.run(run())
