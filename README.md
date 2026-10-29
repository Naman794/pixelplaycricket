# Pixel Play Cricket

Standalone pixel-art street cricket. Plain HTML, CSS and JavaScript. No framework, external SDK, analytics, remote assets or platform account is required to play.

## Mobile game

Run `npm run build` with Node 24+. The resulting `dist/` directory is the web-assets folder for a Capacitor or other WebView wrapper. It contains the game, art and all rule modules. Serve these assets through the wrapper's local HTTP origin; ES modules should not be opened using a raw `file://` URL.

The default `config.js` enables offline play. Score attack, 12 chase stages, stars, personal bests and the device leaderboard work locally. Progress belongs to the current browser/WebView storage. A native project, app icon, signing and store submission must be configured in your chosen wrapper; no APK or IPA is included.

## Optional shared leaderboard

Run `npm start`, then open `http://localhost:3000`. This uses the same game with a separate Node/SQLite backend and shared top 20. No package installation is required. The server supplies its own same-origin configuration. The database is created and migrated automatically under `data/`, or at `DATABASE_PATH`. Set `PORT` if needed. For production, use HTTPS and set `PUBLIC_ORIGIN` to the public HTTPS origin behind your reverse proxy. The identity cookie is Secure on HTTPS; local HTTP development uses a local cookie.

This server expects same-origin requests. A remote API for a native app needs separate CORS, credential and identity configuration; merely changing the API URL is insufficient.

## Source layout

- `index.html`, `src/game.js`, `src/styles.css`: interface, animation and gameplay.
- `assets/`: bundled street, player and celebration artwork.
- `lib/`: shared scoring and chase rules.
- `server/`: optional portable API, SQLite adapter and SQL migrations.
- `tests/`: rules, gameplay and backend checks.

Run `npm test` to verify rules, gameplay and backend validation. The existing game's scoring windows and chase ladder are preserved. The shared leaderboard recalculates server-recorded delivery receipts but is not competition-grade anti-cheat. Offline scores are local and unverified.

## Multiplayer development

See [MULTIPLAYER.md](MULTIPLAYER.md) for the proposed head-to-head modes, gameplay/UI changes, networking architecture, fairness safeguards and staged implementation plan. Multiplayer is planned; it is not implemented yet.
