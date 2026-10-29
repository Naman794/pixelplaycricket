# Bat vs Bowl — multiplayer testing prototype

This branch implements a casual two-player prototype, not ranked multiplayer. It uses the existing art and shared scoring rules, with separate batting-end and bowling-end camera layouts. The offline game is preserved.

## Match format

- Host bats first; the friend bowls. There is no toss in this prototype.
- Each innings allows **12 balls (2 overs) and 3 wickets**. Three wickets means all out.
- The bowler chooses Pace, Inswing, Outswing or Yorker. Maximum two yorkers per over. If no choice arrives within ten seconds, the server selects a legal delivery.
- The batter alone controls HIT. The bowler cannot score by sending batting inputs.
- After the first innings, roles and camera views swap. The second player chases the first score plus one.
- The chase finishes immediately when the target is reached; otherwise it ends at 12 balls or three wickets. Equal final scores are a draw.
- Both players must accept a rematch. Room state and scoring are controlled by the server.

## Run locally

Use Node 24 or newer. No package installation is required.

```sh
npm start
```

Open `http://localhost:3000/multiplayer/`. Enter your name and create a room. Copy the invite or share its six-character code.

For a quick self-test, open the invite in a **private/incognito window**. Two ordinary tabs share one session cookie and represent the same player. For a useful test, use two different phones or browser profiles.

For two phones on the same Wi-Fi, open `http://YOUR_COMPUTER_LAN_IP:3000/multiplayer/` on both. Allow the port through your local firewall. `localhost` on a phone means the phone itself, not your computer.

## Test over the internet

Run the branch on a Node host or a forwarded development port. For GitHub Codespaces, select this branch, run `npm start`, and forward port 3000. The port must be accessible to the invited tester. Open the forwarded HTTPS URL with `/multiplayer/` appended. Set `PUBLIC_ORIGIN` to that external origin when the proxy does not preserve the browser's Host header.

This repository/PR is code, not a deployed game link. A running shared server is required. Do not distribute a localhost invite to someone outside your network.

## What to test

1. Create room, join, Ready: both players see consistent names, roles and scores.
2. Confirm the host gets batting POV, the friend bowling POV; swap after the innings.
3. Confirm 12 legal balls ends an innings; separately test three-wicket all out.
4. Test a chase win before 12 balls, a failed chase, and equal scores.
5. Select deliveries and verify that a third yorker in an over is rejected.
6. Reconnect within 15 seconds. The server clock keeps running; missed deliveries still count. After a prolonged disconnect, the opponent receives an explicitly labelled disconnect result.
7. Request a rematch from only one device, then both. Only the second acceptance starts it.
8. Open a full room from a third profile; it must not let a third player participate.
9. Switch mobile data/Wi-Fi and background the app. Observe timing, connection messages and rejoining.

## Technical scope and limitations

- Live state uses **Server-Sent Events plus HTTP input commands**, not a third-party service or socket SDK. Rejoining receives a full snapshot.
- Inputs use monotonic event timestamps and a sampled server-clock offset. The server checks phase, role, delivery, first-swing immutability and a bounded 350 ms network allowance.
- This allowance is for casual testing. It does not prove human input, eliminate latency advantage or make the game cheat-proof.
- Rooms are in server memory, expire, and disappear on a server restart. No global rankings or multiplayer rewards are written to the solo leaderboard.
- Use one Node process for this prototype. Multiple instances would need shared room ownership and state.
- The room needs the live server; the `dist/` mobile bundle remains the standalone offline game.
- POVs use the current sprite atlas. Dedicated front/back character art and real-phone visual polish are still needed.
- Automated engine and HTTP checks are included. Real-device testing has not been completed by this change.

## Checks

```sh
npm test
npm run build
```

Report bugs with the room phase, innings, ball number, player role, device/browser and whether the connection changed. Do not treat a passing simulation as evidence that touch timing feels fair.
