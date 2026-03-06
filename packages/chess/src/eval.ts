import { Chess } from "chess.js";

export function evalToPercent(type: "cp" | "mate", value: number): number {
  if (type === "mate") return value > 0 ? 100 : 0;
  return 100 / (1 + Math.exp(-0.004 * value));
}

export function formatScore(type: "cp" | "mate" | null, value: number): string {
  if (!type) return "";
  if (type === "mate") return `M${Math.abs(value)}`;
  const pawns = value / 100;
  const sign = pawns > 0 ? "+" : "";
  return `${sign}${pawns.toFixed(1)}`;
}

export function uciToSan(fen: string, uciMoves: string[], maxMoves = 5): string {
  if (!fen || !uciMoves?.length) return "";
  try {
    const chess = new Chess(fen);
    const sans: string[] = [];
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
