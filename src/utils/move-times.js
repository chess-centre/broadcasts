/**
 * Extract time spent per move from PGN clock annotations.
 * PGN has [%clk H:MM:SS] after each move. Clocks alternate white/black.
 * Time spent = previousClock - currentClock for the same color.
 *
 * @param {string} pgn - Raw PGN string with [%clk] annotations
 * @returns {{ white: number[], black: number[] }} Arrays of seconds spent per move
 */
export function extractMoveTimes(pgn) {
  if (!pgn) return { white: [], black: [] };

  const clockRegex = /\[%clk\s+(\d+:\d+:\d+)\]/g;
  const allClocks = [];
  let match;
  while ((match = clockRegex.exec(pgn)) !== null) {
    allClocks.push(parseClockString(match[1]));
  }

  // Clocks alternate: white[0], black[0], white[1], black[1], ...
  const whiteClocks = allClocks.filter((_, i) => i % 2 === 0);
  const blackClocks = allClocks.filter((_, i) => i % 2 === 1);

  const whiteTimes = [];
  for (let i = 1; i < whiteClocks.length; i++) {
    const spent = whiteClocks[i - 1] - whiteClocks[i];
    whiteTimes.push(Math.max(0, spent));
  }

  const blackTimes = [];
  for (let i = 1; i < blackClocks.length; i++) {
    const spent = blackClocks[i - 1] - blackClocks[i];
    blackTimes.push(Math.max(0, spent));
  }

  return { white: whiteTimes, black: blackTimes };
}

function parseClockString(clock) {
  const parts = clock.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

export function formatTime(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${seconds}s`;
}
