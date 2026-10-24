import os
import asyncio, json
from playwright.async_api import async_playwright
SH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
# the pencil: drag, chips, arrows, click on the front face; the wheel turns it one face per notch and hands the scroll back
# to the page on the first face going up and on the last face going down; on a phone a vertical swipe turns it the same way
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        ctx = await b.new_context(viewport={"width": 1440, "height": 900})
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page(); page.on("pageerror", lambda e: errs.append(str(e)))
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(5200)
        act = "document.querySelector('.pen-chips [aria-pressed=true]').textContent"
        out["faces"] = await page.evaluate("[...document.querySelectorAll('.pen-chips button')].map(b => b.textContent)")
        out["rest"] = await page.evaluate(act)
        await page.screenshot(path=SH + "pen-rest.png")
        st = await page.query_selector(".pen-stage"); bb = await st.bounding_box()
        cx, cy = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2
        # wheel: up on the first face scrolls the page (the page is at the top, so nothing moves and the face stays)
        await page.mouse.move(cx, cy)
        seq = []
        for k in range(5):
            await page.mouse.wheel(0, 100); await page.wait_for_timeout(350)
            seq.append(await page.evaluate(act))
        out["wheel down x5"] = seq
        y0 = await page.evaluate("scrollY")
        out["page scrolled while turning"] = y0
        await page.mouse.wheel(0, 100); await page.wait_for_timeout(500)
        y1 = await page.evaluate("scrollY")
        out["last face + wheel down goes round to the first, page still"] = {"face": await page.evaluate(act), "scrollY": y1}
        out["soon card"] = await page.evaluate("(() => { document.querySelector('.pen-chips [data-go=\"5\"]').click(); return null; })()")
        await page.wait_for_timeout(1400)
        out["soon card"] = await page.evaluate("document.querySelector('.pen-card h2').textContent + ' | links ' + document.querySelectorAll('.pen-card a').length + ' | ' + (document.querySelector('.pen-card .pst') || {}).textContent")
        await page.click(".pen-chips [data-go='0']"); await page.wait_for_timeout(1400)
        await page.evaluate("scrollTo(0, 0)"); await page.wait_for_timeout(400)
        bb = await st.bounding_box(); cx, cy = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2; await page.mouse.move(cx, cy)
        back = []
        for k in range(5):
            await page.mouse.wheel(0, -100); await page.wait_for_timeout(350)
            back.append(await page.evaluate(act))
        out["wheel up x5"] = back
        await page.mouse.wheel(0, -100); await page.wait_for_timeout(400)
        out["first face + wheel up goes round to the last"] = {"face": await page.evaluate(act), "scrollY": await page.evaluate("scrollY")}
        await page.click(".pen-chips [data-go='0']"); await page.wait_for_timeout(1400)
        # drag with the mouse, chips, arrows, click on the front face
        await page.mouse.move(cx, cy); await page.mouse.down()
        for k in range(10): await page.mouse.move(cx, cy - 12 * (k + 1)); await page.wait_for_timeout(16)
        await page.mouse.up(); await page.wait_for_timeout(1800)
        out["after drag up 120px"] = await page.evaluate(act)
        await page.click(".pen-chips [data-go='3']"); await page.wait_for_timeout(1500)
        out["chip 4"] = await page.evaluate(act + " + ' | ' + document.querySelector('.pen-card h2').textContent + ' | ' + document.querySelector('.pen-card a').getAttribute('href')")
        await page.screenshot(path=SH + "pen-wall.png")
        await page.click("[data-next]"); await page.wait_for_timeout(1400)
        out["next"] = await page.evaluate(act)
        await page.click("[data-next]"); await page.wait_for_timeout(1400)
        out["next 2"] = await page.evaluate(act + " + ' | links ' + document.querySelectorAll('.pen-card a').length")
        await page.click(".pen-chips [data-go='2']"); await page.wait_for_timeout(1500)
        await page.mouse.click(cx, cy); await page.wait_for_timeout(1500)
        out["click front"] = page.url
        await ctx.close()
        # phone: a vertical swipe on the pencil turns it; past the last face the swipe scrolls the page
        ctx = await b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
        await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1')}catch(e){}")
        page = await ctx.new_page(); page.on("pageerror", lambda e: errs.append("m " + str(e)))
        await page.goto("http://localhost:8770/"); await page.wait_for_timeout(5200)
        st = await page.query_selector(".pen-stage"); bb = await st.bounding_box()
        x, y = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2
        cdp = await ctx.new_cdp_session(page)
        async def swipe(dy, steps=12):
            await cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x, "y": y}]})
            for k in range(1, steps + 1):
                await cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x, "y": y + dy * k / steps}]}); await page.wait_for_timeout(16)
            await cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []}); await page.wait_for_timeout(900)
        m = []
        for k in range(3):
            await swipe(-40); m.append(await page.evaluate(act))
        out["phone swipe up x3"] = m
        for k in range(6): await swipe(-60)
        out["phone after many swipes up"] = {"face": await page.evaluate(act), "scrollY": await page.evaluate("scrollY")}
        out["overflow 390"] = await page.evaluate("document.documentElement.scrollWidth - innerWidth")
        await ctx.close()
        out["errors"] = errs; print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
