const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const chokidar = require("chokidar");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const parseGame = require("./parse-game");
const config = require("./config");

const GameSimulator = require("./simulator");
const StockfishService = require("./stockfish-service");
const PGNGenerator = require("./pgn-generator");
const { generatePairings, calculateRounds } = require("./pairing-engine");

const WebSocket = require("ws");

const PORT = config.server.port;
const BASE_PATH = config.dgt.basePath;
const DEBUG = config.broadcast.debug;

// Singletons
let simulator = null;
const stockfish = new StockfishService({
  multiPV: config.engine?.multiPV || 3,
  depth: config.engine?.depth || 16,
});

// Store connected clients and their subscriptions
const clients = new Set();
const boardWatchers = new Map();

// Track eval history per board for accuracy calculation
const evalHistory = new Map();

// Board health: boardNumber -> { board, round, lastUpdate, white, black, status, moveCount }
const boardHealth = new Map();

// --- Cloud Relay Bridge ---
let relayWs = null;
let relayState = { status: "disconnected", eventId: null, secret: null, url: null, error: null };
let relayReconnectTimer = null;

function connectRelay(url, eventId, secret, eventName) {
  disconnectRelay();
  relayState = { status: "connecting", eventId, secret, url, error: null };

  try {
    relayWs = new WebSocket(url);
  } catch (err) {
    relayState = { ...relayState, status: "error", error: err.message };
    return;
  }

  relayWs.on("open", () => {
    console.log(`[relay] Connected to ${url}`);
    relayWs.send(JSON.stringify({ type: "relay_auth", eventId, secret, eventName }));
  });

  relayWs.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === "relay_authed") {
        relayState = { ...relayState, status: "connected" };
        console.log(`[relay] Authenticated as organiser for "${eventId}"`);
      } else if (msg.type === "error") {
        relayState = { ...relayState, status: "error", error: msg.message };
        console.error(`[relay] Error: ${msg.message}`);
      }
    } catch {}
  });

  relayWs.on("close", () => {
    console.log("[relay] Disconnected");
    const wasConnected = relayState.status === "connected";
    relayState = { ...relayState, status: "disconnected" };
    relayWs = null;
    // Auto-reconnect if we were previously connected (unexpected disconnect)
    if (wasConnected && relayState.url) {
      relayReconnectTimer = setTimeout(() => {
        console.log("[relay] Attempting reconnect...");
        connectRelay(relayState.url, relayState.eventId, relayState.secret, eventName);
      }, 5000);
    }
  });

  relayWs.on("error", (err) => {
    console.error(`[relay] WebSocket error: ${err.message}`);
    relayState = { ...relayState, status: "error", error: err.message };
  });
}

function disconnectRelay() {
  if (relayReconnectTimer) {
    clearTimeout(relayReconnectTimer);
    relayReconnectTimer = null;
  }
  if (relayWs) {
    relayWs.close();
    relayWs = null;
  }
  relayState = { status: "disconnected", eventId: null, secret: null, url: null, error: null };
}

function publishToRelay(message) {
  if (relayWs && relayWs.readyState === WebSocket.OPEN && relayState.eventId) {
    relayWs.send(JSON.stringify({
      type: "relay_publish",
      eventId: relayState.eventId,
      message,
    }));
  }
}

// Configure CORS
app.use(
  cors({
    origin: config.server.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());

// Serve the React build (production SPA for spectators on LAN)
const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

// --- LAN IP detection ---
function getLanIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

// --- Config & Status API ---
app.get("/api/config", (req, res) => {
  res.json({
    server: { port: config.server.port, corsOrigin: config.server.corsOrigin },
    dgt: {
      basePath: config.dgt.basePath,
      liveChessApiUrl: config.dgt.liveChessApiUrl,
      watchMode: config.dgt.watchMode,
    },
    broadcast: {
      maxBoards: config.broadcast.maxBoards,
      pollInterval: config.broadcast.pollInterval,
      debug: config.broadcast.debug,
    },
    network: {
      lanIP: getLanIP(),
      serverURL: `http://${getLanIP()}:${config.server.port}`,
      spectatorURL: `http://${getLanIP()}:${config.server.port}/live`,
    },
  });
});

// Update config values at runtime
app.patch("/api/config", async (req, res) => {
  const { dgtPath, relayUrl, serverPort } = req.body;
  if (dgtPath !== undefined) config.dgt.basePath = dgtPath;
  if (relayUrl !== undefined) config.relay = { url: relayUrl };
  if (serverPort !== undefined) config.server.port = serverPort;
  res.json({ ok: true });
});

// --- Cloud Relay API ---
app.get("/api/relay/status", (req, res) => {
  res.json(relayState);
});

app.post("/api/relay/connect", (req, res) => {
  const { url, eventId, secret, eventName } = req.body;
  if (!url || !eventId || !secret) {
    return res.status(400).json({ ok: false, message: "url, eventId, and secret are required" });
  }
  connectRelay(url, eventId, secret, eventName);
  res.json({ ok: true });
});

app.post("/api/relay/disconnect", (req, res) => {
  disconnectRelay();
  res.json({ ok: true });
});

app.get("/api/status", (req, res) => {
  const now = Date.now();
  const boards = Array.from(boardHealth.values()).map((b) => {
    const elapsed = now - new Date(b.lastUpdate).getTime();
    let health = "healthy";
    if (elapsed > 120000) health = "critical";
    else if (elapsed > 60000) health = "warning";
    return { ...b, elapsed, health };
  });

  res.json({
    connectedClients: clients.size,
    activeWatchers: boardWatchers.size,
    stockfish: stockfish.ready ? "running" : "stopped",
    simulator: simulator ? (simulator.running ? "running" : "stopped") : "idle",
    relay: relayState.status,
    boards,
  });
});

// --- Simulator REST API ---
app.post("/api/simulator/start", async (req, res) => {
  try {
    if (simulator && simulator.running) {
      return res.json({ ok: false, message: "Simulator already running" });
    }
    const boards = Math.min(Math.max(parseInt(req.body.boards) || 4, 1), 20);
    const speedMap = { "1": "fast", "2": "normal", "3": "slow" };
    const speed = speedMap[String(req.body.speed)] || "normal";
    const round = Math.max(parseInt(req.body.round) || 1, 1);
    const eventName = req.body.eventName || "Live Broadcast";

    // Clean up old watchers and stale PGN files before starting
    closeAllWatchers();
    evalHistory.clear();
    const roundPath = path.join(BASE_PATH, `round-${round}`);
    try {
      const existingFiles = await fs.readdir(roundPath);
      for (const file of existingFiles) {
        if (file.endsWith(".pgn") && file.includes("game-")) {
          await fs.unlink(path.join(roundPath, file));
        }
      }
    } catch {
      // Directory may not exist yet — simulator will create it
    }

    simulator = new GameSimulator("./Live", { round, speed, eventName });
    await simulator.initializeGames(boards);
    await simulator.start();

    // Give files a moment to write, then start watching
    setTimeout(() => initializeBoardWatchers(round), 500);

    res.json({ ok: true, boards, speed, round, eventName });
  } catch (err) {
    console.error("Simulator start error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.post("/api/simulator/stop", (req, res) => {
  if (simulator) {
    simulator.stop();
  }
  res.json({ ok: true });
});

app.get("/api/simulator/status", (req, res) => {
  if (!simulator) {
    return res.json({ running: false, boards: 0, games: [] });
  }
  const games = simulator.games.map((g) => ({
    board: g.boardNumber,
    white: g.white.name,
    black: g.black.name,
    moves: g.moveIndex,
    totalMoves: g.allMoves.length,
    result: g.result,
    status: g.status,
  }));
  res.json({ running: simulator.running, boards: games.length, games });
});

// --- Tournament API ---
app.get("/api/tournament", async (req, res) => {
  try {
    const tournamentPath = path.join(BASE_PATH, "tournament.json");
    const data = await fs.readFile(tournamentPath, "utf-8");
    res.json(JSON.parse(data));
  } catch {
    res.json(null);
  }
});

app.post("/api/tournament/create", async (req, res) => {
  try {
    const { event, date, venue, timeControl, players, format, rounds } = req.body;

    if (!event || !players || players.length < 2) {
      return res.status(400).json({ ok: false, message: "Event name and at least 2 players required" });
    }

    const tournament = {
      event,
      date: date || new Date().toISOString().split("T")[0],
      venue: venue || "",
      timeControl: timeControl || "90+30",
      players,
      format: format || "round-robin",
      rounds: rounds || calculateRounds(format, players.length),
      createdAt: new Date().toISOString(),
    };

    // Generate pairings
    const pairings = generatePairings(tournament);
    tournament.pairings = pairings;

    // Write tournament.json
    await fs.mkdir(BASE_PATH, { recursive: true });
    const tournamentPath = path.join(BASE_PATH, "tournament.json");
    await fs.writeFile(tournamentPath, JSON.stringify(tournament, null, 2), "utf-8");

    // Create round directories and initial PGN stubs
    const generator = new PGNGenerator(BASE_PATH);
    for (let r = 0; r < pairings.length; r++) {
      const roundPairings = pairings[r];
      for (let b = 0; b < roundPairings.length; b++) {
        const pairing = roundPairings[b];
        const pgn = generator.generatePGN({
          white: pairing.white,
          black: pairing.black,
          result: "*",
          event: tournament.event,
          round: (r + 1).toString(),
          date: tournament.date.replace(/-/g, "."),
          moves: [],
          whiteTime: null,
          blackTime: null,
        });
        await generator.writeGameFile(r + 1, b + 1, pgn);
      }
    }

    res.json({ ok: true, tournament });
  } catch (err) {
    console.error("Tournament create error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Tournament pairings for a specific round
app.get("/api/tournament/pairings/:round", async (req, res) => {
  try {
    const tournamentPath = path.join(BASE_PATH, "tournament.json");
    const data = JSON.parse(await fs.readFile(tournamentPath, "utf-8"));
    const round = parseInt(req.params.round) - 1;
    if (!data.pairings || !data.pairings[round]) {
      return res.json({ ok: false, pairings: [] });
    }
    res.json({ ok: true, round: round + 1, pairings: data.pairings[round] });
  } catch {
    res.json({ ok: false, pairings: [] });
  }
});

// Tournament results tracking
app.post("/api/tournament/result", async (req, res) => {
  try {
    const { round, board, result } = req.body;
    const tournamentPath = path.join(BASE_PATH, "tournament.json");
    const data = JSON.parse(await fs.readFile(tournamentPath, "utf-8"));

    if (!data.results) data.results = {};
    data.results[`${round}-${board}`] = result;

    await fs.writeFile(tournamentPath, JSON.stringify(data, null, 2), "utf-8");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

app.delete("/api/tournament", async (req, res) => {
  try {
    const tournamentPath = path.join(BASE_PATH, "tournament.json");
    await fs.unlink(tournamentPath);
    res.json({ ok: true });
  } catch {
    res.json({ ok: true });
  }
});

// REST API endpoint for fetching specific game
app.get("/:round(\\d+)/:board(\\d+)", async (req, res) => {
  const { board, round } = req.params;
  try {
    const filePath = path.join(BASE_PATH, `round-${round}`, `game-${board}.pgn`);
    const result = await getPgn(filePath);
    res.json(result);
  } catch (error) {
    console.error(`Error fetching game: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch game data" });
  }
});

// WebSocket endpoint for real-time game updates
app.ws("/games", async (ws, req) => {
  console.log("✅ WebSocket client connected");
  clients.add(ws);

  // Send initial connection acknowledgment
  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Connected to chess broadcast server",
      timestamp: new Date().toISOString(),
    }),
  );

  // Handle client messages (for subscriptions, preferences, etc.)
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      handleClientMessage(ws, data);
    } catch (error) {
      console.error("Error parsing client message:", error);
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Close all file watchers and clear board state
function closeAllWatchers() {
  boardWatchers.forEach((watcher) => watcher.close());
  boardWatchers.clear();
  boardHealth.clear();
}

// Initialize board watchers for a specific round
async function initializeBoardWatchers(round) {
  try {
    const roundPath = path.join(BASE_PATH, `round-${round}`);

    // Check if directory exists
    try {
      await fs.access(roundPath);
    } catch {
      console.log(`⚠️  Directory not found: ${roundPath}`);
      return;
    }

    const files = await fs.readdir(roundPath);
    const pgnFiles = files.filter(
      (f) => f.endsWith(".pgn") && f.includes("game-"),
    );

    console.log(`📁 Found ${pgnFiles.length} PGN files in round ${round}`);

    pgnFiles.forEach((file) => {
      const boardNumber = extractBoardNumber(file);
      const filePath = path.join(roundPath, file);

      if (!boardWatchers.has(filePath)) {
        watchGameFile(round, boardNumber, filePath);
      }
    });
  } catch (error) {
    console.error(`Error initializing board watchers: ${error.message}`);
  }
}

// Extract board number from filename (e.g., "game-1.pgn" -> 1)
function extractBoardNumber(filename) {
  const match = filename.match(/game-(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Watch a specific game file for changes
function watchGameFile(round, boardNumber, filePath) {
  const watcher = chokidar.watch(filePath, {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });

  watcher.on("change", async () => {
    if (DEBUG) console.log(`📝 File changed: ${path.basename(filePath)}`);
    await broadcastGameUpdate(round, boardNumber, filePath);
  });

  watcher.on("add", async () => {
    if (DEBUG) console.log(`➕ New file detected: ${path.basename(filePath)}`);
    await broadcastGameUpdate(round, boardNumber, filePath);
  });

  watcher.on("error", (error) => {
    console.error(`Error watching ${filePath}:`, error);
  });

  boardWatchers.set(filePath, watcher);
  console.log(`👁️  Watching board ${boardNumber} at ${filePath}`);
}

// Broadcast game update to all connected clients
async function broadcastGameUpdate(round, boardNumber, filePath) {
  try {
    const gameData = await getPgn(filePath);

    // Track board health
    boardHealth.set(boardNumber, {
      board: boardNumber,
      round,
      lastUpdate: new Date().toISOString(),
      white: gameData.whiteInfo?.name || "Unknown",
      black: gameData.blackInfo?.name || "Unknown",
      status: gameData.status || "unknown",
      moveCount: gameData.moveCount || 0,
    });

    const message = JSON.stringify({
      type: "game_update",
      round,
      board: boardNumber,
      data: gameData,
      timestamp: new Date().toISOString(),
    });

    const parsed = JSON.parse(message);

    // Send to all connected local clients
    let sentCount = 0;
    clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(message);
        sentCount++;
      }
    });

    // Forward to cloud relay
    publishToRelay(parsed);

    if (DEBUG)
      console.log(
        `📤 Broadcast to ${sentCount} clients - Board ${boardNumber}`,
      );

    // Queue Stockfish evaluation for this position
    if (gameData.fen && stockfish.ready) {
      stockfish.evaluate(boardNumber, gameData.fen).then((evalResult) => {
        if (!evalResult) return;

        // Track eval history for accuracy calculation
        if (!evalHistory.has(boardNumber)) evalHistory.set(boardNumber, []);
        const history = evalHistory.get(boardNumber);
        history.push({
          fen: gameData.fen,
          eval: { type: evalResult.type, value: evalResult.value },
        });

        const accuracy = calculateAccuracy(history);

        const evalParsed = {
          type: "eval_update",
          board: boardNumber,
          evaluation: { ...evalResult, ...(accuracy || {}) },
          fen: gameData.fen,
        };
        const evalMsg = JSON.stringify(evalParsed);
        clients.forEach((client) => {
          if (client.readyState === 1) client.send(evalMsg);
        });

        // Forward eval to cloud relay
        publishToRelay(evalParsed);
      });
    }
  } catch (error) {
    console.error(`Error broadcasting update: ${error.message}`);
  }
}

/**
 * Calculate ACPL and accuracy % from eval history.
 * For each move, loss = max(0, evalBefore - evalAfter) from the moving side's perspective.
 * Accuracy = max(0, min(100, 100 - ACPL * 0.5))
 */
function calculateAccuracy(history) {
  if (history.length < 3) return null;

  let whiteTotalLoss = 0;
  let blackTotalLoss = 0;
  let whiteMoves = 0;
  let blackMoves = 0;

  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1];
    const curr = history[i];

    // Skip mate evals — they distort ACPL
    if (prev.eval.type === "mate" || curr.eval.type === "mate") continue;

    // Determine who moved: side to move in prev FEN is who just moved
    const prevParts = prev.fen ? prev.fen.split(" ") : [];
    const sideWhoMoved = prevParts[1] || "w";

    // Normalize both evals to white's perspective
    const prevWhite = sideWhoMoved === "b" ? -prev.eval.value : prev.eval.value;
    const currParts = curr.fen ? curr.fen.split(" ") : [];
    const currSide = currParts[1] || "w";
    const currWhite = currSide === "b" ? -curr.eval.value : curr.eval.value;

    if (sideWhoMoved === "w") {
      // White moved: loss = how much worse it got for white
      const loss = Math.max(0, prevWhite - currWhite);
      whiteTotalLoss += loss;
      whiteMoves++;
    } else {
      // Black moved: loss = how much worse it got for black (= how much better for white)
      const loss = Math.max(0, currWhite - prevWhite);
      blackTotalLoss += loss;
      blackMoves++;
    }
  }

  const whiteACPL = whiteMoves > 0 ? Math.round(whiteTotalLoss / whiteMoves) : 0;
  const blackACPL = blackMoves > 0 ? Math.round(blackTotalLoss / blackMoves) : 0;

  const acplToAccuracy = (acpl) => Math.max(0, Math.min(100, 100 - acpl * 0.5));

  return {
    whiteAccuracy: Math.round(acplToAccuracy(whiteACPL) * 10) / 10,
    blackAccuracy: Math.round(acplToAccuracy(blackACPL) * 10) / 10,
    whiteACPL,
    blackACPL,
  };
}

// Handle client messages
function handleClientMessage(ws, data) {
  switch (data.type) {
    case "subscribe_round":
      // Client wants to subscribe to a specific round
      const round = data.round;
      evalHistory.clear();
      initializeBoardWatchers(round);
      ws.send(
        JSON.stringify({
          type: "subscribed",
          round,
          message: `Subscribed to round ${round}`,
        }),
      );
      break;

    case "ping":
      ws.send(JSON.stringify({ type: "pong" }));
      break;

    default:
      console.log("Unknown message type:", data.type);
  }
}

// Read and parse PGN file
async function getPgn(filePath) {
  if (DEBUG) console.log(`📖 Reading PGN from ${filePath}`);
  const pgn = await fs.readFile(filePath, "utf-8");
  const parsed = parseGame(pgn);
  return parsed;
}

// Cleanup function for graceful shutdown
function shutdownServer() {
  console.log("\n🛑 Shutting down server...");
  disconnectRelay();
  stockfish.stop();
  closeAllWatchers();
  clients.forEach((client) => {
    client.close();
  });
}

// Cleanup on server shutdown (standalone mode)
process.on("SIGINT", () => {
  shutdownServer();
  process.exit(0);
});

// Cleanup when Electron app quits
process.on("exit", () => {
  shutdownServer();
});

// SPA catch-all: serve index.html for any non-API GET request (spectator browsers)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Chess Broadcast Server`);
  console.log(`   Port: ${PORT}`);
  console.log(`   DGT Path: ${BASE_PATH}`);
  console.log(`   Mode: ${config.dgt.watchMode}`);
  console.log(`   WebSocket: ws://localhost:${PORT}/games`);
  console.log(`\n⏳ Waiting for connections...\n`);

  // Start Stockfish engine
  stockfish.start();

  // Auto-detect and watch round 1 by default
  initializeBoardWatchers(1);
});
