import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useAutoCycle - manages TV/kiosk board rotation.
 *
 * Prioritises interesting boards (eval swings, ongoing, mate threats)
 * and periodically shows the leaderboard.
 */
export default function useAutoCycle(games, evals, options = {}) {
  const { intervalSeconds = 30, leaderboardEveryN = 3 } = options;
  const [isAutoCycling, setIsAutoCycling] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const cycleCountRef = useRef(0);
  const timerRef = useRef(null);
  const prevBoardRef = useRef(null);

  const getSortedBoards = useCallback(() => {
    const boards = [];
    games.forEach((game, boardNum) => {
      let priority = 0;
      if (game.status === "ongoing") priority += 100;

      const evalData = evals.get(boardNum);
      if (evalData) {
        // Mate threat bonus
        if (evalData.type === "mate") priority += 200;
        // Balanced position bonus
        if (evalData.type === "cp" && Math.abs(evalData.value) < 100) priority += 50;
        // Eval swing bonus
        if (evalData.prevEval && evalData.prevEval.type === "cp" && evalData.type === "cp") {
          priority += Math.min(Math.abs(evalData.value - evalData.prevEval.value), 200);
        }
      }

      boards.push({ boardNum, priority });
    });
    return boards.sort((a, b) => b.priority - a.priority);
  }, [games, evals]);

  const cycleNext = useCallback(() => {
    cycleCountRef.current++;

    // Show leaderboard every Nth cycle
    if (cycleCountRef.current % leaderboardEveryN === 0) {
      setShowLeaderboard(true);
      setCurrentBoard(null);
      return;
    }

    setShowLeaderboard(false);
    const sorted = getSortedBoards();
    if (sorted.length === 0) return;

    // Pick the next board, avoid repeating the same one
    const next = sorted.find((b) => b.boardNum !== prevBoardRef.current) || sorted[0];
    prevBoardRef.current = next.boardNum;
    setCurrentBoard(next.boardNum);
  }, [getSortedBoards, leaderboardEveryN]);

  useEffect(() => {
    if (!isAutoCycling) {
      clearInterval(timerRef.current);
      return;
    }
    cycleNext();
    timerRef.current = setInterval(cycleNext, intervalSeconds * 1000);
    return () => clearInterval(timerRef.current);
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
