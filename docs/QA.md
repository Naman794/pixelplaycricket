# Street Nets verification

## Automated checks completed

- Shared timing-window boundaries and displayed meter boundaries.
- Identical shot timestamps across simulated 30/60/120 Hz rendering.
- Late-dot regression, pause/resume timing and wicket results.
- Optional celebration asset failure leaves gameplay available.
- Target-chase completion advances the next target.
- Skipping celebrations returns to the between-ball state.
- Ranked connection failure switches explicitly to practice and preserves play.
- Bowler release has lateral separation from the far wicket; contact reaches the near batting plane.
- Real API route handlers tested against an in-memory SQLite database with all migrations: ordered delivery receipts, replay/idempotency, too-early submissions, modified receipts, incomplete innings, score recalculation from stored receipts, duplicate final submissions and peer rate limits.

## Real-device verification still required

No browser automation or physical phone was available in this environment. The following are unverified, not passed:

- iPhone Safari and Android Chrome: small/large portrait screens and landscape; field fully visible with contain scaling.
- Complete a 12-ball ranked innings; enter a name with the onscreen keyboard; verify the public leaderboard updates.
- Chase success, chase failure, next-target progression and reloading saved progression.
- Compare touch-down and spacebar responsiveness by feel; test the defensive dot-ball pose and bowler alignment visually.
- Slow connection at launch; failed celebration image; connection loss after a delivery; reconnect and begin a fresh ranked match.
- Background/resume, audio unlock, repeated celebration skipping and small-screen button reachability.

## Known limits

Leaderboard identity is anonymous per browser. Cookies are not accounts. Peer rate limits use a hash of the platform-provided connecting IP when present. Per-delivery verification raises the cost of forged batch submissions, but cannot establish that a human played. Previously recorded leaderboard entries remain intact. Network-interrupted innings continue as practice and cannot be submitted as ranked scores.
