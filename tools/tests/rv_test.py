import os
import asyncio, json, sys
from playwright.async_api import async_playwright
B = "http://localhost:8770"
SH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        for theme, w, h in [("dark", 1440, 900), ("light", 1440, 900), ("dark", 390, 844)]:
            ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
            await ctx.add_init_script(f"try{{sessionStorage.setItem('nexus-fs-inv','1');localStorage.setItem('nexus-theme','{theme}')}}catch(e){{}}")
            page = await ctx.new_page()
            page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
            page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "fonts.g" not in m.text else None)
            tag = f"{theme}-{w}"
            await page.goto(B + "/#reviews"); await page.wait_for_timeout(1500)
            await page.evaluate("document.getElementById('reviews').scrollIntoView()"); await page.wait_for_timeout(1500)
            out["hub slips " + tag] = await page.evaluate("document.querySelectorAll('#voicesBody .nx-slip').length")
            out["hub overflow " + tag] = await page.evaluate("document.documentElement.scrollWidth > innerWidth")
            el = await page.query_selector("#reviews"); await el.screenshot(path=SH + f"rv-hub-{tag}.png")
            # hub sheet with picker
            await page.click("#voicesBody [data-nxwrite]"); await page.wait_for_timeout(700)
            await page.screenshot(path=SH + f"rv-hub-sheet-{tag}.png")
            out["hub picker " + tag] = await page.evaluate("document.querySelectorAll('dialog.nx-sheet [data-lab]').length")
            await page.keyboard.press("Escape"); await page.wait_for_timeout(300)
            out["sheet closed " + tag] = await page.evaluate("!document.querySelector('dialog.nx-sheet')")
            # lab home wall
            for lab in ["macro", "management", "global"]:
                await page.goto(B + f"/{lab}/#reviews"); await page.wait_for_timeout(1800)
                await page.evaluate("document.getElementById('reviews').scrollIntoView()"); await page.wait_for_timeout(1400)
                out[f"{lab} slips {tag}"] = await page.evaluate("document.querySelectorAll('#reviews .nx-slip').length")
                out[f"{lab} overflow {tag}"] = await page.evaluate("document.documentElement.scrollWidth > innerWidth")
                if lab == "management" or w == 390:
                    el = await page.query_selector("#reviews"); await el.screenshot(path=SH + f"rv-{lab}-{tag}.png")
            await page.screenshot(path=SH + f"rv-hdr-{tag}.png", clip={"x": 0, "y": 0, "width": w, "height": 80})
            await ctx.close()
        # nudge after a quiz, then sheet with stars, then post
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page()
        page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
        await page.goto(B + "/global/#quiz"); await page.wait_for_timeout(900)
        await page.click("[data-start]") if await page.query_selector("[data-start]") else None
        await page.wait_for_timeout(400)
        for k in range(40):
            o = await page.query_selector(".qzq .opt:not([disabled])")
            if not o: break
            await o.click(); await page.wait_for_timeout(60)
            nx = await page.query_selector("[data-nx]")
            if nx: await nx.click(); await page.wait_for_timeout(60)
        await page.wait_for_timeout(1800)
        out["quiz end"] = await page.evaluate("!!document.querySelector('.qzend')")
        out["nudge"] = await page.evaluate("document.querySelector('.nx-nudge') ? document.querySelector('.nx-nudge').innerText.replace(/\\n/g,' | ') : 'none'")
        await page.screenshot(path=SH + "rv-nudge.png")
        q = await page.query_selector(".nx-nudge [data-q='4']")
        if q:
            await q.click(); await page.wait_for_timeout(700)
            out["sheet stars"] = await page.evaluate("document.querySelectorAll('dialog.nx-sheet .stars button.on').length")
            await page.fill("dialog.nx-sheet textarea", "Local test from the nudge, posting through the sheet.")
            await page.click("dialog.nx-sheet [type=submit]"); await page.wait_for_timeout(1200)
            out["posted"] = await page.evaluate("document.querySelector('dialog.nx-sheet .nx-ok') ? document.querySelector('dialog.nx-sheet .nx-ok').textContent : document.querySelector('dialog.nx-sheet .msg').textContent")
            await page.screenshot(path=SH + "rv-posted.png")
            await page.click("dialog.nx-sheet [data-close]"); await page.wait_for_timeout(300)
        # header button on a lab, after review: sheet says nothing new; slot at case end
        await page.goto(B + "/global/#home"); await page.wait_for_timeout(1500)
        await page.evaluate("document.getElementById('reviews').scrollIntoView()"); await page.wait_for_timeout(1200)
        out["sgc wall after post"] = await page.evaluate("document.querySelectorAll('#reviews .nx-slip').length + ' / thx ' + !!document.querySelector('#reviews .nx-thx')")
        out["errors"] = errs
        print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
