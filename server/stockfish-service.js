const { spawn } = require("child_process");

const DEPTH = 16;

class StockfishService {
  constructor() {
    this.process = null;
    this.ready = false;
    this.queue = []; // [{boardId, fen, resolve}]
    this.processing = false;
    this.currentResolve = null;
    this.currentResult = null;
    this.buffer = "";
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
      console.log("Stockfish ready");
      this.processNext();
      return;
    }

    // Parse "info depth N ... score cp X" or "score mate X"
    const infoMatch = line.match(
      /^info\s+.*\bdepth\s+(\d+)\b.*\bscore\s+(cp|mate)\s+(-?\d+)/,
    );
    if (infoMatch) {
      const depth = parseInt(infoMatch[1]);
      const type = infoMatch[2];
      const value = parseInt(infoMatch[3]);
      this.currentResult = { depth, type, value };
    }

    // "bestmove" signals completion
    if (line.startsWith("bestmove")) {
      const resolve = this.currentResolve;
      const result = this.currentResult;
      this.currentResolve = null;
      this.currentResult = null;
      this.processing = false;

      if (resolve) resolve(result);
      this.processNext();
    }
  }

  processNext() {
    if (this.processing || this.queue.length === 0 || !this.ready) return;

    const { fen, resolve } = this.queue.shift();
    this.processing = true;
    this.currentResolve = resolve;
    this.currentResult = null;

    this.send("ucinewgame");
    this.send(`position fen ${fen}`);
    this.send(`go depth ${DEPTH}`);
  }

  /**
   * Evaluate a FEN position. Returns a Promise that resolves with
   * {depth, type, value} where type is "cp" or "mate".
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
