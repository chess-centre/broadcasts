import { useState, useRef, useEffect } from "react";
import { useInterval } from "./use-interval";

function parseClockToSeconds(clock: string): number {
  if (!clock) return 0;
  const parts = clock.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function secondsToClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function useClockCountdown(
  serverWhiteClock: string,
  serverBlackClock: string,
  fen: string | undefined,
  isFinished: boolean,
  enabled: boolean
) {
  const [whiteSeconds, setWhiteSeconds] = useState(() =>
    parseClockToSeconds(serverWhiteClock)
  );
  const [blackSeconds, setBlackSeconds] = useState(() =>
    parseClockToSeconds(serverBlackClock)
  );
  const lastUpdateRef = useRef(Date.now());

  const parts = fen ? fen.split(" ") : [];
  const whiteToMove = (parts[1] || "w") === "w";

  useEffect(() => {
    setWhiteSeconds(parseClockToSeconds(serverWhiteClock));
    setBlackSeconds(parseClockToSeconds(serverBlackClock));
    lastUpdateRef.current = Date.now();
  }, [serverWhiteClock, serverBlackClock]);

  useInterval(
    () => {
      if (isFinished || !enabled) return;
      if (whiteToMove) {
        setWhiteSeconds((s) => Math.max(0, s - 1));
      } else {
        setBlackSeconds((s) => Math.max(0, s - 1));
      }
    },
    enabled && !isFinished ? 1000 : null
  );

  return {
    whiteClock: secondsToClock(whiteSeconds),
    blackClock: secondsToClock(blackSeconds),
    whiteActive: whiteToMove && !isFinished,
    blackActive: !whiteToMove && !isFinished,
  };
}
