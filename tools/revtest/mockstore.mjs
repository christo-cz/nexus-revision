export function mockStore(){
  const m = new Map(); let n = 0;
  return {
    async getWithMetadata(k){ if (!m.has(k)) return null; const v = m.get(k); return { data: JSON.parse(v.d), etag: v.e }; },
    async get(k){ return m.has(k) ? JSON.parse(m.get(k).d) : null; },
    async setJSON(k, data, o = {}){ const cur = m.get(k); if (o.onlyIfNew && cur) return { modified: false }; if (o.onlyIfMatch && (!cur || cur.e !== o.onlyIfMatch)) return { modified: false }; const e = "e" + (++n); m.set(k, { d: JSON.stringify(data), e }); return { modified: true, etag: e }; },
    _m: m
  };
}
