import { useState, useRef, useEffect } from "react";
import useInterval from "./useInterval";

function parseClockToSeconds(clock) {
  if (!clock) return 0;
  const parts = clock.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function secondsToClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/**
 * Client-side clock countdown between server updates.
 * Ticks down the active side's clock at 1s intervals.
 */
export default function useClockCountdown(serverWhiteClock, serverBlackClock, fen, isFinished, enabled) {
  const [whiteSeconds, setWhiteSeconds] = useState(() => parseClockToSeconds(serverWhiteClock));
  const [blackSeconds, setBlackSeconds] = useState(() => parseClockToSeconds(serverBlackClock));
  const lastUpdateRef = useRef(Date.now());

  // Determine side to move from FEN
  const parts = fen ? fen.split(" ") : [];
  const whiteToMove = (parts[1] || "w") === "w";

  // Reset on server update
  useEffect(() => {
    setWhiteSeconds(parseClockToSeconds(serverWhiteClock));
    setBlackSeconds(parseClockToSeconds(serverBlackClock));
    lastUpdateRef.current = Date.now();
  }, [serverWhiteClock, serverBlackClock]);

  // Tick every second
  useInterval(
    () => {
      if (isFinished || !enabled) return;
      if (whiteToMove) {
        setWhiteSeconds((s) => Math.max(0, s - 1));
      } else {
        setBlackSeconds((s) => Math.max(0, s - 1));
      }
    },
    enabled && !isFinished ? 1000 : null,
  );

  return {
    whiteClock: secondsToClock(whiteSeconds),
    blackClock: secondsToClock(blackSeconds),
    whiteActive: whiteToMove && !isFinished,
    blackActive: !whiteToMove && !isFinished,
  };
}
