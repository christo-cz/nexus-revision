import os
import asyncio, json
from playwright.async_api import async_playwright
SH=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "_shots") + "/"
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out={}; errs=[]
        for theme in ["dark","light"]:
            for w,mob in [(1440,False),(390,True)]:
                ctx = await b.new_context(viewport={"width":w,"height":900}, has_touch=mob, is_mobile=mob)
                await ctx.add_init_script(f"try{{sessionStorage.setItem('nexus-fs-inv','1');localStorage.setItem('nexus-theme','{theme}')}}catch(e){{}}")
                pg = await ctx.new_page(); pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.goto("http://localhost:8770/"); await pg.wait_for_timeout(2500)
                await pg.click(".pen-chips [data-go='3']"); await pg.wait_for_timeout(1500)
                card = pg.locator(".pen-card")
                await card.scroll_into_view_if_needed()
                cols = await pg.evaluate("[...document.querySelectorAll('.pen-card .go a')].map(a=>a.textContent+':'+getComputedStyle(a).backgroundColor)")
                out[f"{theme}-{w} rest"]=cols
                if not mob:
                    for i in range(3):
                        await pg.hover(f".pen-card .go a >> nth={i}"); await pg.wait_for_timeout(300)
                        out[f"{theme}-{w} hover{i}"]=await pg.evaluate(f"(a=>a.textContent+':'+getComputedStyle(a).backgroundColor+' / '+getComputedStyle(a).color)(document.querySelectorAll('.pen-card .go a')[{i}])")
                        if i==1: await card.screenshot(path=SH+f"mockface-{theme}-{w}-hover.png")
                else:
                    await card.screenshot(path=SH+f"mockface-{theme}-{w}.png")
                await ctx.close()
        out["errors"]=errs; print(json.dumps(out,indent=1)); await b.close()
asyncio.run(run())
