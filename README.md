# Stijn — Portfolio Template

hey


## Changes made by assistant (projects JSON + static hosting on GitHub Pages)

### What I changed
- `data/projects.json` updated: `placeId` -> `universeId`; `image` -> `images` (array). This lets you include multiple images per project.
- `js/main.js` rewritten to:
  - Use **DOM methods** (no `innerHTML` from external content).
  - Sanitize and validate JSON entries.
  - Support slideshows for multiple images.
  - Attempt to fetch stats from `/api/get_stats?universeId=...` (serverless endpoint) — **note:** GitHub Pages can't run PHP.
- Added `workers/get_stats_worker.js` — example **Cloudflare Worker** you can deploy as a serverless proxy to fetch Roblox stats (avoids CORS and runs securely).
- Added guidance below for deployment and security.

### GitHub Pages note — PHP won't run
GitHub Pages is static and doesn't run PHP (`php/api/get_stats.php` will not work there). Options:
1. Deploy the included Cloudflare Worker (`workers/get_stats_worker.js`) and point frontend requests to the worker URL `/api/get_stats`.
2. Use any serverless function (Vercel, Netlify Functions, AWS Lambda, etc.) to proxy Roblox API calls and return JSON with CORS headers.
3. If you don't want a server, remove `universeId` fields and the frontend will skip attempting to load stats.

### Security improvements included
- Avoided `innerHTML` for rendering to prevent XSS from malformed JSON.
- `rel="noopener noreferrer"` and `target="_blank"` for external links.
- Input validation and sanitization for project fields.
- Example serverless worker returns CORS headers and validates `universeId`.

### How to add a new project
Edit `data/projects.json` — each project is an object like:
```json
{
  "name": "My Roblox Game",
  "short": "Short summary",
  "long": "Longer description",
  "tech": "Luau, Roblox Studio",
  "images": ["assets/images/project1-1.png", "assets/images/project1-2.png"],
  "demo": "https://www.roblox.com/games/123456/...",
  "repo": "https://github.com/you/repo",
  "type": "roblox",
  "universeId": "123456"
}
```
For Roblox projects, **set `universeId`**. The frontend will call `/api/get_stats?universeId=...` if available.




## Added: Social links & final polish

- `data/socials.json` — add your social links there. Each entry:
  {
    "name": "GitHub",
    "url": "https://github.com/yourname",
    "icon": "assets/icons/git.svg"
  }

- Header now uses centered layout similar to the old site; socials show in header and footer.
- Rephrased text in pages to keep the same feel but retyped.
- Keep the accent color the same as the original.

Deploy notes:
- Push the repository contents to GitHub Pages.
- PHP won't run on GitHub Pages; use the provided `workers/get_stats_worker.js` or deploy a serverless function for Roblox stats.


# Theme
Restored original dark mode colors and gradients from your repository; improved structure and light-mode toggle added.
