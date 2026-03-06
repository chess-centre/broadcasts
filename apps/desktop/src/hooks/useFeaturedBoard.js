import { useMemo, useRef, useEffect } from "react";

/**
 * Determine the most "interesting" ongoing game based on eval volatility
 * and position balance.
 */
export default function useFeaturedBoard(games, evals) {
  const evalHistoryRef = useRef(new Map());

  useEffect(() => {
    evals.forEach((evalData, board) => {
      const history = evalHistoryRef.current.get(board) || [];
      history.push(evalData);
      if (history.length > 20) history.shift();
      evalHistoryRef.current.set(board, history);
    });
  }, [evals]);

  return useMemo(() => {
    let bestBoard = null;
    let bestScore = -Infinity;

    games.forEach((game, board) => {
      if (game.status !== "ongoing") return;
      const history = evalHistoryRef.current.get(board) || [];
      let score = 0;

      // Eval volatility in recent moves
      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const curr = history[i];
        if (prev.type === "cp" && curr.type === "cp") {
          score += Math.abs((curr.value || 0) - (prev.value || 0));
        }
      }

      // Bonus for balanced positions
      const lastEval = history[history.length - 1];
      if (lastEval && lastEval.type === "cp" && Math.abs(lastEval.value) < 100) {
        score += 50;
      }

      // Bonus for mate threats
      if (lastEval && lastEval.type === "mate") {
        score += 200;
      }

      if (score > bestScore) {
        bestScore = score;
        bestBoard = board;
      }
    });

    return bestBoard;
  }, [games]); // eslint-disable-line react-hooks/exhaustive-deps
}
