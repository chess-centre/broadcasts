import { useEffect } from "react";
import { usePGN } from "../../hooks/usePgn";
import ChessGame from "../Viewer/Game";
import useFeaturedBoard from "../../hooks/useFeaturedBoard";

export default function OBSBoardWidget({ board, round, featured }) {
  const { games, evals, subscribeToRound } = usePGN();
  const featuredBoard = useFeaturedBoard(games, evals);

  useEffect(() => {
    if (round) subscribeToRound(Number(round));
  }, [round, subscribeToRound]);

  const boardNum = featured ? featuredBoard : Number(board);

  if (!boardNum) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-xs">
        Waiting for board data...
      </div>
    );
  }

  return (
    <div className="p-2">
      <ChessGame round={Number(round) || 1} board={boardNum} onClick={() => {}} />
    </div>
  );
}
