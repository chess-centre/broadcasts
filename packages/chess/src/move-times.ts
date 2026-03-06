export function extractMoveTimes(pgn: string): {
  white: number[];
  black: number[];
} {
  if (!pgn) return { white: [], black: [] };

  const clockRegex = /\[%clk\s+(\d+:\d+:\d+)\]/g;
  const allClocks: number[] = [];
  let match;

  while ((match = clockRegex.exec(pgn)) !== null) {
    allClocks.push(parseClockString(match[1]));
  }

  const whiteClocks = allClocks.filter((_, i) => i % 2 === 0);
  const blackClocks = allClocks.filter((_, i) => i % 2 === 1);

  const whiteTimes: number[] = [];
  for (let i = 1; i < whiteClocks.length; i++) {
    whiteTimes.push(Math.max(0, whiteClocks[i - 1] - whiteClocks[i]));
  }

  const blackTimes: number[] = [];
  for (let i = 1; i < blackClocks.length; i++) {
    blackTimes.push(Math.max(0, blackClocks[i - 1] - blackClocks[i]));
  }

  return { white: whiteTimes, black: blackTimes };
}

function parseClockString(clock: string): number {
  const parts = clock.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export function formatTime(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${seconds}s`;
}
