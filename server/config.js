require("dotenv").config();

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 8080,
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },
  dgt: {
    // Path to DGT LiveChess PGN output directory
    basePath: process.env.DGT_BASE_PATH || "C:/Users/user/Desktop/Live",
    // WebSocket API URL for DGT LiveChess
    liveChessApiUrl: process.env.DGT_API_URL || "ws://127.0.0.1:1982/api/v1.0",
    // Watch mode: 'files' for file watching, 'api' for direct WebSocket (future)
    watchMode: process.env.DGT_WATCH_MODE || "files",
  },
  broadcast: {
    // Maximum number of boards to track simultaneously
    maxBoards: parseInt(process.env.MAX_BOARDS) || 20,
    // Polling interval for file changes (ms)
    pollInterval: parseInt(process.env.POLL_INTERVAL) || 1000,
    // Enable debug logging
    debug: process.env.DEBUG === "true",
  },
};
