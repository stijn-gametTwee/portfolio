export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing universeId" });
  }

  try {
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${id}`);
    if (!response.ok) throw new Error("Roblox API request failed");

    const data = await response.json();

    // ✅ Sta alle domeinen toe (voor GitHub Pages)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Roblox proxy error:", error);
    res.status(500).json({ error: "Failed to fetch Roblox data" });
  }
}
