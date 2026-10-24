import http from "node:http"; import { readFile } from "node:fs/promises"; import path from "node:path"; import { fileURLToPath } from "node:url";
import { handle } from "./reviews.mjs"; import { mockStore } from "./mockstore.mjs";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".."), store = mockStore(), env = { ADMIN_KEY: "local-admin-key" };
const TYPES = { ".html": "text/html; charset=utf-8", ".svg": "image/svg+xml", ".js": "text/javascript", ".css": "text/css" };
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/api/reviews"){
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await handle(new Request("http://x" + req.url, { method: req.method, headers: req.headers, body: req.method === "POST" ? Buffer.concat(chunks) : undefined }), { store, ip: req.headers["x-test-ip"] || "127.0.0.1", env });
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(await r.text()); return;
  }
  let p = u.pathname.endsWith("/") ? u.pathname + "index.html" : u.pathname;
  try { const b = await readFile(path.join(ROOT, p)); res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" }); res.end(b); }
  catch (e) { res.writeHead(404); res.end("nf"); }
}).listen(8770, () => console.log("up"));
