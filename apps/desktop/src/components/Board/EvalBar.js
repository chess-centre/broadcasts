import { useMemo } from "react";
import { evalToPercent, formatScore } from "../../utils/eval";

export default function EvalBar({ evaluation }) {
  const normalized = useMemo(() => {
    if (!evaluation) return null;
    const { type, value } = evaluation;
    // Always use the FEN the eval was computed for, not the board's current FEN.
    // Otherwise a game_update (new FEN, side flips) before the next eval_update
    // causes the normalization to flip the sign and the bar swings wildly.
    const evalFen = evaluation.fen;
    const parts = evalFen ? evalFen.split(" ") : [];
    const sideToMove = parts[1] || "w";
    const normalizedValue = sideToMove === "b" ? -value : value;
    return { type, value: normalizedValue };
  }, [evaluation]);

  const whitePercent = normalized
    ? evalToPercent(normalized.type, normalized.value)
    : 50;

  const scoreText = normalized
    ? formatScore(normalized.type, normalized.value)
    : "";

  const scoreOnWhiteSide = whitePercent >= 50;

  return (
    <div className="eval-bar-container">
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
