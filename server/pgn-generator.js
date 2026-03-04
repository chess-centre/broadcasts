const fs = require("fs").promises;
const path = require("path");
const mockData = require("./mock-data");

/**
 * PGN Generator Utility
 * Creates realistic PGN files for testing
 */

class PGNGenerator {
  constructor(basePath = "./Live") {
    this.basePath = basePath;
  }

  /**
   * Format moves into PGN notation with move numbers
   */
  formatMoves(movesArray, includeClocks = true, whiteTime, blackTime) {
    let pgn = "";
    let moveNumber = 1;

    for (let i = 0; i < movesArray.length; i++) {
      if (i % 2 === 0) {
        // White move
        pgn += `${moveNumber}. ${movesArray[i]}`;
        if (includeClocks && whiteTime) {
          pgn += ` {[%clk ${whiteTime}]}`;
        }
        pgn += " ";
      } else {
        // Black move
        pgn += `${movesArray[i]}`;
        if (includeClocks && blackTime) {
          pgn += ` {[%clk ${blackTime}]}`;
        }
        pgn += " ";
        moveNumber++;
      }
    }

    return pgn.trim();
  }

  /**
   * Generate a complete PGN file
   */
  generatePGN({
    white,
    black,
    result = "*",
    event = "Test Tournament",
    round = "1",
    date,
    moves,
    whiteTime,
    blackTime,
  }) {
    const pgnDate =
      date || new Date().toISOString().split("T")[0].replace(/-/g, ".");

    let pgn = "";
    pgn += `[Event "${event}"]\n`;
    pgn += `[Site "Chess Centre"]\n`;
    pgn += `[Date "${pgnDate}"]\n`;
    pgn += `[Round "${round}"]\n`;
    pgn += `[White "${white.name}"]\n`;
    pgn += `[Black "${black.name}"]\n`;
    pgn += `[Result "${result}"]\n`;
    if (white.rating) pgn += `[WhiteElo "${white.rating}"]\n`;
    if (black.rating) pgn += `[BlackElo "${black.rating}"]\n`;
    pgn += `[PlyCount "${moves.length}"]\n`;
    pgn += `[TimeControl "5400+30"]\n`;
    pgn += `\n`;

    // Format moves with clock times
    pgn += this.formatMoves(moves, true, whiteTime, blackTime);
    pgn += ` ${result}\n`;

    return pgn;
  }

  /**
   * Generate a game with random opening
   */
  generateRandomGame(boardNumber, options = {}) {
    const {
      white,
      black,
      result = "*",
      moveCount = 15,
      event = "Test Tournament",
      round = "1",
    } = options;

    // Get players
    const pairing =
      white && black ? { white, black } : mockData.generatePairing();

    // Generate opening
    const opening = mockData.generateOpening();
    const openingMoves = opening.moves
      .split(/\d+\.+/)
      .filter((m) => m.trim())
      .join(" ")
      .split(/\s+/)
      .filter((m) => m.trim());

    // Add more moves if needed
    const additionalMoves =
      moveCount > openingMoves.length
        ? mockData.generateMiddlegameMoves(moveCount - openingMoves.length)
        : [];

    const allMoves = [...openingMoves, ...additionalMoves].slice(0, moveCount);

    // Generate clock times
    const timeControl = mockData.getTimeControl();
    const whiteSeconds =
      mockData.timeToSeconds(timeControl.initial) -
      Math.floor(Math.random() * 600);
    const blackSeconds =
      mockData.timeToSeconds(timeControl.initial) -
      Math.floor(Math.random() * 600);

    return this.generatePGN({
      white: pairing.white,
      black: pairing.black,
      result,
      event,
      round,
      moves: allMoves,
      whiteTime: mockData.secondsToTime(whiteSeconds),
      blackTime: mockData.secondsToTime(blackSeconds),
    });
  }

  /**
   * Create directory structure
   */
  async createDirectories(round) {
    const roundPath = path.join(this.basePath, `round-${round}`);
    await fs.mkdir(roundPath, { recursive: true });
    return roundPath;
  }

  /**
   * Write PGN file
   */
  async writeGameFile(round, boardNumber, pgnContent) {
    const roundPath = await this.createDirectories(round);
    const filePath = path.join(roundPath, `game-${boardNumber}.pgn`);
    await fs.writeFile(filePath, pgnContent, "utf-8");
    return filePath;
  }

  /**
   * Generate multiple games
   */
  async generateMultipleGames(count, round = 1, options = {}) {
    console.log(`\n🎲 Generating ${count} mock games for round ${round}...`);

    const usedPlayers = [];
    const files = [];

    for (let i = 1; i <= count; i++) {
      const pairing = mockData.generatePairing(usedPlayers);
      usedPlayers.push(pairing.white, pairing.black);

      const pgn = this.generateRandomGame(i, {
        white: pairing.white,
        black: pairing.black,
        round: round.toString(),
        moveCount: options.moveCount || Math.floor(Math.random() * 30) + 10,
        result: options.ongoing ? "*" : mockData.getRandomResult(),
        event: options.event || "Mock Tournament",
      });

      const filePath = await this.writeGameFile(round, i, pgn);
      console.log(
        `  ✅ Board ${i}: ${pairing.white.name} vs ${pairing.black.name}`,
      );
      files.push(filePath);
    }

    console.log(
      `\n✨ Generated ${count} games in ${this.basePath}/round-${round}/\n`,
    );
    return files;
  }

  /**
   * Clear all mock data
   */
  async clearMockData() {
    try {
      await fs.rm(this.basePath, { recursive: true, force: true });
      console.log(`🗑️  Cleared mock data from ${this.basePath}`);
    } catch (error) {
      console.log(`⚠️  No mock data to clear`);
    }
  }
}

module.exports = PGNGenerator;
