const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);
const chokidar = require("chokidar");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const parseGame = require("./parse-game");
const config = require("./config");

const GameSimulator = require("./simulator");
const StockfishService = require("./stockfish-service");

const PORT = config.server.port;
const BASE_PATH = config.dgt.basePath;
const DEBUG = config.broadcast.debug;

// Singletons
let simulator = null;
const stockfish = new StockfishService();

// Store connected clients and their subscriptions
const clients = new Set();
const boardWatchers = new Map();

// Configure CORS
app.use(
  cors({
    origin: config.server.corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/favicon.ico", (req, res) => res.status(204));

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
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    connectedClients: clients.size,
    activeWatchers: boardWatchers.size,
    stockfish: stockfish.ready ? "running" : "stopped",
    simulator: simulator ? (simulator.running ? "running" : "stopped") : "idle",
  });
});

// --- Simulator REST API ---
app.post("/api/simulator/start", async (req, res) => {
  try {
    if (simulator && simulator.running) {
      return res.json({ ok: false, message: "Simulator already running" });
    }
    const boards = Math.min(Math.max(parseInt(req.body.boards) || 4, 1), 20);
    const speedMap = { "1": 1000, "2": 3000, "3": 6000 };
    const speed = speedMap[String(req.body.speed)] || 3000;
    const round = Math.max(parseInt(req.body.round) || 1, 1);
    const eventName = req.body.eventName || "Live Broadcast";

    simulator = new GameSimulator("./Live", { round, updateInterval: speed, eventName });
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

    const message = JSON.stringify({
      type: "game_update",
      round,
      board: boardNumber,
      data: gameData,
      timestamp: new Date().toISOString(),
    });

    // Send to all connected clients
    let sentCount = 0;
    clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(message);
        sentCount++;
      }
    });

    if (DEBUG)
      console.log(
        `📤 Broadcast to ${sentCount} clients - Board ${boardNumber}`,
      );

    // Queue Stockfish evaluation for this position
    if (gameData.fen && stockfish.ready) {
      stockfish.evaluate(boardNumber, gameData.fen).then((evalResult) => {
        if (!evalResult) return;
        const evalMsg = JSON.stringify({
          type: "eval_update",
          board: boardNumber,
          evaluation: evalResult,
          fen: gameData.fen,
        });
        clients.forEach((client) => {
          if (client.readyState === 1) client.send(evalMsg);
        });
      });
    }
  } catch (error) {
    console.error(`Error broadcasting update: ${error.message}`);
  }
}

// Handle client messages
function handleClientMessage(ws, data) {
  switch (data.type) {
    case "subscribe_round":
      // Client wants to subscribe to a specific round
      const round = data.round;
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

// Cleanup on server shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...");

  // Stop Stockfish
  stockfish.stop();

  // Close all file watchers
  boardWatchers.forEach((watcher) => {
    watcher.close();
  });

  // Close all client connections
  clients.forEach((client) => {
    client.close();
  });

  process.exit(0);
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
