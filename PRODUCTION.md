# Production Architecture

## Overview

Chess Broadcast is a **local-first desktop application**. The Electron app bundles the Express/WebSocket server and React frontend into a single installable package. There is no cloud backend required — everything runs on the organiser's machine. An optional cloud relay enables internet spectators.

```
+------------------------------------------------------+
|  Organiser's Machine                                  |
|                                                       |
|  +------------------+     +----------------------+    |
|  |  DGT LiveChess   |---->|  Electron App        |    |
|  |  (USB boards)    | PGN |  +----------------+  |    |
|  +------------------+ files|  | Express Server |  |    |
|                       |    |  | :8080          |  |    |
|                       |    |  +-------+--------+  |    |
|                       |    |          | WS         |    |
|                       |    |  +-------v--------+  |    |
|                       |    |  | React Frontend |  |    |
|                       |    |  | (BrowserWindow)|  |    |
|                       |    |  +----------------+  |    |
|                       |    +----------+-----------+    |
|                       |               |                |
+------------------------------------------------------+
                                        | LAN / WiFi
                          +-------------v-----------+
                          |  Spectator Browsers      |
                          |  (phone, tablet, laptop) |
                          +--------------------------+
```

## Distribution

### Build Pipeline

```bash
cd apps/desktop
pnpm build              # Build React + package Electron installers
pnpm pack               # Quick pack to directory (testing)
```

### Platform Outputs

| Platform | Format      | Location            |
|----------|-------------|---------------------|
| macOS    | .dmg, .zip  | `release/Chess Broadcast-x.x.x.dmg` |
| Windows  | .exe (NSIS) | `release/Chess Broadcast Setup x.x.x.exe` |

### GitHub Releases

1. Tag a version: `git tag v0.4.0`
2. Push the tag: `git push origin v0.4.0`
3. GitHub Actions builds for macOS and Windows and creates a release
4. The marketing site download buttons link to the latest release

## Auto-Updates

The app uses `electron-updater` (included with electron-builder) for seamless updates:

- `publish` in `apps/desktop/package.json` points to GitHub Releases
- Updates are downloaded in the background and applied on next launch

## Architecture Decisions

### Why Electron (not Tauri/web-only)?

- **Node.js native modules**: chokidar file watching, child_process for Stockfish — these need Node.js
- **DGT integration**: Reads PGN files from the local filesystem in real-time
- **Offline-first**: No internet required during tournaments
- **Single binary**: Organiser installs one app, everything works

### Why embedded server (not separate process)?

- **No terminal required**: Organisers don't need to run commands
- **Single lifecycle**: Server starts/stops with the app
- **Port management**: App controls the server port
- **Simpler updates**: One thing to update, not two

### Spectator Access

Spectators connect to the organiser's machine over the local network:

```
http://<organiser-ip>:8080
```

For the production Electron app, the React frontend is served from the embedded server. Spectators only need the server URL. A QR code feature generates the spectator link automatically.

### Remote/Internet Spectators

The desktop app can push game updates to the cloud relay service (`apps/relay`). Spectators visit the marketing site (`apps/web`) to watch — no port forwarding or tunnels required.

## Stockfish Bundling

Currently, Stockfish must be installed separately and available on PATH. For a fully self-contained app:

1. Download platform-specific Stockfish binaries
2. Include in `extraResources` in the electron-builder config
3. Update `StockfishService` to use the bundled binary path:

```js
const stockfishPath = app.isPackaged
  ? path.join(process.resourcesPath, 'stockfish', 'stockfish')
  : 'stockfish';  // System PATH in dev
```

## Security Considerations

- **No authentication** by default — anyone on the network can connect
- For public venues, consider adding a simple shared secret or PIN
- WebSocket connections are unencrypted (ws://) — fine for LAN, use the relay for internet
- The app does not phone home or collect any data

## Deployment Summary

| Component | Platform | Trigger |
|-----------|----------|---------|
| Desktop App | GitHub Releases | `git tag v*` + push |
| Marketing Site | Vercel | Push to `master` (changes in `apps/web/` or `packages/`) |
| Relay Service | Fly.io | Push to `master` (changes in `apps/relay/` or `packages/protocol/`) |
