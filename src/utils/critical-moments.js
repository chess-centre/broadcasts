/**
 * Detect critical moments by comparing consecutive evaluations.
 * Returns annotation type or null.
 */
export function detectCriticalMoment(currentEval, prevEval) {
  if (!currentEval || !prevEval) return null;
  if (currentEval.type === "mate" || prevEval.type === "mate") {
    // Mate found or lost — always critical
    if (prevEval.type !== "mate" && currentEval.type === "mate") {
      return { type: currentEval.value > 0 ? "brilliant" : "blunder", swing: 9999 };
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

  // Determine if swing is in favor of or against the side that just moved
  // A big negative swing (position got worse) = blunder/mistake
  // A big positive swing (position improved dramatically) could be brilliant or opponent blundered
  if (swing >= 300) return { type: "blunder", swing };
  if (swing >= 200) return { type: "mistake", swing };
  if (swing >= 150) return { type: "inaccuracy", swing };

  return null;
}
