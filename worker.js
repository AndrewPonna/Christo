export default {
  async fetch(request, env) {

    if (request.method === "POST") {
      const body = await request.json();

      const id = crypto.randomUUID();

      await env.MESSAGES.put(id, JSON.stringify({
        ...body,
        approved: false
      }));

      return new Response("OK");
    }

    if (request.method === "GET") {
      const list = await env.MESSAGES.list();

      const results = [];

      for (const key of list.keys) {
        const item = await env.MESSAGES.get(key.name, "json");
        if (item.approved) results.push(item);
      }

      return Response.json(results);
    }

    return new Response("Not allowed", { status: 405 });
  }
};