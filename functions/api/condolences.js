/**
 * Cloudflare Pages Function: /api/condolences
 *
 * Bindings required (set in Cloudflare Pages → Settings → Functions → Bindings):
 *   KV namespace binding:   CONDOLENCES_KV  → create a KV namespace called "condolences"
 *   Environment variable:   ADMIN_PASSWORD  → your chosen secret password (add as secret)
 *
 * Endpoints:
 *   GET  /api/condolences              — list approved condolences (public)
 *   GET  /api/condolences?admin=true   — list ALL including pending (admin, requires password header)
 *   POST /api/condolences              — submit new condolence (public, stored as pending)
 *   PATCH  /api/condolences?id=X       — approve a condolence (admin)
 *   DELETE /api/condolences?id=X       — delete a condolence (admin)
 *
 * Admin requests must include header: X-Admin-Password: <your password>
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function clean(str, max = 10000) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, max);
}

function isAdmin(request, env) {
  return request.headers.get('X-Admin-Password') === env.ADMIN_PASSWORD;
}

async function getAllEntries(env) {
  const keys = await env.CONDOLENCES_KV.list({ prefix: 'condolence:' });
  const results = [];
  for (const key of keys.keys) {
    const raw = await env.CONDOLENCES_KV.get(key.name);
    if (!raw) continue;
    try { results.push(JSON.parse(raw)); } catch {}
  }
  return results.sort((a, b) => b.timestamp - a.timestamp);
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id  = url.searchParams.get('id');
  const adminMode = url.searchParams.get('admin') === 'true';

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS });
  }

  // ── GET ──────────────────────────────────────────────────
  if (request.method === 'GET') {
    if (adminMode) {
      if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
      return json({ condolences: await getAllEntries(env) });
    }
    const all = await getAllEntries(env);
    return json({ condolences: all.filter(c => c.approved) });
  }

  // ── POST ─────────────────────────────────────────────────
  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

    const name     = clean(body.name, 100);
    const relation = clean(body.relation, 100);
    const message  = clean(body.message, 10000);

    if (!name || !message) return json({ error: 'Name and message are required.' }, 400);

    const spam = ['viagra', 'casino', 'bitcoin', 'buy now', 'click here'];
    if (spam.some(w => message.toLowerCase().includes(w))) {
      return json({ error: 'Your message could not be submitted.' }, 400);
    }

    const entry = {
      id: genId(),
      name, relation, message,
      timestamp: Date.now(),
      approved: false,
    };
    await env.CONDOLENCES_KV.put(`condolence:${entry.id}`, JSON.stringify(entry));
    return json({ success: true, message: 'Received — your message is awaiting review.' });
  }

  // ── PATCH (approve) ──────────────────────────────────────
  if (request.method === 'PATCH') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
    if (!id) return json({ error: 'Missing id' }, 400);
    const raw = await env.CONDOLENCES_KV.get(`condolence:${id}`);
    if (!raw) return json({ error: 'Not found' }, 404);
    const entry = JSON.parse(raw);
    entry.approved = true;
    await env.CONDOLENCES_KV.put(`condolence:${id}`, JSON.stringify(entry));
    return json({ success: true });
  }

  // ── DELETE ───────────────────────────────────────────────
  if (request.method === 'DELETE') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401);
    if (!id) return json({ error: 'Missing id' }, 400);
    await env.CONDOLENCES_KV.delete(`condolence:${id}`);
    return json({ success: true });
  }

  return json({ error: 'Method not allowed' }, 405);
}
