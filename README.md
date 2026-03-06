# Chess Broadcast

Real-time DGT board integration for streaming live chess games. Installable desktop app for organisers, cloud relay for internet spectators.

<img src="./img/example-full-boards.png" />
<img src="./img/dashboard.png" />

---

## Monorepo Structure

```
apps/
  desktop/       Electron app — organiser tool with embedded server
  web/           Next.js — marketing site + spectator viewer
  relay/         WebSocket relay — bridges desktop to internet spectators

packages/
  chess/         Pure TypeScript chess logic (PGN parsing, eval, pairings)
  protocol/      Shared message types and constants
  ui/            Shared React components and hooks
  config/        Shared TypeScript configs
```

### How It Works

```
Organiser's Machine                Cloud                    Spectators
┌──────────────┐      push      ┌──────────┐   subscribe   ┌──────────┐
│ Desktop App  │ ─────────────> │  Relay   │ <──────────── │ Browser  │
│ (DGT boards) │  game updates  │ Service  │  game updates │ (web app)│
└──────────────┘                └──────────┘               └──────────┘
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+

```bash
# Install pnpm if you don't have it
npm install -g pnpm
```

### Install

```bash
git clone https://github.com/chess-centre/broadcasts.git
cd broadcasts
pnpm install
```

### Build Packages

```bash
pnpm build
```

### Development

Run individual apps or the full stack:

```bash
# All apps in parallel
pnpm dev

# Individual apps
pnpm dev:desktop    # Electron organiser app
pnpm dev:web        # Next.js marketing + spectator site
pnpm dev:relay      # WebSocket relay service
```

### Desktop App (Electron)

```bash
cd apps/desktop
cp .env.example .env    # Configure DGT path, ports, etc.
pnpm dev                # Starts server + React + Electron
```

The dashboard is the landing page — configure the simulator, hit **start**, then click **open live view** to watch.

### Marketing Site (Next.js)

```bash
cd apps/web
pnpm dev                # http://localhost:3000
```

### Relay Service

```bash
cd apps/relay
pnpm dev                # ws://localhost:3001
```

---

## Desktop App

The Electron app is the organiser's tool. It embeds the Express/WebSocket server — no terminal needed.

### Routes

| Route  | Description                                       |
| ------ | ------------------------------------------------- |
| `/`    | System dashboard and simulator controls            |
| `/live`| Live broadcast viewer with boards and leaderboard  |
| `/obs` | OBS browser source widgets                         |

### Dashboard

The landing page (`/`) is a terminal-style control panel:

- **Server** — connection status, port, connected clients, active watchers, Stockfish status, simulator state
- **Simulator** — boards (1-20), speed, round, event name, live game progress
- **Broadcast** — max boards, poll interval, debug mode, DGT base path

### Configuration (`.env`)

```bash
# Server
PORT=8080
CORS_ORIGIN=*

# DGT LiveChess
DGT_BASE_PATH=C:/Users/user/Desktop/Live
DGT_API_URL=ws://127.0.0.1:1982/api/v1.0
DGT_WATCH_MODE=files

# Broadcast
MAX_BOARDS=20
POLL_INTERVAL=1000
DEBUG=false
```

### Building the Desktop App

```bash
cd apps/desktop
pnpm build              # Build React + package Electron installers
pnpm pack               # Quick pack to directory (testing)
```

Outputs: `.dmg` (macOS), `.exe` (Windows), `.AppImage` (Linux).

---

## Spectator Access

### Local Network

Spectators on the same WiFi/LAN connect directly to the desktop app's server:

```
http://<organiser-ip>:8080
```

Share via the built-in QR code or spectator link modal.

### Internet (via Relay)

The desktop app pushes game updates to the cloud relay. Spectators visit:

```
https://your-site.com/watch/<event-id>
```

No port forwarding or tunnels required.

---

## API Reference

### REST API (Desktop Server)

| Method | Endpoint                | Description                                              |
| ------ | ----------------------- | -------------------------------------------------------- |
| `GET`  | `/api/config`           | Server configuration (DGT, broadcast settings)           |
| `GET`  | `/api/status`           | Runtime status (clients, watchers, stockfish, simulator)  |
| `POST` | `/api/simulator/start`  | Start simulator `{ boards, speed, round, eventName }`    |
| `POST` | `/api/simulator/stop`   | Stop simulator                                           |
| `GET`  | `/api/simulator/status` | Simulator game progress                                  |
| `GET`  | `/api/tournament`       | Current tournament metadata                              |
| `POST` | `/api/tournament/create`| Create tournament with pairings                          |
| `GET`  | `/:round/:board`        | Fetch specific game PGN                                  |

### WebSocket API (Desktop Server)

Connect to `ws://localhost:8080/games`.

```json
// Client → Server
{ "type": "subscribe_round", "round": 1 }
{ "type": "ping" }

// Server → Client
{ "type": "game_update", "round": 1, "board": 3, "data": { ... } }
{ "type": "eval_update", "board": 3, "evaluation": { ... }, "fen": "..." }
{ "type": "connected", "message": "Connected to chess broadcast server" }
```

### Relay API

```json
// Organiser → Relay
{ "type": "relay_auth", "eventId": "spring-open", "secret": "..." }
{ "type": "relay_publish", "eventId": "spring-open", "message": { ... } }

// Spectator → Relay
{ "type": "relay_subscribe", "eventId": "spring-open" }
```

Health check: `GET /health`
Active events: `GET /events`

---

## Packages

### `@broadcasts/chess`

Pure TypeScript chess utilities. No React, no browser APIs.

```ts
import { parseGame, evalToPercent, generatePairings } from "@broadcasts/chess";
```

- **parseGame** — PGN parser extracting players, clocks, FEN, result
- **evalToPercent / formatScore / uciToSan** — engine evaluation utilities
- **detectCriticalMoment** — blunder/mistake/inaccuracy detection
- **extractMoveTimes / formatTime** — clock time analysis
- **generatePairings / calculateRounds** — round-robin and Swiss pairing engine
- **generateGameEndPost / generateStandingsPost** — social media post generation

### `@broadcasts/protocol`

Shared TypeScript types for all WebSocket messages, game state, and event metadata. Used by desktop, relay, and web apps.

### `@broadcasts/ui`

Shared React hooks for broadcast apps:

- **useInterval** — isomorphic interval hook
- **useClockCountdown** — client-side clock countdown between server updates
- **useAutoCycle** — TV/kiosk board rotation with priority scoring
- **useFeaturedBoard** — selects most interesting game by eval volatility

---

## DGT LiveChess Setup

1. Install [DGT LiveChess](https://www.livechess.com/) 2.2+
2. Settings > File Output > Enable PGN saving
3. Set output directory to match `DGT_BASE_PATH`
4. Directory structure: `round-1/game-1.pgn`, `round-1/game-2.pgn`, etc.
5. Connect boards via USB, assign board numbers, enter player info

```
Live/
├── round-1/
│   ├── game-1.pgn
│   ├── game-2.pgn
│   └── game-3.pgn
└── round-2/
    ├── game-1.pgn
    └── game-2.pgn
```

---

## Deployment

### Desktop App

Tag a version and push — GitHub Actions builds for all platforms and creates a release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

Auto-updates are handled via `electron-updater` from GitHub Releases.

### Marketing Site

Deploys to Vercel on push to `master` (changes in `apps/web/` or `packages/`).

### Relay Service

Deploys to Fly.io on push to `master` (changes in `apps/relay/` or `packages/protocol/`).

```bash
cd apps/relay
flyctl launch      # First time
flyctl deploy      # Subsequent deploys
```

---

## Troubleshooting

**No games appearing** — Check `DGT_BASE_PATH` matches your PGN directory. Verify folder structure is `round-N/game-N.pgn`. Enable `DEBUG=true`.

**WebSocket not connecting** — Verify server is running on correct port. Check browser console. Ensure firewall allows WebSocket connections.

**Clocks not updating** — DGT LiveChess must include `[%clk H:MM:SS]` comments in PGN output.

**pnpm install fails** — Ensure you're using pnpm 10+ and Node 20+. Run `pnpm install --no-frozen-lockfile` on first setup.

---

## Credits

- [DGT](https://www.livechess.com/) — LiveChess software and hardware
- [chess.js](https://github.com/jhlywa/chess.js) — game logic
- [chessground](https://github.com/lichess-org/chessground) — board rendering
- [The Chess Centre](https://github.com/chess-centre) — original concept
