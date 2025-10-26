async function updateRobloxStats(gameId, statsElement) {
  try {
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${gameId}`);
    if (!res.ok) throw new Error("API unreachable");

    const data = await res.json();
    if (!data.data || data.data.length === 0) throw new Error("No data");

    const game = data.data[0];
    const visits = game.visits?.toLocaleString() ?? "N/A";
    const players = game.playing ?? "0";

    statsElement.innerHTML = `
      <span>👥 Spelers: <b>${players}</b></span>
      <span>🌍 Bezoeken: <b>${visits}</b></span>
    `;
  } catch (e) {
    console.warn(`⚠️ Kon stats niet laden voor universeId ${gameId}`, e);
    statsElement.innerHTML = '<span>⚠️ Statistieken niet beschikbaar</span>';
  }
}