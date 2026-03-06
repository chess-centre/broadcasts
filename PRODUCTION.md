# Production Architecture

## Overview

Chess Broadcast is a **local-first desktop application**. The Electron app bundles the Express/WebSocket server and React frontend into a single installable package. There is no cloud backend — everything runs on the organiser's machine.

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
# Development
npm run electron:dev       # Full dev environment with hot reload

# Production builds
npm run electron:build     # Build React + package Electron installers
npm run electron:pack      # Quick pack to directory (testing)
```

### Platform Outputs

| Platform | Format      | Location            |
|----------|-------------|---------------------|
| macOS    | .dmg, .zip  | `dist/Chess Broadcast-x.x.x.dmg` |
| Windows  | .exe (NSIS) | `dist/Chess Broadcast Setup x.x.x.exe` |
| Linux    | .AppImage   | `dist/Chess Broadcast-x.x.x.AppImage` |

### GitHub Releases (Recommended)

1. Tag a version: `git tag v0.1.0`
2. Build for each platform (or use CI)
3. Upload artifacts to a GitHub Release
4. The promotional website download buttons link to the latest release

### CI/CD with GitHub Actions

Add `.github/workflows/build.yml` to automate multi-platform builds:

```yaml
on:
  push:
    tags: ['v*']

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci --legacy-peer-deps
      - run: npm run electron:build
      - uses: softprops/action-gh-release@v2
        with:
          files: dist/*
```

## Auto-Updates

Use `electron-updater` (included with electron-builder) for seamless updates:

1. Install: `npm install electron-updater`
2. Configure `publish` in `package.json` build config to point to GitHub Releases
3. Add update check logic to `electron/main.js`

Updates are downloaded in the background and applied on next launch.

## Architecture Decisions

### Why Electron (not Tauri/web-only)?

- **Node.js native modules**: chokidar file watching, child_process for Stockfish — these need Node.js
- **DGT integration**: Reads PGN files from the local filesystem in real-time
- **Offline-first**: No internet required during tournaments
- **Single binary**: Organiser installs one app, everything works

### Why embedded server (not separate process)?

- **No terminal required**: Organisers don't need to run `npm run server`
- **Single lifecycle**: Server starts/stops with the app
- **Port management**: App controls the server port
- **Simpler updates**: One thing to update, not two

### Spectator Access

Spectators connect to the organiser's machine over the local network:

```
http://<organiser-ip>:3000/live    (React dev)
http://<organiser-ip>:8080/games   (WebSocket)
```

For the production Electron app, the React frontend is served from the embedded server. Spectators only need the server URL.

**Network requirements:**
- Organiser and spectators must be on the same network (WiFi/LAN)
- Port 8080 must be accessible (firewall)
- QR code feature generates the spectator link automatically

### Remote/Internet Spectators

For spectators outside the local network, options include:

1. **Reverse proxy** (ngrok, Cloudflare Tunnel): Expose the local server to the internet
2. **Cloud relay** (future): WebSocket relay server that the Electron app pushes to
3. **Static export** (future): Periodic PGN snapshots uploaded to a web server

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
- WebSocket connections are unencrypted (ws://) — fine for LAN, use a tunnel for internet
- The app does not phone home or collect any data

## Promotional Website Deployment

The `website/` directory is a static site. Deploy to:

- **GitHub Pages**: Free, automatic with Actions
- **Netlify/Vercel**: Drag-and-drop or git integration
- **Custom domain**: Point DNS to your hosting provider

Download links should point to GitHub Releases API:
```
https://github.com/<org>/<repo>/releases/latest/download/Chess.Broadcast-x.x.x.dmg
```

Or use the GitHub API for dynamic "latest" links:
```
https://github.com/<org>/<repo>/releases/latest
```
