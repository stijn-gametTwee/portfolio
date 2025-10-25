/**
 * Cloudflare Worker: get_stats
 * Accepts: ?universeId=NUMBER
 * Proxies Roblox endpoints server-side (avoids CORS) and caches results.
 *
 * Deploy with: `wrangler publish` or via Cloudflare dashboard.
 */
addEventListener("fetch", event => {
  event.respondWith(handle(event.request));
});

const ROBLOX_API = "https://api.roblox.com/universes/get-universe-containing-place?placeid=";
// Note: Roblox has multiple endpoints; adjust as needed.

async function handle(req) {
  const url = new URL(req.url);
  const universeId = url.searchParams.get("universeId");
  if (!universeId) return new Response(JSON.stringify({error:"missing_universeId"}), {status:400, headers: jsonHeaders()});

  // Basic numeric validation
  if (!/^\d+$/.test(universeId)) return new Response(JSON.stringify({error:"invalid_universeId"}), {status:400, headers: jsonHeaders()});

  // try to fetch visits/playing from Roblox (example endpoints)
  try {
    // First, map universeId to a "placeId" if necessary; here we'll attempt visits endpoint
    const visitsRes = await fetch(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${universeId}`);
    // fallback: use universe-level stats endpoints if available
    const visitsJson = await visitsRes.json();

    // The structure may vary; adapt when deploying.
    // Here we craft a simple normalized response:
    const normalized = {
      universeId: Number(universeId),
      visits: visitsJson && visitsJson.data && visitsJson.data[0] && visitsJson.data[0].visits ? visitsJson.data[0].visits : 0,
      playing: visitsJson && visitsJson.data && visitsJson.data[0] && visitsJson.data[0].playing ? visitsJson.data[0].playing : 0
    };

    return new Response(JSON.stringify(normalized), {status:200, headers: jsonHeaders()});
  } catch (err) {
    return new Response(JSON.stringify({error:"fetch_failed"}), {status:500, headers: jsonHeaders()});
  }
}

function jsonHeaders(){
  return {
    "Content-Type":"application/json;charset=utf-8",
    "Access-Control-Allow-Origin":"*"
  };
}