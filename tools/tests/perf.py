import asyncio, json
from playwright.async_api import async_playwright
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); out = {}
        for url in ["/", "/macro/#home", "/management/#home", "/global/#home", "/global/#studio"]:
            ctx = await b.new_context(viewport={"width":390,"height":844}, is_mobile=True, has_touch=True)
            await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1');sessionStorage.setItem('nexus-rv-nudge','1')}catch(e){}")
            pg = await ctx.new_page(); cdp = await ctx.new_cdp_session(pg)
            await cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
            await pg.goto("http://localhost:8770"+url); await pg.wait_for_timeout(2500)
            r = await pg.evaluate("""() => new Promise(res => { const t=[]; let last=performance.now(), y=0; let lt=0;
              try{ new PerformanceObserver(l=>l.getEntries().forEach(e=>{ if(e.duration>50) lt++; })).observe({type:'longtask',buffered:false}); }catch(e){}
              function f(now){ t.push(now-last); last=now; y+=12; scrollTo(0,y); if(t.length<180) requestAnimationFrame(f); else { t.sort((a,b)=>a-b); res({median:t[90].toFixed(1), p95:t[171].toFixed(1), longtasks:lt}); } }
              requestAnimationFrame(f); })""")
            out[url] = r; await ctx.close()
        print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
