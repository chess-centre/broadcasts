const newParse = require("@mliebelt/pgn-parser").parse;
const { Chess } = require("chess.js");

/**
 * Parse PGN data and extract game information including clock times
 * DGT LiveChess includes clock info in comments like [%clk 0:45:00]
 */
function parseGame(pgn) {
  try {
    const parsed = newParse(pgn)[0];
    const tags = parsed.tags || {};
    const moves = parsed.moves || [];

    // Extract basic game info
    const {
      White = "Unknown",
      Black = "Unknown",
      Result = "*",
      WhiteElo = "",
      BlackElo = "",
      Event = "",
      Round = "",
      Date = "",
    } = tags;

    // Extract clock times from the last move's comment
    let whiteClock = "00:00:00";
    let blackClock = "00:00:00";

    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      const clocks = extractClockTimes(lastMove);

      if (clocks) {
        // Last move determines whose clock is showing
        // If it's white's move (odd number), show black's clock, and vice versa
        if (moves.length % 2 === 0) {
          blackClock = clocks.clock || blackClock;
        } else {
          whiteClock = clocks.clock || whiteClock;
        }
      }

      // Try to get both clocks from recent moves
      const whiteClockMove = findLastWhiteMove(moves);
      const blackClockMove = findLastBlackMove(moves);

      if (whiteClockMove) {
        const wClock = extractClockTimes(whiteClockMove);
        if (wClock) whiteClock = wClock.clock || whiteClock;
      }

      if (blackClockMove) {
        const bClock = extractClockTimes(blackClockMove);
        if (bClock) blackClock = bClock.clock || blackClock;
      }
    }

    // Replay moves to get FEN
    const chess = new Chess();
    for (const move of moves) {
      const notation = move.notation && move.notation.notation;
      if (!notation) break;
      const result = chess.move(notation);
      if (!result) break;
    }
    const fen = chess.fen();

    // Count moves
    const moveCount = moves.length;
    const currentMove = moveCount > 0 ? Math.ceil(moveCount / 2) : 0;

    return {
      gameResult: Result,
      whiteInfo: {
        name: White,
        rating: WhiteElo,
      },
      blackInfo: {
        name: Black,
        rating: BlackElo,
      },
      whiteClock: formatClockTime(whiteClock),
      blackClock: formatClockTime(blackClock),
      fen,
      event: Event,
      round: Round,
      date: Date,
      moveCount,
      currentMove,
      pgn,
      status: Result === "*" ? "ongoing" : "finished",
    };
  } catch (e) {
    console.error("PGN parsing error:", e.message);
    return {
      pgn,
      gameResult: "*",
      whiteInfo: { name: "Unknown", rating: "" },
      blackInfo: { name: "Unknown", rating: "" },
      whiteClock: "00:00:00",
      blackClock: "00:00:00",
      status: "error",
      error: e.message,
    };
  }
}

/**
 * Extract clock time from move comment
 * DGT format: [%clk 0:45:30] or similar
 */
function extractClockTimes(move) {
  if (!move) return null;

  // @mliebelt/pgn-parser puts clock annotations in commentDiag.clk
  if (move.commentDiag && move.commentDiag.clk) {
    return { clock: move.commentDiag.clk };
  }

  // Fallback: check raw commentAfter string
  if (move.commentAfter) {
    const clkMatch = move.commentAfter.match(/\[%clk\s+(\d+:\d+:\d+)\]/);
    if (clkMatch) {
      return { clock: clkMatch[1] };
    }
  }

  return null;
}

/**
 * Find the last white move (odd index)
 */
function findLastWhiteMove(moves) {
  for (let i = moves.length - 1; i >= 0; i--) {
    if (i % 2 === 0) return moves[i];
  }
  return null;
}

/**
 * Find the last black move (even index)
 */
function findLastBlackMove(moves) {
  for (let i = moves.length - 1; i >= 0; i--) {
    if (i % 2 === 1) return moves[i];
  }
  return null;
}

/**
 * Format clock time to ensure consistent display
 */
function formatClockTime(time) {
  if (!time) return "00:00:00";

  // If already in correct format, return as-is
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
    const parts = time.split(":");
    return `${parts[0].padStart(2, "0")}:${parts[1]}:${parts[2]}`;
  }

  return time;
}

module.exports = parseGame;
