# Multiplayer roadmap — Pixel Play Cricket

**Status: roadmap with an implemented casual prototype on the multiplayer testing branch. See [MULTIPLAYER_TESTING.md](MULTIPLAYER_TESTING.md). The prototype uses Bat vs Bowl, two overs and three wickets per innings; the Batting Duel below remains an alternative mode proposal.**

The goal is to make the game something friends challenge each other to play again. A shared leaderboard alone is not multiplayer. The first release should deliver a reliable head-to-head contest before adding leagues, chat or large tournaments.

## 1. Recommended release order

| Release | Experience | Why this order |
| --- | --- | --- |
| First: Batting Duel | Two friends bat against the same six deliveries, see each other's score, then rematch. | Reuses the working batting mechanic and tests whether competition improves replay. |
| Second: Bat vs Bowl | One player chooses deliveries while the other bats; roles swap for a chase. | Adds tactics and direct interaction, but needs a new bowling interface and more balancing. |
| Later: ranked play | Matchmaking, ratings and seasonal results after fairness and connection tests pass. | Competitive rankings need stronger identity and input validation than the current casual leaderboard. |

Keep offline Score Attack and Target Chase available. Multiplayer must not become a requirement for starting the game.

## 2. First playable multiplayer: Batting Duel

### Match rules

- Two players, six legal balls each, two wickets each. These are proposed starting rules to playtest.
- Both receive the same delivery order, pace, curve and scoring windows. Pin the rules version for the entire match.
- They bat in parallel on their own screens. Show the opponent's confirmed score and ball count rather than streaming every sprite movement.
- Use a coordinated countdown. Each delivery has its own scheduled start and input deadline.
- Highest confirmed score wins. An equal score is a draw; offer a rematch. Do not use network arrival time as a tiebreaker.
- Target a short session, roughly a minute, then measure actual completion time with real players.
- Finishing early after two wickets does not stop the opponent's innings.
- A completed match must have one durable result. Duplicate requests or reconnects cannot generate a second win.

### Player journey

1. Choose **Play with a Friend**.
2. Create a room or enter a short invite code. The host can also share an invite link.
3. Pick a display name and ready up. Show opponent presence and connection status.
4. The server confirms both players, locks the rules and delivery schedule, and starts a countdown.
5. Play six balls while watching confirmed scores update.
6. Show winner/draw, both scorecards and a prominent **Rematch** action.
7. Start a rematch only after both accept. Otherwise return to the lobby.

An asynchronous challenge link can be added later for friends who cannot be online together. Label that mode separately; do not pretend an offline opponent is playing live.

## 3. Gameplay UI changes

Retain the portrait layout and street artwork. Give competition more screen space than menus.

| Screen | Required changes |
| --- | --- |
| Home | Offline Play, Play with a Friend; explain each mode in one line. |
| Lobby | Room code/link, two player slots, Ready action, connection indicator, Cancel/Leave. |
| Match | Compact You/Opponent scores, each player's wickets and balls, delivery countdown, large HIT button, visible timing meter. |
| Between balls | Confirmed last-ball results for both players; no blocking full-screen menu. |
| Connection interruption | Reconnecting status and a server-controlled timeout; preserve the last confirmed score. |
| Result | Winner/draw, side-by-side scorecards, Rematch and Leave; distinguish a normal win from a disconnect result. |

The current pause button must not freeze a live multiplayer clock. Opening a leaderboard, backgrounding the app or playing a celebration must not create extra batting time. Keep live-match celebrations brief and non-blocking; allow an option to disable them.

Start with scores and presence, not fully synchronised remote player animations. Remote animations can interpolate later and must never determine scoring.

## 4. Second release: Bat vs Bowl

This should feel like a contest between two people, not merely two independent batting attempts.

- Start with one six-ball innings per player and a short role swap. The second batter chases the first innings plus one run.
- Before a delivery, the bowler chooses a permitted delivery type, line and length using large, bounded controls.
- The server validates and locks that choice before starting the delivery. Neither player can change it after seeing the batter's input.
- Add a selection timer and a default legal delivery so a player cannot stall the match.
- Give bowling meaningful limits. Test a per-over variation budget or delivery cooldown so repeating the strongest yorker is not the only sensible choice.
- Keep available delivery combinations within tested bounds. A client cannot invent an impossible pace or curve.
- Represent the selected line and length in the actual trajectory, contact and dismissal logic. A label change alone is not a new bowling mechanic.
- Give the bowler a dedicated close-up selection interface, then return to the street camera for the delivery.

Do not add a power meter, manual fielding, shot direction and bowling gestures together. Test the bowling choice first. Add batting choices only if repeated matches show that timing alone is too shallow.

## 5. Backend and networking

### Reuse and refactor the current project

- Keep `lib/cricket.mjs` as the shared scoring/rules source.
- Keep `lib/chase.mjs` and offline progress independent of multiplayer.
- Split `src/game.js` into rendering, input, game-state, storage and network modules before adding lobby state. Preserve regression tests while moving code.
- Add a server match-state module and a transport layer. The current HTTP server does not already implement a multiplayer socket transport.
- Reuse SQLite for a small, single-server pilot. It is not the synchronisation mechanism for game clocks or live connections.
- Keep application logic independent of the chosen transport library. A maintained WebSocket implementation can be added when networking work begins; do not implement the protocol from scratch just to avoid a dependency.

### Server authority

The server owns room membership, match phase, delivery schedule, rules version, accepted inputs and final results. Clients render a local copy and send input intent. They must not submit authoritative scores, wins, targets or opponent identities.

Proposed match states:

`waiting → ready_check → countdown → playing → result → rematch_check / closed`

Give every command a match ID, round ID, player session and unique command ID. Validate that the sender belongs to the match and that the command is legal in its current phase. Events need sequence numbers so clients can identify gaps and request a fresh state snapshot.

### Proposed protocol

| Client command | Server response/event |
| --- | --- |
| Create/join room | Membership token, lobby snapshot, player presence |
| Ready/unready | Updated ready state; locked match configuration when both ready |
| Clock synchronisation | Samples used to estimate server-time offset and uncertainty |
| Bat input | Accepted/rejected acknowledgement; confirmed delivery result |
| Resume session | Current match snapshot and last accepted event sequence |
| Accept rematch | Rematch state; new match only after both accept |
| Leave | Updated presence or a final disconnect/abandonment result |

Use HTTPS and encrypted sockets. Never put long-lived identity credentials in an invite URL or treat a room code as a player's identity.

## 6. Timing fairness and cheating

The existing server-recorded delivery receipts are a foundation, not proof that a human played. A modified client can still calculate an ideal input for a known delivery.

Before calling a mode ranked:

1. Establish the delivery schedule on the server and estimate clock offset before play.
2. Measure local input using monotonic event timestamps; preserve the current frame-rate independence.
3. Check input against its delivery ID, schedule, receipt time, sequence and a bounded latency allowance.
4. Do not trust a client-supplied timestamp by itself. Compare claims with server observations; clock synchronisation does not make client claims trustworthy.
5. Use one accepted swing per delivery and idempotent retries. The first accepted command wins; a later packet cannot edit the shot.
6. Define and test how latency compensation affects both players. Unlimited backdating and widening the perfect zone for high ping are unacceptable shortcuts.
7. Record suspiciously perfect timing for review, but do not ban a player because they had one good innings.

Begin with casual friend matches. If a connection is outside the tested fairness range, explain the limitation and keep it out of ranked play. Do not advertise cheat-proof competition.

## 7. Reconnects and mobile behaviour

- Design for app backgrounding, Wi-Fi/mobile-data switches, duplicated packets and lost acknowledgements.
- A dropped socket does not pause server time. A missed delivery is handled by the agreed rules.
- Rejoin using an expiring authenticated session, then fetch a complete snapshot; do not replay a locally edited scorecard.
- Start by testing a 15-second reconnection grace period. Display the countdown; tune it from real matches.
- After timeout, mark a forfeit or abandonment explicitly. A disconnect win must not silently look like a completed cricket innings.
- Stop live-match audio and unnecessary rendering when backgrounded, while keeping server state authoritative.
- Keep offline progress and online identity separate. Device-local scores must never be imported as verified multiplayer results.

The current mobile build defaults to offline play. Native online play needs a configured API origin, an explicit CORS allowlist where applicable, and a deliberate cookie/token strategy with secure credential storage. Do not ship a mobile app with a hardcoded development server URL.

## 8. Identity, storage and abuse controls

Proposed new records: player sessions, rooms, room membership, matches, participant results and delivery events. Store the rules version and finalisation status with every match. Use transactions/conditional updates so concurrent requests cannot complete a match twice.

Guest display names are sufficient for a friend-match pilot. Use an opaque server-issued session as identity; a name or invite code is not authentication. Add account recovery before durable competitive ratings.

Rate-limit room creation, join attempts and commands per session. IP limits should be a coarse secondary signal: carrier networks and shared Wi-Fi can put many legitimate players behind one address. Expire unused rooms and sessions, and define event retention rather than retaining every packet indefinitely.

Leave chat, purchases and betting out of the first version. Small preset reactions can be tested later with mute controls.

## 9. Build milestones and acceptance gates

| Milestone | Deliverable | Must pass before moving on |
| --- | --- | --- |
| A: isolated game core | Input/rendering/state split with unchanged offline modes | Existing scoring, chase and frame-rate tests pass. |
| B: friend rooms | Invite, two-player presence, ready flow | Expired/full rooms, duplicate joins and unauthorised joins handled. |
| C: Batting Duel | Live scores, common delivery schedule, durable result | Two real phones finish, draw, reconnect and rematch without state disagreement. |
| D: mobile hardening | Background/resume, network transitions, readable UI | Android and iPhone testing under normal and degraded connections. |
| E: Bat vs Bowl prototype | Validated bowling choices and role swap | Players understand both roles and cannot stall or spam an unbeatable delivery. |
| F: ranked pilot | Identity, fairness policy, telemetry and abuse review | Latency/input checks tested; results remain consistent under concurrency. |

No schedule estimate should be promised until the networking prototype and device tests reveal the real work. The current repository is a starting point, not a completed multiplayer engine.

## 10. Measure whether multiplayer is helping

Track room creation, successful joins, countdown-to-match completion, disconnect rate, rematch offers/acceptance, input/result disagreement and repeat friend sessions. Separate connection failures from players choosing to leave.

Observe a small group of real cricket fans on real phones. Ask whether losses felt fair and whether bowling choices mattered. Compare voluntary rematches with the offline replay baseline before expanding into public matchmaking.

**First implementation target: two friends, one invite, one fair six-ball duel, one obvious rematch button.**
