const { spawn } = require("child_process");

class StockfishService {
  constructor(options = {}) {
    this.process = null;
    this.ready = false;
    this.queue = []; // [{boardId, fen, resolve}]
    this.processing = false;
    this.currentResolve = null;
    this.currentResult = null;
    this.currentLines = new Map(); // Map<pvRank, lineData>
    this.buffer = "";
    this.multiPV = options.multiPV || 3;
    this.depth = options.depth || 16;
  }

  start() {
    if (this.process) return;

    try {
      this.process = spawn("stockfish", [], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      this.process.stdout.on("data", (data) => {
        this.buffer += data.toString();
        const lines = this.buffer.split("\n");
        // Keep the last incomplete line in buffer
        this.buffer = lines.pop();
        for (const line of lines) {
          this.handleLine(line.trim());
        }
      });

      this.process.stderr.on("data", (data) => {
        // Stockfish sometimes writes to stderr on startup, ignore
      });

      this.process.on("error", (err) => {
        console.error("Stockfish process error:", err.message);
        this.process = null;
        this.ready = false;
      });

      this.process.on("close", (code) => {
        console.log(`Stockfish process exited (code ${code})`);
        this.process = null;
        this.ready = false;
      });

      this.send("uci");
    } catch (err) {
      console.error("Failed to spawn stockfish:", err.message);
      console.error("Install with: brew install stockfish");
    }
  }

  send(cmd) {
    if (this.process && this.process.stdin.writable) {
      this.process.stdin.write(cmd + "\n");
    }
  }

  handleLine(line) {
    if (line === "uciok") {
      this.ready = true;
      this.send(`setoption name MultiPV value ${this.multiPV}`);
      console.log(`Stockfish ready (MultiPV ${this.multiPV}, depth ${this.depth})`);
      this.processNext();
      return;
    }

    // Parse info lines: depth, multipv rank, score, and pv moves
    const infoMatch = line.match(
      /^info\s+.*\bdepth\s+(\d+)\b.*\bscore\s+(cp|mate)\s+(-?\d+)/,
    );
    if (infoMatch) {
      const depth = parseInt(infoMatch[1]);
      const type = infoMatch[2];
      const value = parseInt(infoMatch[3]);

      // Extract multipv rank (defaults to 1 if not present)
      const pvRankMatch = line.match(/\bmultipv\s+(\d+)/);
      const pvRank = pvRankMatch ? parseInt(pvRankMatch[1]) : 1;

      // Extract pv move sequence
      const pvMatch = line.match(/\bpv\s+(.+)$/);
      const pv = pvMatch ? pvMatch[1].trim().split(/\s+/) : [];

      this.currentLines.set(pvRank, { rank: pvRank, depth, type, value, pv });

      // Line 1 is always the main result (backward compatible)
      if (pvRank === 1) {
        this.currentResult = { depth, type, value };
      }
    }

    // "bestmove" signals completion
    if (line.startsWith("bestmove")) {
      const resolve = this.currentResolve;
      const result = this.currentResult;
      const lines = Array.from(this.currentLines.values()).sort(
        (a, b) => a.rank - b.rank,
      );

      this.currentResolve = null;
      this.currentResult = null;
      this.currentLines = new Map();
      this.processing = false;

      if (resolve) resolve(result ? { ...result, lines } : null);
      this.processNext();
    }
  }

  processNext() {
    if (this.processing || this.queue.length === 0 || !this.ready) return;

    const { fen, resolve } = this.queue.shift();
    this.processing = true;
    this.currentResolve = resolve;
    this.currentResult = null;
    this.currentLines = new Map();

    this.send("ucinewgame");
    this.send(`position fen ${fen}`);
    this.send(`go depth ${this.depth}`);
  }

  /**
   * Evaluate a FEN position. Returns a Promise that resolves with
   * {depth, type, value, lines} where type is "cp" or "mate".
   * Deduplicates by boardId — only the latest request per board is kept.
   */
  evaluate(boardId, fen) {
    if (!this.process || !this.ready) {
      return Promise.resolve(null);
    }

    // Remove any pending entry for this board (only latest matters)
    this.queue = this.queue.filter((item) => item.boardId !== boardId);

    return new Promise((resolve) => {
      this.queue.push({ boardId, fen, resolve });
      if (!this.processing) {
        this.processNext();
      }
    });
  }

  stop() {
    if (this.process) {
      this.send("quit");
      this.process = null;
      this.ready = false;
    }
    // Resolve any pending promises with null
    for (const item of this.queue) {
      item.resolve(null);
    }
    this.queue = [];
    if (this.currentResolve) {
      this.currentResolve(null);
      this.currentResolve = null;
    }
  }
}

module.exports = StockfishService;
