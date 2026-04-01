/**
 * /functions/api/condolences/[id].js
 * Handles DELETE for a specific condolence entry
 * Requires Authorization: Bearer {ADMIN_PASSWORD} header
 */

export async function onRequestDelete({ params, request, env }) {
  // ── Auth check ──────────────────────────────────────
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const adminPassword = env.ADMIN_PASSWORD;

  if (!adminPassword || token !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...cors() }
    });
  }

  const { id } = params;

  try {
    // Scan KV for the key that ends with this id
    const list = await env.CONDOLENCES_KV.list({ prefix: 'condolence:' });
    let keyToDelete = null;

    for (const key of list.keys) {
      if (key.name.endsWith(`:${id}`)) {
        keyToDelete = key.name;
        break;
      }
    }

    if (!keyToDelete) {
      return new Response(JSON.stringify({ error: 'Entry not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...cors() }
      });
    }

    await env.CONDOLENCES_KV.delete(keyToDelete);

    return new Response(null, {
      status: 204,
      headers: cors()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors() }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: cors() });
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}
