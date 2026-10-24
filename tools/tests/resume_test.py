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
        # Global Challenges ticks saved before Learn was compacted (89 -> 52 cards): s-course + s-exam merge into one known card,
        # s-cld alone (s-system not ticked) and e-tipping alone (e-resilience not ticked) do not make a merged card known, m-facts was never merged
        await page.evaluate("""localStorage.setItem('sgc-v1', JSON.stringify({ learn: { 's-course': 1, 's-exam': 1, 's-cld': 1, 'e-tipping': 1, 'm-facts': 1 } }))""")
        # Management (79 -> 49 cards): o-ob + o-disc + o-levels make one known card, d-person alone does not, o-problem was never merged
        await page.evaluate("""(() => { const s = JSON.parse(localStorage.getItem('mgmt-v1')) || {}; s.learn = { 'o-ob': 1, 'o-disc': 1, 'o-levels': 1, 'd-person': 1, 'o-problem': 1 }; delete s.learnV; localStorage.setItem('mgmt-v1', JSON.stringify(s)); })()""")
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(900)
        r = await page.evaluate("[...document.querySelectorAll('.rs')].map(a => a.innerText.replace(/\\n/g,' | ') + ' -> ' + a.getAttribute('href'))")
        tile = await page.evaluate("document.getElementById('sgcStatus').innerText")
        await page.evaluate("document.getElementById('resume').scrollIntoView()"); await page.wait_for_timeout(900)
        await page.screenshot(path="shots/resume.png")
        await page.goto("http://localhost:8770/global/#learn"); await page.wait_for_timeout(700)
        mig = await page.evaluate("(() => { const s = JSON.parse(localStorage.getItem('sgc-v1')); return { learn: s.learn, v: s.learnV }; })()")
        stat = await page.evaluate("document.querySelector('.mprog span').innerText")
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(700)
        r2 = await page.evaluate("[...document.querySelectorAll('.rs')].filter(a => /Global/.test(a.innerText)).map(a => a.innerText.replace(/\\n/g,' | '))")
        ok = mig == {"learn": {"s-course": 1, "m-facts": 1}, "v": 2} and "2 of 52" in stat and any("2 of 52" in x for x in r) and any("2 of 52" in x for x in r2) and "2 of 52" in tile
        mtile = await page.evaluate("document.getElementById('mgmtStatus').innerText")
        await page.goto("http://localhost:8770/management/#learn"); await page.wait_for_timeout(700)
        mmig = await page.evaluate("(() => { const s = JSON.parse(localStorage.getItem('mgmt-v1')); return { learn: s.learn, v: s.learnV }; })()")
        mstat = await page.evaluate("document.querySelector('.mprog span').innerText")
        mok = mmig == {"learn": {"o-ob": 1, "o-problem": 1}, "v": 2} and "2 of 49" in mstat and "2 of 49" in mtile
        print(json.dumps({"rows": r, "sgc tile": tile, "sgc migrated": mig, "learn after": stat, "hub after": r2, "migration ok": ok, "mgmt tile": mtile, "mgmt migrated": mmig, "mgmt learn after": mstat, "mgmt migration ok": mok, "errors": errs}, indent=1)); await b.close()
asyncio.run(run())
