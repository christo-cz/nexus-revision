import asyncio, json
from playwright.async_api import async_playwright
ITEMS = [
  {"id": "a1", "lab": "flow", "stars": 5, "tags": ["Exam-like"], "text": "Test review number one here", "name": "", "at": 1761200000000},
  {"id": "b2", "lab": "mgmt", "stars": 3, "tags": ["Too easy"], "text": "Test review number two here", "name": "Bob", "at": 1761100000000},
]
def summary(items):
    out = {k: {"count": 0, "avg": None, "tags": {}} for k in ["flow", "mgmt", "sgc"]}
    for r in items:
        s = out[r["lab"]]; s["count"] += 1; s["avg"] = (s["avg"] or 0) + r["stars"]
        for t in r["tags"]: s["tags"][t] = s["tags"][t] + 1 if t in s["tags"] else 1
    for s in out.values():
        if s["count"]: s["avg"] = s["avg"] / s["count"]
    return out
async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs = []; gets = []; out = {}
        for status, label in [(404, "404 path"), (200, "200 path")]:
            ctx = await b.new_context(viewport={"width": 390, "height": 900})
            await ctx.add_init_script("try{sessionStorage.setItem('nexus-fs-inv','1');sessionStorage.setItem('nexus-rv-nudge','1');localStorage.setItem('nexus-admin-key','\"abcdefghij\"')}catch(e){}")
            stale = [dict(x) for x in ITEMS]  # server keeps serving the stale list (CDN copy)
            async def h(route, req, status=status, stale=stale):
                if req.method == "GET":
                    gets.append(req.url)
                    await route.fulfill(status=200, content_type="application/json", body=json.dumps({"labs": summary(stale), "items": stale, "tags": []}))
                else:
                    await route.fulfill(status=status, content_type="application/json", body=json.dumps({"ok": True} if status == 200 else {"error": "Review not found."}))
            await ctx.route("**/api/reviews**", h)
            page = await ctx.new_page()
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            await page.goto("http://localhost:8770/"); await page.wait_for_timeout(1500)
            before = await page.evaluate("document.querySelectorAll('#voicesBody [data-nxdel]').length")
            d = page.locator("#voicesBody [data-nxdel='a1']")
            await d.scroll_into_view_if_needed(); await d.click(); await page.wait_for_timeout(100); await d.click(); await page.wait_for_timeout(800)
            after = await page.evaluate("[...document.querySelectorAll('#voicesBody [data-nxdel]')].map(x => x.dataset.nxdel)")
            cnt = await page.evaluate("(document.querySelector('#voicesBody .nx-cnt')||{}).textContent")
            out[label] = {"before": before, "after": after, "count text": cnt}
            await ctx.close()
        out["gets"] = gets; out["errors"] = errs
        print(json.dumps(out, indent=1)); await b.close()
asyncio.run(run())
