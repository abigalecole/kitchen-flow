// Kitchen Flow link helper — a Cloudflare Worker.
// It opens a recipe page for the app and returns the recipe details the site
// publishes for search engines (schema.org "Recipe" data).

// Your app's address: https:// plus your GitHub username .github.io
// No trailing slash and no /kitchen-flow on the end.
const ALLOWED = ["https://YOUR-USERNAME.github.io"];

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") || "";
    const ok = ALLOWED.includes(origin);
    const cors = {
      "Access-Control-Allow-Origin": ok ? origin : ALLOWED[0],
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Vary": "Origin",
    };
    const reply = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (!ok) return reply({ error: "forbidden" }, 403);

    let target;
    try { target = new URL(new URL(request.url).searchParams.get("url") || ""); } catch { return reply({ error: "bad_url" }, 400); }
    if (!/^https?:$/.test(target.protocol)) return reply({ error: "bad_url" }, 400);

    let res;
    try {
      res = await fetch(target.toString(), {
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
        cf: { cacheTtl: 3600 },
      });
    } catch { return reply({ error: "fetch_failed" }, 502); }
    if (!res.ok) return reply({ error: "fetch_failed", status: res.status }, 502);

    const html = (await res.text()).slice(0, 4000000);
    return reply({ url: res.url, recipe: findRecipe(html) });
  },
};

function findRecipe(html) {
  const blocks = html.matchAll(/<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of blocks) {
    let data;
    try { data = JSON.parse(m[1].trim()); } catch { continue; }
    const hit = walk(data);
    if (hit) return hit;
  }
  return null;
}

function walk(node) {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (const n of node) { const hit = walk(n); if (hit) return hit; }
    return null;
  }
  const type = [].concat(node["@type"] || []);
  if (type.some(t => String(t).toLowerCase() === "recipe")) return node;
  for (const key of ["@graph", "mainEntity", "mainEntityOfPage", "itemListElement"]) {
    const hit = walk(node[key]);
    if (hit) return hit;
  }
  return null;
}
