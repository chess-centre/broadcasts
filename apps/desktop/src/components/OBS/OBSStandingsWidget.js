import { useEffect } from "react";
import { usePGN } from "../../hooks/usePgn";
import LiveLeaderboard from "../Shared/LiveLeaderboard";

export default function OBSStandingsWidget({ round }) {
  const { subscribeToRound } = usePGN();

  useEffect(() => {
    if (round) subscribeToRound(Number(round));
  }, [round, subscribeToRound]);

  return (
    <div className="p-4 max-w-sm mx-auto">
      <LiveLeaderboard />
    </div>
  );
}
