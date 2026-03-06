#!/usr/bin/env node

const { Chess } = require("chess.js");
const PGNGenerator = require("./pgn-generator");
const mockData = require("./mock-data");
const famousGames = require("./famous-games");
const readline = require("readline");

// Speed ranges in milliseconds [min, max]
const SPEED_RANGES = {
  fast:   [1000,  10000],
  normal: [8000,  25000],
  slow:   [20000, 60000],
};

function randomDelay(speed) {
  const [min, max] = SPEED_RANGES[speed] || SPEED_RANGES.normal;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class GameSimulator {
  constructor(basePath = "./Live", options = {}) {
    this.generator = new PGNGenerator(basePath);
    this.basePath = basePath;
    this.games = [];
    this.round = options.round || 1;
    this.eventName = options.eventName || "Live Broadcast";
    this.speed = options.speed || "normal";
    this.boardTimers = new Map(); // boardNumber -> timeout id
    this.running = false;
  }

  async initializeGames(count) {
    console.log(`\nChess Game Simulator\n${"=".repeat(50)}`);
    console.log(`Location: ${this.basePath}/round-${this.round}/`);
    console.log(`Boards: ${count}`);
    console.log(`Speed: ${this.speed} (${SPEED_RANGES[this.speed][0] / 1000}-${SPEED_RANGES[this.speed][1] / 1000}s per move)\n`);

    // Pick games from famous games collection, shuffled
    const shuffled = [...famousGames].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      const source = shuffled[i % shuffled.length];
      const timeControl = mockData.getTimeControl();
      const chess = new Chess();

      const game = {
        boardNumber: i + 1,
        white: source.white,
        black: source.black,
        event: source.event,
        chess,
        allMoves: source.moves,
        moveIndex: 0,
        whiteTimeSeconds: mockData.timeToSeconds(timeControl.initial),
        blackTimeSeconds: mockData.timeToSeconds(timeControl.initial),
        increment: timeControl.increment,
        finalResult: source.result,
        result: "*",
        status: "ongoing",
      };

      this.games.push(game);
      await this.updateGameFile(game);

      console.log(
        `  Board ${i + 1}: ${source.white.name} vs ${source.black.name} (${source.moves.length} plies)`,
      );
    }

    console.log(`\nAll games initialized!\n`);
  }

  async updateGameFile(game) {
    const history = game.chess.history();
    const pgn = this.generator.generatePGN({
      white: game.white,
      black: game.black,
      result: game.result,
      event: this.eventName,
      round: this.round.toString(),
      moves: history,
      whiteTime: mockData.secondsToTime(game.whiteTimeSeconds),
      blackTime: mockData.secondsToTime(game.blackTimeSeconds),
    });

    await this.generator.writeGameFile(this.round, game.boardNumber, pgn);
  }

  makeMove(game) {
    if (game.moveIndex >= game.allMoves.length) {
      game.result = game.finalResult !== "*" ? game.finalResult : "1/2-1/2";
      game.status = "finished";
      return;
    }

    const san = game.allMoves[game.moveIndex];
    const move = game.chess.move(san);

    if (!move) {
      game.result = game.finalResult !== "*" ? game.finalResult : "1/2-1/2";
      game.status = "finished";
      return;
    }

    game.moveIndex++;

    // Simulate realistic clock usage (5-60s per move)
    const moveTime = Math.floor(Math.random() * 55) + 5;
    const movedWhite = game.chess.turn() === "b";
    if (movedWhite) {
      game.whiteTimeSeconds = Math.max(60, game.whiteTimeSeconds - moveTime + game.increment);
    } else {
      game.blackTimeSeconds = Math.max(60, game.blackTimeSeconds - moveTime + game.increment);
    }

    // Check if this was the last move
    if (game.moveIndex >= game.allMoves.length) {
      game.result = game.finalResult !== "*" ? game.finalResult : "*";
      if (game.result !== "*") game.status = "finished";
    }
  }

  scheduleBoardMove(game) {
    if (!this.running || game.status !== "ongoing") return;

    const delay = randomDelay(this.speed);
    const timerId = setTimeout(async () => {
      if (!this.running || game.status !== "ongoing") return;

      this.makeMove(game);
      await this.updateGameFile(game);

      const ply = game.chess.history().length;
      const moveNum = Math.ceil(ply / 2);
      console.log(
        `[${new Date().toLocaleTimeString()}] Board ${game.boardNumber}: move ${moveNum} (next in ${(delay / 1000).toFixed(1)}s)${game.status === "finished" ? " — FINISHED " + game.result : ""}`,
      );

      if (game.status === "ongoing") {
        this.scheduleBoardMove(game);
      } else {
        this.boardTimers.delete(game.boardNumber);
        this.checkAllFinished();
      }
    }, delay);

    this.boardTimers.set(game.boardNumber, timerId);
  }

  checkAllFinished() {
    const allDone = this.games.every((g) => g.status === "finished");
    if (allDone) {
      console.log("\nAll games finished!");
      this.stop();
    }
  }

  async start() {
    if (this.running) return;
    this.running = true;
    console.log("Starting live simulation...\n");

    // Schedule each board independently
    for (const game of this.games) {
      if (game.status === "ongoing") {
        this.scheduleBoardMove(game);
      }
    }
  }

  stop() {
    this.running = false;
    // Clear all board timers
    for (const [, timerId] of this.boardTimers) {
      clearTimeout(timerId);
    }
    this.boardTimers.clear();
    console.log("\nSimulation stopped\n");
  }

  printSummary() {
    console.log("\nFinal Summary");
    console.log("=".repeat(50));
    this.games.forEach((game) => {
      const ply = game.chess.history().length;
      console.log(
        `  Board ${game.boardNumber}: ${game.white.name} vs ${game.black.name} - ${game.result} (${Math.ceil(ply / 2)} moves)`,
      );
    });
    console.log("");
  }
}

async function runInteractive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

  console.clear();
  console.log("\nChess Broadcast Simulator\n");

  const boardCount = await question("How many boards? (1-8) [default: 4]: ");
  const boards = Math.min(parseInt(boardCount) || 4, 8);

  const speedInput = await question("Speed? (1=fast 1-10s, 2=normal 8-25s, 3=slow 20-60s) [default: 2]: ");
  const speedMap = { "1": "fast", "2": "normal", "3": "slow" };
  const speed = speedMap[speedInput] || "normal";

  rl.close();

  const simulator = new GameSimulator("./Live", { round: 1, speed });
  await simulator.initializeGames(boards);
  await simulator.start();

  process.on("SIGINT", () => {
    simulator.stop();
    simulator.printSummary();
    process.exit(0);
  });

  console.log("Press Ctrl+C to stop simulation\n");
}

async function runQuick(boards = 4) {
  console.clear();
  const simulator = new GameSimulator("./Live", { round: 1, speed: "normal" });
  await simulator.initializeGames(Math.min(boards, 8));
  await simulator.start();

  process.on("SIGINT", () => {
    simulator.stop();
    simulator.printSummary();
    process.exit(0);
  });

  console.log("Press Ctrl+C to stop simulation\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log("\nUsage:");
    console.log("  npm run simulate           # Interactive mode");
    console.log("  npm run simulate:quick     # Quick start with 4 boards");
    console.log("\n");
    process.exit(0);
  }

  if (args.includes("--quick") || args.includes("-q")) {
    const boards = parseInt(args[1]) || 4;
    runQuick(boards);
  } else {
    runInteractive();
  }
}

module.exports = GameSimulator;
