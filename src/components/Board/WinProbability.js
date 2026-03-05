import { useMemo } from "react";
import { evalToPercent } from "../../utils/eval";

export default function WinProbability({ evaluation }) {
  const normalized = useMemo(() => {
    if (!evaluation) return null;
    const { type, value } = evaluation;
    // Always use the FEN the eval was computed for to avoid wild swings
    // when a game_update arrives before the next eval_update.
    const evalFen = evaluation.fen;
    const parts = evalFen ? evalFen.split(" ") : [];
    const sideToMove = parts[1] || "w";
    const normalizedValue = sideToMove === "b" ? -value : value;
    return { type, value: normalizedValue };
  }, [evaluation]);

  const whitePercent = normalized
    ? Math.round(evalToPercent(normalized.type, normalized.value))
    : 50;

  return (
    <div className="px-3 pb-1">
      <div className="h-1.5 w-full flex rounded-full overflow-hidden">
        <div
          className="bg-slate-200 transition-all duration-500"
          style={{ width: `${whitePercent}%` }}
        />
        <div
          className="bg-slate-600 transition-all duration-500"
          style={{ width: `${100 - whitePercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className="text-[9px] text-slate-500 tabular-nums">{whitePercent}%</span>
        <span className="text-[9px] text-slate-500 tabular-nums">{100 - whitePercent}%</span>
      </div>
    </div>
  );
}
