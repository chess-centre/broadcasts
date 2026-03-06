import { useState, useEffect, useRef, useCallback } from "react";

interface GameData {
  status: string;
}

interface EvalData {
  type: "cp" | "mate";
  value: number;
  prevEval?: { type: "cp" | "mate"; value: number } | null;
}

interface AutoCycleOptions {
  intervalSeconds?: number;
  leaderboardEveryN?: number;
}

export function useAutoCycle(
  games: Map<number, GameData>,
  evals: Map<number, EvalData>,
  options: AutoCycleOptions = {}
) {
  const { intervalSeconds = 30, leaderboardEveryN = 3 } = options;
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const cycleCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevBoardRef = useRef<number | null>(null);

  const getSortedBoards = useCallback(() => {
    const boards: { boardNum: number; priority: number }[] = [];
    games.forEach((game, boardNum) => {
      let priority = 0;
      if (game.status === "ongoing") priority += 100;

      const evalData = evals.get(boardNum);
      if (evalData) {
        if (evalData.type === "mate") priority += 200;
        if (evalData.type === "cp" && Math.abs(evalData.value) < 100) priority += 50;
        if (
          evalData.prevEval &&
          evalData.prevEval.type === "cp" &&
          evalData.type === "cp"
        ) {
          priority += Math.min(
            Math.abs(evalData.value - evalData.prevEval.value),
            200
          );
        }
      }
      boards.push({ boardNum, priority });
    });
    return boards.sort((a, b) => b.priority - a.priority);
  }, [games, evals]);

  const cycleNext = useCallback(() => {
    cycleCountRef.current++;

    if (cycleCountRef.current % leaderboardEveryN === 0) {
      setShowLeaderboard(true);
      setCurrentBoard(null);
      return;
    }

    setShowLeaderboard(false);
    const sorted = getSortedBoards();
    if (sorted.length === 0) return;

    const next =
      sorted.find((b) => b.boardNum !== prevBoardRef.current) || sorted[0];
    prevBoardRef.current = next.boardNum;
    setCurrentBoard(next.boardNum);
  }, [getSortedBoards, leaderboardEveryN]);

  useEffect(() => {
    if (!isAutoCycling) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    cycleNext();
    timerRef.current = setInterval(cycleNext, intervalSeconds * 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoCycling, intervalSeconds, cycleNext]);

  const toggle = useCallback(() => setIsAutoCycling((v) => !v), []);

  const stop = useCallback(() => {
    setIsAutoCycling(false);
    setCurrentBoard(null);
    setShowLeaderboard(false);
    cycleCountRef.current = 0;
    prevBoardRef.current = null;
  }, []);

  return { currentBoard, showLeaderboard, isAutoCycling, toggle, stop };
}
