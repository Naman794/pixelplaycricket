# Pixel Powerplay — Street Nets

A portrait street-cricket browser game with score attack and a 12-stage chase ladder (Rookie, Club, Hard, Expert and a Perfect Nine final). Twelve balls, three wickets. Sixes use ±42 ms, fours ±110 ms and blocked contact ±210 ms. Browser and server share `lib/cricket.mjs`; input uses event timestamps on a pause-adjusted monotonic clock. Bowler release is beside the far stumps and blocked contact uses a defensive bat pose.

Celebrations are optional assets and can be skipped. The field scales without cropping. Chase progression and personal bests are browser-local; ranked score attack uses D1. The server issues one delivery at a time and records ordered, one-use timing receipts. Final scores are recalculated from server-stored receipts. Start rate limits cover browser cookies and hashed connecting IP when provided. These are casual-game integrity checks, not competition-grade anti-cheat.

Edit `game.html`; `scripts/sync-game.mjs` generates `game-content.ts` and publishes the shared browser rules module. Artwork lives under `public/assets`, backend routes under `app/api`, and schema/migrations under `db` and `drizzle`.

`npm test` checks shared rules, frontend state transitions and actual API routes against SQLite. Build with the Sites build helper. See `docs/QA.md` for evidence and remaining physical-device checks. Preserve migrations and public hosting access on future changes.

Chase stages progressively increase targets, speed up deliveries, shorten innings and reduce wickets. Completed stages earn 1–3 stars and can be replayed through the unlocked-stage picker. Progress is saved on the current browser. Old 48-cap saves with a best score of 48 or more unlock Hard on migration. Targets never exceed six runs per available ball.
