// Student reviews for the Nexus labs.
// GET  /api/reviews[?lab=flow]   -> summary per lab + latest reviews
// POST /api/reviews              -> { lab, stars, tags, text, name, did, website }  (website is a honeypot)
// POST /api/reviews              -> { action: "delete", id, key }  (key = ADMIN_KEY set in Netlify)
// Storage: Netlify Blobs, store "reviews". One document holds every review; one small key per sender and lab enforces the 24 h limit.
import { getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

export const LABS = ["flow"];
export const TAGS = ["Exam-like", "Clear corrections", "Good on phone", "Saves time", "Too easy", "Too hard", "Found a mistake"];
const DAY = 24 * 3600 * 1000, MAX_KEEP = 1000, LIST = 60;

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra } });
const hash = (s, salt) => createHash("sha256").update(salt + "|" + s).digest("hex").slice(0, 20);
const clean = s => String(s ?? "").normalize("NFC").replace(/[\u0000-\u0009\u000B-\u001F\u007F​-‏‪-‮]/g, "").replace(/\n{3,}/g, "\n\n").trim();

function summary(items){
  const out = {};
  for (const lab of LABS) out[lab] = { count: 0, avg: null, tags: {} };
  for (const r of items){ const s = out[r.lab]; if (!s) continue; s.count++; s.avg = (s.avg || 0) + r.stars; for (const t of r.tags) s.tags[t] = (s.tags[t] || 0) + 1; }
  for (const lab of LABS){ const s = out[lab]; if (s.count) s.avg = Math.round(s.avg / s.count * 10) / 10; }
  return out;
}
const pub = r => ({ id: r.id, lab: r.lab, stars: r.stars, tags: r.tags, text: r.text, name: r.name, at: r.at });

async function load(store){
  const res = await store.getWithMetadata("all", { type: "json" });
  return { items: (res && res.data && res.data.items) || [], etag: res ? res.etag : null };
}
async function save(store, mutate){
  for (let attempt = 0; attempt < 4; attempt++){
    const { items, etag } = await load(store);
    const next = mutate(items.slice());
    const w = await store.setJSON("all", { items: next }, etag ? { onlyIfMatch: etag } : { onlyIfNew: true });
    if (w.modified) return next;
  }
  throw new Error("busy");
}

export async function handle(req, { store, ip = "", env = {}, now = Date.now() }){
  const url = new URL(req.url);
  if (req.method === "GET"){
    const lab = url.searchParams.get("lab");
    const { items } = await load(store);
    const list = items.filter(r => !lab || r.lab === lab).sort((a, b) => b.at - a.at).slice(0, LIST).map(pub);
    return json(200, { labs: summary(items), items: list, tags: TAGS }, { "cache-control": "public, max-age=0, must-revalidate", "netlify-cdn-cache-control": "public, s-maxage=20, stale-while-revalidate=120" });
  }
  if (req.method !== "POST") return json(405, { error: "Method not allowed." });
  let b; try { b = await req.json(); } catch (e) { return json(400, { error: "Invalid request." }); }
  if (!b || typeof b !== "object") return json(400, { error: "Invalid request." });

  if (b.action === "delete"){
    const key = String(env.ADMIN_KEY || ""), given = String(b.key || "");
    const ok = key.length >= 8 && given.length === key.length && timingSafeEqual(Buffer.from(given), Buffer.from(key));
    if (!ok) return json(403, { error: "Wrong admin key." });
    let found = false;
    await save(store, items => items.filter(r => (r.id === b.id ? (found = true, false) : true)));
    return json(found ? 200 : 404, found ? { ok: true } : { error: "Review not found." });
  }

  if (b.website) return json(201, { item: null });                       // honeypot: pretend it worked
  const lab = String(b.lab || "");
  if (!LABS.includes(lab)) return json(400, { error: "Unknown course." });
  const stars = Number(b.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return json(400, { error: "Pick a number of stars." });
  const tags = Array.isArray(b.tags) ? [...new Set(b.tags.filter(t => TAGS.includes(t)))].slice(0, 4) : [];
  const text = clean(b.text).slice(0, 600);
  if (text.length < 10) return json(400, { error: "Write at least a short sentence (10 characters)." });
  if (/https?:\/\/|www\.|\.(com|net|org|ru|xyz)\b/i.test(text)) return json(400, { error: "Links are not allowed in reviews." });
  const name = clean(b.name).replace(/\s+/g, " ").slice(0, 32);

  const salt = String(env.REVIEW_SALT || env.ADMIN_KEY || "nexus-reviews");
  const keys = [ip && "rl-" + lab + "-ip-" + hash(ip, salt), b.did && "rl-" + lab + "-d-" + hash(String(b.did).slice(0, 64), salt)].filter(Boolean);
  for (const k of keys){
    const last = await store.get(k, { type: "json" });
    if (last && now - last.at < DAY) return json(429, { error: "You already reviewed this course today. Thanks! You can post again tomorrow." });
  }
  const item = { id: now.toString(36) + "-" + Math.random().toString(36).slice(2, 8), lab, stars, tags, text, name, at: now };
  try { await save(store, items => [item, ...items].slice(0, MAX_KEEP)); }
  catch (e) { return json(503, { error: "The server is busy. Try again in a moment." }); }
  await Promise.all(keys.map(k => store.setJSON(k, { at: now })));
  return json(201, { item: pub(item) });
}

export default async (req, context) => handle(req, {
  store: getStore({ name: "reviews", consistency: "strong" }),
  ip: (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || "",
  env: { ADMIN_KEY: process.env.ADMIN_KEY, REVIEW_SALT: process.env.REVIEW_SALT }
});

export const config = { path: "/api/reviews" };
