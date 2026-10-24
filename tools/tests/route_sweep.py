import asyncio, json
from playwright.async_api import async_playwright
R = {
 "/": [""],
 "/macro/": ["#home","#learn","#learn-thought","#learn-activity","#learn-determinants","#learn-growth","#cases","#case1","#case5","#drills","#spot","#quiz","#quiz-growth","#cards","#cards-activity","#open","#open-o1","#mock","#recap","#td","#td-all"],
 "/management/": ["#home","#learn","#learn-org","#learn-person","#learn-decide","#learn-motiv","#cases","#spot","#labs","#lab-kelley","#lab-equity","#lab-bigfive","#lab-who","#quiz","#cards","#open","#exam","#recap"],
 "/global/": ["#home","#learn","#learn-systems","#learn-sd","#learn-ecology","#learn-bounds","#learn-social","#learn-economy","#learn-method","#studio","#studio-free","#studio-drills","#sort","#figures","#quiz","#cards","#open","#exam","#recap"],
 "/404.html": [""],
}
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); bad = {}; n = 0
        for theme in ["dark","light"]:
            for w,mob in [(1440,False),(390,True)]:
                ctx = await b.new_context(viewport={"width":w,"height":860}, has_touch=mob, is_mobile=mob)
                await ctx.add_init_script(f"try{{sessionStorage.setItem('nexus-fs-inv','1');sessionStorage.setItem('nexus-rv-nudge','1');localStorage.setItem('nexus-theme','{theme}')}}catch(e){{}}")
                pg = await ctx.new_page(); errs=[]
                pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
                pg.on("console", lambda m: errs.append(m.text) if m.type=="error" and "TUNNEL" not in m.text and "fonts.g" not in m.text else None)
                for base, hs in R.items():
                    for h in hs:
                        errs.clear()
                        await pg.goto("http://localhost:8770"+base+h); await pg.wait_for_timeout(700)
                        await pg.evaluate("window.scrollTo(0, document.body.scrollHeight/2)"); await pg.wait_for_timeout(250)
                        ov = await pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                        empty = await pg.evaluate("(document.querySelector('main')||document.body).innerText.trim().length < 80")
                        n += 1
                        if errs or ov > 0 or empty: bad[f"{theme}-{w} {base}{h}"] = {"errs": errs[:3], "overflow": ov, "empty": empty}
                await ctx.close()
        print("pages checked:", n); print(json.dumps(bad, indent=1)); await b.close()
asyncio.run(run())
