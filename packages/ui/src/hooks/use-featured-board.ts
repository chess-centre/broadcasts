import { useMemo, useRef, useEffect } from "react";

interface GameData {
  status: string;
}

interface EvalData {
  type: "cp" | "mate";
  value: number;
}

export function useFeaturedBoard(
  games: Map<number, GameData>,
  evals: Map<number, EvalData>
): number | null {
  const evalHistoryRef = useRef(new Map<number, EvalData[]>());

  useEffect(() => {
    evals.forEach((evalData, board) => {
      const history = evalHistoryRef.current.get(board) || [];
      history.push(evalData);
      if (history.length > 20) history.shift();
      evalHistoryRef.current.set(board, history);
    });
  }, [evals]);

  return useMemo(() => {
    let bestBoard: number | null = null;
    let bestScore = -Infinity;

    games.forEach((game, board) => {
      if (game.status !== "ongoing") return;
      const history = evalHistoryRef.current.get(board) || [];
      let score = 0;

      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const curr = history[i];
        if (prev.type === "cp" && curr.type === "cp") {
          score += Math.abs((curr.value || 0) - (prev.value || 0));
        }
      }

      const lastEval = history[history.length - 1];
      if (lastEval && lastEval.type === "cp" && Math.abs(lastEval.value) < 100) {
        score += 50;
      }
      if (lastEval && lastEval.type === "mate") {
        score += 200;
      }

      if (score > bestScore) {
        bestScore = score;
        bestBoard = board;
      }
    });

    return bestBoard;
  }, [games, evals]);
}
