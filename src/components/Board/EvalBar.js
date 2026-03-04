import { useMemo } from "react";

/**
 * Map centipawn score to percentage (0-100) for the white portion.
 * Sigmoid: 0cp→50%, +500cp→~88%, -500cp→~12%, mate→100%/0%.
 */
function evalToPercent(type, value) {
  if (type === "mate") return value > 0 ? 100 : 0;
  return 100 / (1 + Math.exp(-0.004 * value));
}

function formatScore(type, value) {
  if (!type) return "";
  if (type === "mate") return `M${Math.abs(value)}`;
  const pawns = value / 100;
  const sign = pawns > 0 ? "+" : "";
  return `${sign}${pawns.toFixed(1)}`;
}

export default function EvalBar({ evaluation, fen }) {
  // Normalize to White's perspective (Stockfish reports from side-to-move)
  const normalized = useMemo(() => {
    if (!evaluation) return null;
    const { type, value } = evaluation;
    const evalFen = fen || evaluation.fen;
    const parts = evalFen ? evalFen.split(" ") : [];
    const sideToMove = parts[1] || "w";
    const normalizedValue = sideToMove === "b" ? -value : value;
    return { type, value: normalizedValue };
  }, [evaluation, fen]);

  const whitePercent = normalized
    ? evalToPercent(normalized.type, normalized.value)
    : 50;

  const scoreText = normalized
    ? formatScore(normalized.type, normalized.value)
    : "";

  const scoreOnWhiteSide = whitePercent >= 50;

  return (
    <div className="eval-bar-container">
      {/* Black portion (top) */}
      <div
        className="eval-bar-black"
        style={{ height: `${100 - whitePercent}%` }}
      >
        {!scoreOnWhiteSide && scoreText && (
          <span className="eval-bar-score eval-bar-score-black">
            {scoreText}
          </span>
        )}
      </div>

      {/* White portion (bottom) */}
      <div
        className="eval-bar-white"
        style={{ height: `${whitePercent}%` }}
      >
        {scoreOnWhiteSide && scoreText && (
          <span className="eval-bar-score eval-bar-score-white">
            {scoreText}
          </span>
        )}
      </div>
    </div>
  );
}
