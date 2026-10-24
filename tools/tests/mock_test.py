import asyncio, json, sys
from playwright.async_api import async_playwright
U = "http://localhost:8770/macro/"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}; errs = []
        for theme in ["dark", "light"]:
            for vw, vh, tag in [(1440, 900, "d"), (390, 844, "m")]:
                ctx = await b.new_context(viewport={"width": vw, "height": vh})
                await ctx.add_init_script(f"try{{localStorage.setItem('nexus-theme','{theme}');sessionStorage.setItem('nexus-fs-inv','1')}}catch(e){{}}")
                page = await ctx.new_page()
                page.on("console", lambda m: errs.append(m.text) if m.type == "error" and "TUNNEL" not in m.text else None)
                page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)))
                k = f"{tag}-{theme}"
                await page.goto(U + "#home"); await page.wait_for_timeout(500)
                out[k + " banner on home"] = await page.evaluate("!!document.querySelector('.mods + .mkbanner')")
                await page.goto(U + "#mock"); await page.wait_for_timeout(700)
                if tag == "d" or theme == "dark": await page.screenshot(path=f"shots/mock-ready-{k}.png", full_page=True)
                out[k + " ready"] = await page.evaluate("[...document.querySelectorAll('.exlist li')].length + ' items; len ' + document.querySelector('.mklen [aria-pressed=true] b').textContent")
                await page.click("[data-len='60']"); await page.wait_for_timeout(200)
                out[k + " 60"] = await page.evaluate("[...document.querySelectorAll('.exlist li')].length + ' items; ' + document.querySelector('[data-start]').textContent")
                await page.click("[data-start]"); await page.wait_for_timeout(400)
                st = await page.evaluate("JSON.parse(localStorage.getItem('flow-v1')).mock")
                # answer: first num right, second wrong, rest blank; mcqs: right for first, wrong for second
                nums = 0; mcqs = 0
                for i, x in enumerate(st["ex"]):
                    for j, pp in enumerate(x["parts"]):
                        key = f"{i}-{j}"
                        if pp["kind"] == "num":
                            val = pp["ans"] if nums == 0 else pp["ans"] * 3 + 7
                            if nums < 2: await page.fill(f"[data-mnum='{key}']", f"{val:.4f}")
                            nums += 1
                        if pp["kind"] == "mcq":
                            j2 = pp["right"] if mcqs == 0 else (pp["right"] + 1) % len(pp["opts"])
                            await page.click(f"[data-mpick='{key}'][data-j='{j2}']"); mcqs += 1
                        if pp["kind"] == "explain":
                            await page.fill(f"textarea[data-ans='b{key}']", "Because the multiplier works through successive rounds of spending.")
                tas = await page.query_selector_all("textarea[data-ans^='o']")
                for t in tas: await t.fill("Classical economists think markets self-regulate; Keynes argues demand can be insufficient.")
                await page.wait_for_timeout(500)
                if tag == "m" and theme == "dark": await page.screenshot(path=f"shots/mock-write-{k}.png")
                out[k + " clock"] = await page.evaluate("document.querySelector('[data-clock]').textContent")
                # reload mid-exam: answers persist
                await page.reload(); await page.wait_for_timeout(700)
                out[k + " persist"] = await page.evaluate("[...document.querySelectorAll('[data-mnum]')].filter(i => i.value).length + ' nums, ' + document.querySelectorAll('.opt.sel').length + ' picks, ' + [...document.querySelectorAll('textarea')].filter(t => t.value).length + ' texts'")
                await page.click("[data-finish]"); await page.wait_for_timeout(100); await page.click("[data-finish]"); await page.wait_for_timeout(700)
                out[k + " marked"] = await page.evaluate("document.querySelector('.exbar').innerText.replace(/\\n/g,' ') + ' | ok cards ' + document.querySelectorAll('.tdpart.ok').length + ' bad ' + document.querySelectorAll('.tdpart.bad').length")
                cbs = await page.query_selector_all("[data-xt]")
                for c in cbs[:3]: await c.check()
                await page.wait_for_timeout(200)
                out[k + " after ticks"] = await page.evaluate("document.querySelector('.mkscore').innerText.replace(/\\n/g,' ')")
                out[k + " hist"] = await page.evaluate("JSON.stringify(JSON.parse(localStorage.getItem('flow-v1')).mockHist.slice(-1))")
                ov = await page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
                out[k + " overflow"] = ov
                await page.screenshot(path=f"shots/mock-mark-{k}.png", full_page=(tag == "d"))
                await page.click("[data-new]"); await page.wait_for_timeout(500)
                out[k + " new"] = await page.evaluate("document.querySelector('[data-start]') ? 'ready again' : 'no'")
                out[k + " hist list"] = await page.evaluate("document.querySelector('.mkhist') ? document.querySelector('.mkhist').innerText.replace(/\\n/g,' ') : 'none'")
                await page.goto(U + "#open"); await page.wait_for_timeout(500)
                out[k + " open banner"] = await page.evaluate("!!document.querySelector('.mkbanner')")
                await ctx.close()
        await b.close(); out["errors"] = errs; print(json.dumps(out, indent=1))
asyncio.run(run())
