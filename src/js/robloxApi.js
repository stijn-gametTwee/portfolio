export async function updateRobloxStats(gameId, statsElement) {
  try {
    const res = await fetch(`https://port-delta-seven.vercel.app/api/roblox?id=${gameId}`);
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    const game = data.data[0];
    statsElement.innerHTML = `
      <span>👥 ${game.playing} spelers</span> |
      <span>🌍 ${game.visits.toLocaleString()} bezoeken</span>
    `;
  } catch (e) {
    statsElement.textContent = "⚠️ Statistieken niet beschikbaar";
  }
}
