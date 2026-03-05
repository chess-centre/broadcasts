import { useEffect, useMemo } from "react";
import { usePGN } from "../../hooks/usePgn";

function surname(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function formatResult(result) {
  if (result === "1/2-1/2") return "\u00BD-\u00BD";
  return result;
}

export default function OBSTickerWidget({ round }) {
  const { games, subscribeToRound } = usePGN();

  useEffect(() => {
    if (round) subscribeToRound(Number(round));
  }, [round, subscribeToRound]);

  const tickerText = useMemo(() => {
    const finished = [];
    games.forEach((game) => {
      if (game.gameResult && game.gameResult !== "*") {
        finished.push(
          `${surname(game.whiteInfo?.name)} ${formatResult(game.gameResult)} ${surname(game.blackInfo?.name)}`
        );
      }
    });
    if (finished.length === 0) return "Waiting for results...";
    return finished.join("  \u2022  ");
  }, [games]);

  return (
    <div className="fixed inset-x-0 bottom-0 overflow-hidden">
      <div className="py-2 whitespace-nowrap">
        <span
          className="inline-block text-sm text-white font-mono tracking-wide"
          style={{ animation: "ticker 20s linear infinite" }}
        >
          {tickerText}
        </span>
      </div>
    </div>
  );
}
