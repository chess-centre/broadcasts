import { Chess } from "chess.js";

/**
 * Map centipawn score to percentage (0-100) for the white portion.
 * Sigmoid: 0cp→50%, +500cp→~88%, -500cp→~12%, mate→100%/0%.
 */
export function evalToPercent(type, value) {
  if (type === "mate") return value > 0 ? 100 : 0;
  return 100 / (1 + Math.exp(-0.004 * value));
}

export function formatScore(type, value) {
  if (!type) return "";
  if (type === "mate") return `M${Math.abs(value)}`;
  const pawns = value / 100;
  const sign = pawns > 0 ? "+" : "";
  return `${sign}${pawns.toFixed(1)}`;
}

/**
 * Convert UCI move sequence to SAN notation for display.
 * @param {string} fen - Current position FEN
 * @param {string[]} uciMoves - Array of UCI moves like ["e2e4", "e7e5"]
 * @param {number} maxMoves - Maximum moves to convert
 * @returns {string} - Space-separated SAN string like "e4 e5 Nf3"
 */
export function uciToSan(fen, uciMoves, maxMoves = 5) {
  if (!fen || !uciMoves?.length) return "";
  try {
    const chess = new Chess(fen);
    const sans = [];
    for (let i = 0; i < Math.min(uciMoves.length, maxMoves); i++) {
      const uci = uciMoves[i];
      const from = uci.substring(0, 2);
      const to = uci.substring(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const move = chess.move({ from, to, promotion });
      if (!move) break;
      sans.push(move.san);
    }
    return sans.join(" ");
  } catch {
    return uciMoves.slice(0, maxMoves).join(" ");
  }
}
