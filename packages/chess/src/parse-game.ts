import { parse as newParse } from "@mliebelt/pgn-parser";
import { Chess } from "chess.js";

export interface PlayerInfo {
  name: string;
  rating: string;
}

export interface ParsedGame {
  pgn: string;
  gameResult: string;
  whiteInfo: PlayerInfo;
  blackInfo: PlayerInfo;
  whiteClock: string;
  blackClock: string;
  fen?: string;
  event?: string;
  round?: string;
  date?: string;
  moveCount?: number;
  currentMove?: number;
  status: string;
  error?: string;
}

export function parseGame(pgn: string): ParsedGame {
  try {
    const parsed = newParse(pgn)[0];
    const tags = parsed.tags || {};
    const moves: any[] = parsed.moves || [];

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

    let whiteClock = "00:00:00";
    let blackClock = "00:00:00";

    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      const clocks = extractClockTimes(lastMove);
      if (clocks) {
        if (moves.length % 2 === 0) blackClock = clocks.clock || blackClock;
        else whiteClock = clocks.clock || whiteClock;
      }

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

    const chess = new Chess();
    for (const move of moves) {
      const notation = move.notation && move.notation.notation;
      if (!notation) break;
      const result = chess.move(notation);
      if (!result) break;
    }

    const fen = chess.fen();
    const moveCount = moves.length;
    const currentMove = moveCount > 0 ? Math.ceil(moveCount / 2) : 0;

    return {
      gameResult: Result,
      whiteInfo: { name: White, rating: WhiteElo },
      blackInfo: { name: Black, rating: BlackElo },
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
  } catch (e: any) {
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

function extractClockTimes(move: any): { clock: string } | null {
  if (!move) return null;
  if (move.commentDiag && move.commentDiag.clk) {
    return { clock: move.commentDiag.clk };
  }
  if (move.commentAfter) {
    const clkMatch = move.commentAfter.match(/\[%clk\s+(\d+:\d+:\d+)\]/);
    if (clkMatch) return { clock: clkMatch[1] };
  }
  return null;
}

function findLastWhiteMove(moves: any[]): any | null {
  for (let i = moves.length - 1; i >= 0; i--) {
    if (i % 2 === 0) return moves[i];
  }
  return null;
}

function findLastBlackMove(moves: any[]): any | null {
  for (let i = moves.length - 1; i >= 0; i--) {
    if (i % 2 === 1) return moves[i];
  }
  return null;
}

function formatClockTime(time: string): string {
  if (!time) return "00:00:00";
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(time)) {
    const parts = time.split(":");
    return `${parts[0].padStart(2, "0")}:${parts[1]}:${parts[2]}`;
  }
  return time;
}
