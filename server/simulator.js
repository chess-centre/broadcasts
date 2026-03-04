#!/usr/bin/env node

const { Chess } = require("chess.js");
const PGNGenerator = require("./pgn-generator");
const mockData = require("./mock-data");
const famousGames = require("./famous-games");
const readline = require("readline");

class GameSimulator {
  constructor(basePath = "./Live", options = {}) {
    this.generator = new PGNGenerator(basePath);
    this.basePath = basePath;
    this.games = [];
    this.round = options.round || 1;
    this.eventName = options.eventName || "Live Broadcast";
    this.updateInterval = options.updateInterval || 3000;
    this.intervalId = null;
    this.running = false;
  }

  async initializeGames(count, options = {}) {
    console.log(`\nChess Game Simulator\n${"=".repeat(50)}`);
    console.log(`Location: ${this.basePath}/round-${this.round}/`);
    console.log(`Boards: ${count}`);
    console.log(`Update interval: ${this.updateInterval / 1000}s\n`);

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

  async updateGames() {
    const ongoingGames = this.games.filter((g) => g.status === "ongoing");

    if (ongoingGames.length === 0) {
      console.log("\nAll games finished!");
      this.stop();
      return;
    }

    for (const game of ongoingGames) {
      this.makeMove(game);
      await this.updateGameFile(game);
    }

    const finished = this.games.filter((g) => g.status === "finished").length;
    console.log(
      `[${new Date().toLocaleTimeString()}] ${ongoingGames.length} active, ${finished} finished`,
    );
  }

  async start() {
    if (this.running) return;
    this.running = true;
    console.log("Starting live simulation...\n");

    this.intervalId = setInterval(async () => {
      await this.updateGames();
    }, this.updateInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
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

  const speedInput = await question("Update speed? (1=fast, 2=normal, 3=slow) [default: 2]: ");
  const speedMap = { 1: 2000, 2: 4000, 3: 8000 };
  const speed = speedMap[speedInput] || 4000;

  rl.close();

  const simulator = new GameSimulator("./Live", { round: 1, updateInterval: speed });
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
  const simulator = new GameSimulator("./Live", { round: 1, updateInterval: 3000 });
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
