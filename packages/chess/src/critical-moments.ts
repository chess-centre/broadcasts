export type EvalData = { type: "cp" | "mate"; value: number };
export type CriticalMoment = {
  type: "brilliant" | "blunder" | "mistake" | "inaccuracy";
  swing: number;
};

export function detectCriticalMoment(
  currentEval: EvalData | null,
  prevEval: EvalData | null
): CriticalMoment | null {
  if (!currentEval || !prevEval) return null;

  if (currentEval.type === "mate" || prevEval.type === "mate") {
    if (prevEval.type !== "mate" && currentEval.type === "mate") {
      return {
        type: currentEval.value > 0 ? "brilliant" : "blunder",
        swing: 9999,
      };
    }
    if (prevEval.type === "mate" && currentEval.type !== "mate") {
      return { type: "blunder", swing: 9999 };
    }
    return null;
  }

  const prevCp = prevEval.value || 0;
  const currCp = currentEval.value || 0;
  const swing = Math.abs(currCp - prevCp);

  if (swing < 150) return null;
  if (swing >= 300) return { type: "blunder", swing };
  if (swing >= 200) return { type: "mistake", swing };
  if (swing >= 150) return { type: "inaccuracy", swing };

  return null;
}
